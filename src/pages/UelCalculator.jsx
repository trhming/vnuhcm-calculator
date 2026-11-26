import { useId, useMemo, useState } from 'react';
import { useUelCalculator } from '../hooks/useUelCalculator';
import { useCalculatorPersistence } from '../hooks/useCalculatorPersistence';
import { CalculatorPageHeader } from '../components/common/CalculatorPageHeader';
import { CardSection } from '../components/common/CardSection';
import { ConversionModal } from '../components/common/ConversionModal';
import { ConversionTable } from '../components/common/ConversionTable';
import { PriorityFields } from '../components/common/PriorityFields';
import { TranscriptScoreTable } from '../components/common/TranscriptScoreTable';
import { QuickScoreInput } from '../components/score/QuickScoreInput';
import { ScoreInput } from '../components/score/ScoreInput';
import { MobileScoreButton } from '../components/score/MobileScoreButton';
import { ResponsiveScorePanel } from '../components/score/ResponsiveScorePanel';
import { ScoreDetailCard } from '../components/score/ScoreDetailCard';
import {
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { INTL_CERT_TABLE_COLUMNS } from '../constants/common';
import {
  UEL_ENGLISH_BONUS,
  UEL_ENGLISH_CERT_TYPES,
  UEL_INTL_CERT_CONVERSION_TABLE,
  UEL_INTL_CERT_TYPES,
} from '../constants/uel';
import { clampScore, updateScoreArray } from '../utils/input';
import { findById } from '../utils/collection';

const EMPTY_HOC_BA = Array(9).fill('');
const EMPTY_THPT = ['', '', ''];

export const UelCalculator = () => {
  const { state, results } = useUelCalculator();
  const [showMobileResultModal, setShowMobileResultModal] = useState(false);
  const [showConversionTable, setShowConversionTable] = useState(false);
  const [showCcqtConversionTable, setShowCcqtConversionTable] = useState(false);

  const handleHocBaChange = (index, val) => {
    updateScoreArray(state.hocBa, state.setHocBa, index, val, 10);
  };

  const handleThptChange = (index, val) => {
    updateScoreArray(state.thpt, state.setThpt, index, val, 10);
  };

  // Visibility logic
  const isChinhQuy = state.program === 'CHINH_QUY';
  const showHocBa = state.dtXetTuyen !== 'DT4';
  const showDgnl =
    (isChinhQuy && (state.dtXetTuyen === 'DT1' || state.dtXetTuyen === 'DT3')) ||
    (!isChinhQuy && state.dtXetTuyen === 'DT1');
  const showThpt =
    (isChinhQuy && (state.dtXetTuyen === 'DT1' || state.dtXetTuyen === 'DT2')) ||
    (!isChinhQuy && (state.dtXetTuyen === 'DT1' || state.dtXetTuyen === 'DT2'));
  const showCcqt = isChinhQuy && state.dtXetTuyen === 'DT4';
  const hasThptDetail = state.thpt.some((value) => value !== '');
  const hasThptQuickTotal = state.thptQuickTotal !== '';
  const hasHocBaDetail = state.hocBa.some((value) => value !== '');
  const hasHocBaQuickTotal = state.hocBaQuickTotal !== '';
  const selectedCcqtType = findById(UEL_INTL_CERT_TYPES, state.loaiCCQT);
  const selectedEnglishCertType = findById(UEL_ENGLISH_CERT_TYPES, state.loaiNgoaiNgu);

  const learningWeights = (() => {
    if (state.dtXetTuyen === 'DT1') return { dgnl: 55, thpt: 35, hocBa: 10 };
    if (state.dtXetTuyen === 'DT2') return { dgnl: 0, thpt: isChinhQuy ? 90 : 50, hocBa: isChinhQuy ? 10 : 50 };
    if (state.dtXetTuyen === 'DT3') return { dgnl: 90, thpt: 0, hocBa: 10 };
    return null;
  })();

  const setQuickTotal = (setter, value) => {
    setter(clampScore(value, 30));
  };

  // Sequential step numbers starting after merged section 1
  let nextStep = 2;
  const stepHocBa = showHocBa ? nextStep++ : null;
  const stepExam = showDgnl || showThpt ? nextStep++ : null;
  const stepCcqt = showCcqt ? nextStep++ : null;
  const stepPriority = nextStep++;

  const hasMeaningfulInput =
    state.program !== 'CHINH_QUY' ||
    state.dtXetTuyen !== 'DT1' ||
    hasHocBaDetail ||
    hasHocBaQuickTotal ||
    hasThptDetail ||
    hasThptQuickTotal ||
    state.dgnl !== '' ||
    state.diemCCQT !== '' ||
    state.hasNgoaiNgu ||
    state.la149Truong ||
    state.kv !== 'KV3' ||
    state.dt !== 'NONE';

  const persistenceFields = useMemo(
    () => [
      { key: 'program', value: state.program, defaultValue: 'CHINH_QUY', apply: state.setProgram },
      { key: 'dtXetTuyen', value: state.dtXetTuyen, defaultValue: 'DT1', apply: state.setDtXetTuyen },
      { key: 'hocBa', value: state.hocBa, defaultValue: EMPTY_HOC_BA, apply: state.setHocBa },
      { key: 'hocBaQuickTotal', value: state.hocBaQuickTotal, defaultValue: '', apply: state.setHocBaQuickTotal },
      { key: 'thpt', value: state.thpt, defaultValue: EMPTY_THPT, apply: state.setThpt },
      { key: 'thptQuickTotal', value: state.thptQuickTotal, defaultValue: '', apply: state.setThptQuickTotal },
      { key: 'dgnl', value: state.dgnl, defaultValue: '', apply: state.setDgnl },
      { key: 'loaiCCQT', value: state.loaiCCQT, defaultValue: 'SAT', apply: state.setLoaiCCQT },
      { key: 'diemCCQT', value: state.diemCCQT, defaultValue: '', apply: state.setDiemCCQT },
      { key: 'hasNgoaiNgu', value: state.hasNgoaiNgu, defaultValue: false, apply: state.setHasNgoaiNgu },
      { key: 'loaiNgoaiNgu', value: state.loaiNgoaiNgu, defaultValue: 'IELTS', apply: state.setLoaiNgoaiNgu },
      { key: 'diemNgoaiNgu', value: state.diemNgoaiNgu, defaultValue: '', apply: state.setDiemNgoaiNgu },
      { key: 'diemNgoaiNgu2', value: state.diemNgoaiNgu2, defaultValue: '', apply: state.setDiemNgoaiNgu2 },
      { key: 'la149Truong', value: state.la149Truong, defaultValue: false, apply: state.setLa149Truong },
      { key: 'kv', value: state.kv, defaultValue: 'KV3', apply: state.setKv },
      { key: 'dt', value: state.dt, defaultValue: 'NONE', apply: state.setDt },
    ],
    [
      state.program,
      state.setProgram,
      state.dtXetTuyen,
      state.setDtXetTuyen,
      state.hocBa,
      state.setHocBa,
      state.hocBaQuickTotal,
      state.setHocBaQuickTotal,
      state.thpt,
      state.setThpt,
      state.thptQuickTotal,
      state.setThptQuickTotal,
      state.dgnl,
      state.setDgnl,
      state.loaiCCQT,
      state.setLoaiCCQT,
      state.diemCCQT,
      state.setDiemCCQT,
      state.hasNgoaiNgu,
      state.setHasNgoaiNgu,
      state.loaiNgoaiNgu,
      state.setLoaiNgoaiNgu,
      state.diemNgoaiNgu,
      state.setDiemNgoaiNgu,
      state.diemNgoaiNgu2,
      state.setDiemNgoaiNgu2,
      state.la149Truong,
      state.setLa149Truong,
      state.kv,
      state.setKv,
      state.dt,
      state.setDt,
    ]
  );

  const {
    setHocBa,
    setHocBaQuickTotal,
    setThpt,
    setThptQuickTotal,
    setDgnl,
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
      maxDgnl: 1200,
      setKv,
      setDt,
    }),
    [
      setHocBa,
      setHocBaQuickTotal,
      setThpt,
      setThptQuickTotal,
      setDgnl,
      setKv,
      setDt,
    ]
  );

  const baseId = useId();
  const {
    importSources,
    importFromSchool,
    resetSchool,
    buildShareUrl,
    presets,
    savePreset,
    loadPreset,
    deletePreset,
  } =
    useCalculatorPersistence({
      schoolId: 'uel',
      schoolAcronym: 'UEL',
      fields: persistenceFields,
      hasMeaningfulInput,
      total: results.total,
      shared: sharedConfig,
    });

  return (
    <>
      <div className="mx-auto max-w-7xl pb-28 animate-in fade-in">
        <CalculatorPageHeader
          schoolId="uel"
          acronym="UEL"
          title="Trường Đại học Kinh tế - Luật"
          subtitle="Xét tuyển tổng hợp 2026 · Thang 100 · Hệ Chính quy & Liên kết quốc tế theo 4 nhóm đối tượng (ĐT1–ĐT4)."
          importSources={importSources}
          hasMeaningfulInput={hasMeaningfulInput}
          onImportFromSchool={importFromSchool}
          onReset={resetSchool}
          presets={presets}
          onSavePreset={savePreset}
          onLoadPreset={loadPreset}
          onDeletePreset={deletePreset}
        />

        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
          {/* Left Column - Forms */}
          <div className="flex-1 space-y-6">
            <CardSection title="1. Hệ đào tạo & Đối tượng" tone="indigo">
              <div className="space-y-4">
                <div className="flex rounded-panel border border-hairline bg-surface-subtle p-1">
                  <button
                    type="button"
                    onClick={() => {
                      state.setProgram('CHINH_QUY');
                      state.setDtXetTuyen('DT1');
                    }}
                    className={`btn-tactile flex-1 px-4 py-2 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 ${
                      isChinhQuy
                        ? 'bg-indigo-600 text-white shadow-sm dark:bg-indigo-500'
                        : 'text-ink-secondary hover:text-ink'
                    }`}
                  >
                    Chính quy
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      state.setProgram('LIEN_KET');
                      state.setDtXetTuyen('DT1');
                    }}
                    className={`btn-tactile flex-1 px-4 py-2 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 ${
                      !isChinhQuy
                        ? 'bg-indigo-600 text-white shadow-sm dark:bg-indigo-500'
                        : 'text-ink-secondary hover:text-ink'
                    }`}
                  >
                    Liên kết quốc tế
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <label
                    className={`flex cursor-pointer flex-col rounded-panel border p-3.5 transition-colors duration-150 ${
                      state.dtXetTuyen === 'DT1'
                        ? 'border-indigo-500/60 bg-indigo-500/10 ring-1 ring-indigo-500/40'
                        : 'border-hairline bg-surface hover:border-hairline-hover hover:bg-surface-subtle'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="dt"
                        value="DT1"
                        checked={state.dtXetTuyen === 'DT1'}
                        onChange={() => state.setDtXetTuyen('DT1')}
                        className="h-4 w-4 text-indigo-600 focus-visible:ring-indigo-600"
                      />
                      <span className="font-mono font-bold text-ink">ĐT1</span>
                    </div>
                    <span className="mt-1 pl-6 font-mono text-xs text-ink-muted">
                      55% ĐGNL · 35% THPT · 10% HB
                    </span>
                  </label>

                  <label
                    className={`flex cursor-pointer flex-col rounded-panel border p-3.5 transition-colors duration-150 ${
                      state.dtXetTuyen === 'DT2'
                        ? 'border-indigo-500/60 bg-indigo-500/10 ring-1 ring-indigo-500/40'
                        : 'border-hairline bg-surface hover:border-hairline-hover hover:bg-surface-subtle'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="dt"
                        value="DT2"
                        checked={state.dtXetTuyen === 'DT2'}
                        onChange={() => state.setDtXetTuyen('DT2')}
                        className="h-4 w-4 text-indigo-600 focus-visible:ring-indigo-600"
                      />
                      <span className="font-mono font-bold text-ink">ĐT2</span>
                    </div>
                    <span className="mt-1 pl-6 font-mono text-xs text-ink-muted">
                      {isChinhQuy ? '90% THPT · 10% HB' : '50% THPT · 50% HB'}
                    </span>
                  </label>

                  {isChinhQuy && (
                    <>
                      <label
                        className={`flex cursor-pointer flex-col rounded-panel border p-3.5 transition-colors duration-150 ${
                          state.dtXetTuyen === 'DT3'
                            ? 'border-indigo-500/60 bg-indigo-500/10 ring-1 ring-indigo-500/40'
                            : 'border-hairline bg-surface hover:border-hairline-hover hover:bg-surface-subtle'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <input
                            type="radio"
                            name="dt"
                            value="DT3"
                            checked={state.dtXetTuyen === 'DT3'}
                            onChange={() => state.setDtXetTuyen('DT3')}
                            className="h-4 w-4 text-indigo-600 focus-visible:ring-indigo-600"
                          />
                          <span className="font-mono font-bold text-ink">ĐT3</span>
                        </div>
                        <span className="mt-1 pl-6 font-mono text-xs text-ink-muted">
                          90% ĐGNL · 10% HB
                        </span>
                      </label>

                      <label
                        className={`flex cursor-pointer flex-col rounded-panel border p-3.5 transition-colors duration-150 ${
                          state.dtXetTuyen === 'DT4'
                            ? 'border-indigo-500/60 bg-indigo-500/10 ring-1 ring-indigo-500/40'
                            : 'border-hairline bg-surface hover:border-hairline-hover hover:bg-surface-subtle'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <input
                            type="radio"
                            name="dt"
                            value="DT4"
                            checked={state.dtXetTuyen === 'DT4'}
                            onChange={() => state.setDtXetTuyen('DT4')}
                            className="h-4 w-4 text-indigo-600 focus-visible:ring-indigo-600"
                          />
                          <span className="font-mono font-bold text-ink">ĐT4</span>
                        </div>
                        <span className="mt-1 pl-6 text-xs text-ink-muted">
                          Chứng chỉ quốc tế (SAT, ACT, IB, A-Level)
                        </span>
                      </label>
                    </>
                  )}
                </div>
              </div>
            </CardSection>

            {/* Học bạ */}
            {showHocBa && (
              <CardSection title={`${stepHocBa}. Điểm học bạ`} tone="indigo">
                <div className="space-y-4">
                  <TranscriptScoreTable
                    values={state.hocBa}
                    onChange={handleHocBaChange}
                    onBulkChange={state.setHocBa}
                    disabled={hasHocBaQuickTotal}
                    tone="indigo"
                    onClear={() => state.setHocBa(EMPTY_HOC_BA)}
                    onUnlockQuick={() => state.setHocBaQuickTotal('')}
                  />
                  <QuickScoreInput
                    title="Tổng học bạ (thang 30)"
                    value={hasHocBaDetail ? ((results.Z / 100) * 30).toFixed(2) : state.hocBaQuickTotal}
                    onChange={(event) => setQuickTotal(state.setHocBaQuickTotal, event.target.value)}
                    onClear={() => state.setHocBaQuickTotal('')}
                    disabled={hasHocBaDetail}
                    placeholder="0.00"
                    tone="indigo"
                    maxIntPartLength={2}
                  />
                </div>
              </CardSection>
            )}

            {/* Điểm Thi */}
            {(showDgnl || showThpt) && (
              <CardSection title={`${stepExam}. Điểm thi`} tone="indigo">
                <div className="space-y-6">
                  {/* Điểm Thi THPT */}
                  {showThpt && (
                    <div>
                      <h3 className="mb-3 text-sm font-semibold text-ink">THPT</h3>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        {[0, 1, 2].map((idx) => (
                          <div key={`thpt-${idx}`}>
                            <label
                              htmlFor={`${baseId}-thpt-${idx}`}
                              className="mb-1.5 block text-sm font-medium text-ink"
                            >
                              Môn {idx + 1}
                            </label>
                            <ScoreInput
                              id={`${baseId}-thpt-${idx}`}
                              max={10}
                              value={state.thpt[idx]}
                              onValueChange={(value) => handleThptChange(idx, value)}
                              disabled={hasThptQuickTotal}
                              tone="indigo"
                              placeholder="0.00"
                            />
                          </div>
                        ))}
                      </div>
                      <QuickScoreInput
                        title="Tổng THPT (thang 30)"
                        value={hasThptDetail ? ((results.Y / 100) * 30).toFixed(2) : state.thptQuickTotal}
                        onChange={(event) => setQuickTotal(state.setThptQuickTotal, event.target.value)}
                        onClear={() => state.setThptQuickTotal('')}
                        disabled={hasThptDetail}
                        placeholder="0.00"
                        tone="indigo"
                        className="mt-4"
                        maxIntPartLength={2}
                      />
                    </div>
                  )}

                  {/* Điểm thi ĐGNL */}
                  {showDgnl && (
                    <div className={showThpt ? 'border-t border-hairline pt-6' : ''}>
                      <h3 className="mb-3 text-sm font-semibold text-ink">ĐGNL</h3>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:items-end">
                        <div>
                          <label
                            htmlFor={`${baseId}-dgnl`}
                            className="mb-1.5 block text-sm font-medium text-ink"
                          >
                            Điểm ĐGNL (thang 1200)
                          </label>
                          <ScoreInput
                            id={`${baseId}-dgnl`}
                            max={1200}
                            value={state.dgnl}
                            onValueChange={state.setDgnl}
                            integer
                            tone="indigo"
                            inputClassName="text-base font-semibold"
                            placeholder="850"
                          />
                        </div>
                        <div className="flex items-center justify-between rounded-control border border-hairline bg-surface-subtle px-3.5 py-2 text-sm">
                          <span className="text-ink-secondary">Chuẩn hóa thang 100</span>
                          <span className="font-mono font-bold tabular-nums text-ink">
                            {results.X.toFixed(2)} / 100
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardSection>
            )}

            {/* CCQT */}
            {showCcqt && (
              <CardSection title={`${stepCcqt}. Chứng chỉ quốc tế`} tone="indigo">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
                  <div>
                    <label
                      htmlFor={`${baseId}-ccqt-type`}
                      className="mb-2 block text-sm font-medium text-ink"
                    >
                      Loại chứng chỉ
                    </label>
                    <select
                      id={`${baseId}-ccqt-type`}
                      value={state.loaiCCQT}
                      onChange={(e) => {
                        state.setLoaiCCQT(e.target.value);
                        state.setDiemCCQT('');
                      }}
                      className="select-control focus-visible:ring-indigo-600"
                    >
                      {UEL_INTL_CERT_TYPES.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor={`${baseId}-ccqt-score`}
                      className="mb-2 block text-sm font-medium text-ink"
                    >
                      Điểm / Hạng
                    </label>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        {state.loaiCCQT === 'A_LEVEL' ? (
                          <select
                            id={`${baseId}-ccqt-score`}
                            value={state.diemCCQT}
                            onChange={(e) => state.setDiemCCQT(e.target.value)}
                            className="select-control focus-visible:ring-indigo-600"
                          >
                            <option value="">Chọn hạng</option>
                            <option value="A*">A*</option>
                            <option value="A">A</option>
                            <option value="B">B</option>
                            <option value="C">C</option>
                          </select>
                        ) : (
                          <ScoreInput
                            id={`${baseId}-ccqt-score`}
                            max={selectedCcqtType?.max}
                            value={state.diemCCQT}
                            onValueChange={state.setDiemCCQT}
                            integer
                            tone="indigo"
                            placeholder="1450"
                          />
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowCcqtConversionTable(true)}
                        className="btn-tactile min-h-[36px] whitespace-nowrap px-2.5 py-2 text-xs font-semibold text-indigo-700 hover:bg-indigo-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 sm:min-h-[30px] dark:text-indigo-400"
                      >
                        Bảng quy đổi
                      </button>
                    </div>
                  </div>
                </div>
              </CardSection>
            )}

            {/* Thành tích & Ưu tiên */}
            <CardSection title={`${stepPriority}. Ưu tiên & Điểm cộng`} tone="indigo">
              <div className="space-y-6">
                <PriorityFields
                  kv={state.kv}
                  onKvChange={state.setKv}
                  dt={state.dt}
                  onDtChange={state.setDt}
                  tone="indigo"
                />

                <div className="space-y-3 border-t border-hairline pt-5">
                  <div className="rounded-panel border border-hairline bg-surface-subtle p-3.5">
                    <label className="flex cursor-pointer items-center gap-3">
                      <input
                        type="checkbox"
                        checked={state.hasNgoaiNgu}
                        onChange={(e) => state.setHasNgoaiNgu(e.target.checked)}
                        className="h-4 w-4 rounded text-indigo-600 focus-visible:ring-indigo-600"
                      />
                      <span className="text-sm font-medium text-ink">
                        Chứng chỉ tiếng Anh
                      </span>
                    </label>

                    {state.hasNgoaiNgu && (
                      <div className="mt-3 space-y-2 border-t border-hairline pt-3">
                        <div className="flex flex-col gap-3 sm:flex-row">
                          <div className="flex-1">
                            <label
                              htmlFor={`${baseId}-eng-type`}
                              className="mb-1 block text-xs font-medium text-ink-secondary"
                            >
                              Loại chứng chỉ
                            </label>
                            <select
                              id={`${baseId}-eng-type`}
                              value={state.loaiNgoaiNgu}
                              onChange={(e) => {
                                state.setLoaiNgoaiNgu(e.target.value);
                                state.setDiemNgoaiNgu('');
                                state.setDiemNgoaiNgu2('');
                              }}
                              className="select-control focus-visible:ring-indigo-600"
                            >
                              {UEL_ENGLISH_CERT_TYPES.map((c) => (
                                <option key={c.id} value={c.id}>
                                  {c.name}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="flex w-full gap-2 sm:w-52">
                            {state.loaiNgoaiNgu === 'TOEIC' ? (
                              <>
                                <div className="flex-1">
                                  <label
                                    htmlFor={`${baseId}-eng-lr`}
                                    className="mb-1 block text-xs font-medium text-ink-secondary"
                                  >
                                    Nghe-Đọc
                                  </label>
                                  <ScoreInput
                                    id={`${baseId}-eng-lr`}
                                    step="5"
                                    max={selectedEnglishCertType?.maxLr}
                                    value={state.diemNgoaiNgu}
                                    onValueChange={state.setDiemNgoaiNgu}
                                    tone="indigo"
                                    inputClassName="text-sm"
                                    placeholder="785"
                                  />
                                </div>
                                <div className="flex-1">
                                  <label
                                    htmlFor={`${baseId}-eng-sw`}
                                    className="mb-1 block text-xs font-medium text-ink-secondary"
                                  >
                                    Nói-Viết
                                  </label>
                                  <ScoreInput
                                    id={`${baseId}-eng-sw`}
                                    step="5"
                                    max={selectedEnglishCertType?.maxSw}
                                    value={state.diemNgoaiNgu2}
                                    onValueChange={state.setDiemNgoaiNgu2}
                                    tone="indigo"
                                    inputClassName="text-sm"
                                    placeholder="310"
                                  />
                                </div>
                              </>
                            ) : (
                              <div className="flex-1">
                                <label
                                  htmlFor={`${baseId}-eng-score`}
                                  className="mb-1 block text-xs font-medium text-ink-secondary"
                                >
                                  Điểm
                                </label>
                                <ScoreInput
                                  id={`${baseId}-eng-score`}
                                  max={selectedEnglishCertType?.max}
                                  value={state.diemNgoaiNgu}
                                  onValueChange={state.setDiemNgoaiNgu}
                                  tone="indigo"
                                  inputClassName="text-sm"
                                  placeholder="6.5"
                                />
                              </div>
                            )}
                          </div>
                          <div className="flex items-end pb-0.5">
                            <button
                              type="button"
                              onClick={() => setShowConversionTable(true)}
                              className="btn-tactile min-h-[36px] whitespace-nowrap px-2.5 py-2 text-xs font-semibold text-indigo-700 hover:bg-indigo-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 sm:min-h-[30px] dark:text-indigo-400"
                            >
                              Bảng quy đổi
                            </button>
                          </div>
                        </div>

                        {results.nnPoint > 0 && (
                          <div className="mt-2 flex items-center gap-1.5 font-mono text-xs font-semibold tabular-nums text-emerald-600 animate-in fade-in dark:text-emerald-400">
                            <CheckCircle2 className="h-4 w-4" />
                            +{results.nnPoint.toFixed(1)} điểm
                          </div>
                        )}
                        {((state.loaiNgoaiNgu !== 'TOEIC' && state.diemNgoaiNgu) ||
                          (state.loaiNgoaiNgu === 'TOEIC' && state.diemNgoaiNgu && state.diemNgoaiNgu2)) &&
                          results.nnPoint === 0 && (
                            <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-rose-600 animate-in fade-in dark:text-rose-400">
                              <XCircle className="h-4 w-4" />
                              Chưa đạt mức tối thiểu
                            </div>
                          )}
                      </div>
                    )}
                  </div>

                  {isChinhQuy && (
                    <label className="flex cursor-pointer items-center gap-3 rounded-panel border border-hairline bg-surface-subtle p-3.5 transition-colors hover:border-hairline-hover">
                      <input
                        type="checkbox"
                        checked={state.la149Truong}
                        onChange={(e) => state.setLa149Truong(e.target.checked)}
                        className="h-4 w-4 rounded text-indigo-600 focus-visible:ring-indigo-600"
                      />
                      <span className="text-sm font-medium text-ink">
                        Thuộc 149 trường THPT ưu tiên ĐHQG (+5 điểm)
                      </span>
                    </label>
                  )}
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
              theme="indigo"
              schoolAcronym="UEL"
              total={results.total}
              getShareUrl={buildShareUrl}
              formula={
                learningWeights
                  ? `ĐHL = ĐGNL × ${learningWeights.dgnl}% + THPT × ${learningWeights.thpt}% + Học bạ × ${learningWeights.hocBa}%`
                  : results.textFormula
              }
              dhl={results.dhl}
              dgnlScore={state.dtXetTuyen !== 'DT4' && showDgnl ? results.X.toFixed(2) : undefined}
              thptScore={state.dtXetTuyen !== 'DT4' && showThpt ? results.Y.toFixed(2) : undefined}
              hocBaScore={state.dtXetTuyen !== 'DT4' && showHocBa ? results.Z.toFixed(2) : undefined}
              bonusRows={[
                { label: 'Cộng ngoại ngữ', value: `+${results.nnPoint.toFixed(2)}` },
                { label: 'Cộng trường ưu tiên', value: `+${results.truongUuTienPoint.toFixed(2)}` },
                { label: 'Tổng điểm cộng (Gốc)', value: `+${results.dcGoc.toFixed(2)}`, separatorBefore: true },
                { label: 'Cộng thực nhận', value: `+${results.dcThucNhan.toFixed(2)}`, variant: 'bonusEffective' },
              ]}
              priorityRows={[
                { label: 'Ưu tiên KV/ĐT (Gốc)', value: `+${results.uuTien100.toFixed(2)}` },
                { label: 'Ưu tiên thực nhận', value: `+${results.uuTienThucNhan.toFixed(2)}`, variant: 'priorityEffective' },
              ]}
            />
          </ResponsiveScorePanel>
        </div>

        <MobileScoreButton
          score={results.total}
          tone="indigo"
          onClick={() => setShowMobileResultModal(true)}
        />
      </div>

      <ConversionModal
        isOpen={showConversionTable}
        title="Bảng quy đổi Chứng chỉ ngoại ngữ"
        onClose={() => setShowConversionTable(false)}
      >
        <div className="overflow-x-auto">
          <ConversionTable
            align="left"
            columns={[
              {
                key: 'point',
                header: 'Điểm cộng',
                value: true,
                cellClassName: 'whitespace-nowrap px-4 py-2 font-mono font-semibold tabular-nums text-blue-700 dark:text-blue-400',
              },
              { key: 'ielts', header: 'IELTS' },
              { key: 'linguaskillB1', header: 'Linguaskill B1' },
              { key: 'linguaskillB2', header: 'Linguaskill B2' },
              { key: 'toeicNd', header: 'TOEIC NĐ' },
              { key: 'toeicNv', header: 'TOEIC NV' },
              { key: 'toefl', header: 'TOEFL iBT' },
            ]}
            rows={UEL_ENGLISH_BONUS.map((row) => {
              const parts = row.desc.split('|').map((part) => part.trim());
              const getPart = (keyword) => {
                const match = parts.find((part) => part.includes(keyword));
                if (!match) return '-';
                return match.replace(keyword, '').replace(':', '').replace('≥', '').trim();
              };

              return {
                key: row.id,
                point: `+${row.point.toFixed(1)}`,
                ielts: getPart('IELTS'),
                linguaskillB1: getPart('Linguaskill/B1'),
                linguaskillB2: getPart('Linguaskill/B2'),
                toeicNd: getPart('TOEIC NĐ'),
                toeicNv: getPart('TOEIC NV'),
                toefl: getPart('TOEFL iBT'),
                highlighted: state.hasNgoaiNgu && results.nnPoint > 0 && row.point === results.nnPoint,
              };
            })}
          />
        </div>
      </ConversionModal>

      <ConversionModal
        isOpen={showCcqtConversionTable}
        title="Bảng quy đổi Chứng chỉ quốc tế"
        onClose={() => setShowCcqtConversionTable(false)}
      >
        <div className="overflow-x-auto">
          <ConversionTable
            columns={INTL_CERT_TABLE_COLUMNS}
            rows={UEL_INTL_CERT_CONVERSION_TABLE.map((row) => ({
              ...row,
              highlighted:
                state.dtXetTuyen === 'DT4' &&
                state.diemCCQT !== '' &&
                results.dhl > 0 &&
                row.point === results.dhl,
            }))}
          />
        </div>
      </ConversionModal>
    </>
  );
};
