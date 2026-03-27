import { createRootRoute, Outlet, HeadContent, Scripts } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import '../styles/globals.css'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
      { title: 'shotdev — Screenshot any website' },
      { name: 'description', content: 'Production-ready screenshots with native browser frames. Built for developers, designers, and anyone who values pixel-perfect presentation.' },
      { name: 'theme-color', content: '#f2f2f7' },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
    ],
    links: [
      { rel: 'preload', as: 'font', type: 'font/otf', href: '/fonts/SFPRODISPLAYMEDIUM.OTF', crossOrigin: 'anonymous' },
      { rel: 'preload', as: 'font', type: 'font/otf', href: '/fonts/SFPRODISPLAYBOLD.OTF', crossOrigin: 'anonymous' },
      { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
    ],
  }),
  component: RootComponent,
})

function RootComponent() {
  return (
    <RootDocument>
      <ErrorBoundary>
        <Outlet />
      </ErrorBoundary>
    </RootDocument>
  )
}

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
