import { useState, useCallback } from 'react'
import {
  Camera,
  Globe,
  DownloadSimple,
  Copy,
  Check,
  Warning,
  ArrowsClockwise,
  ImageSquare,
} from '@phosphor-icons/react'
import { useScreenshotStore } from '@/store/screenshot.store'
import { downloadImage, copyToClipboard } from '@/lib/download'

export function StudioPreview() {
  const url = useScreenshotStore((s) => s.url)
  const settings = useScreenshotStore((s) => s.settings)
  const status = useScreenshotStore((s) => s.status)
  const result = useScreenshotStore((s) => s.result)
  const error = useScreenshotStore((s) => s.error)
  const capture = useScreenshotStore((s) => s.capture)

  const [copySuccess, setCopySuccess] = useState(false)

  const handleDownload = useCallback(() => {
    if (!result) return
    downloadImage(result, settings.format)
  }, [result, settings.format])

  const handleCopy = useCallback(async () => {
    if (!result) return
    try {
      await copyToClipboard(result)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch {}
  }, [result])

  const availableWidth =
    typeof window !== 'undefined' ? Math.max(window.innerWidth - 400, 320) : settings.width

  const sceneWidth = result ? Math.min(result.width, availableWidth) : 0
  const sceneHeight = result ? (result.height / result.width) * sceneWidth : 0

  return (
    <main className="relative min-h-0 flex-1 overflow-hidden min-h-[60dvh] md:min-h-0">
      <div className="flex h-full flex-col items-center justify-center overflow-auto p-4 sm:p-6 lg:p-10">
        {status === 'loading' && (
          <div className="animate-fade-in flex flex-col items-center gap-4">
            <div className="relative flex h-14 w-14 items-center justify-center">
              <span className="absolute inset-0 animate-ping rounded-full bg-[var(--color-system-blue)]/20" />
              <span className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-system-blue)] shadow-[0_8px_24px_rgba(0,122,255,0.35)]">
                <Camera size={26} weight="fill" className="animate-pulse text-white" />
              </span>
            </div>
            <div className="text-center">
              <p className="text-[15px] font-semibold text-[var(--color-label-primary)]">
                Rendering your scene…
              </p>
              <p className="mt-1 text-[13px] text-[var(--color-label-secondary)]">
                Loading the site, then framing it in macOS
              </p>
            </div>
          </div>
        )}

        {status === 'success' && result && (
          <div className="animate-fade-in flex flex-col items-center">
            <img
              src={`data:image/${result.format};base64,${result.image}`}
              alt={`Screenshot of ${result.url}`}
              draggable={false}
              style={{ width: `${sceneWidth}px`, height: `${sceneHeight}px` }}
              className="max-w-full rounded-xl border border-[var(--color-separator)] bg-white shadow-[0_24px_64px_rgba(0,0,0,0.18),0_4px_16px_rgba(0,0,0,0.08)] select-none"
            />
            <div className="mt-5 flex items-center gap-1 rounded-full border border-[var(--color-separator)] bg-white p-1.5 shadow-sm">
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 rounded-full px-3 py-1.5 text-[13px] font-medium text-[var(--color-label-primary)] transition-colors hover:bg-[var(--color-fill-secondary)] sm:px-3.5"
              >
                {copySuccess ? (
                  <Check size={16} weight="bold" className="text-[var(--color-system-green)]" />
                ) : (
                  <Copy size={16} weight="bold" />
                )}
                <span>{copySuccess ? 'Copied' : 'Copy'}</span>
              </button>
              <div className="h-5 w-px bg-[var(--color-separator)]" />
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 rounded-full bg-[var(--color-system-blue)] px-3.5 py-1.5 text-[13px] font-semibold text-white shadow-[0_2px_10px_rgba(0,122,255,0.35)] transition-colors hover:bg-[var(--color-system-blue-hover)] sm:px-4"
              >
                <DownloadSimple size={16} weight="bold" />
                <span>Save to device</span>
              </button>
            </div>
          </div>
        )}

        {status === 'error' && (
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
            <button
              onClick={() => capture()}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--color-system-blue)] px-5 py-2.5 text-[15px] font-medium text-white transition-colors hover:bg-[var(--color-system-blue-hover)]"
            >
              <ArrowsClockwise size={16} weight="bold" />
              Try Again
            </button>
          </div>
        )}

        {status === 'idle' && (
          <div className="animate-fade-in flex max-w-sm flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[var(--color-separator)] bg-white text-[var(--color-system-blue)] shadow-sm">
              <ImageSquare size={30} weight="duotone" />
            </div>
            <h2 className="mt-5 text-[17px] font-semibold text-[var(--color-label-primary)]">
              {url ? 'Ready to generate' : 'Drop a link to get started'}
            </h2>
            <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--color-label-secondary)]">
              {url
                ? `We'll capture ${(() => {
                    try {
                      return new URL(url).hostname
                    } catch {
                      return 'your link'
                    }
                  })()} and wrap it in a full macOS desktop scene.`
                : 'Paste a link on the left, pick your theme, then hit Generate.'}
            </p>
            {url && (
              <div className="mt-4 flex items-center gap-2 rounded-full border border-[var(--color-separator)] bg-white px-3.5 py-2 text-[12px] font-medium text-[var(--color-label-secondary)] shadow-sm">
                <Globe size={14} weight="fill" className="text-[var(--color-system-blue)]" />
                <span className="max-w-52 truncate">{url}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
