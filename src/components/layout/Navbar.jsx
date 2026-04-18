import { Link, Outlet } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

export const Navbar = () => {
  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">VNU</span>
              </div>
              <span className="font-bold text-xl text-slate-900 hidden sm:block">
                Web Tính Điểm ĐHQG-HCM 2026
              </span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-slate-600 hover:text-slate-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Trang chủ
            </Link>
            <a href="#" className="flex items-center gap-1 text-slate-600 hover:text-slate-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">
              <BookOpen className="w-4 h-4" />
              <span>Hướng dẫn</span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};
