const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true, trim: true },
    alt: { type: String, default: "", trim: true }
  },
  { _id: false }
);

const ItineraryDaySchema = new mongoose.Schema(
  {
    dayNumber: { type: Number, required: true, min: 1 },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true }
  },
  { _id: false }
);

const TourPackageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },

    // Example: "5N/6D". Stored as a formatted string.
    duration: {
      type: String,
      required: true,
      trim: true,
      match: [/^\d+N\/\d+D$/i, "duration must be like 5N/6D"]
    },

    price: { type: Number, required: true, min: 0 },

    itinerary: {
      type: [ItineraryDaySchema],
      default: [],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: "itinerary must have at least one day"
      }
    },

    inclusions: { type: [String], default: [] },
    exclusions: { type: [String], default: [] },

    images: { type: [ImageSchema], default: [] },

    bestSeason: {
      type: [String],
      default: [],
      enum: ["summer", "winter", "spring", "autumn"]
    }
  },
  { timestamps: true }
);

TourPackageSchema.index({ title: "text" });

const TourPackageModel =
  mongoose.models.TourPackage || mongoose.model("TourPackage", TourPackageSchema);

module.exports = { TourPackageModel };

