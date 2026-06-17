<script setup>
import { ref } from 'vue'
import { fa } from '../locales/fa'   // مطمئن شو این مسیر درست باشه

const search = defineModel({ type: String, default: '' })
const emit = defineEmits(['add'])

const inputRef = ref(null)

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
        :placeholder="fa?.toolbar?.searchPlaceholder || 'جستجو...'"
        :aria-label="fa?.toolbar?.searchAria || 'جستجو'"
      />
    </div>
    <button type="button" class="toolbar__add" @click="emit('add')">
      {{ fa?.toolbar?.addUser || 'افزودن کاربر جدید' }}
    </button>
  </div>
</template>

<style scoped>
.toolbar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.25rem 1.5rem;
  background: #1e2937;
  border-radius: 12px 12px 0 0;
  border-bottom: 1px solid #334155;
}

.toolbar__search {
  flex: 1;
  min-width: 200px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #253549;
  border: 1px solid #475569;
  border-radius: 12px;
  padding: 0 0.85rem;
}

.toolbar__search-icon {
  color: #94a3b8;
  font-size: 1.1rem;
}

.toolbar__input {
  flex: 1;
  border: none;
  background: transparent;
  font: inherit;
  font-size: 0.95rem;
  color: #e2e8f0;
  padding: 0.65rem 0;
  outline: none;
}

.toolbar__add {
  background: #3b82f6;
  color: white;
  padding: 0.75rem 1.5rem;
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
</style>