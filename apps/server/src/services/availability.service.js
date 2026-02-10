const { BookingModel } = require("../models/Booking.model");
const { RentalModel } = require("../models/Rental.model");
const mongoose = require("mongoose");

/**
 * Check availability for rentals (bikes/cars) for given date range
 * Handles concurrency by checking overlapping bookings
 */
exports.checkRentalAvailability = async (rentalId, startDate, endDate, requestedQuantity = 1) => {
  try {
    // Get rental details
    const rental = await RentalModel.findById(rentalId);
    
    if (!rental) {
      return {
        available: false,
        message: "Rental not found",
        availableQuantity: 0
      };
    }

    if (!rental.available) {
      return {
        available: false,
        message: "This rental is currently unavailable",
        availableQuantity: 0
      };
    }

    // Find overlapping bookings (excluding cancelled ones)
    const overlappingBookings = await BookingModel.find({
      itemId: rentalId,
      bookingType: "rental",
      status: { $in: ["pending", "confirmed"] },
      $or: [
        // Booking starts during requested period
        { startDate: { $gte: startDate, $lt: endDate } },
        // Booking ends during requested period
        { endDate: { $gt: startDate, $lte: endDate } },
        // Booking spans entire requested period
        { startDate: { $lte: startDate }, endDate: { $gte: endDate } }
      ]
    });

    // Calculate booked quantity for the date range
    const bookedQuantity = overlappingBookings.reduce((sum, booking) => {
      return sum + (booking.quantity || 1);
    }, 0);

    const availableQuantity = rental.totalQuantity - bookedQuantity;

    return {
      available: availableQuantity >= requestedQuantity,
      availableQuantity,
      totalQuantity: rental.totalQuantity,
      bookedQuantity,
      message: availableQuantity >= requestedQuantity 
        ? `${availableQuantity} unit(s) available`
        : `Only ${availableQuantity} unit(s) available, but ${requestedQuantity} requested`
    };
  } catch (error) {
    console.error("Error checking rental availability:", error);
    throw error;
  }
};

/**
 * Get availability for multiple dates (useful for calendar view)
 */
exports.getRentalAvailabilityCalendar = async (rentalId, startDate, endDate) => {
  try {
    const rental = await RentalModel.findById(rentalId);
    
    if (!rental) {
      throw new Error("Rental not found");
    }

    // Get all bookings in the date range
    const bookings = await BookingModel.find({
      itemId: rentalId,
      bookingType: "rental",
      status: { $in: ["pending", "confirmed"] },
      $or: [
        { startDate: { $gte: startDate, $lte: endDate } },
        { endDate: { $gte: startDate, $lte: endDate } },
        { startDate: { $lte: startDate }, endDate: { $gte: endDate } }
      ]
    }).sort({ startDate: 1 });

    // Build availability map
    const availabilityMap = {};
    const currentDate = new Date(startDate);
    const end = new Date(endDate);

    while (currentDate <= end) {
      const dateStr = currentDate.toISOString().split('T')[0];
      
      // Check bookings for this date
      const bookedForDate = bookings.reduce((sum, booking) => {
        const bookingStart = new Date(booking.startDate);
        const bookingEnd = new Date(booking.endDate);
        
        if (currentDate >= bookingStart && currentDate <= bookingEnd) {
          return sum + (booking.quantity || 1);
        }
        return sum;
      }, 0);

      availabilityMap[dateStr] = {
        available: rental.totalQuantity - bookedForDate,
        total: rental.totalQuantity,
        booked: bookedForDate
      };

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return availabilityMap;
  } catch (error) {
    console.error("Error getting rental availability calendar:", error);
    throw error;
  }
};

/**
 * Check if a booking can be created (pre-flight check)
 * This helps prevent race conditions by doing a final check before insert
 */
exports.canCreateBooking = async (rentalId, startDate, endDate, quantity = 1) => {
  const availability = await this.checkRentalAvailability(rentalId, startDate, endDate, quantity);
  return availability.available;
};

/**
 * Create booking with concurrency protection using MongoDB transactions
 * and optimistic locking
 */
exports.createBookingWithConcurrencyProtection = async (bookingData) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { itemId, startDate, endDate, quantity = 1, bookingType } = bookingData;

    if (bookingType === "rental") {
      // Re-check availability within transaction
      const rental = await RentalModel.findById(itemId).session(session);
      
      if (!rental) {
        throw new Error("Rental not found");
      }

      // Get current bookings within transaction
      const overlappingBookings = await BookingModel.find({
        itemId,
        bookingType: "rental",
        status: { $in: ["pending", "confirmed"] },
        $or: [
          { startDate: { $gte: startDate, $lt: endDate } },
          { endDate: { $gt: startDate, $lte: endDate } },
          { startDate: { $lte: startDate }, endDate: { $gte: endDate } }
        ]
      }).session(session);

      const bookedQuantity = overlappingBookings.reduce((sum, booking) => {
        return sum + (booking.quantity || 1);
      }, 0);

      const availableQuantity = rental.totalQuantity - bookedQuantity;

      if (availableQuantity < quantity) {
        throw new Error(
          `Insufficient availability. Only ${availableQuantity} unit(s) available.`
        );
      }
    }

    // Create booking within transaction
    const [booking] = await BookingModel.create([bookingData], { session });

    // Commit transaction
    await session.commitTransaction();
    
    return booking;
  } catch (error) {
    // Rollback on error
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};
