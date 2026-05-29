import { useMemo, useState } from 'react';
import { KHU_VUC, DOI_TUONG } from '../constants/common';
import { IU_COEFFICIENTS, convertIuEnglishScore } from '../constants/iu';

const parseNumber = (value) => {
  const number = parseFloat(value);
  return Number.isNaN(number) ? 0 : number;
};

const capScore = (value, max) => Math.min(Math.max(value, 0), max);

export const useIuCalculator = () => {
  const [k1, setK1] = useState(35);
  const [k2, setK2] = useState(45);
  const [group, setGroup] = useState('G1_DGNL');

  const [thpt, setThpt] = useState(['', '', '']);
  const [thptQuickTotal, setThptQuickTotal] = useState('');
  const [useEnglishCertificate, setUseEnglishCertificate] = useState(false);
  const [englishType, setEnglishType] = useState('IELTS');
  const [englishScore, setEnglishScore] = useState('');
  const [englishScore2, setEnglishScore2] = useState('');

  const [dgnl, setDgnl] = useState('');
  const [hocBa, setHocBa] = useState(Array(9).fill(''));
  const [hocBaQuickTotal, setHocBaQuickTotal] = useState('');
  const [interview, setInterview] = useState('');

  const [achievementBonus, setAchievementBonus] = useState('');
  const [awardBonus, setAwardBonus] = useState('');
  const [englishBonus, setEnglishBonus] = useState('');

  const [kv, setKv] = useState('KV3');
  const [dt, setDt] = useState('NONE');

  const results = useMemo(() => {
    const k3 = 100 - k1 - k2;
    const k1Ratio = k1 / 100;
    const k2Ratio = k2 / 100;
    const k3Ratio = k3 / 100;

    const englishConvertedScore = convertIuEnglishScore(englishType, englishScore, englishScore2);
    const thptScores = [...thpt];
    if (useEnglishCertificate) {
      thptScores[2] = englishConvertedScore;
    }

    const thptTotal = thptQuickTotal !== ''
      ? capScore(parseNumber(thptQuickTotal), 30)
      : thptScores.reduce((total, value) => total + parseNumber(value), 0);
    const hocBaSubjectAverages = [0, 1, 2].map((subjectIndex) => {
      const startIndex = subjectIndex * 3;
      return (
        parseNumber(hocBa[startIndex]) +
        parseNumber(hocBa[startIndex + 1]) +
        parseNumber(hocBa[startIndex + 2])
      ) / 3;
    });
    const hocBaTotal = hocBaQuickTotal !== ''
      ? capScore(parseNumber(hocBaQuickTotal), 30)
      : hocBaSubjectAverages.reduce((total, value) => total + value, 0);
    const dgnlRaw = parseNumber(dgnl);
    const interviewRaw = parseNumber(interview);

    const thpt100 = (thptTotal / 30) * 100;
    const dgnl100 = (dgnlRaw / 1200) * 100;
    const hocBa100 = (hocBaTotal / 30) * 100;
    const interview100 = capScore(interviewRaw, 100);

    let dhl = 0;
    let formula = '';
    let interpolation = '';

    if (group === 'G1_DGNL') {
      dhl = k1Ratio * thpt100 + k2Ratio * dgnl100 + k3Ratio * hocBa100;
      formula = 'ĐHL = k1 x THPT + k2 x ĐGNL + k3 x Học bạ';
    } else if (group === 'G1_NO_DGNL') {
      const inferredDgnl = IU_COEFFICIENTS.Hs3 * thpt100;
      dhl = k1Ratio * thpt100 + k2Ratio * inferredDgnl + k3Ratio * hocBa100;
      formula = 'ĐHL = k1 x THPT + k2 x ĐGNL nội suy + k3 x Học bạ';
      interpolation = `ĐGNL nội suy = THPT x ${IU_COEFFICIENTS.Hs3}`;
    } else if (group === 'G2_BOTH') {
      const inferredHocBa = IU_COEFFICIENTS.Hs4 * thpt100;
      dhl = k1Ratio * thpt100 + k2Ratio * dgnl100 + k3Ratio * inferredHocBa;
      formula = 'ĐHL = k1 x THPT + k2 x ĐGNL + k3 x Học bạ nội suy';
      interpolation = `Học bạ nội suy = THPT x ${IU_COEFFICIENTS.Hs4}`;
    } else if (group === 'G2_THPT') {
      const inferredDgnl = IU_COEFFICIENTS.Hs3 * thpt100;
      const inferredHocBa = IU_COEFFICIENTS.Hs4 * thpt100;
      dhl = k1Ratio * thpt100 + k2Ratio * inferredDgnl + k3Ratio * inferredHocBa;
      formula = 'ĐHL = k1 x THPT + k2 x ĐGNL nội suy + k3 x Học bạ nội suy';
      interpolation = `ĐGNL = THPT x ${IU_COEFFICIENTS.Hs3}; Học bạ = THPT x ${IU_COEFFICIENTS.Hs4}`;
    } else if (group === 'G2_DGNL') {
      const inferredThpt = IU_COEFFICIENTS.Hs1 * dgnl100;
      const inferredHocBa = IU_COEFFICIENTS.Hs2 * dgnl100;
      dhl = k1Ratio * inferredThpt + k2Ratio * dgnl100 + k3Ratio * inferredHocBa;
      formula = 'ĐHL = k1 x THPT nội suy + k2 x ĐGNL + k3 x Học bạ nội suy';
      interpolation = `THPT = ĐGNL x ${IU_COEFFICIENTS.Hs1}; Học bạ = ĐGNL x ${IU_COEFFICIENTS.Hs2}`;
    } else if (group === 'G3_FOREIGN') {
      const inferredThpt = IU_COEFFICIENTS.Hs5 * hocBa100;
      dhl = k1Ratio * inferredThpt + k2Ratio * interview100 + k3Ratio * hocBa100;
      formula = 'ĐHL = k1 x THPT nội suy + k2 x Phỏng vấn + k3 x Học bạ';
      interpolation = `THPT nội suy = Học bạ x ${IU_COEFFICIENTS.Hs5}`;
    }

    const achievement = parseNumber(achievementBonus);
    const award = parseNumber(awardBonus);
    const english = useEnglishCertificate ? 0 : parseNumber(englishBonus);
    const bonusRaw = achievement + award + english;
    const bonusAccepted = Math.min(bonusRaw, 10);
    const bonusEffective = Math.min(bonusAccepted, Math.max(0, 100 - dhl));

    const khuvuc = KHU_VUC.find((item) => item.id === kv);
    const doituong = DOI_TUONG.find((item) => item.id === dt);
    const priority30 = (khuvuc ? khuvuc.points : 0) + (doituong ? doituong.points : 0);
    const priority100 = (priority30 / 3) * 10;

    const temporaryTotal = dhl + bonusAccepted;
    let priorityAccepted = priority100;
    if (temporaryTotal >= 75) {
      priorityAccepted = ((100 - temporaryTotal) / 25) * priority100;
      if (priorityAccepted < 0) priorityAccepted = 0;
    }

    const total = Math.min(100, dhl + bonusAccepted + priorityAccepted);

    return {
      k3,
      thptTotal,
      hocBaSubjectAverages,
      hocBaTotal,
      thpt100,
      dgnl100,
      hocBa100,
      interview100,
      englishConvertedScore,
      dhl,
      formula,
      interpolation,
      bonusRaw,
      bonusAccepted,
      bonusEffective,
      priority100,
      priorityAccepted,
      total,
    };
  }, [
    k1,
    k2,
    group,
    thpt,
    thptQuickTotal,
    useEnglishCertificate,
    englishType,
    englishScore,
    englishScore2,
    dgnl,
    hocBa,
    hocBaQuickTotal,
    interview,
    achievementBonus,
    awardBonus,
    englishBonus,
    kv,
    dt,
  ]);

  return {
    state: {
      k1, setK1,
      k2, setK2,
      group, setGroup,
      thpt, setThpt, thptQuickTotal, setThptQuickTotal,
      useEnglishCertificate, setUseEnglishCertificate,
      englishType, setEnglishType,
      englishScore, setEnglishScore,
      englishScore2, setEnglishScore2,
      dgnl, setDgnl,
      hocBa, setHocBa, hocBaQuickTotal, setHocBaQuickTotal,
      interview, setInterview,
      achievementBonus, setAchievementBonus,
      awardBonus, setAwardBonus,
      englishBonus, setEnglishBonus,
      kv, setKv,
      dt, setDt,
    },
    results,
  };
};
