
// src/stores/tasks.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'

export const useTasksStore = defineStore('tasks', () => {
  // State
  const tasks = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Getters
  const pendingTasks = computed(() => 
    tasks.value.filter(task => task.status === 'pending')
  )
  
  const inProgressTasks = computed(() => 
    tasks.value.filter(task => task.status === 'in_progress')
  )
  
  const completedTasks = computed(() => 
    tasks.value.filter(task => task.status === 'completed')
  )

  // Actions
  const fetchTasks = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await api.get('/tasks')
      tasks.value = response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch tasks'
    } finally {
      loading.value = false
    }
  }

  const createTask = async (taskData) => {
    try {
      const response = await api.post('/tasks', taskData)
      tasks.value.push(response.data)
      return { success: true }
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.message || 'Failed to create task' 
      }
    }
  }

  const updateTask = async (id, taskData) => {
    try {
      const response = await api.put(`/tasks/${id}`, taskData)
      const index = tasks.value.findIndex(task => task.id === id)
      if (index !== -1) {
        tasks.value.splice(index, 1, response.data)
      }
      return { success: true }
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.message || 'Failed to update task' 
      }
    }
  }

  const updateTaskStatus = async (id, status) => {
    try {
      const response = await api.patch(`/tasks/${id}/status`, { status })
      const index = tasks.value.findIndex(task => task.id === id)
      if (index !== -1) {
        tasks.value.splice(index, 1, response.data)
      }
      return { success: true }
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.message || 'Failed to update task status' 
      }
    }
  }

  const deleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`)
      tasks.value = tasks.value.filter(task => task.id !== id)
      return { success: true }
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.message || 'Failed to delete task' 
      }
    }
  }

  return {
    // State
    tasks,
    loading,
    error,
    
    // Getters
    pendingTasks,
    inProgressTasks,
    completedTasks,
    
    // Actions
    fetchTasks,
    createTask,
    updateTask,
    updateTaskStatus,
    deleteTask
  }
})