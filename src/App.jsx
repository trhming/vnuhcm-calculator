import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { HcmusCalculator } from './pages/HcmusCalculator';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="hcmus" element={<HcmusCalculator />} />
          {/* Default fallback for other routes */}
          <Route path="*" element={
            <div className="text-center py-20">
              <h2 className="text-2xl font-bold text-slate-800">Tính năng đang phát triển</h2>
              <p className="text-slate-500 mt-2">Trang tính điểm cho trường này sẽ sớm ra mắt.</p>
            </div>
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
