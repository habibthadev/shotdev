import { createFileRoute, Link } from '@tanstack/react-router'
import { Camera, GithubLogo } from '@phosphor-icons/react'
import { StudioPanel } from '@/components/StudioPanel'
import { StudioPreview } from '@/components/StudioPreview'

export const Route = createFileRoute('/studio')({
  head: () => ({
    meta: [
      { title: 'Studio — shotdev' },
      { name: 'description', content: 'Paste any link, pick a wallpaper and browser frame, and capture a pixel-perfect macOS desktop scene in seconds.' },
      { property: 'og:title', content: 'Studio — shotdev' },
      { property: 'og:description', content: 'Paste any link, pick a wallpaper and browser frame, and capture a pixel-perfect macOS desktop scene in seconds.' },
      { property: 'og:image', content: '/og-studio.png' },
      { property: 'og:url', content: '/studio' },
      { name: 'twitter:title', content: 'Studio — shotdev' },
      { name: 'twitter:description', content: 'Paste any link, pick a wallpaper and browser frame, and capture a pixel-perfect macOS desktop scene in seconds.' },
    ],
    links: [{ rel: 'canonical', href: '/studio' }],
  }),
  component: StudioPage,
})

function StudioPage() {
  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-[var(--color-background-secondary)]">
      <header className="flex h-13 shrink-0 items-center justify-between border-b border-[var(--color-separator)] bg-[var(--color-background-primary)] px-4 sm:px-5">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-7.5 w-7.5 items-center justify-center rounded-[8px] bg-[var(--color-system-blue)]">
            <Camera size={15} weight="fill" className="text-white" />
          </div>
          <span className="text-[15px] font-bold tracking-tight">shotdev</span>
          <span className="rounded-md bg-[var(--color-fill-tertiary)] px-1.5 py-0.5 text-[11px] font-medium text-[var(--color-label-secondary)]">
            Studio
          </span>
        </Link>
        <a
          href="https://github.com/habibthadev/shotdev"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View source on GitHub"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-label-secondary)] transition-colors hover:bg-[var(--color-fill-secondary)] hover:text-[var(--color-label-primary)]"
        >
          <GithubLogo size={17} weight="fill" />
        </a>
      </header>

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain md:flex-row md:overflow-hidden">
        <StudioPanel />
        <StudioPreview />
      </div>
    </div>
  )
}
