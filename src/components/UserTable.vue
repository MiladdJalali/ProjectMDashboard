<script setup>
import { fa } from '../locales/fa'
import { formatDate } from '../locales/fa'

defineProps({
  users: { type: Array, required: true },
})

defineEmits(['edit', 'delete'])
</script>

<template>
  <div class="table-container">
    <table class="data-table">
      <thead>
        <tr>
          <th>{{ fa?.table?.username || 'نام کاربری' }}</th>
          <th>{{ fa?.table?.address || 'آدرس' }}</th>
          <th>{{ fa?.table?.description || 'توضیحات' }}</th>
          <th>{{ fa?.table?.created || 'تاریخ ایجاد' }}</th>
          <th class="actions-col">{{ fa?.table?.actions || 'عملیات' }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id" class="table-row">
          <td><span class="user-name">{{ user.username }}</span></td>
          <td>{{ user.address || '—' }}</td>
          <td class="description">{{ user.description || '—' }}</td>
          <td class="date">{{ formatDate(user.created) }}</td>
          <td>
            <div class="actions">
              <button class="action-btn edit-btn" @click="$emit('edit', user)">✏️ ویرایش</button>
              <button class="action-btn delete-btn" @click="$emit('delete', user)">🗑️ حذف</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.table-container {
  width: 100%;
  background: #1e2937;
  overflow: hidden;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th {
  background: #253549;
  padding: 1.25rem 1.5rem;
  text-align: right;
  color: #94a3b8;
  font-weight: 600;
}

.data-table td {
  padding: 1.3rem 1.5rem;
  border-bottom: 1px solid #334155;
  color: #e2e8f0;
}

.table-row:hover {
  background: #27344f;
}

.user-name {
  font-weight: 600;
}

.description {
  max-width: 380px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.actions {
  display: flex;
  gap: 10px;
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
</style>