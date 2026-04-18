import { useState, useMemo } from 'react';
import { KHU_VUC, DOI_TUONG, NGOAI_NGU_CONVERSION } from '../constants/hcmus';

export const useHcmusCalculator = () => {
  // Trọng số
  const [w1, setW1] = useState(0.7);
  const [w3, setW3] = useState(0.7);
  
  // Học bạ (3 môn, 3 lớp)
  // Khởi tạo mảng 9 phần tử rỗng
  const [hocBa, setHocBa] = useState(Array(9).fill(''));
  
  // Điểm thi THPT
  const [thpt, setThpt] = useState(['', '', '']);
  
  // Ngoại ngữ
  const [isNgoaiNgu, setIsNgoaiNgu] = useState(false);
  const [chungChiType, setChungChiType] = useState('IELTS');
  const [diemChungChi, setDiemChungChi] = useState('');

  // ĐGNL
  const [dgnl, setDgnl] = useState('');
  const [maxDgnl, setMaxDgnl] = useState('1200');
  
  // Ưu tiên
  const [kv, setKv] = useState(KHU_VUC[0].id);
  const [dt, setDt] = useState(DOI_TUONG[0].id);
  const [khuyenKhich, setKhuyenKhich] = useState('');

  const calculateResults = useMemo(() => {
    const parseNumber = (val) => {
      const num = parseFloat(val);
      return isNaN(num) ? 0 : num;
    };

    // --- XỬ LÝ ĐIỂM HỌC BẠ ---
    // hocBaStatus: 1 (Hợp lệ), 2 (Có nội suy), 3 (Không hợp lệ)
    let hocBaStatus = 1;
    let interpolatedHocBa = [...hocBa];
    let tongHocBa = 0;

    for (let subj = 0; subj < 3; subj++) {
      const idx10 = subj * 3;
      const idx11 = subj * 3 + 1;
      const idx12 = subj * 3 + 2;

      const p10_raw = hocBa[idx10];
      const p11_raw = hocBa[idx11];
      const p12_raw = hocBa[idx12];

      const p11 = p11_raw !== '' ? parseNumber(p11_raw) : null;
      const p12 = p12_raw !== '' ? parseNumber(p12_raw) : null;

      // TH3: Khuyết Lớp 11 hoặc Lớp 12
      if (p11 === null || p12 === null) {
        hocBaStatus = 3;
        continue; // Bỏ qua môn này, tiếp tục quét môn khác để tính nội suy (nếu có)
      }

      let p10;
      if (p10_raw === '') {
        // TH2: Khuyết Lớp 10 nhưng có L11, L12 -> Nội suy
        if (hocBaStatus === 1) hocBaStatus = 2;
        p10 = (p11 + p12) / 2;
        interpolatedHocBa[idx10] = p10.toFixed(2); // Dùng cho UI
      } else {
        p10 = parseNumber(p10_raw);
      }

      const tbMon = (p10 + p11 + p12) / 3;
      tongHocBa += tbMon;
    }

    // Nếu không hợp lệ, ép tổng học bạ về 0
    if (hocBaStatus === 3) {
      tongHocBa = 0;
    }
    tongHocBa = Math.min(30, tongHocBa);

    // --- XỬ LÝ NGOẠI NGỮ & THPT ---
    let diemNgoaiNguQuyDoi = 0;
    if (isNgoaiNgu && diemChungChi !== '') {
      const score = parseNumber(diemChungChi);
      const conversionTable = NGOAI_NGU_CONVERSION[chungChiType];
      if (conversionTable) {
        const row = conversionTable.find(r => score >= r.min && score <= r.max);
        if (row) diemNgoaiNguQuyDoi = row.point;
      }
    }

    const m1 = parseNumber(thpt[0]);
    const m2 = parseNumber(thpt[1]);
    let m3 = parseNumber(thpt[2]);

    if (isNgoaiNgu) {
      m3 = Math.max(m3, diemNgoaiNguQuyDoi);
    }
    
    let tongTHPT = Math.min(30, m1 + m2 + m3);

    // --- ĐGNL ---
    const diemDGNL = parseNumber(dgnl);
    const maxD = parseNumber(maxDgnl) || 1200;
    const dgnlChuanHoa = Math.min(30, (diemDGNL / maxD) * 30);

    // B. Tính Điểm Học lực
    const w2 = 1 - w1;
    const w4 = 1 - w3;
    
    let diemHL1 = (w1 * tongTHPT) + (w2 * tongHocBa);
    let diemHL2 = (w3 * dgnlChuanHoa) + (w4 * tongHocBa);
    
    if (hocBaStatus === 3) {
      diemHL1 = 0;
      diemHL2 = 0;
    }

    const diemHLThucTe = Math.max(diemHL1, diemHL2);
    const branchSelected = diemHL1 > diemHL2 ? 1 : (diemHL2 > diemHL1 ? 2 : 0);

    // 1. Tính Khuyến khích (Cộng cơ sở) trước
    const congGoc = Math.min(1.5, parseNumber(khuyenKhich));
    let congThuc = congGoc;
    if (diemHLThucTe > 28.5) {
      congThuc = ((30 - diemHLThucTe) / 1.5) * congGoc;
    }

    // 2. Tổng điểm đạt được = Điểm học lực + Điểm khuyến khích
    const tongDiemDatDuoc = diemHLThucTe + congThuc;

    // 3. Công thức Ưu tiên (KV & ĐT)
    const kvPoint = KHU_VUC.find(k => k.id === kv)?.points || 0;
    const dtPoint = DOI_TUONG.find(d => d.id === dt)?.points || 0;
    const uuTienGoc = kvPoint + dtPoint;
    
    let uuTienThuc = uuTienGoc;
    if (tongDiemDatDuoc >= 22.5) {
      uuTienThuc = Math.max(0, ((30 - tongDiemDatDuoc) / 7.5) * uuTienGoc);
    }

    // D. Tổng điểm
    const base30 = Math.min(30, diemHLThucTe + uuTienThuc + congThuc);
    const base100 = (base30 / 30) * 100;

    return {
      hocBaStatus,
      interpolatedHocBa,
      tongHocBa,
      diemNgoaiNguQuyDoi,
      tongTHPT,
      dgnlChuanHoa,
      diemHL1,
      diemHL2,
      diemHLThucTe,
      branchSelected,
      uuTienGoc,
      uuTienThuc,
      congGoc,
      congThuc,
      base30,
      base100
    };
  }, [w1, w3, hocBa, thpt, dgnl, maxDgnl, kv, dt, khuyenKhich, isNgoaiNgu, chungChiType, diemChungChi]);

  return {
    state: {
      w1, setW1, w3, setW3,
      hocBa, setHocBa,
      thpt, setThpt,
      isNgoaiNgu, setIsNgoaiNgu, chungChiType, setChungChiType, diemChungChi, setDiemChungChi,
      dgnl, setDgnl, maxDgnl, setMaxDgnl,
      kv, setKv, dt, setDt, khuyenKhich, setKhuyenKhich
    },
    results: calculateResults
  };
};
