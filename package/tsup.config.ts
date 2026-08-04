import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/index.ts'],
    target: 'es2022',
    format: 'esm',
    splitting: false,
    sourcemap: true,
    clean: true,
    dts: true,
});
