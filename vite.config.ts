import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { viteSingleFile } from 'vite-plugin-singlefile';
import path from 'path';
import { fileURLToPath } from 'url';

// Vite 6 совместим с __dirname через fileURLToPath
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  // КРИТИЧЕСКИ ВАЖНО ДЛЯ RENDER И STATIK HOSTING:
  // Относительные пути предотвращают ошибки MIME-type и 404
  base: './', 
  
  plugins: [
    react(),
    tailwindcss(),
    viteSingleFile(),
  ],
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  
  esbuild: {
    jsx: 'automatic',
  },
  
  build: {
    // Принудительно инлайним ВСЕ ассеты (картинки, шрифты, CSS) в HTML
    assetsInlineLimit: Infinity, 
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
  },
});
