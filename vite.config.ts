import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: 'https://sah-platform-web-ccekg8f2gce3evgt.canadacentral-01.azurewebsites.net/',
  plugins: [react()],
})
