import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// API keys are loaded from system environment variables (not .env file)
// Set VITE_DRIVE_KEY_1 and VITE_DRIVE_KEY_2 in your ~/.bashrc
export default defineConfig({
  plugins: [react()],
  define: {
    'import.meta.env.VITE_DRIVE_KEY_1': JSON.stringify(process.env.VITE_DRIVE_KEY_1),
    'import.meta.env.VITE_DRIVE_KEY_2': JSON.stringify(process.env.VITE_DRIVE_KEY_2),
  },
})
