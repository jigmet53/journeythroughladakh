# Quick Start Guide - Authentication

## ⚠️ Before You Start

**You must whitelist your IP in MongoDB Atlas:**
1. Go to https://cloud.mongodb.com/
2. Select your cluster
3. Click "Network Access" → "Add IP Address"
4. Add `0.0.0.0/0` (for development) or your specific IP
5. Save and wait for it to activate

## Quick Setup (3 steps)

### 1. Create Admin User
```bash
cd apps/server
node src/seedAdmin.js
```

Expected output:
```
✅ Admin user created successfully!
📧 Email: admin@ladakh.com
🔑 Password: admin123
```

### 2. Start Backend
```bash
cd apps/server
npm run dev
```

Expected output:
```
🚀 Server is running on port 5000
✅ MongoDB Connected: ...
```

### 3. Start Frontend
```bash
cd apps/client
npm run dev
```

Expected output:
```
Local: http://localhost:5173/
```

## Test It Out

1. **Open Browser:** http://localhost:5173
2. **Click "Login"** button in navbar
3. **Try Admin Login:**
   - Email: `admin@ladakh.com`
   - Password: `admin123`
4. **You should see:**
   - Your username in navbar
   - "Admin" link visible
   - "Logout" button

## Default Credentials

**Admin:**
- Email: `admin@ladakh.com`
- Password: `admin123`

**Create New User:**
- Click "Register" on login page
- Fill in username, email, password
- You'll be logged in automatically

## Features Implemented

✅ User Registration & Login
✅ JWT Authentication
✅ Role-based Access (User/Admin)
✅ Protected Admin Routes
✅ Beautiful Login UI
✅ Navbar Auth Buttons
✅ Session Management

## Troubleshooting

**MongoDB Connection Failed?**
→ Whitelist your IP in MongoDB Atlas

**Port Already in Use?**
→ Kill the process: `lsof -ti:5000 | xargs kill`

**Can't Access Admin?**
→ Login with admin credentials first

---

For complete documentation, see `AUTHENTICATION_SETUP.md`
