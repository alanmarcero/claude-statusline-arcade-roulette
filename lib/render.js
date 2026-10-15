import { createHash } from 'node:crypto'
import { COLOR, GAMES, WIDE } from './games.js'

const MIN_WIDTH = 30
const MAX_WIDTH = 90
const ANSI = /\x1b\[[0-9;]*m/g
// Each actor spends two frames of every six in the air, offset so they hop in turn.
const HOP_CYCLE = 6
const HOP_FRAMES = 2
const HOP_OFFSET = { player: 0, fiveHour: 4, sevenDay: 2 }
// A game with a scared sprite swaps it in for every chaser during the first SCARE_FRAMES of
// each SCARE_CYCLE, like Pac-Man's ghosts after a power pellet.
const SCARE_CYCLE = 12
const SCARE_FRAMES = 4
const ATTRACT = ' INSERT COIN '
const CAPTION_STEP = 2
const STAR_SPACING = 13
// Mario's clock starts at 400 and loses one per minute of the session.
const MARIO_CLOCK = 400
// A game's banner shows in the middle of the sky for the first BANNER_FRAMES of each BANNER_CYCLE.
const BANNER_CYCLE = 20
const BANNER_FRAMES = 3
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

// The actors run a loop that depends only on the frame. The player drifts three cells either
// side of a spot past the middle, and each chaser closes in on the actor ahead and falls back.
export function layout(fieldWidth, frame) {
  const player = Math.floor(fieldWidth * 0.6) - 3 + Math.abs((frame % 12) - 6)
  const fiveHour = player - 4 - Math.abs(((frame + 3) % 8) - 4)
  const sevenDay = fiveHour - 3 - Math.abs(((frame + 5) % 10) - 5)
  return {
    player,
    bonus: fieldWidth - 3,
    chasers: [
      { key: 'fiveHour', position: fiveHour },
      { key: 'sevenDay', position: sevenDay },
    ],
  }
}

// Ten points per line Claude added or removed, like an arcade score.
export function scoreOf(input) {
  return ((input.cost?.total_lines_added ?? 0) + (input.cost?.total_lines_removed ?? 0)) * 10
}

export function isAirborne(actor, frame) {
  return (frame + HOP_OFFSET[actor]) % HOP_CYCLE < HOP_FRAMES
}

// A glyph entry with several characters, or an array of colors, animates in place. The phase
// adds the cell index, so neighboring cells ripple instead of blinking together.
export function tile(sprite, step, frame = 0) {
  const length = sprite.glyphs.length
  const index = ((step % length) + length) % length
  const frames = [...sprite.glyphs[index]]
  const inks = [sprite.colors?.[index] || sprite.color || ''].flat()
  const phase = frame + index
  return {
    glyph: frames[phase % frames.length] ?? '',
    color: inks[phase % inks.length],
    background: sprite.backgrounds?.[index] || sprite.background,
  }
}

export function render(input, { game, width, frame, nowSeconds, effort, highScore = 0, isIdle = false }) {
  const totalWidth = Math.min(Math.max(width, MIN_WIDTH), MAX_WIDTH)
  const fieldWidth = totalWidth - 4
  const fiveHour = input.rate_limits?.five_hour
  const sevenDay = input.rate_limits?.seven_day
  const contextUsed = Math.round(input.context_window?.used_percentage ?? 0)
  const { player, bonus, chasers } = layout(fieldWidth, frame)

  const isScared = Boolean(game.scared) && frame % SCARE_CYCLE < SCARE_FRAMES
  const actors = [
    ...chasers.map((chaser) => ({
      key: chaser.key,
      position: chaser.position,
      sprite: isScared ? game.scared : game.chasers[chaser.key],
    })),
    { key: 'player', position: player, sprite: game.player },
  ]
  const airborne = actors.filter((actor) => isAirborne(actor.key, frame))
  // A shot leaves the player and crosses the rest of the field three cells per frame.
  const shotRange = fieldWidth - player - 2
  const shots =
    game.shot && shotRange > 0
      ? [{ key: 'shot', position: player + 2 + ((frame * 3) % shotRange), sprite: game.shot }]
      : []
  // An actor with a tail drags that many tail cells behind it along the ground row.
  const tails = actors.flatMap((actor) => {
    const tail = actor.sprite.tail
    if (!tail) return []
    return Array.from({ length: tail.length }, (_, step) => ({
      key: 'tail',
      position: actor.position - step - 1,
      sprite: tail,
    })).filter((segment) => segment.position >= 0)
  })
  const grounded = [...actors.filter((actor) => !airborne.includes(actor)), ...shots, ...tails]
  const cells = Array.from({ length: fieldWidth }, (_, index) => index)

  // Adding the frame to the step scrolls the scenery left. The sky scrolls at skySpeed cells per
  // frame (half speed by default, negative scrolls right) and the backdrop above it at
  // backdropSpeed (quarter speed by default). The base row under the ground scrolls with the
  // ground. An actor keeps the background of the scenery it
  // covers.
  const skyShift = Math.floor(frame * (game.skySpeed ?? 0.5))
  const banner = game.banner && frame % BANNER_CYCLE < BANNER_FRAMES ? game.banner : undefined
  const bannerStart = Math.floor((fieldWidth - (banner?.text.length ?? 0)) / 2)
  const skyScenery = (index) => {
    const cell = tile(game.sky, index + skyShift, frame)
    const letter = banner?.text[index - bannerStart]
    if (!letter) return cell
    return { ...cell, glyph: letter, color: banner.color }
  }
  const groundScenery = (index) => {
    if (index <= player) return tile(game.trail, index + frame, frame)
    if (index === bonus) return tile(game.bonus, frame)
    return tile(game.ahead, index + frame, frame)
  }
  const backdropShift = Math.floor(frame * (game.backdropSpeed ?? 0.25))
  // Captions pin text one cell in from each edge of the backdrop (topCaption) and base (caption)
  // rows, like the health bars, lives and credits around an arcade screen. A caption given as a
  // list of texts of one length steps through them every CAPTION_STEP frames.
  const captions = new Map(
    [
      ['top', game.topCaption?.left, 'left'],
      ['top', game.topCaption?.right, 'right'],
      ['base', game.caption?.left, 'left'],
      ['base', game.caption?.right, 'right'],
    ]
      .filter(([, side]) => side)
      .flatMap(([row, [texts, ink], edge]) => {
        const frames = [texts].flat()
        const glyphs = [...frames[Math.floor(frame / CAPTION_STEP) % frames.length]]
        const start = edge === 'left' ? 1 : fieldWidth - 1 - glyphs.length
        return glyphs.map((glyph, offset) => [`${row}:${start + offset}`, { glyph, color: ink }])
      }),
  )
  // A starry game lights a few empty backdrop cells, and the set moves every other frame so the
  // stars twinkle.
  const backdropScenery = (index) => {
    const cell = { ...tile(game.backdrop, index + backdropShift, frame), ...captions.get(`top:${index}`) }
    const isStar = game.stars && cell.glyph === ' ' && (index * 37 + Math.floor(frame / 2) * 11) % STAR_SPACING === 0
    if (!isStar) return cell
    return { ...cell, glyph: '·', color: COLOR.gray }
  }
  const baseScenery = (index) => ({ ...tile(game.base, index + frame, frame), ...captions.get(`base:${index}`) })
  const [backdrop, sky, ground, base] = [
    { actors: [], scenery: backdropScenery },
    { actors: airborne, scenery: skyScenery },
    { actors: grounded, scenery: groundScenery },
    { actors: [], scenery: baseScenery },
  ].map(({ actors: rowActors, scenery }) =>
    cells
      .map((index) => {
        const cell = scenery(index)
        const actor = rowActors.find((candidate) => candidate.position === index)
        const face = actor && tile(actor.sprite, frame)
        // A wide glyph spans this cell and its partner. If an actor or the field edge covers the
        // partner, this half draws a space so the row keeps its width.
        const isHalf = cell.glyph === ''
        const partner = isHalf ? index - 1 : index + 1
        const isSplit =
          (isHalf || WIDE.test(cell.glyph)) &&
          (partner < 0 || partner >= fieldWidth || rowActors.some((candidate) => candidate.position === partner))
        const { glyph, color } = face || (isSplit ? { ...cell, glyph: ' ' } : cell)
        return `${COLOR.reset}${cell.background || game.screen}${color}${glyph}`
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
    (_, index) => `${(index - frame) % 4 ? game.border : COLOR.yellow}═`,
  ).join('')
  const topBorder = `${game.border}╭${marquee}${lights}${game.border}╮${COLOR.reset}`
  const [backdropLine, skyLine, groundLine, baseLine] = [backdrop, sky, ground, base].map(
    (row) => `${game.border}║${COLOR.reset} ${row} ${game.border}║${COLOR.reset}`,
  )
  // Each game fills its own scoreboard template. {hi} is the best score this game has seen,
  // including this session. Labels draw in the board's ink, digits in white.
  const score = scoreOf(input)
  const stats = {
    score: String(score).padStart(6, '0'),
    hi: String(Math.max(score, highScore)).padStart(6, '0'),
    short: String(Math.min(score / 10, 999)).padStart(3, '0'),
    time: String(Math.max(MARIO_CLOCK - Math.floor((input.cost?.total_duration_ms ?? 0) / 60_000), 0)).padStart(3, '0'),
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
  // An idle session shows attract-mode text between the boards, when it fits.
  const fillWidth = innerWidth - (shownLeft && shownLeft.length + 4) - (shownRight && shownRight.length + 4)
  const attract = isIdle && fillWidth >= ATTRACT.length + 4 ? ATTRACT : ''
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
    { label: '7d', limit: sevenDay, sprite: game.chasers.sevenDay },
    { label: '5h', limit: fiveHour, sprite: game.chasers.fiveHour },
  ]
    .filter(({ limit }) => limit)
    .map(({ label, limit, sprite }) => {
      const remaining = Math.max(100 - Math.round(limit.used_percentage ?? 0), 0)
      const countdown = formatCountdown(limit.resets_at, nowSeconds)
      const reset = countdown && ` ${COLOR.dim}↓${countdown}${COLOR.reset}`
      const icon = tile(sprite, frame)
      return `${icon.color}${icon.glyph}${COLOR.reset} ${COLOR.dim}${label}${COLOR.reset} ${colorRemaining(remaining)}${reset}`
    })
  const effortLabel = effort && `${COLOR.dim}${effort}${COLOR.reset}`
  const footer = [...limits, effortLabel].filter(Boolean).join('  ')

  return [header, topBorder, backdropLine, skyLine, groundLine, baseLine, bottomBorder, footer]
    .filter(Boolean)
    .join('\n')
}
