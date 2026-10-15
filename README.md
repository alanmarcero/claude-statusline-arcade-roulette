# claude-statusline-arcade-roulette

A Claude Code status line that deals each Claude session one of fifteen classic arcade games. The game comes from a hash of the session ID, so a session keeps its game for its whole life and a new session gets a new roll.

```
CLAUDE v2.5.0                     Opus 5.5 1M context 60% left
╭══ SUPER MARIO BROS 3 ══════════════════════════════════════╮
║ ▃▸▹▹▹▹▹ P ▂▄▆▆▄▂          ▁▃▃▁       ▁▃▅▅▃▁     WORLD 1-4  ║
║   ·   ·    ◎ | ◎   ·  ·    ·  ·Ꮇ  ? ? ?   ·   ·    ◎ | ◎   ║
║  ▂▄▄▂      ▐█▌     ∘∘ʘ▂ ᗣ     ▂▄▄▂      ▐█▌     ᛏ▂▄▂   ᚹ   ║
║ ╲[ᚹ][ᚠ][ᚹ]╲╲╲╲╲╲╲╲╲╲╲╲╲╲╲╲╲╲╲╲╲╲╲╲╲╲╲╲╲╲╲╲╲╲╲╲╲╲╲╲M×3 $46╲ ║
╰══ MARIO 003530 ═════════ INSERT COIN ══════════ TIME 275 ══╯
ʘ 7d 40% ↓3d12h  ᗣ 5h 70% ↓1h35m  xhigh
```

The games: Pac-Man, Space Invaders, Asteroids, Super Mario Bros, Super Mario Bros 2, Super Mario Bros 3, The Legend of Zelda, Punch-Out!!, Mortal Kombat, Mortal Kombat II, Mortal Kombat 3, Rampage, Double Dragon, Teenage Mutant Ninja Turtles and Contra.

## How to read it

The field is an animation that runs while Claude works. It does not track usage: the player drifts back and forth, and two chasers close in on it and fall back on a fixed loop. The animation moves one frame per second while the session works. It stops 30 seconds after the transcript last changed, so the terminal does not show idle tabs as busy.

The header shows the model and how much of the context window is left. The footer shows the remaining percentage and reset countdown for each rate limit, plus the `effortLevel` from `~/.claude/settings.json`.

### The screen

Each game draws its own screen in 256 colors, close to the original cabinet. The field has four rows, and each row scrolls at its own speed so the scene has depth:

| Row | Scrolls at | Shows |
|---|---|---|
| Backdrop | quarter speed | the far scenery: the upper maze wall, the Pac-Man ghost house, clouds, the Zelda status bar, the Punch-Out!! crowd, jungle palms, the moon, a city skyline |
| Sky | half speed | invader formations, the Contra base wall, question blocks, a passing subway train, a burning building. The player and chasers hop into this row. |
| Ground | full speed | the scenery the player walks on: pellets, the river, hills and pipes, bridges, the street |
| Base | full speed | the foreground: the lower maze wall, Mario's brick underground, bubbling acid, the subway platform edge, street markings, the sewer under the turtles' street |

A character takes the background color of the scenery under it. Chinese and Japanese characters, such as the neon 雙截龍 sign in Double Dragon and the 魂斗羅 base wall in Contra, take two columns.

### The animation

- The title shows the game's own logo colors, with a white glint sweeping across it, and lights chase along the top border.
- Scenery animates in place, and actors can drag tails, fire shots, flash banners in the sky, and turn scared or stunned for part of each cycle.
- Captions sit in the corners of the top and bottom rows, like the lives, credits, health bars and timers around an arcade screen. Some of them count down or drain.
- Stars twinkle in the empty backdrop of the night scenes.
- While the session is idle, the bottom border shows INSERT COIN.

### What each game shows

| Game | Scene and details |
|---|---|
| Pac-Man | a ghost house with Inky and Clyde, two pellet corridors with blinking power pellets, eaten-ghost eyes, scared ghosts that flash white before they recover, ghost points, and the bonus fruit with a row of the fruit served so far |
| Space Invaders | three invader species marching in step, zig-zag bombs, bursts, a mystery ship, the point table, damaged bunkers, a cratered ground line, lives and credits |
| Asteroids | tumbling rocks in three sizes, exploding debris, a turning ship with a flickering flame, two saucers that burst, lives and the Atari credit |
| Super Mario Bros | hills, bushes, pipes with Piranha Plants, spinning coins, a flagpole and castle, the HUD, run cycles, stomps and bouncing fireballs, with underground, treetop and castle levels |
| Super Mario Bros 2 | tall grassy hills, log platforms, cherries, mushroom blocks and a POW block, sprouts to pluck and thrown turnips, a warp jar, Shy Guys, Birdo, a draining life meter and a Starman, with desert and ice worlds |
| Super Mario Bros 3 | striped hills, giant bolted blocks, raccoon tails and power-up suits, the P-meter, item cards, the goal roulette, Goombas, Chain Chomps and spinning shells, with Desert Land under the Angry Sun and the airship |
| The Legend of Zelda | the black status bar with rupees, items and hearts, trees, rocks, Armos statues and a lake, Octoroks, Moblins and Lynels, the sword beam, the Triforce, and the dungeons with Keese and a boss |
| Punch-Out!! | the crowd with camera flashes, the ring ropes, the WVBA apron, health bars, hearts, star punches, a round clock, Mario as referee and the circuit's opponents |
| Mortal Kombat | the Pit bridge over spikes, the Courtyard or Goro's Lair, health bars, win medallions, blood, Goro, and each fighter's own special move |
| Mortal Kombat II | the Dead Pool with hooks, chains and skeletons in the acid, or the Living Forest, the Portal or the Tomb, special moves, Shao Kahn or Kintaro, and Toasty! |
| Mortal Kombat 3 | the Subway with flickering lights, an EXIT sign and a passing train, or the Street, the Pit 3 or the Graveyard, special moves, freeze and net stuns, Shao Kahn or Motaro, and a round clock |
| Rampage | buildings with flickering and burning windows, screaming people, a HOTEL sign, an antenna and water tower, a police car, rubble and dust behind the monster, thrown debris, exploding vehicles and damage meters |
| Double Dragon | a brick wall with a neon 雙截龍 sign, graffiti and a fence, or the factory or forest missions, mission and time captions, gang members, a boss carrying Marian, weapons and a health bar |
| Teenage Mutant Ninja Turtles | a burning building with smoke, a PIZZA sign and April at a window, the street with manholes and the Party Wagon, the sewer with Leatherhead, Foot Soldiers, a caped boss, a health bar, lives and pizzas |
| Contra | jungle palms, the Red Falcon base wall with the 魂斗羅 kanji, sniper towers and a blinking core, a bridge that blows up behind the player, a scuba soldier in the river, a falcon capsule, spread-gun shots, life medals, and the waterfall (滝) or the alien lair (心臓) stages |

### Per-session variety

Each session also gets small variations of its game, picked from a hash of the session ID. A session keeps the same picks for its whole life, and a new session rolls new ones.

| Game | What varies |
|---|---|
| Pac-Man | which two ghosts chase, the fruit, the spare lives and the banner (READY!, PLAYER ONE or GAME OVER) |
| Space Invaders | the spare lives, the credit count, the banner and the chasing invader species |
| Asteroids | the spare lives and the banner |
| Super Mario Bros | Mario or Luigi, the world and level (level 2 is underground, level 3 is the treetops, level 4 is the castle), the coin count and the lives |
| Super Mario Bros 2 | Mario, Luigi, Toad or Peach, the world (2 and 6 are desert, 4 is ice), the enemies, the cherries and the lives |
| Super Mario Bros 3 | Mario or Luigi, the suit (Super, Fire, Raccoon, Tanooki, Frog or Hammer), Grass Land, Desert Land or the airship, the enemies, the item cards, the coins and the lives |
| The Legend of Zelda | the overworld or one of nine dungeons, the tunic color, the B item, the hearts, the rupees, the enemies and the boss |
| Punch-Out!! | the opponent and the next contender from the circuit, the hearts, the stars, and the banner, which can be a tip from Doc Louis |
| Mortal Kombat, II and 3 | your fighter and the rival from that game's roster, with their colors and special moves, the arena, the boss, the announcer's call and the win medallions |
| Rampage | your monster and the rival, the day's city, day or night, and the food in the window |
| Double Dragon | Billy (1P, blue) or Jimmy (2P, red), the mission, the gang member, the boss, the weapon and the spare lives |
| Teenage Mutant Ninja Turtles | your turtle in its mask color with its own weapon, a partner turtle, the Foot Soldiers' uniform color, the boss, the banner, the lives and the pizza count |
| Contra | Bill (1P, blue) or Lance (2P, red), the weapon (S, M, L, F or R) with its own shots, the stage, the spare medals and the banner |

### The scoreboard

The bottom border shows a scoreboard in the style of each game. The score is 10 points for each line Claude added or removed in the session. The high score is the best score for that game across all sessions. It is kept in `~/.claude/arcade-roulette-scores.json`, which the status line writes only when a session beats it.

| Game | Left | Right |
|---|---|---|
| Pac-Man | `1UP` and the score (1UP blinks) | `HIGH SCORE` |
| Space Invaders | `SCORE<1>` | `HI-SCORE` |
| Asteroids | the score | the high score |
| Super Mario Bros | `MARIO` or `LUIGI` | `TIME`, which starts at 400 and loses one per minute of the session |
| Super Mario Bros 2 | the hero's name | `HI` |
| Super Mario Bros 3 | `MARIO` or `LUIGI` | `TIME`, which starts at 300 and loses one per minute of the session |
| The Legend of Zelda | `LINK` | `HI` |
| Punch-Out!! | `LITTLE MAC` | the opponent's name |
| Mortal Kombat, II and 3 | your fighter's name | the rival's name |
| Rampage | your monster's name | the rival monster's name |
| Double Dragon | `1P` or `2P` | `HI` |
| Teenage Mutant Ninja Turtles | your turtle's name | the partner turtle's name |
| Contra | `1P` or `2P` | `HI` |

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

- `--game <id>` locks one game: `pacman`, `invaders`, `asteroids`, `mario`, `mario-2`, `mario-3`, `zelda`, `punch-out`, `mortal-kombat`, `mortal-kombat-2`, `mortal-kombat-3`, `rampage`, `double-dragon`, `tmnt` or `contra`.
- `--width <n>` sets the width. The default is the terminal width minus 20 columns for the Claude Code buddy, clamped to 30 to 90.

To preview every game:

```sh
for game in pacman invaders asteroids mario mario-2 mario-3 zelda punch-out mortal-kombat mortal-kombat-2 mortal-kombat-3 rampage double-dragon tmnt contra; do
  echo '{"context_window":{"used_percentage":40},"rate_limits":{"five_hour":{"used_percentage":30},"seven_day":{"used_percentage":60}}}' \
    | node arcade-roulette.js --game "$game"
done
```

## Credit

Based on [sorosora/arcade-statusline](https://github.com/sorosora/arcade-statusline), which has the original Pac-Man and Pikmin themes.
