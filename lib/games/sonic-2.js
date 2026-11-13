import { COLOR, ink, paper, pixelSprite, pixelTiles, sprite } from '../art.js'
import sonic, { BALL, far, goalSign, hero, night, ringRows, SONIC_FACE } from './sonic.js'

const WHITE = ink(231)
const YELLOW = ink(226)
const GOLD = ink(220)
const RED = ink(196)
const EMERALDS = [51, 39, 46, 226, 207, 252, 203].map(ink)
const { run, ball } = sonic.sprites
const { sparkle, boom, rabbit, bird, points, monitor, broken, icon, robotnik } = sonic.sprites

const TAILS_RUN = [
  ['t...oo', 'tt.oow', '.ttoo.', '...r.r'],
  ['....oo', 'tt.oow', 't.too.', '..r.r.'],
]
const TAILS_FACE = ['o...o', 'ooooo', 'owwwo', '.www.', '..g..', '..g..']
const POST = ['.b.', 'bbb', '.g.', '.g.', '.g.', 'ggg']
const DRILL = ['.......pkpkp', '...d..rMMMMr', 'dDDDKSSSSSSK', '...d.KkK.KkK']
const tails = {
  run: pixelSprite(TAILS_RUN, { o: 208, t: 214, w: 231, r: 196 }),
  ball: pixelSprite(BALL, { b: 208, h: 214 }),
}
const golden = hero({ b: 220, h: 229, s: 223, w: 231, r: 196 })
const sonicSigns = goalSign(SONIC_FACE)

// Sonic with Tails, Sonic alone, Tails alone, or Super Sonic, who loses one ring each second.
const SOLO = { tails: [[0]], tailsDust: [[0]] }
const characters = [
  { name: 'SONIC', signs: sonicSigns },
  { name: 'SONIC', signs: sonicSigns, cast: SOLO },
  { name: 'TAILS', signs: goalSign(TAILS_FACE), hero: tails, cast: SOLO },
  {
    name: 'SONIC',
    signs: sonicSigns,
    hero: { run: golden.run, ball: golden.ball },
    cast: SOLO,
    emeralds: 7,
    reward: '',
    rings: [
      Array.from({ length: 72 }, (_, t) => {
        const collected = Math.min(Math.max(t - 5, 0), 5) + (t >= 30 ? 10 : 0)
        return [t, `◯×${80 - t + collected}`]
      }),
      YELLOW,
    ],
  },
]

const buzzer = pixelSprite(
  [
    ['.ww..', '.ww..', 'RkYkY', '....r'],
    ['.....', 'wwww.', 'RkYkY', '....r'],
  ],
  { w: 195, R: 196, k: 16, Y: 226, r: 208 },
)

// Checkered soil, sunflowers, palms and waterfalls.
const emeraldHill = {
  name: 'EMERALD HILL',
  scenery: {
    screen: [paper(75), paper(75), paper(117), paper(94)],
    ...far(
      [
        '....wwwwww..............................FfF.............wwwwwwww................................',
        '..wwwwwwwwww.....GGGGGGG...............Ff.fF.........wwwwwwwwwwwww........GGGGG.................',
        '................GccWcccG.................t...............................ccWcccc................',
        'eeeeeeeeeeeeeeeccccWcccceeeeeeweeeeeeeeeeteeeeeeeeweeeeeeeeeeeeeeeeeeeeecccWccccceeeeeeeweeeeeee',
      ],
      { w: 231, G: 34, c: 130, W: 195, F: 40, f: 28, t: 94, e: 117 },
    ),
    ahead: pixelTiles(
      [
        '...Y........Y...................Y........',
        'GGgGGGGGGgGGGGGGGGgGGGGGGGGGgGGGGGGGGGgGG',
      ],
      { Y: 226, G: 34, g: 28 },
    ),
    base: pixelTiles(['oOOooOOo', 'OOooOOoo'], { o: 130, O: 94 }),
  },
  hero: { run, ball },
  // A Coconuts or a Masher.
  walkers: [
    pixelSprite(
      [
        ['.bb.', 'wsbb', '.bbb', 'b..b'],
        ['.bb.', 'wsbb', '.bbb', '.bb.'],
      ],
      { b: 130, s: 223, w: 231 },
    ),
    pixelSprite(
      [
        ['.BB.', 'wBBB', '.BBr'],
        ['.BB.', 'wBBB', 'rBB.'],
      ],
      { B: 24, w: 231, r: 196 },
    ),
  ],
  flyer: buzzer,
}

// Blue towers over the pink Mega Mack.
const chemicalPlant = {
  name: 'CHEMICAL PLANT',
  scenery: {
    screen: [paper(37), paper(37), paper(37), paper(199)],
    ...far(
      [
        '....TT..................p...................BB..................................',
        '....TT......BBBB........p...................BB........pppp......................',
        '...TwTT.....BwBw........p.....TwTTwT.......BwBB..........p......TwTT............',
        '...TTTT.....BBBB........p.....TTTTTT.......BBBB..........p.....TTTTT............',
      ],
      { T: 24, B: 25, w: 159, p: 136 },
    ),
    ahead: pixelTiles(['............', 'BBBBBcBBBBBc'], { B: 25, c: 51 }),
    base: pixelTiles(['MmMMMMMMmMMMMM', 'NNNNNNNNNNNNNN'], { M: 205, m: 218, N: 125 }),
  },
  hero: { run, ball },
  // A Spiny, then a Grabber on its thread.
  walkers: [
    pixelSprite(
      [
        ['.....', 'o.o.o', 'GgGgG', 'k.k.k'],
        ['.....', '.o.o.', 'GgGgG', '.k.k.'],
      ],
      { o: 208, G: 36, g: 42, k: 238 },
    ),
  ],
  flyer: pixelSprite(
    [
      ['..g..', '..g..', 'kRkRk', 'k...k'],
      ['..g..', '..g..', 'kRkRk', '.k.k.'],
    ],
    { g: 250, k: 238, R: 196 },
  ),
  // A Grabber does not shoot.
  cast: { shot: [[0]] },
}

// Neon buildings and bumpers.
const casinoNight = {
  name: 'CASINO NIGHT',
  scenery: {
    stars: true,
    screen: [paper(17), paper(17), paper(17), paper(54)],
    ...far(
      [
        '....nnnn..............................nnn.......................................',
        '....PPPP.......bb.......mmm...........PPP.........bb........mmmm........bb......',
        '....PyPy.......br.......PyP...........yPy.........rb........PyPy........br......',
        '....PPPP................PPP...........PPP...................PPPP................',
      ],
      { n: 205, P: 54, y: 226, m: 51, b: 33, r: 196 },
    ),
    ahead: pixelTiles(['..........', 'PPPPyPPPPy'], { P: 91, y: 226 }),
    base: pixelTiles(['pPpPpPpP', 'dddddddd'], { p: 92, P: 128, d: 53 }),
  },
  hero: { run: night.run, ball: night.ball },
  // A Crawl behind its bumper shield.
  walkers: [
    pixelSprite(
      [
        ['BB...', 'BwRR.', 'BRRRR', '.R..R'],
        ['BB...', 'BwRR.', 'BRRRR', 'R..R.'],
      ],
      { B: 39, w: 231, R: 160 },
    ),
  ],
  flyer: buzzer,
  sprites: {
    // The slot reels sit on the lower line, which the bouncing hero does not cover.
    monitor: sprite(['▄▄▄▄▄\n▐7◯◆▌', '▄▄▄▄▄\n▐◯◆7▌', '▄▄▄▄▄\n▐◆7◯▌'], {
      '▄': ['▄', ink(220)],
      '▐': ['▐', ink(205)],
      '▌': ['▌', ink(205)],
      7: ['7', RED, paper(231)],
      '◯': ['◯', GOLD, paper(231)],
      '◆': ['◆', ink(46), paper(231)],
    }),
    broken: sprite(['▄▄▄▄▄\n▐777▌', '▄▄▄▄▄\n▐JJJ▌'], {
      '▄': ['▄', ink(220)],
      '▐': ['▐', ink(205)],
      '▌': ['▌', ink(205)],
      7: ['7', RED, paper(226)],
      J: ['7', RED, paper(231)],
    }),
  },
}

const RUN_IN = [
  [0, 'run', 0],
  [13, 'ball', 0, -2],
  [16, 'ball', 2, 6],
  [18, 'ball', 13, -2],
  [25, 'run', 0],
  [27, 'ball', 0, 0, 'sky'],
  [29, 'ball', 0],
  [30, 'ball', 0, 0, 'sky'],
  [31, 'run', 0],
  [40, 'ball', 0, 0, 'sky'],
  [43, 'run', 0],
]
// Tails copies each move a frame later.
const TAILS_IN = [
  [0, 'tailsRun', -8],
  [14, 'tailsBall', -8, -2],
  [17, 'tailsBall', -6, -1],
  [19, 'tailsRun', -8],
  [28, 'tailsBall', -8, 0, 'sky'],
  [30, 'tailsRun', -8],
  [41, 'tailsBall', -8, 0, 'sky'],
  [44, 'tailsRun', -8],
]

// In act 2, the hero bounces twice on Robotnik's drill car.
const bossFight = {
  sign: [[0]],
  drill: [[37, 'drill', 65, -3], [57, 'drillHit', 5, 0], [58, 'drill', 5, 2], [60, 'drill', 9, -2], [62, 'drillHit', 5, 0], [63]],
  robotnik: [[63, 'robotnik', 6, 2, 'sky'], [64, 'robotnik', null, 2, 'backdrop'], [66]],
  explosion: [[63, 'boom', 8, -2], [65]],
  tails: [
    ...TAILS_IN,
    [56, 'tailsBall', -8, 0, 'sky'],
    [58, 'tailsRun', -8],
    [61, 'tailsBall', -8, 0, 'sky'],
    [63, 'tailsRun', -8],
  ],
  player: [
    ...RUN_IN,
    [55, 'ball', 0, 0, 'sky'],
    [57, 'ball', 1, 0, 'sky'],
    [58, 'ball', 0, 0, 'sky'],
    [59, 'run', 0],
    [60, 'ball', 0, 0, 'sky'],
    [62, 'ball', 1, 0, 'sky'],
    [63, 'ball', 0, 0, 'sky'],
    [64, 'run', 0],
  ],
}

export default {
  id: 'sonic-2',
  loop: 72,
  anchor: 0.25,
  idleText: ' PAUSE ',
  // Deals the act, the zone, the hero, the emeralds, the clock, the lives and the walker.
  vary: (pick, game) => {
    const act = pick([1, 2], 0)
    const zone = pick([emeraldHill, chemicalPlant, casinoNight], 5)
    const character = pick(characters, 3)
    const emeralds = character.emeralds ?? pick([0, 1, 2, 3, 4, 5, 6], 2)
    const start = pick([0, 1, 2, 3, 4, 5, 6, 7], 7) * 60 + pick(Array.from({ length: 60 }, (_, second) => second), 1)
    // As in sonic.js, the clock stops at the goal sign and has no TIME label.
    const clock = Array.from({ length: 61 }, (_, second) => {
      const total = start + second
      return [second, `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`]
    })
    // The emerald banner must not cover the act 1 goal sign or the act 2 drill car.
    const emeraldAt = act === 2 ? 50 : 56
    return {
      ...zone.scenery,
      banner: [
        [
          [0, zone.name],
          [2, 'ZONE'],
          [3, `ACT ${act}`],
          [5, ''],
          [emeraldAt, character.reward ?? 'CHAOS EMERALD'],
          [emeraldAt + 3, ''],
          [64, `${character.name} GOT`],
          [66, 'THROUGH'],
          [68, `ACT ${act}`],
          [71, ''],
        ],
        WHITE,
      ],
      topCaption: { left: [clock, YELLOW], right: character.rings ?? game.topCaption.right },
      caption: {
        left: [`${character.name}×${pick([1, 2, 3, 4, 5], 8)}`, WHITE],
        right: [[[0, '◆'.repeat(emeralds)], [emeraldAt, '◆'.repeat(Math.min(emeralds + 1, 7))]], EMERALDS],
      },
      icons: act === 2 ? { ...game.icons, sevenDay: 'drill' } : game.icons,
      sprites: {
        ...game.sprites,
        ...zone.hero,
        ...zone.sprites,
        ...ringRows(zone.scenery.screen[1]),
        ...character.hero,
        ...character.signs,
        walker: pick(zone.walkers, 4),
        flyer: zone.flyer,
      },
      cast: { ...game.cast, ...zone.cast, ...(act === 2 ? bossFight : {}), ...character.cast },
    }
  },
  scoreboard: { left: 'SCORE {score}', right: 'RINGS {short}', ink: YELLOW },
  logo: [
    ['SONIC ', WHITE],
    ['THE HEDGEHOG ', YELLOW],
    ['2', RED],
  ],
  border: COLOR.blue,
  speeds: [0.5, 0.5, 2, 2],
  ...emeraldHill.scenery,
  // As in the game, the banner shows each card one line at a time.
  banner: [
    [
      [0, 'EMERALD HILL'],
      [2, 'ZONE'],
      [3, 'ACT 1'],
      [5, ''],
      [56, 'CHAOS EMERALD'],
      [59, ''],
      [64, 'SONIC GOT'],
      [66, 'THROUGH'],
      [68, 'ACT 1'],
      [71, ''],
    ],
    WHITE,
  ],
  topCaption: {
    left: ['0:00', YELLOW],
    right: [
      [[0, '◯×0'], [6, '◯×1'], [7, '◯×2'], [8, '◯×3'], [9, '◯×4'], [10, '◯×5'], [30, '◯×15']],
      [[0, [RED, YELLOW]], [6, YELLOW]],
    ],
  },
  caption: { left: ['SONIC×3', WHITE], right: [[[0, '◆◆'], [56, '◆◆◆']], EMERALDS] },
  icons: { fiveHour: 'walker', sevenDay: 'flyer' },
  sprites: {
    ...emeraldHill.hero,
    ...characters[0].signs,
    walker: emeraldHill.walkers[0],
    flyer: buzzer,
    tailsRun: tails.run,
    tailsBall: tails.ball,
    ...ringRows(emeraldHill.scenery.screen[1]),
    sparkle,
    boom,
    rabbit,
    bird,
    points,
    monitor,
    broken,
    icon,
    robotnik,
    dust: pixelSprite(
      [
        ['...', '.ww'],
        ['.w.', 'wgw'],
        ['w.w', 'wgw'],
      ],
      { w: 255, g: 250 },
    ),
    trail: { glyphs: ['══ ═══ ═'], color: [WHITE, ink(195)] },
    shot: { glyphs: ['●'], color: [ink(208), YELLOW] },
    post: pixelSprite([POST], { b: 33, g: 250 }),
    postLit: pixelSprite([POST], { b: 196, g: 250 }),
    stars: { glyphs: [' * * \n*   *', '*   *\n * * '], color: [YELLOW, WHITE] },
    drill: pixelSprite([DRILL], { p: 217, k: 16, r: 196, M: 172, S: 250, K: 240, D: 250, d: 244 }),
    drillHit: pixelSprite([DRILL], { p: 231, k: 231, r: 231, M: 231, S: 231, K: 16, D: 231, d: 16 }),
  },
  // Sonic and Tails spin dash through the walker, bounce on the monitor, jump the shot and hit the flyer.
  // The star post adds an emerald before the goal sign.
  cast: {
    post: [[18, 'post', 66, -2], [50, 'postLit', null, -2], [64]],
    stars: [[51, 'stars', 1, -2, 'sky'], [56]],
    sign: [[0, 'signHero', -22, -2], [3], [28, 'sign', 66, -2], [60, 'signSpin', null, -2], [66, 'signHero', null, -2]],
    monitor: [[0, 'monitor', 60, -2], [29, 'broken', 2, -2], [44], [69, 'monitor', 66, -2]],
    walker: [[0, 'walker', 44, -2], [17], [61, 'walker', 66, -2]],
    flyer: [[21, 'flyer', 66, -3, 'sky'], [42]],
    shot: [[37, 'shot', 17, -4, 'sky'], [39, 'shot', null, -4], [43]],
    rings: [
      [0, 'rings5', 15, -2, 'sky'],
      [6, 'rings4', 5, 0, 'sky'],
      [7, 'rings3', 5, 0, 'sky'],
      [8, 'rings2', 5, 0, 'sky'],
      [9, 'rings1', 5, 0, 'sky'],
      [10],
      [47, 'rings5', 65, -2, 'sky'],
    ],
    animal: [[18, 'rabbit', 10, -3], [26], [44, 'bird', 0, -1, 'backdrop'], [47]],
    tailsDust: [[14, 'dust', -11, -2], [17]],
    tails: TAILS_IN,
    dust: [[13, 'dust', -3, -2], [16]],
    trail: [[16, 'trail', -6], [17]],
    player: RUN_IN,
    boom: [[17, 'boom', 10, -2], [19], [42, 'boom', 3, -2, 'sky'], [44]],
    sparkle: [[6, 'sparkle', 4, 0, 'sky'], [11]],
    icon: [[29, 'icon', 5, 0, 'backdrop'], [31]],
    points: [[18, 'points', 12, -2, 'backdrop'], [20], [43, 'points', 6, -2, 'backdrop'], [45]],
  },
}
