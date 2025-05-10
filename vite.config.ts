
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  base: './',  // Root hosting for Vercel
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',  // Ensure output is directed to 'dist' for deployment
    rollupOptions: {
      output: {
        manualChunks: undefined, // Optimize chunking
      },
    },
  },
});
