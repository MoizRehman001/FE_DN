import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  server: {
    port: 7077 // Change this to the port you desire
  },
  plugins: [react()],
})
