import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { rentalsAPI } from '../services/api'
import BookingForm from '../components/BookingForm'
import './RentalDetails.css'

function RentalDetails() {
  const { id } = useParams()
  const [rental, setRental] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showBooking, setShowBooking] = useState(false)

  useEffect(() => {
    fetchRental()
  }, [id])

  const fetchRental = async () => {
    try {
      const response = await rentalsAPI.getById(id)
      setRental(response.data.data)
    } catch (error) {
      console.error('Error fetching rental:', error)
    } finally {
      setLoading(false)
    }
  }

  const getAvailabilityBadge = () => {
    if (!rental) return null;
    
    const quantity = rental.totalQuantity || 1;
    
    if (quantity === 0) {
      return <span className="availability-badge unavailable">❌ Fully Booked</span>;
    } else if (quantity <= 2) {
      return <span className="availability-badge limited">⚠️ Only {quantity} left!</span>;
    } else {
      return <span className="availability-badge available">✅ {quantity} units available</span>;
    }
  }

  if (loading) return <div className="loading">Loading...</div>
  if (!rental) return <div className="error">Rental not found</div>

  return (
    <div className="rental-details-page">
      <div className="rental-header">
        <h1>{rental.name}</h1>
        <div className="rental-meta">
          <span>{rental.type === 'car' ? '🚗' : '🏍️'} {rental.type}</span>
          <span>💰 ₹{rental.pricePerDay.toLocaleString()}/day</span>
          {getAvailabilityBadge()}
        </div>
      </div>

      {rental.images && rental.images.length > 0 && (
        <div className="rental-images">
          {rental.images.map((img, idx) => (
            <img key={idx} src={img.url} alt={img.alt || rental.name} />
          ))}
        </div>
      )}

      <div className="rental-content">
        <section className="specifications">
          <h2>Specifications</h2>
          <div className="specs-grid">
            <div className="spec-item">
              <strong>Brand:</strong> {rental.brand}
            </div>
            <div className="spec-item">
              <strong>Model:</strong> {rental.model}
            </div>
            {rental.year && (
              <div className="spec-item">
                <strong>Year:</strong> {rental.year}
              </div>
            )}
            <div className="spec-item">
              <strong>Capacity:</strong> {rental.capacity} seats
            </div>
            <div className="spec-item">
              <strong>Transmission:</strong> {rental.transmission}
            </div>
            <div className="spec-item">
              <strong>Fuel Type:</strong> {rental.fuelType}
            </div>
          </div>
        </section>

        {rental.description && (
          <section className="description">
            <h2>Description</h2>
            <p>{rental.description}</p>
          </section>
        )}

        {rental.features && rental.features.length > 0 && (
          <section className="features">
            <h2>Features</h2>
            <ul>
              {rental.features.map((feature, idx) => (
                <li key={idx}>✅ {feature}</li>
              ))}
            </ul>
          </section>
        )}

        <div className="booking-section">
          {rental.available ? (
            !showBooking ? (
              <button onClick={() => setShowBooking(true)} className="btn-book">
                Book This Vehicle
              </button>
            ) : (
              <BookingForm
                itemId={rental._id}
                bookingType="rental"
                itemName={rental.name}
                onClose={() => setShowBooking(false)}
              />
            )
          ) : (
            <div className="unavailable-message">
              This vehicle is currently unavailable
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default RentalDetails
