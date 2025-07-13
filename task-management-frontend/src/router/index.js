// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Register.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('@/views/Dashboard.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/tasks',
    name: 'Tasks',
    component: () => import('@/views/Tasks.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/users',
    name: 'Users',
    component: () => import('@/views/Users.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem('token')
  const isAuthenticated = store.getters['auth/isAuthenticated']
  
  if (token && !isAuthenticated) {
    await store.dispatch('auth/fetchUser')
  }
  
  if (to.meta.requiresAuth && !store.getters['auth/isAuthenticated']) {
    next('/login')
  } else if (to.meta.requiresGuest && store.getters['auth/isAuthenticated']) {
    next('/')
  } else if (to.meta.requiresAdmin && !store.getters['auth/isAdmin']) {
    next('/')
  } else {
    next()
  }
})

export default router