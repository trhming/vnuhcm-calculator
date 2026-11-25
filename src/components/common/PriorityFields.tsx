import { useId } from 'react';
import { DOI_TUONG, KHU_VUC } from '../../constants/common';
import type { CardTone } from './CardSection';

const focusRingClass: Record<CardTone, string> = {
  blue: 'focus-visible:ring-blue-600 dark:focus-visible:ring-blue-400',
  hcmut: 'focus-visible:ring-blue-700 dark:focus-visible:ring-blue-400',
  emerald: 'focus-visible:ring-emerald-600 dark:focus-visible:ring-emerald-400',
  teal: 'focus-visible:ring-teal-600 dark:focus-visible:ring-teal-400',
  indigo: 'focus-visible:ring-indigo-600 dark:focus-visible:ring-indigo-400',
  red: 'focus-visible:ring-red-600 dark:focus-visible:ring-red-400',
};

type PriorityFieldsProps = {
  kv: string;
  onKvChange: (value: string) => void;
  dt: string;
  onDtChange: (value: string) => void;
  tone?: CardTone;
  compact?: boolean;
};

export const PriorityFields = ({
  kv,
  onKvChange,
  dt,
  onDtChange,
  tone = 'blue',
  compact = false,
}: PriorityFieldsProps) => {
  const kvId = useId();
  const dtId = useId();
  const ringClass = focusRingClass[tone] || focusRingClass.blue;

  return (
    <div className={`grid grid-cols-1 ${compact ? 'gap-3' : 'gap-4 sm:grid-cols-2 sm:gap-6'}`}>
      <div>
        <label
          htmlFor={kvId}
          className={`block font-medium text-ink ${compact ? 'mb-1.5 text-xs text-ink-secondary' : 'mb-2 text-sm'}`}
        >
          Khu vực
        </label>
        <select
          id={kvId}
          value={kv}
          onChange={(event) => onKvChange(event.target.value)}
          className={`select-control ${ringClass}`}
        >
          {KHU_VUC.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label
          htmlFor={dtId}
          className={`block font-medium text-ink ${compact ? 'mb-1.5 text-xs text-ink-secondary' : 'mb-2 text-sm'}`}
        >
          Đối tượng
        </label>
        <select
          id={dtId}
          value={dt}
          onChange={(event) => onDtChange(event.target.value)}
          className={`select-control ${ringClass}`}
        >
          {DOI_TUONG.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
