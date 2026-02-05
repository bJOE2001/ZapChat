import { createRouter, createWebHashHistory } from 'vue-router'
import routes from './routes'

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// Simple auth guard that relies on the presence of a token in localStorage.
// This avoids using Pinia stores outside of a component setup() context.
router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('zapchat_token')

  if (to.meta.requiresAuth && !token) {
    next({ name: 'login', query: { redirect: to.fullPath } })
  } else if (to.meta.guest && token) {
    next({ path: '/' })
  } else {
    next()
  }
})

export default router
