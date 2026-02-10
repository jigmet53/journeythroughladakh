import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
