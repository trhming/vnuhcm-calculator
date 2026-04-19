import { useState } from 'react';
import { useHcmutCalculator } from '../hooks/useHcmutCalculator';
import { CardSection } from '../components/common/CardSection';
import { Settings, BookOpen, PenTool, Award, Info, Calculator, CheckCircle2, X, Building2 } from 'lucide-react';
import { KHU_VUC, DOI_TUONG } from '../constants/common';
import { DOI_TUONG_HCMUT, INTL_CERT_TYPES } from '../constants/hcmut';

export const HcmutCalculator = () => {
  const { state, results } = useHcmutCalculator();
  const [showMobileResultModal, setShowMobileResultModal] = useState(false);
  const [showConversionTable, setShowConversionTable] = useState(false);
  
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
        <h1 className="text-3xl font-extrabold text-blue-900 tracking-tight flex items-center gap-3">
          <Building2 className="w-8 h-8 text-blue-800" />
          Máy tính điểm HCMUT 2026
        </h1>
        <p className="text-slate-500 mt-2">Phương thức Tổng hợp - Đại học Bách Khoa (Thang 100)</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column - Forms */}
        <div className="flex-1 space-y-6">
          
          {/* Thông tin Dự tuyển */}
          <CardSection title="1. Thông tin Dự tuyển" icon={Settings}>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Đối tượng Dự tuyển</label>
                <select 
                  value={state.doiTuongUT}
                  onChange={e => state.setDoiTuongUT(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-800 bg-white shadow-sm font-medium text-slate-800"
                >
                  {DOI_TUONG_HCMUT.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>

              {/* Dynamic inputs based on doiTuong */}
              {state.doiTuongUT === '2.1' && (
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg animate-in slide-in-from-top-2">
                  <label className="block text-sm font-semibold text-blue-900 mb-3">Điểm Kỳ thi ĐGNL 2026 (4 phần thi)</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-blue-800 mb-1">Tiếng Việt</label>
                      <input type="number" min="0" max="300" value={state.dgnlTv} onChange={e => { let val = e.target.value; if (val !== '' && parseFloat(val) > 300) val = '300'; state.setDgnlTv(val); }} className="w-full px-3 py-2 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-800" placeholder="VD: 300" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-blue-800 mb-1">Tiếng Anh</label>
                      <input type="number" min="0" max="300" value={state.dgnlTa} onChange={e => { let val = e.target.value; if (val !== '' && parseFloat(val) > 300) val = '300'; state.setDgnlTa(val); }} className="w-full px-3 py-2 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-800" placeholder="VD: 300" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-blue-800 mb-1">Toán <span className="font-bold">(x2)</span></label>
                      <input type="number" min="0" max="300" value={state.dgnlToan} onChange={e => { let val = e.target.value; if (val !== '' && parseFloat(val) > 300) val = '300'; state.setDgnlToan(val); }} className="w-full px-3 py-2 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-800" placeholder="VD: 300" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-blue-800 mb-1">Tư duy khoa học</label>
                      <input type="number" min="0" max="300" value={state.dgnlKh} onChange={e => { let val = e.target.value; if (val !== '' && parseFloat(val) > 300) val = '300'; state.setDgnlKh(val); }} className="w-full px-3 py-2 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-800" placeholder="VD: 300" />
                    </div>
                  </div>
                  <div className="mt-3 text-sm text-blue-800 font-medium">
                    Tổng điểm: {(parseFloat(state.dgnlTv)||0) + (parseFloat(state.dgnlTa)||0) + ((parseFloat(state.dgnlToan)||0)*2) + (parseFloat(state.dgnlKh)||0)} / 1500
                  </div>
                </div>
              )}

              {state.doiTuongUT === '2.4' && (
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg animate-in slide-in-from-top-2">
                  <label className="block text-sm font-semibold text-blue-900 mb-2">Chứng chỉ Quốc tế</label>
                  <div className="flex gap-3">
                    <select
                      value={state.intlCertType}
                      onChange={e => state.setIntlCertType(e.target.value)}
                      className="px-3 py-2 border border-slate-300 rounded-md bg-white focus:ring-2 focus:ring-blue-800"
                    >
                      {INTL_CERT_TYPES.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                    {state.intlCertType === 'ALEVEL' ? (
                       <select 
                          value={state.intlCertScore} onChange={e => state.setIntlCertScore(e.target.value)}
                          className="flex-1 px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-800 font-bold text-lg"
                       >
                         <option value="">Chọn loại</option>
                         <option value="A*">A*</option>
                         <option value="A">A</option>
                         <option value="B">B</option>
                         <option value="C">C</option>
                       </select>
                    ) : (
                       <input
                        type="number" min="0"
                        value={state.intlCertScore} onChange={e => state.setIntlCertScore(e.target.value)}
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-800 font-bold text-lg"
                        placeholder="Nhập điểm CC..."
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardSection>

          {/* Học bạ */}
          <CardSection title="2. Điểm Học Bạ" icon={BookOpen}>
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
                    <tr key={`subject-${subjectIndex}`} className={subjectIndex === 0 ? "bg-blue-50/50" : ""}>
                      <td className="px-4 py-3 font-medium text-slate-700 whitespace-nowrap">
                        Môn {subjectIndex + 1} {subjectIndex === 0 && <span className="text-blue-700 font-bold ml-1">(Toán x2)</span>}
                      </td>
                      {[0, 1, 2].map((yearIndex) => {
                        const cellIndex = subjectIndex * 3 + yearIndex;
                        return (
                          <td key={cellIndex} className="px-2 py-2">
                            <input
                              type="number" min="0" max="10" step="0.1"
                              value={state.hocBa[cellIndex]}
                              onChange={(e) => handleHocBaChange(cellIndex, e.target.value)}
                              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-800 text-center transition-colors border-slate-200 text-slate-900 ${subjectIndex === 0 ? "bg-white" : ""}`}
                              placeholder="0.0"
                            />
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-4 flex gap-3 p-3 bg-slate-50 rounded-lg text-sm items-center border border-slate-100">
                 <Info className="w-5 h-5 text-slate-500 shrink-0" />
                 <span className="text-slate-700">Điểm Học bạ Quy đổi = [(TB Toán x 2) + TB Môn 2 + TB Môn 3] / 4 * 10 = <strong className="text-blue-800">{results.diemHbQuyDoi.toFixed(2)}</strong></span>
              </div>
            </div>
          </CardSection>

          {/* Điểm Thi THPT */}
          <CardSection title="3. Điểm Thi THPT" icon={PenTool}>
             <div className="space-y-4">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {[0, 1].map((idx) => (
                   <div key={`thpt-${idx}`}>
                     <label className="block text-sm font-medium text-slate-700 mb-1">
                       Môn {idx + 1} {idx === 0 && <span className="text-blue-700 font-bold">(Toán x2)</span>}
                     </label>
                     <input
                       type="number" min="0" max="10" step="0.1"
                       value={state.thpt[idx]}
                       onChange={(e) => handleThptChange(idx, e.target.value)}
                       className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-800"
                       placeholder="Điểm thi..."
                     />
                   </div>
                 ))}
                 
                 {/* Môn 3 */}
                 <div className="col-span-1 md:col-span-3 border-t border-slate-100 pt-4 mt-2">
                    <label className="block text-sm font-medium text-slate-700 mb-3">Môn 3</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <input
                           type="number" min="0" max="10" step="0.1"
                           value={state.thpt[2]}
                           onChange={(e) => handleThptChange(2, e.target.value)}
                           className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-800 bg-white"
                           placeholder="Điểm thi THPT..."
                        />
                      </div>
                      
                      <div className="space-y-3">
                         <div className="flex items-center gap-2">
                           <input 
                             type="checkbox" id="isNgoaiNgu"
                             checked={state.isNgoaiNgu}
                             onChange={(e) => state.setIsNgoaiNgu(e.target.checked)}
                             className="rounded text-blue-700 focus:ring-blue-800 w-4 h-4 cursor-pointer"
                           />
                           <label htmlFor="isNgoaiNgu" className="text-sm font-medium text-slate-700 cursor-pointer select-none">Là môn Ngoại ngữ?</label>
                           <button 
                             type="button" 
                             onClick={() => setShowConversionTable(true)}
                             className="text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline ml-auto"
                           >
                             Bảng quy đổi
                           </button>
                         </div>

                         {state.isNgoaiNgu && (
                           <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 animate-in fade-in">
                             <select
                               value={state.ngoaiNguType}
                               onChange={(e) => state.setNgoaiNguType(e.target.value)}
                               className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white focus:ring-2 focus:ring-blue-800"
                             >
                               <option value="IELTS">IELTS</option>
                               <option value="TOEFL">TOEFL iBT</option>
                               <option value="PTE">PTE Academic</option>
                               <option value="TOEIC">TOEIC (4 Kỹ năng)</option>
                             </select>
                             
                             {state.ngoaiNguType === 'TOEIC' ? (
                               <div className="flex gap-2">
                                  <input
                                    type="number" min="0"
                                    value={state.toeicLr} onChange={e => state.setToeicLr(e.target.value)}
                                    className="w-1/2 px-3 py-2 text-sm border border-slate-300 rounded-md" placeholder="Nghe Đọc..."
                                  />
                                  <input
                                    type="number" min="0"
                                    value={state.toeicSw} onChange={e => state.setToeicSw(e.target.value)}
                                    className="w-1/2 px-3 py-2 text-sm border border-slate-300 rounded-md" placeholder="Nói Viết..."
                                  />
                               </div>
                             ) : (
                               <input
                                 type="number" min="0" step="0.1"
                                 value={state.diemNgoaiNgu}
                                 onChange={(e) => state.setDiemNgoaiNgu(e.target.value)}
                                 className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md"
                                 placeholder={`Điểm ${state.ngoaiNguType}...`}
                               />
                             )}

                             {state.ngoaiNguType && (results.diemNgoaiNguQuyDoi > 0) && (
                               <div className="text-xs font-bold text-emerald-700 flex items-center gap-1 bg-emerald-50 p-2 rounded">
                                 <CheckCircle2 className="w-4 h-4" />
                                 Quy đổi: {results.diemNgoaiNguQuyDoi} / 10
                               </div>
                             )}
                           </div>
                         )}
                      </div>
                    </div>
                 </div>
               </div>
               
               <div className="mt-4 flex gap-3 p-3 bg-slate-50 rounded-lg text-sm items-center border border-slate-100">
                  <Info className="w-5 h-5 text-slate-500 shrink-0" />
                  <span className="text-slate-700">Điểm THPT Quy đổi = [(Toán x 2) + Môn 2 + Môn 3] / 4 * 10 = <strong className="text-blue-800">{results.diemThptQuyDoi.toFixed(2)}</strong></span>
               </div>
             </div>
          </CardSection>

          {/* Thành tích & Ưu tiên */}
          <CardSection title="4. Thành Tích & Ưu Tiên" icon={Award}>
            <div className="space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-[13fr_14fr] gap-6">
                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-2">Khu vực</label>
                   <select 
                     value={state.kv} onChange={e => state.setKv(e.target.value)}
                     className="w-full px-3 py-2 border border-slate-200 rounded-md focus:ring-2 focus:ring-blue-800"
                   >
                     {KHU_VUC.map(k => <option key={k.id} value={k.id}>{k.name}</option>)}
                   </select>
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-2">Đối tượng (Chính sách)</label>
                   <select 
                     value={state.dt} onChange={e => state.setDt(e.target.value)}
                     className="w-full px-3 py-2 border border-slate-200 rounded-md focus:ring-2 focus:ring-blue-800"
                   >
                     {DOI_TUONG.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                   </select>
                 </div>
               </div>

               <div className="border-t border-slate-100 pt-5">
                 <h4 className="text-sm font-semibold text-slate-800 mb-3">Điểm cộng thành tích (Max 10)</h4>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <div>
                     <label className="block text-xs text-slate-500 mb-1">Điểm thưởng (Tối đa 10)</label>
                     <input type="number" min="0" max="10" step="0.1" value={state.thuong} onChange={e => state.setThuong(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-md focus:ring-2 focus:ring-blue-800" />
                   </div>
                   <div>
                     <label className="block text-xs text-slate-500 mb-1">Xét thưởng (Tối đa 5)</label>
                     <input type="number" min="0" max="5" step="0.1" value={state.xetThuong} onChange={e => state.setXetThuong(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-md focus:ring-2 focus:ring-blue-800" />
                   </div>
                   <div>
                     <label className="block text-xs text-slate-500 mb-1">Khuyến khích (Tối đa 5)</label>
                     <input type="number" min="0" max="5" step="0.1" value={state.khuyenKhich} onChange={e => state.setKhuyenKhich(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-md focus:ring-2 focus:ring-blue-800" />
                   </div>
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
            ${showMobileResultModal ? 'rounded-t-3xl sm:rounded-2xl max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-full sm:zoom-in-95' : 'rounded-2xl border border-blue-200 sticky top-24'}
          `}>
            
            {showMobileResultModal && (
              <button onClick={() => setShowMobileResultModal(false)} className="absolute top-4 right-4 z-20 text-white/70 hover:text-white lg:hidden bg-black/20 rounded-full p-1.5">
                <X className="w-5 h-5" />
              </button>
            )}

            {/* Header */}
            <div className="p-6 bg-gradient-to-br from-blue-800 to-slate-900 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Calculator className="w-24 h-24" />
              </div>
              <h2 className="text-lg font-medium text-blue-100 mb-1">Kết Quả</h2>
              <div className="text-5xl font-extrabold tracking-tight mb-2">
                {results.total.toFixed(2)} <span className="text-xl font-normal text-blue-200">/ 100</span>
              </div>
            </div>

            {/* Breakdown */}
            <div className="p-6 space-y-6">
               <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Điểm Học Lực (Chưa cộng)</h3>
                  <div className="text-3xl font-bold text-slate-800">{results.diemHL.toFixed(2)}</div>
                  
                  <div className="mt-3 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Năng lực ({(state.wNL*100).toFixed(0)}%)</span>
                      <span className="font-semibold">{results.diemNangLuc.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">THPT Quy đổi ({(state.wTHPT*100).toFixed(0)}%)</span>
                      <span className="font-semibold">{results.diemThptQuyDoi.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Học bạ Quy đổi ({(state.wHB*100).toFixed(0)}%)</span>
                      <span className="font-semibold">{results.diemHbQuyDoi.toFixed(2)}</span>
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
                        <span>+{results.tongCongGoc.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center bg-amber-50 p-2 rounded text-amber-900 font-medium">
                        <span>Cộng thực nhận</span>
                        <span className="font-bold">+{results.congThucNhan.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Ưu tiên */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-slate-600">
                        <span>Ưu tiên KV/ĐT (Gốc)</span>
                        <span>+{results.uuTienQuyDoi.toFixed(2)}</span>
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
          <div className="text-2xl font-extrabold text-blue-800 leading-none">
            {results.total.toFixed(2)} <span className="text-sm font-normal text-slate-500">/ 100</span>
          </div>
        </div>
        <button 
          onClick={() => setShowMobileResultModal(true)}
          className="px-6 py-3 bg-blue-800 hover:bg-blue-900 text-white rounded-xl font-semibold transition-colors shadow-md flex items-center gap-2"
        >
          Xem chi tiết
        </button>
      </div>

      {/* Modal Bảng Quy Đổi Ngoại Ngữ HCMUT */}
      {showConversionTable && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800">Bảng Quy Đổi Ngoại Ngữ HCMUT</h3>
              <button onClick={() => setShowConversionTable(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <h4 className="font-bold text-blue-800 mb-3 text-center bg-blue-50 py-2 rounded-lg">IELTS</h4>
                  <table className="w-full text-sm text-center border-collapse">
                    <thead>
                      <tr className="border-b-2 border-slate-200 text-slate-600">
                        <th className="py-2 font-medium">Band</th>
                        <th className="py-2 font-medium">Quy đổi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr className="hover:bg-slate-50"><td className="py-2 text-slate-700">≥ 8.0</td><td className="py-2 font-semibold text-blue-700">10.0</td></tr>
                      <tr className="hover:bg-slate-50"><td className="py-2 text-slate-700">7.5</td><td className="py-2 font-semibold text-blue-700">9.5</td></tr>
                      <tr className="hover:bg-slate-50"><td className="py-2 text-slate-700">7.0</td><td className="py-2 font-semibold text-blue-700">9.0</td></tr>
                      <tr className="hover:bg-slate-50"><td className="py-2 text-slate-700">6.5</td><td className="py-2 font-semibold text-blue-700">8.5</td></tr>
                      <tr className="hover:bg-slate-50"><td className="py-2 text-slate-700">6.0</td><td className="py-2 font-semibold text-blue-700">8.0</td></tr>
                    </tbody>
                  </table>
                </div>
                <div>
                  <h4 className="font-bold text-emerald-800 mb-3 text-center bg-emerald-50 py-2 rounded-lg">TOEFL iBT</h4>
                  <table className="w-full text-sm text-center border-collapse">
                    <thead>
                      <tr className="border-b-2 border-slate-200 text-slate-600">
                        <th className="py-2 font-medium">Điểm</th>
                        <th className="py-2 font-medium">Quy đổi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr className="hover:bg-slate-50"><td className="py-2 text-slate-700">≥ 110</td><td className="py-2 font-semibold text-blue-700">10.0</td></tr>
                      <tr className="hover:bg-slate-50"><td className="py-2 text-slate-700">102 - 109</td><td className="py-2 font-semibold text-blue-700">9.5</td></tr>
                      <tr className="hover:bg-slate-50"><td className="py-2 text-slate-700">94 - 101</td><td className="py-2 font-semibold text-blue-700">9.0</td></tr>
                      <tr className="hover:bg-slate-50"><td className="py-2 text-slate-700">79 - 93</td><td className="py-2 font-semibold text-blue-700">8.5</td></tr>
                      <tr className="hover:bg-slate-50"><td className="py-2 text-slate-700">60 - 78</td><td className="py-2 font-semibold text-blue-700">8.0</td></tr>
                    </tbody>
                  </table>
                </div>
                <div>
                  <h4 className="font-bold text-indigo-800 mb-3 text-center bg-indigo-50 py-2 rounded-lg">PTE Academic</h4>
                  <table className="w-full text-sm text-center border-collapse">
                    <thead>
                      <tr className="border-b-2 border-slate-200 text-slate-600">
                        <th className="py-2 font-medium">Điểm</th>
                        <th className="py-2 font-medium">Quy đổi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr className="hover:bg-slate-50"><td className="py-2 text-slate-700">≥ 79</td><td className="py-2 font-semibold text-blue-700">10.0</td></tr>
                      <tr className="hover:bg-slate-50"><td className="py-2 text-slate-700">71 - 78</td><td className="py-2 font-semibold text-blue-700">9.5</td></tr>
                      <tr className="hover:bg-slate-50"><td className="py-2 text-slate-700">63 - 70</td><td className="py-2 font-semibold text-blue-700">9.0</td></tr>
                      <tr className="hover:bg-slate-50"><td className="py-2 text-slate-700">55 - 62</td><td className="py-2 font-semibold text-blue-700">8.5</td></tr>
                      <tr className="hover:bg-slate-50"><td className="py-2 text-slate-700">47 - 54</td><td className="py-2 font-semibold text-blue-700">8.0</td></tr>
                    </tbody>
                  </table>
                </div>
                <div>
                  <h4 className="font-bold text-amber-800 mb-3 text-center bg-amber-50 py-2 rounded-lg">TOEIC</h4>
                  <table className="w-full text-sm text-center border-collapse">
                    <thead>
                      <tr className="border-b-2 border-slate-200 text-slate-600">
                        <th className="py-2 font-medium">L&R + S&W</th>
                        <th className="py-2 font-medium">Quy đổi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr className="hover:bg-slate-50"><td className="py-2 text-slate-700">≥ 905 + 390</td><td className="py-2 font-semibold text-blue-700">10.0</td></tr>
                      <tr className="hover:bg-slate-50"><td className="py-2 text-slate-700">835 + 380</td><td className="py-2 font-semibold text-blue-700">9.5</td></tr>
                      <tr className="hover:bg-slate-50"><td className="py-2 text-slate-700">785 + 360</td><td className="py-2 font-semibold text-blue-700">9.0</td></tr>
                      <tr className="hover:bg-slate-50"><td className="py-2 text-slate-700">685 + 330</td><td className="py-2 font-semibold text-blue-700">8.5</td></tr>
                      <tr className="hover:bg-slate-50"><td className="py-2 text-slate-700">570 + 310</td><td className="py-2 font-semibold text-blue-700">8.0</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

const Building2Icon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18" />
    <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
    <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
    <path d="M10 6h4" />
    <path d="M10 10h4" />
    <path d="M10 14h4" />
    <path d="M10 18h4" />
  </svg>
);
