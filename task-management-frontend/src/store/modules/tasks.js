// src/store/modules/tasks.js
import api from '@/services/api'

const state = {
  tasks: [],
  loading: false,
  error: null,
}

const mutations = {
  SET_TASKS(state, tasks) {
    state.tasks = tasks
  },
  ADD_TASK(state, task) {
    state.tasks.push(task)
  },
  UPDATE_TASK(state, updatedTask) {
    const index = state.tasks.findIndex(task => task.id === updatedTask.id)
    if (index !== -1) {
      state.tasks.splice(index, 1, updatedTask)
    }
  },
  DELETE_TASK(state, taskId) {
    state.tasks = state.tasks.filter(task => task.id !== taskId)
  },
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  SET_ERROR(state, error) {
    state.error = error
  },
}

const actions = {
  async fetchTasks({ commit }) {
    commit('SET_LOADING', true)
    try {
      const response = await api.get('/tasks')
      commit('SET_TASKS', response.data)
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.message || 'Failed to fetch tasks')
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async createTask({ commit }, taskData) {
    try {
      const response = await api.post('/tasks', taskData)
      commit('ADD_TASK', response.data)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to create task' }
    }
  },

  async updateTask({ commit }, { id, taskData }) {
    try {
      const response = await api.put(`/tasks/${id}`, taskData)
      commit('UPDATE_TASK', response.data)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to update task' }
    }
  },

  async updateTaskStatus({ commit }, { id, status }) {
    try {
      const response = await api.patch(`/tasks/${id}/status`, { status })
      commit('UPDATE_TASK', response.data)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to update task status' }
    }
  },

  async deleteTask({ commit }, id) {
    try {
      await api.delete(`/tasks/${id}`)
      commit('DELETE_TASK', id)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Failed to delete task' }
    }
  },
}

const getters = {
  pendingTasks: (state) => state.tasks.filter(task => task.status === 'pending'),
  inProgressTasks: (state) => state.tasks.filter(task => task.status === 'in_progress'),
  completedTasks: (state) => state.tasks.filter(task => task.status === 'completed'),
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}