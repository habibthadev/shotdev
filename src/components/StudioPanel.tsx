import { useState, useCallback } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { ImageSquare } from '@phosphor-icons/react'
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
  const status = useScreenshotStore((s) => s.status)
  const result = useScreenshotStore((s) => s.result)
  const capture = useScreenshotStore((s) => s.capture)

  const [urlError, setUrlError] = useState<string>('')
  const [dragging, setDragging] = useState(false)

  const handleUrlChange = useCallback((value: string) => {
    setUrl(value)
    setUrlError('')
  }, [setUrl])

  const handleUrlDrop = useCallback((text: string) => {
    const candidate = text.trim().match(/https?:\/\/[^\s]+/i)?.[0] ?? text.trim()
    if (candidate) {
      setUrl(candidate)
      setUrlError('')
    }
  }, [setUrl])

  const handleGenerate = useCallback(async () => {
    const urlSchema = z.string().url()
    const parsed = urlSchema.safeParse(url)

    if (!parsed.success) {
      setUrlError('Enter a valid URL (e.g., https://example.com)')
      return
    }

    setUrlError('')
    await capture()
  }, [url, capture])

  const handleViewResult = useCallback(() => {
    navigate({ to: '/preview' })
  }, [navigate])

  const isGenerating = status === 'loading'

  return (
    <aside className="flex w-full flex-shrink-0 flex-col overflow-y-auto border-b border-[var(--color-separator)] bg-[var(--color-background-primary)] md:h-full md:w-[340px] md:border-b-0 md:border-r lg:w-[360px]">
      <div className="flex-1 px-4 py-5 sm:px-5">
        <div className="flex flex-col gap-6">
          <section
            onDragOver={(e) => {
              e.preventDefault()
              setDragging(true)
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault()
              setDragging(false)
              handleUrlDrop(e.dataTransfer.getData('text/plain'))
            }}
          >
            <label className="mb-2 block text-[13px] font-medium text-[var(--color-label-secondary)]">
              Drop a link
            </label>
            <Input
              type="text"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => handleUrlChange(e.target.value)}
              error={urlError}
              className={dragging ? 'ring-2 ring-[var(--color-system-blue)]' : undefined}
            />
            <p className="mt-1.5 text-[11px] text-[var(--color-label-tertiary)]">
              Paste a URL or drag it from another tab into the field.
            </p>
          </section>

          <section>
            <label className="mb-3 block text-[13px] font-medium text-[var(--color-label-secondary)]">
              Browser Frame
            </label>
            <BrowserSelector />
          </section>

          <section>
            <SettingsPanel />
          </section>

          <section className="flex flex-col gap-2.5 pt-4">
            <Button
              variant="primary"
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? 'Generating…' : 'Generate Screenshot'}
            </Button>
            {result && status === 'success' && (
              <button
                type="button"
                onClick={handleViewResult}
                className="flex w-full items-center justify-center gap-2 rounded-[var(--radius-sm)] border border-[var(--color-separator)] bg-white px-4 py-2.5 text-[14px] font-medium text-[var(--color-label-primary)] transition-colors hover:bg-[var(--color-fill-secondary)]"
              >
                <ImageSquare size={17} weight="bold" className="text-[var(--color-system-blue)]" />
                Open full size
              </button>
            )}
          </section>
        </div>
      </div>
    </aside>
  )
}
