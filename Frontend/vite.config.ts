/// <reference types="vitest" />
import { VitePWA } from 'vite-plugin-pwa';
import legacy from '@vitejs/plugin-legacy'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    legacy(),
    VitePWA({ registerType: 'autoUpdate', devOptions: {
        enabled: false 
      } })
  ],
  server: {
    host: '0.0.0.0',
    port: 3007,
    proxy: {
      // Todo lo que empiece por /api se reenvía al servicio backend
      '/api': {
        target: 'http://backend:4007',
        changeOrigin: true,
        // Esta línea es CRÍTICA: elimina el prefijo /api para que FastAPI reciba "/tutores", no "/api/tutores"
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  }
})