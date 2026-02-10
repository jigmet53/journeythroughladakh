const express = require("express");
const router = express.Router();
const {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBooking,
  updateBookingStatus,
  deleteBooking,
  checkAvailability,
  getAvailabilityCalendar
} = require("../controllers/booking.controller");

// GET /api/bookings/check-availability - Check availability for rental
router.get("/check-availability", checkAvailability);

// GET /api/bookings/availability-calendar - Get availability calendar
router.get("/availability-calendar", getAvailabilityCalendar);

// GET /api/bookings - Get all bookings
router.get("/", getAllBookings);

// GET /api/bookings/:id - Get single booking
router.get("/:id", getBookingById);

// POST /api/bookings - Create new booking (with idempotency & concurrency protection)
router.post("/", createBooking);

// PUT /api/bookings/:id - Update booking
router.put("/:id", updateBooking);

// PATCH /api/bookings/:id/status - Update booking status
router.patch("/:id/status", updateBookingStatus);

// DELETE /api/bookings/:id - Delete booking
router.delete("/:id", deleteBooking);

module.exports = router;
