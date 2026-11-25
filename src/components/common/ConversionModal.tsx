import { useEffect, useId, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';

type ConversionModalProps = {
  isOpen: boolean;
  title: ReactNode;
  onClose: () => void;
  children: ReactNode;
  headerExtra?: ReactNode;
  maxWidthClassName?: string;
};

export const ConversionModal = ({
  isOpen,
  title,
  onClose,
  children,
  headerExtra,
  maxWidthClassName = 'max-w-4xl',
}: ConversionModalProps) => {
  const titleId = useId();
  useBodyScrollLock(isOpen);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || typeof document === 'undefined') return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/55 p-3 backdrop-blur-sm animate-in fade-in duration-200 dark:bg-black/75 sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div
        className={`flex max-h-[88vh] w-full flex-col overflow-hidden rounded-card border border-hairline bg-surface shadow-2xl animate-in zoom-in-95 duration-200 ${maxWidthClassName}`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-between gap-4 border-b border-hairline bg-surface-subtle/70 px-4 py-3.5 sm:px-6 sm:py-4">
          <h3 id={titleId} className="text-base font-semibold tracking-tight text-ink sm:text-lg">
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng bảng quy đổi"
            className="btn-tactile flex h-11 w-11 shrink-0 items-center justify-center text-ink-muted hover:bg-surface hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 sm:h-9 sm:w-9"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {headerExtra && (
          <div className="shrink-0 border-b border-hairline bg-surface px-4 py-3 sm:px-6">
            {headerExtra}
          </div>
        )}

        <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};
