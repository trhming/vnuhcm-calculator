import { type ChangeEvent, type InputHTMLAttributes } from 'react';
import { clampScore } from '../../utils/input';

const toneClass = {
  blue: 'focus-visible:ring-blue-600 dark:focus-visible:ring-blue-400',
  hcmut: 'focus-visible:ring-blue-700 dark:focus-visible:ring-blue-400',
  emerald: 'focus-visible:ring-emerald-600 dark:focus-visible:ring-emerald-400',
  teal: 'focus-visible:ring-teal-600 dark:focus-visible:ring-teal-400',
  indigo: 'focus-visible:ring-indigo-600 dark:focus-visible:ring-indigo-400',
  red: 'focus-visible:ring-red-600 dark:focus-visible:ring-red-400',
};

type ScoreTone = keyof typeof toneClass;

type ScoreInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> & {
  value: string | number;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onValueChange?: (value: string, event: ChangeEvent<HTMLInputElement>) => void;
  min?: number;
  max?: number;
  maxIntPartLength?: number;
  tone?: ScoreTone;
  widthClass?: string;
  inputClassName?: string;
  clamp?: boolean;
  integer?: boolean;
};

export const ScoreInput = ({
  value,
  onChange,
  onValueChange,
  min = 0,
  max,
  maxIntPartLength = -1,
  disabled = false,
  placeholder = '0.00',
  tone = 'blue',
  widthClass = 'w-full',
  className = '',
  inputClassName = '',
  clamp = true,
  integer = false,
  ...props
}: ScoreInputProps) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (clamp && max !== undefined) {
      event.target.value = clampScore(event.target.value, max, min, maxIntPartLength, { integer });
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
      className={`${widthClass} rounded-control border border-hairline bg-surface px-3 py-2 font-mono text-sm font-medium text-ink tabular-nums transition-[border-color,background-color,box-shadow] duration-150 placeholder:text-ink-muted hover:border-hairline-hover focus:outline-none focus-visible:ring-2 ${
        toneClass[tone] || toneClass.blue
      } ${
        disabled
          ? 'cursor-not-allowed bg-surface-subtle text-ink-muted opacity-75 hover:border-hairline'
          : ''
      } ${className} ${inputClassName}`}
      {...props}
    />
  );
};
