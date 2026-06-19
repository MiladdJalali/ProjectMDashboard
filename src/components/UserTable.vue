<script setup>
import { fa, formatDate } from '../locales/fa'
import BaseTable from './BaseTable.vue'

defineProps({
  users: { type: Array, required: true },
})

defineEmits(['edit', 'delete'])

const columns = [
  { key: 'username', label: fa?.table?.username || 'نام کاربری' },
  { key: 'address', label: fa?.table?.address || 'آدرس' },
  { key: 'description', label: fa?.table?.description || 'توضیحات' },
  { key: 'created', label: fa?.table?.created || 'تاریخ ایجاد' },
  { key: 'actions', label: fa?.table?.actions || 'عملیات', headerClass: 'actions-col' },
]
</script>

<template>
  <BaseTable :items="users" :columns="columns">
    
    <template #username="{ item }">
      <span class="user-name">{{ item.username }}</span>
    </template>

    <template #description="{ item }">
      <span class="description">{{ item.description || '—' }}</span>
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
/* استایل‌های اختصاصی جدول یوزر */
.user-name { font-weight: 600; }
.description {
  max-width: 380px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
}
.actions { display: flex; gap: 10px; }
.action-btn { padding: 0.55rem 1.1rem; border-radius: 8px; font-size: 0.9rem; cursor: pointer; border: none; color: white; }
.edit-btn { background: #475569; }
.edit-btn:hover { background: #64748b; }
.delete-btn { background: #991b1b; }
.delete-btn:hover { background: #b91c1c; }
</style>