import { Body, Controller, HttpCode, HttpStatus, Post, Get, Req, Res, UseGuards } from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Public } from '../common/decorators/public.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { LoginThrottleGuard } from './guards/login-throttle.guard';
import type { AuthenticatedUser } from './types/authenticated-user';

const REFRESH_COOKIE = 'refreshToken';
const REFRESH_COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private setRefreshCookie(res: Response, token: string) {
    res.cookie(REFRESH_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: REFRESH_COOKIE_MAX_AGE_MS,
    });
  }

  private deviceInfo(req: Request) {
    return { userAgent: req.get('user-agent') ?? undefined, ip: req.ip };
  }

  @Public()
  @Post('register')
  async register(@Body() dto: RegisterDto, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const { accessToken, refreshToken, user } = await this.authService.register(dto, this.deviceInfo(req));
    this.setRefreshCookie(res, refreshToken);
    return { success: true, message: 'User registered successfully', accessToken, user };
  }

  @Public()
  @UseGuards(LoginThrottleGuard)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() dto: LoginDto, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const { accessToken, refreshToken, user } = await this.authService.login(dto, this.deviceInfo(req));
    this.setRefreshCookie(res, refreshToken);
    return { success: true, message: 'Login successful', accessToken, user };
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const { accessToken, refreshToken } = await this.authService.refresh(
      req.cookies?.[REFRESH_COOKIE],
      this.deviceInfo(req),
    );
    this.setRefreshCookie(res, refreshToken);
    return { success: true, accessToken };
  }

  @Get('me')
  async me(@CurrentUser() user: AuthenticatedUser) {
    return { success: true, user: await this.authService.me(user.id) };
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(
    @CurrentUser() user: AuthenticatedUser,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const accessToken = req.headers.authorization?.split(' ')[1];
    await this.authService.logout(accessToken, req.cookies?.[REFRESH_COOKIE], user.id);
    res.clearCookie(REFRESH_COOKIE);
    return { success: true, message: 'Logged out successfully' };
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout-all')
  async logoutAll(@CurrentUser() user: AuthenticatedUser, @Res({ passthrough: true }) res: Response) {
    await this.authService.logoutAll(user.id);
    res.clearCookie(REFRESH_COOKIE);
    return { success: true, message: 'Logged out from all devices successfully' };
  }
}
