import { createHash } from 'node:crypto'
import { COLOR, WIDE, ink, paper } from './art.js'
import { GAMES } from './games.js'

const MIN_WIDTH = 30
const MAX_WIDTH = 90
const ANSI = /\x1b\[[0-9;]*m/g
const ROWS = ['backdrop', 'sky', 'ground', 'base']
// A negative speed scrolls right.
const SPEEDS = [0.25, 0.5, 1, 1]
const ATTRACT = ' INSERT COIN '
const STAR_SPACING = 13
// Lights in the border's own color would not show, so a yellow border gets red lights.
const LIGHTS = { [COLOR.yellow]: ink(196) }
// A white glint sweeps across the logo, then rests for GLINT_REST frames.
const GLINT_REST = 6
const GLINT = '\x1b[1;97m'

export function pickGame(sessionId) {
  const digest = createHash('md5').update(String(sessionId)).digest()
  return GAMES[digest.readUInt32BE(0) % GAMES.length]
}

// Deals the session's variant of a game. A game's vary function picks its details, such as the
// fighters or the lives left, from a hash of the session ID, so a session keeps them and a new
// session gets new ones.
export function customize(game, sessionId) {
  if (!game.vary) return game
  const digest = createHash('md5').update(`${sessionId}:${game.id}`).digest()
  const pick = (list, slot) => list[digest[slot] % list.length]
  return { ...game, ...game.vary(pick, game) }
}

export function formatCountdown(resetsAt, nowSeconds) {
  if (!resetsAt) return ''
  const remaining = resetsAt - nowSeconds
  if (remaining <= 0) return 'now'

  const days = Math.floor(remaining / 86400)
  const hours = Math.floor((remaining % 86400) / 3600)
  const minutes = Math.floor((remaining % 3600) / 60)
  if (days > 0) return `${days}d${hours}h`
  if (hours > 0) return `${hours}h${minutes}m`
  return `${minutes}m`
}

export function colorRemaining(remaining) {
  if (remaining <= 20) return `${COLOR.red}${remaining}%${COLOR.reset}`
  if (remaining <= 50) return `${COLOR.yellow}${remaining}%${COLOR.reset}`
  return `${COLOR.white}${remaining}%${COLOR.reset}`
}

// Ten points per line Claude added or removed, like an arcade score.
export function scoreOf(input) {
  return ((input.cost?.total_lines_added ?? 0) + (input.cost?.total_lines_removed ?? 0)) * 10
}

// A track lists [t, value] cues in loop order. Each value holds until the next cue. A plain value
// never changes.
export function cue(track, t) {
  if (!Array.isArray(track?.[0])) return track
  return track.findLast(([start]) => start <= t)?.[1]
}

// A keyframe [t, sprite, x, dx, row] starts x cells from the anchor and moves dx cells a frame. A
// keyframe with no x starts where the keyframe before it stops.
function offset(track, index, t) {
  const [start, , x, dx = 0] = track[index]
  const moved = Math.trunc(dx * (t - start))
  if (x !== undefined && x !== null) return x + moved
  if (index === 0) return moved
  return offset(track, index - 1, start) + moved
}

// A keyframe with no sprite hides the actor.
export function place(track, t) {
  const index = track.findLastIndex(([start]) => start <= t)
  const [start, sprite, , , row = 'ground'] = track[index] ?? []
  if (!sprite) return undefined
  return { sprite, x: offset(track, index, t), row, elapsed: t - start }
}

// The rightmost offset the actor has reached since the loop began.
export function reach(track, t) {
  const reached = track.flatMap(([start, sprite], index) => {
    if (start > t || !sprite) return []
    const end = Math.min((track[index + 1]?.[0] ?? Infinity) - 1, t)
    return [offset(track, index, start), offset(track, index, end)]
  })
  return Math.max(...reached)
}

// The last line of a frame stands on the actor's row, and earlier lines stack above it.
// colors[frame] and backgrounds[frame] set the ink and paper of each cell in reading order.
// Otherwise color inks every cell, and a list of inks ripples.
export function spriteCells(sprite, elapsed) {
  const frame = elapsed % sprite.glyphs.length
  const lines = sprite.glyphs[frame].split('\n').map((line) => [...line])
  const inks = [sprite.color ?? ''].flat()
  return lines
    .flatMap((glyphs, line) => glyphs.map((glyph, column) => ({ glyph, column, rise: lines.length - 1 - line })))
    .map((cell, order) => ({
      ...cell,
      color: sprite.colors?.[frame]?.[order] ?? inks[(elapsed + order) % inks.length],
      background: sprite.backgrounds?.[frame]?.[order] ?? sprite.background,
    }))
}

// The [upper, lower] colors of a cell drawn over a layer.
export function layer([upper, lower], { glyph, color, background }) {
  const back = background ? [background, background] : [upper, lower]
  const code = color?.match(/^\x1b\[38;5;(\d+)m$/)?.[1]
  const fill = (code && paper(code)) || back[1]
  return { '█': [fill, fill], '▀': [fill, back[1]], '▄': [back[0], fill] }[glyph] ?? back
}

// A glyph entry with several characters, or an array of colors, animates in place. The phase
// adds the cell index, so neighboring cells ripple instead of blinking together.
export function tile(sprite, step, frame) {
  const length = sprite.glyphs.length
  const index = ((step % length) + length) % length
  const frames = [...sprite.glyphs[index]]
  const inks = [sprite.colors?.[index] || ''].flat()
  const phase = frame + index
  return {
    glyph: frames[phase % frames.length] ?? '',
    color: inks[phase % inks.length],
    background: sprite.backgrounds?.[index],
  }
}

export function render(input, { game, width, frame, nowSeconds, effort, highScore = 0, isIdle = false }) {
  const totalWidth = Math.min(Math.max(width, MIN_WIDTH), MAX_WIDTH)
  const fieldWidth = totalWidth - 4
  const fiveHour = input.rate_limits?.five_hour
  const sevenDay = input.rate_limits?.seven_day
  const contextUsed = Math.round(input.context_window?.used_percentage ?? 0)
  const cells = Array.from({ length: fieldWidth }, (_, index) => index)

  // The cast, captions and flashes follow the loop time. The scenery follows the frame, so it does
  // not jump when the loop starts again.
  const t = ((frame % game.loop) + game.loop) % game.loop
  const anchor = Math.floor(fieldWidth * (game.anchor ?? 0.5))

  // Each cell stacks its actors in cast order, so a later actor draws over an earlier one.
  const stacks = Object.keys(game.cast)
    .flatMap((name) => {
      const spot = place(game.cast[name], t)
      if (!spot) return []
      const sprite = game.sprites[spot.sprite]
      const row = ROWS.indexOf(spot.row)
      if (!sprite || row < 0) throw new Error(`${game.id} ${name}: no sprite ${spot.sprite} or no row ${spot.row}`)
      return spriteCells(sprite, spot.elapsed)
        .filter(({ glyph }) => glyph !== ' ')
        .map((cell) => [`${row - cell.rise}:${anchor + spot.x + cell.column}`, cell])
    })
    .reduce((cellStacks, [key, cell]) => cellStacks.set(key, [...(cellStacks.get(key) ?? []), cell]), new Map())

  // Captions sit one cell in from each edge of the backdrop and base rows. A center caption gets a
  // blank on each side and shows only when one more cell separates it from the edge captions.
  const captionCells = ([row, edge, [track, ink, letters] = [], padding = '']) => {
    const text = cue(track, t)
    if (!text) return []
    const glyphs = [...`${padding}${text}${padding}`]
    const start = { left: 1, right: fieldWidth - 1 - glyphs.length, center: Math.floor((fieldWidth - glyphs.length) / 2) }[edge]
    const inks = [cue(ink, t)].flat()
    const letterInks = cue(letters, t) ?? []
    return glyphs.map((glyph, column) => [
      `${row}:${start + column}`,
      { glyph, color: letterInks[column - padding.length] ?? inks[(frame + column) % inks.length] },
    ])
  }
  const edgeCaptions = new Map(
    [
      [0, 'left', game.topCaption?.left],
      [0, 'right', game.topCaption?.right],
      [3, 'left', game.caption?.left],
      [3, 'right', game.caption?.right],
    ].flatMap(captionCells),
  )
  const centered = captionCells([0, 'center', game.topCaption?.center, ' '])
  const isClear = centered.every(([key]) => {
    const index = Number(key.split(':')[1])
    return [index - 1, index, index + 1].every((cell) => !edgeCaptions.has(`0:${cell}`))
  })
  const captions = new Map([...edgeCaptions, ...(isClear ? centered : []), ...captionCells([1, 'center', game.banner])])

  // The ground up to the farthest cell the player has reached shows the trail, such as eaten pellets.
  const edge = anchor + reach(game.cast.player, t)
  const shifts = (game.speeds ?? SPEEDS).map((speed) => Math.floor(frame * speed))
  const scenery = [
    (index) => {
      // The stars move every other frame, so they twinkle.
      const cell = tile(game.backdrop, index + shifts[0], frame)
      const isStar = game.stars && cell.glyph === ' ' && (index * 37 + Math.floor(frame / 2) * 11) % STAR_SPACING === 0
      return isStar ? { ...cell, glyph: '·', color: COLOR.gray } : cell
    },
    (index) => tile(game.sky, index + shifts[1], frame),
    (index) => tile(index <= edge ? (game.trail ?? game.ahead) : game.ahead, index + shifts[2], frame),
    (index) => tile(game.base, index + shifts[3], frame),
  ]

  const flash = cue(game.flash, t) ?? {}
  const screens = [flash.screen ?? game.screen].flat()
  const [backdrop, sky, ground, base] = scenery.map((sceneryAt, row) =>
    cells
      .map((index) => {
        const cell = sceneryAt(index)
        const stack = stacks.get(`${row}:${index}`) ?? []
        const caption = captions.get(`${row}:${index}`)
        const front = caption ?? stack.at(-1)
        // A wide glyph spans this cell and its partner. If the field edge, an actor or a caption
        // covers the partner, this half draws a space so the row keeps its width.
        const isHalf = cell.glyph === ''
        const partner = isHalf ? index - 1 : index + 1
        const partnerKey = `${row}:${partner}`
        const isOutside = partner < 0 || partner >= fieldWidth
        const isSplit = (isHalf || WIDE.test(cell.glyph)) && (isOutside || captions.has(partnerKey) || stacks.has(partnerKey))
        const color = flash.ink ?? cell.color
        const sceneryPaper = cell.background ?? screens[row] ?? screens[0]
        // The clear half of a front half-block (the top of '▄', the bottom of '▀') shows the layers
        // behind it. Text sits on the scenery paper or on the actor it covers.
        const beneath = stack.slice(0, caption ? stack.length : -1)
        const [upper, lower] = beneath.reduce(layer, layer([sceneryPaper, sceneryPaper], { glyph: cell.glyph, color }))
        const flat = beneath.length ? lower : sceneryPaper
        const glyph = front?.glyph ?? (isSplit ? ' ' : cell.glyph)
        const background = front?.background ?? { '▀': lower, '▄': upper }[front?.glyph] ?? flat
        return `${COLOR.reset}${background}${front?.color ?? color}${glyph}`
      })
      .join('')
      .concat(COLOR.reset),
  )

  const letters = game.logo.flatMap(([text, ink]) => [...text].map((letter) => ({ letter, ink })))
  const glint = frame % (letters.length + GLINT_REST)
  const title = letters.map(({ letter, ink }, index) => `${index === glint ? GLINT : ink}${letter}`).join('')
  const titleText = letters.map(({ letter }) => letter).join('')
  const titleWidth = letters.length + (titleText.match(new RegExp(WIDE, 'g'))?.length ?? 0) + 4
  // A title too long for a narrow border leaves the whole border to the lights.
  const marquee = titleWidth <= fieldWidth + 2 ? `══ ${COLOR.reset}${title}${COLOR.reset}${game.border} ` : ''
  const marqueeWidth = marquee ? titleWidth : 0
  // Marquee lights chase right along the top border.
  const lights = Array.from(
    { length: fieldWidth + 2 - marqueeWidth },
    (_, index) => `${(index - frame) % 4 ? game.border : (LIGHTS[game.border] ?? COLOR.yellow)}═`,
  ).join('')
  const topBorder = `${game.border}╭${marquee}${lights}${game.border}╮${COLOR.reset}`
  const [backdropLine, skyLine, groundLine, baseLine] = [backdrop, sky, ground, base].map(
    (row) => `${game.border}║${COLOR.reset} ${row} ${game.border}║${COLOR.reset}`,
  )
  // Each game fills its own scoreboard template. {hi} is the best score this game has seen,
  // including this session. {time} is the game's clock, which loses one per minute of the session.
  // Labels draw in the board's ink, digits in white.
  const score = scoreOf(input)
  const stats = {
    score: String(score).padStart(6, '0'),
    hi: String(Math.max(score, highScore)).padStart(6, '0'),
    short: String(Math.min(score / 10, 999)).padStart(3, '0'),
    time: String(Math.max((game.clock ?? 0) - Math.floor((input.cost?.total_duration_ms ?? 0) / 60_000), 0)).padStart(3, '0'),
  }
  const board = game.scoreboard
  const [leftText, rightText] = [board.left, board.right].map((template) =>
    template.replace(/\{(\w+)\}/g, (_, key) => stats[key]),
  )
  // A narrow border drops the right board first, then the left.
  const innerWidth = fieldWidth + 2
  const [shownLeft, shownRight] = [
    [leftText, rightText],
    [leftText, ''],
    ['', ''],
  ].find(([left, right]) => (left && left.length + 4) + (right && right.length + 4) <= innerWidth)
  const ink = board.ink ?? COLOR.red
  const leftInk = board.blink && frame % 2 ? COLOR.white : ink
  const [leftBoard, rightBoard] = [
    [shownLeft, leftInk],
    [shownRight, ink],
  ].map(([text, textInk]) => `${textInk}${text.replace(/\d+/g, (digits) => `${COLOR.white}${digits}${textInk}`)}`)
  const scoreboard = shownLeft && `══ ${leftBoard}${COLOR.reset}${game.border} `
  const hiboard = shownRight && ` ${rightBoard}${COLOR.reset}${game.border} ══`
  // An idle session shows the game's idle text between the boards when it fits. An arcade game
  // asks for a coin.
  const fillWidth = innerWidth - (shownLeft && shownLeft.length + 4) - (shownRight && shownRight.length + 4)
  const idleText = game.idleText ?? ATTRACT
  const attract = isIdle && fillWidth >= idleText.length + 4 ? idleText : ''
  const leftFill = Math.floor((fillWidth - attract.length) / 2)
  const fill = `${'═'.repeat(leftFill)}${COLOR.yellow}${attract}${game.border}${'═'.repeat(fillWidth - attract.length - leftFill)}`
  const bottomBorder = `${game.border}╰${scoreboard}${fill}${hiboard}╯${COLOR.reset}`

  const version = input.version ? ` ${COLOR.dim}v${input.version}${COLOR.reset}` : ''
  const model = input.model?.display_name ?? input.model?.id
  const windowSize = input.context_window?.context_window_size
  const sizeLabel = windowSize >= 1_000_000 ? `${windowSize / 1_000_000}M` : `${windowSize / 1000}k`
  const headerLeft = `${COLOR.orange}CLAUDE${COLOR.reset}${version}`
  const headerRight = [
    model && `${COLOR.white}${model}${COLOR.reset}`,
    windowSize && `${COLOR.dim}${sizeLabel}${COLOR.reset}`,
    `${COLOR.dim}context${COLOR.reset} ${colorRemaining(Math.max(100 - contextUsed, 0))}`,
    `${COLOR.dim}left${COLOR.reset}`,
  ]
    .filter(Boolean)
    .join(' ')
  const headerGap = totalWidth - headerLeft.replace(ANSI, '').length - headerRight.replace(ANSI, '').length
  const header = `${headerLeft}${' '.repeat(Math.max(headerGap, 2))}${headerRight}`

  const limits = [
    { label: '7d', limit: sevenDay, sprite: game.sprites[game.icons.sevenDay] },
    { label: '5h', limit: fiveHour, sprite: game.sprites[game.icons.fiveHour] },
  ]
    .filter(({ limit }) => limit)
    .map(({ label, limit, sprite }) => {
      const remaining = Math.max(100 - Math.round(limit.used_percentage ?? 0), 0)
      const countdown = formatCountdown(limit.resets_at, nowSeconds)
      const reset = countdown && ` ${COLOR.dim}↓${countdown}${COLOR.reset}`
      // The footer icon is the bottom line of the sprite.
      const icon = spriteCells(sprite, t)
        .filter(({ rise }) => rise === 0)
        .map(({ glyph, color }) => `${color}${glyph}`)
        .join('')
      return `${icon}${COLOR.reset} ${COLOR.dim}${label}${COLOR.reset} ${colorRemaining(remaining)}${reset}`
    })
  const effortLabel = effort && `${COLOR.dim}${effort}${COLOR.reset}`
  const footer = [...limits, effortLabel].filter(Boolean).join('  ')

  return [header, topBorder, backdropLine, skyLine, groundLine, baseLine, bottomBorder, footer]
    .filter(Boolean)
    .join('\n')
}
