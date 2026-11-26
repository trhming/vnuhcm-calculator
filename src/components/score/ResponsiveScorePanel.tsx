import { useEffect, useRef, useState, type ReactNode, type TouchEvent } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';

type ResponsiveScorePanelProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  variant?: 'panel' | 'card';
  borderClassName?: string;
  backdropClassName?: string;
};

export const ResponsiveScorePanel = ({
  isOpen,
  onClose,
  children,
  variant = 'panel',
  borderClassName = 'border-hairline',
  backdropClassName = 'bg-black/55 dark:bg-black/75',
}: ResponsiveScorePanelProps) => {
  useBodyScrollLock(isOpen);
  const [dragOffsetY, setDragOffsetY] = useState(0);
  const touchStartYRef = useRef<number | null>(null);

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

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    touchStartYRef.current = event.touches[0].clientY;
  };

  const handleTouchMove = (event: TouchEvent<HTMLDivElement>) => {
    if (touchStartYRef.current === null) return;
    const delta = Math.max(0, event.touches[0].clientY - touchStartYRef.current);
    setDragOffsetY(delta);
  };

  const handleTouchEnd = () => {
    const shouldClose = dragOffsetY > 72;
    touchStartYRef.current = null;
    setDragOffsetY(0);
    if (shouldClose) {
      onClose();
    }
  };

  const mobileSheet = isOpen && typeof document !== 'undefined'
    ? createPortal(
        <div
          className={`fixed inset-0 z-[80] flex items-end justify-center p-0 backdrop-blur-sm animate-in fade-in duration-200 sm:items-center sm:p-4 lg:hidden ${backdropClassName}`}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Chi tiết điểm xét tuyển"
        >
          <div
            className="relative flex max-h-[88vh] w-full flex-col overflow-hidden rounded-t-card border border-hairline bg-surface shadow-2xl animate-in slide-in-from-bottom-full duration-200 sm:max-w-md sm:rounded-card sm:zoom-in-95"
            style={
              dragOffsetY > 0
                ? { transform: `translateY(${dragOffsetY}px)`, transition: 'none' }
                : undefined
            }
            onClick={(event) => event.stopPropagation()}
          >
            <div
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className="flex h-7 shrink-0 touch-none items-center justify-center sm:hidden"
              aria-hidden="true"
            >
              <span className="h-1 w-10 rounded-full bg-ink-muted/30" />
            </div>
            <CloseButton onClose={onClose} />
            <div className="min-h-0 flex-1 overflow-y-auto [&>div]:rounded-none [&>div]:border-0 [&>div]:shadow-none">
              {children}
            </div>
          </div>
        </div>,
        document.body
      )
    : null;

  if (variant === 'card') {
    return (
      <>
        <div className="hidden lg:sticky lg:top-24 lg:block lg:max-h-[calc(100vh-7rem)] lg:w-96 lg:self-start lg:overflow-y-auto lg:rounded-card lg:border lg:border-hairline lg:bg-surface lg:shadow-sm [&>div]:rounded-none [&>div]:border-0 [&>div]:shadow-none">
          {children}
        </div>
        {mobileSheet}
      </>
    );
  }

  return (
    <>
      <div className="hidden lg:block lg:w-96 lg:static">
        <div className={`sticky top-24 flex w-full flex-col overflow-hidden rounded-card border bg-surface shadow-sm ${borderClassName}`}>
          {children}
        </div>
      </div>
      {mobileSheet}
    </>
  );
};

const CloseButton = ({ onClose }: { onClose: () => void }) => (
  <button
    type="button"
    onClick={onClose}
    aria-label="Đóng chi tiết điểm"
    className="btn-tactile absolute right-3 top-3 z-20 flex h-11 w-11 items-center justify-center border border-hairline bg-surface-subtle text-ink-secondary hover:bg-surface hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 lg:hidden"
  >
    <X className="h-5 w-5" />
  </button>
);
