import { COLOR, ink, paper, pixelSprite, pixelTiles, tiles } from '../art.js'

const WHITE = ink(231)
const SKIN = 223

// The poses face right. Pixel a is the men's skin and Linda's hair.
const POSES = {
  ready: ['.hs.', 'avvs', '.pp.', '.p.p'],
  bounce: ['.hs.', 'avvs', '.pp.', 'p..p'],
  step: ['.hs.', 'avv.', '.pp.', 'p..p'],
  stride: ['.hs.', '.vvs', '.pp.', '.pp.'],
  jab: ['.hs..', 'avvss', '.pp..', '.p.p.'],
  kick: ['.hs..', 'avv..', '.pppk', '.p...'],
  hurt: ['hs..', '.vva', '.pp.', 'p..p'],
  crouch: ['....', '.hs.', 'avvs', 'pp.p'],
  fly: ['.hs...', 'avv...', '.ppppk', 'pp....'],
  fall: ['....k', '..pp.', 'avv..', 'hs...'],
  lie: ['.sa...', 'hvvppk'],
  gone: ['......', '......'],
}
const MIRRORED = Object.fromEntries(
  Object.keys(POSES).map((name) => [name, POSES[name].map((row) => [...row].reverse().join(''))]),
)

const FRAMES = {
  ready: ['ready', 'ready', 'bounce', 'bounce'],
  walk: ['step', 'stride'],
  jab: ['jab'],
  kick: ['kick'],
  hurt: ['hurt'],
  crouch: ['crouch'],
  fly: ['fly'],
  fall: ['fall'],
  lie: ['lie'],
  out: ['lie', 'gone'],
}
const fighter = (poses, palette, names) =>
  Object.fromEntries(names.map((name) => [name, pixelSprite(FRAMES[name].map((pose) => poses[pose]), palette)]))
const HERO_SPRITES = ['ready', 'walk', 'jab', 'kick', 'hurt', 'crouch', 'fly']
const HEROES = [
  { label: '1P', color: ink(33), sprites: fighter(POSES, { h: 94, s: SKIN, a: SKIN, v: 33, p: 18, k: 52 }, HERO_SPRITES) },
  { label: '2P', color: ink(196), sprites: fighter(POSES, { h: 94, s: SKIN, a: SKIN, v: 160, p: 52, k: 16 }, HERO_SPRITES) },
]

// Abobo's art faces left.
const ABOBO_COLORS = { s: 180, v: 94, p: 236, k: 16, h: 52 }
const abobo = {
  ready: pixelSprite(
    [
      ['.hs...', 'sss...', 'svvsss', 's.vv.s', '..pp..', '.k..k.'],
      ['.hs...', 'sss...', 'svvsss', 's.vv.s', '..pp..', '..kk..'],
    ],
    ABOBO_COLORS,
  ),
  jab: pixelSprite([['..hs...', '.sss...', 'ssvvsss', '..vv..s', '...pp..', '..k..k.']], ABOBO_COLORS),
  hurt: pixelSprite([['...hs.', '...sss', 'ssvvss', 's.vv..', '..pp..', '.k..k.']], ABOBO_COLORS),
  crouch: pixelSprite([['......', '.hs...', 'sssss.', 'svvvss', '.ppp..', 'k...k.']], ABOBO_COLORS),
  fall: pixelSprite([['......', 'kp....', '.ppvv.', '..svss', '...shs', '......']], ABOBO_COLORS),
  lie: pixelSprite([['..ss.ss.', 'kppvvssh']], ABOBO_COLORS),
  out: pixelSprite([['..ss.ss.', 'kppvvssh'], ['........', '........']], ABOBO_COLORS),
}
const GANG_SPRITES = ['ready', 'walk', 'jab', 'hurt', 'crouch', 'fall', 'lie', 'out']
const GANG = [
  { name: 'WILLIAMS', sprites: fighter(MIRRORED, { h: 236, s: SKIN, a: SKIN, v: 255, p: 235, k: 16 }, GANG_SPRITES) },
  { name: 'LINDA', sprites: fighter(MIRRORED, { h: 209, s: SKIN, a: 209, v: 128, p: 128, k: 16 }, GANG_SPRITES) },
  { name: 'ABOBO', sprites: { ...abobo, walk: abobo.ready } },
].map(({ name, sprites }) => ({
  name,
  sprites: Object.fromEntries(
    Object.keys(sprites).map((pose) => [`foe${pose[0].toUpperCase()}${pose.slice(1)}`, sprites[pose]]),
  ),
}))

// The boss carries a kicking Marian over his shoulder.
const MARIAN_COLORS = { y: 214, d: 211, r: 162, l: SKIN }
const BOSSES = [
  {
    name: 'ABOBO',
    carry: pixelSprite(
      [
        ['yddrll.', '..hs...', '.ssvss.', '.s.vv.s', '...pp..', '..k..k.'],
        ['yddrl..', '..hs.l.', '.ssvss.', '.s.vv.s', '...pp..', '...kk..'],
      ],
      { ...MARIAN_COLORS, ...ABOBO_COLORS },
    ),
  },
  {
    name: 'WILLY',
    carry: pixelSprite(
      [
        ['yddrll', '..gs..', '.wwwg.', '..ww..', '..pp..', '.p..p.'],
        ['yddrl.', '..gs.l', '.wwwg.', '..ww..', '..pp..', '..pp..'],
      ],
      { ...MARIAN_COLORS, g: 250, s: SKIN, w: 255, p: 237 },
    ),
  },
]

// The dynamite explodes instead of sparking.
const SPARK = { glyphs: ['*', '*'], color: [ink(231), ink(226)] }
const WEAPONS = [
  {
    item: pixelSprite([['...', 'ttt']], { t: 180 }),
    held: { glyphs: ['╱'], color: ink(180) },
    swing: { glyphs: ['━━'], color: ink(180) },
    burst: SPARK,
  },
  {
    item: pixelSprite([['..', 'kw']], { k: 94, w: 252 }),
    held: { glyphs: ['╾'], color: ink(252) },
    swing: { glyphs: ['╾'], color: ink(252) },
    burst: SPARK,
  },
  {
    item: pixelSprite([['.w.w', 'w.w.']], { w: 94 }),
    held: { glyphs: ['∿'], color: ink(137) },
    swing: { glyphs: ['∿∿∿'], color: ink(137) },
    burst: SPARK,
  },
  {
    item: pixelSprite([['y.', 'rr']], { y: 226, r: 196 }),
    held: pixelSprite([['y', 'r']], { y: 226, r: 196 }),
    swing: pixelSprite([['y', 'r']], { y: 226, r: 196 }),
    burst: pixelSprite(
      [
        ['..y..', '.yoy.', 'yoroy', '.yoy.'],
        ['o.y.o', '.ror.', 'yr.ry', 'o.r.o'],
      ],
      { y: 226, o: 208, r: 196 },
    ),
  },
]

// A spark or a weapon on the ground row shows on that row's screen color.
const NEON = [ink(196), ink(196), ink(213), ink(196)]
const BRICK = ['▀', ink(88), paper(52)]
const CITY = {
  screen: [paper(52), paper(52), paper(244), paper(239)],
  speeds: [0, 0, 0, 0],
  backdrop: tiles('bbbbbbbbbbbbbbwwbbbbbbffffffffbbbbbbbbbbGGGGGGGGGGbbbbbbbbbbwwbbbbbbbbbbwwbbbbbbbbbbbbbbbbbbbbbb', {
    b: BRICK,
    w: ['█', ink(136)],
    f: ['╳', ink(250), paper(236)],
    G: ['▀', ink(246), paper(243)],
  }),
  sky: tiles('bP雙截龍PbbbbbbbbbbbbbffffffffbbbbbbbbbbGGGGGGGGGGbbbbbbbbbbbbbbʓßɮbbbbbbbbbbbbbbbbbbbbbbbbbbbbb', {
    b: BRICK,
    P: [' ', '', paper(16)],
    雙: ['雙', NEON, paper(16)],
    截: ['截', NEON, paper(16)],
    龍: ['龍', NEON, paper(16)],
    f: ['╳', ink(250), paper(236)],
    G: ['▀', ink(246), paper(243)],
    ʓ: ['ʓ', ink(118), paper(88)],
    ß: ['ß', ink(51), paper(88)],
    ɮ: ['ɮ', ink(213), paper(88)],
  }),
  ahead: pixelTiles(['ssssssss', 'sssssssk'], { s: 244, k: 242 }),
  base: pixelTiles(['sssssssk', 'cccccccc'], { s: 244, k: 242, c: 239 }),
}
// The factory floor is a conveyor belt.
const FACTORY = {
  screen: [paper(59), paper(59), paper(244), paper(238)],
  speeds: [0, 0, 0, 1],
  backdrop: tiles('gggggggggP工場Pggggggggggggooggggggggggggggggggggggggggggoogggggggggggoogggggggggggggggggggggggg', {
    g: ['▀', ink(240), paper(59)],
    o: ['█', ink(208)],
    P: [' ', '', paper(52)],
    工: ['工', ink(226), paper(52)],
    場: ['場', ink(226), paper(52)],
  }),
  sky: tiles('pppppp║ppppppppppppppppppppppppppp║ppppppppppppppppppppppppp▚▚▚▚pppppppp║ppppppppppppppppppppppp', {
    p: ['▀', ink(60), paper(59)],
    '║': ['║', ink(245), paper(59)],
    '▚': ['▚', ink(226), paper(16)],
  }),
  ahead: tiles(' ', {}),
  base: pixelTiles(['bbbybbbb', 'kkkkkkkk'], { b: 236, y: 178, k: 238 }),
}
const FOREST = {
  screen: [paper(22), paper(22), paper(28), paper(137)],
  speeds: [0, 0, 0, 0],
  backdrop: pixelTiles(
    [
      'LLLlLLL..LLLLlLL...LLlLLLL....LLLLL..LLLLlLLL...LLlLLLLL..LLLLLL....LLlLLLL..LLLLLlLL...LLLLLL..',
      'LlLLLLLL.LLlLLLLL.LLLLLlLL..LLLlLLLL.LLLLLLLLL.LLLLLLlLLL.LLlLLLLL..LLLLLLLL.LLLLLLLLL..LLlLLLL.',
    ],
    { L: 28, l: 34 },
  ),
  sky: tiles('  T     森林    T       T         T       T          T      T        T       T        T       T ', {
    T: ['█', ink(94)],
    森: ['森', ink(214), paper(94)],
    林: ['林', ink(214), paper(94)],
  }),
  ahead: tiles(' ', {}),
  base: pixelTiles(['dddddddd', 'ddddgddo'], { d: 137, g: 34, o: 101 }),
}
const MISSIONS = [CITY, FACTORY, FOREST]

export default {
  id: 'double-dragon',
  loop: 64,
  // Deals Billy or Jimmy, the mission, the gang member, the boss, the weapon and the spare lives.
  vary: (pick, game) => {
    const hero = pick(HEROES, 0)
    const mission = pick([0, 1, 2], 3)
    const foe = pick(GANG, 2)
    const boss = pick(
      BOSSES.filter(({ name }) => name !== foe.name),
      4,
    )
    const weapon = pick(WEAPONS, 5)
    return {
      ...MISSIONS[mission],
      scoreboard: { ...game.scoreboard, left: `${hero.label} {score}`, ink: hero.color },
      banner: [[[0, `MISSION ${mission + 1}`], [4, '']], WHITE],
      topCaption: { ...game.topCaption, left: [game.topCaption.left[0], hero.color] },
      caption: { left: ['Ö'.repeat(pick([1, 2, 3], 1)), hero.color] },
      sprites: {
        ...game.sprites,
        ...hero.sprites,
        ...foe.sprites,
        carry: boss.carry,
        ...weapon,
      },
    }
  },
  scoreboard: { left: '1P {score}', right: 'HI {hi}', ink: ink(33) },
  logo: [['DOUBLE DRAGON ', ink(226)], ['雙截龍', ink(196)]],
  border: COLOR.magenta,
  ...CITY,
  banner: [[[0, 'MISSION 1'], [4, '']], WHITE],
  topCaption: {
    left: [[[0, '▮▮▮▮▮▮'], [18, '▮▮▮▮▮']], ink(33)],
    right: [[[0, '▮▮▮▮▮▮'], [14, '▮▮▮▮▮'], [16, '▮▮▮▮'], [21, '▮▮▮'], [30, '▮'], [37, '']], ink(226)],
  },
  caption: { left: ['ÖÖ', ink(33)] },
  icons: { fiveHour: 'foeLie', sevenDay: 'item' },
  sprites: {
    ...HEROES[0].sprites,
    ...GANG[0].sprites,
    carry: BOSSES[0].carry,
    ...WEAPONS[0],
    spark: SPARK,
    points100: { glyphs: ['100'], color: WHITE },
    points200: { glyphs: ['200'], color: WHITE },
    points300: { glyphs: ['300'], color: WHITE },
  },
  // A gang member walks up, and the hero jabs him twice, takes a punch and kicks him down for 100.
  // The hero uses the dropped weapon for 200 and a jump kick for 300, and the boss carries Marian off.
  cast: {
    carry: [[31, 'carry', -46, 3, 'ground']],
    foe: [
      [0, 'foeWalk', 40, -3, 'base'],
      [13, 'foeReady', 1, 0, 'base'],
      [14, 'foeHurt', 1, 0, 'base'],
      [15, 'foeReady', 1, 0, 'base'],
      [16, 'foeHurt', 1, 0, 'base'],
      [17, 'foeReady', 1, 0, 'base'],
      [18, 'foeJab', 0, 0, 'base'],
      [19, 'foeReady', 1, 0, 'base'],
      [21, 'foeHurt', 1, 0, 'base'],
      [22, 'foeFall', 3, 0, 'base'],
      [23, 'foeLie', 5, 0, 'base'],
      [26, 'foeCrouch', 5, 0, 'base'],
      [27, 'foeWalk', 5, -1, 'base'],
      [29, 'foeReady', 4, 0, 'base'],
      [30, 'foeHurt', 4, 0, 'base'],
      [31, 'foeFall', 6, 0, 'base'],
      [32, 'foeLie', 8, 0, 'base'],
      [34, 'foeCrouch', 7, 0, 'base'],
      [35, 'foeWalk', 7, -2, 'base'],
      [37, 'foeHurt', 3, 0, 'base'],
      [38, 'foeFall', 5, 0, 'ground'],
      [39, 'foeOut', 8, 0, 'base'],
      [45],
    ],
    player: [
      [0, 'ready', -4, 0, 'base'],
      [14, 'jab', -4, 0, 'base'],
      [15, 'ready', -4, 0, 'base'],
      [16, 'jab', -4, 0, 'base'],
      [17, 'ready', -4, 0, 'base'],
      [18, 'hurt', -5, 0, 'base'],
      [19, 'ready', -4, 0, 'base'],
      [21, 'kick', -4, 0, 'base'],
      [22, 'ready', -4, 0, 'base'],
      [23, 'walk', -4, 1, 'base'],
      [25, 'crouch', -2, 0, 'base'],
      [26, 'ready', -2, 0, 'base'],
      [30, 'jab', -2, 0, 'base'],
      [31, 'walk', -2, -1, 'base'],
      [33, 'ready', -4, 0, 'base'],
      [36, 'crouch', -4, 0, 'base'],
      [37, 'fly', -3, 0, 'ground'],
      [38, 'fly', -2, 0, 'ground'],
      [39, 'ready', -2, 0, 'base'],
      [41, 'walk', -2, -1, 'base'],
      [43, 'ready', -4, 0, 'base'],
    ],
    weapon: [[22, 'item', 1, 0, 'base'], [25], [26, 'held', 2, 0, 'ground'], [30, 'swing', 3, 0, 'ground'], [31]],
    burst: [[30, 'burst', 4, 0, 'ground'], [31, 'burst', 6, 0, 'ground'], [32]],
    spark: [
      [14, 'spark', 1, 0, 'ground'],
      [15],
      [16, 'spark', 1, 0, 'ground'],
      [17],
      [18, 'spark', -1, 0, 'ground'],
      [19],
      [21, 'spark', 1, 0, 'ground'],
      [22],
      [37, 'spark', 3, 0, 'ground'],
      [38],
    ],
    points: [
      [21, 'points100', 1, 0, 'sky'],
      [22, 'points100', 1, 0, 'backdrop'],
      [24],
      [30, 'points200', 4, 0, 'backdrop'],
      [33],
      [37, 'points300', 1, 0, 'sky'],
      [38, 'points300', 1, 0, 'backdrop'],
      [40],
    ],
  },
}
