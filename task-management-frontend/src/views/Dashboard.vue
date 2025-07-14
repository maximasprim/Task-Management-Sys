<template>
  <div class="app-layout">
    <aside class="sidebar">
      <div class="sidebar-header">
        <div class="logo">
          <div class="logo-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <h2>TaskHub</h2>
        </div>
      </div>
      
      <nav class="sidebar-nav">
        <a 
          href="#" 
          @click.prevent="navigateTo('/')" 
          :class="['nav-item', { active: currentRouteName === 'Dashboard' }]"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
          </svg>
          Dashboard
        </a>
        <a 
          href="#" 
          @click.prevent="navigateTo('/tasks')" 
          :class="['nav-item', { active: currentRouteName === 'Tasks' }]"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
          </svg>
          Tasks
        </a>
        <a 
          v-if="authStore.isAdmin" 
          href="#" 
          @click.prevent="navigateTo('/users')" 
          :class="['nav-item', { active: currentRouteName === 'Users' }]"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="8.5" cy="7" r="4"/>
            <path d="m22 8-5 5-3-3"/>
          </svg>
          Users
        </a>
      </nav>
      
      <div class="sidebar-footer">
        <div class="user-profile">
          <div class="user-avatar">
            <span>{{ userInitials }}</span>
          </div>
          <div class="user-info">
            <div class="user-name">{{ userName }}</div>
            <div class="user-role">{{ userRole }}</div>
          </div>
        </div>
        <button class="logout-btn" @click="logout">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16,17 21,12 16,7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Logout
        </button>
      </div>
    </aside>

    <div class="main-content">
      <header class="header">
        <div class="header-content">
          <div class="header-left">
            <h1 class="page-title">{{ currentRouteName }}</h1>
            <p class="page-subtitle">
              <span v-if="currentRouteName === 'Dashboard'">Overview of your tasks and progress</span>
              <span v-else-if="currentRouteName === 'Users'">Manage system users</span>
              <span v-else-if="currentRouteName === 'Tasks'">Manage all tasks</span>
            </p>
          </div>
          <div class="header-right">
            <div class="search-bar">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
              <input type="text" placeholder="Search tasks..." v-model="searchQuery" />
            </div>
            <button 
              v-if="authStore.isAdmin && currentRouteName === 'Dashboard'" 
              @click="showTaskForm = true"
              class="btn btn-primary"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 5v14M5 12h14"/>
              </svg>
              Create Task
            </button>
            <button
              v-if="authStore.isAdmin && currentRouteName === 'Users'"
              @click="navigateTo('/users/add')" 
              class="btn btn-primary"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 5v14M5 12h14"/>
              </svg>
              Add User
            </button>
          </div>
        </div>
      </header>

      <main class="dashboard-main">
        
        <div v-if="currentRouteName === 'Dashboard'">
          <div class="stats-grid">
            <div class="stat-card pending">
              <div class="stat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12,6 12,12 16,14"/>
                </svg>
              </div>
              <div class="stat-content">
                <h3>{{ filteredTasks.pending.length }}</h3>
                <p>Pending Tasks</p>
              </div>
              <div class="stat-trend">
                <span class="trend-indicator">+12%</span>
              </div>
            </div>
            
            <div class="stat-card in-progress">
              <div class="stat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
              </div>
              <div class="stat-content">
                <h3>{{ filteredTasks.inProgress.length }}</h3>
                <p>In Progress</p>
              </div>
              <div class="stat-trend">
                <span class="trend-indicator positive">+5%</span>
              </div>
            </div>
            
            <div class="stat-card completed">
              <div class="stat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22,4 12,14.01 9,11.01"/>
                </svg>
              </div>
              <div class="stat-content">
                <h3>{{ filteredTasks.completed.length }}</h3>
                <p>Completed</p>
              </div>
              <div class="stat-trend">
                <span class="trend-indicator positive">+8%</span>
              </div>
            </div>
          </div>

          <div class="task-board">
            <div class="task-column pending-column">
              <div class="column-header">
                <div class="column-title">
                  <div class="column-badge pending"></div>
                  <h2>Pending</h2>
                  <span class="task-count">{{ filteredTasks.pending.length }}</span>
                </div>
                <div class="column-actions">
                  <button class="column-action-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/>
                    </svg>
                  </button>
                </div>
              </div>
              <div class="task-list">
                <TaskCard 
                  v-for="task in filteredTasks.pending" 
                  :key="task.id" 
                  :task="task"
                  @edit="editTask"
                  @delete="deleteTask"
                />
              </div>
            </div>
            
            <div class="task-column in-progress-column">
              <div class="column-header">
                <div class="column-title">
                  <div class="column-badge in-progress"></div>
                  <h2>In Progress</h2>
                  <span class="task-count">{{ filteredTasks.inProgress.length }}</span>
                </div>
                <div class="column-actions">
                  <button class="column-action-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/>
                    </svg>
                  </button>
                </div>
              </div>
              <div class="task-list">
                <TaskCard 
                  v-for="task in filteredTasks.inProgress" 
                  :key="task.id" 
                  :task="task"
                  @edit="editTask"
                  @delete="deleteTask"
                />
              </div>
            </div>
            
            <div class="task-column completed-column">
              <div class="column-header">
                <div class="column-title">
                  <div class="column-badge completed"></div>
                  <h2>Completed</h2>
                  <span class="task-count">{{ filteredTasks.completed.length }}</span>
                </div>
                <div class="column-actions">
                  <button class="column-action-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/>
                    </svg>
                  </button>
                </div>
              </div>
              <div class="task-list">
                <TaskCard 
                  v-for="task in filteredTasks.completed" 
                  :key="task.id" 
                  :task="task"
                  @edit="editTask"
                  @delete="deleteTask"
                />
              </div>
            </div>
          </div>
        </div>

        <div v-else-if="currentRouteName === 'Users' && authStore.isAdmin">
          <UserList 
            :users="usersStore.allUsers" 
            @add-user="navigateTo('/users/add')" 
            @edit-user="navigateTo('/users/edit/' + $event.id)"
            @delete-user="usersStore.deleteUser($event)"
          />
        </div>
        
        <div v-else-if="currentRouteName === 'Tasks'">
          <h2>Tasks List (Coming Soon)</h2>
        </div>

      </main>
    </div>

    <Transition name="modal">
      <div v-if="showTaskForm" class="modal-overlay" @click="closeTaskForm">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h3>{{ selectedTask ? 'Edit Task' : 'Create New Task' }}</h3>
            <button class="modal-close" @click="closeTaskForm">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <TaskForm 
              :task="selectedTask"
              @close="closeTaskForm"
              @submit="handleTaskSubmit"
            />
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script>
import { useAuthStore } from '@/store/modules/auth'
import { useTasksStore } from '@/store/modules/tasks'
import { useUsersStore } from '@/store/modules/users' 
import { useRouter, useRoute } from 'vue-router'
import { computed, ref, onMounted, watch } from 'vue'
import TaskCard from '@/components/Task/TaskCard.vue'
import TaskForm from '@/components/Task/TaskForm.vue'
import UserList from '@/components/User/UserList.vue' 

export default {
  name: 'Dashboard',
  components: {
    TaskCard,
    TaskForm,
    UserList
  },
  setup() {
    const authStore = useAuthStore()
    const tasksStore = useTasksStore()
    const usersStore = useUsersStore()
    const router = useRouter()
    const route = useRoute()

    // State for task management and search
    const showTaskForm = ref(false)
    const selectedTask = ref(null)
    const searchQuery = ref('')
    
    // --- Dynamic User Profile ---
    const user = computed(() => authStore.user || {})

    const userInitials = computed(() => {
      // Assuming authStore.user.name is available
      return user.value.name ? user.value.name.charAt(0).toUpperCase() : 'U'
    })

    const userName = computed(() => user.value.name || 'Guest')
    const userRole = computed(() => authStore.isAdmin ? 'Admin' : 'User')

    // --- Navigation and Routing ---
    const currentRouteName = computed(() => route.name || 'Dashboard')

    const navigateTo = (routePath) => {
      // This ensures that when Tasks or Users is selected, the content loads 
      // within the main layout and not as a separate component/page.
      router.push(routePath)
    }

    // --- Search Implementation ---
    const filteredTasks = computed(() => {
      const query = searchQuery.value.toLowerCase().trim();

      const filterList = (list) => {
        if (!query) {
          return list;
        }
        return list.filter(task => {
          // Filter tasks based on title or description
          const titleMatch = task.title?.toLowerCase().includes(query);
          const descriptionMatch = task.description?.toLowerCase().includes(query);
          return titleMatch || descriptionMatch;
        });
      };

      return {
        pending: filterList(tasksStore.pendingTasks),
        inProgress: filterList(tasksStore.inProgressTasks),
        completed: filterList(tasksStore.completedTasks)
      };
    });

    // --- Data Fetching ---
    onMounted(async () => {
      // Fetch initial tasks data
      await tasksStore.fetchTasks()
      
      // Fetch users data if the user is an admin
      if (authStore.isAdmin) {
          await usersStore.fetchUsers() 
      }
    })
    
    // Watch the route and fetch users data if the user navigates to the Users view
    watch(() => route.name, (newName) => {
      if (newName === 'Users' && authStore.isAdmin && !usersStore.allUsers.length) {
        usersStore.fetchUsers()
      }
    })

    // --- Task Management Methods ---
    const editTask = (task) => {
      selectedTask.value = task
      showTaskForm.value = true
    }

    const deleteTask = async (taskId) => {
      if (confirm('Are you sure you want to delete this task?')) {
        const result = await tasksStore.deleteTask(taskId)
        if (!result.success) {
          console.error('Delete task error:', result.error)
        }
      }
    }

    const closeTaskForm = () => {
      showTaskForm.value = false
      selectedTask.value = null
    }

    const handleTaskSubmit = async (taskData) => {
      let result
      if (selectedTask.value) {
        result = await tasksStore.updateTask(selectedTask.value.id, taskData)
      } else {
        result = await tasksStore.createTask(taskData)
      }
      
      if (result.success) {
        closeTaskForm()
        // Optionally show success notification
      } else {
        console.error('Task submit error:', result.error)
      }
    }

    // --- Logout ---
    const logout = async () => {
      // Assuming authStore has a logout method that clears session/token
      await authStore.logout() 
      // Redirect to login or home page
      router.push('/login') 
    }

    return {
      authStore,
      tasksStore,
      usersStore,
      userInitials,
      userName,
      userRole,
      logout,
      showTaskForm,
      selectedTask,
      editTask,
      deleteTask,
      closeTaskForm,
      handleTaskSubmit,
      navigateTo,
      currentRouteName,
      searchQuery,
      filteredTasks // Expose filteredTasks for the template
    }
  },
}
</script>

<style scoped>
/* (The CSS provided in the prompt remains here) */
/* Layout */
.app-layout {
  display: flex;
  min-height: 100vh;
  background-color: #f8fafc;
}

/* Sidebar */
.sidebar {
  width: 260px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100vh;
  left: 0;
  top: 0;
  z-index: 100;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
}

.sidebar-header {
  padding: 24px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.sidebar-nav {
  flex: 1;
  padding: 20px 0;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: all 0.2s;
  border-left: 3px solid transparent;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.nav-item.active {
  background: rgba(255, 255, 255, 0.15);
  color: white;
  border-left-color: white;
}

.sidebar-footer {
  padding: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
}

.user-info {
  flex: 1;
}

.user-name {
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 2px;
}

.user-role {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
}

.logout-btn {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* Main Content */
.main-content {
  flex: 1;
  margin-left: 260px;
  display: flex;
  flex-direction: column;
}

/* Header */
.header {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  padding: 0 32px;
  position: sticky;
  top: 0;
  z-index: 50;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80px;
}

.page-title {
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  color: #1a202c;
}

.page-subtitle {
  margin: 4px 0 0 0;
  color: #64748b;
  font-size: 14px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.search-bar {
  position: relative;
  display: flex;
  align-items: center;
}

.search-bar svg {
  position: absolute;
  left: 12px;
  color: #64748b;
}

.search-bar input {
  padding: 8px 12px 8px 40px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  width: 240px;
  font-size: 14px;
  transition: all 0.2s;
}

.search-bar input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Dashboard Main */
.dashboard-main {
  flex: 1;
  padding: 32px;
  overflow-y: auto;
}

/* Statistics Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.stat-card {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 16px;
  position: relative;
  overflow: hidden;
  transition: all 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
}

.stat-card.pending::before {
  background: #f59e0b;
}

.stat-card.in-progress::before {
  background: #3b82f6;
}

.stat-card.completed::before {
  background: #10b981;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-card.pending .stat-icon {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.stat-card.in-progress .stat-icon {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.stat-card.completed .stat-icon {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.stat-content {
  flex: 1;
}

.stat-content h3 {
  margin: 0 0 4px 0;
  font-size: 28px;
  font-weight: 700;
  color: #1a202c;
}

.stat-content p {
  margin: 0;
  color: #64748b;
  font-size: 14px;
  font-weight: 500;
}

.stat-trend {
  text-align: right;
}

.trend-indicator {
  font-size: 12px;
  font-weight: 600;
  color: #10b981;
  background: rgba(16, 185, 129, 0.1);
  padding: 4px 8px;
  border-radius: 12px;
}

.trend-indicator.positive {
  color: #10b981;
  background: rgba(16, 185, 129, 0.1);
}

/* Task Board */
.task-board {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
}

.task-column {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.column-header {
  padding: 20px;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.column-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.column-badge {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.column-badge.pending {
  background: #f59e0b;
}

.column-badge.in-progress {
  background: #3b82f6;
}

.column-badge.completed {
  background: #10b981;
}

.column-title h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1a202c;
}

.task-count {
  background: #f1f5f9;
  color: #64748b;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.column-action-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  color: #64748b;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.column-action-btn:hover {
  background: #f1f5f9;
  color: #1a202c;
}

.task-list {
  padding: 20px;
  min-height: 400px;
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.2s;
  text-decoration: none;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background: #2563eb;
  transform: translateY(-1px);
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: white;
  border-radius: 12px;
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.modal-header {
  padding: 24px 24px 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #1a202c;
}

.modal-close {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  color: #64748b;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.modal-close:hover {
  background: #f1f5f9;
  color: #1a202c;
}

.modal-body {
  padding: 24px;
  overflow-y: auto;
}

/* Modal Transitions */
.modal-enter-active, .modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from, .modal-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

/* Responsive Design */
@media (max-width: 768px) {
  .sidebar {
    width: 100%;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }
  
  .main-content {
    margin-left: 0;
  }
  
  .header-content {
    flex-direction: column;
    height: auto;
    padding: 16px 0;
    gap: 16px;
  }
  
  .search-bar {
    order: 1;
  }
  
  .search-bar input {
    width: 200px;
  }
  
  .dashboard-main {
    padding: 16px;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .task-board {
    grid-template-columns: 1fr;
  }
}
</style>