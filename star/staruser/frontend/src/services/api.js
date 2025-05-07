import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Auth services
export const authService = {
  register: (userData) => {
    const formData = new FormData()
    for (const key in userData) {
      formData.append(key, userData[key])
    }
    return api.post("/api/auth/register", formData)
  },
  login: (credentials) => api.post("/api/auth/login", credentials),
  getCurrentUser: () => api.get("/api/auth/me"),
}

// Product services
export const productService = {
  getAllProducts: (params) => api.get("/api/products", { params }),
  getProductById: (id) => api.get(`/api/products/${id}`),
  getProductTypes: () => api.get("/api/products/types/all"),
  getProductBrands: () => api.get("/api/products/brands/all"),
}

// Service services
export const serviceService = {
  getAllServices: () => api.get("/api/services"),
  getServiceById: (id) => api.get(`/api/services/${id}`),
  getAllWorkers: (serviceType) => api.get("/api/services/workers", { params: { serviceType } }),
  getWorkersByService: (serviceId) => api.get(`/api/services/${serviceId}/workers`),
}

// Booking services
export const bookingService = {
  checkAvailability: (data) => api.post("/api/bookings/check-availability", data),
  createBooking: (data) => api.post("/api/bookings", data),
  getUserBookings: () => api.get("/api/bookings"),
  getBookingById: (id) => api.get(`/api/bookings/${id}`),
  updateBookingStatus: (id, status) => api.patch(`/api/bookings/${id}/status`, { status }),
  cancelBooking: (id) => api.patch(`/api/bookings/${id}/cancel`),
}

// Order services
export const orderService = {
  createOrder: (data) => api.post("/api/orders", data),
  getUserOrders: () => api.get("/api/orders"),
  getOrderById: (id) => api.get(`/api/orders/${id}`),
  updateOrderStatus: (id, status) => api.patch(`/api/orders/${id}/status`, { status }),
  cancelOrder: (id) => api.patch(`/api/orders/${id}/cancel`),
}

// User services
export const userService = {
  getUserProfile: () => api.get("/api/users/profile"),
  updateUserProfile: (userData) => {
    const formData = new FormData()
    for (const key in userData) {
      formData.append(key, userData[key])
    }
    return api.put("/api/users/profile", formData)
  },
  getCart: () => api.get("/api/users/cart"),
  addToCart: (data) => api.post("/api/users/cart", data),
  updateCartItem: (data) => api.put("/api/users/cart", data),
  clearCart: () => api.delete("/api/users/cart"),
}

export default api
