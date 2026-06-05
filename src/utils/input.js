export const clampScore = (value, max, min = 0, options = {}) => {
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

export const clampNumber = (value, min, max) => {
  const number = parseInt(value, 10);
  if (Number.isNaN(number)) return min;
  return Math.min(Math.max(number, min), max);
};

export const clampDecimal = (value, min, max, fallback = min) => {
  const number = parseFloat(value);
  if (Number.isNaN(number)) return fallback;
  return Math.min(Math.max(number, min), max);
};

export const updateScoreArray = (values, setter, index, value, max, options) => {
  const nextValues = [...values];
  nextValues[index] = clampScore(value, max, 0, options);
  setter(nextValues);
};
