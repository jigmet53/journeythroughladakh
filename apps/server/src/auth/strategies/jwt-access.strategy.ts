import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { Request } from 'express';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../redis/redis.service';
import type { AuthenticatedUser, JwtPayload } from '../types/authenticated-user';

const SESSION_TTL_SECONDS = 900; // 15 min, matches the access token lifetime

/**
 * Ports the previous Express `protect` middleware's exact check order:
 * verify signature -> per-token blacklist -> per-user blacklist (logout-all)
 * -> session cache (DB fallback + cache-fill) -> isActive check.
 */
@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    config: ConfigService,
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_ACCESS_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload): Promise<AuthenticatedUser> {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req) as string;

    if (await this.redis.isTokenBlacklisted(token)) {
      throw new UnauthorizedException('Token has been revoked. Please login again.');
    }
    if (await this.redis.areUserTokensBlacklisted(payload.id)) {
      throw new UnauthorizedException('Session expired. Please login again.');
    }

    let user = await this.redis.getSession<AuthenticatedUser>(payload.id);
    if (!user) {
      const dbUser = await this.prisma.user.findUnique({ where: { id: payload.id } });
      if (!dbUser) {
        throw new UnauthorizedException('User not found. Token invalid.');
      }
      user = {
        id: dbUser.id,
        username: dbUser.username,
        email: dbUser.email,
        role: dbUser.role,
        isActive: dbUser.isActive,
      };
      await this.redis.cacheSession(payload.id, user, SESSION_TTL_SECONDS);
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated. Please contact support.');
    }

    return user;
  }
}
