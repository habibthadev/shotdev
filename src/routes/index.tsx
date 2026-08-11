import { createFileRoute, Link } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import {
  ArrowRight,
  Camera,
  CaretDown,
  DownloadSimple,
  GithubLogo,
  Lightning,
  LinkSimple,
  Palette,
} from '@phosphor-icons/react'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

const WALLPAPERS = ['sonoma', 'ventura', 'tahoe', 'sequoai', 'whitesur']

function useReveal() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible')
            io.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return ref
}

function Reveal({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const ref = useReveal()
  return (
    <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}

function useClock() {
  const [time, setTime] = useState('')
  useEffect(() => {
    const fmt = () =>
      new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    setTime(fmt())
    const id = setInterval(() => setTime(fmt()), 30_000)
    return () => clearInterval(id)
  }, [])
  return time
}

function LandingPage() {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-[var(--color-background-primary)]">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[640px]"
        style={{
          background:
            'radial-gradient(70% 90% at 50% 0%, rgba(0,122,255,0.09) 0%, rgba(88,86,214,0.06) 45%, transparent 100%)',
        }}
      />
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[900px] -translate-x-1/2 opacity-60"
        style={{
          background:
            'radial-gradient(50% 50% at 50% 50%, rgba(0,122,255,0.07) 0%, transparent 70%)',
        }}
      />

      <nav className="animate-fade-down relative mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-[var(--color-system-blue)] shadow-[0_2px_8px_rgba(0,122,255,0.35)]">
            <Camera size={17} weight="fill" className="text-white" />
          </div>
          <span className="text-[17px] font-bold tracking-tight">shotdev</span>
        </Link>
        <div className="flex items-center gap-2">
          <a
            href="https://github.com/habibthadev/shotdev"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View source on GitHub"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-label-secondary)] transition-colors hover:bg-[var(--color-fill-secondary)] hover:text-[var(--color-label-primary)]"
          >
            <GithubLogo size={18} weight="fill" />
          </a>
          <Link
            to="/studio"
            className="rounded-[9px] bg-[var(--color-label-primary)] px-4 py-1.5 text-[13px] font-semibold text-white transition-opacity hover:opacity-85"
          >
            Open Studio
          </Link>
        </div>
      </nav>

      <main className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <section className="pt-14 pb-8 text-center sm:pt-20">
          <div
            className="animate-fade-down inline-flex items-center gap-2 rounded-full border border-[var(--color-separator)] bg-white/70 px-3.5 py-1.5 text-[12px] font-medium text-[var(--color-label-secondary)] shadow-[0_1px_4px_rgba(0,0,0,0.05)] backdrop-blur"
            style={{ animationDelay: '80ms' }}
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--color-system-green)]" />
            Free, no sign-up required
          </div>
          <h1
            className="animate-fade-down mx-auto mt-6 max-w-3xl text-[42px] leading-[1.02] font-bold tracking-tight sm:text-[64px]"
            style={{ animationDelay: '140ms' }}
          >
            Website screenshots,
            <br />
            <span className="font-light italic text-[var(--color-label-primary)]">
              in a macOS frame.
            </span>
          </h1>
          <p
            className="animate-fade-down mx-auto mt-5 max-w-xl text-[16px] leading-relaxed text-[var(--color-label-secondary)] sm:text-[17px]"
            style={{ animationDelay: '200ms' }}
          >
            Drop a link, pick a wallpaper, and get a pixel-perfect macOS desktop scene —
            menu bar, browser frame, and dock — ready to save to your device.
          </p>
          <div
            className="animate-fade-down mt-8 flex items-center justify-center gap-3"
            style={{ animationDelay: '260ms' }}
          >
            <Link
              to="/studio"
              className="group inline-flex items-center gap-2 rounded-xl bg-[var(--color-label-primary)] px-6 py-3 text-[15px] font-semibold text-white shadow-[0_2px_12px_rgba(0,0,0,0.16)] transition-all hover:opacity-90"
            >
              <span>Start creating</span>
              <ArrowRight
                size={17}
                weight="bold"
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
            <a
              href="https://github.com/habibthadev/shotdev"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-separator)] bg-white px-6 py-3 text-[15px] font-medium text-[var(--color-label-primary)] transition-colors hover:bg-[var(--color-fill-secondary)]"
            >
              <GithubLogo size={17} weight="fill" />
              <span>View on GitHub</span>
            </a>
          </div>
          <div
            className="animate-fade-down mt-9 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[12px] font-medium text-[var(--color-label-tertiary)]"
            style={{ animationDelay: '320ms' }}
          >
            <span>5 wallpapers</span>
            <span className="h-1 w-1 rounded-full bg-[var(--color-separator)]" />
            <span>5 browser frames</span>
            <span className="h-1 w-1 rounded-full bg-[var(--color-separator)]" />
            <span>PNG · JPEG · WebP</span>
            <span className="h-1 w-1 rounded-full bg-[var(--color-separator)]" />
            <span>Dark mode</span>
          </div>
        </section>

        <section className="animate-window-open relative pb-14 sm:pb-20">
          <SceneMockup />
        </section>

        <Reveal className="pb-16 sm:pb-20">
          <SectionHeading
            eyebrow="How it works"
            title="Three steps to a beautiful shot"
            subtitle="No accounts, no queues. Just paste, style, and save."
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StepCard
              icon={<LinkSimple size={20} weight="duotone" />}
              number="01"
              title="Drop a link"
              description="Paste or drag in any URL. A headless Chrome engine captures it instantly."
            />
            <StepCard
              icon={<Palette size={20} weight="duotone" />}
              number="02"
              title="Pick your theme"
              description="Choose a wallpaper and dark mode, then pick the frame — Safari to Arc."
            />
            <StepCard
              icon={<DownloadSimple size={20} weight="duotone" />}
              number="03"
              title="Save the shot"
              description="The full macOS desktop scene exports as PNG, JPEG, or WebP to your device."
            />
          </div>
        </Reveal>

        <Reveal className="pb-16 sm:pb-20">
          <SectionHeading
            eyebrow="Features"
            title="Everything for the perfect frame"
            subtitle="Engineered to look native — because the details are the design."
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <FeatureCard
              icon={<Lightning size={24} weight="duotone" />}
              title="Instant capture"
              description="Headless Chrome renders any site in milliseconds — no sign-up, no queue."
            />
            <FeatureCard
              icon={<DesktopIcon />}
              title="Native frames"
              description="Browser chrome that matches macOS design down to every shadow."
            />
            <FeatureCard
              icon={<Camera size={24} weight="duotone" />}
              title="Full control"
              description="Viewport, wallpaper, dark mode, full page, delay, and export format."
            />
          </div>
        </Reveal>

        <Reveal className="pb-16 sm:pb-20">
          <SectionHeading
            eyebrow="Gallery"
            title="Shot on shotdev"
            subtitle="Every wallpaper, framed exactly as it leaves the studio."
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <MiniScene wallpaper="tahoe" label="Tahoe · Chrome" />
            <MiniScene wallpaper="sequoai" label="Sequoia · Safari" />
            <MiniScene wallpaper="ventura" label="Ventura · Firefox" />
          </div>
        </Reveal>

        <Reveal className="mx-auto max-w-2xl pb-16 sm:pb-20">
          <SectionHeading
            eyebrow="FAQ"
            title="Questions, answered"
            subtitle="Everything else lives on GitHub."
          />
          <Faq />
        </Reveal>

        <Reveal className="pb-20 sm:pb-28">
          <div className="relative overflow-hidden rounded-[24px] bg-[var(--color-label-primary)] px-6 py-14 text-center sm:px-12">
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'radial-gradient(60% 90% at 50% 0%, rgba(0,122,255,0.28) 0%, transparent 70%)',
              }}
            />
            <div className="relative">
              <h2 className="text-[26px] font-bold tracking-tight text-white sm:text-[34px]">
                Ready to frame your site?
              </h2>
              <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-white/60">
                Paste a link in the studio and get a macOS desktop scene worth posting in seconds.
              </p>
              <Link
                to="/studio"
                className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-[var(--color-system-blue)] px-7 py-3 text-[15px] font-semibold text-white shadow-[0_4px_20px_rgba(0,122,255,0.45)] transition-all hover:bg-[var(--color-system-blue-hover)]"
              >
                <span>Open the Studio</span>
                <ArrowRight
                  size={17}
                  weight="bold"
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </Link>
            </div>
          </div>
        </Reveal>
      </main>

      <footer className="relative border-t border-[var(--color-separator)]">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-6 text-[12px] text-[var(--color-label-tertiary)] sm:flex-row sm:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded-[6px] bg-[var(--color-system-blue)]">
              <Camera size={10} weight="fill" className="text-white" />
            </div>
            <span className="font-semibold text-[var(--color-label-secondary)]">shotdev</span>
            <span>© 2026</span>
          </div>
          <div className="flex items-center gap-5">
            <Link
              to="/studio"
              className="transition-colors hover:text-[var(--color-label-secondary)]"
            >
              Studio
            </Link>
            <a
              href="https://github.com/habibthadev/shotdev"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 transition-colors hover:text-[var(--color-label-secondary)]"
            >
              <GithubLogo size={13} weight="fill" />
              <span>Source</span>
            </a>
            <span className="hidden sm:inline">by habibthadev</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string
  title: string
  subtitle: string
}) {
  return (
    <div className="mb-8 text-center sm:mb-10">
      <span className="text-[12px] font-semibold tracking-[0.08em] text-[var(--color-system-blue)] uppercase">
        {eyebrow}
      </span>
      <h2 className="mt-2 text-[26px] font-bold tracking-tight text-[var(--color-label-primary)] sm:text-[32px]">
        {title}
      </h2>
      <p className="mx-auto mt-2 max-w-md text-[14px] text-[var(--color-label-secondary)] sm:text-[15px]">
        {subtitle}
      </p>
    </div>
  )
}

function DesktopIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="2.5" y="4" width="19" height="13" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M9 20.5h6M12 17v3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function StepCard({
  icon,
  number,
  title,
  description,
}: {
  icon: React.ReactNode
  number: string
  title: string
  description: string
}) {
  return (
    <div className="group rounded-2xl border border-[var(--color-separator)] bg-white p-6 text-left shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.09)]">
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-gradient-to-b from-[var(--color-fill-secondary)] to-[var(--color-fill-tertiary)] text-[var(--color-system-blue)] transition-transform duration-200 group-hover:scale-110">
          {icon}
        </div>
        <span className="text-[20px] font-light italic text-[var(--color-label-tertiary)] transition-colors duration-200 group-hover:text-[var(--color-system-blue)]/60">
          {number}
        </span>
      </div>
      <h3 className="mt-4 text-[15px] font-semibold text-[var(--color-label-primary)]">{title}</h3>
      <p className="mt-1 text-[13px] leading-relaxed text-[var(--color-label-secondary)]">
        {description}
      </p>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="group rounded-2xl border border-[var(--color-separator)] bg-white p-6 text-left shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.09)]">
      <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-gradient-to-b from-[var(--color-fill-secondary)] to-[var(--color-fill-tertiary)] text-[var(--color-system-blue)] transition-transform duration-200 group-hover:scale-110">
        {icon}
      </div>
      <h3 className="mt-3 text-[15px] font-semibold text-[var(--color-label-primary)]">{title}</h3>
      <p className="mt-1 text-[13px] leading-relaxed text-[var(--color-label-secondary)]">
        {description}
      </p>
    </div>
  )
}

function Faq() {
  const items: Array<{ q: string; a: string }> = [
    {
      q: 'Is shotdev free?',
      a: 'Yes — completely. No sign-up, no watermark, no rate limits. The entire project is open source on GitHub.',
    },
    {
      q: 'How is the screenshot taken?',
      a: 'A headless Chrome instance loads the page at your chosen viewport, waits for fonts and layout to settle, and captures it server-side.',
    },
    {
      q: 'Does dark mode work?',
      a: 'Dark Mode switches the wallpaper to its dark variant and respects the site’s own prefers-color-scheme, so the whole scene feels consistent.',
    },
    {
      q: 'Which formats can I export?',
      a: 'PNG for lossless quality, JPEG for small file sizes, and WebP for the best of both. Full-page and delay controls are included.',
    },
  ]
  return (
    <div className="flex flex-col gap-2.5">
      {items.map((item) => (
        <details
          key={item.q}
          className="group rounded-2xl border border-[var(--color-separator)] bg-white px-5 py-4 shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-shadow duration-200 open:shadow-[0_8px_24px_rgba(0,0,0,0.07)]"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[14px] font-semibold text-[var(--color-label-primary)] sm:text-[15px]">
            {item.q}
            <CaretDown
              size={15}
              weight="bold"
              className="flex-shrink-0 text-[var(--color-label-tertiary)] transition-transform duration-200 group-open:rotate-180"
            />
          </summary>
          <p className="mt-2.5 text-[13px] leading-relaxed text-[var(--color-label-secondary)] sm:text-[14px]">
            {item.a}
          </p>
        </details>
      ))}
    </div>
  )
}

function SceneMockup() {
  const [index, setIndex] = useState(0)
  const [loaded, setLoaded] = useState<boolean[]>(Array(WALLPAPERS.length).fill(false))
  const time = useClock()

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % WALLPAPERS.length), 4000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="mx-auto max-w-3xl">
      <div className="relative overflow-hidden rounded-[20px] shadow-[0_24px_64px_rgba(0,0,0,0.2),0_4px_16px_rgba(0,0,0,0.08)] ring-1 ring-black/10">
        <div className="relative aspect-[16/10] w-full select-none">
          {WALLPAPERS.map((wall, i) => (
            <img
              key={wall}
              src={`/wallpaper/${wall}-light.jpg`}
              alt=""
              draggable={false}
              onLoad={() => setLoaded((l) => l.map((v, j) => (j === i ? true : v)))}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
                i === index ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}
          {!loaded[index] && (
            <div className="absolute inset-0 animate-pulse bg-[var(--color-fill-secondary)]" />
          )}
        </div>

        <div className="absolute inset-x-0 top-0 flex h-7 items-center justify-between border-b border-white/60 bg-white/55 px-3 text-[11px] text-black/80 backdrop-blur-2xl select-none">
          <div className="flex items-center gap-1.5">
            <svg width="11" height="11" viewBox="0 0 24 24" className="fill-black/85" aria-hidden>
              <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.702" />
            </svg>
            <span className="font-semibold">Chrome</span>
          </div>
          <span className="font-medium tabular-nums">{time}</span>
        </div>

        <div className="absolute inset-x-0 bottom-0 flex justify-center pb-3">
          <div className="flex items-end gap-1.5 rounded-[18px] border border-white/60 bg-white/40 px-2.5 py-2 shadow-[0_8px_28px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.7)] backdrop-blur-2xl">
            {['#4DA6FF', 'linear-gradient(135deg,#4285F4,#34A853)', '#0A7DFF', '#3F9BFF', '#3FE58C', '#FFD60A', '#FF453A', '#FF9F0A', '#FC5C7D', '#2B2B2E'].map(
              (c, i) => (
                <span
                  key={i}
                  className="h-7 w-7 rounded-[7px] transition-transform duration-200 hover:-translate-y-1.5 sm:h-8 sm:w-8"
                  style={{ background: c }}
                />
              ),
            )}
            <span className="mx-1 h-7 w-px bg-black/10" />
            <span className="h-7 w-7 rounded-[7px] bg-white/75 sm:h-8 sm:w-8" />
          </div>
        </div>

        <div className="absolute top-9 left-1/2 w-[62%] -translate-x-1/2 overflow-hidden rounded-[10px] bg-white shadow-[0_12px_40px_rgba(0,0,0,0.35),0_2px_8px_rgba(0,0,0,0.15)] sm:top-12">
          <div className="flex h-8 items-center gap-1.5 border-b border-black/[0.06] bg-gradient-to-b from-[#e3e6e8] to-[#dadddf] px-2.5 sm:h-9">
            <span className="h-2.5 w-2.5 rounded-full border border-black/10 bg-[#FF5F57]" />
            <span className="h-2.5 w-2.5 rounded-full border border-black/10 bg-[#FFBD2E]" />
            <span className="h-2.5 w-2.5 rounded-full border border-black/10 bg-[#28CA42]" />
            <span className="ml-2 h-4 w-14 rounded-t-[7px] bg-white text-[9px] leading-4 text-[#5F6368] sm:w-20">
              &nbsp;
            </span>
            <span className="h-4 w-20 rounded-t-[7px] bg-white text-[9px] leading-4 text-[#202124] shadow-[0_-1px_0_rgba(0,0,0,0.05)] sm:w-28">
              &nbsp;
            </span>
          </div>
          <div className="flex h-9 items-center gap-1 bg-[#dee1e6] px-2 sm:h-10">
            <span className="flex flex-1 justify-center">
              <span className="flex h-5 w-full max-w-[200px] items-center gap-1.5 rounded-full bg-white px-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.18)] sm:h-6">
                <span className="h-2 w-2 rounded-full bg-[#5F6368]/40" />
                <span className="h-1.5 w-16 rounded-full bg-black/15 sm:w-24" />
              </span>
            </span>
            <span className="h-4 w-4 rounded-full bg-gradient-to-br from-[#4285F4] to-[#9B72CB]" />
          </div>
          <div className="flex h-14 flex-col justify-center gap-1.5 p-3 sm:h-16 sm:gap-2 sm:p-4">
            <div className="h-2.5 w-1/3 rounded bg-black/[0.07] sm:h-3" />
            <div className="h-2.5 w-2/3 rounded bg-black/[0.05] sm:h-3" />
            <div className="h-2 w-full rounded bg-black/[0.04] sm:h-2.5" />
            <div className="h-2 w-4/5 rounded bg-black/[0.04] sm:h-2.5" />
          </div>
        </div>
      </div>
      <p className="mt-4 text-center text-[13px] text-[var(--color-label-tertiary)]">
        A full macOS desktop scene, exported and saved to your device in seconds.
      </p>
    </div>
  )
}

function MiniScene({ wallpaper, label }: { wallpaper: string; label: string }) {
  const time = useClock()
  return (
    <div className="group overflow-hidden rounded-2xl border border-[var(--color-separator)] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.12)]">
      <div className="relative aspect-[16/10] overflow-hidden select-none">
        <img
          src={`/wallpaper/${wallpaper}-light.jpg`}
          alt={`${label} scene`}
          draggable={false}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-x-0 top-0 flex h-6 items-center justify-between border-b border-white/50 bg-white/45 px-2.5 text-[10px] text-black/80 backdrop-blur-xl">
          <span className="flex items-center gap-1 font-semibold">
            <svg width="9" height="9" viewBox="0 0 24 24" className="fill-black/85" aria-hidden>
              <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09z" />
            </svg>
            Safari
          </span>
          <span className="font-medium tabular-nums">{time}</span>
        </div>
        <div className="absolute top-7 left-1/2 w-[52%] -translate-x-1/2 overflow-hidden rounded-md bg-white shadow-[0_8px_24px_rgba(0,0,0,0.3)]">
          <div className="flex h-5 items-center gap-1 border-b border-black/[0.05] bg-gradient-to-b from-[#e3e6e8] to-[#dadddf] px-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#FF5F57]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#FFBD2E]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#28CA42]" />
            <span className="ml-1 h-2.5 w-10 rounded-[3px] bg-white" />
          </div>
          <div className="flex h-4 items-center justify-center bg-[#dee1e6]">
            <span className="h-2.5 w-16 rounded-full bg-white shadow-[0_1px_1px_rgba(0,0,0,0.15)]" />
          </div>
          <div className="flex h-8 flex-col justify-center gap-1 p-1.5">
            <span className="h-1 w-8 rounded bg-black/[0.07]" />
            <span className="h-1 w-12 rounded bg-black/[0.05]" />
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 flex justify-center pb-1.5">
          <div className="flex items-end gap-1 rounded-full border border-white/50 bg-white/35 px-1.5 py-1 backdrop-blur-xl">
            {['#4DA6FF', '#34C759', '#FF9F0A', '#FF453A', '#2B2B2E'].map((c, i) => (
              <span key={i} className="h-4 w-4 rounded-[4px]" style={{ background: c }} />
            ))}
          </div>
        </div>
      </div>
      <p className="border-t border-[var(--color-separator)] px-4 py-2.5 text-[12px] font-medium text-[var(--color-label-secondary)]">
        {label}
      </p>
    </div>
  )
}
