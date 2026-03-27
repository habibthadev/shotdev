import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight, Camera, Lightning, Desktop, Palette, GithubLogo } from '@phosphor-icons/react'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-[var(--color-separator)] safe-area-inset">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-14 sm:h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[var(--color-system-blue)] flex items-center justify-center">
                <Camera size={20} weight="fill" className="text-white" />
              </div>
              <span className="text-[17px] sm:text-[20px] font-bold tracking-tight">shotdev</span>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/habibthadev/shotdev"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 text-[var(--color-label-secondary)] hover:text-[var(--color-label-primary)] hover:bg-[var(--color-fill-secondary)] rounded-lg transition-colors"
              >
                <GithubLogo size={22} weight="fill" />
              </a>
              <Link
                to="/studio"
                className="px-4 sm:px-5 py-2 sm:py-2.5 text-[14px] sm:text-[15px] font-semibold text-white bg-[var(--color-system-blue)] hover:bg-[var(--color-system-blue-hover)] rounded-[10px] transition-colors"
              >
                Try it
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main>
        <section className="relative overflow-hidden border-b border-[var(--color-separator)] bg-gradient-to-b from-white to-[var(--color-background-secondary)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 md:pt-32 lg:pt-36 pb-14 sm:pb-18 lg:pb-20">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[var(--color-fill-secondary)] border border-[var(--color-separator)] rounded-full mb-6">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-system-green)] animate-pulse" />
                <span className="text-[13px] font-medium text-[var(--color-label-secondary)]">Free, no sign-up required</span>
              </div>
              
              <h1 className="text-[48px] sm:text-[64px] md:text-[72px] lg:text-[88px] font-bold tracking-tight leading-[0.92] text-[var(--color-label-primary)]">
                Screenshot
                <br />
                <span className="italic font-light">any website.</span>
              </h1>
              
              <p className="mt-6 text-[17px] sm:text-[19px] text-[var(--color-label-secondary)] leading-relaxed max-w-xl">
                Production-ready screenshots with native browser frames. Built for developers, designers, and anyone who values pixel-perfect presentation.
              </p>
              
              <div className="mt-8 sm:mt-10">
                <Link
                  to="/studio"
                  className="group inline-flex items-center gap-2.5 sm:gap-3 px-6 sm:px-7 py-3.5 sm:py-4 bg-[var(--color-label-primary)] text-white text-[15px] sm:text-[17px] font-semibold rounded-[12px] sm:rounded-[14px] hover:opacity-90 shadow-[0_2px_12px_rgba(0,0,0,0.12)] transition-all"
                >
                  <span>Start creating</span>
                  <ArrowRight size={18} weight="bold" className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-14 sm:py-18 lg:py-22 border-b border-[var(--color-separator)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
              <div>
                <h2 className="text-[36px] sm:text-[44px] font-bold tracking-tight text-[var(--color-label-primary)]">
                  Three steps.
                  <br />
                  Endless possibilities.
                </h2>
                <div className="mt-10 space-y-8">
                  <Step
                    number="01"
                    title="Enter URL"
                    description="Paste any website URL. Our Playwright engine captures it perfectly."
                  />
                  <Step
                    number="02"
                    title="Choose frame"
                    description="Safari, Chrome, Firefox, Arc, or minimal. All pixel-perfect."
                  />
                  <Step
                    number="03"
                    title="Export"
                    description="PNG, JPEG, or WebP. Download instantly or copy to clipboard."
                  />
                </div>
              </div>
              
              <div className="relative">
                <div className="aspect-[4/3] bg-[var(--color-background-secondary)] border border-[var(--color-separator)] rounded-[20px] overflow-hidden shadow-[var(--shadow-window)]">
                  <div className="h-full flex items-center justify-center p-8">
                    <MockBrowser />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-14 sm:py-18 lg:py-22">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 sm:mb-12">
              <h2 className="text-[28px] sm:text-[36px] md:text-[40px] font-bold tracking-tight text-[var(--color-label-primary)]">
                Features that matter.
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              <FeatureCard
                icon={<Lightning size={28} weight="duotone" />}
                title="Instant capture"
                description="Playwright-powered engine captures any website in milliseconds with perfect rendering."
              />
              <FeatureCard
                icon={<Desktop size={28} weight="duotone" />}
                title="Native frames"
                description="Browser chrome that matches macOS design down to every shadow and radius."
              />
              <FeatureCard
                icon={<Palette size={28} weight="duotone" />}
                title="Full control"
                description="Viewport size, dark mode, full page, delay, and export format. All customizable."
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="py-6 sm:py-8 border-t border-[var(--color-separator)] bg-[var(--color-background-secondary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Camera size={16} weight="fill" className="text-[var(--color-label-tertiary)]" />
                <span className="text-[13px] text-[var(--color-label-tertiary)] font-medium">shotdev</span>
              </div>
              <div className="h-4 w-px bg-[var(--color-separator)]" />
              <a
                href="https://habibthadev.tech"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[13px] text-[var(--color-label-secondary)] hover:text-[var(--color-label-primary)] transition-colors"
              >
                by <span className="font-medium">habibthadev</span>
              </a>
            </div>
            <a
              href="https://github.com/habibthadev/shotdev"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[13px] text-[var(--color-label-secondary)] hover:text-[var(--color-label-primary)] transition-colors"
            >
              <GithubLogo size={16} weight="fill" />
              <span>View source</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

function Step({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[var(--color-fill-secondary)] border border-[var(--color-separator)] flex items-center justify-center">
        <span className="text-[13px] font-bold text-[var(--color-label-secondary)]">{number}</span>
      </div>
      <div className="flex-1 pt-0.5">
        <h3 className="text-[17px] font-semibold text-[var(--color-label-primary)]">{title}</h3>
        <p className="mt-1 text-[15px] text-[var(--color-label-secondary)] leading-relaxed">{description}</p>
      </div>
    </div>
  )
}

function FeatureCard({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode
  title: string
  description: string 
}) {
  return (
    <div className="p-5 sm:p-6 bg-[var(--color-background-secondary)] border border-[var(--color-separator)] rounded-[14px] sm:rounded-[16px] hover:border-[var(--color-label-tertiary)] transition-colors">
      <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-[11px] sm:rounded-[12px] bg-white border border-[var(--color-separator)] flex items-center justify-center text-[var(--color-system-blue)]">
        {icon}
      </div>
      <h3 className="mt-4 sm:mt-5 text-[16px] sm:text-[17px] font-semibold text-[var(--color-label-primary)]">
        {title}
      </h3>
      <p className="mt-1.5 sm:mt-2 text-[14px] sm:text-[15px] text-[var(--color-label-secondary)] leading-relaxed">
        {description}
      </p>
    </div>
  )
}

function MockBrowser() {
  return (
    <div className="w-full max-w-sm">
      <div className="bg-[#f6f6f6] rounded-t-[10px] border-b border-[var(--color-separator)]">
        <div className="flex items-center gap-2 px-4 py-3">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#28CA42]" />
          </div>
        </div>
      </div>
      <div className="bg-white rounded-b-[10px] p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-lg bg-[var(--color-system-blue)]" />
          <div className="flex-1">
            <div className="h-3 w-20 bg-[var(--color-fill-secondary)] rounded mb-2" />
            <div className="h-2 w-16 bg-[var(--color-fill-secondary)] rounded" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-2 w-full bg-[var(--color-fill-secondary)] rounded" />
          <div className="h-2 w-[85%] bg-[var(--color-fill-secondary)] rounded" />
          <div className="h-2 w-[70%] bg-[var(--color-fill-secondary)] rounded" />
        </div>
      </div>
    </div>
  )
}
