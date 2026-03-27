import { useState, useCallback } from 'react'
import { useNavigate, Link } from '@tanstack/react-router'
import { ArrowLeft } from '@phosphor-icons/react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { BrowserSelector } from '@/components/BrowserSelector'
import { SettingsPanel } from '@/components/SettingsPanel'
import { useScreenshotStore } from '@/store/screenshot.store'
import { z } from 'zod'

export function StudioPanel() {
  const navigate = useNavigate()
  const url = useScreenshotStore((s) => s.url)
  const setUrl = useScreenshotStore((s) => s.setUrl)
  const reset = useScreenshotStore((s) => s.reset)

  const [urlError, setUrlError] = useState<string>('')

  const handleUrlChange = useCallback((value: string) => {
    setUrl(value)
    setUrlError('')
  }, [setUrl])

  const handleCapture = useCallback(() => {
    const urlSchema = z.string().url()
    const result = urlSchema.safeParse(url)
    
    if (!result.success) {
      setUrlError('Enter a valid URL (e.g., https://example.com)')
      return
    }

    reset()
    navigate({ to: '/preview', replace: false })
  }, [url, reset, navigate])

  return (
    <aside className="w-full md:w-[340px] lg:w-[360px] flex-shrink-0 bg-[var(--color-background-primary)] md:border-r border-b md:border-b-0 border-[var(--color-separator)] flex flex-col md:h-full overflow-y-auto">
      <header className="flex-shrink-0 px-4 sm:px-5 py-4 border-b border-[var(--color-separator)]">
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="flex items-center gap-1.5 text-[var(--color-label-secondary)] hover:text-[var(--color-label-primary)] transition-colors"
          >
            <ArrowLeft size={16} weight="bold" />
            <span className="text-[13px] font-medium">Home</span>
          </Link>
          <span className="text-[15px] font-semibold tracking-tight">shotdev</span>
        </div>
      </header>

      <div className="flex-1 px-4 sm:px-5 py-5">
        <div className="flex flex-col gap-6">
          <section>
            <label className="block text-[13px] font-medium text-[var(--color-label-secondary)] mb-2">
              Website URL
            </label>
            <Input
              type="text"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => handleUrlChange(e.target.value)}
              error={urlError}
            />
          </section>

          <section>
            <label className="block text-[13px] font-medium text-[var(--color-label-secondary)] mb-3">
              Browser Frame
            </label>
            <BrowserSelector />
          </section>

          <section>
            <SettingsPanel />
          </section>

          <section className="pt-4">
            <Button
              variant="primary"
              onClick={handleCapture}
              className="w-full"
            >
              Capture Screenshot
            </Button>
          </section>
        </div>
      </div>
    </aside>
  )
}
