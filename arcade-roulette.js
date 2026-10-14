#!/usr/bin/env node
import { spawnSync } from 'node:child_process'
import { readFileSync, statSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { parseArgs } from 'node:util'
import { GAMES } from './lib/games.js'
import { pickGame, render, scoreOf } from './lib/render.js'

// Room for the Claude Code buddy sprite to the right of the status line.
const BUDDY_RESERVE = 20
const FALLBACK_COLUMNS = 120
const IDLE_SECONDS = 30

const { values } = parseArgs({ options: { game: { type: 'string' }, width: { type: 'string' } } })

const HIGH_SCORES_PATH = join(homedir(), '.claude', 'arcade-roulette-scores.json')

const [input, settings, highScores] = [0, join(homedir(), '.claude', 'settings.json'), HIGH_SCORES_PATH].map((source) => {
  try {
    return JSON.parse(readFileSync(source, 'utf8'))
  } catch {
    return {}
  }
})
const ttySize = spawnSync('sh', ['-c', 'stty size < /dev/tty'], { encoding: 'utf8' }).stdout
const columns = Number(ttySize.split(' ')[1]) || FALLBACK_COLUMNS

// Claude Code sends one session_id per instance, so each instance keeps its game across renders.
const game = GAMES.find((candidate) => candidate.id === values.game) ?? pickGame(input.session_id ?? process.ppid)

const nowSeconds = Math.floor(Date.now() / 1000)

// Each game keeps its own high score. The file is written only when a session beats it.
const highScore = highScores[game.id] ?? 0
const score = scoreOf(input)
if (score > highScore) {
  try {
    writeFileSync(HIGH_SCORES_PATH, JSON.stringify({ ...highScores, [game.id]: score }))
  } catch {}
}

// Stop the animation when the transcript has not changed for IDLE_SECONDS.
// If the status line changes every second, the terminal shows each idle tab as busy.
// A new session has no transcript file yet, so it is idle.
const lastActivitySeconds = (() => {
  try {
    return Math.floor(statSync(input.transcript_path).mtimeMs / 1000)
  } catch {
    return 0
  }
})()
const frame = Math.min(nowSeconds, lastActivitySeconds + IDLE_SECONDS)

console.log(
  render(input, {
    game,
    width: Number(values.width) || columns - BUDDY_RESERVE,
    frame,
    nowSeconds,
    effort: settings.effortLevel,
    highScore,
    isIdle: frame < nowSeconds,
  }),
)
