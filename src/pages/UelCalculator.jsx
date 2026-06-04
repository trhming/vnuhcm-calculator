import { useState } from 'react';
import { useUelCalculator } from '../hooks/useUelCalculator';
import { CardSection } from '../components/common/CardSection';
import { ConversionModal } from '../components/common/ConversionModal';
import { ConversionTable } from '../components/common/ConversionTable';
import { TranscriptScoreTable } from '../components/common/TranscriptScoreTable';
import { QuickScoreInput } from '../components/score/QuickScoreInput';
import { MobileScoreButton } from '../components/score/MobileScoreButton';
import { ResponsiveScorePanel } from '../components/score/ResponsiveScorePanel';
import { Settings, BookOpen, PenTool, Award, BookHeart, GraduationCap, Info, ExternalLink } from 'lucide-react';
import { KHU_VUC, DOI_TUONG } from '../constants/common';
import { UEL_ENGLISH_BONUS, CCQT_TYPES, UEL_ENGLISH_CERT_TYPES, UEL_CCQT_TABLE } from '../constants/uel';
import { clampScore } from '../utils/input';
import { ScoreDetailCard } from '../components/score/ScoreDetailCard';

export const UelCalculator = () => {
  const { state, results } = useUelCalculator();
  const [showMobileResultModal, setShowMobileResultModal] = useState(false);
  const [showConversionTable, setShowConversionTable] = useState(false);
  const [showCcqtConversionTable, setShowCcqtConversionTable] = useState(false);

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

  // Visibility logic
  const isChinhQuy = state.program === 'CHINH_QUY';
  const showHocBa = state.dtXetTuyen !== 'DT4';
  const showDgnl = (isChinhQuy && (state.dtXetTuyen === 'DT1' || state.dtXetTuyen === 'DT3')) || (!isChinhQuy && state.dtXetTuyen === 'DT1');
  const showThpt = (isChinhQuy && (state.dtXetTuyen === 'DT1' || state.dtXetTuyen === 'DT2')) || (!isChinhQuy && (state.dtXetTuyen === 'DT1' || state.dtXetTuyen === 'DT2'));
  const showCcqt = isChinhQuy && state.dtXetTuyen === 'DT4';
  const hasThptDetail = state.thpt.some((value) => value !== '');
  const hasThptQuickTotal = state.thptQuickTotal !== '';
  const hasHocBaDetail = state.hocBa.some((value) => value !== '');
  const hasHocBaQuickTotal = state.hocBaQuickTotal !== '';
  const selectedCcqtType = CCQT_TYPES.find((type) => type.id === state.loaiCCQT);
  const selectedEnglishCertType = UEL_ENGLISH_CERT_TYPES.find((type) => type.id === state.loaiNgoaiNgu);
  const learningWeights = (() => {
    if (state.dtXetTuyen === 'DT1') return { dgnl: 55, thpt: 35, hocBa: 10 };
    if (state.dtXetTuyen === 'DT2') return { dgnl: 0, thpt: isChinhQuy ? 90 : 50, hocBa: isChinhQuy ? 10 : 50 };
    if (state.dtXetTuyen === 'DT3') return { dgnl: 90, thpt: 0, hocBa: 10 };
    return null;
  })();
  const setQuickTotal = (setter, value) => {
    setter(clampScore(value, 30));
  };

  return (
    <>
    <div className="max-w-7xl mx-auto animate-in fade-in duration-500 pb-28">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-indigo-900 tracking-tight flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-indigo-600" />
          Máy tính điểm UEL 2026
        </h1>
        <p className="text-slate-500 mt-2">Phương thức tổng hợp của Trường Đại học Kinh tế - Luật - ĐHQG-HCM.</p>
        <a
          href="https://tuyensinh.uel.edu.vn/thong-tin-tuyen-sinh-dai-hoc-chinh-quy-2026/"
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex items-center gap-2 rounded-lg border border-indigo-100 bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-800 transition-colors hover:border-indigo-200 hover:bg-indigo-100"
        >
          Xem phương thức tuyển sinh UEL
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column - Forms */}
        <div className="flex-1 space-y-6">

          {/* Program Toggle */}
          <div className="bg-white p-2 rounded-2xl flex border border-indigo-100 shadow-sm">
            <button
              onClick={() => {
                state.setProgram('CHINH_QUY');
                state.setDtXetTuyen('DT1');
              }}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
                isChinhQuy ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              Hệ Chính Quy
            </button>
            <button
              onClick={() => {
                state.setProgram('LIEN_KET');
                state.setDtXetTuyen('DT1');
              }}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
                !isChinhQuy ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              Hệ Liên Kết Quốc Tế
            </button>
          </div>

          {/* Đối tượng */}
          <CardSection title="Đối tượng xét tuyển" icon={Settings}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${state.dtXetTuyen === 'DT1' ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600' : 'border-slate-200 hover:bg-slate-50'}`}>
                <input type="radio" name="dt" value="DT1" checked={state.dtXetTuyen === 'DT1'} onChange={() => state.setDtXetTuyen('DT1')} className="w-4 h-4 text-indigo-600" />
                <span className="font-medium text-slate-700">ĐT1 (ĐGNL + THPT)</span>
              </label>
              
              <label className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${state.dtXetTuyen === 'DT2' ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600' : 'border-slate-200 hover:bg-slate-50'}`}>
                <input type="radio" name="dt" value="DT2" checked={state.dtXetTuyen === 'DT2'} onChange={() => state.setDtXetTuyen('DT2')} className="w-4 h-4 text-indigo-600" />
                <span className="font-medium text-slate-700">ĐT2 (Chỉ THPT)</span>
              </label>

              {isChinhQuy && (
                <>
                  <label className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${state.dtXetTuyen === 'DT3' ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600' : 'border-slate-200 hover:bg-slate-50'}`}>
                    <input type="radio" name="dt" value="DT3" checked={state.dtXetTuyen === 'DT3'} onChange={() => state.setDtXetTuyen('DT3')} className="w-4 h-4 text-indigo-600" />
                    <span className="font-medium text-slate-700">ĐT3 (Chỉ ĐGNL)</span>
                  </label>
                  
                  <label className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${state.dtXetTuyen === 'DT4' ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600' : 'border-slate-200 hover:bg-slate-50'}`}>
                    <input type="radio" name="dt" value="DT4" checked={state.dtXetTuyen === 'DT4'} onChange={() => state.setDtXetTuyen('DT4')} className="w-4 h-4 text-indigo-600" />
                    <span className="font-medium text-slate-700">ĐT4 (Chứng chỉ QT)</span>
                  </label>
                </>
              )}
            </div>
          </CardSection>

          {/* Học bạ */}
          {showHocBa && (
            <CardSection title="1. Điểm học bạ" icon={BookOpen}>
              <TranscriptScoreTable
                values={state.hocBa}
                onChange={handleHocBaChange}
                disabled={hasHocBaQuickTotal}
                tone="indigo"
              />
              <QuickScoreInput
                title="Nhập nhanh tổng học bạ"
                value={hasHocBaDetail ? ((results.Z / 100) * 30).toFixed(2) : state.hocBaQuickTotal}
                onChange={(event) => setQuickTotal(state.setHocBaQuickTotal, event.target.value)}
                disabled={hasHocBaDetail}
                step="0.01"
                placeholder="0.00"
                tone="indigo"
              />
            </CardSection>
          )}

          {/* Điểm Thi */}
          {(showDgnl || showThpt) && (
            <CardSection title="2. Điểm thi" icon={PenTool}>
              <div className={`grid grid-cols-1 gap-6 ${showDgnl && showThpt ? 'lg:grid-cols-2' : ''}`}>
                {/* Điểm Thi THPT */}
                {showThpt && (
                  <div>
                    <label className="block text-sm font-semibold text-indigo-900 mb-3 flex items-center gap-2">
                      <BookHeart className="w-4 h-4 text-indigo-600" /> Kỳ thi tốt nghiệp THPT 2026
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {[0, 1, 2].map((idx) => (
                        <div key={`thpt-${idx}`}>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Môn {idx + 1}</label>
                          <input
                            type="number" min="0" max="10" step="0.1"
                            value={state.thpt[idx]}
                            onChange={(e) => handleThptChange(idx, e.target.value)}
                            disabled={hasThptQuickTotal}
                            className={`w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600 ${hasThptQuickTotal ? 'cursor-not-allowed bg-slate-100 text-slate-400' : ''}`}
                            placeholder="0.00"
                          />
                        </div>
                      ))}
                    </div>
                    <QuickScoreInput
                      title="Nhập nhanh tổng THPT"
                      value={hasThptDetail ? ((results.Y / 100) * 30).toFixed(2) : state.thptQuickTotal}
                      onChange={(event) => setQuickTotal(state.setThptQuickTotal, event.target.value)}
                      disabled={hasThptDetail}
                      step="0.01"
                      placeholder="0.00"
                      tone="indigo"
                      className="mt-4"
                    />
                  </div>
                )}

                {/* Điểm thi ĐGNL */}
                {showDgnl && (
                  <div>
                    <label className="block text-sm font-semibold text-indigo-900 mb-2 flex items-center gap-2">
                      <Settings className="w-4 h-4 text-indigo-600" /> Kỳ thi ĐGNL 2026
                    </label>
                    <input
                      type="number" min="0" max="1200"
                      value={state.dgnl}
                      onChange={(e) => {
                         state.setDgnl(clampScore(e.target.value, 1200));
                      }}
                      className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600 font-medium text-lg"
                      placeholder="850"
                    />
                  </div>
                )}
              </div>
            </CardSection>
          )}

          {/* CCQT */}
          {showCcqt && (
            <CardSection title="1. Chứng chỉ Quốc tế" icon={GraduationCap}>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-2">Loại chứng chỉ</label>
                   <select 
                     value={state.loaiCCQT} 
                     onChange={e => {
                       state.setLoaiCCQT(e.target.value);
                       state.setDiemCCQT('');
                     }}
                     className="w-full px-3 py-2 border border-slate-200 rounded-md focus:ring-2 focus:ring-indigo-600"
                   >
                     {CCQT_TYPES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                   </select>
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-2">Kết quả (Điểm/Rank)</label>
                   <div className="flex gap-2">
                     <div className="flex-1">
                       {state.loaiCCQT === 'A_LEVEL' ? (
                         <select 
                           value={state.diemCCQT} 
                           onChange={e => state.setDiemCCQT(e.target.value)}
                           className="w-full px-3 py-2 border border-slate-200 rounded-md focus:ring-2 focus:ring-indigo-600"
                         >
                           <option value="">-- Chọn Hạng --</option>
                           <option value="A*">A*</option>
                           <option value="A">A</option>
                           <option value="B">B</option>
                           <option value="C">C</option>
                         </select>
                       ) : (
                         <input 
                           type="number"
                           min="0"
                            max={selectedCcqtType?.max}
                            value={state.diemCCQT} 
                            onChange={e => state.setDiemCCQT(clampScore(e.target.value, selectedCcqtType?.max))}
                           className="w-full px-3 py-2 border border-slate-200 rounded-md focus:ring-2 focus:ring-indigo-600" 
                           placeholder="VD: 1450"
                         />
                       )}
                     </div>
                     <div className="flex items-end">
                        <button 
                          onClick={() => setShowCcqtConversionTable(true)}
                          className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center gap-1 whitespace-nowrap px-2 py-2"
                        >
                          <Info className="w-4 h-4" /> Bảng quy đổi
                        </button>
                     </div>
                   </div>
                 </div>
               </div>
            </CardSection>
          )}

          {/* Thành tích & Ưu tiên */}
          <CardSection title="3. Ưu tiên & Điểm cộng" icon={Award}>
            <div className="space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-[13fr_14fr] gap-6">
                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-2">Khu vực</label>
                   <select 
                     value={state.kv} onChange={e => state.setKv(e.target.value)}
                     className="w-full px-3 py-2 border border-slate-200 rounded-md focus:ring-2 focus:ring-indigo-600"
                   >
                     {KHU_VUC.map(k => <option key={k.id} value={k.id}>{k.name}</option>)}
                   </select>
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-2">Đối tượng (Chính sách)</label>
                   <select 
                     value={state.dt} onChange={e => state.setDt(e.target.value)}
                     className="w-full px-3 py-2 border border-slate-200 rounded-md focus:ring-2 focus:ring-indigo-600"
                   >
                     {DOI_TUONG.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                   </select>
                 </div>
               </div>

               <div className="border-t border-slate-100 pt-5 space-y-4">
                 <div>
                   <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors mb-3">
                     <input
                       type="checkbox"
                       checked={state.hasNgoaiNgu}
                       onChange={(e) => state.setHasNgoaiNgu(e.target.checked)}
                       className="w-5 h-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-600"
                     />
                     <span className="text-sm font-medium text-slate-700">
                       Có chứng chỉ Tiếng Anh (Cộng điểm)
                     </span>
                   </label>

                   {state.hasNgoaiNgu && (
                     <div className="space-y-2">
                       <div className="flex flex-col sm:flex-row gap-3 pl-8">
                         <div className="flex-1">
                         <label className="block text-xs font-medium text-slate-500 mb-1">Loại chứng chỉ</label>
                         <select 
                           value={state.loaiNgoaiNgu} 
                           onChange={e => {
                             state.setLoaiNgoaiNgu(e.target.value);
                             state.setDiemNgoaiNgu('');
                             state.setDiemNgoaiNgu2('');
                           }}
                           className="w-full px-3 py-2 border border-slate-200 rounded-md focus:ring-2 focus:ring-indigo-600 text-sm"
                         >
                           {UEL_ENGLISH_CERT_TYPES.map(c => (
                             <option key={c.id} value={c.id}>{c.name}</option>
                           ))}
                         </select>
                       </div>
                       <div className="w-full sm:w-48 flex gap-2">
                         {state.loaiNgoaiNgu === 'TOEIC' ? (
                           <>
                             <div className="flex-1">
                               <label className="block text-xs font-medium text-slate-500 mb-1">Nghe-Đọc</label>
                               <input 
                                 type="number" step="5" min="0" max={selectedEnglishCertType?.maxLr}
                                 value={state.diemNgoaiNgu}
                                onChange={e => state.setDiemNgoaiNgu(clampScore(e.target.value, selectedEnglishCertType?.maxLr))}
                                 className="w-full px-3 py-2 border border-slate-200 rounded-md focus:ring-2 focus:ring-indigo-600 text-sm"
                                 placeholder="VD: 785"
                               />
                             </div>
                             <div className="flex-1">
                               <label className="block text-xs font-medium text-slate-500 mb-1">Nói-Viết</label>
                               <input 
                                 type="number" step="5" min="0" max={selectedEnglishCertType?.maxSw}
                                 value={state.diemNgoaiNgu2}
                                onChange={e => state.setDiemNgoaiNgu2(clampScore(e.target.value, selectedEnglishCertType?.maxSw))}
                                 className="w-full px-3 py-2 border border-slate-200 rounded-md focus:ring-2 focus:ring-indigo-600 text-sm"
                                 placeholder="VD: 310"
                               />
                             </div>
                           </>
                         ) : (
                           <div className="flex-1">
                             <label className="block text-xs font-medium text-slate-500 mb-1">Điểm số</label>
                             <input 
                              type="number" step="0.1" min="0" max={selectedEnglishCertType?.max}
                               value={state.diemNgoaiNgu}
                              onChange={e => state.setDiemNgoaiNgu(clampScore(e.target.value, selectedEnglishCertType?.max))}
                               className="w-full px-3 py-2 border border-slate-200 rounded-md focus:ring-2 focus:ring-indigo-600 text-sm"
                               placeholder="VD: 6.5"
                             />
                           </div>
                         )}
                       </div>
                       <div className="flex items-end pb-1">
                         <button 
                           onClick={() => setShowConversionTable(true)}
                           className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center gap-1 whitespace-nowrap px-2 py-2"
                         >
                           <Info className="w-4 h-4" /> Bảng quy đổi
                         </button>
                       </div>
                     </div>
                     {/* Báo kết quả quy đổi */}
                     {results.nnPoint > 0 && (
                       <div className="mt-2 text-sm text-emerald-600 font-medium pl-8 animate-in fade-in">
                         ✓ Đạt mức cộng: +{results.nnPoint.toFixed(1)} điểm
                       </div>
                     )}
                     {((state.loaiNgoaiNgu !== 'TOEIC' && state.diemNgoaiNgu) || (state.loaiNgoaiNgu === 'TOEIC' && state.diemNgoaiNgu && state.diemNgoaiNgu2)) && results.nnPoint === 0 && (
                       <div className="mt-2 text-sm text-rose-500 font-medium pl-8 animate-in fade-in">
                         ✗ Điểm chưa đạt mức cộng tối thiểu
                       </div>
                      )}
                    </div>
                   )}
                 </div>

                 {isChinhQuy && (
                   <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
                     <input
                       type="checkbox"
                       checked={state.la149Truong}
                       onChange={(e) => state.setLa149Truong(e.target.checked)}
                       className="w-5 h-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-600"
                     />
                     <span className="text-sm font-medium text-slate-700">
                       Học sinh của 149 trường THPT ưu tiên xét tuyển theo quy định ĐHQG (Cộng 5đ)
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
          borderClassName="border-indigo-200"
        >
          <ScoreDetailCard
            theme="indigo"
            total={results.total}
            formula={learningWeights
              ? `ĐHL = ĐGNL x ${learningWeights.dgnl}% + THPT x ${learningWeights.thpt}% + Học bạ x ${learningWeights.hocBa}%`
              : results.textFormula}
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
        title="Bảng quy đổi Chứng chỉ Ngoại ngữ (UEL)"
        onClose={() => setShowConversionTable(false)}
      >
        <div className="overflow-x-auto">
          <ConversionTable
            align="left"
            columns={[
              { key: 'point', header: 'Điểm cộng', value: true, cellClassName: 'whitespace-nowrap px-4 py-2 font-semibold text-blue-700' },
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
              };
            })}
          />
        </div>
      </ConversionModal>

      <ConversionModal
        isOpen={showCcqtConversionTable}
        title="Bảng quy đổi Chứng chỉ Quốc tế ra Thang điểm 100"
        onClose={() => setShowCcqtConversionTable(false)}
      >
        <div className="overflow-x-auto">
          <ConversionTable
            columns={[
              { key: 'sat', header: 'Điểm SAT' },
              { key: 'act', header: 'Điểm ACT' },
              { key: 'ib', header: 'Điểm IB' },
              { key: 'aLevel', header: 'Hạng A-Level' },
              { key: 'point', header: 'Quy đổi', value: true },
            ]}
            rows={UEL_CCQT_TABLE}
          />
        </div>
      </ConversionModal>

    </>
  );
};
