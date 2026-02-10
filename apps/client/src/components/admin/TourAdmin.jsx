import { useEffect, useState } from 'react'
import { tourPackagesAPI } from '../../services/api'
import './AdminShared.css'

function TourAdmin() {
  const [tours, setTours] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    duration: '',
    price: 0,
    inclusions: [],
    exclusions: [],
    bestSeason: []
  })
  const [editId, setEditId] = useState(null)

  useEffect(() => {
    fetchTours()
  }, [])

  const fetchTours = async () => {
    try {
      const response = await tourPackagesAPI.getAll()
      setTours(response.data.data)
    } catch (error) {
      console.error('Error fetching tours:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this tour?')) return
    try {
      await tourPackagesAPI.delete(id)
      fetchTours()
      alert('Tour deleted successfully')
    } catch (error) {
      console.error('Error deleting tour:', error)
      alert('Failed to delete tour')
    }
  }

  const handleEdit = (tour) => {
    setEditId(tour._id)
    setFormData(tour)
    setShowForm(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editId) {
        await tourPackagesAPI.update(editId, formData)
        alert('Tour updated successfully')
      } else {
        await tourPackagesAPI.create(formData)
        alert('Tour created successfully')
      }
      setShowForm(false)
      setEditId(null)
      setFormData({ title: '', duration: '', price: 0, inclusions: [], exclusions: [], bestSeason: [] })
      fetchTours()
    } catch (error) {
      console.error('Error saving tour:', error)
      alert('Failed to save tour')
    }
  }

  if (loading) return <div className="loading">Loading...</div>

  return (
    <div className="admin-section">
      <div className="section-header">
        <h2>Tour Packages Management</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Cancel' : 'Add New Tour'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="admin-form">
          <input
            type="text"
            placeholder="Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Duration (e.g., 5N/6D)"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Price"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
            required
          />
          <button type="submit" className="btn-primary">
            {editId ? 'Update' : 'Create'} Tour
          </button>
        </form>
      )}

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Duration</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tours.map((tour) => (
              <tr key={tour._id}>
                <td>{tour.title}</td>
                <td>{tour.duration}</td>
                <td>₹{tour.price.toLocaleString()}</td>
                <td>
                  <button onClick={() => handleEdit(tour)} className="btn-edit">Edit</button>
                  <button onClick={() => handleDelete(tour._id)} className="btn-delete">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default TourAdmin
