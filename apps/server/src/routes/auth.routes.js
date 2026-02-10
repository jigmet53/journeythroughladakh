const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { protect } = require("../middlewares/auth.middleware");

// Public routes
router.post("/register", authController.register);
router.post("/login", authController.login);

// Protected routes
router.get("/me", protect, authController.getMe);
router.post("/logout", protect, authController.logout);
router.put("/update-password", protect, authController.updatePassword);

module.exports = router;
