import { useId, useMemo, useState } from 'react';
import { useUsshCalculator } from '../hooks/useUsshCalculator';
import { useCalculatorPersistence } from '../hooks/useCalculatorPersistence';
import { CalculatorPageHeader } from '../components/common/CalculatorPageHeader';
import { CardSection } from '../components/common/CardSection';
import { PriorityFields } from '../components/common/PriorityFields';
import { TranscriptScoreTable } from '../components/common/TranscriptScoreTable';
import { QuickScoreInput } from '../components/score/QuickScoreInput';
import { ScoreInput } from '../components/score/ScoreInput';
import { MobileScoreButton } from '../components/score/MobileScoreButton';
import { ResponsiveScorePanel } from '../components/score/ResponsiveScorePanel';
import { ScoreDetailCard } from '../components/score/ScoreDetailCard';
import { clampScore, updateScoreArray } from '../utils/input';

const EMPTY_HOC_BA = Array(9).fill('');
const EMPTY_THPT = ['', '', ''];

export const UsshCalculator = () => {
  const { state, results } = useUsshCalculator();
  const [showMobileResultModal, setShowMobileResultModal] = useState(false);

  const hasThptDetail = state.thpt.some((value) => value !== '');
  const hasThptQuickTotal = state.thptQuickTotal !== '';
  const hasHocBaDetail = state.hocBa.some((value) => value !== '');
  const hasHocBaQuickTotal = state.hocBaQuickTotal !== '';

  const setQuickTotal = (setter, value) => {
    setter(clampScore(value, 30));
  };

  const handleHocBaChange = (index, val) => {
    updateScoreArray(state.hocBa, state.setHocBa, index, val, 10);
  };

  const handleThptChange = (index, val) => {
    updateScoreArray(state.thpt, state.setThpt, index, val, 10);
  };

  const hasMeaningfulInput =
    hasHocBaDetail ||
    hasHocBaQuickTotal ||
    hasThptDetail ||
    hasThptQuickTotal ||
    state.dgnl !== '' ||
    state.thanhTich !== '' ||
    state.kv !== 'KV3' ||
    state.dt !== 'NONE';

  const persistenceFields = useMemo(
    () => [
      { key: 'hocBa', value: state.hocBa, defaultValue: EMPTY_HOC_BA, apply: state.setHocBa },
      { key: 'hocBaQuickTotal', value: state.hocBaQuickTotal, defaultValue: '', apply: state.setHocBaQuickTotal },
      { key: 'thpt', value: state.thpt, defaultValue: EMPTY_THPT, apply: state.setThpt },
      { key: 'thptQuickTotal', value: state.thptQuickTotal, defaultValue: '', apply: state.setThptQuickTotal },
      { key: 'dgnl', value: state.dgnl, defaultValue: '', apply: state.setDgnl },
      { key: 'kv', value: state.kv, defaultValue: 'KV3', apply: state.setKv },
      { key: 'dt', value: state.dt, defaultValue: 'NONE', apply: state.setDt },
      { key: 'thanhTich', value: state.thanhTich, defaultValue: '', apply: state.setThanhTich },
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
      state.dgnl,
      state.setDgnl,
      state.kv,
      state.setKv,
      state.dt,
      state.setDt,
      state.thanhTich,
      state.setThanhTich,
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
      schoolId: 'hcmussh',
      schoolAcronym: 'HCMUSSH',
      fields: persistenceFields,
      hasMeaningfulInput,
      total: results.total,
      shared: sharedConfig,
    });

  return (
    <div className="mx-auto max-w-7xl pb-28 animate-in fade-in">
      <CalculatorPageHeader
        schoolId="hcmussh"
        acronym="HCMUSSH"
        title="Trường Đại học Khoa học Xã hội & Nhân văn"
        subtitle="Xét tuyển tổng hợp 2026 · Thang 100 · Tự động chọn phương án cao nhất trong 3 tổ hợp THPT, ĐGNL và Học bạ."
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
          {/* Học bạ */}
          <CardSection title="1. Điểm học bạ" tone="emerald">
            <div className="space-y-4">
              <TranscriptScoreTable
                values={state.hocBa}
                onChange={handleHocBaChange}
                onBulkChange={state.setHocBa}
                disabled={hasHocBaQuickTotal}
                tone="emerald"
                onClear={() => state.setHocBa(EMPTY_HOC_BA)}
                onUnlockQuick={() => state.setHocBaQuickTotal('')}
              />
              <QuickScoreInput
                title="Tổng học bạ (thang 30)"
                value={hasHocBaDetail ? ((results.hb100 / 100) * 30).toFixed(2) : state.hocBaQuickTotal}
                onChange={(event) => setQuickTotal(state.setHocBaQuickTotal, event.target.value)}
                onClear={() => state.setHocBaQuickTotal('')}
                disabled={hasHocBaDetail}
                placeholder="0.00"
                tone="emerald"
                maxIntPartLength={2}
              />
            </div>
          </CardSection>

          {/* Điểm Thi */}
          <CardSection title="2. Điểm thi" tone="emerald">
            <div className="space-y-6">
              {/* Điểm Thi THPT */}
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
                        maxIntPartLength={1}
                        value={state.thpt[idx]}
                        onValueChange={(value) => handleThptChange(idx, value)}
                        disabled={hasThptQuickTotal}
                        tone="emerald"
                        placeholder="0.00"
                      />
                    </div>
                  ))}
                </div>
                <QuickScoreInput
                  title="Tổng THPT (thang 30)"
                  value={hasThptDetail ? ((results.thpt100 / 100) * 30).toFixed(2) : state.thptQuickTotal}
                  onChange={(event) => setQuickTotal(state.setThptQuickTotal, event.target.value)}
                  onClear={() => state.setThptQuickTotal('')}
                  disabled={hasThptDetail}
                  placeholder="0.00"
                  tone="emerald"
                  className="mt-4"
                  maxIntPartLength={2}
                />
              </div>

              {/* Điểm thi ĐGNL */}
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
                      value={state.dgnl}
                      onValueChange={state.setDgnl}
                      integer
                      tone="emerald"
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
            </div>
          </CardSection>

          {/* Thành tích & Ưu tiên */}
          <CardSection title="3. Ưu tiên & Điểm cộng" tone="emerald">
            <div className="space-y-6">
              <PriorityFields
                kv={state.kv}
                onKvChange={state.setKv}
                dt={state.dt}
                onDtChange={state.setDt}
                tone="emerald"
              />

              <div className="border-t border-hairline pt-5">
                <div className="sm:max-w-xs">
                  <label
                    htmlFor={`${baseId}-bonus`}
                    className="mb-2 block text-sm font-medium text-ink"
                  >
                    Điểm cộng thành tích (tối đa 10)
                  </label>
                  <ScoreInput
                    id={`${baseId}-bonus`}
                    max={10}
                    maxIntPartLength={1}
                    value={state.thanhTich}
                    onValueChange={state.setThanhTich}
                    tone="emerald"
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
            theme="emerald"
            schoolAcronym="HCMUSSH"
            total={results.total}
            getShareUrl={buildShareUrl}
            emptyHint={
              hasMeaningfulInput && !hasHocBaDetail && !hasHocBaQuickTotal
                ? 'Nhập thêm điểm Học bạ để tính kết quả 3 kịch bản.'
                : undefined
            }
            beforeLearning={
              <div className="space-y-2.5">
                {[
                  {
                    id: 'all',
                    label: 'THPT 45% + ĐGNL 45% + HB 10%',
                    value: results.dhlAll,
                  },
                  {
                    id: '1',
                    label: 'THPT 90% + HB 10%',
                    value: results.dhl1,
                  },
                  {
                    id: '2',
                    label: 'ĐGNL 90% + HB 10%',
                    value: results.dhl2,
                  },
                ].map((scenario) => {
                  const isActive = results.selectedScenario === scenario.id;
                  return (
                    <div
                      key={scenario.id}
                      className={`rounded-panel border p-3 transition-colors ${
                        isActive
                          ? 'border-emerald-500/40 bg-emerald-500/10'
                          : 'border-hairline bg-surface-subtle opacity-70'
                      }`}
                    >
                      <div className="mb-1 flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-ink-secondary">
                          {scenario.label}
                        </span>
                        {isActive && (
                          <span className="shrink-0 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                            Đang chọn
                          </span>
                        )}
                      </div>
                      <div
                        className={`font-mono text-xl font-bold tabular-nums ${
                          isActive ? 'text-emerald-700 dark:text-emerald-400' : 'text-ink-muted'
                        }`}
                      >
                        {scenario.value !== null ? scenario.value.toFixed(2) : '-'}
                      </div>
                    </div>
                  );
                })}
              </div>
            }
            dgnlScore={results.dgnl100.toFixed(2)}
            thptScore={results.thpt100.toFixed(2)}
            hocBaScore={results.hb100.toFixed(2)}
            bonusRows={[
              { label: 'Điểm cộng (Gốc)', value: `+${results.dcGoc.toFixed(2)}` },
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
        tone="emerald"
        onClick={() => setShowMobileResultModal(true)}
      />
    </div>
  );
};
