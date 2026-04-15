// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  // 👇 ЗАМЕНИТЕ 'my-repo' на название вашего репозитория
  base: process.env.NODE_ENV === 'production' ? '/BLAS02/' : '/',
})