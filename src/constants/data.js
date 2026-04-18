import { BookOpen, GraduationCap, Laptop, Building2, Microchip, Globe, HeartPulse } from 'lucide-react';

export const SCHOOLS = [
  { id: 'hcmus', slug: 'hcmus', name: 'Trường Đại học Khoa học Tự nhiên', acronym: 'HCMUS', icon: GraduationCap, color: 'text-blue-700', bg: 'bg-blue-50' },
  { id: 'hcmut', slug: 'hcmut', name: 'Trường Đại học Bách khoa', acronym: 'HCMUT', icon: Building2, color: 'text-blue-800', bg: 'bg-blue-100' },
  { id: 'uit', slug: 'uit', name: 'Trường Đại học Công nghệ Thông tin', acronym: 'UIT', icon: Laptop, color: 'text-sky-600', bg: 'bg-sky-50' },
  { id: 'uel', slug: 'uel', name: 'Trường Đại học Kinh tế - Luật', acronym: 'UEL', icon: BookOpen, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  { id: 'hcmussh', slug: 'hcmussh', name: 'Trường Đại học KHXH&NV', acronym: 'HCMUSSH', icon: Globe, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { id: 'iu', slug: 'iu', name: 'Trường Đại học Quốc tế', acronym: 'IU', icon: Microchip, color: 'text-red-600', bg: 'bg-red-50' },
  { id: 'uhs', slug: 'uhs', name: 'Trường Đại học Khoa học Sức khỏe', acronym: 'UHS', icon: HeartPulse, color: 'text-rose-500', bg: 'bg-rose-50' },
];

export const KHU_VUC = [
  { id: 'KV3', name: 'Khu vực 3', points: 0 },
  { id: 'KV2', name: 'Khu vực 2', points: 0.25 },
  { id: 'KV2-NT', name: 'Khu vực 2-NT', points: 0.5 },
  { id: 'KV1', name: 'Khu vực 1', points: 0.75 },
];

export const DOI_TUONG = [
  { id: 'NONE', name: 'Không có ưu tiên', points: 0 },
  { id: 'UT2', name: 'Nhóm UT2 (ĐT5..7)', points: 1.0 },
  { id: 'UT1', name: 'Nhóm UT1 (ĐT1..4)', points: 2.0 },
];

export const NGOAI_NGU_CONVERSION = {
  IELTS: [
    { min: 8.0, max: 9.0, point: 10 },
    { min: 7.5, max: 7.99, point: 9.75 },
    { min: 7.0, max: 7.49, point: 9.5 },
    { min: 6.5, max: 6.99, point: 9.0 },
    { min: 6.0, max: 6.49, point: 8.5 },
    { min: 5.5, max: 5.99, point: 8.0 },
    { min: 5.0, max: 5.49, point: 7.5 },
    { min: 4.5, max: 4.99, point: 7.0 },
  ],
  TOEFL: [
    { min: 110, max: 120, point: 10 },
    { min: 107, max: 109, point: 9.75 },
    { min: 96, max: 106, point: 9.5 },
    { min: 79, max: 95, point: 9.0 },
    { min: 60, max: 78, point: 8.5 },
    { min: 46, max: 59, point: 8.0 },
    { min: 35, max: 45, point: 7.5 },
    { min: 32, max: 34, point: 7.0 },
  ]
};
