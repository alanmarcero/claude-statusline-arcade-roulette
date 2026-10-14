import assert from 'node:assert/strict'
import { test } from 'node:test'
import { GAMES, WIDE } from '../lib/games.js'
import { customize, formatCountdown, isAirborne, layout, pickGame, render, tile } from '../lib/render.js'

const ANSI = /\x1b\[[0-9;]*m/g
const WIDE_ALL = new RegExp(WIDE, 'g')
const columns = (line) => [...line].length + (line.match(WIDE_ALL)?.length ?? 0)
const NOW = 1_800_000_000
const INPUT = {
  version: '2.5.0',
  model: { display_name: 'Opus 5.5' },
  context_window: { used_percentage: 40, context_window_size: 1_000_000 },
  rate_limits: {
    five_hour: { used_percentage: 30, resets_at: NOW + 5400 },
    seven_day: { used_percentage: 60, resets_at: NOW + 3 * 86400 },
  },
}
const OPTIONS = { game: GAMES[0], width: 54, frame: 0, nowSeconds: NOW, effort: 'xhigh' }

test('pickGame returns the same game for the same session and reaches every game', () => {
  const picked = new Set(Array.from({ length: 200 }, (_, index) => pickGame(`session-${index}`).id))

  assert.equal(pickGame('session-a'), pickGame('session-a'))
  assert.equal(picked.size, GAMES.length)
})

test('formatCountdown picks the largest units and handles missing or past resets', () => {
  assert.equal(formatCountdown(NOW + 86400 + 7200, NOW), '1d2h')
  assert.equal(formatCountdown(NOW + 9000, NOW), '2h30m')
  assert.equal(formatCountdown(NOW + 2700, NOW), '45m')
  assert.equal(formatCountdown(NOW - 1, NOW), 'now')
  assert.equal(formatCountdown(undefined, NOW), '')
})

test('layout swings the player within three cells of its spot with each chaser behind the actor ahead', () => {
  const scenes = Array.from({ length: 120 }, (_, frame) => layout(50, frame))

  assert.ok(scenes.every(({ player }) => player >= 27 && player <= 33))
  assert.ok(scenes.every(({ player, chasers: [fiveHour, sevenDay] }) => sevenDay.position < fiveHour.position && fiveHour.position < player))
  assert.equal(new Set(scenes.map(({ player }) => player)).size, 7)
  assert.deepEqual(layout(50, 7), layout(50, 127))
})

test('render draws the same field whatever the context and rate limit usage', () => {
  const field = (input) => render(input, { ...OPTIONS, frame: 4 }).split('\n').slice(1, 6)
  const full = {
    ...INPUT,
    context_window: { used_percentage: 95, context_window_size: 1_000_000 },
    rate_limits: { five_hour: { used_percentage: 100 }, seven_day: { used_percentage: 10 } },
  }

  assert.deepEqual(field(full), field(INPUT))
})

test('render draws every game with all four field rows and both borders at the same width on every frame', () => {
  const widths = GAMES.flatMap((game) =>
    Array.from({ length: 6 }, (_, frame) => {
      const [, top, backdrop, sky, ground, base, bottom] = render(INPUT, { ...OPTIONS, game, frame }).split('\n')
      return new Set([top, backdrop, sky, ground, base, bottom].map((line) => columns(line.replace(ANSI, ''))))
    }),
  )

  assert.equal(widths.length, GAMES.length * 6)
  assert.ok(widths.every((lineWidths) => lineWidths.size === 1 && lineWidths.has(54)))
})

test('render shows the title, limits and effort while the game runs', () => {
  const lines = render(INPUT, OPTIONS).replace(ANSI, '').split('\n')

  assert.match(lines[0], /^CLAUDE v2\.5\.0 +Opus 5\.5 1M context 60% left$/)
  assert.match(lines[1], /PAC-MAN/)
  assert.equal(lines[7], 'ᗩ 7d 40% ↓3d0h  ᗣ 5h 70% ↓1h30m  xhigh')
})

test('isAirborne lifts each actor for two frames of six, one actor at a time', () => {
  const hops = ['player', 'fiveHour', 'sevenDay'].map((actor) =>
    Array.from({ length: 6 }, (_, frame) => isAirborne(actor, frame)),
  )

  assert.ok(hops.every((frames) => frames.filter(Boolean).length === 2))
  assert.ok(Array.from({ length: 6 }, (_, frame) => hops.filter((frames) => frames[frame]).length === 1).every(Boolean))
})

test('render moves the player into the sky row while it hops', () => {
  const player = GAMES[0].player.glyphs[0]
  const rows = (frame) => render(INPUT, { ...OPTIONS, frame }).replace(ANSI, '').split('\n').slice(3, 5)

  assert.ok(rows(0)[0].includes(player))
  assert.ok(!rows(0)[1].includes(player))
  assert.ok(rows(2)[1].includes(player))
})

test('render shows ten points per changed line as the score and the larger of it and the high score as the high score', () => {
  const coded = { ...INPUT, cost: { total_lines_added: 312, total_lines_removed: 41 } }

  const [beaten, record] = [100, 9990].map((highScore) =>
    render(coded, { ...OPTIONS, highScore }).replace(ANSI, '').split('\n')[6],
  )

  assert.match(beaten, /^╰══ 1UP 003530 ═+ HIGH SCORE 003530 ══╯$/)
  assert.match(record, /^╰══ 1UP 003530 ═+ HIGH SCORE 009990 ══╯$/)
})

test('render paints an actor on the background of the scenery it covers', () => {
  const frogger = GAMES.find((game) => game.id === 'frogger')
  const frog = `${frogger.trail.background}${frogger.player.color}${frogger.player.glyphs[1]}`

  const ground = render(INPUT, { ...OPTIONS, game: frogger, frame: 3 }).split('\n')[4]

  assert.ok(ground.includes(frog))
})

test('tile steps a multi-character glyph and a color list by frame, offset by the cell index', () => {
  const water = { glyphs: ['≈~', '≈~'], colors: [['a', 'b', 'c'], ['a', 'b', 'c']] }

  const [first, next, neighbor] = [tile(water, 0, 0), tile(water, 0, 1), tile(water, 1, 0)]

  assert.deepEqual([first.glyph, first.color], ['≈', 'a'])
  assert.deepEqual([next.glyph, next.color], ['~', 'b'])
  assert.deepEqual([neighbor.glyph, neighbor.color], ['~', 'b'])
})

test('render fires the shot from two cells ahead of the player, three cells further each frame', () => {
  const invaders = GAMES.find((game) => game.id === 'invaders')
  const shotColumn = (frame) =>
    render(INPUT, { ...OPTIONS, game: invaders, frame })
      .replace(ANSI, '')
      .split('\n')[4]
      .indexOf(invaders.shot.glyphs[frame % invaders.shot.glyphs.length])
  // The row starts with the border and a space, so field cell n is column n + 2.
  const expected = (frame) => {
    const { player } = layout(50, frame)
    return 2 + player + 2 + ((frame * 3) % (50 - player - 2))
  }

  assert.equal(shotColumn(13), expected(13))
  assert.equal(shotColumn(14), expected(14))
})

test('render keeps the row width when an actor or the field edge covers half of a wide glyph', () => {
  const doubleDragon = GAMES.find((game) => game.id === 'double-dragon')
  const sky = (frame, width) =>
    render(INPUT, { ...OPTIONS, game: doubleDragon, frame, width }).replace(ANSI, '').split('\n')[3]

  const rows = Array.from({ length: 60 }, (_, frame) => sky(frame, 54 - (frame % 3)))

  assert.ok(rows.some((row) => WIDE.test(row)))
  assert.ok(rows.every((row, frame) => columns(row) === 54 - (frame % 3)))
})

test('render shows INSERT COIN between the scores while the session is idle and hides it at narrow widths', () => {
  const border = (options) => render(INPUT, { ...OPTIONS, ...options }).replace(ANSI, '').split('\n')[6]

  assert.match(border({ isIdle: true }), /^╰══ 1UP 000000 ═+ INSERT COIN ═+ HIGH SCORE 000000 ══╯$/)
  assert.doesNotMatch(border({ isIdle: false }), /INSERT COIN/)
  assert.doesNotMatch(border({ isIdle: true, width: 30 }), /INSERT COIN/)
})

test('render drags a chaser tail along the ground behind it', () => {
  const tron = GAMES.find((game) => game.id === 'tron')
  const { glyphs, color, length } = tron.chasers.fiveHour.tail
  const scene = layout(50, 3)
  const leader = scene.chasers.find((chaser) => chaser.key === 'fiveHour').position

  const ground = render(INPUT, { ...OPTIONS, game: tron, frame: 3 }).split('\n')[4]

  assert.equal(ground.split(`${color}${glyphs[0]}`).length - 1, length)
  assert.ok(leader > length)
})

test('render swaps in the scared sprite for every chaser during the scare frames only', () => {
  const pacman = GAMES.find((game) => game.id === 'pacman')
  const scaredGhost = `${pacman.scared.color[0]}${pacman.scared.glyphs[0]}`
  const ground = (frame) => render(INPUT, { ...OPTIONS, game: pacman, frame }).split('\n')[4]

  assert.equal(ground(0).split(scaredGhost).length - 1, 2)
  assert.ok(!ground(6).includes(pacman.scared.color[0]))
})

test('render flashes the banner in the middle of the sky for the first frames of each cycle', () => {
  const sky = (frame) => render(INPUT, { ...OPTIONS, frame }).replace(ANSI, '').split('\n')[3]

  assert.equal(sky(1).indexOf('READY!'), 2 + Math.floor((50 - 'READY!'.length) / 2))
  assert.ok(!sky(5).includes('READY!'))
  assert.ok(sky(22).includes('READY!'))
})

test('render caps the width at 90 columns on a wide terminal', () => {
  const lines = render(INPUT, { ...OPTIONS, width: 200 }).replace(ANSI, '').split('\n').slice(1, 7)

  assert.ok(lines.every((line) => columns(line) === 90))
})

test('render fills each game scoreboard and drops the right board when the border is narrow', () => {
  const coded = { ...INPUT, cost: { total_lines_added: 30, total_lines_removed: 41, total_duration_ms: 25 * 60_000 } }
  const border = (id, width) =>
    render(coded, { ...OPTIONS, game: GAMES.find((game) => game.id === id), width }).replace(ANSI, '').split('\n')[6]

  assert.match(border('tetris', 54), /^╰══ SCORE 000710 ═+ LINES 041 ══╯$/)
  assert.match(border('mario', 54), /^╰══ MARIO 000710 ═+ TIME 375 ══╯$/)
  assert.match(border('mortal-kombat-2', 30), /^╰══ LIU KANG 000710 ═+╯$/)
})

test('render pins the caption one cell in from each edge of the base row', () => {
  const invaders = GAMES.find((game) => game.id === 'invaders')

  const base = (frame) => render(INPUT, { ...OPTIONS, game: invaders, frame }).replace(ANSI, '').split('\n')[5]

  assert.match(base(0), /^║ ▔3 ᐃᐃ.*CREDIT 00▔ ║$/)
  assert.match(base(7), /^║ ▔3 ᐃᐃ.*CREDIT 00▔ ║$/)
})

test('render steps an animated caption every two frames, keeping it pinned to its edge', () => {
  const mortalKombat = GAMES.find((game) => game.id === 'mortal-kombat-3')
  const backdrop = (frame) => render(INPUT, { ...OPTIONS, game: mortalKombat, frame }).replace(ANSI, '').split('\n')[2]

  assert.ok(backdrop(0).startsWith(`║ ═${'▬'.repeat(10)}═`))
  assert.ok(backdrop(2).startsWith(`║ ═${'▬'.repeat(9)} ═`))
  assert.ok(backdrop(2).endsWith(` ${'▬'.repeat(9)}═ ║`))
})

test('customize gives every game a variant that a session keeps and other sessions change', () => {
  const variants = (game) =>
    new Set(Array.from({ length: 40 }, (_, index) => render(INPUT, { ...OPTIONS, game: customize(game, `session-${index}`) })))

  assert.ok(GAMES.every((game) => typeof game.vary === 'function'))
  assert.deepEqual(customize(GAMES[10], 'session-a'), customize(GAMES[10], 'session-a'))
  assert.ok(GAMES.every((game) => variants(game).size > 1))
})

test('customize deals a Mortal Kombat II hero and a different rival onto the scoreboard', () => {
  const mortalKombat = GAMES.find((game) => game.id === 'mortal-kombat-2')
  const boards = Array.from({ length: 40 }, (_, index) => customize(mortalKombat, `session-${index}`).scoreboard)

  assert.ok(boards.every(({ left, right }) => left.split(' {')[0] !== right.split(' {')[0]))
  assert.ok(new Set(boards.map(({ left }) => left)).size > 3)
})

test('render twinkles stars in the empty backdrop cells of a starry game only', () => {
  const backdrop = (id, frame) =>
    render(INPUT, { ...OPTIONS, game: GAMES.find((game) => game.id === id), frame }).replace(ANSI, '').split('\n')[2]

  assert.ok(backdrop('double-dragon', 0).includes('·'))
  assert.notEqual(backdrop('double-dragon', 0), backdrop('double-dragon', 2))
  assert.ok(!backdrop('tron', 0).includes('·'))
})

test('render keeps every game at the minimum width, dropping a title that does not fit', () => {
  const tmnt = GAMES.find((game) => game.id === 'tmnt')
  const frame = (game) => render(INPUT, { ...OPTIONS, game, width: 30 }).replace(ANSI, '').split('\n').slice(1, 7)

  assert.ok(GAMES.every((game) => frame(game).every((line) => columns(line) === 30)))
  assert.ok(!frame(tmnt)[0].includes('TURTLES'))
  assert.ok(render(INPUT, { ...OPTIONS, game: tmnt }).replace(ANSI, '').includes('NINJA TURTLES'))
})
