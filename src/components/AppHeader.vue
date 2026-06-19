<script setup>
import { fa } from '../locales/fa'

defineProps({
  userCount: { type: Number, default: 0 },
  currentUser: { type: String, default: '' },
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' }
})

defineEmits(['logout'])
</script>

<template>
  <header class="header">
    <div class="header__brand">
      <span class="header__logo" aria-hidden="true">M</span>
      <div>
        <h1 class="header__title">{{ title || fa.molds.header.title }}</h1>
        <p class="header__subtitle">{{ subtitle || fa.molds.header.subtitle }}</p>
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
  width: 2.25rem;
  height: 2.25rem;
  display: grid;
  place-items: center;
  border-radius: var(--radius-md);
  color: #fff;
  background: var(--accent);
  font-weight: 800;
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
  min-width: 4rem;
  padding: 0.5rem 0.85rem;
  background: var(--accent-bg);
  border: 1px solid var(--accent-border);
  border-radius: var(--radius-md);
}

.header__count {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--accent);
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
}

.header__logout:hover {
  color: var(--accent);
  border-color: var(--accent-border);
  background: var(--accent-bg);
}
</style>