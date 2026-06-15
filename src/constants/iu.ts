import { pickCertificates } from './common';

export const IU_COEFFICIENTS = {
  Hs1: 1.28,
  Hs2: 1.31,
  Hs3: 0.78,
  Hs4: 1.02,
};

export const IU_GROUPS = [
  { id: 'G1_DGNL', name: '1.1 Tốt nghiệp THPT 2026 - Có ĐGNL 2026' },
  { id: 'G1_NO_DGNL', name: '1.2 Tốt nghiệp THPT 2026 - Không có ĐGNL 2026' },
  { id: 'G2_BOTH', name: '2.1 Tốt nghiệp trước 2026 - Có THPT 2026 và ĐGNL 2026' },
  { id: 'G2_THPT', name: '2.2 Tốt nghiệp trước 2026 - Chỉ có THPT 2026' },
  { id: 'G2_DGNL', name: '2.3 Tốt nghiệp trước 2026 - Chỉ có ĐGNL 2026' },
];

export const IU_ENGLISH_TYPES = pickCertificates(['IELTS', 'TOEFL', 'TOEIC', 'CAMBRIDGE']);

export const IU_ENGLISH_TABLES = [
  {
    type: 'IELTS',
    title: 'IELTS',
    tone: 'blue',
    rows: [
      { score: '≥ 7.0', point: '10.0', min: 7.0 },
      { score: '6.5', point: '9.5', min: 6.5 },
      { score: '6.0', point: '9.0', min: 6.0 },
      { score: '5.5', point: '8.5', min: 5.5 },
      { score: '5.0', point: '8.0', min: 5.0 },
    ],
  },
  {
    type: 'TOEFL',
    title: 'TOEFL iBT',
    tone: 'emerald',
    rows: [
      { score: '≥ 94', point: '10.0', min: 94 },
      { score: '79 - 93', point: '9.5', min: 79 },
      { score: '60 - 78', point: '9.0', min: 60 },
      { score: '46 - 59', point: '8.5', min: 46 },
      { score: '35 - 45', point: '8.0', min: 35 },
    ],
  },
  {
    type: 'TOEIC',
    title: 'TOEIC',
    tone: 'amber',
    rows: [
      { score: '≥ 850 + 310', point: '10.0', minLr: 850, minSw: 310 },
      { score: '785 + 280', point: '9.5', minLr: 785, minSw: 280 },
      { score: '650 + 250', point: '9.0', minLr: 650, minSw: 250 },
      { score: '550 + 200', point: '8.5', minLr: 550, minSw: 200 },
      { score: '450 + 160', point: '8.0', minLr: 450, minSw: 160 },
    ],
  },
  {
    type: 'CAMBRIDGE',
    title: 'Cambridge',
    tone: 'indigo',
    rows: [
      { score: '≥ 185', point: '10.0', min: 185 },
      { score: '176 - 184', point: '9.5', min: 176 },
      { score: '169 - 175', point: '9.0', min: 169 },
      { score: '160 - 168', point: '8.5', min: 160 },
      { score: '154 - 159', point: '8.0', min: 154 },
    ],
  },
];

export const convertIuEnglishScore = (type, score, score2 = '') => {
  const value = parseFloat(score);
  const value2 = parseFloat(score2);

  if (Number.isNaN(value)) return 0;

  const table = IU_ENGLISH_TABLES.find((item) => item.type === type);
  if (!table) return 0;

  const row = table.rows.find((item) => {
    if (type === 'TOEIC') {
      return 'minLr' in item && !Number.isNaN(value2) && value >= item.minLr && value2 >= item.minSw;
    }

    return 'min' in item && value >= item.min;
  });

  return row ? parseFloat(row.point) : 0;
};
