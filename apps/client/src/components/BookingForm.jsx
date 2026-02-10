import { useState } from 'react'
import { bookingsAPI } from '../services/api'
import './BookingForm.css'

function BookingForm({ itemId, bookingType, itemName, onClose }) {
  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    phone: '',
    numberOfPeople: 1,
    startDate: '',
    endDate: '',
    totalPrice: 0,
    message: '',
    specialRequests: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const bookingData = {
        ...formData,
        itemId,
        bookingType,
        numberOfPeople: parseInt(formData.numberOfPeople),
        totalPrice: parseFloat(formData.totalPrice)
      }

      await bookingsAPI.create(bookingData)
      setSuccess(true)
      setTimeout(() => {
        onClose && onClose()
      }, 2000)
    } catch (error) {
      console.error('Booking error:', error)
      alert('Failed to create booking. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="booking-success">
        <h2>✅ Booking Successful!</h2>
        <p>Thank you for your booking. We will contact you soon.</p>
      </div>
    )
  }

  return (
    <div className="booking-form-container">
      <h2>📋 Book: {itemName}</h2>
      <form onSubmit={handleSubmit} className="booking-form">
        {/* Personal Information Section */}
        <div className="form-group">
          <label>👤 Full Name</label>
          <input
            type="text"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            placeholder="Enter your full name"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>📧 Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your.email@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label>📱 Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 9876543210"
              required
            />
          </div>
        </div>

        {/* Booking Details Section */}
        <div className="form-row">
          <div className="form-group">
            <label>👥 Number of People</label>
            <input
              type="number"
              name="numberOfPeople"
              value={formData.numberOfPeople}
              onChange={handleChange}
              min="1"
              placeholder="1"
              required
            />
          </div>

          <div className="form-group">
            <label>💰 Total Price (₹)</label>
            <input
              type="number"
              name="totalPrice"
              value={formData.totalPrice}
              onChange={handleChange}
              min="0"
              placeholder="0"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>📅 Start Date</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          <div className="form-group">
            <label>📅 End Date</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              min={formData.startDate || new Date().toISOString().split('T')[0]}
              required
            />
          </div>
        </div>

        {/* Additional Information Section */}
        <div className="form-group">
          <label>💬 Message (Optional)</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows="3"
            placeholder="Any additional information or questions..."
          />
        </div>

        <div className="form-group">
          <label>⭐ Special Requests (Optional)</label>
          <textarea
            name="specialRequests"
            value={formData.specialRequests}
            onChange={handleChange}
            rows="3"
            placeholder="Any special requirements or preferences..."
          />
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? '⏳ Processing...' : '✓ Confirm Booking'}
          </button>
          {onClose && (
            <button type="button" onClick={onClose} className="btn-secondary">
              ✕ Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

export default BookingForm
