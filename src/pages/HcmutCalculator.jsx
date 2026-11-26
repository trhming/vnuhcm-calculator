import { useId, useMemo, useState } from 'react';
import { useHcmutCalculator } from '../hooks/useHcmutCalculator';
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
import { CheckCircle2 } from 'lucide-react';
import { INTL_CERT_TABLE_COLUMNS } from '../constants/common';
import {
  DOI_TUONG_HCMUT,
  HCMUT_ENGLISH_TABLES,
  HCMUT_ENGLISH_TYPES,
  HCMUT_INTL_CERT_CONVERSION_TABLE,
  HCMUT_INTL_CERT_TYPES,
} from '../constants/hcmut';
import { clampScore, updateScoreArray } from '../utils/input';
import { findById } from '../utils/collection';

const EMPTY_HOC_BA = Array(9).fill('');
const EMPTY_THPT = ['', '', ''];

const HCMUT_GROUP_HINTS = {
  '2.1': 'Có ĐGNL · 4 phần, Toán ×2',
  '2.2': 'Không thi ĐGNL · ĐNL = THPT × 0.75',
  '2.4': 'Chứng chỉ quốc tế · SAT, ACT, IB, A-Level',
};

export const HcmutCalculator = () => {
  const { state, results } = useHcmutCalculator();
  const [showMobileResultModal, setShowMobileResultModal] = useState(false);
  const [showConversionTable, setShowConversionTable] = useState(false);
  const [showIntlCertTable, setShowIntlCertTable] = useState(false);

  const handleHocBaChange = (index, val) => {
    updateScoreArray(state.hocBa, state.setHocBa, index, val, 10);
  };

  const handleHocBaQuickAverageChange = (val) => {
    state.setHocBaQuickAverage(clampScore(val, 10, 0, 1));
  };

  const handleThptChange = (index, val) => {
    updateScoreArray(state.thpt, state.setThpt, index, val, 10);
  };

  const handleThptQuickTotalChange = (val) => {
    state.setThptQuickTotal(clampScore(val, 10, 0, 1));
  };

  const handleDgnlQuickTotalChange = (val) => {
    state.setDgnlQuickTotal(clampScore(val, 1500));
  };

  const hasHocBaDetail = state.hocBa.some((val) => val !== '');
  const hasHocBaQuickAverage = state.hocBaQuickAverage !== '';
  const hasThptDetail =
    state.thpt.some((val) => val !== '') ||
    (state.isNgoaiNgu && (state.diemNgoaiNgu !== '' || state.toeicLr !== '' || state.toeicSw !== ''));
  const hasThptQuickTotal = state.thptQuickTotal !== '';
  const dgnlDetailTotal =
    (parseFloat(state.dgnlTv) || 0) +
    (parseFloat(state.dgnlTa) || 0) +
    (parseFloat(state.dgnlToan) || 0) * 2 +
    (parseFloat(state.dgnlKh) || 0);
  const hasDgnlDetail =
    state.dgnlTv !== '' || state.dgnlTa !== '' || state.dgnlToan !== '' || state.dgnlKh !== '';
  const hasDgnlQuickTotal = state.dgnlQuickTotal !== '';
  const selectedIntlCert = findById(HCMUT_INTL_CERT_TYPES, state.intlCertType);
  const selectedEnglishType = findById(HCMUT_ENGLISH_TYPES, state.ngoaiNguType);

  const hasMeaningfulInput =
    hasHocBaDetail ||
    hasHocBaQuickAverage ||
    hasThptDetail ||
    hasThptQuickTotal ||
    hasDgnlDetail ||
    hasDgnlQuickTotal ||
    state.intlCertScore !== '' ||
    state.doiTuongUT !== '2.1' ||
    state.isNgoaiNgu ||
    state.thuong !== '' ||
    state.xetThuong !== '' ||
    state.khuyenKhich !== '' ||
    state.kv !== 'KV3' ||
    state.dt !== 'NONE';

  const persistenceFields = useMemo(
    () => [
      { key: 'doiTuongUT', value: state.doiTuongUT, defaultValue: '2.1', apply: state.setDoiTuongUT },
      { key: 'dgnlTv', value: state.dgnlTv, defaultValue: '', apply: state.setDgnlTv },
      { key: 'dgnlTa', value: state.dgnlTa, defaultValue: '', apply: state.setDgnlTa },
      { key: 'dgnlToan', value: state.dgnlToan, defaultValue: '', apply: state.setDgnlToan },
      { key: 'dgnlKh', value: state.dgnlKh, defaultValue: '', apply: state.setDgnlKh },
      { key: 'dgnlQuickTotal', value: state.dgnlQuickTotal, defaultValue: '', apply: state.setDgnlQuickTotal },
      { key: 'intlCertType', value: state.intlCertType, defaultValue: 'SAT', apply: state.setIntlCertType },
      { key: 'intlCertScore', value: state.intlCertScore, defaultValue: '', apply: state.setIntlCertScore },
      { key: 'hocBa', value: state.hocBa, defaultValue: EMPTY_HOC_BA, apply: state.setHocBa },
      { key: 'hocBaQuickAverage', value: state.hocBaQuickAverage, defaultValue: '', apply: state.setHocBaQuickAverage },
      { key: 'thpt', value: state.thpt, defaultValue: EMPTY_THPT, apply: state.setThpt },
      { key: 'thptQuickTotal', value: state.thptQuickTotal, defaultValue: '', apply: state.setThptQuickTotal },
      { key: 'isNgoaiNgu', value: state.isNgoaiNgu, defaultValue: false, apply: state.setIsNgoaiNgu },
      { key: 'ngoaiNguType', value: state.ngoaiNguType, defaultValue: 'IELTS', apply: state.setNgoaiNguType },
      { key: 'diemNgoaiNgu', value: state.diemNgoaiNgu, defaultValue: '', apply: state.setDiemNgoaiNgu },
      { key: 'toeicLr', value: state.toeicLr, defaultValue: '', apply: state.setToeicLr },
      { key: 'toeicSw', value: state.toeicSw, defaultValue: '', apply: state.setToeicSw },
      { key: 'kv', value: state.kv, defaultValue: 'KV3', apply: state.setKv },
      { key: 'dt', value: state.dt, defaultValue: 'NONE', apply: state.setDt },
      { key: 'thuong', value: state.thuong, defaultValue: '', apply: state.setThuong },
      { key: 'xetThuong', value: state.xetThuong, defaultValue: '', apply: state.setXetThuong },
      { key: 'khuyenKhich', value: state.khuyenKhich, defaultValue: '', apply: state.setKhuyenKhich },
    ],
    [
      state.doiTuongUT,
      state.setDoiTuongUT,
      state.dgnlTv,
      state.setDgnlTv,
      state.dgnlTa,
      state.setDgnlTa,
      state.dgnlToan,
      state.setDgnlToan,
      state.dgnlKh,
      state.setDgnlKh,
      state.dgnlQuickTotal,
      state.setDgnlQuickTotal,
      state.intlCertType,
      state.setIntlCertType,
      state.intlCertScore,
      state.setIntlCertScore,
      state.hocBa,
      state.setHocBa,
      state.hocBaQuickAverage,
      state.setHocBaQuickAverage,
      state.thpt,
      state.setThpt,
      state.thptQuickTotal,
      state.setThptQuickTotal,
      state.isNgoaiNgu,
      state.setIsNgoaiNgu,
      state.ngoaiNguType,
      state.setNgoaiNguType,
      state.diemNgoaiNgu,
      state.setDiemNgoaiNgu,
      state.toeicLr,
      state.setToeicLr,
      state.toeicSw,
      state.setToeicSw,
      state.kv,
      state.setKv,
      state.dt,
      state.setDt,
      state.thuong,
      state.setThuong,
      state.xetThuong,
      state.setXetThuong,
      state.khuyenKhich,
      state.setKhuyenKhich,
    ]
  );

  const {
    setHocBa,
    setHocBaQuickAverage,
    setThpt,
    setThptQuickTotal,
    setKv,
    setDt,
  } = state;

  const sharedConfig = useMemo(
    () => ({
      setHocBa,
      setHocBaQuick: setHocBaQuickAverage,
      hocBaQuickScale: 10,
      setThpt,
      setThptQuick: setThptQuickTotal,
      thptQuickScale: 10,
      setKv,
      setDt,
    }),
    [
      setHocBa,
      setHocBaQuickAverage,
      setThpt,
      setThptQuickTotal,
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
      schoolId: 'hcmut',
      schoolAcronym: 'HCMUT',
      fields: persistenceFields,
      hasMeaningfulInput,
      total: results.total,
      shared: sharedConfig,
    });

  return (
    <div className="mx-auto max-w-7xl pb-28 animate-in fade-in">
      <CalculatorPageHeader
        schoolId="hcmut"
        acronym="HCMUT"
        title="Trường Đại học Bách khoa"
        subtitle="Xét tuyển tổng hợp 2026 · Thang 100 · ĐGNL (Toán ×2), THPT và Học bạ theo nhóm ĐT 2.1, 2.2, 2.4."
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
          {/* Thông tin Dự tuyển */}
          <CardSection title="1. Đối tượng dự tuyển" tone="hcmut">
            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {DOI_TUONG_HCMUT.map((item) => {
                  const isActive = state.doiTuongUT === item.id;
                  return (
                    <label
                      key={item.id}
                      className={`flex cursor-pointer flex-col rounded-panel border p-3.5 transition-colors duration-150 ${
                        isActive
                          ? 'border-blue-600/60 bg-blue-500/10 ring-1 ring-blue-600/40 dark:border-blue-400/60'
                          : 'border-hairline bg-surface hover:border-hairline-hover hover:bg-surface-subtle'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="doiTuongUT"
                          value={item.id}
                          checked={isActive}
                          onChange={(e) => state.setDoiTuongUT(e.target.value)}
                          className="h-4 w-4 text-blue-700 focus-visible:ring-blue-600"
                        />
                        <span className="font-mono text-sm font-bold text-ink">ĐT {item.id}</span>
                      </div>
                      <p className="mt-1.5 text-xs text-ink-secondary">
                        {HCMUT_GROUP_HINTS[item.id]}
                      </p>
                    </label>
                  );
                })}
              </div>

              {state.doiTuongUT === '2.1' && (
                <div className="rounded-panel border border-hairline bg-surface-subtle p-4 animate-in slide-in-from-top-2 duration-200">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-ink">
                      ĐGNL (4 phần)
                    </span>
                    <span className="font-mono text-xs font-bold tabular-nums text-blue-700 dark:text-blue-400">
                      {hasDgnlQuickTotal ? state.dgnlQuickTotal : dgnlDetailTotal} / 1500
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor={`${baseId}-dgnl-tv`} className="mb-1 block text-xs font-medium text-ink-secondary">
                        Tiếng Việt
                      </label>
                      <ScoreInput
                        id={`${baseId}-dgnl-tv`}
                        max={300}
                        maxIntPartLength={1}
                        value={state.dgnlTv}
                        onValueChange={state.setDgnlTv}
                        disabled={hasDgnlQuickTotal}
                        integer
                        tone="hcmut"
                        placeholder="0–300"
                      />
                    </div>
                    <div>
                      <label htmlFor={`${baseId}-dgnl-ta`} className="mb-1 block text-xs font-medium text-ink-secondary">
                        Tiếng Anh
                      </label>
                      <ScoreInput
                        id={`${baseId}-dgnl-ta`}
                        max={300}
                        maxIntPartLength={1}
                        value={state.dgnlTa}
                        onValueChange={state.setDgnlTa}
                        disabled={hasDgnlQuickTotal}
                        integer
                        tone="hcmut"
                        placeholder="0–300"
                      />
                    </div>
                    <div>
                      <label htmlFor={`${baseId}-dgnl-toan`} className="mb-1 block text-xs font-medium text-ink-secondary">
                        Toán <span className="font-mono font-bold text-blue-700 dark:text-blue-400">(×2)</span>
                      </label>
                      <ScoreInput
                        id={`${baseId}-dgnl-toan`}
                        max={300}
                        maxIntPartLength={1}
                        value={state.dgnlToan}
                        onValueChange={state.setDgnlToan}
                        disabled={hasDgnlQuickTotal}
                        integer
                        tone="hcmut"
                        placeholder="0–300"
                      />
                    </div>
                    <div>
                      <label htmlFor={`${baseId}-dgnl-kh`} className="mb-1 block text-xs font-medium text-ink-secondary">
                        Tư duy khoa học
                      </label>
                      <ScoreInput
                        id={`${baseId}-dgnl-kh`}
                        max={300}
                        maxIntPartLength={1}
                        value={state.dgnlKh}
                        onValueChange={state.setDgnlKh}
                        disabled={hasDgnlQuickTotal}
                        integer
                        tone="hcmut"
                        placeholder="0–300"
                      />
                    </div>
                  </div>
                  <QuickScoreInput
                    title="Tổng ĐGNL (thang 1500)"
                    value={hasDgnlDetail ? dgnlDetailTotal.toFixed(0) : state.dgnlQuickTotal}
                    onChange={(e) => handleDgnlQuickTotalChange(e.target.value)}
                    onClear={() => state.setDgnlQuickTotal('')}
                    disabled={hasDgnlDetail}
                    max={1500}
                    placeholder="0"
                    tone="hcmut"
                    integer
                    className="mt-4"
                  />
                </div>
              )}

              {state.doiTuongUT === '2.4' && (
                <div className="rounded-panel border border-hairline bg-surface-subtle p-4 animate-in slide-in-from-top-2 duration-200">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-ink">Chứng chỉ quốc tế</span>
                    <button
                      type="button"
                      onClick={() => setShowIntlCertTable(true)}
                      className="btn-tactile min-h-[36px] px-2 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 sm:min-h-[30px] dark:text-blue-400"
                    >
                      Bảng quy đổi
                    </button>
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <select
                      aria-label="Loại chứng chỉ quốc tế"
                      value={state.intlCertType}
                      onChange={(e) => {
                        state.setIntlCertType(e.target.value);
                        state.setIntlCertScore('');
                      }}
                      className="select-control sm:w-44 focus-visible:ring-blue-700"
                    >
                      {HCMUT_INTL_CERT_TYPES.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                    {state.intlCertType === 'A_LEVEL' ? (
                      <select
                        aria-label="Hạng chứng chỉ quốc tế"
                        value={state.intlCertScore}
                        onChange={(e) => state.setIntlCertScore(e.target.value)}
                        className="select-control flex-1 font-mono font-bold focus-visible:ring-blue-700"
                      >
                        <option value="">Chọn loại</option>
                        <option value="A*">A*</option>
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                      </select>
                    ) : (
                      <ScoreInput
                        aria-label="Điểm chứng chỉ quốc tế"
                        maxIntPartLength={1}
                        max={selectedIntlCert?.max}
                        value={state.intlCertScore}
                        onValueChange={state.setIntlCertScore}
                        integer
                        tone="hcmut"
                        widthClass="flex-1"
                        inputClassName="font-bold text-base"
                        placeholder="Điểm"
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardSection>

          {/* Học bạ */}
          <CardSection title="2. Điểm học bạ" tone="hcmut">
            <div className="space-y-4">
              <TranscriptScoreTable
                values={state.hocBa}
                onChange={handleHocBaChange}
                onBulkChange={state.setHocBa}
                disabled={hasHocBaQuickAverage}
                tone="hcmut"
                subjectWeights={[2, 1, 1]}
                highlightedSubjects={[0]}
                onClear={() => state.setHocBa(EMPTY_HOC_BA)}
                onUnlockQuick={() => state.setHocBaQuickAverage('')}
                getCellMeta={() => ({ className: 'text-ink' })}
              />
              <QuickScoreInput
                title="Trung bình học bạ (thang 10)"
                value={hasHocBaDetail ? (results.diemHbQuyDoi / 10).toFixed(2) : state.hocBaQuickAverage}
                onChange={(e) => handleHocBaQuickAverageChange(e.target.value)}
                onClear={() => state.setHocBaQuickAverage('')}
                disabled={hasHocBaDetail}
                max={10}
                maxIntPartLength={1}
                tone="hcmut"
              />
            </div>
          </CardSection>

          {/* Điểm Thi THPT */}
          <CardSection title="3. Điểm thi THPT" tone="hcmut">
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {[0, 1, 2].map((idx) => (
                  <div key={`thpt-${idx}`}>
                    <label
                      htmlFor={`${baseId}-thpt-${idx}`}
                      className="mb-1.5 block text-sm font-medium text-ink"
                    >
                      Môn {idx + 1}{' '}
                      {idx === 0 && (
                        <span className="font-mono text-xs font-bold text-blue-700 dark:text-blue-400">
                          (Toán ×2)
                        </span>
                      )}
                    </label>
                    <ScoreInput
                      id={`${baseId}-thpt-${idx}`}
                      max={10}
                      maxIntPartLength={1}
                      value={state.thpt[idx]}
                      onValueChange={(value) => handleThptChange(idx, value)}
                      disabled={hasThptQuickTotal}
                      tone="hcmut"
                      placeholder="0.00"
                    />
                  </div>
                ))}
              </div>

              <div className="rounded-panel border border-hairline bg-surface-subtle p-3.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="flex cursor-pointer items-center gap-2 text-sm text-ink-secondary">
                    <input
                      type="checkbox"
                      checked={state.isNgoaiNgu}
                      onChange={(e) => state.setIsNgoaiNgu(e.target.checked)}
                      className="h-4 w-4 cursor-pointer rounded text-blue-700 focus-visible:ring-blue-700"
                    />
                    Quy đổi chứng chỉ ngoại ngữ (thay Môn 3)
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowConversionTable(true)}
                    className="btn-tactile min-h-[36px] px-2 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 sm:min-h-[30px] dark:text-blue-400"
                  >
                    Bảng quy đổi
                  </button>
                </div>

                {state.isNgoaiNgu && (
                  <div className="mt-3 grid grid-cols-1 gap-2 border-t border-hairline pt-3 sm:grid-cols-3">
                    <select
                      aria-label="Loại chứng chỉ ngoại ngữ"
                      value={state.ngoaiNguType}
                      onChange={(e) => {
                        state.setNgoaiNguType(e.target.value);
                        state.setDiemNgoaiNgu('');
                        state.setToeicLr('');
                        state.setToeicSw('');
                      }}
                      className="select-control px-2.5 py-2 focus-visible:ring-blue-700"
                    >
                      {HCMUT_ENGLISH_TYPES.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.name}
                        </option>
                      ))}
                    </select>

                    {state.ngoaiNguType === 'TOEIC' ? (
                      <>
                        <ScoreInput
                          aria-label="Điểm TOEIC Nghe đọc"
                          max={selectedEnglishType?.maxLr}
                          value={state.toeicLr}
                          onValueChange={state.setToeicLr}
                          tone="hcmut"
                          inputClassName="px-2.5 text-sm"
                          placeholder="Nghe đọc"
                        />
                        <ScoreInput
                          aria-label="Điểm TOEIC Nói viết"
                          max={selectedEnglishType?.maxSw}
                          value={state.toeicSw}
                          onValueChange={state.setToeicSw}
                          tone="hcmut"
                          inputClassName="px-2.5 text-sm"
                          placeholder="Nói viết"
                        />
                      </>
                    ) : (
                      <ScoreInput
                        aria-label={`Điểm ${state.ngoaiNguType}`}
                        max={selectedEnglishType?.max}
                        value={state.diemNgoaiNgu}
                        onValueChange={state.setDiemNgoaiNgu}
                        tone="hcmut"
                        inputClassName="px-2.5 text-sm"
                        placeholder={`Điểm ${state.ngoaiNguType}`}
                      />
                    )}

                    <div
                      className={`flex items-center gap-1.5 font-mono text-sm font-semibold tabular-nums text-emerald-700 dark:text-emerald-300 ${
                        state.ngoaiNguType === 'TOEIC' ? 'sm:col-span-3' : ''
                      }`}
                    >
                      {state.ngoaiNguType && results.diemNgoaiNguQuyDoi > 0 ? (
                        <>
                          <CheckCircle2 className="h-4 w-4" />
                          Quy đổi: {results.diemNgoaiNguQuyDoi} / 10
                        </>
                      ) : (
                        <span className="text-xs font-normal text-ink-muted">Chưa đạt mức quy đổi</span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <QuickScoreInput
                title="Trung bình THPT (thang 10)"
                value={hasThptDetail ? (results.diemThptQuyDoi / 10).toFixed(2) : state.thptQuickTotal}
                onChange={(e) => handleThptQuickTotalChange(e.target.value)}
                onClear={() => state.setThptQuickTotal('')}
                disabled={hasThptDetail}
                max={10}
                maxIntPartLength={1}
                tone="hcmut"
              />
            </div>
          </CardSection>

          {/* Thành tích & Ưu tiên */}
          <CardSection title="4. Ưu tiên & Điểm cộng" tone="hcmut">
            <div className="space-y-6">
              <PriorityFields
                kv={state.kv}
                onKvChange={state.setKv}
                dt={state.dt}
                onDtChange={state.setDt}
                tone="hcmut"
              />

              <div className="border-t border-hairline pt-5">
                <h4 className="mb-3 text-sm font-semibold text-ink">
                  Điểm cộng (tối đa 10)
                </h4>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
                  <div>
                    <label htmlFor={`${baseId}-thuong`} className="mb-1.5 block text-xs text-ink-secondary">
                      Điểm thưởng (≤ 10)
                    </label>
                    <ScoreInput
                      id={`${baseId}-thuong`}
                      max={10}
                      value={state.thuong}
                      onValueChange={state.setThuong}
                      tone="hcmut"
                      maxIntPartLength={1}
                    />
                  </div>
                  <div>
                    <label htmlFor={`${baseId}-xet-thuong`} className="mb-1.5 block text-xs text-ink-secondary">
                      Xét thưởng (≤ 5)
                    </label>
                    <ScoreInput
                      id={`${baseId}-xet-thuong`}
                      max={5}
                      value={state.xetThuong}
                      onValueChange={state.setXetThuong}
                      tone="hcmut"
                      maxIntPartLength={1}
                    />
                  </div>
                  <div>
                    <label htmlFor={`${baseId}-khuyen-khich`} className="mb-1.5 block text-xs text-ink-secondary">
                      Khuyến khích (≤ 5)
                    </label>
                    <ScoreInput
                      id={`${baseId}-khuyen-khich`}
                      max={5}
                      value={state.khuyenKhich}
                      onValueChange={state.setKhuyenKhich}
                      tone="hcmut"
                      maxIntPartLength={1}
                    />
                  </div>
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
            theme="hcmut"
            schoolAcronym="HCMUT"
            total={results.total}
            getShareUrl={buildShareUrl}
            formula={`ĐHL = ĐGNL × ${(state.wNL * 100).toFixed(0)}% + THPT × ${(state.wTHPT * 100).toFixed(0)}% + Học bạ × ${(state.wHB * 100).toFixed(0)}%`}
            dhl={results.diemHL}
            dgnlScore={results.diemNangLuc.toFixed(2)}
            thptScore={results.diemThptQuyDoi.toFixed(2)}
            hocBaScore={results.diemHbQuyDoi.toFixed(2)}
            bonusRows={[
              { label: 'Điểm thưởng', value: `+${results.thuongPoint.toFixed(2)}` },
              { label: 'Xét thưởng', value: `+${results.xetThuongPoint.toFixed(2)}` },
              { label: 'Khuyến khích', value: `+${results.khuyenKhichPoint.toFixed(2)}` },
              { label: 'Tổng điểm cộng (Gốc)', value: `+${results.tongCongGoc.toFixed(2)}`, separatorBefore: true },
              { label: 'Cộng thực nhận', value: `+${results.congThucNhan.toFixed(2)}`, variant: 'bonusEffective' },
            ]}
            priorityRows={[
              { label: 'Ưu tiên KV/ĐT (Gốc)', value: `+${results.uuTienQuyDoi.toFixed(2)}` },
              { label: 'Ưu tiên thực nhận', value: `+${results.uuTienThucNhan.toFixed(2)}`, variant: 'priorityEffective' },
            ]}
          />
        </ResponsiveScorePanel>
      </div>

      <MobileScoreButton
        score={results.total}
        tone="hcmut"
        onClick={() => setShowMobileResultModal(true)}
      />

      <ConversionModal
        isOpen={showConversionTable}
        title="Bảng quy đổi Chứng chỉ ngoại ngữ"
        onClose={() => setShowConversionTable(false)}
      >
        <ConversionTableGrid>
          {HCMUT_ENGLISH_TABLES.map((table) => (
            <ConversionTable
              key={table.title}
              title={table.title}
              tone={table.tone}
              columns={[
                { key: 'score', header: table.scoreHeader },
                { key: 'point', header: 'Quy đổi', value: true },
              ]}
              rows={table.rows.map((row) => ({
                ...row,
                highlighted:
                  state.isNgoaiNgu &&
                  table.type === state.ngoaiNguType &&
                  results.diemNgoaiNguQuyDoi > 0 &&
                  parseFloat(row.point) === results.diemNgoaiNguQuyDoi,
              }))}
            />
          ))}
        </ConversionTableGrid>
      </ConversionModal>

      <ConversionModal
        isOpen={showIntlCertTable}
        title="Bảng quy đổi Chứng chỉ quốc tế"
        onClose={() => setShowIntlCertTable(false)}
      >
        <div className="overflow-x-auto">
          <ConversionTable
            columns={INTL_CERT_TABLE_COLUMNS}
            rows={HCMUT_INTL_CERT_CONVERSION_TABLE.map((row) => ({
              ...row,
              highlighted:
                state.doiTuongUT === '2.4' &&
                state.intlCertScore !== '' &&
                results.diemNangLuc > 0 &&
                row.point === results.diemNangLuc,
            }))}
          />
        </div>
      </ConversionModal>
    </div>
  );
};
