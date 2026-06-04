import { useState } from 'react';
import { useUsshCalculator } from '../hooks/useUsshCalculator';
import { CardSection } from '../components/common/CardSection';
import { TranscriptScoreTable } from '../components/common/TranscriptScoreTable';
import { QuickScoreInput } from '../components/score/QuickScoreInput';
import { ScoreInput } from '../components/score/ScoreInput';
import { MobileScoreButton } from '../components/score/MobileScoreButton';
import { ResponsiveScorePanel } from '../components/score/ResponsiveScorePanel';
import { ScoreDetailCard } from '../components/score/ScoreDetailCard';
import { Settings, BookOpen, PenTool, Award, Globe, ExternalLink } from 'lucide-react';
import { KHU_VUC, DOI_TUONG } from '../constants/common';
import { clampScore } from '../utils/input';

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
    const newHocBa = [...state.hocBa];
    newHocBa[index] = clampScore(val, 10);
    state.setHocBa(newHocBa);
  };

  const handleThptChange = (index, val) => {
    const newThpt = [...state.thpt];
    newThpt[index] = clampScore(val, 10);
    state.setThpt(newThpt);
  };

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in duration-500 pb-28">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-emerald-900 tracking-tight flex items-center gap-3">
          <Globe className="w-8 h-8 text-emerald-700" />
          Máy tính điểm USSH 2026
        </h1>
        <p className="text-slate-500 mt-2">Phương thức tổng hợp của Trường Đại học Khoa học Xã hội và Nhân văn - ĐHQG-HCM.</p>
        <a
          href="https://hcmussh.edu.vn/tin-tuc/thong-tin-tuyen-sinh-dai-hoc-chinh-quy"
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex items-center gap-2 rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-800 transition-colors hover:border-emerald-200 hover:bg-emerald-100"
        >
          Xem phương thức tuyển sinh USSH
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column - Forms */}
        <div className="flex-1 space-y-6">
          
          {/* Học bạ */}
          <CardSection title="1. Điểm học bạ" icon={BookOpen}>
            <div>
              <TranscriptScoreTable
                values={state.hocBa}
                onChange={handleHocBaChange}
                disabled={hasHocBaQuickTotal}
                tone="emerald"
              />
              <QuickScoreInput
                title="Nhập nhanh tổng học bạ"
                value={hasHocBaDetail ? ((results.hb100 / 100) * 30).toFixed(2) : state.hocBaQuickTotal}
                onChange={(event) => setQuickTotal(state.setHocBaQuickTotal, event.target.value)}
                disabled={hasHocBaDetail}
                step="0.01"
                placeholder="0.00"
                tone="emerald"
              />
            </div>
          </CardSection>

          {/* Điểm Thi */}
          <CardSection title="2. Điểm thi" icon={PenTool}>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Điểm Thi THPT */}
              <div>
                <label className="block text-sm font-semibold text-emerald-900 mb-3 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-600" />
                  Kỳ thi tốt nghiệp THPT 2026
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[0, 1, 2].map((idx) => (
                    <div key={`thpt-${idx}`}>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Môn {idx + 1}
                      </label>
                      <ScoreInput
                        max={10}
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
                  title="Nhập nhanh tổng THPT"
                  value={hasThptDetail ? ((results.thpt100 / 100) * 30).toFixed(2) : state.thptQuickTotal}
                  onChange={(event) => setQuickTotal(state.setThptQuickTotal, event.target.value)}
                  disabled={hasThptDetail}
                  step="0.01"
                  placeholder="0.00"
                  tone="emerald"
                  className="mt-4"
                />
              </div>

              {/* Điểm thi ĐGNL */}
              <div>
                <label className="block text-sm font-semibold text-emerald-900 mb-2 flex items-center gap-2">
                  <Settings className="w-4 h-4 text-emerald-600" />
                  Kỳ thi ĐGNL 2026
                </label>
                <ScoreInput
                  max={1200}
                  value={state.dgnl}
                  onValueChange={state.setDgnl}
                  tone="emerald"
                  inputClassName="font-medium text-lg"
                  placeholder="850"
                />
              </div>
            </div>
          </CardSection>

          {/* Thành tích & Ưu tiên */}
          <CardSection title="3. Ưu tiên & Điểm cộng" icon={Award}>
            <div className="space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-[13fr_14fr] gap-6">
                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-2">Khu vực</label>
                   <select 
                     value={state.kv} onChange={e => state.setKv(e.target.value)}
                     className="w-full px-3 py-2 border border-slate-200 rounded-md focus:ring-2 focus:ring-emerald-600"
                   >
                     {KHU_VUC.map(k => <option key={k.id} value={k.id}>{k.name}</option>)}
                   </select>
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-2">Đối tượng (Chính sách)</label>
                   <select 
                     value={state.dt} onChange={e => state.setDt(e.target.value)}
                     className="w-full px-3 py-2 border border-slate-200 rounded-md focus:ring-2 focus:ring-emerald-600"
                   >
                     {DOI_TUONG.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                   </select>
                 </div>
               </div>

               <div className="border-t border-slate-100 pt-5">
                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Điểm cộng thành tích (Max 10)</label>
                   <ScoreInput
                     max={10}
                     value={state.thanhTich}
                     onValueChange={state.setThanhTich}
                     tone="emerald"
                     placeholder="VD: 5"
                   />
                 </div>
               </div>
            </div>
          </CardSection>

        </div>

        <ResponsiveScorePanel
          isOpen={showMobileResultModal}
          onClose={() => setShowMobileResultModal(false)}
          borderClassName="border-emerald-200"
        >
          <ScoreDetailCard
            theme="emerald"
            total={results.total}
            beforeLearning={
              <div className="space-y-3">
                <div className={`rounded-xl border p-3 ${results.selectedScenario === 'all' ? 'border-emerald-300 bg-emerald-50 ring-1 ring-emerald-300' : 'border-slate-100 bg-slate-50 opacity-60'}`}>
                  <div className="mb-1 text-xs font-semibold text-slate-500">ĐHL Tổng (THPT 45% + ĐGNL 45% + HB 10%)</div>
                  <div className={`text-xl font-bold ${results.selectedScenario === 'all' ? 'text-emerald-700' : 'text-slate-600'}`}>
                    {results.dhlAll !== null ? results.dhlAll.toFixed(2) : '-'}
                  </div>
                </div>
                <div className={`rounded-xl border p-3 ${results.selectedScenario === '1' ? 'border-emerald-300 bg-emerald-50 ring-1 ring-emerald-300' : 'border-slate-100 bg-slate-50 opacity-60'}`}>
                  <div className="mb-1 text-xs font-semibold text-slate-500">ĐHL 1 (THPT 90% + HB 10%)</div>
                  <div className={`text-xl font-bold ${results.selectedScenario === '1' ? 'text-emerald-700' : 'text-slate-600'}`}>
                    {results.dhl1 !== null ? results.dhl1.toFixed(2) : '-'}
                  </div>
                </div>
                <div className={`rounded-xl border p-3 ${results.selectedScenario === '2' ? 'border-emerald-300 bg-emerald-50 ring-1 ring-emerald-300' : 'border-slate-100 bg-slate-50 opacity-60'}`}>
                  <div className="mb-1 text-xs font-semibold text-slate-500">ĐHL 2 (ĐGNL 90% + HB 10%)</div>
                  <div className={`text-xl font-bold ${results.selectedScenario === '2' ? 'text-emerald-700' : 'text-slate-600'}`}>
                    {results.dhl2 !== null ? results.dhl2.toFixed(2) : '-'}
                  </div>
                </div>
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
