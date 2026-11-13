import { COLOR, ink, paper, pixelRows, pixelSprite, pixelTiles, sprite } from '../art.js'

const WHITE = ink(231)
const COIN = ink(220)

const hero = (cap) =>
  pixelSprite(
    [
      ['.cc', 'bss', 'cbc', 'b.b'],
      ['.cc', 'bss', 'bcb', '.bb'],
    ],
    { c: cap, s: 215, b: 58 },
  )
const leap = (cap) => pixelSprite([['.cc.', 'bss.', 'cccs', 'b..b']], { c: cap, s: 215, b: 58 })
// The blank last pixel row lifts Mario half a row, so the question block covers only his cap.
const hop = (cap) => pixelSprite([['.cc.', 'bss.', 'cccs', 'b..b', '....']], { c: cap, s: 215, b: 58 })

const goomba = (head) =>
  pixelSprite(
    [
      ['.h.', 'hwh', '.t.', 'k.k'],
      ['.h.', 'hwh', '.t.', '.kk'],
    ],
    { h: head, w: 231, t: 223, k: 16 },
  )
const flat = (head) => pixelSprite([['hhh', 'kkk']], { h: head, k: 16 })

const koopa = (shell) =>
  pixelSprite(
    [
      ['y..', 'yss', 'sss', 'y.y'],
      ['y..', 'yss', 'sss', 'yy.'],
    ],
    { s: shell, y: 222 },
  )
const shellSprite = (shell) => pixelSprite([['sss', 'www'], ['sws', 'wsw']], { s: shell, w: 231 })

// One piece of pixel art draws the sky and ground rows, so the two-row hills line up.
const midground = (rows, palette) => {
  const [sky, ahead] = pixelRows(rows, palette)
  return { sky, ahead }
}

const overworld = {
  screen: paper(69),
  backdrop: pixelTiles(
    [
      '.......wwww......................www...................wwwww..............',
      '.....wwwwwwww..................wwwwwww...............wwwwwwwww............',
    ],
    { w: 231 },
  ),
  ...midground(
    [
      '.......ggg......................................LLLLL.......................',
      '.....gggdggg....................................LPPPL.......................',
      '...ggggggggggg......lll.lll......................PPP..........ll.ll.........',
      '.gggggdgggggggggg..lllllllll.....................PPP........lllllllll.......',
    ],
    { g: 34, d: 22, l: 112, L: 112, P: 28 },
  ),
  base: pixelTiles(['hhhkhhhk', 'rrrkrrrk'], { h: 217, r: 166, k: 52 }),
}

const underground = {
  screen: paper(16),
  backdrop: pixelTiles(['bbbkbbbk', 'bbbkbbbk'], { b: 25, k: 16 }),
  ...midground(
    [
      '.........................................LLLLL...............',
      '.........................................LPPPL...............',
      '..........................................PPP................',
      '..........................................PPP................',
    ],
    { L: 112, P: 28 },
  ),
  base: pixelTiles(['hhhkhhhk', 'bbbkbbbk'], { h: 39, b: 25, k: 16 }),
}

const treetops = {
  screen: paper(69),
  ...midground(
    [
      '...gggggggggg..........GGGGGG.............gggggggg......',
      '...dddddddddd..........DDDDDD.............dddddddd......',
      '.....tttttt..............tt.................tttt........',
      '.....tttttt..............tt.................tttt........',
    ],
    { g: 28, d: 22, G: 34, D: 28, t: 95 },
  ),
  base: pixelTiles(['gggggggggggg', 'tttttttttttt'], { g: 40, t: 137 }),
}

// The empty midground replaces the overworld hills and pipes.
const castle = {
  screen: paper(16),
  backdrop: pixelTiles(['ssskssskssss', 'ssskssskssss'], { s: 240, k: 236 }),
  ...midground(['.', '.', '.', '.'], {}),
  base: pixelTiles(['bbbbbbbbbbbb', 'rlrrlrrrlrlr'], { b: 214, r: 160, l: 202 }),
}

// In the castle, Bowser replaces the Koopa. Mario jumps the fire, and Bowser falls into the lava.
// Bowser stops near Mario, so the narrowest field shows him.
const bowserFight = {
  koopa: [[30, 'bowser', 36, -2], [45, 'bowser', 6, 0], [53, 'bowser', 6, 0, 'base'], [55]],
  fire: [[48, 'fire', 4, -3], [51]],
  oldShell: [[0]],
  points: [[23, 'points100', 3, 0, 'backdrop'], [25], [41, 'points200', 4, 0, 'backdrop'], [43]],
  player: [
    [0, 'run', 0],
    [20, 'jump', 0, 0, 'sky'],
    [23, 'jump', 0, 0, 'sky'],
    [24, 'run', 0],
    [38, 'bump', 0],
    [39, 'run', 0],
    [49, 'jump', 0, 0, 'sky'],
    [51, 'run', 0],
    [56, 'run', 0, 2],
    [59, 'run', 6],
  ],
}

export default {
  id: 'mario',
  loop: 64,
  anchor: 0.6,
  idleText: ' PAUSE ',
  clock: 400,
  // Deals a brother, a world, a level, the coins and the lives.
  vary: (pick, game) => {
    const [name, run, jump, bump] = pick(
      [
        ['MARIO', hero(160), leap(160), hop(160)],
        ['LUIGI', hero(34), leap(34), hop(34)],
      ],
      0,
    )
    const level = pick([1, 2, 3, 4], 2)
    const world = `${pick([1, 2, 3, 4, 5, 6, 7, 8], 1)}-${level}`
    const coins = String(pick(Array.from({ length: 100 }, (_, count) => count), 3)).padStart(2, '0')
    const lives = pick([1, 2, 3, 4, 5], 4)
    const stage = { 1: overworld, 2: underground, 3: treetops, 4: castle }[level]
    const [walker, squashed, troopa, shell] = {
      1: [goomba(130), flat(130), koopa(34), shellSprite(34)],
      2: [goomba(31), flat(31), koopa(31), shellSprite(31)],
      3: [goomba(130), flat(130), koopa(160), shellSprite(160)],
      4: [goomba(130), flat(130), koopa(34), shellSprite(34)],
    }[level]
    return {
      ...stage,
      scoreboard: { ...game.scoreboard, left: `${name} {score}` },
      banner: [[[0, `WORLD ${world}`], [2, `${name} × ${lives}`], [4, ''], [59, level === 4 ? `THANK YOU ${name}!` : '']], WHITE],
      topCaption: { left: [`◎×${coins}`, COIN], right: [world, WHITE] },
      sprites: { ...game.sprites, run, jump, bump, goomba: walker, flat: squashed, koopa: troopa, shell },
      cast: level === 4 ? { ...game.cast, ...bowserFight } : game.cast,
    }
  },
  scoreboard: { left: 'MARIO {score}', right: 'TIME {time}', ink: WHITE },
  logo: [['SUPER MARIO BROS', ink(223)]],
  border: COLOR.red,
  speeds: [0.5, 1, 1, 1],
  ...overworld,
  banner: [[[0, 'WORLD 1-1'], [2, 'MARIO × 3'], [4, '']], WHITE],
  // The caption omits WORLD, because WORLD 1-1 covers Mario's head and the block in the narrowest field.
  topCaption: { left: ['◎×07', COIN], right: ['1-1', WHITE] },
  icons: { fiveHour: 'goomba', sevenDay: 'koopa' },
  sprites: {
    run: hero(160),
    jump: leap(160),
    bump: hop(160),
    goomba: goomba(130),
    flat: flat(130),
    koopa: koopa(34),
    shell: shellSprite(34),
    block: sprite(['?▌'], { '?': ['?', ink(94), paper(214)], '▌': ['▌', ink(94), paper(214)] }),
    bumped: sprite(['?▌'], { '?': ['?', ink(214), paper(231)], '▌': ['▌', ink(214), paper(231)] }),
    used: sprite(['▀▀'], { '▀': ['▀', ink(137), paper(94)] }),
    coin: { glyphs: ['◎', '○', '|', '○'], color: COIN },
    points100: { glyphs: ['100'], color: WHITE },
    points200: { glyphs: ['200'], color: WHITE },
    bowser: pixelSprite(
      [
        ['.gg.', 'rGGg', 'oGgg', 'y..y'],
        ['.gg.', 'rGGg', 'oGgg', '.yy.'],
      ],
      { g: 34, G: 46, r: 196, o: 208, y: 222 },
    ),
    fire: { glyphs: ['══', '━━'], color: [ink(208), ink(226), ink(196)] },
  },
  // Mario stomps a Goomba, bumps a question block for a coin, then stomps a Koopa and kicks its shell.
  cast: {
    goomba: [[2, 'goomba', 40, -2], [22, 'goomba', 0, -1], [23, 'flat', -1, -1], [25]],
    // The shell stays 2 cells ahead of Mario until he kicks it forward.
    koopa: [[34, 'koopa', 46, -2], [57, 'shell', 2, 0], [58, 'shell', null, 5]],
    // The previous loop's block and shell leave the screen, so neither vanishes at the loop start.
    oldBlock: [[0, 'used', -24, -1, 'backdrop'], [28]],
    oldShell: [[0, 'shell', 32, 5], [1]],
    player: [
      [0, 'run', 0],
      [20, 'jump', 0, 0, 'sky'],
      [23, 'jump', 0, 0, 'sky'],
      [24, 'run', 0],
      [38, 'bump', 0],
      [39, 'run', 0],
      [54, 'jump', 0, 0, 'sky'],
      [58, 'run', 0],
    ],
    block: [[0, 'block', 39, -1, 'backdrop'], [38, 'bumped', null, -1, 'backdrop'], [39, 'used', null, -1, 'backdrop']],
    coin: [[39, 'coin', 2, 0, 'backdrop'], [42]],
    points: [
      [23, 'points100', 3, 0, 'backdrop'],
      [25],
      [41, 'points200', 4, 0, 'backdrop'],
      [43],
      [57, 'points100', 3, 0, 'backdrop'],
      [59],
    ],
  },
}
