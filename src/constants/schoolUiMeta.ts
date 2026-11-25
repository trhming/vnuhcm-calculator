export type SchoolId = 'hcmus' | 'hcmut' | 'uit' | 'uel' | 'hcmussh' | 'iu' | 'uhs';

export type SchoolUiMeta = {
  id: SchoolId;
  officialUrl: string;
  pageTitle: string;
  tone: 'blue' | 'hcmut' | 'emerald' | 'indigo' | 'red' | 'teal';
  accentBar: string;
  accentText: string;
  iconWrap: string;
  navActive: string;
  navInactive: string;
  cardHover: string;
  progressBar: string;
  softButton: string;
  headerIconBg: string;
  titleColor: string;
};

export const SCHOOL_UI_META: Record<SchoolId, SchoolUiMeta> = {
  hcmus: {
    id: 'hcmus',
    officialUrl: 'https://tuyensinh.hcmus.edu.vn/2026-thong-tin-tuyen-sinh-2026/',
    pageTitle: 'Máy tính điểm HCMUS 2026 | ĐHQG-HCM',
    tone: 'blue',
    accentBar: 'bg-blue-600 dark:bg-blue-500',
    accentText: 'text-blue-700 dark:text-blue-400',
    iconWrap: 'bg-blue-500/10 text-blue-700 dark:bg-blue-400/10 dark:text-blue-400',
    navActive: 'bg-surface text-blue-700 shadow-sm dark:bg-surface-elevated dark:text-blue-400',
    navInactive: 'text-ink-secondary hover:bg-surface hover:text-ink dark:hover:bg-surface-elevated',
    cardHover: 'hover:border-blue-500/40 dark:hover:border-blue-400/40',
    progressBar: 'bg-blue-600 dark:bg-blue-500',
    softButton: 'border-hairline bg-surface text-ink-secondary hover:border-hairline-hover hover:text-ink',
    headerIconBg: 'bg-blue-500/10 text-blue-700 dark:bg-blue-400/10 dark:text-blue-400',
    titleColor: 'text-ink',
  },
  hcmut: {
    id: 'hcmut',
    officialUrl: 'https://hcmut.edu.vn/tuyen-sinh/dai-hoc-chinh-quy/phuong-thuc-tuyen-sinh/xet-tuyen-tong-hop-2026',
    pageTitle: 'Máy tính điểm HCMUT 2026 | ĐHQG-HCM',
    tone: 'hcmut',
    accentBar: 'bg-blue-700 dark:bg-blue-500',
    accentText: 'text-blue-800 dark:text-blue-400',
    iconWrap: 'bg-blue-600/10 text-blue-800 dark:bg-blue-400/10 dark:text-blue-300',
    navActive: 'bg-surface text-blue-800 shadow-sm dark:bg-surface-elevated dark:text-blue-300',
    navInactive: 'text-ink-secondary hover:bg-surface hover:text-ink dark:hover:bg-surface-elevated',
    cardHover: 'hover:border-blue-600/40 dark:hover:border-blue-400/40',
    progressBar: 'bg-blue-700 dark:bg-blue-500',
    softButton: 'border-hairline bg-surface text-ink-secondary hover:border-hairline-hover hover:text-ink',
    headerIconBg: 'bg-blue-600/10 text-blue-800 dark:bg-blue-400/10 dark:text-blue-300',
    titleColor: 'text-ink',
  },
  uit: {
    id: 'uit',
    officialUrl: 'https://tuyensinh.uit.edu.vn/2026-thong-tin-tuyen-sinh-dai-hoc-chinh-quy-2026',
    pageTitle: 'Tuyển sinh UIT 2026 | ĐHQG-HCM',
    tone: 'blue',
    accentBar: 'bg-sky-600 dark:bg-sky-500',
    accentText: 'text-sky-700 dark:text-sky-400',
    iconWrap: 'bg-sky-500/10 text-sky-600 dark:bg-sky-400/10 dark:text-sky-400',
    navActive: 'bg-surface text-sky-700 shadow-sm dark:bg-surface-elevated dark:text-sky-400',
    navInactive: 'text-ink-secondary hover:bg-surface hover:text-ink dark:hover:bg-surface-elevated',
    cardHover: 'hover:border-sky-500/40 dark:hover:border-sky-400/40',
    progressBar: 'bg-sky-600 dark:bg-sky-500',
    softButton: 'border-hairline bg-surface text-ink-secondary hover:border-hairline-hover hover:text-ink',
    headerIconBg: 'bg-sky-500/10 text-sky-600 dark:bg-sky-400/10 dark:text-sky-400',
    titleColor: 'text-ink',
  },
  uel: {
    id: 'uel',
    officialUrl: 'https://tuyensinh.uel.edu.vn/thong-tin-tuyen-sinh-dai-hoc-chinh-quy-2026/',
    pageTitle: 'Máy tính điểm UEL 2026 | ĐHQG-HCM',
    tone: 'indigo',
    accentBar: 'bg-indigo-600 dark:bg-indigo-400',
    accentText: 'text-indigo-700 dark:text-indigo-400',
    iconWrap: 'bg-indigo-500/10 text-indigo-600 dark:bg-indigo-400/10 dark:text-indigo-400',
    navActive: 'bg-surface text-indigo-700 shadow-sm dark:bg-surface-elevated dark:text-indigo-400',
    navInactive: 'text-ink-secondary hover:bg-surface hover:text-ink dark:hover:bg-surface-elevated',
    cardHover: 'hover:border-indigo-500/40 dark:hover:border-indigo-400/40',
    progressBar: 'bg-indigo-600 dark:bg-indigo-400',
    softButton: 'border-hairline bg-surface text-ink-secondary hover:border-hairline-hover hover:text-ink',
    headerIconBg: 'bg-indigo-500/10 text-indigo-600 dark:bg-indigo-400/10 dark:text-indigo-400',
    titleColor: 'text-ink',
  },
  hcmussh: {
    id: 'hcmussh',
    officialUrl: 'https://hcmussh.edu.vn/tin-tuc/thong-tin-tuyen-sinh-dai-hoc-chinh-quy',
    pageTitle: 'Máy tính điểm USSH 2026 | ĐHQG-HCM',
    tone: 'emerald',
    accentBar: 'bg-emerald-600 dark:bg-emerald-400',
    accentText: 'text-emerald-700 dark:text-emerald-400',
    iconWrap: 'bg-emerald-500/10 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-400',
    navActive: 'bg-surface text-emerald-700 shadow-sm dark:bg-surface-elevated dark:text-emerald-400',
    navInactive: 'text-ink-secondary hover:bg-surface hover:text-ink dark:hover:bg-surface-elevated',
    cardHover: 'hover:border-emerald-500/40 dark:hover:border-emerald-400/40',
    progressBar: 'bg-emerald-600 dark:bg-emerald-400',
    softButton: 'border-hairline bg-surface text-ink-secondary hover:border-hairline-hover hover:text-ink',
    headerIconBg: 'bg-emerald-500/10 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-400',
    titleColor: 'text-ink',
  },
  iu: {
    id: 'iu',
    officialUrl: 'https://tuyensinh.hcmiu.edu.vn/tuyen-sinh/thong-tin-tuyen-sinh-dai-hoc-nam-2026-du-kien/',
    pageTitle: 'Máy tính điểm IU 2026 | ĐHQG-HCM',
    tone: 'red',
    accentBar: 'bg-red-600 dark:bg-red-400',
    accentText: 'text-red-700 dark:text-red-400',
    iconWrap: 'bg-red-500/10 text-red-600 dark:bg-red-400/10 dark:text-red-400',
    navActive: 'bg-surface text-red-700 shadow-sm dark:bg-surface-elevated dark:text-red-400',
    navInactive: 'text-ink-secondary hover:bg-surface hover:text-ink dark:hover:bg-surface-elevated',
    cardHover: 'hover:border-red-500/40 dark:hover:border-red-400/40',
    progressBar: 'bg-red-600 dark:bg-red-400',
    softButton: 'border-hairline bg-surface text-ink-secondary hover:border-hairline-hover hover:text-ink',
    headerIconBg: 'bg-red-500/10 text-red-600 dark:bg-red-400/10 dark:text-red-400',
    titleColor: 'text-ink',
  },
  uhs: {
    id: 'uhs',
    officialUrl: 'https://www.uhsvnu.edu.vn/tuyen-sinh-dao-tao/thong-tin-tuyen-sinh/phuong-thuc-tuyen-sinh/thong-tin-tuyen-sinh-nam-2026-dai-hoc-18052026',
    pageTitle: 'Máy tính điểm UHS 2026 | ĐHQG-HCM',
    tone: 'teal',
    accentBar: 'bg-teal-600 dark:bg-teal-400',
    accentText: 'text-teal-700 dark:text-teal-400',
    iconWrap: 'bg-teal-500/10 text-teal-700 dark:bg-teal-400/10 dark:text-teal-400',
    navActive: 'bg-surface text-teal-700 shadow-sm dark:bg-surface-elevated dark:text-teal-400',
    navInactive: 'text-ink-secondary hover:bg-surface hover:text-ink dark:hover:bg-surface-elevated',
    cardHover: 'hover:border-teal-500/40 dark:hover:border-teal-400/40',
    progressBar: 'bg-teal-600 dark:bg-teal-400',
    softButton: 'border-hairline bg-surface text-ink-secondary hover:border-hairline-hover hover:text-ink',
    headerIconBg: 'bg-teal-500/10 text-teal-700 dark:bg-teal-400/10 dark:text-teal-400',
    titleColor: 'text-ink',
  },
};
