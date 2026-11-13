import { COLOR, ink, paper, pixelRows, pixelSprite, pixelTiles } from '../art.js'

const WHITE = ink(231)

// The monsters face right. Pixel x is the punch flash.
const MONSTERS = [
  {
    name: 'GEORGE',
    color: 172,
    palette: { b: 130, l: 223, m: 52, x: 231 },
    stand: [
      ['..bb.', '.bblb', 'bbbb.', '.b.b.'],
      ['..bb.', '.bblb', 'bbbb.', 'b..b.'],
    ],
    climb: [
      ['..bbb', '.bblb', '.bbb.', '.b.b.'],
      ['..bb.', '.bbl.', '.bbbb', 'b..bb'],
    ],
    punch: ['..bb..', '.bbl..', '.bbblx', '.b.bbx'],
    roar: [
      ['b.b.b', 'bbmbb', '.bbb.', '.b.b.'],
      ['b.b.b', 'bblbb', '.bbbb', 'b...b'],
    ],
  },
  {
    name: 'LIZZIE',
    color: 40,
    palette: { g: 34, y: 186, m: 52, x: 231 },
    stand: [
      ['...gg', '..gy.', '.ggy.', 'gg.g.'],
      ['...gg', '..gy.', '.ggy.', 'g.g..'],
    ],
    climb: [
      ['...gg', '..gyg', '.ggy.', 'gg.g.'],
      ['...gg', '..gyg', '.ggyg', 'g.g.g'],
    ],
    punch: ['...gg.', '..gyg.', '.ggygx', 'gg.ggx'],
    roar: [
      ['....g', '..gmg', '.ggy.', 'gg.g.'],
      ['...gg', '..gyg', '.ggy.', 'g.g..'],
    ],
  },
  {
    name: 'RALPH',
    color: 250,
    palette: { w: 250, l: 255, d: 241, m: 52, x: 231 },
    stand: [
      ['..w.w', '..wwl', '.www.', 'dw.w.'],
      ['..w.w', '..wwl', '.www.', 'd.w..'],
    ],
    climb: [
      ['..w.w', '..wwl', '.wwww', 'dw.ww'],
      ['..w.w', '..wwl', '.www.', 'd.ww.'],
    ],
    punch: ['..w.w.', '..wwl.', '.wwwwx', 'dw.wwx'],
    roar: [
      ['...wl', '.wwww', '.www.', 'dw.w.'],
      ['..w.w', '..wwl', '.www.', 'd.w..'],
    ],
  },
].map(({ name, color, palette, stand, climb, punch, roar }) => ({
  name,
  color: ink(color),
  sprites: {
    stand: pixelSprite(stand, palette),
    climb: pixelSprite(climb, palette),
    punch: pixelSprite([punch], palette),
    swat: pixelSprite([punch.map((row) => [...row].reverse().join(''))], palette),
    roar: pixelSprite(roar, palette),
    hit: pixelSprite([climb[0]], Object.fromEntries(Object.keys(palette).map((key) => [key, 231]))),
    rival: pixelSprite([climb[0], climb[0], punch, climb[1]], palette),
  },
}))

// The dust cloud spreads into the clear sides. The clear last row shows the street.
const CLEAR = '...........'
const TOWER = ['..rrrrrrr..', '..twtwtwt..', '..ttttttt..', '..twtwtwt..', '..ttttttt..', '..twtwtwt..', '..tttdttt..', CLEAR]
const HOLED = ['..rrrrrrr..', '..twtwtwt..', '..ttttttt..', '..twtwtwt..', '..tkttttt..', '..tktwtwt..', '..tttdttt..', CLEAR]
const BURNING = [
  ['..rrrrrrr..', '..twtwtwt..', '..tkctttt..', '..tkcwtwt..', '..tfttctt..', '..tFtwcwt..', '..tttdttt..', CLEAR],
  ['..rrrrrrr..', '..twtwtwt..', '..tkctttt..', '..tkcwtwt..', '..tFttctt..', '..tftwcwt..', '..tttdttt..', CLEAR],
]
const WRECKED = [
  ['..rrkrrrr..', '..tktwtwt..', '..tfctttt..', '..tFcwtwt..', '..tFfcttt..', '..tfFwcwt..', '..tttdctt..', CLEAR],
  ['..rrkrrrr..', '..tktwtwt..', '..tFctttt..', '..tfcwtwt..', '..tfFcttt..', '..tFfwcwt..', '..tttdctt..', CLEAR],
]
// The tower sinks one pixel each frame behind a dust cloud.
const DUST = [
  ['...ddddd...', '.dddDDdddd.'],
  ['....ddd....', '..ddDDddd..', '.dDDddDDdd.'],
  ['..dd.dDd...', '.ddDDddDDd.', 'dDDddDDdddd'],
  ['.ddd.ddDd..', 'dDDddDDdddd', 'ddddDDdddDd'],
  ['dDd.ddd.dDd', 'ddDDddDDddd', 'dDDddddDDdd'],
  ['.dd..d..dd.', 'dDDddDddDDd', 'ddddDDdddDd'],
  ['..d.....d..', '.dDdddDdd..', 'ddDddDDdddd'],
]
const SINKING = DUST.map((dust, step) => {
  const ruin = Array.from({ length: 5 }, (_, line) => (line <= step ? CLEAR : WRECKED[step % 2][line - step - 1]))
  return [...ruin.slice(0, 7 - dust.length), ...dust, CLEAR]
})
const PILE = ['...rRkRr...', '..RkRRwRk..']
const SETTLING = [
  [CLEAR, CLEAR, CLEAR, '.d..d.d..d.', 'd.dDd.dDd.d', ...PILE, CLEAR],
  [CLEAR, CLEAR, CLEAR, CLEAR, '..d.D..d...', ...PILE, CLEAR],
  [CLEAR, CLEAR, CLEAR, CLEAR, '....d......', ...PILE, CLEAR],
]

// The day palette has no moon color, so the moon shows only at night.
const TIMES = [
  {
    screen: paper(74),
    sky: { c: 255, s: 67, w: 110, p: 247, a: 238, y: 178 },
    tower: { r: 137, t: 180, w: 24, d: 52, k: 16, c: 95, f: 208, F: 220 },
    rivalTower: { r: 60, t: 146, w: 17, d: 52, k: 16 },
  },
  {
    screen: paper(17),
    stars: true,
    sky: { o: 230, s: 236, w: 136, p: 242, a: 235, y: 178 },
    tower: { r: 239, t: 95, w: 228, d: 52, k: 16, c: 52, f: 208, F: 220 },
    rivalTower: { r: 59, t: 60, w: 222, d: 52, k: 16 },
  },
].map(({ screen, stars, sky, tower, rivalTower }) => {
  const [backdrop, skyRow, ahead] = pixelRows(
    [
      '...cccc..............................................................',
      '.cccccccc.....................................cccc...................',
      '.........ss.................sss...........................ss.........',
      '..ss.....ss.......ss........sss.............ss............ssss.......',
      '.ssss...swss.....ssss......ssss.......ss...ssss...........ssss....ss.',
      '.ssss..sssss....sssss......ssws......ssss..ssss..........sssss...sss.',
    ],
    sky,
  )
  const debris = { ...tower, d: 230, D: 187, R: tower.t }
  return {
    screen,
    stars,
    backdrop,
    sky: skyRow,
    ahead,
    base: pixelTiles(['pppppppp', 'aaaayyaa'], sky),
    setPieces: {
      moon: pixelSprite([['.oo.', 'oooo', '.oo.', '....']], sky),
      tower: pixelSprite([TOWER], tower),
      holed: pixelSprite([HOLED], tower),
      burning: pixelSprite(BURNING, tower),
      wrecked: pixelSprite(WRECKED, tower),
      shaking: pixelSprite([WRECKED[0], WRECKED[1].map((row) => `.${row.slice(0, 10)}`)], tower),
      sinking: pixelSprite(SINKING, debris),
      settling: pixelSprite(SETTLING, debris),
      rubble: pixelSprite([SETTLING[2].map((row, line) => (line === 4 ? CLEAR : row))], debris),
      rivalTower: pixelSprite([['rrrrrrr', 'twtwtwt', 'tkttktt', 'tktwkwt', 'tttdttt', '.......']], rivalTower),
    },
  }
})

const FOODS = [
  { glyphs: pixelSprite([['s', 'r']], { s: 223, r: 196 }), scream: 'HELP!' },
  { glyphs: pixelSprite([['w', 'b']], { w: 231, b: 172 }), scream: '' },
  { glyphs: pixelSprite([['b', 'w']], { w: 231, b: 33 }), scream: '' },
]
const CITIES = ['PEORIA', 'CHICAGO', 'DETROIT', 'TOLEDO', 'MILWAUKEE', 'DALLAS', 'NEW YORK', 'LAS VEGAS']

export default {
  id: 'rampage',
  loop: 64,
  // Deals the monster, the rival, the city, day or night, and the food.
  vary: (pick, game) => {
    const hero = pick(MONSTERS, 0)
    const rival = pick(
      MONSTERS.filter(({ name }) => name !== hero.name),
      1,
    )
    const city = pick([0, 1, 2, 3, 4, 5, 6, 7], 2)
    const { setPieces, ...time } = pick(TIMES, 3)
    const food = pick(FOODS, 4)
    return {
      ...time,
      scoreboard: { ...game.scoreboard, left: `${hero.name} {score}`, right: `${rival.name} {hi}` },
      banner: [[[0, `DAY ${city + 1} ${CITIES[city]}`], [4, '']], WHITE],
      topCaption: { left: [game.topCaption.left[0], hero.color], right: [game.topCaption.right[0], rival.color] },
      sprites: {
        ...game.sprites,
        ...hero.sprites,
        ...setPieces,
        rival: rival.sprites.rival,
        food: food.glyphs,
        scream: { glyphs: [food.scream], color: WHITE },
      },
    }
  },
  scoreboard: { left: 'GEORGE {score}', right: 'LIZZIE {hi}', ink: ink(214) },
  logo: [['RAMPAGE', ink(196)]],
  border: COLOR.orange,
  speeds: [0, 0, 0, 0],
  ...TIMES[0],
  banner: [[[0, 'DAY 1 PEORIA'], [4, '']], WHITE],
  topCaption: {
    left: [[[0, '▬▬▬▬'], [18, '▬▬▬▬▬▬'], [27, '▬▬▬▬▬'], [30, '▬▬▬▬']], MONSTERS[0].color],
    right: ['▬▬▬▬▬', MONSTERS[1].color],
  },
  icons: { fiveHour: 'heli', sevenDay: 'rival' },
  sprites: {
    ...MONSTERS[0].sprites,
    ...TIMES[0].setPieces,
    rival: MONSTERS[1].sprites.rival,
    food: FOODS[0].glyphs,
    scream: { glyphs: ['HELP!'], color: WHITE },
    heli: pixelSprite(
      [
        ['.RRRRR', '...b..', 'tbbbbw', '..k.k.'],
        ['...R..', '...b..', 'tbbbbw', '..k.k.'],
      ],
      { R: 252, b: 64, t: 64, w: 117, k: 16 },
    ),
    shot: { glyphs: ['··'], color: ink(226) },
    boom: pixelSprite(
      [
        ['..y..', '.yoy.', 'yoroy', '.yoy.'],
        ['o.y.o', '.ror.', 'yr.ry', 'o.r.o'],
      ],
      { y: 226, o: 208, r: 196 },
    ),
    wreck: pixelSprite([['s..', '.s.', 'ggg', '.k.']], { g: 64, s: 240, k: 16 }),
    fire: pixelSprite([['o.', 'yo'], ['.o', 'oy']], { y: 226, o: 208 }),
    points200: { glyphs: ['200'], color: WHITE },
    points500: { glyphs: ['500'], color: WHITE },
    points1000: { glyphs: ['1000'], color: WHITE },
  },
  // The monster punches holes in the tower, eats a person for 200 and swats the shooting helicopter for 500.
  // The tower sinks for 1000.
  cast: {
    moon: [[0, 'moon', 13, 0, 'sky']],
    rivalTower: [[0, 'rivalTower', 20, 0, 'base']],
    rival: [[0, 'rival', 16, 0, 'ground']],
    tower: [
      [0, 'tower', -3, 0, 'base'],
      [6, 'holed', -3, 0, 'base'],
      [9, 'burning', -3, 0, 'base'],
      [22, 'wrecked', -3, 0, 'base'],
      [37, 'shaking', -3, 0, 'base'],
      [40, 'sinking', -3, 0, 'base'],
      [47, 'settling', -3, 0, 'base'],
      [50, 'rubble', -3, 0, 'base'],
    ],
    heli: [[8, 'heli', -47, 2, 'sky'], [25, 'heli', -13, 0, 'sky'], [31, 'heli', -13, 1, 'sky'], [33]],
    shot: [[26, 'shot', -7, 0, 'sky'], [27], [29, 'shot', -7, 0, 'sky'], [30]],
    boom: [[33, 'boom', -12, 0, 'sky'], [35]],
    wreck: [[35, 'wreck', -11, 0, 'ground'], [36, 'wreck', -11, 0, 'base'], [37, 'fire', -11, 0, 'base'], [39]],
    player: [
      [0, 'stand', -9, 0, 'base'],
      [2, 'stand', -9, 1, 'base'],
      [4, 'climb', -5, 0, 'base'],
      [5, 'climb', -5, 0, 'ground'],
      [6, 'punch', -5, 0, 'ground'],
      [7, 'climb', -5, 0, 'ground'],
      [8, 'climb', -5, 0, 'sky'],
      [9, 'punch', -5, 0, 'sky'],
      [10, 'climb', -5, 0, 'sky'],
      [16, 'punch', -5, 0, 'sky'],
      [17, 'climb', -5, 0, 'sky'],
      [18, 'roar', -5, 0, 'sky'],
      [20, 'climb', -5, 0, 'sky'],
      [21, 'climb', -5, 0, 'ground'],
      [22, 'punch', -5, 0, 'ground'],
      [23, 'climb', -5, 0, 'ground'],
      [24, 'climb', -5, 0, 'sky'],
      [27, 'hit', -5, 0, 'sky'],
      [28, 'climb', -5, 0, 'sky'],
      [30, 'hit', -5, 0, 'sky'],
      [31, 'climb', -5, 0, 'sky'],
      [32, 'swat', -7, 0, 'sky'],
      [33, 'climb', -5, 0, 'sky'],
      [39, 'climb', -8, 0, 'ground'],
      [40, 'stand', -9, 0, 'base'],
      [50, 'roar', -9, 0, 'base'],
      [60, 'stand', -9, 0, 'base'],
    ],
    food: [[12, 'food', 0, 0, 'sky'], [17, 'food', -2, 0, 'sky'], [18]],
    scream: [[12, 'scream', 6, 0, 'sky'], [16]],
    points: [
      [18, 'points200', 6, 0, 'sky'],
      [19, 'points200', 6, 0, 'backdrop'],
      [21],
      [33, 'points500', -7, 0, 'backdrop'],
      [36],
      [47, 'points1000', -1, 0, 'sky'],
      [48, 'points1000', -1, 0, 'backdrop'],
      [51],
    ],
  },
}
