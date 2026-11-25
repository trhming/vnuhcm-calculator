import { isValidElement, useState, type ReactNode } from 'react';
import { Check, Copy, Share2 } from 'lucide-react';
import { useToast } from '../../hooks/useToast';

type ScoreTheme = 'blue' | 'hcmut' | 'emerald' | 'indigo' | 'red' | 'teal';
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
  schoolAcronym?: string;
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

const extractText = (node: ReactNode): string => {
  if (node === null || node === undefined || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(extractText).join('');
  if (isValidElement<{ children?: ReactNode }>(node)) {
    return extractText(node.props.children);
  }
  return '';
};

const extractLeadingNumber = (node: ReactNode): number | null => {
  const text = extractText(node);
  const match = text.match(/-?\d+(?:\.\d+)?/);
  return match ? parseFloat(match[0]) : null;
};

const isReductionApplied = (rows: ScoreRowData[], effectiveVariant: ScoreRowVariant): boolean => {
  const rawRow = rows.find((row) =>
    row.label === 'Điểm cộng (Gốc)' ||
    row.label === 'Tổng điểm cộng (Gốc)' ||
    row.label === 'Ưu tiên KV/ĐT (Gốc)'
  );
  const effectiveRow = rows.find((row) => row.variant === effectiveVariant);
  if (!rawRow || !effectiveRow) return false;
  const rawVal = extractLeadingNumber(rawRow.value);
  const effVal = extractLeadingNumber(effectiveRow.value);
  return rawVal !== null && effVal !== null && rawVal > effVal + 0.009;
};

export const ScoreDetailCard = ({
  schoolAcronym,
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
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);

  const resolvedLearningRows = learningRows.length > 0
    ? learningRows
    : [
        { label: 'ĐGNL chuẩn hóa', value: dgnlScore },
        { label: 'THPT chuẩn hóa', value: thptScore },
        { label: 'Học bạ chuẩn hóa', value: hocBaScore },
        ...extraLearningRows,
      ].filter((row) => row.value !== undefined && row.value !== null);

  const hasReducedBonusOrPriority =
    isReductionApplied(bonusRows, 'bonusEffective') ||
    isReductionApplied(priorityRows, 'priorityEffective');

  const buildSummaryText = () => {
    const lines: string[] = [];
    lines.push(`Kết quả xét tuyển${schoolAcronym ? ` ${schoolAcronym}` : ''} 2026`);
    lines.push(`Tổng điểm: ${formatValue(total, totalPrecision)} / 100`);

    const noteText = extractText(headerNote).trim();
    if (noteText) lines.push(noteText);

    const formulaText = extractText(formula).trim();
    if (formulaText) lines.push(`Công thức: ${formulaText}`);

    if (dhl !== undefined) {
      lines.push(`Điểm học lực (ĐHL): ${formatValue(dhl, dhlPrecision)}`);
    }

    if (resolvedLearningRows.length > 0) {
      lines.push('--- Điểm thành phần ---');
      for (const row of resolvedLearningRows) {
        lines.push(`• ${row.label}: ${extractText(row.value)}`);
      }
    }

    const combinedExtra = [...bonusRows, ...priorityRows];
    if (combinedExtra.length > 0) {
      lines.push('--- Ưu tiên & Điểm cộng ---');
      for (const row of combinedExtra) {
        const secondary = extractText(row.secondaryValue).trim();
        lines.push(`• ${row.label}: ${extractText(row.value)}${secondary ? ` ${secondary}` : ''}`);
      }
    }

    return lines.join('\n');
  };

  const handleCopySummary = async () => {
    const summaryText = buildSummaryText();
    try {
      await navigator.clipboard.writeText(summaryText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
      showToast({
        type: 'success',
        title: 'Đã sao chép kết quả',
      });
    } catch {
      showToast({
        type: 'warning',
        title: 'Không thể sao chép tự động',
        description: 'Trình duyệt chưa cấp quyền truy cập clipboard.',
      });
    }
  };

  const canNativeShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  const handleShareSummary = async () => {
    if (!canNativeShare) return;
    try {
      await navigator.share({
        title: `Kết quả xét tuyển${schoolAcronym ? ` ${schoolAcronym}` : ''} 2026`,
        text: buildSummaryText(),
      });
    } catch {
      // Ignore user cancellation
    }
  };

  return (
    <div className={`w-full overflow-hidden rounded-card border border-hairline bg-surface ${className}`}>
      <div className={`border-b border-hairline p-5 sm:p-6 ${headerClassName || 'bg-surface'}`}>
        <h2 className="text-sm font-semibold text-ink-secondary">Điểm xét tuyển</h2>

        <div className="mt-2 flex items-baseline gap-1.5 font-mono tabular-nums">
          <span className="text-4xl font-bold tracking-tight text-ink sm:text-5xl">
            {formatValue(total, totalPrecision)}
          </span>
          <span className="text-base font-medium text-ink-muted">/ 100</span>
        </div>

        {headerNote && (
          <div className="mt-2.5 text-sm font-medium text-ink-secondary">
            {headerNote}
          </div>
        )}
      </div>

      <div className="space-y-5 p-5 sm:p-6">
        {(formula || dhl !== undefined) && (
          <div className="rounded-panel border border-hairline bg-surface-subtle p-3.5 text-xs sm:text-sm">
            {formula && <div className="font-mono font-medium leading-snug text-ink">{formula}</div>}
            {formulaDetail && <div className="mt-1 font-mono text-xs text-ink-secondary">{formulaDetail}</div>}
            {dhl !== undefined && (
              <div className="mt-2.5 flex items-center justify-between border-t border-hairline pt-2 font-mono font-bold tabular-nums text-ink">
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
            <ScoreSection title="Ưu tiên & điểm cộng">
              <div className="space-y-3">
                {bonusRows.length > 0 && (
                  <div className="space-y-1.5">
                    {bonusRows.map((row) => (
                      <ScoreRow key={row.label} {...row} />
                    ))}
                  </div>
                )}
                {priorityRows.length > 0 && (
                  <div className="space-y-1.5">
                    {priorityRows.map((row) => (
                      <ScoreRow key={row.label} {...row} />
                    ))}
                  </div>
                )}
                {hasReducedBonusOrPriority && (
                  <p className="text-xs text-ink-muted">
                    Đã giảm trừ theo mốc 75/100.
                  </p>
                )}
              </div>
            </ScoreSection>
          </>
        )}

        <Divider />

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopySummary}
            className="btn-tactile inline-flex min-h-[40px] flex-1 items-center justify-center gap-2 border border-hairline bg-surface-subtle px-3.5 py-2 text-xs font-semibold text-ink hover:border-hairline-hover hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span>Đã sao chép</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 text-ink-secondary" />
                <span>Sao chép</span>
              </>
            )}
          </button>

          {canNativeShare && (
            <button
              type="button"
              onClick={handleShareSummary}
              aria-label="Chia sẻ kết quả"
              title="Chia sẻ kết quả"
              className="btn-tactile inline-flex min-h-[40px] min-w-[40px] items-center justify-center border border-hairline bg-surface-subtle p-2 text-ink-secondary hover:border-hairline-hover hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            >
              <Share2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const Divider = () => <div className="h-px w-full bg-hairline" />;

const ScoreSection = ({ title, children }: { title: string; children: ReactNode }) => (
  <div>
    <h3 className="mb-2.5 text-xs font-semibold text-ink-muted">{title}</h3>
    <div className="space-y-2 text-sm">{children}</div>
  </div>
);

const ScoreRow = ({
  label,
  value,
  secondaryValue,
  variant = 'plain',
  valueClassName = 'font-semibold text-ink',
  labelClassName = '',
  separatorBefore = false,
  emphasis = false,
}: ScoreRowData) => {
  const isDefaultEmphasis = label === 'Điểm cộng (Gốc)'
    || label === 'Tổng điểm cộng (Gốc)'
    || label === 'Ưu tiên KV/ĐT (Gốc)';
  const shouldEmphasize = emphasis || isDefaultEmphasis;
  const variantClass = {
    plain: 'text-ink-secondary',
    bonusEffective: 'font-medium text-ink',
    priorityEffective: 'font-medium text-ink',
  }[variant] || 'text-ink-secondary';

  const effectiveValueClass = {
    plain: valueClassName,
    bonusEffective: 'font-bold text-amber-700 dark:text-amber-400',
    priorityEffective: 'font-bold text-emerald-700 dark:text-emerald-400',
  }[variant] || valueClassName;

  return (
    <div className={`flex items-center justify-between gap-3 ${separatorBefore ? 'mt-2 border-t border-hairline pt-2' : ''} ${variantClass}`}>
      <span className={`${shouldEmphasize ? 'font-semibold text-ink' : ''} ${labelClassName}`}>
        {label}
      </span>
      <span className={`text-right font-mono tabular-nums ${shouldEmphasize ? 'font-bold text-ink' : effectiveValueClass}`}>
        {value}
        {secondaryValue && (
          <span className="ml-2 text-xs font-medium opacity-75">{secondaryValue}</span>
        )}
      </span>
    </div>
  );
};

const formatValue = (value: number | string, precision: number) => (
  typeof value === 'number' ? value.toFixed(precision) : value
);
