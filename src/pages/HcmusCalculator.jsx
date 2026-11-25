import { useMemo, useState } from 'react';
import { convertDgnlToThptScale, useHcmusCalculator } from '../hooks/useHcmusCalculator';
import { useCalculatorPersistence } from '../hooks/useCalculatorPersistence';
import { CalculatorPageHeader } from '../components/common/CalculatorPageHeader';
import { CardSection } from '../components/common/CardSection';
import { ConversionModal } from '../components/common/ConversionModal';
import { ConversionTable, ConversionTableGrid } from '../components/common/ConversionTable';
import { PriorityFields } from '../components/common/PriorityFields';
import { TranscriptScoreTable } from '../components/common/TranscriptScoreTable';
import { QuickScoreInput } from '../components/score/QuickScoreInput';
import { ScoreInput } from '../components/score/ScoreInput';
import { MobileScoreButton } from '../components/score/MobileScoreButton';
import { ResponsiveScorePanel } from '../components/score/ResponsiveScorePanel';
import { ScoreDetailCard } from '../components/score/ScoreDetailCard';
import {
  AlertTriangle,
  CheckCircle2,
  Search,
  X,
} from 'lucide-react';
import { HCMUS_ENGLISH_TYPES, NGOAI_NGU_CONVERSION, HCMUS_DGNL_CONVERSION } from '../constants/hcmus';
import { KHU_VUC, DOI_TUONG } from '../constants/common';
import { clampScore, updateScoreArray } from '../utils/input';
import { findById } from '../utils/collection';

const getDgnlBracketThresholds = (score) => {
  const active = new Set();
  if (Number.isNaN(score) || score <= 0) return active;

  if (score >= HCMUS_DGNL_CONVERSION[0].dgnl) {
    active.add(HCMUS_DGNL_CONVERSION[0].dgnl);
    return active;
  }

  const lowest = HCMUS_DGNL_CONVERSION[HCMUS_DGNL_CONVERSION.length - 1];
  if (score <= lowest.dgnl) {
    active.add(lowest.dgnl);
    return active;
  }

  for (let i = 0; i < HCMUS_DGNL_CONVERSION.length - 1; i++) {
    const upper = HCMUS_DGNL_CONVERSION[i];
    const lower = HCMUS_DGNL_CONVERSION[i + 1];
    if (score >= lower.dgnl && score <= upper.dgnl) {
      if (score === upper.dgnl) {
        active.add(upper.dgnl);
      } else if (score === lower.dgnl) {
        active.add(lower.dgnl);
      } else {
        active.add(upper.dgnl);
        active.add(lower.dgnl);
      }
      break;
    }
  }
  return active;
};

const EMPTY_HOC_BA = Array(9).fill('');
const EMPTY_THPT = ['', '', ''];

export const HcmusCalculator = () => {
  const { state, results } = useHcmusCalculator();
  const [showConversionTable, setShowConversionTable] = useState(false);
  const [showDgnlConversionTable, setShowDgnlConversionTable] = useState(false);
  const [showMobileResultModal, setShowMobileResultModal] = useState(false);
  const [dgnlSearch, setDgnlSearch] = useState('');

  const handleHocBaChange = (index, val) => {
    updateScoreArray(state.hocBa, state.setHocBa, index, val, 10);
  };

  const handleHocBaQuickTotalChange = (val) => {
    state.setHocBaQuickTotal(clampScore(val, 30));
  };

  const handleThptChange = (index, val) => {
    updateScoreArray(state.thpt, state.setThpt, index, val, 10);
  };

  const handleThptQuickTotalChange = (val) => {
    state.setThptQuickTotal(clampScore(val, 30));
  };

  const hasHocBaDetail = state.hocBa.some((val) => val !== '');
  const hasHocBaQuickTotal = state.hocBaQuickTotal !== '';
  const hasThptDetail = state.thpt.some((val) => val !== '') || (state.isNgoaiNgu && state.diemChungChi !== '');
  const hasThptQuickTotal = state.thptQuickTotal !== '';
  const selectedEnglishType = findById(HCMUS_ENGLISH_TYPES, state.chungChiType);
  const isHocBaTouched = state.hocBa.some((val) => val !== '');

  const hasMeaningfulInput =
    hasHocBaDetail ||
    hasHocBaQuickTotal ||
    hasThptDetail ||
    hasThptQuickTotal ||
    state.dgnl !== '' ||
    state.khuyenKhich !== '' ||
    state.isNgoaiNgu ||
    state.kv !== KHU_VUC[0].id ||
    state.dt !== DOI_TUONG[0].id;

  const persistenceFields = useMemo(
    () => [
      { key: 'hocBa', value: state.hocBa, defaultValue: EMPTY_HOC_BA, apply: state.setHocBa },
      { key: 'hocBaQuickTotal', value: state.hocBaQuickTotal, defaultValue: '', apply: state.setHocBaQuickTotal },
      { key: 'thpt', value: state.thpt, defaultValue: EMPTY_THPT, apply: state.setThpt },
      { key: 'thptQuickTotal', value: state.thptQuickTotal, defaultValue: '', apply: state.setThptQuickTotal },
      { key: 'isNgoaiNgu', value: state.isNgoaiNgu, defaultValue: false, apply: state.setIsNgoaiNgu },
      { key: 'chungChiType', value: state.chungChiType, defaultValue: 'IELTS', apply: state.setChungChiType },
      { key: 'diemChungChi', value: state.diemChungChi, defaultValue: '', apply: state.setDiemChungChi },
      { key: 'dgnl', value: state.dgnl, defaultValue: '', apply: state.setDgnl },
      { key: 'kv', value: state.kv, defaultValue: KHU_VUC[0].id, apply: state.setKv },
      { key: 'dt', value: state.dt, defaultValue: DOI_TUONG[0].id, apply: state.setDt },
      { key: 'khuyenKhich', value: state.khuyenKhich, defaultValue: '', apply: state.setKhuyenKhich },
    ],
    [
      state.hocBa,
      state.setHocBa,
      state.hocBaQuickTotal,
      state.setHocBaQuickTotal,
      state.thpt,
      state.setThpt,
      state.thptQuickTotal,
      state.setThptQuickTotal,
      state.isNgoaiNgu,
      state.setIsNgoaiNgu,
      state.chungChiType,
      state.setChungChiType,
      state.diemChungChi,
      state.setDiemChungChi,
      state.dgnl,
      state.setDgnl,
      state.kv,
      state.setKv,
      state.dt,
      state.setDt,
      state.khuyenKhich,
      state.setKhuyenKhich,
    ]
  );

  const {
    setHocBa,
    setHocBaQuickTotal,
    setThpt,
    setThptQuickTotal,
    setDgnl,
    maxDgnl,
    setKv,
    setDt,
  } = state;

  const sharedConfig = useMemo(
    () => ({
      setHocBa,
      setHocBaQuick: setHocBaQuickTotal,
      hocBaQuickScale: 30,
      setThpt,
      setThptQuick: setThptQuickTotal,
      thptQuickScale: 30,
      setDgnl,
      maxDgnl: parseInt(maxDgnl, 10) || 1139,
      setKv,
      setDt,
    }),
    [
      setHocBa,
      setHocBaQuickTotal,
      setThpt,
      setThptQuickTotal,
      setDgnl,
      maxDgnl,
      setKv,
      setDt,
    ]
  );

  const { importSources, importFromSchool, resetSchool } =
    useCalculatorPersistence({
      schoolId: 'hcmus',
      schoolAcronym: 'HCMUS',
      fields: persistenceFields,
      hasMeaningfulInput,
      total: results.base100,
      base30: results.base30,
      shared: sharedConfig,
    });

  const getHocBaSubjectStatus = (subjectIndex) => {
    const p10 = state.hocBa[subjectIndex * 3];
    const p11 = state.hocBa[subjectIndex * 3 + 1];
    const p12 = state.hocBa[subjectIndex * 3 + 2];
    const isMissing10 = p10 === '' && p11 !== '' && p12 !== '';

    if (!isHocBaTouched) return { isMissing10, note: '', noteClass: '' };
    if (p11 === '' || p12 === '' || (p10 === '' && !isMissing10)) {
      return { isMissing10, note: 'Thiếu điểm', noteClass: 'font-semibold text-red-600 dark:text-red-400' };
    }
    if (isMissing10) {
      return { isMissing10, note: 'Tự điền Lớp 10', noteClass: 'font-semibold text-amber-600 dark:text-amber-400' };
    }
    return { isMissing10, note: 'Hợp lệ', noteClass: 'font-medium text-emerald-600 dark:text-emerald-400' };
  };

  const parsedEnglishScore = parseFloat(state.diemChungChi);
  const parsedDgnl = parseFloat(state.dgnl);
  const hasDgnlValue = state.dgnl !== '' && !Number.isNaN(parsedDgnl) && parsedDgnl > 0;

  const activeDgnlThresholdSet = useMemo(
    () => (hasDgnlValue ? getDgnlBracketThresholds(parsedDgnl) : new Set()),
    [hasDgnlValue, parsedDgnl]
  );

  const searchNumeric = Number(/^\d+$/.test(dgnlSearch.trim()) ? dgnlSearch.trim() : NaN);
  const hasSearchNumeric =
    Number.isInteger(searchNumeric) && searchNumeric >= 200 && searchNumeric <= 1200;

  const searchDgnlThresholdSet = useMemo(
    () => (hasSearchNumeric ? getDgnlBracketThresholds(searchNumeric) : new Set()),
    [hasSearchNumeric, searchNumeric]
  );

  const filteredDgnlRows = useMemo(() => {
    const query = dgnlSearch.trim().toLowerCase();
    if (!query) return null;
    return HCMUS_DGNL_CONVERSION.filter(
      (row) =>
        row.percent.toLowerCase().includes(query) ||
        String(row.dgnl).includes(query) ||
        String(row.thpt).includes(query) ||
        searchDgnlThresholdSet.has(row.dgnl)
    );
  }, [dgnlSearch, searchDgnlThresholdSet]);

  return (
    <div className="mx-auto max-w-7xl pb-28 animate-in fade-in">
      <CalculatorPageHeader
        schoolId="hcmus"
        acronym="HCMUS"
        title="Trường Đại học Khoa học Tự nhiên"
        subtitle="Xét tuyển tổng hợp 2026 · Thang 100 & 30 · Chọn mức cao nhất giữa (THPT + Học bạ) và (ĐGNL + Học bạ)."
        importSources={importSources}
        hasMeaningfulInput={hasMeaningfulInput}
        onImportFromSchool={importFromSchool}
        onReset={resetSchool}
      />

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
        {/* Left Column - Forms */}
        <div className="flex-1 space-y-6">
          {/* Học bạ */}
          <CardSection title="1. Điểm học bạ" tone="blue">
            <div className="flex flex-col gap-4">
              <TranscriptScoreTable
                values={state.hocBa}
                onChange={handleHocBaChange}
                disabled={hasHocBaQuickTotal}
                tone="blue"
                showNoteColumn
                onClear={() => state.setHocBa(EMPTY_HOC_BA)}
                onUnlockQuick={() => state.setHocBaQuickTotal('')}
                getDisplayValue={({ cellIndex, subjectIndex, yearIndex }) => {
                  const { isMissing10 } = getHocBaSubjectStatus(subjectIndex);
                  const cellIsMissing10 = yearIndex === 0 && isMissing10;
                  return state.hocBa[cellIndex] !== ''
                    ? state.hocBa[cellIndex]
                    : cellIsMissing10
                    ? results.interpolatedHocBa[cellIndex]
                    : '';
                }}
                getCellMeta={({ cellIndex, subjectIndex, yearIndex }) => {
                  const { isMissing10 } = getHocBaSubjectStatus(subjectIndex);
                  const cellIsMissing10 = yearIndex === 0 && isMissing10;
                  const isMissingCell = isHocBaTouched && state.hocBa[cellIndex] === '' && !cellIsMissing10;

                  if (cellIsMissing10) {
                    return {
                      className:
                        'border-amber-500/50 bg-amber-500/10 font-semibold text-amber-700 dark:text-amber-300',
                      title: 'Điểm nội suy từ lớp 11 và 12',
                    };
                  }

                  if (isMissingCell) {
                    return {
                      className: 'border-red-500/50 bg-red-500/10 text-ink',
                    };
                  }

                  return { className: 'text-ink' };
                }}
                renderSubjectNote={({ subjectIndex }) => {
                  const { note, noteClass } = getHocBaSubjectStatus(subjectIndex);
                  return <span className={noteClass}>{note}</span>;
                }}
              />

              <QuickScoreInput
                title="Tổng học bạ (thang 30)"
                value={hasHocBaDetail ? results.tongHocBa.toFixed(2) : state.hocBaQuickTotal}
                onChange={(e) => handleHocBaQuickTotalChange(e.target.value)}
                onClear={() => state.setHocBaQuickTotal('')}
                disabled={hasHocBaDetail}
                maxIntPartLength={2}
              />

              {results.hocBaStatus === 3 && (
                <div className="flex items-start gap-3 rounded-panel border border-red-500/30 bg-red-500/10 p-4">
                  <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600 dark:text-red-400" />
                  <div className="text-sm text-red-900 dark:text-red-200">
                    Thiếu điểm lớp 11 hoặc 12 — điểm xét tuyển bằng 0.
                  </div>
                </div>
              )}
            </div>
          </CardSection>

          {/* Điểm Thi */}
          <CardSection title="2. Điểm thi" tone="blue">
            <div className="space-y-6">
              <div>
                <h3 className="mb-3 text-sm font-semibold text-ink">THPT</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {[0, 1, 2].map((idx) => (
                    <div key={`thpt-${idx}`}>
                      <label className="mb-1.5 block text-sm font-medium text-ink">
                        Môn {idx + 1}
                      </label>
                      <ScoreInput
                        max={10}
                        maxIntPartLength={1}
                        value={state.thpt[idx]}
                        onValueChange={(value) => handleThptChange(idx, value)}
                        disabled={hasThptQuickTotal}
                        tone="blue"
                        placeholder="0.00"
                      />
                    </div>
                  ))}
                </div>

                <div className="mt-4 rounded-panel border border-hairline bg-surface-subtle p-3.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <label className="flex cursor-pointer items-center gap-2 text-sm text-ink-secondary">
                      <input
                        type="checkbox"
                        checked={state.isNgoaiNgu}
                        onChange={(e) => state.setIsNgoaiNgu(e.target.checked)}
                        className="h-4 w-4 cursor-pointer rounded text-blue-600 focus-visible:ring-2 focus-visible:ring-blue-600"
                      />
                      Quy đổi chứng chỉ ngoại ngữ (thay Môn 3)
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowConversionTable(true)}
                      className="btn-tactile px-2 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-blue-400"
                    >
                      Bảng quy đổi
                    </button>
                  </div>

                  {state.isNgoaiNgu && (
                    <div className="mt-3 grid grid-cols-1 gap-2 border-t border-hairline pt-3 sm:grid-cols-3">
                      <select
                        value={state.chungChiType}
                        onChange={(e) => {
                          state.setChungChiType(e.target.value);
                          state.setDiemChungChi('');
                        }}
                        className="select-control px-2.5 py-2 focus-visible:ring-blue-600"
                      >
                        {HCMUS_ENGLISH_TYPES.map((type) => (
                          <option key={type.id} value={type.id}>
                            {type.name}
                          </option>
                        ))}
                      </select>
                      <ScoreInput
                        max={selectedEnglishType?.max}
                        value={state.diemChungChi}
                        onValueChange={state.setDiemChungChi}
                        tone="blue"
                        inputClassName="px-2.5 text-sm"
                        placeholder="Điểm"
                      />
                      <div className="flex items-center gap-1.5 font-mono text-sm font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">
                        {state.diemChungChi ? (
                          <>
                            <CheckCircle2 className="h-4 w-4" />
                            Quy đổi: {results.diemNgoaiNguQuyDoi} / 10
                          </>
                        ) : (
                          <span className="text-xs font-normal text-ink-muted">Chưa nhập điểm</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <QuickScoreInput
                  className="mt-4"
                  title="Tổng THPT (thang 30)"
                  value={hasThptDetail ? results.tongTHPT.toFixed(2) : state.thptQuickTotal}
                  onChange={(e) => handleThptQuickTotalChange(e.target.value)}
                  onClear={() => state.setThptQuickTotal('')}
                  disabled={hasThptDetail}
                  maxIntPartLength={2}
                />
              </div>

              <div className="border-t border-hairline pt-6">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold text-ink">ĐGNL</h3>
                  <button
                    type="button"
                    onClick={() => setShowDgnlConversionTable(true)}
                    className="btn-tactile px-2 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-blue-400"
                  >
                    Bảng quy đổi
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:items-end">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-ink">
                      Điểm ĐGNL (tối đa {state.maxDgnl})
                    </label>
                    <ScoreInput
                      max={parseFloat(state.maxDgnl) || 1139}
                      value={state.dgnl}
                      onValueChange={state.setDgnl}
                      integer
                      tone="blue"
                      inputClassName="text-base font-semibold"
                      placeholder="850"
                    />
                  </div>
                  <div className="flex items-center justify-between rounded-control border border-hairline bg-surface-subtle px-3.5 py-2 text-sm">
                    <span className="text-ink-secondary">Quy đổi THPT</span>
                    <span className="font-mono font-bold tabular-nums text-ink">
                      {results.dgnlChuanHoa.toFixed(2)} / 30
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardSection>

          {/* Ưu tiên */}
          <CardSection title="3. Ưu tiên & Điểm cộng" tone="blue">
            <div className="space-y-6">
              <PriorityFields
                kv={state.kv}
                onKvChange={state.setKv}
                dt={state.dt}
                onDtChange={state.setDt}
                tone="blue"
              />

              <div className="border-t border-hairline pt-5">
                <div className="sm:max-w-xs">
                  <label className="mb-2 block text-sm font-medium text-ink">
                    Điểm cộng (tối đa 1.5)
                  </label>
                  <ScoreInput
                    max={1.5}
                    maxIntPartLength={1}
                    value={state.khuyenKhich}
                    onValueChange={state.setKhuyenKhich}
                    tone="blue"
                    placeholder="0.0"
                  />
                </div>
              </div>
            </div>
          </CardSection>
        </div>

        <ResponsiveScorePanel
          isOpen={showMobileResultModal}
          onClose={() => setShowMobileResultModal(false)}
          variant="card"
        >
          <ScoreDetailCard
            theme="blue"
            schoolAcronym="HCMUS"
            className="relative"
            total={results.base100}
            headerClassName={results.hocBaStatus === 3 ? 'bg-red-500/10' : undefined}
            headerNote={
              <>
                Thang 30:{' '}
                <span className="font-mono font-bold tabular-nums text-ink">
                  {results.base30.toFixed(2)}
                </span>
              </>
            }
            beforeLearning={
              <>
                {results.hocBaStatus === 3 && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/30 p-6 backdrop-blur-[2px]">
                    <div className="rounded-panel border border-red-500/50 bg-surface p-5 text-center shadow-2xl">
                      <AlertTriangle className="mx-auto mb-2.5 h-10 w-10 text-red-600 dark:text-red-400" />
                      <h3 className="mb-1 text-base font-bold text-red-700 dark:text-red-400">
                        Hồ sơ không hợp lệ
                      </h3>
                      <p className="text-sm text-ink-secondary">Thiếu học bạ lớp 11 hoặc 12.</p>
                    </div>
                  </div>
                )}
                <div className="space-y-2.5">
                  <div
                    className={`flex items-center justify-between rounded-panel border p-3 transition-colors ${
                      results.branchSelected === 1
                        ? 'border-emerald-500/40 bg-emerald-500/10'
                        : 'border-hairline bg-surface-subtle'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-ink">THPT + Học bạ</span>
                        {results.branchSelected === 1 && (
                          <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                            Đang chọn
                          </span>
                        )}
                      </div>
                      <div className="font-mono text-xs text-ink-muted">
                        {Math.round(state.w1 * 100)}% + {Math.round((1 - state.w1) * 100)}%
                      </div>
                    </div>
                    <div className="text-right font-mono tabular-nums">
                      <div
                        className={`text-lg font-bold ${
                          results.branchSelected === 1
                            ? 'text-emerald-700 dark:text-emerald-400'
                            : 'text-ink-muted'
                        }`}
                      >
                        {((results.diemHL1 / 30) * 100).toFixed(2)}
                      </div>
                      <div className="mt-0.5 text-xs font-medium text-ink-muted">
                        ~ {results.diemHL1.toFixed(2)} / 30
                      </div>
                    </div>
                  </div>

                  <div
                    className={`flex items-center justify-between rounded-panel border p-3 transition-colors ${
                      results.branchSelected === 2
                        ? 'border-emerald-500/40 bg-emerald-500/10'
                        : 'border-hairline bg-surface-subtle'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-ink">ĐGNL + Học bạ</span>
                        {results.branchSelected === 2 && (
                          <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                            Đang chọn
                          </span>
                        )}
                      </div>
                      <div className="font-mono text-xs text-ink-muted">
                        {Math.round(state.w3 * 100)}% + {Math.round((1 - state.w3) * 100)}%
                      </div>
                    </div>
                    <div className="text-right font-mono tabular-nums">
                      <div
                        className={`text-lg font-bold ${
                          results.branchSelected === 2
                            ? 'text-emerald-700 dark:text-emerald-400'
                            : 'text-ink-muted'
                        }`}
                      >
                        {((results.diemHL2 / 30) * 100).toFixed(2)}
                      </div>
                      <div className="mt-0.5 text-xs font-medium text-ink-muted">
                        ~ {results.diemHL2.toFixed(2)} / 30
                      </div>
                    </div>
                  </div>
                </div>
              </>
            }
            dgnlScore={((results.dgnlChuanHoa / 30) * 100).toFixed(2)}
            thptScore={((results.tongTHPT / 30) * 100).toFixed(2)}
            hocBaScore={((results.tongHocBa / 30) * 100).toFixed(2)}
            bonusRows={[
              {
                label: 'Điểm cộng (Gốc)',
                value: `~+${((results.congGoc / 30) * 100).toFixed(2)}`,
                secondaryValue: `(+${results.congGoc.toFixed(2)} / 30)`,
              },
              {
                label: 'Cộng thực nhận',
                value: `~+${((results.congThuc / 30) * 100).toFixed(2)}`,
                secondaryValue: `(+${results.congThuc.toFixed(2)} / 30)`,
                variant: 'bonusEffective',
              },
            ]}
            priorityRows={[
              {
                label: 'Ưu tiên KV/ĐT (Gốc)',
                value: `~+${((results.uuTienGoc / 30) * 100).toFixed(2)}`,
                secondaryValue: `(+${results.uuTienGoc.toFixed(2)} / 30)`,
              },
              {
                label: 'Ưu tiên thực nhận',
                value: `~+${((results.uuTienThuc / 30) * 100).toFixed(2)}`,
                secondaryValue: `(+${results.uuTienThuc.toFixed(2)} / 30)`,
                variant: 'priorityEffective',
              },
            ]}
          />
        </ResponsiveScorePanel>
      </div>

      <MobileScoreButton score={results.base100} onClick={() => setShowMobileResultModal(true)} />

      <ConversionModal
        isOpen={showConversionTable}
        title="Bảng quy đổi Chứng chỉ ngoại ngữ"
        onClose={() => setShowConversionTable(false)}
        maxWidthClassName="max-w-lg"
      >
        <ConversionTableGrid className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <ConversionTable
            title="IELTS"
            tone="blue"
            columns={[
              { key: 'band', header: 'Band' },
              { key: 'point', header: 'Quy đổi', value: true },
            ]}
            rows={NGOAI_NGU_CONVERSION.IELTS.map((row) => ({
              band: row.max === 9.0 ? `≥ ${row.min}` : row.min.toFixed(1),
              point: row.point,
              highlighted:
                state.isNgoaiNgu &&
                state.chungChiType === 'IELTS' &&
                !Number.isNaN(parsedEnglishScore) &&
                parsedEnglishScore >= row.min &&
                parsedEnglishScore <= row.max,
            }))}
          />
          <ConversionTable
            title="TOEFL iBT"
            tone="emerald"
            columns={[
              { key: 'score', header: 'Điểm' },
              { key: 'point', header: 'Quy đổi', value: true },
            ]}
            rows={NGOAI_NGU_CONVERSION.TOEFL.map((row) => ({
              score: `${row.min} - ${row.max}`,
              point: row.point,
              highlighted:
                state.isNgoaiNgu &&
                state.chungChiType === 'TOEFL' &&
                !Number.isNaN(parsedEnglishScore) &&
                parsedEnglishScore >= row.min &&
                parsedEnglishScore <= row.max,
            }))}
          />
        </ConversionTableGrid>
      </ConversionModal>

      <ConversionModal
        isOpen={showDgnlConversionTable}
        title="Bảng quy đổi ĐGNL sang THPT 2026"
        onClose={() => setShowDgnlConversionTable(false)}
        maxWidthClassName="max-w-5xl"
        headerExtra={
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 sm:max-w-xs">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
              <input
                type="text"
                value={dgnlSearch}
                onChange={(e) => setDgnlSearch(e.target.value)}
                placeholder="Tìm điểm ĐGNL hoặc %..."
                className="w-full rounded-control border border-hairline bg-surface-subtle py-1.5 pl-9 pr-8 text-sm text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
              />
              {dgnlSearch && (
                <button
                  type="button"
                  onClick={() => setDgnlSearch('')}
                  aria-label="Xóa tìm kiếm"
                  className="btn-tactile absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center text-ink-muted hover:text-ink"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {hasSearchNumeric && (
                <div className="inline-flex items-center gap-2 rounded-control border border-blue-500/30 bg-blue-500/10 px-3 py-1.5 font-mono text-xs font-semibold tabular-nums text-blue-700 dark:text-blue-300">
                  <span>Tra cứu {searchNumeric}</span>
                  <span>→</span>
                  <span>{convertDgnlToThptScale(searchNumeric).toFixed(2)} / 30</span>
                </div>
              )}
              {hasDgnlValue && (
                <div className="inline-flex items-center gap-2 rounded-control border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 font-mono text-xs font-semibold tabular-nums text-amber-800 dark:text-amber-300">
                  <span>Của bạn: {state.dgnl}</span>
                  <span>→</span>
                  <span>{results.dgnlChuanHoa.toFixed(2)} / 30</span>
                </div>
              )}
            </div>
          </div>
        }
      >
        {filteredDgnlRows ? (
          filteredDgnlRows.length > 0 ? (
            <ConversionTable
              columns={[
                { key: 'percent', header: 'Phân vị (%)' },
                { key: 'dgnl', header: 'Điểm thi ĐGNL' },
                { key: 'thpt', header: 'Điểm thi THPT', value: true },
              ]}
              rows={filteredDgnlRows.map((row) => ({
                ...row,
                highlighted: activeDgnlThresholdSet.has(row.dgnl) || searchDgnlThresholdSet.has(row.dgnl),
              }))}
              tone="blue"
            />
          ) : (
            <p className="py-8 text-center text-sm text-ink-muted">
              Không tìm thấy mốc phù hợp với “{dgnlSearch}”.
            </p>
          )
        ) : (
          <ConversionTableGrid className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <ConversionTable
              columns={[
                { key: 'percent', header: 'Phân vị (%)' },
                { key: 'dgnl', header: 'Điểm thi ĐGNL' },
                { key: 'thpt', header: 'Điểm thi THPT', value: true },
              ]}
              rows={HCMUS_DGNL_CONVERSION.slice(0, 33).map((row) => ({
                ...row,
                highlighted: activeDgnlThresholdSet.has(row.dgnl),
              }))}
              tone="blue"
            />
            <ConversionTable
              columns={[
                { key: 'percent', header: 'Phân vị (%)' },
                { key: 'dgnl', header: 'Điểm thi ĐGNL' },
                { key: 'thpt', header: 'Điểm thi THPT', value: true },
              ]}
              rows={HCMUS_DGNL_CONVERSION.slice(33, 67).map((row) => ({
                ...row,
                highlighted: activeDgnlThresholdSet.has(row.dgnl),
              }))}
              tone="blue"
            />
            <ConversionTable
              columns={[
                { key: 'percent', header: 'Phân vị (%)' },
                { key: 'dgnl', header: 'Điểm thi ĐGNL' },
                { key: 'thpt', header: 'Điểm thi THPT', value: true },
              ]}
              rows={HCMUS_DGNL_CONVERSION.slice(67).map((row) => ({
                ...row,
                highlighted: activeDgnlThresholdSet.has(row.dgnl),
              }))}
              tone="blue"
            />
          </ConversionTableGrid>
        )}
      </ConversionModal>
    </div>
  );
};
