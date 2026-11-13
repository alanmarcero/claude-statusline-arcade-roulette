import assert from 'node:assert/strict'
import { test } from 'node:test'
import { WIDE, ink, paper, pixelRows, pixelSprite, sprite, tiles } from '../lib/art.js'
import { GAMES as IDS } from '../lib/games.js'
import { cue, customize, formatCountdown, layer, pickGame, place, reach, render, spriteCells, tile } from '../lib/render.js'

const GAMES = await Promise.all(IDS.map(async (id) => (await import(`../lib/games/${id}.js`)).default))

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
// A plain stage for the engine tests. At width 54 the field is 50 cells, the anchor is cell 25, and
// field cell n is column n + 2.
const STAGE = {
  id: 'stage',
  loop: 10,
  logo: [['STAGE', '']],
  border: '',
  screen: paper(16),
  speeds: [0, 0, 0, 0],
  scoreboard: { left: '1UP {score}', right: 'HI {hi}' },
  backdrop: tiles(' ', {}),
  sky: tiles(' ', {}),
  ahead: tiles('-', {}),
  trail: tiles('=', {}),
  base: tiles('_', {}),
  icons: { fiveHour: 'ghost', sevenDay: 'tall' },
  sprites: {
    hero: { glyphs: ['@'], color: ink(226) },
    ghost: { glyphs: ['G', 'g'], color: ink(196) },
    tall: { glyphs: ['^\nT'], color: ink(46) },
    block: { glyphs: ['▄'], color: ink(196) },
  },
  cast: { player: [[0, 'hero', 0]] },
}
const OPTIONS = { game: STAGE, width: 54, frame: 0, nowSeconds: NOW, effort: 'xhigh' }
const rowsOf = (options) => render(INPUT, { ...OPTIONS, ...options }).replace(ANSI, '').split('\n')
const CELL = 2 + 25

test('pickGame returns the same game for the same session and reaches every game', () => {
  const picked = new Set(Array.from({ length: 200 }, (_, index) => pickGame(`session-${index}`)))

  assert.equal(pickGame('session-a'), pickGame('session-a'))
  assert.equal(picked.size, GAMES.length)
})

test('every game module carries the id it is loaded by, which also keys its high score', () => {
  assert.deepEqual(GAMES.map(({ id }) => id), IDS)
})

test('formatCountdown picks the largest units and handles missing or past resets', () => {
  assert.equal(formatCountdown(NOW + 86400 + 7200, NOW), '1d2h')
  assert.equal(formatCountdown(NOW + 9000, NOW), '2h30m')
  assert.equal(formatCountdown(NOW + 2700, NOW), '45m')
  assert.equal(formatCountdown(NOW - 1, NOW), 'now')
  assert.equal(formatCountdown(undefined, NOW), '')
})

test('cue holds each value until the next cue and passes a plain value through', () => {
  const track = [
    [2, 'READY!'],
    [5, ''],
  ]

  assert.deepEqual([0, 2, 4, 5, 9].map((t) => cue(track, t)), [undefined, 'READY!', 'READY!', '', ''])
  assert.equal(cue('FIGHT!', 7), 'FIGHT!')
  assert.deepEqual(cue([ink(1), ink(2)], 3), [ink(1), ink(2)])
})

test('place moves an actor dx cells per frame and continues from the last keyframe when x is missing', () => {
  const track = [
    [0, 'hero', -4, 2],
    [3, 'ghost', null, -1, 'sky'],
  ]

  assert.deepEqual(place(track, 2), { sprite: 'hero', x: 0, row: 'ground', elapsed: 2 })
  assert.deepEqual(place(track, 5), { sprite: 'ghost', x: 0, row: 'sky', elapsed: 2 })
})

test('place hides an actor before its first keyframe and after a keyframe with no sprite', () => {
  const track = [[2, 'hero', 0], [4]]

  assert.deepEqual([1, 2, 4].map((t) => place(track, t)?.sprite), [undefined, 'hero', undefined])
})

test('reach returns the farthest offset the actor has reached since the loop began', () => {
  const track = [
    [0, 'hero', -5, 1],
    [6, 'hero', 1, -2],
  ]

  assert.deepEqual([3, 6, 9].map((t) => reach(track, t)), [-2, 1, 1])
})

test('spriteCells stacks earlier lines higher and gives each cell its ink for the frame', () => {
  const tall = { glyphs: ['ab\nc', 'xy\nz'], colors: [[ink(1), ink(2), ink(3)]], color: ink(9) }

  const [first, second] = [spriteCells(tall, 0), spriteCells(tall, 1)]

  assert.deepEqual(
    first.map(({ glyph, rise, column, color }) => [glyph, rise, column, color]),
    [
      ['a', 1, 0, ink(1)],
      ['b', 1, 1, ink(2)],
      ['c', 0, 0, ink(3)],
    ],
  )
  assert.ok(second.every(({ color }) => color === ink(9)))
})

test('render draws an actor at the anchor plus its offset, on the row of its keyframe', () => {
  const game = { ...STAGE, cast: { player: [[0, 'hero', -3], [1, 'hero', 2, 0, 'sky']] } }

  const [ground, sky] = [rowsOf({ game, frame: 0 })[4], rowsOf({ game, frame: 1 })[3]]

  assert.equal(ground.indexOf('@'), CELL - 3)
  assert.equal(sky.indexOf('@'), CELL + 2)
})

test('render stacks a tall sprite upward from its row and lets a space show the scenery', () => {
  const game = { ...STAGE, cast: { player: [[0, 'hero', 0]], tall: [[0, 'tall', 4]] } }

  const rows = rowsOf({ game })

  assert.equal(rows[3][CELL + 4], '^')
  assert.equal(rows[4][CELL + 4], 'T')
})

test('render shows the trail on the ground up to the farthest cell the player has reached', () => {
  const game = { ...STAGE, cast: { player: [[0, 'hero', 0, 1], [4, 'hero', 4, -1]] } }

  const ground = rowsOf({ game, frame: 6 })[4]

  assert.equal(ground.slice(CELL - 1, CELL + 7), '===@==--')
})

test('render replays the loop, so a frame and the same frame one loop later draw the same field', () => {
  const game = { ...STAGE, cast: { player: [[0, 'hero', -5, 1]] } }

  assert.deepEqual(rowsOf({ game, frame: 3 }).slice(2, 6), rowsOf({ game, frame: 13 }).slice(2, 6))
})

test('render throws when a keyframe names a sprite the game does not have', () => {
  const game = { ...STAGE, cast: { player: [[0, 'missing', 0]] } }

  assert.throws(() => render(INPUT, { ...OPTIONS, game }), /no sprite missing/)
})

test('render shows the scenery through the clear half of a half-block actor', () => {
  const hill = { ...STAGE, ahead: tiles('█', { '█': ['█', ink(34)] }), trail: undefined, cast: { player: [[0, 'block', 0]] } }

  const ground = render(INPUT, { ...OPTIONS, game: hill }).split('\n')[4]

  assert.ok(ground.includes(`${paper(34)}${ink(196)}▄`))
})

test('render shows the actor beneath through the clear half of a half-block actor on top', () => {
  const wall = { glyphs: ['█'], color: ink(46) }
  const game = { ...STAGE, sprites: { ...STAGE.sprites, wall }, cast: { wall: [[0, 'wall', 2]], player: [[0, 'block', 2]] } }

  const ground = render(INPUT, { ...OPTIONS, game }).split('\n')[4]

  assert.ok(ground.includes(`${paper(46)}${ink(196)}▄`))
})

test('render puts a caption on the color of the actor it covers', () => {
  const wall = { glyphs: ['█'], color: ink(46) }
  const game = {
    ...STAGE,
    caption: { left: ['1UP', ink(231)] },
    sprites: { ...STAGE.sprites, wall },
    cast: { wall: [[0, 'wall', -24, 0, 'base']], player: [[0, 'hero', 0]] },
  }

  const base = render(INPUT, { ...OPTIONS, game }).split('\n')[5]

  assert.ok(base.includes(`${paper(46)}${ink(231)}1`))
})

test('render paints an actor on the background of the scenery it covers', () => {
  const river = { ...STAGE, ahead: tiles('~', { '~': ['~', ink(51), paper(17)] }), trail: undefined }

  const ground = render(INPUT, { ...OPTIONS, game: river }).split('\n')[4]

  assert.ok(ground.includes(`${paper(17)}${ink(226)}@`))
})

test('render scrolls each row by its speed, and a negative speed scrolls right', () => {
  const game = { ...STAGE, speeds: [0, -1, 2, 0], sky: tiles('ab', {}), ahead: tiles('abc', {}), trail: tiles('abc', {}) }

  const [sky, ground] = rowsOf({ game, frame: 1 }).slice(3, 5)

  assert.equal(sky.slice(2, 6), 'baba')
  assert.equal(ground.slice(2, 6), 'cabc')
})

test('render gives each row its own screen color when the screen lists four', () => {
  const game = { ...STAGE, screen: [paper(1), paper(2), paper(3), paper(4)], cast: { player: [[0, 'hero', 0]] } }

  const rows = render(INPUT, { ...OPTIONS, game }).split('\n').slice(2, 6)

  assert.deepEqual(
    rows.map((row) => [1, 2, 3, 4].find((code) => row.includes(paper(code)))),
    [1, 2, 3, 4],
  )
})

test('render swaps the screen color and the scenery ink during a flash cue', () => {
  const game = { ...STAGE, flash: [[3, { screen: paper(231), ink: ink(16) }], [4, undefined]] }

  const [during, after] = [3, 4].map((frame) => render(INPUT, { ...OPTIONS, game, frame }).split('\n')[5])

  assert.ok(during.includes(`${paper(231)}${ink(16)}_`))
  assert.ok(!after.includes(paper(231)))
})

test('render shows the banner track in the middle of the sky only while its text is set', () => {
  const game = { ...STAGE, banner: [[[0, 'READY!'], [3, '']], ink(226)] }

  const [shown, hidden] = [2, 3].map((frame) => rowsOf({ game, frame })[3])

  assert.equal(shown.indexOf('READY!'), 2 + Math.floor((50 - 'READY!'.length) / 2))
  assert.ok(!hidden.includes('READY!'))
})

test('render pins captions one cell in from each edge and steps a caption track with the loop', () => {
  const game = { ...STAGE, caption: { left: ['1UP', ink(231)], right: [[[0, '▬▬▬'], [5, '▬▬ ']], ink(46)] } }

  const [early, late] = [0, 5].map((frame) => rowsOf({ game, frame })[5])

  assert.match(early, /^║ _1UP_+▬▬▬_ ║$/)
  assert.match(late, /^║ _1UP_+▬▬ _ ║$/)
})

test('render inks each caption letter from its letter inks and falls back to the caption ink', () => {
  const hearts = [[0, [ink(196), ink(196), ink(231)]], [5, [ink(196), ink(231), ink(231)]]]
  const game = { ...STAGE, caption: { left: ['abcd', ink(46), hearts] } }

  const [early, late] = [0, 5].map((frame) => render(INPUT, { ...OPTIONS, game, frame }).split('\n')[5])

  assert.ok(early.includes(`${ink(196)}b`) && early.includes(`${ink(231)}c`) && early.includes(`${ink(46)}d`))
  assert.ok(late.includes(`${ink(231)}b`))
})

test('render centers the top caption with a blank on each side and drops it when edge captions leave no room', () => {
  const game = { ...STAGE, topCaption: { left: ['▬▬▬▬▬▬▬▬▬▬', ink(46)], right: ['▬▬▬▬▬▬▬▬▬▬', ink(46)], center: ['DEAD POOL', ink(214)] } }

  const [wide, narrow] = [54, 30].map((width) => rowsOf({ game, width })[2])

  assert.equal(wide.indexOf(' DEAD POOL '), 2 + Math.floor((50 - ' DEAD POOL '.length) / 2))
  assert.doesNotMatch(narrow, /DEAD|POOL/)
})

test('render twinkles stars in the empty backdrop cells of a starry game only', () => {
  const starry = { ...STAGE, stars: true }

  const [first, later] = [0, 2].map((frame) => rowsOf({ game: starry, frame })[2])

  assert.ok(first.includes('·'))
  assert.notEqual(first, later)
  assert.ok(!rowsOf({ game: STAGE })[2].includes('·'))
})

test('render keeps the row width when an actor or the field edge covers half of a wide glyph', () => {
  const sign = { ...STAGE, sky: tiles('ab龍c', {}), cast: { player: [[0, 'hero', 0, 1, 'sky']] } }

  const rows = Array.from({ length: 30 }, (_, frame) => rowsOf({ game: sign, frame, width: 54 - (frame % 3) })[3])

  assert.ok(rows.some((row) => WIDE.test(row)))
  assert.ok(rows.every((row, frame) => columns(row) === 54 - (frame % 3)))
})

test('render shows the title, limits and effort, with each limit beside its sprite from the cast', () => {
  const lines = rowsOf({})

  assert.match(lines[0], /^CLAUDE v2\.5\.0 +Opus 5\.5 1M context 60% left$/)
  assert.match(lines[1], /STAGE/)
  assert.equal(lines[7], 'T 7d 40% ↓3d0h  G 5h 70% ↓1h30m  xhigh')
})

test('render draws the same field whatever the context and rate limit usage', () => {
  const full = {
    ...INPUT,
    context_window: { used_percentage: 95, context_window_size: 1_000_000 },
    rate_limits: { five_hour: { used_percentage: 100 }, seven_day: { used_percentage: 10 } },
  }

  const field = (input) => render(input, { ...OPTIONS, game: GAMES[0], frame: 4 }).split('\n').slice(1, 6)

  assert.deepEqual(field(full), field(INPUT))
})

test('render shows ten points per changed line as the score and the larger of it and the high score as the high score', () => {
  const coded = { ...INPUT, cost: { total_lines_added: 312, total_lines_removed: 41 } }

  const [beaten, record] = [100, 9990].map((highScore) => render(coded, { ...OPTIONS, highScore }).replace(ANSI, '').split('\n')[6])

  assert.match(beaten, /^╰══ 1UP 003530 ═+ HI 003530 ══╯$/)
  assert.match(record, /^╰══ 1UP 003530 ═+ HI 009990 ══╯$/)
})

test('render shows INSERT COIN between the scores while the session is idle and hides it at narrow widths', () => {
  const border = (options) => rowsOf(options)[6]

  assert.match(border({ isIdle: true }), /^╰══ 1UP 000000 ═+ INSERT COIN ═+ HI 000000 ══╯$/)
  assert.doesNotMatch(border({ isIdle: false }), /INSERT COIN/)
  assert.doesNotMatch(border({ isIdle: true, width: 30 }), /INSERT COIN/)
})

test('render pauses an idle console game instead of asking for a coin', () => {
  const border = (id) => rowsOf({ game: GAMES.find((game) => game.id === id), isIdle: true })[6]

  assert.match(border('mario-3'), /═ PAUSE ═/)
  assert.match(border('zelda'), /═ CONTINUE · SAVE · RETRY ═/)
  assert.doesNotMatch(border('zelda'), /INSERT COIN/)
})

test('render fills each game scoreboard and drops the right board when the border is narrow', () => {
  const coded = { ...INPUT, cost: { total_lines_added: 30, total_lines_removed: 41, total_duration_ms: 25 * 60_000 } }
  const border = (id, width) => render(coded, { ...OPTIONS, game: GAMES.find((game) => game.id === id), width }).replace(ANSI, '').split('\n')[6]

  assert.match(border('mario', 54), /^╰══ MARIO 000710 ═+ TIME 375 ══╯$/)
  assert.match(border('mario-3', 54), /^╰══ MARIO 000710 ═+ TIME 275 ══╯$/)
  assert.match(border('zelda', 54), /^╰══ LINK ═+ ◊×071 ══╯$/)
  assert.match(border('mortal-kombat-2', 30), /^╰══ LIU KANG 000710 ═+╯$/)
})

test('render caps the width at 90 columns on a wide terminal', () => {
  const lines = rowsOf({ game: GAMES[0], width: 200 }).slice(1, 7)

  assert.ok(lines.every((line) => columns(line) === 90))
})

test('render keeps every game at the minimum width, dropping a title that does not fit', () => {
  const tmnt = GAMES.find((game) => game.id === 'tmnt')
  const frame = (game) => rowsOf({ game, width: 30 }).slice(1, 7)

  assert.ok(GAMES.every((game) => frame(game).every((line) => columns(line) === 30)))
  assert.ok(!frame(tmnt)[0].includes('TURTLES'))
  assert.ok(rowsOf({ game: tmnt }).join('\n').includes('NINJA TURTLES'))
})

test('every game draws all four rows and both borders at the same width on every frame of its loop', () => {
  const variants = GAMES.flatMap((game) => ['a', 'b', 'c'].map((session) => customize(game, session)))
  const widths = variants.flatMap((game) =>
    Array.from({ length: game.loop }, (_, frame) =>
      [90, 54, 30].map((width) => new Set(rowsOf({ game, frame, width }).slice(1, 7).map((line) => columns(line)))),
    ).flat(),
  )

  assert.ok(widths.length >= GAMES.length * 3 * 3)
  assert.ok(widths.every((lineWidths) => lineWidths.size === 1))
})

test('every game lists its keyframes in loop order', () => {
  const variants = GAMES.flatMap((game) => ['a', 'b', 'c', 'd'].map((session) => customize(game, session)))
  const keyframes = variants.flatMap((game) =>
    Object.values(game.cast).map((track) => ({ game, track, starts: track.map(([start]) => start) })),
  )

  assert.ok(keyframes.length >= GAMES.length)
  assert.ok(keyframes.every(({ game, starts }) => starts.every((start, index) => start < game.loop && (index === 0 || start > starts[index - 1]))))
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

test('layer fills the halves its block covers with its ink and keeps the layer below elsewhere', () => {
  const below = [paper(1), paper(2)]

  assert.deepEqual(layer(below, { glyph: '▀', color: ink(9) }), [paper(9), paper(2)])
  assert.deepEqual(layer(below, { glyph: '▄', color: ink(9) }), [paper(1), paper(9)])
  assert.deepEqual(layer(below, { glyph: '▀', color: ink(9), background: paper(3) }), [paper(9), paper(3)])
  assert.deepEqual(layer(below, { glyph: '*', color: ink(9) }), below)
})

test('tile steps a multi-character glyph and a color list by frame, offset by the cell index', () => {
  const water = { glyphs: ['≈~', '≈~'], colors: [['a', 'b', 'c'], ['a', 'b', 'c']] }

  const [first, next, neighbor] = [tile(water, 0, 0), tile(water, 0, 1), tile(water, 1, 0)]

  assert.deepEqual([first.glyph, first.color], ['≈', 'a'])
  assert.deepEqual([next.glyph, next.color], ['~', 'b'])
  assert.deepEqual([neighbor.glyph, neighbor.color], ['~', 'b'])
})

test('pixelSprite draws two pixel rows per cell, the upper pixel in the ink and the lower in the paper', () => {
  const face = pixelSprite([['ab.', 'bb.', '.a.', '...']], { a: 1, b: 2 })

  assert.deepEqual(face.glyphs, ['▀█ \n ▀ '])
  assert.deepEqual(face.colors, [[ink(1), ink(2), '', '', ink(1), '']])
  assert.deepEqual(face.backgrounds, [[paper(2), undefined, undefined, undefined, undefined, undefined]])
})

test('pixelRows splits a block of pixel art into rows and rejects rows of different widths', () => {
  const [sky, ground] = pixelRows(['a.', 'a.', '.a', '.a'], { a: 1 })

  assert.deepEqual([sky.glyphs, ground.glyphs], [
    ['█', ' '],
    [' ', '█'],
  ])
  assert.throws(() => pixelRows(['aa', 'a'], { a: 1 }), /differ in width/)
})

test('sprite builds glyph patterns with one ink and paper per cell in reading order', () => {
  const house = sprite(['╔━╗\n║G║'], { '━': ['━', ink(218)], G: ['ᗣ', ink(51), paper(16)] })

  assert.deepEqual(house.glyphs, ['╔━╗\n║ᗣ║'])
  assert.deepEqual(house.colors, [['', ink(218), '', '', ink(51), '']])
  assert.deepEqual(house.backgrounds[0][4], paper(16))
})
