import { Role } from '@prisma/client';

export interface AuthenticatedUser {
  id: string;
  username: string;
  email: string;
  role: Role;
  isActive: boolean;
}

export interface JwtPayload {
  id: string;
  role: Role;
  /** Unique per signed token — without this, two tokens signed for the same
   * user within the same second are byte-identical (JWT `iat` has 1s
   * resolution), which collides on the refresh_tokens.token unique index. */
  jti: string;
}
