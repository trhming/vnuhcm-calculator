import { Link } from 'react-router-dom';
import { SCHOOLS } from '../constants/hcmus';
import { ChevronRight } from 'lucide-react';

export const Home = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-4 max-w-3xl mx-auto py-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
          <span className="block">Tính điểm xét tuyển</span>
          <span className="block text-blue-700">VNU-HCM 2026</span>
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-slate-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          Công cụ hỗ trợ tính toán điểm xét tuyển vào các trường đại học thành viên thuộc Đại học Quốc gia TP.HCM theo phương thức tổng hợp năm 2026.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {SCHOOLS.map((school) => {
          const Icon = school.icon;
          return (
            <Link
              key={school.id}
              to={`/${school.slug}`}
              className="group relative flex flex-col items-center justify-center p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all duration-200 ease-in-out hover:-translate-y-1"
            >
              <div className={`p-4 rounded-xl ${school.bg} ${school.color} mb-4 group-hover:scale-110 transition-transform duration-200`}>
                <Icon className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 text-center leading-tight mb-1">
                {school.acronym}
              </h3>
              <p className="text-sm text-slate-500 text-center line-clamp-2">
                {school.name}
              </p>
              
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
