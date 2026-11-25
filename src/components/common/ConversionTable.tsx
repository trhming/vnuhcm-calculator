import { useEffect, useRef, type ReactNode } from 'react';

const toneClass = {
  blue: {
    title: 'bg-blue-500/10 text-blue-800 dark:text-blue-300',
    value: 'text-blue-700 dark:text-blue-400',
  },
  emerald: {
    title: 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300',
    value: 'text-emerald-700 dark:text-emerald-400',
  },
  indigo: {
    title: 'bg-indigo-500/10 text-indigo-800 dark:text-indigo-300',
    value: 'text-indigo-700 dark:text-indigo-400',
  },
  amber: {
    title: 'bg-amber-500/10 text-amber-800 dark:text-amber-300',
    value: 'text-amber-700 dark:text-amber-400',
  },
  red: {
    title: 'bg-red-500/10 text-red-800 dark:text-red-300',
    value: 'text-red-700 dark:text-red-400',
  },
};

type ConversionTone = keyof typeof toneClass;
type ConversionRow = Record<string, ReactNode> & {
  key?: string | number;
  highlighted?: boolean;
};

type ConversionColumn = {
  key: string;
  header: ReactNode;
  headerClassName?: string;
  cellClassName?: string;
  value?: boolean;
  render?: (row: ConversionRow, rowIndex: number) => ReactNode;
};

type ConversionTableProps = {
  title?: ReactNode;
  columns: ConversionColumn[];
  rows: ConversionRow[];
  tone?: ConversionTone;
  align?: 'left' | 'center';
  className?: string;
  isRowHighlighted?: (row: ConversionRow, rowIndex: number) => boolean;
};

export const ConversionTable = ({
  title,
  columns,
  rows,
  tone = 'blue',
  align = 'center',
  className = '',
  isRowHighlighted,
}: ConversionTableProps) => {
  const colors = toneClass[tone] || toneClass.blue;
  const alignClass = align === 'left' ? 'text-left' : 'text-center';
  const highlightedRowRef = useRef<HTMLTableRowElement | null>(null);

  const highlightedIndex = rows.findIndex((row, index) =>
    Boolean(row.highlighted || isRowHighlighted?.(row, index))
  );

  useEffect(() => {
    if (highlightedIndex >= 0 && highlightedRowRef.current) {
      highlightedRowRef.current.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [highlightedIndex]);

  return (
    <div className={className}>
      {title && (
        <h4 className={`mb-3 rounded-control py-2 text-center text-sm font-semibold ${colors.title}`}>
          {title}
        </h4>
      )}
      <table className={`w-full border-collapse text-sm ${alignClass}`}>
        <thead>
          <tr className="border-b border-hairline-hover text-ink-secondary">
            {columns.map((column) => (
              <th key={column.key} className={column.headerClassName || 'px-4 py-2 font-semibold'}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-hairline">
          {rows.map((row, rowIndex) => {
            const isHighlighted = Boolean(row.highlighted || isRowHighlighted?.(row, rowIndex));
            const isFirstHighlight = isHighlighted && rowIndex === highlightedIndex;

            return (
              <tr
                key={row.key || rowIndex}
                ref={isFirstHighlight ? highlightedRowRef : undefined}
                className={
                  isHighlighted
                    ? 'bg-amber-500/12 ring-1 ring-inset ring-amber-500/60 dark:bg-amber-400/15 dark:ring-amber-400/50'
                    : 'transition-colors duration-100 hover:bg-surface-subtle'
                }
              >
                {columns.map((column, colIndex) => {
                  const content = column.render ? column.render(row, rowIndex) : row[column.key];
                  const isValueColumn = column.value || column.key === 'point';
                  const cellClass =
                    column.cellClassName ||
                    `px-4 py-2 font-mono tabular-nums ${
                      isValueColumn
                        ? `font-semibold ${isHighlighted ? 'text-amber-700 dark:text-amber-300' : colors.value}`
                        : isHighlighted
                        ? 'font-semibold text-amber-900 dark:text-amber-200'
                        : 'text-ink-secondary'
                    }`;

                  return (
                    <td key={column.key} className={cellClass}>
                      {isFirstHighlight && colIndex === 0 ? (
                        <span className="inline-flex items-center gap-1.5">
                          <span className="h-2 w-2 shrink-0 rounded-full bg-amber-500" aria-hidden="true" />
                          <span>{content || '-'}</span>
                        </span>
                      ) : (
                        content || '-'
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export const ConversionTableGrid = ({
  children,
  className = 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4',
}: {
  children: ReactNode;
  className?: string;
}) => (
  <div className={className}>{children}</div>
);
