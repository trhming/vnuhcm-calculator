type ClampScoreOptions = {
  integer?: boolean;
};

export const clampScore = (
  value: string | number,
  max: number,
  min = 0,
  maxIntPartLength = -1,
  options: ClampScoreOptions = {}
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

  let number = parseFloat(decimalValue);
  if (Number.isNaN(number)) return decimalValue;
  if (number < min) return min.toString();
  if (number > max) {
    const stringtifiedNumber = number.toString();
    if (maxIntPartLength < 1) return max.toString();
    if (stringtifiedNumber.length > maxIntPartLength) {
      /**
       * Edge case: 100 --expected--> 10.0
       * But the `Math.pow(10, stringtifiedNumber.length - 1)` will return 100, which divide 100 will return 1, not 10
       */
      if (stringtifiedNumber.startsWith("10")) number = 10
      else number /= Math.pow(10, stringtifiedNumber.length - maxIntPartLength)
    }
    if (number > max) return max.toString();
    return number.toString()
  }

  if (decimalValue.split('.')[1]?.length > 2) return number.toFixed(2);
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
  maxDecimal: number = -1,
  options?: ClampScoreOptions,
) => {
  const nextValues = [...values];
  nextValues[index] = clampScore(value, max, maxDecimal, 0, options);
  setter(nextValues);
};
