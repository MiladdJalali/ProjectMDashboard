<script setup>
import { fa, formatDate } from '../../locales/fa.js'
import BaseTable from '../BaseTable.vue'
import { API_ROOT } from '../../api/client.js' 

defineProps({
  products: { type: Array, required: true },
})

defineEmits(['edit', 'delete', 'view'])

const columns = [
  { key: 'code', label: 'کد محصول' },
  { key: 'name', label: 'نام محصول' },
  { key: 'description', label: 'توضیحات' },
  { key: 'creator', label: 'ایجادکننده' },
  { key: 'created', label: 'تاریخ ایجاد' },
  { key: 'updated', label: 'آخرین ویرایش' },
  { key: 'actions', label: 'عملیات', headerClass: 'actions-col' },
]

function display(value) {
  return value == null || value === '' ? '—' : value
}
</script>

<template>
  <BaseTable :items="products" :columns="columns">
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
        <button class="action-btn view-btn" @click="$emit('view', item)">
          {{ fa.products.actions.view }}
        </button>
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
  color: #60a5fa;
  padding: 0.35rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.85rem;
  font-weight: 600;
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

.date {
  color: #cbd5e1;
}

.actions {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.action-btn {
  padding: 0.55rem 1.1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  cursor: pointer;
  border: none;
  color: white;
}

.view-btn {
  background: #0284c7;
}

.view-btn:hover {
  background: #0369a1;
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
</style>