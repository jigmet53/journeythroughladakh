import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// In-memory storage for access token (SECURITY: Not in localStorage to prevent XSS attacks)
let accessToken = null;

// Get access token
export const getAccessToken = () => accessToken;

// Set access token
export const setAccessToken = (token) => {
  accessToken = token;
};

// Clear access token
export const clearAccessToken = () => {
  accessToken = null;
};

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // IMPORTANT: Send cookies (for refresh token) with requests
});

// Request interceptor: Attach access token to all requests
api.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: Handle token refresh on 401 errors
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Prevent infinite loops - don't retry refresh endpoint
    if (originalRequest.url?.includes('/auth/refresh')) {
      return Promise.reject(error);
    }

    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Try to refresh the access token
        const response = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true } // Send refresh token cookie
        );

        const newAccessToken = response.data.accessToken;
        
        // Update access token in memory
        setAccessToken(newAccessToken);
        
        // Process queued requests with new token
        processQueue(null, newAccessToken);
        
        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
        
      } catch (refreshError) {
        // Refresh failed - clear token and redirect to login
        processQueue(refreshError, null);
        clearAccessToken();
        
        // Only redirect if not already on login page
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    setAccessToken(response.data.accessToken); // Store in memory
    return response;
  },
  
  register: async (username, email, password) => {
    const response = await api.post('/auth/register', { username, email, password });
    setAccessToken(response.data.accessToken); // Store in memory
    return response;
  },
  
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      clearAccessToken(); // Clear from memory
    }
  },
  
  logoutAll: async () => {
    try {
      await api.post('/auth/logout-all');
    } finally {
      clearAccessToken();
    }
  },
  
  getProfile: () => api.get('/auth/me'),
  
  updatePassword: (currentPassword, newPassword) => 
    api.put('/auth/update-password', { currentPassword, newPassword }),
  
  // Manual refresh (usually not needed, handled automatically by interceptor)
  refresh: async () => {
    const response = await api.post('/auth/refresh');
    setAccessToken(response.data.accessToken);
    return response;
  },
};

// Tour Packages API
export const tourPackagesAPI = {
  getAll: (params) => api.get('/tour-packages', { params }),
  getById: (id) => api.get(`/tour-packages/${id}`),
  create: (data) => api.post('/tour-packages', data),
  update: (id, data) => api.put(`/tour-packages/${id}`, data),
  delete: (id) => api.delete(`/tour-packages/${id}`),
};

// Rentals API
export const rentalsAPI = {
  getAll: (params) => api.get('/rentals', { params }),
  getById: (id) => api.get(`/rentals/${id}`),
  create: (data) => api.post('/rentals', data),
  update: (id, data) => api.put(`/rentals/${id}`, data),
  delete: (id) => api.delete(`/rentals/${id}`),
};

// Sightseeing API
export const sightseeingAPI = {
  getAll: (params) => api.get('/sightseeing', { params }),
  getById: (id) => api.get(`/sightseeing/${id}`),
  getNearby: (params) => api.get('/sightseeing/nearby', { params }),
  create: (data) => api.post('/sightseeing', data),
  update: (id, data) => api.put(`/sightseeing/${id}`, data),
  delete: (id) => api.delete(`/sightseeing/${id}`),
};

// Bookings API
export const bookingsAPI = {
  getAll: (params) => api.get('/bookings', { params }),
  getById: (id) => api.get(`/bookings/${id}`),
  create: (data) => api.post('/bookings', data),
  update: (id, data) => api.put(`/bookings/${id}`, data),
  updateStatus: (id, status) => api.patch(`/bookings/${id}/status`, { status }),
  delete: (id) => api.delete(`/bookings/${id}`),
};

export default api;
