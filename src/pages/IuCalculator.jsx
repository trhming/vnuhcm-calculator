import { useState } from 'react';
import {
  AlertTriangle,
  Award,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  GraduationCap,
  Info,
  PenTool,
  Settings,
  SlidersHorizontal,
} from 'lucide-react';
import { CardSection } from '../components/common/CardSection';
import { ConversionModal } from '../components/common/ConversionModal';
import { ConversionTable } from '../components/common/ConversionTable';
import { TranscriptScoreTable } from '../components/common/TranscriptScoreTable';
import { QuickScoreInput } from '../components/score/QuickScoreInput';
import { ScoreInput } from '../components/score/ScoreInput';
import { MobileScoreButton } from '../components/score/MobileScoreButton';
import { ResponsiveScorePanel } from '../components/score/ResponsiveScorePanel';
import { ScoreDetailCard } from '../components/score/ScoreDetailCard';
import { KHU_VUC, DOI_TUONG } from '../constants/common';
import { IU_ENGLISH_TABLES, IU_ENGLISH_TYPES, IU_GROUPS } from '../constants/iu';
import { useIuCalculator } from '../hooks/useIuCalculator';
import { clampNumber, clampScore, updateScoreArray } from '../utils/input';
import { findById } from '../utils/collection';

export const IuCalculator = () => {
  const { state, results } = useIuCalculator();
  const [showMobileResultModal, setShowMobileResultModal] = useState(false);
  const [showEnglishConversionTable, setShowEnglishConversionTable] = useState(false);

  const needsThpt = ['G1_DGNL', 'G1_NO_DGNL', 'G2_BOTH', 'G2_THPT'].includes(state.group);
  const needsDgnl = ['G1_DGNL', 'G2_BOTH', 'G2_DGNL'].includes(state.group);
  const needsHocBa = ['G1_DGNL', 'G1_NO_DGNL'].includes(state.group);
  const isK3Valid = results.k3 >= 10 && results.k3 <= 20;
  const hasThptDetail = state.thpt.some((value) => value !== '') || state.useEnglishCertificate;
  const hasThptQuickTotal = state.thptQuickTotal !== '';
  const hasHocBaDetail = state.hocBa.some((value) => value !== '');
  const hasHocBaQuickTotal = state.hocBaQuickTotal !== '';
  const selectedEnglishType = findById(IU_ENGLISH_TYPES, state.englishType);
  const setQuickTotal = (setter, value) => setter(clampScore(value, 30));

  const updateK1 = (value) => {
    state.setK1(clampNumber(value, 30, 40));
  };

  const updateK2 = (value) => {
    state.setK2(clampNumber(value, 40, 50));
  };

  const handleHocBaChange = (index, value) => {
    updateScoreArray(state.hocBa, state.setHocBa, index, value, 10);
  };

  const resultCard = (
    <ScoreDetailCard
      theme="red"
      total={results.total}
      formula={`ĐHL = ĐGNL x ${state.k2}% + THPT x ${state.k1}% + Học bạ x ${results.k3}%`}
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
    <div className="mx-auto max-w-7xl animate-in fade-in pb-28 duration-500">
      <div className="mb-8">
        <h1 className="flex items-center gap-3 text-3xl font-extrabold tracking-tight text-red-900">
          <GraduationCap className="h-8 w-8 text-red-700" />
          Máy tính điểm IU 2026
        </h1>
        <p className="mt-2 text-slate-500">
          Phương thức tổng hợp của Trường Đại học Quốc tế - ĐHQG-HCM.
        </p>
        <a
          href="https://tuyensinh.hcmiu.edu.vn/tuyen-sinh/thong-tin-tuyen-sinh-dai-hoc-nam-2026-du-kien/"
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex items-center gap-2 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm font-medium text-red-800 transition-colors hover:border-red-200 hover:bg-red-100"
        >
          Xem phương thức tuyển sinh IU
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="flex-1 space-y-6">
          <CardSection title="1. Trọng số xét tuyển" icon={SlidersHorizontal}>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <label className="font-semibold text-slate-700">k1 - THPT</label>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min="30"
                      max="40"
                      step="1"
                      value={state.k1}
                      onChange={(event) => updateK1(event.target.value)}
                      className="w-14 rounded-md border border-red-200 px-2 py-1 text-right text-sm font-bold text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                    <span className="font-bold text-red-700">%</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="30"
                  max="40"
                  step="1"
                  value={state.k1}
                  onChange={(event) => updateK1(event.target.value)}
                  className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-red-700"
                />
              </div>
              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <label className="font-semibold text-slate-700">k2 - ĐGNL</label>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min="40"
                      max="50"
                      step="1"
                      value={state.k2}
                      onChange={(event) => updateK2(event.target.value)}
                      className="w-14 rounded-md border border-red-200 px-2 py-1 text-right text-sm font-bold text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                    <span className="font-bold text-red-700">%</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="40"
                  max="50"
                  step="1"
                  value={state.k2}
                  onChange={(event) => updateK2(event.target.value)}
                  className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-red-700"
                />
              </div>
              <div className={`rounded-xl border p-4 ${isK3Valid ? 'border-red-100 bg-red-50' : 'border-amber-200 bg-amber-50'}`}>
                <div className={`text-sm font-semibold ${isK3Valid ? 'text-red-900' : 'text-amber-900'}`}>k3 - Học bạ</div>
                <div className={`mt-1 text-3xl font-extrabold ${isK3Valid ? 'text-red-700' : 'text-amber-700'}`}>{results.k3}%</div>
                <div className={`mt-1 text-xs ${isK3Valid ? 'text-red-800/70' : 'text-amber-800'}`}>
                  Tự tính = 100 - k1 - k2
                </div>
                {!isK3Valid && (
                  <div className="mt-2 text-xs font-medium text-amber-800">
                    k3 nên nằm trong khoảng 10% - 20%.
                  </div>
                )}
              </div>
            </div>
          </CardSection>

          <CardSection title="2. Nhóm đối tượng" icon={Settings}>
            <select
              value={state.group}
              onChange={(event) => state.setGroup(event.target.value)}
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              {IU_GROUPS.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
          </CardSection>

          {needsHocBa && (
            <CardSection title="3. Điểm học bạ" icon={BookOpen}>
                  <div className="space-y-4">
                    <TranscriptScoreTable
                      values={state.hocBa}
                      onChange={handleHocBaChange}
                      disabled={hasHocBaQuickTotal}
                      tone="red"
                    />
                    <QuickScoreInput
                      title="Nhập nhanh tổng học bạ"
                      value={hasHocBaDetail ? results.hocBaTotal.toFixed(2) : state.hocBaQuickTotal}
                      onChange={(event) => setQuickTotal(state.setHocBaQuickTotal, event.target.value)}
                      disabled={hasHocBaDetail}
                      step="0.01"
                      placeholder="0.00"
                      tone="red"
                    />
                  </div>
            </CardSection>
          )}

          {(needsThpt || needsDgnl) && (
            <CardSection title="4. Điểm thi" icon={PenTool}>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {needsThpt && (
                  <div>
                    <label className="mb-4 flex items-center gap-2 text-sm font-semibold text-red-900">
                      <BookOpen className="w-4 h-4 text-red-600" /> Kỳ thi tốt nghiệp THPT 2026
                    </label>
                    <div className="space-y-3">
                      {[0, 1].map((index) => (
                        <div key={`thpt-${index}`} className="flex items-center gap-3">
                          <label className="w-16 text-sm text-slate-600">Môn {index + 1}</label>
                          <ScoreInput
                            max={10}
                            value={state.thpt[index]}
                            onValueChange={(value) => updateScoreArray(state.thpt, state.setThpt, index, value, 10)}
                            disabled={hasThptQuickTotal}
                            tone="red"
                            placeholder="0.00"
                          />
                        </div>
                      ))}
                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                        <div className="flex items-center gap-3">
                          <label className="w-16 text-sm font-medium text-slate-700">Môn 3</label>
                          <ScoreInput
                            max={10}
                            maxDecimal={2}
                            value={state.useEnglishCertificate ? results.englishConvertedScore : state.thpt[2]}
                            onValueChange={(value) => updateScoreArray(state.thpt, state.setThpt, 2, value, 10)}
                            disabled={state.useEnglishCertificate || hasThptQuickTotal}
                            tone="red"
                            inputClassName="bg-white disabled:bg-slate-100 disabled:text-slate-500"
                            placeholder="0.00"
                          />
                        </div>
                        <label className="mt-3 flex cursor-pointer items-center gap-2 pl-[4.75rem] text-sm text-slate-600">
                          <input
                            type="checkbox"
                            checked={state.useEnglishCertificate}
                            onChange={(event) => state.setUseEnglishCertificate(event.target.checked)}
                            className="h-4 w-4 rounded text-red-600 focus:ring-red-500"
                          />
                          Dùng chứng chỉ ngoại ngữ quy đổi
                        </label>
                        <div className="mt-2 pl-[4.75rem]">
                          <button
                            type="button"
                            onClick={() => setShowEnglishConversionTable(true)}
                            className="text-xs font-medium text-blue-700 hover:text-blue-900 hover:underline"
                          >
                            Bảng quy đổi
                          </button>
                        </div>
                        {state.useEnglishCertificate && (
                          <div className="mt-3 grid grid-cols-1 gap-2 border-t border-slate-200 pt-3 sm:grid-cols-3">
                            <select
                              value={state.englishType}
                              onChange={(event) => {
                                state.setEnglishType(event.target.value);
                                state.setEnglishScore('');
                                state.setEnglishScore2('');
                              }}
                              className="rounded-md border border-slate-300 bg-white px-2 py-2 text-sm focus:ring-2 focus:ring-red-500"
                            >
                              {IU_ENGLISH_TYPES.map((type) => (
                                <option key={type.id} value={type.id}>{type.name}</option>
                              ))}
                            </select>
                            <ScoreInput
                              max={state.englishType === 'TOEIC' ? selectedEnglishType?.maxLr : selectedEnglishType?.max}
                              value={state.englishScore}
                              onValueChange={state.setEnglishScore}
                              tone="red"
                              inputClassName="border-slate-300 px-2 text-sm"
                              placeholder={state.englishType === 'TOEIC' ? 'Nghe đọc' : 'Điểm CC'}
                            />
                            {state.englishType === 'TOEIC' ? (
                              <ScoreInput
                                max={selectedEnglishType?.maxSw}
                                value={state.englishScore2}
                                onValueChange={state.setEnglishScore2}
                                tone="red"
                                inputClassName="border-slate-300 px-2 text-sm"
                                placeholder="Nói viết"
                              />
                            ) : (
                              <div className="flex items-center gap-1 text-sm font-medium text-emerald-600">
                                <CheckCircle2 className="h-4 w-4" />
                                {results.englishConvertedScore.toFixed(1)} / 10
                              </div>
                            )}
                            {state.englishType === 'TOEIC' && (
                              <div className="flex items-center gap-1 text-sm font-medium text-emerald-600 sm:col-span-3">
                                <CheckCircle2 className="h-4 w-4" />
                                Quy đổi: {results.englishConvertedScore.toFixed(1)} / 10
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <QuickScoreInput
                      className="mt-4"
                      title="Nhập nhanh tổng THPT"
                      value={hasThptDetail ? results.thptTotal.toFixed(2) : state.thptQuickTotal}
                      onChange={(event) => setQuickTotal(state.setThptQuickTotal, event.target.value)}
                      disabled={hasThptDetail}
                      step="0.01"
                      placeholder="0.00"
                      tone="red"
                    />
                  </div>
                )}

                {needsDgnl && (
                  <div>
                    <label className="mb-4 flex items-center gap-2 text-sm font-semibold text-red-900">
                      <Settings className="w-4 h-4 text-red-600" /> Kỳ thi ĐGNL 2026
                    </label>
                    <ScoreInput
                      max={1200}
                      value={state.dgnl}
                      onValueChange={state.setDgnl}
                      integer
                      tone="red"
                      inputClassName="text-lg font-medium"
                      placeholder="850"
                    />
                  </div>
                )}
              </div>
            </CardSection>
          )}

          <CardSection title="5. Ưu tiên & Điểm cộng" icon={Award}>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Khu vực</label>
                <select
                  value={state.kv}
                  onChange={(event) => state.setKv(event.target.value)}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
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
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  {DOI_TUONG.map((item) => (
                    <option key={item.id} value={item.id}>{item.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="mb-4 font-semibold text-slate-800">Điểm cộng (Max 10)</h4>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Điểm thưởng (Max 10)</label>
                  <ScoreInput
                    max={10}
                    maxDecimal={2}
                    value={state.achievementBonus}
                    onValueChange={state.setAchievementBonus}
                    tone="red"
                    placeholder="0.0"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Xét thưởng (Max 5)</label>
                  <ScoreInput
                    max={5}
                    value={state.awardBonus}
                    onValueChange={state.setAwardBonus}
                    tone="red"
                    placeholder="0.0"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Khuyến khích NN (Max 5)</label>
                  <ScoreInput
                    max={5}
                    maxDecimal={2}
                    value={state.englishBonus}
                    onValueChange={state.setEnglishBonus}
                    disabled={state.useEnglishCertificate}
                    tone="red"
                    inputClassName="disabled:bg-slate-100 disabled:text-slate-400"
                    placeholder="0.0"
                  />
                </div>
              </div>
            </div>

            {state.useEnglishCertificate && (
              <div className="mt-5 flex gap-3 rounded-lg border border-amber-100 bg-amber-50 p-4 text-sm text-amber-800">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
                <p>
                  Đã dùng chứng chỉ ngoại ngữ để thay môn tiếng Anh THPT, nên điểm khuyến khích ngoại ngữ không được tính thêm.
                </p>
              </div>
            )}

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
                    rows={table.rows}
                  />
                ))}
              </div>
              <div className="mt-4 rounded-lg border border-amber-100 bg-amber-50 p-4 text-sm text-amber-800">
                Nếu đã dùng chứng chỉ ngoại ngữ để thay thế môn tiếng Anh trong tổ hợp THPT, chứng chỉ đó không được tính thêm vào điểm khuyến khích.
              </div>
      </ConversionModal>
    </div>
  );
};
