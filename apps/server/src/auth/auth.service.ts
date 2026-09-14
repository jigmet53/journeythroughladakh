import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import type { AuthenticatedUser, JwtPayload } from './types/authenticated-user';

const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';
const REFRESH_TOKEN_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000;
const SESSION_TTL_SECONDS = 900;

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface DeviceInfo {
  userAgent?: string;
  ip?: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  private toPublicUser(user: {
    id: string;
    username: string;
    email: string;
    role: AuthenticatedUser['role'];
  }) {
    return { id: user.id, username: user.username, email: user.email, role: user.role };
  }

  private signAccessToken(payload: JwtPayload): string {
    return this.jwt.sign(payload, {
      secret: this.config.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: ACCESS_TOKEN_EXPIRY,
    });
  }

  private signRefreshToken(payload: JwtPayload): string {
    return this.jwt.sign(payload, {
      secret: this.config.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: REFRESH_TOKEN_EXPIRY,
    });
  }

  private async issueTokenPair(
    userId: string,
    role: JwtPayload['role'],
    device: DeviceInfo,
  ): Promise<TokenPair> {
    const accessToken = this.signAccessToken({ id: userId, role, jti: randomUUID() });
    const refreshToken = this.signRefreshToken({ id: userId, role, jti: randomUUID() });

    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId,
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS),
        userAgent: device.userAgent,
        ip: device.ip,
      },
    });

    return { accessToken, refreshToken };
  }

  async register(dto: RegisterDto, device: DeviceInfo) {
    const existing = await this.prisma.user.findFirst({
      where: { OR: [{ email: dto.email }, { username: dto.username }] },
    });
    if (existing) {
      throw new ConflictException(
        existing.email === dto.email ? 'Email already registered' : 'Username already taken',
      );
    }

    const hashed = await bcrypt.hash(dto.password, 12);
    const user = await this.prisma.user.create({
      data: { username: dto.username, email: dto.email, password: hashed },
    });

    const tokens = await this.issueTokenPair(user.id, user.role, device);
    return { ...tokens, user: this.toPublicUser(user) };
  }

  async login(dto: LoginDto, device: DeviceInfo) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated. Please contact support.');
    }

    const passwordMatches = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatches) throw new UnauthorizedException('Invalid credentials');

    const tokens = await this.issueTokenPair(user.id, user.role, device);

    await this.redis.cacheSession(
      user.id,
      { id: user.id, username: user.username, email: user.email, role: user.role, isActive: user.isActive },
      SESSION_TTL_SECONDS,
    );
    await this.redis.resetLoginAttempts(dto.email);

    return { ...tokens, user: this.toPublicUser(user) };
  }

  /** Rotate-on-use with reuse detection: a missing/expired token doc revokes every session. */
  async refresh(oldRefreshToken: string | undefined, device: DeviceInfo) {
    if (!oldRefreshToken) {
      throw new UnauthorizedException('No refresh token provided');
    }

    let payload: JwtPayload;
    try {
      payload = this.jwt.verify<JwtPayload>(oldRefreshToken, {
        secret: this.config.get<string>('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const tokenDoc = await this.prisma.refreshToken.findUnique({
      where: { token: oldRefreshToken },
    });

    if (
      !tokenDoc ||
      tokenDoc.userId !== payload.id ||
      tokenDoc.revoked ||
      tokenDoc.expiresAt < new Date()
    ) {
      await this.revokeAllUserTokens(payload.id);
      throw new UnauthorizedException(
        'Invalid or expired refresh token. Please login again.',
      );
    }

    const user = await this.prisma.user.findUnique({ where: { id: payload.id } });
    if (!user || !user.isActive) {
      throw new UnauthorizedException('User not found or inactive');
    }

    await this.prisma.refreshToken.update({
      where: { id: tokenDoc.id },
      data: { revoked: true },
    });

    const tokens = await this.issueTokenPair(user.id, user.role, device);
    return { accessToken: tokens.accessToken, refreshToken: tokens.refreshToken };
  }

  async logout(accessToken: string | undefined, refreshToken: string | undefined, userId: string) {
    if (refreshToken) {
      await this.prisma.refreshToken.updateMany({
        where: { token: refreshToken },
        data: { revoked: true },
      });
    }
    if (accessToken) {
      await this.redis.blacklistToken(accessToken, 900);
    }
    await this.redis.deleteSession(userId);
  }

  async logoutAll(userId: string) {
    await this.revokeAllUserTokens(userId);
    await this.redis.blacklistUserTokens(userId, 900);
    await this.redis.deleteSession(userId);
  }

  private async revokeAllUserTokens(userId: string) {
    await this.prisma.refreshToken.updateMany({
      where: { userId, revoked: false },
      data: { revoked: true },
    });
  }

  async me(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('User not found');
    return this.toPublicUser(user);
  }

  /** Revokes every existing session — matches the old server's behavior of
   * forcing re-login everywhere after a password change. */
  async updatePassword(userId: string, currentPassword: string, newPassword: string, device: DeviceInfo) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('User not found');

    const matches = await bcrypt.compare(currentPassword, user.password);
    if (!matches) throw new UnauthorizedException('Current password is incorrect');

    const hashed = await bcrypt.hash(newPassword, 12);
    await this.prisma.user.update({ where: { id: userId }, data: { password: hashed } });

    await this.revokeAllUserTokens(userId);
    await this.redis.deleteSession(userId);

    const tokens = await this.issueTokenPair(user.id, user.role, device);
    return tokens;
  }
}
