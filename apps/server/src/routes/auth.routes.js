const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { protect } = require("../middlewares/auth.middleware");
const { loginRateLimiter } = require("../middlewares/rateLimiter.middleware");

// Public routes
router.post("/register", authController.register);
router.post("/login", loginRateLimiter, authController.login); // REDIS: Rate limiting (5 attempts per 15 min)
router.post("/refresh", authController.refresh); // Refresh access token (requires HTTP-only cookie)

// Protected routes
router.get("/me", protect, authController.getMe);
router.post("/logout", protect, authController.logout);
router.post("/logout-all", protect, authController.logoutAll); // Logout from all devices
router.put("/update-password", protect, authController.updatePassword);

module.exports = router;
