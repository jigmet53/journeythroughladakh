# Journey Through Ladakh - Tour & Rental Website

A full-stack web application for a Ladakh tour and rental service built with React.js, Node.js, Express, and MongoDB.

## 🌟 Features

### Customer Features
- **Tour Packages**: Browse multi-day tour packages with detailed itineraries
- **Vehicle Rentals**: Rent cars and bikes for your adventure
- **Sightseeing Locations**: Interactive map view of tourist attractions
- **Booking System**: Complete booking/inquiry forms for tours and rentals
- **Search & Filters**: Filter tours by season, rentals by type, and locations by category

### Admin Features
- **CRUD Operations**: Full management of tours, rentals, sightseeing locations, and bookings
- **Booking Management**: View and update booking statuses
- **Dashboard**: Centralized admin panel for all management tasks

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI library
- **Vite** - Build tool
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Leaflet/React-Leaflet** - Interactive maps

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB

## 📁 Project Structure

```
journeyThroughLadakh/
├── apps/
│   ├── server/              # Backend application
│   │   ├── src/
│   │   │   ├── config/      # Database configuration
│   │   │   ├── controllers/ # Route controllers
│   │   │   ├── models/      # Mongoose models
│   │   │   ├── routes/      # API routes
│   │   │   ├── middlewares/ # Custom middlewares
│   │   │   ├── utils/       # Utility functions
│   │   │   └── index.js     # Server entry point
│   │   ├── package.json
│   │   └── .env.example
│   │
│   └── client/              # Frontend application
│       ├── src/
│       │   ├── components/  # React components
│       │   │   ├── admin/   # Admin components
│       │   │   ├── Navbar.jsx
│       │   │   ├── Footer.jsx
│       │   │   └── BookingForm.jsx
│       │   ├── pages/       # Page components
│       │   ├── services/    # API services
│       │   ├── App.jsx
│       │   └── main.jsx
│       ├── package.json
│       └── vite.config.js
│
└── README.md
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the server directory:
```bash
cd apps/server
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ladakh-tourism
```

5. Start the server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

The server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the client directory:
```bash
cd apps/client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The client will run on `http://localhost:5173`

### MongoDB Setup

**Option 1: Local MongoDB**
1. Install MongoDB locally
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/ladakh-tourism`

**Option 2: MongoDB Atlas**
1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Get your connection string
3. Update `MONGODB_URI` in `.env` file

## 📡 API Endpoints

### Tour Packages
- `GET /api/tour-packages` - Get all tour packages
- `GET /api/tour-packages/:id` - Get single tour package
- `POST /api/tour-packages` - Create tour package
- `PUT /api/tour-packages/:id` - Update tour package
- `DELETE /api/tour-packages/:id` - Delete tour package

### Rentals
- `GET /api/rentals` - Get all rentals
- `GET /api/rentals/:id` - Get single rental
- `POST /api/rentals` - Create rental
- `PUT /api/rentals/:id` - Update rental
- `DELETE /api/rentals/:id` - Delete rental

### Sightseeing
- `GET /api/sightseeing` - Get all locations
- `GET /api/sightseeing/:id` - Get single location
- `GET /api/sightseeing/nearby` - Get nearby locations
- `POST /api/sightseeing` - Create location
- `PUT /api/sightseeing/:id` - Update location
- `DELETE /api/sightseeing/:id` - Delete location

### Bookings
- `GET /api/bookings` - Get all bookings
- `GET /api/bookings/:id` - Get single booking
- `POST /api/bookings` - Create booking
- `PUT /api/bookings/:id` - Update booking
- `PATCH /api/bookings/:id/status` - Update booking status
- `DELETE /api/bookings/:id` - Delete booking

## 🎯 Usage

### For Customers

1. **Browse Tours**: Visit `/tours` to see available tour packages
2. **Browse Rentals**: Visit `/rentals` to see available vehicles
3. **View Map**: Visit `/sightseeing` to see locations on an interactive map
4. **Make Booking**: Click on any tour or rental to view details and book

### For Administrators

1. **Access Admin Panel**: Visit `/admin`
2. **Manage Content**: Use the tabs to manage tours, rentals, locations, and bookings
3. **Add New Items**: Click "Add New" buttons to create content
4. **Edit/Delete**: Use action buttons on table rows to modify content
5. **Update Bookings**: Change booking status directly from the dropdown

## 🎨 Features Breakdown

### 1. Tour Packages
- Multi-day itineraries with day-by-day breakdown
- Pricing and duration information
- Inclusions and exclusions
- Best season recommendations
- Image gallery

### 2. Vehicle Rentals
- Cars and bikes available
- Specifications (brand, model, year, capacity)
- Pricing per day
- Availability status
- Features list

### 3. Sightseeing Locations
- Interactive Leaflet map integration
- Category filtering (monastery, lake, pass, etc.)
- Entry fees and opening hours
- Geographic coordinates
- Rating system

### 4. Booking System
- Customer information capture
- Date range selection
- Number of people
- Special requests
- Status tracking (pending, confirmed, cancelled, completed)

## 🔧 Development

### Building for Production

**Backend:**
```bash
cd apps/server
npm start
```

**Frontend:**
```bash
cd apps/client
npm run build
npm run preview
```

### Code Structure Best Practices

- **Models**: Define MongoDB schemas with validation
- **Controllers**: Handle business logic and responses
- **Routes**: Define API endpoints
- **Services**: Frontend API calls abstraction
- **Components**: Reusable React components
- **Pages**: Route-level components

## 🌐 Deployment

### Backend Deployment (Heroku, Railway, etc.)
1. Set environment variables
2. Ensure MongoDB connection string is configured
3. Deploy using platform-specific commands

### Frontend Deployment (Vercel, Netlify, etc.)
1. Build the project: `npm run build`
2. Deploy the `dist` folder
3. Configure API URL environment variable

## 📝 Environment Variables

### Server (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ladakh-tourism
```

### Client (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👥 Authors

Journey Through Ladakh Team

## 🙏 Acknowledgments

- React.js community
- Express.js documentation
- MongoDB documentation
- Leaflet.js for maps

## 📞 Support

For support, email info@ladakhtourism.com

---

**Built with ❤️ for exploring the beauty of Ladakh**
