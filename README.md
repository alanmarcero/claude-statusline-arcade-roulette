# claude-statusline-arcade-roulette

A Claude Code status line that deals each Claude session one of fifteen classic arcade games. The game comes from a hash of the session ID, so a session keeps its game for its whole life and a new session gets a new roll.

```
CLAUDE v2.5.0                     Opus 5.5 1M context 60% left
╭══ DONKEY KONG ═════════════════════════════════════════════╮
║ Ѫ ᛉ▀▀▀╳▀▀▀╳▀▀▀╳▀▀▀╳▀▀▀╳▀▀▀╳▀▀▀╳▀▀▀╳▀▀▀╳▀▀▀╳▀▀▀╳▀▀▀╳▀▀▀╳▀▀▀ ║
║    H            H        ѡ   H ᕗ          H        ѡ   H   ║
║ ▀╳▀▀▀╳▀▀▀╳▀▀▀╳▀▀▀╳▀▀▀ѻ▀▀◉╳▀▀▀╳▀▀▀╳▀▀▀╳▀▀▀╳▀▀▀╳▀▀▀╳▀▀▀╳▀Ŧ▀╳ ║
╰══ 1UP 003530 ══════════ INSERT COIN ══════════ HI 003530 ══╯
ѻ 7d 40% ↓3d12h  ◉ 5h 70% ↓1h35m  xhigh
```

The games: Pac-Man, Space Invaders, Frogger, Donkey Kong, Asteroids, Centipede, Breakout, Tron, Tetris, Super Mario Bros, Mortal Kombat, Mortal Kombat II, Mortal Kombat 3, Rampage and Double Dragon.

## How to read it

The field is an animation that runs while Claude works. It does not track usage: the player drifts back and forth, and two chasers close in on it and fall back on a fixed loop.

Each game draws its own screen in 256 colors, close to the original cabinet: a black Pac-Man maze with peach pellets and a blinking power pellet, Frogger's purple bank and blue river with logs and turtles, red Donkey Kong girders under cyan ladders, Tetris stacks, a blue Super Mario Bros sky with brick and question blocks over a brick floor, Rampage buildings that turn to rubble behind the monster, a Double Dragon brick wall with a neon 雙截龍 sign over a cracked street, the Mortal Kombat II Dead Pool with hooks over bubbling acid, and the Mortal Kombat 3 subway with a train speeding past. The field has three rows. The ground row shows the scenery the player walks on. The middle row shows the game's sky (invader formations, cars, ladders, question blocks) and scrolls at half speed. The top row is a backdrop (the upper maze wall, the Frogger homes, Donkey Kong and Pauline on the top girder, clouds, the moon, a city skyline) that scrolls at quarter speed, so the scene has depth. An actor takes the background color of the scenery under it.

The player and the chasers take turns to hop into the middle row, the scenery scrolls left, the title shows the game's own logo colors with a white glint sweeping across it, and lights chase along the top border. Each game also animates in place: invaders swap poses as they march, Frogger traffic drives right while the water ripples and turtles dive, the Donkey Kong oil drum burns, asteroids tumble the other way, the Tron grid pulses, Tetris rows flash like a line clear, Mario's ? blocks flash and coins spin, Mortal Kombat torches flicker, and Rampage and Double Dragon windows flicker on and off. Pac-Man's ghosts turn blue and flash every twelve frames as if he ate a power pellet, a UFO crosses above the invaders, the centipede drags its body, Tron's light cycles leave light walls, Frogger trucks pull trailers, and the Asteroids ship fires its thruster. Pac-Man flashes READY!, Super Mario Bros flashes WORLD 1-1, and the Mortal Kombat games flash FIGHT! in the sky every twenty frames. In Space Invaders, Asteroids, Centipede, Super Mario Bros, all three Mortal Kombat games and Double Dragon, the player fires a shot that crosses the field three cells per frame. The animation moves one frame per second while the session works. It stops 30 seconds after the transcript last changed, so the terminal does not show idle tabs as busy.

The bottom border shows a blinking 1UP and a score of 10 points for each line Claude added or removed in the session. HI is the best score for that game across all sessions. It is kept in `~/.claude/arcade-roulette-scores.json`, which the status line writes only when a session beats it. While the session is idle, the border shows INSERT COIN between the scores.

The header shows the model and how much of the context window is left. The footer shows the remaining percentage and reset countdown for each limit, plus the `effortLevel` from `~/.claude/settings.json`.

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

- `--game <id>` locks one game: `pacman`, `invaders`, `frogger`, `donkey-kong`, `asteroids`, `centipede`, `breakout`, `tron`, `tetris`, `mario`, `mortal-kombat`, `mortal-kombat-2`, `mortal-kombat-3`, `rampage` or `double-dragon`.
- `--width <n>` sets the width. The default is the terminal width minus 20 columns for the Claude Code buddy, clamped to 30 to 70.

To preview every game:

```sh
for game in pacman invaders frogger donkey-kong asteroids centipede breakout tron tetris mario mortal-kombat mortal-kombat-2 mortal-kombat-3 rampage double-dragon; do
  echo '{"context_window":{"used_percentage":40},"rate_limits":{"five_hour":{"used_percentage":30},"seven_day":{"used_percentage":60}}}' \
    | node arcade-roulette.js --game "$game"
done
```

## Credit

Based on [sorosora/arcade-statusline](https://github.com/sorosora/arcade-statusline), which has the original Pac-Man and Pikmin themes.
