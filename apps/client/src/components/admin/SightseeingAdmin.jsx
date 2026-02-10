import { useEffect, useState } from 'react'
import { sightseeingAPI } from '../../services/api'
import './AdminShared.css'

function SightseeingAdmin() {
  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: { type: 'Point', coordinates: [77.5771, 34.1526] }, // [lng, lat]
    category: 'monastery',
    entryFee: 0,
    featured: false
  })
  const [editId, setEditId] = useState(null)

  useEffect(() => {
    fetchLocations()
  }, [])

  const fetchLocations = async () => {
    try {
      const response = await sightseeingAPI.getAll()
      setLocations(response.data.data)
    } catch (error) {
      console.error('Error fetching locations:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this location?')) return
    try {
      await sightseeingAPI.delete(id)
      fetchLocations()
      alert('Location deleted successfully')
    } catch (error) {
      console.error('Error deleting location:', error)
      alert('Failed to delete location')
    }
  }

  const handleEdit = (location) => {
    setEditId(location._id)
    setFormData(location)
    setShowForm(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editId) {
        await sightseeingAPI.update(editId, formData)
        alert('Location updated successfully')
      } else {
        await sightseeingAPI.create(formData)
        alert('Location created successfully')
      }
      setShowForm(false)
      setEditId(null)
      setFormData({ name: '', description: '', location: { type: 'Point', coordinates: [77.5771, 34.1526] }, category: 'monastery', entryFee: 0, featured: false })
      fetchLocations()
    } catch (error) {
      console.error('Error saving location:', error)
      alert('Failed to save location')
    }
  }

  if (loading) return <div className="loading">Loading...</div>

  return (
    <div className="admin-section">
      <div className="section-header">
        <h2>Sightseeing Locations Management</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Cancel' : 'Add New Location'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="admin-form">
          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          >
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
          <input
            type="number"
            placeholder="Entry Fee"
            value={formData.entryFee}
            onChange={(e) => setFormData({ ...formData, entryFee: parseFloat(e.target.value) })}
          />
          <label>
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
            />
            Featured
          </label>
          <button type="submit" className="btn-primary">
            {editId ? 'Update' : 'Create'} Location
          </button>
        </form>
      )}

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Entry Fee</th>
              <th>Featured</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {locations.map((location) => (
              <tr key={location._id}>
                <td>{location.name}</td>
                <td>{location.category}</td>
                <td>₹{location.entryFee}</td>
                <td>{location.featured ? '⭐' : '-'}</td>
                <td>
                  <button onClick={() => handleEdit(location)} className="btn-edit">Edit</button>
                  <button onClick={() => handleDelete(location._id)} className="btn-delete">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default SightseeingAdmin
