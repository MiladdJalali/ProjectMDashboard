<template>
  <div class="pagination" v-if="totalPages > 1">
    <button 
      class="pagination__btn" 
      :disabled="currentPage === 1" 
      @click="$emit('page-changed', currentPage - 1)"
    >
      قبلی
    </button>

    <button 
      v-for="page in totalPages" 
      :key="page" 
      class="pagination__btn" 
      :class="{ 'pagination__btn--active': currentPage === page }"
      @click="$emit('page-changed', page)"
    >
      {{ page }}
    </button>

    <button 
      class="pagination__btn" 
      :disabled="currentPage === totalPages" 
      @click="$emit('page-changed', currentPage + 1)"
    >
      بعدی
    </button>
  </div>
</template>

<script setup>
defineProps({
  currentPage: { type: Number, required: true },
  totalPages: { type: Number, required: true },
})

defineEmits(['page-changed'])
</script>

<style scoped>
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
}

.pagination__btn {
  min-width: 2.25rem;
  height: 2.25rem;
  padding: 0 0.5rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background: var(--surface);
  color: var(--text-muted);
  font: inherit;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
}

.pagination__btn:hover:not(:disabled):not(.pagination__btn--active) {
  border-color: var(--accent-border);
  color: var(--accent);
  background: var(--accent-bg);
}

.pagination__btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination__btn--active {
  background: var(--accent);
  color: #fff;
  border-color: var(--accent);
}
</style>