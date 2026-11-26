import { Suspense, lazy } from 'react';
import { BrowserRouter, Link, Routes, Route } from 'react-router-dom';
import { Home as HomeIcon } from 'lucide-react';
import { ThemeProvider } from './context/ThemeProvider';
import { ToastProvider } from './context/ToastProvider';
import { Layout } from './components/layout/Layout';
import { RouteErrorBoundary } from './components/common/ErrorBoundary';
import { Home } from './pages/Home';
import { SCHOOLS } from './constants/common';

const HcmusCalculator = lazy(() =>
  import('./pages/HcmusCalculator').then((m) => ({ default: m.HcmusCalculator }))
);
const HcmutCalculator = lazy(() =>
  import('./pages/HcmutCalculator').then((m) => ({ default: m.HcmutCalculator }))
);
const UsshCalculator = lazy(() =>
  import('./pages/UsshCalculator').then((m) => ({ default: m.UsshCalculator }))
);
const UelCalculator = lazy(() =>
  import('./pages/UelCalculator').then((m) => ({ default: m.UelCalculator }))
);
const IuCalculator = lazy(() =>
  import('./pages/IuCalculator').then((m) => ({ default: m.IuCalculator }))
);
const UhsCalculator = lazy(() =>
  import('./pages/UhsCalculator').then((m) => ({ default: m.UhsCalculator }))
);

const PageSkeleton = () => (
  <div
    className="mx-auto max-w-7xl animate-pulse space-y-6 pb-20"
    aria-busy="true"
    aria-label="Đang tải trang tính điểm"
  >
    <div className="space-y-3 border-b border-hairline pb-5">
      <div className="h-4 w-24 rounded-control bg-surface-subtle" />
      <div className="h-8 w-72 max-w-full rounded-control bg-surface-subtle" />
      <div className="h-4 w-96 max-w-full rounded-control bg-surface-subtle" />
    </div>
    <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
      <div className="flex-1 space-y-6">
        <div className="h-56 rounded-card border border-hairline bg-surface" />
        <div className="h-48 rounded-card border border-hairline bg-surface" />
      </div>
      <div className="hidden h-80 w-80 shrink-0 rounded-card border border-hairline bg-surface lg:block xl:w-96" />
    </div>
  </div>
);

const NotFound = () => (
  <div className="mx-auto flex min-h-[58vh] max-w-xl flex-col items-center justify-center py-12 text-center animate-in fade-in">
    <div className="mb-3 font-mono text-6xl font-bold tracking-tight tabular-nums text-blue-700 dark:text-blue-400 sm:text-7xl">
      404
    </div>
    <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
      Trang này không tồn tại
    </h1>
    <p className="mt-2.5 max-w-prose text-sm leading-relaxed text-ink-secondary">
      Đường dẫn bạn vừa mở không khớp với trang nào trong công cụ tính điểm ĐHQG-HCM 2026.
    </p>
    <div className="mt-6">
      <Link
        to="/"
        className="btn-tactile inline-flex min-h-[44px] items-center gap-2 bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:bg-blue-600 dark:hover:bg-blue-500 dark:focus-visible:ring-offset-zinc-950"
      >
        <HomeIcon className="h-4 w-4" />
        Quay lại trang chủ
      </Link>
    </div>

    <div className="mt-8 w-full rounded-card border border-hairline bg-surface p-4">
      <p className="mb-3 text-xs font-medium text-ink-muted">
        Mở nhanh máy tính theo trường
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        {SCHOOLS.filter((s) => s.id !== 'uit').map((school) => (
          <Link
            key={school.id}
            to={`/${school.slug}`}
            className="btn-tactile inline-flex min-h-[36px] items-center border border-hairline bg-surface-subtle px-3 py-1.5 font-mono text-xs font-semibold text-ink-secondary hover:border-hairline-hover hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            {school.acronym}
          </Link>
        ))}
      </div>
    </div>
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <BrowserRouter>
          <RouteErrorBoundary>
            <Suspense fallback={<PageSkeleton />}>
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<Home />} />
                  <Route path="hcmus" element={<HcmusCalculator />} />
                  <Route path="hcmut" element={<HcmutCalculator />} />
                  <Route path="hcmussh" element={<UsshCalculator />} />
                  <Route path="uel" element={<UelCalculator />} />
                  <Route path="iu" element={<IuCalculator />} />
                  <Route path="uhs" element={<UhsCalculator />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </Suspense>
          </RouteErrorBoundary>
        </BrowserRouter>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
