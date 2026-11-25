import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, ExternalLink, Home, Menu, Moon, Sun, X } from 'lucide-react';
import { SCHOOLS } from '../../constants/common';
import { SCHOOL_UI_META, type SchoolId } from '../../constants/schoolUiMeta';
import { useTheme } from '../../hooks/useTheme';
import { useScoresSummary } from '../../hooks/useScoresSummary';

export const Navbar = () => {
  const { pathname } = useLocation();
  const { isDark, toggleTheme } = useTheme();
  const summary = useScoresSummary();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activeSchool = SCHOOLS.find((school) => `/${school.slug}` === pathname);
  const calculatorSchools = SCHOOLS.filter((school) => school.id !== 'uit');
  const uitSchool = SCHOOLS.find((school) => school.id === 'uit');
  const mobileSchools = [...calculatorSchools, ...(uitSchool ? [uitSchool] : [])];
  const uitMeta = SCHOOL_UI_META.uit;

  const scrollHomeToTop = () => {
    setMobileMenuOpen(false);
    if (pathname === '/') {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (!mobileMenuOpen) return undefined;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const mobileDrawer =
    mobileMenuOpen && typeof document !== 'undefined'
      ? createPortal(
          <>
            <div
              className="fixed inset-0 top-16 z-[55] bg-black/40 lg:hidden dark:bg-black/60"
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />
            <div
              role="region"
              aria-label="Menu chọn trường"
              className="fixed inset-x-0 top-16 z-[56] max-h-[calc(100vh-4rem)] origin-top overflow-y-auto border-b border-hairline bg-surface px-4 py-3 shadow-2xl animate-in fade-in duration-200 lg:hidden"
            >
              <div className="mx-auto max-w-7xl space-y-2">
                <Link
                  to="/"
                  onClick={scrollHomeToTop}
                  className={`btn-tactile flex min-h-[44px] items-center justify-between px-3 py-2 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                    pathname === '/'
                      ? 'bg-surface-subtle text-ink'
                      : 'text-ink-secondary hover:bg-surface-subtle hover:text-ink'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Home className="h-4 w-4" />
                    Trang chủ
                  </span>
                </Link>

                <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                  {mobileSchools.map((school) => {
                    const Icon = school.icon;
                    const isUit = school.id === 'uit';
                    const meta = SCHOOL_UI_META[school.id as SchoolId];
                    const isActive = pathname === `/${school.slug}`;
                    const savedScore = summary[school.id as SchoolId];

                    if (isUit) {
                      return (
                        <a
                          key={school.id}
                          href={meta.officialUrl}
                          target="_blank"
                          rel="noreferrer"
                          onClick={() => setMobileMenuOpen(false)}
                          className="btn-tactile flex min-h-[44px] items-center justify-between border border-hairline px-3 py-2 text-sm hover:bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                        >
                          <span className="flex min-w-0 items-center gap-2.5">
                            <span className={`rounded-control p-1.5 ${meta.iconWrap}`}>
                              <Icon className="h-4 w-4" />
                            </span>
                            <span className="truncate">
                              <span className="font-mono font-bold text-ink">{school.acronym}</span>
                              <span className="ml-1.5 text-xs text-ink-muted">Cổng tuyển sinh</span>
                            </span>
                          </span>
                          <ExternalLink className="h-3.5 w-3.5 shrink-0 text-ink-muted" />
                        </a>
                      );
                    }

                    return (
                      <Link
                        key={school.id}
                        to={`/${school.slug}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`btn-tactile flex min-h-[44px] items-center justify-between border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                          isActive
                            ? 'border-hairline-hover bg-surface-subtle'
                            : 'border-hairline hover:bg-surface-subtle'
                        }`}
                      >
                        <span className="flex min-w-0 items-center gap-2.5">
                          <span className={`rounded-control p-1.5 ${meta.iconWrap}`}>
                            <Icon className="h-4 w-4" />
                          </span>
                          <span className="truncate">
                            <span className={`font-mono font-bold ${isActive ? meta.accentText : 'text-ink'}`}>
                              {school.acronym}
                            </span>
                            <span className="ml-1.5 text-xs text-ink-muted">{school.name}</span>
                          </span>
                        </span>
                        {savedScore && (
                          <span className={`ml-2 shrink-0 font-mono text-xs font-bold tabular-nums ${meta.accentText}`}>
                            {savedScore.total.toFixed(2)}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </>,
          document.body
        )
      : null;

  return (
    <nav className="sticky top-0 z-50 border-b border-hairline bg-surface/95 backdrop-blur-md transition-colors duration-150">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-3">
          <Link
            to="/"
            onClick={scrollHomeToTop}
            className="flex shrink-0 items-center gap-2.5 rounded-control py-1 pr-2 transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            <img src="/favicon.svg" alt="Web Tính Điểm ĐHQG-HCM" className="h-8 w-8 rounded-control" />
            <span className="text-base font-bold tracking-tight text-ink sm:text-lg">
              <span className="sm:hidden">ĐHQG-HCM</span>
              <span className="hidden sm:inline">Tính điểm ĐHQG-HCM</span>
            </span>
          </Link>

          {/* Desktop Quick School Switcher */}
          <div className="hidden items-center gap-1 rounded-panel border border-hairline bg-surface-subtle p-1 lg:flex">
            <Link
              to="/"
              onClick={scrollHomeToTop}
              className={`btn-tactile inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                pathname === '/'
                  ? 'bg-surface text-ink shadow-sm dark:bg-surface-elevated'
                  : 'text-ink-secondary hover:text-ink'
              }`}
            >
              <Home className="h-3.5 w-3.5" />
              Trang chủ
            </Link>

            <span className="mx-0.5 h-4 w-px bg-hairline" aria-hidden="true" />

            {calculatorSchools.map((school) => {
              const meta = SCHOOL_UI_META[school.id as SchoolId];
              const isActive = pathname === `/${school.slug}`;
              const savedScore = summary[school.id as SchoolId];

              return (
                <Link
                  key={school.id}
                  to={`/${school.slug}`}
                  title={`${school.name}${savedScore ? ` (${savedScore.total.toFixed(2)}/100)` : ''}`}
                  className={`btn-tactile inline-flex items-center px-2.5 py-1.5 font-mono text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                    isActive ? meta.navActive : meta.navInactive
                  }`}
                >
                  {school.acronym}
                </Link>
              );
            })}

            <a
              href={uitMeta.officialUrl}
              target="_blank"
              rel="noreferrer"
              title="Trang tuyển sinh UIT 2026"
              className="btn-tactile inline-flex items-center gap-1 px-2.5 py-1.5 font-mono text-xs font-medium text-ink-muted hover:bg-surface hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:hover:bg-surface-elevated"
            >
              UIT
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          {/* Actions: Theme Toggle + Mobile Menu */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={isDark ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'}
              title={isDark ? 'Chế độ sáng' : 'Chế độ tối'}
              className="btn-tactile inline-flex h-11 w-11 items-center justify-center border border-hairline bg-surface text-ink-secondary hover:border-hairline-hover hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 sm:h-9 sm:w-9"
            >
              {isDark ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4" />}
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-expanded={mobileMenuOpen}
              aria-label="Mở menu chuyển nhanh trường"
              className="btn-tactile inline-flex min-h-[44px] items-center gap-1.5 border border-hairline bg-surface px-3 py-2 text-xs font-semibold text-ink hover:border-hairline-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 lg:hidden"
            >
              {mobileMenuOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <>
                  <Menu className="h-4 w-4 text-ink-secondary" />
                  <span className="font-mono">{activeSchool ? activeSchool.acronym : 'Trường'}</span>
                  <ChevronDown className="h-3.5 w-3.5 text-ink-muted" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {mobileDrawer}
    </nav>
  );
};
