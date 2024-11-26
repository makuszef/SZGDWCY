import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    outDir: 'dist', // folder wyjściowy
  },
  server: {
    proxy: {
      '/api': {
        // Jeśli używasz backendu, skonfiguruj odpowiednio adres
        target: 'https://perfecthome.azurewebsites.net',
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
