import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Avoid CORS during local development by proxying API calls.
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
})
