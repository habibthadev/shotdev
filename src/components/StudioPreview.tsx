import { useMemo } from 'react'
import { Camera, Globe } from '@phosphor-icons/react'
import { useScreenshotStore } from '@/store/screenshot.store'
import { SafariChrome } from '@/components/chrome/SafariChrome'
import { ChromeChrome } from '@/components/chrome/ChromeChrome'
import { FirefoxChrome } from '@/components/chrome/FirefoxChrome'
import { ArcChrome } from '@/components/chrome/ArcChrome'
import { MinimalChrome } from '@/components/chrome/MinimalChrome'

const chromeComponents = {
  safari: SafariChrome,
  chrome: ChromeChrome,
  firefox: FirefoxChrome,
  arc: ArcChrome,
  minimal: MinimalChrome,
}

export function StudioPreview() {
  const browserId = useScreenshotStore((s) => s.browserId)
  const url = useScreenshotStore((s) => s.url)
  const settings = useScreenshotStore((s) => s.settings)

  const ChromeComponent = chromeComponents[browserId]

  const placeholderContent = useMemo(() => (
    <PlaceholderContent url={url} isDark={settings.darkMode} />
  ), [url, settings.darkMode])

  const availableWidth = typeof window !== 'undefined' 
    ? Math.max(window.innerWidth - 400, 320)
    : settings.width

  const chromeProps = {
    url: url || 'https://example.com',
    isDark: settings.darkMode,
    optimisticContent: placeholderContent,
    width: Math.min(settings.width, availableWidth),
    height: settings.height,
  }

  return (
    <main className="flex-1 relative bg-[var(--color-background-secondary)] overflow-hidden">
      <div className="h-full flex flex-col items-center justify-center p-4 sm:p-6 lg:p-10 overflow-auto">
        <div className="relative w-full max-w-full flex items-center justify-center">
          <div className="animate-fade-in">
            <ChromeComponent {...chromeProps} />
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3 px-4 sm:px-5 py-3 bg-white/90 backdrop-blur-xl border border-[var(--color-separator)] rounded-full shadow-sm">
          <Camera size={18} weight="fill" className="text-[var(--color-system-blue)]" />
          <span className="text-[13px] sm:text-[14px] font-medium text-[var(--color-label-primary)] text-center">
            <span className="hidden sm:inline">Enter a URL and capture to see your screenshot</span>
            <span className="sm:hidden">Enter URL to capture</span>
          </span>
        </div>
      </div>
    </main>
  )
}

function PlaceholderContent({ url, isDark }: { url: string; isDark: boolean }) {
  const hasUrl = url && url.length > 0

  if (!hasUrl) {
    return (
      <div className={`w-full h-full flex flex-col items-center justify-center p-6 ${isDark ? 'bg-[#1c1c1e]' : 'bg-[#f5f5f7]'}`}>
        <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl ${isDark ? 'bg-[#2c2c2e]' : 'bg-white'} shadow-lg flex items-center justify-center`}>
          <Globe size={32} weight="duotone" className={isDark ? 'text-[#8e8e93]' : 'text-[#86868b]'} />
        </div>
        <p className={`mt-4 text-[14px] sm:text-[15px] font-medium ${isDark ? 'text-white/80' : 'text-[var(--color-label-primary)]'} text-center px-4`}>
          Enter a URL to get started
        </p>
        <p className={`mt-1 text-[12px] sm:text-[13px] ${isDark ? 'text-[#8e8e93]' : 'text-[var(--color-label-secondary)]'} text-center px-4`}>
          Your preview will appear here
        </p>
      </div>
    )
  }

  const domain = (() => {
    try {
      return new URL(url).hostname
    } catch {
      return url
    }
  })()

  return (
    <div className={`w-full h-full ${isDark ? 'bg-[#1c1c1e]' : 'bg-[#fafafa]'}`}>
      <div className="p-4 sm:p-6">
        <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${isDark ? 'bg-white/10' : 'bg-black/5'} flex items-center justify-center flex-shrink-0`}>
            <Globe size={24} className={isDark ? 'text-white/40' : 'text-black/30'} />
          </div>
          <div className="flex-1 min-w-0">
            <div className={`h-3 sm:h-4 w-24 sm:w-32 ${isDark ? 'bg-white/10' : 'bg-black/5'} rounded`} />
            <div className={`h-2 sm:h-3 w-16 sm:w-24 ${isDark ? 'bg-white/5' : 'bg-black/[0.03]'} rounded mt-2`} />
          </div>
        </div>
        <div className={`h-24 sm:h-32 rounded-lg ${isDark ? 'bg-white/5' : 'bg-black/[0.03]'}`} />
        <div className="flex flex-col gap-2 sm:gap-3 mt-4 sm:mt-6">
          <div className={`h-2 sm:h-3 rounded ${isDark ? 'bg-white/10' : 'bg-black/5'} w-full`} />
          <div className={`h-2 sm:h-3 rounded ${isDark ? 'bg-white/10' : 'bg-black/5'} w-4/5`} />
          <div className={`h-2 sm:h-3 rounded ${isDark ? 'bg-white/10' : 'bg-black/5'} w-3/5`} />
        </div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className={`px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl ${isDark ? 'bg-white/10' : 'bg-black/5'} backdrop-blur-sm max-w-[90%]`}>
          <p className={`text-[13px] sm:text-[14px] font-medium ${isDark ? 'text-white/60' : 'text-black/40'} truncate`}>
            Preview: {domain}
          </p>
        </div>
      </div>
    </div>
  )
}
