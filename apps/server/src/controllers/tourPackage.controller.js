const { TourPackageModel } = require("../models/TourPackage.model");

// Get all tour packages
const getAllTourPackages = async (req, res) => {
  try {
    const { search, season } = req.query;
    let query = {};

    if (search) {
      query.$text = { $search: search };
    }

    if (season) {
      query.bestSeason = season;
    }

    const packages = await TourPackageModel.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: packages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single tour package by ID
const getTourPackageById = async (req, res) => {
  try {
    const { id } = req.params;
    const package = await TourPackageModel.findById(id);

    if (!package) {
      return res.status(404).json({ success: false, message: "Tour package not found" });
    }

    res.status(200).json({ success: true, data: package });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create new tour package
const createTourPackage = async (req, res) => {
  try {
    const newPackage = await TourPackageModel.create(req.body);
    res.status(201).json({ success: true, data: newPackage });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Update tour package
const updateTourPackage = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedPackage = await TourPackageModel.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedPackage) {
      return res.status(404).json({ success: false, message: "Tour package not found" });
    }

    res.status(200).json({ success: true, data: updatedPackage });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete tour package
const deleteTourPackage = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPackage = await TourPackageModel.findByIdAndDelete(id);

    if (!deletedPackage) {
      return res.status(404).json({ success: false, message: "Tour package not found" });
    }

    res.status(200).json({ success: true, message: "Tour package deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllTourPackages,
  getTourPackageById,
  createTourPackage,
  updateTourPackage,
  deleteTourPackage
};
