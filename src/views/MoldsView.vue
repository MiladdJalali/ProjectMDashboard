<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import MoldToolbar from '../components/MoldToolbar.vue'
import MoldTable from '../components/MoldTable.vue'
import MoldFormModal from '../components/MoldFormModal.vue'
import { useMolds } from '../composables/useMolds'
import { useAuth } from '../composables/useAuth'
import { fa } from '../locales/fa'

const router = useRouter()
const { logout, currentUser } = useAuth()
const {
  search,
  filters,
  filteredMolds,
  moldCount,
  loading,
  error,
  loadMolds,
  getMold,
  createMold,
  updateMold,
  deleteMold,
} = useMolds()

const modalOpen = ref(false)
const editingMold = ref(null)
const formError = ref('')
const actionError = ref('')
const deleteTarget = ref(null)
const deleteError = ref('')

onMounted(async () => {
  try {
    await loadMolds()
  } catch {
    // error shown in UI
  }
})

function openCreate() {
  editingMold.value = null
  formError.value = ''
  modalOpen.value = true
}

async function openEdit(mold) {
  actionError.value = ''
  formError.value = ''

  const result = await getMold(mold.id)
  if (!result.ok) {
    actionError.value = result.error
    return
  }

  editingMold.value = result.mold
  modalOpen.value = true
}

function closeModal() {
  modalOpen.value = false
  editingMold.value = null
  formError.value = ''
}

async function handleSave(data) {
  formError.value = ''
  const result = editingMold.value
    ? await updateMold(editingMold.value.id, data)
    : await createMold(data)

  if (!result.ok) {
    formError.value = result.error
    return
  }

  closeModal()
}

function confirmDelete(mold) {
  deleteTarget.value = mold
  deleteError.value = ''
}

function cancelDelete() {
  deleteTarget.value = null
  deleteError.value = ''
}

async function handleDelete() {
  if (!deleteTarget.value) return

  const result = await deleteMold(deleteTarget.value.id)
  if (!result.ok) {
    deleteError.value = result.error
    return
  }

  deleteTarget.value = null
}

async function reload() {
  actionError.value = ''
  try {
    await loadMolds()
  } catch {
    // error shown in UI
  }
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
      <header class="header">
        <div class="header__brand">
          <span class="header__logo" aria-hidden="true">M</span>
          <div>
            <h1 class="header__title">{{ fa.molds.header.title }}</h1>
            <p class="header__subtitle">{{ fa.molds.header.subtitle }}</p>
          </div>
        </div>

        <div class="header__actions">
          <RouterLink class="header__link" :to="{ name: 'users' }">
            {{ fa.molds.header.usersLink }}
          </RouterLink>
          <div v-if="currentUser" class="header__user">
            <span class="header__user-label">{{ fa.header.loggedInAs }}</span>
            <span class="header__user-name" dir="ltr">{{ currentUser }}</span>
          </div>
          <div class="header__badge">
            <span class="header__count">{{ moldCount }}</span>
            <span class="header__label">{{ fa.molds.header.countLabel }}</span>
          </div>
          <button type="button" class="header__logout" @click="handleLogout">
            {{ fa.header.logout }}
          </button>
        </div>
      </header>

      <MoldToolbar
        v-model:search="search"
        v-model:filters="filters"
        @add="openCreate"
        @apply="reload"
        @reset="reload"
      />

      <div v-if="actionError" class="app__notice app__notice--error">
        {{ actionError }}
      </div>

      <div v-if="loading" class="app__status">{{ fa.app.loading }}</div>
      <div v-else-if="error" class="app__status app__status--error">
        <p>{{ error }}</p>
        <button type="button" class="btn btn--ghost" @click="reload">
          {{ fa.app.retry }}
        </button>
      </div>

      <MoldTable
        v-else-if="filteredMolds.length"
        :molds="filteredMolds"
        @edit="openEdit"
        @delete="confirmDelete"
      />

      <div v-else class="app__empty">
        <span class="app__empty-icon" aria-hidden="true">?</span>
        <p v-if="search">{{ fa.molds.emptySearch }}</p>
        <p v-else>{{ fa.molds.emptyList }}</p>
      </div>
    </main>

    <MoldFormModal
      :open="modalOpen"
      :mold="editingMold"
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
            <h3 id="delete-title" class="confirm__title">{{ fa.molds.delete.title }}</h3>
            <p class="confirm__text">
              <strong>{{ deleteTarget.name }}</strong>
              {{ fa.molds.delete.message }}
            </p>
            <p v-if="deleteError" class="confirm__error" role="alert">{{ deleteError }}</p>
            <div class="confirm__actions">
              <button type="button" class="btn btn--ghost" @click="cancelDelete">
                {{ fa.molds.delete.cancel }}
              </button>
              <button type="button" class="btn btn--danger" @click="handleDelete">
                {{ fa.molds.delete.confirm }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.app {
  position: relative;
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
}

.app__bg {
  position: fixed;
  inset: 0;
  background:
    radial-gradient(ellipse 80% 60% at 50% -10%, var(--accent-bg) 0%, transparent 60%),
    radial-gradient(ellipse 50% 40% at 90% 90%, rgba(16, 185, 129, 0.08) 0%, transparent 50%),
    var(--bg);
  z-index: -1;
}

.app__card {
  width: 100%;
  max-width: 1120px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.75rem 1.5rem;
  border-bottom: 1px solid var(--border);
  flex-wrap: wrap;
}

.header__brand {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.header__logo {
  width: 2.25rem;
  height: 2.25rem;
  display: grid;
  place-items: center;
  border-radius: var(--radius-md);
  color: #fff;
  background: var(--accent);
  font-weight: 800;
}

.header__title {
  margin: 0;
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--text-h);
}

.header__subtitle {
  margin: 0.15rem 0 0;
  font-size: 0.875rem;
  color: var(--text-muted);
}

.header__actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.header__link,
.header__logout {
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 0.5rem 0.85rem;
  font: inherit;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--text-muted);
  background: var(--surface);
  cursor: pointer;
  text-decoration: none;
}

.header__link:hover,
.header__logout:hover {
  color: var(--accent);
  border-color: var(--accent-border);
  background: var(--accent-bg);
}

.header__user {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  font-size: 0.75rem;
}

.header__user-label,
.header__label {
  color: var(--text-muted);
}

.header__user-name {
  font-weight: 600;
  color: var(--text-h);
}

.header__badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 4rem;
  padding: 0.5rem 0.85rem;
  background: var(--accent-bg);
  border: 1px solid var(--accent-border);
  border-radius: var(--radius-md);
}

.header__count {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--accent);
  line-height: 1.2;
}

.app__status {
  text-align: center;
  padding: 2.5rem 1.5rem;
  color: var(--text-muted);
  border-top: 1px solid var(--border);
}

.app__notice {
  margin: 1rem 1.5rem 0;
  padding: 0.65rem 0.85rem;
  font-size: 0.875rem;
  border-radius: var(--radius-md);
}

.app__notice--error {
  color: #dc2626;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.25);
}

.app__status--error p {
  margin: 0 0 0.75rem;
  color: #dc2626;
}

.app__empty {
  text-align: center;
  padding: 3rem 1.5rem;
  color: var(--text-muted);
  border-top: 1px solid var(--border);
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

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

@media (max-width: 640px) {
  .header {
    flex-direction: column;
    align-items: stretch;
  }

  .header__actions {
    justify-content: space-between;
  }
}
</style>
