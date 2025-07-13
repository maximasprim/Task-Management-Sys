// src/store/modules/auth.js
import api from '@/services/api'

const state = {
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: false,
}

const mutations = {
  SET_USER(state, user) {
    state.user = user
    state.isAuthenticated = true
  },
  SET_TOKEN(state, token) {
    state.token = token
    localStorage.setItem('token', token)
  },
  LOGOUT(state) {
    state.user = null
    state.token = null
    state.isAuthenticated = false
    localStorage.removeItem('token')
  },
}

const actions = {
  // ... existing login, logout, fetchUser actions ...

  async register({ commit }, userData) {
    try {
      // Send the POST request to the backend /register endpoint
      const response = await api.post('/register', userData)
      const { user, token } = response.data

      // Commit user and token to the store upon successful registration
      commit('SET_USER', user)
      commit('SET_TOKEN', token)

      return { success: true }
    } catch (error) {
      // Handle validation errors or other failures from the backend
      let errorMessage = error.response?.data?.message || 'Registration failed'

      // If Laravel returned validation errors, format them for display
      if (error.response?.status === 422 && error.response.data.errors) {
        const errors = error.response.data.errors
        errorMessage = Object.values(errors).flat().join(' ')
      }

      return { success: false, error: errorMessage }
    }
  },
}

const getters = {
  isAdmin: (state) => state.user?.role === 'admin',
  isAuthenticated: (state) => state.isAuthenticated,
  user: (state) => state.user,
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}

// // src/store/modules/auth.js - Debug Version
// import api from '@/services/api'

// const state = {
//   user: null,
//   token: localStorage.getItem('token') || null,
//   isAuthenticated: !!localStorage.getItem('token'),
// }

// // Add debug logging
// console.log('Auth module initialized:', {
//   hasToken: !!localStorage.getItem('token'),
//   token: localStorage.getItem('token'),
//   isAuthenticated: !!localStorage.getItem('token')
// })

// const mutations = {
//   SET_USER(state, user) {
//     console.log('SET_USER mutation called with:', user)
//     state.user = user
//     state.isAuthenticated = true
//   },
//   SET_TOKEN(state, token) {
//     console.log('SET_TOKEN mutation called with:', token)
//     state.token = token
//     state.isAuthenticated = true
//     localStorage.setItem('token', token)
//   },
//   LOGOUT(state) {
//     console.log('LOGOUT mutation called')
//     state.user = null
//     state.token = null
//     state.isAuthenticated = false
//     localStorage.removeItem('token')
//   },
// }

// const actions = {
//   async login({ commit }, credentials) {
//     console.log('Login action called with:', credentials)
//     try {
//       const response = await api.post('/login', credentials)
//       const { user, token } = response.data
      
//       console.log('Login successful:', { user, token })
//       commit('SET_USER', user)
//       commit('SET_TOKEN', token)
      
//       return { success: true }
//     } catch (error) {
//       console.error('Login failed:', error)
//       return { success: false, error: error.response?.data?.message || 'Login failed' }
//     }
//   },
  
//   async logout({ commit }) {
//     console.log('Logout action called')
//     try {
//       await api.post('/logout')
//     } catch (error) {
//       console.error('Logout error:', error)
//     } finally {
//       commit('LOGOUT')
//     }
//   },
  
//   async fetchUser({ commit }) {
//     console.log('FetchUser action called')
//     try {
//       const response = await api.get('/me')
//       console.log('FetchUser successful:', response.data)
//       commit('SET_USER', response.data)
//     } catch (error) {
//       console.error('FetchUser failed:', error)
//       commit('LOGOUT')
//     }
//   },
// }

// const getters = {
//   isAdmin: (state) => {
//     const result = state.user?.role === 'admin'
//     console.log('isAdmin getter called:', result)
//     return result
//   },
//   isAuthenticated: (state) => {
//     console.log('isAuthenticated getter called:', state.isAuthenticated)
//     return state.isAuthenticated
//   },
//   user: (state) => {
//     console.log('user getter called:', state.user)
//     return state.user
//   },
// }

// export default {
//   namespaced: true,
//   state,
//   mutations,
//   actions,
//   getters,
// }