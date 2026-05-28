import { BrowserRouter, Link, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { HcmusCalculator } from './pages/HcmusCalculator';
import { HcmutCalculator } from './pages/HcmutCalculator';
import { UsshCalculator } from './pages/UsshCalculator';
import { UelCalculator } from './pages/UelCalculator';
import { IuCalculator } from './pages/IuCalculator';
import { UhsCalculator } from './pages/UhsCalculator';

const NotFound = () => (
  <div className="mx-auto flex min-h-[55vh] max-w-xl flex-col items-center justify-center py-16 text-center">
    <div className="mb-5 text-7xl font-extrabold tracking-tight text-blue-700 sm:text-8xl">
      404
    </div>
    <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
      Trang này không tồn tại
    </h2>
    <p className="mt-3 text-slate-500">
      Đường dẫn bạn vừa mở không khớp với trang nào trong công cụ tính điểm.
    </p>
    <Link
      to="/"
      className="mt-6 rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-800"
    >
      Quay lại trang chủ
    </Link>
  </div>
);

function App() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
}

export default App;
