import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { tourPackagesAPI, rentalsAPI } from '../services/api'
import './Home.css'

function Home() {
  const [tours, setTours] = useState([])
  const [rentals, setRentals] = useState([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [toursRes, rentalsRes] = await Promise.all([
        tourPackagesAPI.getAll(),
        rentalsAPI.getAll({ available: true })
      ])
      setTours(toursRes.data.data.slice(0, 3))
      setRentals(rentalsRes.data.data.slice(0, 3))
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-badge">🏔️ Premium Travel Experience</div>
          <h1 className="hero-title">
            Discover the Magic of <span className="highlight">Ladakh</span>
          </h1>
          <p className="hero-subtitle">
            Experience breathtaking landscapes, rich culture, and unforgettable adventures
            <br />in the land of high passes
          </p>
          <div className="hero-buttons">
            <Link to="/tours" className="btn-primary">
              <span>Explore Tours</span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <Link to="/rentals" className="btn-secondary">
              <span>Rent Vehicles</span>
            </Link>
          </div>
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-number">500+</div>
              <div className="stat-label">Happy Travelers</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-number">50+</div>
              <div className="stat-label">Tour Packages</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-number">4.8★</div>
              <div className="stat-label">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Curated Experiences</h3>
              <p>Handpicked tours designed for authentic Ladakh adventures</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🚗</div>
              <h3>Quality Vehicles</h3>
              <p>Well-maintained cars and bikes for safe mountain travel</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h3>Best Prices</h3>
              <p>Competitive rates with no hidden charges guaranteed</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🤝</div>
              <h3>24/7 Support</h3>
              <p>Round-the-clock assistance throughout your journey</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Tours Section */}
      <section className="featured-tours">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">Popular Choices</div>
            <h2>Featured Tour Packages</h2>
            <p className="section-description">
              Explore our most loved tour packages crafted for unforgettable experiences
            </p>
          </div>
          <div className="tours-grid">
            {tours.map((tour) => (
              <div key={tour._id} className="tour-card">
                <div className="card-image-wrapper">
                  <img 
                    src={tour.images && tour.images[0] ? tour.images[0].url : 'https://images.unsplash.com/photo-1591825729269-caeb344f6df2?w=800&q=80'} 
                    alt={tour.images && tour.images[0] ? tour.images[0].alt || tour.title : tour.title}
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1591825729269-caeb344f6df2?w=800&q=80' }}
                  />
                  <div className="card-badge">Featured</div>
                </div>
                <div className="tour-card-content">
                  <h3>{tour.title}</h3>
                  <p className="tour-description">{tour.description?.substring(0, 80)}...</p>
                  <div className="tour-meta">
                    <span className="meta-item">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm1 12H7V7h2v5zm0-6H7V4h2v2z"/>
                      </svg>
                      {tour.duration}
                    </span>
                  </div>
                  <div className="card-footer">
                    <div className="price-section">
                      <span className="price-label">Starting from</span>
                      <span className="price">₹{tour.price.toLocaleString()}</span>
                    </div>
                    <Link to={`/tours/${tour._id}`} className="btn-view">
                      View Details
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="section-footer">
            <Link to="/tours" className="btn-more">
              View All Tours
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Rentals Section */}
      <section className="featured-rentals">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">Fleet Selection</div>
            <h2>Popular Rentals</h2>
            <p className="section-description">
              Choose from our premium collection of vehicles perfect for Ladakh terrain
            </p>
          </div>
          <div className="rentals-grid">
            {rentals.map((rental) => (
              <div key={rental._id} className="rental-card">
                <div className="card-image-wrapper">
                  <img 
                    src={rental.images && rental.images[0] ? rental.images[0].url : (rental.type === 'bike' ? 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&q=80' : 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80')}
                    alt={rental.images && rental.images[0] ? rental.images[0].alt || rental.name : rental.name}
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80' }}
                  />
                  <div className={`card-badge ${rental.available ? 'available' : 'unavailable'}`}>
                    {rental.available ? '✓ Available' : 'Unavailable'}
                  </div>
                </div>
                <div className="rental-card-content">
                  <div className="rental-header">
                    <h3>{rental.name}</h3>
                    <span className="rental-type-badge">
                      {rental.type === 'car' ? '🚗' : '🏍️'} {rental.type.toUpperCase()}
                    </span>
                  </div>
                  <p className="rental-description">{rental.description?.substring(0, 70)}...</p>
                  <div className="rental-specs">
                    <span className="spec-item">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zM7 12V7h2v5H7zm0-6V4h2v2H7z"/>
                      </svg>
                      {rental.capacity || 4} Seats
                    </span>
                  </div>
                  <div className="card-footer">
                    <div className="price-section">
                      <span className="price-label">Per day</span>
                      <span className="price">₹{rental.pricePerDay.toLocaleString()}</span>
                    </div>
                    <Link to={`/rentals/${rental._id}`} className="btn-view">
                      View Details
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="section-footer">
            <Link to="/rentals" className="btn-more">
              View All Rentals
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready for an Adventure?</h2>
            <p>Contact us today to plan your perfect Ladakh journey and create memories that last a lifetime</p>
            <div className="cta-buttons">
              <Link to="/sightseeing" className="btn-primary">
                <span>Explore Sightseeing</span>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
              <a href="tel:+911234567890" className="btn-outline">
                📞 Call Us Now
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
