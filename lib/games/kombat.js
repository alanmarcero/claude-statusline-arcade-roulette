import { COLOR, ink, paper, pixelSprite, sprite } from '../art.js'

const WHITE = ink(231)
const RED = ink(196)
const GOLD = ink(214)
const BAR = ink(46)
const BLOOD = ink(160)
const BAR_LENGTH = 10
const BAR_CELLS = '▄'.repeat(BAR_LENGTH)
const MEDALS = ['', '◉']

// The poses face right. Look keys: h hair or hood, x hat brim or long hair, f face, t torso, a arms, l legs.
const POSES = {
  stance: [
    ['xhfa.', '.tt..', '.ll..', 'l..l.'],
    ['xhfx.', '.tta.', '.ll..', 'l..l.'],
  ],
  walk: [
    ['xhfx.', '.tta.', '.ll..', 'l..l.'],
    ['xhfx.', '.tta.', '.ll..', '.ll..'],
  ],
  punch: [['xhfx.', '.ttaa', '.ll..', 'l..l.']],
  kick: [['xhfx.', 'att..', '.llll', 'l....']],
  hit: [['hfx..', '.tt..', '..ll.', '.l..l']],
  throw: [['xhfx.', '.ttaa', '.ll..', 'l...l']],
  block: [['xhfa.', '.taa.', '.ll..', 'l..l.']],
  duck: [['.....', 'xhfa.', '.tt..', 'll.l.']],
  uppercut: [['...a.', 'xhfa.', '.tt..', '.ll..', '.l.l.']],
  victory: [
    ['...a.', 'xhfa.', '.tt..', '.ll..', 'l..l.'],
    ['.....', 'xhfa.', '.tta.', '.ll..', 'l..l.'],
  ],
  flying: [['f.aa.', 'httll']],
  fallen: [['.f...', 'httll']],
  dizzy: [
    ['.xhf.', '.tt..', '.ll..', '.l.l.'],
    ['hfx..', '.tt..', '.ll..', 'l.l..'],
  ],
  netted: [['nhna.', '.ntn.', 'nln..', 'ln.n.']],
  baby: [
    ['..hf.', '..tw.'],
    ['..hf.', '.atw.'],
  ],
  beast: [
    ['....hh', 'ttttff', 'tttt..', 't.t.t.'],
    ['....hh', 'ttttff', 'tttt..', '.t.t.t'],
  ],
}
// The second reverse restores the row order.
const MIRRORED = Object.fromEntries(
  Object.keys(POSES).map((pose) => {
    const frames = POSES[pose].map((rows) => [...rows.join('|')].reverse().join('').split('|').reverse())
    return [pose, frames]
  }),
)
const ICE = { h: 195, x: 195, f: 231, t: 159, a: 195, l: 117 }

const EFFECTS = {
  bloodRight: { glyphs: ['▗▘  \n    ', ' ▝ ▘\n  ▖ ', '    \n ▖ ▗'], color: BLOOD },
  bloodLeft: { glyphs: ['  ▝▖\n    ', '▝ ▘ \n ▗  ', '    \n▖ ▗ '], color: BLOOD },
  burst: { glyphs: ['▝▗▘ ▖\n ▖▘  ', '▘ ▝ ▗▖\n  ▖ ▘ ', ' ▖  ▘\n ▗ ▖ ▝'], color: BLOOD },
  stars: { glyphs: ['* ·', '· *'], color: ink(226) },
  rainbow: { glyphs: ['▗▄▄▄▄▄▖'], color: [RED, ink(208), ink(226), BAR, ink(33), ink(129)] },
  blank: { glyphs: [' '] },
}

// Fire burns the rival to bones. Blood bursts it. Ice shatters its frozen stance.
const BONES = pixelSprite([['..w..', 'wkwkw']], { w: 230, k: 238 })
const FLASH = pixelSprite([['..ww.', '...ww', '..ww.', '.w.w.']], { w: 231 })
const BURST = sprite(['▘ ▖ ▝\n ▗▘ ▖', '▝  ▘  ▗\n  b c '], {
  '▘': ['▘', BLOOD],
  '▖': ['▖', BLOOD],
  '▝': ['▝', BLOOD],
  '▗': ['▗', BLOOD],
  b: ['▖', WHITE],
  c: ['▝', WHITE],
})
const FATALITIES = {
  fire: {
    fatal1: pixelSprite(
      [
        ['.r.y.', '.oyo.', '.yro.', '..oy.', '.o..r'],
        ['..y.r', '.yoy.', '.ory.', '..yo.', '.r..o'],
      ],
      { y: 226, o: 208, r: 196 },
    ),
    fatal2: pixelSprite([['..ww.', '.wkw.', '..w..', 'w..w.']], { w: 254, k: 240 }),
    fatal3: BONES,
  },
  ice: {
    fatal2: { glyphs: ['▝ ▗ ▘\n ▘▖ ▝', '▘   ▝ ▖\n  ▗  ▘'], color: [ink(195), ink(231), ink(117)] },
    fatal3: pixelSprite([['.....', 'ikwki']], { i: 117, w: 195, k: 238 }),
  },
  blood: { fatal1: FLASH, fatal2: BURST, fatal3: pixelSprite([['.w...', 'wrwkr']], { w: 230, r: 160, k: 238 }) },
}
const STUNS = { freeze: 'Frozen', net: 'Netted' }

// Cues are [frame, bar cells], timed to the hits in CAST.
const HERO_HEALTH = [[0, 10], [11, 9], [21, 7]]
const RIVAL_HEALTH = [[0, 10], [8, 9], [14, 8], [27, 6], [34, 1], [49, 0]]

// The loop: FIGHT!, a punch, two kicks, both shots, an uppercut, FINISH HIM!, the finisher, the walk back.
const CAST = {
  player: [
    [0, 'heroStance', -12],
    [5, 'heroWalk', -12, 2],
    [8, 'heroPunch', -5],
    [10, 'heroStance', -5],
    [11, 'heroHit', -5],
    [12, 'heroHit', -6],
    [13, 'heroStance', -6],
    [14, 'heroKick', -5],
    [16, 'heroWalk', -5, -1],
    [18, 'heroStance', -7],
    [21, 'heroStun', -7],
    [24, 'heroThrow', -7],
    [26, 'heroStance', -7],
    [33, 'heroDuck', -7],
    [34, 'heroUppercut', -7],
    [36, 'heroWalk', -7, -1],
    [41, 'heroStance', -11],
    [43, 'heroWalk', -11, 3],
    [48, 'heroFinisher', 4],
    [50, 'heroAfter', 4],
    [53, 'heroWalk', 4, -3],
    [59, 'heroVictory', -12],
  ],
  rival: [
    [0, 'rivalStance', 6],
    [5, 'rivalWalk', 6, -2],
    [8, 'rivalHit', -1],
    [9, 'rivalHit', 0],
    [10, 'rivalStance', 0],
    [11, 'rivalKick', -1],
    [13, 'rivalStance', -1],
    [14, 'rivalHit', -1],
    [15, 'rivalHit', 0],
    [16, 'rivalStance', 2, 0, 'sky'],
    [17, 'rivalStance', 5, 0, 'sky'],
    [18, 'rivalThrow', 6],
    [20, 'rivalStance', 6],
    [27, 'rivalStun', 6],
    [31, 'rivalStance', 5, -3, 'sky'],
    [34, 'rivalHit', -3, 0, 'sky'],
    [35, 'rivalFlying', 0, 0, 'sky'],
    [36, 'rivalFlying', 4, 0, 'sky'],
    [37, 'rivalFallen', 8],
    [39, 'rivalDuck', 8],
    [40, 'rivalDizzy', 8],
    [49, 'fatal1', 8],
    [51, 'fatal2', 8],
    [53, 'fatal3', 8],
  ],
  rivalShot: [[19, 'rivalShot', 4, -4, 'sky'], [22]],
  heroShot: [[25, 'heroShot', -2, 0, 'sky'], [28]],
  stars: [[40, 'stars', 9, 0, 'backdrop'], [45]],
  finisherFx: [[48, 'finisherFx', 6, 0, 'backdrop'], [54]],
  blood: [
    [8, 'bloodRight', 1],
    [10],
    [11, 'heroBlood', -9],
    [13],
    [14, 'bloodRight', 1],
    [16],
    [21, 'heroSplash', -10],
    [23],
    [27, 'rivalSplash', 8],
    [29],
    [34, 'burst', -3, 0, 'sky'],
    [37],
  ],
}

export const FIRE = [208, 226, 196]
export const TORCH = ['▲▴', FIRE.map(ink)]
export const SPEAR = { right: '▶', left: '◀', trail: '━', inks: [255, 250] }
export const FREEZE = { right: '●', inks: [195, 51, 231], stun: 'freeze' }

export const SCORPION = { name: 'SCORPION', finish: 'fire', look: { h: 220, f: 223, t: 220, a: 220, l: 178 }, shot: SPEAR }
export const SUB_ZERO = { name: 'SUB-ZERO', finish: 'ice', look: { h: 33, f: 223, t: 33, a: 33, l: 25 }, shot: FREEZE }
export const RAIDEN = {
  name: 'RAIDEN',
  look: { x: 252, h: 252, f: 231, t: 255, a: 255, l: 153 },
  shot: { right: 'ϟ', inks: [231, 117] },
}

// The moon hides during the fatality blackout.
export const MOON = {
  props: { moon: [[0, 'moon', -21, 0, 'sky'], [49], [51, 'moon', -21, 0, 'sky']] },
  sprites: { moon: pixelSprite([['.mmm.', 'mmmmM', 'mmmMM', '.mMM.']], { m: 230, M: 187 }) },
}

export const SHAO_KAHN = pixelSprite(
  [
    ['.hssh.', 'pprrpp', '.rrrr.', '.l..l.'],
    ['.hssh.', 'pprrpp', '.rrrr.', 'l....l'],
  ],
  { h: 238, s: 255, p: 248, r: 124, l: 240 },
)

// A session deals the fighters, the arena, the finisher, a flawless win, the round and the boss.
export const kombat = ({ roster, arenas, bosses, finishers, extra = { sprites: {}, cast: {} }, timer = false, ...game }) => {
  const scoreboard = { ...game.scoreboard, ink: ink(226) }
  const vary = (pick) => {
    const hero = pick(roster, 0)
    const rival = pick(roster.filter((entry) => entry !== hero), 1)
    const arena = pick(arenas, 4)
    const finisher = pick(finishers, 5)
    const isFlawless = pick([false, false, true], 2)
    const rivalWins = pick([0, 1], 7)

    const [heroSprites, rivalSprites] = [
      ['hero', POSES, hero.look],
      ['rival', MIRRORED, rival.look],
    ].map(([side, poses, look]) => {
      const named = Object.keys(poses).map((pose) => {
        const name = `${side}${pose[0].toUpperCase()}${pose.slice(1)}`
        return [name, pixelSprite(poses[pose], { n: 40, w: 255, ...look })]
      })
      const ice = Object.fromEntries(Object.keys(look).map((key) => [key, ICE[key]]))
      const frozen = [`${side}Frozen`, pixelSprite(poses.stance.slice(0, 1), ice)]
      const bust = [`${side}Bust`, pixelSprite([poses.stance[0].slice(0, 2)], look)]
      return Object.fromEntries([...named, frozen, bust])
    })

    const [heroBar, rivalBar] = [
      ['left', isFlawless ? [[0, 10]] : HERO_HEALTH],
      ['right', RIVAL_HEALTH],
    ].map(([side, cues]) =>
      cues.map(([t, health]) => {
        const full = Array(health).fill(BAR)
        const lost = Array(BAR_LENGTH - health).fill(RED)
        return [t, side === 'left' ? [...full, ...lost] : [...lost, ...full]]
      }),
    )

    // The rival's shot moves left as fast as it grows, so its rope stays at the hand.
    const [heroShot, rivalShot] = [hero, rival].map(({ shot: { right, left = right, trail = ' ', inks } }, index) => {
      const isRival = index === 1
      const reach = [0, 4, 8]
      return {
        glyphs: reach.map((length) => {
          const rope = trail.repeat(length)
          return isRival ? `${left}${rope}` : `${rope}${right}`
        }),
        colors: reach.map((length, frame) => {
          const rope = Array(length).fill(ink(inks.at(-1)))
          const head = ink(inks[frame % inks.length])
          return isRival ? [head, ...rope] : [...rope, head]
        }),
      }
    })

    const finishes = {
      FATALITY: { fatal1: rivalSprites.rivalFrozen, ...FATALITIES[hero.finish ?? 'blood'] },
      BABALITY: { fatal1: FLASH, fatal2: rivalSprites.rivalBaby, fatal3: rivalSprites.rivalBaby },
      FRIENDSHIP: {
        fatal1: rivalSprites.rivalDizzy,
        fatal2: rivalSprites.rivalStance,
        fatal3: rivalSprites.rivalStance,
        finisherFx: EFFECTS.rainbow,
      },
      ANIMALITY: {
        fatal1: rivalSprites.rivalHit,
        fatal2: BURST,
        fatal3: BONES,
        heroFinisher: heroSprites.heroBeast,
        heroAfter: heroSprites.heroBeast,
      },
    }
    // The clock stops at the uppercut, frame 34.
    const clock = Array.from({ length: 35 }, (_, t) => [t, String(99 - t)])
    const flawless = isFlawless ? [[62, 'FLAWLESS VICTORY']] : []

    // stars: false stops a starless arena from inheriting the first arena's stars.
    return {
      speeds: [0, 0, 0, 0],
      stars: false,
      ...arena.scenery,
      scoreboard: { ...scoreboard, left: `${hero.name} {score}`, right: `${rival.name} {hi}` },
      topCaption: {
        left: [BAR_CELLS, BAR, heroBar],
        right: [BAR_CELLS, BAR, rivalBar],
        // Captions cover actors, so the name hides while the rival is in the sky row.
        center: [[[0, arena.name], [16, ''], [18, arena.name], [31, ''], [37, arena.name]], GOLD],
      },
      caption: {
        left: [[[0, '◉'], [59, '◉◉']], GOLD],
        right: timer ? [clock, WHITE] : [MEDALS[rivalWins], GOLD],
      },
      banner: [
        [
          [0, `ROUND ${2 + rivalWins}`],
          [3, 'FIGHT!'],
          [5, ''],
          [40, rival.her ? 'FINISH HER!' : 'FINISH HIM!'],
          [44, ''],
          [50, finisher],
          [54, ''],
          [59, `${hero.name} WINS`],
          ...flawless,
        ],
        [[0, WHITE], [3, RED], [40, [RED, BLOOD]], [59, WHITE]],
      ],
      flash: [[0, {}], [49, { screen: paper(16), ink: ink(234) }], [51, {}]],
      sprites: {
        ...EFFECTS,
        ...arena.sprites,
        ...extra.sprites,
        ...heroSprites,
        ...rivalSprites,
        heroShot,
        rivalShot,
        heroHit: isFlawless ? heroSprites.heroBlock : heroSprites.heroHit,
        heroStun: isFlawless ? heroSprites.heroBlock : heroSprites[`hero${STUNS[rival.shot.stun] ?? 'Hit'}`],
        rivalStun: rivalSprites[`rival${STUNS[hero.shot.stun] ?? 'Hit'}`],
        heroBlood: isFlawless ? EFFECTS.blank : EFFECTS.bloodLeft,
        heroSplash: isFlawless || rival.shot.stun ? EFFECTS.blank : EFFECTS.bloodLeft,
        rivalSplash: hero.shot.stun ? EFFECTS.blank : EFFECTS.bloodRight,
        heroFinisher: heroSprites.heroThrow,
        heroAfter: heroSprites.heroStance,
        finisherFx: EFFECTS.blank,
        ...finishes[finisher],
        boss: pick(bosses, 3),
      },
      // The fatality blackout does not darken actors, so the boss hides during it.
      cast: { ...arena.props, boss: [[0, 'boss', 17], [49], [51, 'boss', 17]], ...CAST, ...extra.cast },
    }
  }
  // The base game keeps its scoreboard template. A session deals the names onto it.
  return {
    ...game,
    loop: 64,
    border: COLOR.yellow,
    icons: { fiveHour: 'heroBust', sevenDay: 'rivalBust' },
    ...vary((list) => list[0]),
    scoreboard,
    vary,
  }
}
