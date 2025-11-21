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
    historyApiFallback: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
      '/graphql': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true, // Enable sourcemaps to debug production issues
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['lucide-react', 'react-icons'],
          animations: ['react-spring', 'react-awesome-reveal'],
          dnd: ['@dnd-kit/core', '@dnd-kit/sortable', '@dnd-kit/utilities'],
          redux: ['@reduxjs/toolkit', 'react-redux'],
          utils: ['html2canvas', 'jspdf', 'react-helmet-async']
        }
      }
    },
    chunkSizeWarningLimit: 1000,
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
