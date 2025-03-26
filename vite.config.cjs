const { defineConfig } = require('vite')
const react = require('@vitejs/plugin-react')
const path = require('path')

module.exports = defineConfig({
  // 👇 IMPORTANTE: deve corrispondere al nome del repo
  base: '/pac-dashboard/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
})
