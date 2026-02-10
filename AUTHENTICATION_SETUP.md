# Authentication & Authorization Setup Guide

## Overview
A complete authentication and authorization system has been implemented for the Journey Through Ladakh application with the following features:

- ✅ User registration and login
- ✅ JWT-based authentication
- ✅ Role-based authorization (user/admin)
- ✅ Protected routes
- ✅ Secure password hashing with bcrypt
- ✅ Session management
- ✅ Beautiful login/register UI

## Backend Implementation

### 1. Dependencies Installed
```bash
bcryptjs - Password hashing
jsonwebtoken - JWT token generation and verification
cookie-parser - Cookie parsing (optional)
```

### 2. Files Created

#### Models
- `apps/server/src/models/User.model.js` - User schema with role-based access

#### Controllers
- `apps/server/src/controllers/auth.controller.js` - Authentication logic
  - register()
  - login()
  - getMe()
  - logout()
  - updatePassword()

#### Middleware
- `apps/server/src/middlewares/auth.middleware.js`
  - protect() - Verify JWT token
  - authorize() - Role-based access control

#### Routes
- `apps/server/src/routes/auth.routes.js` - Authentication endpoints
  - POST /api/auth/register
  - POST /api/auth/login
  - GET /api/auth/me (protected)
  - POST /api/auth/logout (protected)
  - PUT /api/auth/update-password (protected)

#### Utilities
- `apps/server/src/seedAdmin.js` - Script to create admin user

### 3. Environment Variables
Added to `.env`:
```
JWT_SECRET=ladakh-journey-secret-key-2026-change-this-in-production
JWT_EXPIRE=7d
```

## Frontend Implementation

### 1. Files Created

#### Context
- `apps/client/src/context/AuthContext.jsx` - Global authentication state management
  - Handles user login/register/logout
  - Manages JWT token
  - Provides authentication status

#### Pages
- `apps/client/src/pages/Login.jsx` - Login/Register page with toggle
- `apps/client/src/pages/Login.css` - Beautiful gradient styling

#### Components
- `apps/client/src/components/ProtectedRoute.jsx` - Route protection wrapper
- Updated `apps/client/src/components/Navbar.jsx` - Added auth buttons
- Updated `apps/client/src/components/Navbar.css` - Styled auth buttons

### 2. App Structure Updated
- Wrapped app with `<AuthProvider>`
- Added `/login` route
- Protected `/admin` route with `<ProtectedRoute>`

## Setup Instructions

### Step 1: MongoDB Atlas Configuration
**IMPORTANT:** Before testing, you need to whitelist your IP address in MongoDB Atlas:

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Navigate to your cluster
3. Click "Network Access" in the left sidebar
4. Click "Add IP Address"
5. Either:
   - Add your current IP
   - Or add `0.0.0.0/0` (allow access from anywhere - **use for development only**)
6. Save changes

### Step 2: Create Admin User
Run this command to seed an admin user:
```bash
cd apps/server
node src/seedAdmin.js
```

**Default Admin Credentials:**
- Email: `admin@ladakh.com`
- Password: `admin123`

⚠️ **IMPORTANT:** Change the admin password after first login!

### Step 3: Start the Backend Server
```bash
cd apps/server
npm run dev
```

Server will run on `http://localhost:5000`

### Step 4: Start the Frontend Client
```bash
cd apps/client
npm run dev
```

Client will run on `http://localhost:5173`

## Testing the Authentication System

### 1. Test User Registration
1. Navigate to `http://localhost:5173/login`
2. Click "Register" tab
3. Fill in:
   - Username: testuser
   - Email: test@example.com
   - Password: test123
   - Confirm Password: test123
4. Click "Register"
5. You should be logged in and redirected to home

### 2. Test User Login
1. Navigate to `http://localhost:5173/login`
2. Enter credentials:
   - Email: test@example.com
   - Password: test123
3. Click "Login"
4. You should see your username in the navbar

### 3. Test Admin Access
1. Logout if logged in
2. Navigate to `http://localhost:5173/login`
3. Login with admin credentials:
   - Email: admin@ladakh.com
   - Password: admin123
4. You should see "Admin" link in navbar
5. Click "Admin" - you should access the admin panel

### 4. Test Protected Routes
1. Logout
2. Try to access `http://localhost:5173/admin` directly
3. You should be redirected to login page

### 5. Test Non-Admin User
1. Logout
2. Login as regular user (test@example.com)
3. Try to access `http://localhost:5173/admin`
4. You should be redirected to home page

## API Endpoints

### Public Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@example.com",
  "password": "test123"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "test123"
}
```

Response:
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "username": "testuser",
    "email": "test@example.com",
    "role": "user"
  }
}
```

### Protected Endpoints
Include the token in the Authorization header:
```
Authorization: Bearer YOUR_TOKEN_HERE
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer YOUR_TOKEN_HERE
```

#### Update Password
```http
PUT /api/auth/update-password
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword"
}
```

## Security Features

1. **Password Hashing**: Passwords are hashed using bcrypt with salt rounds of 10
2. **JWT Tokens**: Secure token-based authentication with 7-day expiration
3. **Protected Routes**: Frontend and backend route protection
4. **Role-Based Access**: Admin-only routes and features
5. **Token Validation**: Automatic token verification on protected endpoints
6. **Secure Headers**: Password field excluded from user queries by default

## User Roles

### User (default)
- Can view all public pages
- Can make bookings
- Cannot access admin panel

### Admin
- All user permissions
- Access to admin panel
- Can manage tour packages, rentals, sightseeing, and bookings

## Frontend Features

### Navbar Updates
- Shows "Login" button when not authenticated
- Shows username and "Logout" button when authenticated
- Shows "Admin" link only for admin users

### Login Page Features
- Toggle between Login and Register
- Form validation
- Error and success messages
- Beautiful gradient design
- Responsive layout

### Protected Route Component
- Redirects unauthenticated users to login
- Redirects non-admin users from admin routes
- Shows loading state during authentication check

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB Atlas IP is whitelisted
- Check `.env` file has correct MONGODB_URI
- Verify internet connection

### JWT Token Issues
- Clear browser localStorage if tokens are invalid
- Ensure JWT_SECRET is set in `.env`
- Check token expiration (default 7 days)

### CORS Issues
- Ensure backend server is running on port 5000
- Frontend expects API at `http://localhost:5000`
- CORS is enabled in backend

## Next Steps

1. **Change Admin Password**: Use the update password endpoint
2. **Add Password Reset**: Implement forgot password functionality
3. **Email Verification**: Add email verification for new users
4. **Refresh Tokens**: Implement refresh token mechanism
5. **OAuth Integration**: Add Google/Facebook login
6. **Rate Limiting**: Add request rate limiting
7. **Two-Factor Authentication**: Implement 2FA for enhanced security

## File Structure

```
apps/
├── server/
│   └── src/
│       ├── controllers/
│       │   └── auth.controller.js
│       ├── middlewares/
│       │   └── auth.middleware.js
│       ├── models/
│       │   └── User.model.js
│       ├── routes/
│       │   └── auth.routes.js
│       ├── config/
│       │   └── database.js
│       ├── seedAdmin.js
│       └── index.js
│
└── client/
    └── src/
        ├── components/
        │   ├── Navbar.jsx
        │   ├── Navbar.css
        │   └── ProtectedRoute.jsx
        ├── context/
        │   └── AuthContext.jsx
        ├── pages/
        │   ├── Login.jsx
        │   └── Login.css
        └── App.jsx
```

## Support

For issues or questions:
1. Check this documentation
2. Review console logs for errors
3. Verify all dependencies are installed
4. Ensure MongoDB connection is working
5. Check that both servers are running

---

**Created:** January 14, 2026
**Status:** ✅ Implementation Complete
