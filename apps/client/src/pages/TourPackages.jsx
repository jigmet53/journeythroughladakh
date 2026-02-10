import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { tourPackagesAPI } from '../services/api'
import './TourPackages.css'

function TourPackages() {
  const [tours, setTours] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState({ search: '', season: '' })

  useEffect(() => {
    fetchTours()
  }, [filter])

  const fetchTours = async () => {
    setLoading(true)
    try {
      const params = {}
      if (filter.search) params.search = filter.search
      if (filter.season) params.season = filter.season

      const response = await tourPackagesAPI.getAll(params)
      setTours(response.data.data)
    } catch (error) {
      console.error('Error fetching tours:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="tour-packages-page">
      <div className="page-header">
        <h1>Tour Packages</h1>
        <p>Explore our curated multi-day tour packages across Ladakh</p>
      </div>

      <div className="filters">
        <input
          type="text"
          placeholder="Search tours..."
          value={filter.search}
          onChange={(e) => setFilter({ ...filter, search: e.target.value })}
          className="search-input"
        />
        <select
          value={filter.season}
          onChange={(e) => setFilter({ ...filter, season: e.target.value })}
          className="season-select"
        >
          <option value="">All Seasons</option>
          <option value="summer">Summer</option>
          <option value="winter">Winter</option>
          <option value="spring">Spring</option>
          <option value="autumn">Autumn</option>
        </select>
      </div>

      {loading ? (
        <div className="loading">Loading tours...</div>
      ) : tours.length === 0 ? (
        <div className="no-results">No tours found</div>
      ) : (
        <div className="tours-grid">
          {tours.map((tour) => (
            <div key={tour._id} className="tour-card">
              {tour.images && tour.images[0] && (
                <div className="tour-image">
                  <img src={tour.images[0].url} alt={tour.images[0].alt || tour.title} />
                </div>
              )}
              <div className="tour-content">
                <h3>{tour.title}</h3>
                <div className="tour-meta">
                  <span className="duration">⏱️ {tour.duration}</span>
                  {tour.bestSeason && tour.bestSeason.length > 0 && (
                    <span className="season">🌤️ {tour.bestSeason.join(', ')}</span>
                  )}
                </div>
                <p className="price">₹{tour.price.toLocaleString()}</p>
                <Link to={`/tours/${tour._id}`} className="btn-view">
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

export default TourPackages
