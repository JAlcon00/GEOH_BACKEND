import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['**/*.test.ts', '**/test.*.ts'], // Incluye archivos de prueba
    exclude: ['**/node_modules/**', '**/dist/**'], // Excluye estas carpetas
  },
});