const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const { isTokenBlacklisted, areUserTokensBlacklisted, getSession } = require("../services/redis.service");

// Protect routes - verify JWT token
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Check if token exists in headers
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to access this route. Please login.",
      });
    }

    try {
      // Verify access token (short-lived)
      const decoded = jwt.verify(
        token,
        process.env.JWT_ACCESS_SECRET || "access-secret-key-change-in-production"
      );

      // REDIS CHECK 1: Check if token is blacklisted (instant logout)
      const isBlacklisted = await isTokenBlacklisted(token);
      if (isBlacklisted) {
        return res.status(401).json({
          success: false,
          message: "Token has been revoked. Please login again.",
        });
      }

      // REDIS CHECK 2: Check if all user tokens are blacklisted (logout from all devices)
      const userBlacklisted = await areUserTokensBlacklisted(decoded.id);
      if (userBlacklisted) {
        return res.status(401).json({
          success: false,
          message: "Session expired. Please login again.",
        });
      }

      // REDIS CHECK 3: Try to get user from session cache (90% faster!)
      let user = await getSession(decoded.id);
      
      if (!user) {
        // Cache miss - query database
        user = await User.findById(decoded.id);

        if (!user) {
          return res.status(401).json({
            success: false,
            message: "User not found. Token invalid.",
          });
        }

        // Cache user session for future requests (15 min TTL)
        const { cacheSession } = require("../services/redis.service");
        await cacheSession(decoded.id, {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
        }, 900);
      }

      // Check if user is active
      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          message: "Account is deactivated. Please contact support.",
        });
      }

      // Attach user to request object
      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. Token is invalid or expired.",
      });
    }
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({
      success: false,
      message: "Server error in authentication",
      error: error.message,
    });
  }
};

// Authorize specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. Please login first.",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route`,
      });
    }

    next();
  };
};
