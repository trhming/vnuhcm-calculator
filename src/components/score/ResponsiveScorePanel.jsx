import { X } from 'lucide-react';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';

export const ResponsiveScorePanel = ({
  isOpen,
  onClose,
  children,
  variant = 'panel',
  borderClassName = 'border-slate-200',
  backdropClassName = 'bg-slate-900/80',
}) => {
  useBodyScrollLock(isOpen);

  if (variant === 'card') {
    return (
      <>
        <div className="hidden lg:block lg:w-96">{children}</div>
        {isOpen && (
          <div
            className={`fixed inset-0 z-[60] flex items-end justify-center p-0 backdrop-blur-sm animate-in fade-in sm:items-center sm:p-4 lg:hidden ${backdropClassName}`}
            onClick={onClose}
          >
            <div
              className="relative max-h-[90vh] w-full overflow-y-auto rounded-t-3xl bg-white sm:max-w-md sm:rounded-2xl [&>div]:static [&>div]:rounded-none [&>div]:border-0 [&>div]:shadow-none"
              onClick={(event) => event.stopPropagation()}
            >
              <CloseButton onClose={onClose} />
              {children}
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div
      className={`lg:block lg:w-96 lg:static ${
        isOpen
          ? `fixed inset-0 z-[60] flex items-end justify-center p-0 backdrop-blur-sm animate-in fade-in sm:items-center sm:p-4 ${backdropClassName}`
          : 'hidden'
      }`}
      onClick={isOpen ? onClose : undefined}
    >
      <div
        className={`w-full bg-white shadow-2xl relative flex flex-col overflow-hidden ${
          isOpen
            ? 'rounded-t-3xl sm:rounded-2xl max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-full sm:zoom-in-95'
            : `rounded-2xl border sticky top-24 ${borderClassName}`
        }`}
        onClick={(event) => event.stopPropagation()}
      >
        {isOpen && <CloseButton onClose={onClose} />}
        {children}
      </div>
    </div>
  );
};

const CloseButton = ({ onClose }) => (
  <button
    type="button"
    onClick={onClose}
    className="absolute right-4 top-4 z-20 rounded-full bg-black/20 p-1.5 text-white/70 backdrop-blur-sm transition-colors hover:text-white lg:hidden"
  >
    <X className="h-5 w-5" />
  </button>
);
