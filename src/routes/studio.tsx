import { createFileRoute } from '@tanstack/react-router'
import { StudioPanel } from '@/components/StudioPanel'
import { StudioPreview } from '@/components/StudioPreview'

export const Route = createFileRoute('/studio')({
  component: StudioPage,
})

function StudioPage() {
  return (
    <div className="h-screen flex flex-col md:flex-row overflow-hidden bg-[var(--color-background-primary)]">
      <StudioPanel />
      <StudioPreview />
    </div>
  )
}
