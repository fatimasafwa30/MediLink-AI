import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // On some Windows setups, "localhost" resolves oddly; 127.0.0.1 is reliable.
    host: '127.0.0.1',
    port: 5173,
    strictPort: false,
    open: true,
  },
  preview: {
    host: '127.0.0.1',
    port: 4173,
    strictPort: false,
    open: true,
  },
})
