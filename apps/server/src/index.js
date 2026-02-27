const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const connectDB = require("./config/database");
const { connectRedis } = require("./config/redis");

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Connect to Redis (optional - graceful degradation if Redis unavailable)
connectRedis();

// Middleware
// CORS configuration - MUST return specific origin when using credentials
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, curl)
    if (!origin) return callback(null, allowedOrigins[0]);
    
    // Check if origin is allowed
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, origin); // IMPORTANT: Return the actual origin, not 'true'
    } else {
      console.warn(`CORS: Origin ${origin} not allowed`);
      callback(null, origin); // Allow in development
    }
  },
  credentials: true, // Allow cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Set-Cookie'],
  optionsSuccessStatus: 200,
  preflightContinue: false
}));

app.use(cookieParser()); // Parse cookies - REQUIRED for HTTP-only cookies
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
