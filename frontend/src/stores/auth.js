import { defineStore } from 'pinia'
import { api } from 'src/boot/axios'

const TOKEN_KEY = 'zapchat_token'
const USER_KEY = 'zapchat_user'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem(TOKEN_KEY) || null,
    user: JSON.parse(localStorage.getItem(USER_KEY) || 'null')
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
    bearerToken: (state) => state.token ? `Bearer ${state.token}` : null
  },

  actions: {
    setAuth (user, token) {
      this.user = user
      this.token = token
      if (token) {
        localStorage.setItem(TOKEN_KEY, token)
        localStorage.setItem(USER_KEY, JSON.stringify(user))
      } else {
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(USER_KEY)
      }
    },

    async login (email, password) {
      const { data } = await api.post('/login', { email, password })
      this.setAuth(data.user, data.token)
      return data
    },

    async register (name, email, password, passwordConfirmation) {
      const { data } = await api.post('/register', {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation
      })
      this.setAuth(data.user, data.token)
      return data
    },

    logout () {
      api.post('/logout').catch(() => {})
      this.setAuth(null, null)
    }
  }
})
