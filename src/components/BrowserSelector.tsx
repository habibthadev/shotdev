import type { BrowserChrome } from '@/store/screenshot.store'
import { useScreenshotStore } from '@/store/screenshot.store'

const browsers: { id: BrowserChrome; name: string }[] = [
  { id: 'safari', name: 'Safari' },
  { id: 'chrome', name: 'Chrome' },
  { id: 'firefox', name: 'Firefox' },
  { id: 'arc', name: 'Arc' },
  { id: 'minimal', name: 'Minimal' },
]

export function BrowserSelector() {
  const browserId = useScreenshotStore((s) => s.browserId)
  const setBrowser = useScreenshotStore((s) => s.setBrowser)

  return (
    <div className="flex flex-wrap gap-2">
      {browsers.map((browser) => (
        <button
          key={browser.id}
          type="button"
          onClick={() => setBrowser(browser.id)}
          className={`
            px-3.5 py-2 rounded-[var(--radius-sm)] text-[14px] font-medium transition-all duration-150
            ${browserId === browser.id
              ? 'bg-[var(--color-system-blue)] text-white'
              : 'bg-[var(--color-fill-secondary)] text-[var(--color-label-primary)] hover:bg-[var(--color-fill-tertiary)]'
            }
          `}
        >
          {browser.name}
        </button>
      ))}
    </div>
  )
}
