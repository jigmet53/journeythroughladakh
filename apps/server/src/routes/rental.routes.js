const express = require("express");
const router = express.Router();
const {
  getAllRentals,
  getRentalById,
  createRental,
  updateRental,
  deleteRental
} = require("../controllers/rental.controller");

// GET /api/rentals - Get all rentals
router.get("/", getAllRentals);

// GET /api/rentals/:id - Get single rental
router.get("/:id", getRentalById);

// POST /api/rentals - Create new rental
router.post("/", createRental);

// PUT /api/rentals/:id - Update rental
router.put("/:id", updateRental);

// DELETE /api/rentals/:id - Delete rental
router.delete("/:id", deleteRental);

module.exports = router;
