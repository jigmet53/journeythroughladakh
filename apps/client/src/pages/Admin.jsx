import { useState } from 'react'
import TourAdmin from '../components/admin/TourAdmin'
import RentalAdmin from '../components/admin/RentalAdmin'
import SightseeingAdmin from '../components/admin/SightseeingAdmin'
import BookingAdmin from '../components/admin/BookingAdmin'
import './Admin.css'

function Admin() {
  const [activeTab, setActiveTab] = useState('tours')

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Manage your tours, rentals, sightseeing locations, and bookings</p>
      </div>

      <div className="admin-tabs">
        <button
          className={activeTab === 'tours' ? 'active' : ''}
          onClick={() => setActiveTab('tours')}
        >
          Tour Packages
        </button>
        <button
          className={activeTab === 'rentals' ? 'active' : ''}
          onClick={() => setActiveTab('rentals')}
        >
          Rentals
        </button>
        <button
          className={activeTab === 'sightseeing' ? 'active' : ''}
          onClick={() => setActiveTab('sightseeing')}
        >
          Sightseeing
        </button>
        <button
          className={activeTab === 'bookings' ? 'active' : ''}
          onClick={() => setActiveTab('bookings')}
        >
          Bookings
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'tours' && <TourAdmin />}
        {activeTab === 'rentals' && <RentalAdmin />}
        {activeTab === 'sightseeing' && <SightseeingAdmin />}
        {activeTab === 'bookings' && <BookingAdmin />}
      </div>
    </div>
  )
}

export default Admin
