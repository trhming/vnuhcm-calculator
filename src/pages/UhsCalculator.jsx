import { useState } from 'react';
import {
  Award,
  Calculator,
  CheckCircle2,
  ExternalLink,
  HeartPulse,
  Info,
  PenTool,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { CardSection } from '../components/common/CardSection';
import { QuickScoreInput } from '../components/common/QuickScoreInput';
import { KHU_VUC, DOI_TUONG } from '../constants/common';
import { UHS_LANG_MAX, UHS_LANG_TYPES } from '../constants/uhs';
import { useUhsCalculator } from '../hooks/useUhsCalculator';

const clampInput = (value, max) => {
  if (value === '') return '';
  const number = parseFloat(value);
  if (Number.isNaN(number)) return value;
  return Math.min(Math.max(number, 0), max).toString();
};

const UHS_TOEIC_MAX = {
  lr: 990,
  sw: 400,
};

const clampNumber = (value, min, max) => {
  const number = parseInt(value, 10);
  if (Number.isNaN(number)) return min;
  return Math.min(Math.max(number, min), max);
};

export const UhsCalculator = () => {
  const { state, results } = useUhsCalculator();
  const [showMobileResultModal, setShowMobileResultModal] = useState(false);

  const subjects = ['Môn 1', 'Môn 2', 'Môn 3'];
  const computedC = 100 - state.a - state.b;
  const isWeightValid = computedC >= 0 && computedC <= 25 && state.a >= 40 && state.b <= 35;

  const updateArrayValue = (values, setter, index, value, max) => {
    const nextValues = [...values];
    nextValues[index] = clampInput(value, max);
    setter(nextValues);
  };

  const hasThptDetail = state.thpt.some((value) => value !== '');
  const hasThptQuickTotal = state.thptQuickTotal !== '';
  const hasHocBaDetail = state.hocBa.some((value) => value !== '');
  const hasHocBaQuickTotal = state.hocBaQuickTotal !== '';
  const setQuickTotal = (setter, value) => setter(clampInput(value, 30));

  const updateWeight = (key, value) => {
    if (key === 'a') state.setA(clampNumber(value, 40, 100));
    if (key === 'b') state.setB(clampNumber(value, 0, 35));
  };

  const resultCard = (
    <div className="w-full overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-2xl sticky top-24">
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-800 to-emerald-800 p-6 text-white">
        <div className="absolute right-0 top-0 p-4 opacity-10">
          <Calculator className="h-24 w-24" />
        </div>
        <h2 className="mb-1 text-lg font-medium text-blue-100">Điểm xét tuyển</h2>
        <div className="mb-2 text-5xl font-extrabold tracking-tight">
          {results.total.toFixed(1)}
          <span className="text-xl font-normal text-blue-100"> / 100</span>
        </div>
        <p className="mt-2 text-sm text-blue-100">Các điểm thành phần làm tròn 0.1</p>
      </div>

      <div className="space-y-5 p-6">
        <div>
          <div className="mb-3 rounded-xl bg-blue-50 p-3 text-sm text-blue-900">
            <div className="font-semibold">
              ĐHL = ĐGNL x {state.a}% + THPT x {state.b}% + Học bạ x {results.cWeight}%
            </div>
            <div className="mt-2 flex justify-between font-bold">
              <span>ĐHL</span>
              <span>{results.dhl.toFixed(1)}</span>
            </div>
          </div>
          <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">Điểm học lực</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">ĐGNL chuẩn hóa</span>
              <span className="font-semibold">{results.dgnl100.toFixed(1)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">THPT chuẩn hóa</span>
              <span className="font-semibold">{results.thpt100.toFixed(1)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Học bạ chuẩn hóa</span>
              <span className="font-semibold">{results.hocBa100.toFixed(1)}</span>
            </div>
          </div>
        </div>

        <div className="h-px bg-slate-100" />

        <div>
          <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">Điểm cộng & Ưu tiên</h3>
          <div className="space-y-4 text-sm">
            <div className="space-y-1">
              <div className="flex items-center justify-between text-slate-600">
                <span>Cộng ngoại ngữ</span>
                <span>+{results.bonusLanguage.toFixed(1)}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Cộng SAT</span>
                <span>+{results.bonusSat.toFixed(1)}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Cộng HSG</span>
                <span>+{results.bonusHsg.toFixed(1)}</span>
              </div>
              <div className="flex items-center justify-between rounded bg-amber-50 p-2 font-medium text-amber-900 border border-amber-100">
                <span>Tổng điểm cộng</span>
                <span className="font-bold text-amber-700">+{results.bonusTotal.toFixed(1)}</span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-slate-600">
                <span>Ưu tiên KV/ĐT (Gốc)</span>
                <span>+{results.priority100.toFixed(1)}</span>
              </div>
              <div className="flex items-center justify-between rounded bg-emerald-50 p-2 font-medium text-emerald-900 border border-emerald-100">
                <span>Ưu tiên thực nhận</span>
                <span className="font-bold text-emerald-700">+{results.priorityAccepted.toFixed(1)}</span>
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
        <h1 className="flex items-center gap-3 text-3xl font-extrabold tracking-tight text-blue-900">
          <HeartPulse className="h-8 w-8 text-blue-700" />
          Máy tính điểm UHS 2026
        </h1>
        <p className="mt-2 text-slate-500">
          Phương thức tổng hợp của Trường Đại học Khoa học Sức khỏe - ĐHQG-HCM.
        </p>
        <a
          href="https://tuyensinh.uhsvnu.edu.vn/news.php?slug=phuonghuong"
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex items-center gap-2 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-800 transition-colors hover:border-blue-200 hover:bg-blue-100"
        >
          Xem phương thức tuyển sinh UHS
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="flex-1 space-y-6">
          <CardSection title="1. Trọng số a, b, c" icon={SlidersHorizontal}>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {[
                ['a', 'ĐGNL', state.a, '>= 40%'],
                ['b', 'THPT', state.b, '<= 35%'],
              ].map(([key, label, value, note]) => (
                <div key={key}>
                  <div className="mb-2 flex justify-between text-sm">
                    <label className="font-semibold text-slate-700">{key} - {label}</label>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min={key === 'a' ? 40 : 0}
                        max={key === 'a' ? 100 : 35}
                        step="1"
                        value={value}
                        onChange={(event) => updateWeight(key, event.target.value)}
                        className="w-14 rounded-md border border-blue-200 px-2 py-1 text-right text-sm font-bold text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700"
                      />
                      <span className="font-bold text-blue-700">%</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min={key === 'a' ? 40 : 0}
                    max={key === 'a' ? 100 : 35}
                    step="1"
                    value={value}
                    onChange={(event) => updateWeight(key, event.target.value)}
                    className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-blue-700"
                  />
                  <div className="mt-1 text-xs text-slate-500">{note}</div>
                </div>
              ))}
              <div className={`rounded-xl border p-4 ${isWeightValid ? 'border-blue-100 bg-blue-50' : 'border-amber-200 bg-amber-50'}`}>
                <div className={`text-sm font-semibold ${isWeightValid ? 'text-blue-900' : 'text-amber-900'}`}>c - Học bạ</div>
                <div className={`mt-1 text-3xl font-extrabold ${isWeightValid ? 'text-blue-700' : 'text-amber-700'}`}>{computedC}%</div>
                <div className={`mt-1 text-xs ${isWeightValid ? 'text-blue-800/70' : 'text-amber-800'}`}>
                  Tự tính = 100 - a - b
                </div>
                {!isWeightValid && (
                  <div className="mt-2 text-xs font-medium text-amber-800">
                    c nên nằm trong khoảng 0% - 25%.
                  </div>
                )}
              </div>
            </div>
            <div className={`mt-5 flex gap-3 rounded-lg border p-4 text-sm ${isWeightValid ? 'border-blue-100 bg-blue-50 text-blue-900' : 'border-amber-200 bg-amber-50 text-amber-900'}`}>
              <Info className={`mt-0.5 h-5 w-5 shrink-0 ${isWeightValid ? 'text-blue-700' : 'text-amber-600'}`} />
              <p>
                Điều kiện hợp lệ: a &gt;= 40%, b &lt;= 35%, c &lt;= 25%, và a + b + c = 100%.
              </p>
            </div>
          </CardSection>

          <CardSection title="2. Học bạ" icon={PenTool}>
            <div className="space-y-4">
              <h4 className="mb-3 font-semibold text-slate-800">Học bạ 3 môn</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-slate-600">
                    <tr>
                      <th className="rounded-tl-lg px-3 py-2 text-left font-semibold">Môn</th>
                      <th className="px-3 py-2 font-semibold">Lớp 10</th>
                      <th className="px-3 py-2 font-semibold">Lớp 11</th>
                      <th className="rounded-tr-lg px-3 py-2 font-semibold">Lớp 12</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {subjects.map((subject, subjectIndex) => (
                      <tr key={`hocba-${subject}`}>
                        <td className="px-3 py-2 font-medium text-slate-700">{subject}</td>
                        {[0, 1, 2].map((yearIndex) => {
                          const cellIndex = subjectIndex * 3 + yearIndex;
                          return (
                            <td key={cellIndex} className="px-1 py-2">
                              <input
                                type="number"
                                min="0"
                                max="10"
                                step="0.1"
                                value={state.hocBa[cellIndex]}
                                onChange={(event) => updateArrayValue(state.hocBa, state.setHocBa, cellIndex, event.target.value, 10)}
                                disabled={hasHocBaQuickTotal}
                                className={`w-full rounded-md border border-slate-200 px-2 py-2 text-center focus:outline-none focus:ring-2 focus:ring-blue-700 ${hasHocBaQuickTotal ? 'cursor-not-allowed bg-slate-100 text-slate-400' : ''}`}
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
              <div className="hidden">
                <label className="mb-2 block text-sm font-semibold text-slate-700">Nhập nhanh tổng học bạ</label>
                <input type="number" min="0" max="30" step="0.1" value={hasHocBaDetail ? results.hocBaTotal.toFixed(1) : state.hocBaQuickTotal} onChange={(event) => setQuickTotal(state.setHocBaQuickTotal, event.target.value)} disabled={hasHocBaDetail} className={`w-full rounded-md border px-3 py-2 text-right font-bold focus:outline-none focus:ring-2 focus:ring-blue-700 ${hasHocBaDetail ? 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-500' : 'border-slate-200 bg-white text-blue-800'}`} placeholder="0.0" />
              </div>
              <QuickScoreInput
                title="Nhập nhanh tổng học bạ"
                value={hasHocBaDetail ? results.hocBaTotal.toFixed(2) : state.hocBaQuickTotal}
                onChange={(event) => setQuickTotal(state.setHocBaQuickTotal, event.target.value)}
                disabled={hasHocBaDetail}
                step="0.01"
                placeholder="0.00"
              />
            </div>
          </CardSection>

          <CardSection title="3. Điểm thi" icon={PenTool}>
            <div className="space-y-6">
              <div>
                <h4 className="mb-3 font-semibold text-slate-800">Đánh giá năng lực</h4>
                <input
                  type="number"
                  min="0"
                  max="1200"
                  value={state.dgnl}
                  onChange={(event) => state.setDgnl(clampInput(event.target.value, 1200))}
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-700"
                  placeholder="VD: 850"
                />
              </div>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="hidden">
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Nhập nhanh tổng THPT</label>
                  <input type="number" min="0" max="30" step="0.1" value={hasThptDetail ? results.thptTotal.toFixed(1) : state.thptQuickTotal} onChange={(event) => setQuickTotal(state.setThptQuickTotal, event.target.value)} disabled={hasThptDetail} className={`w-full rounded-md border px-3 py-2 text-right font-bold focus:outline-none focus:ring-2 focus:ring-blue-700 ${hasThptDetail ? 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-500' : 'border-slate-200 bg-white text-blue-800'}`} placeholder="0.0" />
                </div>

                <div>
                  <h4 className="mb-3 font-semibold text-slate-800">Điểm THPT 3 môn</h4>
                  <div className="space-y-3">
                    {subjects.map((subject, index) => (
                      <div key={`thpt-${subject}`} className="flex items-center gap-3">
                        <label className="w-16 text-sm text-slate-600">{subject}</label>
                        <input
                          type="number"
                          min="0"
                          max="10"
                          step="0.1"
                          value={state.thpt[index]}
                          onChange={(event) => updateArrayValue(state.thpt, state.setThpt, index, event.target.value, 10)}
                          disabled={hasThptQuickTotal}
                          className={`w-full rounded-md border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-700 ${hasThptQuickTotal ? 'cursor-not-allowed bg-slate-100 text-slate-400' : ''}`}
                          placeholder="0.0"
                        />
                      </div>
                    ))}
                  </div>
                  <QuickScoreInput
                    title="Nhập nhanh tổng THPT"
                    value={hasThptDetail ? results.thptTotal.toFixed(2) : state.thptQuickTotal}
                    onChange={(event) => setQuickTotal(state.setThptQuickTotal, event.target.value)}
                    disabled={hasThptDetail}
                    step="0.01"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>
          </CardSection>

          <CardSection title="4. Điểm cộng tích lũy" icon={Award}>
            <div className="space-y-4">
              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
                <input
                  type="checkbox"
                  checked={state.hasLanguage}
                  onChange={(event) => state.setHasLanguage(event.target.checked)}
                  className="h-4 w-4 rounded text-blue-700 focus:ring-blue-700"
                />
                <span className="text-sm font-medium text-slate-700">Có chứng chỉ ngoại ngữ</span>
              </label>
              {state.hasLanguage && (
                <div className="grid grid-cols-1 gap-4 rounded-xl border border-blue-100 bg-blue-50 p-4 md:grid-cols-3">
                  <select
                    value={state.languageType}
                    onChange={(event) => {
                      state.setLanguageType(event.target.value);
                      state.setLanguageScore('');
                      state.setLanguageScore2('');
                    }}
                    className="rounded-md border border-blue-200 bg-white px-3 py-2 focus:ring-2 focus:ring-blue-700"
                  >
                    {UHS_LANG_TYPES.map((type) => (
                      <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min="0"
                    max={state.languageType === 'TOEIC' ? UHS_TOEIC_MAX.lr : UHS_LANG_MAX[state.languageType]}
                    value={state.languageScore}
                    onChange={(event) => state.setLanguageScore(clampInput(event.target.value, state.languageType === 'TOEIC' ? UHS_TOEIC_MAX.lr : UHS_LANG_MAX[state.languageType]))}
                    className="rounded-md border border-blue-200 px-3 py-2 focus:ring-2 focus:ring-blue-700"
                    placeholder={state.languageType === 'TOEIC' ? 'L&R' : 'Điểm chứng chỉ'}
                  />
                  {state.languageType === 'TOEIC' ? (
                    <input
                      type="number"
                      min="0"
                      max={UHS_TOEIC_MAX.sw}
                      value={state.languageScore2}
                      onChange={(event) => state.setLanguageScore2(clampInput(event.target.value, UHS_TOEIC_MAX.sw))}
                      className="rounded-md border border-blue-200 px-3 py-2 focus:ring-2 focus:ring-blue-700"
                      placeholder="S&W"
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-sm font-medium text-emerald-700">
                      <CheckCircle2 className="h-4 w-4" />
                      +{results.bonusLanguage.toFixed(1)} điểm
                    </div>
                  )}
                  {state.languageType === 'TOEIC' && (
                    <div className="text-sm font-medium text-emerald-700 md:col-span-3">
                      Điểm cộng ngoại ngữ: +{results.bonusLanguage.toFixed(1)}
                    </div>
                  )}
                </div>
              )}

              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
                <input
                  type="checkbox"
                  checked={state.hasSat}
                  onChange={(event) => state.setHasSat(event.target.checked)}
                  className="h-4 w-4 rounded text-blue-700 focus:ring-blue-700"
                />
                <span className="text-sm font-medium text-slate-700">Có SAT từ 1280 trở lên</span>
              </label>
              {state.hasSat && (
                <input
                  type="number"
                  min="0"
                  max="1600"
                  value={state.satScore}
                  onChange={(event) => state.setSatScore(clampInput(event.target.value, 1600))}
                  className="w-full rounded-md border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-700"
                  placeholder="Điểm SAT"
                />
              )}

              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={state.hasSpecialSchool}
                    onChange={(event) => state.setHasSpecialSchool(event.target.checked)}
                    className="h-4 w-4 rounded text-blue-700 focus:ring-blue-700"
                  />
                  <span className="text-sm font-medium text-slate-700">Học tập &gt;= 2 năm tại trường Chuyên/PTNK</span>
                </label>
                <label className="mt-3 flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={state.hasGoodAcademic}
                    onChange={(event) => state.setHasGoodAcademic(event.target.checked)}
                    className="h-4 w-4 rounded text-blue-700 focus:ring-blue-700"
                  />
                  <span className="text-sm font-medium text-slate-700">Trung bình học lực 3 năm từ Tốt trở lên</span>
                </label>
                {(state.hasSpecialSchool || state.hasGoodAcademic) && (
                  <input
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    value={state.hsgAverage}
                    onChange={(event) => state.setHsgAverage(clampInput(event.target.value, 10))}
                    className="mt-3 w-full rounded-md border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-700"
                    placeholder="Trung bình cộng 3 năm THPT"
                  />
                )}
              </div>
            </div>
          </CardSection>

          <CardSection title="5. Ưu tiên khu vực & đối tượng" icon={Info}>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Khu vực</label>
                <select
                  value={state.kv}
                  onChange={(event) => state.setKv(event.target.value)}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-700"
                >
                  {KHU_VUC.map((item) => (
                    <option key={item.id} value={item.id}>{item.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Đối tượng</label>
                <select
                  value={state.dt}
                  onChange={(event) => state.setDt(event.target.value)}
                  className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-700"
                >
                  {DOI_TUONG.map((item) => (
                    <option key={item.id} value={item.id}>{item.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </CardSection>
        </div>

        <div className="hidden lg:block lg:w-96">{resultCard}</div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-between border-t border-slate-200 bg-white p-4 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.1)] lg:hidden">
        <div>
          <div className="mb-0.5 text-xs font-medium text-slate-500">Tổng điểm xét tuyển</div>
          <div className="text-2xl font-extrabold leading-none text-blue-700">
            {results.total.toFixed(1)}
            <span className="text-sm font-normal text-slate-500"> / 100</span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setShowMobileResultModal(true)}
          className="rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white shadow-md transition-colors hover:bg-blue-800"
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
    </div>
  );
};
