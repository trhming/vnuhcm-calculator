import { useState } from 'react';
import { useHcmutCalculator } from '../hooks/useHcmutCalculator';
import { CardSection } from '../components/common/CardSection';
import { ConversionModal } from '../components/common/ConversionModal';
import { ConversionTable, ConversionTableGrid } from '../components/common/ConversionTable';
import { TranscriptScoreTable } from '../components/common/TranscriptScoreTable';
import { QuickScoreInput } from '../components/score/QuickScoreInput';
import { ScoreInput } from '../components/score/ScoreInput';
import { MobileScoreButton } from '../components/score/MobileScoreButton';
import { ResponsiveScorePanel } from '../components/score/ResponsiveScorePanel';
import { Settings, BookOpen, PenTool, Award, Info, CheckCircle2, Building2, ExternalLink } from 'lucide-react';
import { DOI_TUONG, INTL_CERT_TABLE_COLUMNS, KHU_VUC } from '../constants/common';
import {
  DOI_TUONG_HCMUT,
  HCMUT_ENGLISH_TABLES,
  HCMUT_ENGLISH_TYPES,
  HCMUT_INTL_CERT_CONVERSION_TABLE,
  HCMUT_INTL_CERT_TYPES,
} from '../constants/hcmut';
import { clampScore } from '../utils/input';
import { findById } from '../utils/collection';
import { ScoreDetailCard } from '../components/score/ScoreDetailCard';

export const HcmutCalculator = () => {
  const { state, results } = useHcmutCalculator();
  const [showMobileResultModal, setShowMobileResultModal] = useState(false);
  const [showConversionTable, setShowConversionTable] = useState(false);
  const [showIntlCertTable, setShowIntlCertTable] = useState(false);
  
  const handleHocBaChange = (index, val) => {
    const newHocBa = [...state.hocBa];
    newHocBa[index] = clampScore(val, 10);
    state.setHocBa(newHocBa);
  };

  const handleHocBaQuickAverageChange = (val) => {
    state.setHocBaQuickAverage(clampScore(val, 10));
  };

  const handleThptChange = (index, val) => {
    const newThpt = [...state.thpt];
    newThpt[index] = clampScore(val, 10);
    state.setThpt(newThpt);
  };

  const handleThptQuickTotalChange = (val) => {
    state.setThptQuickTotal(clampScore(val, 10));
  };

  const handleDgnlQuickTotalChange = (val) => {
    state.setDgnlQuickTotal(clampScore(val, 1500));
  };

  const hasHocBaDetail = state.hocBa.some(val => val !== '');
  const hasHocBaQuickAverage = state.hocBaQuickAverage !== '';
  const hasThptDetail = state.thpt.some(val => val !== '') || (state.isNgoaiNgu && (state.diemNgoaiNgu !== '' || state.toeicLr !== '' || state.toeicSw !== ''));
  const hasThptQuickTotal = state.thptQuickTotal !== '';
  const dgnlDetailTotal = (parseFloat(state.dgnlTv) || 0) + (parseFloat(state.dgnlTa) || 0) + ((parseFloat(state.dgnlToan) || 0) * 2) + (parseFloat(state.dgnlKh) || 0);
  const hasDgnlDetail = state.dgnlTv !== '' || state.dgnlTa !== '' || state.dgnlToan !== '' || state.dgnlKh !== '';
  const hasDgnlQuickTotal = state.dgnlQuickTotal !== '';
  const selectedIntlCert = findById(HCMUT_INTL_CERT_TYPES, state.intlCertType);
  const selectedEnglishType = findById(HCMUT_ENGLISH_TYPES, state.ngoaiNguType);

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in duration-500 pb-28">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-blue-900 tracking-tight flex items-center gap-3">
          <Building2 className="w-8 h-8 text-blue-800" />
          Máy tính điểm HCMUT 2026
        </h1>
        <p className="text-slate-500 mt-2">Phương thức tổng hợp của Trường Đại học Bách khoa - ĐHQG-HCM.</p>
        <a
          href="https://hcmut.edu.vn/tuyen-sinh/dai-hoc-chinh-quy/phuong-thuc-tuyen-sinh/xet-tuyen-tong-hop-2026"
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex items-center gap-2 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-800 transition-colors hover:border-blue-200 hover:bg-blue-100"
        >
          Xem phương thức tuyển sinh HCMUT
          <ExternalLink className="h-4 w-4" />
        </a>
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
                      <ScoreInput max={300} value={state.dgnlTv} onValueChange={state.setDgnlTv} disabled={hasDgnlQuickTotal} tone="hcmut" inputClassName="border-blue-200" placeholder="VD: 300" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-blue-800 mb-1">Tiếng Anh</label>
                      <ScoreInput max={300} value={state.dgnlTa} onValueChange={state.setDgnlTa} disabled={hasDgnlQuickTotal} tone="hcmut" inputClassName="border-blue-200" placeholder="VD: 300" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-blue-800 mb-1">Toán <span className="font-bold">(x2)</span></label>
                      <ScoreInput max={300} value={state.dgnlToan} onValueChange={state.setDgnlToan} disabled={hasDgnlQuickTotal} tone="hcmut" inputClassName="border-blue-200" placeholder="VD: 300" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-blue-800 mb-1">Tư duy khoa học</label>
                      <ScoreInput max={300} value={state.dgnlKh} onValueChange={state.setDgnlKh} disabled={hasDgnlQuickTotal} tone="hcmut" inputClassName="border-blue-200" placeholder="VD: 300" />
                    </div>
                  </div>
                  <QuickScoreInput
                    title="Nhập nhanh tổng ĐGNL"
                    description="Tổng điểm 4 phần thi trên thang 1500."
                    value={hasDgnlDetail ? dgnlDetailTotal.toFixed(0) : state.dgnlQuickTotal}
                    onChange={(e) => handleDgnlQuickTotalChange(e.target.value)}
                    disabled={hasDgnlDetail}
                    max={1500}
                    step="1"
                    placeholder="0"
                    tone="hcmut"
                    className="mt-4"
                  />
                </div>
              )}

              {state.doiTuongUT === '2.4' && (
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg animate-in slide-in-from-top-2">
                  <label className="block text-sm font-semibold text-blue-900 mb-2">Chứng chỉ Quốc tế</label>
                  <div className="flex gap-3">
                    <select
                      value={state.intlCertType}
                      onChange={e => {
                        state.setIntlCertType(e.target.value);
                        state.setIntlCertScore('');
                      }}
                      className="px-3 py-2 border border-slate-300 rounded-md bg-white focus:ring-2 focus:ring-blue-800"
                    >
                      {HCMUT_INTL_CERT_TYPES.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                    {state.intlCertType === 'A_LEVEL' ? (
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
                       <ScoreInput
                        max={selectedIntlCert?.max}
                        value={state.intlCertScore}
                        onValueChange={state.setIntlCertScore}
                        tone="hcmut"
                        inputClassName="flex-1 border-slate-300 font-bold text-lg"
                        placeholder="Nhập điểm CC..."
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => setShowIntlCertTable(true)}
                      className="px-3 py-2 text-sm font-medium text-blue-700 hover:text-blue-900 hover:underline whitespace-nowrap"
                    >
                      Bảng quy đổi
                    </button>
                  </div>
                </div>
              )}
            </div>
          </CardSection>

          {/* Học bạ */}
          <CardSection title="2. Điểm học bạ" icon={BookOpen}>
            <div>
              <TranscriptScoreTable
                values={state.hocBa}
                onChange={handleHocBaChange}
                disabled={hasHocBaQuickAverage}
                tone="hcmut"
                subjectWeights={[2, 1, 1]}
                highlightedSubjects={[0]}
                getCellMeta={({ subjectIndex }) => ({
                  className: `border-slate-200 text-slate-900 ${subjectIndex === 0 ? 'bg-white' : ''}`,
                })}
              />
              <QuickScoreInput
                title="Nhập nhanh trung bình học bạ"
                description="Điểm trung bình học bạ trên thang 10."
                value={hasHocBaDetail ? (results.diemHbQuyDoi / 10).toFixed(2) : state.hocBaQuickAverage}
                onChange={(e) => handleHocBaQuickAverageChange(e.target.value)}
                disabled={hasHocBaDetail}
                max={10}
                tone="hcmut"
                className="mt-4"
              />
            </div>
          </CardSection>

          {/* Điểm Thi THPT */}
          <CardSection title="3. Điểm thi THPT" icon={PenTool}>
             <div className="space-y-4">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {[0, 1].map((idx) => (
                   <div key={`thpt-${idx}`}>
                     <label className="block text-sm font-medium text-slate-700 mb-1">
                       Môn {idx + 1} {idx === 0 && <span className="text-blue-700 font-bold">(Toán x2)</span>}
                     </label>
                     <ScoreInput
                       max={10}
                       value={state.thpt[idx]}
                       onValueChange={(value) => handleThptChange(idx, value)}
                       disabled={hasThptQuickTotal}
                       tone="hcmut"
                       placeholder="0.00"
                     />
                   </div>
                 ))}
                 
                 {/* Môn 3 */}
                 <div className="col-span-1 md:col-span-3 md:mt-2 md:border-t md:border-slate-100 md:pt-4">
                    <label className="block text-sm font-medium text-slate-700 mb-3">Môn 3</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <ScoreInput
                           max={10}
                           value={state.thpt[2]}
                           onValueChange={(value) => handleThptChange(2, value)}
                           disabled={hasThptQuickTotal}
                           tone="hcmut"
                           inputClassName={hasThptQuickTotal ? '' : 'bg-white'}
                           placeholder="0.00"
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
                               onChange={(e) => {
                                 state.setNgoaiNguType(e.target.value);
                                 state.setDiemNgoaiNgu('');
                                 state.setToeicLr('');
                                 state.setToeicSw('');
                               }}
                               className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white focus:ring-2 focus:ring-blue-800"
                             >
                               {HCMUT_ENGLISH_TYPES.map((type) => (
                                 <option key={type.id} value={type.id}>{type.name}</option>
                               ))}
                             </select>
                             
                             {state.ngoaiNguType === 'TOEIC' ? (
                               <div className="flex gap-2">
                                  <ScoreInput
                                    max={selectedEnglishType?.maxLr}
                                    value={state.toeicLr}
                                    onValueChange={state.setToeicLr}
                                    tone="hcmut"
                                    widthClass="w-1/2"
                                    inputClassName="border-slate-300 text-sm"
                                    placeholder="Nghe Đọc..."
                                  />
                                  <ScoreInput
                                    max={selectedEnglishType?.maxSw}
                                    value={state.toeicSw}
                                    onValueChange={state.setToeicSw}
                                    tone="hcmut"
                                    widthClass="w-1/2"
                                    inputClassName="border-slate-300 text-sm"
                                    placeholder="Nói Viết..."
                                  />
                               </div>
                             ) : (
                               <ScoreInput
                                 max={selectedEnglishType?.max}
                                 value={state.diemNgoaiNgu}
                                 onValueChange={state.setDiemNgoaiNgu}
                                 tone="hcmut"
                                 inputClassName="border-slate-300 text-sm"
                                 placeholder={`Điểm ${state.ngoaiNguType}...`}
                               />
                             )}

                             {state.ngoaiNguType && (results.diemNgoaiNguQuyDoi > 0) && (
                               <div className="flex items-center gap-1 rounded bg-emerald-50 p-2 text-xs font-bold text-emerald-700">
                                 <CheckCircle2 className="h-4 w-4" />
                                 Quy đổi: {results.diemNgoaiNguQuyDoi} / 10
                               </div>
                             )}

                           </div>
                         )}
                      </div>
                    </div>
                 </div>
               </div>
               
               <QuickScoreInput
                 title="Nhập nhanh trung bình THPT"
                 description="Điểm trung bình THPT trên thang 10."
                 value={hasThptDetail ? (results.diemThptQuyDoi / 10).toFixed(2) : state.thptQuickTotal}
                 onChange={(e) => handleThptQuickTotalChange(e.target.value)}
                 disabled={hasThptDetail}
                 max={10}
                 tone="hcmut"
               />
             </div>
          </CardSection>

          {/* Thành tích & Ưu tiên */}
          <CardSection title="4. Ưu tiên & Điểm cộng" icon={Award}>
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
                     <ScoreInput max={10} value={state.thuong} onValueChange={state.setThuong} tone="hcmut" />
                   </div>
                   <div>
                     <label className="block text-xs text-slate-500 mb-1">Xét thưởng (Tối đa 5)</label>
                     <ScoreInput max={5} value={state.xetThuong} onValueChange={state.setXetThuong} tone="hcmut" />
                   </div>
                   <div>
                     <label className="block text-xs text-slate-500 mb-1">Khuyến khích (Tối đa 5)</label>
                     <ScoreInput max={5} value={state.khuyenKhich} onValueChange={state.setKhuyenKhich} tone="hcmut" />
                   </div>
                 </div>
               </div>
            </div>
          </CardSection>

        </div>

        <ResponsiveScorePanel
          isOpen={showMobileResultModal}
          onClose={() => setShowMobileResultModal(false)}
          borderClassName="border-blue-200"
        >
          <ScoreDetailCard
            theme="hcmut"
            total={results.total}
            formula={`ĐHL = ĐGNL x ${(state.wNL * 100).toFixed(0)}% + THPT x ${(state.wTHPT * 100).toFixed(0)}% + Học bạ x ${(state.wHB * 100).toFixed(0)}%`}
            dhl={results.diemHL}
            dgnlScore={results.diemNangLuc.toFixed(2)}
            thptScore={results.diemThptQuyDoi.toFixed(2)}
            hocBaScore={results.diemHbQuyDoi.toFixed(2)}
            bonusRows={[
              { label: 'Điểm thưởng', value: `+${results.thuongPoint.toFixed(2)}` },
              { label: 'Xét thưởng', value: `+${results.xetThuongPoint.toFixed(2)}` },
              { label: 'Khuyến khích', value: `+${results.khuyenKhichPoint.toFixed(2)}` },
              { label: 'Tổng điểm cộng (Gốc)', value: `+${results.tongCongGoc.toFixed(2)}`, separatorBefore: true },
              { label: 'Cộng thực nhận', value: `+${results.congThucNhan.toFixed(2)}`, variant: 'bonusEffective' },
            ]}
            priorityRows={[
              { label: 'Ưu tiên KV/ĐT (Gốc)', value: `+${results.uuTienQuyDoi.toFixed(2)}` },
              { label: 'Ưu tiên thực nhận', value: `+${results.uuTienThucNhan.toFixed(2)}`, variant: 'priorityEffective' },
            ]}
          />
        </ResponsiveScorePanel>
      </div>

      <MobileScoreButton
        score={results.total}
        tone="hcmut"
        onClick={() => setShowMobileResultModal(true)}
      />

      <ConversionModal
        isOpen={showConversionTable}
        title="Bảng Quy Đổi Ngoại Ngữ HCMUT"
        onClose={() => setShowConversionTable(false)}
      >
        <ConversionTableGrid>
          {HCMUT_ENGLISH_TABLES.map((table) => (
            <ConversionTable
              key={table.title}
              title={table.title}
              tone={table.tone}
              columns={[
                { key: 'score', header: table.scoreHeader },
                { key: 'point', header: 'Quy đổi', value: true },
              ]}
              rows={table.rows}
            />
          ))}
        </ConversionTableGrid>
      </ConversionModal>

      <ConversionModal
        isOpen={showIntlCertTable}
        title="Bảng Quy Đổi Chứng Chỉ Quốc Tế HCMUT"
        onClose={() => setShowIntlCertTable(false)}
      >
        <div className="overflow-x-auto">
          <ConversionTable
            columns={INTL_CERT_TABLE_COLUMNS}
            rows={HCMUT_INTL_CERT_CONVERSION_TABLE}
          />
        </div>
      </ConversionModal>

    </div>
  );
};

