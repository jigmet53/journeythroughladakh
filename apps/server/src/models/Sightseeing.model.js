const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true, trim: true },
    alt: { type: String, default: "", trim: true }
  },
  { _id: false }
);

const LocationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point"
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
      validate: {
        validator: function(arr) {
          return arr.length === 2 && 
                 arr[0] >= -180 && arr[0] <= 180 && 
                 arr[1] >= -90 && arr[1] <= 90;
        },
        message: "coordinates must be [longitude, latitude] with valid values"
      }
    }
  },
  { _id: false }
);

const SightseeingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    location: { 
      type: LocationSchema, 
      required: true 
    },
    address: { type: String, trim: true },
    category: {
      type: String,
      enum: ["monastery", "lake", "pass", "palace", "museum", "market", "natural", "cultural", "adventure", "other"],
      required: true,
      lowercase: true
    },
    entryFee: { type: Number, default: 0, min: 0 },
    openingHours: { type: String, trim: true },
    bestTimeToVisit: { type: String, trim: true },
    images: { type: [ImageSchema], default: [] },
    featured: { type: Boolean, default: false },
    rating: { type: Number, min: 0, max: 5, default: 0 }
  },
  { timestamps: true }
);

// Create 2dsphere index for geospatial queries
SightseeingSchema.index({ location: "2dsphere" });
SightseeingSchema.index({ name: "text", description: "text" });

const SightseeingModel =
  mongoose.models.Sightseeing || mongoose.model("Sightseeing", SightseeingSchema);

module.exports = { SightseeingModel };
