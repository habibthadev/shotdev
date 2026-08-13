import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { useEffect, useState, useCallback } from 'react'
import { ArrowLeft, DownloadSimple, Copy, Check, Warning } from '@phosphor-icons/react'
import { useScreenshotStore } from '@/store/screenshot.store'
import { downloadImage, copyToClipboard } from '@/lib/download'

export const Route = createFileRoute('/preview')({
  head: () => ({
    meta: [
      { title: 'Preview — shotdev' },
      { name: 'description', content: 'Review and download your macOS desktop scene — exported as PNG, JPEG, or WebP.' },
      { property: 'og:title', content: 'Preview — shotdev' },
      { property: 'og:description', content: 'Review and download your macOS desktop scene — exported as PNG, JPEG, or WebP.' },
      { property: 'og:image', content: '/og-preview.png' },
      { property: 'og:url', content: '/preview' },
      { name: 'twitter:title', content: 'Preview — shotdev' },
      { name: 'twitter:description', content: 'Review and download your macOS desktop scene — exported as PNG, JPEG, or WebP.' },
    ],
    links: [{ rel: 'canonical', href: '/preview' }],
  }),
  component: PreviewPage,
})

function PreviewPage() {
  const navigate = useNavigate()
  const result = useScreenshotStore((s) => s.result)
  const status = useScreenshotStore((s) => s.status)
  const error = useScreenshotStore((s) => s.error)
  const format = useScreenshotStore((s) => s.settings.format)

  const [copySuccess, setCopySuccess] = useState(false)

  useEffect(() => {
    if (!result) {
      navigate({ to: '/studio', replace: true })
    }
  }, [result, navigate])

  const handleDownload = useCallback(() => {
    if (!result) return
    downloadImage(result, format)
  }, [result, format])

  const handleCopy = useCallback(async () => {
    if (!result) return
    try {
      await copyToClipboard(result)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch {}
  }, [result])

  if (!result) return null

  const isError = status === 'error'

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-[var(--color-background-secondary)]">
      <header className="flex h-13 shrink-0 items-center justify-between gap-3 border-b border-[var(--color-separator)] bg-[var(--color-background-primary)] px-4 sm:px-5">
        <Link
          to="/studio"
          className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[13px] font-medium text-[var(--color-label-primary)] transition-colors hover:bg-[var(--color-fill-secondary)] sm:text-[14px]"
        >
          <ArrowLeft size={16} weight="bold" className="text-[var(--color-system-blue)]" />
          <span>Back to Studio</span>
        </Link>

        <div className="flex items-center gap-2">
          {!isError && (
            <>
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--color-separator)] bg-white px-3 py-1.5 text-[13px] font-medium text-[var(--color-label-primary)] transition-colors hover:bg-[var(--color-fill-secondary)] sm:text-[14px]"
              >
                {copySuccess ? (
                  <Check size={16} weight="bold" className="text-[var(--color-system-green)]" />
                ) : (
                  <Copy size={16} weight="bold" />
                )}
                {copySuccess ? 'Copied' : 'Copy'}
              </button>
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-system-blue)] px-3.5 py-1.5 text-[13px] font-semibold text-white shadow-[0_2px_10px_rgba(0,122,255,0.35)] transition-colors hover:bg-[var(--color-system-blue-hover)] sm:px-4 sm:text-[14px]"
              >
                <DownloadSimple size={16} weight="bold" />
                <span className="hidden sm:inline">Save to device</span>
                <span className="sm:hidden">Save</span>
              </button>
            </>
          )}
        </div>
      </header>

      <main className="flex-1 overflow-auto">
        <div className="flex h-full flex-col items-center justify-center p-4 sm:p-6 lg:p-10">
          {isError ? (
            <div className="max-w-md rounded-2xl border border-[var(--color-separator)] bg-white px-8 py-6 text-center shadow-[0_16px_48px_rgba(0,0,0,0.08)]">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-system-red)]/10">
                <Warning size={24} weight="fill" className="text-[var(--color-system-red)]" />
              </div>
              <h2 className="mt-4 text-[19px] font-semibold text-[var(--color-label-primary)]">
                Generation Failed
              </h2>
              <p className="mt-2 text-[15px] leading-relaxed text-[var(--color-label-secondary)]">
                {error}
              </p>
              <Link
                to="/studio"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--color-system-blue)] px-5 py-2.5 text-[15px] font-medium text-white transition-colors hover:bg-[var(--color-system-blue-hover)]"
              >
                <ArrowLeft size={16} weight="bold" />
                Back to Studio
              </Link>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="mb-4 rounded-full border border-[var(--color-separator)] bg-white px-4 py-1.5 text-[12px] font-medium text-[var(--color-label-secondary)] shadow-sm">
                {result.width} × {result.height} · {format.toUpperCase()} ·{' '}
                {new URL(result.url).hostname}
              </div>
              <img
                src={`data:image/${result.format};base64,${result.image}`}
                alt={`Screenshot of ${result.url}`}
                draggable={false}
                className="max-h-[calc(100dvh-160px)] w-auto max-w-full rounded-xl border border-[var(--color-separator)] shadow-[0_24px_64px_rgba(0,0,0,0.16)] select-none"
              />
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
