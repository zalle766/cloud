// ⚠️ هذا الملف لم يعد مستخدماً - تم استبداله بـ Supabase
// ⚠️ This file is deprecated - replaced with Supabase
// جميع الاستدعاءات الآن تستخدم frontend/src/services/supabaseApi.js
// All API calls now use frontend/src/services/supabaseApi.js

import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      // Don't redirect automatically, let the component handle it
      console.log('Unauthorized - token removed')
    }
    return Promise.reject(error)
  }
)

// API endpoints
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data) => api.put('/user/profile', data),
  uploadAvatar: (formData) => api.post('/user/avatar', formData),
}

export const restaurantAPI = {
  getAll: (params) => api.get('/restaurants', { params }),
  getById: (id) => api.get(`/restaurants/${id}`),
  create: (data) => api.post('/restaurants', data),
  update: (id, data) => api.put(`/restaurants/${id}`, data),
  delete: (id) => api.delete(`/restaurants/${id}`),
  getProducts: (id) => api.get(`/restaurants/${id}/products`),
}

export const productAPI = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
}

export const orderAPI = {
  getAll: (params) => api.get('/orders', { params }),
  getById: (id) => api.get(`/orders/${id}`),
  create: (data) => api.post('/orders', data),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
}

export const courierAPI = {
  getAvailableOrders: () => api.get('/courier/available-orders'),
  acceptOrder: (id) => api.post(`/courier/accept-order/${id}`),
  updateLocation: (data) => api.put('/courier/update-location', data),
  toggleAvailability: () => api.put('/courier/toggle-availability'),
}

export const reviewAPI = {
  create: (data) => api.post('/reviews', data),
  getReviews: (type, id) => api.get(`/reviews/${type}/${id}`),
}

export const notificationAPI = {
  getAll: () => api.get('/notifications'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
}

export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getAllUsers: () => api.get('/admin/users'),
  toggleUserStatus: (id) => api.put(`/admin/users/${id}/toggle-status`),
  getAllOrders: () => api.get('/admin/orders'),
  getAllRestaurants: () => api.get('/admin/restaurants'),
  getAllCouriers: () => api.get('/admin/couriers'),
}

// Default export for backward compatibility
const apiService = {
  register: (userData) => {
    return api.post('/auth/register', userData).then(response => ({
      success: response.data.success,
      data: response.data.data,
      message: response.data.message
    }))
  },
  login: (credentials) => {
    return api.post('/auth/login', credentials).then(response => ({
      success: response.data.success,
      data: response.data.data,
      message: response.data.message
    }))
  },
  getRestaurant: (id) => {
    return api.get(`/restaurants/${id}`).then(response => ({
      success: response.data.success,
      data: response.data.data
    }))
  },
}

export default apiService