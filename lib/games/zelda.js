import { COLOR, ink, paper, pixelRows, pixelSprite, pixelTiles, tiles } from '../art.js'

const WHITE = ink(231)
const RED = ink(196)
const BLACK = paper(16)
const RUPEE = { glyphs: ['⧫'], color: [ink(214), ink(33)] }
const KEY = { glyphs: ['Ϙ'], color: ink(220) }

// Link faces right. The lowercase keys color the hurt flash.
const LINK = { S: 209, B: 166, D: 94, E: 52, H: 94, g: 231, s: 196, e: 231, b: 202, d: 202 }
const WALK = [
  ['GGG.', 'GSES', 'GGGD', 'B.BD'],
  ['GGG.', 'GSES', 'GGGD', '.BBD'],
]
const LEAVE = WALK.map((frame) => frame.map((row) => [...row].reverse().join('')))
const STAB = ['GGG....', 'GSES...', 'GGGHWWW', 'B.B....']
const RAISE = ['SGGS', 'GSSG', 'GGGG', 'B..B']

const hero = (tunic, blade) => {
  const palette = { ...LINK, G: tunic, W: blade }
  return {
    walk: pixelSprite(WALK, palette),
    stab: pixelSprite([STAB], palette),
    hurt: pixelSprite([WALK[0].map((row) => row.toLowerCase()), WALK[0]], palette),
    raise: pixelSprite([RAISE], palette),
    peek: pixelSprite([WALK[0].slice(0, 2)], palette),
    leave: pixelSprite(LEAVE, palette),
    peekLeft: pixelSprite([LEAVE[0].slice(0, 2)], palette),
  }
}

// The monsters face left, toward Link.
const OCTOROK = [
  ['.RR.', 'RWRR', 'ORRR', 'R.R.'],
  ['.RR.', 'RWRR', 'ORRR', '.R.R'],
]
const MOBLIN = [
  ['.OO.w', 'KOOOs', 'OBBOs', 'O.O.s'],
  ['.OO.w', 'KOOOs', 'OBBOs', '.O.Os'],
]
const LYNEL = [
  ['.MM..', 'MFMRR', 'RRRRR', 'R.R.R'],
  ['.MM..', 'MFMRR', 'RRRRR', '.R.R.'],
]
const MOBLIN_COLORS = { O: 208, K: 52, B: 130, w: 231, s: 137 }
const RED_OCTOROK = pixelSprite(OCTOROK, { R: 160, W: 231, O: 208 })
const LEEVER = pixelSprite(
  [
    ['.LL.', 'LlLL', 'LLlL', 'L..L'],
    ['.LL.', 'LLlL', 'LlLL', 'L..L'],
  ],
  { L: 202, l: 226 },
)
const PEAHAT = pixelSprite(
  [
    ['PP.P', '.YY.', '.GG.', '....'],
    ['P.PP', '.YY.', '.GG.', '....'],
  ],
  { P: 202, Y: 226, G: 34 },
)
const TEKTITE = pixelSprite(
  [
    ['.TT.', 'TWTT', 'T..T', 'K..K'],
    ['....', '.TT.', 'TWTT', 'K..K'],
  ],
  { T: 160, W: 231, K: 52 },
)
const GHINI = pixelSprite(
  [
    ['.WW.', 'WKWW', 'WWWW', 'W.W.'],
    ['.WW.', 'WKWW', 'WWWW', '.W.W'],
  ],
  { W: 231, K: 16 },
)

// The overworld has rock cliffs, trees, Armos statues and a lake.
const [forest, path] = pixelRows(
  [
    'RRR.RRRR.R....LG...GGG.......a....a.........wwwwwwww.......LG...LG...GGG........RRRRRR....',
    'RRRkRRRRkR...LGGG.GLGGG.....aKa..aKa.......wwwwwwwwww.....LGGG.LGGG.GLGGG......RRkRRRkR...',
    'RkRRRkRRRR...GGGd.GGGGd.....aaa..aaa......wwwWwwwwwwww....GGGd.GGGd.GGGGd......RkRRkRRR...',
    'kkRkkkkRkk....Kd...dKd......a.a..a.a.......wwwwwwwwWw......Kd...Kd...dKd.......kkkkkkkk...',
  ],
  { R: 94, k: 52, G: 28, L: 34, d: 22, K: 94, a: 101, w: 25, W: 31 },
)

const [crags, slope] = pixelRows(
  [
    'LLL.LLLL.L...LL.......LLLLLL..LLL.LLLL.L.....LL...LL.......',
    'LLLkLLLLkL..LLLk.....LLkLLLkL.LLLkLLLLkL....LLLk.LLLk......',
    'LkLLLkLLLL..LkLL.....LkLLkLLL.LkLLLkLLLL....LkLL.LkLL......',
    'kkLkkkkLkk..kkkk.....kkkkkkkk.kkLkkkkLkk....kkkk.kkkk......',
  ],
  { L: 248, k: 240 },
)

// The graveyard has gravestones and bare trees.
const [graves, aisle] = pixelRows(
  [
    '.W...W...W.....b.b....W...W......b.b.b.b...',
    'WKW.WKW.WKW.....b....WKW.WKW......b...b....',
    'WWW.WWW.WWW....bb....WWW.WWW.....bb..bb....',
    'WWW.WWW.WWW.....b....WWW.WWW......b...b....',
  ],
  { W: 251, K: 240, b: 237 },
)

// A Tektite or a Ghini runs into Link and spits no rock.
const CHARGE = { foe: [[0, 'foe', 44, -2.3, 'base'], [21, 'foe', -2, -1, 'base'], [25]], rock: [[0]] }

// Each boulder rolls out from under the status bar and off the bottom edge.
const BOULDER = ['.BB.', 'BbBB', 'BBBb', '.BB.']
const BOULDER_COLORS = { B: 94, b: 137 }
const BOULDERS = [
  [4, 'boulderBottom', 12, -2, 'sky'],
  [5, 'boulder', 10, -2],
  [6, 'boulder', 8, -2, 'base'],
  [7, 'boulderTop', 6, -2, 'base'],
  [8],
  [30, 'boulderBottom', 14, -2, 'sky'],
  [31, 'boulder', 12, -2],
  [32, 'boulder', 10, -2, 'base'],
  [33, 'boulderTop', 8, -2, 'base'],
  [34],
]

// The old man gives Link the sword, so the A box starts empty.
const CAVE_DWELLERS = [
  [
    pixelSprite([['.WW.', '.SS.', 'RWWR', 'RRRR']], { R: 160, S: 209, W: 231 }),
    ["IT'S DANGEROUS TO GO", 'ALONE! TAKE THIS.'],
    { glyphs: ['†'], color: WHITE },
    ' ',
  ],
  [
    pixelSprite([['.GG.', 'GSSG', 'GGGG', 'GGGG']], { S: 209, G: 34 }),
    ["BUY SOMETHIN'", 'WILL YA!'],
    KEY,
    '†',
  ],
  [
    pixelSprite(MOBLIN.slice(0, 1), MOBLIN_COLORS),
    ["IT'S A SECRET TO", 'EVERYBODY.'],
    RUPEE,
    '†',
  ],
]

// Link climbs in while the text types out. He holds up the gift and climbs out.
const CAVE_CAST = {
  fireLeft: [[0, 'flame', -2, 0, 'base']],
  fireRight: [[0, 'flame', 9, 0, 'base']],
  npc: [[0, 'npc', 3, 0, 'base']],
  gift: [[0, 'gift', -4, 0, 'base'], [13, 'gift', -5, 0, 'sky'], [19]],
  player: [
    [0, 'peek', -11, 0, 'base'],
    [1, 'walk', -11, 0, 'base'],
    [9, 'walk', -11, 1, 'base'],
    [13, 'raise', -7, 0, 'base'],
    [19, 'leave', -7, -1, 'base'],
    [23, 'peekLeft', -11, 0, 'base'],
    [24],
  ],
}

// The wall and floor are screen colors, so a flash recolors the room.
const room = (wall, seam, floor, mark) => {
  const [ahead, base] = pixelRows(['......', '..m...', '......', '.....m'], { m: mark })
  return {
    screen: [BLACK, paper(wall), paper(floor), paper(floor)],
    speeds: [0, 0, 0, 0],
    sky: pixelTiles(['s...s...', '..s...s.'], { s: seam }),
    ahead,
    base,
  }
}

// Each dungeon has the boss of its level in the original game.
const AQUAMENTUS = [
  ['..H...', '.GGG..', 'GKGGG.', '..GGGG', '.GGGGg', '.g..g.'],
  ['..H...', '.GGG..', 'GKGGG.', '..GGGG', '.GGGGg', '..g..g'],
]
const DODONGO = [
  ['......', '......', '.OOOO.', 'OKOOOO', 'OOOOOO', '.O..O.'],
  ['......', '......', '.OOOO.', 'OKOOOO', 'OOOOOO', 'O..O..'],
]
const MANHANDLA = [
  ['..HH..', '..GG..', 'HGCCGH', 'HGCCGH', '..GG..', '..HH..'],
  ['..HH..', '..GG..', 'HGCCGH', 'HGCCGH', '..GG..', '.H..H.'],
]
const GLEEOK = [
  ['H...H.', 'N...N.', '.N.N..', 'BBBB..', 'BBBBB.', 'B..B..'],
  ['.H..H.', '.N..N.', '.N.N..', 'BBBB..', 'BBBBB.', 'B..B..'],
]
const DIGDOGGER = [
  ['.S..S.', 'SBBBBS', '.BWKB.', '.BBBB.', 'SBBBBS', '.S..S.'],
  ['S.SS.S', '.BBBB.', 'SBWKBS', 'SBBBBS', '.BBBB.', 'S.SS.S'],
]
const GOHMA = [
  ['......', '......', '.LEEL.', 'LBEEBL', 'L.BB.L', '.L..L.'],
  ['......', '......', '.LEEL.', 'LBKKBL', 'L.BB.L', 'L....L'],
]
const GANON = [
  ['.B..B.', 'BBBBBB', 'BYBBYB', 'BBWWBB', 'BBBBBB', '.B..B.'],
  ['.B..B.', 'BBBBBB', 'BYBBYB', 'BBWWBB', 'BBBBBB', 'B....B'],
]
const AQUAMENTUS_COLORS = { H: 230, G: 34, K: 16, g: 22 }
const GLEEOK_COLORS = { H: 51, N: 37, B: 30 }
const DUNGEONS = [
  [room(31, 23, 23, 30), AQUAMENTUS, AQUAMENTUS_COLORS],
  [room(27, 18, 17, 19), DODONGO, { O: 172, K: 16 }],
  [room(34, 22, 22, 28), MANHANDLA, { H: 196, G: 27, C: 21 }],
  [room(178, 94, 58, 100), GLEEOK, GLEEOK_COLORS],
  [room(36, 23, 23, 29), DIGDOGGER, { S: 141, B: 93, W: 231, K: 16 }],
  [room(136, 94, 52, 88), GOHMA, { L: 208, B: 166, E: 196, K: 16 }],
  [room(64, 22, 22, 28), AQUAMENTUS, AQUAMENTUS_COLORS],
  [room(248, 240, 238, 241), GLEEOK, GLEEOK_COLORS],
  [room(240, 236, 233, 235), GANON, { B: 130, Y: 226, W: 231 }],
]

// Keese, Stalfos, Darknuts, Wizzrobes and Gels guard the rooms.
const DUNGEON_ENEMIES = [
  pixelSprite([['B..B', '.BB.', '....', '....'], ['.BB.', 'B..B', '....', '....']], { B: 33 }),
  pixelSprite([['.WW.', 'WKKW', '.WW.', 'W..W'], ['.WW.', 'WKKW', '.WW.', '.WW.']], { W: 255, K: 16 }),
  pixelSprite([['.RRR', 'RKKR', 'SRRR', 'SR.R'], ['.RRR', 'RKKR', 'SRRR', 'S.RR']], { R: 160, K: 16, S: 255 }),
  pixelSprite([['.OO.', 'OSSO', 'OOOO', 'OOOO'], ['.OO.', 'OSSO', 'OOOO', 'O..O']], { O: 208, S: 209 }),
  pixelSprite([['....', '....', '.GG.', 'GGGG'], ['....', '.GG.', 'GGGG', '.GG.']], { G: 37 }),
]

// The room flashes while Link holds up the Triforce piece.
const STROBE = { screen: [BLACK, paper(231), paper(231), paper(231)] }
const TRIFORCE_FLASH = [
  [32, STROBE],
  [33, undefined],
  [34, STROBE],
  [35, undefined],
  [36, STROBE],
  [37, undefined],
  [40, { screen: BLACK, ink: ink(16) }],
]

// Link enters, and his beam kills a monster. The boss's fireball hurts him.
// He takes the dropped key, stabs the boss twice and holds up the Triforce piece.
const DUNGEON_CAST = {
  door: [[0, 'door', -12, 0, 'sky'], [40]],
  boss: [
    [0, 'boss', 7, 0, 'base'],
    [21, 'bossHit', 7, 0, 'base'],
    [22, 'boss', 7, 0, 'base'],
    [24, 'bossHit', 7, 0, 'base'],
    [25],
  ],
  key: [[8, 'key', 3, 0, 'base'], [19]],
  enemy: [[0, 'puff', 2, 0, 'base'], [2, 'enemy', 2, 0, 'base'], [5]],
  fireball: [[10, 'fireball', 6, -4, 'base'], [12]],
  prize: [[29, 'triforce', 8, 0, 'base'], [32, 'triforce', 5, 0, 'sky'], [40]],
  puff: [[25, 'puff', 8, 0, 'base'], [28]],
  blast: [[25, 'puff', 10, 0], [28]],
  player: [
    [0, 'walk', -12],
    [1, 'walk', -12, 0, 'base'],
    [2, 'stab', -12, 0, 'base'],
    [4, 'walk', -12, 1, 'base'],
    [12, 'hurt', -6, -2, 'base'],
    [14, 'walk', -8, 2, 'base'],
    [19, 'walk', 0, 1, 'base'],
    [21, 'stab', 2, 0, 'base'],
    [23, 'walk', 2, 0, 'base'],
    [24, 'stab', 2, 0, 'base'],
    [26, 'walk', 2, 0, 'base'],
    [29, 'walk', 2, 1, 'base'],
    [32, 'raise', 5, 0, 'base'],
    [40],
  ],
  beam: [[3, 'beam', -5, 3, 'base'], [5]],
  shards: [[5, 'shards', 1, 0, 'base'], [8]],
}

export default {
  id: 'zelda',
  loop: 56,
  idleText: ' CONTINUE · SAVE · RETRY ',
  // Deals Link's tunic, sword, B item, hearts and keys, and a place with its monsters or cave dweller.
  vary: (pick, game) => {
    const item = pick(['ȯ', '⌐', '¡', '↑'], 0)
    const hearts = pick([3, 4, 5, 6, 7, 8], 1)
    const level = pick([1, 2, 3, 4, 5, 6, 7, 8, 9], 2)
    const keys = pick([0, 1, 2, 3], 3)
    const blade = pick([130, 250, 51], 6)
    const link = pick([hero(112, blade), hero(69, blade), hero(160, blade)], 5)
    const life = `-LIFE- ${'ღ'.repeat(hearts)}`
    // A lost heart turns white, as on the NES status bar.
    const hurt = [...Array(life.length - 1).fill(RED), WHITE]
    const items = `B${item} A†`
    const field = {
      topCaption: { left: [items, WHITE], right: [life, RED, [[0, []], [21, hurt], [29, []]]] },
      sprites: {
        ...game.sprites,
        ...link,
        foe: pick([RED_OCTOROK, pixelSprite(OCTOROK, { R: 33, W: 231, O: 117 })], 7),
        enemy: pick(
          [pixelSprite(MOBLIN, MOBLIN_COLORS), pixelSprite(LYNEL, { M: 220, F: 209, R: 160 }), LEEVER, PEAHAT, TEKTITE],
          8,
        ),
      },
    }
    const mountain = {
      ...field,
      sky: crags,
      ahead: slope,
      sprites: { ...field.sprites, foe: TEKTITE, enemy: pixelSprite(LYNEL, { M: 220, F: 209, R: 27 }) },
      cast: { ...game.cast, ...CHARGE, boulder: BOULDERS },
    }
    const haunt = {
      ...field,
      screen: [BLACK, paper(244), paper(244), paper(244)],
      sky: graves,
      ahead: aisle,
      sprites: { ...field.sprites, foe: GHINI, enemy: GHINI },
      cast: { ...game.cast, ...CHARGE },
    }
    // The padEnd call keeps the centered text in place as each word appears.
    const [npc, lines, gift, emptyHand] = pick(CAVE_DWELLERS, 10)
    const typed = lines.flatMap((line, row) => {
      const words = line.split(' ')
      return words.map((_, count) => [row * 6 + count, words.slice(0, count + 1).join(' ').padEnd(line.length)])
    })
    const dwelling = {
      loop: 28,
      screen: BLACK,
      speeds: [0, 0, 0, 0],
      sky: tiles(' ', {}),
      ahead: tiles(' ', {}),
      banner: [[...typed, [13, '']], WHITE],
      topCaption: { left: [[[0, `B${item} A${emptyHand}`], [13, items]], WHITE], right: [life, RED] },
      sprites: { ...game.sprites, ...link, npc, gift },
      cast: CAVE_CAST,
    }
    const [chamber, bossArt, bossColors] = DUNGEONS[level - 1]
    const dungeon = {
      ...chamber,
      loop: 44,
      topCaption: {
        left: [`LEVEL-${level}`, WHITE],
        center: [[[0, `Ϙ×${keys} ${items}`], [19, `Ϙ×${keys + 1} ${items}`]], WHITE],
        right: [life, RED, [[0, []], [12, hurt], [32, []]]],
      },
      flash: TRIFORCE_FLASH,
      sprites: {
        ...game.sprites,
        ...link,
        enemy: pick(DUNGEON_ENEMIES, 4),
        boss: pixelSprite(bossArt, bossColors),
        bossHit: pixelSprite(bossArt, Object.fromEntries(Object.keys(bossColors).map((key) => [key, 231]))),
      },
      cast: DUNGEON_CAST,
    }
    return pick([pick([field, dwelling, mountain, haunt], 11), dungeon], 9)
  },
  // Zelda has no score, so the board shows a rupee count.
  scoreboard: { left: 'LINK', right: '◊×{short}', ink: RED },
  logo: [
    ['THE LEGEND OF ', RED],
    ['ZELDA', ink(214)],
  ],
  border: COLOR.yellow,
  screen: [BLACK, paper(223), paper(223), paper(223)],
  speeds: [0, 1, 1, 1],
  // The backdrop is the black status bar.
  backdrop: tiles(' ', {}),
  sky: forest,
  ahead: path,
  base: tiles(' ', {}),
  topCaption: {
    left: ['Bȯ A†', WHITE],
    right: ['-LIFE- ღღღ', RED, [[0, []], [21, [...Array(9).fill(RED), WHITE]], [29, []]]],
  },
  icons: { fiveHour: 'life', sevenDay: 'triforce' },
  sprites: {
    ...hero(112, 250),
    foe: RED_OCTOROK,
    enemy: pixelSprite(MOBLIN, MOBLIN_COLORS),
    rock: { glyphs: ['●'], color: ink(94) },
    beam: pixelSprite([['HRRR', '....'], ['HCCC', '....']], { H: 94, C: 51, R: 196 }),
    shards: { glyphs: ['  ╲╱  \n  ╱╲  ', ' ╲  ╱ \n ╱  ╲ ', '╲    ╱\n╱    ╲'], color: [WHITE, ink(51), RED] },
    puff: pixelSprite(
      [
        ['....', '.ww.', '.ww.', '....'],
        ['w..w', '.cc.', '.cc.', 'w..w'],
        ['.r..', '...r', 'r...', '..r.'],
      ],
      { w: 231, c: 51, r: 196 },
    ),
    rupee: RUPEE,
    heart: pixelSprite([['R.R', '.R.'], ['B.B', '.B.']], { R: 196, B: 33 }),
    life: pixelSprite([['R.R', '.R.']], { R: 196 }),
    key: KEY,
    triforce: pixelSprite([['.Y.', 'YYY'], ['.y.', 'yyy']], { Y: 220, y: 229 }),
    fireball: { glyphs: ['●'], color: [ink(208), RED, ink(226)] },
    boulder: pixelSprite([BOULDER], BOULDER_COLORS),
    boulderTop: pixelSprite([BOULDER.slice(0, 2)], BOULDER_COLORS),
    boulderBottom: pixelSprite([BOULDER.slice(2)], BOULDER_COLORS),
    flame: pixelSprite(
      [
        ['.Y.', '.OY', 'ORO', 'RRR'],
        ['.Y.', 'YO.', 'ORO', 'RRR'],
      ],
      { Y: 226, O: 214, R: 202 },
    ),
    door: pixelSprite([['FKKF', 'FKKF']], { F: 250, K: 16 }),
  },
  // An Octorok's rock hurts Link. He stabs it, and the heart it drops heals him.
  // At full health, his beam kills the next monster, which drops a rupee.
  cast: {
    rupee: [[46, 'rupee', 5, -1, 'base'], [54]],
    heart: [[27, 'heart', -4, -1, 'base'], [29]],
    foe: [[0, 'foe', 43, -2, 'base'], [18, 'foe', 7, -1, 'base'], [20, 'foe', 5, -2, 'base'], [25]],
    enemy: [[24, 'enemy', 43, -2, 'base'], [41, 'enemy', 9, -1, 'base'], [43]],
    rock: [[18, 'rock', 4, -3, 'base'], [21]],
    puff: [[25, 'puff', -3, -1, 'base'], [27]],
    player: [
      [0, 'walk', -6, 0, 'base'],
      [21, 'hurt', -7, -2, 'base'],
      [23, 'hurt', -9, 0, 'base'],
      [24, 'stab', -9, 0, 'base'],
      [26, 'walk', -9, 0.5, 'base'],
      [32, 'walk', -6, 0, 'base'],
      [40, 'stab', -6, 0, 'base'],
      [42, 'walk', -6, 0, 'base'],
    ],
    beam: [[41, 'beam', 1, 3, 'base'], [43]],
    shards: [[43, 'shards', 5, -1, 'base'], [46]],
  },
}
