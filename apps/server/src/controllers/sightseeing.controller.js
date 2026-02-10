const { SightseeingModel } = require("../models/Sightseeing.model");

// Get all sightseeing locations
const getAllSightseeingLocations = async (req, res) => {
  try {
    const { search, category, featured } = req.query;
    let query = {};

    if (search) {
      query.$text = { $search: search };
    }

    if (category) {
      query.category = category;
    }

    if (featured !== undefined) {
      query.featured = featured === "true";
    }

    const locations = await SightseeingModel.find(query).sort({ rating: -1, createdAt: -1 });
    res.status(200).json({ success: true, data: locations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single sightseeing location by ID
const getSightseeingLocationById = async (req, res) => {
  try {
    const { id } = req.params;
    const location = await SightseeingModel.findById(id);

    if (!location) {
      return res.status(404).json({ success: false, message: "Sightseeing location not found" });
    }

    res.status(200).json({ success: true, data: location });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get nearby locations (within radius in km)
const getNearbyLocations = async (req, res) => {
  try {
    const { longitude, latitude, radius = 50 } = req.query;

    if (!longitude || !latitude) {
      return res.status(400).json({ 
        success: false, 
        message: "longitude and latitude are required" 
      });
    }

    const locations = await SightseeingModel.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: radius * 1000 // Convert km to meters
        }
      }
    });

    res.status(200).json({ success: true, data: locations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create new sightseeing location
const createSightseeingLocation = async (req, res) => {
  try {
    const newLocation = await SightseeingModel.create(req.body);
    res.status(201).json({ success: true, data: newLocation });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Update sightseeing location
const updateSightseeingLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedLocation = await SightseeingModel.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedLocation) {
      return res.status(404).json({ success: false, message: "Sightseeing location not found" });
    }

    res.status(200).json({ success: true, data: updatedLocation });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete sightseeing location
const deleteSightseeingLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedLocation = await SightseeingModel.findByIdAndDelete(id);

    if (!deletedLocation) {
      return res.status(404).json({ success: false, message: "Sightseeing location not found" });
    }

    res.status(200).json({ success: true, message: "Sightseeing location deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllSightseeingLocations,
  getSightseeingLocationById,
  getNearbyLocations,
  createSightseeingLocation,
  updateSightseeingLocation,
  deleteSightseeingLocation
};
