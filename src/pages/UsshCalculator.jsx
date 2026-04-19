import { useState } from 'react';
import { useUsshCalculator } from '../hooks/useUsshCalculator';
import { CardSection } from '../components/common/CardSection';
import { Settings, BookOpen, PenTool, Award, Info, Calculator, X, Globe } from 'lucide-react';
import { KHU_VUC, DOI_TUONG } from '../constants/common';

export const UsshCalculator = () => {
  const { state, results } = useUsshCalculator();
  const [showMobileResultModal, setShowMobileResultModal] = useState(false);
  
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

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in duration-500 pb-28">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-emerald-900 tracking-tight flex items-center gap-3">
          <Globe className="w-8 h-8 text-emerald-700" />
          Máy tính điểm USSH 2026
        </h1>
        <p className="text-slate-500 mt-2">Phương thức Tổng hợp - ĐH KHXH&NV (Thang 100)</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column - Forms */}
        <div className="flex-1 space-y-6">
          
          {/* Học bạ */}
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
                      <td className="px-4 py-3 font-medium text-slate-700 whitespace-nowrap">
                        Môn {subjectIndex + 1}
                      </td>
                      {[0, 1, 2].map((yearIndex) => {
                        const cellIndex = subjectIndex * 3 + yearIndex;
                        return (
                          <td key={cellIndex} className="px-2 py-2">
                            <input
                              type="number" min="0" max="10" step="0.1"
                              value={state.hocBa[cellIndex]}
                              onChange={(e) => handleHocBaChange(cellIndex, e.target.value)}
                              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-600 text-center transition-colors border-slate-200 text-slate-900"
                              placeholder="0.0"
                            />
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
              {results.hb100 > 0 && (
                <div className="mt-4 flex gap-3 p-3 bg-emerald-50 rounded-lg text-sm items-center border border-emerald-100">
                   <Info className="w-5 h-5 text-emerald-600 shrink-0" />
                   <span className="text-emerald-900 font-medium">Đã quy đổi (thang 100): <strong className="text-emerald-700">{results.hb100.toFixed(2)}</strong></span>
                </div>
              )}
            </div>
          </CardSection>

          {/* Điểm Thi */}
          <CardSection title="2. Điểm Thi (ĐGNL & THPT)" icon={PenTool}>
            <div className="space-y-6">
              
              {/* Điểm thi ĐGNL */}
              <div>
                <label className="block text-sm font-semibold text-emerald-900 mb-2 flex items-center gap-2">
                  <Settings className="w-4 h-4 text-emerald-600" />
                  Kỳ thi Đánh giá Năng lực
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Điểm thi ĐGNL (tối đa 1200)</label>
                    <input
                      type="number" min="0" max="1200"
                      value={state.dgnl}
                      onChange={(e) => {
                         let val = e.target.value;
                         if (val !== '' && parseFloat(val) > 1200) val = '1200';
                         state.setDgnl(val);
                      }}
                      className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-600 font-medium text-lg"
                      placeholder="VD: 850"
                    />
                  </div>
                  {results.dgnl100 > 0 && (
                     <div className="flex gap-3 p-3 bg-emerald-50 rounded-lg text-sm items-center border border-emerald-100 mt-0 md:mt-6">
                        <Info className="w-5 h-5 text-emerald-600 shrink-0" />
                        <span className="text-emerald-900 font-medium">Đã quy đổi (thang 100): <strong className="text-emerald-700">{results.dgnl100.toFixed(2)}</strong></span>
                     </div>
                  )}
                </div>
              </div>

              <div className="h-px w-full bg-slate-100"></div>

              {/* Điểm Thi THPT */}
              <div>
                <label className="block text-sm font-semibold text-emerald-900 mb-3 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-600" />
                  Kỳ thi Tốt nghiệp THPT
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[0, 1, 2].map((idx) => (
                    <div key={`thpt-${idx}`}>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Môn {idx + 1}
                      </label>
                      <input
                        type="number" min="0" max="10" step="0.1"
                        value={state.thpt[idx]}
                        onChange={(e) => handleThptChange(idx, e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-600"
                        placeholder="Điểm thi..."
                      />
                    </div>
                  ))}
                </div>
                {results.thpt100 > 0 && (
                  <div className="mt-4 flex gap-3 p-3 bg-emerald-50 rounded-lg text-sm items-center border border-emerald-100">
                     <Info className="w-5 h-5 text-emerald-600 shrink-0" />
                     <span className="text-emerald-900 font-medium">Đã quy đổi (thang 100): <strong className="text-emerald-700">{results.thpt100.toFixed(2)}</strong></span>
                  </div>
                )}
              </div>

            </div>
          </CardSection>

          {/* Thành tích & Ưu tiên */}
          <CardSection title="3. Thành Tích & Ưu Tiên" icon={Award}>
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
                   <input 
                     type="number" min="0" max="10" step="0.1" 
                     value={state.thanhTich} 
                     onChange={e => {
                        let val = e.target.value;
                        if (val !== '' && parseFloat(val) > 10) val = '10';
                        state.setThanhTich(val);
                     }} 
                     className="w-full px-3 py-2 border border-slate-200 rounded-md focus:ring-2 focus:ring-emerald-600" 
                     placeholder="VD: 5"
                   />
                 </div>
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
            ${showMobileResultModal ? 'rounded-t-3xl sm:rounded-2xl max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-full sm:zoom-in-95' : 'rounded-2xl border border-emerald-200 sticky top-24'}
          `}>
            
            {showMobileResultModal && (
              <button onClick={() => setShowMobileResultModal(false)} className="absolute top-4 right-4 z-20 text-white/70 hover:text-white lg:hidden bg-black/20 rounded-full p-1.5">
                <X className="w-5 h-5" />
              </button>
            )}

            {/* Header */}
            <div className="p-6 bg-gradient-to-br from-emerald-700 to-emerald-900 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Calculator className="w-24 h-24" />
              </div>
              <h2 className="text-lg font-medium text-emerald-100 mb-1">Kết Quả (Max)</h2>
              <div className="text-5xl font-extrabold tracking-tight mb-2">
                {results.total.toFixed(2)} <span className="text-xl font-normal text-emerald-200">/ 100</span>
              </div>
            </div>

            {/* Breakdown */}
            <div className="p-6 space-y-6">
               <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">So sánh Kịch bản ĐHL</h3>
                  
                  <div className="space-y-3">
                    <div className={`p-3 rounded-xl border ${results.selectedScenario === 'all' ? 'bg-emerald-50 border-emerald-300 ring-1 ring-emerald-300' : 'bg-slate-50 border-slate-100 opacity-60'}`}>
                      <div className="text-xs font-semibold text-slate-500 mb-1">ĐHL Tổng (THPT 45% + ĐGNL 45% + HB 10%)</div>
                      <div className={`text-xl font-bold ${results.selectedScenario === 'all' ? 'text-emerald-700' : 'text-slate-600'}`}>
                        {results.dhlAll !== null ? results.dhlAll.toFixed(2) : '-'}
                      </div>
                    </div>
                    
                    <div className={`p-3 rounded-xl border ${results.selectedScenario === '1' ? 'bg-emerald-50 border-emerald-300 ring-1 ring-emerald-300' : 'bg-slate-50 border-slate-100 opacity-60'}`}>
                      <div className="text-xs font-semibold text-slate-500 mb-1">ĐHL 1 (THPT 90% + HB 10%)</div>
                      <div className={`text-xl font-bold ${results.selectedScenario === '1' ? 'text-emerald-700' : 'text-slate-600'}`}>
                        {results.dhl1 !== null ? results.dhl1.toFixed(2) : '-'}
                      </div>
                    </div>

                    <div className={`p-3 rounded-xl border ${results.selectedScenario === '2' ? 'bg-emerald-50 border-emerald-300 ring-1 ring-emerald-300' : 'bg-slate-50 border-slate-100 opacity-60'}`}>
                      <div className="text-xs font-semibold text-slate-500 mb-1">ĐHL 2 (ĐGNL 90% + HB 10%)</div>
                      <div className={`text-xl font-bold ${results.selectedScenario === '2' ? 'text-emerald-700' : 'text-slate-600'}`}>
                        {results.dhl2 !== null ? results.dhl2.toFixed(2) : '-'}
                      </div>
                    </div>
                  </div>
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
                      <div className="flex justify-between items-center bg-amber-50 p-2 rounded text-amber-900 font-medium">
                        <span>Cộng thực nhận</span>
                        <span className="font-bold">+{results.dcThucNhan.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Ưu tiên */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-slate-600">
                        <span>Ưu tiên KV/ĐT (Gốc)</span>
                        <span>+{results.uuTien100.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center bg-emerald-50 p-2 rounded text-emerald-900 font-medium">
                        <span>Ưu tiên thực nhận</span>
                        <span className="font-bold">+{results.uuTienThucNhan.toFixed(2)}</span>
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
          <div className="text-2xl font-extrabold text-emerald-700 leading-none">
            {results.total.toFixed(2)} <span className="text-sm font-normal text-slate-500">/ 100</span>
          </div>
        </div>
        <button 
          onClick={() => setShowMobileResultModal(true)}
          className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-semibold transition-colors shadow-md flex items-center gap-2"
        >
          Xem chi tiết
        </button>
      </div>

    </div>
  );
};
