export const COLOR = {
  reset: '\x1b[0m',
  dim: '\x1b[2m',
  white: '\x1b[0;37m',
  red: '\x1b[1;31m',
  green: '\x1b[1;32m',
  yellow: '\x1b[1;33m',
  blue: '\x1b[38;5;27m',
  magenta: '\x1b[1;35m',
  cyan: '\x1b[1;36m',
  orange: '\x1b[38;5;208m',
  brown: '\x1b[38;5;130m',
  gray: '\x1b[38;5;245m',
}

// 256-color codes for the game screens, picked to match the original arcade palettes.
const INK = {
  black: '\x1b[38;5;16m',
  white: '\x1b[38;5;231m',
  silver: '\x1b[38;5;250m',
  gray: '\x1b[38;5;244m',
  slate: '\x1b[38;5;240m',
  red: '\x1b[38;5;196m',
  crimson: '\x1b[38;5;161m',
  pink: '\x1b[38;5;213m',
  peach: '\x1b[38;5;223m',
  orange: '\x1b[38;5;208m',
  amber: '\x1b[38;5;214m',
  yellow: '\x1b[38;5;226m',
  brown: '\x1b[38;5;130m',
  umber: '\x1b[38;5;94m',
  lime: '\x1b[38;5;46m',
  green: '\x1b[38;5;34m',
  cyan: '\x1b[38;5;51m',
  teal: '\x1b[38;5;24m',
  azure: '\x1b[38;5;33m',
  blue: '\x1b[38;5;21m',
  purple: '\x1b[38;5;129m',
  olive: '\x1b[38;5;64m',
  wine: '\x1b[38;5;88m',
  plum: '\x1b[38;5;54m',
}

const PAPER = {
  black: '\x1b[48;5;16m',
  night: '\x1b[48;5;233m',
  stone: '\x1b[48;5;236m',
  river: '\x1b[48;5;18m',
  sky: '\x1b[48;5;69m',
  violet: '\x1b[48;5;54m',
  sand: '\x1b[48;5;172m',
  brick: '\x1b[48;5;166m',
  dusk: '\x1b[48;5;25m',
  tan: '\x1b[48;5;180m',
  concrete: '\x1b[48;5;246m',
  redbrick: '\x1b[48;5;131m',
  maroon: '\x1b[48;5;52m',
  asphalt: '\x1b[48;5;238m',
  acid: '\x1b[48;5;22m',
  steel: '\x1b[48;5;242m',
  breakoutRed: '\x1b[48;5;196m',
  breakoutGreen: '\x1b[48;5;34m',
}

// CJK characters render two columns wide.
export const WIDE = /[\u2E80-\u9FFF\uF900-\uFAFF]/

// Builds scenery from a pattern string. Each key maps to [glyph, ink, paper]. A key with no
// legend entry draws itself with no color. A wide glyph is followed by an empty cell that
// holds its second column.
function tiles(pattern, legend) {
  const cells = [...pattern].flatMap((key) => {
    const cell = legend[key] ?? [key, '']
    if (!WIDE.test(cell[0])) return [cell]
    return [cell, ['', cell[1], cell[2]]]
  })
  return {
    glyphs: cells.map(([glyph]) => glyph),
    colors: cells.map(([, ink]) => ink),
    backgrounds: cells.map(([, , paper]) => paper),
  }
}

// Health-bar frames that drain one segment at a time, from the right edge for a left bar and
// from the left edge for a right bar.
function drain(length, side) {
  return Array.from({ length }, (_, lost) => {
    const bar = '▬'.repeat(length - lost)
    const gap = ' '.repeat(lost)
    return side === 'left' ? `${bar}${gap}` : `${gap}${bar}`
  })
}

// Deals a hero and a rival from the roster and a boss to chase them, so each session stages a
// different fight.
function fightCard(roster, bossInks) {
  return (pick, game) => {
    const [heroName, heroInk] = pick(roster, 0)
    const [rivalName, rivalInk] = pick(
      roster.filter(([name]) => name !== heroName),
      1,
    )
    return {
      scoreboard: { ...game.scoreboard, left: `${heroName} {score}`, right: `${rivalName} {hi}` },
      banner: { ...game.banner, text: pick(['FIGHT!', 'ROUND 1', 'ROUND 2', 'ROUND 3'], 2) },
      player: { ...game.player, color: heroInk },
      chasers: {
        fiveHour: { ...game.chasers.fiveHour, color: rivalInk },
        sevenDay: { ...game.chasers.sevenDay, color: pick(bossInks, 3) },
      },
    }
  }
}

// Donkey Kong's girder row, with ladders and the oil drum, runs both behind and ahead of the
// player so the layout stays continuous.
const KONG_GIRDERS = tiles('▀╳▀H▀╳▀╳▀OIL▀╳▀╳H▀╳▀╳▀╳▀', {
  '▀': ['▀', INK.crimson],
  '╳': ['╳', INK.crimson],
  H: ['H', INK.cyan],
  O: ['O', INK.white, PAPER.river],
  I: ['I', INK.white, PAPER.river],
  L: ['L', INK.white, PAPER.river],
})

// Every glyph must render one column wide, except CJK scenery and titles, which WIDE covers.
// Emoji and most symbols in U+2600-U+27BF are two columns in some terminals, so they break
// the border alignment.
export const GAMES = [
  {
    id: 'pacman',
    vary: (pick, game) => {
      const ghosts = [INK.red, INK.pink, INK.cyan, INK.orange]
      const first = pick(ghosts, 0)
      return {
        caption: {
          left: ['ᗧ'.repeat(pick([1, 2, 3], 2)), INK.yellow],
          right: ['ᐝ'.repeat(pick([1, 2, 3], 3)), pick([INK.red, INK.orange, INK.lime, INK.pink], 4)],
        },
        chasers: {
          fiveHour: { ...game.chasers.fiveHour, color: first },
          sevenDay: { ...game.chasers.sevenDay, color: pick(ghosts.filter((ink) => ink !== first), 1) },
        },
      }
    },
    scoreboard: { left: '1UP {score}', right: 'HIGH SCORE {hi}', blink: true },
    logo: [['PAC-MAN', INK.yellow]],
    border: COLOR.blue,
    screen: PAPER.black,
    backdrop: tiles('════════╦═══════════╦════', { '═': ['═', INK.blue], '╦': ['╦', INK.blue] }),
    sky: tiles('  ╶───╴    ╶──────╴    ', { '╶': ['╶', INK.blue], '─': ['─', INK.blue], '╴': ['╴', INK.blue] }),
    player: { glyphs: ['ᗧ', '●'], color: INK.yellow },
    trail: { glyphs: [' '], color: '' },
    ahead: { glyphs: ['·'], color: [INK.peach, INK.peach, INK.white] },
    base: tiles('═══════╩════════════╩═════', { '═': ['═', INK.blue], '╩': ['╩', INK.blue] }),
    caption: { left: ['ᗧᗧ', INK.yellow], right: ['ᐝᐝ', INK.red] },
    bonus: { glyphs: ['●', ' '], color: INK.peach },
    chasers: {
      fiveHour: { glyphs: ['ᗣ', 'ᗩ'], color: INK.red },
      sevenDay: { glyphs: ['ᗩ', 'ᗣ'], color: INK.pink },
    },
    scared: { glyphs: ['ᗣ', 'ᗩ'], color: [INK.azure, INK.azure, INK.white] },
    banner: { text: 'READY!', color: INK.yellow },
  },
  {
    id: 'invaders',
    stars: true,
    vary: (pick) => {
      const lives = pick([1, 2, 3], 0)
      return {
        caption: { left: [`${lives} ${'ᐃ'.repeat(lives - 1)}`, INK.lime], right: [`CREDIT 0${pick([0, 1, 2, 3], 1)}`, INK.white] },
      }
    },
    scoreboard: { left: 'SCORE<1> {score}', right: 'HI-SCORE {hi}', ink: INK.white },
    logo: [['SPACE ', INK.white], ['INVADERS', INK.lime]],
    border: COLOR.green,
    screen: PAPER.black,
    backdrop: tiles('   ·        U            ˙      ', { '·': ['·˙', INK.gray], U: ['◓◒', INK.red], '˙': ['˙·', INK.gray] }),
    sky: tiles('ж ѫ ж ѫ ж ѫ        ', { ж: ['жЖ', INK.white], ѫ: ['ѫѪ', INK.silver] }),
    player: { glyphs: ['ᐃ', 'ᐱ'], color: INK.lime },
    shot: { glyphs: ['ı', '╵'], color: INK.white },
    trail: { glyphs: [' '], color: '' },
    ahead: tiles('   ▟█▙     ', { '▟': ['▟', INK.lime], '█': ['█', INK.lime], '▙': ['▙', INK.lime] }),
    base: tiles('▔', { '▔': ['▔', INK.lime] }),
    caption: { left: ['3 ᐃᐃ', INK.lime], right: ['CREDIT 00', INK.white] },
    bonus: { glyphs: ['◓', '◒'], color: INK.red },
    chasers: {
      fiveHour: { glyphs: ['ж', 'Ж'], color: INK.red },
      sevenDay: { glyphs: ['ѫ', 'Ѫ'], color: INK.pink },
    },
  },
  {
    id: 'frogger',
    vary: (pick, game) => ({ caption: { ...game.caption, left: ['ᴥ'.repeat(pick([1, 2, 3, 4], 0)), INK.lime] } }),
    scoreboard: { left: '1-UP {score}', right: 'HI-SCORE {hi}', ink: INK.yellow, blink: true },
    logo: [['FROGGER', INK.lime]],
    border: COLOR.green,
    screen: PAPER.black,
    backdrop: tiles('▀▀▀ ▀▀▀▀ ▀▀▀▀ ▀▀▀▀ ▀', { '▀': ['▀', INK.green] }),
    skySpeed: -1,
    sky: tiles('  ▭▭    ▬   ▭     ▬▬▬    ', { '▭': ['▭', INK.yellow], '▬': ['▬', [INK.pink, INK.white]] }),
    player: { glyphs: ['ᴥ', 'ᴗ'], color: INK.lime },
    trail: { glyphs: [' '], color: '', background: PAPER.violet },
    ahead: tiles('≈≈▬▬▬▬≈≈≈ooo≈≈▬▬▬≈≈', {
      '≈': ['≈~', INK.azure, PAPER.river],
      '▬': ['▬', INK.brown, PAPER.river],
      o: ['ᴏᴏᴏo˳ ', INK.red, PAPER.river],
    }),
    base: tiles('   ▬▬     ▭      ▬▬▬▬     ▭▭  ', { '▬': ['▬', INK.white], '▭': ['▭', INK.yellow] }),
    caption: { left: ['ᴥᴥᴥ', INK.lime], right: [drain(8, 'right').map((bar) => `TIME ${bar}`), INK.yellow] },
    bonus: { glyphs: ['ᴥ'], color: INK.pink, background: PAPER.river },
    chasers: {
      fiveHour: { glyphs: ['▭', '▬'], color: INK.red, tail: { glyphs: ['▬'], color: INK.white, length: 2 } },
      sevenDay: { glyphs: ['▬', '▭'], color: INK.pink },
    },
  },
  {
    id: 'donkey-kong',
    vary: (pick) => ({
      caption: { left: ['ᕗ'.repeat(pick([1, 2, 3], 0)), INK.red], right: [`L=0${pick([1, 2, 3, 4], 1)}`, INK.azure] },
      banner: { text: pick(['HOW HIGH CAN YOU GET?', '25 m', '50 m', '75 m', '100 m'], 2), color: INK.white },
      bonus: pick(
        [
          { glyphs: ['Ŧ'], color: [INK.amber, INK.yellow] },
          { glyphs: ['ᛏ'], color: [INK.pink, INK.white] },
          { glyphs: ['ᑌ'], color: [INK.pink, INK.white] },
        ],
        3,
      ),
    }),
    scoreboard: { left: 'I {score}', right: 'TOP {hi}', ink: INK.cyan },
    logo: [['DONKEY KONG', INK.crimson]],
    banner: { text: 'HOW HIGH CAN YOU GET?', color: INK.white },
    border: COLOR.red,
    screen: PAPER.black,
    // Pauline calls for help beside Kong and his barrel stack, while the bonus timer counts down.
    backdrop: tiles(`       ᛉ Ѫ ΘΘ${'▀╳'.repeat(40)}`, {
      ᛉ: ['ᛉᛘ', INK.pink],
      Ѫ: ['Ѫѫ', INK.brown],
      Θ: ['Θ', INK.amber],
      '▀': ['▀', INK.crimson],
      '╳': ['╳', INK.crimson],
    }),
    backdropSpeed: 0,
    topCaption: {
      left: [['HELP!', 'HELP!', '     '], INK.white],
      right: [Array.from({ length: 50 }, (_, tick) => `BONUS ${String(5000 - tick * 100).padStart(4)}`), INK.cyan],
    },
    // The sky, girder and base rows share one 24-cell layout and scroll together, so the ladders
    // run through all three rows and the flames sit on the oil drum.
    skySpeed: 1,
    sky: tiles('   H     FFF    H       ', { H: ['H', INK.cyan], F: ['ѡѠ', [INK.red, INK.orange, INK.yellow]] }),
    player: { glyphs: ['ᕗ', 'ᕕ'], color: INK.red, tail: { glyphs: ['Ŧ', '╾'], color: INK.amber, length: 1 } },
    trail: KONG_GIRDERS,
    ahead: KONG_GIRDERS,
    base: tiles('▄▄▄H▄▄▄▄▀▀▀▀▀▀▀▀ ▀▀▀▀▄▄▄', { '▄': ['▄', INK.crimson], '▀': ['▀', INK.crimson], H: ['H', INK.cyan] }),
    caption: { left: ['ᕗᕗ', INK.red], right: ['L=01', INK.azure] },
    bonus: { glyphs: ['Ŧ'], color: [INK.amber, INK.yellow] },
    chasers: {
      fiveHour: { glyphs: ['◐', '◓', '◑', '◒'], color: INK.amber },
      sevenDay: { glyphs: ['ѻ', 'ӫ'], color: [INK.red, INK.orange, INK.yellow] },
    },
    // With the hammer swinging, the barrels and fireballs turn blue.
    scared: { glyphs: ['ѻ', 'ӫ'], color: [INK.azure, INK.blue] },
  },
  {
    id: 'asteroids',
    stars: true,
    vary: (pick) => ({
      topCaption: { left: ['ᐃ'.repeat(pick([2, 3, 4, 5], 0)), INK.white] },
      banner: { text: pick(['PLAYER 1', 'PUSH START', 'GAME OVER', '1 COIN 1 PLAY'], 1), color: INK.white },
    }),
    scoreboard: { left: '{score}', right: '{hi}', ink: INK.white },
    logo: [['ASTEROIDS', INK.white]],
    banner: { text: 'PLAYER 1', color: INK.white },
    border: COLOR.gray,
    screen: PAPER.black,
    // Big rocks tumble, medium and small rocks spin, and shot rocks burst into dust.
    backdrop: tiles('      ·        R            ˙     ∘          U          o     ', {
      '·': ['·', INK.gray],
      R: ['OФΘФ', INK.silver],
      o: ['oö', INK.silver],
      '˙': ['˙', INK.gray],
      U: ['ᴗᴖ', INK.red],
      '∘': ['∘°', INK.gray],
    }),
    skySpeed: -0.5,
    sky: tiles('   R        °      o           x        ∘     ', {
      R: ['OФΘФ', INK.white],
      o: ['oö', INK.silver],
      '°': ['°˚', INK.gray],
      '∘': ['∘°', INK.silver],
      x: ['∗∴∵·  ', [INK.white, INK.amber]],
    }),
    player: {
      glyphs: ['ᐅ', 'ᐅ', 'ᐃ', 'ᐅ', 'ᐅ', 'ᐁ'],
      color: INK.white,
      tail: { glyphs: ['‹', 'ᐸ', ' '], color: [INK.orange, INK.yellow], length: 2 },
    },
    shot: { glyphs: ['∙', '·'], color: INK.white },
    trail: { glyphs: [' '], color: '' },
    ahead: tiles('  ∘      x    o        R     •   x   ', {
      '∘': ['∘°', INK.gray],
      x: ['∗∴∵·  ', [INK.white, INK.amber]],
      o: ['oö', INK.silver],
      R: ['OФΘФ', INK.silver],
      '•': ['•∙', INK.gray],
    }),
    base: tiles('  ∘        R      •          °     o   ', {
      '∘': ['∘°', INK.gray],
      R: ['OФΘФ', INK.silver],
      '•': ['•', INK.gray],
      '°': ['°', INK.gray],
      o: ['oö', INK.gray],
    }),
    topCaption: { left: ['ᐃᐃᐃ', INK.white] },
    caption: { right: ['© 1979 ATARI INC', INK.gray] },
    bonus: { glyphs: ['O', 'O', 'ö', '∴', '·', ' '], color: INK.white },
    chasers: {
      fiveHour: { glyphs: ['ᗜ', 'ᗝ'], color: [INK.white, INK.silver] },
      sevenDay: { glyphs: ['ᴗ', 'ᴖ'], color: [INK.red, INK.white] },
    },
    // A saucer hit by the ship's fire bursts apart.
    scared: { glyphs: ['ж', '∗', '∴', '·'], color: [INK.white, INK.amber] },
  },
  {
    id: 'centipede',
    stars: true,
    // Each wave recolors the mushrooms.
    vary: (pick, game) => {
      const waves = [INK.orange, INK.red, INK.lime, INK.cyan, INK.pink, INK.yellow, INK.purple]
      const recolor = (sprite, ink) => ({
        ...sprite,
        colors: sprite.colors.map((color, index) => (/[⌓ᴖ]/.test(sprite.glyphs[index]) ? ink : color)),
      })
      const [near, far] = [pick(waves, 0), pick(waves, 1)]
      return {
        ahead: recolor(game.ahead, near),
        sky: recolor(game.sky, far),
        backdrop: recolor(game.backdrop, near),
        banner: { ...game.banner, text: `WAVE ${pick([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], 2)}` },
      }
    },
    scoreboard: { left: '{score} ᐃᐃ', right: '{hi}', ink: INK.cyan },
    logo: [['CENTI', INK.lime], ['PEDE', INK.pink]],
    banner: { text: 'WAVE 1', color: INK.white },
    border: COLOR.magenta,
    screen: PAPER.black,
    // Whole, shot-up and poisoned mushrooms, with a scorpion crawling through the top row.
    backdrop: tiles('     ⌓        ᴖ   SS P   ⌓  ', {
      '⌓': ['⌓', INK.red],
      ᴖ: ['ᴖ', INK.red],
      S: ['ᔕᔓ', [INK.yellow, INK.lime]],
      P: ['⌓', INK.red, PAPER.violet],
    }),
    topCaption: { right: [['300', '   ', '600', '   ', '900', '   '], INK.white] },
    sky: tiles('  ⌓      ᴖ    P        ⌓   X ', {
      '⌓': ['⌓⌓⌓◡', INK.orange],
      ᴖ: ['ᴖ', INK.orange],
      P: ['⌓', INK.orange, PAPER.violet],
      X: ['⌓ᴖ˙ ', INK.orange],
    }),
    player: { glyphs: ['ᐃ', 'ᐱ'], color: INK.cyan },
    shot: { glyphs: ['╵'], color: [INK.white, INK.yellow] },
    trail: { glyphs: [' '], color: '' },
    ahead: tiles('⌓   ᴖ  ⌓     P   ', { '⌓': ['⌓', INK.pink], ᴖ: ['ᴖ', INK.pink], P: ['⌓', INK.pink, PAPER.violet] }),
    base: tiles('       ⌓              ᴖ        ⌓  ', { '⌓': ['⌓', INK.pink], ᴖ: ['ᴖ', INK.pink] }),
    bonus: { glyphs: ['ᗑ', 'ᗐ'], color: INK.yellow },
    chasers: {
      fiveHour: {
        glyphs: ['Ꝋ', 'ʘ', 'Θ'],
        color: [INK.lime, INK.pink],
        tail: { glyphs: ['ο', 'o'], color: [INK.lime, INK.pink], length: 7 },
      },
      sevenDay: { glyphs: ['ж', 'Ж'], color: [INK.purple, INK.white] },
    },
    // A shot centipede bursts and leaves a mushroom behind.
    scared: { glyphs: ['∗', '⌓'], color: [INK.white, INK.orange] },
  },
  {
    id: 'breakout',
    vary: (pick, game) => {
      const ball = pick([1, 2, 3], 0)
      const paddle = pick([INK.azure, INK.cyan, INK.white], 1)
      const pad = { glyphs: ['▬'], color: paddle, tail: { glyphs: ['▬'], color: paddle, length: 2 } }
      return {
        scoreboard: { ...game.scoreboard, right: `BALL ${ball}` },
        caption: { ...game.caption, right: ['■'.repeat(5 - ball), INK.white] },
        banner: { ...game.banner, text: pick(['SERVE', 'PLAYER 1', 'GAME OVER', 'FREE PLAY'], 2) },
        chasers: { fiveHour: pad, sevenDay: { ...pad, tail: { ...pad.tail, length: 1 } } },
      }
    },
    scoreboard: { left: '{short}', right: 'BALL 1', ink: INK.white },
    logo: [['BR', INK.red], ['EA', INK.orange], ['KO', INK.green], ['UT', INK.yellow]],
    border: COLOR.white,
    screen: PAPER.black,
    // Each cell stacks two brick rows: the upper brick is the paper, the lower one the ink. U
    // and L keep only the upper or lower brick, and H flashes as the ball strikes it.
    backdrop: tiles('BBB BBB UUU BBB HHH BBB     BBB LLL BBB BBB UUU BBB     ', {
      B: ['▄', INK.orange, PAPER.breakoutRed],
      U: ['▀', INK.red],
      L: ['▄', INK.orange],
      H: ['▄', [INK.orange, INK.orange, INK.white, INK.white], PAPER.breakoutRed],
    }),
    backdropSpeed: 0,
    skySpeed: 0,
    sky: tiles(' BBB BBB     BBB UUU BBB HHH LLL BBB BBB     BBB BBB UUU', {
      B: ['▄', INK.yellow, PAPER.breakoutGreen],
      U: ['▀', INK.green],
      L: ['▄', INK.yellow],
      H: ['▄', [INK.yellow, INK.yellow, INK.white, INK.white], PAPER.breakoutGreen],
    }),
    banner: { text: 'SERVE', color: INK.white },
    player: { glyphs: ['■', '▪'], color: INK.white, tail: { glyphs: ['▪', '·'], color: [INK.silver, INK.gray], length: 2 } },
    trail: { glyphs: [' '], color: '' },
    ahead: tiles('   r       g    o         y     ', {
      r: [' ▘▖ ', INK.red],
      o: ['  ▝▗', INK.orange],
      g: ['▝▗  ', INK.green],
      y: [' ▘▖ ', INK.yellow],
    }),
    base: tiles('▁', { '▁': ['▁', INK.slate] }),
    caption: { left: ['P1', INK.white], right: ['■■■■', INK.white] },
    bonus: { glyphs: ['▄', '▄', '▄', '▚', '▞', '·', ' ', ' '], color: [INK.yellow, INK.white] },
    chasers: {
      fiveHour: { glyphs: ['▬'], color: INK.azure, tail: { glyphs: ['▬'], color: INK.azure, length: 2 } },
      sevenDay: { glyphs: ['▬'], color: INK.azure, tail: { glyphs: ['▬'], color: INK.azure, length: 1 } },
    },
  },
  {
    id: 'tetris',
    vary: (pick, game) => {
      const [shape, ink] = pick(
        [
          ['▄▄▄▄', INK.cyan],
          ['██', INK.yellow],
          ['▄█▄', INK.purple],
          ['▄█▀', INK.lime],
          ['▀█▄', INK.red],
          ['█▄▄', INK.blue],
          ['▄▄█', INK.orange],
        ],
        0,
      )
      const pieces = [INK.red, INK.lime, INK.purple, INK.cyan, INK.yellow]
      const first = pick(pieces, 3)
      return {
        caption: { right: [`NEXT ${shape}`, ink] },
        topCaption: { left: [pick(['A-TYPE', 'B-TYPE'], 1), INK.white], right: [`LV ${pick(['00', '05', '09', '15', '19'], 2)}`, INK.yellow] },
        banner: { ...game.banner, text: pick(['TETRIS!', 'SINGLE', 'DOUBLE', 'TRIPLE', 'LEVEL UP'], 4) },
        chasers: {
          fiveHour: { ...game.chasers.fiveHour, color: first },
          sevenDay: { ...game.chasers.sevenDay, color: pick(pieces.filter((piece) => piece !== first), 5) },
        },
      }
    },
    scoreboard: { left: 'SCORE {score}', right: 'LINES {lines}', ink: INK.yellow },
    logo: [['T', INK.red], ['E', INK.orange], ['T', INK.yellow], ['R', INK.lime], ['I', INK.cyan], ['S', INK.purple]],
    border: COLOR.cyan,
    screen: PAPER.black,
    // Each piece cell drops a half block per frame. The phase adds the cell index, so each
    // next cell of a piece starts one frame later to keep the piece level as it falls.
    backdrop: tiles('           abcd               efg           hi         jk           ', {
      a: ['▀▄  ', INK.cyan],
      b: [' ▀▄ ', INK.cyan],
      c: ['  ▀▄', INK.cyan],
      d: ['▄  ▀', INK.cyan],
      e: [' ▀▄ ', INK.purple],
      f: ['  ▀▄', INK.purple],
      g: ['▄  ▀', INK.purple],
      h: ['▄  ▀', INK.yellow],
      i: ['▀▄  ', INK.yellow],
      j: ['  ▀▄', INK.red],
      k: ['▄  ▀', INK.red],
    }),
    topCaption: { left: ['A-TYPE', INK.white], right: ['LV 00', INK.yellow] },
    // St. Basil's Cathedral: gold spires over onion domes that cycle colors.
    skySpeed: 0.25,
    sky: tiles('     Λ▗R▖Λ   ▐G▌ΛB▐Y▌    Λ▗R▖     ', {
      Λ: ['Λ', INK.amber],
      R: ['Ŏ', [INK.red, INK.white]],
      G: ['Ŏ', [INK.lime, INK.yellow]],
      B: ['Ŏ', [INK.azure, INK.cyan]],
      Y: ['Ŏ', [INK.yellow, INK.red]],
      '▗': ['▗', INK.wine],
      '▖': ['▖', INK.wine],
      '▐': ['▐', INK.wine],
      '▌': ['▌', INK.wine],
    }),
    banner: { text: 'TETRIS!', color: INK.white },
    player: { glyphs: ['▙', '▛', '▜', '▟'], color: INK.orange },
    trail: tiles('IIIIOOTTTXXXXXXSSZZJJJLLL', {
      I: ['█', INK.cyan],
      O: ['█', INK.yellow],
      T: ['█', INK.purple],
      S: ['█', INK.lime],
      Z: ['█', INK.red],
      J: ['█', INK.blue],
      L: ['█', INK.orange],
      X: ['████▓▒░ ', INK.white],
    }),
    ahead: tiles('II▄OO T▄ ▄S▗ZZ▖J ▄LL ', {
      I: ['█', INK.cyan],
      O: ['▄', INK.yellow],
      T: ['█', INK.purple],
      S: ['▄', INK.lime],
      Z: ['▄', INK.red],
      J: ['█', INK.blue],
      L: ['▄', INK.orange],
      '▄': ['▄', INK.gray],
      '▗': ['▗', INK.gray],
      '▖': ['▖', INK.gray],
    }),
    base: tiles('LLLJJJGGZZSSGTTTOOIIIIGG', {
      I: ['█', INK.cyan],
      O: ['█', INK.yellow],
      T: ['█', INK.purple],
      S: ['█', INK.lime],
      Z: ['█', INK.red],
      J: ['█', INK.blue],
      L: ['█', INK.orange],
      G: ['▓', INK.gray],
    }),
    caption: { right: ['NEXT ▄█▄', INK.purple] },
    bonus: { glyphs: ['░', '▒'], color: INK.silver },
    chasers: {
      fiveHour: { glyphs: ['▛', '▜', '▟', '▙'], color: INK.red },
      sevenDay: { glyphs: ['▞', '▚'], color: INK.purple },
    },
  },
  {
    id: 'mario',
    vary: (pick, game) => {
      const [name, ink, glyph] = pick(
        [
          ['MARIO', INK.red, 'Ꮇ'],
          ['LUIGI', INK.lime, 'Ꮮ'],
        ],
        0,
      )
      const coins = String(pick(Array.from({ length: 100 }, (_, count) => count), 3)).padStart(2, '0')
      return {
        scoreboard: { ...game.scoreboard, left: `${name} {score}` },
        banner: { ...game.banner, text: `WORLD ${pick([1, 2, 3, 4, 5, 6, 7, 8], 1)}-${pick([1, 2, 3, 4], 2)}` },
        player: { ...game.player, glyphs: [glyph], color: ink },
        caption: { left: [`◎×${coins}`, INK.yellow] },
      }
    },
    scoreboard: { left: 'MARIO {score}', right: 'TIME {time}', ink: INK.white },
    logo: [['SUPER MARIO BROS', INK.peach]],
    banner: { text: 'WORLD 1-1', color: INK.white },
    border: COLOR.red,
    screen: PAPER.sky,
    backdrop: tiles('     ▂▄▄▂                 ▂▄▂             ', { '▂': ['▂', INK.white], '▄': ['▄', INK.white] }),
    sky: tiles('        B?B?B          ?          ', {
      B: ['▦', INK.black, PAPER.brick],
      '?': ['?', [INK.umber, INK.umber, INK.white], PAPER.sand],
    }),
    player: { glyphs: ['Ꮇ'], color: INK.red },
    shot: { glyphs: ['∗', '*'], color: [INK.yellow, INK.white] },
    trail: tiles('▔▔▔╷', { '▔': ['▔', INK.peach, PAPER.brick], '╷': ['╷', INK.umber, PAPER.brick] }),
    ahead: tiles('▔▔▔╷▔▔▔╷▔▔▔╷▐▌▔▔▔╷▔▔▔╷▔▔▔╷', {
      '▔': ['▔', INK.peach, PAPER.brick],
      '╷': ['╷', INK.umber, PAPER.brick],
      '▐': ['▐', INK.lime, PAPER.brick],
      '▌': ['▌', INK.green, PAPER.brick],
    }),
    base: tiles('▚▞', { '▚': ['▚', INK.umber, PAPER.brick], '▞': ['▞', INK.umber, PAPER.brick] }),
    caption: { left: ['◎×07', INK.yellow] },
    bonus: { glyphs: ['◎', '○', '|', '○'], color: INK.yellow, background: PAPER.brick },
    chasers: {
      fiveHour: { glyphs: ['ᗣ', 'ᗢ'], color: INK.peach },
      sevenDay: { glyphs: ['Ѭ', 'ѭ'], color: INK.lime },
    },
  },
  {
    id: 'mortal-kombat',
    stars: true,
    vary: fightCard(
      [
        ['SCORPION', INK.yellow],
        ['SUB-ZERO', INK.cyan],
        ['LIU KANG', INK.red],
        ['JOHNNY CAGE', INK.silver],
        ['SONYA', INK.lime],
        ['RAIDEN', INK.white],
        ['KANO', INK.crimson],
      ],
      [INK.amber, INK.crimson],
    ),
    scoreboard: { left: 'SCORPION {score}', right: 'SUB-ZERO {hi}', ink: INK.yellow },
    logo: [['MORTAL KOMBAT', INK.amber]],
    banner: { text: 'FIGHT!', color: INK.red },
    border: COLOR.yellow,
    screen: PAPER.night,
    backdrop: tiles('   ·      ˙      ◐          ·     ˙   ', { '·': ['·', INK.slate], '˙': ['˙', INK.gray], '◐': ['●', INK.peach] }),
    sky: tiles('   Ψ           Ψ           ', { Ψ: ['Ψψ', [INK.orange, INK.yellow, INK.red]] }),
    player: { glyphs: ['ᕦ', 'ᕤ'], color: INK.yellow },
    shot: { glyphs: ['»', '›'], color: INK.yellow },
    trail: { glyphs: ['▓', '▒'], color: INK.slate, background: PAPER.stone },
    ahead: { glyphs: ['▓', '▒'], color: INK.slate, background: PAPER.stone },
    base: tiles('▓▒', { '▓': ['▓', INK.slate, PAPER.night], '▒': ['▒', INK.slate, PAPER.night] }),
    topCaption: { left: [drain(10, 'left'), INK.lime], right: [drain(10, 'right').reverse(), INK.lime] },
    bonus: { glyphs: ['ᛟ'], color: INK.red, background: PAPER.stone },
    chasers: {
      fiveHour: { glyphs: ['ᕤ', 'ᕦ'], color: INK.cyan },
      sevenDay: { glyphs: ['Ѫ', 'ѫ'], color: INK.red },
    },
  },
  {
    id: 'mortal-kombat-2',
    vary: fightCard(
      [
        ['LIU KANG', INK.red],
        ['KUNG LAO', INK.silver],
        ['KITANA', INK.azure],
        ['MILEENA', INK.pink],
        ['JAX', INK.purple],
        ['BARAKA', INK.amber],
        ['REPTILE', INK.lime],
        ['SCORPION', INK.yellow],
        ['SUB-ZERO', INK.cyan],
        ['RAIDEN', INK.white],
        ['SHANG TSUNG', INK.crimson],
      ],
      [INK.silver, INK.amber],
    ),
    scoreboard: { left: 'LIU KANG {score}', right: 'SHAO KAHN {hi}', ink: INK.yellow },
    logo: [['MORTAL KOMBAT ', INK.amber], ['II', INK.red]],
    banner: { text: 'FIGHT!', color: INK.red },
    border: COLOR.yellow,
    screen: PAPER.night,
    backdrop: tiles('▀▀▀┬▀▀▀▀▀▀▀┬▀▀▀▀▀▀▀▀▀▀┬▀▀▀▀', { '▀': ['▀', INK.slate], '┬': ['┬', INK.silver] }),
    sky: tiles('   ʆ       ʆ          ʆ    ', { ʆ: ['ʆʃ', INK.silver] }),
    player: { glyphs: ['ᕦ', 'ᕤ'], color: INK.red },
    shot: { glyphs: ['●', '◉'], color: [INK.orange, INK.yellow, INK.red] },
    trail: tiles('▀▀▀▀▀▀▀ ▀▀▀▀', { '▀': ['▀', INK.slate, PAPER.acid], ' ': ['°∘o ', INK.lime, PAPER.acid] }),
    ahead: tiles('▀▀▀▀▀▀▀ ▀▀▀▀', { '▀': ['▀', INK.slate, PAPER.acid], ' ': ['°∘o ', INK.lime, PAPER.acid] }),
    base: tiles('≈≈≈o≈≈≈≈°≈≈', { '≈': ['≈~', INK.lime, PAPER.acid], o: ['o°˚ ', INK.lime, PAPER.acid], '°': ['°˚ o', INK.lime, PAPER.acid] }),
    topCaption: { left: [drain(10, 'left').reverse(), INK.lime], right: [drain(10, 'right'), INK.lime] },
    bonus: { glyphs: ['ᛟ'], color: INK.amber, background: PAPER.acid },
    chasers: {
      fiveHour: { glyphs: ['ᕤ', 'ᕦ'], color: INK.pink },
      sevenDay: { glyphs: ['Ѫ', 'ѫ'], color: INK.silver },
    },
  },
  {
    id: 'mortal-kombat-3',
    vary: fightCard(
      [
        ['SUB-ZERO', INK.cyan],
        ['SEKTOR', INK.red],
        ['CYRAX', INK.yellow],
        ['SMOKE', INK.silver],
        ['NIGHTWOLF', INK.amber],
        ['SINDEL', INK.pink],
        ['STRYKER', INK.azure],
        ['SONYA', INK.lime],
        ['JAX', INK.purple],
        ['KANO', INK.crimson],
        ['SHEEVA', INK.orange],
      ],
      [INK.amber, INK.silver],
    ),
    scoreboard: { left: 'SUB-ZERO {score}', right: 'SEKTOR {hi}', ink: INK.yellow },
    logo: [['MORTAL KOMBAT ', INK.azure], ['3', INK.amber]],
    banner: { text: 'FIGHT!', color: INK.red },
    border: COLOR.yellow,
    screen: PAPER.night,
    backdrop: tiles('═══════▪═══════════▪═════', { '═': ['═', INK.slate], '▪': ['▪', [INK.white, INK.white, INK.white, INK.slate]] }),
    skySpeed: -2,
    sky: tiles('TTTTwTTwTTwTTTT TTTTwTTwTTwTTTT                       ', {
      T: ['▀', INK.silver, PAPER.steel],
      w: ['▪', [INK.yellow, INK.yellow, INK.amber], PAPER.steel],
    }),
    player: { glyphs: ['ᕦ', 'ᕤ'], color: INK.cyan },
    shot: { glyphs: ['∗', '*'], color: [INK.cyan, INK.white] },
    trail: tiles('═══╪', { '═': ['═', INK.slate, PAPER.stone], '╪': ['╪', INK.umber, PAPER.stone] }),
    ahead: tiles('═══╪', { '═': ['═', INK.slate, PAPER.stone], '╪': ['╪', INK.umber, PAPER.stone] }),
    base: tiles('▔', { '▔': ['▔', INK.yellow, PAPER.stone] }),
    topCaption: { left: [drain(10, 'left'), INK.lime], right: [drain(10, 'right'), INK.lime] },
    bonus: { glyphs: ['ᛟ'], color: [INK.amber, INK.yellow], background: PAPER.stone },
    chasers: {
      fiveHour: { glyphs: ['ᕤ', 'ᕦ'], color: INK.red },
      sevenDay: { glyphs: ['Ѭ', 'ѭ'], color: INK.amber },
    },
  },
  {
    id: 'rampage',
    vary: (pick, game) => {
      const monsters = [
        ['GEORGE', INK.amber, ['Ꮆ', 'Ᏻ']],
        ['LIZZIE', INK.lime, ['Ꮮ', 'ᒪ']],
        ['RALPH', INK.silver, ['Ꭱ', 'Ꮢ']],
      ]
      const [hero, ink, glyphs] = pick(monsters, 0)
      const [rival] = pick(
        monsters.filter(([name]) => name !== hero),
        1,
      )
      const [, rivalInk] = monsters.find(([name]) => name === rival)
      return {
        scoreboard: { ...game.scoreboard, left: `${hero} {score}`, right: `${rival} {hi}` },
        player: { ...game.player, glyphs, color: ink },
        topCaption: { left: [drain(8, 'left'), ink], right: [drain(8, 'right').reverse(), rivalInk] },
      }
    },
    scoreboard: { left: 'GEORGE {score}', right: 'LIZZIE {hi}', ink: INK.amber },
    logo: [['RAMPAGE', INK.red]],
    border: COLOR.orange,
    screen: PAPER.dusk,
    backdrop: tiles('  TTTTT             RRRRRR   ', {
      T: ['▪', [INK.yellow, INK.black, INK.yellow, INK.yellow], PAPER.tan],
      R: ['▪', [INK.yellow, INK.yellow, INK.yellow, INK.black], PAPER.redbrick],
    }),
    backdropSpeed: 0.5,
    sky: tiles('  TTTTT    CCCC     RRRRRR   ', {
      T: ['▪', [INK.yellow, INK.yellow, INK.yellow, INK.black], PAPER.tan],
      C: ['▪', [INK.yellow, INK.black, INK.yellow], PAPER.concrete],
      R: ['▪', [INK.yellow, INK.yellow, INK.black, INK.yellow], PAPER.redbrick],
    }),
    player: { glyphs: ['Ꮆ', 'Ᏻ'], color: INK.amber },
    trail: tiles('▂▄▃▅▂▃', {
      '▂': ['▂', INK.gray],
      '▃': ['▃', INK.brown],
      '▄': ['▄', INK.gray],
      '▅': ['▅', INK.slate],
    }),
    ahead: tiles('TTTTTT CCCCC RRRRRRR ', {
      T: ['▫', INK.umber, PAPER.tan],
      C: ['▫', INK.slate, PAPER.concrete],
      R: ['▫', INK.wine, PAPER.redbrick],
    }),
    base: tiles('──  ', { '─': ['─', INK.white, PAPER.asphalt], ' ': [' ', '', PAPER.asphalt] }),
    bonus: { glyphs: ['ᛉ', 'ᛦ'], color: INK.pink },
    chasers: {
      fiveHour: { glyphs: ['▟', '▙'], color: INK.olive },
      sevenDay: { glyphs: ['Ŧ', 'Ͳ'], color: INK.white },
    },
  },
  {
    id: 'double-dragon',
    stars: true,
    vary: (pick, game) => {
      const [label, ink] = pick(
        [
          ['1P', INK.azure],
          ['2P', INK.red],
        ],
        0,
      )
      return {
        scoreboard: { ...game.scoreboard, left: `${label} {score}`, ink },
        player: { ...game.player, color: ink },
        caption: { left: ['ᕦ'.repeat(pick([1, 2, 3], 1)), ink], right: [drain(6, 'right'), INK.yellow] },
        chasers: { ...game.chasers, fiveHour: { ...game.chasers.fiveHour, color: pick([INK.red, INK.silver, INK.pink, INK.lime], 2) } },
      }
    },
    scoreboard: { left: '1P {score}', right: 'HI {hi}', ink: INK.azure },
    logo: [['DOUBLE DRAGON ', INK.yellow], ['雙截龍', INK.red]],
    border: COLOR.magenta,
    screen: PAPER.night,
    backdrop: tiles(' ▃▅▃  ▂▆▇▆▂   ▄▄   ◐    ▃▅▅▃ ', {
      '▂': ['▂', INK.slate],
      '▃': ['▃', INK.slate],
      '▄': ['▄', INK.slate],
      '▅': ['▅', INK.slate],
      '▆': ['▆', INK.slate],
      '▇': ['▇', INK.slate],
      '◐': ['●', INK.peach],
    }),
    sky: tiles('▤▤▤W▤▤雙截龍▤▤W▤▤▤▤▤▤▤WW▤▤▤武▤▤', {
      '▤': ['▤', INK.wine, PAPER.maroon],
      W: ['▪', [INK.amber, INK.amber, INK.amber, INK.black], PAPER.maroon],
      雙: ['雙', [INK.red, INK.red, INK.red, INK.pink], PAPER.maroon],
      截: ['截', [INK.red, INK.red, INK.pink, INK.red], PAPER.maroon],
      龍: ['龍', [INK.red, INK.pink, INK.red, INK.red], PAPER.maroon],
      武: ['武', [INK.cyan, INK.cyan, INK.cyan, INK.teal], PAPER.maroon],
    }),
    player: { glyphs: ['ᕦ', 'ᕤ'], color: INK.azure },
    shot: { glyphs: ['─', '╲', '│', '╱'], color: INK.silver },
    trail: tiles('▁▁▁╱▁▁▁▁▁╲▁▁', { '▁': ['▁', INK.gray, PAPER.asphalt], '╱': ['╱', INK.slate, PAPER.asphalt], '╲': ['╲', INK.slate, PAPER.asphalt] }),
    ahead: tiles('▁▁▁╱▁▁▁▁▁╲▁▁', { '▁': ['▁', INK.gray, PAPER.asphalt], '╱': ['╱', INK.slate, PAPER.asphalt], '╲': ['╲', INK.slate, PAPER.asphalt] }),
    base: tiles('▀▀▀▀▀▀▀╷', { '▀': ['▀', INK.slate], '╷': ['╷', INK.gray] }),
    caption: { left: ['ᕦᕦ', INK.azure] },
    bonus: { glyphs: ['╱'], color: INK.amber, background: PAPER.asphalt },
    chasers: {
      fiveHour: { glyphs: ['ᕤ', 'ᕦ'], color: INK.red },
      sevenDay: { glyphs: ['Ѫ', 'ѫ'], color: INK.amber },
    },
  },
  {
    id: 'tmnt',
    logo: [
      ['TEENAGE MUTANT ', INK.red],
      ['NINJA TURTLES', INK.lime],
    ],
    scoreboard: { left: 'LEO {score}', right: 'RAPH {hi}', ink: INK.lime },
    banner: { text: 'COWABUNGA!', color: INK.lime },
    // Deals a turtle with its mask color and thrown weapon, a partner on the scoreboard, the Foot
    // Soldiers' uniform and a boss behind them.
    vary: (pick, game) => {
      const turtles = [
        ['LEO', INK.azure, ['╱', '─', '╲', '│']],
        ['RAPH', INK.red, ['ψ', 'Ψ']],
        ['MIKE', INK.orange, ['∞', '8']],
        ['DON', INK.purple, ['─', '│']],
      ]
      const [hero, ink, weapon] = pick(turtles, 0)
      const [partner] = pick(
        turtles.filter(([name]) => name !== hero),
        1,
      )
      return {
        scoreboard: { ...game.scoreboard, left: `${hero} {score}`, right: `${partner} {hi}` },
        banner: { ...game.banner, text: pick(['COWABUNGA!', 'PIZZA TIME', 'TURTLE POWER'], 2) },
        player: { ...game.player, color: ink },
        shot: { ...game.shot, glyphs: weapon },
        topCaption: { left: [drain(8, 'left'), ink] },
        caption: { left: ['ᕦ'.repeat(pick([1, 2, 3], 4)), ink], right: [`◕×${pick([1, 2, 3, 4, 5], 5)}`, INK.amber] },
        chasers: {
          fiveHour: { ...game.chasers.fiveHour, color: pick([INK.purple, INK.white, INK.orange, INK.azure, INK.yellow], 6) },
          sevenDay: {
            ...game.chasers.sevenDay,
            color: pick([INK.silver, INK.purple, INK.slate, INK.pink], 3),
          },
        },
      }
    },
    border: COLOR.green,
    screen: PAPER.night,
    stars: true,
    backdrop: tiles(' ▂▄▆▄▂   ▃▅▇▅▃  ░▒░  ▂▆▂  ●  ▄▇▄   ░▒  ', {
      '▂': ['▂', INK.plum],
      '▃': ['▃', INK.plum],
      '▄': ['▄', INK.plum],
      '▅': ['▅', INK.plum],
      '▆': ['▆', INK.plum],
      '▇': ['▇', INK.plum],
      '░': ['░▒ ░', [INK.slate, INK.gray]],
      '▒': ['▒░░ ', [INK.gray, INK.slate]],
      '●': ['●', INK.peach],
    }),
    sky: tiles('▒▒W▒▒FF▒PIZZA▒▒W▒▒Y▒FF▒   ▒W▒▒FF▒▒▒W▒   ', {
      '▒': ['▒', INK.wine, PAPER.redbrick],
      W: ['▪', [INK.amber, INK.amber, INK.black], PAPER.redbrick],
      F: ['ʌΛʌ^', [INK.red, INK.orange, INK.yellow, INK.orange], PAPER.maroon],
      P: ['P', [INK.yellow, INK.yellow, INK.red], PAPER.redbrick],
      I: ['I', [INK.yellow, INK.yellow, INK.red], PAPER.redbrick],
      Z: ['Z', [INK.yellow, INK.red, INK.yellow], PAPER.redbrick],
      A: ['A', [INK.yellow, INK.yellow, INK.red], PAPER.redbrick],
      Y: ['ᛉᛦ', INK.yellow, PAPER.redbrick],
    }),
    player: { glyphs: ['ᕦ', 'ᕤ'], color: INK.azure },
    shot: { glyphs: ['╱', '─', '╲', '│'], color: INK.silver },
    trail: tiles('▁▁▁▁▁▁◒▁▁▁▁▁▁▁▁▁▁Ŧ▁▁▁▟██▙▁▁▁', {
      '▁': ['▁', INK.gray, PAPER.asphalt],
      '◒': ['◒◒◒◓', INK.slate, PAPER.asphalt],
      Ŧ: ['Ŧ', INK.red, PAPER.asphalt],
      '▟': ['▟', INK.green, PAPER.asphalt],
      '█': ['█', INK.green, PAPER.asphalt],
      '▙': ['▙', INK.green, PAPER.asphalt],
    }),
    ahead: tiles('▁▁▁▁▁▁◒▁▁▁▁▁▁▁▁▁▁Ŧ▁▁▁▟██▙▁▁▁', {
      '▁': ['▁', INK.gray, PAPER.asphalt],
      '◒': ['◒◒◒◓', INK.slate, PAPER.asphalt],
      Ŧ: ['Ŧ', INK.red, PAPER.asphalt],
      '▟': ['▟', INK.green, PAPER.asphalt],
      '█': ['█', INK.green, PAPER.asphalt],
      '▙': ['▙', INK.green, PAPER.asphalt],
    }),
    base: tiles('≈≈≈o≈╥≈≈≈≈°≈≈≈≈ꝏ≈≈≈╥≈≈', {
      '≈': ['≈~', INK.lime, PAPER.acid],
      o: ['o°˚ ', INK.lime, PAPER.acid],
      '°': ['°˚ o', INK.lime, PAPER.acid],
      '╥': ['╥╥╨', INK.gray, PAPER.acid],
      ꝏ: ['ꝏꝏꝏ≈≈≈', INK.yellow, PAPER.acid],
    }),
    bonus: { glyphs: ['◕', '◔'], color: INK.amber, background: PAPER.asphalt },
    chasers: {
      fiveHour: { glyphs: ['ᕤ', 'ᕦ'], color: INK.purple },
      sevenDay: { glyphs: ['Ѫ', 'ѫ'], color: INK.silver, tail: { glyphs: ['ʃ', '⌠'], color: INK.wine, length: 1 } },
    },
  },
]
