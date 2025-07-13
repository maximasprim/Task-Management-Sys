<template>
  <div class="user-list">
    <div class="list-header">
      <h3>Users ({{ users.length }})</h3>
      <button @click="$emit('add-user')" class="btn btn-primary btn-sm">
        Add User
      </button>
    </div>
    
    <div class="users-grid">
      <div v-for="user in users" :key="user.id" class="user-card">
        <div class="user-info">
          <div class="user-avatar">
            {{ user.name.charAt(0).toUpperCase() }}
          </div>
          <div class="user-details">
            <h4>{{ user.name }}</h4>
            <p>{{ user.email }}</p>
            <span class="role-badge" :class="user.role">
              {{ user.role }}
            </span>
          </div>
        </div>
        
        <div class="user-actions">
          <button 
            @click="$emit('edit-user', user)" 
            class="btn btn-sm btn-edit"
          >
            Edit
          </button>
          <button 
            @click="$emit('delete-user', user.id)" 
            class="btn btn-sm btn-delete"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
    
    <div v-if="users.length === 0" class="empty-state">
      <p>No users found.</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserList',
  emits: ['add-user', 'edit-user', 'delete-user'],
  props: {
    users: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style scoped>
.user-list {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e5e7eb;
}

.list-header h3 {
  margin: 0;
  color: #333;
}

.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 15px;
}

.user-card {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s;
}

.user-card:hover {
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  transform: translateY(-2px);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 16px;
}

.user-details h4 {
  margin: 0 0 4px 0;
  color: #333;
  font-size: 14px;
}

.user-details p {
  margin: 0 0 8px 0;
  color: #666;
  font-size: 13px;
}

.role-badge {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
}

.role-badge.admin {
  background-color: #fef3c7;
  color: #92400e;
}

.role-badge.user {
  background-color: #d1fae5;
  color: #065f46;
}

.user-actions {
  display: flex;
  gap: 8px;
}

.btn {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-sm {
  padding: 4px 8px;
    font-size: 12px;
}
</style>