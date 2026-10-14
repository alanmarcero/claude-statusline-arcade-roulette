import assert from 'node:assert/strict'
import { test } from 'node:test'
import { GAMES } from '../lib/games.js'
import { formatCountdown, isAirborne, layout, pickGame, render } from '../lib/render.js'

const ANSI = /\x1b\[[0-9;]*m/g
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

test('layout starts the player after the runway and keeps the weekly chaser off until 50% used', () => {
  const scene = layout({ fieldWidth: 50, contextUsed: 0, fiveHourUsed: 10, sevenDayUsed: 49 })

  assert.equal(scene.player, 12)
  assert.deepEqual(
    scene.chasers.map((chaser) => chaser.key),
    ['fiveHour'],
  )
  assert.equal(scene.isGameOver, false)
})

test('layout puts a chaser at 100% on the player and ends the game', () => {
  const scene = layout({ fieldWidth: 50, contextUsed: 40, fiveHourUsed: 100, sevenDayUsed: 60 })

  assert.equal(scene.chasers[0].key, 'fiveHour')
  assert.equal(scene.chasers[0].position, scene.player)
  assert.equal(scene.isGameOver, true)
})

test('layout keeps the less-used chaser one cell behind when both land on the same cell', () => {
  const scene = layout({ fieldWidth: 50, contextUsed: 40, fiveHourUsed: 61, sevenDayUsed: 60 })

  assert.equal(scene.chasers[1].key, 'sevenDay')
  assert.equal(scene.chasers[1].position, scene.chasers[0].position - 1)
})

test('render draws every game with both field rows and both borders at the same width on every frame', () => {
  const widths = GAMES.flatMap((game) =>
    Array.from({ length: 6 }, (_, frame) => {
      const [, top, sky, ground, bottom] = render(INPUT, { ...OPTIONS, game, frame }).split('\n')
      return new Set([top, sky, ground, bottom].map((line) => line.replace(ANSI, '').length))
    }),
  )

  assert.equal(widths.length, GAMES.length * 6)
  assert.ok(widths.every((lineWidths) => lineWidths.size === 1 && lineWidths.has(54)))
})

test('render shows the title, limits and effort while the game runs', () => {
  const lines = render(INPUT, OPTIONS).replace(ANSI, '').split('\n')

  assert.match(lines[0], /^CLAUDE v2\.5\.0 +Opus 5\.5 1M context 60% left$/)
  assert.match(lines[1], /PAC-MAN/)
  assert.equal(lines[5], 'ᗩ 7d 40% ↓3d0h  ᗣ 5h 70% ↓1h30m  xhigh')
})

test('render replaces the effort label with GAME OVER when a limit runs out', () => {
  const exhausted = { ...INPUT, rate_limits: { five_hour: { used_percentage: 100 } } }

  const footer = render(exhausted, OPTIONS).replace(ANSI, '').split('\n')[5]

  assert.match(footer, /^ᗣ 5h 0% +GAME OVER$/)
})

test('isAirborne lifts each actor for two frames of six, one actor at a time', () => {
  const hops = ['player', 'fiveHour', 'sevenDay'].map((actor) =>
    Array.from({ length: 6 }, (_, frame) => isAirborne(actor, frame)),
  )

  assert.ok(hops.every((frames) => frames.filter(Boolean).length === 2))
  assert.ok(Array.from({ length: 6 }, (_, frame) => hops.filter((frames) => frames[frame]).length === 1).every(Boolean))
})

test('render moves the player into the sky row while it hops and keeps it grounded at game over', () => {
  const player = GAMES[0].player.glyphs[0]
  const rows = (input, frame) => render(input, { ...OPTIONS, frame }).replace(ANSI, '').split('\n').slice(2, 4)
  const exhausted = { ...INPUT, rate_limits: { five_hour: { used_percentage: 100 } } }

  assert.ok(rows(INPUT, 0)[0].includes(player))
  assert.ok(!rows(INPUT, 0)[1].includes(player))
  assert.ok(rows(INPUT, 2)[1].includes(player))
  assert.ok(!rows(exhausted, 0)[0].includes(GAMES[0].chasers.fiveHour.glyphs[0]))
})
