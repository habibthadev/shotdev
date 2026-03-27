type Option = {
  value: string
  label: string
}

type SegmentedControlProps = {
  options: Option[]
  value: string
  onChange: (value: string) => void
}

export function SegmentedControl({ options, value, onChange }: SegmentedControlProps) {
  return (
    <div className="inline-flex bg-[var(--color-fill-secondary)] rounded-[var(--radius-sm)] p-0.5">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`
            px-3 py-1 text-[13px] font-medium rounded-[var(--radius-xs)] transition-all duration-150
            ${value === option.value
              ? 'bg-white text-[var(--color-label-primary)] shadow-[var(--shadow-sm)]'
              : 'text-[var(--color-label-secondary)] hover:text-[var(--color-label-primary)]'
            }
          `}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
