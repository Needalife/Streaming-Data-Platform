import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/gateway': {
        target: 'http://localhost:8001',
        // target: 'http://gateway:8000',
        // target: 'http://host.docker.internal:8001',
        changeOrigin: true,
      },
    },
  },
});
