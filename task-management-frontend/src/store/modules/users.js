import api from '@/services/api'

const state = {
  users: [],
  loading: false,
  error: null,
}

const mutations = {
  SET_USERS(state, users) {
    state.users = users
  },
  ADD_USER(state, user) {
    state.users.push(user)
  },
  UPDATE_USER(state, updatedUser) {
    const index = state.users.findIndex(user => user.id === updatedUser.id)
    if (index !== -1) {
      state.users.splice(index, 1, updatedUser)
    }
  },
  DELETE_USER(state, userId) {
    state.users = state.users.filter(user => user.id !== userId)
  },
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  SET_ERROR(state, error) {
    state.error = error
  },
}

const actions = {
  async fetchUsers({ commit }) {
    commit('SET_LOADING', true)
    try {
      const response = await api.get('/users')
      commit('SET_USERS', response.data)
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.message || 'Failed to fetch users')
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async createUser({ commit }, userData) {
    try {
      const response = await api.post('/users', userData)
      commit('ADD_USER', response.data)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to create user' }
    }
  },

  async updateUser({ commit }, { id, userData }) {
    try {
      const response = await api.put(`/users/${id}`, userData)
      commit('UPDATE_USER', response.data)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to update user' }
    }
  },

  async deleteUser({ commit }, id) {
    try {
      await api.delete(`/users/${id}`)
      commit('DELETE_USER', id)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to delete user' }
    }
  },
}

const getters = {
  allUsers: (state) => state.users,
  adminUsers: (state) => state.users.filter(user => user.role === 'admin'),
  regularUsers: (state) => state.users.filter(user => user.role === 'user'),
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}