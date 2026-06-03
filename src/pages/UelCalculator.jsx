import { useState } from 'react';
import { useUelCalculator } from '../hooks/useUelCalculator';
import { CardSection } from '../components/common/CardSection';
import { QuickScoreInput } from '../components/common/QuickScoreInput';
import { MobileScoreButton } from '../components/common/MobileScoreButton';
import { Settings, BookOpen, PenTool, Award, Calculator, X, BookHeart, GraduationCap, Info, ExternalLink } from 'lucide-react';
import { KHU_VUC, DOI_TUONG } from '../constants/common';
import { UEL_ENGLISH_BONUS, CCQT_TYPES, UEL_ENGLISH_CERT_TYPES, UEL_CCQT_TABLE, UEL_ENGLISH_CONVERSION } from '../constants/uel';
import { clampScore } from '../utils/input';

const ENGLISH_SCORE_MAX = {
  ...Object.fromEntries(
    Object.entries(UEL_ENGLISH_CONVERSION)
      .filter(([type]) => type !== 'TOEIC')
      .map(([type, rows]) => [type, Math.max(...rows.map((row) => row.max))])
  ),
  TOEIC_LR: 990,
  TOEIC_SW: 400,
};

const CCQT_SCORE_MAX = {
  SAT: 1600,
  ACT: 36,
  IB: 45,
};

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
            <CardSection title="1. Điểm Học Bạ" icon={BookOpen}>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse">
                  <thead className="bg-slate-50 text-slate-600">
                    <tr>
                      <th className="px-4 py-3 rounded-tl-lg font-semibold w-1 whitespace-nowrap">Môn</th>
                      <th className="px-4 py-3 font-semibold text-center w-1/4">Lớp 10</th>
                      <th className="px-4 py-3 font-semibold text-center w-1/4">Lớp 11</th>
                      <th className="px-4 py-3 font-semibold text-center w-1/4">Lớp 12</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[0, 1, 2].map((subjectIndex) => (
                      <tr key={`subject-${subjectIndex}`}>
                        <td className="px-4 py-3 font-medium text-slate-700 whitespace-nowrap">Môn {subjectIndex + 1}</td>
                        {[0, 1, 2].map((yearIndex) => {
                          const cellIndex = subjectIndex * 3 + yearIndex;
                          return (
                            <td key={cellIndex} className="px-2 py-2">
                              <input
                                type="number" min="0" max="10" step="0.1"
                                value={state.hocBa[cellIndex]}
                                onChange={(e) => handleHocBaChange(cellIndex, e.target.value)}
                                disabled={hasHocBaQuickTotal}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600 text-center transition-colors border-slate-200 ${hasHocBaQuickTotal ? 'cursor-not-allowed bg-slate-100 text-slate-400' : 'text-slate-900'}`}
                                placeholder="0.0"
                              />
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {results.Z > 0 && (
                <div className="mt-4 flex items-center justify-end gap-2 text-sm font-medium text-emerald-600">
                  <span>↳ Điểm quy đổi học bạ (Thang 100):</span>
                  <span className="text-base font-bold">{results.Z.toFixed(2)}</span>
                </div>
              )}
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
            <CardSection title="2. Điểm Thi (ĐGNL & THPT)" icon={PenTool}>
              <div className="space-y-6">
                
                {/* Điểm thi ĐGNL */}
                {showDgnl && (
                  <div>
                    <label className="block text-sm font-semibold text-indigo-900 mb-2 flex items-center gap-2">
                      <Settings className="w-4 h-4 text-indigo-600" /> Kỳ thi Đánh giá Năng lực
                    </label>
                    <input
                      type="number" min="0" max="1200"
                      value={state.dgnl}
                      onChange={(e) => {
                         state.setDgnl(clampScore(e.target.value, 1200));
                      }}
                      className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600 font-medium text-lg"
                      placeholder="VD: 850"
                    />
                  </div>
                )}

                {showDgnl && showThpt && <div className="h-px w-full bg-slate-100"></div>}

                {/* Điểm Thi THPT */}
                {showThpt && (
                  <div>
                    <label className="block text-sm font-semibold text-indigo-900 mb-3 flex items-center gap-2">
                      <BookHeart className="w-4 h-4 text-indigo-600" /> Kỳ thi Tốt nghiệp THPT
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
                            placeholder="Điểm thi..."
                          />
                        </div>
                      ))}
                    </div>
                    {results.Y > 0 && (
                      <div className="mt-4 flex items-center justify-end gap-2 text-sm font-medium text-emerald-600">
                        <span>↳ Điểm quy đổi THPT (Thang 100):</span>
                        <span className="text-base font-bold">{results.Y.toFixed(2)}</span>
                      </div>
                    )}
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
                           max={CCQT_SCORE_MAX[state.loaiCCQT]}
                           value={state.diemCCQT} 
                           onChange={e => state.setDiemCCQT(clampScore(e.target.value, CCQT_SCORE_MAX[state.loaiCCQT]))}
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
          <CardSection title="3. Thành Tích & Ưu Tiên" icon={Award}>
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
                                 type="number" step="5" min="0" max="990"
                                 value={state.diemNgoaiNgu}
                                 onChange={e => state.setDiemNgoaiNgu(clampScore(e.target.value, ENGLISH_SCORE_MAX.TOEIC_LR))}
                                 className="w-full px-3 py-2 border border-slate-200 rounded-md focus:ring-2 focus:ring-indigo-600 text-sm"
                                 placeholder="VD: 785"
                               />
                             </div>
                             <div className="flex-1">
                               <label className="block text-xs font-medium text-slate-500 mb-1">Nói-Viết</label>
                               <input 
                                 type="number" step="5" min="0" max="400"
                                 value={state.diemNgoaiNgu2}
                                 onChange={e => state.setDiemNgoaiNgu2(clampScore(e.target.value, ENGLISH_SCORE_MAX.TOEIC_SW))}
                                 className="w-full px-3 py-2 border border-slate-200 rounded-md focus:ring-2 focus:ring-indigo-600 text-sm"
                                 placeholder="VD: 310"
                               />
                             </div>
                           </>
                         ) : (
                           <div className="flex-1">
                             <label className="block text-xs font-medium text-slate-500 mb-1">Điểm số</label>
                             <input 
                               type="number" step="0.1" min="0" max={ENGLISH_SCORE_MAX[state.loaiNgoaiNgu]}
                               value={state.diemNgoaiNgu}
                               onChange={e => state.setDiemNgoaiNgu(clampScore(e.target.value, ENGLISH_SCORE_MAX[state.loaiNgoaiNgu]))}
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

        {/* Right Column - Result */}
        <div className={`
          lg:block lg:w-96 lg:static
          ${showMobileResultModal ? 'fixed inset-0 z-[60] bg-slate-900/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in' : 'hidden'}
        `}>
          <div className={`
            w-full bg-white shadow-2xl relative flex flex-col overflow-hidden
            ${showMobileResultModal ? 'rounded-t-3xl sm:rounded-2xl max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-full sm:zoom-in-95' : 'rounded-2xl border border-indigo-200 sticky top-24'}
          `}>
            
            {showMobileResultModal && (
              <button onClick={() => setShowMobileResultModal(false)} className="absolute top-4 right-4 z-20 text-white/70 hover:text-white lg:hidden bg-black/20 rounded-full p-1.5">
                <X className="w-5 h-5" />
              </button>
            )}

            {/* Header */}
            <div className="p-6 bg-gradient-to-br from-indigo-700 to-indigo-900 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Calculator className="w-24 h-24" />
              </div>
              <h2 className="mb-1 text-lg font-medium text-indigo-100">Điểm xét tuyển</h2>
              <div className="text-5xl font-extrabold tracking-tight mb-2">
                {results.total.toFixed(2)} <span className="text-xl font-normal text-indigo-200">/ 100</span>
              </div>
            </div>

            {/* Breakdown */}
            <div className="p-6 space-y-6">
               <div>
                  <div className="mb-3 rounded-xl bg-indigo-50 p-3 text-sm text-indigo-900">
                    <div className="font-semibold">
                      {learningWeights
                        ? `ĐHL = ĐGNL x ${learningWeights.dgnl}% + THPT x ${learningWeights.thpt}% + Học bạ x ${learningWeights.hocBa}%`
                        : results.textFormula}
                    </div>
                    <div className="mt-2 flex justify-between font-bold">
                      <span>ĐHL</span>
                      <span>{results.dhl.toFixed(2)}</span>
                    </div>
                  </div>

                  {state.dtXetTuyen !== 'DT4' && (
                    <>
                      <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">Điểm học lực</h3>
                      <div className="space-y-2 text-sm">
                        {showDgnl && (
                          <div className="flex justify-between items-center text-slate-600">
                            <span>ĐGNL chuẩn hóa</span>
                            <span className="font-medium text-slate-800">{results.X.toFixed(2)}</span>
                          </div>
                        )}
                        {showThpt && (
                          <div className="flex justify-between items-center text-slate-600">
                            <span>THPT chuẩn hóa</span>
                            <span className="font-medium text-slate-800">{results.Y.toFixed(2)}</span>
                          </div>
                        )}
                        {showHocBa && (
                          <div className="flex justify-between items-center text-slate-600">
                            <span>Học bạ chuẩn hóa</span>
                            <span className="font-medium text-slate-800">{results.Z.toFixed(2)}</span>
                          </div>
                        )}
                      </div>
                    </>
                  )}
               </div>

               <div className="h-px w-full bg-slate-100"></div>

               <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Điểm cộng & Ưu tiên</h3>
                  <div className="space-y-4 text-sm">
                    {/* Điểm cộng */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-slate-600">
                        <span>Điểm cộng (Gốc)</span>
                        <span>+{results.dcGoc.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center bg-amber-50 p-2 rounded text-amber-900 font-medium border border-amber-100">
                        <span>Cộng thực nhận</span>
                        <span className="font-bold text-amber-700">+{results.dcThucNhan.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Ưu tiên */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-slate-600">
                        <span>Ưu tiên KV/ĐT (Gốc)</span>
                        <span>+{results.uuTien100.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center bg-emerald-50 p-2 rounded text-emerald-900 font-medium border border-emerald-100">
                        <span>Ưu tiên thực nhận</span>
                        <span className="font-bold text-emerald-700">+{results.uuTienThucNhan.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      <MobileScoreButton
        score={results.total}
        tone="indigo"
        onClick={() => setShowMobileResultModal(true)}
      />

    </div>

      {/* Modal Bảng Quy đổi */}
      {showConversionTable && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800">Bảng quy đổi Chứng chỉ Ngoại ngữ (UEL)</h3>
              <button onClick={() => setShowConversionTable(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse">
                  <thead>
                    <tr className="border-b-2 border-slate-200 text-slate-600">
                      <th className="px-4 py-2 font-medium">Điểm cộng</th>
                      <th className="px-4 py-2 font-medium">IELTS</th>
                      <th className="px-4 py-2 font-medium">Linguaskill B1</th>
                      <th className="px-4 py-2 font-medium">Linguaskill B2</th>
                      <th className="px-4 py-2 font-medium">TOEIC NĐ</th>
                      <th className="px-4 py-2 font-medium">TOEIC NV</th>
                      <th className="px-4 py-2 font-medium">TOEFL iBT</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {UEL_ENGLISH_BONUS.map((row) => {
                       const parts = row.desc.split('|').map(p => p.trim());
                       const getPart = (keyword) => {
                         const match = parts.find(p => p.includes(keyword));
                         if (!match) return '-';
                         return match.replace(keyword, '').replace(':', '').replace('≥', '').trim();
                       };

                       return (
                         <tr key={row.id} className="hover:bg-slate-50">
                           <td className="px-4 py-2 font-semibold text-blue-700 whitespace-nowrap">+{row.point.toFixed(1)}</td>
                           <td className="px-4 py-2 text-slate-700">{getPart('IELTS')}</td>
                           <td className="px-4 py-2 text-slate-700">{getPart('Linguaskill/B1')}</td>
                           <td className="px-4 py-2 text-slate-700">{getPart('Linguaskill/B2')}</td>
                           <td className="px-4 py-2 text-slate-700">{getPart('TOEIC NĐ')}</td>
                           <td className="px-4 py-2 text-slate-700">{getPart('TOEIC NV')}</td>
                           <td className="px-4 py-2 text-slate-700">{getPart('TOEFL iBT')}</td>
                         </tr>
                       );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Bảng Quy đổi CCQT */}
      {showCcqtConversionTable && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800">Bảng quy đổi Chứng chỉ Quốc tế ra Thang điểm 100</h3>
              <button onClick={() => setShowCcqtConversionTable(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-center border-collapse">
                  <thead>
                    <tr className="border-b-2 border-slate-200 text-slate-600">
                      <th className="px-4 py-2 font-medium">Điểm SAT</th>
                      <th className="px-4 py-2 font-medium">Điểm ACT</th>
                      <th className="px-4 py-2 font-medium">Điểm IB</th>
                      <th className="px-4 py-2 font-medium">Hạng A-Level</th>
                      <th className="px-4 py-2 font-medium">Quy đổi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {UEL_CCQT_TABLE.map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="px-4 py-2 text-slate-700">{row.sat || '-'}</td>
                        <td className="px-4 py-2 text-slate-700">{row.act || '-'}</td>
                        <td className="px-4 py-2 text-slate-700">{row.ib || '-'}</td>
                        <td className="px-4 py-2 text-slate-700">{row.aLevel || '-'}</td>
                        <td className="px-4 py-2 font-semibold text-blue-700">{row.point}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

    </>
  );
};
