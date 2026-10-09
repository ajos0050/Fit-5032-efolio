import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { isAuthenticated } from '../store/auth'

const routes = [
  { path: '/', name: 'Home', component: HomeView },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/AboutView.vue'), // lazy loaded
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue'),
    meta: { guestOnly: true }
  },
  // Unknown URLs go home instead of a blank page
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Global guard – runs before every navigation
router.beforeEach((to) => {
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    // Remember where they were going so we can send them back after login
    return { name: 'Login', query: { redirect: to.fullPath } }
  }
  if (to.meta.guestOnly && isAuthenticated.value) {
    return { name: 'Home' }
  }
})

export default router