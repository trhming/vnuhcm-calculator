export const clampScore = (value, max, min = 0) => {
  if (value === '') return '';
  if (value.toString().trim().startsWith('-')) return min.toString();
  const number = parseFloat(value);
  if (Number.isNaN(number)) return value;
  return Math.min(Math.max(number, min), max).toString();
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
