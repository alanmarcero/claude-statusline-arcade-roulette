import { ink, paper, pixelRows, pixelSprite, pixelTiles, tiles } from '../art.js'
import { FIRE, FREEZE, MOON, SHAO_KAHN, SPEAR, TORCH, kombat } from './kombat.js'

const ROSTER = [
  { name: 'SUB-ZERO', finish: 'ice', look: { h: 237, f: 180, t: 33, a: 33, l: 25 }, shot: FREEZE },
  {
    name: 'SEKTOR',
    finish: 'fire',
    look: { h: 160, f: 238, t: 160, a: 160, l: 88 },
    shot: { right: '▶', left: '◀', trail: '·', inks: [196, 244] },
  },
  { name: 'CYRAX', look: { h: 178, f: 238, t: 178, a: 178, l: 136 }, shot: { right: '#', inks: [46, 40], stun: 'net' } },
  { name: 'SMOKE', look: { h: 250, f: 238, t: 250, a: 250, l: 244 }, shot: SPEAR },
  { name: 'NIGHTWOLF', look: { h: 237, f: 137, t: 137, a: 137, l: 24 }, shot: { right: '→', left: '←', inks: [118, 46] } },
  {
    name: 'SINDEL',
    her: true,
    finish: 'fire',
    look: { x: 255, h: 255, f: 180, t: 91, a: 180, l: 91 },
    shot: { right: '≈', inks: [219, 231] },
  },
  { name: 'STRYKER', look: { h: 237, f: 180, t: 25, a: 25, l: 237 }, shot: { right: '•', inks: [64, 244] } },
  {
    name: 'SONYA',
    her: true,
    finish: 'fire',
    look: { h: 222, f: 180, t: 28, a: 180, l: 28 },
    shot: { right: '◎', inks: [213, 219] },
  },
  { name: 'JAX', look: { h: 94, f: 94, t: 94, a: 250, l: 28 }, shot: { right: '◉', inks: [196, 208] } },
  { name: 'KANO', look: { h: 237, f: 196, t: 244, a: 180, l: 238 }, shot: { right: '×', inks: [255, 248] } },
  { name: 'SHEEVA', her: true, look: { h: 160, f: 172, t: 160, a: 172, l: 160 }, shot: { right: '●', inks: FIRE } },
]

// No caption or actor covers the EXIT sign, because its red paper would show.
const subway = {
  name: 'SUBWAY',
  scenery: {
    screen: [paper(234), paper(233), paper(233), paper(242)],
    backdrop: tiles('            ━━━━━           ━━━━━       ━━━━━             EXIT    ━━━━━                   ', {
      '━': ['━', [ink(231), ink(231), ink(231), ink(231), ink(244)]],
      E: ['E', ink(196), paper(52)],
      X: ['X', ink(196), paper(52)],
      I: ['I', ink(196), paper(52)],
      T: ['T', ink(196), paper(52)],
    }),
    sky: tiles(' ', {}),
    ahead: tiles(' ', {}),
    base: pixelTiles(['y', '.'], { y: 136 }),
  },
  props: { train: [[5, 'train', -84, 6], [27]] },
  sprites: {
    train: pixelSprite(
      [
        [
          'ssssssssssssssssssss..ssssssssssssssssssss',
          'swwswwswwswwswwswwss..swwswwswwswwswwswwsy',
          'rrrrrrrrrrrrrrrrrrrr..rrrrrrrrrrrrrrrrrrrr',
          '..kk...........kk.......kk...........kk...',
        ],
      ],
      { s: 242, w: 143, y: 230, r: 52, k: 236 },
    ),
  },
}

// No window is beside the banner at widths 30, 54 and 90. The boss does not hide the fire.
const street = {
  name: 'THE STREET',
  scenery: {
    stars: true,
    screen: [paper(17), paper(235), paper(235), paper(238)],
    backdrop: pixelTiles(
      ['..bbbb.....bbb.........bbbbb......bbbb...', '..bbbb....bbbbb.......bbbbbb.....bbbbb...'],
      { b: 236 },
    ),
    sky: tiles('   W        W             W              W        ', {
      W: ['▄', [ink(222), ink(222), ink(222), ink(94)]],
    }),
    ahead: tiles('  BAR     F                                                                       ▙       ', {
      B: ['B', [ink(213), ink(213), ink(213), ink(90)], paper(52)],
      A: ['A', [ink(213), ink(213), ink(90), ink(213)], paper(52)],
      R: ['R', [ink(213), ink(90), ink(213), ink(213)], paper(52)],
      F: TORCH,
      '▙': ['▟', ink(124)],
    }),
    base: pixelTiles(['..............', 'yyy...........'], { y: 220 }),
  },
}

// Spires, a bridge and spikes. The banner row is not crimson, because red text does not show on crimson.
const [pitBackdrop, pitSky, pitGround] = pixelRows(
  [
    '...........k...........................k..........',
    '..........kk..........................kkk.........',
    '..........kk.....k...................kkkk.....k...',
    '.....k...kkkk...kkk.......kk........kkkkkk...kkk..',
    '..................................................',
    'ssssssssssssjsssssssssssssssssjsssssssssssssssssss',
  ],
  { k: 233, s: 248, j: 244 },
)
const pit = {
  name: 'THE PIT 3',
  scenery: {
    screen: [paper(89), paper(53), paper(53), paper(232)],
    backdrop: pitBackdrop,
    sky: pitSky,
    ahead: pitGround,
    base: tiles(' ▲▴  ▲   ▲▲  ▴ ▲    ▲  ▲▴ ', { '▲': ['▲', ink(243)], '▴': ['▲', ink(124)] }),
  },
  ...MOON,
}

// Bare trees and tombstones.
const [graveBackdrop, graveSky, graveGround] = pixelRows(
  [
    '..b.b.........................b..b.......',
    '...bb..........................bb........',
    '...b..........c...............b....c.....',
    '...b.........ccc.......c......b...ccc....',
    '...b.........ccc......ccc.....b...ccc....',
    '...b.........ccc......ccc.....b...ccc....',
  ],
  { b: 237, c: 241 },
)
const graveyard = {
  name: 'GRAVEYARD',
  scenery: {
    stars: true,
    screen: [paper(17), paper(17), paper(236), paper(22)],
    backdrop: graveBackdrop,
    sky: graveSky,
    ahead: graveGround,
    base: pixelTiles(['.....g........g..', '..g......g.......'], { g: 28 }),
  },
  ...MOON,
}

// Shao Kahn and Motaro the centaur.
const BOSSES = [
  SHAO_KAHN,
  pixelSprite(
    [
      ['kh....', 'tt....', 'tbbbbb', 'b.b..b'],
      ['kh....', 'tt....', 'tbbbbb', '.b.bb.'],
    ],
    { k: 231, h: 103, t: 103, b: 94 },
  ),
]

export default kombat({
  id: 'mortal-kombat-3',
  scoreboard: { left: 'SUB-ZERO {score}', right: 'SEKTOR {hi}' },
  logo: [['MORTAL KOMBAT ', ink(33)], ['3', ink(214)]],
  roster: ROSTER,
  arenas: [subway, street, pit, graveyard],
  bosses: BOSSES,
  finishers: ['FATALITY', 'FATALITY', 'ANIMALITY', 'BABALITY'],
  timer: true,
})
