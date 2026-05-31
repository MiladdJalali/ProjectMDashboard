<script setup>
import { fa } from '../locales/fa'
import { formatDate } from '../locales/fa'

defineProps({
  users: { type: Array, required: true },
})

defineEmits(['edit', 'delete'])

function initials(username) {
  if (!username) return '?'
  return username.slice(0, 2).toUpperCase()
}
</script>

<template>
  <div class="table-wrap">
    <table class="table">
      <thead>
        <tr>
          <th>{{ fa.table.username }}</th>
          <th>{{ fa.table.address }}</th>
          <th>{{ fa.table.description }}</th>
          <th>{{ fa.table.created }}</th>
          <th class="table__actions-col">{{ fa.table.actions }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id" class="table__row">
          <td>
            <div class="user-cell">
              <span class="user-cell__avatar" aria-hidden="true">{{ initials(user.username) }}</span>
              <span class="user-cell__name" dir="ltr">{{ user.username }}</span>
            </div>
          </td>
          <td>{{ user.address || fa.table.empty }}</td>
          <td class="table__desc">{{ user.description || fa.table.empty }}</td>
          <td class="table__date">{{ formatDate(user.created) }}</td>
          <td>
            <div class="table__actions">
              <button
                type="button"
                class="action action--edit"
                :aria-label="fa.table.editAria"
                @click="$emit('edit', user)"
              >
                {{ fa.table.edit }}
              </button>
              <button
                type="button"
                class="action action--delete"
                :aria-label="fa.table.deleteAria"
                @click="$emit('delete', user)"
              >
                {{ fa.table.delete }}
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.table-wrap {
  overflow-x: auto;
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9375rem;
}

.table th {
  text-align: right;
  padding: 0.75rem 1.5rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--text-muted);
  background: var(--bg);
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  white-space: nowrap;
}

.table td {
  padding: 0.85rem 1.5rem;
  border-bottom: 1px solid var(--border);
  vertical-align: middle;
  text-align: right;
}

.table__row:hover td {
  background: var(--surface-hover);
}

.table__desc {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--text-muted);
}

.table__date {
  color: var(--text-muted);
  white-space: nowrap;
  font-size: 0.8125rem;
}

.table__actions-col {
  width: 1%;
  white-space: nowrap;
}

.user-cell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-cell__avatar {
  flex-shrink: 0;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--accent);
  background: var(--accent-bg);
  border: 1px solid var(--accent-border);
}

.user-cell__name {
  font-weight: 600;
  color: var(--text-h);
}

.table__actions {
  display: flex;
  gap: 0.35rem;
}

.action {
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 0.35rem 0.65rem;
  font: inherit;
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  background: var(--surface);
  transition: background 0.15s, border-color 0.15s, color 0.15s;
}

.action--edit:hover {
  border-color: var(--accent-border);
  color: var(--accent);
  background: var(--accent-bg);
}

.action--delete:hover {
  border-color: rgba(239, 68, 68, 0.4);
  color: #ef4444;
  background: rgba(239, 68, 68, 0.08);
}

@media (max-width: 768px) {
  .table th:nth-child(3),
  .table td:nth-child(3),
  .table th:nth-child(4),
  .table td:nth-child(4) {
    display: none;
  }
}
</style>
