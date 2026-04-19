import { useState, useMemo } from 'react';
import { KHU_VUC, DOI_TUONG } from '../constants/common';

export const useUsshCalculator = () => {
  // Điểm thi THPT
  const [thpt, setThpt] = useState(['', '', '']);
  
  // Điểm ĐGNL
  const [dgnl, setDgnl] = useState('');
  
  // Điểm Học bạ
  const [hocBa, setHocBa] = useState(Array(9).fill(''));
  
  // Ưu tiên & Điểm cộng
  const [kv, setKv] = useState('KV3');
  const [dt, setDt] = useState('NONE');
  const [thanhTich, setThanhTich] = useState('');

  const results = useMemo(() => {
    // 1. Chuẩn hóa về thang 100
    // THPT_100
    const t0 = parseFloat(thpt[0]);
    const t1 = parseFloat(thpt[1]);
    const t2 = parseFloat(thpt[2]);
    let thpt100 = 0;
    let hasThpt = false;
    if (!isNaN(t0) && !isNaN(t1) && !isNaN(t2)) {
      thpt100 = ((t0 + t1 + t2) / 30) * 100;
      hasThpt = true;
    }

    // ĐGNL_100
    const d = parseFloat(dgnl);
    let dgnl100 = 0;
    let hasDgnl = false;
    if (!isNaN(d)) {
      dgnl100 = (d / 1200) * 100;
      hasDgnl = true;
    }

    // HB_100
    let hb100 = 0;
    let hasHb = true;
    const tbMon = [];
    for (let i = 0; i < 3; i++) {
      const v10 = parseFloat(hocBa[i * 3]);
      const v11 = parseFloat(hocBa[i * 3 + 1]);
      const v12 = parseFloat(hocBa[i * 3 + 2]);
      if (isNaN(v10) || isNaN(v11) || isNaN(v12)) {
        hasHb = false;
        break;
      }
      tbMon.push((v10 + v11 + v12) / 3);
    }
    
    if (hasHb) {
      hb100 = ((tbMon[0] + tbMon[1] + tbMon[2]) / 30) * 100;
    }

    // 2. Kịch bản tính Điểm Học Lực (ĐHL)
    let dhlAll = null;
    let dhl1 = null;
    let dhl2 = null;

    if (hasThpt && hasDgnl && hasHb) {
      dhlAll = (0.45 * thpt100) + (0.45 * dgnl100) + (0.10 * hb100);
    }
    
    if (hasThpt && hasHb) {
      dhl1 = (0.90 * thpt100) + (0.10 * hb100);
    }
    
    if (hasDgnl && hasHb) {
      dhl2 = (0.90 * dgnl100) + (0.10 * hb100);
    }

    let dhlThucTe = 0;
    let selectedScenario = 'none';
    
    const maxDhl = Math.max(dhlAll || 0, dhl1 || 0, dhl2 || 0);
    
    if (maxDhl > 0) {
      dhlThucTe = maxDhl;
      if (dhlThucTe === dhlAll) selectedScenario = 'all';
      else if (dhlThucTe === dhl1) selectedScenario = '1';
      else if (dhlThucTe === dhl2) selectedScenario = '2';
    }

    // 3. Điểm Cộng Thành Tích
    const dcGoc = Math.min(parseFloat(thanhTich) || 0, 10);
    let dcThucNhan = dcGoc;
    
    if (dhlThucTe + dcGoc >= 100) {
      dcThucNhan = Math.max(0, 100 - dhlThucTe);
    }

    // 4. Ưu tiên
    const khuvuc = KHU_VUC.find(k => k.id === kv);
    const doituong = DOI_TUONG.find(d => d.id === dt);
    const uuTien30 = (khuvuc ? khuvuc.points : 0) + (doituong ? doituong.points : 0);
    const uuTien100 = (uuTien30 / 3) * 10;

    const tongTam = dhlThucTe + dcThucNhan;
    let uuTienThucNhan = uuTien100;
    
    if (tongTam >= 75) {
      uuTienThucNhan = ((100 - tongTam) / 25) * uuTien100;
      if (uuTienThucNhan < 0) uuTienThucNhan = 0;
    }

    // 5. Chốt Tổng Điểm
    const total = Math.min(100, dhlThucTe + dcThucNhan + uuTienThucNhan);

    return {
      thpt100, dgnl100, hb100,
      dhlAll, dhl1, dhl2,
      dhlThucTe, selectedScenario,
      dcGoc, dcThucNhan,
      uuTien100, uuTienThucNhan, total
    };
  }, [thpt, dgnl, hocBa, kv, dt, thanhTich]);

  return {
    state: {
      thpt, setThpt,
      dgnl, setDgnl,
      hocBa, setHocBa,
      kv, setKv, dt, setDt,
      thanhTich, setThanhTich
    },
    results
  };
};
