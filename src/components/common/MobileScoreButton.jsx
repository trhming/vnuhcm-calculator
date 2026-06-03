const toneClass = {
  blue: 'bg-blue-700 hover:bg-blue-800 focus:ring-blue-500',
  hcmut: 'bg-blue-800 hover:bg-blue-900 focus:ring-blue-700',
  emerald: 'bg-emerald-700 hover:bg-emerald-800 focus:ring-emerald-500',
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

  return (
    <button
      type="button"
      onClick={onClick}
      className={`fixed bottom-4 right-4 z-40 inline-flex items-center rounded-full px-4 py-3 text-white shadow-2xl shadow-slate-900/20 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 lg:hidden ${colorClass}`}
      aria-label="Xem chi tiết điểm xét tuyển"
    >
      <span className="text-xl font-extrabold leading-none">
        {score.toFixed(precision)}
        <span className="ml-1 text-xs font-semibold text-white/75">/100</span>
      </span>
    </button>
  );
};
