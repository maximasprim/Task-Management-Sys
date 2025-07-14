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
          @click.prevent="setActiveView('dashboard')" 
          :class="['nav-item', { active: activeView === 'dashboard' }]"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
          </svg>
          Dashboard
        </a>
        <a 
          href="#" 
          @click.prevent="setActiveView('tasks')" 
          :class="['nav-item', { active: activeView === 'tasks' }]"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
          </svg>
          Tasks
        </a>
        <a 
          v-if="authStore.isAdmin" 
          href="#" 
          @click.prevent="setActiveView('users')" 
          :class="['nav-item', { active: activeView === 'users' }]"
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
            <h1 class="page-title">{{ getPageTitle }}</h1>
            <p class="page-subtitle">{{ getPageSubtitle }}</p>
          </div>
          <div class="header-right">
            <div class="search-bar">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
              <input 
                type="text" 
                :placeholder="getSearchPlaceholder"
                v-model="searchQuery" 
              />
            </div>
            <button 
              v-if="authStore.isAdmin && activeView === 'dashboard'" 
              @click="showTaskForm = true"
              class="btn btn-primary"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 5v14M5 12h14"/>
              </svg>
              Create Task
            </button>
            <button
              v-if="authStore.isAdmin && activeView === 'users'"
              @click="showUserForm = true" 
              class="btn btn-primary"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 5v14M5 12h14"/>
              </svg>
              Add User
            </button>
            <button
              v-if="activeView === 'tasks'"
              @click="showTaskForm = true"
              class="btn btn-primary"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 5v14M5 12h14"/>
              </svg>
              Create Task
            </button>
          </div>
        </div>
      </header>

      <main class="main-wrapper">
        <!-- Dashboard View -->
        <div v-if="activeView === 'dashboard'" class="dashboard-view">
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

        <!-- Tasks View -->
        <div v-if="activeView === 'tasks'" class="tasks-view">
          <div class="content-section">
            <div class="section-header">
              <h2>All Tasks</h2>
              <p>Complete task management and overview</p>
            </div>
            
            <!-- Task Statistics -->
            <div class="task-stats-mini">
              <div class="mini-stat">
                <div class="mini-stat-number">{{ allTasks.length }}</div>
                <div class="mini-stat-label">Total Tasks</div>
              </div>
              <div class="mini-stat">
                <div class="mini-stat-number">{{ filteredTasks.pending.length }}</div>
                <div class="mini-stat-label">Pending</div>
              </div>
              <div class="mini-stat">
                <div class="mini-stat-number">{{ filteredTasks.inProgress.length }}</div>
                <div class="mini-stat-label">In Progress</div>
              </div>
              <div class="mini-stat">
                <div class="mini-stat-number">{{ filteredTasks.completed.length }}</div>
                <div class="mini-stat-label">Completed</div>
              </div>
            </div>

            <!-- Task List -->
            <div class="task-list-view">
              <div class="task-list-header">
                <div class="task-filters">
                  <button 
                    v-for="status in taskStatuses" 
                    :key="status.value"
                    @click="selectedStatus = status.value"
                    :class="['filter-btn', { active: selectedStatus === status.value }]"
                  >
                    <div :class="['status-dot', status.value]"></div>
                    {{ status.label }}
                  </button>
                </div>
              </div>
              
              <div class="task-grid">
                <TaskCard 
                  v-for="task in filteredTasksByStatus" 
                  :key="task.id" 
                  :task="task"
                  @edit="editTask"
                  @delete="deleteTask"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Users View -->
        <div v-if="activeView === 'users' && authStore.isAdmin" class="users-view">
          <div class="content-section">
            <div class="section-header">
              <h2>User Management</h2>
              <p>Manage system users and their permissions</p>
            </div>
            <UserList 
              :users="filteredUsers" 
              @add-user="showUserForm = true" 
              @edit-user="editUser"
              @delete-user="deleteUser"
            />
          </div>
        </div>
      </main>
    </div>

    <!-- Task Form Modal -->
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

    <!-- User Form Modal -->
    <Transition name="modal">
     <div v-if="showUserForm" class="modal-overlay" @click="closeUserForm">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h3>{{ selectedUser ? 'Edit User' : 'Add New User' }}</h3>
            <button class="modal-close" @click="closeUserForm">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <UserForm 
              :user="selectedUser"
              @close="closeUserForm"
              @submit="handleUserSubmit"
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
import { computed, ref, onMounted, watch } from 'vue'
import TaskCard from '@/components/Task/TaskCard.vue'
import TaskForm from '@/components/Task/TaskForm.vue'
import UserList from '@/components/User/UserList.vue'
import UserForm from '@/components/User/UserForm.vue'
import { useRouter } from 'vue-router'

export default {
  name: 'Dashboard',
  components: {
    TaskCard,
    TaskForm,
    UserList,
    UserForm
  },
  setup() {
    const authStore = useAuthStore()
    const tasksStore = useTasksStore()
    const usersStore = useUsersStore()
    const router = useRouter()

    // State for active view
    const activeView = ref('dashboard')
    
    // State for task management and search
    const showTaskForm = ref(false)
    const selectedTask = ref(null)
    const searchQuery = ref('')
    
    // State for user management
    const showUserForm = ref(false)
    const selectedUser = ref(null)
    
    // State for task filtering
    const selectedStatus = ref('all')
    
    // Task statuses for filtering
    const taskStatuses = [
      { value: 'all', label: 'All Tasks' },
      { value: 'pending', label: 'Pending' },
      { value: 'in-progress', label: 'In Progress' },
      { value: 'completed', label: 'Completed' }
    ]
    
    // --- Dynamic User Profile ---
    const user = computed(() => authStore.user || {})

    const userInitials = computed(() => {
      return user.value.name ? user.value.name.charAt(0).toUpperCase() : 'U'
    })

    const userName = computed(() => user.value.name || 'Guest')
    const userRole = computed(() => authStore.isAdmin ? 'Admin' : 'User')

    // --- Navigation Methods ---
    const setActiveView = (view) => {
      activeView.value = view
      // Clear search when switching views
      searchQuery.value = ''
      selectedStatus.value = 'all'
    }

    // --- Dynamic Page Content ---
    const getPageTitle = computed(() => {
      switch (activeView.value) {
        case 'dashboard':
          return 'Dashboard'
        case 'tasks':
          return 'Tasks'
        case 'users':
          return 'Users'
        default:
          return 'Dashboard'
      }
    })

    const getPageSubtitle = computed(() => {
      switch (activeView.value) {
        case 'dashboard':
          return 'Overview of your tasks and progress'
        case 'tasks':
          return 'Manage all tasks and their status'
        case 'users':
          return 'Manage system users and permissions'
        default:
          return 'Overview of your tasks and progress'
      }
    })

    const getSearchPlaceholder = computed(() => {
      switch (activeView.value) {
        case 'dashboard':
          return 'Search tasks...'
        case 'tasks':
          return 'Search tasks...'
        case 'users':
          return 'Search users...'
        default:
          return 'Search...'
      }
    })

    // --- Search Implementation ---
    const filteredTasks = computed(() => {
      const query = searchQuery.value.toLowerCase().trim();

      const filterList = (list) => {
        if (!query) {
          return list;
        }
        return list.filter(task => {
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

    // All tasks for the tasks view
    const allTasks = computed(() => [
      ...tasksStore.pendingTasks,
      ...tasksStore.inProgressTasks,
      ...tasksStore.completedTasks
    ])

    // Filtered tasks by status for tasks view
    const filteredTasksByStatus = computed(() => {
      let tasks = allTasks.value
      
      if (selectedStatus.value !== 'all') {
        tasks = tasks.filter(task => task.status === selectedStatus.value)
      }
      
      const query = searchQuery.value.toLowerCase().trim()
      if (query) {
        tasks = tasks.filter(task => {
          const titleMatch = task.title?.toLowerCase().includes(query)
          const descriptionMatch = task.description?.toLowerCase().includes(query)
          return titleMatch || descriptionMatch
        })
      }
      
      return tasks
    })

    // Filtered users
    const filteredUsers = computed(() => {
      const query = searchQuery.value.toLowerCase().trim()
      if (!query) {
        return usersStore.allUsers
      }
      return usersStore.allUsers.filter(user => {
        const nameMatch = user.name?.toLowerCase().includes(query)
        const emailMatch = user.email?.toLowerCase().includes(query)
        return nameMatch || emailMatch
      })
    })

    // --- Data Fetching ---
    onMounted(async () => {
      await tasksStore.fetchTasks()
      
      if (authStore.isAdmin) {
        await usersStore.fetchUsers() 
      }
    })
    
    // Watch the active view and fetch data accordingly
    watch(activeView, (newView) => {
      if (newView === 'users' && authStore.isAdmin && !usersStore.allUsers.length) {
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
      } else {
        console.error('Task submit error:', result.error)
      }
    }

    // --- User Management Methods ---
    const editUser = (user) => {
      selectedUser.value = user
      showUserForm.value = true
    }

    const deleteUser = async (userId) => {
      if (confirm('Are you sure you want to delete this user?')) {
        const result = await usersStore.deleteUser(userId)
        if (!result.success) {
          console.error('Delete user error:', result.error)
        }
      }
    }

    const closeUserForm = () => {
      showUserForm.value = false
      selectedUser.value = null
    }

    const handleUserSubmit = async (userData) => {
      let result
      if (selectedUser.value) {
        result = await usersStore.updateUser(selectedUser.value.id, userData)
      } else {
        result = await usersStore.createUser(userData)
      }
      
      if (result.success) {
        closeUserForm()
      } else {
        console.error('User submit error:', result.error)
      }
    }

    // --- Logout ---
    const logout = async () => {
      try {
        // Assuming authStore has a logout method that clears session/token
        await authStore.logout()
        // Redirect to login or home page
        localStorage.removeItem('token')
        router.push('/')
      } catch (error) {
        console.error('Logout error:', error)
        // Even if logout fails, redirect to login
        router.push('/')
      }
    }

    return {
      authStore,
      tasksStore,
      usersStore,
      activeView,
      setActiveView,
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
      showUserForm,
      selectedUser,
      editUser,
      deleteUser,
      closeUserForm,
      handleUserSubmit,
      searchQuery,
      filteredTasks,
      filteredUsers,
      allTasks,
      filteredTasksByStatus,
      selectedStatus,
      taskStatuses,
      getPageTitle,
      getPageSubtitle,
      getSearchPlaceholder
    }
  },
}
</script>

<style scoped>
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
  flex-shrink: 0;
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
  overflow-y: auto;
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
  flex-shrink: 0;
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
  min-height: 100vh;
}

/* Header */
.header {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  padding: 0 32px;
  position: sticky;
  top: 0;
  z-index: 50;
  flex-shrink: 0;
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
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

/* Button Styles */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

/* Main Wrapper */
.main-wrapper {
  flex: 1;
  padding: 32px;
  overflow-y: auto;
}

/* Dashboard View */
.dashboard-view {
  max-width: 1200px;
  margin: 0 auto;
}

/* Stats Grid */
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
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 16px;
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-card.pending .stat-icon {
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  color: white;
}

.stat-card.in-progress .stat-icon {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
}

.stat-card.completed .stat-icon {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
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
  border-radius: 4px;
}

.trend-indicator.positive {
  color: #10b981;
  background: rgba(16, 185, 129, 0.1);
}

/* Task Board */
.task-board {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-top: 32px;
}

.task-column {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  min-height: 500px;
}

.column-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e2e8f0;
}

.column-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.column-badge {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.column-badge.pending {
  background: #fbbf24;
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
  font-weight: 500;
}

.column-action-btn {
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  color: #64748b;
  border-radius: 4px;
  transition: all 0.2s;
}

.column-action-btn:hover {
  background: #f1f5f9;
  color: #1a202c;
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Tasks View */
.tasks-view {
  max-width: 1200px;
  margin: 0 auto;
}

.content-section {
  background: white;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.section-header {
  margin-bottom: 32px;
  text-align: center;
}

.section-header h2 {
  margin: 0 0 8px 0;
  font-size: 28px;
  font-weight: 700;
  color: #1a202c;
}

.section-header p {
  margin: 0;
  color: #64748b;
  font-size: 16px;
}

.task-stats-mini {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
  padding: 20px;
  background: #f8fafc;
  border-radius: 8px;
}

.mini-stat {
  text-align: center;
}

.mini-stat-number {
  font-size: 24px;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 4px;
}

.mini-stat-label {
  font-size: 12px;
  color: #64748b;
  font-weight: 500;
}

.task-list-view {
  margin-top: 32px;
}

.task-list-header {
  margin-bottom: 24px;
}

.task-filters {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
  color: #64748b;
}

.filter-btn:hover {
  border-color: #667eea;
  color: #667eea;
}

.filter-btn.active {
  background: #667eea;
  border-color: #667eea;
  color: white;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-dot.pending {
  background: #fbbf24;
}

.status-dot.in-progress {
  background: #3b82f6;
}

.status-dot.completed {
  background: #10b981;
}

.task-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

/* Users View */
.users-view {
  max-width: 1200px;
  margin: 0 auto;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 24px 0 24px;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 24px;
}

.modal-header h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #1a202c;
}

.modal-close {
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  color: #64748b;
  border-radius: 4px;
  transition: all 0.2s;
}

.modal-close:hover {
  background: #f1f5f9;
  color: #1a202c;
}

.modal-body {
  padding: 0 24px 24px 24px;
}

/* Modal Transitions */
.modal-enter-active, .modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from, .modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: transform 0.3s ease;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.95);
}

/* Responsive Design */
@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }

  .main-content {
    margin-left: 0;
  }

  .header-content {
    flex-direction: column;
    gap: 16px;
    height: auto;
    padding: 20px 0;
  }

  .search-bar input {
    width: 200px;
  }

  .task-board {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .task-grid {
    grid-template-columns: 1fr;
  }

  .task-filters {
    justify-content: center;
  }

  .main-wrapper {
    padding: 20px;
  }
}

@media (max-width: 480px) {
  .header-right {
    flex-direction: column;
    width: 100%;
    gap: 12px;
  }

  .search-bar input {
    width: 100%;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }

  .modal-content {
    margin: 10px;
    max-width: calc(100% - 20px);
  }
}

/* Scrollbar Styling */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Focus Styles */
.nav-item:focus,
.btn:focus,
.filter-btn:focus {
  outline: 2px solid #667eea;
  outline-offset: 2px;
}

/* Animation for smooth transitions */
.task-column,
.stat-card,
.content-section {
  animation: fadeInUp 0.5s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Loading states */
.loading {
  opacity: 0.6;
  pointer-events: none;
}

.loading::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 20px;
  height: 20px;
  border: 2px solid #667eea;
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  transform: translate(-50%, -50%);
}

@keyframes spin {
  0% { transform: translate(-50%, -50%) rotate(0deg); }
  100% { transform: translate(-50%, -50%) rotate(360deg); }
}
</style>