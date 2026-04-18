export const DOI_TUONG_HCMUT = [
  { id: '2.1', name: 'ĐT 2.1: Có thi ĐGNL 2026' },
  { id: '2.2', name: 'ĐT 2.2: Không thi ĐGNL 2026 (Chỉ THPT)' },
  { id: '2.3', name: 'ĐT 2.3: THPT Nước ngoài' },
  { id: '2.4', name: 'ĐT 2.4: Có Chứng chỉ Quốc tế (SAT, ACT, IB, A-Level)' },
];

export const INTL_CERT_TYPES = [
  { id: 'SAT', name: 'SAT' },
  { id: 'ACT', name: 'ACT' },
  { id: 'IB', name: 'IB' },
  { id: 'ALEVEL', name: 'A-Level' },
];

export const convertHcmutEnglish = (type, score, toeicLr = 0, toeicSw = 0) => {
  if (type === 'IELTS') {
    if (score >= 8.0) return 10;
    if (score >= 7.5) return 9.5;
    if (score >= 7.0) return 9.0;
    if (score >= 6.5) return 8.5;
    if (score >= 6.0) return 8.0;
  }
  if (type === 'PTE') {
    if (score >= 79) return 10;
    if (score >= 71) return 9.5;
    if (score >= 63) return 9.0;
    if (score >= 55) return 8.5;
    if (score >= 47) return 8.0;
  }
  if (type === 'TOEFL') {
    if (score >= 110) return 10;
    if (score >= 102) return 9.5;
    if (score >= 94) return 9.0;
    if (score >= 79) return 8.5;
    if (score >= 60) return 8.0;
  }
  if (type === 'TOEIC') {
    if (toeicLr >= 905 && toeicSw >= 390) return 10;
    if (toeicLr >= 835 && toeicSw >= 380) return 9.5;
    if (toeicLr >= 785 && toeicSw >= 360) return 9.0;
    if (toeicLr >= 685 && toeicSw >= 330) return 8.5;
    if (toeicLr >= 570 && toeicSw >= 310) return 8.0;
  }
  return 0;
};

export const convertIntlCert = (type, score) => {
  if (type === 'SAT') {
    if (score < 1200) return 0;
    // Step 10 điểm SAT = 1 điểm quy đổi. 1600 -> 100
    const points = 100 - Math.floor((1600 - score) / 10);
    return Math.min(100, Math.max(0, points));
  }
  if (type === 'ACT') {
    const map = { 36: 100, 35: 96, 34: 92, 33: 88, 32: 84, 31: 81, 30: 78, 29: 75, 28: 72, 27: 69, 26: 67, 25: 65 };
    return map[score] || 0;
  }
  if (type === 'IB') {
    const map = { 45: 100, 44: 96, 43: 93, 42: 90, 41: 87, 40: 84, 39: 81, 38: 78, 37: 75, 36: 72, 35: 69, 34: 67, 33: 65 };
    return map[score] || 0;
  }
  if (type === 'ALEVEL') {
    const map = { 'A*': 95, 'A': 85, 'B': 75, 'C': 65 };
    return map[score] || 0;
  }
  return 0;
};
