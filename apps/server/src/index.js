const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/database");

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const tourPackageRoutes = require("./routes/tourPackage.routes");
const rentalRoutes = require("./routes/rental.routes");
const sightseeingRoutes = require("./routes/sightseeing.routes");
const bookingRoutes = require("./routes/booking.routes");
const authRoutes = require("./routes/auth.routes");

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/tour-packages", tourPackageRoutes);
app.use("/api/rentals", rentalRoutes);
app.use("/api/sightseeing", sightseeingRoutes);
app.use("/api/bookings", bookingRoutes);

// Health check route
app.get("/api/health", (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: "Ladakh Tourism API is running",
    timestamp: new Date().toISOString()
  });
});

// Root route
app.get("/", (req, res) => {
  res.json({ 
    message: "Welcome to Ladakh Tourism & Rental API",
    version: "1.0.0",
    endpoints: {
      tourPackages: "/api/tour-packages",
      rentals: "/api/rentals",
      sightseeing: "/api/sightseeing",
      bookings: "/api/bookings",
      health: "/api/health"
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: "Route not found" 
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ 
    success: false, 
    message: err.message || "Internal Server Error" 
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 API URL: http://localhost:${PORT}`);
});
