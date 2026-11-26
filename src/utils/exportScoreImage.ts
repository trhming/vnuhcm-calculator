export type ScoreImageRow = {
  label: string;
  value: string;
  emphasis?: boolean;
  separatorBefore?: boolean;
};

export type ScoreImagePayload = {
  schoolAcronym?: string;
  totalText: string;
  headerNote?: string;
  formula?: string;
  formulaDetail?: string;
  dhlText?: string;
  learningRows: ScoreImageRow[];
  extraRows: ScoreImageRow[];
  isDark: boolean;
  accentHex: string;
};

const FONT_SANS = '"Be Vietnam Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
const FONT_MONO = '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace';

const wrapTextLines = (
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] => {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];
  const lines: string[] = [];
  let current = words[0];
  for (let i = 1; i < words.length; i++) {
    const candidate = `${current} ${words[i]}`;
    if (ctx.measureText(candidate).width <= maxWidth) {
      current = candidate;
    } else {
      lines.push(current);
      current = words[i];
    }
  }
  lines.push(current);
  return lines;
};

const drawRoundedRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) => {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
};

export const exportScoreCardPng = async (payload: ScoreImagePayload): Promise<boolean> => {
  if (typeof document === 'undefined') return false;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return false;

  const palette = payload.isDark
    ? {
        canvasBg: '#09090b',
        cardBg: '#121215',
        subtleBg: '#18181c',
        border: 'rgba(255, 255, 255, 0.10)',
        textPrimary: '#f4f4f5',
        textSecondary: '#a1a1aa',
        textMuted: '#71717a',
      }
    : {
        canvasBg: '#f6f6f7',
        cardBg: '#ffffff',
        subtleBg: '#f4f4f5',
        border: '#e4e4e7',
        textPrimary: '#09090b',
        textSecondary: '#52525b',
        textMuted: '#71717a',
      };

  const width = 960;
  const outerPad = 48;
  const cardWidth = width - outerPad * 2;
  const innerPadX = 48;
  const contentWidth = cardWidth - innerPadX * 2;

  // Measure wrapped text lines before sizing canvas height
  ctx.font = `500 22px ${FONT_SANS}`;
  const headerNoteLines = payload.headerNote ? wrapTextLines(ctx, payload.headerNote, contentWidth) : [];

  ctx.font = `500 21px ${FONT_MONO}`;
  const formulaLines = payload.formula ? wrapTextLines(ctx, payload.formula, contentWidth - 40) : [];

  ctx.font = `400 18px ${FONT_MONO}`;
  const formulaDetailLines = payload.formulaDetail
    ? wrapTextLines(ctx, payload.formulaDetail, contentWidth - 40)
    : [];

  let cursorY = outerPad + 6 + 40; // top card accent + top inner pad
  cursorY += 34; // school heading + label
  cursorY += 86; // huge score
  if (headerNoteLines.length > 0) {
    cursorY += 12 + headerNoteLines.length * 30;
  }
  cursorY += 32; // bottom pad of header block + divider

  const hasFormulaBox = Boolean(formulaLines.length > 0 || formulaDetailLines.length > 0 || payload.dhlText);
  let formulaBoxHeight = 0;
  if (hasFormulaBox) {
    formulaBoxHeight = 36;
    if (formulaLines.length > 0) formulaBoxHeight += formulaLines.length * 28;
    if (formulaDetailLines.length > 0) formulaBoxHeight += 8 + formulaDetailLines.length * 24;
    if (payload.dhlText) formulaBoxHeight += 42;
    cursorY += 28 + formulaBoxHeight;
  }

  if (payload.learningRows.length > 0) {
    cursorY += 32 + 34 + payload.learningRows.length * 40;
  }

  if (payload.extraRows.length > 0) {
    cursorY += 32 + 34;
    for (const row of payload.extraRows) {
      cursorY += (row.separatorBefore ? 12 : 0) + 40;
    }
  }

  cursorY += 36 + 44 + 40; // footer divider + footer text + bottom outer pad
  const height = cursorY;

  const dpr = 2;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.scale(dpr, dpr);

  // Background
  ctx.fillStyle = palette.canvasBg;
  ctx.fillRect(0, 0, width, height);

  const cardX = outerPad;
  const cardY = outerPad;
  const cardHeight = height - outerPad * 2;

  // Card surface + 1px hairline border + top accent strip
  ctx.save();
  drawRoundedRect(ctx, cardX, cardY, cardWidth, cardHeight, 20);
  ctx.fillStyle = palette.cardBg;
  ctx.fill();
  ctx.clip();

  ctx.fillStyle = payload.accentHex;
  ctx.fillRect(cardX, cardY, cardWidth, 6);
  ctx.restore();

  drawRoundedRect(ctx, cardX, cardY, cardWidth, cardHeight, 20);
  ctx.strokeStyle = palette.border;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  const leftX = cardX + innerPadX;
  const rightX = cardX + cardWidth - innerPadX;
  let y = cardY + 6 + 40;

  // School header row
  ctx.textBaseline = 'top';
  ctx.textAlign = 'left';
  ctx.font = `600 20px ${FONT_SANS}`;
  ctx.fillStyle = palette.textSecondary;
  ctx.fillText('Điểm xét tuyển 2026', leftX, y);

  if (payload.schoolAcronym) {
    ctx.textAlign = 'right';
    ctx.font = `700 20px ${FONT_MONO}`;
    ctx.fillStyle = payload.accentHex;
    ctx.fillText(payload.schoolAcronym, rightX, y);
  }
  y += 38;

  // Big Score
  ctx.textAlign = 'left';
  ctx.font = `800 64px ${FONT_MONO}`;
  ctx.fillStyle = palette.textPrimary;
  ctx.fillText(payload.totalText, leftX, y);
  const totalWidth = ctx.measureText(payload.totalText).width;
  ctx.font = `600 24px ${FONT_MONO}`;
  ctx.fillStyle = palette.textMuted;
  ctx.fillText('/ 100', leftX + totalWidth + 14, y + 30);
  y += 82;

  // Header note
  if (headerNoteLines.length > 0) {
    y += 10;
    ctx.font = `500 22px ${FONT_SANS}`;
    ctx.fillStyle = palette.textSecondary;
    for (const line of headerNoteLines) {
      ctx.fillText(line, leftX, y);
      y += 30;
    }
  }

  y += 32;
  ctx.fillStyle = palette.border;
  ctx.fillRect(cardX, y, cardWidth, 1);

  // Formula box
  if (hasFormulaBox) {
    y += 28;
    drawRoundedRect(ctx, leftX, y, contentWidth, formulaBoxHeight, 12);
    ctx.fillStyle = palette.subtleBg;
    ctx.fill();
    ctx.strokeStyle = palette.border;
    ctx.lineWidth = 1;
    ctx.stroke();

    let boxY = y + 18;
    const boxLeft = leftX + 20;
    const boxRight = rightX - 20;

    if (formulaLines.length > 0) {
      ctx.font = `500 21px ${FONT_MONO}`;
      ctx.fillStyle = palette.textPrimary;
      ctx.textAlign = 'left';
      for (const line of formulaLines) {
        ctx.fillText(line, boxLeft, boxY);
        boxY += 28;
      }
    }

    if (formulaDetailLines.length > 0) {
      boxY += 6;
      ctx.font = `400 18px ${FONT_MONO}`;
      ctx.fillStyle = palette.textSecondary;
      ctx.textAlign = 'left';
      for (const line of formulaDetailLines) {
        ctx.fillText(line, boxLeft, boxY);
        boxY += 24;
      }
    }

    if (payload.dhlText) {
      boxY += 10;
      ctx.fillStyle = palette.border;
      ctx.fillRect(boxLeft, boxY, contentWidth - 40, 1);
      boxY += 12;
      ctx.font = `700 21px ${FONT_MONO}`;
      ctx.fillStyle = palette.textPrimary;
      ctx.textAlign = 'left';
      ctx.fillText('ĐHL', boxLeft, boxY);
      ctx.textAlign = 'right';
      ctx.fillText(payload.dhlText, boxRight, boxY);
    }

    y += formulaBoxHeight;
  }

  const drawRowGroup = (title: string, rows: ScoreImageRow[]) => {
    y += 32;
    ctx.textAlign = 'left';
    ctx.font = `600 18px ${FONT_SANS}`;
    ctx.fillStyle = palette.textMuted;
    ctx.fillText(title, leftX, y);
    y += 34;

    for (const row of rows) {
      if (row.separatorBefore) {
        ctx.fillStyle = palette.border;
        ctx.fillRect(leftX, y + 2, contentWidth, 1);
        y += 12;
      }
      ctx.textAlign = 'left';
      ctx.font = `${row.emphasis ? 600 : 400} 21px ${FONT_SANS}`;
      ctx.fillStyle = row.emphasis ? palette.textPrimary : palette.textSecondary;
      ctx.fillText(row.label, leftX, y);

      ctx.textAlign = 'right';
      ctx.font = `${row.emphasis ? 700 : 600} 21px ${FONT_MONO}`;
      ctx.fillStyle = palette.textPrimary;
      ctx.fillText(row.value, rightX, y);
      y += 40;
    }
  };

  if (payload.learningRows.length > 0) {
    drawRowGroup('Điểm học lực', payload.learningRows);
  }

  if (payload.extraRows.length > 0) {
    drawRowGroup('Ưu tiên & điểm cộng', payload.extraRows);
  }

  // Footer
  y += 20;
  ctx.fillStyle = palette.border;
  ctx.fillRect(leftX, y, contentWidth, 1);
  y += 18;
  ctx.textAlign = 'left';
  ctx.font = `500 17px ${FONT_SANS}`;
  ctx.fillStyle = palette.textMuted;
  ctx.fillText('Tham khảo theo đề án tuyển sinh ĐHQG-HCM 2026', leftX, y);

  const slug = (payload.schoolAcronym || 'dhqg').toLowerCase();
  const dataUrl = canvas.toDataURL('image/png');
  const anchor = document.createElement('a');
  anchor.href = dataUrl;
  anchor.download = `diem-${slug}-2026.png`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);

  return true;
};
