# 📧 Email Notification Setup Guide

This guide explains how email notifications work in the Journey Through Ladakh booking system and how to set them up.

## 🎯 What Happens When Admin Confirms a Booking?

When an admin confirms a booking from the admin panel, the following happens automatically:

1. **Booking Status Updated**: The booking status changes from "pending" to "confirmed" in the database
2. **Email Sent**: An automated email is sent to the customer with:
   - ✅ Booking confirmation
   - 📋 Complete booking details (dates, price, vehicle info)
   - 📞 Contact information
   - 🎨 Professionally designed HTML email template

3. **Admin Notification**: Admin sees a success message confirming the email was sent

## 📧 Email Types

The system sends three types of emails:

### 1. **Booking Received Email** (Optional - can be added)
- Sent when user first creates a booking
- Status: Pending
- Message: "We received your booking and will confirm within 24 hours"

### 2. **Booking Confirmed Email** ✅
- Sent when admin confirms booking
- Status: Confirmed
- Contains: Full booking details, next steps, contact info

### 3. **Booking Cancelled Email** ❌
- Sent when admin cancels booking
- Status: Cancelled
- Contains: Cancellation notice and contact info

## 🛠️ Setup Instructions

### Option 1: Gmail (Recommended for Testing)

1. **Enable 2-Factor Authentication** on your Gmail account
   - Go to: https://myaccount.google.com/security
   - Enable 2-Step Verification

2. **Generate App Password**
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Copy the generated 16-character password

3. **Update `.env` file** in `apps/server/.env`:
   ```env
   EMAIL_SERVICE=gmail
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=xxxx xxxx xxxx xxxx  # Your 16-char app password
   ```

### Option 2: Custom SMTP Server

For production, use professional email services like:

#### **SendGrid**
```env
EMAIL_SERVICE=SendGrid
EMAIL_USER=apikey
EMAIL_PASSWORD=your-sendgrid-api-key
```

#### **AWS SES**
```env
EMAIL_SERVICE=ses
EMAIL_USER=your-aws-access-key
EMAIL_PASSWORD=your-aws-secret-key
```

#### **Mailgun**
```env
EMAIL_SERVICE=Mailgun
EMAIL_USER=your-mailgun-username
EMAIL_PASSWORD=your-mailgun-password
```

## 📝 Configuration Details

### Environment Variables

Add these to `apps/server/.env`:

```env
# Email Configuration
EMAIL_SERVICE=gmail               # Email service provider
EMAIL_USER=your-email@gmail.com   # Your email address
EMAIL_PASSWORD=your-app-password  # App password (NOT your regular password)
```

### Testing Email Setup

1. **Start the server**:
   ```bash
   cd apps/server
   npm run dev
   ```

2. **Create a test booking** from the website

3. **Go to Admin Panel** and confirm the booking

4. **Check the customer's email** - they should receive a confirmation email

5. **Check server logs** - you'll see:
   ```
   ✅ Confirmation email sent to customer@email.com
   ```

## 🎨 Email Template Features

The confirmation email includes:

- **Beautiful gradient header** with purple theme
- **Complete booking details** in a formatted table:
  - Booking ID
  - Vehicle/Tour name
  - Start and End dates
  - Number of people
  - Total price
  - Booking status
- **Special requests** (if provided)
- **Next steps** and contact information
- **Professional footer** with branding

## 🔧 Customizing Email Templates

Edit `apps/server/src/services/email.service.js` to customize:

1. **Email Subject**: Change the subject line
2. **Email Content**: Modify the HTML template
3. **Styling**: Update CSS in the email template
4. **Sender Name**: Add display name to sender

Example:
```javascript
const mailOptions = {
  from: '"Journey Through Ladakh" <your-email@gmail.com>',
  to: booking.email,
  subject: `🎉 Your Booking is Confirmed!`,
  html: `<!-- Your custom HTML template -->`
};
```

## 🚨 Troubleshooting

### Email Not Sending

**Check 1: Environment Variables**
```bash
# Verify .env file has correct values
cat apps/server/.env | grep EMAIL
```

**Check 2: Gmail App Password**
- Make sure you're using App Password, NOT regular password
- App password should be 16 characters with spaces

**Check 3: Server Logs**
```bash
# Look for email errors in console
cd apps/server
npm run dev
# Watch for "❌ Error sending email" messages
```

**Check 4: Email Service Status**
- Verify Gmail/SMTP service is working
- Check if your account has sending limits

### Common Errors

**Error: "Invalid login"**
- Solution: Use App Password instead of regular password

**Error: "Less secure app access"**
- Solution: Use App Passwords with 2FA enabled

**Error: "Daily sending limit exceeded"**
- Solution: Gmail free accounts have ~500 emails/day limit
- Upgrade to Google Workspace or use SendGrid

## 📱 User Experience Flow

### From Customer's Perspective:

1. **Customer Books Vehicle**
   - Fills out booking form
   - Submits booking
   - Sees success message: "Booking created! We'll contact you soon"

2. **Admin Reviews Booking**
   - Admin logs into admin panel
   - Sees pending booking
   - Clicks "Confirm" button

3. **Customer Gets Email** 📧
   - Receives beautiful confirmation email
   - Has all booking details
   - Knows booking is confirmed
   - Has contact info if questions arise

4. **Follow-up**
   - Admin contacts customer at phone number
   - Finalizes payment details
   - Completes booking process

## 🎯 Best Practices

1. **Use Professional Email Service** for production (SendGrid, AWS SES)
2. **Test Thoroughly** before going live
3. **Monitor Email Delivery** rates and bounces
4. **Have Backup Contact Method** (SMS, phone call)
5. **Don't Rely Solely on Email** - call important customers
6. **Log All Email Attempts** for debugging
7. **Handle Email Failures Gracefully** - booking should still work

## 📊 Email Statistics (Optional Enhancement)

You can add email tracking by integrating:
- **SendGrid Analytics**: Track opens, clicks
- **Mailgun Tracking**: Delivery confirmations
- **Custom Tracking**: Add tracking pixels

## 🔐 Security Tips

1. **Never commit** `.env` file to git
2. **Use App Passwords** not regular passwords
3. **Rotate passwords** regularly
4. **Limit email rate** to prevent spam flags
5. **Validate email addresses** before sending
6. **Use HTTPS** for production
7. **Enable SPF/DKIM** records for your domain

## 🚀 Production Checklist

Before deploying to production:

- [ ] Set up professional email service (SendGrid/AWS SES)
- [ ] Configure custom domain email
- [ ] Test all email types (confirmed, cancelled)
- [ ] Set up email monitoring/alerts
- [ ] Configure SPF/DKIM records
- [ ] Add unsubscribe links (if required)
- [ ] Test email rendering across clients (Gmail, Outlook, etc.)
- [ ] Set up email logs/tracking
- [ ] Create email templates backup
- [ ] Document email procedures for team

## 📞 Support

If you have issues with email setup:
1. Check the troubleshooting section above
2. Review server logs for detailed errors
3. Test with a simple email first
4. Verify SMTP credentials are correct

## 🎨 Email Preview

When a booking is confirmed, customers receive an email like this:

```
┌─────────────────────────────────────────┐
│  ✅ Booking Confirmed!                  │
│  Your booking has been confirmed by     │
│  our team                               │
├─────────────────────────────────────────┤
│                                         │
│  Hello [Customer Name],                 │
│                                         │
│  Great news! Your booking has been      │
│  confirmed. Here are your booking       │
│  details:                               │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ Booking ID: 123abc                │ │
│  │ Item: Royal Enfield Himalayan     │ │
│  │ Start Date: January 20, 2026      │ │
│  │ End Date: January 25, 2026        │ │
│  │ Number of People: 2               │ │
│  │ Total Price: ₹15,000              │ │
│  │ Status: CONFIRMED                 │ │
│  └───────────────────────────────────┘ │
│                                         │
│  What's Next?                           │
│  We will contact you at [phone] within │
│  24 hours to finalize details.         │
│                                         │
│  Thank you for choosing Journey        │
│  Through Ladakh!                       │
│                                         │
└─────────────────────────────────────────┘
```

---

**Remember**: Email notifications enhance customer experience but should be supplemented with phone calls for important bookings!
