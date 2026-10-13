import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: [
      'packages/**/*.test.{ts,tsx}',
      'packages/**/*.spec.{ts,tsx}',
      'examples/**/*.test.{ts,tsx}',
      'examples/**/*.spec.{ts,tsx}'
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html']
    }
  }
});
