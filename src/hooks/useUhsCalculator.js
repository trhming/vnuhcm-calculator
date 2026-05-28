import { useMemo, useState } from 'react';
import { KHU_VUC, DOI_TUONG } from '../constants/common';
import { UHS_LANG_TYPES, roundUhs } from '../constants/uhs';

const parseNumber = (value) => {
  const number = parseFloat(value);
  return Number.isNaN(number) ? 0 : number;
};

export const useUhsCalculator = () => {
  const [a, setA] = useState(40);
  const [b, setB] = useState(35);

  const [dgnl, setDgnl] = useState('');
  const [thpt, setThpt] = useState(['', '', '']);
  const [hocBa, setHocBa] = useState(Array(9).fill(''));

  const [hasLanguage, setHasLanguage] = useState(false);
  const [languageType, setLanguageType] = useState('IELTS');
  const [languageScore, setLanguageScore] = useState('');
  const [languageScore2, setLanguageScore2] = useState('');

  const [hasSat, setHasSat] = useState(false);
  const [satScore, setSatScore] = useState('');

  const [hasSpecialSchool, setHasSpecialSchool] = useState(false);
  const [hasGoodAcademic, setHasGoodAcademic] = useState(false);
  const [hsgAverage, setHsgAverage] = useState('');

  const [kv, setKv] = useState('KV3');
  const [dt, setDt] = useState('NONE');

  const results = useMemo(() => {
    const dgnl100 = roundUhs((parseNumber(dgnl) / 1200) * 100);
    const thptTotal = thpt.reduce((total, value) => total + parseNumber(value), 0);
    const thpt100 = roundUhs((thptTotal / 30) * 100);

    const hocBaSubjectAverages = [0, 1, 2].map((subjectIndex) => {
      const startIndex = subjectIndex * 3;
      return roundUhs((
        parseNumber(hocBa[startIndex]) +
        parseNumber(hocBa[startIndex + 1]) +
        parseNumber(hocBa[startIndex + 2])
      ) / 3);
    });
    const hocBaTotal = roundUhs(hocBaSubjectAverages.reduce((total, value) => total + value, 0));
    const hocBa100 = roundUhs((hocBaTotal / 30) * 100);

    const cWeight = 100 - a - b;
    const dhl = roundUhs(dgnl100 * (a / 100) + thpt100 * (b / 100) + hocBa100 * (cWeight / 100));

    const languageConfig = UHS_LANG_TYPES.find((item) => item.id === languageType);
    let bonusLanguage = 0;
    if (hasLanguage && languageConfig) {
      if (languageType === 'TOEIC') {
        const lr = parseNumber(languageScore);
        const sw = parseNumber(languageScore2);
        if (lr >= languageConfig.minLr && sw >= languageConfig.minSw) {
          bonusLanguage = 3 * ((lr + sw) / languageConfig.max);
        }
      } else {
        const score = parseNumber(languageScore);
        if (score >= languageConfig.min) {
          bonusLanguage = 3 * (score / languageConfig.max);
        }
      }
    }

    let bonusSat = 0;
    const sat = parseNumber(satScore);
    if (hasSat && sat >= 1280) {
      bonusSat = 3 * (sat / 1600);
    }

    let bonusHsg = 0;
    if (hasSpecialSchool && hasGoodAcademic) {
      bonusHsg = 3 * (parseNumber(hsgAverage) / 10);
    }

    const bonusTotal = roundUhs(bonusLanguage + bonusSat + bonusHsg);

    const khuvuc = KHU_VUC.find((item) => item.id === kv);
    const doituong = DOI_TUONG.find((item) => item.id === dt);
    const priority30 = (khuvuc ? khuvuc.points : 0) + (doituong ? doituong.points : 0);
    const priority100 = roundUhs((priority30 / 3) * 10);

    const temporaryTotal = dhl + bonusTotal;
    let priorityAccepted = priority100;
    if (temporaryTotal >= 75) {
      priorityAccepted = roundUhs(((100 - temporaryTotal) / 25) * priority100);
      if (priorityAccepted < 0) priorityAccepted = 0;
    }

    const total = roundUhs(Math.min(100, dhl + bonusTotal + priorityAccepted));

    return {
      dgnl100,
      thptTotal,
      thpt100,
      hocBaSubjectAverages,
      hocBaTotal,
      hocBa100,
      cWeight,
      dhl,
      bonusLanguage: roundUhs(bonusLanguage),
      bonusSat: roundUhs(bonusSat),
      bonusHsg: roundUhs(bonusHsg),
      bonusTotal,
      priority100,
      priorityAccepted,
      total,
    };
  }, [
    dgnl,
    thpt,
    hocBa,
    a,
    b,
    hasLanguage,
    languageType,
    languageScore,
    languageScore2,
    hasSat,
    satScore,
    hasSpecialSchool,
    hasGoodAcademic,
    hsgAverage,
    kv,
    dt,
  ]);

  return {
    state: {
      a, setA,
      b, setB,
      dgnl, setDgnl,
      thpt, setThpt,
      hocBa, setHocBa,
      hasLanguage, setHasLanguage,
      languageType, setLanguageType,
      languageScore, setLanguageScore,
      languageScore2, setLanguageScore2,
      hasSat, setHasSat,
      satScore, setSatScore,
      hasSpecialSchool, setHasSpecialSchool,
      hasGoodAcademic, setHasGoodAcademic,
      hsgAverage, setHsgAverage,
      kv, setKv,
      dt, setDt,
    },
    results,
  };
};
