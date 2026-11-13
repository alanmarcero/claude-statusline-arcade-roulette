import { COLOR, ink, paper, pixelSprite, pixelTiles, tiles } from '../art.js'

const WHITE = ink(231)
const RED = ink(196)
const AZURE = ink(33)
const ORANGE = ink(208)
const NEON = ink(205)
const NEON_OFF = ink(89)
const LOOP = 48

const cop = (armor, visor) => {
  const palette = { H: armor, v: visor, g: 250, A: armor, L: 17, f: 226 }
  return {
    walk: pixelSprite(
      [
        ['.HH...', '.Hvgg.', 'AAA...', '.L.L..'],
        ['.HH...', '.Hvgg.', 'AAA...', 'L..L..'],
      ],
      palette,
    ),
    shoot: pixelSprite([['.HH...', '.Hvggf', 'AAA...', '.L.L..']], palette),
    stand: pixelSprite([['.HH...', '.Hvgg.', 'AAA...', '.L.L..']], palette),
  }
}

const COAT = { h: 52, s: 180, c: 180 }
const DEALER = pixelSprite(
  [
    ['hhh.', '.sh.', 'cccc', '.c.c'],
    ['hhh.', '.sh.', 'cccc', 'c..c'],
  ],
  COAT,
)
const CLOWN = pixelSprite(
  [
    ['.yy.', 'rWW.', 'pppp', '.p.p'],
    ['.yy.', 'rWW.', 'pppp', 'p..p'],
  ],
  { y: 214, r: 196, W: 231, p: 201 },
)
const DOBERMAN = pixelSprite(
  [
    ['.k....', 'tkk...', '.tkkkk', 't...t.'],
    ['.k....', 'tkk...', '.tkkkk', '.t.t..'],
  ],
  { k: 16, t: 136 },
)
const BULLETS = { glyphs: ['- - -'], color: [ink(229), WHITE] }
const ROCKET = pixelSprite([['.....', 'yoRRW']], { y: 226, o: 208, R: 160, W: 231 })

// The police lights strobe the backdrop row red and blue. A flash screen replaces all four papers.
const STROBE = [88, 19, 88, 19, 88, 19]

// Sunset Strip: a skyline, shops and street lamps.
const STRIP_ROWS = [paper(53), paper(241), paper(235)]
const strip = {
  screen: [paper(18), ...STRIP_ROWS],
  stars: true,
  speeds: [0.25, 1, 1, 1],
  backdrop: pixelTiles(
    [
      '....bbb..........cccc.............bb...........dddd.......',
      '..aabbbaa..aaa..cccccccc...aa...aabbaa....aaa..dddddddd...',
    ],
    { a: 17, b: 233, c: 234, d: 232 },
  ),
  sky: tiles('   D  WWW   LIQUOR    l       D   WW         l     ', {
    D: ['█', ink(233)],
    W: ['▄', ink(179), paper(238)],
    L: ['L', [NEON, NEON, NEON, NEON, NEON_OFF], paper(16)],
    I: ['I', [NEON, NEON, NEON_OFF, NEON], paper(16)],
    Q: ['Q', NEON, paper(16)],
    U: ['U', [NEON, NEON_OFF, NEON, NEON, NEON], paper(16)],
    O: ['O', NEON, paper(16)],
    R: ['R', [NEON, NEON, NEON, NEON_OFF], paper(16)],
    l: ['▀', ink(228)],
  }),
  ahead: tiles(' ', {}),
  base: pixelTiles(['c', '.'], { c: 248 }),
  flash: [...STROBE.map((sky, index) => [25 + index, { screen: [paper(sky), ...STRIP_ROWS] }]), [31, undefined]],
}

// The Bridge: oncoming traffic in the far lane.
const BRIDGE_ROWS = [paper(236), paper(239), paper(17)]
const bridge = {
  screen: [paper(18), ...BRIDGE_ROWS],
  stars: true,
  speeds: [1, 3, 1, 0.5],
  backdrop: tiles('▌╲╲─┬──┬──┬──┬──┬──┬──┬──┬──┬──┬──┬─╱╱▐', {
    '▌': ['█', ink(130)],
    '▐': ['█', ink(130)],
    '╲': ['╲', ink(250)],
    '╱': ['╱', ink(250)],
    '─': ['─', ink(250)],
    '┬': ['┬', ink(250)],
  }),
  sky: pixelTiles(
    [
      '...........cccc.......................ssss...........',
      '..........ykcckr.....................ykwwkr..........',
    ],
    { c: 24, s: 136, w: 252, y: 229, r: 160, k: 16 },
  ),
  ahead: pixelTiles(['ww....', '......'], { w: 243 }),
  base: tiles('≈~   ~≈    ≈ ~   ', { '≈': ['≈~', [ink(25), ink(31)]], '~': ['~≈', [ink(31), ink(25)]] }),
  flash: [...STROBE.map((sky, index) => [25 + index, { screen: [paper(sky), ...BRIDGE_ROWS] }]), [31, undefined]],
}

// Mr. Big's lab: ceiling pipes and vats of green bubbles.
const LAB_ROWS = [paper(235), paper(239), paper(235)]
const lab = {
  screen: [paper(234), ...LAB_ROWS],
  stars: false,
  speeds: [0.5, 1, 1, 1],
  backdrop: pixelTiles(['ppppvppppppppppppvpppppp', '........................'], { p: 245, v: 160 }),
  sky: tiles('  [ooo]     [ooo]          ', {
    '[': ['▐', ink(250)],
    ']': ['▌', ink(250)],
    o: ['°o∘ ', [ink(46), ink(118)], paper(22)],
  }),
  ahead: pixelTiles(['g...', '....'], { g: 241 }),
  base: pixelTiles(['yykk', '....'], { y: 220, k: 16 }),
  flash: [
    [25, { screen: [paper(130), ...LAB_ROWS] }],
    [26, undefined],
  ],
}

const BOSS = { s: 223, p: 91, R: 196, k: 16 }

// In the lab, Mr. Big replaces the dealer, laughs at Max, takes a hit and runs.
const bossFight = {
  dealer: [[0]],
  stash: [[0]],
  car: [[0]],
  boss: [[10, 'boss', 46, -3], [22, 'laugh', 10, -1], [25, 'bossHit', 7, -1], [27, 'flee', 5, 4], [37]],
  shotBoss: [[24, 'shot', 3, 4, 'sky'], [25]],
  boomBoss: [[25, 'boom', 8, -1], [28]],
  player: [
    [0, 'walk', -7],
    [5, 'shoot', -7],
    [7, 'walk', -7],
    [10, 'walk', -7, 1],
    [15, 'walk', -2],
    [24, 'shoot', -2],
    [25, 'walk', -2],
    [29, 'stand', -2, -1],
    [34, 'walk', -7],
  ],
}

export default {
  id: 'narc',
  loop: LOOP,
  // Deals the cop and weapon, the thug, the stage, the opening caption and the ammo, rocket and bust counts.
  vary: (pick, game) => {
    const [name, nameInk, player] = pick(
      [
        ['MAX FORCE', AZURE, cop(27, 51)],
        ['HIT MAN', RED, cop(160, 226)],
      ],
      0,
    )
    const isRocket = pick([false, true], 1)
    const thug = pick([DEALER, CLOWN, DOBERMAN], 2)
    const [stage, scenery] = pick(
      [
        ['SUNSET STRIP', strip],
        ['THE BRIDGE', bridge],
        ["MR. BIG'S LAB", lab],
      ],
      3,
    )
    const opening = pick(['NARC', "WINNERS DON'T USE DRUGS", 'TAKE DOWN MR. BIG'], 4)
    const ammo = pick([20, 45, 70, 99], 5)
    const rockets = pick([2, 3, 6, 9], 6)
    const busts = pick(
      Array.from({ length: 30 }, (_, count) => count),
      7,
    )
    const isLab = scenery === lab

    // Each shot spends three bullets or one rocket.
    const shotCues = isLab ? [0, 5, 24] : [0, 5]
    const bulletsLeft = shotCues.map((t, fired) => [t, `⁍×${ammo - (isRocket ? 0 : 3 * fired)}`])
    const rocketsLeft = shotCues.map((t, fired) => [t, `►×${rockets - (isRocket ? fired : 0)}`])
    const bustCount = [
      [0, busts],
      [25, isLab ? busts : busts + 1],
    ].map(([t, count]) => [t, `BUSTS ${String(count).padStart(2, '0')}`])
    const call = isLab ? [22, 'MR. BIG'] : [25, 'BUSTED!']

    const blastScreen = [paper(130), ...scenery.screen.slice(1)]
    const blast = isRocket ? [[7, { screen: blastScreen }], [8, undefined]] : []
    return {
      ...scenery,
      scoreboard: { ...game.scoreboard, left: `${name} {score}`, ink: nameInk },
      topCaption: {
        left: [bulletsLeft, WHITE],
        right: [rocketsLeft, ORANGE],
        center: [
          [
            [0, opening],
            [4, stage],
            [12, ''],
            call,
            [call[0] + 5, ''],
          ],
          [
            [0, RED],
            [call[0], WHITE],
          ],
        ],
      },
      caption: { ...game.caption, left: [bustCount, WHITE] },
      flash: [...blast, ...scenery.flash],
      sprites: { ...game.sprites, ...player, thug, shot: isRocket ? ROCKET : BULLETS },
      cast: isLab ? { ...game.cast, ...bossFight } : game.cast,
    }
  },
  scoreboard: { left: 'MAX FORCE {score}', right: 'HI {hi}', ink: AZURE },
  logo: [['NARC', RED]],
  border: COLOR.red,
  ...strip,
  topCaption: {
    left: ['⁍×99', WHITE],
    right: ['►×9', ORANGE],
    center: [
      [
        [0, 'NARC'],
        [4, 'SUNSET STRIP'],
        [12, ''],
        [25, 'BUSTED!'],
        [30, ''],
      ],
      RED,
    ],
  },
  caption: { left: ['BUSTS 07', WHITE], right: ['©1988 WILLIAMS', WHITE] },
  icons: { fiveHour: 'thug', sevenDay: 'cash' },
  sprites: {
    ...cop(27, 51),
    thug: DEALER,
    dealer: DEALER,
    surrender: pixelSprite([['s..s', 's..s', 'hhh.', '.sh.', 'cccc', '.c.c']], COAT),
    boss: pixelSprite(
      [
        ['.ss.', 'sss.', 'pRpp', 'pppp', 'pppp', '.k.k'],
        ['.ss.', 'sss.', 'pRpp', 'pppp', 'pppp', 'k..k'],
      ],
      BOSS,
    ),
    laugh: pixelSprite(
      [
        ['.ss.', 'kss.', 'pRpp', 'pppp', 'pppp', '.k.k'],
        ['.ss.', 'sss.', 'pRpp', 'pppp', 'pppp', '.k.k'],
      ],
      BOSS,
    ),
    flee: pixelSprite(
      [
        ['.ss.', '.sss', 'ppRp', 'pppp', 'pppp', 'k.k.'],
        ['.ss.', '.sss', 'ppRp', 'pppp', 'pppp', 'k..k'],
      ],
      BOSS,
    ),
    bossHit: pixelSprite([['.WW.', 'WWW.', 'WWWW', 'WWWW', 'WWWW', '.W.W']], { W: 231 }),
    car: pixelSprite(
      [
        ['....RB...', '...rwwr..', 'rrrrrrrry', '.kk...kk.'],
        ['....BR...', '...rwwr..', 'rrrrrrrry', '.kk...kk.'],
      ],
      { R: 196, B: 27, r: 160, w: 117, y: 228, k: 16 },
    ),
    boom: pixelSprite(
      [
        ['..y..', '.yWy.', '.yWy.', '..y..'],
        ['o.y.o', '.oyo.', 'royor', '.r.r.'],
        ['r...s', '.....', 's.r..', 'r...r'],
      ],
      { y: 226, W: 231, o: 208, r: 160, s: 180 },
    ),
    cash: { glyphs: ['$'], color: ink(46) },
    stash: { glyphs: ['▪'], color: WHITE },
    shot: BULLETS,
    points500: { glyphs: ['500'], color: WHITE },
  },
  // Max shoots a charging thug. The thug explodes and drops cash, and Max takes it for 500.
  // A dealer drops his stash and raises his hands, and Max busts him.
  // The police lights strobe, the Narc car takes the dealer, and the next thug charges in.
  cast: {
    thug: [[0, 'thug', 24, -2], [7], [36, 'thug', 48, -2]],
    boom: [[7, 'boom', 9, -1], [10]],
    cash: [[9, 'cash', 8, -1], [15]],
    dealer: [[10, 'dealer', 46, -3], [22, 'surrender', 10, -1], [34]],
    stash: [[22, 'stash', 8, -1], [25]],
    shot: [[5, 'shot', -2, 4, 'sky'], [8]],
    player: [
      [0, 'walk', -7],
      [5, 'shoot', -7],
      [7, 'walk', -7],
      [10, 'walk', -7, 1],
      [15, 'walk', -2],
      [21, 'walk', -2, 1],
      [25, 'stand', 1, -1],
      [35, 'walk', -7],
    ],
    // The car comes after the people in the cast, so it draws over them.
    car: [[25, 'car', -49, 6], [33, 'car', -1, -1], [35, 'car', null, 6], [43]],
    points: [[15, 'points500', 3, 0, 'backdrop'], [18]],
  },
}
