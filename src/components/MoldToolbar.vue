<script setup>
import { fa } from '../locales/fa'

const search = defineModel('search', { type: String, default: '' })
const filters = defineModel('filters', {
  type: Object,
  default: () => ({ status: '', location: '', isActive: '' }),
})

const emit = defineEmits(['add', 'apply', 'reset'])

function resetFilters() {
  search.value = ''
  filters.value = { status: '', location: '', isActive: '' }
  emit('reset')
}
</script>

<template>
  <div class="toolbar">
    <div class="toolbar__search">
      <span class="toolbar__search-icon" aria-hidden="true">#</span>
      <input
        v-model="search"
        type="search"
        class="toolbar__input"
        :placeholder="fa.molds.toolbar.searchPlaceholder"
        :aria-label="fa.molds.toolbar.searchAria"
        @keydown.enter="emit('apply')"
      />
    </div>

    <select v-model="filters.isActive" class="toolbar__select" :aria-label="fa.molds.toolbar.activeFilter">
      <option value="">{{ fa.molds.toolbar.allActivity }}</option>
      <option value="true">{{ fa.molds.active }}</option>
      <option value="false">{{ fa.molds.inactive }}</option>
    </select>

    <input
      v-model="filters.status"
      type="text"
      class="toolbar__small-input"
      :placeholder="fa.molds.fields.status"
      :aria-label="fa.molds.toolbar.statusFilter"
    />

    <input
      v-model="filters.location"
      type="text"
      class="toolbar__small-input"
      :placeholder="fa.molds.fields.location"
      :aria-label="fa.molds.toolbar.locationFilter"
    />

    <button type="button" class="toolbar__ghost" @click="resetFilters">
      {{ fa.molds.toolbar.reset }}
    </button>
    <button type="button" class="toolbar__ghost" @click="emit('apply')">
      {{ fa.molds.toolbar.apply }}
    </button>
    <button type="button" class="toolbar__add" @click="emit('add')">
      {{ fa.molds.toolbar.add }}
    </button>
  </div>
</template>

<style scoped>
.toolbar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  flex-wrap: wrap;
}

.toolbar__search {
  flex: 1;
  min-width: 220px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 0 0.85rem;
}

.toolbar__search:focus-within,
.toolbar__select:focus,
.toolbar__small-input:focus {
  border-color: var(--accent-border);
  box-shadow: 0 0 0 3px var(--accent-bg);
}

.toolbar__search-icon {
  color: var(--text-muted);
  font-weight: 700;
}

.toolbar__input,
.toolbar__small-input,
.toolbar__select {
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background: var(--bg);
  color: var(--text-h);
  font: inherit;
  font-size: 0.875rem;
  outline: none;
}

.toolbar__input {
  flex: 1;
  min-width: 0;
  border: none;
  background: transparent;
  padding: 0.6rem 0;
  text-align: right;
}

.toolbar__small-input {
  width: 8rem;
  padding: 0.55rem 0.75rem;
  text-align: right;
}

.toolbar__select {
  padding: 0.55rem 0.75rem;
}

.toolbar__add,
.toolbar__ghost {
  border-radius: var(--radius-md);
  padding: 0.6rem 1rem;
  font: inherit;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
}

.toolbar__add {
  border: none;
  color: #fff;
  background: var(--accent);
}

.toolbar__ghost {
  border: 1px solid var(--border);
  color: var(--text-muted);
  background: var(--surface);
}

.toolbar__add:hover {
  opacity: 0.92;
}

.toolbar__ghost:hover {
  color: var(--text-h);
  background: var(--surface-hover);
}
</style>
