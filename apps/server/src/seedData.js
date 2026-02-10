require('dotenv').config();
const mongoose = require('mongoose');
const { TourPackageModel } = require('./models/TourPackage.model');
const { RentalModel } = require('./models/Rental.model');
const { SightseeingModel } = require('./models/Sightseeing.model');

const tourPackages = [
  {
    title: "Leh Ladakh Explorer - 6 Days Adventure",
    duration: "5N/6D",
    price: 25000,
    itinerary: [
      {
        dayNumber: 1,
        title: "Arrival in Leh",
        description: "Arrive at Leh airport. Rest and acclimatize. Evening walk at Leh Market and Shanti Stupa."
      },
      {
        dayNumber: 2,
        title: "Leh Local Sightseeing",
        description: "Visit Leh Palace, Shanti Stupa, Hall of Fame, and Magnetic Hill. Evening at leisure."
      },
      {
        dayNumber: 3,
        title: "Leh to Nubra Valley via Khardung La",
        description: "Drive to Nubra Valley via Khardung La Pass (18,380 ft). Visit Diskit Monastery and Hunder Sand Dunes. Camel safari."
      },
      {
        dayNumber: 4,
        title: "Nubra to Pangong Lake",
        description: "Drive to the spectacular Pangong Lake. Enjoy the changing colors of the lake. Overnight camping."
      },
      {
        dayNumber: 5,
        title: "Pangong to Leh",
        description: "Return to Leh via Changla Pass. Visit Hemis Monastery and Thiksey Monastery en route."
      },
      {
        dayNumber: 6,
        title: "Departure",
        description: "Transfer to airport for departure with memories of lifetime."
      }
    ],
    inclusions: [
      "Accommodation in hotels/camps",
      "Daily breakfast and dinner",
      "All transfers and sightseeing by private vehicle",
      "Inner Line Permits",
      "Professional driver"
    ],
    exclusions: [
      "Airfare",
      "Lunch and snacks",
      "Personal expenses",
      "Adventure activities",
      "Travel insurance"
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1200&q=80",
        alt: "Pangong Lake Ladakh"
      },
      {
        url: "https://images.unsplash.com/photo-1592894937629-e6c7b9f2f496?w=1200&q=80",
        alt: "Khardung La Pass"
      },
      {
        url: "https://images.unsplash.com/photo-1610878722345-79c5ebc0c7eb?w=1200&q=80",
        alt: "Nubra Valley Desert"
      },
      {
        url: "https://images.unsplash.com/photo-1626621341229-c228bcb6e050?w=1200&q=80",
        alt: "Leh Ladakh Landscape"
      }
    ],
    bestSeason: ["summer", "autumn"]
  },
  {
    title: "Magical Monasteries of Ladakh - 7 Days",
    duration: "6N/7D",
    price: 30000,
    itinerary: [
      {
        dayNumber: 1,
        title: "Arrive Leh",
        description: "Arrival and acclimatization day. Visit Leh Market."
      },
      {
        dayNumber: 2,
        title: "Monastery Circuit - Thiksey & Hemis",
        description: "Visit ancient monasteries of Thiksey, Hemis, and Shey Palace."
      },
      {
        dayNumber: 3,
        title: "Alchi & Likir Monasteries",
        description: "Drive to Alchi and visit its 1000-year-old monastery. Visit Likir Monastery."
      },
      {
        dayNumber: 4,
        title: "Lamayuru & Moonland",
        description: "Visit Lamayuru Monastery and explore the moonland landscape."
      },
      {
        dayNumber: 5,
        title: "Nubra Valley",
        description: "Cross Khardung La to reach Nubra Valley. Visit Diskit Monastery."
      },
      {
        dayNumber: 6,
        title: "Return to Leh",
        description: "Return to Leh. Evening at leisure for shopping."
      },
      {
        dayNumber: 7,
        title: "Departure",
        description: "Transfer to airport with spiritual memories."
      }
    ],
    inclusions: [
      "All accommodation",
      "Meals (breakfast & dinner)",
      "Private vehicle with driver",
      "Monastery entry fees",
      "Permits"
    ],
    exclusions: [
      "Flight tickets",
      "Lunch",
      "Personal expenses",
      "Tips and gratuities"
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1588595130235-83516dfc14e7?w=1200&q=80",
        alt: "Thiksey Monastery"
      },
      {
        url: "https://images.unsplash.com/photo-1611417720985-85e2a0a2efbe?w=1200&q=80",
        alt: "Hemis Monastery"
      },
      {
        url: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=1200&q=80",
        alt: "Leh Palace at Sunset"
      },
      {
        url: "https://images.unsplash.com/photo-1626621341229-c228bcb6e050?w=1200&q=80",
        alt: "Ladakh Mountain Views"
      }
    ],
    bestSeason: ["summer", "spring", "autumn"]
  },
  {
    title: "Ladakh Winter Wonderland - 5 Days",
    duration: "4N/5D",
    price: 35000,
    itinerary: [
      {
        dayNumber: 1,
        title: "Arrival in Winter Paradise",
        description: "Arrive in snow-covered Leh. Acclimatization and warm welcome."
      },
      {
        dayNumber: 2,
        title: "Frozen Pangong Experience",
        description: "Visit the partially frozen Pangong Lake. Experience winter magic."
      },
      {
        dayNumber: 3,
        title: "Chadar Trek Introduction",
        description: "Short trek on frozen Zanskar River (beginner-friendly section)."
      },
      {
        dayNumber: 4,
        title: "Snow Leopard Spotting",
        description: "Wildlife excursion to Hemis National Park for snow leopard tracking."
      },
      {
        dayNumber: 5,
        title: "Departure",
        description: "Transfer to airport with unique winter memories."
      }
    ],
    inclusions: [
      "Winter-rated accommodation",
      "All meals",
      "Winter gear rental",
      "Heated transport",
      "Expert guide",
      "Permits"
    ],
    exclusions: [
      "Airfare",
      "Personal winter clothing",
      "Medical insurance",
      "Emergency evacuation"
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800",
        alt: "Winter Ladakh"
      },
      {
        url: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800",
        alt: "Frozen Pangong"
      }
    ],
    bestSeason: ["winter"]
  }
];

const rentals = [
  {
    name: "Royal Enfield Himalayan 411cc",
    type: "bike",
    brand: "Royal Enfield",
    model: "Himalayan",
    year: 2023,
    pricePerDay: 1500,
    capacity: 2,
    transmission: "manual",
    fuelType: "petrol",
    features: [
      "Long-range fuel tank",
      "Dual-purpose tires",
      "Comfortable seat for long rides",
      "Panniers included",
      "First aid kit"
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800",
        alt: "Royal Enfield Himalayan"
      }
    ],
    available: true,
    description: "Perfect adventure bike for Ladakh terrain. Battle-tested and reliable."
  },
  {
    name: "Mahindra Thar 4x4",
    type: "car",
    brand: "Mahindra",
    model: "Thar",
    year: 2023,
    pricePerDay: 3500,
    capacity: 6,
    transmission: "manual",
    fuelType: "diesel",
    features: [
      "4x4 capability",
      "High ground clearance",
      "Spacious interior",
      "Music system",
      "GPS navigation"
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800",
        alt: "Mahindra Thar"
      }
    ],
    available: true,
    description: "Rugged 4x4 SUV perfect for families and groups exploring Ladakh."
  },
  {
    name: "KTM Duke 390",
    type: "bike",
    brand: "KTM",
    model: "Duke 390",
    year: 2023,
    pricePerDay: 1200,
    capacity: 2,
    transmission: "manual",
    fuelType: "petrol",
    features: [
      "Powerful engine",
      "Lightweight",
      "Modern design",
      "ABS brakes",
      "Digital display"
    ],
    images: [
      {
        url: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800",
        alt: "KTM Duke"
      }
    ],
    available: true,
    description: "Sporty and agile bike for experienced riders."
  }
];

const sightseeing = [
  {
    name: "Pangong Lake",
    description: "A breathtaking high-altitude lake that changes colors throughout the day. Famous from the movie '3 Idiots'. At 14,270 ft, it's one of the most beautiful lakes in India.",
    location: {
      type: "Point",
      coordinates: [78.9067, 33.7707] // [longitude, latitude]
    },
    address: "Spangmik, Ladakh",
    category: "lake",
    entryFee: 0,
    openingHours: "24 hours (best during sunrise/sunset)",
    bestTimeToVisit: "May to September",
    images: [
      {
        url: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800",
        alt: "Pangong Lake"
      }
    ],
    featured: true,
    rating: 5
  },
  {
    name: "Thiksey Monastery",
    description: "A stunning 12-story monastery complex perched on a hilltop. Houses a 49-foot tall Maitreya Buddha statue and offers panoramic views of the Indus Valley.",
    location: {
      type: "Point",
      coordinates: [77.6667, 34.0554]
    },
    address: "Thiksey Village, 19 km from Leh",
    category: "monastery",
    entryFee: 30,
    openingHours: "6:00 AM - 7:00 PM",
    bestTimeToVisit: "Early morning for prayers",
    images: [
      {
        url: "https://images.unsplash.com/photo-1588595130235-83516dfc14e7?w=800",
        alt: "Thiksey Monastery"
      }
    ],
    featured: true,
    rating: 5
  },
  {
    name: "Khardung La Pass",
    description: "One of the highest motorable passes in the world at 18,380 ft. Gateway to Nubra Valley with breathtaking views of snow-capped peaks.",
    location: {
      type: "Point",
      coordinates: [77.6003, 34.2782]
    },
    address: "40 km from Leh",
    category: "pass",
    entryFee: 0,
    openingHours: "7:00 AM - 5:00 PM (weather dependent)",
    bestTimeToVisit: "June to September",
    images: [
      {
        url: "https://images.unsplash.com/photo-1592894937629-e6c7b9f2f496?w=800",
        alt: "Khardung La Pass"
      }
    ],
    featured: true,
    rating: 5
  },
  {
    name: "Leh Palace",
    description: "A former royal palace overlooking Leh town. Nine-story structure built in the 17th century, resembling the Potala Palace in Lhasa.",
    location: {
      type: "Point",
      coordinates: [77.5847, 34.1642]
    },
    address: "Old Leh, Ladakh",
    category: "palace",
    entryFee: 20,
    openingHours: "7:00 AM - 4:00 PM",
    bestTimeToVisit: "Morning hours",
    images: [
      {
        url: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=800",
        alt: "Leh Palace"
      }
    ],
    featured: true,
    rating: 4.5
  },
  {
    name: "Nubra Valley",
    description: "A high-altitude cold desert with unique landscapes. Famous for double-humped Bactrian camels, sand dunes, and the confluence of Shyok and Siachen rivers.",
    location: {
      type: "Point",
      coordinates: [77.6167, 34.6167]
    },
    address: "150 km from Leh",
    category: "natural",
    entryFee: 0,
    openingHours: "24 hours",
    bestTimeToVisit: "June to September",
    images: [
      {
        url: "https://images.unsplash.com/photo-1610878722345-79c5ebc0c7eb?w=800",
        alt: "Nubra Valley"
      }
    ],
    featured: true,
    rating: 5
  },
  {
    name: "Magnetic Hill",
    description: "A mysterious hill where vehicles appear to defy gravity and move uphill on their own. A fascinating optical illusion.",
    location: {
      type: "Point",
      coordinates: [77.4333, 34.2667]
    },
    address: "30 km from Leh on Leh-Kargil Highway",
    category: "natural",
    entryFee: 0,
    openingHours: "24 hours",
    bestTimeToVisit: "Anytime",
    images: [
      {
        url: "https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800",
        alt: "Magnetic Hill"
      }
    ],
    featured: false,
    rating: 4
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ladakh-tourism');
    console.log('Connected to MongoDB');

    // Clear existing data
    await TourPackageModel.deleteMany({});
    await RentalModel.deleteMany({});
    await SightseeingModel.deleteMany({});
    console.log('Cleared existing data');

    // Insert new data
    await TourPackageModel.insertMany(tourPackages);
    console.log(`✅ Added ${tourPackages.length} tour packages`);

    await RentalModel.insertMany(rentals);
    console.log(`✅ Added ${rentals.length} rentals`);

    await SightseeingModel.insertMany(sightseeing);
    console.log(`✅ Added ${sightseeing.length} sightseeing locations`);

    console.log('\n🎉 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
