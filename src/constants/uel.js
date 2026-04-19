export const UEL_ENGLISH_BONUS = [
  { 
    id: 'b5.0', point: 5.0, name: 'Cộng 5.0đ',
    desc: 'IELTS ≥ 6.0 | Linguaskill/B2 ≥ 169 | TOEIC NĐ ≥ 785 | TOEIC NV ≥ 310 | TOEFL iBT ≥ 78' 
  },
  { 
    id: 'b4.7', point: 4.7, name: 'Cộng 4.7đ',
    desc: 'Linguaskill/B2: 168 | TOEIC NĐ: 760-780 | TOEIC NV: 300 | TOEFL iBT: 74-77' 
  },
  { 
    id: 'b4.4', point: 4.4, name: 'Cộng 4.4đ',
    desc: 'Linguaskill/B2: 166-167 | TOEIC NĐ: 735-755 | TOEIC NV: 290 | TOEFL iBT: 70-73' 
  },
  { 
    id: 'b4.1', point: 4.1, name: 'Cộng 4.1đ',
    desc: 'Linguaskill/B2: 164-165 | TOEIC NĐ: 710-730 | TOEFL iBT: 66-69' 
  },
  { 
    id: 'b3.8', point: 3.8, name: 'Cộng 3.8đ',
    desc: 'Linguaskill/B2: 162-163 | TOEIC NĐ: 685-705 | TOEIC NV: 280 | TOEFL iBT: 62-65' 
  },
  { 
    id: 'b3.5', point: 3.5, name: 'Cộng 3.5đ',
    desc: 'IELTS 5.5 | Linguaskill/B2: 160-161 | TOEIC NĐ: 670-680 | TOEIC NV: 270 | TOEFL iBT: 59-61' 
  },
  { 
    id: 'b3.2', point: 3.2, name: 'Cộng 3.2đ',
    desc: 'Linguaskill/B1: 156-159 | TOEIC NĐ: 645-665 | TOEFL iBT: 57-58' 
  },
  { 
    id: 'b2.9', point: 2.9, name: 'Cộng 2.9đ',
    desc: 'Linguaskill/B1: 152-155 | TOEIC NĐ: 620-640 | TOEIC NV: 260 | TOEFL iBT: 54-56' 
  },
  { 
    id: 'b2.6', point: 2.6, name: 'Cộng 2.6đ',
    desc: 'Linguaskill/B1: 148-151 | TOEIC NĐ: 595-615 | TOEFL iBT: 51-53' 
  },
  { 
    id: 'b2.3', point: 2.3, name: 'Cộng 2.3đ',
    desc: 'Linguaskill/B1: 144-147 | TOEIC NĐ: 570-590 | TOEIC NV: 250 | TOEFL iBT: 48-50' 
  },
  { 
    id: 'b2.0', point: 2.0, name: 'Cộng 2.0đ',
    desc: 'IELTS 5.0 | Linguaskill/B1: 140-143 | TOEIC NĐ: 550-565 | TOEIC NV: 240 | TOEFL iBT: 45-47' 
  }
];

export const UEL_ENGLISH_CERT_TYPES = [
  { id: 'IELTS', name: 'IELTS' },
  { id: 'Linguaskill_B1', name: 'Linguaskill (B1)' },
  { id: 'Linguaskill_B2', name: 'Linguaskill (B2)' },
  { id: 'TOEIC', name: 'TOEIC (4 kỹ năng)' },
  { id: 'TOEFL_iBT', name: 'TOEFL iBT' }
];

export const UEL_ENGLISH_CONVERSION = {
  IELTS: [
    { min: 6.0, max: 9.0, point: 5.0 },
    { min: 5.5, max: 5.9, point: 3.5 },
    { min: 5.0, max: 5.4, point: 2.0 },
  ],
  Linguaskill_B2: [
    { min: 169, max: 180, point: 5.0 },
    { min: 168, max: 168, point: 4.7 },
    { min: 166, max: 167, point: 4.4 },
    { min: 164, max: 165, point: 4.1 },
    { min: 162, max: 163, point: 3.8 },
    { min: 160, max: 161, point: 3.5 },
  ],
  Linguaskill_B1: [
    { min: 156, max: 159, point: 3.2 },
    { min: 152, max: 155, point: 2.9 },
    { min: 148, max: 151, point: 2.6 },
    { min: 144, max: 147, point: 2.3 },
    { min: 140, max: 143, point: 2.0 },
  ],
  TOEIC: [
    { minND: 785, minNV: 310, point: 5.0 },
    { minND: 760, minNV: 300, point: 4.7 },
    { minND: 735, minNV: 290, point: 4.4 },
    { minND: 710, minNV: 280, point: 4.1 },
    { minND: 685, minNV: 280, point: 3.8 },
    { minND: 670, minNV: 270, point: 3.5 },
    { minND: 645, minNV: 260, point: 3.2 },
    { minND: 620, minNV: 260, point: 2.9 },
    { minND: 595, minNV: 250, point: 2.6 },
    { minND: 570, minNV: 250, point: 2.3 },
    { minND: 550, minNV: 240, point: 2.0 },
  ],
  TOEFL_iBT: [
    { min: 78, max: 120, point: 5.0 },
    { min: 74, max: 77, point: 4.7 },
    { min: 70, max: 73, point: 4.4 },
    { min: 66, max: 69, point: 4.1 },
    { min: 62, max: 65, point: 3.8 },
    { min: 59, max: 61, point: 3.5 },
    { min: 57, max: 58, point: 3.2 },
    { min: 54, max: 56, point: 2.9 },
    { min: 51, max: 53, point: 2.6 },
    { min: 48, max: 50, point: 2.3 },
    { min: 45, max: 47, point: 2.0 },
  ]
};

export const CCQT_TYPES = [
  { id: 'SAT', name: 'SAT' },
  { id: 'ACT', name: 'ACT' },
  { id: 'IB', name: 'IB' },
  { id: 'A_LEVEL', name: 'A-Level' }
];

export const UEL_CCQT_TABLE = [
  { sat: 1600, act: 36, ib: 42, aLevel: '', point: 100 },
  { sat: 1584, act: '', ib: '', aLevel: '', point: 99 },
  { sat: 1568, act: 35, ib: 41, aLevel: '', point: 98 },
  { sat: 1552, act: '', ib: '', aLevel: '', point: 97 },
  { sat: 1536, act: '', ib: 40, aLevel: '', point: 96 },
  { sat: 1520, act: 34, ib: '', aLevel: 'A*', point: 95 },
  { sat: 1504, act: '', ib: 39, aLevel: '', point: 94 },
  { sat: 1488, act: 33, ib: '', aLevel: '', point: 93 },
  { sat: 1472, act: '', ib: '', aLevel: '', point: 92 },
  { sat: 1456, act: '', ib: 38, aLevel: '', point: 91 },
  { sat: 1440, act: 32, ib: '', aLevel: '', point: 90 },
  { sat: 1424, act: '', ib: 37, aLevel: '', point: 89 },
  { sat: 1408, act: 31, ib: '', aLevel: '', point: 88 },
  { sat: 1392, act: '', ib: '', aLevel: '', point: 87 },
  { sat: 1376, act: 30, ib: 36, aLevel: '', point: 86 },
  { sat: 1360, act: '', ib: '', aLevel: 'A', point: 85 },
  { sat: 1344, act: 29, ib: 35, aLevel: '', point: 84 },
  { sat: 1328, act: '', ib: '', aLevel: '', point: 83 },
  { sat: 1312, act: 28, ib: 34, aLevel: '', point: 82 },
  { sat: 1296, act: 27, ib: '', aLevel: '', point: 81 },
  { sat: 1280, act: '', ib: '', aLevel: '', point: 80 },
  { sat: 1264, act: '', ib: 33, aLevel: '', point: 79 },
  { sat: 1248, act: 26, ib: '', aLevel: '', point: 78 },
  { sat: 1232, act: '', ib: 32, aLevel: '', point: 77 },
  { sat: 1216, act: 25, ib: '', aLevel: '', point: 76 },
  { sat: 1200, act: '', ib: '', aLevel: 'B', point: 75 },
  { sat: 1184, act: 24, ib: 31, aLevel: '', point: 74 },
  { sat: '', act: '', ib: '', aLevel: '', point: 73 },
  { sat: '', act: '', ib: '', aLevel: '', point: 72 },
  { sat: '', act: '', ib: 30, aLevel: '', point: 71 },
  { sat: '', act: '', ib: '', aLevel: '', point: 70 },
  { sat: '', act: '', ib: 29, aLevel: '', point: 69 },
  { sat: '', act: '', ib: '', aLevel: '', point: 68 },
  { sat: '', act: '', ib: 28, aLevel: '', point: 67 },
  { sat: '', act: '', ib: '', aLevel: '', point: 66 },
  { sat: '', act: '', ib: '', aLevel: 'C', point: 65 },
  { sat: '', act: '', ib: 27, aLevel: '', point: 64 },
  { sat: '', act: '', ib: '', aLevel: '', point: 63 },
  { sat: '', act: '', ib: 26, aLevel: '', point: 62 },
];

export const convertCCQT = (type, scoreStr) => {
  if (!scoreStr) return 0;
  
  if (type === 'SAT') {
    const score = parseInt(scoreStr);
    if (isNaN(score)) return 0;
    if (score >= 1600) return 100;
    if (score < 1200) return 0;
    // Mỗi lần giảm 16 điểm SAT thì điểm quy đổi giảm 1đ
    const diff = 1600 - score;
    const reducedPoints = Math.ceil(diff / 16);
    return Math.max(0, 100 - reducedPoints);
  }

  if (type === 'ACT') {
    const score = parseFloat(scoreStr);
    if (isNaN(score)) return 0;
    const map = {
      36: 100, 35: 98, 34: 95, 33: 93, 32: 90, 31: 88, 30: 86,
      29: 84, 28: 82, 27: 81, 26: 78, 25: 76, 24: 74
    };
    return map[Math.floor(score)] || 0;
  }

  if (type === 'IB') {
    const score = parseFloat(scoreStr);
    if (isNaN(score)) return 0;
    const map = {
      42: 100, 41: 98, 40: 96, 39: 94, 38: 91, 37: 89, 36: 86, 35: 84,
      34: 82, 33: 79, 32: 77, 31: 74, 30: 71, 29: 69, 28: 67, 27: 64
    };
    return map[Math.floor(score)] || 0;
  }

  if (type === 'A_LEVEL') {
    const map = {
      'A*': 95, 'A': 85, 'B': 75, 'C': 65
    };
    return map[scoreStr.toUpperCase()] || 0;
  }

  return 0;
};
