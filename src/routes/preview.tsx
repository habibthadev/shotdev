import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { useState, useEffect, useCallback } from 'react'
import { ArrowLeft, DownloadSimple, Copy, Check, ArrowsClockwise, Warning } from '@phosphor-icons/react'
import { useScreenshotStore } from '@/store/screenshot.store'
import { SafariChrome } from '@/components/chrome/SafariChrome'
import { ChromeChrome } from '@/components/chrome/ChromeChrome'
import { FirefoxChrome } from '@/components/chrome/FirefoxChrome'
import { ArcChrome } from '@/components/chrome/ArcChrome'
import { MinimalChrome } from '@/components/chrome/MinimalChrome'
import { downloadImage, copyToClipboard } from '@/lib/download'
import { takeScreenshot } from '@/server/screenshot'

const chromeComponents = {
  safari: SafariChrome,
  chrome: ChromeChrome,
  firefox: FirefoxChrome,
  arc: ArcChrome,
  minimal: MinimalChrome,
}

export const Route = createFileRoute('/preview')({
  component: PreviewPage,
})

function PreviewPage() {
  const navigate = useNavigate()
  const url = useScreenshotStore((s) => s.url)
  const browserId = useScreenshotStore((s) => s.browserId)
  const settings = useScreenshotStore((s) => s.settings)
  const result = useScreenshotStore((s) => s.result)
  const setResult = useScreenshotStore((s) => s.setResult)

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [error, setError] = useState<string>('')
  const [copySuccess, setCopySuccess] = useState(false)

  const ChromeComponent = chromeComponents[browserId]

  const captureScreenshot = useCallback(async () => {
    if (!url) {
      navigate({ to: '/studio' })
      return
    }

    setStatus('loading')
    setError('')

    try {
      const screenshot = await takeScreenshot({
        data: {
          url,
          width: settings.width,
          height: settings.height,
          format: settings.format,
          fullPage: settings.fullPage,
          darkMode: settings.darkMode,
          delay: settings.delay,
        },
      })
      setResult(screenshot)
      setStatus('success')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to capture screenshot')
      setStatus('error')
    }
  }, [url, settings, navigate, setResult])

  useEffect(() => {
    if (!url) {
      navigate({ to: '/studio', replace: true })
      return
    }
    if (!result) {
      captureScreenshot()
    } else {
      setStatus('success')
    }
  }, [url, navigate, result, captureScreenshot])

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

  const screenshotSrc = result ? `data:image/${result.format};base64,${result.image}` : undefined

  return (
    <div className="h-screen flex flex-col bg-[var(--color-background-secondary)]">
      <header className="flex-shrink-0 h-14 sm:h-16 flex items-center justify-between px-4 sm:px-6 bg-[var(--color-background-primary)] border-b border-[var(--color-separator)]">
        <Link
          to="/studio"
          className="flex items-center gap-2 text-[var(--color-system-blue)] text-[14px] sm:text-[15px] font-medium hover:opacity-80 transition-opacity"
        >
          <ArrowLeft size={18} weight="bold" />
          <span className="hidden sm:inline">Back to Studio</span>
          <span className="sm:hidden">Back</span>
        </Link>

        {status === 'success' && result && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 text-[13px] sm:text-[14px] font-medium text-[var(--color-label-primary)] bg-[var(--color-fill-secondary)] hover:bg-[var(--color-fill-tertiary)] rounded-lg transition-colors"
            >
              {copySuccess ? (
                <Check size={16} weight="bold" className="text-[var(--color-system-green)]" />
              ) : (
                <Copy size={16} weight="bold" />
              )}
              <span className="hidden sm:inline">{copySuccess ? 'Copied' : 'Copy'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 text-[13px] sm:text-[14px] font-medium text-white bg-[var(--color-system-blue)] hover:bg-[var(--color-system-blue-hover)] rounded-lg transition-colors"
            >
              <DownloadSimple size={16} weight="bold" />
              <span className="hidden sm:inline">Download</span>
            </button>
          </div>
        )}

        {status === 'error' && (
          <button
            onClick={captureScreenshot}
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 text-[13px] sm:text-[14px] font-medium text-[var(--color-system-blue)] hover:opacity-80 transition-opacity"
          >
            <ArrowsClockwise size={16} weight="bold" />
            <span>Retry</span>
          </button>
        )}
      </header>

      <main className="flex-1 relative overflow-hidden bg-[var(--color-background-secondary)]">
        <div className="h-full flex flex-col items-center justify-center p-4 sm:p-6 lg:p-10 overflow-auto">
          {status === 'loading' && (
            <SkeletonPreview
              width={settings.width}
              height={settings.height}
              browserId={browserId}
              url={url}
              isDark={settings.darkMode}
            />
          )}

          {status === 'success' && screenshotSrc && (
            <div className="animate-fade-in">
              <ChromeComponent
                url={url}
                isDark={settings.darkMode}
                screenshotSrc={screenshotSrc}
                width={settings.width}
                height={settings.height}
              />
            </div>
          )}

          {status === 'error' && (
            <div className="bg-white/95 backdrop-blur-xl px-8 py-6 rounded-2xl shadow-[var(--shadow-lg)] max-w-md text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-[var(--color-system-red)]/10 flex items-center justify-center">
                <Warning size={24} weight="fill" className="text-[var(--color-system-red)]" />
              </div>
              <h2 className="mt-4 text-[19px] font-semibold text-[var(--color-label-primary)]">Capture Failed</h2>
              <p className="mt-2 text-[15px] text-[var(--color-label-secondary)] leading-relaxed">{error}</p>
              <button
                onClick={captureScreenshot}
                className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--color-system-blue)] text-white text-[15px] font-medium rounded-lg hover:bg-[var(--color-system-blue-hover)] transition-colors"
              >
                <ArrowsClockwise size={16} weight="bold" />
                Try Again
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

function SkeletonPreview({
  width,
  height,
  browserId,
  url,
  isDark,
}: {
  width: number
  height: number
  browserId: string
  url: string
  isDark: boolean
}) {
  const toolbarBg = isDark ? 'bg-[#2d2d2d]' : 'bg-[#f6f6f6]'
  const contentBg = isDark ? 'bg-[#1e1e1e]' : 'bg-[#fafafa]'
  const shimmer = 'bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_1.5s_infinite]'

  return (
    <div className="window-chrome animate-pulse" style={{ width: `${width}px` }}>
      <div className={`${toolbarBg} border-b ${isDark ? 'border-white/10' : 'border-black/[0.06]'}`}>
        <div className="flex items-center gap-2 px-3.5 py-2.5">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
            <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
            <div className="w-3 h-3 rounded-full bg-[#28CA42]" />
          </div>
          {browserId !== 'minimal' && (
            <div className="flex-1 flex justify-center px-8">
              <div className={`flex items-center gap-2 px-4 py-1.5 rounded-md ${isDark ? 'bg-white/10' : 'bg-black/[0.04]'} min-w-[280px] max-w-[480px]`}>
                <div className={`w-3 h-3 rounded-full ${isDark ? 'bg-white/20' : 'bg-black/10'}`} />
                <span className={`text-[12px] ${isDark ? 'text-white/40' : 'text-black/30'} truncate`}>{url}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className={`${contentBg} relative overflow-hidden`} style={{ height: `${height}px` }}>
        <div className="absolute inset-0 flex flex-col p-6 gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-lg ${isDark ? 'bg-white/10' : 'bg-black/5'}`} />
            <div className="flex-1 flex flex-col gap-2">
              <div className={`h-3 rounded ${isDark ? 'bg-white/10' : 'bg-black/5'} w-1/3`} />
              <div className={`h-2 rounded ${isDark ? 'bg-white/5' : 'bg-black/[0.03]'} w-1/2`} />
            </div>
          </div>
          <div className={`h-32 rounded-lg ${isDark ? 'bg-white/5' : 'bg-black/[0.03]'}`} />
          <div className="flex flex-col gap-3">
            <div className={`h-3 rounded ${isDark ? 'bg-white/10' : 'bg-black/5'} w-full`} />
            <div className={`h-3 rounded ${isDark ? 'bg-white/10' : 'bg-black/5'} w-4/5`} />
            <div className={`h-3 rounded ${isDark ? 'bg-white/10' : 'bg-black/5'} w-3/5`} />
          </div>
          <div className="flex gap-3 mt-auto">
            <div className={`h-8 rounded-lg ${isDark ? 'bg-white/10' : 'bg-black/5'} w-24`} />
            <div className={`h-8 rounded-lg ${isDark ? 'bg-white/5' : 'bg-black/[0.03]'} w-20`} />
          </div>
        </div>
        <div className={`absolute inset-0 ${shimmer}`} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex items-center gap-3 px-5 py-3 bg-black/50 backdrop-blur-sm rounded-xl">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spinner" />
            <span className="text-[14px] font-medium text-white">Capturing...</span>
          </div>
        </div>
      </div>
    </div>
  )
}
