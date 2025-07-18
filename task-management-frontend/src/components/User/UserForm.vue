<template>
  <div class="user-form">
    <h2>{{ isEditing ? 'Edit User' : 'Create User' }}</h2>
        
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="name">Full Name</label>
        <input 
          id="name"
          v-model="formData.name"
          type="text"
          required
          class="form-control"
          placeholder="Enter full name"
          :disabled="isLoading"
        />
      </div>
            
      <div class="form-group">
        <label for="email">Email Address</label>
        <input 
          id="email"
          v-model="formData.email"
          type="email"
          required
          class="form-control"
          placeholder="Enter email address"
          :disabled="isLoading"
        />
      </div>
            
      <div class="form-group" v-if="!isEditing">
        <label for="password">Password</label>
        <input 
          id="password"
          v-model="formData.password"
          type="password"
          required
          class="form-control"
          placeholder="Enter password"
          :disabled="isLoading"
        />
      </div>
            
      <div class="form-group">
        <label for="role">Role</label>
        <select 
          id="role"
          v-model="formData.role"
          required
          class="form-control"
          :disabled="isLoading"
        >
          <option value="">Select Role</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>
            
      <div class="form-actions">
        <button 
          type="button" 
          @click="$emit('close')" 
          class="btn btn-secondary"
          :disabled="isLoading"
        >
          Cancel
        </button>
        <button 
          type="submit" 
          class="btn btn-primary"
          :disabled="isLoading"
        >
          <span v-if="isLoading" class="loading-spinner"></span>
          {{ isLoading ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update' : 'Create') }} User
        </button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'UserForm',
  emits: ['close', 'submit'],
  props: {
    user: {
      type: Object,
      default: null
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formData: {
        name: '',
        email: '',
        password: '',
        role: ''
      }
    }
  },
  computed: {
    isEditing() {
      return !!this.user
    },
    isLoading() {
      return this.loading
    }
  },
  created() {
    if (this.user) {
      this.formData = {
        name: this.user.name,
        email: this.user.email,
        role: this.user.role,
        password: '' // Don't pre-fill password for editing
      }
    }
  },
  methods: {
    handleSubmit() {
      const submitData = { ...this.formData }
            
      // Remove password from update if it's empty
      if (this.isEditing && !submitData.password) {
        delete submitData.password
      }
            
      this.$emit('submit', submitData)
    }
  }
}
</script>

<style scoped>
.user-form {
  max-width: 500px;
}

.user-form h2 {
  margin-bottom: 20px;
  color: #333;
  font-size: 20px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  color: #333;
  font-size: 14px;
}

.form-control {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.3s;
}

.form-control:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

.form-control:disabled {
  background-color: #f9fafb;
  color: #6b7280;
  cursor: not-allowed;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: #6b7280;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background-color: #4b5563;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #2563eb;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>