<!-- src/views/Users.vue -->
<template>
  <div class="users-page">
    <div class="page-header">
      <h1>User Management</h1>
      <button @click="showUserForm = true" class="btn btn-primary">
        Add User
      </button>
    </div>

    <div class="users-table">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>
              <span class="role-badge" :class="user.role">
                {{ user.role }}
              </span>
            </td>
            <td>{{ formatDate(user.created_at) }}</td>
            <td>
              <button 
                @click="editUser(user)" 
                class="btn btn-sm btn-edit"
              >
                Edit
              </button>
              <button 
                @click="deleteUser(user.id)" 
                class="btn btn-sm btn-delete"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- User Form Modal -->
    <div v-if="showUserForm" class="modal-overlay" @click="closeUserForm">
      <div class="modal-content" @click.stop>
        <UserForm 
          :user="selectedUser"
          @close="closeUserForm"
          @submit="handleUserSubmit"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import UserForm from '@/components/User/UserForm.vue'

export default {
  name: 'Users',
  components: {
    UserForm
  },
  data() {
    return {
      showUserForm: false,
      selectedUser: null
    }
  },
  computed: {
    ...mapState('users', ['users'])
  },
  async created() {
    await this.fetchUsers()
  },
  methods: {
    ...mapActions('users', ['fetchUsers', 'createUser', 'updateUser', 'deleteUser']),
    
    editUser(user) {
      this.selectedUser = user
      this.showUserForm = true
    },
    
    async deleteUser(userId) {
      if (confirm('Are you sure you want to delete this user?')) {
        const result = await this.deleteUser(userId)
        if (!result.success) {
          this.$toast.error(result.error)
        }
      }
    },
    
    closeUserForm() {
      this.showUserForm = false
      this.selectedUser = null
    },
    
    async handleUserSubmit(userData) {
      let result
      
      if (this.selectedUser) {
        result = await this.updateUser({ 
          id: this.selectedUser.id, 
          userData 
        })
      } else {
        result = await this.createUser(userData)
      }
      
      if (result.success) {
        this.closeUserForm()
        this.$toast.success(this.selectedUser ? 'User updated!' : 'User created!')
      } else {
        this.$toast.error(result.error)
      }
    },
    
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString()
    }
  }
}
</script>

<style scoped>
.users-page {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.users-table {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #333;
}

.role-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
}

.role-badge.admin {
  background-color: #dc2626;
  color: white;
}

.role-badge.user {
  background-color: #059669;
  color: white;
}

.btn {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  margin-right: 8px;
}

.btn-sm {
  padding: 4px 8px;
  font-size: 11px;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
}

.btn-edit {
  background-color: #f59e0b;
  color: white;
}

.btn-delete {
  background-color: #ef4444;
  color: white;
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
}
</style>