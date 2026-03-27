import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'url'
import { consoleForwardPlugin } from './plugins/console-forward'


const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  ssr: {
    external: ['playwright', 'playwright-core'],
    noExternal: [],
  },
  optimizeDeps: {
    exclude: ['playwright', 'playwright-core'],
  },
  plugins: [
    tanstackStart(),
    tailwindcss(),
    viteReact(),
    consoleForwardPlugin(),
  ],
})
