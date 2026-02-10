import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { rentalsAPI } from '../services/api'
import './Rentals.css'

function Rentals() {
  const [rentals, setRentals] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState({ search: '', type: '', available: 'true' })

  useEffect(() => {
    fetchRentals()
  }, [filter])

  const fetchRentals = async () => {
    setLoading(true)
    try {
      const params = {}
      if (filter.search) params.search = filter.search
      if (filter.type) params.type = filter.type
      if (filter.available) params.available = filter.available

      const response = await rentalsAPI.getAll(params)
      setRentals(response.data.data)
    } catch (error) {
      console.error('Error fetching rentals:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rentals-page">
      <div className="page-header">
        <h1>Vehicle Rentals</h1>
        <p>Rent cars and bikes for your Ladakh adventure</p>
      </div>

      <div className="filters">
        <input
          type="text"
          placeholder="Search vehicles..."
          value={filter.search}
          onChange={(e) => setFilter({ ...filter, search: e.target.value })}
          className="search-input"
        />
        <select
          value={filter.type}
          onChange={(e) => setFilter({ ...filter, type: e.target.value })}
          className="type-select"
        >
          <option value="">All Types</option>
          <option value="car">Cars</option>
          <option value="bike">Bikes</option>
        </select>
        <select
          value={filter.available}
          onChange={(e) => setFilter({ ...filter, available: e.target.value })}
          className="availability-select"
        >
          <option value="">All</option>
          <option value="true">Available</option>
          <option value="false">Unavailable</option>
        </select>
      </div>

      {loading ? (
        <div className="loading">Loading rentals...</div>
      ) : rentals.length === 0 ? (
        <div className="no-results">No rentals found</div>
      ) : (
        <div className="rentals-grid">
          {rentals.map((rental) => (
            <div key={rental._id} className="rental-card">
              {rental.images && rental.images[0] && (
                <div className="rental-image">
                  <img src={rental.images[0].url} alt={rental.images[0].alt || rental.name} />
                  {!rental.available && <div className="unavailable-badge">Unavailable</div>}
                </div>
              )}
              <div className="rental-content">
                <h3>{rental.name}</h3>
                <div className="rental-details">
                  <span className="type">{rental.type === 'car' ? '🚗' : '🏍️'} {rental.type}</span>
                  <span className="brand">{rental.brand} {rental.model}</span>
                  <span className="capacity">👥 {rental.capacity} seats</span>
                  <span className="transmission">⚙️ {rental.transmission}</span>
                  <span className="fuel">⛽ {rental.fuelType}</span>
                </div>
                <p className="price">₹{rental.pricePerDay.toLocaleString()}/day</p>
                <Link to={`/rentals/${rental._id}`} className="btn-view">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Rentals
