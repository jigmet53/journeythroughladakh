const Redis = require('ioredis');

// Redis client instance
let redisClient = null;

/**
 * Connect to Redis
 * Uses ioredis for better performance and features
 */
const connectRedis = () => {
  try {
    const redisConfig = {
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || 6379,
      password: process.env.REDIS_PASSWORD || undefined,
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      maxRetriesPerRequest: 3,
    };

    redisClient = new Redis(redisConfig);

    // Event: Connected
    redisClient.on('connect', () => {
      console.log('✅ Redis: Connected successfully');
    });

    // Event: Ready
    redisClient.on('ready', () => {
      console.log('🚀 Redis: Ready to accept commands');
    });

    // Event: Error
    redisClient.on('error', (error) => {
      console.error('❌ Redis Error:', error.message);
      // Don't crash the server if Redis fails
      // Graceful degradation - app continues without caching
    });

    // Event: Reconnecting
    redisClient.on('reconnecting', () => {
      console.log('🔄 Redis: Reconnecting...');
    });

    // Event: Connection closed
    redisClient.on('close', () => {
      console.log('🔌 Redis: Connection closed');
    });

    return redisClient;
  } catch (error) {
    console.error('❌ Redis connection failed:', error.message);
    console.log('⚠️  Application will run without Redis caching');
    return null;
  }
};

/**
 * Get Redis client instance
 */
const getRedisClient = () => {
  if (!redisClient) {
    console.warn('⚠️  Redis client not initialized');
  }
  return redisClient;
};

/**
 * Check if Redis is connected and ready
 */
const isRedisReady = () => {
  return redisClient && redisClient.status === 'ready';
};

/**
 * Close Redis connection gracefully
 */
const disconnectRedis = async () => {
  if (redisClient) {
    await redisClient.quit();
    console.log('👋 Redis: Disconnected gracefully');
  }
};

module.exports = {
  connectRedis,
  getRedisClient,
  isRedisReady,
  disconnectRedis,
};
