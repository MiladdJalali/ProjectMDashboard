<template>
  <aside class="sidebar">
    <div class="sidebar__header">
      <span class="sidebar__logo">⚡</span>
      <h2 class="sidebar__title">پنل مدیریت</h2>
    </div>
    
    <nav class="sidebar__nav">
      <ul>
        <li>
          <router-link to="/" class="sidebar__link active">
            <span class="sidebar__icon">👤</span>
            <span>کاربران سیستم</span>
          </router-link>
        </li>
        <li>
          <router-link to="/products" class="sidebar__link">
            <span class="sidebar__icon">📦</span>
            <span>محصولات</span>
          </router-link>
        </li>
        <li>
          <router-link to="/settings" class="sidebar__link">
            <span class="sidebar__icon">⚙️</span>
            <span>تنظیمات</span>
          </router-link>
        </li>
      </ul>
    </nav>

    <div class="sidebar-footer">      
      <button @click="handleLogout" class="logout-btn">
        <span>🚪</span>
        خروج
      </button>
    </div>
  </aside>
</template>

<script setup>
import { useAuth } from '../composables/useAuth'
import { useRouter } from 'vue-router'

const { logout } = useAuth()
const router = useRouter()

const handleLogout = async () => {
  await logout()
  router.push('/login')
}
</script>

<style scoped>
.sidebar {
  width: 260px;
  height: 100vh;
  background-color: var(--surface);
  border-left: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
  flex-shrink: 0;
}

.sidebar__header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.75rem 1.5rem;
  border-bottom: 1px solid var(--border);
}

.sidebar__logo {
  font-size: 1.5rem;
}

.sidebar__title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text-h);
}

.sidebar__nav {
  padding: 1rem;
  flex: 1;
}

.sidebar__nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.sidebar__link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  text-decoration: none;
  color: var(--text-muted);
  border-radius: var(--radius-md);
  font-size: 0.9375rem;
  font-weight: 500;
  transition: background 0.2s, color 0.2s;
}

.sidebar__link:hover {
  background: var(--surface-hover);
  color: var(--text-h);
}

.sidebar__link.active {
  background: var(--accent-bg);
  color: var(--accent);
  font-weight: 600;
}

.sidebar__icon {
  font-size: 1.1rem;
  width: 1.5rem;
  text-align: center;
}

/* Footer Styles */
.sidebar-footer {
  margin-top: auto;
  padding: 1.5rem 1rem;
  border-top: 1px solid var(--border);
}

.user-info {
  margin-bottom: 1rem;
  text-align: center;
}

.user-name {
  display: block;
  font-weight: 600;
  color: var(--text-h);
}

.user-role {
  font-size: 0.85rem;
  color: var(--text-muted);
}

.logout-btn {
  width: 100%;
  padding: 0.75rem;
  background: rgba(239, 68, 68, 0.15);
  color: #f87171;
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.logout-btn:hover {
  background: rgba(239, 68, 68, 0.25);
  color: #ef4444;
}
</style>