import { COLOR, ink, paper, pixelSprite, pixelTiles, tiles } from '../art.js'

const WHITE = ink(231)
const LIME = ink(46)
const PINK = ink(213)
const STAR = ink(226)
const LOOP = 44

// Opponent poses are eight pixels wide and face left, so one x keeps the boxer in place. e is the forehead.
const NORMAL = {
  stand: [
    ['....eh..', '...gfh..', '..ggbbb.', '....bbg.', '....tt..', '...l..l.'],
    ['....eh..', '..ggfh..', '..g.bbb.', '....bbg.', '....tt..', '...l..l.'],
  ],
  block: [['....eh..', '...ggh..', '...ggbb.', '....bbg.', '....tt..', '...l..l.']],
  tell: [
    ['....ehgg', '...gfhgg', '..ggbbb.', '....bb..', '....tt..', '...l..l.'],
    ['....WWWW', '...WWWWW', '..WWWWW.', '....WW..', '....WW..', '...W..W.'],
  ],
  punch: [['....eh..', 'gg.bfh..', 'ggbbbbb.', '....bbg.', '....tt..', '...l..l.']],
  hit: [
    ['.....eh.', '....gfh.', '...gbbbg', '....bb..', '....tt..', '...l..l.'],
    ['....eh..', '...gfh..', '..ggbbb.', '....bbg.', '....tt..', '...l..l.'],
  ],
  reel: [['......eh', '..g..bfh', '..g.bbb.', '....bbgg', '....tt..', '..l...l.']],
  down: [
    ['....g.g.', 'lltbbbfh'],
    ['.....g.g', 'lltbbbfh'],
  ],
  rise: [['....eh..', '...gfh..', '..ggbbg.', '...lttl.']],
  icon: [['ghg', 'gfg']],
}

const BIG = {
  stand: [
    ['....hh..', '...gff..', '..ggbbbb', '...bbbbg', '...bttt.', '...l..l.'],
    ['....hh..', '..ggff..', '..g.bbbb', '...bbbbg', '...bttt.', '...l..l.'],
  ],
  block: [['....hh..', '...ggf..', '...ggbbb', '...bbbbg', '...bttt.', '...l..l.']],
  tell: [
    ['....hhgg', '...gffgg', '..ggbbbb', '...bbbb.', '...bttt.', '...l..l.'],
    ['....WWWW', '...WWWWW', '..WWWWWW', '...WWWW.', '...WWWW.', '...W..W.'],
  ],
  punch: [['....hh..', 'gg.bff..', 'ggbbbbbb', '...bbbbg', '...bttt.', '...l..l.']],
  hit: [
    ['.....hh.', '....gff.', '...gbbbb', '...bbbbg', '...bttt.', '...l..l.'],
    ['....hh..', '...gff..', '..ggbbbb', '...bbbbg', '...bttt.', '...l..l.'],
  ],
  reel: [['......hh', '..g..bff', '..g.bbbb', '...bbbgg', '...bttt.', '..l...l.']],
  down: [
    ['...bbg.g', 'lltbbbfh'],
    ['...bb.gg', 'lltbbbfh'],
  ],
  rise: [['....hh..', '...gff..', '..ggbbbb', '..lbttl.']],
  icon: [['ghg', 'gfg']],
}

const boxer = (shape, palette) => {
  const colors = { W: 231, ...palette }
  return {
    stand: pixelSprite(shape.stand, colors),
    block: pixelSprite(shape.block, colors),
    tell: pixelSprite(shape.tell, colors),
    punch: pixelSprite(shape.punch, colors),
    hit: pixelSprite(shape.hit, colors),
    reel: pixelSprite(shape.reel, colors),
    down: pixelSprite(shape.down, colors),
    rise: pixelSprite(shape.rise, colors),
    icon: pixelSprite(shape.icon, colors),
  }
}

const SKIN = 223
const TAN = 180
const BROWN = 137
const DARK = 94
const GLOVE = 160
const BLACK_HAIR = 238

const ROSTER = [
  ['GLASS JOE', PINK, boxer(NORMAL, { h: 94, e: 94, f: SKIN, b: SKIN, t: 205, g: GLOVE, l: SKIN })],
  ['VON KAISER', ink(214), boxer(NORMAL, { h: 137, e: 137, f: SKIN, b: SKIN, t: 214, g: GLOVE, l: SKIN })],
  ['PISTON HONDA', WHITE, boxer(NORMAL, { h: BLACK_HAIR, e: 231, f: TAN, b: TAN, t: 255, g: GLOVE, l: TAN })],
  ['DON FLAMENCO', ink(161), boxer(NORMAL, { h: BLACK_HAIR, e: BLACK_HAIR, f: TAN, b: TAN, t: 161, g: GLOVE, l: TAN })],
  ['KING HIPPO', ink(250), boxer(BIG, { h: 220, f: SKIN, b: SKIN, t: 250, g: GLOVE, l: SKIN })],
  ['GREAT TIGER', ink(129), boxer(NORMAL, { h: 129, e: 226, f: BROWN, b: BROWN, t: 129, g: 220, l: BROWN })],
  ['BALD BULL', ink(208), boxer(NORMAL, { h: TAN, e: TAN, f: TAN, b: TAN, t: 208, g: GLOVE, l: TAN })],
  ['SODA POPINSKI', ink(196), boxer(NORMAL, { h: SKIN, e: SKIN, f: SKIN, b: SKIN, t: 196, g: 130, l: SKIN })],
  ['MR. SANDMAN', ink(33), boxer(NORMAL, { h: BLACK_HAIR, e: BLACK_HAIR, f: DARK, b: DARK, t: 33, g: GLOVE, l: DARK })],
  ['SUPER MACHO MAN', ink(51), boxer(NORMAL, { h: 222, e: 222, f: 173, b: 173, t: 45, g: GLOVE, l: 173 })],
  ['MR. DREAM', ink(223), boxer(NORMAL, { h: BLACK_HAIR, e: BLACK_HAIR, f: DARK, b: DARK, t: 16, g: GLOVE, l: DARK })],
]

const MAC = { k: 16, s: 223, g: 40, G: 34, W: 231 }
const REF = { h: 94, s: 223, m: 16, w: 231, k: 16 }

const healthTrack = [
  [0, 6],
  [11, 5],
  [13, 4],
  [15, 3],
  [20, 0],
  [30, 2],
  [32, 4],
  [34, 5],
  [37, 6],
].map(([t, notches]) => [t, '▬'.repeat(notches).padStart(6)])

export default {
  id: 'punch-out',
  loop: LOOP,
  idleText: ' PAUSE ',
  // Deals the opponent, the next contender, the hearts, the stars, the clock's minute and Doc Louis's tip.
  vary: (pick, game) => {
    const [name, opponentInk, poses] = pick(ROSTER, 0)
    const [, , contender] = pick(
      ROSTER.filter(([other]) => other !== name),
      1,
    )
    const stars = pick([0, 1, 2, 3], 2)
    const hearts = pick([3, 5, 10, 15, 20], 4)
    const minute = pick([0, 1, 2], 5)
    // The clock stops while the opponent is down.
    const clock = Array.from({ length: LOOP }, (_, t) => {
      const seconds = 7 + t - Math.min(Math.max(t - 23, 0), 14)
      return [t, `${minute}:${String(seconds).padStart(2, '0')}`]
    })
    const tip = pick(['PUT HIM AWAY, MAC!', 'STICK AND MOVE!', 'KEEP YOUR GUARD UP!', 'JOIN THE NINTENDO FAN CLUB!'], 3)
    return {
      scoreboard: { ...game.scoreboard, right: name },
      topCaption: {
        ...game.topCaption,
        right: [healthTrack, opponentInk],
        center: [
          [
            [0, ''],
            [23, tip],
            [29, ''],
          ],
          WHITE,
        ],
      },
      caption: {
        left: [
          [
            [0, `ღ${hearts} ⋆${stars}`],
            [3, `ღ${hearts - 1} ⋆${stars}`],
            [16, `ღ${hearts - 1} ⋆${stars + 1}`],
            [20, `ღ${hearts - 1} ⋆${stars}`],
            [37, `ღ${hearts} ⋆${stars}`],
          ],
          PINK,
        ],
        right: [clock, WHITE],
      },
      sprites: { ...game.sprites, ...poses, contender: contender.icon },
    }
  },
  scoreboard: { left: 'LITTLE MAC {score}', right: 'GLASS JOE', ink: LIME },
  logo: [
    ['PUNCH-OUT', ink(33)],
    ['!!', ink(196)],
  ],
  border: COLOR.cyan,
  speeds: [0, 0, 0, 0],
  // The backdrop is the crowd with camera flashes. The sky row's top edge is the rope.
  screen: [paper(16), paper(103), paper(103), paper(18)],
  backdrop: tiles(' a  A b F  c B  a A  F b  c  B a ', {
    a: ['▄', ink(239)],
    b: ['▄', ink(60)],
    c: ['▄', ink(95)],
    A: ['▀', ink(237)],
    B: ['▀', ink(236)],
    F: ['▄▄▄▄▄▄▄▄▄▄▄*', [...Array(11).fill(ink(240)), WHITE]],
  }),
  sky: pixelTiles(['r', '.'], { r: 252 }),
  ahead: tiles(' ', {}),
  base: tiles(' ', {}),
  flash: [
    [20, { ink: WHITE }],
    [22, undefined],
  ],
  banner: [
    [
      [0, ''],
      [38, 'FIGHT!'],
      [40, ''],
    ],
    WHITE,
  ],
  topCaption: { left: ['▬▬▬▬▬▬', LIME], right: [healthTrack, PINK] },
  caption: { left: ['ღ20 ⋆1', PINK], right: ['0:07', WHITE] },
  icons: { fiveHour: 'icon', sevenDay: 'contender' },
  sprites: {
    ...ROSTER[0][2],
    contender: ROSTER[1][2].icon,
    mac: pixelSprite(
      [
        ['.kk..', '.ksg.', '.GGg.', '.k.k.'],
        ['.kk..', '.ksg.', '.GGg.', 'k..k.'],
      ],
      MAC,
    ),
    jabs: pixelSprite(
      [
        ['.kk..', '.ksgg', '.GG..', '.k.k.'],
        ['.kk..', '.ksg.', '.GGg.', '.k.k.'],
      ],
      MAC,
    ),
    duck: pixelSprite([['.kkg.', 'kGGk.']], MAC),
    crouch: pixelSprite(
      [
        ['.....', '.kkg.', '.GGg.', 'kk.kk'],
        ['.....', '.WWW.', '.WWW.', 'WW.WW'],
      ],
      MAC,
    ),
    upper: pixelSprite([['...gg', '...s.', '.kks.', '.ksG.', '.GG..', 'k..k.']], MAC),
    mario: pixelSprite(
      [
        ['.hh.', 'msh.', '.ww.', 'k.k.'],
        ['.hh.', 'msh.', '.ww.', 'k..k'],
      ],
      REF,
    ),
    counting: pixelSprite(
      [
        ['s.hh', 'wmsh', '..ww', '.k.k'],
        ['..hh', '.msh', '.sww', '.k.k'],
      ],
      REF,
    ),
    spark: { glyphs: ['*', ' '], color: WHITE },
    burst: pixelSprite(
      [
        ['y..y', '.oo.', '.oo.', 'y..y'],
        ['.W..', 'W..W', '....', '..W.'],
      ],
      { y: 226, o: 208, W: 231 },
    ),
    star: { glyphs: ['⋆'], color: STAR },
    one: { glyphs: ['1'], color: WHITE },
    two: { glyphs: ['2'], color: WHITE },
    three: { glyphs: ['3'], color: WHITE },
    apron: { glyphs: ['WVBA'], color: WHITE },
  },
  // A blocked jab costs Mac a heart. The opponent flashes his tell and swings, and Mac ducks.
  // Three jabs earn a star, and the star uppercut knocks the opponent down.
  // Doc Louis shouts a tip, Mario counts to three, and the fight restarts.
  cast: {
    apron: [[0, 'apron', -2, 0, 'base']],
    // Mario stays right of the opponent, so he never walks through Mac.
    ref: [
      [0, 'mario', 13],
      [23, 'mario', 13, -1],
      [26, 'mario', 10],
      [30, 'counting', 9],
      [36, 'mario', 10, 1],
      [39, 'mario', 13],
    ],
    opponent: [
      [0, 'stand', -1],
      [3, 'block', -1],
      [4, 'stand', -1],
      [6, 'tell', -1],
      [8, 'punch', -3],
      [10, 'stand', -1],
      [11, 'hit', -1],
      [17, 'stand', -1],
      [20, 'hit', -1],
      [21, 'reel', 0, 1],
      [23, 'down', 2],
      [36, 'rise', 2],
      [37, 'stand', 2],
      [40, 'stand', 2, -1],
    ],
    // The count shows above the downed opponent, clear of his health bar in the narrowest field.
    count: [[30, 'one', 5, 0, 'backdrop'], [32, 'two', 5, 0, 'backdrop'], [34, 'three', 5, 0, 'backdrop'], [36]],
    spark: [[3, 'spark', 0, 0, 'sky'], [4], [11, 'spark', 0, 0, 'sky'], [16]],
    star: [[16, 'star', 0, 0, 'sky'], [17, 'star', 0, 0, 'backdrop'], [19]],
    player: [
      [0, 'mac', -7],
      [3, 'jabs', -5],
      [4, 'mac', -6],
      [5, 'mac', -7],
      [8, 'duck', -7],
      [10, 'mac', -6],
      [11, 'jabs', -5],
      [17, 'mac', -5],
      [18, 'crouch', -5],
      [20, 'upper', -1],
      [22, 'mac', -2],
      [24, 'mac', -2, -2],
      [28, 'mac', -10],
      [40, 'mac', -10, 1],
      [43, 'mac', -7],
    ],
    burst: [[20, 'burst', 2, 0, 'sky'], [22]],
  },
}
