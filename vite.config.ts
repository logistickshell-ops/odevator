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
    // Tailwind v4 beta — плагин должен быть в plugins, без дополнительных настроек
    tailwindcss(),
    viteSingleFile({ 
      removeViteModuleLoader: true,
      useRecommendedBuildConfig: true 
    }),
  ],
  
  // ⚠️ УДАЛЁН БЛОК optimizeDeps — он конфликтовал с Tailwind v4 beta
  // ⚠️ Раньше здесь было: optimizeDeps: { include: ['react', 'react-dom'] }

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
});
