import { useId, useMemo, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { CalculatorPageHeader } from '../components/common/CalculatorPageHeader';
import { CardSection } from '../components/common/CardSection';
import { PriorityFields } from '../components/common/PriorityFields';
import { TranscriptScoreTable } from '../components/common/TranscriptScoreTable';
import { QuickScoreInput } from '../components/score/QuickScoreInput';
import { ScoreInput } from '../components/score/ScoreInput';
import { MobileScoreButton } from '../components/score/MobileScoreButton';
import { ResponsiveScorePanel } from '../components/score/ResponsiveScorePanel';
import { ScoreDetailCard } from '../components/score/ScoreDetailCard';
import { UHS_LANG_TYPES } from '../constants/uhs';
import { useUhsCalculator } from '../hooks/useUhsCalculator';
import { useCalculatorPersistence } from '../hooks/useCalculatorPersistence';
import { clampScore, updateScoreArray } from '../utils/input';
import { findById } from '../utils/collection';

const EMPTY_HOC_BA = Array(9).fill('');
const EMPTY_THPT = ['', '', ''];

export const UhsCalculator = () => {
  const { state, results } = useUhsCalculator();
  const [showMobileResultModal, setShowMobileResultModal] = useState(false);

  const subjects = ['Môn 1', 'Môn 2', 'Môn 3'];
  const selectedLanguageType = findById(UHS_LANG_TYPES, state.languageType);

  const handleHocBaChange = (index, value) => {
    updateScoreArray(state.hocBa, state.setHocBa, index, value, 10);
  };

  const hasThptDetail = state.thpt.some((value) => value !== '');
  const hasThptQuickTotal = state.thptQuickTotal !== '';
  const hasHocBaDetail = state.hocBa.some((value) => value !== '');
  const hasHocBaQuickTotal = state.hocBaQuickTotal !== '';
  const setQuickTotal = (setter, value) => setter(clampScore(value, 30));

  const hasMeaningfulInput =
    state.w1 !== 35 ||
    state.missingMode !== 'FULL' ||
    hasHocBaDetail ||
    hasHocBaQuickTotal ||
    hasThptDetail ||
    hasThptQuickTotal ||
    state.dgnl !== '' ||
    state.hasLanguage ||
    state.hasSat ||
    state.hasHsg ||
    state.kv !== 'KV3' ||
    state.dt !== 'NONE';

  const persistenceFields = useMemo(
    () => [
      { key: 'w1', value: state.w1, defaultValue: 35, apply: state.setW1 },
      { key: 'missingMode', value: state.missingMode, defaultValue: 'FULL', apply: state.setMissingMode },
      { key: 'hocBa', value: state.hocBa, defaultValue: EMPTY_HOC_BA, apply: state.setHocBa },
      { key: 'hocBaQuickTotal', value: state.hocBaQuickTotal, defaultValue: '', apply: state.setHocBaQuickTotal },
      { key: 'thpt', value: state.thpt, defaultValue: EMPTY_THPT, apply: state.setThpt },
      { key: 'thptQuickTotal', value: state.thptQuickTotal, defaultValue: '', apply: state.setThptQuickTotal },
      { key: 'dgnl', value: state.dgnl, defaultValue: '', apply: state.setDgnl },
      { key: 'hasLanguage', value: state.hasLanguage, defaultValue: false, apply: state.setHasLanguage },
      { key: 'languageType', value: state.languageType, defaultValue: 'IELTS', apply: state.setLanguageType },
      { key: 'languageScore', value: state.languageScore, defaultValue: '', apply: state.setLanguageScore },
      { key: 'languageScore2', value: state.languageScore2, defaultValue: '', apply: state.setLanguageScore2 },
      { key: 'hasSat', value: state.hasSat, defaultValue: false, apply: state.setHasSat },
      { key: 'satScore', value: state.satScore, defaultValue: '', apply: state.setSatScore },
      { key: 'hasHsg', value: state.hasHsg, defaultValue: false, apply: state.setHasHsg },
      { key: 'hsgAverage', value: state.hsgAverage, defaultValue: '', apply: state.setHsgAverage },
      { key: 'kv', value: state.kv, defaultValue: 'KV3', apply: state.setKv },
      { key: 'dt', value: state.dt, defaultValue: 'NONE', apply: state.setDt },
    ],
    [
      state.w1,
      state.setW1,
      state.missingMode,
      state.setMissingMode,
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
      state.hasLanguage,
      state.setHasLanguage,
      state.languageType,
      state.setLanguageType,
      state.languageScore,
      state.setLanguageScore,
      state.languageScore2,
      state.setLanguageScore2,
      state.hasSat,
      state.setHasSat,
      state.satScore,
      state.setSatScore,
      state.hasHsg,
      state.setHasHsg,
      state.hsgAverage,
      state.setHsgAverage,
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
      schoolId: 'uhs',
      schoolAcronym: 'UHS',
      fields: persistenceFields,
      hasMeaningfulInput,
      total: results.total,
      shared: sharedConfig,
    });

  const isLangBelowThreshold =
    state.hasLanguage &&
    ((state.languageType !== 'TOEIC' && state.languageScore !== '' && results.bonusLanguage === 0) ||
      (state.languageType === 'TOEIC' &&
        state.languageScore !== '' &&
        state.languageScore2 !== '' &&
        results.bonusLanguage === 0));

  const parsedSat = parseFloat(state.satScore);
  const isSatBelowThreshold =
    state.hasSat && state.satScore !== '' && !Number.isNaN(parsedSat) && parsedSat < 1280;

  const resultCard = (
    <ScoreDetailCard
      theme="teal"
      schoolAcronym="UHS"
      total={results.total}
      getShareUrl={buildShareUrl}
      totalPrecision={2}
      formula={`ĐHL = THPT × ${results.w1}% + ĐGNL × ${results.w2}% + Học bạ × 20%`}
      dhl={results.dhl}
      dhlPrecision={2}
      dgnlScore={`${results.dgnl100.toFixed(2)}${results.isDgnlConverted ? ' (Quy đổi)' : ''}`}
      thptScore={`${results.thpt100.toFixed(2)}${results.isThptConverted ? ' (Quy đổi)' : ''}`}
      hocBaScore={results.hocBa100.toFixed(2)}
      bonusRows={[
        { label: 'Cộng ngoại ngữ', value: `+${results.bonusLanguage.toFixed(2)}` },
        { label: 'Cộng SAT', value: `+${results.bonusSat.toFixed(2)}` },
        { label: 'Cộng HSG', value: `+${results.bonusHsg.toFixed(2)}` },
        {
          label: 'Tổng điểm cộng (Gốc)',
          value: `+${results.bonusTotal.toFixed(2)}`,
          separatorBefore: true,
        },
        { label: 'Cộng thực nhận', value: `+${results.bonusEffective.toFixed(2)}`, variant: 'bonusEffective' },
      ]}
      priorityRows={[
        { label: 'Ưu tiên KV/ĐT (Gốc)', value: `+${results.priority100.toFixed(2)}` },
        { label: 'Ưu tiên thực nhận', value: `+${results.priorityAccepted.toFixed(2)}`, variant: 'priorityEffective' },
      ]}
    />
  );

  return (
    <div className="mx-auto max-w-7xl pb-28 animate-in fade-in">
      <CalculatorPageHeader
        schoolId="uhs"
        acronym="UHS"
        title="Trường Đại học Khoa học Sức khỏe"
        subtitle="Xét tuyển tổng hợp 2026 · Thang 100 · Trọng số linh hoạt w1 (30–35%), w2 (45–50%), Học bạ 20% & quy đổi thiếu điểm."
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
        <div className="flex-1 space-y-6">
          <CardSection title="1. Trọng số" tone="teal">
            <div className="mb-5 flex h-2 w-full overflow-hidden rounded-full bg-surface-subtle">
              <div
                className="bg-teal-600 transition-all dark:bg-teal-500"
                style={{ width: `${state.w1}%` }}
                title={`THPT ${state.w1}%`}
              />
              <div
                className="bg-cyan-500 transition-all"
                style={{ width: `${state.w2}%` }}
                title={`ĐGNL ${state.w2}%`}
              />
              <div
                className="bg-emerald-400 transition-all"
                style={{ width: '20%' }}
                title="Học bạ 20%"
              />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <label htmlFor={`${baseId}-w1`} className="font-semibold text-ink">
                    w1 - THPT
                  </label>
                  <div className="flex items-center gap-1 font-mono">
                    <input
                      id={`${baseId}-w1`}
                      type="number"
                      min={30}
                      max={35}
                      step="1"
                      value={state.w1}
                      onChange={(event) => state.setW1(event.target.value)}
                      className="w-14 rounded-control border border-hairline bg-surface px-2 py-1 text-right text-sm font-bold tabular-nums text-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 dark:text-teal-400"
                    />
                    <span className="font-bold text-teal-700 dark:text-teal-400">%</span>
                  </div>
                </div>
                <input
                  type="range"
                  aria-label="Thanh trượt trọng số THPT w1"
                  min={30}
                  max={35}
                  step="1"
                  value={state.w1}
                  onChange={(event) => state.setW1(event.target.value)}
                  className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-surface-subtle accent-teal-600 dark:accent-teal-400"
                />
                <div className="mt-1 font-mono text-xs text-ink-muted">30–35%</div>
              </div>

              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <label htmlFor={`${baseId}-w2`} className="font-semibold text-ink">
                    w2 - ĐGNL
                  </label>
                  <div className="flex items-center gap-1 font-mono">
                    <input
                      id={`${baseId}-w2`}
                      type="number"
                      min={45}
                      max={50}
                      step="1"
                      value={state.w2}
                      onChange={(event) => state.setW2(event.target.value)}
                      className="w-14 rounded-control border border-hairline bg-surface px-2 py-1 text-right text-sm font-bold tabular-nums text-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 dark:text-teal-400"
                    />
                    <span className="font-bold text-teal-700 dark:text-teal-400">%</span>
                  </div>
                </div>
                <input
                  type="range"
                  aria-label="Thanh trượt trọng số ĐGNL w2"
                  min={45}
                  max={50}
                  step="1"
                  value={state.w2}
                  onChange={(event) => state.setW2(event.target.value)}
                  className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-surface-subtle accent-teal-600 dark:accent-teal-400"
                />
                <div className="mt-1 font-mono text-xs text-ink-muted">45–50%</div>
              </div>

              <div>
                <div className="text-sm font-semibold text-ink">w3 - Học bạ</div>
                <div className="mt-1.5 font-mono text-2xl font-bold tabular-nums text-teal-700 dark:text-teal-400">
                  20%
                </div>
                <div className="mt-0.5 text-xs text-ink-muted">Cố định</div>
              </div>
            </div>
          </CardSection>

          <CardSection title="2. Điểm học bạ" tone="teal">
            <div className="space-y-4">
              <TranscriptScoreTable
                values={state.hocBa}
                onChange={handleHocBaChange}
                onBulkChange={state.setHocBa}
                disabled={hasHocBaQuickTotal}
                tone="teal"
                subjectLabels={subjects}
                onClear={() => state.setHocBa(EMPTY_HOC_BA)}
                onUnlockQuick={() => state.setHocBaQuickTotal('')}
              />
              <QuickScoreInput
                title="Tổng học bạ (thang 30)"
                value={hasHocBaDetail ? results.hocBaTotal.toFixed(2) : state.hocBaQuickTotal}
                onChange={(event) => setQuickTotal(state.setHocBaQuickTotal, event.target.value)}
                onClear={() => state.setHocBaQuickTotal('')}
                disabled={hasHocBaDetail}
                placeholder="0.00"
                tone="teal"
                maxIntPartLength={2}
              />
            </div>
          </CardSection>

          <CardSection title="3. Điểm thi" tone="teal">
            <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-3">
              {[
                {
                  id: 'FULL',
                  title: 'Đủ THPT & ĐGNL',
                  desc: 'Dùng điểm thi thực',
                },
                {
                  id: 'MISSING_DGNL',
                  title: 'Thiếu ĐGNL',
                  desc: 'ĐGNL = THPT × 0,87',
                },
                {
                  id: 'MISSING_THPT',
                  title: 'Thiếu THPT',
                  desc: 'THPT = ĐGNL × 1,15',
                },
              ].map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => state.setMissingMode(option.id)}
                  className={`btn-tactile flex flex-col rounded-panel border p-3.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 ${
                    state.missingMode === option.id
                      ? 'border-teal-600/60 bg-teal-500/10 ring-1 ring-teal-600/30 dark:border-teal-400/60'
                      : 'border-hairline bg-surface hover:border-hairline-hover'
                  }`}
                >
                  <span className="text-xs font-bold text-ink">{option.title}</span>
                  <span className="mt-1 font-mono text-[11px] text-ink-muted">{option.desc}</span>
                </button>
              ))}
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="mb-3 text-sm font-semibold text-ink">THPT</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {subjects.map((subject, index) => (
                    <div key={`thpt-${subject}`}>
                      <label
                        htmlFor={`${baseId}-thpt-${index}`}
                        className="mb-1.5 block text-sm font-medium text-ink"
                      >
                        {subject}
                      </label>
                      <ScoreInput
                        id={`${baseId}-thpt-${index}`}
                        max={10}
                        maxIntPartLength={1}
                        value={state.thpt[index]}
                        onValueChange={(value) => updateScoreArray(state.thpt, state.setThpt, index, value, 10)}
                        disabled={hasThptQuickTotal || results.isThptConverted}
                        tone="teal"
                        placeholder="0.00"
                      />
                    </div>
                  ))}
                </div>
                <QuickScoreInput
                  className="mt-4"
                  title="Tổng THPT (thang 30)"
                  value={
                    results.isThptConverted
                      ? results.thptTotal.toFixed(2)
                      : hasThptDetail
                      ? results.thptTotal.toFixed(2)
                      : state.thptQuickTotal
                  }
                  onChange={(event) => setQuickTotal(state.setThptQuickTotal, event.target.value)}
                  onClear={results.isThptConverted ? undefined : () => state.setThptQuickTotal('')}
                  disabled={hasThptDetail || results.isThptConverted}
                  placeholder="0.00"
                  tone="teal"
                  maxIntPartLength={2}
                />
                {results.isThptConverted && (
                  <p className="mt-2 font-mono text-xs font-medium text-amber-700 dark:text-amber-300">
                    Quy đổi từ ĐGNL × 1,15: {results.thpt100.toFixed(2)} / 100
                  </p>
                )}
              </div>

              <div className="border-t border-hairline pt-6">
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
                      maxIntPartLength={1}
                      value={results.isDgnlConverted ? String(results.dgnlTotalDisplay) : state.dgnl}
                      onValueChange={state.setDgnl}
                      disabled={results.isDgnlConverted}
                      integer
                      tone="teal"
                      inputClassName="text-base font-semibold"
                      placeholder="850"
                    />
                  </div>
                  <div className="flex items-center justify-between rounded-control border border-hairline bg-surface-subtle px-3.5 py-2 text-sm">
                    <span className="text-ink-secondary">Chuẩn hóa thang 100</span>
                    <span className="font-mono font-bold tabular-nums text-ink">
                      {results.dgnl100.toFixed(2)} / 100
                    </span>
                  </div>
                </div>
                {results.isDgnlConverted && (
                  <p className="mt-2 font-mono text-xs font-medium text-amber-700 dark:text-amber-300">
                    Quy đổi từ THPT × 0,87: {results.dgnl100.toFixed(2)} / 100
                  </p>
                )}
              </div>
            </div>
          </CardSection>

          <CardSection title="4. Ưu tiên & Điểm cộng" tone="teal">
            <div className="space-y-6">
              <PriorityFields
                kv={state.kv}
                onKvChange={state.setKv}
                dt={state.dt}
                onDtChange={state.setDt}
                tone="teal"
              />

              <div className="space-y-3 border-t border-hairline pt-5">
                <h4 className="text-sm font-semibold text-ink">Điểm cộng tích lũy</h4>

                <div className="rounded-panel border border-hairline bg-surface-subtle p-3.5">
                  <label className="flex cursor-pointer items-center gap-3">
                    <input
                      type="checkbox"
                      checked={state.hasLanguage}
                      onChange={(event) => state.setHasLanguage(event.target.checked)}
                      className="h-4 w-4 rounded text-teal-600 focus-visible:ring-teal-600"
                    />
                    <span className="text-sm font-medium text-ink">Chứng chỉ ngoại ngữ</span>
                  </label>

                  {state.hasLanguage && (
                    <div className="mt-3 space-y-3 border-t border-hairline pt-3">
                      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                        <select
                          aria-label="Loại chứng chỉ ngoại ngữ"
                          value={state.languageType}
                          onChange={(event) => {
                            state.setLanguageType(event.target.value);
                            state.setLanguageScore('');
                            state.setLanguageScore2('');
                          }}
                          className="select-control focus-visible:ring-teal-600"
                        >
                          {UHS_LANG_TYPES.map((type) => (
                            <option key={type.id} value={type.id}>
                              {type.name}
                            </option>
                          ))}
                        </select>
                        <ScoreInput
                          aria-label={state.languageType === 'TOEIC' ? 'Điểm TOEIC Nghe và Đọc' : 'Điểm chứng chỉ ngoại ngữ'}
                          max={state.languageType === 'TOEIC' ? selectedLanguageType?.maxLr : selectedLanguageType?.max}
                          value={state.languageScore}
                          onValueChange={state.setLanguageScore}
                          tone="teal"
                          placeholder={state.languageType === 'TOEIC' ? 'L&R' : 'Điểm'}
                        />
                        {state.languageType === 'TOEIC' ? (
                          <ScoreInput
                            aria-label="Điểm TOEIC Nói và Viết"
                            max={selectedLanguageType?.maxSw}
                            value={state.languageScore2}
                            onValueChange={state.setLanguageScore2}
                            tone="teal"
                            placeholder="S&W"
                          />
                        ) : (
                          <div className="flex items-center gap-2 font-mono text-sm font-semibold tabular-nums text-emerald-700 dark:text-emerald-400">
                            <CheckCircle2 className="h-4 w-4" />+{results.bonusLanguage.toFixed(2)} điểm
                          </div>
                        )}
                        {state.languageType === 'TOEIC' && (
                          <div className="font-mono text-sm font-semibold tabular-nums text-emerald-700 dark:text-emerald-400 md:col-span-3">
                            +{results.bonusLanguage.toFixed(2)} điểm
                          </div>
                        )}
                      </div>

                      <p className="text-xs text-ink-muted">
                        Tối thiểu:{' '}
                        <strong className="font-mono font-semibold text-ink-secondary">
                          {state.languageType === 'TOEIC'
                            ? `L&R ≥ ${selectedLanguageType?.minLr}, S&W ≥ ${selectedLanguageType?.minSw}`
                            : `${selectedLanguageType?.name} ≥ ${selectedLanguageType?.min}`}
                        </strong>
                      </p>

                      {isLangBelowThreshold && (
                        <div className="flex items-center gap-2 text-xs font-medium text-amber-700 dark:text-amber-300">
                          <AlertTriangle className="h-4 w-4 shrink-0" />
                          Chưa đạt mức tối thiểu.
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-3 rounded-panel border border-hairline bg-surface-subtle p-3.5">
                  <label className="flex cursor-pointer items-center gap-3">
                    <input
                      type="checkbox"
                      checked={state.hasSat}
                      onChange={(event) => state.setHasSat(event.target.checked)}
                      className="h-4 w-4 rounded text-teal-600 focus-visible:ring-teal-600"
                    />
                    <span className="text-sm font-medium text-ink">
                      Chứng chỉ SAT (≥ 1280)
                    </span>
                  </label>
                  {state.hasSat && (
                    <div className="space-y-2 border-t border-hairline pt-3">
                      <ScoreInput
                        aria-label="Điểm SAT"
                        max={1600}
                        value={state.satScore}
                        onValueChange={state.setSatScore}
                        integer
                        tone="teal"
                        placeholder="1280–1600"
                      />
                      {isSatBelowThreshold && (
                        <div className="flex items-center gap-2 text-xs font-medium text-amber-700 dark:text-amber-300">
                          <AlertTriangle className="h-4 w-4 shrink-0" />
                          Cần từ 1280 trở lên.
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="rounded-panel border border-hairline bg-surface-subtle p-3.5">
                  <label className="flex cursor-pointer items-center gap-3">
                    <input
                      type="checkbox"
                      checked={state.hasHsg}
                      onChange={(event) => state.setHasHsg(event.target.checked)}
                      className="h-4 w-4 rounded text-teal-600 focus-visible:ring-teal-600"
                    />
                    <span className="text-sm font-medium text-ink">
                      HSG thuộc 149 trường ưu tiên (≥ 2 năm Chuyên/PTNK, 3 năm Tốt)
                    </span>
                  </label>
                  {state.hasHsg && (
                    <ScoreInput
                      aria-label="Điểm trung bình 3 năm HSG"
                      max={10}
                      maxIntPartLength={1}
                      value={state.hsgAverage}
                      onValueChange={state.setHsgAverage}
                      tone="teal"
                      className="mt-3"
                      placeholder="Điểm TB 3 năm"
                    />
                  )}
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
          {resultCard}
        </ResponsiveScorePanel>
      </div>

      <MobileScoreButton
        score={results.total}
        precision={2}
        tone="teal"
        onClick={() => setShowMobileResultModal(true)}
      />
    </div>
  );
};
