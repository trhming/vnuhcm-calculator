import { SCHOOLS } from '../constants/common';
import type { SchoolId } from '../constants/schoolUiMeta';

export const SUMMARY_UPDATED_EVENT = 'vnuhcm-summary-updated';
export const SNAPSHOTS_UPDATED_EVENT = 'vnuhcm-snapshots-updated';

const CALC_PREFIX = 'vnuhcm_calc_v1_';
const SUMMARY_KEY = 'vnuhcm_scores_summary_v1';
const LEGACY_SHARED_KEY = 'vnuhcm_shared_profile_v1';

const CALCULATOR_SCHOOL_IDS: SchoolId[] = ['hcmus', 'hcmut', 'uel', 'hcmussh', 'iu', 'uhs'];

export type SchoolScoreSummary = {
  total: number;
  base30?: number;
  updatedAt: number;
};

export type ScoresSummaryMap = Partial<Record<SchoolId, SchoolScoreSummary>>;

export type QuickScoreSnapshot = {
  value: string;
  scale: 10 | 30;
};

export type SchoolImportSource = {
  schoolId: SchoolId;
  acronym: string;
  hocBa?: string[];
  hocBaQuick?: QuickScoreSnapshot;
  thpt?: string[];
  thptQuick?: QuickScoreSnapshot;
  dgnl1200?: string;
  kv?: string;
  dt?: string;
  preview: string;
};

const safeParse = <T>(raw: string | null, fallback: T): T => {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

const asStringArray = (value: unknown, expectedLength: number): string[] | undefined => {
  if (!Array.isArray(value) || value.length !== expectedLength) return undefined;
  if (!value.every((item) => typeof item === 'string')) return undefined;
  return value.some((item) => item !== '') ? [...value] : undefined;
};

const asNonEmptyString = (value: unknown): string | undefined => {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed !== '' ? trimmed : undefined;
};

export const loadSchoolSnapshot = (schoolId: SchoolId): Record<string, unknown> | null => {
  if (typeof window === 'undefined') return null;
  try {
    const parsed = safeParse<Record<string, unknown> | null>(
      localStorage.getItem(`${CALC_PREFIX}${schoolId}`),
      null
    );
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    return null;
  }
};

export const saveSchoolSnapshot = (schoolId: SchoolId, snapshot: Record<string, unknown>) => {
  if (typeof window === 'undefined') return;
  try {
    const key = `${CALC_PREFIX}${schoolId}`;
    const nextJson = JSON.stringify(snapshot);
    if (localStorage.getItem(key) === nextJson) return;
    localStorage.setItem(key, nextJson);
    window.dispatchEvent(new CustomEvent(SNAPSHOTS_UPDATED_EVENT));
  } catch {
    // Ignore quota or storage restriction errors
  }
};

export const clearSchoolSnapshot = (schoolId: SchoolId) => {
  if (typeof window === 'undefined') return;
  try {
    const key = `${CALC_PREFIX}${schoolId}`;
    if (localStorage.getItem(key) === null) return;
    localStorage.removeItem(key);
    window.dispatchEvent(new CustomEvent(SNAPSHOTS_UPDATED_EVENT));
  } catch {
    // Ignore storage restriction errors
  }
};

export const loadScoresSummary = (): ScoresSummaryMap => {
  if (typeof window === 'undefined') return {};
  try {
    const parsed = safeParse<ScoresSummaryMap>(localStorage.getItem(SUMMARY_KEY), {});
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
};

export const updateSchoolSummary = (
  schoolId: SchoolId,
  summary: SchoolScoreSummary | null
) => {
  if (typeof window === 'undefined') return;
  try {
    const current = loadScoresSummary();
    if (summary === null) {
      if (!(schoolId in current)) return;
      delete current[schoolId];
    } else {
      const existing = current[schoolId];
      if (
        existing &&
        Math.abs(existing.total - summary.total) < 1e-6 &&
        existing.base30 === summary.base30
      ) {
        return;
      }
      current[schoolId] = summary;
    }
    localStorage.setItem(SUMMARY_KEY, JSON.stringify(current));
    window.dispatchEvent(new CustomEvent(SUMMARY_UPDATED_EVENT));
  } catch {
    // Ignore storage restriction errors
  }
};

export const listImportSources = (excludeSchoolId: SchoolId): SchoolImportSource[] => {
  if (typeof window === 'undefined') return [];

  const sources: SchoolImportSource[] = [];

  for (const candidateId of CALCULATOR_SCHOOL_IDS) {
    if (candidateId === excludeSchoolId) continue;
    const snapshot = loadSchoolSnapshot(candidateId);
    if (!snapshot) continue;

    const schoolMeta = SCHOOLS.find((school) => school.id === candidateId);
    const acronym = schoolMeta?.acronym || candidateId.toUpperCase();

    const hocBa = asStringArray(snapshot.hocBa, 9);
    const hocBaQuickRaw =
      candidateId === 'hcmut'
        ? asNonEmptyString(snapshot.hocBaQuickAverage)
        : asNonEmptyString(snapshot.hocBaQuickTotal);
    const hocBaQuick: QuickScoreSnapshot | undefined = !hocBa && hocBaQuickRaw
      ? { value: hocBaQuickRaw, scale: candidateId === 'hcmut' ? 10 : 30 }
      : undefined;

    const thpt = asStringArray(snapshot.thpt, 3);
    const thptQuickRaw = asNonEmptyString(snapshot.thptQuickTotal);
    const thptQuick: QuickScoreSnapshot | undefined = !thpt && thptQuickRaw
      ? { value: thptQuickRaw, scale: candidateId === 'hcmut' ? 10 : 30 }
      : undefined;

    const isUhsMissingDgnl = candidateId === 'uhs' && snapshot.missingMode === 'MISSING_DGNL';
    const dgnl1200 =
      candidateId !== 'hcmut' && !isUhsMissingDgnl
        ? asNonEmptyString(snapshot.dgnl)
        : undefined;

    const kv = asNonEmptyString(snapshot.kv);
    const dt = asNonEmptyString(snapshot.dt);
    const hasCustomPriority = Boolean((kv && kv !== 'KV3') || (dt && dt !== 'NONE'));

    const hasScoreData = Boolean(hocBa || hocBaQuick || thpt || thptQuick || dgnl1200);
    if (!hasScoreData && !hasCustomPriority) continue;

    const previewParts: string[] = [];
    if (hocBa) {
      const filledCount = hocBa.filter((item) => item !== '').length;
      previewParts.push(`HB ${filledCount}/9 ô`);
    } else if (hocBaQuick) {
      previewParts.push(`HB ${hocBaQuick.value}/${hocBaQuick.scale}`);
    }

    if (thpt) {
      previewParts.push(`THPT ${thpt.map((item) => (item !== '' ? item : '–')).join(' / ')}`);
    } else if (thptQuick) {
      previewParts.push(`THPT ${thptQuick.value}/${thptQuick.scale}`);
    }

    if (dgnl1200) {
      previewParts.push(`ĐGNL ${dgnl1200}`);
    }

    if (previewParts.length === 0 && hasCustomPriority) {
      const priorityLabels = [kv && kv !== 'KV3' ? kv : null, dt && dt !== 'NONE' ? dt : null].filter(Boolean);
      previewParts.push(priorityLabels.join(', '));
    }

    sources.push({
      schoolId: candidateId,
      acronym,
      hocBa,
      hocBaQuick,
      thpt,
      thptQuick,
      dgnl1200,
      kv,
      dt,
      preview: previewParts.join(' · '),
    });
  }

  return sources;
};

export const clearAllCalculatorData = () => {
  if (typeof window === 'undefined') return;
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(CALC_PREFIX)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key));
    localStorage.removeItem(SUMMARY_KEY);
    localStorage.removeItem(LEGACY_SHARED_KEY);
    window.dispatchEvent(new CustomEvent(SUMMARY_UPDATED_EVENT));
    window.dispatchEvent(new CustomEvent(SNAPSHOTS_UPDATED_EVENT));
  } catch {
    // Ignore storage restriction errors
  }
};
