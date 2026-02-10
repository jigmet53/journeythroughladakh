import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>Journey Through Ladakh</h3>
          <p>Your gateway to exploring the beauty of Ladakh</p>
        </div>
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/tours">Tour Packages</a></li>
            <li><a href="/rentals">Rentals</a></li>
            <li><a href="/sightseeing">Sightseeing</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Contact Us</h4>
          <p>Email: info@ladakhtourism.com</p>
          <p>Phone: +91 1234567890</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 Journey Through Ladakh. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer
