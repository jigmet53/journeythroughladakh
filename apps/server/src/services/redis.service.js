const { getRedisClient, isRedisReady } = require('../config/redis');

/**
 * Redis Service for Authentication & Caching
 * Provides token blacklist, session cache, and rate limiting
 */

// ============================================================================
// TOKEN BLACKLIST - For revoked/logged out tokens
// ============================================================================

/**
 * Add access token to blacklist (when user logs out)
 * Token remains blacklisted until it naturally expires
 */
const blacklistToken = async (token, expiresIn = 900) => {
  // expiresIn in seconds (default 15 minutes = 900 seconds)
  try {
    const redis = getRedisClient();
    if (!isRedisReady()) return false;

    const key = `blacklist:${token}`;
    await redis.setex(key, expiresIn, 'revoked');
    return true;
  } catch (error) {
    console.error('Redis blacklistToken error:', error);
    return false;
  }
};

/**
 * Check if access token is blacklisted
 */
const isTokenBlacklisted = async (token) => {
  try {
    const redis = getRedisClient();
    if (!isRedisReady()) return false; // If Redis down, allow (graceful degradation)

    const key = `blacklist:${token}`;
    const result = await redis.get(key);
    return result === 'revoked';
  } catch (error) {
    console.error('Redis isTokenBlacklisted error:', error);
    return false; // On error, don't block legitimate users
  }
};

/**
 * Blacklist all tokens for a user (logout from all devices)
 * Stores user ID in blacklist for a duration
 */
const blacklistUserTokens = async (userId, expiresIn = 900) => {
  try {
    const redis = getRedisClient();
    if (!isRedisReady()) return false;

    const key = `blacklist:user:${userId}`;
    await redis.setex(key, expiresIn, 'all_revoked');
    return true;
  } catch (error) {
    console.error('Redis blacklistUserTokens error:', error);
    return false;
  }
};

/**
 * Check if all user tokens are blacklisted
 */
const areUserTokensBlacklisted = async (userId) => {
  try {
    const redis = getRedisClient();
    if (!isRedisReady()) return false;

    const key = `blacklist:user:${userId}`;
    const result = await redis.get(key);
    return result === 'all_revoked';
  } catch (error) {
    console.error('Redis areUserTokensBlacklisted error:', error);
    return false;
  }
};

// ============================================================================
// SESSION CACHE - For active user sessions
// ============================================================================

/**
 * Cache user session data (reduces DB queries by 80-90%)
 */
const cacheSession = async (userId, userData, expiresIn = 900) => {
  try {
    const redis = getRedisClient();
    if (!isRedisReady()) return false;

    const key = `session:${userId}`;
    await redis.setex(key, expiresIn, JSON.stringify(userData));
    return true;
  } catch (error) {
    console.error('Redis cacheSession error:', error);
    return false;
  }
};

/**
 * Get cached session data
 */
const getSession = async (userId) => {
  try {
    const redis = getRedisClient();
    if (!isRedisReady()) return null;

    const key = `session:${userId}`;
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Redis getSession error:', error);
    return null;
  }
};

/**
 * Delete session from cache (on logout)
 */
const deleteSession = async (userId) => {
  try {
    const redis = getRedisClient();
    if (!isRedisReady()) return false;

    const key = `session:${userId}`;
    await redis.del(key);
    return true;
  } catch (error) {
    console.error('Redis deleteSession error:', error);
    return false;
  }
};

/**
 * Update session data (e.g., after profile update)
 */
const updateSession = async (userId, userData, expiresIn = 900) => {
  return await cacheSession(userId, userData, expiresIn);
};

// ============================================================================
// RATE LIMITING - Prevent brute force attacks
// ============================================================================

/**
 * Track login attempts for rate limiting
 * Returns { allowed: boolean, remaining: number, resetTime: number }
 */
const trackLoginAttempt = async (identifier, maxAttempts = 5, windowSeconds = 900) => {
  // identifier can be email or IP address
  try {
    const redis = getRedisClient();
    if (!isRedisReady()) {
      return { allowed: true, remaining: maxAttempts, resetTime: 0 };
    }

    const key = `ratelimit:login:${identifier}`;
    
    // Increment attempt counter
    const attempts = await redis.incr(key);
    
    // Set expiry on first attempt
    if (attempts === 1) {
      await redis.expire(key, windowSeconds);
    }
    
    // Get TTL
    const ttl = await redis.ttl(key);
    const resetTime = Date.now() + (ttl * 1000);
    
    const remaining = Math.max(0, maxAttempts - attempts);
    const allowed = attempts <= maxAttempts;
    
    return {
      allowed,
      remaining,
      resetTime,
      attempts,
    };
  } catch (error) {
    console.error('Redis trackLoginAttempt error:', error);
    return { allowed: true, remaining: maxAttempts, resetTime: 0 };
  }
};

/**
 * Reset login attempts (after successful login)
 */
const resetLoginAttempts = async (identifier) => {
  try {
    const redis = getRedisClient();
    if (!isRedisReady()) return false;

    const key = `ratelimit:login:${identifier}`;
    await redis.del(key);
    return true;
  } catch (error) {
    console.error('Redis resetLoginAttempts error:', error);
    return false;
  }
};

/**
 * Get current login attempts count
 */
const getLoginAttempts = async (identifier) => {
  try {
    const redis = getRedisClient();
    if (!isRedisReady()) return 0;

    const key = `ratelimit:login:${identifier}`;
    const attempts = await redis.get(key);
    return parseInt(attempts) || 0;
  } catch (error) {
    console.error('Redis getLoginAttempts error:', error);
    return 0;
  }
};

// ============================================================================
// ACTIVE SESSIONS MONITORING
// ============================================================================

/**
 * Get all active sessions for a user
 */
const getActiveSessions = async (userId) => {
  try {
    const redis = getRedisClient();
    if (!isRedisReady()) return [];

    const pattern = `session:${userId}*`;
    const keys = await redis.keys(pattern);
    return keys.length;
  } catch (error) {
    console.error('Redis getActiveSessions error:', error);
    return 0;
  }
};

/**
 * Get total active sessions count (all users)
 */
const getTotalActiveSessions = async () => {
  try {
    const redis = getRedisClient();
    if (!isRedisReady()) return 0;

    const keys = await redis.keys('session:*');
    return keys.length;
  } catch (error) {
    console.error('Redis getTotalActiveSessions error:', error);
    return 0;
  }
};

// ============================================================================
// CACHE GENERAL DATA - For tour packages, rentals, etc.
// ============================================================================

/**
 * Generic cache setter
 */
const setCacheData = async (key, data, expiresIn = 3600) => {
  try {
    const redis = getRedisClient();
    if (!isRedisReady()) return false;

    await redis.setex(key, expiresIn, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Redis setCacheData error:', error);
    return false;
  }
};

/**
 * Generic cache getter
 */
const getCacheData = async (key) => {
  try {
    const redis = getRedisClient();
    if (!isRedisReady()) return null;

    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Redis getCacheData error:', error);
    return null;
  }
};

/**
 * Delete cache by key
 */
const deleteCacheData = async (key) => {
  try {
    const redis = getRedisClient();
    if (!isRedisReady()) return false;

    await redis.del(key);
    return true;
  } catch (error) {
    console.error('Redis deleteCacheData error:', error);
    return false;
  }
};

/**
 * Delete cache by pattern (e.g., 'tours:*')
 */
const deleteCacheByPattern = async (pattern) => {
  try {
    const redis = getRedisClient();
    if (!isRedisReady()) return false;

    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
    return true;
  } catch (error) {
    console.error('Redis deleteCacheByPattern error:', error);
    return false;
  }
};

// ============================================================================
// HEALTH CHECK
// ============================================================================

/**
 * Test Redis connection
 */
const ping = async () => {
  try {
    const redis = getRedisClient();
    if (!isRedisReady()) return false;

    const result = await redis.ping();
    return result === 'PONG';
  } catch (error) {
    console.error('Redis ping error:', error);
    return false;
  }
};

/**
 * Get Redis info/stats
 */
const getRedisStats = async () => {
  try {
    const redis = getRedisClient();
    if (!isRedisReady()) {
      return { connected: false };
    }

    const info = await redis.info('stats');
    const dbSize = await redis.dbsize();
    
    return {
      connected: true,
      dbSize,
      status: redis.status,
      info,
    };
  } catch (error) {
    console.error('Redis getRedisStats error:', error);
    return { connected: false, error: error.message };
  }
};

module.exports = {
  // Token Blacklist
  blacklistToken,
  isTokenBlacklisted,
  blacklistUserTokens,
  areUserTokensBlacklisted,
  
  // Session Cache
  cacheSession,
  getSession,
  deleteSession,
  updateSession,
  
  // Rate Limiting
  trackLoginAttempt,
  resetLoginAttempts,
  getLoginAttempts,
  
  // Active Sessions
  getActiveSessions,
  getTotalActiveSessions,
  
  // Generic Cache
  setCacheData,
  getCacheData,
  deleteCacheData,
  deleteCacheByPattern,
  
  // Health
  ping,
  getRedisStats,
};
