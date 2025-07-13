<template>
  <div class="auth-container">
    <div class="auth-card">
      <h2>Register</h2>
      <form @submit.prevent="handleRegister">
        
        <div v-if="error" class="error-message">{{ error }}</div>

        <div class="form-group">
          <label for="name">Name</label>
          <input 
            type="text" 
            id="name" 
            v-model="formData.name" 
            required 
            class="form-control"
          />
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input 
            type="email" 
            id="email" 
            v-model="formData.email" 
            required 
            class="form-control"
          />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input 
            type="password" 
            id="password" 
            v-model="formData.password" 
            required 
            class="form-control"
          />
        </div>

        <div class="form-group">
          <label for="password_confirmation">Confirm Password</label>
          <input 
            type="password" 
            id="password_confirmation" 
            v-model="formData.password_confirmation" 
            required 
            class="form-control"
          />
        </div>

        <button type="submit" :disabled="loading" class="btn btn-primary">
          {{ loading ? 'Registering...' : 'Register' }}
        </button>
      </form>
      <p class="auth-footer">
        Already have an account? <router-link to="/login">Login here</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'Register',
  data() {
    return {
      formData: {
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
      },
      loading: false,
      error: null
    }
  },
  methods: {
    ...mapActions('auth', ['register']),
    
    async handleRegister() {
      this.loading = true
      this.error = null
      
      // Ensure the data structure matches the Laravel backend requirements
      const result = await this.register(this.formData)
      
      this.loading = false
      
      if (result.success) {
        // Redirect to the dashboard upon successful registration
        this.$router.push('/dashboard')
      } else {
        this.error = result.error
      }
    }
  }
}
</script>

<style scoped>
/* You can reuse or adapt the styles from Login.vue or Dashboard.vue */
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f4f8;
}

.auth-card {
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

h2 {
  text-align: center;
  margin-bottom: 24px;
  color: #333;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
}

.form-control {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.btn-primary {
  width: 100%;
  padding: 10px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-primary:hover {
  background-color: #2563eb;
}

.btn-primary:disabled {
  background-color: #93c5fd;
  cursor: not-allowed;
}

.error-message {
  color: #ef4444;
  background-color: #fee2e2;
  border: 1px solid #fca5a5;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.auth-footer {
  margin-top: 20px;
  text-align: center;
}
</style>