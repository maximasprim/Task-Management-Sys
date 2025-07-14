<template>
  <div class="tasks-page">
    <div class="page-header">
      <h1>All Tasks</h1>
      <div class="header-actions">
        <select v-model="statusFilter" class="filter-select">
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <button 
          v-if="authStore.isAdmin" 
          @click="showTaskForm = true"
          class="btn btn-primary"
        >
          Create Task
        </button>
      </div>
    </div>

    <div class="tasks-grid">
      <TaskCard 
        v-for="task in filteredTasks" 
        :key="task.id" 
        :task="task"
        @edit="editTask"
        @delete="deleteTask"
      />
    </div>

    <div v-if="filteredTasks.length === 0" class="empty-state">
      <p>No tasks found.</p>
    </div>

    <!-- Task Form Modal -->
    <div v-if="showTaskForm" class="modal-overlay" @click="closeTaskForm">
      <div class="modal-content" @click.stop>
        <TaskForm 
          :task="selectedTask"
          @close="closeTaskForm"
          @submit="handleTaskSubmit"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { useTasksStore } from '@/store/modules/tasks'
import { useAuthStore } from '@/store/modules/auth'
import TaskCard from '@/components/Task/TaskCard.vue'
import TaskForm from '@/components/Task/TaskForm.vue'
import { useToast } from 'vue-toastification'

export default {
  name: 'Tasks',
  components: {
    TaskCard,
    TaskForm
  },
  setup() {
    const toast = useToast()
    const tasksStore = useTasksStore()
    const authStore = useAuthStore()
    
    return { 
      toast,
      tasksStore,
      authStore
    }
  },
  data() {
    return {
      showTaskForm: false,
      selectedTask: null,
      statusFilter: ''
    }
  },
  computed: {
    filteredTasks() {
      if (!this.statusFilter) return this.tasksStore.tasks
      return this.tasksStore.tasks.filter(task => task.status === this.statusFilter)
    }
  },
  async created() {
    await this.tasksStore.fetchTasks()
  },
  methods: {
    editTask(task) {
      this.selectedTask = task
      this.showTaskForm = true
    },
    
    async deleteTask(taskId) {
      if (confirm('Are you sure you want to delete this task?')) {
        const result = await this.tasksStore.deleteTask(taskId)
        if (result.success) {
          this.toast.success('Task deleted successfully!')
        } else {
          this.toast.error(result.error)
        }
      }
    },
    
    closeTaskForm() {
      this.showTaskForm = false
      this.selectedTask = null
    },
    
    async handleTaskSubmit(taskData) {
      let result
      
      if (this.selectedTask) {
        result = await this.tasksStore.updateTask(this.selectedTask.id, taskData)
      } else {
        result = await this.tasksStore.createTask(taskData)
      }
      
      if (result.success) {
        this.closeTaskForm()
        this.toast.success(this.selectedTask ? 'Task updated!' : 'Task created!')
      } else {
        this.toast.error(result.error)
      }
    }
  }
}
</script>

<style scoped>
.tasks-page {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.header-actions {
  display: flex;
  gap: 15px;
  align-items: center;
}

.filter-select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  background: white;
}

.tasks-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}

.empty-state p {
  font-size: 16px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.2s;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background-color: #2563eb;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }
  
  .header-actions {
    justify-content: space-between;
  }
  
  .tasks-grid {
    grid-template-columns: 1fr;
  }
}
</style>