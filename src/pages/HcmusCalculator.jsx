import { useState } from 'react';
import { useHcmusCalculator } from '../hooks/useHcmusCalculator';
import { CardSection } from '../components/common/CardSection';
import { ConversionModal } from '../components/common/ConversionModal';
import { ConversionTable, ConversionTableGrid } from '../components/common/ConversionTable';
import { TranscriptScoreTable } from '../components/common/TranscriptScoreTable';
import { QuickScoreInput } from '../components/score/QuickScoreInput';
import { ScoreInput } from '../components/score/ScoreInput';
import { MobileScoreButton } from '../components/score/MobileScoreButton';
import { ResponsiveScorePanel } from '../components/score/ResponsiveScorePanel';
import { ScoreDetailCard } from '../components/score/ScoreDetailCard';
import { Settings, BookOpen, PenTool, Award, Info, AlertTriangle, CheckCircle2, GraduationCap, ExternalLink } from 'lucide-react';
import { HCMUS_ENGLISH_TYPES, NGOAI_NGU_CONVERSION, HCMUS_DGNL_CONVERSION } from '../constants/hcmus';
import { KHU_VUC, DOI_TUONG } from '../constants/common';
import { clampScore, updateScoreArray } from '../utils/input';
import { findById } from '../utils/collection';

export const HcmusCalculator = () => {
  const { state, results } = useHcmusCalculator();
  const [showConversionTable, setShowConversionTable] = useState(false);
  const [showDgnlConversionTable, setShowDgnlConversionTable] = useState(false);
  const [showMobileResultModal, setShowMobileResultModal] = useState(false);
  
  const handleHocBaChange = (index, val) => {
    updateScoreArray(state.hocBa, state.setHocBa, index, val, 10);
  };

  const handleHocBaQuickTotalChange = (val) => {
    state.setHocBaQuickTotal(clampScore(val, 30));
  };

  const handleThptChange = (index, val) => {
    updateScoreArray(state.thpt, state.setThpt, index, val, 10);
  };

  const handleThptQuickTotalChange = (val) => {
    state.setThptQuickTotal(clampScore(val, 30));
  };

  const hasHocBaDetail = state.hocBa.some(val => val !== '');
  const hasHocBaQuickTotal = state.hocBaQuickTotal !== '';
  const hasThptDetail = state.thpt.some(val => val !== '') || (state.isNgoaiNgu && state.diemChungChi !== '');
  const hasThptQuickTotal = state.thptQuickTotal !== '';
  const selectedEnglishType = findById(HCMUS_ENGLISH_TYPES, state.chungChiType);
  const isHocBaTouched = state.hocBa.some(val => val !== '');

  const getHocBaSubjectStatus = (subjectIndex) => {
    const p10 = state.hocBa[subjectIndex * 3];
    const p11 = state.hocBa[subjectIndex * 3 + 1];
    const p12 = state.hocBa[subjectIndex * 3 + 2];
    const isMissing10 = p10 === '' && p11 !== '' && p12 !== '';

    if (!isHocBaTouched) return { isMissing10, note: '', noteClass: '' };
    if (p11 === '' || p12 === '' || (p10 === '' && !isMissing10)) {
      return { isMissing10, note: 'Thiếu điểm', noteClass: 'font-semibold text-red-500' };
    }
    if (isMissing10) {
      return { isMissing10, note: 'Tự điền Lớp 10', noteClass: 'font-semibold text-amber-600' };
    }
    return { isMissing10, note: 'Hợp lệ', noteClass: 'text-emerald-600' };
  };

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in duration-500 pb-28">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-blue-900 tracking-tight flex items-center gap-3">
          <GraduationCap className="w-8 h-8 text-blue-700" />
          Máy tính điểm HCMUS 2026
        </h1>
        <p className="text-slate-500 mt-2">Phương thức tổng hợp của Trường Đại học Khoa học Tự nhiên - ĐHQG-HCM.</p>
        <a
          href="https://tuyensinh.hcmus.edu.vn/2026-thong-tin-tuyen-sinh/"
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex items-center gap-2 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-800 transition-colors hover:border-blue-200 hover:bg-blue-100"
        >
          Xem phương thức tuyển sinh HCMUS
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column - Forms */}
        <div className="flex-1 space-y-6">
          
          {/* Học bạ */}
          <CardSection title="1. Điểm học bạ" icon={BookOpen}>
            <div className="flex flex-col gap-4">
              <QuickScoreInput
                title="Nhập nhanh tổng học bạ"
                value={hasHocBaDetail ? results.tongHocBa.toFixed(2) : state.hocBaQuickTotal}
                onChange={(e) => handleHocBaQuickTotalChange(e.target.value)}
                disabled={hasHocBaDetail}
                className="order-2"
              />
              <div className="order-1">
                <TranscriptScoreTable
                  values={state.hocBa}
                  onChange={handleHocBaChange}
                  disabled={hasHocBaQuickTotal}
                  tone="blue"
                  showNoteColumn
                  getDisplayValue={({ cellIndex, subjectIndex, yearIndex }) => {
                    const { isMissing10 } = getHocBaSubjectStatus(subjectIndex);
                    const cellIsMissing10 = yearIndex === 0 && isMissing10;
                    return state.hocBa[cellIndex] !== '' ? state.hocBa[cellIndex] : (cellIsMissing10 ? results.interpolatedHocBa[cellIndex] : '');
                  }}
                  getCellMeta={({ cellIndex, subjectIndex, yearIndex }) => {
                    const { isMissing10 } = getHocBaSubjectStatus(subjectIndex);
                    const cellIsMissing10 = yearIndex === 0 && isMissing10;
                    const isMissingCell = isHocBaTouched && state.hocBa[cellIndex] === '' && !cellIsMissing10;

                    if (cellIsMissing10) {
                      return {
                        className: 'border-amber-300 bg-amber-50 font-semibold text-amber-600',
                        title: 'Điểm nội suy từ lớp 11 và 12',
                      };
                    }

                    if (isMissingCell) {
                      return { className: 'border-red-300 bg-red-50 text-slate-900' };
                    }

                    return { className: 'border-slate-200 text-slate-900' };
                  }}
                  renderSubjectNote={({ subjectIndex }) => {
                    const { note, noteClass } = getHocBaSubjectStatus(subjectIndex);
                    return <span className={noteClass}>{note}</span>;
                  }}
                />
              </div>
              {results.hocBaStatus === 3 && (
                <div className="order-3 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <div className="text-sm text-red-800">
                    <strong>CẢNH BÁO:</strong> Hồ sơ không hợp lệ do thiếu điểm Lớp 11 hoặc Lớp 12. Điểm xét tuyển = 0.
                  </div>
                </div>
              )}
            </div>
          </CardSection>

          {/* Điểm Thi */}
          <CardSection title="2. Điểm thi" icon={PenTool}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* THPT */}
              <div className="flex flex-col gap-4">
                <label className="block text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-700" /> Kỳ thi tốt nghiệp THPT 2026
                </label>
                <QuickScoreInput
                  title="Nhập nhanh tổng THPT"
                  value={hasThptDetail ? results.tongTHPT.toFixed(2) : state.thptQuickTotal}
                  onChange={(e) => handleThptQuickTotalChange(e.target.value)}
                  disabled={hasThptDetail}
                  className="order-3"
                />
                <div className="order-2 space-y-3">
                  {[0, 1].map((idx) => (
                    <div key={`thpt-${idx}`} className="flex items-center gap-3">
                      <label className="text-sm text-slate-600 w-16">Môn {idx + 1}</label>
                      <ScoreInput
                        max={10}
                        value={state.thpt[idx]}
                        onValueChange={(value) => handleThptChange(idx, value)}
                        disabled={hasThptQuickTotal}
                        tone="blue"
                        widthClass="flex-1"
                        placeholder="0.00"
                      />
                    </div>
                  ))}
                  
                  {/* Môn 3 (Ngoại Ngữ) */}
                  <div className="p-3 border border-slate-200 rounded-xl bg-slate-50 space-y-3">
                    <div className="flex items-center gap-3">
                      <label className="text-sm font-medium text-slate-700 w-16">Môn 3</label>
                      <ScoreInput
                        max={10}
                        value={state.thpt[2]}
                        onValueChange={(value) => handleThptChange(2, value)}
                        disabled={hasThptQuickTotal}
                        tone="blue"
                        widthClass="flex-1"
                        inputClassName={hasThptQuickTotal ? '' : 'bg-white'}
                        placeholder="0.00"
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
                            onChange={(e) => {
                              state.setChungChiType(e.target.value);
                              state.setDiemChungChi('');
                            }}
                            className="w-20 sm:w-24 px-2 py-1.5 text-sm border border-slate-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500 shrink-0"
                          >
                            {HCMUS_ENGLISH_TYPES.map((type) => (
                              <option key={type.id} value={type.id}>{type.name}</option>
                            ))}
                          </select>
                          <ScoreInput
                            max={selectedEnglishType?.max}
                            value={state.diemChungChi}
                            onValueChange={state.setDiemChungChi}
                            tone="blue"
                            widthClass="w-full min-w-0"
                            className="py-1.5"
                            inputClassName="border-slate-300 bg-white px-2 text-sm"
                            placeholder="Điểm CC..."
                          />
                        </div>
                        {state.diemChungChi && (
                          <div className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                            <CheckCircle2 className="h-3 w-3" />
                            Quy đổi: {results.diemNgoaiNguQuyDoi} / 10
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* DGNL */}
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-semibold text-blue-900 flex items-center gap-2">
                    <Settings className="w-4 h-4 text-blue-700" /> Kỳ thi ĐGNL 2026
                  </label>
                  <button 
                    type="button" 
                    onClick={() => setShowDgnlConversionTable(true)}
                    className="text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    Bảng quy đổi
                  </button>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-slate-600 mb-1">Điểm thi ĐGNL</label>
                    <ScoreInput
                      max={parseFloat(state.maxDgnl) || 1139}
                      value={state.dgnl}
                      onValueChange={state.setDgnl}
                      integer
                      tone="blue"
                      inputClassName="font-medium text-lg"
                      placeholder="850"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-600 mb-1">Max ĐGNL</label>
                    <ScoreInput
                      max={1200}
                      value={state.maxDgnl}
                      onValueChange={state.setMaxDgnl}
                      disabled
                      integer
                      tone="blue"
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
          <CardSection title="3. Ưu tiên & Điểm cộng" icon={Award}>
            <div className="grid grid-cols-1 md:grid-cols-[63fr_74fr_63fr] gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Khu vực</label>
                <select 
                  value={state.kv} 
                  onChange={(e) => state.setKv(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  {KHU_VUC.map(k => <option key={k.id} value={k.id}>{k.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Đối tượng</label>
                <select 
                  value={state.dt} 
                  onChange={(e) => state.setDt(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  {DOI_TUONG.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Điểm cộng (Max 1.5)</label>
                <ScoreInput
                  max={1.5}
                  value={state.khuyenKhich}
                  onValueChange={state.setKhuyenKhich}
                  tone="blue"
                  placeholder="0.0"
                />
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
          <ScoreDetailCard
            theme="blue"
            className="relative"
            total={results.base100}
            headerClassName={results.hocBaStatus === 3 ? 'bg-slate-500' : undefined}
            headerNote={<>Thang 30: <span className="font-bold text-white">{results.base30.toFixed(2)}</span></>}
            beforeLearning={
              <>
                {results.hocBaStatus === 3 && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-red-900/10 p-6 backdrop-blur-[2px]">
                    <div className="rounded-xl border-2 border-red-500 bg-white p-5 text-center shadow-2xl">
                      <AlertTriangle className="mx-auto mb-3 h-12 w-12 text-red-500" />
                      <h3 className="mb-1 text-lg font-bold text-red-700">Hồ Sơ Không Hợp Lệ</h3>
                      <p className="text-sm text-slate-600">Khuyết điểm học bạ lớp 11 hoặc 12.</p>
                    </div>
                  </div>
                )}
                <div className="space-y-2">
                  <div className={`flex items-center justify-between rounded-xl border p-3 transition-colors ${results.branchSelected === 1 ? 'border-emerald-200 bg-emerald-50' : 'border-slate-100 bg-slate-50'}`}>
                    <div>
                      <div className="text-sm font-semibold text-slate-700">THPT + Học bạ</div>
                      <div className="text-xs text-slate-500">{Math.round(state.w1 * 100)}% + {Math.round((1 - state.w1) * 100)}%</div>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${results.branchSelected === 1 ? 'text-emerald-700' : 'text-slate-400'}`}>
                        {((results.diemHL1 / 30) * 100).toFixed(2)}
                      </div>
                      <div className="mt-0.5 text-xs font-medium text-slate-500">
                        ~ {results.diemHL1.toFixed(2)} / 30
                      </div>
                    </div>
                  </div>
                  <div className={`flex items-center justify-between rounded-xl border p-3 transition-colors ${results.branchSelected === 2 ? 'border-emerald-200 bg-emerald-50' : 'border-slate-100 bg-slate-50'}`}>
                    <div>
                      <div className="text-sm font-semibold text-slate-700">ĐGNL + Học bạ</div>
                      <div className="text-xs text-slate-500">{Math.round(state.w3 * 100)}% + {Math.round((1 - state.w3) * 100)}%</div>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${results.branchSelected === 2 ? 'text-emerald-700' : 'text-slate-400'}`}>
                        {((results.diemHL2 / 30) * 100).toFixed(2)}
                      </div>
                      <div className="mt-0.5 text-xs font-medium text-slate-500">
                        ~ {results.diemHL2.toFixed(2)} / 30
                      </div>
                    </div>
                  </div>
                </div>
              </>
            }
            dgnlScore={((results.dgnlChuanHoa / 30) * 100).toFixed(2)}
            thptScore={((results.tongTHPT / 30) * 100).toFixed(2)}
            hocBaScore={((results.tongHocBa / 30) * 100).toFixed(2)}
            bonusRows={[
              { label: 'Điểm cộng (Gốc)', value: `~+${((results.congGoc / 30) * 100).toFixed(2)}`, secondaryValue: `(+${results.congGoc.toFixed(2)} / 30)` },
              { label: 'Cộng thực nhận', value: `~+${((results.congThuc / 30) * 100).toFixed(2)}`, secondaryValue: `(+${results.congThuc.toFixed(2)} / 30)`, variant: 'bonusEffective' },
            ]}
            priorityRows={[
              { label: 'Ưu tiên KV/ĐT (Gốc)', value: `~+${((results.uuTienGoc / 30) * 100).toFixed(2)}`, secondaryValue: `(+${results.uuTienGoc.toFixed(2)} / 30)` },
              { label: 'Ưu tiên thực nhận', value: `~+${((results.uuTienThuc / 30) * 100).toFixed(2)}`, secondaryValue: `(+${results.uuTienThuc.toFixed(2)} / 30)`, variant: 'priorityEffective' },
            ]}
          />
        </ResponsiveScorePanel>
      </div>

      <MobileScoreButton
        score={results.base100}
        onClick={() => setShowMobileResultModal(true)}
      />

      <ConversionModal
        isOpen={showConversionTable}
        title="Bảng quy đổi Chứng chỉ ngoại ngữ"
        onClose={() => setShowConversionTable(false)}
        maxWidthClassName="max-w-lg"
      >
        <ConversionTableGrid className="grid grid-cols-2 gap-6">
          <ConversionTable
            title="IELTS"
            tone="blue"
            columns={[
              { key: 'band', header: 'Band' },
              { key: 'point', header: 'Quy đổi', value: true },
            ]}
            rows={NGOAI_NGU_CONVERSION.IELTS.map((row) => ({
              band: row.max === 9.0 ? `≥ ${row.min}` : row.min.toFixed(1),
              point: row.point,
            }))}
          />
          <ConversionTable
            title="TOEFL iBT"
            tone="emerald"
            columns={[
              { key: 'score', header: 'Điểm' },
              { key: 'point', header: 'Quy đổi', value: true },
            ]}
            rows={NGOAI_NGU_CONVERSION.TOEFL.map((row) => ({
              score: `${row.min} - ${row.max}`,
              point: row.point,
            }))}
          />
        </ConversionTableGrid>
      </ConversionModal>

      <ConversionModal
        isOpen={showDgnlConversionTable}
        title="Khung quy đổi tương đương điểm thi ĐGNL ĐHQG-HCM với điểm thi THPT năm 2026"
        onClose={() => setShowDgnlConversionTable(false)}
        maxWidthClassName="max-w-5xl"
      >
        <ConversionTableGrid className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ConversionTable
            columns={[
              { key: 'percent', header: 'Phân vị (%)' },
              { key: 'dgnl', header: 'Điểm thi ĐGNL' },
              { key: 'thpt', header: 'Điểm thi THPT', value: true }
            ]}
            rows={HCMUS_DGNL_CONVERSION.slice(0, 33)}
            tone="blue"
          />
          <ConversionTable
            columns={[
              { key: 'percent', header: 'Phân vị (%)' },
              { key: 'dgnl', header: 'Điểm thi ĐGNL' },
              { key: 'thpt', header: 'Điểm thi THPT', value: true }
            ]}
            rows={HCMUS_DGNL_CONVERSION.slice(33, 67)}
            tone="blue"
          />
          <ConversionTable
            columns={[
              { key: 'percent', header: 'Phân vị (%)' },
              { key: 'dgnl', header: 'Điểm thi ĐGNL' },
              { key: 'thpt', header: 'Điểm thi THPT', value: true }
            ]}
            rows={HCMUS_DGNL_CONVERSION.slice(67)}
            tone="blue"
          />
        </ConversionTableGrid>
      </ConversionModal>

    </div>
  );
};
