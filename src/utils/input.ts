type ClampScoreOptions = {
  integer?: boolean;
};

export const clampScore = (
  value: string | number,
  max: number,
  min = 0,
  options: ClampScoreOptions = {},
) => {
  if (value === '') return '';

  const normalized = value
    .toString()
    .replace(/,/g, '.')
    .replace(/[^\d.-]/g, '');

  if (normalized.trim().startsWith('-')) return min.toString();
  if (options.integer) {
    const wholePart = normalized.split('.')[0];
    const digitsOnly = wholePart.replace(/\D/g, '');
    if (digitsOnly === '') return '';

    const number = parseInt(digitsOnly, 10);
    if (Number.isNaN(number)) return '';
    if (number > max) return max.toString();
    if (number < min) return min.toString();

    return number.toString();
  }

  const firstDotIndex = normalized.indexOf('.');
  const decimalValue = firstDotIndex === -1
    ? normalized
    : `${normalized.slice(0, firstDotIndex + 1)}${normalized.slice(firstDotIndex + 1).replace(/\./g, '')}`;

  if (decimalValue === '') return '';
  if (decimalValue === '.') return `${min}.`;

  const number = parseFloat(decimalValue);
  if (Number.isNaN(number)) return decimalValue;
  if (number > max) return max.toString();
  if (number < min) return min.toString();

  return decimalValue;
};

export const clampNumber = (value: string | number, min: number, max: number) => {
  const number = parseInt(value.toString(), 10);
  if (Number.isNaN(number)) return min;
  return Math.min(Math.max(number, min), max);
};

export const clampDecimal = (value: string | number, min: number, max: number, fallback = min) => {
  const number = parseFloat(value.toString());
  if (Number.isNaN(number)) return fallback;
  return Math.min(Math.max(number, min), max);
};

export const updateScoreArray = (
  values: string[],
  setter: (values: string[]) => void,
  index: number,
  value: string | number,
  max: number,
  options?: ClampScoreOptions,
) => {
  const nextValues = [...values];
  nextValues[index] = clampScore(value, max, 0, options);
  setter(nextValues);
};
