import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AlertTriangle, Home as HomeIcon, RotateCw } from 'lucide-react';

type ErrorBoundaryProps = {
  resetKey: string;
  children: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    if (this.state.hasError && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ hasError: false });
    }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('RouteErrorBoundary caught error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 py-12 text-center animate-in fade-in">
          <div className="mb-4 rounded-panel border border-amber-500/30 bg-amber-500/10 p-3 text-amber-600 dark:text-amber-400">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
            Không thể tải trang này
          </h1>
          <p className="mt-2 max-w-prose text-sm leading-relaxed text-ink-secondary">
            Kết nối mạng có thể bị gián đoạn hoặc phiên bản trang vừa được cập nhật.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="btn-tactile inline-flex min-h-[44px] items-center gap-2 bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:bg-blue-600 dark:hover:bg-blue-500 dark:focus-visible:ring-offset-zinc-950"
            >
              <RotateCw className="h-4 w-4" />
              Tải lại trang
            </button>
            <Link
              to="/"
              className="btn-tactile inline-flex min-h-[44px] items-center gap-2 border border-hairline bg-surface px-4 py-2 text-sm font-semibold text-ink-secondary hover:border-hairline-hover hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            >
              <HomeIcon className="h-4 w-4" />
              Về trang chủ
            </Link>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export const RouteErrorBoundary = ({ children }: { children: ReactNode }) => {
  const { pathname } = useLocation();
  return <ErrorBoundary resetKey={pathname}>{children}</ErrorBoundary>;
};
