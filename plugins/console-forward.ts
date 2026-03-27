import type { Plugin } from 'vite'
import pc from 'picocolors'

type LogLevel = 'log' | 'warn' | 'error' | 'info' | 'debug'

interface ConsoleMessage {
  level: LogLevel
  args: unknown[]
  url?: string
  line?: number
  col?: number
}

const LEVEL_PREFIX: Record<LogLevel, string> = {
  log:   pc.white(pc.bold('[log]')),
  info:  pc.cyan(pc.bold('[info]')),
  warn:  pc.yellow(pc.bold('[warn]')),
  error: pc.red(pc.bold('[error]')),
  debug: pc.gray(pc.bold('[debug]')),
}

const LEVEL_FORMAT: Record<LogLevel, (s: string) => string> = {
  log:   (s) => pc.white(s),
  info:  (s) => pc.cyan(s),
  warn:  (s) => pc.yellow(s),
  error: (s) => pc.red(s),
  debug: (s) => pc.gray(s),
}

function safeSerialize(arg: unknown): string {
  if (arg === null) return 'null'
  if (arg === undefined) return 'undefined'
  if (typeof arg === 'object') {
    if (arg instanceof Error) {
      return [arg.message, arg.stack].filter(Boolean).join('\n')
    }
    try {
      return JSON.stringify(arg, null, 2)
    } catch {
      return Object.prototype.toString.call(arg)
    }
  }
  return String(arg)
}

function formatMessage(data: ConsoleMessage): string {
  const fmt = LEVEL_FORMAT[data.level]
  const prefix = LEVEL_PREFIX[data.level]
  const tag = pc.dim('[browser]')
  const body = data.args.map(safeSerialize).join(' ')
  const location = data.url
    ? pc.dim(` @ ${data.url}${data.line != null ? `:${data.line}` : ''}${data.col != null ? `:${data.col}` : ''}`)
    : ''
  return `${tag} ${prefix} ${fmt(body)}${location}`
}

const CLIENT_SHIM = /* js */ `
;(function () {
  'use strict'

  if (!import.meta.hot) return // not in Vite dev — bail

  const LEVELS = ['log', 'warn', 'error', 'info', 'debug']

  function tryGetLocation() {
    try {
      var stack = (new Error().stack || '').split('\\n')
      var caller = stack[3] || ''
      var match = caller.match(/\\(?(.+?):(\\d+):(\\d+)\\)?$/)
      if (match) return { url: match[1], line: parseInt(match[2], 10), col: parseInt(match[3], 10) }
    } catch (_) {}
    return {}
  }

  function serialize(a) {
    if (a === null) return null
    if (a === undefined) return '__undefined__'
    if (a instanceof Error) return { __error__: true, message: a.message, stack: a.stack }
    if (typeof a === 'object') {
      try { return JSON.parse(JSON.stringify(a)) } catch (_) { return String(a) }
    }
    return a
  }

  window.addEventListener('error', function (event) {
    import.meta.hot.send('console:message', {
      level: 'error',
      args: [event.message || 'Unknown error'],
      url: event.filename,
      line: event.lineno,
      col: event.colno,
    })
  })

  window.addEventListener('unhandledrejection', function (event) {
    var reason = event.reason
    var message = reason instanceof Error
      ? reason.message + (reason.stack ? '\\n' + reason.stack : '')
      : String(reason)
    import.meta.hot.send('console:message', {
      level: 'error',
      args: ['UnhandledPromiseRejection: ' + message],
    })
  })

  LEVELS.forEach(function (level) {
    var original = console[level].bind(console)
    console[level] = function () {
      var args = Array.prototype.slice.call(arguments)
      original.apply(console, args)
      var loc = tryGetLocation()
      import.meta.hot.send('console:message', {
        level: level,
        args: args.map(serialize),
        url: loc.url,
        line: loc.line,
        col: loc.col,
      })
    }
  })
})()
`

export function consoleForwardPlugin(): Plugin {
  return {
    name: 'vite-plugin-console-forward',
    apply: 'serve',

    configureServer(server) {
      server.ws.on('console:message', (data: ConsoleMessage) => {
        if (!data.level || !Array.isArray(data.args)) return

        data.args = data.args.map((a) => {
          if (a === '__undefined__') return undefined
          if (a && typeof a === 'object' && (a as Record<string, unknown>).__error__) {
            const e = a as { message: string; stack?: string }
            return `Error: ${e.message}${e.stack ? '\n' + e.stack : ''}`
          }
          return a
        })

        const formatted = formatMessage(data)

        if (data.level === 'error') {
          server.config.logger.error(formatted)
        } else if (data.level === 'warn') {
          server.config.logger.warn(formatted)
        } else {
          server.config.logger.info(formatted)
        }
      })
    },

    transformIndexHtml() {
      return [
        {
          tag: 'script',
          attrs: { type: 'module' }, // must be module — import.meta.hot only exists in module context
          injectTo: 'head-prepend',
          children: CLIENT_SHIM,
        },
      ]
    },
  }
}