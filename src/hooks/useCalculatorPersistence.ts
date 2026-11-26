import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { SchoolId } from '../constants/schoolUiMeta';
import { useToast } from './useToast';
import {
  PRESETS_UPDATED_EVENT,
  SNAPSHOTS_UPDATED_EVENT,
  clearSchoolSnapshot,
  decodeSharePayload,
  deleteSchoolPreset,
  encodeSharePayload,
  listImportSources,
  loadSchoolPresets,
  loadSchoolSnapshot,
  loadScoresSummary,
  restoreSchoolPresets,
  saveSchoolPreset,
  saveSchoolSnapshot,
  updateSchoolSummary,
  type SchoolImportSource,
  type SchoolPreset,
} from '../utils/calculatorStorage';

export type PersistenceField = {
  key: string;
  value: unknown;
  defaultValue: unknown;
  apply: (value: unknown) => void;
};

export type SharedScoreConfig = {
  setHocBa: (values: string[]) => void;
  setHocBaQuick: (value: string) => void;
  hocBaQuickScale: 10 | 30;
  setThpt: (values: string[]) => void;
  setThptQuick: (value: string) => void;
  thptQuickScale: 10 | 30;
  setDgnl?: (value: string) => void;
  maxDgnl?: number;
  setKv: (value: string) => void;
  setDt: (value: string) => void;
};

type UseCalculatorPersistenceOptions = {
  schoolId: SchoolId;
  schoolAcronym: string;
  fields: PersistenceField[];
  hasMeaningfulInput: boolean;
  total: number;
  base30?: number;
  shared?: SharedScoreConfig;
};

const EMPTY_HOC_BA = Array(9).fill('');
const EMPTY_THPT = ['', '', ''];

const isCompatibleFieldValue = (candidate: unknown, defaultValue: unknown): boolean => {
  if (Array.isArray(defaultValue)) {
    return (
      Array.isArray(candidate) &&
      candidate.length === defaultValue.length &&
      candidate.every((item) => typeof item === 'string')
    );
  }
  return typeof candidate === typeof defaultValue;
};

const cloneValue = (value: unknown) => (Array.isArray(value) ? [...value] : value);

export const useCalculatorPersistence = ({
  schoolId,
  fields,
  hasMeaningfulInput,
  total,
  base30,
  shared,
}: UseCalculatorPersistenceOptions) => {
  const { showToast } = useToast();
  const [importSources, setImportSources] = useState<SchoolImportSource[]>(() =>
    listImportSources(schoolId)
  );
  const [presets, setPresets] = useState<SchoolPreset[]>(() => loadSchoolPresets(schoolId));

  const snapshot = useMemo(() => {
    const record: Record<string, unknown> = {};
    for (const field of fields) {
      record[field.key] = field.value;
    }
    return record;
  }, [fields]);

  const snapshotJson = useMemo(() => JSON.stringify(snapshot), [snapshot]);

  const fieldsRef = useRef(fields);
  const snapshotRef = useRef(snapshot);
  const sharedRef = useRef(shared);
  useEffect(() => {
    fieldsRef.current = fields;
    snapshotRef.current = snapshot;
    sharedRef.current = shared;
  });

  const hydratedSchoolRef = useRef<SchoolId | null>(null);
  const pendingExpectedJsonRef = useRef<string | null>(null);

  useEffect(() => {
    const syncSources = () => setImportSources(listImportSources(schoolId));
    const syncPresets = () => setPresets(loadSchoolPresets(schoolId));
    syncSources();
    syncPresets();
    window.addEventListener(SNAPSHOTS_UPDATED_EVENT, syncSources);
    window.addEventListener(PRESETS_UPDATED_EVENT, syncPresets);
    window.addEventListener('storage', syncSources);
    window.addEventListener('storage', syncPresets);
    return () => {
      window.removeEventListener(SNAPSHOTS_UPDATED_EVENT, syncSources);
      window.removeEventListener(PRESETS_UPDATED_EVENT, syncPresets);
      window.removeEventListener('storage', syncSources);
      window.removeEventListener('storage', syncPresets);
    };
  }, [schoolId]);

  // Hydrate from URL ?s=... if present, otherwise from saved school snapshot
  useEffect(() => {
    const currentFields = fieldsRef.current;
    const shareParam =
      typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('s') : null;
    const sharedPayload = shareParam ? decodeSharePayload(shareParam) : null;

    if (sharedPayload) {
      const normalized: Record<string, unknown> = {};
      let hasCompatibleKey = false;

      for (const field of currentFields) {
        const candidate = sharedPayload[field.key];
        if (candidate !== undefined && isCompatibleFieldValue(candidate, field.defaultValue)) {
          normalized[field.key] = cloneValue(candidate);
          hasCompatibleKey = true;
        } else {
          normalized[field.key] = cloneValue(field.defaultValue);
        }
      }

      if (hasCompatibleKey) {
        pendingExpectedJsonRef.current = JSON.stringify(normalized);
        saveSchoolSnapshot(schoolId, normalized);
        for (const field of currentFields) {
          field.apply(cloneValue(normalized[field.key]));
        }
        window.history.replaceState(null, '', window.location.pathname);
        showToast({
          type: 'info',
          title: 'Đã mở bảng điểm từ liên kết',
        });
        hydratedSchoolRef.current = schoolId;
        return;
      }
    }

    const saved = loadSchoolSnapshot(schoolId);
    if (saved) {
      const normalized: Record<string, unknown> = {};
      let needsUpdate = false;

      for (const field of currentFields) {
        const candidate = saved[field.key];
        if (candidate !== undefined && isCompatibleFieldValue(candidate, field.defaultValue)) {
          normalized[field.key] = cloneValue(candidate);
          if (JSON.stringify(field.value) !== JSON.stringify(candidate)) {
            needsUpdate = true;
          }
        } else {
          normalized[field.key] = cloneValue(field.defaultValue);
        }
      }

      if (needsUpdate) {
        pendingExpectedJsonRef.current = JSON.stringify(normalized);
        for (const field of currentFields) {
          if (field.key in saved && isCompatibleFieldValue(saved[field.key], field.defaultValue)) {
            field.apply(cloneValue(saved[field.key]));
          }
        }
      } else {
        pendingExpectedJsonRef.current = null;
      }
    } else {
      pendingExpectedJsonRef.current = null;
    }

    hydratedSchoolRef.current = schoolId;
  }, [schoolId, showToast]);

  // Persist current school snapshot & summary (strictly isolated per school)
  useEffect(() => {
    if (hydratedSchoolRef.current !== schoolId) return;

    if (pendingExpectedJsonRef.current !== null) {
      if (snapshotJson !== pendingExpectedJsonRef.current) {
        return;
      }
      pendingExpectedJsonRef.current = null;
    }

    saveSchoolSnapshot(schoolId, snapshotRef.current);

    if (hasMeaningfulInput && total > 0) {
      updateSchoolSummary(schoolId, {
        total,
        base30,
        updatedAt: Date.now(),
      });
    } else {
      updateSchoolSummary(schoolId, null);
    }
  }, [schoolId, snapshotJson, hasMeaningfulInput, total, base30]);

  const importFromSchool = useCallback(
    (sourceSchoolId: SchoolId) => {
      const currentShared = sharedRef.current;
      if (!currentShared) return;

      const source = listImportSources(schoolId).find((item) => item.schoolId === sourceSchoolId);
      if (!source) {
        showToast({
          type: 'info',
          title: 'Chưa có dữ liệu để lấy',
          description: 'Nhập điểm ở một trường khác trước khi đồng bộ.',
        });
        return;
      }

      const appliedParts: string[] = [];

      if (source.hocBa) {
        currentShared.setHocBaQuick('');
        currentShared.setHocBa([...source.hocBa]);
        appliedParts.push('Học bạ');
      } else if (
        source.hocBaQuick &&
        source.hocBaQuick.scale === currentShared.hocBaQuickScale
      ) {
        currentShared.setHocBa([...EMPTY_HOC_BA]);
        currentShared.setHocBaQuick(source.hocBaQuick.value);
        appliedParts.push('Học bạ');
      }

      if (source.thpt) {
        currentShared.setThptQuick('');
        currentShared.setThpt([...source.thpt]);
        appliedParts.push('THPT');
      } else if (
        source.thptQuick &&
        source.thptQuick.scale === currentShared.thptQuickScale
      ) {
        currentShared.setThpt([...EMPTY_THPT]);
        currentShared.setThptQuick(source.thptQuick.value);
        appliedParts.push('THPT');
      }

      if (currentShared.setDgnl && source.dgnl1200) {
        let nextDgnl = source.dgnl1200;
        if (currentShared.maxDgnl) {
          const parsed = parseInt(nextDgnl, 10);
          if (!Number.isNaN(parsed) && parsed > currentShared.maxDgnl) {
            nextDgnl = String(currentShared.maxDgnl);
          }
        }
        currentShared.setDgnl(nextDgnl);
        appliedParts.push('ĐGNL');
      }

      if (source.kv) {
        currentShared.setKv(source.kv);
      }
      if (source.dt) {
        currentShared.setDt(source.dt);
      }
      if (source.kv || source.dt) {
        appliedParts.push('Ưu tiên');
      }

      const notes: string[] = [];
      if (source.hasSkippedQuick) {
        notes.push('bỏ qua ô nhập nhanh');
      }
      if (source.hasSkippedDgnl) {
        notes.push('ĐGNL Bách Khoa tính riêng');
      }
      const noteSuffix = notes.length > 0 ? ` (${notes.join(', ')})` : '';

      showToast({
        type: 'success',
        title: `Đã lấy điểm từ ${source.acronym}`,
        description: `${appliedParts.join(', ')}${noteSuffix}`,
      });
    },
    [schoolId, showToast]
  );

  const resetSchool = useCallback(() => {
    const prevSnapshot: Record<string, unknown> = {};
    for (const field of fieldsRef.current) {
      prevSnapshot[field.key] = cloneValue(field.value);
    }
    const prevSummary = loadScoresSummary()[schoolId] ?? null;

    pendingExpectedJsonRef.current = null;
    for (const field of fieldsRef.current) {
      field.apply(cloneValue(field.defaultValue));
    }
    clearSchoolSnapshot(schoolId);
    updateSchoolSummary(schoolId, null);

    showToast({
      type: 'info',
      title: 'Đã làm mới bảng điểm',
      duration: 5000,
      action: {
        label: 'Hoàn tác',
        onClick: () => {
          pendingExpectedJsonRef.current = JSON.stringify(prevSnapshot);
          for (const field of fieldsRef.current) {
            if (field.key in prevSnapshot) {
              field.apply(cloneValue(prevSnapshot[field.key]));
            }
          }
          saveSchoolSnapshot(schoolId, prevSnapshot);
          if (prevSummary) {
            updateSchoolSummary(schoolId, prevSummary);
          }
        },
      },
    });
  }, [schoolId, showToast]);

  const buildShareUrl = useCallback(() => {
    if (typeof window === 'undefined') return '';
    const diff: Record<string, unknown> = {};
    for (const field of fieldsRef.current) {
      if (JSON.stringify(field.value) !== JSON.stringify(field.defaultValue)) {
        diff[field.key] = field.value;
      }
    }
    const base = `${window.location.origin}${window.location.pathname}`;
    if (Object.keys(diff).length === 0) return base;
    return `${base}?s=${encodeSharePayload(diff)}`;
  }, []);

  const savePreset = useCallback(
    (rawName: string) => {
      const snapshotData: Record<string, unknown> = {};
      for (const field of fieldsRef.current) {
        snapshotData[field.key] = cloneValue(field.value);
      }
      const currentList = loadSchoolPresets(schoolId);
      const name = rawName.trim().slice(0, 28) || `Kịch bản ${currentList.length + 1}`;
      const updated = saveSchoolPreset(schoolId, {
        name,
        total,
        base30,
        snapshot: snapshotData,
      });
      setPresets(updated);
      showToast({
        type: 'success',
        title: `Đã lưu kịch bản "${name}"`,
      });
    },
    [schoolId, total, base30, showToast]
  );

  const loadPreset = useCallback(
    (presetId: string) => {
      const target = loadSchoolPresets(schoolId).find((item) => item.id === presetId);
      if (!target) return;

      const prevSnapshot: Record<string, unknown> = {};
      for (const field of fieldsRef.current) {
        prevSnapshot[field.key] = cloneValue(field.value);
      }
      const prevSummary = loadScoresSummary()[schoolId] ?? null;

      const normalized: Record<string, unknown> = {};
      for (const field of fieldsRef.current) {
        const candidate = target.snapshot[field.key];
        if (candidate !== undefined && isCompatibleFieldValue(candidate, field.defaultValue)) {
          normalized[field.key] = cloneValue(candidate);
        } else {
          normalized[field.key] = cloneValue(field.defaultValue);
        }
      }

      pendingExpectedJsonRef.current = JSON.stringify(normalized);
      for (const field of fieldsRef.current) {
        field.apply(cloneValue(normalized[field.key]));
      }
      saveSchoolSnapshot(schoolId, normalized);

      showToast({
        type: 'info',
        title: `Đã nạp kịch bản "${target.name}"`,
        duration: 5000,
        action: {
          label: 'Hoàn tác',
          onClick: () => {
            pendingExpectedJsonRef.current = JSON.stringify(prevSnapshot);
            for (const field of fieldsRef.current) {
              if (field.key in prevSnapshot) {
                field.apply(cloneValue(prevSnapshot[field.key]));
              }
            }
            saveSchoolSnapshot(schoolId, prevSnapshot);
            if (prevSummary) {
              updateSchoolSummary(schoolId, prevSummary);
            } else {
              updateSchoolSummary(schoolId, null);
            }
          },
        },
      });
    },
    [schoolId, showToast]
  );

  const deletePreset = useCallback(
    (presetId: string) => {
      const prevPresets = loadSchoolPresets(schoolId);
      const target = prevPresets.find((item) => item.id === presetId);
      if (!target) return;

      const updated = deleteSchoolPreset(schoolId, presetId);
      setPresets(updated);

      showToast({
        type: 'info',
        title: `Đã xóa kịch bản "${target.name}"`,
        duration: 5000,
        action: {
          label: 'Hoàn tác',
          onClick: () => {
            setPresets(restoreSchoolPresets(schoolId, prevPresets));
          },
        },
      });
    },
    [schoolId, showToast]
  );

  return {
    importSources,
    importFromSchool,
    resetSchool,
    buildShareUrl,
    presets,
    savePreset,
    loadPreset,
    deletePreset,
  };
};
