import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import { visualizer } from 'rollup-plugin-visualizer'

// Bundle analysis configuration
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    visualizer({
      filename: 'dist/bundle-analysis.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
      template: 'treemap',
      projectRoot: process.cwd(),
      metadata: {
        title: 'Code A2Z Athina Bundle Analysis',
        description: 'Detailed bundle analysis for performance optimization'
      }
    })
  ],
  build: {
    target: 'es2015',
    minify: false, // Disable minification for better analysis
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          editor: ['@editorjs/editorjs'],
          ui: ['framer-motion', 'react-hot-toast'],
          utils: ['axios', 'firebase']
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
      }
    },
    chunkSizeWarningLimit: 1000
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
    exclude: ['@editorjs/editorjs']
  }
})
