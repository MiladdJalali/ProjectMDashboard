import { ref } from 'vue'
import { login as apiLogin, logout as apiLogout } from '../api/auth'
import { isAuthenticated } from '../api/client'

const currentUser = ref(localStorage.getItem('auth_username') || '')

export function useAuth() {
  async function login(username, password) {
    const result = await apiLogin(username, password)
    currentUser.value = username
    localStorage.setItem('auth_username', username)
    return result
  }

  function logout() {
    apiLogout()
    currentUser.value = ''
    localStorage.removeItem('auth_username')
  }

  return {
    currentUser,
    isAuthenticated,
    login,
    logout,
  }
}
