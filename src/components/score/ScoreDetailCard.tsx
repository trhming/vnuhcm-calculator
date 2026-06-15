import type { ReactNode } from 'react';
import { Calculator } from 'lucide-react';

const themeClass = {
  blue: {
    border: 'border-blue-100',
    header: 'from-blue-700 to-blue-900',
    headerText: 'text-blue-100',
    formula: 'bg-blue-50 text-blue-900',
  },
  hcmut: {
    border: 'border-blue-200',
    header: 'from-blue-800 to-slate-900',
    headerText: 'text-blue-100',
    formula: 'bg-blue-50 text-blue-900',
  },
  emerald: {
    border: 'border-emerald-200',
    header: 'from-emerald-700 to-emerald-900',
    headerText: 'text-emerald-100',
    formula: 'bg-emerald-50 text-emerald-900',
  },
  indigo: {
    border: 'border-indigo-200',
    header: 'from-indigo-700 to-indigo-900',
    headerText: 'text-indigo-100',
    formula: 'bg-indigo-50 text-indigo-900',
  },
  red: {
    border: 'border-red-100',
    header: 'from-red-700 to-slate-900',
    headerText: 'text-red-100',
    formula: 'bg-red-50 text-red-900',
  },
  teal: {
    border: 'border-teal-100',
    header: 'from-teal-700 to-cyan-800',
    headerText: 'text-teal-100',
    formula: 'bg-teal-50 text-teal-900',
  },
};

type ScoreTheme = keyof typeof themeClass;
type ScoreRowVariant = 'plain' | 'bonusEffective' | 'priorityEffective';

type ScoreRowData = {
  label: string;
  value: ReactNode;
  secondaryValue?: ReactNode;
  variant?: ScoreRowVariant;
  valueClassName?: string;
  labelClassName?: string;
  separatorBefore?: boolean;
  emphasis?: boolean;
};

type ScoreDetailCardProps = {
  theme?: ScoreTheme;
  total: number | string;
  totalPrecision?: number;
  headerNote?: ReactNode;
  formula?: ReactNode;
  formulaDetail?: ReactNode;
  dhl?: number | string;
  dhlPrecision?: number;
  beforeLearning?: ReactNode;
  dgnlScore?: ReactNode;
  thptScore?: ReactNode;
  hocBaScore?: ReactNode;
  learningRows?: ScoreRowData[];
  extraLearningRows?: ScoreRowData[];
  bonusRows?: ScoreRowData[];
  priorityRows?: ScoreRowData[];
  headerClassName?: string;
  className?: string;
};

export const ScoreDetailCard = ({
  theme = 'blue',
  total,
  totalPrecision = 2,
  headerNote,
  formula,
  formulaDetail,
  dhl,
  dhlPrecision = 2,
  beforeLearning,
  dgnlScore,
  thptScore,
  hocBaScore,
  learningRows = [],
  extraLearningRows = [],
  bonusRows = [],
  priorityRows = [],
  headerClassName,
  className = '',
}: ScoreDetailCardProps) => {
  const colors = themeClass[theme] || themeClass.blue;
  const resolvedLearningRows = learningRows.length > 0
    ? learningRows
    : [
        { label: 'ĐGNL chuẩn hóa', value: dgnlScore },
        { label: 'THPT chuẩn hóa', value: thptScore },
        { label: 'Học bạ chuẩn hóa', value: hocBaScore },
        ...extraLearningRows,
      ].filter((row) => row.value !== undefined && row.value !== null);

  return (
    <div className={`w-full overflow-hidden rounded-2xl border bg-white shadow-2xl ${colors.border} ${className}`}>
      <div className={`relative overflow-hidden ${headerClassName || `bg-gradient-to-br ${colors.header}`} p-6 text-white`}>
        <div className="absolute right-0 top-0 p-4 opacity-10">
          <Calculator className="h-24 w-24" />
        </div>
        <h2 className={`mb-1 text-lg font-medium ${colors.headerText}`}>Điểm xét tuyển</h2>
        <div className="mb-2 text-5xl font-extrabold tracking-tight">
          {formatValue(total, totalPrecision)}
          <span className={`text-xl font-normal ${colors.headerText}`}> / 100</span>
        </div>
        {headerNote && <div className={`mt-2 text-base font-medium ${colors.headerText}`}>{headerNote}</div>}
      </div>

      <div className="space-y-6 p-6">
        {(formula || dhl !== undefined) && (
          <div className={`rounded-xl p-3 text-sm ${colors.formula}`}>
            {formula && <div className="font-semibold">{formula}</div>}
            {formulaDetail && <div className="mt-1 opacity-80">{formulaDetail}</div>}
            {dhl !== undefined && (
              <div className="mt-2 flex justify-between font-bold">
                <span>ĐHL</span>
                <span>{formatValue(dhl, dhlPrecision)}</span>
              </div>
            )}
          </div>
        )}

        {beforeLearning}

        {resolvedLearningRows.length > 0 && (
          <ScoreSection title="Điểm học lực">
            {resolvedLearningRows.map((row) => (
              <ScoreRow key={row.label} {...row} />
            ))}
          </ScoreSection>
        )}

        {(bonusRows.length > 0 || priorityRows.length > 0) && (
          <>
            <Divider />
            <ScoreSection title="Ưu tiên & Điểm cộng">
              <div className="space-y-4">
                {bonusRows.length > 0 && (
                  <div className="space-y-1">
                    {bonusRows.map((row) => (
                      <ScoreRow key={row.label} {...row} />
                    ))}
                  </div>
                )}
                {priorityRows.length > 0 && (
                  <div className="space-y-1">
                    {priorityRows.map((row) => (
                      <ScoreRow key={row.label} {...row} />
                    ))}
                  </div>
                )}
              </div>
            </ScoreSection>
          </>
        )}
      </div>
    </div>
  );
};

const Divider = () => <div className="h-px w-full bg-slate-200" />;

const ScoreSection = ({ title, children }: { title: string; children: ReactNode }) => (
  <div>
    <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">{title}</h3>
    <div className="space-y-2 text-sm">{children}</div>
  </div>
);

const ScoreRow = ({
  label,
  value,
  secondaryValue,
  variant = 'plain',
  valueClassName = 'font-semibold text-slate-900',
  labelClassName = '',
  separatorBefore = false,
  emphasis = false,
}: ScoreRowData) => {
  const isDefaultEmphasis = label === 'Điểm cộng (Gốc)'
    || label === 'Tổng điểm cộng (Gốc)'
    || label === 'Ưu tiên KV/ĐT (Gốc)';
  const shouldEmphasize = emphasis || isDefaultEmphasis;
  const variantClass = {
    plain: 'text-slate-600',
    bonusEffective: 'rounded bg-amber-50 p-2 font-medium text-amber-900 border border-amber-100',
    priorityEffective: 'rounded bg-emerald-50 p-2 font-medium text-emerald-900 border border-emerald-100',
  }[variant] || 'text-slate-600';

  const effectiveValueClass = {
    plain: valueClassName,
    bonusEffective: 'font-bold text-amber-700',
    priorityEffective: 'font-bold text-emerald-700',
  }[variant] || valueClassName;

  return (
    <div className={`flex items-center justify-between gap-3 ${separatorBefore ? 'mt-2 border-t border-slate-200 pt-2' : ''} ${variantClass}`}>
      <span className={`${shouldEmphasize ? 'font-semibold text-slate-700' : ''} ${labelClassName}`}>{label}</span>
      <span className={`text-right ${shouldEmphasize ? 'font-bold text-slate-900' : effectiveValueClass}`}>
        {value}
        {secondaryValue && (
          <span className="ml-2 text-xs font-medium opacity-70">{secondaryValue}</span>
        )}
      </span>
    </div>
  );
};

const formatValue = (value: number | string, precision: number) => (
  typeof value === 'number' ? value.toFixed(precision) : value
);
