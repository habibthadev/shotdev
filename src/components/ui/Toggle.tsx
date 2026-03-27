type ToggleProps = {
  checked: boolean
  onChange: (checked: boolean) => void
}

export function Toggle({ checked, onChange }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`
        relative w-[46px] h-7 rounded-full transition-colors duration-200
        ${checked ? 'bg-[var(--color-system-blue)]' : 'bg-[var(--color-fill-primary)]'}
      `}
    >
      <div
        className={`
          absolute top-[3px] w-[22px] h-[22px] bg-white rounded-full shadow-sm
          transition-transform duration-200
          ${checked ? 'translate-x-[21px]' : 'translate-x-[3px]'}
        `}
      />
    </button>
  )
}
