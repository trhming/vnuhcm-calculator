import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/react"
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { HcmusCalculator } from './pages/HcmusCalculator';
import { HcmutCalculator } from './pages/HcmutCalculator';
import { UsshCalculator } from './pages/UsshCalculator';
import { UelCalculator } from './pages/UelCalculator';
import { IuCalculator } from './pages/IuCalculator';
import { UhsCalculator } from './pages/UhsCalculator';

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
          {/* Default fallback for other routes */}
          <Route path="*" element={
            <div className="text-center py-20">
              <h2 className="text-2xl font-bold text-slate-800">Tính năng đang phát triển</h2>
              <p className="text-slate-500 mt-2">Trang tính điểm cho trường này sẽ sớm ra mắt.</p>
            </div>
          } />
        </Route>
      </Routes>
      <Analytics />
      <SpeedInsights />
    </BrowserRouter>
  );
}

export default App;
