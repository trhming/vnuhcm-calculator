import { useState, useMemo } from 'react';
import { KHU_VUC, DOI_TUONG } from '../constants/common';
import { UEL_ENGLISH_BONUS, UEL_ENGLISH_CONVERSION, convertCCQT } from '../constants/uel';

export const useUelCalculator = () => {
  const [program, setProgram] = useState('CHINH_QUY'); // CHINH_QUY or LIEN_KET
  const [dtXetTuyen, setDtXetTuyen] = useState('DT1'); // DT1, DT2, DT3, DT4

  // Điểm
  const [thpt, setThpt] = useState(['', '', '']);
  const [dgnl, setDgnl] = useState('');
  const [hocBa, setHocBa] = useState(Array(9).fill(''));

  // CCQT
  const [loaiCCQT, setLoaiCCQT] = useState('SAT');
  const [diemCCQT, setDiemCCQT] = useState('');

  // Điểm cộng
  const [hasNgoaiNgu, setHasNgoaiNgu] = useState(false);
  const [loaiNgoaiNgu, setLoaiNgoaiNgu] = useState('IELTS');
  const [diemNgoaiNgu, setDiemNgoaiNgu] = useState('');
  const [diemNgoaiNgu2, setDiemNgoaiNgu2] = useState('');
  const [la149Truong, setLa149Truong] = useState(false);

  // Ưu tiên
  const [kv, setKv] = useState('KV3');
  const [dt, setDt] = useState('NONE');

  const results = useMemo(() => {
    const parseNumber = (val) => {
      const num = parseFloat(val);
      return isNaN(num) ? 0 : num;
    };

    // Chuẩn hóa điểm thang 100
    // THPT (Y)
    let tongThpt = parseNumber(thpt[0]) + parseNumber(thpt[1]) + parseNumber(thpt[2]);
    let Y = (tongThpt / 30) * 100;

    // ĐGNL (X)
    let X = (parseNumber(dgnl) / 1200) * 100;

    // Học bạ (Z)
    let tongTbHocBa = 0;
    for (let i = 0; i < 3; i++) {
      const v10 = parseNumber(hocBa[i * 3]);
      const v11 = parseNumber(hocBa[i * 3 + 1]);
      const v12 = parseNumber(hocBa[i * 3 + 2]);
      tongTbHocBa += (v10 + v11 + v12) / 3;
    }
    let Z = (tongTbHocBa / 30) * 100;

    // Tính ĐHL
    let dhl = 0;
    let textFormula = '';

    if (program === 'CHINH_QUY') {
      if (dtXetTuyen === 'DT1') {
        dhl = (X * 0.55) + (Y * 0.35) + (Z * 0.10);
        textFormula = 'ĐHL = ĐGNL (55%) + THPT (35%) + Học Bạ (10%)';
      } else if (dtXetTuyen === 'DT2') {
        dhl = (Y * 0.55) + (Y * 0.35) + (Z * 0.10);
        textFormula = 'ĐHL = THPT bù ĐGNL (55%) + THPT (35%) + Học Bạ (10%)';
      } else if (dtXetTuyen === 'DT3') {
        dhl = (X * 0.55) + (X * 0.35) + (Z * 0.10);
        textFormula = 'ĐHL = ĐGNL (55%) + ĐGNL bù THPT (35%) + Học Bạ (10%)';
      } else if (dtXetTuyen === 'DT4') {
        dhl = convertCCQT(loaiCCQT, diemCCQT);
        textFormula = `ĐHL = Điểm quy đổi Chứng chỉ Quốc tế (${loaiCCQT})`;
      }
    } else {
      if (dtXetTuyen === 'DT1') {
        dhl = (X * 0.55) + (Y * 0.35) + (Z * 0.10);
        textFormula = 'ĐHL = ĐGNL(55%) + THPT(35%) + Học Bạ(10%)';
      } else if (dtXetTuyen === 'DT2') {
        dhl = (Y * 0.50) + (Z * 0.50);
        textFormula = 'ĐHL = THPT(50%) + Học Bạ(50%)';
      }
    }

    // Điểm cộng (ĐC)
    let nnPoint = 0;
    if (hasNgoaiNgu && loaiNgoaiNgu) {
      const conversionTable = UEL_ENGLISH_CONVERSION[loaiNgoaiNgu];
      if (conversionTable) {
        if (loaiNgoaiNgu === 'TOEIC') {
          const scoreND = parseNumber(diemNgoaiNgu);
          const scoreNV = parseNumber(diemNgoaiNgu2);
          const row = conversionTable.find(r => scoreND >= r.minND && scoreNV >= r.minNV);
          if (row) nnPoint = row.point;
        } else if (diemNgoaiNgu) {
          const score = parseNumber(diemNgoaiNgu);
          const row = conversionTable.find(r => score >= r.min && score <= r.max);
          if (row) nnPoint = row.point;
        }
      }
    }
    const truongUuTienPoint = (program === 'CHINH_QUY' && la149Truong) ? 5.0 : 0;

    const dcGoc = nnPoint + truongUuTienPoint;
    const dcThucNhan = Math.min(dcGoc, 10);

    // Ưu tiên (ƯT)
    const khuvuc = KHU_VUC.find(k => k.id === kv);
    const doituong = DOI_TUONG.find(d => d.id === dt);
    const uuTien30 = (khuvuc ? khuvuc.points : 0) + (doituong ? doituong.points : 0);
    const uuTien100 = (uuTien30 / 3) * 10;

    const tongTam = dhl + dcThucNhan;
    let uuTienThucNhan = uuTien100;
    if (tongTam >= 75) {
      uuTienThucNhan = ((100 - tongTam) / 25) * uuTien100;
      if (uuTienThucNhan < 0) uuTienThucNhan = 0;
    }

    // Tổng điểm
    const total = Math.min(100, dhl + dcThucNhan + uuTienThucNhan);

    return {
      X, Y, Z,
      dhl, textFormula,
      nnPoint, truongUuTienPoint,
      dcGoc, dcThucNhan,
      uuTien100, uuTienThucNhan,
      total
    };
  }, [
    program, dtXetTuyen,
    thpt, dgnl, hocBa,
    loaiCCQT, diemCCQT,
    hasNgoaiNgu, loaiNgoaiNgu, diemNgoaiNgu, diemNgoaiNgu2, la149Truong,
    kv, dt
  ]);

  return {
    state: {
      program, setProgram,
      dtXetTuyen, setDtXetTuyen,
      thpt, setThpt, dgnl, setDgnl, hocBa, setHocBa,
      loaiCCQT, setLoaiCCQT, diemCCQT, setDiemCCQT,
      hasNgoaiNgu, setHasNgoaiNgu, loaiNgoaiNgu, setLoaiNgoaiNgu, diemNgoaiNgu, setDiemNgoaiNgu, diemNgoaiNgu2, setDiemNgoaiNgu2, la149Truong, setLa149Truong,
      kv, setKv, dt, setDt
    },
    results
  };
};
