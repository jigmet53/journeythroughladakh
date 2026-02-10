import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import TourPackages from './pages/TourPackages'
import TourDetails from './pages/TourDetails'
import Rentals from './pages/Rentals'
import RentalDetails from './pages/RentalDetails'
import Sightseeing from './pages/Sightseeing'
import About from './pages/About'
import Contact from './pages/Contact'
import Admin from './pages/Admin'
import Login from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'
import './App.css'

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/tours" element={<TourPackages />} />
              <Route path="/tours/:id" element={<TourDetails />} />
              <Route path="/rentals" element={<Rentals />} />
              <Route path="/rentals/:id" element={<RentalDetails />} />
              <Route path="/sightseeing" element={<Sightseeing />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <Admin />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  )
}

export default App
