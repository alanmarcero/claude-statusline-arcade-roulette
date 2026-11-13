import { COLOR, drain, ink, paper, pixelSprite, pixelTiles, tiles } from '../art.js'

const WHITE = ink(231)
const LIME = ink(46)
const PIZZA = ink(214)
const BRICK = 88
const FLASH = 231
const FIRE = [ink(202), ink(214), ink(208), ink(226), ink(196)]
const HEALTH = drain(8, 'left')
const BOSS_HEALTH = drain(6, 'right')

const KATANA = {
  ink: 252,
  windup: ['w.gg', 'mwme', 'ssgp', '.g.g'],
  strike: ['m.gg..', '.mme..', 'ssggww', '.g.g..'],
}
const SAI = {
  ink: 250,
  windup: ['m.gg', '.mme', 'wsgp', '.g.g'],
  strike: ['m.gg..', '.mmew.', 'ssggww', 'g...g.'],
}
const NUNCHAKU = {
  ink: 137,
  windup: ['m.ggw', '.mmw.', 'ssgp.', '.g.g.'],
  strike: ['m.gg.w', '.mmew.', 'ssgg..', '.g.g..'],
}
const BO = {
  ink: 137,
  windup: ['w.gg', 'mwme', 'sswp', '.g.g'],
  strike: ['m.gg..', '.mme..', 'ssgwww', '.g.g..'],
}
const WALK = [
  ['m.gg', '.mme', 'ssgp', '.g.g'],
  ['..gg', 'mmme', 'ssgp', 'g.g.'],
]
const turtle = (mask, weapon) => {
  const palette = { g: 76, m: mask, e: 231, s: 136, p: 186, w: weapon.ink }
  return {
    walk: pixelSprite(WALK, palette),
    windup: pixelSprite([weapon.windup], palette),
    strike: pixelSprite([weapon.strike], palette),
    hurt: pixelSprite([WALK[0]], { g: FLASH, m: FLASH, e: FLASH, s: FLASH, p: FLASH }),
  }
}
const TURTLES = [
  ['LEO', ink(33), turtle(33, KATANA)],
  ['RAPH', ink(196), turtle(196, SAI)],
  ['MIKE', ink(208), turtle(208, NUNCHAKU)],
  ['DON', ink(135), turtle(129, BO)],
]

const foot = (uniform, shade) => {
  const palette = { u: uniform, d: shade, e: 231 }
  return {
    foot: pixelSprite([['.uu', 'euu', 'duu', 'd.d'], ['.uu', 'euu', 'duu', '.dd']], palette),
    footHit: pixelSprite([['.uu', 'euu', 'duu', 'd.d']], { u: FLASH, d: FLASH, e: FLASH }),
    footFly: pixelSprite([['dduu', 'd.ue'], ['euu.', 'uudd']], palette),
    footDown: pixelSprite([['.uu.', 'euud'], ['....', '....']], palette),
    peek: pixelSprite([['.uu', 'euu']], palette),
    leap: pixelSprite([['.uu', 'euu', 'duu', '.dd']], palette),
    kick: pixelSprite([['..uu', '.euu', '.uud', 'dd..']], palette),
  }
}
const FOOT = [foot(98, 54), foot(255, 248), foot(208, 130), foot(33, 25), foot(226, 136)]

// The empty second frames of footDown and bossDown make a beaten enemy blink.
const boss = (art, palette) => {
  const flash = Object.fromEntries(Object.keys(palette).map((key) => [key, FLASH]))
  return {
    bossWalk: pixelSprite(art.walk, palette),
    bossWindup: pixelSprite([art.windup], palette),
    bossStrike: pixelSprite([art.strike], palette),
    bossHit: pixelSprite([art.walk[0]], flash),
    bossDown: pixelSprite([art.down, art.down.map((row) => '.'.repeat(row.length))], palette),
  }
}
// Shredder, Bebop, Rocksteady, Baxter Stockman (as the fly) and Leatherhead.
const BOSSES = [
  [
    ink(250),
    boss(
      {
        walk: [
          ['..hh..', '.rkhcc', 'bsshcc', '.uuucc', '.u.ucc', '.u..u.'],
          ['..hh..', '.rkhcc', 'bsshcc', '.uuucc', '.u.ucc', '..uu..'],
        ],
        windup: ['b.hh..', 'brkhcc', '.sshcc', '.uuucc', '.u.ucc', '.u..u.'],
        strike: ['...hh..', '..rkhcc', 'bbsshcc', '..uuucc', '..u.ucc', '.u...u.'],
        down: ['..ccchh', 'uuussrh'],
      },
      { h: 250, k: 16, r: 196, b: 255, s: 247, c: 91, u: 61 },
    ),
  ],
  [
    ink(165),
    boss(
      {
        walk: [
          ['...mm.', '..gss.', 'tnnss.', '..vvvs', '..pp..', '.p..p.'],
          ['...mm.', '..gss.', 'tnnss.', '..vvvs', '..pp..', '..pp..'],
        ],
        windup: ['...mm.', '..gsss', 'tnnsss', '..vvv.', '..pp..', '.p..p.'],
        strike: ['....mm.', '...gss.', '.tnnss.', 'ssvvvv.', '...pp..', '..p..p.'],
        down: ['..vv.mm', 'ppvvsnt'],
      },
      { m: 165, g: 91, s: 137, n: 174, t: 231, v: 94, p: 25 },
    ),
  ],
  [
    ink(247),
    boss(
      {
        walk: [
          ['...gg.', 'hggeg.', '.ggvv.', '..vvg.', '..pp..', '.p..p.'],
          ['...gg.', 'hggeg.', '.ggvv.', '..vvg.', '..pp..', '..pp..'],
        ],
        windup: ['...gg.', 'hggeg.', '.ggvvg', '..vv.g', '..pp..', '.p..p.'],
        strike: ['....gg.', '.hggeg.', '..ggvv.', 'gggvv..', '...pp..', '..p..p.'],
        down: ['..vv.gg', 'ppvvggh'],
      },
      { g: 247, h: 230, e: 16, v: 64, p: 101 },
    ),
  ],
  [
    ink(153),
    boss(
      {
        walk: [
          ['...ww.', 'rr.ww.', 'rbbb..', '.bbbb.', '..bb..', '.l..l.'],
          ['..w.w.', 'rr.w.w', 'rbbb..', '.bbbb.', '..bb..', '..ll..'],
        ],
        windup: ['...ww.', 'rr.ww.', 'rbbbl.', '.bbbbl', '..bb..', '.l..l.'],
        strike: ['....ww.', '.rr.ww.', '.rbbb..', 'llbbbb.', '...bb..', '..l..l.'],
        down: ['.ww.ww.', 'llbbbrr'],
      },
      { w: 153, r: 196, b: 101, l: 245 },
    ),
  ],
  [
    ink(106),
    boss(
      {
        walk: [
          ['..e...', 'jjgg..', 'tjjgg.', '..ygg.', '..gggg', '.g..g.'],
          ['..e...', 'jjgg..', 'tjjgg.', '..ygg.', '..gggg', '..gg..'],
        ],
        windup: ['j.e...', '.jgg..', 'ttggg.', '..ygg.', '..gggg', '.g..g.'],
        strike: ['...e...', '.jjgg..', 'ttjjgg.', '...ygg.', '...gggg', '..g..g.'],
        down: ['..ggge.', 'gggyjjt'],
      },
      { e: 226, j: 106, g: 64, t: 231, y: 186 },
    ),
  ],
]

// April waves from the burning building.
// The other buildings stay dark for contrast with the fighters.
// The PIZZA sign is on the sky row, so the health bars never cover it.
const STREET = {
  r: ['▄', ink(BRICK)],
  f: ['▃▅▇▆▄▆', FIRE],
  k: ['▄', ink(16)],
  h: ['▄', ink(130)],
  a: ['▄', [ink(223), ink(16)]],
  S: ['░▒▓▒░', [ink(250), ink(246), ink(248)]],
  G: ['█', ink(237)],
  P: ['P', ink(226), paper(124)],
  I: ['I', ink(226), paper(124)],
  Z: ['Z', ink(226), paper(124)],
  A: ['A', ink(226), paper(124)],
  g: ['▄', ink(235)],
  B: ['█', ink(BRICK)],
  W: ['▀', FIRE, paper(BRICK)],
  K: ['▀', ink(16), paper(BRICK)],
  Y: ['▀', ink(226), paper(BRICK)],
  D: ['▄', ink(16), paper(BRICK)],
  L: ['▀', ink(179), paper(237)],
  E: ['▄', ink(16), paper(237)],
  J: ['█', ink(235)],
  M: ['▀', ink(179), paper(235)],
  N: ['▄', ink(16), paper(235)],
}

export default {
  id: 'tmnt',
  loop: 72,
  // Deals the turtle, the partner, the banner, the boss, the lives, the pizzas and the Foot Soldier uniform.
  vary: (pick, game) => {
    const [hero, mask, moves] = pick(TURTLES, 0)
    const [partner] = pick(
      TURTLES.filter(([name]) => name !== hero),
      1,
    )
    const [bossInk, bossMoves] = pick(BOSSES, 3)
    return {
      scoreboard: { ...game.scoreboard, left: `${hero} {score}`, right: `${partner} {hi}` },
      banner: pick(
        [
          [[[0, 'COWABUNGA!'], [4, '']], LIME],
          [[[0, ''], [63, 'PIZZA TIME'], [69, '']], PIZZA],
          [[[0, 'TURTLE POWER'], [4, '']], LIME],
        ],
        2,
      ),
      topCaption: { left: [game.topCaption.left[0], mask], right: [game.topCaption.right[0], bossInk] },
      caption: { left: ['⬢'.repeat(pick([1, 2, 3], 4)), mask], right: [`◕×${pick([1, 2, 3, 4, 5], 5)}`, PIZZA] },
      sprites: { ...game.sprites, ...moves, ...pick(FOOT, 6), ...bossMoves },
    }
  },
  scoreboard: { left: 'LEO {score}', right: 'RAPH {hi}', ink: LIME },
  logo: [
    ['TEENAGE MUTANT ', ink(196)],
    ['NINJA TURTLES', LIME],
  ],
  border: COLOR.green,
  speeds: [0.5, 0.5, 1, 1],
  screen: [paper(17), paper(17), paper(238), paper(22)],
  backdrop: tiles('   rffrffrrrkharrSSS                      gggggggggggggg        JMJJJJMJ      GGLGGGGGGGLGGG    ', STREET),
  sky: tiles('   BWWBWWBDBKYKBB                         JJMJJJNJJJMJJJ        JJJNNJJJ      GEGGGPIZZAGGEG    ', STREET),
  ahead: pixelTiles(['ssssssssssssssssssssssssssssssss', 'aaaaaaaaaaaaaaaaaammmaaaaaaaaaaa'], { s: 241, a: 238, m: 243 }),
  base: tiles('~      ≈     o        ~    ≈    ', {
    '~': ['~≈', [ink(28), ink(34)]],
    '≈': ['≈~', [ink(34), ink(28)]],
    o: ['o°·', ink(34)],
  }),
  banner: [[[0, 'COWABUNGA!'], [4, '']], LIME],
  topCaption: {
    left: [[[0, HEALTH[0]], [28, HEALTH[2]], [54, HEALTH[5]], [66, HEALTH[3]], [67, HEALTH[0]]], ink(33)],
    right: [[[0, ''], [44, BOSS_HEALTH[0]], [58, BOSS_HEALTH[3]], [60, '']], ink(250)],
  },
  caption: { left: ['⬢⬢', ink(33)], right: ['◕×3', PIZZA] },
  icons: { fiveHour: 'peek', sevenDay: 'pizza' },
  sprites: {
    ...TURTLES[0][2],
    ...FOOT[0],
    ...BOSSES[0][1],
    manhole: pixelSprite([['...', 'ccc']], { c: 245 }),
    hole: pixelSprite([['...', 'kkk']], { k: 16 }),
    cover: pixelSprite([['ccc', '...']], { c: 245 }),
    pizza: pixelSprite([['.cc.', 'cyrc']], { c: 214, y: 227, r: 160 }),
    wagon: pixelSprite(
      [['..cCcCcc..', '.wwbbbbww.', 'bbbbbbbbbo', '.kk....kk.']],
      { c: 28, C: 34, w: 117, b: 65, o: 208, k: 235 },
    ),
    spark: { glyphs: ['※', '*'], color: [WHITE, ink(226)] },
  },
  // The turtle leaves the parked Party Wagon and hits a Foot Soldier into the air.
  // Another Foot Soldier leaps from a manhole and kicks the turtle, and the turtle hits it too.
  // The boss hits the turtle and falls after two strikes.
  // The turtle eats the dropped pizza, and its health bar fills.
  // The Party Wagon parks behind the turtle.
  cast: {
    wagon: [[0, 'wagon', -22, -1], [52, 'wagon', -59, 2]],
    manhole: [[0, 'manhole', 26, -1], [24, 'hole', null, -1], [27, 'manhole', null, -1]],
    nextManhole: [[54, 'manhole', 44, -1]],
    cover: [[24, 'cover', 2, -1, 'sky'], [25, 'cover', 1, -1, 'backdrop'], [26, 'cover', 0, -1, 'sky'], [27]],
    boss: [
      [28, 'bossWalk', 44, -2],
      [52, 'bossWindup', -4],
      [54, 'bossStrike', -6],
      [56, 'bossWalk', -4],
      [58, 'bossHit', -4],
      [59, 'bossWalk', -3],
      [60, 'bossHit', -3],
      [61, 'bossHit', -2],
      [62, 'bossDown', 1, -1],
      [66],
    ],
    pizza: [[62, 'pizza', -4, -1], [66]],
    foot: [
      [0, 'foot', 16, -2],
      [10, 'footHit', -4],
      [12, 'footFly', -1, 3, 'sky'],
      [13, 'footFly', 2, 3, 'backdrop'],
      [15, 'footFly', 8, 3, 'sky'],
      [16, 'footDown', 11, -1],
      [20],
      [58, 'foot', 44, -2],
    ],
    ambush: [
      [24, 'peek', 2, -1],
      [26, 'leap', 0, -2, 'sky'],
      [28, 'kick', -6],
      [30, 'foot', -5],
      [34, 'footHit', -4],
      [36, 'footFly', -3, 3, 'sky'],
      [37, 'footFly', 0, 3, 'backdrop'],
      [39, 'footFly', 6, 3, 'sky'],
      [40, 'footDown', 9, -1],
      [44],
    ],
    player: [
      [0, 'walk', -11],
      [8, 'windup', -10],
      [10, 'strike', -10],
      [12, 'walk', -10],
      [28, 'hurt', -10, -1],
      [30, 'walk', -12, 1],
      [32, 'windup', -10],
      [34, 'strike', -10],
      [36, 'walk', -10],
      [54, 'hurt', -10, -1],
      [56, 'walk', -11, 1],
      [57, 'windup', -10],
      [58, 'strike', -10],
      [59, 'windup', -10],
      [60, 'strike', -9],
      [61, 'walk', -9, -1],
      [63, 'walk', -11],
    ],
    spark: [
      [10, 'spark', -5, 0, 'sky'],
      [12],
      [28, 'spark', -6, 0, 'sky'],
      [29],
      [34, 'spark', -5, 0, 'sky'],
      [36],
      [54, 'spark', -6, 0, 'sky'],
      [55],
      [58, 'spark', -5, 0, 'sky'],
      [59],
      [60, 'spark', -4, 0, 'sky'],
      [61],
    ],
  },
}
