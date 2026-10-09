import { ref } from 'vue'

// sessionStorage so a refresh keeps you logged in, but closing the tab logs you out
export const isAuthenticated = ref(sessionStorage.getItem('isAuthenticated') === 'true')

// Hardcoded for the lab – real apps would verify against a backend
export function login(username, password) {
  if (username === 'admin' && password === 'Admin123!') {
    isAuthenticated.value = true
    sessionStorage.setItem('isAuthenticated', 'true')
    return true
  }
  return false
}

export function logout() {
  isAuthenticated.value = false
  sessionStorage.removeItem('isAuthenticated')
}