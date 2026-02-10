const { RentalModel } = require("../models/Rental.model");

// Get all rentals
const getAllRentals = async (req, res) => {
  try {
    const { search, type, available } = req.query;
    let query = {};

    if (search) {
      query.$text = { $search: search };
    }

    if (type) {
      query.type = type;
    }

    if (available !== undefined) {
      query.available = available === "true";
    }

    const rentals = await RentalModel.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: rentals });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single rental by ID
const getRentalById = async (req, res) => {
  try {
    const { id } = req.params;
    const rental = await RentalModel.findById(id);

    if (!rental) {
      return res.status(404).json({ success: false, message: "Rental not found" });
    }

    res.status(200).json({ success: true, data: rental });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create new rental
const createRental = async (req, res) => {
  try {
    const newRental = await RentalModel.create(req.body);
    res.status(201).json({ success: true, data: newRental });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Update rental
const updateRental = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedRental = await RentalModel.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedRental) {
      return res.status(404).json({ success: false, message: "Rental not found" });
    }

    res.status(200).json({ success: true, data: updatedRental });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete rental
const deleteRental = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRental = await RentalModel.findByIdAndDelete(id);

    if (!deletedRental) {
      return res.status(404).json({ success: false, message: "Rental not found" });
    }

    res.status(200).json({ success: true, message: "Rental deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllRentals,
  getRentalById,
  createRental,
  updateRental,
  deleteRental
};
