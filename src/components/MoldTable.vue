<script setup>
import { fa, formatDate } from '../locales/fa'

defineProps({
  molds: { type: Array, required: true },
})

defineEmits(['edit', 'delete'])

function display(value) {
  return value === null || value === undefined || value === '' ? '-' : value
}

function translatedStatus(value) {
  return fa.molds.statusValues[String(value)] ?? display(value)
}

function translatedLocation(value) {
  return fa.molds.locationValues[String(value)] ?? display(value)
}

function statusClass(mold) {
  return mold.isActive ? 'badge badge--active' : 'badge'
}
</script>

<template>
  <div class="table-wrap">
    <table class="table">
      <thead>
        <tr>
          <th>{{ fa.molds.fields.name }}</th>
          <th>{{ fa.molds.fields.code }}</th>
          <th>{{ fa.molds.fields.status }}</th>
          <th>{{ fa.molds.fields.location }}</th>
          <th>{{ fa.molds.fields.shots }}</th>
          <th>{{ fa.molds.fields.partNumber }}</th>
          <th>{{ fa.molds.fields.created }}</th>
          <th class="table__actions-col">{{ fa.molds.fields.actions }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="mold in molds" :key="mold.id" class="table__row">
          <td>
            <div class="mold-cell">
              <span class="mold-cell__mark" aria-hidden="true">{{ display(mold.code) }}</span>
              <div>
                <div class="mold-cell__name">{{ mold.name }}</div>
                <div class="mold-cell__desc">{{ display(mold.description) }}</div>
              </div>
            </div>
          </td>
          <td dir="ltr">{{ display(mold.code) }}</td>
          <td>
            <span :class="statusClass(mold)">
              {{ mold.isActive ? fa.molds.active : fa.molds.inactive }}
            </span>
            <span class="table__muted">{{ translatedStatus(mold.status) }}</span>
          </td>
          <td>{{ translatedLocation(mold.location) }}</td>
          <td dir="ltr">
            {{ display(mold.shotCount) }}
            <span v-if="mold.maxShotsBeforeMaintenance != null" class="table__muted">
              / {{ mold.maxShotsBeforeMaintenance }}
            </span>
          </td>
          <td dir="ltr">{{ display(mold.partNumber) }}</td>
          <td class="table__date">{{ formatDate(mold.created) }}</td>
          <td>
            <div class="table__actions">
              <button
                type="button"
                class="action action--edit"
                :aria-label="fa.molds.actions.editAria"
                @click="$emit('edit', mold)"
              >
                {{ fa.molds.actions.edit }}
              </button>
              <button
                type="button"
                class="action action--delete"
                :aria-label="fa.molds.actions.deleteAria"
                @click="$emit('delete', mold)"
              >
                {{ fa.molds.actions.delete }}
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
  padding: 0.75rem 1.25rem;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--text-muted);
  background: var(--bg);
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  white-space: nowrap;
}

.table td {
  padding: 0.85rem 1.25rem;
  border-bottom: 1px solid var(--border);
  vertical-align: middle;
  text-align: right;
  white-space: nowrap;
}

.table__row:hover td {
  background: var(--surface-hover);
}

.mold-cell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 220px;
}

.mold-cell__mark {
  flex-shrink: 0;
  min-width: 2.5rem;
  height: 2.25rem;
  padding: 0 0.45rem;
  border-radius: var(--radius-sm);
  display: grid;
  place-items: center;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--accent);
  background: var(--accent-bg);
  border: 1px solid var(--accent-border);
}

.mold-cell__name {
  font-weight: 700;
  color: var(--text-h);
}

.mold-cell__desc {
  max-width: 260px;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--text-muted);
  font-size: 0.8125rem;
}

.badge {
  display: inline-flex;
  align-items: center;
  min-width: 4.5rem;
  justify-content: center;
  margin-left: 0.5rem;
  padding: 0.2rem 0.55rem;
  border-radius: var(--radius-sm);
  color: #b45309;
  background: rgba(245, 158, 11, 0.12);
  border: 1px solid rgba(245, 158, 11, 0.3);
  font-size: 0.75rem;
  font-weight: 700;
}

.badge--active {
  color: #047857;
  background: rgba(16, 185, 129, 0.12);
  border-color: rgba(16, 185, 129, 0.3);
}

.table__muted {
  color: var(--text-muted);
  font-size: 0.8125rem;
}

.table__date {
  color: var(--text-muted);
  font-size: 0.8125rem;
}

.table__actions-col {
  width: 1%;
  white-space: nowrap;
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
  .table th:nth-child(4),
  .table td:nth-child(4),
  .table th:nth-child(7),
  .table td:nth-child(7) {
    display: none;
  }
}
</style>
