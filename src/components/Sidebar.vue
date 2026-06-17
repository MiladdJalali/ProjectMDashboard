<template>
  <aside class="sidebar">
    <!-- Header -->
    <div class="sidebar__header">
      <div class="logo-container">
        <span class="sidebar__logo">⚡</span>
        <h2 class="sidebar__title">پنل مدیریت</h2>
      </div>
    </div>

    <!-- Navigation -->
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

    <!-- User Section - Improved -->
    <div class="sidebar-footer">
      <div class="user-section">
        <div class="user-avatar">
          👤
        </div>
        <div class="user-info">
          <span class="user-name">{{ user?.name || 'admin' }}</span>
          <span class="user-role">مدیر سیستم</span>
        </div>
      </div>

      <button @click="handleLogout" class="logout-btn">
        <span class="logout-icon">🚪</span>
        خروج از حساب
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
  width: 280px;
  height: 100vh;
  background: #1e2937;
  border-left: 1px solid #334155;
  display: flex;
  flex-direction: column;
  color: #e2e8f0;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.4);
  flex-shrink: 0;
}

/* Header */
.sidebar__header {
  padding: 1.8rem 1.25rem;
  border-bottom: 1px solid #334155;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.sidebar__logo {
  font-size: 1.8rem;
  background: linear-gradient(135deg, #60a5fa, #3b82f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.sidebar__title {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 700;
  color: white;
}

/* Navigation */
.sidebar__nav {
  flex: 1;
  padding: 1.25rem 0.75rem;
}

.sidebar__nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.sidebar__link {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 0.85rem 1.1rem;
  text-decoration: none;
  color: #cbd5e1;
  border-radius: 10px;
  font-size: 0.96rem;
  transition: all 0.2s ease;
}

.sidebar__link:hover {
  background: #334155;
  color: white;
  transform: translateX(-4px);
}

.sidebar__link.active {
  background: #3b82f6;
  color: white;
  box-shadow: 0 4px 8px -2px rgba(59, 130, 246, 0.4);
}

.sidebar__icon {
  font-size: 1.3rem;
  width: 26px;
}

/* User Section - Improved */
.sidebar-footer {
  padding: 1.25rem;
  background: #1a2330;
  border-top: 1px solid #334155;
}

.user-section {
  display: flex;
  align-items: center;
  gap: 14px;
  padding-bottom: 1rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid #334155;
}

.user-avatar {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #475569, #64748b);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  flex-shrink: 0;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}

.user-info {
  flex: 1;
}

.user-name {
  display: block;
  font-weight: 600;
  color: #f1f5f9;
  font-size: 1rem;
}

.user-role {
  font-size: 0.82rem;
  color: #94a3b8;
}

/* Logout Button */
.logout-btn {
  width: 100%;
  padding: 0.85rem;
  background: #b91c1c;
  color: #fecaca;
  border: none;
  border-radius: 10px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.25s ease;
  font-size: 0.95rem;
}

.logout-btn:hover {
  background: #991b1b;
  color: white;
  transform: translateY(-2px);
}

.logout-icon {
  font-size: 1.15rem;
}
</style>