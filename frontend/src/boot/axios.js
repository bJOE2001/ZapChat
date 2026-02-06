import { boot } from 'quasar/wrappers'
import axios from 'axios'

function getApiBaseURL () {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL
  if (process.env.API_URL) return process.env.API_URL
  // In dev, use same host as the page so it works when opening via IP (e.g. 192.168.150.118:9000)
  if (import.meta.env.DEV && typeof window !== 'undefined') {
    return `http://${window.location.hostname}:8000/api`
  }
  return 'http://localhost:8000/api'
}

const apiBaseURL = getApiBaseURL()

const api = axios.create({
  baseURL: apiBaseURL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  },
  withCredentials: true
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('zapchat_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('zapchat_token')
      localStorage.removeItem('zapchat_user')
    }
    return Promise.reject(err)
  }
)

export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

export { api, getApiBaseURL }

