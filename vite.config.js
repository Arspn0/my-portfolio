import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    copy({
      targets: [
        { src: 'public/_redirects', dest: 'dist' }
      ],
      hook: 'writeBundle'
    })
  ],
  build: {
    outDir: 'dist',
  },
})
