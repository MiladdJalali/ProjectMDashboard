<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from '../components/AppHeader.vue'
import MoldToolbar from '../components/MoldToolbar.vue'
import MoldTable from '../components/MoldTable.vue'
import MoldFormModal from '../components/MoldFormModal.vue'
import Pagination from '../components/Pagination.vue'
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
const deleteTarget = ref(null)
const deleteError = ref('')

// صفحه‌بندی
const currentPage = ref(1)
const itemsPerPage = ref(15) // عدد بزرگ‌تر برای پرتر شدن جدول

const totalPages = computed(() => Math.ceil(filteredMolds.value.length / itemsPerPage.value))

const paginatedMolds = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredMolds.value.slice(start, end)
})

watch(search, () => { currentPage.value = 1 })
watch(filters, () => { currentPage.value = 1 }, { deep: true })

onMounted(async () => {
  try { await loadMolds() } catch {}
})

function openCreate() {
  editingMold.value = null
  formError.value = ''
  modalOpen.value = true
}

async function openEdit(mold) {
  formError.value = ''
  const result = await getMold(mold.id)
  if (!result.ok) {
    formError.value = result.error
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
        :user-count="moldCount"
        :current-user="currentUser"
        title="مدیریت قالب‌ها"
        subtitle="مشاهده، ایجاد، ویرایش و حذف قالب‌ها"
        @logout="handleLogout"
      />

      <MoldToolbar
        v-model:search="search"
        v-model:filters="filters"
        @add="openCreate"
        @apply="loadMolds"
        @reset="loadMolds"
      />

      <div v-if="loading" class="app__status">{{ fa.app.loading }}</div>
      <div v-else-if="error" class="app__status app__status--error">
        <p>{{ error }}</p>
        <button type="button" class="btn btn--ghost" @click="loadMolds">
          {{ fa.app.retry }}
        </button>
      </div>

      <MoldTable
        v-else-if="filteredMolds.length"
        :molds="paginatedMolds"
        @edit="openEdit"
        @delete="confirmDelete"
      />

      <div v-if="!loading && !error && filteredMolds.length" class="table-footer">
        <div class="table-footer__info">
          مجموع قالب‌ها: <strong>{{ moldCount }}</strong> عدد
        </div>

        <Pagination
          v-if="filteredMolds.length > itemsPerPage"
          :current-page="currentPage"
          :total-pages="totalPages"
          @page-changed="currentPage = $event"
        />
      </div>

      <div v-else-if="!loading && !error && !filteredMolds.length" class="app__empty">
        <span class="app__empty-icon" aria-hidden="true">🔍</span>
        <p v-if="search">هیچ قالبی یافت نشد</p>
        <p v-else>هنوز قالبی ثبت نشده است</p>
      </div>
    </main>

    <!-- Modal و Confirm بدون تغییر بماند -->
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
          @click.self="cancelDelete"
        >
          <div class="confirm">
            <!-- محتوای confirm بدون تغییر -->
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
  padding: 1rem 0.75rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.app__bg {
  position: fixed;
  inset: 0;
  background: var(--bg);
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

.table-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--border);
  flex-wrap: wrap;
  gap: 1rem;
}

.app__status,
.app__empty {
  padding: 3rem 1.5rem;
  text-align: center;
  flex: 1;
}
</style>