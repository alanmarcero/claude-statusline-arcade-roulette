import { OPAQUE, ink, paper, pixelRows, pixelSprite, pixelTiles, tiles } from '../art.js'
import { FIRE, RAIDEN, SCORPION, SHAO_KAHN, SUB_ZERO, TORCH, kombat } from './kombat.js'

const ROSTER = [
  { name: 'LIU KANG', finish: 'fire', look: { h: 160, f: 180, t: 180, a: 180, l: 239 }, shot: { right: '●', inks: FIRE } },
  { name: 'KUNG LAO', look: { x: 247, h: 247, f: 180, t: 26, a: 26, l: 237 }, shot: { right: 'Θ', inks: [252, 245] } },
  { name: 'KITANA', her: true, look: { h: 237, f: 39, t: 33, a: 180, l: 33 }, shot: { right: '◆', inks: [117, 153] } },
  { name: 'MILEENA', her: true, look: { h: 237, f: 163, t: 163, a: 180, l: 163 }, shot: { right: '†', inks: [218, 252] } },
  { name: 'JAX', look: { h: 94, f: 94, t: 94, a: 94, l: 134 }, shot: { right: '≈', inks: [177, 213] } },
  { name: 'BARAKA', look: { h: 144, f: 231, t: 95, a: 144, l: 95 }, shot: { right: '※', inks: [231, 153] } },
  { name: 'REPTILE', look: { h: 34, f: 223, t: 34, a: 34, l: 28 }, shot: { right: '●', inks: [118, 154] } },
  SCORPION,
  SUB_ZERO,
  RAIDEN,
  { name: 'SHANG TSUNG', finish: 'fire', look: { h: 237, f: 180, t: 124, a: 124, l: 124 }, shot: { right: 'ʘ', inks: FIRE } },
]

// No hook is beside the banner at widths 30, 54 and 90.
const deadPool = {
  name: 'DEAD POOL',
  scenery: {
    screen: [paper(233), paper(234), paper(234), paper(22)],
    backdrop: tiles('  ┆         ┆                   ┆                       ┆       ┆        ┆                ', {
      '┆': ['┆', ink(239)],
    }),
    sky: tiles('  ⌡                             ⌡                       ⌡                ⌡                ', {
      '⌡': ['⌡', ink(245)],
    }),
    ahead: pixelTiles(['....................', 'gggggggggrgggggggggg'], { g: 245, r: 248 }),
    base: tiles('  ≈    o      ≈~     °    ≈      o      ', {
      '≈': ['≈~', [ink(40), ink(46)]],
      '~': ['~≈', [ink(46), ink(40)]],
      o: ['o°· ', ink(118)],
      '°': ['°· o', ink(118)],
    }),
  },
}

// Trees with blinking eyes. No tree has paper, so captions and the fatality blackout show no colored boxes.
const forest = {
  name: 'LIVING FOREST',
  scenery: {
    screen: [paper(233), paper(233), paper(233), paper(58)],
    backdrop: pixelTiles(
      ['llllllll...lllllllllllllll....lllllllllllll', 'l.lllll.....l..llllll.ll......l.llllll..lll'],
      { l: 22 },
    ),
    sky: tiles('  TETET           TETET           ', {
      T: ['█', ink(58)],
      E: ['▄▄▄█', [ink(226), ink(226), ink(226), ink(58)]],
    }),
    ahead: tiles('  TMMMT           TMMMT           ', { T: ['█', ink(58)], M: ['▄', ink(58)] }),
    base: pixelTiles(['.....r......................r.....', '..g.....g.........g......g........'], { r: 94, g: 28 }),
  },
}

// The gate hides during the fatality blackout.
const [portalBackdrop, portalSky, portalGround] = pixelRows(
  [
    '..............................................',
    '..............................................',
    '......r..................r.r..................',
    '.....rrr.......r........rrrrr..........r......',
    '..............................................',
    'ssssssssssssssssssssssssssssssssssssssssssssss',
  ],
  { r: 54, s: 245 },
)
const portal = {
  name: 'THE PORTAL',
  scenery: {
    stars: true,
    screen: [paper(53), paper(53), paper(54), paper(16)],
    backdrop: portalBackdrop,
    sky: portalSky,
    ahead: portalGround,
    base: pixelTiles(['......p.........', '..........p.....'], { p: 54 }),
  },
  props: { gate: [[0, 'gate', -21, 0, 'sky'], [49], [51, 'gate', -21, 0, 'sky']] },
  sprites: {
    gate: pixelSprite(
      [
        ['.pwq.', 'q...p', 'p...w', '.qpq.'],
        ['.qpw.', 'p...q', 'w...p', '.pqp.'],
      ],
      { p: 213, q: 129, w: 231 },
    ),
  },
}

// No torch is beside the banner at widths 30, 54 and 90.
const tomb = {
  name: 'KOMBAT TOMB',
  scenery: {
    screen: [paper(234), paper(235), paper(235), paper(239)],
    backdrop: tiles(' ▼▼ ▼   ▼▼▼  ▼  ▼▼ ▼    ▼▼ ▼  ▼▼▼ ▼  ', { '▼': ['▼', ink(244)] }),
    sky: tiles('  F         C                   F            C         F      C       F         C         ', {
      C: ['█', ink(238)],
      F: TORCH,
    }),
    ahead: tiles('  ▌         C                   ▌            C         ▌      C       ▌         C         ', {
      C: ['█', ink(238)],
      '▌': ['▐', ink(94)],
    }),
    base: pixelTiles(['..........', '.....j....'], { j: 243 }),
  },
}

// Shao Kahn and Kintaro.
const BOSSES = [
  SHAO_KAHN,
  pixelSprite(
    [
      ['..oo..', 'a.ok.a', 'aakoaa', '.l..l.'],
      ['..oo..', '.aoka.', 'aakoaa', '.l..l.'],
    ],
    { o: 208, k: 16, a: 208, l: 130 },
  ),
]

// TOASTY! rises at the uppercut.
const TOASTY = {
  sprites: {
    toastyRise: { glyphs: ['▄▄'], color: ink(94) },
    toasty: {
      glyphs: [`▀▀${OPAQUE}TOASTY!${OPAQUE}`],
      colors: [[ink(94), ink(94), '', ...Array(7).fill(ink(214))]],
      backgrounds: [[paper(223), paper(223)]],
    },
  },
  cast: { toasty: [[34, 'toastyRise', 0, 0, 'base'], [35, 'toasty', 0, 0, 'base'], [38]] },
}

export default kombat({
  id: 'mortal-kombat-2',
  scoreboard: { left: 'LIU KANG {score}', right: 'SHAO KAHN {hi}' },
  logo: [['MORTAL KOMBAT ', ink(214)], ['II', ink(196)]],
  roster: ROSTER,
  arenas: [deadPool, forest, portal, tomb],
  bosses: BOSSES,
  finishers: ['FATALITY', 'FATALITY', 'FRIENDSHIP', 'BABALITY'],
  extra: TOASTY,
})
