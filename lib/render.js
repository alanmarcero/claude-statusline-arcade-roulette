import { createHash } from 'node:crypto'
import { COLOR, GAMES } from './games.js'

const MIN_WIDTH = 30
const MAX_WIDTH = 54
const RUNWAY = 12
const BONUS_PERCENT = 95
// The weekly chaser stays off the field until half the weekly limit is used.
const WEEKLY_RELEASE_PERCENT = 50
const ANSI = /\x1b\[[0-9;]*m/g
// Each actor spends two frames of every six in the air, offset so they hop in turn.
const HOP_CYCLE = 6
const HOP_FRAMES = 2
const HOP_OFFSET = { player: 0, fiveHour: 4, sevenDay: 2 }
const RAINBOW = [COLOR.red, COLOR.orange, COLOR.yellow, COLOR.green, COLOR.cyan, COLOR.blue, COLOR.magenta]

export function pickGame(sessionId) {
  const digest = createHash('md5').update(String(sessionId)).digest()
  return GAMES[digest.readUInt32BE(0) % GAMES.length]
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

export function layout({ fieldWidth, contextUsed, fiveHourUsed, sevenDayUsed }) {
  const lastCell = fieldWidth - 1
  const player = RUNWAY + Math.floor((Math.min(contextUsed, 100) * (lastCell - RUNWAY)) / 100)
  const bonus = RUNWAY + Math.floor((BONUS_PERCENT * (lastCell - RUNWAY)) / 100)

  // A chaser at 100% sits on the player. The less-used chaser stays one cell behind the other.
  const weeklyUsed = sevenDayUsed >= WEEKLY_RELEASE_PERCENT ? sevenDayUsed : undefined
  const [leader, follower] = [
    { key: 'fiveHour', used: fiveHourUsed },
    { key: 'sevenDay', used: weeklyUsed },
  ]
    .filter((chaser) => chaser.used !== undefined)
    .map((chaser) => {
      const trailing = Math.min(Math.floor((chaser.used * player) / 100), player - 1)
      return { ...chaser, position: chaser.used >= 100 ? player : trailing }
    })
    .sort((first, second) => second.used - first.used)
  const spacedFollower = follower && {
    ...follower,
    position: Math.max(Math.min(follower.position, leader.position - 1), 0),
  }

  return {
    player,
    bonus,
    chasers: [leader, spacedFollower].filter(Boolean),
    isGameOver: leader?.used >= 100,
  }
}

export function isAirborne(actor, frame) {
  return (frame + HOP_OFFSET[actor]) % HOP_CYCLE < HOP_FRAMES
}

export function tile(sprite, step) {
  const index = step % sprite.glyphs.length
  return {
    glyph: sprite.glyphs[index],
    color: sprite.colors?.[index] || sprite.color || '',
    background: sprite.backgrounds?.[index] || sprite.background,
  }
}

export function render(input, { game, width, frame, nowSeconds, effort }) {
  const totalWidth = Math.min(Math.max(width, MIN_WIDTH), MAX_WIDTH)
  const fieldWidth = totalWidth - 4
  const fiveHour = input.rate_limits?.five_hour
  const sevenDay = input.rate_limits?.seven_day
  const contextUsed = Math.round(input.context_window?.used_percentage ?? 0)
  const { player, bonus, chasers, isGameOver } = layout({
    fieldWidth,
    contextUsed,
    fiveHourUsed: fiveHour && Math.round(fiveHour.used_percentage ?? 0),
    sevenDayUsed: sevenDay && Math.round(sevenDay.used_percentage ?? 0),
  })

  // A chaser draws over the player, which is how a game over looks on the field. A game over
  // also stops the hopping so the chaser stays on top of the player.
  const actors = [
    ...chasers.map((chaser) => ({ key: chaser.key, position: chaser.position, sprite: game.chasers[chaser.key] })),
    { key: 'player', position: player, sprite: game.player },
  ]
  const airborne = actors.filter((actor) => !isGameOver && isAirborne(actor.key, frame))
  const grounded = actors.filter((actor) => !airborne.includes(actor))
  const cells = Array.from({ length: fieldWidth }, (_, index) => index)

  // Adding the frame to the step scrolls the scenery left. The sky scrolls at half speed.
  // An actor keeps the background of the scenery it covers.
  const groundScenery = (index) => {
    if (index <= player) return tile(game.trail, index + frame)
    if (index === bonus) return tile(game.bonus, frame)
    return tile(game.ahead, index + frame)
  }
  const [sky, ground] = [
    { actors: airborne, scenery: (index) => tile(game.sky, index + Math.floor(frame / 2)) },
    { actors: grounded, scenery: groundScenery },
  ].map(({ actors: rowActors, scenery }) =>
    cells
      .map((index) => {
        const cell = scenery(index)
        const actor = rowActors.find((candidate) => candidate.position === index)
        const face = actor && tile(actor.sprite, frame)
        const { glyph, color } = face || cell
        return `${COLOR.reset}${cell.background || game.screen}${color}${glyph}`
      })
      .join('')
      .concat(COLOR.reset),
  )

  const title = [...game.title].map((letter, index) => `${RAINBOW[(index + frame) % RAINBOW.length]}${letter}`).join('')
  const marquee = `══ ${COLOR.reset}${title}${COLOR.reset}${game.border} `
  const marqueeWidth = game.title.length + 4
  const topBorder = `${game.border}╭${marquee}${'═'.repeat(fieldWidth + 2 - marqueeWidth)}╮${COLOR.reset}`
  const [skyLine, groundLine] = [sky, ground].map(
    (row) => `${game.border}║${COLOR.reset} ${row} ${game.border}║${COLOR.reset}`,
  )
  // The score is ten points per changed line, like an arcade high-score table. 1UP blinks.
  const score = String(((input.cost?.total_lines_added ?? 0) + (input.cost?.total_lines_removed ?? 0)) * 10).padStart(6, '0')
  const oneUpColor = frame % 2 ? COLOR.red : COLOR.white
  const scoreboard = `══ ${oneUpColor}1UP ${COLOR.white}${score}${COLOR.reset}${game.border} `
  const scoreboardWidth = score.length + 8
  const bottomBorder = `${game.border}╰${scoreboard}${'═'.repeat(fieldWidth + 2 - scoreboardWidth)}╯${COLOR.reset}`

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
  const effortLabel = !isGameOver && effort && `${COLOR.dim}${effort}${COLOR.reset}`
  const status = [...limits, effortLabel].filter(Boolean).join('  ')
  const gameOverPadding = ' '.repeat(Math.max(totalWidth - status.replace(ANSI, '').length - 'GAME OVER'.length, 2))
  const gameOverColor = frame % 2 ? COLOR.yellow : COLOR.red
  const gameOver = isGameOver ? `${gameOverPadding}${gameOverColor}GAME OVER${COLOR.reset}` : ''
  const footer = `${status}${gameOver}`

  return [header, topBorder, skyLine, groundLine, bottomBorder, footer].filter(Boolean).join('\n')
}
