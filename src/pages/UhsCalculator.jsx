import { useState } from 'react';
import {
  Award,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  HeartPulse,
  Info,
  PenTool,
  Settings,
  SlidersHorizontal,
} from 'lucide-react';
import { CardSection } from '../components/common/CardSection';
import { TranscriptScoreTable } from '../components/common/TranscriptScoreTable';
import { QuickScoreInput } from '../components/score/QuickScoreInput';
import { ScoreInput } from '../components/score/ScoreInput';
import { MobileScoreButton } from '../components/score/MobileScoreButton';
import { ResponsiveScorePanel } from '../components/score/ResponsiveScorePanel';
import { ScoreDetailCard } from '../components/score/ScoreDetailCard';
import { KHU_VUC, DOI_TUONG } from '../constants/common';
import { UHS_LANG_TYPES } from '../constants/uhs';
import { useUhsCalculator } from '../hooks/useUhsCalculator';
import { clampScore, updateScoreArray } from '../utils/input';
import { findById } from '../utils/collection';

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

  const resultCard = (
    <ScoreDetailCard
      theme="teal"
      total={results.total}
      totalPrecision={2}
      formula={`ĐHL = THPT x ${results.w1}% + ĐGNL x ${results.w2}% + Học bạ x 20%`}
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
    <div className="mx-auto max-w-7xl animate-in fade-in pb-28 duration-500">
      <div className="mb-8">
        <h1 className="flex items-center gap-3 text-3xl font-extrabold tracking-tight text-teal-900">
          <HeartPulse className="h-8 w-8 text-teal-700" />
          Máy tính điểm UHS 2026
        </h1>
        <p className="mt-2 text-slate-500">
          Phương thức xét tuyển tổng hợp của Trường Đại học Khoa học Sức khỏe - ĐHQG-HCM.
        </p>
        <a
          href="https://www.uhsvnu.edu.vn/tuyen-sinh-dao-tao/thong-tin-tuyen-sinh/phuong-thuc-tuyen-sinh/thong-tin-tuyen-sinh-nam-2026-dai-hoc-18052026"
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex items-center gap-2 rounded-lg border border-teal-100 bg-teal-50 px-3 py-2 text-sm font-medium text-teal-800 transition-colors hover:border-teal-200 hover:bg-teal-100"
        >
          Xem phương thức tuyển sinh UHS
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="flex-1 space-y-6">
          <CardSection title="1. Trọng số w1, w2, w3" icon={SlidersHorizontal}>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <label className="font-semibold text-slate-700">w1 - THPT</label>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min={30}
                      max={35}
                      step="1"
                      value={state.w1}
                      onChange={(event) => state.setW1(event.target.value)}
                      className="w-14 rounded-md border border-teal-200 px-2 py-1 text-right text-sm font-bold text-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-700"
                    />
                    <span className="font-bold text-teal-700">%</span>
                  </div>
                </div>
                <input
                  type="range"
                  min={30}
                  max={35}
                  step="1"
                  value={state.w1}
                  onChange={(event) => state.setW1(event.target.value)}
                  className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-teal-700"
                />
                <div className="mt-1 text-xs text-slate-500">Quy định: 30% - 35%</div>
              </div>

              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <label className="font-semibold text-slate-700">w2 - ĐGNL</label>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min={45}
                      max={50}
                      step="1"
                      value={state.w2}
                      onChange={(event) => state.setW2(event.target.value)}
                      className="w-14 rounded-md border border-teal-200 px-2 py-1 text-right text-sm font-bold text-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-700"
                    />
                    <span className="font-bold text-teal-700">%</span>
                  </div>
                </div>
                <input
                  type="range"
                  min={45}
                  max={50}
                  step="1"
                  value={state.w2}
                  onChange={(event) => state.setW2(event.target.value)}
                  className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-teal-700"
                />
                <div className="mt-1 text-xs text-slate-500">Quy định: 45% - 50%</div>
              </div>

              <div className="rounded-xl border border-teal-100 bg-teal-50 p-4">
                <div className="text-sm font-semibold text-teal-900">w3 - Học bạ</div>
                <div className="mt-1 text-3xl font-extrabold text-teal-700">20%</div>
                <div className="mt-1 text-xs text-teal-800/70">
                  Cố định theo quy chế UHS
                </div>
              </div>
            </div>
            <div className="mt-5 flex gap-3 rounded-lg border border-teal-100 bg-teal-50 p-4 text-sm text-teal-900">
              <Info className="mt-0.5 h-5 w-5 shrink-0 text-teal-700" />
              <div>
                <p className="font-semibold">Công thức xét tuyển tổng hợp (thang điểm 100):</p>
                <p className="mt-1 font-mono text-xs font-medium text-teal-800">
                  Điểm tổng hợp = w1 × THPT + w2 × ĐGNL + w3 × HB + Điểm cộng + Điểm ưu tiên
                </p>
                <p className="mt-1 text-xs text-teal-700">
                  Quy định trọng số: w1 trong khoảng 30% đến 35%; w2 trong khoảng 45% đến 50%; w3 = 20%.
                </p>
              </div>
            </div>
          </CardSection>

          <CardSection title="2. Điểm học bạ" icon={BookOpen}>
            <div className="space-y-4">
              <TranscriptScoreTable
                values={state.hocBa}
                onChange={handleHocBaChange}
                disabled={hasHocBaQuickTotal}
                tone="teal"
                subjectLabels={subjects}
              />
              <QuickScoreInput
                title="Nhập nhanh tổng học bạ"
                value={hasHocBaDetail ? results.hocBaTotal.toFixed(2) : state.hocBaQuickTotal}
                onChange={(event) => setQuickTotal(state.setHocBaQuickTotal, event.target.value)}
                disabled={hasHocBaDetail}
                step="0.01"
                placeholder="0.00"
                tone="teal"
                maxIntPartLength={2}
              />
            </div>
          </CardSection>

          <CardSection title="3. Điểm thi & Quy đổi thiếu điểm thành phần" icon={PenTool}>
            <div className="mb-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <label className="mb-3 block text-sm font-semibold text-slate-800">
                Trường hợp thiếu điểm thành phần:
              </label>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                {[
                  {
                    id: 'FULL',
                    title: 'Đủ điểm THPT & ĐGNL 2026',
                    desc: 'Dùng điểm thi thực tế',
                  },
                  {
                    id: 'MISSING_DGNL',
                    title: 'Thi THPT 2026 (Thiếu ĐGNL)',
                    desc: 'Quy đổi: ĐGNL = THPT × 0,87',
                  },
                  {
                    id: 'MISSING_THPT',
                    title: 'TN THPT trước 2026 (Thiếu THPT)',
                    desc: 'Quy đổi: THPT = ĐGNL × 1,15',
                  },
                ].map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => state.setMissingMode(option.id)}
                    className={`flex flex-col text-left p-3 rounded-lg border transition-all ${
                      state.missingMode === option.id
                        ? 'border-teal-600 bg-teal-50 ring-2 ring-teal-600/20'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <span className="text-xs font-bold text-teal-900">{option.title}</span>
                    <span className="mt-1 text-[11px] text-slate-500">{option.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div>
                <label className="mb-3 flex items-center gap-2 text-sm font-semibold text-teal-900">
                  <BookOpen className="h-4 w-4 text-teal-700" /> Kỳ thi tốt nghiệp THPT
                  {results.isThptConverted && (
                    <span className="ml-auto rounded bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                      Quy đổi từ ĐGNL × 1,15
                    </span>
                  )}
                </label>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  {subjects.map((subject, index) => (
                    <div key={`thpt-${subject}`}>
                      <label className="mb-1 block text-sm font-medium text-slate-700">{subject}</label>
                      <ScoreInput
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
                  title="Nhập nhanh tổng THPT"
                  value={results.isThptConverted ? results.thptTotal.toFixed(2) : (hasThptDetail ? results.thptTotal.toFixed(2) : state.thptQuickTotal)}
                  onChange={(event) => setQuickTotal(state.setThptQuickTotal, event.target.value)}
                  disabled={hasThptDetail || results.isThptConverted}
                  step="0.01"
                  placeholder="0.00"
                  tone="teal"
                  maxIntPartLength={2}
                />
                {results.isThptConverted && (
                  <p className="mt-2 text-xs font-medium text-amber-700">
                    * Đã tự động quy đổi bổ sung THPT (thang 100) = ĐGNL (thang 100) × 1,15 = {results.thpt100.toFixed(2)} điểm.
                  </p>
                )}
              </div>

              <div>
                <label className="mb-3 flex items-center gap-2 text-sm font-semibold text-teal-900">
                  <Settings className="h-4 w-4 text-teal-700" /> Kỳ thi ĐGNL ĐHQG-HCM
                  {results.isDgnlConverted && (
                    <span className="ml-auto rounded bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                      Quy đổi từ THPT × 0,87
                    </span>
                  )}
                </label>
                <ScoreInput
                  max={1200}
                  maxIntPartLength={1}
                  value={results.isDgnlConverted ? String(results.dgnlTotalDisplay) : state.dgnl}
                  onValueChange={state.setDgnl}
                  disabled={results.isDgnlConverted}
                  integer
                  tone="teal"
                  inputClassName="text-lg font-medium"
                  placeholder="850"
                />
                {results.isDgnlConverted && (
                  <p className="mt-2 text-xs font-medium text-amber-700">
                    * Đã tự động quy đổi bổ sung ĐGNL (thang 100) = THPT (thang 100) × 0,87 = {results.dgnl100.toFixed(2)} điểm.
                  </p>
                )}
              </div>
            </div>
          </CardSection>

          <CardSection title="4. Điểm cộng tích lũy" icon={Award}>
            <div className="space-y-4">
              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
                <input
                  type="checkbox"
                  checked={state.hasLanguage}
                  onChange={(event) => state.setHasLanguage(event.target.checked)}
                  className="h-4 w-4 rounded text-teal-700 focus:ring-teal-700"
                />
                <span className="text-sm font-medium text-slate-700">Có chứng chỉ ngoại ngữ</span>
              </label>
              {state.hasLanguage && (
                <div className="grid grid-cols-1 gap-4 rounded-xl border border-teal-100 bg-teal-50 p-4 md:grid-cols-3">
                  <select
                    value={state.languageType}
                    onChange={(event) => {
                      state.setLanguageType(event.target.value);
                      state.setLanguageScore('');
                      state.setLanguageScore2('');
                    }}
                    className="rounded-md border border-teal-200 bg-white px-3 py-2 focus:ring-2 focus:ring-teal-700"
                  >
                    {UHS_LANG_TYPES.map((type) => (
                      <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                  </select>
                  <ScoreInput
                    max={state.languageType === 'TOEIC' ? selectedLanguageType?.maxLr : selectedLanguageType?.max}
                    value={state.languageScore}
                    onValueChange={state.setLanguageScore}
                    tone="teal"
                    inputClassName="border-teal-200"
                    placeholder={state.languageType === 'TOEIC' ? 'L&R' : 'Điểm chứng chỉ'}
                  />
                  {state.languageType === 'TOEIC' ? (
                    <ScoreInput
                      max={selectedLanguageType?.maxSw}
                      value={state.languageScore2}
                      onValueChange={state.setLanguageScore2}
                      tone="teal"
                      inputClassName="border-teal-200"
                      placeholder="S&W"
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-sm font-medium text-emerald-700">
                      <CheckCircle2 className="h-4 w-4" />
                      +{results.bonusLanguage.toFixed(2)} điểm
                    </div>
                  )}
                  {state.languageType === 'TOEIC' && (
                    <div className="text-sm font-medium text-emerald-700 md:col-span-3">
                      Điểm cộng ngoại ngữ: +{results.bonusLanguage.toFixed(2)}
                    </div>
                  )}
                </div>
              )}

              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
                <input
                  type="checkbox"
                  checked={state.hasSat}
                  onChange={(event) => state.setHasSat(event.target.checked)}
                  className="h-4 w-4 rounded text-teal-700 focus:ring-teal-700"
                />
                <span className="text-sm font-medium text-slate-700">Có SAT từ 1280 trở lên</span>
              </label>
              {state.hasSat && (
                <ScoreInput
                  max={1600}
                  value={state.satScore}
                  onValueChange={state.setSatScore}
                  integer
                  tone="teal"
                  placeholder="Điểm SAT"
                />
              )}

              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={state.hasHsg}
                    onChange={(event) => state.setHasHsg(event.target.checked)}
                    className="h-4 w-4 rounded text-teal-700 focus:ring-teal-700"
                  />
                  <span className="text-sm font-medium text-slate-700">
                    Học sinh giỏi thuộc 149 trường UTXT (Học &ge; 2 năm tại trường Chuyên/PTNK &amp; Học lực 3 năm từ Tốt trở lên)
                  </span>
                </label>
                {state.hasHsg && (
                  <ScoreInput
                    max={10}
                    maxIntPartLength={1}
                    value={state.hsgAverage}
                    onValueChange={state.setHsgAverage}
                    tone="teal"
                    className="mt-3"
                    placeholder="Trung bình cộng 3 năm THPT"
                  />
                )}
              </div>
            </div>
          </CardSection>

          <CardSection title="5. Ưu tiên khu vực & đối tượng" icon={Info}>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Khu vực</label>
                <select
                  value={state.kv}
                  onChange={(event) => state.setKv(event.target.value)}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-700"
                >
                  {KHU_VUC.map((item) => (
                    <option key={item.id} value={item.id}>{item.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Đối tượng</label>
                <select
                  value={state.dt}
                  onChange={(event) => state.setDt(event.target.value)}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-700"
                >
                  {DOI_TUONG.map((item) => (
                    <option key={item.id} value={item.id}>{item.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </CardSection>
        </div>

        <ResponsiveScorePanel
          isOpen={showMobileResultModal}
          onClose={() => setShowMobileResultModal(false)}
          variant="card"
          backdropClassName="bg-slate-900/50"
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
