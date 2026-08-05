import { useMemo, useState } from 'react';
import { KHU_VUC, DOI_TUONG } from '../constants/common';
import { UHS_LANG_TYPES, roundUhs } from '../constants/uhs';

const parseNumber = (value) => {
  const number = parseFloat(value);
  return Number.isNaN(number) ? 0 : number;
};

export const useUhsCalculator = () => {
  const [w1, setW1State] = useState(35);
  const [w2, setW2State] = useState(45);
  const w3 = 20;

  const setW1 = (val) => {
    const num = Math.min(35, Math.max(30, parseNumber(val)));
    setW1State(num);
    setW2State(80 - num);
  };

  const setW2 = (val) => {
    const num = Math.min(50, Math.max(45, parseNumber(val)));
    setW2State(num);
    setW1State(80 - num);
  };

  const [missingMode, setMissingMode] = useState('FULL');

  const [dgnl, setDgnl] = useState('');
  const [thpt, setThpt] = useState(['', '', '']);
  const [thptQuickTotal, setThptQuickTotal] = useState('');
  const [hocBa, setHocBa] = useState(Array(9).fill(''));
  const [hocBaQuickTotal, setHocBaQuickTotal] = useState('');

  const [hasLanguage, setHasLanguage] = useState(false);
  const [languageType, setLanguageType] = useState('IELTS');
  const [languageScore, setLanguageScore] = useState('');
  const [languageScore2, setLanguageScore2] = useState('');

  const [hasSat, setHasSat] = useState(false);
  const [satScore, setSatScore] = useState('');

  const [hasHsg, setHasHsg] = useState(false);
  const [hsgAverage, setHsgAverage] = useState('');

  const [kv, setKv] = useState('KV3');
  const [dt, setDt] = useState('NONE');

  const results = useMemo(() => {
    const rawThptTotal = thptQuickTotal !== ''
      ? roundUhs(Math.min(30, parseNumber(thptQuickTotal)))
      : thpt.reduce((total, value) => total + parseNumber(value), 0);
    let thpt100 = roundUhs((rawThptTotal / 30) * 100);

    const rawDgnl = parseNumber(dgnl);
    let dgnl100 = roundUhs((rawDgnl / 1200) * 100);

    let isDgnlConverted = false;
    let isThptConverted = false;

    if (missingMode === 'MISSING_DGNL') {
      dgnl100 = roundUhs(thpt100 * 0.87);
      isDgnlConverted = true;
    } else if (missingMode === 'MISSING_THPT') {
      thpt100 = roundUhs(Math.min(100, dgnl100 * 1.15));
      isThptConverted = true;
    }

    const thptTotalDisplay = isThptConverted ? roundUhs((thpt100 / 100) * 30) : rawThptTotal;
    const dgnlTotalDisplay = isDgnlConverted ? Math.round((dgnl100 / 100) * 1200) : rawDgnl;

    const hocBaSubjectAverages = [0, 1, 2].map((subjectIndex) => {
      const startIndex = subjectIndex * 3;
      return roundUhs((
        parseNumber(hocBa[startIndex]) +
        parseNumber(hocBa[startIndex + 1]) +
        parseNumber(hocBa[startIndex + 2])
      ) / 3);
    });
    const hocBaTotal = hocBaQuickTotal !== ''
      ? roundUhs(Math.min(30, parseNumber(hocBaQuickTotal)))
      : roundUhs(hocBaSubjectAverages.reduce((total, value) => total + value, 0));
    const hocBa100 = roundUhs((hocBaTotal / 30) * 100);

    const dhl = roundUhs(
      thpt100 * (w1 / 100) +
      dgnl100 * (w2 / 100) +
      hocBa100 * (w3 / 100)
    );

    const languageConfig = UHS_LANG_TYPES.find((item) => item.id === languageType);
    let bonusLanguage = 0;
    if (hasLanguage && languageConfig) {
      if (languageType === 'TOEIC') {
        const lr = parseNumber(languageScore);
        const sw = parseNumber(languageScore2);
        if (lr >= languageConfig.minLr && sw >= languageConfig.minSw) {
          bonusLanguage = 5 * ((lr + sw) / languageConfig.max);
        }
      } else {
        const score = parseNumber(languageScore);
        if (score >= languageConfig.min) {
          bonusLanguage = 5 * (score / languageConfig.max);
        }
      }
    }

    let bonusSat = 0;
    const sat = parseNumber(satScore);
    if (hasSat && sat >= 1280) {
      bonusSat = 5 * (sat / 1600);
    }

    const bonusLangSatTotal = Math.min(5, bonusLanguage + bonusSat);

    let bonusHsg = 0;
    if (hasHsg) {
      bonusHsg = 5 * (parseNumber(hsgAverage) / 10);
    }

    const bonusTotal = roundUhs(bonusLangSatTotal + bonusHsg);
    const bonusEffective = roundUhs(Math.min(bonusTotal, Math.max(0, 100 - dhl)));

    const khuvuc = KHU_VUC.find((item) => item.id === kv);
    const doituong = DOI_TUONG.find((item) => item.id === dt);
    const priority30 = (khuvuc ? khuvuc.points : 0) + (doituong ? doituong.points : 0);
    const priority100 = roundUhs((priority30 / 3) * 10);

    const temporaryTotal = dhl + bonusEffective;
    let priorityAccepted = priority100;
    if (temporaryTotal >= 75) {
      priorityAccepted = roundUhs(((100 - temporaryTotal) / 25) * priority100);
      if (priorityAccepted < 0) priorityAccepted = 0;
    }

    const total = roundUhs(Math.min(100, dhl + bonusEffective + priorityAccepted));

    return {
      w1,
      w2,
      w3,
      dgnl100,
      dgnlTotalDisplay,
      isDgnlConverted,
      thptTotal: thptTotalDisplay,
      thpt100,
      isThptConverted,
      hocBaSubjectAverages,
      hocBaTotal,
      hocBa100,
      cWeight: w3,
      dhl,
      bonusLanguage: roundUhs(bonusLanguage),
      bonusSat: roundUhs(bonusSat),
      bonusHsg: roundUhs(bonusHsg),
      bonusTotal,
      bonusEffective,
      priority100,
      priorityAccepted,
      total,
    };
  }, [
    w1,
    w2,
    w3,
    missingMode,
    dgnl,
    thpt,
    thptQuickTotal,
    hocBa,
    hocBaQuickTotal,
    hasLanguage,
    languageType,
    languageScore,
    languageScore2,
    hasSat,
    satScore,
    hasHsg,
    hsgAverage,
    kv,
    dt,
  ]);

  return {
    state: {
      w1, setW1,
      w2, setW2,
      w3,
      a: w2, setA: setW2,
      b: w1, setB: setW1,
      missingMode, setMissingMode,
      dgnl, setDgnl,
      thpt, setThpt, thptQuickTotal, setThptQuickTotal,
      hocBa, setHocBa, hocBaQuickTotal, setHocBaQuickTotal,
      hasLanguage, setHasLanguage,
      languageType, setLanguageType,
      languageScore, setLanguageScore,
      languageScore2, setLanguageScore2,
      hasSat, setHasSat,
      satScore, setSatScore,
      hasHsg, setHasHsg,
      hasSpecialSchool: hasHsg, setHasSpecialSchool: setHasHsg,
      hasGoodAcademic: hasHsg, setHasGoodAcademic: setHasHsg,
      hsgAverage, setHsgAverage,
      kv, setKv,
      dt, setDt,
    },
    results,
  };
};
