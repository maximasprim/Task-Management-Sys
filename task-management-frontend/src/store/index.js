// import { createStore } from 'vuex'
// import auth from './modules/auth'
// import tasks from './modules/tasks'
// import users from './modules/users'

// export default createStore({
//   modules: {
//     auth,
//     tasks,
//     users
//   },
//   // strict: process.env.NODE_ENV !== 'production'
// })

// src/store/index.js - Convert your existing index.js to export Pinia stores
// Remove all Vuex-related imports and createStore

// Export your converted Pinia stores
export { useAuthStore } from './modules/auth'
export { useTasksStore } from './modules/tasks'
export { useUsersStore } from './modules/users'

// Add these exports as you convert each module to Pinia
// export { useTasksStore } from './modules/tasks'
// export { useUsersStore } from './modules/users'

// Optional: If you want to keep some compatibility, add a default export
// (but this isn't recommended for Pinia)
export default {
  // This is just for compatibility - not actually used
  useAuthStore: () => import('./modules/auth').then(m => m.useAuthStore),
  useTasksStore: () => import('./modules/tasks').then(m => m.useTasksStore),
  useUsersStore: () => import('./modules/users').then(m => m.useUsersStore)
}

// This allows you to import like:
// import { useAuthStore } from '@/store'
// instead of 
// import { useAuthStore } from '@/store/modules/auth'