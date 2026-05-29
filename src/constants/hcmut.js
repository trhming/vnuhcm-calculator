export const DOI_TUONG_HCMUT = [
  { id: '2.1', name: 'ĐT 2.1: Có thi ĐGNL 2026' },
  { id: '2.2', name: 'ĐT 2.2: Không thi ĐGNL 2026 (Chỉ THPT)' },
  { id: '2.4', name: 'ĐT 2.4: Có Chứng chỉ Quốc tế (SAT, ACT, IB, A-Level)' },
];

export const INTL_CERT_TYPES = [
  { id: 'SAT', name: 'SAT' },
  { id: 'ACT', name: 'ACT' },
  { id: 'IB', name: 'IB' },
  { id: 'ALEVEL', name: 'A-Level' },
];

export const HCMUT_CCQT_TABLE = [
  { sat: 1600, act: 36, ib: 45, aLevel: '', point: 100 },
  { sat: 1590, act: '', ib: '', aLevel: '', point: 99 },
  { sat: 1580, act: '', ib: '', aLevel: '', point: 98 },
  { sat: 1570, act: '', ib: '', aLevel: '', point: 97 },
  { sat: 1560, act: 35, ib: 44, aLevel: '', point: 96 },
  { sat: 1550, act: '', ib: '', aLevel: 'A*', point: 95 },
  { sat: 1540, act: '', ib: '', aLevel: '', point: 94 },
  { sat: 1530, act: '', ib: 43, aLevel: '', point: 93 },
  { sat: 1520, act: 34, ib: '', aLevel: '', point: 92 },
  { sat: 1510, act: '', ib: '', aLevel: '', point: 91 },
  { sat: 1500, act: '', ib: 42, aLevel: '', point: 90 },
  { sat: 1490, act: '', ib: '', aLevel: '', point: 89 },
  { sat: 1480, act: 33, ib: '', aLevel: '', point: 88 },
  { sat: 1470, act: '', ib: 41, aLevel: '', point: 87 },
  { sat: 1460, act: '', ib: '', aLevel: '', point: 86 },
  { sat: 1450, act: '', ib: '', aLevel: 'A', point: 85 },
  { sat: 1440, act: 32, ib: 40, aLevel: '', point: 84 },
  { sat: 1430, act: '', ib: '', aLevel: '', point: 83 },
  { sat: 1420, act: '', ib: '', aLevel: '', point: 82 },
  { sat: 1410, act: 31, ib: 39, aLevel: '', point: 81 },
  { sat: 1400, act: '', ib: '', aLevel: '', point: 80 },
  { sat: 1390, act: '', ib: '', aLevel: '', point: 79 },
  { sat: 1380, act: 30, ib: 38, aLevel: '', point: 78 },
  { sat: 1370, act: '', ib: '', aLevel: '', point: 77 },
  { sat: 1360, act: '', ib: '', aLevel: '', point: 76 },
  { sat: 1350, act: 29, ib: 37, aLevel: 'B', point: 75 },
  { sat: 1340, act: '', ib: '', aLevel: '', point: 74 },
  { sat: 1330, act: '', ib: '', aLevel: '', point: 73 },
  { sat: 1320, act: 28, ib: 36, aLevel: '', point: 72 },
  { sat: 1310, act: '', ib: '', aLevel: '', point: 71 },
  { sat: 1300, act: '', ib: '', aLevel: '', point: 70 },
  { sat: 1280, act: 27, ib: 35, aLevel: '', point: 69 },
  { sat: 1260, act: '', ib: '', aLevel: '', point: 68 },
  { sat: 1240, act: 26, ib: 34, aLevel: '', point: 67 },
  { sat: 1220, act: '', ib: '', aLevel: '', point: 66 },
  { sat: 1200, act: 25, ib: 33, aLevel: 'C', point: 65 },
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
    const map = { 'A*': 95, A: 85, B: 75, C: 65 };
    return map[score] || 0;
  }

  return 0;
};
