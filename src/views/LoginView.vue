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
    <!-- LEFT: Image -->
    <div class="login-page__illustration">
      <img 
        src="../assets/login-illustration.png" 
        alt="Login Illustration"
        class="illustration-image"
      />
    </div>

    <!-- RIGHT: Login Form -->
    <div class="login-page__form-side">
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
  </div>
</template>

<style scoped>
.login-page {
  display: flex;
  min-height: 100vh;
  height: 100vh;
  overflow: hidden;
  background: #0f172a;
  direction: ltr;
}

.login-page__illustration {
  flex: 0 0 62%;
  position: relative;
  overflow: hidden;
  background: #f1f5f9;
}

.illustration-image {
  position: absolute;
  inset: 0;                 /* top:0, right:0, bottom:0, left:0 */
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.login-page__form-side {
  flex: 0 0 38%;            /* جمعاً 100% بشه */
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  background: #0f172a;
}

.login-card {
  width: 100%;
  max-width: 420px;
  background: rgba(255, 255, 255, 0.98);
  border-radius: 16px;
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.15);
  overflow: hidden;
}

/* بقیه استایل‌ها (فرم) بدون تغییر */
.login-card__header { text-align: center; padding: 2.5rem 2rem 1.5rem; }
.login-card__logo { font-size: 2.8rem; display: block; margin-bottom: 1rem; }
.login-card__title { margin: 0 0 0.5rem; font-size: 1.65rem; font-weight: 700; color: #1e2937; }
.login-card__subtitle { margin: 0; font-size: 0.95rem; color: #64748b; }

.login-form {
  padding: 0 2rem 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.field { display: flex; flex-direction: column; gap: 0.4rem; }
.field__label { font-size: 0.8125rem; font-weight: 600; color: #1e2937; }

.field__input {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  font-size: 0.95rem;
  background: white;
  text-align: right;
}

.field__input[dir='ltr'] { text-align: left; }

.field__input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

.login-form__submit {
  background: #3b82f6;
  color: white;
  padding: 0.9rem;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 0.5rem;
}

.login-form__submit:hover:not(:disabled) { background: #2563eb; }
.login-form__submit:disabled { opacity: 0.6; cursor: not-allowed; }

/* موبایل */
@media (max-width: 1024px) {
  .login-page {
    flex-direction: column;
    height: auto;
  }
  .login-page__illustration {
    flex: none;
    height: 45vh;
  }
  .illustration-image {
    object-fit: contain;
  }
}
</style>