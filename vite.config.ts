import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('@xyflow')) {
            return 'xyflow-vendor'
          }
          if (id.includes('lucide-react')) {
            return 'lucide-icons'
          }
          if (id.includes('html-to-image') || id.includes('canvas-confetti')) {
            return 'export-tools'
          }
        }
      }
    }
  }
})

