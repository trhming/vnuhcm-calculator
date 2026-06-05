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
import { clampNumber, clampScore, updateScoreArray } from '../utils/input';
import { findById } from '../utils/collection';

export const UhsCalculator = () => {
  const { state, results } = useUhsCalculator();
  const [showMobileResultModal, setShowMobileResultModal] = useState(false);

  const subjects = ['Môn 1', 'Môn 2', 'Môn 3'];
  const computedC = 100 - state.a - state.b;
  const isWeightValid = computedC >= 0 && computedC <= 25 && state.a >= 40 && state.b <= 35;
  const selectedLanguageType = findById(UHS_LANG_TYPES, state.languageType);

  const handleHocBaChange = (index, value) => {
    updateScoreArray(state.hocBa, state.setHocBa, index, value, 10);
  };

  const hasThptDetail = state.thpt.some((value) => value !== '');
  const hasThptQuickTotal = state.thptQuickTotal !== '';
  const hasHocBaDetail = state.hocBa.some((value) => value !== '');
  const hasHocBaQuickTotal = state.hocBaQuickTotal !== '';
  const setQuickTotal = (setter, value) => setter(clampScore(value, 30));

  const updateWeight = (key, value) => {
    if (key === 'a') state.setA(clampNumber(value, 40, 100));
    if (key === 'b') state.setB(clampNumber(value, 0, 35));
  };

  const resultCard = (
    <ScoreDetailCard
      theme="teal"
      total={results.total}
      totalPrecision={1}
      headerNote="Các điểm thành phần làm tròn 0.1"
      formula={`ĐHL = ĐGNL x ${state.a}% + THPT x ${state.b}% + Học bạ x ${results.cWeight}%`}
      dhl={results.dhl}
      dhlPrecision={1}
      dgnlScore={results.dgnl100.toFixed(1)}
      thptScore={results.thpt100.toFixed(1)}
      hocBaScore={results.hocBa100.toFixed(1)}
      bonusRows={[
        { label: 'Cộng ngoại ngữ', value: `+${results.bonusLanguage.toFixed(1)}` },
        { label: 'Cộng SAT', value: `+${results.bonusSat.toFixed(1)}` },
        { label: 'Cộng HSG', value: `+${results.bonusHsg.toFixed(1)}` },
        {
          label: 'Tổng điểm cộng (Gốc)',
          value: `+${results.bonusTotal.toFixed(1)}`,
          separatorBefore: true,
        },
        { label: 'Cộng thực nhận', value: `+${results.bonusEffective.toFixed(1)}`, variant: 'bonusEffective' },
      ]}
      priorityRows={[
        { label: 'Ưu tiên KV/ĐT (Gốc)', value: `+${results.priority100.toFixed(1)}` },
        { label: 'Ưu tiên thực nhận', value: `+${results.priorityAccepted.toFixed(1)}`, variant: 'priorityEffective' },
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
          Phương thức tổng hợp của Trường Đại học Khoa học Sức khỏe - ĐHQG-HCM.
        </p>
        <a
          href="https://tuyensinh.uhsvnu.edu.vn/news.php?slug=phuonghuong"
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
          <CardSection title="1. Trọng số a, b, c" icon={SlidersHorizontal}>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {[
                ['a', 'ĐGNL', state.a, '>= 40%'],
                ['b', 'THPT', state.b, '<= 35%'],
              ].map(([key, label, value, note]) => (
                <div key={key}>
                  <div className="mb-2 flex justify-between text-sm">
                    <label className="font-semibold text-slate-700">{key} - {label}</label>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min={key === 'a' ? 40 : 0}
                        max={key === 'a' ? 100 : 35}
                        step="1"
                        value={value}
                        onChange={(event) => updateWeight(key, event.target.value)}
                        className="w-14 rounded-md border border-teal-200 px-2 py-1 text-right text-sm font-bold text-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-700"
                      />
                      <span className="font-bold text-teal-700">%</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min={key === 'a' ? 40 : 0}
                    max={key === 'a' ? 100 : 35}
                    step="1"
                    value={value}
                    onChange={(event) => updateWeight(key, event.target.value)}
                    className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-teal-700"
                  />
                  <div className="mt-1 text-xs text-slate-500">{note}</div>
                </div>
              ))}
              <div className={`rounded-xl border p-4 ${isWeightValid ? 'border-teal-100 bg-teal-50' : 'border-amber-200 bg-amber-50'}`}>
                <div className={`text-sm font-semibold ${isWeightValid ? 'text-teal-900' : 'text-amber-900'}`}>c - Học bạ</div>
                <div className={`mt-1 text-3xl font-extrabold ${isWeightValid ? 'text-teal-700' : 'text-amber-700'}`}>{computedC}%</div>
                <div className={`mt-1 text-xs ${isWeightValid ? 'text-teal-800/70' : 'text-amber-800'}`}>
                  Tự tính = 100 - a - b
                </div>
                {!isWeightValid && (
                  <div className="mt-2 text-xs font-medium text-amber-800">
                    c nên nằm trong khoảng 0% - 25%.
                  </div>
                )}
              </div>
            </div>
            <div className={`mt-5 flex gap-3 rounded-lg border p-4 text-sm ${isWeightValid ? 'border-teal-100 bg-teal-50 text-teal-900' : 'border-amber-200 bg-amber-50 text-amber-900'}`}>
              <Info className={`mt-0.5 h-5 w-5 shrink-0 ${isWeightValid ? 'text-teal-700' : 'text-amber-600'}`} />
              <p>
                Điều kiện hợp lệ: a &gt;= 40%, b &lt;= 35%, c &lt;= 25%, và a + b + c = 100%.
              </p>
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
              />
            </div>
          </CardSection>

          <CardSection title="3. Điểm thi" icon={PenTool}>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div>
                <label className="mb-3 flex items-center gap-2 text-sm font-semibold text-teal-900">
                  <BookOpen className="h-4 w-4 text-teal-700" /> Kỳ thi tốt nghiệp THPT 2026
                </label>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  {subjects.map((subject, index) => (
                    <div key={`thpt-${subject}`}>
                      <label className="mb-1 block text-sm font-medium text-slate-700">{subject}</label>
                      <ScoreInput
                        max={10}
                        value={state.thpt[index]}
                        onValueChange={(value) => updateScoreArray(state.thpt, state.setThpt, index, value, 10)}
                        disabled={hasThptQuickTotal}
                        tone="teal"
                        placeholder="0.00"
                      />
                    </div>
                  ))}
                </div>
                <QuickScoreInput
                  className="mt-4"
                  title="Nhập nhanh tổng THPT"
                  value={hasThptDetail ? results.thptTotal.toFixed(2) : state.thptQuickTotal}
                  onChange={(event) => setQuickTotal(state.setThptQuickTotal, event.target.value)}
                  disabled={hasThptDetail}
                  step="0.01"
                  placeholder="0.00"
                  tone="teal"
                />
              </div>

              <div>
                <label className="mb-3 flex items-center gap-2 text-sm font-semibold text-teal-900">
                  <Settings className="h-4 w-4 text-teal-700" /> Kỳ thi ĐGNL 2026
                </label>
                <ScoreInput
                  max={1200}
                  value={state.dgnl}
                  onValueChange={state.setDgnl}
                  integer
                  tone="teal"
                  inputClassName="text-lg font-medium"
                  placeholder="850"
                />
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
                      +{results.bonusLanguage.toFixed(1)} điểm
                    </div>
                  )}
                  {state.languageType === 'TOEIC' && (
                    <div className="text-sm font-medium text-emerald-700 md:col-span-3">
                      Điểm cộng ngoại ngữ: +{results.bonusLanguage.toFixed(1)}
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
                    checked={state.hasSpecialSchool}
                    onChange={(event) => state.setHasSpecialSchool(event.target.checked)}
                    className="h-4 w-4 rounded text-teal-700 focus:ring-teal-700"
                  />
                  <span className="text-sm font-medium text-slate-700">Học tập &gt;= 2 năm tại trường Chuyên/PTNK</span>
                </label>
                <label className="mt-3 flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={state.hasGoodAcademic}
                    onChange={(event) => state.setHasGoodAcademic(event.target.checked)}
                    className="h-4 w-4 rounded text-teal-700 focus:ring-teal-700"
                  />
                  <span className="text-sm font-medium text-slate-700">Trung bình học lực 3 năm từ Tốt trở lên</span>
                </label>
                {(state.hasSpecialSchool || state.hasGoodAcademic) && (
                  <ScoreInput
                    max={10}
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
        precision={1}
        tone="teal"
        onClick={() => setShowMobileResultModal(true)}
      />
    </div>
  );
};
