import { SCHOOLS } from '../constants/common';
import type { SchoolId } from '../constants/schoolUiMeta';

export const SUMMARY_UPDATED_EVENT = 'vnuhcm-summary-updated';
export const SNAPSHOTS_UPDATED_EVENT = 'vnuhcm-snapshots-updated';
export const PRESETS_UPDATED_EVENT = 'vnuhcm-presets-updated';

const CALC_PREFIX = 'vnuhcm_calc_v1_';
const PRESET_PREFIX = 'vnuhcm_presets_v1_';
const SUMMARY_KEY = 'vnuhcm_scores_summary_v1';
const LEGACY_SHARED_KEY = 'vnuhcm_shared_profile_v1';
const MAX_SCHOOL_PRESETS = 5;

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
  hasSkippedQuick?: boolean;
  hasSkippedDgnl?: boolean;
  preview: string;
};

export type CalculatorBackup = {
  snapshots: Record<string, string>;
  summaryRaw: string | null;
};

export type SchoolPreset = {
  id: string;
  name: string;
  total: number;
  base30?: number;
  snapshot: Record<string, unknown>;
  savedAt: number;
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

export const listImportSources = (targetSchoolId: SchoolId): SchoolImportSource[] => {
  if (typeof window === 'undefined') return [];

  const sources: SchoolImportSource[] = [];

  for (const candidateId of CALCULATOR_SCHOOL_IDS) {
    if (candidateId === targetSchoolId) continue;
    const snapshot = loadSchoolSnapshot(candidateId);
    if (!snapshot) continue;

    const schoolMeta = SCHOOLS.find((school) => school.id === candidateId);
    const acronym = schoolMeta?.acronym || candidateId.toUpperCase();
    const isCrossHcmut = candidateId === 'hcmut' || targetSchoolId === 'hcmut';

    const hocBaQuickRaw =
      candidateId === 'hcmut'
        ? asNonEmptyString(snapshot.hocBaQuickAverage)
        : asNonEmptyString(snapshot.hocBaQuickTotal);
    const hocBa = !hocBaQuickRaw ? asStringArray(snapshot.hocBa, 9) : undefined;
    const hocBaQuick: QuickScoreSnapshot | undefined =
      !isCrossHcmut && !hocBa && hocBaQuickRaw
        ? { value: hocBaQuickRaw, scale: 30 }
        : undefined;

    const isUhsMissingThpt = candidateId === 'uhs' && snapshot.missingMode === 'MISSING_THPT';
    const thptQuickRaw = !isUhsMissingThpt
      ? asNonEmptyString(snapshot.thptQuickTotal)
      : undefined;
    const thpt =
      !isUhsMissingThpt && !thptQuickRaw ? asStringArray(snapshot.thpt, 3) : undefined;
    const thptQuick: QuickScoreSnapshot | undefined =
      !isCrossHcmut && !thpt && thptQuickRaw
        ? { value: thptQuickRaw, scale: 30 }
        : undefined;

    const isUhsMissingDgnl = candidateId === 'uhs' && snapshot.missingMode === 'MISSING_DGNL';
    const hcmutDgnlQuickRaw =
      candidateId === 'hcmut' ? asNonEmptyString(snapshot.dgnlQuickTotal) : undefined;
    const rawNonHcmutDgnl =
      candidateId !== 'hcmut' && !isUhsMissingDgnl
        ? asNonEmptyString(snapshot.dgnl)
        : undefined;

    let dgnl1200: string | undefined;
    if (targetSchoolId !== 'hcmut') {
      if (candidateId === 'hcmut') {
        if (
          (snapshot.doiTuongUT === undefined || snapshot.doiTuongUT === '2.1') &&
          !hcmutDgnlQuickRaw
        ) {
          const tvRaw = asNonEmptyString(snapshot.dgnlTv);
          const taRaw = asNonEmptyString(snapshot.dgnlTa);
          const toanRaw = asNonEmptyString(snapshot.dgnlToan);
          const khRaw = asNonEmptyString(snapshot.dgnlKh);
          if (tvRaw && taRaw && toanRaw && khRaw) {
            const tv = parseFloat(tvRaw.replace(/,/g, '.'));
            const ta = parseFloat(taRaw.replace(/,/g, '.'));
            const toan = parseFloat(toanRaw.replace(/,/g, '.'));
            const kh = parseFloat(khRaw.replace(/,/g, '.'));
            if (
              !Number.isNaN(tv) &&
              !Number.isNaN(ta) &&
              !Number.isNaN(toan) &&
              !Number.isNaN(kh)
            ) {
              dgnl1200 = String(Math.min(1200, Math.max(0, Math.round(tv + ta + toan + kh))));
            }
          }
        }
      } else {
        dgnl1200 = rawNonHcmutDgnl;
      }
    }

    const hasSkippedQuick =
      isCrossHcmut &&
      Boolean(hocBaQuickRaw || thptQuickRaw || (candidateId === 'hcmut' && hcmutDgnlQuickRaw));
    const hasSkippedDgnl = targetSchoolId === 'hcmut' && Boolean(rawNonHcmutDgnl);

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
      hasSkippedQuick,
      hasSkippedDgnl,
      preview: previewParts.join(' · '),
    });
  }

  return sources;
};

export const backupAllCalculatorData = (): CalculatorBackup => {
  const snapshots: Record<string, string> = {};
  if (typeof window === 'undefined') {
    return { snapshots, summaryRaw: null };
  }
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(CALC_PREFIX)) {
        const value = localStorage.getItem(key);
        if (value !== null) snapshots[key] = value;
      }
    }
    return { snapshots, summaryRaw: localStorage.getItem(SUMMARY_KEY) };
  } catch {
    return { snapshots, summaryRaw: null };
  }
};

export const restoreAllCalculatorData = (backup: CalculatorBackup) => {
  if (typeof window === 'undefined') return;
  try {
    for (const [key, value] of Object.entries(backup.snapshots)) {
      localStorage.setItem(key, value);
    }
    if (backup.summaryRaw !== null) {
      localStorage.setItem(SUMMARY_KEY, backup.summaryRaw);
    }
    window.dispatchEvent(new CustomEvent(SUMMARY_UPDATED_EVENT));
    window.dispatchEvent(new CustomEvent(SNAPSHOTS_UPDATED_EVENT));
  } catch {
    // Ignore storage restriction errors
  }
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

export const encodeSharePayload = (data: Record<string, unknown>): string => {
  const json = JSON.stringify(data);
  const bytes = new TextEncoder().encode(json);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

export const decodeSharePayload = (raw: string): Record<string, unknown> | null => {
  try {
    const padded = raw.replace(/-/g, '+').replace(/_/g, '/');
    const padLen = (4 - (padded.length % 4)) % 4;
    const binary = atob(`${padded}${'='.repeat(padLen)}`);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const parsed = JSON.parse(new TextDecoder().decode(bytes)) as unknown;
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed)
      ? (parsed as Record<string, unknown>)
      : null;
  } catch {
    return null;
  }
};

const isValidSchoolPreset = (candidate: unknown): candidate is SchoolPreset => {
  if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate)) return false;
  const item = candidate as Record<string, unknown>;
  return (
    typeof item.id === 'string' &&
    item.id !== '' &&
    typeof item.name === 'string' &&
    item.name.trim() !== '' &&
    typeof item.total === 'number' &&
    Number.isFinite(item.total) &&
    (item.base30 === undefined || (typeof item.base30 === 'number' && Number.isFinite(item.base30))) &&
    typeof item.snapshot === 'object' &&
    item.snapshot !== null &&
    !Array.isArray(item.snapshot) &&
    typeof item.savedAt === 'number'
  );
};

export const loadSchoolPresets = (schoolId: SchoolId): SchoolPreset[] => {
  if (typeof window === 'undefined') return [];
  try {
    const parsed = safeParse<unknown>(localStorage.getItem(`${PRESET_PREFIX}${schoolId}`), []);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isValidSchoolPreset).slice(0, MAX_SCHOOL_PRESETS);
  } catch {
    return [];
  }
};

const writeSchoolPresets = (schoolId: SchoolId, presets: SchoolPreset[]): SchoolPreset[] => {
  const capped = presets.slice(0, MAX_SCHOOL_PRESETS);
  if (typeof window === 'undefined') return capped;
  try {
    const key = `${PRESET_PREFIX}${schoolId}`;
    if (capped.length === 0) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(capped));
    }
    window.dispatchEvent(new CustomEvent(PRESETS_UPDATED_EVENT));
  } catch {
    // Ignore storage restriction errors
  }
  return capped;
};

export const saveSchoolPreset = (
  schoolId: SchoolId,
  preset: Omit<SchoolPreset, 'id' | 'savedAt'> & { id?: string; savedAt?: number }
): SchoolPreset[] => {
  const existing = loadSchoolPresets(schoolId);
  const trimmedName = preset.name.trim().slice(0, 28) || `Kịch bản ${existing.length + 1}`;
  const normalizedKey = trimmedName.toLocaleLowerCase('vi');
  const duplicate = existing.find(
    (item) => item.id === preset.id || item.name.trim().toLocaleLowerCase('vi') === normalizedKey
  );

  const nextEntry: SchoolPreset = {
    id: preset.id || duplicate?.id || `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    name: trimmedName,
    total: preset.total,
    base30: preset.base30,
    snapshot: preset.snapshot,
    savedAt: preset.savedAt ?? Date.now(),
  };

  const remaining = existing.filter(
    (item) => item.id !== nextEntry.id && item.name.trim().toLocaleLowerCase('vi') !== normalizedKey
  );
  return writeSchoolPresets(schoolId, [nextEntry, ...remaining]);
};

export const deleteSchoolPreset = (schoolId: SchoolId, presetId: string): SchoolPreset[] => {
  const next = loadSchoolPresets(schoolId).filter((item) => item.id !== presetId);
  return writeSchoolPresets(schoolId, next);
};

export const restoreSchoolPresets = (schoolId: SchoolId, presets: SchoolPreset[]): SchoolPreset[] =>
  writeSchoolPresets(schoolId, presets.filter(isValidSchoolPreset));
