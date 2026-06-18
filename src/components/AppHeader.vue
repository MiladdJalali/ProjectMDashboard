<script setup>
import { fa } from '../locales/fa'

defineProps({
  userCount: { type: Number, required: true },
  currentUser: { type: String, default: '' },
})

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
