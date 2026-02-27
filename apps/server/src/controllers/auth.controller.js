const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const { RefreshTokenModel } = require("../models/RefreshToken.model");
const { 
  cacheSession, 
  deleteSession, 
  blacklistToken,
  blacklistUserTokens,
  resetLoginAttempts 
} = require("../services/redis.service");

// Environment variables
const ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_SECRET || 'access-secret-key-change-in-production';
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh-secret-key-change-in-production';
const ACCESS_TOKEN_EXPIRY = '15m'; // 15 minutes - short-lived for security
const REFRESH_TOKEN_EXPIRY = '7d'; // 7 days

// Generate Access Token (Short-lived, stored in memory)
const generateAccessToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    ACCESS_TOKEN_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );
};

// Generate Refresh Token (Long-lived, stored in HTTP-only cookie)
const generateRefreshToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    REFRESH_TOKEN_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  );
};

// Set HTTP-only cookie for refresh token (XSS Protection)
const setRefreshTokenCookie = (res, token) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,      // Cannot be accessed by JavaScript - prevents XSS attacks
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    sameSite: 'strict',  // CSRF protection
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide username, email, and password",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: existingUser.email === email 
          ? "Email already registered" 
          : "Username already taken",
      });
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password,
      role: role || "user",
    });

    // Generate tokens
    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id, user.role);

    // Store refresh token in database
    await RefreshTokenModel.create({
      token: refreshToken,
      user: user._id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      deviceInfo: {
        userAgent: req.get('user-agent'),
        ip: req.ip
      }
    });

    // Set HTTP-only cookie
    setRefreshTokenCookie(res, refreshToken);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      accessToken, // Sent to client - will be stored in memory (NOT localStorage)
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({
      success: false,
      message: "Error registering user",
      error: error.message,
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // Find user by email and include password field
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Account is deactivated. Please contact support.",
      });
    }

    // Check password
    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id, user.role);

    // Store refresh token in database
    await RefreshTokenModel.create({
      token: refreshToken,
      user: user._id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      deviceInfo: {
        userAgent: req.get('user-agent'),
        ip: req.ip
      }
    });

    // Set HTTP-only cookie
    setRefreshTokenCookie(res, refreshToken);

    // REDIS: Cache user session (reduces DB queries by 90%)
    await cacheSession(user._id, {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    }, 900); // 15 min TTL

    // REDIS: Reset login attempts on successful login
    await resetLoginAttempts(email);

    res.status(200).json({
      success: true,
      message: "Login successful",
      accessToken, // Sent to client - will be stored in memory (NOT localStorage)
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Error logging in",
      error: error.message,
    });
  }
};

// @desc    Refresh access token (Token Rotation)
// @route   POST /api/auth/refresh
// @access  Public (but requires valid refresh token in cookie)
exports.refresh = async (req, res) => {
  try {
    // Get refresh token from HTTP-only cookie
    const oldRefreshToken = req.cookies.refreshToken;

    if (!oldRefreshToken) {
      return res.status(401).json({ 
        success: false, 
        message: 'No refresh token provided' 
      });
    }

    // Verify refresh token
    let decoded;
    try {
      decoded = jwt.verify(oldRefreshToken, REFRESH_TOKEN_SECRET);
    } catch (error) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid or expired refresh token' 
      });
    }

    // Check if token exists in database and is not revoked
    const tokenDoc = await RefreshTokenModel.findOne({
      token: oldRefreshToken,
      user: decoded.id,
      revoked: false
    });

    if (!tokenDoc || tokenDoc.expiresAt < new Date()) {
      // Possible token theft detected - revoke all user tokens for security
      await RefreshTokenModel.revokeAllUserTokens(decoded.id);
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid or expired refresh token. Please login again.' 
      });
    }

    // Get user to include role in new token
    const user = await User.findById(decoded.id);
    if (!user || !user.isActive) {
      return res.status(401).json({ 
        success: false, 
        message: 'User not found or inactive' 
      });
    }

    // Generate NEW tokens (Token Rotation for enhanced security)
    const newAccessToken = generateAccessToken(user._id, user.role);
    const newRefreshToken = generateRefreshToken(user._id, user.role);

    // Revoke old refresh token (Token Rotation)
    tokenDoc.revoked = true;
    await tokenDoc.save();

    // Store new refresh token in database
    await RefreshTokenModel.create({
      token: newRefreshToken,
      user: user._id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      deviceInfo: {
        userAgent: req.get('user-agent'),
        ip: req.ip
      }
    });

    // Set new HTTP-only cookie
    setRefreshTokenCookie(res, newRefreshToken);

    res.json({
      success: true,
      accessToken: newAccessToken
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(401).json({ 
      success: false, 
      message: 'Token refresh failed', 
      error: error.message 
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Get me error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching user data",
      error: error.message,
    });
  }
};

// @desc    Logout user (Revoke refresh token)
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    const userId = req.user.id;

    if (refreshToken) {
      // Revoke refresh token in database
      await RefreshTokenModel.findOneAndUpdate(
        { token: refreshToken },
        { revoked: true }
      );
    }

    // REDIS: Delete user session from cache
    await deleteSession(userId);

    // Clear HTTP-only cookie
    res.clearCookie('refreshToken');

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Error logging out",
      error: error.message,
    });
  }
};

// @desc    Logout from all devices
// @route   POST /api/auth/logout-all
// @access  Private
exports.logoutAll = async (req, res) => {
  try {
    const userId = req.user.id;

    // Revoke all refresh tokens for this user
    await RefreshTokenModel.revokeAllUserTokens(userId);

    // REDIS: Blacklist all user tokens for 15 minutes (access token duration)
    await blacklistUserTokens(userId, 900);

    // REDIS: Delete user session from cache
    await deleteSession(userId);

    // Clear cookie
    res.clearCookie('refreshToken');

    res.json({
      success: true,
      message: 'Logged out from all devices successfully'
    });
  } catch (error) {
    console.error('Logout all error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error logging out from all devices', 
      error: error.message 
    });
  }
};

// @desc    Update user password
// @route   PUT /api/auth/update-password
// @access  Private
exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide current password and new password",
      });
    }

    // Get user with password
    const user = await User.findById(req.user.id).select("+password");

    // Check current password
    const isPasswordMatch = await user.comparePassword(currentPassword);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    // Revoke all existing refresh tokens (force re-login on all devices for security)
    await RefreshTokenModel.revokeAllUserTokens(user._id);

    // Generate new tokens
    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id, user.role);

    // Store new refresh token
    await RefreshTokenModel.create({
      token: refreshToken,
      user: user._id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      deviceInfo: {
        userAgent: req.get('user-agent'),
        ip: req.ip
      }
    });

    // Set new HTTP-only cookie
    setRefreshTokenCookie(res, refreshToken);

    res.status(200).json({
      success: true,
      message: "Password updated successfully. You have been logged out from all other devices.",
      accessToken,
    });
  } catch (error) {
    console.error("Update password error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating password",
      error: error.message,
    });
  }
};
