import type { ReactNode } from 'react';

const toneClass = {
  blue: {
    title: 'bg-blue-50 text-blue-800',
    value: 'text-blue-700',
  },
  emerald: {
    title: 'bg-emerald-50 text-emerald-800',
    value: 'text-emerald-700',
  },
  indigo: {
    title: 'bg-indigo-50 text-indigo-800',
    value: 'text-indigo-700',
  },
  amber: {
    title: 'bg-amber-50 text-amber-800',
    value: 'text-amber-700',
  },
  red: {
    title: 'bg-red-50 text-red-800',
    value: 'text-red-700',
  },
};

type ConversionTone = keyof typeof toneClass;
type ConversionRow = Record<string, ReactNode> & {
  key?: string | number;
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
};

export const ConversionTable = ({
  title,
  columns,
  rows,
  tone = 'blue',
  align = 'center',
  className = '',
}: ConversionTableProps) => {
  const colors = toneClass[tone] || toneClass.blue;
  const alignClass = align === 'left' ? 'text-left' : 'text-center';

  return (
    <div className={className}>
      {title && (
        <h4 className={`mb-3 rounded-lg py-2 text-center font-bold ${colors.title}`}>
          {title}
        </h4>
      )}
      <table className={`w-full border-collapse text-sm ${alignClass}`}>
        <thead>
          <tr className="border-b-2 border-slate-200 text-slate-600">
            {columns.map((column) => (
              <th key={column.key} className={column.headerClassName || 'px-4 py-2 font-medium'}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((row, rowIndex) => (
            <tr key={row.key || rowIndex} className="hover:bg-slate-50">
              {columns.map((column) => {
                const content = column.render ? column.render(row, rowIndex) : row[column.key];
                const isValueColumn = column.value || column.key === 'point';
                const className = column.cellClassName || `px-4 py-2 ${isValueColumn ? `font-semibold ${colors.value}` : 'text-slate-700'}`;

                return (
                  <td key={column.key} className={className}>
                    {content || '-'}
                  </td>
                );
              })}
            </tr>
          ))}
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
