<script setup>
import { fa } from '../locales/fa'
import BaseToolbar from './BaseToolbar.vue'

const search = defineModel('search', { type: String, default: '' })
const filters = defineModel('filters', {
  type: Object,
  default: () => ({ id: '', name: '', code: '', partName: '', partCode: '' }),
})

const emit = defineEmits(['add', 'apply', 'reset'])

function resetFilters() {
  search.value = ''
  filters.value = { id: '', name: '', code: '', partName: '', partCode: '' }
  emit('reset')
}
</script>

<template>
  <BaseToolbar
    v-model="search"
    :search-placeholder="fa.products.toolbar.searchPlaceholder"
    :add-button-label="fa.products.toolbar.add"
    @add="emit('add')"
    @apply="emit('apply')"
  >
    <template #filters>
      <input
        v-model="filters.name"
        type="text"
        class="toolbar__input-sm"
        :placeholder="fa.products.toolbar.nameFilter"
      />

      <input
        v-model="filters.code"
        type="number"
        class="toolbar__input-sm"
        :placeholder="fa.products.toolbar.codeFilter"
      />

      <input
        v-model="filters.partName"
        type="text"
        class="toolbar__input-sm"
        :placeholder="fa.products.toolbar.partNameFilter"
      />

      <input
        v-model="filters.partCode"
        type="number"
        class="toolbar__input-sm"
        :placeholder="fa.products.toolbar.partCodeFilter"
      />

      <button type="button" class="toolbar__ghost" @click="emit('apply')">
        {{ fa.products.toolbar.apply }}
      </button>

      <button type="button" class="toolbar__ghost" @click="resetFilters">
        {{ fa.products.toolbar.reset }}
      </button>
    </template>
  </BaseToolbar>
</template>

<style scoped>
.toolbar__input-sm {
  border: 1px solid #334155;
  border-radius: 8px;
  padding: 0.5rem 0.75rem;
  font: inherit;
  font-size: 0.85rem;
  background: #1e2937;
  color: #e2e8f0;
  min-width: 120px;
}

.toolbar__input-sm::placeholder {
  color: #94a3b8;
}

.toolbar__input-sm:focus {
  outline: none;
  border-color: #3b82f6;
}

.toolbar__ghost {
  border: 1px solid #475569;
  border-radius: 8px;
  padding: 0.5rem 0.85rem;
  font: inherit;
  font-size: 0.85rem;
  font-weight: 600;
  background: transparent;
  color: #cbd5e1;
  cursor: pointer;
}

.toolbar__ghost:hover {
  background: #334155;
  color: #fff;
}
</style>
