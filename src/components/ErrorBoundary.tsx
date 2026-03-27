import { Component, type ReactNode, type ErrorInfo } from 'react'
import { Warning } from '@phosphor-icons/react'

interface Props {
  children: ReactNode
  fallback?: (error: Error, reset: () => void) => ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  reset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.reset)
      }

      return (
        <div className="min-h-screen bg-[var(--color-background-secondary)] flex items-center justify-center p-4">
          <div className="bg-white/95 backdrop-blur-xl px-8 py-6 rounded-2xl shadow-[var(--shadow-lg)] max-w-md text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-[var(--color-system-red)]/10 flex items-center justify-center">
              <Warning size={24} weight="fill" className="text-[var(--color-system-red)]" />
            </div>
            <h2 className="mt-4 text-[19px] font-semibold text-[var(--color-label-primary)]">
              Something went wrong
            </h2>
            <p className="mt-2 text-[15px] text-[var(--color-label-secondary)] leading-relaxed">
              {this.state.error.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={this.reset}
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--color-system-blue)] text-white text-[15px] font-medium rounded-lg hover:bg-[var(--color-system-blue-hover)] transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
