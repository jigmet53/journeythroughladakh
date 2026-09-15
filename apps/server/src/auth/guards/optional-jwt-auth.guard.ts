import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/** Like JwtAuthGuard but never rejects — attaches req.user when a valid
 * token is present, otherwise leaves it undefined. Used for endpoints that
 * behave differently for owners vs. anonymous visitors (e.g. a shared
 * itinerary link) rather than requiring auth outright. */
@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context) as Promise<boolean>;
  }

  handleRequest<TUser = unknown>(_err: unknown, user: unknown): TUser {
    // passport-jwt calls back with `user: false` (not null/undefined) when no
    // token is present, so `||` (not `??`) is needed to normalize it away.
    return (user || undefined) as TUser;
  }
}
