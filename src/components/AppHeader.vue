<script setup>
import { fa } from '../locales/fa'

defineProps({
  userCount: { type: Number, required: true },
  currentUser: { type: String, default: '' },
})

defineEmits(['logout'])
</script>

<template>
  <header class="header">
    <div class="header__brand">
      <span class="header__logo" aria-hidden="true">👥</span>
      <div>
        <h1 class="header__title">{{ fa.header.title }}</h1>
        <p class="header__subtitle">{{ fa.header.subtitle }}</p>
      </div>
    </div>

    <div class="header__actions">
      <div v-if="currentUser" class="header__user">
        <span class="header__user-label">{{ fa.header.loggedInAs }}</span>
        <span class="header__user-name" dir="ltr">{{ currentUser }}</span>
      </div>
      <div class="header__badge">
        <span class="header__count">{{ userCount }}</span>
        <span class="header__label">{{ fa.header.users }}</span>
      </div>
      <button type="button" class="header__logout" @click="$emit('logout')">
        {{ fa.header.logout }}
      </button>
    </div>
  </header>
</template>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.75rem 1.5rem;
  border-bottom: 1px solid var(--border);
  flex-wrap: wrap;
}

.header__brand {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.header__logo {
  font-size: 1.75rem;
  line-height: 1;
}

.header__title {
  margin: 0;
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--text-h);
}

.header__subtitle {
  margin: 0.15rem 0 0;
  font-size: 0.875rem;
  color: var(--text-muted);
}

.header__actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.header__user {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  font-size: 0.75rem;
}

.header__user-label {
  color: var(--text-muted);
}

.header__user-name {
  font-weight: 600;
  color: var(--text-h);
}

.header__badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5rem 0.85rem;
  background: var(--accent-bg);
  border: 1px solid var(--accent-border);
  border-radius: var(--radius-md);
  min-width: 4rem;
}

.header__count {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--accent);
  line-height: 1.2;
}

.header__label {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.header__logout {
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 0.5rem 0.85rem;
  font: inherit;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--text-muted);
  background: var(--surface);
  cursor: pointer;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
}

.header__logout:hover {
  color: #ef4444;
  border-color: rgba(239, 68, 68, 0.4);
  background: rgba(239, 68, 68, 0.06);
}

@media (max-width: 640px) {
  .header {
    flex-direction: column;
    align-items: stretch;
  }

  .header__actions {
    justify-content: space-between;
  }
}
</style>
