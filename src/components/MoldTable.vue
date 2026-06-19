<script setup>
import { fa, formatDate } from '../locales/fa'
import BaseTable from './BaseTable.vue'

defineProps({
  molds: { type: Array, required: true },
})

defineEmits(['edit', 'delete'])

// تعریف ستون‌ها و هدرها
const columns = [
  { key: 'code', label: 'کد قالب' },
  { key: 'name', label: 'نام قالب' },
  { key: 'description', label: 'توضیحات' },
  { key: 'status', label: 'وضعیت' },
  { key: 'location', label: 'مکان' },
  { key: 'shotCount', label: 'تعداد شات' },
  { key: 'partNumber', label: 'شماره قطعه' },
  { key: 'created', label: 'تاریخ ایجاد' },
  { key: 'actions', label: 'عملیات', headerClass: 'actions-col' },
]

function display(value) {
  return value == null || value === '' ? '—' : value
}

function translatedStatus(value) {
  return fa.molds?.statusValues?.[String(value)] ?? display(value)
}

function translatedLocation(value) {
  return fa.molds?.locationValues?.[String(value)] ?? display(value)
}
</script>

<template>
  <BaseTable :items="molds" :columns="columns">
    
    <template #code="{ item }">
      <span class="code-badge">{{ display(item.code) }}</span>
    </template>

    <template #name="{ item }">
      <span class="font-medium">{{ item.name }}</span>
    </template>

    <template #description="{ item }">
      <span class="description">{{ display(item.description) }}</span>
    </template>

    <template #status="{ item }">
      <span class="status-badge" :class="{ active: item.isActive }">
        {{ item.isActive ? 'فعال ' : 'غیرفعال ' }}
      </span>
      <span class="muted">{{ translatedStatus(item.status) }}</span>
    </template>

    <template #location="{ item }">
      {{ translatedLocation(item.location) }}
    </template>

    <template #shotCount="{ item }">
      <div class="number-cell">
        {{ display(item.shotCount) }}
        <span v-if="item.maxShotsBeforeMaintenance" class="muted">
          / {{ item.maxShotsBeforeMaintenance }}
        </span>
      </div>
    </template>

    <template #partNumber="{ item }">
      <span class="number-cell">{{ display(item.partNumber) }}</span>
    </template>

    <template #created="{ item }">
      <span class="date">{{ formatDate(item.created) }}</span>
    </template>

    <template #actions="{ item }">
      <div class="actions">
        <button class="action-btn edit-btn" @click="$emit('edit', item)">✏️ ویرایش</button>
        <button class="action-btn delete-btn" @click="$emit('delete', item)">🗑️ حذف</button>
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
.status-badge {
  padding: 0.35rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.85rem;
  font-weight: 600;
}
.status-badge.active { background: #166534; color: #4ade80; }
.status-badge:not(.active) { background: #78350f; color: #fbbf24; }
.font-medium { font-weight: 600; }
.description {
  max-width: 320px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
}
.muted { color: #94a3b8; font-size: 0.9rem; }
.number-cell { direction: ltr; text-align: center; }
.date { color: #cbd5e1; }
.actions { display: flex; gap: 10px; justify-content: flex-end; }
.action-btn { padding: 0.55rem 1.1rem; border-radius: 8px; font-size: 0.9rem; cursor: pointer; border: none; color: white; }
.edit-btn { background: #475569; }
.edit-btn:hover { background: #64748b; }
.delete-btn { background: #991b1b; }
.delete-btn:hover { background: #b91c1c; }
</style>