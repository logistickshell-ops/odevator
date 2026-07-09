import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { viteSingleFile } from 'vite-plugin-singlefile';
import path from 'path';
import { fileURLToPath } from 'url';

// Vite 6 совместим с __dirname через fileURLToPath
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    // React 18 плагин для Vite 6
    react(),
    // Tailwind CSS v4 beta - новый плагин, больше не нужен postcss.config.js
    tailwindcss(),
    // Собирает весь проект в один HTML файл
    viteSingleFile(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  // React 18 + Vite 6 - оптимальные настройки
  esbuild: {
    jsx: 'automatic',
  },
  build: {
    // Для singlefile плагина
    rollupOptions: {
      output: {
        // Инлайним все ассеты в HTML
        inlineDynamicImports: true,
      },
    },
  },
});
