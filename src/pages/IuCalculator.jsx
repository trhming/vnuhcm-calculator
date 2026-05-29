import { useState } from 'react';
import {
  AlertTriangle,
  Award,
  Calculator,
  CheckCircle2,
  ExternalLink,
  GraduationCap,
  Info,
  PenTool,
  Settings,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { CardSection } from '../components/common/CardSection';
import { QuickScoreInput } from '../components/common/QuickScoreInput';
import { KHU_VUC, DOI_TUONG } from '../constants/common';
import { IU_ENGLISH_TYPES, IU_GROUPS } from '../constants/iu';
import { useIuCalculator } from '../hooks/useIuCalculator';

const clampInput = (value, max) => {
  if (value === '') return '';
  const number = parseFloat(value);
  if (Number.isNaN(number)) return value;
  return Math.min(Math.max(number, 0), max).toString();
};

const IU_ENGLISH_MAX = {
  IELTS: 9,
  TOEFL: 120,
  TOEIC_LR: 990,
  TOEIC_SW: 400,
  CAMBRIDGE: 230,
};

const clampNumber = (value, min, max) => {
  const number = parseInt(value, 10);
  if (Number.isNaN(number)) return min;
  return Math.min(Math.max(number, min), max);
};

export const IuCalculator = () => {
  const { state, results } = useIuCalculator();
  const [showMobileResultModal, setShowMobileResultModal] = useState(false);
  const [showEnglishConversionTable, setShowEnglishConversionTable] = useState(false);

  const isForeignGroup = state.group === 'G3_FOREIGN';
  const needsThpt = ['G1_DGNL', 'G1_NO_DGNL', 'G2_BOTH', 'G2_THPT'].includes(state.group);
  const needsDgnl = ['G1_DGNL', 'G2_BOTH', 'G2_DGNL'].includes(state.group);
  const needsHocBa = ['G1_DGNL', 'G1_NO_DGNL', 'G3_FOREIGN'].includes(state.group);
  const isK3Valid = results.k3 >= 10 && results.k3 <= 20;
  const hasThptDetail = state.thpt.some((value) => value !== '') || state.useEnglishCertificate;
  const hasThptQuickTotal = state.thptQuickTotal !== '';
  const hasHocBaDetail = state.hocBa.some((value) => value !== '');
  const hasHocBaQuickTotal = state.hocBaQuickTotal !== '';
  const setQuickTotal = (setter, value) => setter(clampInput(value, 30));

  const updateK1 = (value) => {
    state.setK1(clampNumber(value, 30, 40));
  };

  const updateK2 = (value) => {
    state.setK2(clampNumber(value, 40, 50));
  };

  const updateArrayValue = (values, setter, index, value, max) => {
    const nextValues = [...values];
    nextValues[index] = clampInput(value, max);
    setter(nextValues);
  };

  const resultCard = (
    <div className="w-full bg-white rounded-2xl border border-red-100 shadow-2xl overflow-hidden sticky top-24">
      <div className="relative overflow-hidden bg-gradient-to-br from-red-700 to-slate-900 p-6 text-white">
        <div className="absolute right-0 top-0 p-4 opacity-10">
          <Calculator className="h-24 w-24" />
        </div>
        <h2 className="mb-1 text-lg font-medium text-red-100">Điểm xét tuyển</h2>
        <div className="mb-2 text-5xl font-extrabold tracking-tight">
          {results.total.toFixed(2)}
          <span className="text-xl font-normal text-red-100"> / 100</span>
        </div>
        <p className="mt-2 text-sm text-red-100">Thang chuẩn 100 điểm</p>
      </div>

      <div className="space-y-5 p-6">
        <div>
          <div className="mb-3 rounded-xl bg-red-50 p-3 text-sm text-red-900">
            <div className="font-semibold">{results.formula}</div>
            {results.interpolation && <div className="mt-1 text-red-800/80">{results.interpolation}</div>}
            <div className="mt-2 flex justify-between font-bold">
              <span>ĐHL</span>
              <span>{results.dhl.toFixed(2)}</span>
            </div>
          </div>
          <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">Điểm học lực</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">THPT chuẩn hóa</span>
              <span className="font-semibold text-slate-900">{results.thpt100.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">ĐGNL chuẩn hóa</span>
              <span className="font-semibold text-slate-900">{results.dgnl100.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Học bạ chuẩn hóa</span>
              <span className="font-semibold text-slate-900">{results.hocBa100.toFixed(2)}</span>
            </div>
            {isForeignGroup && (
              <div className="flex justify-between">
                <span className="text-slate-600">Phỏng vấn</span>
                <span className="font-semibold text-slate-900">{results.interview100.toFixed(2)}</span>
              </div>
            )}
          </div>
        </div>

        <div className="h-px bg-slate-100" />

        <div>
          <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">Điểm cộng & Ưu tiên</h3>
          <div className="space-y-4 text-sm">
            <div className="space-y-1">
              <div className="flex items-center justify-between text-slate-600">
                <span>Điểm cộng (Gốc)</span>
                <span>+{results.bonusRaw.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between rounded bg-amber-50 p-2 font-medium text-amber-900 border border-amber-100">
                <span>Cộng thực nhận</span>
                <span className="font-bold text-amber-700">+{results.bonusEffective.toFixed(2)}</span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-slate-600">
                <span>Ưu tiên KV/ĐT (Gốc)</span>
                <span>+{results.priority100.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between rounded bg-emerald-50 p-2 font-medium text-emerald-900 border border-emerald-100">
                <span>Ưu tiên thực nhận</span>
                <span className="font-bold text-emerald-700">+{results.priorityAccepted.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
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
            <CardSection title="3. Học bạ" icon={PenTool}>
                  <div className="space-y-4">
                    <h4 className="font-semibold text-slate-800">Học bạ - Trung bình lớp 10, 11, 12</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-600">
                          <tr>
                            <th className="w-24 rounded-tl-lg px-4 py-3 font-semibold">Môn</th>
                            <th className="px-4 py-3 text-center font-semibold">Lớp 10</th>
                            <th className="px-4 py-3 text-center font-semibold">Lớp 11</th>
                            <th className="px-4 py-3 text-center font-semibold">Lớp 12</th>
                            <th className="rounded-tr-lg px-4 py-3 text-center font-semibold">TB môn</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {[0, 1, 2].map((subjectIndex) => (
                            <tr key={`hocba-${subjectIndex}`}>
                              <td className="px-4 py-3 font-medium text-slate-700">Môn {subjectIndex + 1}</td>
                              {[0, 1, 2].map((yearIndex) => {
                                const cellIndex = subjectIndex * 3 + yearIndex;
                                return (
                                  <td key={cellIndex} className="px-2 py-2">
                                    <input
                                      type="number"
                                      min="0"
                                      max="10"
                                      step="0.1"
                                      value={state.hocBa[cellIndex]}
                                      onChange={(event) => updateArrayValue(state.hocBa, state.setHocBa, cellIndex, event.target.value, 10)}
                                      disabled={hasHocBaQuickTotal}
                                      className={`w-full rounded-md border border-slate-200 px-3 py-2 text-center focus:outline-none focus:ring-2 focus:ring-red-500 ${hasHocBaQuickTotal ? 'cursor-not-allowed bg-slate-100 text-slate-400' : ''}`}
                                      placeholder="0.0"
                                    />
                                  </td>
                                );
                              })}
                              <td className="px-4 py-3 text-center font-semibold text-red-700">
                                {results.hocBaSubjectAverages[subjectIndex].toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="hidden">
                      <label className="mb-2 block text-sm font-semibold text-slate-700">Nhập nhanh tổng học bạ</label>
                      <input type="number" min="0" max="30" step="0.1" value={hasHocBaDetail ? results.hocBaTotal.toFixed(2) : state.hocBaQuickTotal} onChange={(event) => setQuickTotal(state.setHocBaQuickTotal, event.target.value)} disabled={hasHocBaDetail} className={`w-full rounded-md border px-3 py-2 text-right font-bold focus:outline-none focus:ring-2 focus:ring-red-500 ${hasHocBaDetail ? 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-500' : 'border-slate-200 bg-white text-red-800'}`} placeholder="0.0" />
                    </div>
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

          {(needsThpt || needsDgnl || isForeignGroup) && (
            <CardSection title="4. Điểm thi" icon={PenTool}>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {needsThpt && (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-slate-800">Kỳ thi THPT 2026</h4>
                    {[0, 1].map((index) => (
                      <div key={`thpt-${index}`} className="flex items-center gap-3">
                        <label className="w-16 text-sm text-slate-600">Môn {index + 1}</label>
                        <input
                          type="number"
                          min="0"
                          max="10"
                          step="0.1"
                          value={state.thpt[index]}
                          onChange={(event) => updateArrayValue(state.thpt, state.setThpt, index, event.target.value, 10)}
                          disabled={hasThptQuickTotal}
                          className={`w-full rounded-md border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 ${hasThptQuickTotal ? 'cursor-not-allowed bg-slate-100 text-slate-400' : ''}`}
                          placeholder="0.0"
                        />
                      </div>
                    ))}
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                      <div className="flex items-center gap-3">
                        <label className="w-16 text-sm font-medium text-slate-700">Môn 3</label>
                        <input
                          type="number"
                          min="0"
                          max="10"
                          step="0.1"
                          value={state.useEnglishCertificate ? results.englishConvertedScore : state.thpt[2]}
                          onChange={(event) => updateArrayValue(state.thpt, state.setThpt, 2, event.target.value, 10)}
                          disabled={state.useEnglishCertificate || hasThptQuickTotal}
                          className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-slate-100 disabled:text-slate-500"
                          placeholder="0.0"
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
                          <input
                            type="number"
                            min="0"
                            max={state.englishType === 'TOEIC' ? IU_ENGLISH_MAX.TOEIC_LR : IU_ENGLISH_MAX[state.englishType]}
                            step="0.1"
                            value={state.englishScore}
                            onChange={(event) => state.setEnglishScore(clampInput(event.target.value, state.englishType === 'TOEIC' ? IU_ENGLISH_MAX.TOEIC_LR : IU_ENGLISH_MAX[state.englishType]))}
                            className="rounded-md border border-slate-300 px-2 py-2 text-sm focus:ring-2 focus:ring-red-500"
                            placeholder={state.englishType === 'TOEIC' ? 'Nghe đọc' : 'Điểm CC'}
                          />
                          {state.englishType === 'TOEIC' ? (
                            <input
                              type="number"
                              min="0"
                              max={IU_ENGLISH_MAX.TOEIC_SW}
                              step="0.1"
                              value={state.englishScore2}
                              onChange={(event) => state.setEnglishScore2(clampInput(event.target.value, IU_ENGLISH_MAX.TOEIC_SW))}
                              className="rounded-md border border-slate-300 px-2 py-2 text-sm focus:ring-2 focus:ring-red-500"
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
                    <div className="hidden">
                      <label className="mb-2 block text-sm font-semibold text-slate-700">Nhập nhanh tổng THPT</label>
                      <input type="number" min="0" max="30" step="0.1" value={hasThptDetail ? results.thptTotal.toFixed(2) : state.thptQuickTotal} onChange={(event) => setQuickTotal(state.setThptQuickTotal, event.target.value)} disabled={hasThptDetail} className={`w-full rounded-md border px-3 py-2 text-right font-bold focus:outline-none focus:ring-2 focus:ring-red-500 ${hasThptDetail ? 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-500' : 'border-slate-200 bg-white text-red-800'}`} placeholder="0.0" />
                    </div>
                    <QuickScoreInput
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
                  <div className="space-y-4">
                    <h4 className="font-semibold text-slate-800">Kỳ thi ĐGNL 2026</h4>
                    <input
                      type="number"
                      min="0"
                      max="1200"
                      value={state.dgnl}
                      onChange={(event) => state.setDgnl(clampInput(event.target.value, 1200))}
                      className="w-full rounded-md border border-slate-200 px-3 py-2 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="VD: 850"
                    />
                  </div>
                )}

                {isForeignGroup && (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-slate-800">Điểm phỏng vấn</h4>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={state.interview}
                      onChange={(event) => state.setInterview(clampInput(event.target.value, 100))}
                      className="w-full rounded-md border border-slate-200 px-3 py-2 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Thang 100"
                    />
                  </div>
                )}
              </div>
            </CardSection>
          )}

          <CardSection title="5. Điểm cộng & ưu tiên" icon={Award}>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Khu vực</label>
                <select
                  value={state.kv}
                  onChange={(event) => state.setKv(event.target.value)}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  {KHU_VUC.map((item) => (
                    <option key={item.id} value={item.id}>{item.name} (+{item.points})</option>
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
                    <option key={item.id} value={item.id}>{item.name} (+{item.points})</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="mb-4 font-semibold text-slate-800">Điểm cộng (Max 10)</h4>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Điểm thưởng (Max 10)</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    value={state.achievementBonus}
                    onChange={(event) => state.setAchievementBonus(clampInput(event.target.value, 10))}
                    className="w-full rounded-md border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="0.0"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Xét thưởng (Max 5)</label>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={state.awardBonus}
                    onChange={(event) => state.setAwardBonus(clampInput(event.target.value, 5))}
                    className="w-full rounded-md border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="0.0"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Khuyến khích NN (Max 5)</label>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={state.englishBonus}
                    onChange={(event) => state.setEnglishBonus(clampInput(event.target.value, 5))}
                    disabled={state.useEnglishCertificate}
                    className="w-full rounded-md border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-slate-100 disabled:text-slate-400"
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

        <div className="hidden lg:block lg:w-96">{resultCard}</div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-between border-t border-slate-200 bg-white p-4 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.1)] lg:hidden">
        <div>
          <div className="mb-0.5 text-xs font-medium text-slate-500">Điểm xét tuyển</div>
          <div className="text-2xl font-extrabold leading-none text-red-700">
            {results.total.toFixed(2)}
            <span className="text-sm font-normal text-slate-500"> / 100</span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setShowMobileResultModal(true)}
          className="flex items-center gap-2 rounded-xl bg-red-700 px-6 py-3 font-semibold text-white shadow-md transition-colors hover:bg-red-800"
        >
          Xem chi tiết
        </button>
      </div>

      {showMobileResultModal && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-slate-900/50 p-0 backdrop-blur-sm animate-in fade-in sm:items-center sm:p-4 lg:hidden">
          <div className="relative max-h-[90vh] w-full overflow-y-auto rounded-t-3xl bg-white sm:max-w-md sm:rounded-2xl">
            <button
              type="button"
              onClick={() => setShowMobileResultModal(false)}
              className="absolute right-4 top-4 z-20 rounded-full bg-black/20 p-1.5 text-white/70 backdrop-blur-sm transition-colors hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="[&>div]:static [&>div]:rounded-none [&>div]:border-0 [&>div]:shadow-none">
              {resultCard}
            </div>
          </div>
        </div>
      )}

      {showEnglishConversionTable && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800">Bảng quy đổi chứng chỉ ngoại ngữ IU</h3>
              <button
                type="button"
                onClick={() => setShowEnglishConversionTable(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1.45fr_1fr]">
                {[
                  {
                    title: 'IELTS',
                    tone: 'blue',
                    rows: [
                      ['>= 7.0', '10.0'],
                      ['6.5', '9.5'],
                      ['6.0', '9.0'],
                      ['5.5', '8.5'],
                      ['5.0', '8.0'],
                    ],
                  },
                  {
                    title: 'TOEFL iBT',
                    tone: 'emerald',
                    rows: [
                      ['>= 94', '10.0'],
                      ['79 - 93', '9.5'],
                      ['60 - 78', '9.0'],
                      ['46 - 59', '8.5'],
                      ['35 - 45', '8.0'],
                    ],
                  },
                  {
                    title: 'TOEIC',
                    tone: 'amber',
                    rows: [
                      ['>= 850 + 310', '10.0'],
                      ['785 - 845 + 280 - 300', '9.5'],
                      ['650 - 780 + 250 - 270', '9.0'],
                      ['550 - 645 + 200 - 240', '8.5'],
                      ['450 - 545 + 160 - 190', '8.0'],
                    ],
                  },
                  {
                    title: 'Cambridge',
                    tone: 'indigo',
                    rows: [
                      ['>= 185', '10.0'],
                      ['176 - 184', '9.5'],
                      ['169 - 175', '9.0'],
                      ['160 - 168', '8.5'],
                      ['154 - 159', '8.0'],
                    ],
                  },
                ].map((table) => {
                  const toneClass = {
                    blue: 'bg-blue-50 text-blue-800',
                    emerald: 'bg-emerald-50 text-emerald-800',
                    amber: 'bg-amber-50 text-amber-800',
                    indigo: 'bg-indigo-50 text-indigo-800',
                  }[table.tone];

                  return (
                    <div key={table.title}>
                      <h4 className={`mb-3 rounded-lg py-2 text-center font-bold ${toneClass}`}>
                        {table.title}
                      </h4>
                      <table className="w-full border-collapse text-center text-sm">
                        <thead>
                          <tr className="border-b-2 border-slate-200 text-slate-600">
                            <th className="py-2 font-medium">
                              {table.title === 'TOEIC' ? 'Điểm (L&R + S&W)' : 'Điểm'}
                            </th>
                            <th className="py-2 font-medium">Quy đổi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {table.rows.map(([score, converted]) => (
                          <tr key={`${table.title}-${converted}`} className="hover:bg-slate-50">
                              <td className="whitespace-nowrap px-2 py-2 text-slate-700">{score}</td>
                              <td className="w-20 whitespace-nowrap px-2 py-2 font-semibold text-blue-700">{converted}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 rounded-lg border border-amber-100 bg-amber-50 p-4 text-sm text-amber-800">
                Nếu đã dùng chứng chỉ ngoại ngữ để thay thế môn tiếng Anh trong tổ hợp THPT, chứng chỉ đó không được tính thêm vào điểm khuyến khích.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
