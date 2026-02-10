import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { sightseeingAPI } from '../services/api'
import 'leaflet/dist/leaflet.css'
import './Sightseeing.css'

// Fix for default marker icons in react-leaflet
import L from 'leaflet'
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

function Sightseeing() {
  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState({ search: '', category: '', featured: '' })
  const [selectedLocation, setSelectedLocation] = useState(null)

  // Leh coordinates as default center
  const defaultCenter = [34.1526, 77.5771]

  useEffect(() => {
    fetchLocations()
  }, [filter])

  const fetchLocations = async () => {
    setLoading(true)
    try {
      const params = {}
      if (filter.search) params.search = filter.search
      if (filter.category) params.category = filter.category
      if (filter.featured) params.featured = filter.featured

      const response = await sightseeingAPI.getAll(params)
      setLocations(response.data.data)
    } catch (error) {
      console.error('Error fetching locations:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="sightseeing-page">
      <div className="page-header">
        <h1>Sightseeing Locations</h1>
        <p>Explore famous attractions and hidden gems of Ladakh</p>
      </div>

      <div className="filters">
        <input
          type="text"
          placeholder="Search locations..."
          value={filter.search}
          onChange={(e) => setFilter({ ...filter, search: e.target.value })}
          className="search-input"
        />
        <select
          value={filter.category}
          onChange={(e) => setFilter({ ...filter, category: e.target.value })}
          className="category-select"
        >
          <option value="">All Categories</option>
          <option value="monastery">Monastery</option>
          <option value="lake">Lake</option>
          <option value="pass">Pass</option>
          <option value="palace">Palace</option>
          <option value="museum">Museum</option>
          <option value="market">Market</option>
          <option value="natural">Natural</option>
          <option value="cultural">Cultural</option>
          <option value="adventure">Adventure</option>
          <option value="other">Other</option>
        </select>
        <select
          value={filter.featured}
          onChange={(e) => setFilter({ ...filter, featured: e.target.value })}
          className="featured-select"
        >
          <option value="">All</option>
          <option value="true">Featured Only</option>
        </select>
      </div>

      {loading ? (
        <div className="loading">Loading locations...</div>
      ) : (
        <>
          <div className="map-container">
            <MapContainer 
              center={defaultCenter} 
              zoom={10} 
              style={{ height: '500px', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {locations.map((location) => (
                <Marker
                  key={location._id}
                  position={[location.location.coordinates[1], location.location.coordinates[0]]}
                  eventHandlers={{
                    click: () => setSelectedLocation(location)
                  }}
                >
                  <Popup>
                    <div className="map-popup">
                      <h3>{location.name}</h3>
                      <p>{location.category}</p>
                      {location.rating > 0 && <p>⭐ {location.rating}/5</p>}
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          <div className="locations-list">
            <h2>All Locations ({locations.length})</h2>
            <div className="locations-grid">
              {locations.map((location) => (
                <div 
                  key={location._id} 
                  className={`location-card ${selectedLocation?._id === location._id ? 'selected' : ''}`}
                  onClick={() => setSelectedLocation(location)}
                >
                  {location.images && location.images[0] && (
                    <img src={location.images[0].url} alt={location.images[0].alt || location.name} />
                  )}
                  <div className="location-content">
                    <h3>{location.name}</h3>
                    <p className="category">📍 {location.category}</p>
                    {location.rating > 0 && (
                      <p className="rating">⭐ {location.rating}/5</p>
                    )}
                    {location.entryFee > 0 && (
                      <p className="fee">Entry: ₹{location.entryFee}</p>
                    )}
                    <p className="description">{location.description.substring(0, 100)}...</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {selectedLocation && (
            <div className="location-details-modal">
              <div className="modal-content">
                <button className="close-btn" onClick={() => setSelectedLocation(null)}>×</button>
                <h2>{selectedLocation.name}</h2>
                <p className="category">Category: {selectedLocation.category}</p>
                {selectedLocation.rating > 0 && (
                  <p className="rating">Rating: ⭐ {selectedLocation.rating}/5</p>
                )}
                <p className="description">{selectedLocation.description}</p>
                {selectedLocation.address && <p>📍 {selectedLocation.address}</p>}
                {selectedLocation.openingHours && <p>🕐 {selectedLocation.openingHours}</p>}
                {selectedLocation.entryFee > 0 && <p>💰 Entry Fee: ₹{selectedLocation.entryFee}</p>}
                {selectedLocation.bestTimeToVisit && (
                  <p>🌤️ Best Time: {selectedLocation.bestTimeToVisit}</p>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Sightseeing
