/* eslint-disable import/no-unresolved */
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/**/*.e2e.test.js', 'tests/e2e/**/*.spec.ts'],
  },
});
