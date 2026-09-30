import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import sitemapPlugin from 'vite-plugin-sitemap'
import imageminPlugin from 'vite-plugin-imagemin'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    sitemapPlugin({
      hostname: 'https://vistaforge.com',
      // NOTE: the option is `dynamicRoutes`, not `routes`. Passing `routes`
      // here was silently ignored and the sitemap only ever contained "/".
      dynamicRoutes: [
        // '/' is already emitted by the plugin; listing it here duplicates it
        '/about',
        '/services',
        '/portfolio',
        '/blog',
        '/faq',
        '/contact',
        // Public case studies, kept in sync with src/data/sampleCaseStudies.js
        '/portfolio/techstart-rebrand',
        '/portfolio/agritech-platform',
        '/portfolio/finserve-digital',
      ],
      exclude: ['/admin', '/dashboard', '/projects', '/timelogs', '/clients', '/invoices', '/analytics', '/settings', '/inquiries'],
      changefreq: 'weekly',
      priority: 0.8,
      lastmod: new Date().toISOString(),
      robots: [
        { userAgent: '*', allow: '/' },
        { userAgent: '*', disallow: '/admin/' },
        { userAgent: '*', disallow: '/dashboard/' },
        { userAgent: '*', disallow: '/projects/' },
        { userAgent: '*', disallow: '/timelogs/' },
        { userAgent: '*', disallow: '/clients/' },
        { userAgent: '*', disallow: '/invoices/' },
        { userAgent: '*', disallow: '/analytics/' },
        { userAgent: '*', disallow: '/settings/' },
        { userAgent: '*', disallow: '/inquiries/' },
      ],
    }),
    imageminPlugin({
      gifsicle: { optimizationLevel: 7, interlaced: false },
      optipng: { optimizationLevel: 7 },
      mozjpeg: { quality: 80 },
      pngquant: { quality: [0.8, 0.9], speed: 4 },
      svgo: {
        plugins: [
          { name: 'removeViewBox', active: false },
          { name: 'removeEmptyAttrs', active: false },
        ],
      },
      // webp/avif are intentionally NOT re-compressed here. sharp already
      // emits optimized .webp/.avif variants during `npm run images`; running
      // imagemin over them as well is redundant and made builds exceed 10
      // minutes.
    }),
  ],
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
          animations: ['@react-spring/web', 'react-awesome-reveal'],
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
    include: ['react', 'react-dom', 'react-router-dom', '@react-spring/web']
  }
})
