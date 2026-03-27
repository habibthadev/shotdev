import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { CaretDown, Check } from '@phosphor-icons/react'

type SelectOption = { value: string; label: string }

type SelectProps = {
  label?: string
  options: SelectOption[]
  value?: string
  onChange?: (value: string) => void
  className?: string
  placeholder?: string
}

export function Select({ label, options, value, onChange, className = '', placeholder = 'Select...' }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 })
  const buttonRef = useRef<HTMLButtonElement>(null)

  const selectedOption = options.find((o) => o.value === value)

  useEffect(() => {
    if (!isOpen) return

    function handleClickOutside(e: MouseEvent) {
      if (buttonRef.current && !buttonRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    function handleScroll() {
      setIsOpen(false)
    }
    
    setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('scroll', handleScroll, true)
    }, 0)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('scroll', handleScroll, true)
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setPosition({
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
      })
    }
  }, [isOpen])

  const handleSelect = (option: SelectOption) => {
    onChange?.(option.value)
    setIsOpen(false)
  }

  return (
    <div className={className}>
      {label && (
        <label className="block text-[13px] font-medium text-[var(--color-label-secondary)] mb-1.5">
          {label}
        </label>
      )}
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="
          w-full px-3 py-2 rounded-[var(--radius-sm)]
          bg-[var(--color-fill-secondary)]
          text-[var(--color-label-primary)] text-[14px] text-left
          border border-transparent
          focus:outline-none focus:bg-white focus:border-[var(--color-system-blue)]
          transition-all duration-150
          flex items-center justify-between gap-2
        "
      >
        <span className={!selectedOption ? 'text-[var(--color-label-tertiary)]' : ''}>
          {selectedOption?.label || placeholder}
        </span>
        <CaretDown 
          size={12} 
          weight="bold" 
          className={`text-[var(--color-label-tertiary)] transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed z-[9999] py-1 bg-white/95 backdrop-blur-xl border border-[var(--color-separator)] rounded-[var(--radius-md)] shadow-[var(--shadow-lg)] max-h-[240px] overflow-y-auto overscroll-contain"
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
            width: `${position.width}px`,
            animation: 'fadeIn 120ms cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option)}
              className={`
                w-full px-3 py-2 text-[14px] text-left
                flex items-center justify-between gap-2
                transition-colors duration-75
                ${option.value === value 
                  ? 'text-[var(--color-system-blue)] bg-[var(--color-system-blue)]/5' 
                  : 'text-[var(--color-label-primary)] hover:bg-[var(--color-fill-secondary)]'
                }
              `}
            >
              <span>{option.label}</span>
              {option.value === value && (
                <Check size={14} weight="bold" className="text-[var(--color-system-blue)]" />
              )}
            </button>
          ))}
        </div>,
        document.body
      )}
    </div>
  )
}
