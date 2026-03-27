import { createFileRoute, Link } from '@tanstack/react-router'
import { House } from '@phosphor-icons/react'

export const Route = createFileRoute('/$splat')({
  component: NotFoundPage,
})

function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[var(--color-background-secondary)] flex items-center justify-center p-4 sm:p-6">
      <div className="text-center max-w-md">
        <div className="text-[120px] sm:text-[160px] font-bold text-[var(--color-label-tertiary)]/30 leading-none mb-6">
          404
        </div>
        
        <h1 className="text-[24px] sm:text-[32px] font-bold text-[var(--color-label-primary)] mb-3">
          Page Not Found
        </h1>
        
        <p className="text-[15px] sm:text-[17px] text-[var(--color-label-secondary)] mb-10 leading-relaxed px-4">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <Link
          to="/"
          className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-[14px] bg-[var(--color-system-blue)] text-white text-[15px] sm:text-[17px] font-semibold hover:bg-[var(--color-system-blue-hover)] shadow-sm transition-all"
        >
          <House size={20} weight="bold" />
          Go Home
        </Link>
      </div>
    </div>
  )
}
