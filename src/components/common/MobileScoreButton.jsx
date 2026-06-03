import { useEffect, useState } from 'react';

const toneClass = {
  blue: 'bg-blue-700 hover:bg-blue-800 focus:ring-blue-500',
  hcmut: 'bg-blue-800 hover:bg-blue-900 focus:ring-blue-700',
  emerald: 'bg-emerald-700 hover:bg-emerald-800 focus:ring-emerald-500',
  teal: 'bg-teal-700 hover:bg-teal-800 focus:ring-teal-500',
  indigo: 'bg-indigo-700 hover:bg-indigo-800 focus:ring-indigo-500',
  red: 'bg-red-700 hover:bg-red-800 focus:ring-red-500',
};

export const MobileScoreButton = ({
  score,
  precision = 2,
  tone = 'blue',
  onClick,
}) => {
  const colorClass = toneClass[tone] || toneClass.blue;
  const [keyboardInset, setKeyboardInset] = useState(0);

  useEffect(() => {
    const viewport = window.visualViewport;
    const isTextInputFocused = () => {
      const activeElement = document.activeElement;
      return activeElement?.matches?.('input, textarea, select, [contenteditable="true"]');
    };

    const isEditableTarget = (target) => target?.matches?.('input, textarea, select, [contenteditable="true"]');

    const updateKeyboardInset = () => {
      if (!viewport || !isTextInputFocused()) {
        setKeyboardInset(0);
        return;
      }

      const inset = Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop);
      setKeyboardInset(Math.round(inset));
    };

    const updateSoon = () => {
      window.requestAnimationFrame(updateKeyboardInset);
    };

    const resetOnPageTouch = (event) => {
      if (isEditableTarget(event.target)) return;

      const activeElement = document.activeElement;
      if (isTextInputFocused()) activeElement.blur();
      setKeyboardInset(0);
    };

    updateKeyboardInset();
    viewport?.addEventListener('resize', updateSoon);
    viewport?.addEventListener('scroll', updateSoon);
    window.addEventListener('resize', updateSoon);
    window.addEventListener('scroll', updateSoon, { passive: true });
    window.addEventListener('touchstart', resetOnPageTouch, { passive: true, capture: true });
    window.addEventListener('pointerdown', resetOnPageTouch, { passive: true, capture: true });
    document.addEventListener('focusin', updateSoon);
    document.addEventListener('focusout', updateSoon);

    return () => {
      viewport?.removeEventListener('resize', updateSoon);
      viewport?.removeEventListener('scroll', updateSoon);
      window.removeEventListener('resize', updateSoon);
      window.removeEventListener('scroll', updateSoon);
      window.removeEventListener('touchstart', resetOnPageTouch, { capture: true });
      window.removeEventListener('pointerdown', resetOnPageTouch, { capture: true });
      document.removeEventListener('focusin', updateSoon);
      document.removeEventListener('focusout', updateSoon);
    };
  }, []);

  return (
    <button
      type="button"
      onClick={onClick}
      className={`fixed right-4 z-40 inline-flex items-center rounded-full px-4 py-3 text-white shadow-2xl shadow-slate-900/20 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 lg:hidden ${colorClass}`}
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
