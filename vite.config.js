import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://159.65.153.191:8000',
      '/ws': { target: 'ws://159.65.153.191:8000', ws: true }
    }
  }
})
