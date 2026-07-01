<script setup>
import { ref, computed, onMounted } from 'vue'
import { fetchMolds } from '../api/molds'
import { fa } from '../locales/fa'

const props = defineProps({
  modelValue: { type: Array, default: () => [] },
})

const emit = defineEmits(['update:modelValue'])

const molds = ref([])
const loading = ref(false)
const error = ref('')
const filterText = ref('')

const selectedSet = computed(() => new Set(props.modelValue || []))

const filteredMolds = computed(() => {
  const q = filterText.value.trim().toLowerCase()
  if (!q) return molds.value
  return molds.value.filter((mold) => {
    const haystack = [mold.name, mold.code].filter(Boolean).join(' ').toLowerCase()
    return haystack.includes(q)
  })
})

async function loadMolds() {
  loading.value = true
  error.value = ''
  try {
    const result = await fetchMolds({ pageIndex: 0, pageSize: 200 })
    molds.value = result.molds
  } catch {
    error.value = fa.products?.moldSelect?.loadFailed || 'بارگذاری قالب‌ها ناموفق بود.'
  } finally {
    loading.value = false
  }
}

function isSelected(id) {
  return selectedSet.value.has(String(id))
}

function toggle(id) {
  const key = String(id)
  const next = new Set(selectedSet.value)
  if (next.has(key)) {
    next.delete(key)
  } else {
    next.add(key)
  }
  emit('update:modelValue', [...next])
}

onMounted(loadMolds)
</script>

<template>
  <div class="mold-select">
    <div class="mold-select__header">
      <span class="mold-select__label">{{ fa.products.fields.molds }}</span>
      <span class="mold-select__count">
        {{ (modelValue || []).length }} {{ fa.products.moldSelect.selected }}
      </span>
    </div>

    <input
      v-model="filterText"
      type="search"
      class="mold-select__filter"
      :placeholder="fa.products.moldSelect.filterPlaceholder"
    />

    <div v-if="loading" class="mold-select__status">{{ fa.app.loading }}</div>
    <div v-else-if="error" class="mold-select__status mold-select__status--error">{{ error }}</div>
    <div v-else-if="!filteredMolds.length" class="mold-select__status">
      {{ fa.products.moldSelect.empty }}
    </div>

    <ul v-else class="mold-select__list" role="listbox" :aria-multiselectable="true">
      <li v-for="mold in filteredMolds" :key="mold.id" class="mold-select__item">
        <label class="mold-select__option">
          <input
            type="checkbox"
            :checked="isSelected(mold.id)"
            @change="toggle(mold.id)"
          />
          <span class="mold-select__option-text">
            <span class="mold-select__name">{{ mold.name }}</span>
            <span class="mold-select__code">{{ mold.code }}</span>
          </span>
        </label>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.mold-select {
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background: var(--bg);
  overflow: hidden;
}

.mold-select__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid var(--border);
  background: var(--surface);
}

.mold-select__label {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--text-h);
}

.mold-select__count {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.mold-select__filter {
  width: 100%;
  border: none;
  border-bottom: 1px solid var(--border);
  padding: 0.55rem 0.75rem;
  font: inherit;
  font-size: 0.875rem;
  background: var(--surface);
  color: var(--text-h);
  outline: none;
}

.mold-select__filter:focus {
  background: var(--accent-bg);
}

.mold-select__list {
  list-style: none;
  margin: 0;
  padding: 0;
  max-height: 160px;
  overflow-y: auto;
}

.mold-select__item {
  border-bottom: 1px solid var(--border);
}

.mold-select__item:last-child {
  border-bottom: none;
}

.mold-select__option {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.5rem 0.75rem;
  cursor: pointer;
  font-size: 0.875rem;
}

.mold-select__option:hover {
  background: var(--surface-hover);
}

.mold-select__option input {
  accent-color: var(--accent);
  flex-shrink: 0;
}

.mold-select__option-text {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
  min-width: 0;
}

.mold-select__name {
  font-weight: 600;
  color: var(--text-h);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mold-select__code {
  font-size: 0.8rem;
  color: var(--text-muted);
  direction: ltr;
  flex-shrink: 0;
}

.mold-select__status {
  padding: 0.75rem;
  font-size: 0.875rem;
  color: var(--text-muted);
  text-align: center;
}

.mold-select__status--error {
  color: #dc2626;
}
</style>
