// Gerege Systems Development Team болон Claude AI хамтран бүтээв, 2026.

import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  resolve: {
    alias: {
      // `server-only` нь client bundle-д орвол алдаа шиддэг; unit тестэд no-op.
      'server-only': path.resolve(__dirname, 'src/test/server-only-stub.ts'),
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    globals: true,
  },
});
