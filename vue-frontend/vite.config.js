import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 8000,
    allowedHosts: ['4gxz64-8004.csb.app', 'localhost']
  }
})
