import { useState, useMemo } from 'react';
import { convertHcmutEnglish, convertIntlCert } from '../constants/hcmut';
import { KHU_VUC, DOI_TUONG } from '../constants/common';

export const useHcmutCalculator = () => {
  // Trọng số
  const [wNL, setWNL] = useState(0.7);
  const [wTHPT, setWTHPT] = useState(0.2);
  const [wHB, setWHB] = useState(0.1);

  // Điểm thi THPT
  const [thpt, setThpt] = useState(['', '', '']);
  const [isNgoaiNgu, setIsNgoaiNgu] = useState(false);
  const [ngoaiNguType, setNgoaiNguType] = useState('IELTS');
  const [diemNgoaiNgu, setDiemNgoaiNgu] = useState('');
  const [toeicLr, setToeicLr] = useState('');
  const [toeicSw, setToeicSw] = useState('');

  // Điểm Học bạ
  const [hocBa, setHocBa] = useState(Array(9).fill(''));
  
  // Đối tượng dự tuyển
  const [doiTuongUT, setDoiTuongUT] = useState('2.1');
  const [dgnlTv, setDgnlTv] = useState('');
  const [dgnlTa, setDgnlTa] = useState('');
  const [dgnlToan, setDgnlToan] = useState('');
  const [dgnlKh, setDgnlKh] = useState('');
  
  const [intlCertType, setIntlCertType] = useState('SAT');
  const [intlCertScore, setIntlCertScore] = useState('');

  // Ưu tiên & Điểm cộng
  const [kv, setKv] = useState('KV3');
  const [dt, setDt] = useState('NONE');

  const [thuong, setThuong] = useState('');
  const [xetThuong, setXetThuong] = useState('');
  const [khuyenKhich, setKhuyenKhich] = useState('');

  // Tính toán
  const results = useMemo(() => {
    // 1. Ngoại ngữ quy đổi
    let diemNgoaiNguQuyDoi = 0;
    if (isNgoaiNgu && ngoaiNguType && diemNgoaiNgu !== '') {
      if (ngoaiNguType !== 'TOEIC') {
         diemNgoaiNguQuyDoi = convertHcmutEnglish(ngoaiNguType, parseFloat(diemNgoaiNgu) || 0);
      }
    } else if (isNgoaiNgu && ngoaiNguType === 'TOEIC') {
       diemNgoaiNguQuyDoi = convertHcmutEnglish('TOEIC', 0, parseFloat(toeicLr) || 0, parseFloat(toeicSw) || 0);
    }
    
    // 2. Điểm THPT Quy Đổi
    const t0 = parseFloat(thpt[0]) || 0;
    const t1 = parseFloat(thpt[1]) || 0;
    const t2_raw = parseFloat(thpt[2]) || 0;
    const t2 = isNgoaiNgu ? Math.max(t2_raw, diemNgoaiNguQuyDoi) : t2_raw;
    const diemThptQuyDoi = ((t0 * 2) + t1 + t2) / 4 * 10;

    // 3. Điểm Học bạ Quy Đổi
    const tbMon = (subIdx) => {
      const v10 = parseFloat(hocBa[subIdx * 3]) || 0;
      const v11 = parseFloat(hocBa[subIdx * 3 + 1]) || 0;
      const v12 = parseFloat(hocBa[subIdx * 3 + 2]) || 0;
      return (v10 + v11 + v12) / 3;
    };
    const tbToan = tbMon(0);
    const tbM2 = tbMon(1);
    const tbM3 = tbMon(2);
    const diemHbQuyDoi = ((tbToan * 2) + tbM2 + tbM3) / 4 * 10;

    // 4. Điểm Năng Lực
    let diemNangLuc = 0;
    if (doiTuongUT === '2.1') {
      const totalDgnl = (parseFloat(dgnlTv) || 0) + (parseFloat(dgnlTa) || 0) + ((parseFloat(dgnlToan) || 0) * 2) + (parseFloat(dgnlKh) || 0);
      diemNangLuc = totalDgnl / 15;
    } else if (doiTuongUT === '2.2') {
      diemNangLuc = diemThptQuyDoi * 0.75;
    } else if (doiTuongUT === '2.3') {
      diemNangLuc = diemHbQuyDoi;
    } else if (doiTuongUT === '2.4') {
      const certScoreStr = intlCertType === 'ALEVEL' ? intlCertScore : (parseFloat(intlCertScore) || 0);
      diemNangLuc = convertIntlCert(intlCertType, certScoreStr);
    }

    // 5. Chốt Điểm Học Lực (Điểm HL)
    const diemHL = (wNL * diemNangLuc) + (wTHPT * diemThptQuyDoi) + (wHB * diemHbQuyDoi);

    // 6. Điểm Cộng (Max 10)
    const tThuong = parseFloat(thuong) || 0;
    const tXetThuong = parseFloat(xetThuong) || 0;
    const tKhuyenKhich = parseFloat(khuyenKhich) || 0;
    let tongCongGoc = tThuong + tXetThuong + tKhuyenKhich;
    tongCongGoc = Math.min(tongCongGoc, 10);
    
    let congThucNhan = tongCongGoc;
    if (diemHL + tongCongGoc >= 100) {
      congThucNhan = Math.max(0, 100 - diemHL);
    }

    // 7. Điểm Ưu Tiên
    const khuvuc = KHU_VUC.find(k => k.id === kv);
    const doituong = DOI_TUONG.find(d => d.id === dt);
    const uuTien30 = (khuvuc ? khuvuc.points : 0) + (doituong ? doituong.points : 0);
    const uuTienQuyDoi = (uuTien30 / 3) * 10;

    let tongTam = diemHL + congThucNhan;
    let uuTienThucNhan = uuTienQuyDoi;
    if (tongTam >= 75) {
      uuTienThucNhan = ((100 - tongTam) / 25) * uuTienQuyDoi;
      if (uuTienThucNhan < 0) uuTienThucNhan = 0;
    }

    // 8. Tổng Điểm Cuối Cùng
    const total = Math.min(100, diemHL + congThucNhan + uuTienThucNhan);

    return {
      diemNgoaiNguQuyDoi,
      diemThptQuyDoi,
      diemHbQuyDoi,
      diemNangLuc,
      diemHL,
      tongCongGoc,
      congThucNhan,
      uuTienQuyDoi,
      uuTienThucNhan,
      total
    };
  }, [wNL, wTHPT, wHB, thpt, isNgoaiNgu, ngoaiNguType, diemNgoaiNgu, toeicLr, toeicSw, hocBa, doiTuongUT, dgnlTv, dgnlTa, dgnlToan, dgnlKh, intlCertType, intlCertScore, kv, dt, thuong, xetThuong, khuyenKhich]);

  return {
    state: {
      wNL, setWNL, wTHPT, setWTHPT, wHB, setWHB,
      thpt, setThpt,
      isNgoaiNgu, setIsNgoaiNgu, ngoaiNguType, setNgoaiNguType, diemNgoaiNgu, setDiemNgoaiNgu, toeicLr, setToeicLr, toeicSw, setToeicSw,
      hocBa, setHocBa,
      doiTuongUT, setDoiTuongUT, 
      dgnlTv, setDgnlTv, dgnlTa, setDgnlTa, dgnlToan, setDgnlToan, dgnlKh, setDgnlKh,
      intlCertType, setIntlCertType, intlCertScore, setIntlCertScore,
      kv, setKv, dt, setDt,
      thuong, setThuong, xetThuong, setXetThuong, khuyenKhich, setKhuyenKhich
    },
    results
  };
};
