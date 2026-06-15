import { useEffect, useState } from 'react';

const toneClass = {
  blue: 'bg-blue-700 hover:bg-blue-800 focus:ring-blue-500',
  hcmut: 'bg-blue-800 hover:bg-blue-900 focus:ring-blue-700',
  emerald: 'bg-emerald-700 hover:bg-emerald-800 focus:ring-emerald-500',
  teal: 'bg-teal-700 hover:bg-teal-800 focus:ring-teal-500',
  indigo: 'bg-indigo-700 hover:bg-indigo-800 focus:ring-indigo-500',
  red: 'bg-red-700 hover:bg-red-800 focus:ring-red-500',
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

  return (
    <button
      type="button"
      onClick={onClick}
      className={`fixed right-4 z-40 inline-flex items-center rounded-full px-4 py-3 text-white shadow-2xl shadow-slate-900/20 transition-[background-color,bottom] focus:outline-none focus:ring-2 focus:ring-offset-2 lg:hidden ${colorClass}`}
      style={{ bottom: `calc(1rem + ${keyboardInset}px)` }}
      aria-label="Xem chi tiết điểm xét tuyển"
    >
      <span className="text-xl font-extrabold leading-none">
        {score.toFixed(precision)}
        <span className="ml-1 text-xs font-semibold text-white/75">/100</span>
      </span>
    </button>
  );
};
