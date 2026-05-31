import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/rest': {
        target: 'http://localhost:45228',
        changeOrigin: true,
      },
    },
  },
})
