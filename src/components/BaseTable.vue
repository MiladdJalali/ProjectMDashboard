<script setup>
defineProps({
  items: { type: Array, required: true },
  columns: { type: Array, required: true }
})
</script>

<template>
  <div class="table-container">
    <table class="data-table">
      <thead>
        <tr>
          <th v-for="col in columns" :key="col.key" :class="col.headerClass">
            {{ col.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in items" :key="item.id || index" class="table-row">
          <td v-for="col in columns" :key="col.key">
            <slot :name="col.key" :item="item">
              {{ item[col.key] ?? '—' }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.table-container {
  width: 100%;
  background: var(--surface);
  overflow: hidden;
  border-radius: 0 0 12px 12px;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th {
  background: var(--surface-hover);
  padding: 1.25rem 1.5rem;
   text-align: center;
  color: var(--text-muted);
  font-weight: 600;
  white-space: nowrap;
}

@media (prefers-color-scheme: light) {
  .data-table th {
    background: #f1f5f9;
  }
}

.data-table td {
  padding: 1.3rem 1.5rem;
  border-bottom: 1px solid var(--border);
  color: var(--text-h);
  vertical-align: middle;
  text-align: center;
}

.table-row:hover {
  background: var(--surface-hover);
}
</style>