<template>
  <div id="app">
    <div v-if="isAuthenticated" class="app-layout">
      <nav class="sidebar">
        <div class="nav-brand">
          <h2>Task Manager</h2>
        </div>
        <ul class="nav-menu">
          <li>
            <router-link to="/" class="nav-link">
              Dashboard
            </router-link>
          </li>
          <li>
            <router-link to="/tasks" class="nav-link">
              Tasks
            </router-link>
          </li>
          <li v-if="isAdmin">
            <router-link to="/users" class="nav-link">
              Users
            </router-link>
          </li>
        </ul>
        <div class="user-info">
          <p>{{ user.name }}</p>
          <button @click="logout" class="btn btn-logout">
            Logout
          </button>
        </div>
      </nav>
      
      <main class="main-content">
        <router-view />
      </main>
    </div>
    
    <div v-else class="auth-layout">
      <router-view />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'App',
  computed: {
    ...mapGetters('auth', ['isAuthenticated', 'isAdmin', 'user'])
  },
  methods: {
    ...mapActions('auth', ['logout']),
    
    async logout() {
      await this.logout()
      this.$router.push('/login')
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  background-color: #f5f5f5;
}

#app {
  min-height: 100vh;
  width: 100%;
  position: relative;
}

.app-layout {
  display: flex;
  min-height: 100vh;
  width: 100%;
}

.sidebar {
  width: 250px;
  background-color: #1f2937;
  color: white;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.nav-brand h2 {
  margin-bottom: 30px;
  color: #3b82f6;
}

.nav-menu {
  list-style: none;
  flex-grow: 1;
}

.nav-menu li {
  margin-bottom: 10px;
}

.nav-link {
  display: block;
  padding: 10px 15px;
  color: #d1d5db;
  text-decoration: none;
  border-radius: 6px;
  transition: all 0.2s;
}

.nav-link:hover,
.nav-link.router-link-active {
  background-color: #374151;
  color: white;
}

.user-info {
  border-top: 1px solid #374151;
  padding-top: 20px;
}

.user-info p {
  margin-bottom: 10px;
  color: #d1d5db;
}

.btn-logout {
  background-color: #ef4444;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.main-content {
  flex: 1;
  overflow-y: auto;
}

.auth-layout {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
</style>