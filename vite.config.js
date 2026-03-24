import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // GitHub Pages deploys to https://<user>.github.io/<repo>/
  base: '/Sci-Calc/',
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1600,
  },
});
