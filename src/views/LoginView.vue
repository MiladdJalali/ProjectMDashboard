<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { fa } from '../locales/fa'
import { ApiError } from '../api/client'

const router = useRouter()
const route = useRoute()
const { login } = useAuth()

const username = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function submit() {
  error.value = ''

  if (!username.value.trim()) {
    error.value = fa.login.errors.usernameRequired
    return
  }
  if (!password.value) {
    error.value = fa.login.errors.passwordRequired
    return
  }

  loading.value = true
  try {
    await login(username.value.trim(), password.value)
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/'
    router.push(redirect)
  } catch (err) {
    error.value =
      err instanceof ApiError && err.status === 401
        ? fa.login.errors.invalidCredentials
        : err instanceof ApiError
          ? err.message
          : fa.login.errors.failed
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-page">
    <div class="login-page__bg" aria-hidden="true"></div>

    <main class="login-card">
      <div class="login-card__header">
        <span class="login-card__logo" aria-hidden="true">🔐</span>
        <h1 class="login-card__title">{{ fa.login.title }}</h1>
        <p class="login-card__subtitle">{{ fa.login.subtitle }}</p>
      </div>

      <form class="login-form" @submit.prevent="submit">
        <p v-if="error" class="login-form__error" role="alert">{{ error }}</p>

        <label class="field">
          <span class="field__label">{{ fa.login.username }}</span>
          <input
            v-model="username"
            type="text"
            class="field__input"
            :placeholder="fa.login.usernamePlaceholder"
            autocomplete="username"
            :disabled="loading"
            required
          />
        </label>

        <label class="field">
          <span class="field__label">{{ fa.login.password }}</span>
          <input
            v-model="password"
            type="password"
            class="field__input"
            :placeholder="fa.login.passwordPlaceholder"
            autocomplete="current-password"
            dir="ltr"
            :disabled="loading"
            required
          />
        </label>

        <button type="submit" class="login-form__submit" :disabled="loading">
          {{ loading ? fa.login.submitting : fa.login.submit }}
        </button>
      </form>
    </main>
  </div>
</template>

<style scoped>
.login-page {
  position: relative;
  min-height: 100svh;
  display: grid;
  place-items: center;
  padding: 2rem 1rem;
}

.login-page__bg {
  position: fixed;
  inset: 0;
  background:
    radial-gradient(ellipse 80% 60% at 50% -10%, var(--accent-bg) 0%, transparent 60%),
    var(--bg);
  z-index: -1;
}

.login-card {
  width: 100%;
  max-width: 400px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
}

.login-card__header {
  text-align: center;
  padding: 2rem 1.5rem 1rem;
}

.login-card__logo {
  font-size: 2rem;
  display: block;
  margin-bottom: 0.75rem;
}

.login-card__title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-h);
}

.login-card__subtitle {
  margin: 0.35rem 0 0;
  font-size: 0.875rem;
  color: var(--text-muted);
}

.login-form {
  padding: 0 1.5rem 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.login-form__error {
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

.field__input {
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 0.65rem 0.85rem;
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
  opacity: 0.6;
}

.login-form__submit {
  margin-top: 0.25rem;
  border: none;
  border-radius: var(--radius-md);
  padding: 0.75rem 1rem;
  font: inherit;
  font-size: 0.9375rem;
  font-weight: 600;
  color: #fff;
  background: var(--accent);
  cursor: pointer;
  transition: opacity 0.2s;
}

.login-form__submit:hover:not(:disabled) {
  opacity: 0.92;
}

.login-form__submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
