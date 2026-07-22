<script setup>
import { ref, watch, computed } from 'vue'
import { fa, emptyUserForm } from '../../locales/fa'

const props = defineProps({
  open: { type: Boolean, default: false },
  user: { type: Object, default: null },
  serverError: { type: String, default: '' },
})

const emit = defineEmits(['close', 'save'])

const form = ref(emptyUserForm())
const error = ref('')

const isEditing = computed(() => !!props.user)
const title = computed(() =>
  isEditing.value ? fa.modal.editTitle : fa.modal.addTitle,
)
const submitLabel = computed(() =>
  isEditing.value ? fa.modal.saveBtn : fa.modal.createBtn,
)

watch(
  () => [props.open, props.user],
  () => {
    if (!props.open) return
    error.value = ''
    form.value = props.user
      ? {
          username: props.user.username || '',
          address: props.user.address || '',
          description: props.user.description || '',
          password: '',
          confirmPassword: '',
        }
      : emptyUserForm()
  },
  { immediate: true },
)

function close() {
  error.value = ''
  emit('close')
}

function submit() {
  error.value = ''

  if (!form.value.username.trim()) {
    error.value = fa.modal.errors.usernameRequired
    return
  }
  if (!form.value.password) {
    error.value = fa.modal.errors.passwordRequired
    return
  }
  if (!form.value.confirmPassword) {
    error.value = fa.modal.errors.confirmRequired
    return
  }
  if (form.value.password !== form.value.confirmPassword) {
    error.value = fa.modal.errors.passwordMismatch
    return
  }

  emit('save', { ...form.value })
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
              :aria-label="fa.modal.close"
              @click="close"
            >
              ×
            </button>
          </div>

          <div class="modal__body">
            <p v-if="error || serverError" class="modal__error" role="alert">
              {{ error || serverError }}
            </p>

            <label class="field">
              <span class="field__label">{{ fa.modal.username }}</span>
              <input
                v-model="form.username"
                type="text"
                class="field__input"
                :placeholder="fa.modal.usernamePlaceholder"
                autocomplete="username"
                dir="ltr"
                :disabled="isEditing"
                required
              />
            </label>

            <label class="field">
              <span class="field__label">
                {{ fa.modal.address }}
                <span class="field__optional">{{ fa.modal.optional }}</span>
              </span>
              <input
                v-model="form.address"
                type="text"
                class="field__input"
                :placeholder="fa.modal.addressPlaceholder"
              />
            </label>

            <label class="field">
              <span class="field__label">
                {{ fa.modal.description }}
                <span class="field__optional">{{ fa.modal.optional }}</span>
              </span>
              <textarea
                v-model="form.description"
                class="field__input field__textarea"
                :placeholder="fa.modal.descriptionPlaceholder"
                rows="2"
              />
            </label>

            <label class="field">
              <span class="field__label">{{ fa.modal.password }}</span>
              <input
                v-model="form.password"
                type="password"
                class="field__input"
                :placeholder="fa.modal.passwordPlaceholder"
                autocomplete="new-password"
                dir="ltr"
                required
              />
            </label>

            <label class="field">
              <span class="field__label">{{ fa.modal.confirmPassword }}</span>
              <input
                v-model="form.confirmPassword"
                type="password"
                class="field__input"
                :placeholder="fa.modal.passwordPlaceholder"
                autocomplete="new-password"
                dir="ltr"
                required
              />
            </label>
          </div>

          <div class="modal__footer">
            <button type="button" class="btn btn--ghost" @click="close">
              {{ fa.modal.cancel }}
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
  max-width: 440px;
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
  font-weight: 600;
  color: var(--text-h);
}

.modal__close {
  border: none;
  background: transparent;
  width: 2rem;
  height: 2rem;
  border-radius: var(--radius-sm);
  font-size: 1.4rem;
  line-height: 1;
  color: var(--text-muted);
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
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

.field__optional {
  font-weight: 400;
  color: var(--text-muted);
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
  transition: border-color 0.2s, box-shadow 0.2s;
  text-align: right;
}

.field__input[dir='ltr'] {
  text-align: left;
}

.field__input:focus {
  border-color: var(--accent-border);
  box-shadow: 0 0 0 3px var(--accent-bg);
}

.field__input:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.field__textarea {
  resize: vertical;
  min-height: 4rem;
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
  transition: opacity 0.2s, background 0.15s;
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

.modal-enter-active .modal,
.modal-leave-active .modal {
  transition: transform 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal,
.modal-leave-to .modal {
  transform: scale(0.96) translateY(8px);
}
</style>
