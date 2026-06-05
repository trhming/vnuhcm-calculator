import { clampScore } from '../../utils/input';

const toneClass = {
  blue: 'focus:ring-blue-500',
  hcmut: 'focus:ring-blue-800',
  emerald: 'focus:ring-emerald-600',
  teal: 'focus:ring-teal-700',
  indigo: 'focus:ring-indigo-600',
  red: 'focus:ring-red-500',
};

export const ScoreInput = ({
  value,
  onChange,
  onValueChange,
  min = 0,
  max,
  disabled = false,
  placeholder = '0.00',
  tone = 'blue',
  widthClass = 'w-full',
  className = '',
  inputClassName = '',
  clamp = true,
  integer = false,
  ...props
}) => {
  const handleChange = (event) => {
    if (clamp && max !== undefined) {
      event.target.value = clampScore(event.target.value, max, min, { integer });
    }

    onValueChange?.(event.target.value, event);
    onChange?.(event);
  };

  return (
    <input
      type="text"
      inputMode={integer ? 'numeric' : 'decimal'}
      pattern={integer ? '[0-9]*' : '[0-9]*[.,]?[0-9]*'}
      value={value}
      onChange={handleChange}
      disabled={disabled}
      placeholder={placeholder}
      className={`${widthClass} rounded-md border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 ${toneClass[tone] || toneClass.blue} ${
        disabled ? 'cursor-not-allowed bg-slate-100 text-slate-400' : ''
      } ${className} ${inputClassName}`}
      {...props}
    />
  );
};
