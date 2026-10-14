# claude-statusline-arcade-roulette

A Claude Code status line that deals each Claude session one of fifteen classic arcade games. The game comes from a hash of the session ID, so a session keeps its game for its whole life and a new session gets a new roll.

```
CLAUDE v2.5.0                     Opus 5.5 1M context 60% left
╭══ MS. PAC-MAN ═════════════════════════════════════════════╮
║ ▄1600▄▄▄▄▄▄▄█ᗣ━ᗩ█▄▄▄▄▄▄▄▄▄▄   ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄   ▄▄▄▄▄▄▄▄█ᗣ ║
║ ▐██████▌·· ··▐██▌····●··▐███▌··ᗧ··▐██████▌·· ··▐██▌····●·· ║
║                      ᗩ  ᗣ     ⋈ ······· ···············ƨ·· ║
║ ▀ᗧᗧ▀▀▀▀▀▀▀▀   ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀   ▀▀▀▀▀▀▀▀▀▀▀▀▀ƨ▀ ║
╰══ 1UP 003530 ══════ INSERT COIN ══════ HIGH SCORE 003530 ══╯
ѻ 7d 40% ↓3d12h  ◉ 5h 70% ↓1h35m  xhigh
```

The games: Pac-Man, Space Invaders, Frogger, Ms. Pac-Man, Asteroids, Centipede, Breakout, Tetris, Super Mario Bros, Mortal Kombat, Mortal Kombat II, Mortal Kombat 3, Rampage, Double Dragon and Teenage Mutant Ninja Turtles.

## How to read it

The field is an animation that runs while Claude works. It does not track usage: the player drifts back and forth, and two chasers close in on it and fall back on a fixed loop. The animation moves one frame per second while the session works. It stops 30 seconds after the transcript last changed, so the terminal does not show idle tabs as busy.

The header shows the model and how much of the context window is left. The footer shows the remaining percentage and reset countdown for each rate limit, plus the `effortLevel` from `~/.claude/settings.json`.

### The screen

Each game draws its own screen in 256 colors, close to the original cabinet. The field has four rows, and each row scrolls at its own speed so the scene has depth:

| Row | Scrolls at | Shows |
|---|---|---|
| Backdrop | quarter speed | the far scenery: the upper maze wall, the Frogger homes, the Ms. Pac-Man ghost house, the top bricks, clouds, the moon, a city skyline |
| Sky | half speed | invader formations, traffic, ladders, question blocks, a passing subway train, a burning building. The player and chasers hop into this row. |
| Ground | full speed | the scenery the player walks on: pellets, the river, the brick floor, the Dead Pool walkway |
| Base | full speed | the foreground: the lower maze wall, a second traffic lane, Mario's brick underground, bubbling acid, the subway platform edge, street markings, the sewer under the turtles' street |

A character takes the background color of the scenery under it. Chinese characters, such as the neon 雙截龍 sign in Double Dragon, take two columns.

### The animation

- The title shows the game's own logo colors, with a white glint sweeping across it, and lights chase along the top border.
- Scenery animates in place: invaders swap poses as they march, water ripples and turtles dive, asteroids tumble, Tetris rows flash like a line clear, ? blocks flash and coins spin, torches and windows flicker.
- Pac-Man's ghosts turn blue and flash for four of every twelve frames, as if he ate a power pellet.
- Chasers can drag a tail: the centipede's body, a Frogger truck's trailer, a comet trail behind the Breakout ball. The Asteroids ship fires its thruster.
- Pac-Man flashes READY!, Super Mario Bros flashes WORLD 1-1, and the Mortal Kombat games flash FIGHT! every twenty frames.
- In Space Invaders, Asteroids, Centipede, Super Mario Bros, the three Mortal Kombat games, Double Dragon and Teenage Mutant Ninja Turtles, the player fires a shot that crosses the field three cells per frame.
- While the session is idle, the bottom border shows INSERT COIN.
- The base row carries fixed captions like the bottom of an arcade screen: spare lives, Pac-Man's cherries, `CREDIT 00` in Space Invaders, the Frogger TIME bar, Mario's coin count and the next Tetris piece. The Frogger TIME bar drains, the Mortal Kombat games show both fighters' health bars in the top corners, draining as the fight goes on, Rampage shows each monster's damage meter in its color, and Double Dragon shows a draining health bar.
- Teenage Mutant Ninja Turtles has smoke drifting off the burning building, a flickering PIZZA sign, April O'Neil waving from a window, manhole lids popping, the Party Wagon parked on the street, dripping sewer pipes, Leatherhead's eyes in the sewer, a cape on the boss, a health bar in the turtle's color, and lives and pizzas along the bottom. The Foot Soldiers' uniform color changes per session.
- Stars twinkle in the empty night backdrop of Space Invaders, Asteroids, Centipede, Mortal Kombat, Double Dragon and Teenage Mutant Ninja Turtles.

### Per-session variety

Each session also gets small variations of its game, picked from a hash of the session ID. A session keeps the same picks for its whole life, and a new session rolls new ones.

| Game | What varies |
|---|---|
| Mortal Kombat, II and 3 | your fighter and the rival from that game's roster (names on the scoreboard and their colors), the boss's color, and the banner (FIGHT!, ROUND 1, ROUND 2 or ROUND 3) |
| Rampage | George, Lizzie or Ralph, and the rival monster |
| Double Dragon | Billy (1P, blue) or Jimmy (2P, red), and the enemy's color |
| Teenage Mutant Ninja Turtles | Leonardo, Raphael, Michelangelo or Donatello in their mask color, each throwing their own weapon (a spinning katana, a sai, nunchucks or a bo), a partner turtle on the scoreboard, the boss behind the Foot Soldiers (Shredder, Bebop, Rocksteady or Krang), and the banner (COWABUNGA! or PIZZA TIME) |
| Super Mario Bros | Mario or Luigi, the WORLD number and the coin count |
| Pac-Man | which two ghosts chase, the fruit color and the spare lives |
| Ms. Pac-Man | the maze colors (one of the four arcade mazes), the fruit, the ghosts, the intermission banner and the spare lives |
| Space Invaders, Frogger, Asteroids | spare lives and the credit count |
| Centipede | the mushroom colors of the wave |
| Tetris | the NEXT piece |
| Breakout | the ball number |

### The scoreboard

The bottom border shows a scoreboard in the style of each game. The score is 10 points for each line Claude added or removed in the session. The high score is the best score for that game across all sessions. It is kept in `~/.claude/arcade-roulette-scores.json`, which the status line writes only when a session beats it.

| Game | Left | Right |
|---|---|---|
| Pac-Man | `1UP` and the score (1UP blinks) | `HIGH SCORE` |
| Space Invaders | `SCORE<1>` | `HI-SCORE` |
| Frogger | `1-UP` (blinks) | `HI-SCORE` |
| Ms. Pac-Man | `1UP` (blinks) | `HIGH SCORE` |
| Asteroids | the score | the high score |
| Centipede | the score and two lives | the high score |
| Breakout | a three-digit score | `BALL 1` |
| Tetris | `SCORE` | `LINES`, the lines Claude removed |
| Super Mario Bros | `MARIO` | `TIME`, which starts at 400 and loses one per minute of the session |
| Mortal Kombat | `SCORPION` | `SUB-ZERO` |
| Mortal Kombat II | `LIU KANG` | `SHAO KAHN` |
| Mortal Kombat 3 | `SUB-ZERO` | `SEKTOR` |
| Rampage | `GEORGE` | `LIZZIE` |
| Double Dragon | `1P` | `HI` |
| Teenage Mutant Ninja Turtles | your turtle's name | the partner turtle's name |

When the border is too narrow for both sides, the right side goes first.

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

- `--game <id>` locks one game: `pacman`, `invaders`, `frogger`, `ms-pacman`, `asteroids`, `centipede`, `breakout`, `tetris`, `mario`, `mortal-kombat`, `mortal-kombat-2`, `mortal-kombat-3`, `rampage`, `double-dragon` or `tmnt`.
- `--width <n>` sets the width. The default is the terminal width minus 20 columns for the Claude Code buddy, clamped to 30 to 90.

To preview every game:

```sh
for game in pacman invaders frogger ms-pacman asteroids centipede breakout tetris mario mortal-kombat mortal-kombat-2 mortal-kombat-3 rampage double-dragon tmnt; do
  echo '{"context_window":{"used_percentage":40},"rate_limits":{"five_hour":{"used_percentage":30},"seven_day":{"used_percentage":60}}}' \
    | node arcade-roulette.js --game "$game"
done
```

## Credit

Based on [sorosora/arcade-statusline](https://github.com/sorosora/arcade-statusline), which has the original Pac-Man and Pikmin themes.
