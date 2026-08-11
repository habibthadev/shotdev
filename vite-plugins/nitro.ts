import type { Plugin } from 'vite'
import { createNitro, createDevServer, prepare, build } from 'nitropack'
import { toNodeListener } from 'h3'

type NitroDevServer = ReturnType<typeof createDevServer>

export function nitroPlugin(): Plugin {
  let isDev = false
  let devServer: NitroDevServer | null = null

  async function startDevServer() {
    await devServer?.close()
    const nitro = await createNitro({ rootDir: process.cwd(), dev: true })
    devServer = createDevServer(nitro)
    await prepare(nitro)
    await build(nitro)
  }

  return {
    name: 'shotdev:nitro',

    configResolved(config) {
      isDev = config.command === 'serve'
    },

    async configureServer(server) {
      await startDevServer()
      const handle = toNodeListener(devServer!.app)
      server.middlewares.use((req, res, next) => {
        const url = req.url ?? ''
        if (url.startsWith('/api') || url.startsWith('/_nitro')) {
          handle(req, res)
        } else {
          next()
        }
      })
    },

    async closeBundle() {
      if (isDev) return
      const nitro = await createNitro({ rootDir: process.cwd(), dev: false })
      await prepare(nitro)
      await build(nitro)
    },

    async closeWatcher() {
      await devServer?.close()
      devServer = null
    },
  }
}
