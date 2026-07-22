<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from '../components/AppHeader.vue'
import UserToolbar from '../components/Users/UserToolbar.vue'
import UserTable from '../components/Users/UserTable.vue'
import UserFormModal from '../components/Users/UserFormModal.vue'
import Pagination from '../components/Pagination.vue'
import { useUsers } from '../composables/useUsers'
import { useAuth } from '../composables/useAuth'
import { fa } from '../locales/fa'

const router = useRouter()
const { logout, currentUser } = useAuth()
const {
  search,
  filteredUsers,
  userCount,
  loading,
  error,
  loadUsers,
  createUser,
  updateUser,
  deleteUser,
} = useUsers()

const modalOpen = ref(false)
const editingUser = ref(null)
const formError = ref('')
const deleteTarget = ref(null)
const deleteError = ref('')

// --- متغیرهای صفحه‌بندی ---
const currentPage = ref(1)
const itemsPerPage = ref(5) // تعداد آیتم‌ها در هر صفحه (می‌توانید تغییر دهید)

const totalPages = computed(() => {
  return Math.ceil(filteredUsers.value.length / itemsPerPage.value)
})

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredUsers.value.slice(start, end)
})

watch(search, () => {
  currentPage.value = 1
})
// ----------------------------

onMounted(async () => {
  try {
    await loadUsers()
  } catch {
    // error shown in UI
  }
})

function openCreate() {
  editingUser.value = null
  formError.value = ''
  modalOpen.value = true
}

function openEdit(user) {
  editingUser.value = user
  formError.value = ''
  modalOpen.value = true
}

function closeModal() {
  modalOpen.value = false
  editingUser.value = null
  formError.value = ''
}

async function handleSave(data) {
  formError.value = ''

  const result = editingUser.value
    ? await updateUser(editingUser.value.username, data)
    : await createUser(data)

  if (!result.ok) {
    formError.value = result.error
    return
  }

  closeModal()
}

function confirmDelete(user) {
  deleteTarget.value = user
  deleteError.value = ''
}

function cancelDelete() {
  deleteTarget.value = null
  deleteError.value = ''
}

async function handleDelete() {
  if (!deleteTarget.value) return

  const result = await deleteUser(deleteTarget.value.username)
  if (!result.ok) {
    deleteError.value = result.error
    return
  }

  deleteTarget.value = null
}

function handleLogout() {
  logout()
  router.push({ name: 'login' })
}
</script>

<template>
  <div class="app">
    <div class="app__bg" aria-hidden="true"></div>

    <main class="app__card">
      <AppHeader
        :user-count="userCount"
        :current-user="currentUser"
        title="مدیریت کاربران"
        subtitle="ایجاد، ویرایش و حذف کاربران"
        @logout="handleLogout"
      />

      <UserToolbar v-model="search" @add="openCreate" />

      <div v-if="loading" class="app__status">{{ fa.app.loading }}</div>
      <div v-else-if="error" class="app__status app__status--error">
        <p>{{ error }}</p>
        <button type="button" class="btn btn--ghost" @click="loadUsers">
          {{ fa.app.retry }}
        </button>
      </div>

      <UserTable
        v-else-if="filteredUsers.length"
        :users="paginatedUsers"
        @edit="openEdit"
        @delete="confirmDelete"
      />

      <div v-if="!loading && !error && filteredUsers.length" class="table-footer">
        <div class="table-footer__info">
          مجموع کاربران: <strong>{{ userCount }}</strong> نفر
        </div>

        <Pagination
          v-if="filteredUsers.length > itemsPerPage"
          :current-page="currentPage"
          :total-pages="totalPages"
          @page-changed="currentPage = $event"
        />
      </div>

      <div v-else-if="!loading && !error && !filteredUsers.length" class="app__empty">
        <span class="app__empty-icon" aria-hidden="true">🔍</span>
        <p v-if="search">{{ fa.app.emptySearch }}</p>
        <p v-else>{{ fa.app.emptyList }}</p>
      </div>
    </main>

    <UserFormModal
      :open="modalOpen"
      :user="editingUser"
      :server-error="formError"
      @close="closeModal"
      @save="handleSave"
    />

    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="deleteTarget"
          class="confirm-backdrop"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="delete-title"
          @click.self="cancelDelete"
        >
          <div class="confirm">
            <h3 id="delete-title" class="confirm__title">{{ fa.delete.title }}</h3>
            <p class="confirm__text">
              <strong>{{ deleteTarget.username }}</strong>
              {{ fa.delete.message }}
            </p>
            <p v-if="deleteError" class="confirm__error" role="alert">{{ deleteError }}</p>
            <div class="confirm__actions">
              <button type="button" class="btn btn--ghost" @click="cancelDelete">
                {{ fa.delete.cancel }}
              </button>
              <button type="button" class="btn btn--danger" @click="handleDelete">
                {{ fa.delete.confirm }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <p class="app__footer">{{ fa.app.footer }}</p>
  </div>
</template>

<style scoped>
.app {
  position: relative;
  min-height: 100svh;
  padding: 1rem 0.75rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.app__bg {
  position: fixed;
  inset: 0;
  background:
    radial-gradient(ellipse 80% 60% at 50% -10%, var(--accent-bg) 0%, transparent 60%),
    radial-gradient(ellipse 50% 40% at 90% 90%, rgba(56, 189, 248, 0.08) 0%, transparent 50%),
    var(--bg);
  z-index: -1;
}

.app__card {
  width: 100%;
  max-width: 96%;
  margin: 0 auto;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.app__status,
.app__empty {
  padding: 3rem 1.5rem;
  text-align: center;
  flex: 1;
}

.app__status--error p {
  margin: 0 0 0.75rem;
  color: #dc2626;
}

.app__empty-icon {
  display: block;
  font-size: 2rem;
  margin-bottom: 0.5rem;
  opacity: 0.5;
}

.app__empty p {
  margin: 0;
  font-size: 0.95rem;
}

.app__footer {
  margin-top: 1.5rem;
  font-size: 0.8125rem;
  color: var(--text-muted);
}

.confirm-backdrop {
  position: fixed;
  inset: 0;
  z-index: 110;
  display: grid;
  place-items: center;
  padding: 1rem;
  background: rgba(15, 23, 42, 0.55);
  backdrop-filter: blur(4px);
}

.confirm {
  width: 100%;
  max-width: 380px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  padding: 1.5rem;
  box-shadow: var(--shadow-lg);
}

.confirm__title {
  margin: 0 0 0.5rem;
  font-size: 1.125rem;
  color: var(--text-h);
}

.confirm__text {
  margin: 0 0 1.25rem;
  font-size: 0.9375rem;
  color: var(--text-muted);
  line-height: 1.5;
}

.confirm__error {
  margin: -0.75rem 0 1rem;
  font-size: 0.875rem;
  color: #dc2626;
}

.confirm__actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.btn {
  border: none;
  border-radius: var(--radius-md);
  padding: 0.6rem 1rem;
  font: inherit;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
}

.btn--ghost {
  background: transparent;
  color: var(--text-muted);
}

.btn--ghost:hover {
  background: var(--surface-hover);
  color: var(--text-h);
}

.btn--danger {
  background: #ef4444;
  color: #fff;
}

.btn--danger:hover {
  opacity: 0.92;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.table-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--border);
  flex-wrap: wrap;
  gap: 1rem;
}

.table-footer__info {
  color: var(--text-muted);
  font-size: 0.875rem;
}

.table-footer__info strong {
  color: var(--accent);
  font-weight: 700;
  font-size: 1rem;
}

</style>