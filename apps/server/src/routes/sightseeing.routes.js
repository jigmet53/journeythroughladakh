const express = require("express");
const router = express.Router();
const {
  getAllSightseeingLocations,
  getSightseeingLocationById,
  getNearbyLocations,
  createSightseeingLocation,
  updateSightseeingLocation,
  deleteSightseeingLocation
} = require("../controllers/sightseeing.controller");

// GET /api/sightseeing - Get all sightseeing locations
router.get("/", getAllSightseeingLocations);

// GET /api/sightseeing/nearby - Get nearby locations
router.get("/nearby", getNearbyLocations);

// GET /api/sightseeing/:id - Get single sightseeing location
router.get("/:id", getSightseeingLocationById);

// POST /api/sightseeing - Create new sightseeing location
router.post("/", createSightseeingLocation);

// PUT /api/sightseeing/:id - Update sightseeing location
router.put("/:id", updateSightseeingLocation);

// DELETE /api/sightseeing/:id - Delete sightseeing location
router.delete("/:id", deleteSightseeingLocation);

module.exports = router;
