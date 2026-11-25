import { useEffect, useState } from 'react';
import {
  SUMMARY_UPDATED_EVENT,
  loadScoresSummary,
  type ScoresSummaryMap,
} from '../utils/calculatorStorage';

export const useScoresSummary = () => {
  const [summary, setSummary] = useState<ScoresSummaryMap>(() => loadScoresSummary());

  useEffect(() => {
    const sync = () => setSummary(loadScoresSummary());
    window.addEventListener(SUMMARY_UPDATED_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(SUMMARY_UPDATED_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  return summary;
};
