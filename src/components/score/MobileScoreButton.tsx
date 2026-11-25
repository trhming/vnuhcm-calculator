import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronUp } from 'lucide-react';

const baseTone = 'bg-surface-elevated text-ink hover:bg-surface-subtle';

const toneClass = {
  blue: `border-blue-500/40 ${baseTone} focus-visible:ring-blue-500`,
  hcmut: `border-blue-600/40 ${baseTone} focus-visible:ring-blue-500`,
  emerald: `border-emerald-500/40 ${baseTone} focus-visible:ring-emerald-500`,
  teal: `border-teal-500/40 ${baseTone} focus-visible:ring-teal-500`,
  indigo: `border-indigo-500/40 ${baseTone} focus-visible:ring-indigo-500`,
  red: `border-red-500/40 ${baseTone} focus-visible:ring-red-500`,
};

const dotClass = {
  blue: 'bg-blue-500',
  hcmut: 'bg-blue-600',
  emerald: 'bg-emerald-500',
  teal: 'bg-teal-500',
  indigo: 'bg-indigo-500',
  red: 'bg-red-500',
};

type MobileScoreTone = keyof typeof toneClass;

type MobileScoreButtonProps = {
  score: number;
  precision?: number;
  tone?: MobileScoreTone;
  onClick: () => void;
};

export const MobileScoreButton = ({
  score,
  precision = 2,
  tone = 'blue',
  onClick,
}: MobileScoreButtonProps) => {
  const colorClass = toneClass[tone] || toneClass.blue;
  const accentDot = dotClass[tone] || dotClass.blue;
  const [keyboardInset, setKeyboardInset] = useState(0);

  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return undefined;

    const isFormFieldFocused = () => {
      const activeElement = document.activeElement;
      return activeElement?.matches?.('input, textarea, select, [contenteditable="true"]');
    };

    const updateKeyboardInset = () => {
      const inset = Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop);
      setKeyboardInset(isFormFieldFocused() && inset > 80 ? Math.round(inset) : 0);
    };

    updateKeyboardInset();
    viewport.addEventListener('resize', updateKeyboardInset);
    viewport.addEventListener('scroll', updateKeyboardInset);
    window.addEventListener('resize', updateKeyboardInset);
    document.addEventListener('focusin', updateKeyboardInset);
    document.addEventListener('focusout', updateKeyboardInset);

    return () => {
      viewport.removeEventListener('resize', updateKeyboardInset);
      viewport.removeEventListener('scroll', updateKeyboardInset);
      window.removeEventListener('resize', updateKeyboardInset);
      document.removeEventListener('focusin', updateKeyboardInset);
      document.removeEventListener('focusout', updateKeyboardInset);
    };
  }, []);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <button
      type="button"
      onClick={onClick}
      className={`fixed inset-x-4 z-40 flex min-h-[54px] items-center justify-between gap-4 rounded-card border px-4 py-2.5 shadow-2xl transition-[background-color,bottom,transform] duration-150 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 sm:left-auto sm:right-6 sm:min-w-[270px] lg:hidden ${colorClass}`}
      style={{ bottom: `calc(1rem + ${keyboardInset}px)` }}
      aria-label="Xem chi tiết điểm xét tuyển"
    >
      <div className="flex items-center gap-2.5 text-left">
        <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${accentDot}`} aria-hidden="true" />
        <span className="text-xs font-semibold text-ink-secondary">
          Điểm xét tuyển
        </span>
      </div>

      <div className="flex items-center gap-2">
        <span className="font-mono text-xl font-bold leading-none tabular-nums text-ink">
          {score.toFixed(precision)}
          <span className="ml-1 text-xs font-medium text-ink-muted">/100</span>
        </span>
        <ChevronUp className="h-4 w-4 text-ink-muted" />
      </div>
    </button>,
    document.body
  );
};
