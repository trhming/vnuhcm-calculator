import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ChevronDown, Download, ExternalLink, RotateCcw } from 'lucide-react';
import { SCHOOL_UI_META, type SchoolId } from '../../constants/schoolUiMeta';
import type { SchoolImportSource } from '../../utils/calculatorStorage';

type CalculatorPageHeaderProps = {
  schoolId: SchoolId;
  acronym: string;
  title: string;
  subtitle: string;
  importSources: SchoolImportSource[];
  hasMeaningfulInput: boolean;
  onImportFromSchool: (sourceSchoolId: SchoolId) => void;
  onReset: () => void;
};

export const CalculatorPageHeader = ({
  schoolId,
  acronym,
  title,
  subtitle,
  importSources,
  hasMeaningfulInput,
  onImportFromSchool,
  onReset,
}: CalculatorPageHeaderProps) => {
  const meta = SCHOOL_UI_META[schoolId];
  const [menuOpen, setMenuOpen] = useState(false);
  const menuContainerRef = useRef<HTMLDivElement | null>(null);

  const hasMultipleSources = importSources.length > 1;
  const singleSource = importSources.length === 1 ? importSources[0] : null;
  const canImport = importSources.length > 0;
  const isMenuOpen = menuOpen && hasMultipleSources;

  useEffect(() => {
    if (!isMenuOpen) return undefined;

    const handlePointerDown = (event: MouseEvent) => {
      if (menuContainerRef.current && !menuContainerRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMenuOpen]);

  const handleImportClick = () => {
    if (!canImport) return;
    if (singleSource) {
      onImportFromSchool(singleSource.schoolId);
      return;
    }
    setMenuOpen((prev) => !prev);
  };

  return (
    <header className="mb-7 space-y-3 border-b border-hairline pb-5">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 rounded-control px-1 py-0.5 text-xs font-medium text-ink-muted transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Trang chủ
      </Link>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              {title}
            </h1>
            <span className={`rounded-control px-2.5 py-0.5 font-mono text-xs font-bold ${meta.iconWrap}`}>
              {acronym}
            </span>
          </div>
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-ink-secondary">
            {subtitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 lg:shrink-0">
          <div className="relative" ref={menuContainerRef}>
            <button
              type="button"
              onClick={handleImportClick}
              disabled={!canImport}
              aria-haspopup={hasMultipleSources ? 'menu' : undefined}
              aria-expanded={hasMultipleSources ? isMenuOpen : undefined}
              title={
                singleSource
                  ? `${singleSource.acronym}: ${singleSource.preview}`
                  : hasMultipleSources
                  ? 'Chọn trường nguồn để lấy điểm'
                  : 'Chưa có điểm nào được lưu từ các trường khác'
              }
              className={`btn-tactile inline-flex min-h-[38px] items-center gap-1.5 border px-3 py-1.5 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                canImport
                  ? 'border-hairline bg-surface text-ink hover:border-hairline-hover hover:bg-surface-subtle'
                  : 'cursor-not-allowed border-hairline bg-surface-subtle text-ink-muted opacity-60'
              }`}
            >
              <Download className="h-3.5 w-3.5" />
              <span>{singleSource ? `Lấy từ ${singleSource.acronym}` : 'Lấy điểm chung'}</span>
              {hasMultipleSources && (
                <ChevronDown
                  className={`h-3.5 w-3.5 text-ink-muted transition-transform duration-150 ${
                    isMenuOpen ? 'rotate-180' : ''
                  }`}
                />
              )}
            </button>

            {isMenuOpen && (
              <div
                role="menu"
                aria-label="Chọn nguồn điểm để đồng bộ"
                className="absolute left-0 top-full z-40 mt-1.5 w-72 overflow-hidden rounded-panel border border-hairline bg-surface-elevated p-1.5 shadow-xl animate-in fade-in duration-200 lg:left-auto lg:right-0"
              >
                <div className="px-2.5 py-1.5 text-[11px] font-medium text-ink-muted">
                  Chọn nguồn điểm ({importSources.length} trường)
                </div>
                <div className="space-y-0.5">
                  {importSources.map((source) => {
                    const sourceMeta = SCHOOL_UI_META[source.schoolId];
                    return (
                      <button
                        key={source.schoolId}
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          setMenuOpen(false);
                          onImportFromSchool(source.schoolId);
                        }}
                        className="btn-tactile flex min-h-[44px] w-full flex-col items-start justify-center gap-0.5 px-2.5 py-2 text-left hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                      >
                        <span className={`font-mono text-xs font-bold ${sourceMeta.accentText}`}>
                          {source.acronym}
                        </span>
                        <span className="w-full truncate font-mono text-[11px] text-ink-secondary">
                          {source.preview}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onReset}
            disabled={!hasMeaningfulInput}
            title="Đặt lại toàn bộ ô nhập về mặc định"
            className={`btn-tactile inline-flex min-h-[38px] items-center gap-1.5 border px-3 py-1.5 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 ${
              hasMeaningfulInput
                ? 'border-hairline bg-surface text-ink-secondary hover:border-red-500/40 hover:text-red-600 dark:hover:text-red-400'
                : 'cursor-not-allowed border-hairline bg-surface-subtle text-ink-muted opacity-60'
            }`}
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Làm mới</span>
          </button>

          <a
            href={meta.officialUrl}
            target="_blank"
            rel="noreferrer"
            aria-label={`Đề án tuyển sinh ${acronym} 2026`}
            className={`btn-tactile inline-flex min-h-[38px] items-center gap-1.5 border px-3 py-1.5 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${meta.softButton}`}
          >
            <span>Đề án 2026</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </header>
  );
};
