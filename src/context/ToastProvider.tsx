import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';
import { ToastContext, type ToastOptions, type ToastType } from './toastContext';

type ToastItem = ToastOptions & {
  id: number;
  type: ToastType;
};

const toastStyles: Record<ToastType, { icon: string }> = {
  success: {
    icon: 'text-emerald-600 dark:text-emerald-400',
  },
  info: {
    icon: 'text-blue-600 dark:text-blue-400',
  },
  warning: {
    icon: 'text-amber-600 dark:text-amber-400',
  },
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextIdRef = useRef(1);
  const timersRef = useRef<Map<number, number>>(new Map());

  const dismissToast = useCallback((id: number) => {
    const timer = timersRef.current.get(id);
    if (timer) {
      window.clearTimeout(timer);
      timersRef.current.delete(id);
    }
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const showToast = useCallback(
    ({ title, description, type = 'info', duration = 3200, action }: ToastOptions) => {
      const id = nextIdRef.current++;
      setToasts((prev) => [...prev.slice(-2), { id, title, description, type, duration, action }]);

      if (duration > 0) {
        const timer = window.setTimeout(() => {
          dismissToast(id);
        }, duration);
        timersRef.current.set(id, timer);
      }
    },
    [dismissToast]
  );

  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      timers.clear();
    };
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="pointer-events-none fixed left-4 right-4 top-20 z-[70] flex flex-col items-end gap-2 sm:left-auto sm:right-6 sm:w-96 lg:bottom-6 lg:top-auto"
      >
        {toasts.map((toast) => {
          const style = toastStyles[toast.type];
          const Icon = toast.type === 'success' ? CheckCircle2 : toast.type === 'warning' ? AlertTriangle : Info;

          return (
            <div
              key={toast.id}
              role="status"
              className="pointer-events-auto flex w-full items-start gap-3 rounded-panel border border-hairline bg-surface-elevated p-3.5 text-ink shadow-xl animate-in fade-in duration-200"
            >
              <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${style.icon}`} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold leading-snug">{toast.title}</p>
                {toast.description && (
                  <p className="mt-0.5 text-xs leading-relaxed text-ink-secondary">
                    {toast.description}
                  </p>
                )}
                {toast.action && (
                  <button
                    type="button"
                    onClick={() => {
                      toast.action?.onClick();
                      dismissToast(toast.id);
                    }}
                    className="btn-tactile mt-2 inline-flex min-h-[30px] items-center border border-hairline bg-surface-subtle px-2.5 py-1 text-xs font-semibold text-blue-700 hover:border-hairline-hover hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-blue-400"
                  >
                    {toast.action.label}
                  </button>
                )}
              </div>
              <button
                type="button"
                onClick={() => dismissToast(toast.id)}
                aria-label="Đóng thông báo"
                className="btn-tactile flex h-8 w-8 shrink-0 items-center justify-center text-ink-muted hover:bg-surface-subtle hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};
