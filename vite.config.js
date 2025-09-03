import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3000,
    open: true,
    hmr: {
      overlay: true
    },
    // Handle client-side routing - serve index.html for all routes
    historyApiFallback: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          animations: ['react-spring', 'react-awesome-reveal']
        }
      }
    }
  },
  preview: {
    port: 4173,
    host: true,
    // Handle client-side routing for preview server as well
    historyApiFallback: true
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'react-spring']
  }
})
