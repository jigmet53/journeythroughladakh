const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { RentalModel } = require("./models/Rental.model");
const connectDB = require("./config/database");

// Load environment variables
dotenv.config();

const updateRentals = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Update all rentals to add totalQuantity field if missing
    const result = await RentalModel.updateMany(
      { totalQuantity: { $exists: false } }, // Find rentals without totalQuantity
      { $set: { totalQuantity: 5 } } // Set default to 5 units
    );

    console.log("✅ Rentals updated successfully!");
    console.log(`📊 Modified ${result.modifiedCount} rental(s)`);
    console.log("🏍️  Each rental now has 5 units available by default");

    // Show current rentals
    const rentals = await RentalModel.find({});
    console.log("\n📋 Current Rentals:");
    rentals.forEach(rental => {
      console.log(`- ${rental.name} (${rental.type}): ${rental.totalQuantity} units available`);
    });

    process.exit(0);
  } catch (error) {
    console.error("❌ Error updating rentals:", error.message);
    process.exit(1);
  }
};

// Run the update function
updateRentals();
