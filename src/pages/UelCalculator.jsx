import { useState } from 'react';
import { useUelCalculator } from '../hooks/useUelCalculator';
import { CardSection } from '../components/common/CardSection';
import { Settings, BookOpen, PenTool, Award, Calculator, X, BookHeart, GraduationCap, Info } from 'lucide-react';
import { KHU_VUC, DOI_TUONG } from '../constants/common';
import { UEL_ENGLISH_BONUS, CCQT_TYPES, UEL_ENGLISH_CERT_TYPES, UEL_CCQT_TABLE } from '../constants/uel';

export const UelCalculator = () => {
  const { state, results } = useUelCalculator();
  const [showMobileResultModal, setShowMobileResultModal] = useState(false);
  const [showConversionTable, setShowConversionTable] = useState(false);
  const [showCcqtConversionTable, setShowCcqtConversionTable] = useState(false);

  const handleHocBaChange = (index, val) => {
    if (val !== '' && parseFloat(val) > 10) val = '10';
    const newHocBa = [...state.hocBa];
    newHocBa[index] = val;
    state.setHocBa(newHocBa);
  };

  const handleThptChange = (index, val) => {
    if (val !== '' && parseFloat(val) > 10) val = '10';
    const newThpt = [...state.thpt];
    newThpt[index] = val;
    state.setThpt(newThpt);
  };

  // Visibility logic
  const isChinhQuy = state.program === 'CHINH_QUY';
  const showHocBa = state.dtXetTuyen !== 'DT4';
  const showDgnl = (isChinhQuy && (state.dtXetTuyen === 'DT1' || state.dtXetTuyen === 'DT3')) || (!isChinhQuy && state.dtXetTuyen === 'DT1');
  const showThpt = (isChinhQuy && (state.dtXetTuyen === 'DT1' || state.dtXetTuyen === 'DT2')) || (!isChinhQuy && (state.dtXetTuyen === 'DT1' || state.dtXetTuyen === 'DT2'));
  const showCcqt = isChinhQuy && state.dtXetTuyen === 'DT4';

  return (
    <>
    <div className="max-w-7xl mx-auto animate-in fade-in duration-500 pb-28">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-indigo-900 tracking-tight flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-indigo-600" />
          Máy tính điểm UEL 2026
        </h1>
        <p className="text-slate-500 mt-2">Đại học Kinh tế - Luật (Thang 100)</p>
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
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600 text-center transition-colors border-slate-200 text-slate-900"
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
                <div className="mt-4 text-sm text-emerald-600 font-medium flex justify-end items-center gap-2 bg-emerald-50/50 p-2 rounded-lg border border-emerald-100/50">
                   <span>↳ Điểm quy đổi Học bạ (Thang 100):</span>
                   <span className="font-bold text-base">{results.Z.toFixed(2)}</span>
                </div>
              )}
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
                         let val = e.target.value;
                         if (val !== '' && parseFloat(val) > 1200) val = '1200';
                         state.setDgnl(val);
                      }}
                      className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600 font-medium text-lg"
                      placeholder="VD: 850"
                    />
                    {results.X > 0 && (
                      <div className="mt-2 text-sm text-emerald-600 font-medium flex justify-end items-center gap-2">
                        <span>↳ Điểm quy đổi (Thang 100):</span>
                        <span className="font-bold text-base">{results.X.toFixed(2)}</span>
                      </div>
                    )}
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
                            className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
                            placeholder="Điểm thi..."
                          />
                        </div>
                      ))}
                    </div>
                    {results.Y > 0 && (
                      <div className="mt-3 text-sm text-emerald-600 font-medium flex justify-end items-center gap-2 bg-emerald-50/50 p-2 rounded-lg border border-emerald-100/50">
                        <span>↳ Điểm quy đổi THPT (Thang 100):</span>
                        <span className="font-bold text-base">{results.Y.toFixed(2)}</span>
                      </div>
                    )}
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
                           type="text" 
                           value={state.diemCCQT} 
                           onChange={e => state.setDiemCCQT(e.target.value)}
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
               {results.dhl > 0 && (
                 <div className="mt-4 text-sm text-emerald-600 font-medium flex justify-end items-center gap-2 bg-emerald-50/50 p-2 rounded-lg border border-emerald-100/50">
                    <span>↳ Điểm quy đổi CCQT (Thang 100):</span>
                    <span className="font-bold text-base">{results.dhl.toFixed(2)}</span>
                 </div>
               )}
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
                                 onChange={e => state.setDiemNgoaiNgu(e.target.value)}
                                 className="w-full px-3 py-2 border border-slate-200 rounded-md focus:ring-2 focus:ring-indigo-600 text-sm"
                                 placeholder="VD: 785"
                               />
                             </div>
                             <div className="flex-1">
                               <label className="block text-xs font-medium text-slate-500 mb-1">Nói-Viết</label>
                               <input 
                                 type="number" step="5" min="0" max="400"
                                 value={state.diemNgoaiNgu2}
                                 onChange={e => state.setDiemNgoaiNgu2(e.target.value)}
                                 className="w-full px-3 py-2 border border-slate-200 rounded-md focus:ring-2 focus:ring-indigo-600 text-sm"
                                 placeholder="VD: 310"
                               />
                             </div>
                           </>
                         ) : (
                           <div className="flex-1">
                             <label className="block text-xs font-medium text-slate-500 mb-1">Điểm số</label>
                             <input 
                               type="number" step="0.1" min="0" max="990"
                               value={state.diemNgoaiNgu}
                               onChange={e => state.setDiemNgoaiNgu(e.target.value)}
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
              <h2 className="text-lg font-medium text-indigo-100 mb-1">Kết Quả ĐXT</h2>
              <div className="text-5xl font-extrabold tracking-tight mb-2">
                {results.total.toFixed(2)} <span className="text-xl font-normal text-indigo-200">/ 100</span>
              </div>
            </div>

            {/* Breakdown */}
            <div className="p-6 space-y-6">
               <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Công thức Điểm Học Lực</h3>
                  <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl">
                    <div className="text-indigo-900 font-medium mb-2">{results.textFormula}</div>
                    <div className="text-2xl font-bold text-indigo-700">{results.dhl.toFixed(2)}</div>
                  </div>
               </div>

               {state.dtXetTuyen !== 'DT4' && (
                 <>
                   <div className="h-px w-full bg-slate-100"></div>
                   <div>
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Điểm quy đổi (Thang 100)</h3>
                      <div className="space-y-2 text-sm">
                        {showDgnl && (
                          <div className="flex justify-between items-center text-slate-600">
                            <span>Đánh giá Năng lực (X)</span>
                            <span className="font-medium text-slate-800">{results.X.toFixed(2)}</span>
                          </div>
                        )}
                        {showThpt && (
                          <div className="flex justify-between items-center text-slate-600">
                            <span>Tốt nghiệp THPT (Y)</span>
                            <span className="font-medium text-slate-800">{results.Y.toFixed(2)}</span>
                          </div>
                        )}
                        {showHocBa && (
                          <div className="flex justify-between items-center text-slate-600">
                            <span>Học bạ THPT (Z)</span>
                            <span className="font-medium text-slate-800">{results.Z.toFixed(2)}</span>
                          </div>
                        )}
                      </div>
                   </div>
                 </>
               )}

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

      {/* Floating Bar for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 pb-safe shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.1)] z-40 lg:hidden flex justify-between items-center animate-in slide-in-from-bottom-full">
        <div>
          <div className="text-xs text-slate-500 font-medium mb-0.5">Tổng điểm xét tuyển</div>
          <div className="text-2xl font-extrabold text-indigo-700 leading-none">
            {results.total.toFixed(2)} <span className="text-sm font-normal text-slate-500">/ 100</span>
          </div>
        </div>
        <button 
          onClick={() => setShowMobileResultModal(true)}
          className="px-6 py-3 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl font-semibold transition-colors shadow-md flex items-center gap-2"
        >
          Xem chi tiết
        </button>
      </div>

    </div>

      {/* Modal Bảng Quy đổi */}
      {showConversionTable && (
        <div className="fixed inset-0 z-[70] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col animate-in zoom-in-95">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-800">Bảng quy đổi Chứng chỉ Ngoại ngữ (UEL)</h3>
              <button onClick={() => setShowConversionTable(false)} className="text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 p-2 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-700">
                    <tr>
                      <th className="px-4 py-3 font-semibold rounded-tl-lg">Điểm cộng</th>
                      <th className="px-4 py-3 font-semibold border-l border-white/50">IELTS</th>
                      <th className="px-4 py-3 font-semibold border-l border-white/50">Linguaskill B1</th>
                      <th className="px-4 py-3 font-semibold border-l border-white/50">Linguaskill B2</th>
                      <th className="px-4 py-3 font-semibold border-l border-white/50">TOEIC NĐ</th>
                      <th className="px-4 py-3 font-semibold border-l border-white/50">TOEIC NV</th>
                      <th className="px-4 py-3 font-semibold border-l border-white/50 rounded-tr-lg">TOEFL iBT</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {UEL_ENGLISH_BONUS.map((row, i) => {
                       const parts = row.desc.split('|').map(p => p.trim());
                       const getPart = (keyword) => {
                         const match = parts.find(p => p.includes(keyword));
                         if (!match) return '-';
                         return match.replace(keyword, '').replace(':', '').replace('≥', '').trim();
                       };

                       return (
                         <tr key={row.id} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                           <td className="px-4 py-3 font-bold text-indigo-700 whitespace-nowrap">+{row.point.toFixed(1)}</td>
                           <td className="px-4 py-3 border-l border-slate-100">{getPart('IELTS')}</td>
                           <td className="px-4 py-3 border-l border-slate-100">{getPart('Linguaskill/B1')}</td>
                           <td className="px-4 py-3 border-l border-slate-100">{getPart('Linguaskill/B2')}</td>
                           <td className="px-4 py-3 border-l border-slate-100">{getPart('TOEIC NĐ')}</td>
                           <td className="px-4 py-3 border-l border-slate-100">{getPart('TOEIC NV')}</td>
                           <td className="px-4 py-3 border-l border-slate-100">{getPart('TOEFL iBT')}</td>
                         </tr>
                       );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="p-4 border-t border-slate-100 bg-slate-50 text-right rounded-b-2xl">
              <button 
                onClick={() => setShowConversionTable(false)}
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Bảng Quy đổi CCQT */}
      {showCcqtConversionTable && (
        <div className="fixed inset-0 z-[70] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col animate-in zoom-in-95">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-800">Bảng quy đổi Chứng chỉ Quốc tế ra Thang điểm 100</h3>
              <button onClick={() => setShowCcqtConversionTable(false)} className="text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 p-2 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-sm text-center">
                  <thead className="bg-slate-100 text-slate-700 sticky top-0 shadow-sm">
                    <tr>
                      <th className="px-4 py-3 font-semibold border-b border-slate-200">Điểm SAT</th>
                      <th className="px-4 py-3 font-semibold border-b border-slate-200 border-l">Điểm ACT</th>
                      <th className="px-4 py-3 font-semibold border-b border-slate-200 border-l">Điểm IB</th>
                      <th className="px-4 py-3 font-semibold border-b border-slate-200 border-l">Hạng A-Level</th>
                      <th className="px-4 py-3 font-bold text-indigo-700 bg-indigo-50 border-b border-indigo-100 border-l">Quy đổi (100)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {UEL_CCQT_TABLE.map((row, i) => (
                      <tr key={i} className={i % 2 === 0 ? 'bg-white hover:bg-slate-50' : 'bg-slate-50/50 hover:bg-slate-100/50'}>
                        <td className="px-4 py-2 font-medium text-slate-700">{row.sat || '-'}</td>
                        <td className="px-4 py-2 font-medium text-slate-700 border-l border-slate-100">{row.act || '-'}</td>
                        <td className="px-4 py-2 font-medium text-slate-700 border-l border-slate-100">{row.ib || '-'}</td>
                        <td className="px-4 py-2 font-medium text-slate-700 border-l border-slate-100">{row.aLevel || '-'}</td>
                        <td className="px-4 py-2 font-bold text-indigo-700 bg-indigo-50/30 border-l border-indigo-100">{row.point}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="p-4 border-t border-slate-100 bg-slate-50 text-right rounded-b-2xl">
              <button 
                onClick={() => setShowCcqtConversionTable(false)}
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
};
