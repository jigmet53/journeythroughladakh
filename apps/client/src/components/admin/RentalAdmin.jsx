import { useEffect, useState } from 'react'
import { rentalsAPI } from '../../services/api'
import './AdminShared.css'

function RentalAdmin() {
  const [rentals, setRentals] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    type: 'car',
    brand: '',
    model: '',
    pricePerDay: 0,
    capacity: 1,
    transmission: 'manual',
    fuelType: 'petrol',
    available: true
  })
  const [editId, setEditId] = useState(null)

  useEffect(() => {
    fetchRentals()
  }, [])

  const fetchRentals = async () => {
    try {
      const response = await rentalsAPI.getAll()
      setRentals(response.data.data)
    } catch (error) {
      console.error('Error fetching rentals:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this rental?')) return
    try {
      await rentalsAPI.delete(id)
      fetchRentals()
      alert('Rental deleted successfully')
    } catch (error) {
      console.error('Error deleting rental:', error)
      alert('Failed to delete rental')
    }
  }

  const handleEdit = (rental) => {
    setEditId(rental._id)
    setFormData(rental)
    setShowForm(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editId) {
        await rentalsAPI.update(editId, formData)
        alert('Rental updated successfully')
      } else {
        await rentalsAPI.create(formData)
        alert('Rental created successfully')
      }
      setShowForm(false)
      setEditId(null)
      setFormData({ name: '', type: 'car', brand: '', model: '', pricePerDay: 0, capacity: 1, transmission: 'manual', fuelType: 'petrol', available: true })
      fetchRentals()
    } catch (error) {
      console.error('Error saving rental:', error)
      alert('Failed to save rental')
    }
  }

  if (loading) return <div className="loading">Loading...</div>

  return (
    <div className="admin-section">
      <div className="section-header">
        <h2>Rentals Management</h2>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Cancel' : 'Add New Rental'}
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
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          >
            <option value="car">Car</option>
            <option value="bike">Bike</option>
          </select>
          <input
            type="text"
            placeholder="Brand"
            value={formData.brand}
            onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Model"
            value={formData.model}
            onChange={(e) => setFormData({ ...formData, model: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Price Per Day"
            value={formData.pricePerDay}
            onChange={(e) => setFormData({ ...formData, pricePerDay: parseFloat(e.target.value) })}
            required
          />
          <button type="submit" className="btn-primary">
            {editId ? 'Update' : 'Create'} Rental
          </button>
        </form>
      )}

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Brand/Model</th>
              <th>Price/Day</th>
              <th>Available</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rentals.map((rental) => (
              <tr key={rental._id}>
                <td>{rental.name}</td>
                <td>{rental.type}</td>
                <td>{rental.brand} {rental.model}</td>
                <td>₹{rental.pricePerDay.toLocaleString()}</td>
                <td>{rental.available ? '✅' : '❌'}</td>
                <td>
                  <button onClick={() => handleEdit(rental)} className="btn-edit">Edit</button>
                  <button onClick={() => handleDelete(rental._id)} className="btn-delete">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default RentalAdmin
