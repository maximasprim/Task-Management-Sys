// src/stores/users.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'

export const useUsersStore = defineStore('users', () => {
  // State
  const users = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Getters
  const allUsers = computed(() => users.value)
  
  const adminUsers = computed(() => 
    users.value.filter(user => user.role === 'admin')
  )
  
  const regularUsers = computed(() => 
    users.value.filter(user => user.role === 'user')
  )

  // Actions
  const fetchUsers = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await api.get('/users')
      users.value = response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch users'
    } finally {
      loading.value = false
    }
  }

  const createUser = async (userData) => {
    try {
      const response = await api.post('/users', userData)
      users.value.push(response.data)
      return { success: true }
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.message || 'Failed to create user' 
      }
    }
  }

  const updateUser = async (id, userData) => {
    try {
      const response = await api.put(`/users/${id}`, userData)
      const index = users.value.findIndex(user => user.id === id)
      if (index !== -1) {
        users.value.splice(index, 1, response.data)
      }
      return { success: true }
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.message || 'Failed to update user' 
      }
    }
  }

  const deleteUser = async (id) => {
    try {
      await api.delete(`/users/${id}`)
      users.value = users.value.filter(user => user.id !== id)
      return { success: true }
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.message || 'Failed to delete user' 
      }
    }
  }

  return {
    // State
    users,
    loading,
    error,
    
    // Getters
    allUsers,
    adminUsers,
    regularUsers,
    
    // Actions
    fetchUsers,
    createUser,
    updateUser,
    deleteUser
  }
})


// import api from '@/services/api'

// const state = {
//   users: [],
//   loading: false,
//   error: null,
// }

// const mutations = {
//   SET_USERS(state, users) {
//     state.users = users
//   },
//   ADD_USER(state, user) {
//     state.users.push(user)
//   },
//   UPDATE_USER(state, updatedUser) {
//     const index = state.users.findIndex(user => user.id === updatedUser.id)
//     if (index !== -1) {
//       state.users.splice(index, 1, updatedUser)
//     }
//   },
//   DELETE_USER(state, userId) {
//     state.users = state.users.filter(user => user.id !== userId)
//   },
//   SET_LOADING(state, loading) {
//     state.loading = loading
//   },
//   SET_ERROR(state, error) {
//     state.error = error
//   },
// }

// const actions = {
//   async fetchUsers({ commit }) {
//     commit('SET_LOADING', true)
//     try {
//       const response = await api.get('/users')
//       commit('SET_USERS', response.data)
//     } catch (error) {
//       commit('SET_ERROR', error.response?.data?.message || 'Failed to fetch users')
//     } finally {
//       commit('SET_LOADING', false)
//     }
//   },

//   async createUser({ commit }, userData) {
//     try {
//       const response = await api.post('/users', userData)
//       commit('ADD_USER', response.data)
//       return { success: true }
//     } catch (error) {
//       return { success: false, error: error.response?.data?.message || 'Failed to create user' }
//     }
//   },

//   async updateUser({ commit }, { id, userData }) {
//     try {
//       const response = await api.put(`/users/${id}`, userData)
//       commit('UPDATE_USER', response.data)
//       return { success: true }
//     } catch (error) {
//       return { success: false, error: error.response?.data?.message || 'Failed to update user' }
//     }
//   },

//   async deleteUser({ commit }, id) {
//     try {
//       await api.delete(`/users/${id}`)
//       commit('DELETE_USER', id)
//       return { success: true }
//     } catch (error) {
//       return { success: false, error: error.response?.data?.message || 'Failed to delete user' }
//     }
//   },
// }

// const getters = {
//   allUsers: (state) => state.users,
//   adminUsers: (state) => state.users.filter(user => user.role === 'admin'),
//   regularUsers: (state) => state.users.filter(user => user.role === 'user'),
// }

// export default {
//   namespaced: true,
//   state,
//   mutations,
//   actions,
//   getters,
// }