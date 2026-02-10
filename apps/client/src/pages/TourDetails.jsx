import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { tourPackagesAPI } from '../services/api'
import BookingForm from '../components/BookingForm'
import './TourDetails.css'

function TourDetails() {
  const { id } = useParams()
  const [tour, setTour] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showBooking, setShowBooking] = useState(false)

  useEffect(() => {
    fetchTour()
  }, [id])

  const fetchTour = async () => {
    try {
      const response = await tourPackagesAPI.getById(id)
      setTour(response.data.data)
    } catch (error) {
      console.error('Error fetching tour:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="loading">Loading...</div>
  if (!tour) return <div className="error">Tour not found</div>

  return (
    <div className="tour-details-page">
      <nav className="breadcrumb">
        <Link to="/">Home</Link>
        <span> / </span>
        <Link to="/tours">Tours</Link>
        <span> / </span>
        <span>{tour.title}</span>
      </nav>

      <Link to="/tours" className="back-button">
        ← Back to All Tours
      </Link>

      <div className="tour-header">
        <h1>{tour.title}</h1>
        <div className="tour-meta-info">
          <div className="meta-item">
            <span>⏱️</span>
            <strong>{tour.duration}</strong>
          </div>
          <div className="meta-item">
            <span>💰</span>
            <strong>₹{tour.price.toLocaleString()}</strong>
          </div>
          {tour.bestSeason && tour.bestSeason.length > 0 && (
            <div className="meta-item">
              <span>🌤️</span>
              <strong>Best Season: {tour.bestSeason.join(', ')}</strong>
            </div>
          )}
        </div>
      </div>

      {tour.images && tour.images.length > 0 && (
        <div className="tour-images">
          {tour.images.map((img, idx) => (
            <img key={idx} src={img.url} alt={img.alt || tour.title} />
          ))}
        </div>
      )}

      <div className="tour-content">
        <section className="itinerary-section">
          <h2>📅 Day-by-Day Itinerary</h2>
          {tour.itinerary && tour.itinerary.length > 0 ? (
            <div className="itinerary-list">
              {tour.itinerary.map((day, idx) => (
                <div key={idx} className="itinerary-day">
                  <div className="day-number">Day {day.dayNumber}</div>
                  <div className="day-content">
                    <h3>{day.title}</h3>
                    <p>{day.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No itinerary available</p>
          )}
        </section>

        <div className="two-columns">
          {tour.inclusions && tour.inclusions.length > 0 && (
            <section className="inclusions-section">
              <h2>✅ What's Included</h2>
              <ul className="inclusions-list">
                {tour.inclusions.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </section>
          )}

          {tour.exclusions && tour.exclusions.length > 0 && (
            <section className="exclusions-section">
              <h2>❌ What's Not Included</h2>
              <ul className="exclusions-list">
                {tour.exclusions.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <div className="booking-section">
          <h3>Ready for an Adventure?</h3>
          <p className="price-highlight">₹{tour.price.toLocaleString()}</p>
          <p>Per person for {tour.duration}</p>
          {!showBooking ? (
            <button onClick={() => setShowBooking(true)} className="btn-book">
              📞 Book This Tour Now
            </button>
          ) : (
            <BookingForm
              itemId={tour._id}
              bookingType="tour"
              itemName={tour.title}
              onClose={() => setShowBooking(false)}
            />
          )}
        </div>
      </div>

      <div className="sticky-booking-bar">
        <div className="sticky-content">
          <div className="sticky-info">
            <h4>{tour.title}</h4>
            <p>₹{tour.price.toLocaleString()} / person</p>
          </div>
          <button onClick={() => setShowBooking(true)} className="btn-book-sticky">
            Book Now
          </button>
        </div>
      </div>
    </div>
  )
}

export default TourDetails
