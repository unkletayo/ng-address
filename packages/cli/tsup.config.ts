import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    bin: 'src/bin.ts',
    index: 'src/index.ts'
  },
  format: ['esm'],
  dts: true,
  clean: true,
  banner: {
    js: '#!/usr/bin/env node'
  },
  sourcemap: true,
  target: 'es2022'
});
