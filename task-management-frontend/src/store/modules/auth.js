// src/store/modules/auth.js - Fixed version
import { defineStore } from 'pinia'
import api from '@/services/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    isAuthenticated: false,
    isInitialized: false, // Add this flag
  }),

  getters: {
    isAdmin: (state) => state.user?.role === 'admin',
    currentUser: (state) => state.user,
  },

  actions: {
    setUser(user) {
      this.user = user
      this.isAuthenticated = true
    },

    setToken(token) {
      this.token = token
      // Set Authorization header for all future requests
      if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      } else {
        delete api.defaults.headers.common['Authorization']
      }
    },

    logout() {
      this.user = null
      this.token = null
      this.isAuthenticated = false
      this.isInitialized = true
      // Remove Authorization header
      delete api.defaults.headers.common['Authorization']
    },

    async login(credentials) {
      try {
        const response = await api.post('/login', credentials)
        const { user, token } = response.data
        
        this.setToken(token)
        this.setUser(user)
        this.isInitialized = true
        
        return { success: true }
      } catch (error) {
        return { 
          success: false, 
          error: error.response?.data?.message || 'Login failed'
        }
      }
    },

    async register(userData) {
      try {
        const response = await api.post('/register', userData)
        const { user, token } = response.data
        
        this.setToken(token)
        this.setUser(user)
        this.isInitialized = true
        
        return { success: true }
      } catch (error) {
        let errorMessage = error.response?.data?.message || 'Registration failed'
        
        if (error.response?.status === 422 && error.response.data.errors) {
          const errors = error.response.data.errors
          errorMessage = Object.values(errors).flat().join(' ')
        }
        
        return { success: false, error: errorMessage }
      }
    },

    async performLogout() {
      try {
        await api.post('/logout')
      } catch (error) {
        console.error('Logout error:', error)
      } finally {
        this.logout()
      }
    },

    async fetchUser() {
      try {
        const response = await api.get('/me')
        this.setUser(response.data)
        this.isInitialized = true
        return { success: true }
      } catch (error) {
        console.error('FetchUser failed:', error)
        this.logout()
        return { success: false }
      }
    },

    async initAuth() {
      // If we have a token but no user, try to fetch user
      if (this.token && !this.user) {
        this.setToken(this.token) // This sets the Authorization header
        const result = await this.fetchUser()
        if (!result.success) {
          this.logout()
        }
      } else if (this.token && this.user) {
        // We have both token and user, just set the header
        this.setToken(this.token)
        this.isAuthenticated = true
        this.isInitialized = true
      } else {
        // No token, mark as initialized
        this.isInitialized = true
      }
    },
  },

  persist: {
    key: 'auth-store',
    storage: localStorage,
    paths: ['user', 'token', 'isAuthenticated'],
  },
})