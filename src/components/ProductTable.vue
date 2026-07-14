<script setup>
import { fa, formatDate } from '../locales/fa'
import BaseTable from './BaseTable.vue'
import { API_ROOT } from '../api/client' 

defineProps({
  products: { type: Array, required: true },
})

defineEmits(['edit', 'delete'])

const columns = [
  { key: 'image', label: 'تصویر' },
  { key: 'code', label: 'کد محصول' },
  { key: 'name', label: 'نام محصول' },
  { key: 'description', label: 'توضیحات' },
  { key: 'parts', label: 'قطعات' },
  { key: 'creator', label: 'ایجادکننده' },
  { key: 'created', label: 'تاریخ ایجاد' },
  { key: 'updated', label: 'آخرین ویرایش' },
  { key: 'actions', label: 'عملیات', headerClass: 'actions-col' },
]

function getImageUrl(url) {
  if (!url) return ''
  if (url.startsWith('http')) return url
  return `${API_ROOT}${url}`
}

function display(value) {
  return value == null || value === '' ? '—' : value
}

function partsSummary(parts) {
  if (!parts?.length) return '—'
  const names = parts.map((p) => p.name).filter(Boolean)
  if (!names.length) return `${parts.length} قطعه`
  const preview = names.slice(0, 3).join('، ')
  return names.length > 3 ? `${preview} و ${names.length - 3} مورد دیگر` : preview
}
</script>

<template>
  <BaseTable :items="products" :columns="columns">
    <template #image="{ item }">
      <div class="table-img-wrapper">
        <img 
          v-if="item.imageUrl" 
          :src="getImageUrl(item.imageUrl)" 
          class="table-thumb" 
          alt="thumb" 
          @error="$event.target.style.display='none'" 
        />
        <span v-else class="table-thumb-empty">—</span>
      </div>
    </template>

    <template #code="{ item }">
      <span class="code-badge">{{ display(item.code) }}</span>
    </template>

    <template #name="{ item }">
      <span class="font-medium">{{ item.name }}</span>
    </template>

    <template #description="{ item }">
      <span class="description" :title="display(item.description)">
        {{ display(item.description) }}
      </span>
    </template>

    <template #parts="{ item }">
      <span class="parts-badge">{{ item.parts?.length ?? 0 }}</span>
      <span class="parts-summary" :title="partsSummary(item.parts)">
        {{ partsSummary(item.parts) }}
      </span>
    </template>

    <template #creator="{ item }">
      {{ display(item.creator) }}
    </template>

    <template #created="{ item }">
      <span class="date">{{ formatDate(item.created) }}</span>
    </template>

    <template #updated="{ item }">
      <span class="date">{{ formatDate(item.updated) }}</span>
    </template>

    <template #actions="{ item }">
      <div class="actions">
        <button class="action-btn edit-btn" @click="$emit('edit', item)">
          {{ fa.products.actions.edit }}
        </button>
        <button class="action-btn delete-btn" @click="$emit('delete', item)">
          {{ fa.products.actions.delete }}
        </button>
      </div>
    </template>
  </BaseTable>
</template>

<style scoped>
.code-badge {
  background: #334155;
  color: #60a5fa;
  padding: 0.35rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.85rem;
  font-weight: 600;
}

.parts-badge {
  display: inline-block;
  background: #1e3a5f;
  color: #93c5fd;
  padding: 0.2rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 700;
  margin-left: 0.35rem;
}

.font-medium {
  font-weight: 600;
}

.description {
  max-width: 240px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
}

.parts-summary {
  display: block;
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 0.85rem;
  color: #94a3b8;
  margin-top: 0.2rem;
}

.date {
  color: #cbd5e1;
}

.actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.action-btn {
  padding: 0.55rem 1.1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  cursor: pointer;
  border: none;
  color: white;
}

.edit-btn {
  background: #475569;
}

.edit-btn:hover {
  background: #64748b;
}

.delete-btn {
  background: #991b1b;
}

.delete-btn:hover {
  background: #b91c1c;
}

.table-img-wrapper {
  display: flex;
  align-items: center;
}

.table-thumb {
  width: 40px;
  height: 40px;
  border-radius: 6px;
  object-fit: cover;
  border: 1px solid #334155;
}

.table-thumb-empty {
  color: #64748b;
  font-size: 0.9rem;
  padding-right: 10px;
}
</style>