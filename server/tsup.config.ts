import { defineConfig } from 'tsup'
import { resolve } from 'path'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  target: 'node20',
  clean: true,
  sourcemap: true,
  esbuildOptions(options) {
    options.alias = { '@': resolve('./src') }
  },
})
