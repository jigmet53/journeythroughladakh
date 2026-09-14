import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import type { Request } from 'express';
import { RedisService } from '../../redis/redis.service';

const MAX_ATTEMPTS = 5;
const WINDOW_SECONDS = 900; // 15 min

/** Applied to POST /auth/login only — mirrors the previous loginRateLimiter middleware. */
@Injectable()
export class LoginThrottleGuard implements CanActivate {
  constructor(private readonly redis: RedisService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const identifier: string = req.body?.email || req.ip || 'unknown';

    const { allowed } = await this.redis.trackLoginAttempt(identifier, MAX_ATTEMPTS, WINDOW_SECONDS);
    if (!allowed) {
      throw new HttpException(
        'Too many login attempts. Please try again later.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
    return true;
  }
}
