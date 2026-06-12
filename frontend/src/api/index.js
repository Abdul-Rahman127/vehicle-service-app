import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add authorization token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('drivex_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth APIs
export const loginAdmin = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const getProfile = async () => {
  const response = await api.get('/auth/profile');
  return response.data;
};

export const updateProfile = async (profileData) => {
  const response = await api.put('/auth/profile', profileData);
  return response.data;
};

export const updateProfilePhoto = async (profilePhoto) => {
  const response = await api.put('/auth/profile/photo', { profilePhoto });
  return response.data;
};

export const changePassword = async (passwordData) => {
  const response = await api.put('/auth/change-password', passwordData);
  return response.data;
};

export const getPublicSettings = async () => {
  const response = await api.get('/settings/public');
  return response.data;
};

export const getSettings = async () => {
  const response = await api.get('/settings');
  return response.data;
};

export const updateSettings = async (section, data) => {
  const response = await api.put('/settings', { section, data });
  return response.data;
};

export const dangerZoneAction = async (action, confirmText, password) => {
  const response = await api.post('/settings/danger', { action, confirmText, password });
  return response.data;
};

export const getPublicStats = async () => {
  const response = await api.get('/bookings/public-stats');
  return response.data;
};

// Bookings APIs
export const createBooking = async (bookingData) => {
  const response = await api.post('/bookings', bookingData);
  return response.data;
};

export const getBookings = async (filters = {}) => {
  const response = await api.get('/bookings', { params: filters });
  return response.data;
};

export const getBookingById = async (id) => {
  const response = await api.get(`/bookings/${id}`);
  return response.data;
};

export const updateBookingStatus = async (id, status) => {
  const response = await api.put(`/bookings/${id}/status`, { status });
  return response.data;
};

export const deleteBooking = async (id) => {
  const response = await api.delete(`/bookings/${id}`);
  return response.data;
};

export const getBookingStats = async (period = 'month') => {
  const response = await api.get('/bookings/stats', { params: { period } });
  return response.data;
};

// Service Categories APIs
export const getServices = async () => {
  const response = await api.get('/services');
  return response.data;
};

export const createService = async (serviceData) => {
  const response = await api.post('/services', serviceData);
  return response.data;
};

export const updateService = async (id, serviceData) => {
  const response = await api.put(`/services/${id}`, serviceData);
  return response.data;
};

export const deleteService = async (id) => {
  const response = await api.delete(`/services/${id}`);
  return response.data;
};

// Contact Messages APIs
export const submitContact = async (data) => {
  const response = await api.post('/contact', data);
  return response.data;
};

export const getContactMessages = async (filters = {}) => {
  const response = await api.get('/contact', { params: filters });
  return response.data;
};

export const updateContactReadStatus = async (id, isRead) => {
  const response = await api.put(`/contact/${id}/read`, { isRead });
  return response.data;
};

export const deleteContactMessage = async (id) => {
  const response = await api.delete(`/contact/${id}`);
  return response.data;
};

// Notifications APIs
export const getNotifications = async (since) => {
  const params = since ? { since } : {};
  const response = await api.get('/notifications', { params });
  return response.data;
};

export const markNotificationRead = async (id) => {
  const response = await api.put(`/notifications/${id}/read`);
  return response.data;
};

export const markAllNotificationsRead = async () => {
  const response = await api.put('/notifications/read-all');
  return response.data;
};

export default api;
