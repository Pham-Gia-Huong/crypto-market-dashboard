import { Component, type ErrorInfo, type ReactNode } from "react"

type Props = { children: ReactNode }

type State = { hasError: boolean; message?: string }

export class AppErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(err: Error): State {
    return { hasError: true, message: err.message }
  }

  componentDidCatch(err: Error, info: ErrorInfo): void {
    console.error("AppErrorBoundary:", err, info.componentStack)
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="bg-background text-foreground flex min-h-svh flex-col items-center justify-center gap-4 p-6">
          <h1 className="text-xl font-semibold">Something went wrong</h1>
          <p className="text-muted-foreground max-w-md text-center text-sm">
            {this.state.message ?? "Unexpected error. Please reload the page."}
          </p>
          <button
            type="button"
            className="bg-primary text-primary-foreground rounded-lg px-4 py-2 text-sm"
            onClick={() => window.location.reload()}
          >
            Reload
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
