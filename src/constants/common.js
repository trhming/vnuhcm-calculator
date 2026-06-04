import { BookOpen, GraduationCap, Laptop, Building2, Microchip, Globe, HeartPulse } from 'lucide-react';

export const SCHOOLS = [
  { id: 'hcmus', slug: 'hcmus', name: 'Trường Đại học Khoa học Tự nhiên', acronym: 'HCMUS', icon: GraduationCap, color: 'text-blue-700', bg: 'bg-blue-50' },
  { id: 'hcmut', slug: 'hcmut', name: 'Trường Đại học Bách khoa', acronym: 'HCMUT', icon: Building2, color: 'text-blue-800', bg: 'bg-blue-100' },
  { id: 'uit', slug: 'uit', name: 'Trường Đại học Công nghệ Thông tin', acronym: 'UIT', icon: Laptop, color: 'text-sky-600', bg: 'bg-sky-50' },
  { id: 'uel', slug: 'uel', name: 'Trường Đại học Kinh tế - Luật', acronym: 'UEL', icon: BookOpen, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  { id: 'hcmussh', slug: 'hcmussh', name: 'Trường Đại học KHXH&NV', acronym: 'HCMUSSH', icon: Globe, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { id: 'iu', slug: 'iu', name: 'Trường Đại học Quốc tế', acronym: 'IU', icon: Microchip, color: 'text-red-600', bg: 'bg-red-50' },
  { id: 'uhs', slug: 'uhs', name: 'Trường Đại học Khoa học Sức khỏe', acronym: 'UHS', icon: HeartPulse, color: 'text-teal-700', bg: 'bg-teal-50' },
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

export const CERTIFICATE_DEFINITIONS = {
  IELTS: { name: 'IELTS', min: 0, max: 9 },
  TOEFL: { name: 'TOEFL iBT', min: 0, max: 120 },
  TOEFL_iBT: { name: 'TOEFL iBT', min: 0, max: 120 },
  TOEFL_IBT: { name: 'TOEFL iBT', min: 0, max: 120 },
  TOEFL_ITP: { name: 'TOEFL ITP', min: 0, max: 677 },
  TOEIC: { name: 'TOEIC (4 kỹ năng)', min: 0, max: 1390, maxLr: 990, maxSw: 400 },
  PTE: { name: 'PTE Academic', min: 0, max: 90 },
  CAMBRIDGE: { name: 'Cambridge', min: 0, max: 230 },
  Linguaskill_B1: { name: 'Linguaskill (B1)', min: 0, max: 159 },
  Linguaskill_B2: { name: 'Linguaskill (B2)', min: 0, max: 180 },
  VSTEP: { name: 'VSTEP Bậc 4', min: 0, max: 10 },
  SAT: { name: 'SAT', min: 0, max: 1600 },
  ACT: { name: 'ACT', min: 0, max: 36 },
  IB: { name: 'IB', min: 0, max: 45 },
  ALEVEL: { name: 'A-Level' },
  A_LEVEL: { name: 'A-Level' },
};

export const pickCertificates = (ids) => (
  ids.map((id) => ({
    id,
    ...CERTIFICATE_DEFINITIONS[id],
  }))
);

export const INTL_CERT_TABLE_COLUMNS = [
  { key: 'sat', header: 'Điểm SAT' },
  { key: 'act', header: 'Điểm ACT' },
  { key: 'ib', header: 'Điểm IB' },
  { key: 'aLevel', header: 'Hạng A-Level' },
  { key: 'point', header: 'Quy đổi', value: true },
];
