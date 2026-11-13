export const COLOR = {
  reset: '\x1b[0m',
  dim: '\x1b[2m',
  white: '\x1b[0;37m',
  red: '\x1b[1;31m',
  green: '\x1b[1;32m',
  yellow: '\x1b[1;33m',
  blue: '\x1b[38;5;27m',
  magenta: '\x1b[1;35m',
  cyan: '\x1b[1;36m',
  orange: '\x1b[38;5;208m',
  gray: '\x1b[38;5;245m',
}

export const ink = (code) => `\x1b[38;5;${code}m`
export const paper = (code) => `\x1b[48;5;${code}m`

// A space in a sprite is clear. This no-break space draws an opaque blank.
export const OPAQUE = '\u00a0'

// CJK characters render two columns wide.
export const WIDE = /[⺀-鿿豈-﫿]/

// Builds scenery from a pattern string. Each key maps to [glyph, ink, paper]. A key with no
// legend entry draws itself with no color. A wide glyph is followed by an empty cell that
// holds its second column.
export function tiles(pattern, legend) {
  const cells = [...pattern].flatMap((key) => {
    const cell = legend[key] ?? [key, '']
    if (!WIDE.test(cell[0])) return [cell]
    return [cell, ['', cell[1], cell[2]]]
  })
  return {
    glyphs: cells.map(([glyph]) => glyph),
    colors: cells.map(([, ink]) => ink),
    backgrounds: cells.map(([, , paper]) => paper),
  }
}

// Two pixel rows make one row of cells. '▀' draws the upper pixel as ink and the lower pixel as
// paper. A key that the palette lacks is clear, and an odd row count gets a clear top row.
function pixelFrame(rows, palette) {
  if (new Set(rows.map((row) => row.length)).size > 1) throw new Error(`pixel rows differ in width: ${rows.join(' | ')}`)
  const clear = '.'.repeat(rows[0].length)
  const even = rows.length % 2 ? [clear, ...rows] : rows
  const lines = Array.from({ length: even.length / 2 }, (_, line) =>
    [...even[line * 2]].map((top, column) => {
      const upper = palette[top]
      const lower = palette[even[line * 2 + 1][column]]
      if (upper === undefined && lower === undefined) return [' ', '']
      if (upper === undefined) return ['▄', ink(lower)]
      if (lower === undefined) return ['▀', ink(upper)]
      if (upper === lower) return ['█', ink(upper)]
      return ['▀', ink(upper), paper(lower)]
    }),
  )
  const cells = lines.flat()
  return {
    text: lines.map((line) => line.map(([glyph]) => glyph).join('')).join('\n'),
    inks: cells.map(([, cellInk]) => cellInk),
    papers: cells.map(([, , cellPaper]) => cellPaper),
  }
}

// Each frame lists pixel rows, one character per pixel. The palette maps each character to a
// 256-color code.
export function pixelSprite(frames, palette) {
  const drawn = frames.map((rows) => pixelFrame(rows, palette))
  return {
    glyphs: drawn.map(({ text }) => text),
    colors: drawn.map(({ inks }) => inks),
    backgrounds: drawn.map(({ papers }) => papers),
  }
}

// Scenery for one row, from two rows of pixel art.
export function pixelTiles(rows, palette) {
  const { text, inks, papers } = pixelFrame(rows, palette)
  return { glyphs: [...text], colors: inks, backgrounds: papers }
}

// Scenery for several rows from one block of pixel art, top row first. The rows share one width, so
// a pipe that spans rows stays aligned.
export function pixelRows(rows, palette) {
  if (new Set(rows.map((row) => row.length)).size > 1) throw new Error(`pixel rows differ in width: ${rows.join(' | ')}`)
  return Array.from({ length: rows.length / 2 }, (_, line) => pixelTiles(rows.slice(line * 2, line * 2 + 2), palette))
}

// A sprite from glyph patterns. A line break starts the next row, and each key maps to
// [glyph, ink, paper] as in tiles.
export function sprite(frames, legend) {
  const drawn = frames.map((frame) => tiles(frame.replace(/\n/g, ''), legend))
  return {
    glyphs: frames.map((frame) => frame.replace(/./gu, (key) => legend[key]?.[0] ?? key)),
    colors: drawn.map(({ colors }) => colors),
    backgrounds: drawn.map(({ backgrounds }) => backgrounds),
  }
}

// Health-bar frames that drain one glyph at a time, from the right edge for a left bar and
// from the left edge for a right bar.
export function drain(length, side) {
  return Array.from({ length }, (_, lost) => {
    const bar = '▬'.repeat(length - lost)
    const gap = ' '.repeat(lost)
    return side === 'left' ? `${bar}${gap}` : `${gap}${bar}`
  })
}
