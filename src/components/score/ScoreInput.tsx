import { useRef, type ChangeEvent, type InputHTMLAttributes } from 'react';
import { clampScore } from '../../utils/input';

const toneClass = {
  blue: 'focus:ring-blue-500',
  hcmut: 'focus:ring-blue-800',
  emerald: 'focus:ring-emerald-600',
  teal: 'focus:ring-teal-700',
  indigo: 'focus:ring-indigo-600',
  red: 'focus:ring-red-500',
};

type ScoreTone = keyof typeof toneClass;

type ScoreInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> & {
  value: string | number;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onValueChange?: (value: string, event: ChangeEvent<HTMLInputElement>) => void;
  min?: number;
  max?: number;
  maxWholeNumber?: number;
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
  maxWholeNumber = -1,
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
  const inputElement = useRef(null);
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (clamp && max !== undefined) {
      event.target.value = clampScore(event.target.value, max, min, maxWholeNumber, { integer }, document.activeElement === inputElement.current);
    }

    onValueChange?.(event.target.value, event);
    onChange?.(event);
  };

  return (
    <input
      ref={inputElement}
      type="text"
      inputMode={integer ? 'numeric' : 'decimal'}
      pattern={integer ? '[0-9]*' : '[0-9]*[.,]?[0-9]*'}
      value={value}
      onChange={handleChange}
      disabled={disabled}
      placeholder={placeholder}
      className={`${widthClass} rounded-md border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 ${toneClass[tone] || toneClass.blue} ${disabled ? 'cursor-not-allowed bg-slate-100 text-slate-400' : ''
        } ${className} ${inputClassName}`}
      {...props}
    />
  );
};
