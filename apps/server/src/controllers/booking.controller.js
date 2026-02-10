const { BookingModel } = require("../models/Booking.model");
const availabilityService = require("../services/availability.service");
const emailService = require("../services/email.service");
const crypto = require("crypto");

// Get all bookings
const getAllBookings = async (req, res) => {
  try {
    const { status, bookingType, email } = req.query;
    let query = {};

    if (status) {
      query.status = status;
    }

    if (bookingType) {
      query.bookingType = bookingType;
    }

    if (email) {
      query.email = email;
    }

    const bookings = await BookingModel.find(query)
      .populate("itemId")
      .sort({ createdAt: -1 });
    
    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single booking by ID
const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await BookingModel.findById(id).populate("itemId");

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create new booking with idempotency and concurrency protection
const createBooking = async (req, res) => {
  try {
    const bookingData = req.body;
    const { itemId, startDate, endDate, bookingType, quantity = 1 } = bookingData;

    // IDEMPOTENCY: Generate or use provided idempotency key
    let idempotencyKey = req.headers['idempotency-key'] || req.body.idempotencyKey;
    
    if (!idempotencyKey) {
      // Generate idempotency key from request data
      const keyData = `${itemId}-${startDate}-${endDate}-${bookingData.email}-${Date.now()}`;
      idempotencyKey = crypto.createHash('sha256').update(keyData).digest('hex');
    }

    // Check if booking with this idempotency key already exists (prevent duplicate submissions)
    const existingBooking = await BookingModel.findOne({ idempotencyKey });
    if (existingBooking) {
      return res.status(200).json({
        success: true,
        data: existingBooking,
        message: "Booking already exists (duplicate request detected)",
        isDuplicate: true
      });
    }

    // CONCURRENCY CONTROL: Check availability for rentals
    if (bookingType === "rental") {
      const availability = await availabilityService.checkRentalAvailability(
        itemId,
        new Date(startDate),
        new Date(endDate),
        quantity
      );

      if (!availability.available) {
        return res.status(409).json({
          success: false,
          message: availability.message,
          availableQuantity: availability.availableQuantity,
          requestedQuantity: quantity
        });
      }
    }

    // Add idempotency key to booking data
    bookingData.idempotencyKey = idempotencyKey;

    // Add user ID if authenticated
    if (req.user) {
      bookingData.userId = req.user.id;
    }

    // Set the onModel field for dynamic population
    bookingData.onModel = bookingType === "rental" ? "Rental" : "TourPackage";

    // Create booking with transaction for rental bookings
    let newBooking;
    if (bookingType === "rental") {
      // Use transaction to ensure atomic booking creation
      newBooking = await availabilityService.createBookingWithConcurrencyProtection(bookingData);
    } else {
      // For tours, create directly (can add similar logic if needed)
      newBooking = await BookingModel.create(bookingData);
    }

    const populatedBooking = await BookingModel.findById(newBooking._id).populate("itemId");
    
    res.status(201).json({ 
      success: true, 
      data: populatedBooking,
      message: "Booking created successfully! We will contact you soon.",
      idempotencyKey
    });
  } catch (error) {
    // Handle duplicate key error (if idempotency key constraint fails)
    if (error.code === 11000) {
      return res.status(200).json({
        success: true,
        message: "Booking already exists (duplicate request detected)",
        isDuplicate: true
      });
    }
    
    res.status(400).json({ success: false, message: error.message });
  }
};

// Update booking
const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedBooking = await BookingModel.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    ).populate("itemId");

    if (!updatedBooking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    res.status(200).json({ success: true, data: updatedBooking });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Update booking status
const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "confirmed", "cancelled", "completed"].includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid status value" 
      });
    }

    const updatedBooking = await BookingModel.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    ).populate("itemId");

    if (!updatedBooking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    // Send email notification based on status change
    let emailResult = null;
    try {
      if (status === "confirmed") {
        emailResult = await emailService.sendBookingConfirmationEmail(updatedBooking);
      } else if (status === "cancelled") {
        emailResult = await emailService.sendBookingCancellationEmail(updatedBooking);
      }
    } catch (emailError) {
      console.error("Email sending failed:", emailError.message);
      // Don't fail the request if email fails
    }

    // Prepare response message based on email status
    let message = `Booking ${status} successfully.`;
    if (emailResult && emailResult.emailConfigured === false) {
      message += ` 📞 Please contact customer at ${updatedBooking.phone} to notify them.`;
    } else if (emailResult && emailResult.success) {
      message += ` ✅ Email notification sent to ${updatedBooking.email}.`;
    } else {
      message += ` ⚠️ Email notification failed. Please contact customer at ${updatedBooking.phone}.`;
    }

    res.status(200).json({ 
      success: true, 
      data: updatedBooking,
      message: message,
      emailSent: emailResult?.success || false
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete booking
const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBooking = await BookingModel.findByIdAndDelete(id);

    if (!deletedBooking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    res.status(200).json({ success: true, message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Check rental availability
const checkAvailability = async (req, res) => {
  try {
    const { rentalId, startDate, endDate, quantity = 1 } = req.query;

    if (!rentalId || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "rentalId, startDate, and endDate are required"
      });
    }

    const availability = await availabilityService.checkRentalAvailability(
      rentalId,
      new Date(startDate),
      new Date(endDate),
      parseInt(quantity)
    );

    res.status(200).json({
      success: true,
      data: availability
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get availability calendar
const getAvailabilityCalendar = async (req, res) => {
  try {
    const { rentalId, startDate, endDate } = req.query;

    if (!rentalId || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "rentalId, startDate, and endDate are required"
      });
    }

    const calendar = await availabilityService.getRentalAvailabilityCalendar(
      rentalId,
      new Date(startDate),
      new Date(endDate)
    );

    res.status(200).json({
      success: true,
      data: calendar
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBooking,
  updateBookingStatus,
  deleteBooking,
  checkAvailability,
  getAvailabilityCalendar
};
