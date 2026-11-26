import { useRef, type ClipboardEvent, type KeyboardEvent, type ReactNode } from 'react';
import { LockOpen, Trash2 } from 'lucide-react';
import { ScoreInput } from '../score/ScoreInput';
import { clampScore } from '../../utils/input';

type TranscriptCellContext = {
  cellIndex: number;
  subjectIndex: number;
  yearIndex: number;
};

type TranscriptCellMeta = {
  disabled?: boolean;
  className?: string;
  placeholder?: string;
  title?: string;
};

type TranscriptScoreTableProps = {
  values: string[];
  onChange: (index: number, value: string) => void;
  disabled?: boolean;
  tone?: 'blue' | 'hcmut' | 'emerald' | 'teal' | 'indigo' | 'red';
  subjectLabels?: string[];
  yearLabels?: string[];
  subjectWeights?: number[];
  highlightedSubjects?: number[];
  noteHeader?: ReactNode;
  showNoteColumn?: boolean;
  showAverageColumn?: boolean;
  getDisplayValue?: (context: TranscriptCellContext) => string;
  getCellMeta?: (context: TranscriptCellContext) => TranscriptCellMeta;
  renderSubjectNote?: (context: { subjectIndex: number }) => ReactNode;
  onClear?: () => void;
  onUnlockQuick?: () => void;
  onBulkChange?: (nextValues: string[]) => void;
};

export const TranscriptScoreTable = ({
  values,
  onChange,
  disabled = false,
  tone = 'blue',
  subjectLabels = ['Môn 1', 'Môn 2', 'Môn 3'],
  yearLabels = ['Lớp 10', 'Lớp 11', 'Lớp 12'],
  subjectWeights = [1, 1, 1],
  highlightedSubjects = [],
  noteHeader = 'Ghi chú',
  showNoteColumn = false,
  showAverageColumn = true,
  getDisplayValue,
  getCellMeta,
  renderSubjectNote,
  onClear,
  onUnlockQuick,
  onBulkChange,
}: TranscriptScoreTableProps) => {
  const tableContainerRef = useRef<HTMLDivElement | null>(null);
  const hasAnyValue = values.some((value) => value !== '');
  const totalCols = yearLabels.length;
  const totalRows = subjectLabels.length;

  const focusCell = (subjectIndex: number, yearIndex: number) => {
    const targetIndex = subjectIndex * totalCols + yearIndex;
    const input = tableContainerRef.current?.querySelector<HTMLInputElement>(
      `input[data-transcript-cell="${targetIndex}"]`
    );
    if (input && !input.disabled) {
      input.focus();
      input.select();
    }
  };

  const handleCellKeyDown = (
    event: KeyboardEvent<HTMLInputElement>,
    subjectIndex: number,
    yearIndex: number
  ) => {
    const input = event.currentTarget;
    if (event.key === 'ArrowDown' || event.key === 'Enter') {
      event.preventDefault();
      if (subjectIndex + 1 < totalRows) {
        focusCell(subjectIndex + 1, yearIndex);
      } else if (yearIndex + 1 < totalCols) {
        focusCell(0, yearIndex + 1);
      }
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (subjectIndex - 1 >= 0) {
        focusCell(subjectIndex - 1, yearIndex);
      }
    } else if (
      event.key === 'ArrowRight' &&
      input.selectionStart === input.value.length &&
      yearIndex + 1 < totalCols
    ) {
      event.preventDefault();
      focusCell(subjectIndex, yearIndex + 1);
    } else if (
      event.key === 'ArrowLeft' &&
      input.selectionStart === 0 &&
      yearIndex - 1 >= 0
    ) {
      event.preventDefault();
      focusCell(subjectIndex, yearIndex - 1);
    }
  };

  const handleCellPaste = (
    event: ClipboardEvent<HTMLInputElement>,
    subjectIndex: number,
    yearIndex: number
  ) => {
    const rawText = event.clipboardData.getData('text');
    if (!rawText) return;

    const lines = rawText
      .trim()
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);

    if (lines.length === 0) return;

    const isMultiValue = lines.length > 1 || /[\t;\s]+/.test(lines[0]);
    if (!isMultiValue) return;

    event.preventDefault();
    const nextValues = [...values];
    let hasUpdate = false;

    const applyCellValue = (cellIdx: number, rawToken: string) => {
      const targetSubject = Math.floor(cellIdx / totalCols);
      const targetYear = cellIdx % totalCols;
      const cellMeta = getCellMeta?.({
        cellIndex: cellIdx,
        subjectIndex: targetSubject,
        yearIndex: targetYear,
      });
      if (disabled || cellMeta?.disabled) return;
      const clamped = clampScore(rawToken, 10, 0, 1);
      if (clamped !== '') {
        nextValues[cellIdx] = clamped;
        hasUpdate = true;
      }
    };

    if (lines.length === 1) {
      const tokens = lines[0].split(/[\t;\s]+/).filter(Boolean);
      const startIndex = subjectIndex * totalCols + yearIndex;
      const totalCells = totalRows * totalCols;
      for (let i = 0; i < tokens.length && startIndex + i < totalCells; i++) {
        applyCellValue(startIndex + i, tokens[i]);
      }
    } else {
      for (let r = 0; r < lines.length && subjectIndex + r < totalRows; r++) {
        const cols = lines[r].split(/[\t;\s]+/).filter(Boolean);
        for (let c = 0; c < cols.length && yearIndex + c < totalCols; c++) {
          const targetIdx = (subjectIndex + r) * totalCols + (yearIndex + c);
          applyCellValue(targetIdx, cols[c]);
        }
      }
    }

    if (!hasUpdate) return;
    if (onBulkChange) {
      onBulkChange(nextValues);
    } else {
      nextValues.forEach((val, idx) => {
        if (val !== values[idx]) onChange(idx, val);
      });
    }
  };

  return (
    <div className="space-y-2.5" ref={tableContainerRef}>
      {disabled && (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-panel border border-amber-500/30 bg-amber-500/10 px-3.5 py-2 text-xs text-amber-800 dark:text-amber-300">
          <span>Đang dùng điểm nhập nhanh.</span>
          {onUnlockQuick && (
            <button
              type="button"
              onClick={onUnlockQuick}
              className="btn-tactile inline-flex items-center gap-1 border border-amber-500/40 bg-surface px-2.5 py-1 font-semibold text-amber-800 hover:bg-amber-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 dark:text-amber-200"
            >
              <LockOpen className="h-3 w-3" />
              Nhập từng ô
            </button>
          )}
        </div>
      )}

      <div className="overflow-x-auto rounded-panel border border-hairline">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-surface-subtle text-ink-secondary">
            <tr>
              <th className="w-1 whitespace-nowrap px-2.5 py-2.5 font-semibold sm:px-4 sm:py-3">Môn</th>
              {yearLabels.map((label) => (
                <th key={label} className="min-w-[64px] px-1 py-2.5 text-center font-semibold sm:min-w-[82px] sm:px-2.5 sm:py-3">
                  {label}
                </th>
              ))}
              {showAverageColumn && (
                <th className={`whitespace-nowrap px-2 py-2.5 text-center font-semibold text-ink-muted sm:px-3 sm:py-3 ${showNoteColumn ? 'hidden sm:table-cell' : ''}`}>
                  TB
                </th>
              )}
              {showNoteColumn && (
                <th className="w-20 px-1.5 py-2.5 text-center font-semibold sm:w-32 sm:px-4 sm:py-3">
                  {noteHeader}
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-hairline">
            {subjectLabels.map((label, subjectIndex) => {
              const isHighlighted = highlightedSubjects.includes(subjectIndex);
              const subjectWeight = subjectWeights[subjectIndex] || 1;
              const rowDisplayValues = yearLabels.map((_, yearIndex) => {
                const cellIndex = subjectIndex * yearLabels.length + yearIndex;
                return getDisplayValue
                  ? getDisplayValue({ cellIndex, subjectIndex, yearIndex })
                  : values[cellIndex];
              });

              const parsedRow = rowDisplayValues.map((v) => parseFloat(v));
              const hasFullRow = rowDisplayValues.every((v, idx) => v !== '' && !Number.isNaN(parsedRow[idx]));
              const rowAvg = hasFullRow
                ? (parsedRow.reduce((sum, val) => sum + val, 0) / parsedRow.length).toFixed(2)
                : '-';

              return (
                <tr
                  key={label}
                  className={isHighlighted ? 'bg-blue-500/5 dark:bg-blue-400/5' : 'bg-surface'}
                >
                  <td className="whitespace-nowrap px-2.5 py-2.5 font-medium text-ink sm:px-4">
                    {label}
                    {subjectWeight !== 1 && (
                      <span className="ml-1 font-mono text-xs font-bold text-blue-700 dark:text-blue-400">
                        (×{subjectWeight})
                      </span>
                    )}
                  </td>
                  {yearLabels.map((_, yearIndex) => {
                    const cellIndex = subjectIndex * yearLabels.length + yearIndex;
                    const meta = getCellMeta?.({ cellIndex, subjectIndex, yearIndex }) || {};
                    const displayValue = rowDisplayValues[yearIndex];

                    return (
                      <td key={cellIndex} className="px-1 py-2 sm:px-2">
                        <ScoreInput
                          max={10}
                          maxIntPartLength={1}
                          value={displayValue}
                          onValueChange={(value) => onChange(cellIndex, value)}
                          disabled={disabled || meta.disabled}
                          tone={tone}
                          data-transcript-cell={cellIndex}
                          aria-label={`${label} - ${yearLabels[yearIndex]}`}
                          onKeyDown={(event) => handleCellKeyDown(event, subjectIndex, yearIndex)}
                          onPaste={(event) => handleCellPaste(event, subjectIndex, yearIndex)}
                          className="px-1.5 text-center sm:px-3"
                          inputClassName={meta.className || 'text-ink'}
                          placeholder={meta.placeholder || '0.0'}
                          title={meta.title || ''}
                        />
                      </td>
                    );
                  })}
                  {showAverageColumn && (
                    <td className={`whitespace-nowrap px-2 py-2 text-center font-mono text-xs font-semibold tabular-nums text-ink-secondary sm:px-3 ${showNoteColumn ? 'hidden sm:table-cell' : ''}`}>
                      {rowAvg}
                    </td>
                  )}
                  {showNoteColumn && (
                    <td className="w-20 px-1.5 py-2 text-center text-[11px] leading-tight sm:w-32 sm:px-3 sm:text-sm">
                      {renderSubjectNote?.({ subjectIndex })}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {onClear && hasAnyValue && !disabled && (
        <div className="flex justify-end text-xs">
          <button
            type="button"
            onClick={onClear}
            className="btn-tactile inline-flex items-center gap-1 px-2 py-1 font-medium text-ink-secondary hover:bg-red-500/10 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 dark:hover:text-red-400"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Xóa bảng
          </button>
        </div>
      )}
    </div>
  );
};
