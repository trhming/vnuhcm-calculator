import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink, Trash2 } from 'lucide-react';
import { SCHOOLS } from '../constants/common';
import { SCHOOL_UI_META } from '../constants/schoolUiMeta';
import { useScoresSummary } from '../hooks/useScoresSummary';
import { useToast } from '../hooks/useToast';
import {
  backupAllCalculatorData,
  clearAllCalculatorData,
  restoreAllCalculatorData,
} from '../utils/calculatorStorage';

export const Home = () => {
  const summary = useScoresSummary();
  const { showToast } = useToast();

  const calculatorSchools = SCHOOLS.filter((school) => school.id !== 'uit');
  const uitSchool = SCHOOLS.find((school) => school.id === 'uit');
  const uitMeta = SCHOOL_UI_META.uit;
  const uitDomain = new URL(uitMeta.officialUrl).hostname;

  const savedSchools = calculatorSchools
    .filter((school) => summary[school.id] && typeof summary[school.id].total === 'number')
    .map((school) => ({
      school,
      meta: SCHOOL_UI_META[school.id],
      data: summary[school.id],
    }));

  const handleClearAllSaved = () => {
    const backup = backupAllCalculatorData();
    clearAllCalculatorData();
    showToast({
      type: 'info',
      title: 'Đã xóa dữ liệu đã lưu',
      duration: 5000,
      action: {
        label: 'Hoàn tác',
        onClick: () => restoreAllCalculatorData(backup),
      },
    });
  };

  return (
    <div className="space-y-8 pb-8 animate-in fade-in">
      <header className="border-b border-hairline pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Tính điểm xét tuyển ĐHQG-HCM 2026
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-ink-secondary sm:text-base">
          Tính nhanh điểm xét tuyển phương thức tổng hợp cho các trường thành viên.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
        {/* Left Column — School Directory */}
        <div className="space-y-6">
          <section className="space-y-4">
            <h2 className="text-base font-semibold tracking-tight text-ink sm:text-lg">
              Trường thành viên
            </h2>

            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              {calculatorSchools.map((school) => {
                const Icon = school.icon;
                const meta = SCHOOL_UI_META[school.id];
                const savedScore = summary[school.id];

                return (
                  <Link
                    key={school.id}
                    to={`/${school.slug}`}
                    className={`group flex items-center justify-between gap-4 rounded-card border border-hairline bg-surface p-4 transition-[border-color,background-color,transform] duration-150 hover:bg-surface-subtle active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 sm:p-5 ${meta.cardHover}`}
                  >
                    <div className="flex min-w-0 items-center gap-3.5">
                      <span className={`shrink-0 rounded-panel p-2.5 ${meta.iconWrap}`}>
                        <Icon className="h-5 w-5" />
                      </span>
                      <div className="min-w-0">
                        <h3 className="font-mono text-base font-bold tracking-tight text-ink">
                          {school.acronym}
                        </h3>
                        <p className="mt-0.5 text-xs leading-snug text-ink-secondary">
                          {school.name}
                        </p>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2.5">
                      {savedScore && (
                        <div className="text-right font-mono tabular-nums">
                          <span className={`text-base font-bold ${meta.accentText}`}>
                            {savedScore.total.toFixed(2)}
                          </span>
                          <span className="ml-0.5 text-[11px] text-ink-muted">/100</span>
                        </div>
                      )}
                      <ArrowRight className="h-4 w-4 shrink-0 text-ink-muted transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-ink" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          {uitSchool && (
            <section className="space-y-3 border-t border-hairline pt-6">
              <h2 className="text-xs font-semibold text-ink-muted">
                Cổng thông tin khác
              </h2>
              <a
                href={uitMeta.officialUrl}
                target="_blank"
                rel="noreferrer"
                className={`group flex flex-wrap items-center justify-between gap-4 rounded-card border border-hairline bg-surface p-4 transition-[border-color,background-color,transform] duration-150 hover:bg-surface-subtle active:scale-[0.995] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 sm:px-5 ${uitMeta.cardHover}`}
              >
                <div className="flex min-w-0 items-center gap-3.5">
                  <span className={`shrink-0 rounded-panel p-2.5 ${uitMeta.iconWrap}`}>
                    <uitSchool.icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <span className="block font-mono text-base font-bold tracking-tight text-ink">
                      {uitSchool.acronym}
                    </span>
                    <span className="mt-0.5 block text-xs leading-snug text-ink-secondary">
                      {uitSchool.name}
                    </span>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 font-mono text-xs text-ink-muted transition-colors group-hover:text-ink">
                  {uitDomain}
                  <ExternalLink className="h-3.5 w-3.5" />
                </span>
              </a>
            </section>
          )}
        </div>

        {/* Right Rail — Saved Scores Summary */}
        <aside>
          <section className="rounded-card border border-hairline bg-surface p-5">
            <div className="flex items-center justify-between gap-3 border-b border-hairline pb-3.5">
              <div className="flex items-baseline gap-2">
                <h2 className="text-base font-semibold text-ink">
                  Điểm đã tính
                </h2>
                <span className="font-mono text-xs tabular-nums text-ink-muted">
                  {savedSchools.length}/6
                </span>
              </div>

              {savedSchools.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearAllSaved}
                  className="btn-tactile inline-flex min-h-[32px] shrink-0 items-center gap-1 border border-hairline bg-surface-subtle px-2.5 py-1 text-xs font-medium text-ink-secondary hover:border-red-500/40 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 dark:hover:text-red-400"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Xóa tất cả
                </button>
              )}
            </div>

            {savedSchools.length > 0 ? (
              <div className="divide-y divide-hairline pt-1">
                {savedSchools.map(({ school, meta, data }) => {
                  const Icon = school.icon;

                  return (
                    <Link
                      key={school.id}
                      to={`/${school.slug}`}
                      className="group -mx-2 flex items-center justify-between gap-3 rounded-control px-2 py-3 transition-colors duration-150 hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                    >
                      <div className="flex min-w-0 items-center gap-2.5">
                        <span className={`shrink-0 rounded-control p-1.5 ${meta.iconWrap}`}>
                          <Icon className="h-4 w-4" />
                        </span>
                        <div className="min-w-0">
                          <span className="block font-mono text-sm font-bold text-ink">
                            {school.acronym}
                          </span>
                          <p className="truncate text-xs text-ink-muted">{school.name}</p>
                        </div>
                      </div>

                      <div className="shrink-0 text-right font-mono tabular-nums">
                        <div className={`text-sm font-bold ${meta.accentText}`}>
                          {data.total.toFixed(2)}
                          <span className="ml-0.5 text-xs font-normal text-ink-muted">/100</span>
                        </div>
                        {typeof data.base30 === 'number' && (
                          <div className="text-[11px] text-ink-muted">
                            {data.base30.toFixed(2)}/30
                          </div>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="pt-4">
                <p className="text-sm leading-relaxed text-ink-secondary">
                  Chọn một trường bên trái để bắt đầu tính. Điểm sẽ tự động lưu tại đây khi bạn quay lại.
                </p>
              </div>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
};
