import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { authReady, isAuthenticated, userRole } from '../store/auth'

const routes = [
  { path: '/', name: 'Home', component: HomeView },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/AboutView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('../views/AdminView.vue'),
    meta: { requiresAuth: true, role: 'admin' } // admin only
  },
  {
    path: '/addbook',
    name: 'AddBook',
    component: () => import('../views/AddBookView.vue')
  },
  {
    path: '/GetBookCount',
    name: 'GetBookCount',
    component: () => import('../views/GetBookCountView.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue'),
    meta: { guestOnly: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/RegisterView.vue'),
    meta: { guestOnly: true }
  },
  { path: '/logout', name: 'Logout', component: () => import('../views/LogoutView.vue') },
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach(async (to) => {
  await authReady // wait for Firebase to restore the session first

  if (to.meta.requiresAuth && !isAuthenticated.value) {
    return { name: 'Login', query: { redirect: to.fullPath } }
  }
  if (to.meta.role && userRole.value !== to.meta.role) {
    alert('Access denied: admins only.')
    return { name: 'Home' }
  }
  if (to.meta.guestOnly && isAuthenticated.value) {
    return { name: 'Home' }
  }
})

export default router