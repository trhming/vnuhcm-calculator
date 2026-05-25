export const IU_COEFFICIENTS = {
  Hs1: 1.28,
  Hs2: 1.31,
  Hs3: 0.78,
  Hs4: 1.02,
  Hs5: 1.0,
};

export const IU_GROUPS = [
  { id: 'G1_DGNL', name: '1.1 Tốt nghiệp THPT 2026 - Có ĐGNL 2026' },
  { id: 'G1_NO_DGNL', name: '1.2 Tốt nghiệp THPT 2026 - Không có ĐGNL 2026' },
  { id: 'G2_BOTH', name: '2.1 Tốt nghiệp trước 2026 - Có THPT 2026 và ĐGNL 2026' },
  { id: 'G2_THPT', name: '2.2 Tốt nghiệp trước 2026 - Chỉ có THPT 2026' },
  { id: 'G2_DGNL', name: '2.3 Tốt nghiệp trước 2026 - Chỉ có ĐGNL 2026' },
  { id: 'G3_FOREIGN', name: '3. Tốt nghiệp THPT nước ngoài' },
];

export const IU_ENGLISH_TYPES = [
  { id: 'IELTS', name: 'IELTS' },
  { id: 'TOEFL', name: 'TOEFL iBT' },
  { id: 'TOEIC', name: 'TOEIC' },
  { id: 'CAMBRIDGE', name: 'Cambridge' },
];

export const convertIuEnglishScore = (type, score, score2 = '') => {
  const value = parseFloat(score);
  const value2 = parseFloat(score2);

  if (Number.isNaN(value)) return 0;

  if (type === 'IELTS') {
    if (value >= 7.0) return 10;
    if (value >= 6.5) return 9.5;
    if (value >= 6.0) return 9;
    if (value >= 5.5) return 8.5;
    if (value >= 5.0) return 8;
  }

  if (type === 'TOEFL') {
    if (value >= 94) return 10;
    if (value >= 79) return 9.5;
    if (value >= 60) return 9;
    if (value >= 46) return 8.5;
    if (value >= 35) return 8;
  }

  if (type === 'TOEIC') {
    if (Number.isNaN(value2)) return 0;
    if (value >= 850 && value2 >= 310) return 10;
    if (value >= 785 && value2 >= 280) return 9.5;
    if (value >= 650 && value2 >= 250) return 9;
    if (value >= 550 && value2 >= 200) return 8.5;
    if (value >= 450 && value2 >= 160) return 8;
  }

  if (type === 'CAMBRIDGE') {
    if (value >= 185) return 10;
    if (value >= 176) return 9.5;
    if (value >= 169) return 9;
    if (value >= 160) return 8.5;
    if (value >= 154) return 8;
  }

  return 0;
};
