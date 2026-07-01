<script setup>
import { ref, watch, computed } from 'vue'
import PartEditor from './PartEditor.vue'
import { emptyProductForm, emptyPartForm } from '../types/products'
import { fa } from '../locales/fa'

const props = defineProps({
  open: { type: Boolean, default: false },
  product: { type: Object, default: null },
  serverError: { type: String, default: '' },
})

const emit = defineEmits(['close', 'save'])

const form = ref(emptyProductForm())
const error = ref('')
const isEditing = computed(() => !!props.product)
const title = computed(() =>
  isEditing.value ? fa.products.modal.editTitle : fa.products.modal.addTitle,
)
const submitLabel = computed(() =>
  isEditing.value ? fa.products.modal.saveBtn : fa.products.modal.createBtn,
)

watch(
  () => [props.open, props.product],
  () => {
    if (!props.open) return
    error.value = ''
    form.value = props.product
      ? {
          name: props.product.name || '',
          code: props.product.code ?? '',
          description: props.product.description || '',
          parts: (props.product.parts || []).map((part) => ({
            id: part.id,
            name: part.name || '',
            code: part.code ?? '',
            description: part.description || '',
            moldIds: Array.isArray(part.moldIds) ? [...part.moldIds] : [],
          })),
        }
      : emptyProductForm()
  },
  { immediate: true },
)

function close() {
  error.value = ''
  emit('close')
}

function addPart() {
  form.value.parts = [...form.value.parts, emptyPartForm()]
}

function removePart(index) {
  if (form.value.parts.length <= 1) return
  form.value.parts = form.value.parts.filter((_, i) => i !== index)
}

function updatePart(index, part) {
  form.value.parts = form.value.parts.map((p, i) => (i === index ? part : p))
}

function submit() {
  error.value = ''

  if (!form.value.name.trim()) {
    error.value = fa.products.modal.errors.nameRequired
    return
  }
  if (form.value.code === '' || Number.isNaN(Number(form.value.code))) {
    error.value = fa.products.modal.errors.codeRequired
    return
  }
  if (!form.value.parts.length) {
    error.value = fa.products.modal.errors.partsRequired
    return
  }

  for (let i = 0; i < form.value.parts.length; i++) {
    const part = form.value.parts[i]
    if (!part.name.trim()) {
      error.value = fa.products.modal.errors.partNameRequired.replace('{n}', String(i + 1))
      return
    }
    if (part.code === '' || Number.isNaN(Number(part.code))) {
      error.value = fa.products.modal.errors.partCodeRequired.replace('{n}', String(i + 1))
      return
    }
  }

  emit('save', { ...form.value, parts: form.value.parts.map((p) => ({ ...p })) })
}

function onBackdropClick(e) {
  if (e.target === e.currentTarget) close()
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="open"
        class="modal-backdrop"
        role="dialog"
        aria-modal="true"
        :aria-label="title"
        @click="onBackdropClick"
        @keydown.escape="close"
      >
        <form class="modal" @submit.prevent="submit">
          <div class="modal__header">
            <h2 class="modal__title">{{ title }}</h2>
            <button
              type="button"
              class="modal__close"
              :aria-label="fa.products.modal.close"
              @click="close"
            >
              x
            </button>
          </div>

          <div class="modal__body">
            <p v-if="error || serverError" class="modal__error" role="alert">
              {{ error || serverError }}
            </p>

            <label class="field">
              <span class="field__label">{{ fa.products.fields.name }}</span>
              <input v-model="form.name" class="field__input" type="text" required />
            </label>

            <div class="field-grid">
              <label class="field">
                <span class="field__label">{{ fa.products.fields.code }}</span>
                <input v-model="form.code" class="field__input" type="number" required />
              </label>
            </div>

            <label class="field">
              <span class="field__label">{{ fa.products.fields.description }}</span>
              <textarea v-model="form.description" class="field__input field__textarea" rows="2" />
            </label>

            <div class="parts-section">
              <div class="parts-section__header">
                <h3 class="parts-section__title">{{ fa.products.fields.parts }}</h3>
                <button type="button" class="btn btn--ghost btn--sm" @click="addPart">
                  {{ fa.products.modal.addPart }}
                </button>
              </div>

              <PartEditor
                v-for="(part, index) in form.parts"
                :key="part.id || `part-${index}`"
                :model-value="part"
                :index="index"
                :can-remove="form.parts.length > 1"
                @update:model-value="updatePart(index, $event)"
                @remove="removePart(index)"
              />
            </div>
          </div>

          <div class="modal__footer">
            <button type="button" class="btn btn--ghost" @click="close">
              {{ fa.products.modal.cancel }}
            </button>
            <button type="submit" class="btn btn--primary">{{ submitLabel }}</button>
          </div>
        </form>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: grid;
  place-items: center;
  padding: 1rem;
  background: rgba(15, 23, 42, 0.55);
  backdrop-filter: blur(4px);
}

.modal {
  width: 100%;
  max-width: 640px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
}

.modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--border);
}

.modal__title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text-h);
}

.modal__close {
  border: none;
  background: transparent;
  width: 2rem;
  height: 2rem;
  border-radius: var(--radius-sm);
  font-size: 1.2rem;
  color: var(--text-muted);
  cursor: pointer;
}

.modal__close:hover {
  background: var(--accent-bg);
  color: var(--accent);
}

.modal__body {
  padding: 1.25rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 70svh;
  overflow-y: auto;
}

.modal__error {
  margin: 0;
  padding: 0.65rem 0.85rem;
  font-size: 0.875rem;
  color: #dc2626;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.25);
  border-radius: var(--radius-md);
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
  background: var(--bg);
  outline: none;
  text-align: right;
}

.field__input:focus {
  border-color: var(--accent-border);
  box-shadow: 0 0 0 3px var(--accent-bg);
}

.field__textarea {
  resize: vertical;
  min-height: 4rem;
}

.parts-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.parts-section__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
}

.parts-section__title {
  margin: 0;
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--text-h);
}

.modal__footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  padding: 1rem 1.5rem 1.25rem;
  border-top: 1px solid var(--border);
}

.btn {
  border: none;
  border-radius: var(--radius-md);
  padding: 0.6rem 1rem;
  font: inherit;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
}

.btn--sm {
  padding: 0.4rem 0.75rem;
  font-size: 0.8125rem;
}

.btn--ghost {
  background: transparent;
  color: var(--text-muted);
}

.btn--ghost:hover {
  background: var(--surface-hover);
  color: var(--text-h);
}

.btn--primary {
  background: var(--accent);
  color: #fff;
}

.btn--primary:hover {
  opacity: 0.92;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

@media (max-width: 560px) {
  .field-grid {
    grid-template-columns: 1fr;
  }
}
</style>
