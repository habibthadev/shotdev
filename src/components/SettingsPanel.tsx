import { Select } from '@/components/ui/Select'
import { Input } from '@/components/ui/Input'
import { Toggle } from '@/components/ui/Toggle'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import { useScreenshotStore, WALLPAPERS, wallpaperSrc } from '@/store/screenshot.store'
import type { ViewportPreset, ScreenshotFormat, WallpaperId } from '@/store/screenshot.store'

const presetOptions = [
  { value: '1280x800', label: '1280×800' },
  { value: '1440x900', label: '1440×900' },
  { value: '1920x1080', label: '1920×1080' },
  { value: '375x812', label: '375×812 (Mobile)' },
  { value: 'custom', label: 'Custom' },
]

const delayOptions = [
  { value: '0', label: 'None' },
  { value: '1000', label: '1s' },
  { value: '2000', label: '2s' },
  { value: '3000', label: '3s' },
  { value: '5000', label: '5s' },
]

const formatOptions = [
  { value: 'png', label: 'PNG' },
  { value: 'jpeg', label: 'JPEG' },
  { value: 'webp', label: 'WebP' },
]

export function SettingsPanel() {
  const settings = useScreenshotStore((s) => s.settings)
  const wallpaperId = useScreenshotStore((s) => s.wallpaperId)
  const updateSettings = useScreenshotStore((s) => s.updateSettings)
  const setWallpaper = useScreenshotStore((s) => s.setWallpaper)

  const handlePresetChange = (preset: string) => {
    const typedPreset = preset as ViewportPreset
    updateSettings({ preset: typedPreset })
    
    if (preset !== 'custom') {
      const [w, h] = preset.split('x').map(Number)
      updateSettings({ width: w, height: h })
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <label className="block text-[13px] font-medium text-[var(--color-label-secondary)] mb-2">
          Viewport Size
        </label>
        <Select
          options={presetOptions}
          value={settings.preset}
          onChange={handlePresetChange}
        />

        {settings.preset === 'custom' && (
          <div className="grid grid-cols-2 gap-2 mt-2">
            <Input
              type="number"
              placeholder="Width"
              value={settings.width}
              onChange={(e) => updateSettings({ width: Number(e.target.value) })}
            />
            <Input
              type="number"
              placeholder="Height"
              value={settings.height}
              onChange={(e) => updateSettings({ height: Number(e.target.value) })}
            />
          </div>
        )}
      </div>

      <div className="h-px bg-[var(--color-separator)]" />

      <div className="flex flex-col gap-4">
        <SettingRow label="Format">
          <SegmentedControl
            options={formatOptions}
            value={settings.format}
            onChange={(value) => updateSettings({ format: value as ScreenshotFormat })}
          />
        </SettingRow>

        <SettingRow label="Full Page">
          <Toggle
            checked={settings.fullPage}
            onChange={(checked) => updateSettings({ fullPage: checked })}
          />
        </SettingRow>

        <SettingRow label="Dark Mode">
          <Toggle
            checked={settings.darkMode}
            onChange={(checked) => updateSettings({ darkMode: checked })}
          />
        </SettingRow>

        <SettingRow label="Load Delay">
          <Select
            options={delayOptions}
            value={String(settings.delay)}
            onChange={(v) => updateSettings({ delay: Number(v) })}
            className="w-24"
          />
        </SettingRow>
      </div>

      <div className="h-px bg-[var(--color-separator)]" />

      <div>
        <div className="mb-2 flex items-baseline justify-between">
          <label className="block text-[13px] font-medium text-[var(--color-label-secondary)]">
            Desktop Wallpaper
          </label>
          <span className="text-[11px] text-[var(--color-label-tertiary)]">
            auto light/dark
          </span>
        </div>
        <div className="grid grid-cols-5 gap-1.5">
          {WALLPAPERS.map((w) => (
            <button
              key={w.id}
              type="button"
              onClick={() => setWallpaper(w.id as WallpaperId)}
              title={`${w.name}${settings.darkMode ? ' (dark)' : ' (light)'}`}
              className="group relative aspect-[16/10] overflow-hidden rounded-[7px] ring-1 ring-black/10 transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-system-blue)]"
            >
              <img
                src={wallpaperSrc(w.id as WallpaperId, settings.darkMode)}
                alt={w.name}
                draggable={false}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
              />
              <span
                className={`absolute inset-0 rounded-[7px] ring-2 transition-all duration-150 ${
                  wallpaperId === w.id
                    ? 'ring-[var(--color-system-blue)] ring-inset'
                    : 'ring-transparent group-hover:ring-black/20 group-hover:ring-inset'
                }`}
              />
              {wallpaperId === w.id && (
                <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-system-blue)] shadow-sm">
                  <svg width="8" height="8" viewBox="0 0 10 10" fill="none" aria-hidden>
                    <path d="M2 5.2 4.2 7.4 8 3" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              )}
            </button>
          ))}
        </div>
        <p className="mt-2 text-[11px] leading-relaxed text-[var(--color-label-tertiary)]">
          The macOS backdrop behind your shot. Dark Mode switches wallpaper variants automatically.
        </p>
      </div>
    </div>
  )
}

function SettingRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[14px] text-[var(--color-label-primary)]">{label}</span>
      {children}
    </div>
  )
}
