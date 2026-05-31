<script setup>
import { ref } from 'vue'
import { fa } from '../locales/fa'

const search = defineModel({ type: String, default: '' })
const emit = defineEmits(['add'])

const inputRef = ref(null)

defineExpose({ focusSearch: () => inputRef.value?.focus() })
</script>

<template>
  <div class="toolbar">
    <div class="toolbar__search">
      <span class="toolbar__search-icon" aria-hidden="true">⌕</span>
      <input
        ref="inputRef"
        v-model="search"
        type="search"
        class="toolbar__input"
        :placeholder="fa.toolbar.searchPlaceholder"
        :aria-label="fa.toolbar.searchAria"
      />
    </div>
    <button type="button" class="toolbar__add" @click="emit('add')">
      {{ fa.toolbar.addUser }}
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
  min-width: 200px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 0 0.85rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.toolbar__search:focus-within {
  border-color: var(--accent-border);
  box-shadow: 0 0 0 3px var(--accent-bg);
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
  font-size: 0.9375rem;
  color: var(--text-h);
  padding: 0.6rem 0;
  outline: none;
  min-width: 0;
  text-align: right;
}

.toolbar__input::placeholder {
  color: var(--text-muted);
}

.toolbar__add {
  border: none;
  border-radius: var(--radius-md);
  padding: 0.65rem 1.1rem;
  font: inherit;
  font-size: 0.875rem;
  font-weight: 600;
  color: #fff;
  background: var(--accent);
  cursor: pointer;
  white-space: nowrap;
  transition: opacity 0.2s, transform 0.15s;
}

.toolbar__add:hover {
  opacity: 0.92;
}

.toolbar__add:active {
  transform: scale(0.97);
}
</style>
