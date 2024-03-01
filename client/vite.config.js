const { defineConfig } = require('vite');
const react = require('@vitejs/plugin-react');

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxying multiple routes
      '/rest': 'http://localhost:3001',
      '/content': 'http://localhost:3001'
      // ... add other routes as needed
    }
  },
  build: {
    chunkSizeWarningLimit: 2000 // size in KB
  }
});