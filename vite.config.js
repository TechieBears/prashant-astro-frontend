import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Ensure environment variables are available
    'import.meta.env': JSON.stringify(process.env)
  },
  server: {
    host: '0.0.0.0',               // allow external access
    port: 5173,
    allowedHosts: ['astroguid.com', 'www.astroguid.com']
  },
  preview: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: ['astroguid.com', 'www.astroguid.com']
  }
})
