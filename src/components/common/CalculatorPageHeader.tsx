import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Bookmark, ChevronDown, Download, ExternalLink, RotateCcw, Trash2 } from 'lucide-react';
import { SCHOOL_UI_META, type SchoolId } from '../../constants/schoolUiMeta';
import type { SchoolImportSource, SchoolPreset } from '../../utils/calculatorStorage';

type CalculatorPageHeaderProps = {
  schoolId: SchoolId;
  acronym: string;
  title: string;
  subtitle: string;
  importSources: SchoolImportSource[];
  hasMeaningfulInput: boolean;
  onImportFromSchool: (sourceSchoolId: SchoolId) => void;
  onReset: () => void;
  presets?: SchoolPreset[];
  onSavePreset?: (name: string) => void;
  onLoadPreset?: (presetId: string) => void;
  onDeletePreset?: (presetId: string) => void;
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
  presets = [],
  onSavePreset,
  onLoadPreset,
  onDeletePreset,
}: CalculatorPageHeaderProps) => {
  const meta = SCHOOL_UI_META[schoolId];
  const [menuOpen, setMenuOpen] = useState(false);
  const [presetsOpen, setPresetsOpen] = useState(false);
  const [presetName, setPresetName] = useState('');
  const menuContainerRef = useRef<HTMLDivElement | null>(null);
  const presetsContainerRef = useRef<HTMLDivElement | null>(null);

  const hasMultipleSources = importSources.length > 1;
  const singleSource = importSources.length === 1 ? importSources[0] : null;
  const canImport = importSources.length > 0;
  const isMenuOpen = menuOpen && hasMultipleSources;

  useEffect(() => {
    if (!isMenuOpen && !presetsOpen) return undefined;

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (isMenuOpen && menuContainerRef.current && !menuContainerRef.current.contains(target)) {
        setMenuOpen(false);
      }
      if (presetsOpen && presetsContainerRef.current && !presetsContainerRef.current.contains(target)) {
        setPresetsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        setPresetsOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMenuOpen, presetsOpen]);

  const handleImportClick = () => {
    if (!canImport) return;
    setPresetsOpen(false);
    if (singleSource) {
      onImportFromSchool(singleSource.schoolId);
      return;
    }
    setMenuOpen((prev) => !prev);
  };

  const handleSavePresetSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!hasMeaningfulInput || !onSavePreset) return;
    onSavePreset(presetName);
    setPresetName('');
  };

  return (
    <header className="mb-7 space-y-3 border-b border-hairline pb-5">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 rounded-control px-1 py-0.5 text-xs font-medium text-ink-muted transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 print:hidden"
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

        <div className="relative flex flex-wrap items-center gap-2 print:hidden lg:shrink-0">
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
              className={`btn-tactile inline-flex min-h-[44px] items-center gap-1.5 border px-3 py-1.5 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 sm:min-h-[38px] ${
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
                className="absolute left-0 top-full z-40 mt-1.5 w-72 max-w-[calc(100vw-2rem)] overflow-hidden rounded-panel border border-hairline bg-surface-elevated p-1.5 shadow-xl animate-in fade-in duration-200 lg:left-auto lg:right-0"
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

          {onSavePreset && (
            <div className="sm:relative" ref={presetsContainerRef}>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  setPresetsOpen((prev) => !prev);
                }}
                aria-haspopup="dialog"
                aria-expanded={presetsOpen}
                title="Lưu và chuyển nhanh nhiều kịch bản điểm"
                className="btn-tactile inline-flex min-h-[44px] items-center gap-1.5 border border-hairline bg-surface px-3 py-1.5 text-xs font-semibold text-ink hover:border-hairline-hover hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 sm:min-h-[38px]"
              >
                <Bookmark className="h-3.5 w-3.5" />
                <span>
                  Kịch bản
                  {presets.length > 0 && (
                    <span className="ml-1 font-mono tabular-nums text-ink-muted">({presets.length})</span>
                  )}
                </span>
              </button>

              {presetsOpen && (
                <div
                  role="dialog"
                  aria-label="Kịch bản đã lưu"
                  className="absolute inset-x-0 top-full z-40 mt-1.5 overflow-hidden rounded-panel border border-hairline bg-surface-elevated p-3 shadow-xl animate-in fade-in duration-200 sm:inset-x-auto sm:left-0 sm:w-80 lg:left-auto lg:right-0"
                >
                  <div className="mb-2 flex items-center justify-between text-xs font-semibold text-ink">
                    <span>Kịch bản điểm {acronym}</span>
                    <span className="font-mono text-[11px] tabular-nums text-ink-muted">
                      {presets.length}/5
                    </span>
                  </div>

                  <form onSubmit={handleSavePresetSubmit} className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={presetName}
                      onChange={(event) => setPresetName(event.target.value)}
                      maxLength={28}
                      placeholder="VD: A00, A01, ĐGNL đợt 2"
                      aria-label="Tên kịch bản"
                      className="min-h-[38px] flex-1 rounded-control border border-hairline bg-surface px-2.5 py-1.5 text-xs text-ink placeholder:text-ink-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                    />
                    <button
                      type="submit"
                      disabled={!hasMeaningfulInput}
                      className={`btn-tactile inline-flex min-h-[38px] items-center px-3 py-1.5 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                        hasMeaningfulInput
                          ? 'bg-blue-700 text-white hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500'
                          : 'cursor-not-allowed bg-surface-subtle text-ink-muted opacity-60'
                      }`}
                    >
                      Lưu
                    </button>
                  </form>

                  {presets.length > 0 ? (
                    <div className="mt-2.5 max-h-60 divide-y divide-hairline overflow-y-auto border-t border-hairline pt-1">
                      {presets.map((preset) => (
                        <div key={preset.id} className="flex items-center justify-between gap-1.5 py-1">
                          <button
                            type="button"
                            onClick={() => {
                              onLoadPreset?.(preset.id);
                              setPresetsOpen(false);
                            }}
                            className="btn-tactile flex min-h-[36px] min-w-0 flex-1 items-center justify-between gap-2 px-2 py-1 text-left hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                          >
                            <span className="truncate text-xs font-semibold text-ink">
                              {preset.name}
                            </span>
                            <span className={`shrink-0 font-mono text-xs font-bold tabular-nums ${meta.accentText}`}>
                              {preset.total.toFixed(2)}
                            </span>
                          </button>

                          <button
                            type="button"
                            onClick={() => onDeletePreset?.(preset.id)}
                            aria-label={`Xóa kịch bản ${preset.name}`}
                            title="Xóa kịch bản"
                            className="btn-tactile inline-flex h-8 w-8 shrink-0 items-center justify-center text-ink-muted hover:bg-red-500/10 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 dark:hover:text-red-400"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-2.5 text-xs leading-relaxed text-ink-muted">
                      Lưu các tổ hợp khác nhau (A00, A01...) để chuyển nhanh mà không nhập lại.
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          <button
            type="button"
            onClick={onReset}
            disabled={!hasMeaningfulInput}
            title="Đặt lại toàn bộ ô nhập về mặc định"
            className={`btn-tactile inline-flex min-h-[44px] items-center gap-1.5 border px-3 py-1.5 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 sm:min-h-[38px] ${
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
            className={`btn-tactile inline-flex min-h-[44px] items-center gap-1.5 border px-3 py-1.5 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 sm:min-h-[38px] ${meta.softButton}`}
          >
            <span>Đề án 2026</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </header>
  );
};
