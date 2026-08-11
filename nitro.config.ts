export default defineNitroConfig({
  compatibilityDate: '2026-08-11',
  apiDir: 'server/api',
  routesDir: 'server/routes',
  runtimeConfig: {
    chromePath: process.env.CHROME_PATH || '',
  },
})
