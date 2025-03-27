import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Node.js utility per convertire import.meta.url in __dirname
import path from 'path'
import { fileURLToPath } from 'url'

// Calcoliamo __dirname (non esiste nativamente in ESM)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  base: '/pac-dashboard/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
})
