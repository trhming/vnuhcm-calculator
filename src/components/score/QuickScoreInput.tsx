import { type ChangeEvent, useId } from 'react';
import { X } from 'lucide-react';
import { clampScore } from '../../utils/input';

const toneClass = {
  blue: {
    ring: 'focus-visible:ring-blue-600 dark:focus-visible:ring-blue-400',
    active: 'text-blue-700 dark:text-blue-400',
  },
  hcmut: {
    ring: 'focus-visible:ring-blue-700 dark:focus-visible:ring-blue-400',
    active: 'text-blue-800 dark:text-blue-300',
  },
  emerald: {
    ring: 'focus-visible:ring-emerald-600 dark:focus-visible:ring-emerald-400',
    active: 'text-emerald-700 dark:text-emerald-400',
  },
  teal: {
    ring: 'focus-visible:ring-teal-600 dark:focus-visible:ring-teal-400',
    active: 'text-teal-700 dark:text-teal-400',
  },
  indigo: {
    ring: 'focus-visible:ring-indigo-600 dark:focus-visible:ring-indigo-400',
    active: 'text-indigo-700 dark:text-indigo-400',
  },
  red: {
    ring: 'focus-visible:ring-red-600 dark:focus-visible:ring-red-400',
    active: 'text-red-700 dark:text-red-400',
  },
};

type QuickScoreTone = keyof typeof toneClass;

type QuickScoreInputProps = {
  title: string;
  description?: string;
  value: string | number;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onClear?: () => void;
  disabled?: boolean;
  max?: number;
  maxIntPartLength?: number;
  placeholder?: string;
  tone?: QuickScoreTone;
  className?: string;
  integer?: boolean;
};

export const QuickScoreInput = ({
  title,
  description,
  value,
  onChange,
  onClear,
  disabled,
  max = 30,
  maxIntPartLength = -1,
  placeholder = '0.00',
  tone = 'blue',
  className = '',
  integer = false,
}: QuickScoreInputProps) => {
  const inputId = useId();
  const toneStyle = toneClass[tone] || toneClass.blue;
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    event.target.value = clampScore(value, max, 0, maxIntPartLength, { integer });
    onChange(event);
  };

  const hasValue = String(value ?? '').trim() !== '';

  return (
    <div className={`border-t border-hairline pt-4 transition-colors duration-150 ${className}`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <label htmlFor={inputId} className="block text-sm font-medium text-ink">
            {title}
          </label>
          {disabled ? (
            <p className="mt-0.5 text-xs text-ink-muted">Tự tính từ các ô trên</p>
          ) : (
            description && <p className="mt-0.5 text-xs text-ink-muted">{description}</p>
          )}
        </div>

        <div className="relative flex items-center sm:w-44">
          <input
            id={inputId}
            type="text"
            inputMode={integer ? 'numeric' : 'decimal'}
            pattern={integer ? '[0-9]*' : '[0-9]*[.,]?[0-9]*'}
            value={value}
            onChange={handleChange}
            disabled={disabled}
            className={`w-full rounded-control border px-3 py-2 text-right font-mono text-base font-bold tabular-nums transition-[border-color,background-color,box-shadow] duration-150 focus:outline-none focus-visible:ring-2 ${
              !disabled && hasValue && onClear ? 'pl-9' : ''
            } ${toneStyle.ring} ${
              disabled
                ? 'cursor-not-allowed border-hairline bg-surface-subtle text-ink-muted'
                : `border-hairline bg-surface hover:border-hairline-hover ${toneStyle.active}`
            }`}
            placeholder={placeholder}
          />
          {!disabled && hasValue && onClear && (
            <button
              type="button"
              onClick={onClear}
              aria-label={`Xóa ${title}`}
              title="Xóa để nhập từng ô chi tiết"
              className="btn-tactile absolute left-1.5 flex h-7 w-7 items-center justify-center text-ink-muted hover:bg-surface-subtle hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
