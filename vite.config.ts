import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const apiPort = Number(process.env.API_PORT ?? 3000)

// The frontend calls /api/... so it never hardcodes a host. Both the dev and the
// preview server forward those calls to the local pincode API.
const proxy = {
  '/api': {
    target: `http://localhost:${apiPort}`,
    changeOrigin: true,
  },
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: { proxy },
  preview: { proxy },
})
