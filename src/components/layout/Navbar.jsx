import { Link } from 'react-router-dom';
import { MessageSquareText } from 'lucide-react';

const FEEDBACK_URL = '#';

export const Navbar = () => {
  const scrollHomeToTop = () => {
    if (window.location.pathname === '/') {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" onClick={scrollHomeToTop} className="flex-shrink-0 flex items-center gap-2">
              <img src="/favicon.svg" alt="Web Tính Điểm ĐHQG-HCM" className="h-8 w-8 rounded-lg" />
              <span className="font-bold text-xl text-slate-900 hidden sm:block">
                Web Tính Điểm ĐHQG-HCM 2026
              </span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/" onClick={scrollHomeToTop} className="text-slate-600 hover:text-slate-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Trang chủ
            </Link>
            <a
              href={FEEDBACK_URL}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-900 px-2.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-slate-800 sm:gap-2 sm:px-3 sm:text-sm"
            >
              <MessageSquareText className="h-4 w-4" />
              <span>Feedback</span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};
