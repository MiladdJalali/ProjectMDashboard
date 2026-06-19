<template>
  <div class="app-layout">
    <Sidebar v-if="showSidebar" />

  
    <main class="app-content" :class="{ 'full-width': !showSidebar }">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { RouterView, useRoute } from 'vue-router'
import Sidebar from './components/Sidebar.vue'
import { computed } from 'vue'

const route = useRoute()

const showSidebar = computed(() => {
  return route.path !== '/login' && route.path !== '/login/'
})
</script>

<style>
* {
  box-sizing: border-box;
}

body, html {
  margin: 0;
  padding: 0;
  background-color: var(--bg);
  font-family: inherit;
}

.app-layout {
  display: flex;
  min-height: 100vh;
  overflow: hidden;
}

.app-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.app-content.full-width {
  width: 100%;
  margin: 0;
}
</style>