<script setup>
import { ref } from 'vue'

const search = defineModel({ type: String, default: '' })

const props = defineProps({
  searchPlaceholder: { type: String, default: 'جستجو...' },
  addButtonLabel: { type: String, default: 'افزودن' },
  showAddButton: { type: Boolean, default: true }
})

const emit = defineEmits(['add', 'apply'])

const inputRef = ref(null)

// اکسپوز کردن متد فوکوس برای استفاده در والد
defineExpose({ focusSearch: () => inputRef.value?.focus() })
</script>

<template>
  <div class="toolbar">
    <div class="toolbar__search">
      <span class="toolbar__search-icon" aria-hidden="true">🔍</span>
      <input
        ref="inputRef"
        v-model="search"
        type="search"
        class="toolbar__input"
        :placeholder="searchPlaceholder"
        @keydown.enter="emit('apply')"
      />
    </div>

    <slot name="filters"></slot>

    <button 
      v-if="showAddButton" 
      type="button" 
      class="toolbar__add" 
      @click="emit('add')"
    >
      {{ addButtonLabel }}
    </button>
  </div>
</template>

<style scoped>
.toolbar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.25rem 1.5rem;
  background: var(--surface);
  border-radius: 12px 12px 0 0;
  border-bottom: 1px solid var(--border);
  flex-wrap: wrap;
}

.toolbar__search {
  flex: 1;
  min-width: 200px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--surface-hover);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 0 0.85rem;
}

.toolbar__search-icon {
  color: var(--text-muted);
  font-size: 1.1rem;
}

.toolbar__input {
  flex: 1;
  border: none;
  background: transparent;
  font: inherit;
  font-size: 0.95rem;
  color: var(--text-h);
  padding: 0.65rem 0;
  outline: none;
}

.toolbar__add {
  background: #3b82f6;
  color: white;
  padding: 0.65rem 1.25rem;
  border-radius: 12px;
  font-weight: 600;
  white-space: nowrap;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.toolbar__add:hover {
  background: #2563eb;
  transform: translateY(-1px);
}

:slotted(.toolbar__select),
:slotted(.toolbar__small-input) {
  background: var(--surface-hover);
  border: 1px solid var(--border);
  border-radius: 12px;
  color: var(--text-h);
  padding: 0.65rem 0.85rem;
  font-size: 0.9rem;
}

:slotted(.toolbar__ghost) {
  padding: 0.65rem 1.25rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
  background: var(--surface-hover);
  color: var(--text-h);
  border: 1px solid var(--border);
}

:slotted(.toolbar__ghost:hover) {
  background: var(--border);
  color: var(--text-h);
}
</style>