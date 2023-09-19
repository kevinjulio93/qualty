import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import sass from 'sass'

export default defineConfig({
  plugins: [react()],
  build: {
    manifest: true,
    rollupOptions: {
      input: {
        'index.js': 'src/modules/WebSdk/index.js',
      },
    },
  },
  define: {
    'process.env': {
      NODE_ENV: process.env.NODE_ENV,
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        implementation: sass,
      },
    },
  },
})
