# claude-statusline-arcade-roulette

A Claude Code status line that deals each Claude session one of ten classic arcade games. The game comes from a hash of the session ID, so a session keeps its game for its whole life and a new session gets a new roll.

```
CLAUDE v2.5.0             Opus 5.5 1M context 60% left
╭══ DONKEY KONG ═════════════════════════════════════╮
║ ───────◉───────ѻ──────────ᕗ─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴Ŧ┴─ ║
╰════════════════════════════════════════════════════╯
ѻ 7d 40% ↓3d12h  ◉ 5h 70% ↓1h35m  xhigh
```

The games: Pac-Man, Space Invaders, Frogger, Donkey Kong, Asteroids, Dig Dug, Centipede, Breakout, Tron and Q*bert.

## How to read it

The player moves right as the context window fills. Two chasers follow it:

- The 5-hour chaser moves with your 5-hour rate limit usage.
- The 7-day chaser enters the field when you pass 50% of your weekly limit.

When a chaser reaches 100%, it lands on the player and the footer shows GAME OVER. The footer also shows the remaining percentage and reset countdown for each limit, plus the `effortLevel` from `~/.claude/settings.json`.

## Install

Requires Node 18.3 or later. No dependencies.

```sh
git clone https://github.com/alanmarcero/claude-statusline-arcade-roulette.git ~/Development/claude-statusline-arcade-roulette
```

Add it to `~/.claude/settings.json`:

```json
"statusLine": {
  "type": "command",
  "command": "node ~/Development/claude-statusline-arcade-roulette/arcade-roulette.js"
}
```

## Options

- `--game <id>` locks one game: `pacman`, `invaders`, `frogger`, `donkey-kong`, `asteroids`, `dig-dug`, `centipede`, `breakout`, `tron` or `qbert`.
- `--width <n>` sets the width. The default is the terminal width minus 20 columns for the Claude Code buddy, clamped to 30 to 54.

To preview every game:

```sh
for game in pacman invaders frogger donkey-kong asteroids dig-dug centipede breakout tron qbert; do
  echo '{"context_window":{"used_percentage":40},"rate_limits":{"five_hour":{"used_percentage":30},"seven_day":{"used_percentage":60}}}' \
    | node arcade-roulette.js --game "$game"
done
```

## Credit

Based on [sorosora/arcade-statusline](https://github.com/sorosora/arcade-statusline), which has the original Pac-Man and Pikmin themes.
