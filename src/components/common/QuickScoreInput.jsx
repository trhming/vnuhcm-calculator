import { clampScore } from '../../utils/input';

const toneClass = {
  blue: {
    ring: 'focus:ring-blue-500',
    active: 'text-blue-800',
  },
  hcmut: {
    ring: 'focus:ring-blue-800',
    active: 'text-blue-800',
  },
  emerald: {
    ring: 'focus:ring-emerald-600',
    active: 'text-emerald-800',
  },
  indigo: {
    ring: 'focus:ring-indigo-600',
    active: 'text-indigo-800',
  },
  red: {
    ring: 'focus:ring-red-500',
    active: 'text-red-800',
  },
};

export const QuickScoreInput = ({
  title,
  description = 'Tổng điểm 3 môn trên thang 30.',
  value,
  onChange,
  disabled,
  max = 30,
  step = '0.01',
  placeholder = '0.00',
  tone = 'blue',
  className = '',
}) => {
  const toneStyle = toneClass[tone] || toneClass.blue;
  const handleChange = (event) => {
    const { value } = event.target;
    event.target.value = clampScore(value, max);
    onChange(event);
  };

  return (
    <div className={`rounded-xl border border-slate-200 bg-slate-50 p-4 ${className}`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-700">{title}</label>
          <p className="text-xs text-slate-500">{description}</p>
        </div>
        <input
          type="number"
          min="0"
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          className={`w-full rounded-md border px-3 py-2 text-right text-lg font-bold focus:outline-none focus:ring-2 sm:w-40 ${toneStyle.ring} ${
            disabled
              ? 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-500'
              : `border-slate-200 bg-white ${toneStyle.active}`
          }`}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
};
