import type { ReactNode, ButtonHTMLAttributes } from 'react'

type ButtonVariant = 'primary' | 'secondary'
type ButtonSize = 'sm' | 'md'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  children: ReactNode
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-[var(--color-system-blue)] text-white hover:bg-[var(--color-system-blue-hover)] active:opacity-90',
  secondary: 'bg-[var(--color-fill-primary)] text-[var(--color-label-primary)] hover:bg-[var(--color-fill-tertiary)]',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3.5 py-2 text-[14px]',
  md: 'px-5 py-3 text-[15px]',
}

export function Button({ 
  variant = 'primary', 
  size = 'md',
  isLoading = false,
  children,
  className = '',
  disabled,
  ...props 
}: ButtonProps) {
  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2
        rounded-[var(--radius-sm)] font-medium
        transition-all duration-150 ease-out
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spinner" />
          <span>{children}</span>
        </>
      ) : (
        children
      )}
    </button>
  )
}
