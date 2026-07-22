<script setup>
import { computed } from 'vue'
import MoldMultiSelect from './Molds/MoldMultiSelect.vue'

const props = defineProps({
  modelValue: { type: Object, required: true },
  index: { type: Number, required: true },
  canRemove: { type: Boolean, default: true },
})

const emit = defineEmits(['update:modelValue', 'remove'])

const part = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

function updateField(key, value) {
  emit('update:modelValue', { ...props.modelValue, [key]: value })
}
</script>

<template>
  <div class="part-editor">
    <div class="part-editor__header">
      <span class="part-editor__title">
        {{ fa.products.fields.part }} {{ index + 1 }}
      </span>
      <button
        v-if="canRemove"
        type="button"
        class="part-editor__remove"
        @click="emit('remove')"
      >
        {{ fa.products.modal.removePart }}
      </button>
    </div>

    <div class="field-grid">
      <label class="field">
        <span class="field__label">{{ fa.products.fields.partName }}</span>
        <input
          :value="part.name"
          class="field__input"
          type="text"
          required
          @input="updateField('name', $event.target.value)"
        />
      </label>

      <label class="field">
        <span class="field__label">{{ fa.products.fields.partCode }}</span>
        <input
          :value="part.code"
          class="field__input"
          type="number"
          required
          @input="updateField('code', $event.target.value)"
        />
      </label>
    </div>

    <label class="field">
      <span class="field__label">{{ fa.products.fields.description }}</span>
      <textarea
        :value="part.description"
        class="field__input field__textarea"
        rows="2"
        @input="updateField('description', $event.target.value)"
      />
    </label>

    <MoldMultiSelect
      :model-value="part.moldIds || []"
      @update:model-value="updateField('moldIds', $event)"
    />
  </div>
</template>

<style scoped>
.part-editor {
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 1rem;
  background: var(--bg);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.part-editor__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
}

.part-editor__title {
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--text-h);
}

.part-editor__remove {
  border: none;
  background: transparent;
  color: #dc2626;
  font: inherit;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-sm);
}

.part-editor__remove:hover {
  background: rgba(239, 68, 68, 0.1);
}

.field-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.field__label {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--text-h);
}

.field__input {
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 0.6rem 0.85rem;
  font: inherit;
  font-size: 0.9375rem;
  color: var(--text-h);
  background: var(--surface);
  outline: none;
  text-align: right;
}

.field__input:focus {
  border-color: var(--accent-border);
  box-shadow: 0 0 0 3px var(--accent-bg);
}

.field__textarea {
  resize: vertical;
  min-height: 3rem;
}

@media (max-width: 560px) {
  .field-grid {
    grid-template-columns: 1fr;
  }
}
</style>
