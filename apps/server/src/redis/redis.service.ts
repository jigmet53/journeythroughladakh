import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

/**
 * Redis-backed token blacklist, session cache and login rate limiting.
 * Ported from the previous Express server's redis.service.js — same key
 * shapes and TTLs, reimplemented as a Nest provider. Every method fails
 * open (never blocks a legitimate request) if Redis is unreachable.
 */
@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private client: Redis | null = null;

  constructor(private readonly config: ConfigService) {}

  onModuleInit() {
    this.client = new Redis({
      host: this.config.get<string>('REDIS_HOST', 'localhost'),
      port: this.config.get<number>('REDIS_PORT', 6379),
      password: this.config.get<string>('REDIS_PASSWORD') || undefined,
      retryStrategy: (times) => Math.min(times * 50, 2000),
      maxRetriesPerRequest: 3,
      lazyConnect: false,
    });

    this.client.on('connect', () => this.logger.log('Redis connected'));
    this.client.on('ready', () => this.logger.log('Redis ready'));
    this.client.on('reconnecting', () => this.logger.warn('Redis reconnecting'));
    this.client.on('error', (err) =>
      this.logger.error(`Redis error (degrading gracefully): ${err.message}`),
    );
  }

  async onModuleDestroy() {
    await this.client?.quit();
  }

  private isReady(): boolean {
    return this.client?.status === 'ready';
  }

  // ---- Token blacklist (instant revocation ahead of natural JWT expiry) ----

  async blacklistToken(token: string, expiresInSeconds = 900): Promise<void> {
    if (!this.isReady()) return;
    try {
      await this.client!.setex(`blacklist:${token}`, expiresInSeconds, 'revoked');
    } catch (err) {
      this.logger.error(`blacklistToken failed: ${(err as Error).message}`);
    }
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    if (!this.isReady()) return false;
    try {
      return (await this.client!.get(`blacklist:${token}`)) === 'revoked';
    } catch (err) {
      this.logger.error(`isTokenBlacklisted failed: ${(err as Error).message}`);
      return false;
    }
  }

  async blacklistUserTokens(userId: string, expiresInSeconds = 900): Promise<void> {
    if (!this.isReady()) return;
    try {
      await this.client!.setex(`blacklist:user:${userId}`, expiresInSeconds, 'all_revoked');
    } catch (err) {
      this.logger.error(`blacklistUserTokens failed: ${(err as Error).message}`);
    }
  }

  async areUserTokensBlacklisted(userId: string): Promise<boolean> {
    if (!this.isReady()) return false;
    try {
      return (await this.client!.get(`blacklist:user:${userId}`)) === 'all_revoked';
    } catch (err) {
      this.logger.error(`areUserTokensBlacklisted failed: ${(err as Error).message}`);
      return false;
    }
  }

  // ---- Session cache (avoids a DB round trip on every authenticated request) ----

  async cacheSession(userId: string, data: unknown, expiresInSeconds = 900): Promise<void> {
    if (!this.isReady()) return;
    try {
      await this.client!.setex(`session:${userId}`, expiresInSeconds, JSON.stringify(data));
    } catch (err) {
      this.logger.error(`cacheSession failed: ${(err as Error).message}`);
    }
  }

  async getSession<T = unknown>(userId: string): Promise<T | null> {
    if (!this.isReady()) return null;
    try {
      const raw = await this.client!.get(`session:${userId}`);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch (err) {
      this.logger.error(`getSession failed: ${(err as Error).message}`);
      return null;
    }
  }

  async deleteSession(userId: string): Promise<void> {
    if (!this.isReady()) return;
    try {
      await this.client!.del(`session:${userId}`);
    } catch (err) {
      this.logger.error(`deleteSession failed: ${(err as Error).message}`);
    }
  }

  // ---- Login attempt rate limiting ----

  async trackLoginAttempt(
    identifier: string,
    maxAttempts = 5,
    windowSeconds = 900,
  ): Promise<{ allowed: boolean; remaining: number }> {
    if (!this.isReady()) return { allowed: true, remaining: maxAttempts };
    try {
      const key = `ratelimit:login:${identifier}`;
      const attempts = await this.client!.incr(key);
      if (attempts === 1) await this.client!.expire(key, windowSeconds);
      return { allowed: attempts <= maxAttempts, remaining: Math.max(0, maxAttempts - attempts) };
    } catch (err) {
      this.logger.error(`trackLoginAttempt failed: ${(err as Error).message}`);
      return { allowed: true, remaining: maxAttempts };
    }
  }

  async resetLoginAttempts(identifier: string): Promise<void> {
    if (!this.isReady()) return;
    try {
      await this.client!.del(`ratelimit:login:${identifier}`);
    } catch (err) {
      this.logger.error(`resetLoginAttempts failed: ${(err as Error).message}`);
    }
  }

  // ---- Generic cache (search results, destination reads, etc. — M2+) ----

  async setCache(key: string, data: unknown, expiresInSeconds = 3600): Promise<void> {
    if (!this.isReady()) return;
    try {
      await this.client!.setex(key, expiresInSeconds, JSON.stringify(data));
    } catch (err) {
      this.logger.error(`setCache failed: ${(err as Error).message}`);
    }
  }

  async getCache<T = unknown>(key: string): Promise<T | null> {
    if (!this.isReady()) return null;
    try {
      const raw = await this.client!.get(key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch (err) {
      this.logger.error(`getCache failed: ${(err as Error).message}`);
      return null;
    }
  }

  async deleteCacheByPattern(pattern: string): Promise<void> {
    if (!this.isReady()) return;
    try {
      const keys = await this.client!.keys(pattern);
      if (keys.length > 0) await this.client!.del(...keys);
    } catch (err) {
      this.logger.error(`deleteCacheByPattern failed: ${(err as Error).message}`);
    }
  }

  async ping(): Promise<boolean> {
    if (!this.isReady()) return false;
    try {
      return (await this.client!.ping()) === 'PONG';
    } catch {
      return false;
    }
  }
}
