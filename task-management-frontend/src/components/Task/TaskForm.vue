<!-- src/components/Task/TaskForm.vue -->
<template>
  <div class="task-form">
    <h2>{{ isEditing ? 'Edit Task' : 'Create Task' }}</h2>
    
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="title">Title</label>
        <input 
          id="title"
          v-model="formData.title"
          type="text"
          required
          class="form-control"
        />
      </div>
      
      <div class="form-group">
        <label for="description">Description</label>
        <textarea 
          id="description"
          v-model="formData.description"
          rows="4"
          class="form-control"
        ></textarea>
      </div>
      
      <div class="form-group">
        <label for="assigned_to">Assign To</label>
        <select 
          id="assigned_to"
          v-model="formData.assigned_to"
          required
          class="form-control"
        >
          <option value="">Select User</option>
          <option 
            v-for="user in users" 
            :key="user.id" 
            :value="user.id"
          >
            {{ user.name }}
          </option>
        </select>
      </div>
      
      <div class="form-group">
        <label for="deadline">Deadline</label>
        <input 
          id="deadline"
          v-model="formData.deadline"
          type="datetime-local"
          required
          class="form-control"
        />
      </div>
      
      <div class="form-actions">
        <button type="button" @click="$emit('close')" class="btn btn-secondary">
          Cancel
        </button>
        <button type="submit" class="btn btn-primary">
          {{ isEditing ? 'Update' : 'Create' }} Task
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'TaskForm',
  props: {
    task: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      formData: {
        title: '',
        description: '',
        assigned_to: '',
        deadline: ''
      }
    }
  },
  computed: {
    ...mapState('users', ['users']),
    
    isEditing() {
      return !!this.task
    }
  },
  async created() {
    await this.fetchUsers()
    
    if (this.task) {
      this.formData = {
        title: this.task.title,
        description: this.task.description,
        assigned_to: this.task.assigned_to,
        deadline: this.formatDatetimeLocal(this.task.deadline)
      }
    }
  },
  methods: {
    ...mapActions('users', ['fetchUsers']),
    
    formatDatetimeLocal(dateString) {
      const date = new Date(dateString)
      return date.toISOString().slice(0, 16)
    },
    
    handleSubmit() {
      this.$emit('submit', this.formData)
    }
  }
}
</script>

<style scoped>
.task-form {
  max-width: 500px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 4px;
  font-weight: 500;
  color: #333;
}

.form-control {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-control:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 20px;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}

.btn-secondary {
  background-color: #6b7280;
  color: white;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
}

.btn:hover {
  opacity: 0.9;
}
</style>