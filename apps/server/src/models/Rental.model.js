const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true, trim: true },
    alt: { type: String, default: "", trim: true }
  },
  { _id: false }
);

const RentalSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    type: { 
      type: String, 
      required: true, 
      enum: ["car", "bike"],
      lowercase: true 
    },
    brand: { type: String, required: true, trim: true },
    model: { type: String, required: true, trim: true },
    year: { type: Number, min: 2000 },
    pricePerDay: { type: Number, required: true, min: 0 },
    capacity: { type: Number, required: true, min: 1 },
    transmission: {
      type: String,
      enum: ["manual", "automatic"],
      default: "manual",
      lowercase: true
    },
    fuelType: {
      type: String,
      enum: ["petrol", "diesel", "electric"],
      required: true,
      lowercase: true
    },
    features: { type: [String], default: [] },
    images: { type: [ImageSchema], default: [] },
    available: { type: Boolean, default: true },
    description: { type: String, trim: true },
    // Inventory management for concurrency control
    totalQuantity: { 
      type: Number, 
      required: true, 
      default: 1,
      min: 0 
    },
    // Version key for optimistic locking
    __v: { type: Number, select: false }
  },
  { 
    timestamps: true,
    optimisticConcurrency: true // Enable optimistic locking
  }
);

RentalSchema.index({ name: "text", brand: "text", model: "text" });

const RentalModel =
  mongoose.models.Rental || mongoose.model("Rental", RentalSchema);

module.exports = { RentalModel };
