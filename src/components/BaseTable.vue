<script setup>
defineProps({
  // داده‌های جدول (آرایه‌ای از آبجکت‌ها)
  items: { type: Array, required: true },
  // آرایه ستون‌ها: [{ key: 'username', label: 'نام کاربری' }]
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
  background: #1e2937;
  overflow: hidden;
  border-radius: 0 0 12px 12px;
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
  white-space: nowrap;
}

.data-table td {
  padding: 1.3rem 1.5rem;
  border-bottom: 1px solid #334155;
  color: #e2e8f0;
  vertical-align: middle;
}

.table-row:hover {
  background: #27344f;
}
</style>