#!/usr/bin/env node
import { spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { parseArgs } from 'node:util'
import { GAMES } from './lib/games.js'
import { pickGame, render } from './lib/render.js'

// Room for the Claude Code buddy sprite to the right of the status line.
const BUDDY_RESERVE = 20
const FALLBACK_COLUMNS = 120

const { values } = parseArgs({ options: { game: { type: 'string' }, width: { type: 'string' } } })

const [input, settings] = [0, join(homedir(), '.claude', 'settings.json')].map((source) => {
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

console.log(
  render(input, {
    game,
    width: Number(values.width) || columns - BUDDY_RESERVE,
    frame: Math.floor(Date.now() / 1000) % 2,
    nowSeconds: Math.floor(Date.now() / 1000),
    effort: settings.effortLevel,
  }),
)
