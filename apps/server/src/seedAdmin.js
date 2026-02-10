const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User.model");
const connectDB = require("./config/database");

// Load environment variables
dotenv.config();

const seedAdmin = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: "admin@ladakh.com" });

    if (existingAdmin) {
      console.log("⚠️  Admin user already exists!");
      console.log("Email: admin@ladakh.com");
      process.exit(0);
    }

    // Create admin user
    const admin = await User.create({
      username: "admin",
      email: "admin@ladakh.com",
      password: "admin123",
      role: "admin",
    });

    console.log("✅ Admin user created successfully!");
    console.log("📧 Email: admin@ladakh.com");
    console.log("🔑 Password: admin123");
    console.log("👤 Username:", admin.username);
    console.log("🎭 Role:", admin.role);
    console.log("\n⚠️  IMPORTANT: Change the admin password after first login!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin user:", error.message);
    process.exit(1);
  }
};

// Run the seed function
seedAdmin();
