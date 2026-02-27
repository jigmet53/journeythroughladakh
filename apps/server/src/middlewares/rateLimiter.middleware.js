const { trackLoginAttempt } = require('../services/redis.service');

/**
 * Rate Limiter Middleware for Login Attempts
 * Prevents brute force attacks by limiting login attempts
 */
const loginRateLimiter = async (req, res, next) => {
  try {
    const { email } = req.body;
    const ip = req.ip || req.connection.remoteAddress;
    
    // Use email as primary identifier, fallback to IP
    const identifier = email || ip;
    
    // Check rate limit (5 attempts per 15 minutes)
    const rateLimit = await trackLoginAttempt(identifier, 5, 900);
    
    if (!rateLimit.allowed) {
      const resetDate = new Date(rateLimit.resetTime);
      const minutesLeft = Math.ceil((rateLimit.resetTime - Date.now()) / 60000);
      
      return res.status(429).json({
        success: false,
        message: `Too many login attempts. Please try again in ${minutesLeft} minutes.`,
        retryAfter: resetDate.toISOString(),
        attemptsRemaining: 0,
      });
    }
    
    // Add rate limit info to request for later use
    req.rateLimit = rateLimit;
    
    // Add rate limit headers
    res.set({
      'X-RateLimit-Limit': '5',
      'X-RateLimit-Remaining': rateLimit.remaining.toString(),
      'X-RateLimit-Reset': new Date(rateLimit.resetTime).toISOString(),
    });
    
    next();
  } catch (error) {
    console.error('Rate limiter error:', error);
    // On error, allow request (graceful degradation)
    next();
  }
};

/**
 * General API rate limiter
 * Can be applied to any endpoint
 */
const apiRateLimiter = (maxRequests = 100, windowSeconds = 60) => {
  return async (req, res, next) => {
    try {
      const ip = req.ip || req.connection.remoteAddress;
      const identifier = `api:${ip}:${req.path}`;
      
      const rateLimit = await trackLoginAttempt(identifier, maxRequests, windowSeconds);
      
      if (!rateLimit.allowed) {
        return res.status(429).json({
          success: false,
          message: 'Too many requests. Please slow down.',
          retryAfter: new Date(rateLimit.resetTime).toISOString(),
        });
      }
      
      // Add rate limit headers
      res.set({
        'X-RateLimit-Limit': maxRequests.toString(),
        'X-RateLimit-Remaining': rateLimit.remaining.toString(),
        'X-RateLimit-Reset': new Date(rateLimit.resetTime).toISOString(),
      });
      
      next();
    } catch (error) {
      console.error('API rate limiter error:', error);
      next();
    }
  };
};

module.exports = {
  loginRateLimiter,
  apiRateLimiter,
};
