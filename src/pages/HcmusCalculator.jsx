import { useState } from 'react';
import { useHcmusCalculator } from '../hooks/useHcmusCalculator';
import { CardSection } from '../components/hcmus/CardSection';
import { Settings, BookOpen, PenTool, Award, Info, Calculator, AlertTriangle, CheckCircle2, X } from 'lucide-react';
import { KHU_VUC, DOI_TUONG, NGOAI_NGU_CONVERSION } from '../constants/data';

export const HcmusCalculator = () => {
  const { state, results } = useHcmusCalculator();
  const [showConversionTable, setShowConversionTable] = useState(false);
  const [showMobileResultModal, setShowMobileResultModal] = useState(false);
  
  const handleHocBaChange = (index, val) => {
    const newHocBa = [...state.hocBa];
    newHocBa[index] = val;
    state.setHocBa(newHocBa);
  };

  const handleThptChange = (index, val) => {
    const newThpt = [...state.thpt];
    newThpt[index] = val;
    state.setThpt(newThpt);
  };

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in duration-500 pb-28">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-blue-900 tracking-tight flex items-center gap-3">
          <Calculator className="w-8 h-8 text-blue-700" />
          Máy tính điểm HCMUS 2026
        </h1>
        <p className="text-slate-500 mt-2">Phương thức 2: Kết hợp nhiều tiêu chí - Đại học Khoa học Tự nhiên</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column - Forms */}
        <div className="flex-1 space-y-6">
          
          {/* Trọng số */}
          <CardSection title="1. Trọng số (W)" icon={Settings}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-4">
                  Nhánh 1 (THPT + Học bạ)
                </label>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-slate-500">w1 (THPT)</span>
                      <span className="text-sm font-bold text-blue-700">{state.w1.toFixed(2)}</span>
                    </div>
                    <input 
                      type="range" min="0.7" max="0.9" step="0.01" 
                      value={state.w1} onChange={(e) => state.setW1(parseFloat(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-700"
                    />
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg flex justify-between items-center">
                    <span className="text-sm font-medium text-blue-900">w2 (Học bạ) = 1 - w1</span>
                    <span className="font-bold text-blue-700">{(1 - state.w1).toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-4">
                  Nhánh 2 (ĐGNL + Học bạ)
                </label>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-slate-500">w3 (ĐGNL)</span>
                      <span className="text-sm font-bold text-blue-700">{state.w3.toFixed(2)}</span>
                    </div>
                    <input 
                      type="range" min="0.7" max="0.9" step="0.01" 
                      value={state.w3} onChange={(e) => state.setW3(parseFloat(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-700"
                    />
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg flex justify-between items-center">
                    <span className="text-sm font-medium text-blue-900">w4 (Học bạ) = 1 - w3</span>
                    <span className="font-bold text-blue-700">{(1 - state.w3).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardSection>

          {/* Học bạ */}
          <CardSection title="2. Điểm Học Bạ" icon={BookOpen}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-4 py-3 rounded-tl-lg font-semibold">Môn</th>
                    <th className="px-4 py-3 font-semibold text-center">Lớp 10</th>
                    <th className="px-4 py-3 font-semibold text-center">Lớp 11</th>
                    <th className="px-4 py-3 font-semibold text-center">Lớp 12</th>
                    <th className="px-2 sm:px-4 py-3 rounded-tr-lg font-semibold text-center w-28 sm:w-32">Ghi chú</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[0, 1, 2].map((subjectIndex) => {
                    const p10_raw = state.hocBa[subjectIndex * 3];
                    const p11_raw = state.hocBa[subjectIndex * 3 + 1];
                    const p12_raw = state.hocBa[subjectIndex * 3 + 2];
                    
                    const isFormTouched = state.hocBa.some(val => val !== '');
                    const isMissing10 = p10_raw === '' && p11_raw !== '' && p12_raw !== '';
                    
                    let rowNote = "";
                    let noteClass = "";
                    if (isFormTouched) {
                      if (p11_raw === '' || p12_raw === '' || (p10_raw === '' && !isMissing10)) {
                        rowNote = "Thiếu điểm";
                        noteClass = "text-red-500 font-semibold";
                      } else if (isMissing10) {
                        rowNote = "Tự điền Lớp 10";
                        noteClass = "text-amber-600 font-semibold";
                      } else {
                        rowNote = "Hợp lệ";
                        noteClass = "text-emerald-600";
                      }
                    }

                    return (
                    <tr key={`subject-${subjectIndex}`}>
                      <td className="px-4 py-3 font-medium text-slate-700 whitespace-nowrap">Môn {subjectIndex + 1}</td>
                      {[0, 1, 2].map((yearIndex) => {
                        const cellIndex = subjectIndex * 3 + yearIndex;
                        const cellIsMissing10 = yearIndex === 0 && isMissing10;
                        const displayVal = state.hocBa[cellIndex] !== '' ? state.hocBa[cellIndex] : (cellIsMissing10 ? results.interpolatedHocBa[cellIndex] : '');
                        const isThieuDiemCell = isFormTouched && state.hocBa[cellIndex] === '' && !cellIsMissing10;

                        return (
                          <td key={cellIndex} className="px-2 py-2">
                            <input
                              type="number" min="0" max="10" step="0.1"
                              value={displayVal}
                              onChange={(e) => handleHocBaChange(cellIndex, e.target.value)}
                              className={`w-full px-2 sm:px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-center transition-colors
                                ${cellIsMissing10 ? 'border-amber-300 text-amber-600 bg-amber-50 font-semibold' : 
                                  isThieuDiemCell ? 'border-red-300 bg-red-50 text-slate-900' : 'border-slate-200 text-slate-900'}
                              `}
                              placeholder="0.0"
                              title={cellIsMissing10 ? "Điểm nội suy từ lớp 11 và 12" : ""}
                            />
                          </td>
                        );
                      })}
                      <td className="px-2 sm:px-3 py-2 text-center text-xs sm:text-sm w-28 sm:w-32 leading-tight">
                        <span className={noteClass}>{rowNote}</span>
                      </td>
                    </tr>
                  )})}
                </tbody>
                <tfoot>
                  <tr className="bg-blue-50">
                    <td colSpan="5" className="px-4 py-3 text-center text-blue-900 font-medium rounded-b-lg">
                      Tổng TB Học Bạ (Quy đổi) = <span className="font-bold">{results.tongHocBa.toFixed(2)}</span> / 30
                    </td>
                  </tr>
                </tfoot>
              </table>
              {results.hocBaStatus === 3 && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <div className="text-sm text-red-800">
                    <strong>CẢNH BÁO:</strong> Hồ sơ không hợp lệ do thiếu điểm Lớp 11 hoặc Lớp 12. Điểm xét tuyển = 0.
                  </div>
                </div>
              )}
            </div>
          </CardSection>

          {/* Điểm Thi */}
          <CardSection title="3. Điểm Thi" icon={PenTool}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* THPT */}
              <div className="space-y-4">
                <h4 className="font-semibold text-slate-800">Kỳ thi THPT 2026</h4>
                <div className="space-y-3">
                  {[0, 1].map((idx) => (
                    <div key={`thpt-${idx}`} className="flex items-center gap-3">
                      <label className="text-sm text-slate-600 w-16">Môn {idx + 1}</label>
                      <input
                        type="number" min="0" max="10" step="0.1"
                        value={state.thpt[idx]}
                        onChange={(e) => handleThptChange(idx, e.target.value)}
                        className="flex-1 px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Điểm thi..."
                      />
                    </div>
                  ))}
                  
                  {/* Môn 3 (Ngoại Ngữ) */}
                  <div className="p-3 border border-slate-200 rounded-xl bg-slate-50 space-y-3">
                    <div className="flex items-center gap-3">
                      <label className="text-sm font-medium text-slate-700 w-16">Môn 3</label>
                      <input
                        type="number" min="0" max="10" step="0.1"
                        value={state.thpt[2]}
                        onChange={(e) => handleThptChange(2, e.target.value)}
                        className="flex-1 px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        placeholder="Điểm thi..."
                      />
                    </div>
                    
                    <div className="flex items-center gap-2 pl-[4.5rem]">
                      <input 
                        type="checkbox" id="isNgoaiNgu"
                        checked={state.isNgoaiNgu}
                        onChange={(e) => state.setIsNgoaiNgu(e.target.checked)}
                        className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                      />
                      <label htmlFor="isNgoaiNgu" className="text-sm text-slate-600 cursor-pointer select-none">Là môn Ngoại ngữ?</label>
                      <button 
                        type="button" 
                        onClick={() => setShowConversionTable(true)}
                        className="text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline ml-auto"
                      >
                        Bảng quy đổi
                      </button>
                    </div>

                    {state.isNgoaiNgu && (
                      <div className="pl-[4.5rem] space-y-2 pt-2 border-t border-slate-200 mt-2">
                        <div className="flex gap-2 w-full">
                          <select
                            value={state.chungChiType}
                            onChange={(e) => state.setChungChiType(e.target.value)}
                            className="w-20 sm:w-24 px-2 py-1.5 text-sm border border-slate-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500 shrink-0"
                          >
                            <option value="IELTS">IELTS</option>
                            <option value="TOEFL">TOEFL</option>
                          </select>
                          <input
                            type="number" min="0" step="0.1"
                            value={state.diemChungChi}
                            onChange={(e) => state.setDiemChungChi(e.target.value)}
                            className="w-full min-w-0 px-2 py-1.5 text-sm border border-slate-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500"
                            placeholder="Điểm CC..."
                          />
                        </div>
                        {state.diemChungChi && (
                          <div className="text-xs font-medium text-emerald-600 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Quy đổi: {results.diemNgoaiNguQuyDoi} / 10
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg text-sm flex justify-between items-center border border-blue-100">
                  <span className="text-blue-800 font-medium">Tổng 3 môn:</span>
                  <span className="font-bold text-blue-900 text-lg">{results.tongTHPT.toFixed(2)}</span>
                </div>
              </div>

              {/* DGNL */}
              <div className="space-y-4">
                <h4 className="font-semibold text-slate-800">Kỳ thi ĐGNL (V-ACT) 2026</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-slate-600 mb-1">Điểm thi ĐGNL</label>
                    <input
                      type="number" min="0"
                      value={state.dgnl}
                      onChange={(e) => state.setDgnl(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-lg"
                      placeholder="VD: 850"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-600 mb-1">Max ĐGNL dự kiến</label>
                    <input
                      type="number" min="0"
                      value={state.maxDgnl}
                      onChange={(e) => state.setMaxDgnl(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg text-sm flex justify-between">
                  <span className="text-slate-600">Chuẩn hóa 30:</span>
                  <span className="font-bold text-slate-900">{results.dgnlChuanHoa.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </CardSection>

          {/* Ưu tiên */}
          <CardSection title="4. Ưu tiên & Điểm cộng" icon={Award}>
            <div className="grid grid-cols-1 md:grid-cols-[63fr_74fr_63fr] gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Khu vực</label>
                <select 
                  value={state.kv} 
                  onChange={(e) => state.setKv(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  {KHU_VUC.map(k => <option key={k.id} value={k.id}>{k.name} (+{k.points})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Đối tượng</label>
                <select 
                  value={state.dt} 
                  onChange={(e) => state.setDt(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  {DOI_TUONG.map(d => <option key={d.id} value={d.id}>{d.name} (+{d.points})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Điểm cộng (Max 1.5)</label>
                <input
                  type="number" min="0" max="1.5" step="0.1"
                  value={state.khuyenKhich}
                  onChange={(e) => state.setKhuyenKhich(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.0"
                />
              </div>
            </div>
            
            {/* Note về công thức giảm tuyến tính */}
            <div className="mt-6 flex gap-3 p-4 bg-amber-50 rounded-lg border border-amber-100">
              <Info className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div className="text-sm text-amber-800">
                <p className="font-semibold mb-1">Quy định giảm trừ ưu tiên (Tuyến tính):</p>
                <ul className="list-disc pl-4 space-y-1 text-amber-700/80">
                  <li>Tổng điểm Học lực &gt; 22.5: Mức ưu tiên sẽ giảm dần về 0.</li>
                  <li>Tổng điểm Học lực &gt; 28.5: Mức điểm cộng sẽ giảm dần về 0.</li>
                </ul>
              </div>
            </div>
          </CardSection>

        </div>

        {/* Right Column - Sticky Result */}
        <div className={`
          lg:block lg:w-96 lg:static
          ${showMobileResultModal ? 'fixed inset-0 z-[60] bg-slate-900/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in' : 'hidden'}
        `}>
          <div className={`
            w-full bg-white shadow-2xl relative flex flex-col overflow-hidden
            ${showMobileResultModal ? 'rounded-t-3xl sm:rounded-2xl max-h-[90vh] animate-in slide-in-from-bottom-full sm:zoom-in-95' : 'rounded-2xl border border-blue-100 sticky top-24'}
          `}>
            
            {/* Close button for mobile */}
            {showMobileResultModal && (
              <button 
                onClick={() => setShowMobileResultModal(false)}
                className="absolute top-4 right-4 z-20 text-white/70 hover:text-white lg:hidden bg-black/20 rounded-full p-1.5 backdrop-blur-sm transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}

            {/* Overlay Cảnh Báo Nếu Hồ Sơ Không Hợp Lệ */}
              {results.hocBaStatus === 3 && (
                <div className="absolute inset-0 bg-red-900/10 backdrop-blur-[2px] z-10 flex items-center justify-center p-6">
                  <div className="bg-white p-5 rounded-xl shadow-2xl text-center border-2 border-red-500">
                    <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-red-700 mb-1">Hồ Sơ Không Hợp Lệ</h3>
                    <p className="text-sm text-slate-600">Khuyết điểm học bạ lớp 11 hoặc 12.</p>
                  </div>
                </div>
              )}

              {/* Header */}
              <div className={`p-6 text-white relative overflow-hidden transition-colors ${results.hocBaStatus === 3 ? 'bg-slate-500' : 'bg-gradient-to-br from-blue-700 to-blue-900'}`}>
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Calculator className="w-24 h-24" />
                </div>
                <h2 className="text-lg font-medium text-blue-100 mb-1">Kết Quả</h2>
                <div className="text-5xl font-extrabold tracking-tight mb-2">
                  {results.base100.toFixed(2)} <span className="text-xl font-normal text-blue-200">/ 100</span>
                </div>
                <div className="text-lg font-medium text-blue-100">
                  Thang 30: <span className="font-bold text-white">{results.base30.toFixed(2)}</span>
                </div>
              </div>

              {/* Breakdown */}
              <div className="p-6 space-y-6">
                
                {/* Branch Selection */}
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Hệ thống chọn nhánh</h3>
                  <div className="space-y-2">
                    <div className={`p-3 rounded-xl border flex justify-between items-center transition-colors ${results.branchSelected === 1 ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-100'}`}>
                      <div>
                        <div className="text-sm font-semibold text-slate-700">THPT + Học bạ</div>
                        <div className="text-xs text-slate-500">{Math.round(state.w1 * 100)}% + {Math.round((1 - state.w1) * 100)}%</div>
                      </div>
                      <div className="text-right">
                        <div className={`font-bold text-lg ${results.branchSelected === 1 ? 'text-emerald-700' : 'text-slate-400'}`}>
                          {((results.diemHL1 / 30) * 100).toFixed(2)}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5 font-medium">
                          ~ {results.diemHL1.toFixed(2)} / 30
                        </div>
                      </div>
                    </div>
                    
                    <div className={`p-3 rounded-xl border flex justify-between items-center transition-colors ${results.branchSelected === 2 ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-100'}`}>
                      <div>
                        <div className="text-sm font-semibold text-slate-700">ĐGNL + Học bạ</div>
                        <div className="text-xs text-slate-500">{Math.round(state.w3 * 100)}% + {Math.round((1 - state.w3) * 100)}%</div>
                      </div>
                      <div className="text-right">
                        <div className={`font-bold text-lg ${results.branchSelected === 2 ? 'text-emerald-700' : 'text-slate-400'}`}>
                          {((results.diemHL2 / 30) * 100).toFixed(2)}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5 font-medium">
                          ~ {results.diemHL2.toFixed(2)} / 30
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="h-px w-full bg-slate-100"></div>

                {/* Phân tích điểm cộng */}
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Phân tích ưu tiên & cộng</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Ưu tiên KV & ĐT (Gốc)</span>
                      <span className="font-medium text-slate-900">+{results.uuTienGoc.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center bg-amber-50 p-2 rounded text-amber-900 border border-amber-100">
                      <span>Ưu tiên thực nhận</span>
                      <span className="font-bold text-amber-700">+{results.uuTienThuc.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-100">
                      <span className="text-slate-600">Điểm cộng (Gốc)</span>
                      <span className="font-medium text-slate-900">+{results.congGoc.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center bg-amber-50 p-2 rounded text-amber-900 border border-amber-100">
                      <span>Điểm cộng thực nhận</span>
                      <span className="font-bold text-amber-700">+{results.congThuc.toFixed(2)}</span>
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
          <div className="text-xs text-slate-500 font-medium mb-0.5">Điểm xét tuyển</div>
          <div className="text-2xl font-extrabold text-blue-700 leading-none">
            {results.base100.toFixed(2)} <span className="text-sm font-normal text-slate-500">/ 100</span>
          </div>
        </div>
        <button 
          onClick={() => setShowMobileResultModal(true)}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors shadow-md flex items-center gap-2"
        >
          Xem chi tiết
        </button>
      </div>

      {/* Modal Bảng Quy Đổi Ngoại Ngữ */}
      {showConversionTable && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800">Bảng Quy Đổi Ngoại Ngữ</h3>
              <button onClick={() => setShowConversionTable(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="grid grid-cols-2 gap-6">
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
                      {NGOAI_NGU_CONVERSION.IELTS.map((row, i) => (
                        <tr key={i} className="hover:bg-slate-50">
                          <td className="py-2 text-slate-700">{row.min}{row.max !== 9.0 ? ` - ${row.max}` : ' - 9.0'}</td>
                          <td className="py-2 font-semibold text-blue-700">{row.point}</td>
                        </tr>
                      ))}
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
                      {NGOAI_NGU_CONVERSION.TOEFL.map((row, i) => (
                        <tr key={i} className="hover:bg-slate-50">
                          <td className="py-2 text-slate-700">{row.min} - {row.max}</td>
                          <td className="py-2 font-semibold text-emerald-700">{row.point}</td>
                        </tr>
                      ))}
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
