import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov', 'json'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.test.{ts,tsx}',
        'src/**/*.spec.{ts,tsx}',
        'src/index.{ts,tsx}',
        'src/setupTests.{ts,js}',
        'src/**/*.d.ts',
        'src/vite-env.d.ts',
        'src/**/types.ts',
        'src/**/*.interfaces.ts',
        'src/**/*.types.ts',
        'src/test-utils/**',
        'src/components/theme-switcher/**',
        'src/context/theme-context.tsx',
        'src/hooks/useLocalStorage.ts',
        'src/hooks/useAnimalSearch.ts',
        'src/stores/animal.store.tsx',
      ],
      thresholds: {
        global: {
          statements: 80,
          branches: 50,
          functions: 50,
          lines: 50,
        },
      },
    },
  },
});
