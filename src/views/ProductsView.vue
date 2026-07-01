<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from '../components/AppHeader.vue'
import ProductToolbar from '../components/ProductToolbar.vue'
import ProductTable from '../components/ProductTable.vue'
import ProductFormModal from '../components/ProductFormModal.vue'
import Pagination from '../components/Pagination.vue'
import { useProducts } from '../composables/useProducts'
import { useAuth } from '../composables/useAuth'
import { fa } from '../locales/fa'

const router = useRouter()
const { logout, currentUser } = useAuth()

const {
  search,
  filters,
  filteredProducts,
  productCount,
  loading,
  error,
  loadProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = useProducts()

const modalOpen = ref(false)
const editingProduct = ref(null)
const formError = ref('')
const deleteTarget = ref(null)
const deleteError = ref('')

const currentPage = ref(1)
const itemsPerPage = ref(15)

const totalPages = computed(() => Math.ceil(filteredProducts.value.length / itemsPerPage.value))

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredProducts.value.slice(start, end)
})

watch(search, () => {
  currentPage.value = 1
})
watch(filters, () => {
  currentPage.value = 1
}, { deep: true })

onMounted(async () => {
  try {
    await loadProducts()
  } catch {
    /* error shown in template */
  }
})

function openCreate() {
  editingProduct.value = null
  formError.value = ''
  modalOpen.value = true
}

async function openEdit(product) {
  formError.value = ''
  const result = await getProduct(product.id)
  if (!result.ok) {
    formError.value = result.error
    return
  }
  editingProduct.value = result.product
  modalOpen.value = true
}

function closeModal() {
  modalOpen.value = false
  editingProduct.value = null
  formError.value = ''
}

async function handleSave(data) {
  formError.value = ''
  const result = editingProduct.value
    ? await updateProduct(editingProduct.value.id, data)
    : await createProduct(data)

  if (!result.ok) {
    formError.value = result.error
    return
  }
  closeModal()
}

function confirmDelete(product) {
  deleteTarget.value = product
  deleteError.value = ''
}

function cancelDelete() {
  deleteTarget.value = null
  deleteError.value = ''
}

async function handleDelete() {
  if (!deleteTarget.value) return
  const result = await deleteProduct(deleteTarget.value.id)
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
        :user-count="productCount"
        :current-user="currentUser"
        :title="fa.products.header.title"
        :subtitle="fa.products.header.subtitle"
        @logout="handleLogout"
      />

      <ProductToolbar
        v-model:search="search"
        v-model:filters="filters"
        @add="openCreate"
        @apply="loadProducts"
        @reset="loadProducts"
      />

      <div v-if="loading" class="app__status">{{ fa.app.loading }}</div>
      <div v-else-if="error" class="app__status app__status--error">
        <p>{{ error }}</p>
        <button type="button" class="btn btn--ghost" @click="loadProducts">
          {{ fa.app.retry }}
        </button>
      </div>

      <ProductTable
        v-else-if="filteredProducts.length"
        :products="paginatedProducts"
        @edit="openEdit"
        @delete="confirmDelete"
      />

      <div v-if="!loading && !error && filteredProducts.length" class="table-footer">
        <div class="table-footer__info">
          مجموع محصولات: <strong>{{ productCount }}</strong> عدد
        </div>

        <Pagination
          v-if="filteredProducts.length > itemsPerPage"
          :current-page="currentPage"
          :total-pages="totalPages"
          @page-changed="currentPage = $event"
        />
      </div>

      <div v-else-if="!loading && !error && !filteredProducts.length" class="app__empty">
        <span class="app__empty-icon" aria-hidden="true">🔍</span>
        <p v-if="search || filters.name || filters.code || filters.partName || filters.partCode">
          {{ fa.products.emptySearch }}
        </p>
        <p v-else>{{ fa.products.emptyList }}</p>
      </div>
    </main>

    <ProductFormModal
      :open="modalOpen"
      :product="editingProduct"
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
          aria-labelledby="delete-product-title"
          @click.self="cancelDelete"
        >
          <div class="confirm">
            <h3 id="delete-product-title" class="confirm__title">{{ fa.products.delete.title }}</h3>
            <p class="confirm__text">
              <strong>{{ deleteTarget.name }}</strong>
              {{ fa.products.delete.message }}
            </p>
            <p v-if="deleteError" class="confirm__error" role="alert">{{ deleteError }}</p>
            <div class="confirm__actions">
              <button type="button" class="btn btn--ghost" @click="cancelDelete">
                {{ fa.products.delete.cancel }}
              </button>
              <button type="button" class="btn btn--danger" @click="handleDelete">
                {{ fa.products.delete.confirm }}
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

.app__status--error {
  color: #dc2626;
}

.app__empty-icon {
  font-size: 2rem;
  display: block;
  margin-bottom: 0.5rem;
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
  background: #dc2626;
  color: #fff;
}

.btn--danger:hover {
  background: #b91c1c;
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
  margin: 0 0 1rem;
  font-size: 0.9375rem;
  color: var(--text-muted);
}

.confirm__error {
  margin: 0 0 1rem;
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
</style>
