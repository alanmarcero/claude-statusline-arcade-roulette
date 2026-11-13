import { ink, paper, pixelRows, pixelSprite, pixelTiles, tiles } from '../art.js'
import { FIRE, MOON, RAIDEN, SCORPION, SUB_ZERO, TORCH, kombat } from './kombat.js'

const ROSTER = [
  SCORPION,
  SUB_ZERO,
  { name: 'LIU KANG', finish: 'fire', look: { h: 236, f: 180, t: 180, a: 180, l: 160 }, shot: { right: '●', inks: FIRE } },
  { name: 'JOHNNY CAGE', look: { h: 94, f: 16, t: 180, a: 180, l: 245 }, shot: { right: '●', inks: [46, 118] } },
  {
    name: 'SONYA',
    her: true,
    finish: 'fire',
    look: { h: 222, f: 180, t: 34, a: 180, l: 28 },
    shot: { right: '◎', inks: [213, 219] },
  },
  RAIDEN,
  { name: 'KANO', look: { h: 236, f: 196, t: 244, a: 180, l: 241 }, shot: { right: '×', inks: [255, 248] } },
]

// Mountains, a bridge and spikes.
const [pitBackdrop, pitSky, pitGround] = pixelRows(
  [
    '................................................................',
    '.........m.......................................m..............',
    '........mmm..........m......................m...mmm.............',
    '......mmmmmmm.......mmmm...........mm.....mmmmmmmmmm.....m......',
    '................................................................',
    'ssssssssjssssssssssssjsssssssssssssssjsssssssssssssjssssssssssss',
  ],
  { m: 237, s: 250, j: 245 },
)
const pit = {
  name: 'THE PIT',
  scenery: {
    stars: true,
    screen: [paper(17), paper(17), paper(18), paper(232)],
    backdrop: pitBackdrop,
    sky: pitSky,
    ahead: pitGround,
    base: tiles('  ▲ ▲▴    ▲   ▲▲ ▲     ▲  ▲ ', { '▲': ['▲', ink(240)], '▴': ['▲', ink(88)] }),
  },
  ...MOON,
}

// Pavilions and monks. No cell has two colors, so captions and the fatality blackout show no colored boxes.
const [courtBackdrop, courtSky, courtGround] = pixelRows(
  [
    '.......................................',
    'eRRRoRRRRRRRRRe.......eRRRRRRoRRRRRRe..',
    '..p...y...p...........p...y...p........',
    '..p..k....p...k.......p.......pk.......',
    '....mmm......mmm.............mmm.......',
    '.......................................',
  ],
  { o: 220, R: 23, e: 30, p: 88, y: 214, k: 137, m: 94 },
)
const courtyard = {
  name: 'COURTYARD',
  scenery: {
    screen: [paper(61), paper(236), paper(236), paper(248)],
    backdrop: courtBackdrop,
    sky: courtSky,
    ahead: courtGround,
    base: pixelTiles(['...........', '....k......'], { k: 244 }),
  },
}

// Stalactites, torches and bones. No drip is beside the banner at widths 30, 54 and 90.
const lair = {
  name: "GORO'S LAIR",
  scenery: {
    screen: [paper(233), paper(234), paper(234), paper(95)],
    backdrop: pixelTiles(
      ['cccccccccccccccccccccccccccccccccccccccc', '.cc..c...cc.....c..ccc....c....cc..c....'],
      { c: 238 },
    ),
    sky: tiles('  ┆         F                    F      ', {
      '┆': ['┆', ink(240)],
      F: TORCH,
    }),
    ahead: pixelTiles(
      ['..........w.h..............w.....h......', '..ww....wwwwh.........w...wwww...h......'],
      { w: 252, h: 94 },
    ),
    base: pixelTiles(['.........w..............w........', 'd..................d.............'], { d: 237, w: 250 }),
  },
}

// Goro and Shang Tsung.
const BOSSES = [
  pixelSprite(
    [
      ['..kh..', 'a.ss.a', 'aassaa', '.l..l.'],
      ['..kh..', '.assa.', 'aassaa', '.l..l.'],
    ],
    { k: 16, h: 172, a: 172, s: 179, l: 124 },
  ),
  pixelSprite(
    [
      ['g.fw.g', 'grrrrg', 'g.rr.g', 'gg..gg'],
      ['g.fw.g', 'grrrrg', 'grrr.g', 'gg..gg'],
    ],
    { g: 136, w: 252, f: 180, r: 124 },
  ),
]

export default kombat({
  id: 'mortal-kombat',
  scoreboard: { left: 'SCORPION {score}', right: 'SUB-ZERO {hi}' },
  logo: [['MORTAL KOMBAT', ink(214)]],
  roster: ROSTER,
  arenas: [pit, courtyard, lair],
  bosses: BOSSES,
  finishers: ['FATALITY'],
})
