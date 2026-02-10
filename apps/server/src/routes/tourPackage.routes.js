const express = require("express");
const router = express.Router();
const {
  getAllTourPackages,
  getTourPackageById,
  createTourPackage,
  updateTourPackage,
  deleteTourPackage
} = require("../controllers/tourPackage.controller");

// GET /api/tour-packages - Get all tour packages
router.get("/", getAllTourPackages);

// GET /api/tour-packages/:id - Get single tour package
router.get("/:id", getTourPackageById);

// POST /api/tour-packages - Create new tour package
router.post("/", createTourPackage);

// PUT /api/tour-packages/:id - Update tour package
router.put("/:id", updateTourPackage);

// DELETE /api/tour-packages/:id - Delete tour package
router.delete("/:id", deleteTourPackage);

module.exports = router;
