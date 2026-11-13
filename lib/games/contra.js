import { COLOR, ink, paper, pixelSprite, pixelTiles, sprite, tiles } from '../art.js'

const WHITE = ink(231)
const FIRE = [ink(226), ink(208), ink(196), ink(214)]
const FLASH = 231

const RUN = [
  ['.hs..', 'sssgg', '.pp..', 'p..p.'],
  ['.hs..', 'sssgg', '.pp..', '.pp..'],
]
const COMMANDOS = [
  ['1P', ink(33), 27],
  ['2P', ink(196), 196],
].map(([label, labelInk, pants]) => {
  const palette = { h: 160, s: 215, g: 250, p: pants, y: 226 }
  const sprites = {
    run: pixelSprite(RUN, palette),
    fire: pixelSprite([['.hs...', 'sssggy', '.pp...', 'p..p..']], palette),
    drop: pixelSprite([['.hs..', 'sssgg', '.pp..', 'p...p']], palette),
    hit: pixelSprite([RUN[0]], { h: FLASH, s: FLASH, g: FLASH, p: FLASH }),
    flip: pixelSprite([['hs.pp', 'sssp.']], palette),
    fall: pixelSprite([['pp.', '.ps', 'ssh', '.s.']], palette),
    dead: pixelSprite([['.....', 'pphss'], ['.....', '.....']], palette),
  }
  return [label, labelInk, sprites]
})

// The shots are a fan, a stream, a beam, a corkscrew and tracers.
const WEAPONS = [
  ['S', ink(196), { glyphs: ['●\n ●\n●'], color: ink(196) }],
  ['M', WHITE, { glyphs: [' \n• • •\n '], color: [WHITE, ink(208)] }],
  ['L', ink(51), { glyphs: [' \n━━━━\n '], color: [ink(51), WHITE, ink(51), ink(159)] }],
  ['F', ink(208), { glyphs: [' \n●\n ', '●\n \n ', ' \n●\n ', ' \n \n●'], color: [ink(208), ink(196), ink(214)] }],
  ['R', ink(226), { glyphs: [' \n─•─•\n '], color: ink(226) }],
].map(([letter, letterInk, shot]) => ({
  letter,
  letterInk,
  shot,
  falcon: sprite(['▀L▀', '▀l▀'], {
    '▀': ['▀', ink(196)],
    L: [letter, WHITE, paper(196)],
    l: [letter, ink(226), paper(196)],
  }),
}))

const BOOM = pixelSprite(
  [
    ['..w..', '.wyw.', '..w..', '.....'],
    ['y.o.y', '.oyo.', 'oywyo', '.oyo.'],
    ['o...o', '..r..', 'r.o.r', '.r.r.'],
  ],
  { w: 231, y: 226, o: 208, r: 196 },
)

// The jungle has palms, a sniper tower and the Red Falcon base wall.
// The stage signs are on the sky row, so the top captions never cover them.
const JUNGLE_BAND = {
  F: ['█', ink(34)],
  f: ['▀', ink(34)],
  t: ['▄', ink(94)],
  w: ['▄', ink(240)],
  W: ['█', ink(240)],
  魂: ['魂', ink(214), paper(236)],
  斗: ['斗', ink(214), paper(236)],
  羅: ['羅', ink(214), paper(236)],
  p: ['▄', ink(245)],
  s: ['▀', [ink(248), ink(248), ink(248), ink(226)], paper(245)],
  j: ['▄', ink(22)],
  J: ['█', ink(22)],
  R: ['█', ink(94)],
  C: ['▄', [ink(196), ink(226)], paper(240)],
  D: ['▄', ink(16), paper(240)],
  l: ['▐', ink(245)],
  L: ['▌', ink(245)],
}
const RIVER = {
  '~': ['~≈', [ink(117), ink(153)]],
  '≈': ['≈~', [ink(153), ink(117)]],
}
const jungle = {
  screen: [paper(16), paper(16), paper(16), paper(25)],
  backdrop: tiles('FftfF   FftfF      FftfF   wwwWWDWCWDWwww   FftfF      psp      ', JUNGLE_BAND),
  sky: tiles('jJRJjjjjjJRJjjjJJjjjJRJjjjjWWWW魂斗羅WWWWjjjjJRJjjjJJjjljLjjjjjj', JUNGLE_BAND),
  ahead: pixelTiles(['p...p...p...p...', 'dddsdddsdddsddds'], { p: 244, d: 250, s: 242 }),
  trail: tiles('  b  s x   b s   x  s  b   x s  ', {
    ' ': ['▄', ink(25)],
    x: ['▄', ink(238)],
    b: ['▄▃▄▂', FIRE],
    s: ['▀', [ink(244), ink(240), ink(16), ink(242)], paper(25)],
  }),
  base: tiles('  ~     ≈       ~    ≈        ', RIVER),
  topCaption: { right: ['JUNGLE', WHITE] },
}

// The lair has flesh walls with ribs and eggs.
// Buggers replace the soldiers and an egg pod replaces the sniper.
const LAIR_BAND = {
  a: ['▄', ink(181)],
  A: ['▀', ink(181)],
  B: ['█', ink(181)],
  e: ['▄', [ink(211), ink(211), ink(196)]],
  E: ['▀', [ink(211), ink(211), ink(196)], paper(125)],
  心: ['心', [ink(203), ink(211)], paper(53)],
  臓: ['臓', [ink(203), ink(211)], paper(53)],
  P: [' ', '', paper(53)],
}
const lair = {
  screen: [paper(52), paper(52), paper(52), paper(88)],
  backdrop: tiles('  aAa          e     aAa      PPPPPP        aAa      e          ', LAIR_BAND),
  sky: tiles('  B B         EE     B B      P心臓P        B B     EE          ', LAIR_BAND),
  ahead: pixelTiles(['................', 'ffffbfffffffbfff'], { f: 168, b: 125 }),
  trail: pixelTiles(['................', 'ffffbfffffffbfff'], { f: 168, b: 125 }),
  base: tiles(' ~      ~       ~   ', { '~': ['~≈', [ink(168), ink(125)]] }),
  topCaption: { right: ['ALIEN LAIR', WHITE] },
  sprites: {
    soldier: pixelSprite(
      [
        ['.ww.', 'rwww', 'wwww', 'l..l'],
        ['.ww.', 'rwww', 'wwww', '.ll.'],
      ],
      { w: 255, r: 196, l: 217 },
    ),
    sniper: pixelSprite([['.pp.', 'pppp', 'pkkp', 'pppp'], ['.pp.', 'prrp', 'prrp', 'pppp']], { p: 211, r: 196, k: 125 }),
    bullet: { glyphs: [' \n●\n '], color: [ink(231), ink(213)] },
  },
}
// The lair has no river, so the player falls flat.
const LAIR_FALL = [[65, 'dead', -14, -1], [67]]

export default {
  id: 'contra',
  loop: 68,
  // Deals Bill or Lance, a weapon, a stage, the spare medals and the banner.
  vary: (pick, game) => {
    const [label, labelInk, moves] = pick(COMMANDOS, 0)
    const weapon = pick(WEAPONS, 1)
    const isLair = pick([false, true], 3)
    const stage = isLair ? lair : jungle
    const cast = isLair ? { ...game.cast, fallen: LAIR_FALL } : game.cast
    return {
      ...stage,
      scoreboard: { ...game.scoreboard, left: `${label} {score}`, ink: labelInk },
      topCaption: { ...stage.topCaption, left: ['ǒ'.repeat(pick([1, 2, 3, 4], 2)), labelInk] },
      caption: { right: [[[0, ''], [44, weapon.letter]], weapon.letterInk] },
      banner: pick(
        [
          [[[0, '1UP'], [4, '']], WHITE],
          [[[0, 'CONTINUE'], [4, '']], WHITE],
          [[[0, ''], [63, 'GAME OVER']], ink(203)],
        ],
        4,
      ),
      sprites: { ...game.sprites, ...moves, weapon: weapon.shot, falcon: weapon.falcon, ...stage.sprites },
      cast,
    }
  },
  scoreboard: { left: '1P {score}', right: 'HI {hi}', ink: ink(33) },
  logo: [
    ['CONTRA ', ink(196)],
    ['魂斗羅', ink(214)],
  ],
  border: COLOR.orange,
  speeds: [0.5, 0.5, 1, 1],
  ...jungle,
  topCaption: { left: ['ǒǒǒ', ink(33)], right: ['JUNGLE', WHITE] },
  caption: { right: [[[0, ''], [44, 'S']], ink(196)] },
  banner: [[[0, '1UP'], [4, '']], WHITE],
  icons: { fiveHour: 'falcon', sevenDay: 'capsule' },
  sprites: {
    ...COMMANDOS[0][2],
    weapon: WEAPONS[0].shot,
    falcon: WEAPONS[0].falcon,
    rifle: { glyphs: [' \n•\n '], color: WHITE },
    bullet: { glyphs: [' \n•\n '], color: ink(203) },
    soldier: pixelSprite(
      [
        ['.cc', 'suu', 'uuu', 'l.l'],
        ['.cc', 'suu', 'uuu', '.ll'],
      ],
      { c: 241, s: 215, u: 252, l: 245 },
    ),
    sniper: pixelSprite([['..cc', 'ggsu', '..uu', '.uul']], { c: 241, s: 215, u: 252, l: 245, g: 248 }),
    capsule: pixelSprite([['r..r', 'gGGg'], ['....', 'rGGr']], { r: 196, g: 250, G: 254 }),
    boom: BOOM,
    splash: pixelSprite([['w..w', '.ww.'], ['.w.w', 'w.w.']], { w: 153 }),
  },
  // The player drops in, shoots a soldier and shoots open a capsule for a new weapon.
  // The new weapon kills two soldiers.
  // A sniper and the player shoot each other, and the player falls into the river.
  // Explosions destroy the bridge behind the player.
  cast: {
    blast: [[4, 'boom', -15, -1], [7], [20, 'boom', -15, -1], [23], [36, 'boom', -15, -1], [39], [52, 'boom', -15, -1], [55]],
    capsule: [[16, 'capsule', -45, 3, 'backdrop'], [30, 'capsule', -3, 3, 'sky'], [31, 'boom', -1, 0, 'sky'], [34]],
    falcon: [[32, 'falcon', 0, 1, 'backdrop'], [34, 'falcon', 2, 0, 'sky'], [35, 'falcon', 2, -1], [44]],
    soldier: [[0, 'soldier', 44, -3], [11, 'boom', 10, -1], [14], [38, 'soldier', 44, -3], [50, 'boom', 8, -1], [53]],
    second: [[40, 'soldier', 44, -3], [52, 'boom', 8, -1], [55]],
    sniper: [[46, 'soldier', 44, -3], [57, 'sniper', 11, -1], [61, 'boom', 7, -1], [64]],
    bullet: [[59, 'bullet', 8, -5, 'ground'], [62]],
    fallen: [[65, 'splash', -13, -1, 'base'], [67]],
    player: [
      [0, 'drop', -10, 0, 'sky'],
      [1, 'run', -10],
      [8, 'fire', -10],
      [9, 'run', -10],
      [30, 'fire', -10],
      [31, 'run', -10],
      [47, 'fire', -10],
      [48, 'run', -10],
      [49, 'fire', -10],
      [50, 'run', -10],
      [58, 'fire', -10],
      [59, 'run', -10],
      [62, 'hit', -10],
      [63, 'flip', -12, 0, 'sky'],
      [64, 'fall', -13],
      [65],
    ],
    shot: [
      [8, 'rifle', -5, 5, 'ground'],
      [11],
      [30, 'rifle', -5, 5, 'ground'],
      [31],
      [47, 'weapon', -5, 5, 'ground'],
      [50],
      [58, 'weapon', -5, 5, 'ground'],
      [61],
    ],
    volley: [[49, 'weapon', -5, 5, 'ground'], [52]],
  },
}
