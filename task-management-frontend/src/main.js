// src/main.js - Updated version
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import router from './router'
import { useAuthStore } from '@/store/modules/auth'

const app = createApp(App)

// Setup Pinia
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)

// Initialize auth store before mounting
const authStore = useAuthStore()

// Initialize auth and then mount the app
authStore.initAuth().then(() => {
  app.use(router)
  app.mount('#app')
})