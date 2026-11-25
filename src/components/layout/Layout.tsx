import { useEffect, useLayoutEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { SCHOOLS } from '../../constants/common';
import { SCHOOL_UI_META, type SchoolId } from '../../constants/schoolUiMeta';

export const Layout = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  useEffect(() => {
    const matchedSchool = SCHOOLS.find((school) => `/${school.slug}` === pathname);
    if (matchedSchool) {
      const meta = SCHOOL_UI_META[matchedSchool.id as SchoolId];
      document.title = meta?.pageTitle || `${matchedSchool.acronym} | Web Tính Điểm ĐHQG-HCM 2026`;
    } else {
      document.title = 'Web Tính Điểm ĐHQG-HCM 2026';
    }
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-canvas text-ink transition-colors duration-150">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-control focus:bg-blue-700 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lg"
      >
        Chuyển đến nội dung chính
      </a>
      <Navbar />
      <main id="main-content" className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
