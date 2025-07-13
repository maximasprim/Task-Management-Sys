<!-- src/views/Dashboard.vue -->
<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <h1>Task Management Dashboard</h1>
      <button 
        v-if="isAdmin" 
        @click="showTaskForm = true"
        class="btn btn-primary"
      >
        Create Task
      </button>
    </div>

    <div class="dashboard-stats">
      <div class="stat-card">
        <h3>{{ pendingTasks.length }}</h3>
        <p>Pending Tasks</p>
      </div>
      <div class="stat-card">
        <h3>{{ inProgressTasks.length }}</h3>
        <p>In Progress</p>
      </div>
      <div class="stat-card">
        <h3>{{ completedTasks.length }}</h3>
        <p>Completed</p>
      </div>
    </div>

    <div class="dashboard-content">
      <div class="task-columns">
        <div class="task-column">
          <h2>Pending</h2>
          <TaskCard 
            v-for="task in pendingTasks" 
            :key="task.id" 
            :task="task"
            @edit="editTask"
            @delete="deleteTask"
          />
        </div>
        
        <div class="task-column">
          <h2>In Progress</h2>
          <TaskCard 
            v-for="task in inProgressTasks" 
            :key="task.id" 
            :task="task"
            @edit="editTask"
            @delete="deleteTask"
          />
        </div>
        
        <div class="task-column">
          <h2>Completed</h2>
          <TaskCard 
            v-for="task in completedTasks" 
            :key="task.id" 
            :task="task"
            @edit="editTask"
            @delete="deleteTask"
          />
        </div>
      </div>
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
import { mapActions, mapGetters } from 'vuex'
import TaskCard from '@/components/Task/TaskCard.vue'
import TaskForm from '@/components/Task/TaskForm.vue'

export default {
  name: 'Dashboard',
  components: {
    TaskCard,
    TaskForm
  },
  data() {
    return {
      showTaskForm: false,
      selectedTask: null
    }
  },
  computed: {
    ...mapGetters('auth', ['isAdmin']),
    ...mapGetters('tasks', ['pendingTasks', 'inProgressTasks', 'completedTasks'])
  },
  async created() {
    await this.fetchTasks()
  },
  methods: {
    ...mapActions('tasks', ['fetchTasks', 'createTask', 'updateTask', 'deleteTask']),
    
    editTask(task) {
      this.selectedTask = task
      this.showTaskForm = true
    },
    
    async deleteTask(taskId) {
      if (confirm('Are you sure you want to delete this task?')) {
        const result = await this.deleteTask(taskId)
        if (!result.success) {
          this.$toast.error(result.error)
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
        result = await this.updateTask({ 
          id: this.selectedTask.id, 
          taskData 
        })
      } else {
        result = await this.createTask(taskData)
      }
      
      if (result.success) {
        this.closeTaskForm()
        this.$toast.success(this.selectedTask ? 'Task updated!' : 'Task created!')
      } else {
        this.$toast.error(result.error)
      }
    }
  }
}
</script>

<style scoped>
.dashboard {
  padding: 20px;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.dashboard-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  text-align: center;
}

.stat-card h3 {
  font-size: 2em;
  margin: 0 0 10px 0;
  color: #3b82f6;
}

.stat-card p {
  margin: 0;
  color: #666;
}

.task-columns {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.task-column {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  min-height: 400px;
}

.task-column h2 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #333;
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
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background-color: #2563eb;
}
</style>