export default defineNitroConfig({
  compatibilityDate: '2026-08-11',
  apiDir: 'server/api',
  routesDir: 'server/routes',
  preset: process.env.VERCEL === '1' ? 'vercel' : 'node-server',
  runtimeConfig: {
    chromePath: process.env.CHROME_PATH || '',
  },
  vercel: {
    functions: {
      maxDuration: 30,
      memory: 1024,
      architecture: 'x86_64',
    },
    config: {
      overrides: {
        'index.html': { path: '/' },
        'studio.html': { path: '/studio' },
        'preview.html': { path: '/preview' },
      },
    },
  },
})
