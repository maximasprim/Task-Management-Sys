<!-- src/components/Task/TaskCard.vue -->
<template>
  <div class="task-card" :class="statusClass">
    <div class="task-header">
      <h3>{{ task.title }}</h3>
      <span class="task-status" :class="statusClass">{{ formattedStatus }}</span>
    </div>
    
    <p class="task-description">{{ task.description }}</p>
    
    <div class="task-meta">
      <p><strong>Assigned to:</strong> {{ task.assigned_user.name }}</p>
      <p><strong>Deadline:</strong> {{ formattedDeadline }}</p>
      <p><strong>Assigned by:</strong> {{ task.assigned_by_user.name }}</p>
    </div>
    
    <div class="task-actions">
      <select 
        v-if="canUpdateStatus" 
        v-model="selectedStatus" 
        @change="updateStatus"
        class="status-select"
      >
        <option value="pending">Pending</option>
        <option value="in_progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>
      
      <button 
        v-if="canEdit" 
        @click="$emit('edit', task)"
        class="btn btn-edit"
      >
        Edit
      </button>
      
      <button 
        v-if="canDelete" 
        @click="$emit('delete', task.id)"
        class="btn btn-delete"
      >
        Delete
      </button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'TaskCard',
  props: {
    task: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      selectedStatus: this.task.status
    }
  },
  computed: {
    ...mapGetters('auth', ['user', 'isAdmin']),
    
    statusClass() {
      return `status-${this.task.status.replace('_', '-')}`
    },
    
    formattedStatus() {
      return this.task.status.replace('_', ' ').toUpperCase()
    },
    
    formattedDeadline() {
      return new Date(this.task.deadline).toLocaleDateString()
    },
    
    canUpdateStatus() {
      return this.task.assigned_to === this.user.id
    },
    
    canEdit() {
      return this.isAdmin
    },
    
    canDelete() {
      return this.isAdmin
    }
  },
  methods: {
    ...mapActions('tasks', ['updateTaskStatus']),
    
    async updateStatus() {
      const result = await this.updateTaskStatus({
        id: this.task.id,
        status: this.selectedStatus
      })
      
      if (!result.success) {
        this.$toast.error(result.error)
        this.selectedStatus = this.task.status
      }
    }
  }
}
</script>

<style scoped>
.task-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  background: white;
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.task-status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
}

.status-pending {
  background-color: #fef3c7;
  color: #92400e;
}

.status-in-progress {
  background-color: #dbeafe;
  color: #1e40af;
}

.status-completed {
  background-color: #d1fae5;
  color: #065f46;
}

.task-description {
  margin-bottom: 12px;
  color: #666;
}

.task-meta {
  margin-bottom: 16px;
}

.task-meta p {
  margin: 4px 0;
  font-size: 14px;
}

.task-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.status-select {
  padding: 4px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.btn {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.btn-edit {
  background-color: #3b82f6;
  color: white;
}

.btn-delete {
  background-color: #ef4444;
  color: white;
}
</style>