import { COLOR, ink, paper, pixelRows, pixelSprite, pixelTiles, sprite } from '../art.js'

// sonic-2.js imports the exports and several sprites.

const WHITE = ink(231)
const YELLOW = ink(226)
const GOLD = ink(220)
const RED = ink(196)
const SLATE = ink(240)

const RUN = [
  ['bbb..', '.bbws', 'bbbs.', '.r.r.'],
  ['bbb..', '.bbws', 'bbbs.', '..rr.'],
]
const BLANK = ['.....', '.....', '.....', '.....']
export const BALL = [
  ['.bb.', 'bhbb', 'bbhb', '.bb.'],
  ['.bb.', 'bbhb', 'bhbb', '.bb.'],
]
const DAY = { b: 21, h: 33, s: 223, w: 231, r: 196 }
// A lighter blue keeps Sonic visible against the dark sky.
const NIGHT = { ...DAY, b: 33, h: 45 }
export const hero = (palette) => ({
  run: pixelSprite(RUN, palette),
  ball: pixelSprite(BALL, palette),
  hurt: pixelSprite([['.bbb.', 'bbbws', 'w.b.w', 'r...r']], palette),
  blink: pixelSprite([RUN[0], BLANK, RUN[1], BLANK], palette),
})

// A ring has the sky paper, so the banner text over it does too.
const SPIN = ['◯', '⬯', 'ǀ', '⬯']
export const ringRows = (sky) =>
  Object.fromEntries(
    [1, 2, 3, 4, 5].map((count) => {
      const glyphs = SPIN.map((glyph) => Array(count).fill(glyph).join(' '))
      return [`rings${count}`, { glyphs, color: GOLD, background: sky }]
    }),
  )

// Palms and buildings span the backdrop and sky rows, so both rows scroll at one speed.
export const far = (rows, palette) => {
  const [backdrop, sky] = pixelRows(rows, palette)
  return { backdrop, sky }
}

const ROBOTNIK_FACE = ['.ppp.', 'pkpkp', 'MMpMM', '.rrr.', '..g..', '..g..']
export const SONIC_FACE = ['.bbb.', 'bbbbb', 'bwwwb', '.sks.', '..g..', '..g..']
const EDGE = ['..g..', '..g..', '..g..', '..g..', '..g..', '..g..']
const SIGN = { p: 217, k: 16, M: 172, r: 196, g: 250, b: 21, w: 231, s: 223, o: 208 }
export const goalSign = (face) => ({
  sign: pixelSprite([ROBOTNIK_FACE], SIGN),
  signSpin: pixelSprite([ROBOTNIK_FACE, EDGE, face, EDGE], SIGN),
  signHero: pixelSprite([face], SIGN),
})
const EGG = ['..pkppkp..', '.rMMMMMMr.', 'KSSSSSSSSK', '..KKKKKK..']

// Checkered soil, flowers, palms, hills and the sea.
const greenHill = {
  name: 'GREEN HILL',
  scenery: {
    screen: [paper(39), paper(39), paper(117), paper(130)],
    ...far(
      [
        '.......wwwwwww..............................................wwwwwwwww............FfF............',
        '....wwwwwwwwwwwwcc......................................cwwwwwwwwwwwwc..........Ff.fF...........',
        '...........................GGG....................................................t........GG...',
        'eeeeeeeeeeeeeeeeeeeeeeeeeGGgggGGeeeeeeeeweeeeeeeeeeeeeeeeeeeeeeeweeeeeeeeeeeeeeeeeteeeeeeGGggGGe',
      ],
      { w: 231, c: 153, F: 40, f: 28, t: 94, G: 34, g: 28, e: 117 },
    ),
    ahead: pixelTiles(
      [
        '.....y...............p..............y..........',
        'GgGGGGgGGGGGGgGGGGGGGGGGgGGGGGGGGGGgGGGGGGGgGGG',
      ],
      { y: 226, p: 171, G: 40, g: 34 },
    ),
    base: pixelTiles(['ooOOooOO', 'OOooOOoo'], { o: 172, O: 130 }),
  },
  // A Motobug or a Crabmeat, then a Buzz Bomber or a Chopper.
  walkers: [
    pixelSprite(
      [
        ['.RR.', 'wRRR', 'bbRR', 'k..k'],
        ['.RR.', 'wRRR', 'bbRR', '.k.k'],
      ],
      { R: 196, w: 231, b: 60, k: 238 },
    ),
    pixelSprite(
      [
        ['c...c', 'cRRRc', '.wRw.', 'R.R.R'],
        ['.c.c.', 'cRRRc', '.wRw.', '.R.R.'],
      ],
      { c: 216, R: 166, w: 231 },
    ),
  ],
  flyers: [
    pixelSprite(
      [
        ['.ww..', '.ww..', 'rkkyo', '...o.'],
        ['.....', 'wwww.', 'rkkyo', '...o.'],
      ],
      { w: 195, r: 196, k: 18, y: 226, o: 208 },
    ),
    pixelSprite(
      [
        ['.RR.', 'wRRR', '.RR.'],
        ['.RR.', 'wRRR', 'RR..'],
      ],
      { R: 196, w: 231 },
    ),
  ],
  sprites: {
    ...hero(DAY),
    looping: pixelSprite([['........', '..bbbb..', 'bh....hb', 'b......b', '........', '........']], DAY),
    loop: pixelSprite(
      [['...oOOOOo...', '.oOo....oOo.', 'oO........Oo', 'Oo........oO', '.oOo....oOo.', '...oOOOOo...']],
      { o: 172, O: 130 },
    ),
  },
}

export const night = hero(NIGHT)
const column = pixelSprite(
  [['..LLLLLLLL..', '...llLLll...', '....lLLl....', '....lLLl....', '....lLLl....', '...LLLLLL...']],
  { L: 146, l: 97 },
)
const lamp = pixelSprite(
  [['....yYYy....', '.....gg.....', '.....gg.....', '.....gg.....', '.....gg.....', '....gGGg....']],
  { y: 228, Y: 231, g: 34, G: 40 },
)

// Marble blocks over lava, with broken columns behind.
const marble = {
  name: 'MARBLE',
  scenery: {
    screen: [paper(235), paper(235), paper(235), paper(124)],
    ...far(
      [
        '..........LL....................................................................',
        '.........LllL.......................................LLLL........................',
        '..........ll..................L.....................l..l........................',
        '......GgGllGgG..............GgLlgG...............gGGl..lGGg...........GgG.......',
      ],
      { L: 146, l: 97, G: 34, g: 28 },
    ),
    ahead: pixelTiles(
      [
        '............................',
        'GMMMmMMMMmMMMGGMMmMMMMmMMMMm',
      ],
      { G: 76, M: 140, m: 97 },
    ),
    base: pixelTiles(['rrRrrrOrrrrRrrrrrrYr', 'dddrddddddddrddddddd'], { r: 160, R: 196, O: 208, Y: 220, d: 124 }),
  },
  // A Caterkiller, then a Batbrain.
  walkers: [
    pixelSprite(
      [
        ['.......', '.s.s.s.', 'HPpPpPp', 'k.k.k.k'],
        ['.......', '..s.s.s', 'HPpPpP.', '.k.k.k.'],
      ],
      { s: 231, H: 213, P: 134, p: 170, k: 54 },
    ),
  ],
  flyers: [
    pixelSprite(
      [
        ['B...B', 'BBwBB', '..B..'],
        ['.....', 'BBwBB', 'B.B.B'],
      ],
      { B: 63, w: 231 },
    ),
  ],
  sprites: { ...night, looping: night.run, loop: column },
}

// A city skyline over green girders.
const starLight = {
  name: 'STAR LIGHT',
  scenery: {
    stars: true,
    screen: [paper(17), paper(17), paper(17), paper(17)],
    ...far(
      [
        '..............PP.......................................B........................',
        '....BBB.......PP........................PPP...........BBB.......................',
        '....ByB......PyP..........ByBy..........PyP...........yBy.........PyP...........',
        '...BBBBB....PPPPP........BBBBBB........PPPPP.........BBBBB.......PPPPP..........',
      ],
      { B: 18, P: 54, y: 221 },
    ),
    ahead: pixelTiles(['..........', 'GGGGWGGGGG'], { G: 40, W: 231 }),
    base: pixelTiles(['GG..', '..GG'], { G: 28 }),
  },
  // A Bomb, then an Orbinaut.
  walkers: [
    pixelSprite(
      [
        ['..y.', '.KK.', 'KwKK', 'r..r'],
        ['.y..', '.KK.', 'KwKK', '.rr.'],
      ],
      { y: 226, K: 245, w: 231, r: 196 },
    ),
  ],
  flyers: [
    pixelSprite(
      [
        ['s...s', '.BBB.', '.BwB.', 's...s'],
        ['..s..', 'sBBBs', '.BwB.', '..s..'],
      ],
      { s: 250, B: 69, w: 231 },
    ),
  ],
  sprites: { ...night, looping: night.run, loop: lamp },
}

const RUN_IN = [
  [0, 'run', 0],
  [16, 'ball', 0, 0, 'sky'],
  [18, 'ball', 0],
  [19, 'ball', 0, 0, 'sky'],
  [20, 'run', 0],
  [28, 'ball', 0],
  [31, 'run', 0],
  [38, 'looping', 0],
  [39, 'run', 0],
  [42, 'ball', 0, 0, 'sky'],
  [46, 'run', 0],
  [52, 'hurt', -2, -3, 'sky'],
  [54, 'blink', -8, 2],
  [58, 'run', 0],
]

// In act 3, the wrecking ball replaces the spikes.
const bossFight = {
  spikes: [[0]],
  sign: [[0]],
  robotnik: [
    [36, 'robotnik', 68, -4, 'sky'],
    [52, 'robotnik', 4, 0, 'sky'],
    [60, 'robotnikHit', 4, 0, 'sky'],
    [61, 'robotnik', 4, 0, 'sky'],
    [63, 'robotnikHit', 4, 0, 'sky'],
    [64, 'robotnik', 4, 3, 'sky'],
    [65, 'robotnik', null, 3, 'backdrop'],
    [67],
  ],
  wrecker: [
    [36, 'wrecker', 68, -4],
    [52, 'wrecker', 4, 0],
    [64, 'wrecker', 4, 3],
    [65, 'wrecker', null, 3, 'sky'],
    [66, 'wrecker', null, 3, 'backdrop'],
    [67],
  ],
  player: [
    ...RUN_IN,
    [59, 'ball', 0, 0, 'sky'],
    [61, 'ball', -2, 0, 'sky'],
    [62, 'ball', 0, 0, 'sky'],
    [64, 'ball', -2, 0, 'sky'],
    [65, 'run', 0],
  ],
}

export default {
  id: 'sonic',
  loop: 72,
  anchor: 0.25,
  idleText: ' PAUSE ',
  // Deals the act, the zone, the clock, the lives and the two Badniks.
  vary: (pick, game) => {
    const act = pick([1, 2, 3], 0)
    const zone = pick([greenHill, marble, starLight], 4)
    const { name, scenery, walkers, flyers, sprites } = zone
    const start = pick([0, 1, 2, 3, 4, 5, 6, 7], 6) * 60 + pick(Array.from({ length: 60 }, (_, second) => second), 1)
    // The clock stops at the goal sign. It has no TIME label, so Sonic's jumps show in the narrowest field.
    const clock = Array.from({ length: 63 }, (_, second) => {
      const total = start + second
      return [second, `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`]
    })
    return {
      ...scenery,
      banner: [[[0, `${name} ZONE`], [3, `ACT ${act}`], [5, ''], [64, 'SONIC HAS PASSED'], [68, `ACT ${act}`], [71, '']], WHITE],
      topCaption: { ...game.topCaption, left: [clock, YELLOW] },
      caption: { left: [`SONIC×${pick([1, 2, 3, 4, 5], 7)}`, WHITE] },
      icons: act === 3 ? { ...game.icons, sevenDay: 'robotnik' } : game.icons,
      sprites: { ...game.sprites, ...sprites, ...ringRows(scenery.screen[1]), walker: pick(walkers, 2), flyer: pick(flyers, 3) },
      cast: act === 3 ? { ...game.cast, ...bossFight } : game.cast,
    }
  },
  scoreboard: { left: 'SCORE {score}', right: 'RINGS {short}', ink: YELLOW },
  logo: [
    ['SONIC ', WHITE],
    ['THE HEDGEHOG', YELLOW],
  ],
  border: COLOR.cyan,
  speeds: [0.5, 0.5, 2, 2],
  ...greenHill.scenery,
  banner: [[[0, 'GREEN HILL ZONE'], [3, 'ACT 1'], [5, ''], [64, 'SONIC HAS PASSED'], [68, 'ACT 1'], [71, '']], WHITE],
  // The ring count flashes red at zero.
  topCaption: {
    left: ['0:00', YELLOW],
    right: [
      [
        [0, '◯×0'],
        [6, '◯×1'],
        [7, '◯×2'],
        [8, '◯×3'],
        [9, '◯×4'],
        [10, '◯×5'],
        [31, '◯×15'],
        [52, '◯×0'],
        [56, '◯×1'],
        [58, '◯×2'],
      ],
      [[0, [RED, YELLOW]], [6, YELLOW], [52, [RED, YELLOW]], [56, YELLOW]],
    ],
  },
  caption: { left: ['SONIC×3', WHITE] },
  icons: { fiveHour: 'walker', sevenDay: 'flyer' },
  sprites: {
    ...greenHill.sprites,
    walker: greenHill.walkers[0],
    flyer: greenHill.flyers[0],
    ...ringRows(greenHill.scenery.screen[1]),
    sparkle: { glyphs: ['*', '+'], color: [WHITE, YELLOW] },
    burst: {
      glyphs: [
        '       ◯ ⬯ ◯         \n     ⬯       ⬯       \n      ◯       ◯      ',
        '  ◯   ⬯       ⬯   ◯  \n⬯                   ⬯\n                     ',
        '                     \n ◯   ⬯         ⬯   ◯ \n⬯                   ◯',
        '                     \n                     \n◯  ⬯   ◯   ◯   ⬯  ◯  ',
        '                     \n  ◯       ⬯     ◯    \n     ⬯         ⬯     ',
        '                     \n                     \n  ◯     ⬯       ◯    ',
      ],
      color: GOLD,
    },
    boom: pixelSprite(
      [
        ['.ww.', 'wyyw', 'wyyw', '.ww.'],
        ['w..w', '.oo.', '.oo.', 'w..w'],
      ],
      { w: 231, y: 226, o: 208 },
    ),
    rabbit: pixelSprite(
      [
        ['.w.', '.ww', 'www', 'w.w'],
        ['.w.', '.ww', 'www', '...'],
      ],
      { w: 231 },
    ),
    bird: pixelSprite(
      [
        ['b.b', '.wb'],
        ['...', 'bwb'],
      ],
      { b: 20, w: 231 },
    ),
    points: { glyphs: ['100'], color: WHITE },
    monitor: pixelSprite([['ssss', 'syks', 'ssss', '.kk.']], { s: 250, k: 16, y: 220 }),
    broken: pixelSprite([['s..s', 'skks']], { s: 250, k: 240 }),
    icon: { glyphs: ['◯'], color: GOLD },
    spikes: pixelSprite([['.w...w.', 'wSw.wSw', 'SSSSSSS']], { w: 252, S: 244 }),
    ...goalSign(SONIC_FACE),
    robotnik: pixelSprite([EGG], { p: 217, k: 16, r: 196, M: 172, S: 250, K: 240 }),
    robotnikHit: pixelSprite([EGG], { p: 231, k: 231, r: 231, M: 231, S: 231, K: 16 }),
    // The checkered wrecking ball turns as it swings.
    wrecker: sprite(['()╱       ', '    []    ', '       ╲()', '    []    '], {
      '(': ['◖', WHITE],
      ')': ['◗', SLATE],
      '[': ['◖', SLATE],
      ']': ['◗', WHITE],
      '╱': ['╱', ink(250)],
      '╲': ['╲', ink(250)],
    }),
  },
  // Sonic collects rings, bounces on the walker, breaks the monitor, runs the loop and bounces on the flyer.
  // He loses his rings on the spikes, collects two and passes the goal sign.
  cast: {
    loop: [[3, 'loop', 68, -2], [54]],
    sign: [[0, 'signHero', -18, -2], [5], [30, 'sign', 66, -2], [62, 'signSpin', null, -2], [68, 'signHero', null, -2]],
    monitor: [[0, 'monitor', 63, -2], [30, 'broken', 3, -2], [45], [71, 'monitor', 65, -2]],
    spikes: [[21, 'spikes', 65, -2], [68]],
    walker: [[0, 'walker', 56, -3], [18], [69, 'walker', 65, -3]],
    flyer: [[23, 'flyer', 66, -3, 'sky'], [44]],
    animal: [[20, 'rabbit', -3, -3], [27], [46, 'bird', 0, -1, 'backdrop'], [49]],
    rings: [
      [0, 'rings5', 15, -2, 'sky'],
      [6, 'rings4', 5, 0, 'sky'],
      [7, 'rings3', 5, 0, 'sky'],
      [8, 'rings2', 5, 0, 'sky'],
      [9, 'rings1', 5, 0, 'sky'],
      [10],
      [47, 'rings5', 65, -2, 'sky'],
    ],
    burst: [[52, 'burst', -8, -2], [58]],
    player: RUN_IN,
    boom: [[18, 'boom', 3, -2], [20], [44, 'boom', 3, -2, 'sky'], [46]],
    sparkle: [[6, 'sparkle', 4, 0, 'sky'], [11], [56, 'sparkle', 1, 0, 'sky'], [57], [58, 'sparkle', 5, 0, 'sky'], [59]],
    icon: [[30, 'icon', 4, -2, 'backdrop'], [32]],
    points: [[20, 'points', 2, -2, 'backdrop'], [22], [45, 'points', 6, -2, 'backdrop'], [47]],
  },
}
