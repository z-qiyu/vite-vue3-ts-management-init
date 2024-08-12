import axios from 'axios'
import { useUserStore } from '@/stores'
import { useRouter } from 'vue-router'

// Define the base URL for your API
const API_BASE_URL = '/api' // Adjust this to your API base URL

// Create an axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add a request interceptor to include the JWT token
api.interceptors.request.use(
  (config) => {
    const token = useUserStore().token // Use Pinia store to get the token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Add a response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (
      error.response.status === 401 &&
      ['login', 'logout', 'register'].indexOf(error.response.config.url) === -1
    ) {
      // Handle unauthorized errors, e.g., refresh token, logout
      useUserStore().logout()
    }
    return Promise.reject(error)
  }
)

export default api
