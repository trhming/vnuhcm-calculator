import { ScoreInput } from '../score/ScoreInput';

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
  getDisplayValue,
  getCellMeta,
  renderSubjectNote,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left text-sm">
        <thead className="bg-slate-50 text-slate-600">
          <tr>
            <th className="w-1 whitespace-nowrap rounded-tl-lg px-4 py-3 font-semibold">Môn</th>
            {yearLabels.map((label) => (
              <th key={label} className="w-1/4 px-4 py-3 text-center font-semibold">{label}</th>
            ))}
            {showNoteColumn && (
              <th className="w-28 rounded-tr-lg px-2 py-3 text-center font-semibold sm:w-32 sm:px-4">
                {noteHeader}
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {subjectLabels.map((label, subjectIndex) => {
            const isHighlighted = highlightedSubjects.includes(subjectIndex);
            const subjectWeight = subjectWeights[subjectIndex] || 1;

            return (
              <tr key={label} className={isHighlighted ? 'bg-blue-50/50' : ''}>
                <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-700">
                  {label}
                  {subjectWeight !== 1 && (
                    <span className="ml-1 font-bold text-blue-700">(x{subjectWeight})</span>
                  )}
                </td>
                {yearLabels.map((_, yearIndex) => {
                  const cellIndex = subjectIndex * yearLabels.length + yearIndex;
                  const meta = getCellMeta?.({ cellIndex, subjectIndex, yearIndex }) || {};
                  const displayValue = getDisplayValue
                    ? getDisplayValue({ cellIndex, subjectIndex, yearIndex })
                    : values[cellIndex];

                  return (
                    <td key={cellIndex} className="px-2 py-2">
                      <ScoreInput
                        max={10}
                        value={displayValue}
                        onValueChange={(value) => onChange(cellIndex, value)}
                        disabled={disabled || meta.disabled}
                        tone={tone}
                        className="px-2 text-center transition-colors sm:px-3"
                        inputClassName={meta.className || 'text-slate-900'}
                        placeholder={meta.placeholder || '0.0'}
                        title={meta.title || ''}
                      />
                    </td>
                  );
                })}
                {showNoteColumn && (
                  <td className="w-28 px-2 py-2 text-center text-xs leading-tight sm:w-32 sm:px-3 sm:text-sm">
                    {renderSubjectNote?.({ subjectIndex })}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
