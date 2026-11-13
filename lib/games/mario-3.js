import { COLOR, OPAQUE, ink, paper, pixelRows, pixelSprite, pixelTiles, sprite } from '../art.js'

const WHITE = ink(231)
const BLACK = ink(16)
const COIN = ink(220)
const STAGE = paper(16)
// The goal cards: a mushroom, a fire flower and a star.
const CARDS = [
  ['◓', 196],
  ['⊛', 208],
  ['*', 226],
]

// A palette without t, T and e draws no tail and no ears.
const hero = (palette) => ({
  run: pixelSprite(
    [
      ['..ecc', '..hss', 'tTcoc', '..o.o'],
      ['..ecc', '..hss', '.Tcoc', 't..oo'],
    ],
    palette,
  ),
  jump: pixelSprite([['..ecc.', '..hss.', 'tTcocs', '..o..o']], palette),
  fly: pixelSprite(
    [
      ['t.ecc.', '.Thss.', '..ccos', '..oo..'],
      ['..ecc.', '..hss.', 'tTccos', '..oo..'],
    ],
    palette,
  ),
  kick: pixelSprite([['..ecc', '..hss', 'tTcos', '.o..o']], palette),
})

// The text has its own black paper, which hides the sky behind it.
const label = (text, legend) => {
  const letters = Object.fromEntries([...text].map((letter) => [letter, [letter, WHITE, STAGE]]))
  return sprite([text], { ...letters, ' ': [OPAQUE, '', STAGE], ...legend })
}

const roulette = (card) => {
  const [glyph, code] = CARDS[card]
  const frame = { '▐': ['▐', WHITE, STAGE], '▌': ['▌', WHITE, STAGE], '*': [glyph, ink(code), STAGE] }
  return { glyph, code, sprites: { won: sprite(['▐*▌'], frame), gotCard: label('YOU GOT A CARD ▐*▌', frame) } }
}

const foe = (name, rows, palette) => ({
  [name]: pixelSprite(rows, palette),
  [`${name}Flip`]: pixelSprite([[...rows[0]].reverse()], palette),
})
const GOOMBA = { h: 130, w: 231, t: 223, k: 16 }

const PARA_GOOMBA = pixelSprite(
  [
    ['w.hh.w', 'wwhhww', '.hwwh.', '.kttk.'],
    ['..hh..', 'wwhhww', 'whwwhw', '.kttk.'],
  ],
  GOOMBA,
)

const ROCKY = [
  ['.kk.', 'kwsk', '.ss.', 'kssk'],
  ['.kk.', 'kwsk', '.ss.', '.ss.'],
]

// One piece of pixel art draws the sky and ground rows, so the two-row hills line up.
const midground = (rows, palette) => {
  const [sky, ahead] = pixelRows(rows, palette)
  return { sky, ahead }
}

const grass = {
  screen: [paper(117), paper(117), paper(117), STAGE],
  backdrop: pixelTiles(
    ['.....wwww........................wwww...................', '...wwwwwwww....................wwwwwwww.................'],
    { w: 231 },
  ),
  ...midground(
    [
      '......kkkk.......bPPPb........................nQQQn.vWWWv...............',
      '....kGGggGGk.....PPPPPk.............kkkk......QQQQQkWWWWWk..............',
      '...kGGggGGggk....PPPPPk...kkkk.....kgGGgk.....QQQQQkWWWWWk....kkkk......',
      '..kGGggGGggGGk...bPPPbk..kBBBBk...kgGGggGk....nQQQnkvWWWvk...kBBBBk.....',
    ],
    { k: 16, G: 114, g: 71, P: 218, b: 175, Q: 157, n: 114, W: 255, v: 250, B: 34 },
  ),
  base: pixelTiles(['tttTtttk', 'kkkkkkkk'], { t: 215, T: 222, k: 16 }),
}

// The desert victim is the Angry Sun, which swoops down into the kicked shell.
const desert = {
  world: 2,
  screen: [paper(230), paper(230), paper(230), STAGE],
  backdrop: pixelTiles(
    ['..........YY....................YZ..........', '........YYYYZZ................YYYZZZ........'],
    { Y: 223, Z: 180 },
  ),
  ...midground(
    [
      '.....................pPPp........................pPPp...........',
      '.......kkkk.........p.r..p......................p.r..p..........',
      '.....ksSSssSk.........r............kkkk...........r.............',
      '....ksSSssSSsk........R..........kssSSssk.........R.............',
    ],
    { k: 16, S: 180, s: 137, p: 28, P: 34, r: 130, R: 94 },
  ),
  base: pixelTiles(['sssSsssk', 'kkkkkkkk'], { s: 222, S: 229, k: 16 }),
  sprites: {
    ...foe(
      'victim',
      [
        ['y.oy.', '.okoy', 'yoooo', '.yo.y'],
        ['.yoy.', 'yokoy', '.oooy', 'y.o..'],
      ],
      { y: 226, o: 208, k: 16 },
    ),
    bonus: { glyphs: ['1000'], color: BLACK },
  },
  cast: {
    victim: [
      [16, 'victim', 43, -2, 'sky'],
      [31, 'victim', 13, 0, 'sky'],
      [35, 'victim', 12, -1],
      [37, 'victimFlip', 10, 0],
      [39, 'victimFlip', 10, -1, 'base'],
      [40],
    ],
  },
}

// Rocky Wrench replaces the Goomba and the victim, and Mario stomps a Koopaling for the wand.
const airship = {
  screen: [paper(17), paper(17), paper(17), STAGE],
  stars: true,
  backdrop: pixelTiles(['..', '..'], {}),
  ...midground(
    [
      '...kkkkk......................ggg........kkkkkkkkkk..ggg....',
      '...kwWwk.........kkkk........gGGGg.......kwWwkkwWwk.gGGGg...',
      '...kWwWk........kKKKKk.........g.........kWwWkkWwWk...g.....',
      '...kkkkk.........kkkk..........g.........kkkkkkkkkk...g.....',
    ],
    { k: 16, w: 130, W: 94, g: 250, G: 244, K: 240 },
  ),
  base: pixelTiles(['wwwWwwwg', 'kkkkkkkk'], { w: 130, W: 94, g: 250, k: 16 }),
  sprites: {
    ...foe('goomba', ROCKY, { k: 238, w: 231, s: 137 }),
    ...foe('victim', ROCKY, { k: 238, w: 231, s: 137 }),
    flat: pixelSprite([['kkkk', 'ssss']], { k: 238, s: 137 }),
    boss: pixelSprite(
      [
        ['.bb.', 'kyy.', 'gwgy', 'y.y.'],
        ['.bb.', 'kyy.', 'gwgy', '.yy.'],
      ],
      { b: 33, k: 16, y: 222, g: 34, w: 231 },
    ),
    wand: pixelSprite([['..o', '.r.', 'r..', '...']], { o: 226, r: 160 }),
    thanks: label('THANK YOU!', {}),
    points100: { glyphs: ['100'], color: WHITE },
    points200: { glyphs: ['200'], color: WHITE },
    bonus: { glyphs: ['400'], color: WHITE },
  },
  cast: {
    box: [[0]],
    boss: [[38, 'boss', 45, -2], [60, 'spin', 3, 3], [64]],
    wand: [[61, 'wand', 6, -1, 'sky'], [62, 'wand', 5, -1], [63]],
    text: [[64, 'thanks', -5, 0, 'backdrop']],
  },
}

const STOMPED = [[0, 'goomba', 32, -2], [16, 'goomba', 0, -1], [17, 'flat', -1, -1], [19], [66, 'goomba', 44, -2]]
const FLIGHT = {
  player: [[8, 'fly', 0, 0, 'sky'], [17, 'jump', 0, 0, 'sky']],
  goomba: STOMPED,
  score: [[17, 'points100', 6, 0, 'backdrop'], [19]],
}
const HOP = {
  player: [[8, 'jump', 0, 0, 'sky'], [12, 'run', 0], [14, 'jump', 0, 0, 'sky']],
  goomba: STOMPED,
  score: [[17, 'points100', 6, 0, 'backdrop'], [19]],
}
const THROW = {
  player: [[8, 'jump', 0, 0, 'sky'], [12, 'kick', 0], [13, 'run', 0]],
  goomba: [[0, 'goomba', 32, -2], [13, 'goombaFlip', 7, 0], [15, 'goombaFlip', 7, -1, 'base'], [16], [66, 'goomba', 44, -2]],
  score: [[13, 'points100', 8, 0, 'backdrop'], [15]],
  shot: [[12, 'shot', 5, 0], [13]],
}

const LATER = [
  [18, 'run', 0],
  [30, 'jump', 0, 0, 'sky'],
  [33, 'jump', -2, 0, 'sky'],
  [34, 'kick', -5],
  [35, 'run', -5, 1],
  [40, 'run', 0],
  [59, 'jump', 0, 0, 'sky'],
  [61, 'run', 0],
]

// The P-meter fills one arrow a frame, blinks while Mario flies and drains after he lands.
const METER = [
  ...Array.from({ length: 7 }, (_, arrows) => [arrows, `${'►'.repeat(arrows)}${'▻'.repeat(6 - arrows)} P`]),
  ...Array.from({ length: 10 }, (_, step) => [7 + step, step % 2 ? '►►►►►► P' : '►►►►►►  ']),
  ...Array.from({ length: 6 }, (_, step) => [17 + step, `${'►'.repeat(5 - step)}${'▻'.repeat(step + 1)} P`]),
]

export default {
  id: 'mario-3',
  loop: 72,
  idleText: ' PAUSE ',
  clock: 300,
  // Deals a brother, a suit, a stage, the world, the enemies, the cards, the coins and the lives.
  vary: (pick, game) => {
    const [name, initial, cap] = pick(
      [
        ['MARIO', 'M', 196],
        ['LUIGI', 'L', 40],
      ],
      0,
    )
    // The suits: Super, Fire, Raccoon, Tanooki, Frog and Hammer.
    const [moves, approach, shot] = pick(
      [
        [hero({ c: cap, s: 223, o: 27, h: 94 }), HOP],
        [hero({ c: 231, s: 223, o: cap, h: 94 }), THROW, game.sprites.shot],
        [hero({ c: cap, s: 223, o: 27, h: 94, e: 94, t: 172, T: 94 }), FLIGHT],
        [hero({ c: 130, s: 223, o: 130, h: 94, e: 94, t: 137, T: 94 }), FLIGHT],
        [hero({ c: 34, s: 223, o: 34, h: 22 }), HOP],
        [hero({ c: 238, s: 223, o: 231, h: 16 }), THROW, { glyphs: ['Ͳ'], color: ink(242) }],
      ],
      1,
    )
    // The shell's victim: a Spiny, a Buzzy Beetle, a Hammer Bro or a red Koopa.
    const victim = pick(
      [
        foe('victim', [['r.r.', 'rrrr', 'wrrr', '.y.y']], { r: 196, w: 231, y: 222 }),
        foe('victim', [['.bb.', 'bBbb', 'wbbb', '.k.k']], { b: 25, B: 39, w: 231, k: 16 }),
        foe('victim', [['.gg.', 'gss.', 'wwws', 'y.y.']], { g: 34, s: 223, w: 231, y: 222 }),
        foe('victim', [['y...', 'yrwr', 'wrrr', '.y.y']], { r: 160, w: 231, y: 222 }),
      ],
      5,
    )
    const { world = 1, sprites: stageSprites = {}, cast: stageCast = {}, ...stage } = pick([grass, desert, airship], 7)
    // The dark airship sky needs white HUD text.
    const hud = stage.stars ? WHITE : BLACK
    const fleet = pick([1, 2, 3, 5, 6, 7, 8], 6)
    const level = pick([1, 2, 3, 4, 5, 6], 2)
    const course = stage.stars ? `WORLD ${fleet}` : `WORLD ${world}-${level}`
    const coins = pick(Array.from({ length: 100 }, (_, count) => count), 3)
    const lives = pick([1, 2, 3, 4, 5], 12)
    const purse = [0, 9, 10, 11].map((start, gained) => [
      start,
      `${initial}×${lives} $${String((coins + gained) % 100).padStart(2, '0')}`,
    ])
    const [first, second] = [CARDS[pick([0, 1, 2], 9)], CARDS[pick([0, 1, 2], 10)]]
    const held = `[${first[0]}][${second[0]}]`
    const { glyph, code, sprites } = pick([roulette(0), roulette(1), roulette(2)], 11)
    const won = stage.stars ? `${held}[ ]` : `${held}[${glyph}]`
    // The HUD cards keep their own colors.
    const cardInks = [WHITE, ink(first[1]), WHITE, WHITE, ink(second[1]), WHITE, WHITE, ink(code), WHITE]
    return {
      ...stage,
      scoreboard: { ...game.scoreboard, left: `${name} {score}` },
      topCaption: {
        left: [[...purse, [62, '']], hud],
        center: [[[0, course], [3, '']], hud],
      },
      caption: { ...game.caption, right: [[[0, `${held}[ ]`], [66, won]], WHITE, cardInks] },
      sprites: {
        ...game.sprites,
        ...moves,
        ...sprites,
        ...victim,
        shot: shot ?? game.sprites.shot,
        goomba: pick([game.sprites.goomba, PARA_GOOMBA], 4),
        ...stageSprites,
      },
      cast: { ...game.cast, ...approach, player: [[0, 'run', 0], ...approach.player, ...LATER], ...stageCast },
    }
  },
  scoreboard: { left: 'MARIO {score}', right: 'TIME {time}', ink: WHITE },
  logo: [['SUPER MARIO BROS ', ink(214)], ['3', ink(196)]],
  border: COLOR.yellow,
  speeds: [0.5, 1, 1, 1],
  ...grass,
  topCaption: {
    left: [[[0, 'M×4 $07'], [9, 'M×4 $08'], [10, 'M×4 $09'], [11, 'M×4 $10'], [62, '']], BLACK],
    center: [[[0, 'WORLD 1-1'], [3, '']], BLACK],
  },
  caption: {
    left: [METER, WHITE],
    right: [[[0, '[◓][⊛][ ]'], [66, '[◓][⊛][*]']], WHITE, [WHITE, ink(196), WHITE, WHITE, ink(208), WHITE, WHITE, ink(226), WHITE]],
  },
  icons: { fiveHour: 'goomba', sevenDay: 'koopa' },
  sprites: {
    ...hero({ c: 196, s: 223, o: 27, h: 94, e: 94, t: 172, T: 94 }),
    ...roulette(2).sprites,
    ...foe(
      'goomba',
      [
        ['.hh.', 'hwwh', '.tt.', 'kk.k'],
        ['.hh.', 'hwwh', '.tt.', 'k.kk'],
      ],
      GOOMBA,
    ),
    ...foe('victim', [['r.r.', 'rrrr', 'wrrr', '.y.y']], { r: 196, w: 231, y: 222 }),
    flat: pixelSprite([['hhhh', 'kkkk']], GOOMBA),
    koopa: pixelSprite(
      [
        ['y...', 'ygwg', 'wggg', '.y.y'],
        ['y...', 'ygwg', 'wggg', '.yy.'],
      ],
      { g: 34, w: 231, y: 222 },
    ),
    shell: pixelSprite([['ggg', 'www']], { g: 34, w: 231 }),
    spin: pixelSprite([['ggg', 'www'], ['gwg', 'wgw']], { g: 34, w: 231 }),
    shot: { glyphs: ['●'], color: [ink(208), ink(226)] },
    coin: { glyphs: ['◎', '○', '|', '○'], color: COIN },
    points100: { glyphs: ['100'], color: BLACK },
    points200: { glyphs: ['200'], color: BLACK },
    bonus: { glyphs: ['400'], color: BLACK },
    zone: { glyphs: [[1, 2, 3].map(() => OPAQUE.repeat(64)).join('\n')], background: STAGE },
    box: sprite(['▐0▌', '▐1▌', '▐2▌'], {
      '▐': ['▐', WHITE, STAGE],
      '▌': ['▌', WHITE, STAGE],
      ...Object.fromEntries(CARDS.map(([glyph, code], card) => [card, [glyph, ink(code), STAGE]])),
    }),
    clear: label('COURSE CLEAR!', {}),
  },
  // Mario flies through three coins, drops on a Goomba and kicks a Koopa's shell into the next enemy.
  // In the dark goal area he hits the roulette box, and the HUD adds its card.
  cast: {
    coin: [[0, 'coin', 13, -1, 'backdrop'], [9], [42, 'coin', 43, -1, 'backdrop']],
    coinTwo: [[0, 'coin', 14, -1, 'backdrop'], [10], [43, 'coin', 43, -1, 'backdrop']],
    coinThree: [[0, 'coin', 15, -1, 'backdrop'], [11], [44, 'coin', 43, -1, 'backdrop']],
    goomba: STOMPED,
    koopa: [[11, 'koopa', 43, -2], [32, 'shell', 2, -1], [35, 'spin', 4, 3], [40]],
    victim: [[21, 'victim', 42, -2], [37, 'victimFlip', 10, 0], [39, 'victimFlip', 10, -1, 'base'], [40]],
    zone: [[14, 'zone', 43, -1]],
    boss: [[0]],
    wand: [[0]],
    shot: [[0]],
    score: FLIGHT.score,
    points: [[32, 'points200', 5, 0, 'backdrop'], [34], [37, 'bonus', 9, 0, 'backdrop'], [39]],
    text: [[62, 'clear', -6, 0, 'backdrop'], [66, 'gotCard', -9, 0, 'backdrop']],
    player: [[0, 'run', 0], ...FLIGHT.player, ...LATER],
    // The box track is last, so the box draws over Mario's head when he hits it.
    box: [[14, 'box', 46, -1, 'backdrop'], [60, 'won', 0, -1, 'backdrop'], [61]],
  },
}
