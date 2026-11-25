import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { SchoolId } from '../constants/schoolUiMeta';
import { useToast } from './useToast';
import {
  SNAPSHOTS_UPDATED_EVENT,
  clearSchoolSnapshot,
  listImportSources,
  loadSchoolSnapshot,
  saveSchoolSnapshot,
  updateSchoolSummary,
  type SchoolImportSource,
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

const convertScaleScore = (raw: string, fromScale: 10 | 30, toScale: 10 | 30): string => {
  if (fromScale === toScale) return raw;
  const parsed = parseFloat(raw.replace(/,/g, '.'));
  if (Number.isNaN(parsed)) return '';
  const scaled = (parsed / fromScale) * toScale;
  const bounded = Math.min(toScale, Math.max(0, scaled));
  return Number(bounded.toFixed(2)).toString();
};

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
    syncSources();
    window.addEventListener(SNAPSHOTS_UPDATED_EVENT, syncSources);
    window.addEventListener('storage', syncSources);
    return () => {
      window.removeEventListener(SNAPSHOTS_UPDATED_EVENT, syncSources);
      window.removeEventListener('storage', syncSources);
    };
  }, [schoolId]);

  // Hydrate saved school state on mount / school switch without overwriting storage on initial render
  useEffect(() => {
    const saved = loadSchoolSnapshot(schoolId);
    const currentFields = fieldsRef.current;

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
  }, [schoolId]);

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
      } else if (source.hocBaQuick) {
        const converted = convertScaleScore(
          source.hocBaQuick.value,
          source.hocBaQuick.scale,
          currentShared.hocBaQuickScale
        );
        if (converted !== '') {
          currentShared.setHocBa([...EMPTY_HOC_BA]);
          currentShared.setHocBaQuick(converted);
          appliedParts.push('Học bạ');
        }
      }

      if (source.thpt) {
        currentShared.setThptQuick('');
        currentShared.setThpt([...source.thpt]);
        appliedParts.push('THPT');
      } else if (source.thptQuick) {
        const converted = convertScaleScore(
          source.thptQuick.value,
          source.thptQuick.scale,
          currentShared.thptQuickScale
        );
        if (converted !== '') {
          currentShared.setThpt([...EMPTY_THPT]);
          currentShared.setThptQuick(converted);
          appliedParts.push('THPT');
        }
      }

      let dgnlNote = '';
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
      } else if (!currentShared.setDgnl && source.dgnl1200) {
        dgnlNote = ' (ĐGNL Bách Khoa tính riêng)';
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

      showToast({
        type: 'success',
        title: `Đã lấy điểm từ ${source.acronym}`,
        description: `${appliedParts.join(', ')}${dgnlNote}`,
      });
    },
    [schoolId, showToast]
  );

  const resetSchool = useCallback(() => {
    pendingExpectedJsonRef.current = null;
    for (const field of fieldsRef.current) {
      field.apply(cloneValue(field.defaultValue));
    }
    clearSchoolSnapshot(schoolId);
    updateSchoolSummary(schoolId, null);
    showToast({
      type: 'info',
      title: 'Đã làm mới bảng điểm',
    });
  }, [schoolId, showToast]);

  return {
    importSources,
    importFromSchool,
    resetSchool,
  };
};
