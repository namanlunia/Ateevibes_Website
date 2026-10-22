import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RotateCcw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in component tree:', error, errorInfo);
  }

  public handleReload = () => {
    window.location.reload();
  };

  public handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-cream flex items-center justify-center p-6 text-ink-900 font-sans">
          <div className="max-w-md w-full bg-white rounded-3xl border border-border p-8 text-center space-y-6 shadow-xl">
            <div className="w-14 h-14 rounded-2xl bg-status-error/10 text-status-error flex items-center justify-center mx-auto">
              <AlertCircle className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h2 className="font-display text-2xl font-bold text-ink-900">
                Something went wrong
              </h2>
              <p className="text-xs sm:text-sm text-ink-600 leading-relaxed">
                An unexpected interface error occurred. You can reload the page or navigate back to the home page.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 bg-surface-tint rounded-xl text-left border border-border/80 text-[11px] text-ink-600 font-mono overflow-x-auto max-h-32">
                {this.state.error.message}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
              <button
                onClick={this.handleReload}
                className="btn-primary w-full sm:w-auto px-5 py-2.5 text-xs font-bold inline-flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reload Page</span>
              </button>
              <button
                onClick={this.handleGoHome}
                className="btn-secondary w-full sm:w-auto px-5 py-2.5 text-xs font-bold inline-flex items-center justify-center gap-1.5 bg-white"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Return to Home</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
