<template>
  <div class="auth-container">
    <div class="auth-card">
      <h2>Task Management System</h2>
      <p class="auth-subtitle">Create your account</p>
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
            placeholder="Enter your full name"
          />
        </div>

        <div class="form-group">
          <label for="email">Email Address</label>
          <input
            type="email"
            id="email"
            v-model="formData.email"
            required
            class="form-control"
            placeholder="Enter your email"
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
            placeholder="Enter your password"
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
            placeholder="Confirm your password"
          />
        </div>

        <button type="submit" :disabled="loading" class="btn btn-primary">
          {{ loading ? 'Creating Account...' : 'Sign Up' }}
        </button>
      </form>
      
      <p class="auth-footer">
        Already have an account? <router-link to="/">Sign In</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/store/modules/auth'

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
  setup() {
    const authStore = useAuthStore()
    return {
      authStore
    }
  },
  methods: {
    async handleRegister() {
      this.loading = true
      this.error = null
      
      // Use Pinia store directly
      const result = await this.authStore.register(this.formData)
      
      this.loading = false
      
      if (result.success) {
        this.$router.push('/dashboard')
      } else {
        this.error = result.error
      }
    }
  }
}
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.auth-card {
  background: white;
  padding: 48px 40px;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 420px;
  position: relative;
  overflow: hidden;
}

.auth-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #667eea, #764ba2);
}

h2 {
  text-align: center;
  margin-bottom: 8px;
  color: #1f2937;
  font-size: 28px;
  font-weight: 700;
}

.auth-subtitle {
  text-align: center;
  margin-bottom: 32px;
  color: #6b7280;
  font-size: 16px;
  font-weight: 400;
}

.form-group {
  margin-bottom: 24px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #374151;
  font-size: 14px;
}

.form-control {
  width: 100%;
  padding: 14px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 16px;
  transition: all 0.3s ease;
  background-color: #fafafa;
  box-sizing: border-box;
}

.form-control:focus {
  outline: none;
  border-color: #667eea;
  background-color: white;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-control::placeholder {
  color: #9ca3af;
}

.btn-primary {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s ease;
  margin-top: 8px;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
}

.btn-primary:active:not(:disabled) {
  transform: translateY(0);
}

.btn-primary:disabled {
  background: linear-gradient(135deg, #d1d5db 0%, #9ca3af 100%);
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.error-message {
  color: #dc2626;
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 14px;
  display: flex;
  align-items: center;
}

.error-message::before {
  content: "⚠️";
  margin-right: 8px;
}

.auth-footer {
  margin-top: 24px;
  text-align: center;
  color: #6b7280;
  font-size: 14px;
}

.auth-footer a {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.auth-footer a:hover {
  color: #764ba2;
  text-decoration: underline;
}

/* Responsive design */
@media (max-width: 480px) {
  .auth-container {
    padding: 16px;
  }
  
  .auth-card {
    padding: 32px 24px;
  }
  
  h2 {
    font-size: 24px;
  }
}
</style>