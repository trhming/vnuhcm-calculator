import { pickCertificates } from './common';

export const UHS_LANG_TYPES = pickCertificates(['IELTS', 'TOEFL_IBT', 'TOEFL_ITP', 'TOEIC', 'VSTEP']).map((type) => {
  const thresholds = {
    IELTS: { min: 6 },
    TOEFL_IBT: { min: 79 },
    TOEFL_ITP: { min: 550 },
    TOEIC: { minLr: 671, minSw: 271 },
    VSTEP: { min: 6 },
  }[type.id] || {};

  return { ...type, ...thresholds };
});

export const roundUhs = (value) => Math.round(value * 10) / 10;
