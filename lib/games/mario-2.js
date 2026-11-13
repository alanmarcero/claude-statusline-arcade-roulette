import { COLOR, ink, paper, pixelRows, pixelSprite, pixelTiles, sprite } from '../art.js'

const WHITE = ink(231)
const RED = ink(196)
const BLANK = ['...', '...', '...', '...']
// The star sprite draws the hero's art with uppercase keys, which select these colors.
const FLASH = { C: 226, S: 231, O: 208, H: 226, W: 226, R: 231, B: 208, Y: 231, P: 226 }

const hero = (rows, palette) => ({
  run: pixelSprite(rows.run, palette),
  pluck: pixelSprite([rows.pluck], palette),
  throw: pixelSprite([rows.throw], palette),
  jump: pixelSprite([rows.jump], palette),
  hurt: pixelSprite([rows.run[0], BLANK], palette),
  star: pixelSprite([rows.run[0].map((row) => row.toUpperCase()), rows.run[1]], { ...palette, ...FLASH }),
})
const PLUMBER = {
  run: [
    ['.cc', 'hss', 'coc', 'o.o'],
    ['.cc', 'hss', 'oco', '.oo'],
  ],
  pluck: ['...', '.cc', 'chs', 'oos'],
  throw: ['.cc', 'hss', 'ccs', 'o.o'],
  jump: ['.cc.', 'hss.', 'cocs', 'o..o'],
}
const TOAD = {
  run: [
    ['wrw', 'rss', 'bbb', 'h.h'],
    ['wrw', 'rss', 'bsb', '.hh'],
  ],
  pluck: ['...', 'wrw', 'bss', 'hbs'],
  throw: ['wrw', 'rss', 'bbs', 'h.h'],
  jump: ['wrw.', 'rss.', 'bbbs', 'h..h'],
}
const PEACH = {
  run: [
    ['.yc', 'yss', 'ppp', 'ppp'],
    ['.yc', 'yss', 'ppp', '.pp'],
  ],
  pluck: ['...', '.yc', 'yps', 'pps'],
  throw: ['.yc', 'yss', 'pps', 'ppp'],
  jump: ['.yc.', 'yss.', 'ppps', 'pppp'],
}

const foe = (name, rows, palette) => ({
  [name]: pixelSprite(rows, palette),
  [`${name}Flip`]: pixelSprite([[...rows[0]].reverse()], palette),
})
const SHY = [
  ['wwc', 'kwc', 'ccc', 'f.f'],
  ['wwc', 'kwc', 'ccc', '.ff'],
]
const shyGuy = (robe) => foe('shy', SHY, { c: robe, w: 231, k: 16, f: 18 })
const NINJI = foe(
  'foe',
  [
    ['k..k', 'kkkk', 'kwkw', '.kk.'],
    ['....', 'k..k', 'kkkk', 'kwkw'],
  ],
  { k: 16, w: 231 },
)
const PHANTO = foe('foe', [['.ww.', 'wkkw', 'wrrw', '.ww.']], { w: 252, k: 16, r: 196 })
const PIDGIT = foe(
  'foe',
  [
    ['.kk.', 'okwk', '.kk.', 'rprp'],
    ['.kk.', 'okwk', '.kk.', 'prpr'],
  ],
  { k: 16, w: 231, o: 208, r: 196, p: 218 },
)
const PANSER = foe('foe', [['r.r', 'rwr', '.g.', 'ggg']], { r: 196, w: 229, g: 34 })
const FLURRY = foe(
  'foe',
  [
    ['.w.', 'wkw', 'www', 'b.b'],
    ['.w.', 'wkw', 'www', '.bb'],
  ],
  { w: 231, k: 16, b: 33 },
)

// One piece of pixel art draws the backdrop, sky and ground rows, so the three-row hills line up.
const scenery = (rows, palette, floor, floorPalette) => {
  const [backdrop, sky, ahead] = pixelRows(rows, palette)
  return { backdrop, sky, ahead, base: pixelTiles(floor, floorPalette) }
}
const TUFT = { k: 22 }
const BIRDO = { r: 196, p: 205, w: 231, k: 16, o: 88 }

const grass = {
  screen: paper(75),
  ...scenery(
    [
      '..www.............HHH...............................GGG.................www.........',
      '.wwwwww..........HhHhH............................GGgGgGG.............wwwwwww.......',
      '................HhHhHhH...............HHH........G...P...G..........................',
      '................HhHhHhH..............HhHhH...........P..............................',
      '.......k.kk.k...HhHhHhH...k.k........HhHhH...........p........k.kk.k................',
      '........k..k....HhHhHhH....k.........HhHhH...........P.........k..k.................',
    ],
    { w: 231, H: 35, h: 29, G: 34, g: 28, P: 137, p: 94, ...TUFT },
    ['gggGgggggGgg', 'dddddDdddddd'],
    { g: 40, G: 76, d: 28, D: 22 },
  ),
}

const desert = {
  screen: paper(75),
  villain: PANSER,
  ...scenery(
    [
      '.....................T.................................www..............',
      '....................TTt.....................c.........wwwwww............',
      '...................TTTtt..................c.c...........................',
      '..................TTTTttt.................ccc.c.........................',
      '...k.k...........TTTTTtttt.....k.kk.k.......ccc................k.k......',
      '....k...........TTTTTTttttt.....k..k........c...................k.......',
    ],
    { w: 231, T: 180, t: 137, c: 34, ...TUFT },
    ['sssSssssSsss', 'tttttTtttttt'],
    { s: 222, S: 180, t: 94, T: 58 },
  ),
}

const frozen = {
  screen: paper(75),
  villain: FLURRY,
  ...scenery(
    [
      '........W.........................www...............................www.....',
      '.......WWb.......................wwwwww...........................wwwwww....',
      '......BWBbb....................................W............................',
      '.....BBBBbbb..................................WWb...........................',
      '....BBBBBbbbb......k.kk.k....................BBBbb........k.k...............',
      '....BBBBBbbbb.......k..k....................BBBBbbb........k................',
    ],
    { w: 231, W: 231, B: 110, b: 67, ...TUFT },
    ['wwwiwwwwwiww', 'IIIIIiIIIIII'],
    { w: 231, i: 153, I: 32 },
  ),
}

export default {
  id: 'mario-2',
  loop: 72,
  idleText: ' PAUSE ',
  // Deals a hero, a world, a level, the enemies and the lives.
  vary: (pick, game) => {
    const [name, initial, moves] = pick(
      [
        ['MARIO', 'M', hero(PLUMBER, { c: 196, s: 223, o: 27, h: 94 })],
        ['LUIGI', 'L', hero(PLUMBER, { c: 40, s: 223, o: 27, h: 94 })],
        ['TOAD', 'T', hero(TOAD, { w: 231, r: 196, s: 223, b: 27, h: 94 })],
        ['PEACH', 'P', hero(PEACH, { y: 220, c: 226, s: 223, p: 213 })],
      ],
      0,
    )
    const worldNumber = pick([1, 2, 3, 4, 5, 6, 7], 1)
    const world = `${worldNumber}-${pick([1, 2, 3], 2)}`
    const { villain = pick([NINJI, PHANTO, PIDGIT], 4), ...stage } = { 2: desert, 4: frozen, 6: desert }[worldNumber] ?? grass
    return {
      ...stage,
      scoreboard: { ...game.scoreboard, left: name },
      topCaption: { ...game.topCaption, center: [[[0, `WORLD ${world}`], [2, name], [4, '']], WHITE] },
      caption: { ...game.caption, right: [`${initial}×${pick([1, 2, 3, 4, 5], 7)}`, WHITE] },
      sprites: { ...game.sprites, ...moves, ...pick([shyGuy(196), shyGuy(211)], 3), ...villain },
    }
  },
  // SMB2 keeps no score, so the board counts coins.
  scoreboard: { left: 'MARIO', right: 'COINS {short}', ink: WHITE },
  logo: [['SUPER MARIO BROS ', ink(214)], ['2', RED]],
  border: COLOR.magenta,
  speeds: [1, 1, 1, 1],
  ...grass,
  // As in SMB2, the world shows only at the start of the loop.
  topCaption: {
    left: [[[0, '⬮⬮⬮'], [49, '⬮⬮⬯'], [62, '⬮⬮⬮']], RED],
    center: [[[0, 'WORLD 1-1'], [2, 'MARIO'], [4, '']], WHITE],
  },
  caption: {
    left: [[[0, ''], [8, 'ő'], [11, 'őő'], [26, 'őőő'], [29, 'őőőő'], [32, 'őőőőő'], [35, '']], RED],
    right: ['M×3', WHITE],
  },
  flash: [[58, { screen: paper(231) }], [59, undefined]],
  icons: { fiveHour: 'shy', sevenDay: 'birdo' },
  sprites: {
    ...hero(PLUMBER, { c: 196, s: 223, o: 27, h: 94 }),
    ...shyGuy(196),
    ...NINJI,
    ...foe(
      'birdo',
      [
        ['...rr.', '..pppp', '..kwpp', 'oppppp', '..ppp.', '..p.p.'],
        ['...rr.', '..pppp', '..kwpp', 'oppppp', '..ppp.', '...pp.'],
      ],
      BIRDO,
    ),
    birdoSpit: pixelSprite([['...rr.', '..pppp', '..kwpp', 'rppppp', '.pppp.', '..p.p.']], BIRDO),
    egg: pixelSprite([['ww', 'ee']], { w: 231, e: 250 }),
    veg: pixelSprite([['.g.', 'www']], { g: 40, w: 231 }),
    tuft: pixelSprite([['k.k', '.k.']], TUFT),
    pow: sprite(['POW'], { P: ['P', WHITE, paper(27)], O: ['O', WHITE, paper(27)], W: ['W', WHITE, paper(27)] }),
    cherry: pixelSprite([['.g.', 'r.r']], { g: 34, r: 196 }),
    starman: pixelSprite(
      [
        ['.y.', 'yyy', '.y.', 'y.y'],
        ['.w.', 'www', '.w.', 'w.w'],
      ],
      { y: 226, w: 231 },
    ),
    heart: pixelSprite([['r.r', 'rrr', '.r.', '...']], { r: 196 }),
  },
  // A turnip flips a Shy Guy. Five cherries bring a Starman, and the flashing hero flips an enemy.
  // Birdo's first egg costs a life segment, and the second passes through the blinking hero.
  // A POW block flashes the screen and flips Birdo and a Shy Guy. A heart refills the life meter.
  cast: {
    tuft: [[0, 'tuft', 7, -1], [5], [36, 'tuft', 43, -1]],
    tuftTwo: [[14, 'tuft', 43, -1], [55]],
    cherry: [[0, 'cherry', 10, -1, 'sky'], [8], [39, 'cherry', 43, -1, 'sky']],
    cherryTwo: [[0, 'cherry', 13, -1, 'sky'], [11], [42, 'cherry', 43, -1, 'sky']],
    cherryThree: [[0, 'cherry', 28, -1, 'backdrop'], [26], [57, 'cherry', 43, -1, 'backdrop']],
    cherryFour: [[0, 'cherry', 31, -1, 'backdrop'], [29], [60, 'cherry', 43, -1, 'backdrop']],
    cherryFive: [[0, 'cherry', 34, -1, 'backdrop'], [32], [63, 'cherry', 43, -1, 'backdrop']],
    starman: [[33, 'starman', 4, -1, 'base'], [34, 'starman', 3, -1], [35]],
    heart: [[60, 'heart', 4, -1, 'base'], [61, 'heart', 3, -1], [62]],
    birdo: [
      [27, 'birdo', 43, -2],
      [45, 'birdo', 7, 0],
      [46, 'birdoSpit', 7, 0],
      [48, 'birdo', 7, 0],
      [49, 'birdoSpit', 7, 0],
      [51, 'birdo', 7, 0],
      [58, 'birdoFlip', 7, 0],
      [60, 'birdoFlip', 7, -1, 'base'],
      [61],
    ],
    shy: [
      [0, 'shy', 35, -2],
      [14, 'shyFlip', 9, 0],
      [16, 'shyFlip', 9, -1, 'base'],
      [17],
      [37, 'shy', 43, -2],
      [51, 'shy', 15, 0],
      [58, 'shyFlip', 15, 0],
      [60, 'shyFlip', 15, -1, 'base'],
      [61],
      [68, 'shy', 43, -2],
    ],
    foe: [[21, 'foe', 43, -2], [41, 'foeFlip', 3, 1], [43, 'foeFlip', 5, 0, 'base'], [44]],
    egg: [[47, 'egg', 6, -3, 'sky'], [49], [50, 'egg', 6, -3, 'sky'], [67]],
    veg: [[5, 'veg', 2, -1], [6, 'veg', -2, 1, 'backdrop'], [8, 'veg', 0, 0, 'backdrop'], [12, 'veg', 3, 3, 'sky'], [14]],
    pow: [[55, 'pow', 2, -1], [56, 'pow', -2, 0, 'backdrop'], [57, 'pow', 1, 0, 'sky'], [58, 'pow', 3, -1], [59]],
    player: [
      [0, 'run', 0],
      [4, 'pluck', 0, -1],
      [6, 'run', -2, 1],
      [8, 'run', 0],
      [12, 'throw', 0],
      [13, 'run', 0],
      [26, 'jump', 0, 0, 'sky'],
      [27, 'run', 0],
      [29, 'jump', 0, 0, 'sky'],
      [30, 'run', 0],
      [32, 'jump', 0, 0, 'sky'],
      [33, 'run', 0],
      [35, 'star', 0],
      [44, 'run', 0],
      [49, 'hurt', 0],
      [53, 'run', 0],
      [54, 'pluck', 0, -1],
      [56, 'run', -2],
      [57, 'throw', -2],
      [58, 'run', -2, 1],
      [60, 'run', 0],
      [62, 'jump', 0, 0, 'sky'],
      [63, 'run', 0],
    ],
  },
}
