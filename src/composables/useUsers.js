import { ref, computed } from 'vue'
import {
  fetchUsers,
  createUser as apiCreateUser,
  updateUser as apiUpdateUser,
  deleteUser as apiDeleteUser,
  toUserRequest,
} from '../api/users'
import { ApiError, clearToken } from '../api/client'
import { fa } from '../locales/fa'

export function useUsers() {
  const users = ref([])
  const totalCount = ref(0)
  const search = ref('')
  const loading = ref(false)
  const error = ref('')

  const filteredUsers = computed(() => {
    const q = search.value.trim().toLowerCase()
    if (!q) return users.value

    return users.value.filter(
      (u) =>
        u.username?.toLowerCase().includes(q) ||
        u.address?.toLowerCase().includes(q) ||
        u.description?.toLowerCase().includes(q),
    )
  })

  const userCount = computed(() => totalCount.value || users.value.length)

  async function loadUsers() {
    loading.value = true
    error.value = ''
    try {
      const result = await fetchUsers({ pageIndex: 0, pageSize: 100 })
      users.value = result.users
      totalCount.value = result.totalCount
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        clearToken()
        window.location.href = '/login'
        return
      }
      error.value = err instanceof ApiError ? err.message : fa.errors.loadFailed
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createUser(form) {
    try {
      const payload = toUserRequest(form, { requirePassword: true })
      const created = await apiCreateUser(payload)
      await loadUsers()
      return { ok: true, user: created }
    } catch (err) {
      return {
        ok: false,
        error: err instanceof ApiError ? err.message : fa.errors.createFailed,
      }
    }
  }

  async function updateUser(originalUsername, form) {
    try {
      const payload = toUserRequest(form, { requirePassword: true })
      await apiUpdateUser(originalUsername, payload)
      await loadUsers()
      return { ok: true }
    } catch (err) {
      return {
        ok: false,
        error: err instanceof ApiError ? err.message : fa.errors.updateFailed,
      }
    }
  }

  async function deleteUser(username) {
    try {
      await apiDeleteUser(username)
      await loadUsers()
      return { ok: true }
    } catch (err) {
      return {
        ok: false,
        error: err instanceof ApiError ? err.message : fa.errors.deleteFailed,
      }
    }
  }

  return {
    users,
    search,
    filteredUsers,
    userCount,
    loading,
    error,
    loadUsers,
    createUser,
    updateUser,
    deleteUser,
  }
}
