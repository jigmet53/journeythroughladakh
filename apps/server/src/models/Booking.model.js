const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema(
  {
    bookingType: {
      type: String,
      required: true,
      enum: ["tour", "rental"],
      lowercase: true
    },
    // Reference to TourPackage or Rental
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "onModel"
    },
    // Dynamic model reference
    onModel: {
      type: String,
      required: true,
      enum: ["TourPackage", "Rental"]
    },

    customerName: { type: String, required: true, trim: true },
    email: { 
      type: String, 
      required: true, 
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"]
    },
    phone: { 
      type: String, 
      required: true, 
      trim: true,
      match: [/^\+?[\d\s-()]+$/, "Please provide a valid phone number"]
    },
    numberOfPeople: { type: Number, required: true, min: 1 },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    totalPrice: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
      lowercase: true
    },
    message: { type: String, trim: true },
    specialRequests: { type: String, trim: true },
    // For rentals: track quantity booked
    quantity: {
      type: Number,
      default: 1,
      min: 1
    },
    // Idempotency key to prevent duplicate bookings
    idempotencyKey: {
      type: String,
      unique: true,
      sparse: true, // Allow null values but unique if provided
      index: true
    },
    // User reference for authenticated bookings
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false
    }
  },
  { timestamps: true }
);

BookingSchema.index({ email: 1 });
BookingSchema.index({ status: 1 });
BookingSchema.index({ startDate: 1 });

const BookingModel =
  mongoose.models.Booking || mongoose.model("Booking", BookingSchema);

module.exports = { BookingModel };
