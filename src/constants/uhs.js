export const UHS_LANG_TYPES = [
  { id: 'IELTS', name: 'IELTS', max: 9, min: 6 },
  { id: 'TOEFL_IBT', name: 'TOEFL iBT', max: 120, min: 79 },
  { id: 'TOEFL_ITP', name: 'TOEFL ITP', max: 677, min: 550 },
  { id: 'TOEIC', name: 'TOEIC 4 kỹ năng', max: 1390, minLr: 671, minSw: 271 },
  { id: 'VSTEP', name: 'VSTEP Bậc 4', max: 10, min: 6 },
];

export const UHS_LANG_MAX = UHS_LANG_TYPES.reduce((acc, item) => {
  acc[item.id] = item.max;
  return acc;
}, {});

export const roundUhs = (value) => Math.round(value * 10) / 10;
