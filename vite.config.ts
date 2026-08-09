import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { viteSingleFile } from 'vite-plugin-singlefile';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  // КРИТИЧНО ДЛЯ RENDER: явный относительный базовый путь
  base: './',
  
  plugins: [
    react(),
    // Tailwind v4 beta требует явного указания, но мы страхуемся
    tailwindcss(),
    viteSingleFile({ 
      removeViteModuleLoader: true,
      useRecommendedBuildConfig: true 
    }),
  ],
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  
  build: {
    target: 'esnext',
    assetsInlineLimit: 100000000, // Инлайн всё агрессивно
    cssCodeSplit: false,          // Запрещаем разделение CSS
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
        format: 'iife',           // Максимальная совместимость для singlefile
      },
    },
  },
  
  // Предотвращение проблем с бета-зависимостями в CI
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
});
