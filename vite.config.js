import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const parsePort = (value, fallback) => {
  const parsed = Number.parseInt(value ?? '', 10)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback
}

const DEFAULT_PORT = 5554
const devPort = parsePort(process.env.PORT, DEFAULT_PORT)
const previewPort = parsePort(process.env.PREVIEW_PORT, devPort)

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: devPort,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  preview: {
    port: previewPort,
    host: true,
  },
})
