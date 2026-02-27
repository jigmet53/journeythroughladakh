# 🚀 Secure Authentication Setup Guide

## Quick Start

### 1. Update Environment Variables

```bash
cd apps/server
```

Add to your `.env` file:
```env
# JWT Secrets - CHANGE THESE IN PRODUCTION!
JWT_ACCESS_SECRET=your-super-secret-access-key-min-32-chars
JWT_REFRESH_SECRET=your-super-secret-refresh-key-min-32-chars-different

# Client URL for CORS
CLIENT_URL=http://localhost:5173

# Node Environment
NODE_ENV=development
```

**Generate strong secrets:**
```bash
# For Access Token Secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# For Refresh Token Secret  
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 2. Install Dependencies

Backend already has `cookie-parser` in package.json.

If needed, install it:
```bash
cd apps/server
npm install cookie-parser
```

### 3. Start the Application

**Backend:**
```bash
cd apps/server
npm run dev
```

**Frontend:**
```bash
cd apps/client
npm run dev
```

---

## 🧪 Testing the Secure Authentication

### 1. Test Login
```bash
# Login and save cookies
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ladakh.com","password":"admin123"}' \
  -c cookies.txt -v

# You should see:
# - accessToken in response body
# - Set-Cookie header with refreshToken (HttpOnly)
```

### 2. Test Protected Route with Access Token
```bash
# Use the accessToken from previous response
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE" \
  -b cookies.txt
```

### 3. Test Token Refresh
```bash
# Wait 15+ minutes for access token to expire, OR manually test refresh
curl -X POST http://localhost:5000/api/auth/refresh \
  -b cookies.txt -v

# You should get:
# - New accessToken in response body
# - New refreshToken in Set-Cookie header
```

### 4. Test Logout
```bash
curl -X POST http://localhost:5000/api/auth/logout \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -b cookies.txt

# Refresh token should be revoked in database
```

---

## 🔍 Browser Testing

### Open Developer Tools

1. **Login** at `http://localhost:5173/login`

2. **Check Application Tab:**
   - Go to: DevTools → Application → Cookies → http://localhost:5173
   - You should see: `refreshToken` cookie with:
     - ✅ HttpOnly flag
     - ✅ Secure flag (in production)
     - ✅ SameSite: Strict

3. **Check localStorage/sessionStorage:**
   - Should be EMPTY! No tokens here (security!)

4. **Check Network Tab:**
   - Login request → Response has `accessToken` in JSON
   - Login request → Response headers have `Set-Cookie: refreshToken`

5. **Refresh the Page:**
   - Access token is lost (by design)
   - First API call fails with 401
   - Automatic refresh call to `/api/auth/refresh`
   - New access token received
   - Original request retries successfully
   - User stays logged in!

---

## 🎯 What Changed?

### Backend Changes
1. ✅ Created `RefreshToken` model for database storage
2. ✅ Updated `auth.controller.js` with:
   - Two-token generation (access + refresh)
   - Token rotation on refresh
   - HTTP-only cookie configuration
   - Logout revokes tokens
3. ✅ Added `/api/auth/refresh` endpoint
4. ✅ Added `/api/auth/logout-all` endpoint
5. ✅ Updated middleware to use `JWT_ACCESS_SECRET`
6. ✅ Added `cookie-parser` middleware
7. ✅ Updated CORS to allow credentials

### Frontend Changes
1. ✅ Updated `api.js` with:
   - In-memory token storage
   - Axios interceptors for auto-refresh
   - Queue system for concurrent requests
2. ✅ Updated `AuthContext.jsx`:
   - Removed localStorage usage
   - Uses in-memory tokens
   - Auto-loads user on mount
3. ✅ No more manual token management needed!

---

## 📊 Token Flow Visualization

```
User Logs In
     ↓
Server sends:
  - accessToken (15 min) → Stored in Memory
  - refreshToken (7 days) → Stored in HTTP-only Cookie
     ↓
User makes API request
     ↓
Access token valid? 
     ├─ YES → Request succeeds
     │
     └─ NO (expired after 15 min)
          ↓
     Axios interceptor catches 401
          ↓
     Automatically calls /api/auth/refresh
     (Sends refresh token cookie)
          ↓
     Server verifies refresh token
          ↓
     Server issues NEW tokens (rotation!)
          ↓
     Old refresh token REVOKED
          ↓
     New accessToken stored in memory
          ↓
     Original request retries
          ↓
     Success! User never noticed
```

---

## 🔒 Security Features Enabled

### XSS Protection
- ✅ Access tokens in memory (can't be stolen via XSS)
- ✅ Refresh tokens in HTTP-only cookies (JavaScript can't access)

### Token Rotation
- ✅ New refresh token on every refresh
- ✅ Old tokens immediately revoked
- ✅ Theft detection via concurrent usage

### CSRF Protection
- ✅ SameSite='strict' cookie attribute
- ✅ CORS configured with specific origins
- ✅ Refresh token only sent to same domain

### Additional Security
- ✅ Device tracking (User-Agent, IP)
- ✅ Logout from all devices
- ✅ Password change revokes all tokens
- ✅ Automatic token cleanup
- ✅ Database indexes for performance

---

## 🎤 Interview Demonstration

### Show This Flow:

1. **Login:**
   - "Notice the accessToken is returned in the response body"
   - "The refreshToken is in an HTTP-only cookie - JavaScript cannot access it"
   - "Open DevTools → Application → Cookies to show HttpOnly flag"

2. **Make API Request:**
   - "The access token is automatically attached to requests"
   - "It's stored in memory, not localStorage"
   - "Show localStorage is empty"

3. **Refresh Page:**
   - "Access token is lost - that's by design for security"
   - "Watch the Network tab"
   - "First API call fails with 401"
   - "Axios interceptor automatically calls /refresh"
   - "New token received, original request retries"
   - "User stays logged in seamlessly!"

4. **Explain Security:**
   - "Even if XSS attack happens, attacker can't steal tokens from localStorage"
   - "Access token in memory is lost when tab closes"
   - "Refresh token in HTTP-only cookie can't be accessed by JavaScript"
   - "Token rotation means stolen tokens are quickly invalidated"

---

## 💡 Key Interview Points

1. **"Why in-memory storage?"**
   - Prevents XSS attacks
   - Tokens automatically cleared on tab close
   - Limited exposure window (15 minutes)

2. **"How does page refresh work?"**
   - Access token lost by design
   - Automatic refresh using HTTP-only cookie
   - Seamless user experience
   - No manual token management needed

3. **"What is token rotation?"**
   - Every refresh generates new tokens
   - Old tokens immediately revoked
   - Detects and prevents token theft
   - Industry standard practice

4. **"How do you handle 'Logout everywhere'?"**
   - All refresh tokens stored in database
   - Revoke all tokens for user
   - Forces re-login on all devices
   - Great for security incidents

---

## 📚 Files Modified

### Backend:
- `apps/server/src/models/RefreshToken.model.js` - NEW
- `apps/server/src/controllers/auth.controller.js` - UPDATED
- `apps/server/src/routes/auth.routes.js` - UPDATED
- `apps/server/src/middlewares/auth.middleware.js` - UPDATED
- `apps/server/src/index.js` - UPDATED
- `apps/server/.env.example` - UPDATED

### Frontend:
- `apps/client/src/services/api.js` - UPDATED
- `apps/client/src/context/AuthContext.jsx` - UPDATED

### Documentation:
- `SECURITY_AUTHENTICATION.md` - NEW
- `SECURE_AUTH_SETUP.md` - NEW

---

## ✅ Pre-Interview Checklist

- [ ] Update `.env` with strong JWT secrets
- [ ] Test login flow
- [ ] Test token refresh (page refresh)
- [ ] Test logout
- [ ] Check cookies in DevTools
- [ ] Verify localStorage is empty
- [ ] Read SECURITY_AUTHENTICATION.md
- [ ] Practice explaining token rotation
- [ ] Understand XSS protection mechanism
- [ ] Be ready to demo the flow

---

## 🚨 Important Notes

1. **Always use HTTPS in production!**
   - Secure cookies only work over HTTPS
   - Set `NODE_ENV=production` in production

2. **Keep secrets secret!**
   - Never commit real secrets to Git
   - Use environment variables
   - Generate long, random strings

3. **Monitor token usage:**
   - Add logging for security events
   - Track failed refresh attempts
   - Alert on suspicious patterns

---

**You're now ready to impress with production-grade authentication!** 🎯

