import { useId, useMemo, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
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
import { IU_ENGLISH_TABLES, IU_ENGLISH_TYPES, IU_GROUPS } from '../constants/iu';
import { useIuCalculator } from '../hooks/useIuCalculator';
import { useCalculatorPersistence } from '../hooks/useCalculatorPersistence';
import { clampScore, updateScoreArray } from '../utils/input';
import { findById } from '../utils/collection';

const EMPTY_HOC_BA = Array(9).fill('');
const EMPTY_THPT = ['', '', ''];

export const IuCalculator = () => {
  const { state, results } = useIuCalculator();
  const [showMobileResultModal, setShowMobileResultModal] = useState(false);
  const [showEnglishConversionTable, setShowEnglishConversionTable] = useState(false);

  const needsThpt = ['G1_DGNL', 'G1_NO_DGNL', 'G2_BOTH', 'G2_THPT'].includes(state.group);
  const needsDgnl = ['G1_DGNL', 'G2_BOTH', 'G2_DGNL'].includes(state.group);
  const needsHocBa = ['G1_DGNL', 'G1_NO_DGNL'].includes(state.group);
  const hasThptDetail = state.thpt.some((value) => value !== '') || state.useEnglishCertificate;
  const hasThptQuickTotal = state.thptQuickTotal !== '';
  const hasHocBaDetail = state.hocBa.some((value) => value !== '');
  const hasHocBaQuickTotal = state.hocBaQuickTotal !== '';
  const selectedEnglishType = findById(IU_ENGLISH_TYPES, state.englishType);
  const setQuickTotal = (setter, value) => setter(clampScore(value, 30));

  const handleHocBaChange = (index, value) => {
    updateScoreArray(state.hocBa, state.setHocBa, index, value, 10);
  };

  // Sequential step numbers starting after merged section 1
  let nextStep = 2;
  const stepHocBa = needsHocBa ? nextStep++ : null;
  const stepExam = needsThpt || needsDgnl ? nextStep++ : null;
  const stepPriority = nextStep++;

  const hasMeaningfulInput =
    state.group !== 'G1_DGNL' ||
    hasHocBaDetail ||
    hasHocBaQuickTotal ||
    hasThptDetail ||
    hasThptQuickTotal ||
    state.dgnl !== '' ||
    state.achievementBonus !== '' ||
    state.awardBonus !== '' ||
    state.englishBonus !== '' ||
    state.kv !== 'KV3' ||
    state.dt !== 'NONE';

  const persistenceFields = useMemo(
    () => [
      { key: 'group', value: state.group, defaultValue: 'G1_DGNL', apply: state.setGroup },
      { key: 'hocBa', value: state.hocBa, defaultValue: EMPTY_HOC_BA, apply: state.setHocBa },
      { key: 'hocBaQuickTotal', value: state.hocBaQuickTotal, defaultValue: '', apply: state.setHocBaQuickTotal },
      { key: 'thpt', value: state.thpt, defaultValue: EMPTY_THPT, apply: state.setThpt },
      { key: 'thptQuickTotal', value: state.thptQuickTotal, defaultValue: '', apply: state.setThptQuickTotal },
      { key: 'useEnglishCertificate', value: state.useEnglishCertificate, defaultValue: false, apply: state.setUseEnglishCertificate },
      { key: 'englishType', value: state.englishType, defaultValue: 'IELTS', apply: state.setEnglishType },
      { key: 'englishScore', value: state.englishScore, defaultValue: '', apply: state.setEnglishScore },
      { key: 'englishScore2', value: state.englishScore2, defaultValue: '', apply: state.setEnglishScore2 },
      { key: 'dgnl', value: state.dgnl, defaultValue: '', apply: state.setDgnl },
      { key: 'achievementBonus', value: state.achievementBonus, defaultValue: '', apply: state.setAchievementBonus },
      { key: 'awardBonus', value: state.awardBonus, defaultValue: '', apply: state.setAwardBonus },
      { key: 'englishBonus', value: state.englishBonus, defaultValue: '', apply: state.setEnglishBonus },
      { key: 'kv', value: state.kv, defaultValue: 'KV3', apply: state.setKv },
      { key: 'dt', value: state.dt, defaultValue: 'NONE', apply: state.setDt },
    ],
    [
      state.group,
      state.setGroup,
      state.hocBa,
      state.setHocBa,
      state.hocBaQuickTotal,
      state.setHocBaQuickTotal,
      state.thpt,
      state.setThpt,
      state.thptQuickTotal,
      state.setThptQuickTotal,
      state.useEnglishCertificate,
      state.setUseEnglishCertificate,
      state.englishType,
      state.setEnglishType,
      state.englishScore,
      state.setEnglishScore,
      state.englishScore2,
      state.setEnglishScore2,
      state.dgnl,
      state.setDgnl,
      state.achievementBonus,
      state.setAchievementBonus,
      state.awardBonus,
      state.setAwardBonus,
      state.englishBonus,
      state.setEnglishBonus,
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
      schoolId: 'iu',
      schoolAcronym: 'IU',
      fields: persistenceFields,
      hasMeaningfulInput,
      total: results.total,
      shared: sharedConfig,
    });

  const resultCard = (
    <ScoreDetailCard
      theme="red"
      schoolAcronym="IU"
      total={results.total}
      getShareUrl={buildShareUrl}
      formula={`ĐHL = ĐGNL × ${state.k2}% + THPT × ${state.k1}% + Học bạ × ${results.k3}%`}
      formulaDetail={results.interpolation}
      dhl={results.dhl}
      dgnlScore={results.dgnl100.toFixed(2)}
      thptScore={results.thpt100.toFixed(2)}
      hocBaScore={results.hocBa100.toFixed(2)}
      bonusRows={[
        { label: 'Điểm thưởng', value: `+${results.achievement.toFixed(2)}` },
        { label: 'Xét thưởng', value: `+${results.award.toFixed(2)}` },
        { label: 'Khuyến khích NN', value: `+${results.english.toFixed(2)}` },
        { label: 'Tổng điểm cộng (Gốc)', value: `+${results.bonusRaw.toFixed(2)}`, separatorBefore: true },
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
        schoolId="iu"
        acronym="IU"
        title="Trường Đại học Quốc tế"
        subtitle="Xét tuyển tổng hợp 2026 · Thang 100 · Áp dụng trọng số k1, k2, k3 và nội suy cho 5 nhóm đối tượng."
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
          <CardSection title="1. Trọng số & Nhóm đối tượng" tone="red">
            <div className="space-y-5">
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-xs font-medium text-ink-secondary">THPT (k1)</div>
                    <div className="mt-1 font-mono text-2xl font-bold tabular-nums text-red-700 dark:text-red-400">
                      {state.k1}%
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-ink-secondary">ĐGNL (k2)</div>
                    <div className="mt-1 font-mono text-2xl font-bold tabular-nums text-red-700 dark:text-red-400">
                      {state.k2}%
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-ink-secondary">Học bạ (k3)</div>
                    <div className="mt-1 font-mono text-2xl font-bold tabular-nums text-red-700 dark:text-red-400">
                      {results.k3}%
                    </div>
                  </div>
                </div>

                <div className="flex h-2 w-full overflow-hidden rounded-full bg-surface-subtle">
                  <div className="bg-red-600 transition-all" style={{ width: `${state.k1}%` }} title={`THPT ${state.k1}%`} />
                  <div className="bg-rose-400 transition-all" style={{ width: `${state.k2}%` }} title={`ĐGNL ${state.k2}%`} />
                  <div className="bg-amber-400 transition-all" style={{ width: `${results.k3}%` }} title={`Học bạ ${results.k3}%`} />
                </div>
              </div>

              <div className="space-y-2.5 border-t border-hairline pt-4">
                <label htmlFor={`${baseId}-group`} className="block text-sm font-semibold text-ink">
                  Nhóm đối tượng
                </label>
                <select
                  id={`${baseId}-group`}
                  value={state.group}
                  onChange={(event) => state.setGroup(event.target.value)}
                  className="select-control focus-visible:ring-red-600"
                >
                  {IU_GROUPS.map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.name}
                    </option>
                  ))}
                </select>
                {results.interpolation && (
                  <p className="text-xs text-ink-secondary">
                    Nội suy: <strong className="font-mono font-semibold text-ink">{results.interpolation}</strong>
                  </p>
                )}
              </div>
            </div>
          </CardSection>

          {needsHocBa && (
            <CardSection title={`${stepHocBa}. Điểm học bạ`} tone="red">
              <div className="space-y-4">
                <TranscriptScoreTable
                  values={state.hocBa}
                  onChange={handleHocBaChange}
                  onBulkChange={state.setHocBa}
                  disabled={hasHocBaQuickTotal}
                  tone="red"
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
                  tone="red"
                  maxIntPartLength={2}
                />
              </div>
            </CardSection>
          )}

          {(needsThpt || needsDgnl) && (
            <CardSection title={`${stepExam}. Điểm thi`} tone="red">
              <div className="space-y-6">
                {needsThpt && (
                  <div>
                    <h3 className="mb-3 text-sm font-semibold text-ink">THPT</h3>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      {[0, 1].map((index) => (
                        <div key={`thpt-${index}`}>
                          <label
                            htmlFor={`${baseId}-thpt-${index}`}
                            className="mb-1.5 block text-sm font-medium text-ink"
                          >
                            Môn {index + 1}
                          </label>
                          <ScoreInput
                            id={`${baseId}-thpt-${index}`}
                            max={10}
                            value={state.thpt[index]}
                            onValueChange={(value) => updateScoreArray(state.thpt, state.setThpt, index, value, 10)}
                            disabled={hasThptQuickTotal}
                            tone="red"
                            placeholder="0.00"
                          />
                        </div>
                      ))}
                      <div>
                        <label htmlFor={`${baseId}-thpt-2`} className="mb-1.5 block text-sm font-medium text-ink">
                          Môn 3
                        </label>
                        <ScoreInput
                          id={`${baseId}-thpt-2`}
                          max={10}
                          maxIntPartLength={1}
                          value={state.useEnglishCertificate ? results.englishConvertedScore : state.thpt[2]}
                          onValueChange={(value) => updateScoreArray(state.thpt, state.setThpt, 2, value, 10)}
                          disabled={state.useEnglishCertificate || hasThptQuickTotal}
                          tone="red"
                          placeholder="0.00"
                        />
                      </div>
                    </div>

                    <div className="mt-4 rounded-panel border border-hairline bg-surface-subtle p-3.5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <label className="flex cursor-pointer items-center gap-2 text-sm text-ink-secondary">
                          <input
                            type="checkbox"
                            checked={state.useEnglishCertificate}
                            onChange={(event) => state.setUseEnglishCertificate(event.target.checked)}
                            className="h-4 w-4 rounded text-red-600 focus-visible:ring-red-500"
                          />
                          Quy đổi chứng chỉ ngoại ngữ (thay Môn 3)
                        </label>
                        <button
                          type="button"
                          onClick={() => setShowEnglishConversionTable(true)}
                          className="btn-tactile min-h-[36px] px-2 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 sm:min-h-[30px] dark:text-blue-400"
                        >
                          Bảng quy đổi
                        </button>
                      </div>

                      {state.useEnglishCertificate && (
                        <div className="mt-3 grid grid-cols-1 gap-2 border-t border-hairline pt-3 sm:grid-cols-3">
                          <select
                            aria-label="Loại chứng chỉ ngoại ngữ"
                            value={state.englishType}
                            onChange={(event) => {
                              state.setEnglishType(event.target.value);
                              state.setEnglishScore('');
                              state.setEnglishScore2('');
                            }}
                            className="select-control px-2.5 py-2 focus-visible:ring-red-600"
                          >
                            {IU_ENGLISH_TYPES.map((type) => (
                              <option key={type.id} value={type.id}>
                                {type.name}
                              </option>
                            ))}
                          </select>
                          <ScoreInput
                            aria-label={state.englishType === 'TOEIC' ? 'Điểm TOEIC Nghe đọc' : 'Điểm chứng chỉ ngoại ngữ'}
                            max={state.englishType === 'TOEIC' ? selectedEnglishType?.maxLr : selectedEnglishType?.max}
                            value={state.englishScore}
                            onValueChange={state.setEnglishScore}
                            tone="red"
                            inputClassName="px-2.5 text-sm"
                            placeholder={state.englishType === 'TOEIC' ? 'Nghe đọc' : 'Điểm'}
                          />
                          {state.englishType === 'TOEIC' ? (
                            <ScoreInput
                              aria-label="Điểm TOEIC Nói viết"
                              max={selectedEnglishType?.maxSw}
                              value={state.englishScore2}
                              onValueChange={state.setEnglishScore2}
                              tone="red"
                              inputClassName="px-2.5 text-sm"
                              placeholder="Nói viết"
                            />
                          ) : (
                            <div className="flex items-center gap-1 font-mono text-sm font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">
                              <CheckCircle2 className="h-4 w-4" />
                              {results.englishConvertedScore.toFixed(1)} / 10
                            </div>
                          )}
                          {state.englishType === 'TOEIC' && (
                            <div className="flex items-center gap-1 font-mono text-sm font-semibold tabular-nums text-emerald-600 dark:text-emerald-400 sm:col-span-3">
                              <CheckCircle2 className="h-4 w-4" />
                              Quy đổi: {results.englishConvertedScore.toFixed(1)} / 10
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <QuickScoreInput
                      className="mt-4"
                      title="Tổng THPT (thang 30)"
                      value={hasThptDetail ? results.thptTotal.toFixed(2) : state.thptQuickTotal}
                      onChange={(event) => setQuickTotal(state.setThptQuickTotal, event.target.value)}
                      onClear={() => state.setThptQuickTotal('')}
                      disabled={hasThptDetail}
                      placeholder="0.00"
                      tone="red"
                      maxIntPartLength={2}
                    />
                  </div>
                )}

                {needsDgnl && (
                  <div className={needsThpt ? 'border-t border-hairline pt-6' : ''}>
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
                          tone="red"
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
                  </div>
                )}
              </div>
            </CardSection>
          )}

          <CardSection title={`${stepPriority}. Ưu tiên & Điểm cộng`} tone="red">
            <div className="space-y-6">
              <PriorityFields
                kv={state.kv}
                onKvChange={state.setKv}
                dt={state.dt}
                onDtChange={state.setDt}
                tone="red"
              />

              <div className="border-t border-hairline pt-5">
                <h4 className="mb-4 text-sm font-semibold text-ink">Điểm cộng (tối đa 10)</h4>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
                  <div>
                    <label
                      htmlFor={`${baseId}-achievement`}
                      className="mb-2 block text-xs font-medium text-ink-secondary"
                    >
                      Điểm thưởng (≤ 10)
                    </label>
                    <ScoreInput
                      id={`${baseId}-achievement`}
                      max={10}
                      maxIntPartLength={1}
                      value={state.achievementBonus}
                      onValueChange={state.setAchievementBonus}
                      tone="red"
                      placeholder="0.0"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor={`${baseId}-award`}
                      className="mb-2 block text-xs font-medium text-ink-secondary"
                    >
                      Xét thưởng (≤ 5)
                    </label>
                    <ScoreInput
                      id={`${baseId}-award`}
                      max={5}
                      value={state.awardBonus}
                      onValueChange={state.setAwardBonus}
                      tone="red"
                      placeholder="0.0"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor={`${baseId}-eng-bonus`}
                      className="mb-2 block text-xs font-medium text-ink-secondary"
                    >
                      Khuyến khích NN (≤ 5)
                    </label>
                    <ScoreInput
                      id={`${baseId}-eng-bonus`}
                      max={5}
                      maxIntPartLength={1}
                      value={state.englishBonus}
                      onValueChange={state.setEnglishBonus}
                      disabled={state.useEnglishCertificate}
                      tone="red"
                      placeholder="0.0"
                    />
                  </div>
                </div>
              </div>

              {state.useEnglishCertificate && (
                <div className="flex gap-3 rounded-panel border border-amber-500/30 bg-amber-500/10 p-3.5 text-sm text-amber-800 dark:text-amber-200">
                  <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
                  <p>
                    Đã dùng chứng chỉ thay môn tiếng Anh THPT nên không cộng thêm mục này.
                  </p>
                </div>
              )}
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
        tone="red"
        onClick={() => setShowMobileResultModal(true)}
      />

      <ConversionModal
        isOpen={showEnglishConversionTable}
        title="Bảng quy đổi Chứng chỉ ngoại ngữ"
        onClose={() => setShowEnglishConversionTable(false)}
        maxWidthClassName="max-w-5xl"
      >
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1.45fr_1fr]">
          {IU_ENGLISH_TABLES.map((table) => (
            <ConversionTable
              key={table.title}
              title={table.title}
              tone={table.tone}
              columns={[
                { key: 'score', header: table.title === 'TOEIC' ? 'Điểm (L&R + S&W)' : 'Điểm' },
                { key: 'point', header: 'Quy đổi', value: true },
              ]}
              rows={table.rows.map((row) => ({
                ...row,
                highlighted:
                  state.useEnglishCertificate &&
                  table.type === state.englishType &&
                  results.englishConvertedScore > 0 &&
                  parseFloat(row.point) === results.englishConvertedScore,
              }))}
            />
          ))}
        </div>
        <div className="mt-4 rounded-panel border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-800 dark:text-amber-200">
          Đã dùng chứng chỉ thay môn tiếng Anh THPT nên không cộng thêm vào điểm khuyến khích.
        </div>
      </ConversionModal>
    </div>
  );
};
