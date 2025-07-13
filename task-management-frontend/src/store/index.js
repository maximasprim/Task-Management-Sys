import { createStore } from 'vuex'
import auth from './modules/auth'
import tasks from './modules/tasks'
import users from './modules/users'

export default createStore({
  modules: {
    auth,
    tasks,
    users
  },
  // strict: process.env.NODE_ENV !== 'production'
})