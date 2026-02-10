const nodemailer = require('nodemailer');

// Create email transporter
const createTransporter = () => {
  // Check if email is configured
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD || 
      process.env.EMAIL_USER === 'your-email@gmail.com') {
    return null; // Email not configured
  }
  
  // For development, you can use Gmail or other SMTP service
  // For production, use services like SendGrid, AWS SES, etc.
  
  return nodemailer.createTransporter({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

// Send booking confirmation email
const sendBookingConfirmationEmail = async (booking) => {
  try {
    const transporter = createTransporter();
    
    // If email not configured, skip sending but return success
    if (!transporter) {
      console.log(`📧 Email not configured. Customer ${booking.email} should be notified via phone: ${booking.phone}`);
      return { 
        success: true, 
        message: 'Email not configured. Please contact customer via phone.',
        emailConfigured: false 
      };
    }
    
    const itemName = booking.itemId?.name || 'Item';
    const startDate = new Date(booking.startDate).toLocaleDateString('en-IN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    const endDate = new Date(booking.endDate).toLocaleDateString('en-IN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: booking.email,
      subject: `🎉 Booking Confirmed - ${itemName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
            .detail-row:last-child { border-bottom: none; }
            .label { font-weight: bold; color: #667eea; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Booking Confirmed!</h1>
              <p>Your booking has been confirmed by our team</p>
            </div>
            <div class="content">
              <h2>Hello ${booking.customerName},</h2>
              <p>Great news! Your booking has been confirmed. Here are your booking details:</p>
              
              <div class="booking-details">
                <div class="detail-row">
                  <span class="label">Booking ID:</span>
                  <span>${booking._id}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Item:</span>
                  <span>${itemName}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Start Date:</span>
                  <span>${startDate}</span>
                </div>
                <div class="detail-row">
                  <span class="label">End Date:</span>
                  <span>${endDate}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Number of People:</span>
                  <span>${booking.numberOfPeople}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Total Price:</span>
                  <span>₹${booking.totalPrice.toLocaleString()}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Status:</span>
                  <span style="color: #10b981; font-weight: bold;">CONFIRMED</span>
                </div>
              </div>

              ${booking.specialRequests ? `
                <div class="booking-details">
                  <div class="detail-row">
                    <span class="label">Your Special Requests:</span>
                  </div>
                  <p>${booking.specialRequests}</p>
                </div>
              ` : ''}

              <p style="margin-top: 20px;">
                <strong>What's Next?</strong><br>
                We will contact you at <strong>${booking.phone}</strong> within 24 hours to finalize the details and arrange payment.
              </p>

              <p style="margin-top: 20px;">
                If you have any questions, feel free to reply to this email or contact us at ${booking.phone}.
              </p>

              <p style="margin-top: 20px;">
                Thank you for choosing Journey Through Ladakh!
              </p>
            </div>
            <div class="footer">
              <p>Journey Through Ladakh - Your Adventure Begins Here</p>
              <p>This is an automated email. Please do not reply directly to this message.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Confirmation email sent to ${booking.email}`);
    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    console.error('❌ Error sending email:', error.message);
    // Don't throw error - email failure shouldn't break the booking confirmation
    return { success: false, message: error.message };
  }
};

// Send booking cancellation email
const sendBookingCancellationEmail = async (booking) => {
  try {
    const transporter = createTransporter();
    
    // If email not configured, skip sending but return success
    if (!transporter) {
      console.log(`📧 Email not configured. Customer ${booking.email} should be notified via phone: ${booking.phone}`);
      return { 
        success: true, 
        message: 'Email not configured. Please contact customer via phone.',
        emailConfigured: false 
      };
    }
    
    const itemName = booking.itemId?.name || 'Item';

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: booking.email,
      subject: `❌ Booking Cancelled - ${itemName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>❌ Booking Cancelled</h1>
            </div>
            <div class="content">
              <h2>Hello ${booking.customerName},</h2>
              <p>We're sorry to inform you that your booking for <strong>${itemName}</strong> has been cancelled.</p>
              <p><strong>Booking ID:</strong> ${booking._id}</p>
              <p>If you did not request this cancellation or have any questions, please contact us immediately.</p>
              <p>We hope to serve you in the future!</p>
            </div>
            <div class="footer">
              <p>Journey Through Ladakh</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Cancellation email sent to ${booking.email}`);
    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    console.error('❌ Error sending email:', error.message);
    return { success: false, message: error.message };
  }
};

// Send booking received email (when user first creates booking)
const sendBookingReceivedEmail = async (booking) => {
  try {
    const transporter = createTransporter();
    
    const itemName = booking.itemId?.name || 'Item';
    const startDate = new Date(booking.startDate).toLocaleDateString('en-IN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: booking.email,
      subject: `📋 Booking Received - ${itemName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📋 Booking Received!</h1>
            </div>
            <div class="content">
              <h2>Hello ${booking.customerName},</h2>
              <p>Thank you for your booking! We have received your booking request for <strong>${itemName}</strong> starting on <strong>${startDate}</strong>.</p>
              <p><strong>Booking ID:</strong> ${booking._id}</p>
              <p><strong>Status:</strong> <span style="color: #f59e0b;">PENDING CONFIRMATION</span></p>
              <p>Our team will review your booking and confirm within 24 hours. You will receive another email once your booking is confirmed.</p>
              <p>If you have any questions, feel free to contact us.</p>
            </div>
            <div class="footer">
              <p>Journey Through Ladakh</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Booking received email sent to ${booking.email}`);
    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    console.error('❌ Error sending email:', error.message);
    return { success: false, message: error.message };
  }
};

module.exports = {
  sendBookingConfirmationEmail,
  sendBookingCancellationEmail,
  sendBookingReceivedEmail
};
