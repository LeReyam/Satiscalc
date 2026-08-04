import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
  ],
  server: {
    proxy: {
      // Leite alle Anfragen, die mit /api beginnen, an Port 3000 weiter
      "/api": "http://localhost:3000",
      "/icons": "http://localhost:3000",
    },
  },
  build: {
    chunkSizeWarningLimit: 700,
  },
});
