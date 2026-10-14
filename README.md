# claude-statusline-arcade-roulette

A Claude Code status line that deals each Claude session one of thirteen classic arcade games. The game comes from a hash of the session ID, so a session keeps its game for its whole life and a new session gets a new roll.

```
CLAUDE v2.5.0             Opus 5.5 1M context 60% left
╭══ DONKEY KONG ═════════════════════════════════════╮
║    H            H         ᕗ  H            H        ║
║ ▀╳▀▀▀╳▀◉▀╳▀▀▀╳▀ѻ▀╳▀▀▀╳▀▀▀╳▀▀▀╳▀▀▀╳▀▀▀╳▀▀▀╳▀▀▀╳▀Ŧ▀╳ ║
╰══ 1UP 003530 ══════════════════════════════════════╯
ѻ 7d 40% ↓3d12h  ◉ 5h 70% ↓1h35m  xhigh
```

The games: Pac-Man, Space Invaders, Frogger, Donkey Kong, Asteroids, Dig Dug, Centipede, Breakout, Tron, Q*bert, Tetris, Super Mario Bros and Mortal Kombat.

## How to read it

The player moves right as the context window fills. Two chasers follow it:

- The 5-hour chaser moves with your 5-hour rate limit usage.
- The 7-day chaser enters the field when you pass 50% of your weekly limit.

Each game draws its own screen in 256 colors, close to the original cabinet: a black Pac-Man maze with peach pellets and a blinking power pellet, Frogger's purple bank and blue river with logs and turtles, red Donkey Kong girders under cyan ladders, layered Dig Dug dirt, two-tone Q*bert cubes that turn yellow behind the player, Tetris stacks, a blue Super Mario Bros sky with brick and question blocks. The ground row shows the scenery the player walks on. The top row shows the game's sky (invader formations, cars, a brick wall, clouds) and scrolls at half speed for a parallax effect. An actor takes the background color of the scenery under it.

The player and the chasers take turns to hop into the top row, the scenery scrolls left, and the title cycles through colors. The animation moves one frame per second while the session works. It stops 30 seconds after the transcript last changed, so the terminal does not show idle tabs as busy.

The bottom border shows a blinking 1UP and a score of 10 points for each line Claude added or removed in the session.

When a chaser reaches 100%, it lands on the player and the footer shows GAME OVER. The footer also shows the remaining percentage and reset countdown for each limit, plus the `effortLevel` from `~/.claude/settings.json`.

## Install

Requires Node 18.3 or later and a terminal with 256-color support. No dependencies.

```sh
git clone https://github.com/alanmarcero/claude-statusline-arcade-roulette.git ~/Development/claude-statusline-arcade-roulette
```

Add it to `~/.claude/settings.json`:

```json
"statusLine": {
  "type": "command",
  "command": "node ~/Development/claude-statusline-arcade-roulette/arcade-roulette.js",
  "refreshInterval": 1
}
```

`refreshInterval` makes Claude Code run the status line every second. Without it, the status line only redraws when the session changes, so the animation stops while the session is idle.

## Options

- `--game <id>` locks one game: `pacman`, `invaders`, `frogger`, `donkey-kong`, `asteroids`, `dig-dug`, `centipede`, `breakout`, `tron`, `qbert`, `tetris`, `mario` or `mortal-kombat`.
- `--width <n>` sets the width. The default is the terminal width minus 20 columns for the Claude Code buddy, clamped to 30 to 54.

To preview every game:

```sh
for game in pacman invaders frogger donkey-kong asteroids dig-dug centipede breakout tron qbert tetris mario mortal-kombat; do
  echo '{"context_window":{"used_percentage":40},"rate_limits":{"five_hour":{"used_percentage":30},"seven_day":{"used_percentage":60}}}' \
    | node arcade-roulette.js --game "$game"
done
```

## Credit

Based on [sorosora/arcade-statusline](https://github.com/sorosora/arcade-statusline), which has the original Pac-Man and Pikmin themes.
