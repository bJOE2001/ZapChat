import { boot } from 'quasar/wrappers'
import axios from 'axios'

const apiBaseURL =
  import.meta.env.VITE_API_URL ||
  process.env.API_URL ||
  'http://localhost:8000/api'

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

export { api }

