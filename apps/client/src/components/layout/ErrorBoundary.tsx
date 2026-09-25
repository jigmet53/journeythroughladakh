import { Component, type ErrorInfo, type ReactNode } from 'react';

interface State {
  hasError: boolean;
}

/** Catches render-time crashes anywhere below it so one broken page shows a
 * recoverable message instead of a blank white screen (BRD.md §87). */
export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error('Unhandled render error:', error, info.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="font-display text-2xl font-semibold text-stone">Something went wrong</h1>
        <p className="mt-2 text-stone/60">
          This page hit an unexpected error. Try reloading — if it keeps happening, head back home.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={() => window.location.reload()}
            className="rounded-full bg-stone px-5 py-2 text-sm font-medium text-snow hover:bg-accent"
          >
            Reload
          </button>
          <a href="/" className="rounded-full border border-stone/20 px-5 py-2 text-sm text-stone/70">
            Go home
          </a>
        </div>
      </div>
    );
  }
}
