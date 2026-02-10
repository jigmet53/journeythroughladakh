import { useEffect, useState } from 'react'
import { bookingsAPI } from '../../services/api'
import './AdminShared.css'

function BookingAdmin() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      const response = await bookingsAPI.getAll()
      setBookings(response.data.data)
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await bookingsAPI.updateStatus(id, newStatus)
      fetchBookings()
      
      // Show the detailed message from server
      const message = response.data.message || 'Status updated successfully'
      alert(message)
    } catch (error) {
      console.error('Error updating status:', error)
      alert('Failed to update status: ' + (error.response?.data?.message || error.message))
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this booking?')) return

    try {
      await bookingsAPI.delete(id)
      fetchBookings()
      alert('Booking deleted successfully')
    } catch (error) {
      console.error('Error deleting booking:', error)
      alert('Failed to delete booking')
    }
  }

  if (loading) return <div className="loading">Loading...</div>

  return (
    <div className="admin-section">
      <h2>Bookings Management</h2>
      
      {bookings.length === 0 ? (
        <p>No bookings found</p>
      ) : (
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Type</th>
                <th>People</th>
                <th>Dates</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id}>
                  <td>{booking.customerName}</td>
                  <td>{booking.email}</td>
                  <td>{booking.phone}</td>
                  <td>{booking.bookingType}</td>
                  <td>{booking.numberOfPeople}</td>
                  <td>
                    {new Date(booking.startDate).toLocaleDateString()} -
                    {new Date(booking.endDate).toLocaleDateString()}
                  </td>
                  <td>₹{booking.totalPrice.toLocaleString()}</td>
                  <td>
                    <select
                      value={booking.status}
                      onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                      className={`status-badge status-${booking.status}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="completed">Completed</option>
                    </select>
                  </td>
                  <td>
                    <button onClick={() => handleDelete(booking._id)} className="btn-delete">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default BookingAdmin
