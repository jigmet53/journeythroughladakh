import './About.css'

function About() {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>About Journey Through Ladakh</h1>
          <p>Your trusted companion for exploring the enchanting beauty of Ladakh</p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="our-story">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">Our Story</div>
            <h2>Bringing Ladakh Closer to You</h2>
          </div>
          <div className="story-content">
            <div className="story-text">
              <p>
                Founded with a passion for adventure and deep love for Ladakh, Journey Through Ladakh has been 
                connecting travelers with the magical Himalayan region for years. Our journey began with a simple 
                dream - to make the wonders of Ladakh accessible to everyone.
              </p>
              <p>
                From the pristine lakes of Pangong Tso to the ancient monasteries perched on mountainsides, we 
                curate experiences that showcase the best of what Ladakh has to offer. Our team of local experts 
                and travel enthusiasts work tirelessly to ensure every journey is memorable, safe, and authentic.
              </p>
              <p>
                We believe in responsible tourism that respects local culture and preserves the natural beauty 
                of this incredible region for generations to come.
              </p>
            </div>
            <div className="story-image">
              <img 
                src="https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80" 
                alt="Ladakh Mountain Landscape"
                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=800&q=80' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission & Vision */}
      <section className="mission-vision">
        <div className="container">
          <div className="mv-grid">
            <div className="mv-card mission">
              <div className="mv-icon">🎯</div>
              <h3>Our Mission</h3>
              <p>
                To provide exceptional travel experiences that connect people with the breathtaking 
                landscapes and rich culture of Ladakh, while promoting sustainable and responsible tourism 
                practices that benefit local communities.
              </p>
            </div>
            <div className="mv-card vision">
              <div className="mv-icon">🌟</div>
              <h3>Our Vision</h3>
              <p>
                To be the leading travel platform for Ladakh tourism, recognized for our commitment to 
                quality, authenticity, and sustainability. We envision a future where every traveler 
                experiences the true essence of Ladakh.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="why-choose-us">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">Why Choose Us</div>
            <h2>What Makes Us Different</h2>
          </div>
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon">🗺️</div>
              <h3>Local Expertise</h3>
              <p>Our team consists of local guides who know every corner of Ladakh intimately</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🛡️</div>
              <h3>Safety First</h3>
              <p>Your safety is our priority with well-maintained vehicles and experienced drivers</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">💎</div>
              <h3>Quality Service</h3>
              <p>We maintain high standards in all our offerings, from tours to rentals</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🤝</div>
              <h3>Personalized Experience</h3>
              <p>Customized itineraries tailored to your preferences and travel style</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">💰</div>
              <h3>Best Value</h3>
              <p>Competitive pricing with transparent policies and no hidden charges</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🌱</div>
              <h3>Eco-Friendly</h3>
              <p>Committed to sustainable tourism and environmental conservation</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">1000+</div>
              <div className="stat-label">Happy Travelers</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">50+</div>
              <div className="stat-label">Tour Packages</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">30+</div>
              <div className="stat-label">Vehicles</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">4.9/5</div>
              <div className="stat-label">Customer Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="our-values">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">Our Values</div>
            <h2>What We Stand For</h2>
          </div>
          <div className="values-grid">
            <div className="value-card">
              <h4>Authenticity</h4>
              <p>We showcase the real Ladakh - its people, culture, and natural beauty</p>
            </div>
            <div className="value-card">
              <h4>Integrity</h4>
              <p>Honest and transparent in all our dealings with customers and partners</p>
            </div>
            <div className="value-card">
              <h4>Excellence</h4>
              <p>Constantly improving our services to exceed customer expectations</p>
            </div>
            <div className="value-card">
              <h4>Sustainability</h4>
              <p>Protecting Ladakh's environment and supporting local communities</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-cta">
        <div className="container">
          <h2>Ready to Start Your Ladakh Adventure?</h2>
          <p>Let us help you plan an unforgettable journey through the land of high passes</p>
          <div className="cta-buttons">
            <a href="/tours" className="btn-primary">
              Explore Tours
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
            <a href="/contact" className="btn-secondary">
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About
