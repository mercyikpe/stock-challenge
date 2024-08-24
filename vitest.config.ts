import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': '/src', 
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
  },
});
