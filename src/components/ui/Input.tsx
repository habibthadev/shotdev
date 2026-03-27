import type { InputHTMLAttributes } from 'react'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  error?: string
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-[13px] font-medium text-[var(--color-label-secondary)]">
          {label}
        </label>
      )}
      <input
        className={`
          w-full px-3.5 py-2.5 rounded-[var(--radius-sm)]
          bg-[var(--color-fill-secondary)]
          text-[var(--color-label-primary)] text-[15px]
          placeholder:text-[var(--color-label-tertiary)]
          border border-transparent
          focus:outline-none focus:bg-white focus:border-[var(--color-system-blue)] focus:ring-2 focus:ring-[var(--color-system-blue)]/10
          transition-all duration-150
          ${error ? 'border-[var(--color-system-red)] bg-[var(--color-system-red)]/5' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <span className="text-[12px] text-[var(--color-system-red)]">{error}</span>
      )}
    </div>
  )
}
