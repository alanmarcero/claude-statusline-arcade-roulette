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
  mazeSalmon: '\x1b[38;5;210m',
  mazeSky: '\x1b[38;5;117m',
  mazeOrange: '\x1b[38;5;172m',
  mazeNavy: '\x1b[38;5;26m',
}

const PAPER = {
  black: '\x1b[48;5;16m',
  night: '\x1b[48;5;233m',
  stone: '\x1b[48;5;236m',
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
  navy: '\x1b[48;5;17m',
  bark: '\x1b[48;5;58m',
  mkPortal: '\x1b[48;5;53m',
  trainWindow: '\x1b[48;5;222m',
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

// Every glyph must render one column wide, except CJK scenery and titles, which WIDE covers.
// Emoji and most symbols in U+2600-U+27BF are two columns in some terminals, so they break
// the border alignment.
export const GAMES = [
  {
    id: 'pacman',
    vary: (pick, game) => {
      const ghosts = [INK.red, INK.pink, INK.cyan, INK.orange]
      const first = pick(ghosts, 0)
      // Each level serves one bonus fruit, and the bottom right lists the last few served.
      const fruits = [
        ['ő', INK.red],
        ['ǫ', INK.crimson],
        ['ȯ', INK.orange],
        ['ǒ', INK.red],
        ['ɵ', INK.lime],
        ['ψ', INK.yellow],
        ['Ѧ', INK.yellow],
        ['ł', INK.cyan],
      ]
      const [fruit, fruitInk] = pick(fruits, 5)
      const level = fruits.findIndex(([glyph]) => glyph === fruit)
      const served = fruits.slice(Math.max(level - 2, 0), level + 1).map(([glyph]) => glyph)
      const [text, color] = pick([['READY!', INK.yellow], ['PLAYER ONE', INK.cyan], ['GAME  OVER', INK.red]], 6)
      return {
        caption: {
          left: ['ᗧ'.repeat(pick([1, 2, 3], 2)), INK.yellow],
          right: [served.join(''), fruitInk],
        },
        bonus: { ...game.bonus, glyphs: [fruit], color: fruitInk },
        banner: { text, color },
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
    // Inky and Clyde wait in the ghost house behind its pink door.
    backdrop: tiles('════════╦═══════════╦══════╡I-C╞══════╦═══════════╦═══', {
      '═': ['═', INK.blue],
      '╦': ['╦', INK.blue],
      '╡': ['╡', INK.blue],
      '╞': ['╞', INK.blue],
      I: ['ᗣᗩ', INK.cyan],
      '-': ['━', INK.pink],
      C: ['ᗩᗣ', INK.orange],
    }),
    sky: tiles('··●··╶───╴···e···╶──────╴··●···', {
      '╶': ['╶', INK.blue],
      '─': ['─', INK.blue],
      '╴': ['╴', INK.blue],
      '·': ['·', INK.peach],
      '●': ['● ', INK.peach],
      e: ['ꝏ', INK.white],
    }),
    player: { glyphs: ['ᗧ', '●'], color: INK.yellow },
    trail: { glyphs: [' '], color: '' },
    ahead: tiles('·········●··········', {
      '·': ['·', [INK.peach, INK.peach, INK.white]],
      '●': ['● ', INK.peach],
    }),
    base: tiles('═══════╩════════════╩═════', { '═': ['═', INK.blue], '╩': ['╩', INK.blue] }),
    topCaption: { left: [[' 200', ' 400', ' 800', '1600'], INK.cyan] },
    caption: { left: ['ᗧᗧ', INK.yellow], right: ['ő', INK.red] },
    bonus: { glyphs: ['ő'], color: INK.red },
    chasers: {
      fiveHour: { glyphs: ['ᗣ', 'ᗩ'], color: INK.red },
      sevenDay: { glyphs: ['ᗩ', 'ᗣ'], color: INK.pink },
    },
    // Scared ghosts flash white before they recover.
    scared: { glyphs: ['ᗣ', 'ᗩ', 'ᗣ', 'ᗩ'], color: [INK.azure, INK.azure, INK.white, INK.white] },
    banner: { text: 'READY!', color: INK.yellow },
  },
  {
    id: 'invaders',
    stars: true,
    vary: (pick, game) => {
      const lives = pick([1, 2, 3], 0)
      const species = [
        ['ѫ', 'Ѫ'],
        ['ж', 'Ж'],
        ['ѭ', 'Ѭ'],
      ]
      const [text, color] = pick([['PLAY PLAYER<1>', INK.white], ['PLAY', INK.white], ['GAME OVER', INK.red]], 2)
      return {
        caption: { left: [`${lives} ${'Δ'.repeat(lives - 1)}`, INK.lime], right: [`CREDIT 0${pick([0, 1, 2, 3], 1)}`, INK.white] },
        banner: { text, color },
        chasers: {
          fiveHour: { ...game.chasers.fiveHour, glyphs: pick(species, 3) },
          sevenDay: { ...game.chasers.sevenDay, glyphs: pick(species, 4) },
        },
      }
    },
    scoreboard: { left: 'SCORE<1> {score}', right: 'HI-SCORE {hi}', ink: INK.white },
    logo: [['SPACE ', INK.white], ['INVADERS', INK.lime]],
    border: COLOR.green,
    screen: PAPER.black,
    backdrop: tiles('   ·        ▟U▙            ˙            ·         ˙       ·    ', {
      '·': ['·˙', INK.gray],
      '▟': ['▟', INK.red],
      U: ['◓◒', INK.red],
      '▙': ['▙', INK.red],
      '˙': ['˙·', INK.gray],
    }),
    // Invaders sit on even cells of an even-length row, so the whole formation steps together.
    sky: tiles('ѫ ж ѭ ѫ ʒ ѭ ѫ ж x ж ѫ ѭ        ', {
      ѫ: ['ѫѪ', INK.white],
      ж: ['жЖ', INK.white],
      ѭ: ['ѭѬ', INK.silver],
      ʒ: ['ʒ', [INK.white, INK.silver]],
      x: ['∗ ', INK.white],
    }),
    player: { glyphs: ['Δ', 'Λ'], color: INK.lime },
    shot: { glyphs: ['ı', '╵'], color: INK.white },
    trail: { glyphs: [' '], color: '' },
    ahead: tiles('   ▟█▙     ▟▚▙     ▞█▙     ▟▀▙  ', {
      '▟': ['▟', INK.lime],
      '█': ['█', INK.lime],
      '▙': ['▙', INK.lime],
      '▚': ['▚', INK.lime],
      '▞': ['▞', INK.lime],
      '▀': ['▀', INK.lime],
    }),
    base: tiles('▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔ ▔▔▔ ▔▔▔', { '▔': ['▔', INK.lime] }),
    topCaption: { left: [['◓=? MYSTERY', 'ѫ=30 POINTS', 'ж=20 POINTS', 'ѭ=10 POINTS'], INK.white] },
    caption: { left: ['3 ΔΔ', INK.lime], right: ['CREDIT 00', INK.white] },
    bonus: { glyphs: ['ж', 'Ж', '∗', ' '], color: INK.white },
    chasers: {
      fiveHour: { glyphs: ['ж', 'Ж'], color: INK.red },
      sevenDay: { glyphs: ['ѫ', 'Ѫ'], color: INK.pink },
    },
    banner: { text: 'PLAY PLAYER<1>', color: INK.white },
  },
  {
    id: 'ms-pacman',
    vary: (pick, game) => {
      // The four arcade mazes: wall color and pellet color.
      const [wall, pellet] = pick(
        [
          [INK.mazeSalmon, INK.peach],
          [INK.mazeSky, INK.white],
          [INK.mazeOrange, INK.white],
          [INK.mazeNavy, INK.peach],
        ],
        0,
      )
      const swap = new Map([
        [INK.mazeSalmon, wall],
        [INK.peach, pellet],
      ])
      const repaint = (sprite) => ({ ...sprite, colors: sprite.colors.map((color) => [color].flat().map((ink) => swap.get(ink) ?? ink)) })
      const ghosts = [INK.red, INK.pink, INK.cyan, INK.orange]
      const first = pick(ghosts, 1)
      const [fruit, fruitInk] = pick(
        [
          ['ő', INK.red],
          ['ǫ', INK.crimson],
          ['ȯ', INK.orange],
          ['ƨ', INK.amber],
          ['ǒ', INK.red],
          ['ð', INK.yellow],
          ['ɓ', INK.lime],
        ],
        2,
      )
      return {
        backdrop: repaint(game.backdrop),
        sky: repaint(game.sky),
        ahead: repaint(game.ahead),
        base: repaint(game.base),
        bonus: { ...game.bonus, glyphs: [fruit, ' ', fruit, fruit], color: fruitInk },
        banner: { ...game.banner, text: pick(['READY!', 'THEY MEET', 'THE CHASE', 'JUNIOR'], 3) },
        topCaption: { ...game.topCaption, right: [fruit, fruitInk] },
        caption: { ...game.caption, left: ['ᗧ'.repeat(pick([1, 2, 3], 4)), INK.yellow] },
        chasers: {
          fiveHour: { ...game.chasers.fiveHour, color: first },
          sevenDay: { ...game.chasers.sevenDay, color: pick(ghosts.filter((ink) => ink !== first), 5) },
        },
      }
    },
    scoreboard: { left: '1UP {score}', right: 'HIGH SCORE {hi}', blink: true },
    logo: [
      ['MS. ', INK.pink],
      ['PAC-MAN', INK.yellow],
    ],
    border: COLOR.magenta,
    screen: PAPER.black,
    // Solid maze walls with rounded ends and warp tunnel gaps, the ghost house where Inky and
    // Sue wait behind a blinking door, and the stork flying Junior through a tunnel.
    backdrop: tiles('▄▄▄▄▄▄▄▖ jk▗▄▄▄▄▄▄▄█I━S█▄▄▄▄▄▄▄▄▄▖   ▗▄▄▄▄▄▄', {
      '▄': ['▄', INK.mazeSalmon],
      '▖': ['▖', INK.mazeSalmon],
      '▗': ['▗', INK.mazeSalmon],
      '█': ['█', INK.mazeSalmon],
      I: ['ᗣᗩ', INK.cyan],
      '━': ['━', [INK.pink, INK.pink, INK.white]],
      S: ['ᗩᗣ', INK.orange],
      j: ['ₒ', INK.peach],
      k: ['ᘛᘚ', INK.white],
    }),
    sky: tiles('··●··▐███▌··ꝏ··▐██████▌··●··▐██▌··ᗤ··F··▐████▌··', {
      '·': ['·', INK.peach],
      '●': ['● ', [INK.peach, INK.white]],
      ꝏ: ['ꝏ', INK.white],
      '▐': ['▐', INK.mazeSalmon],
      '█': ['█', INK.mazeSalmon],
      '▌': ['▌', INK.mazeSalmon],
      ᗤ: ['ᗤ●', INK.yellow],
      F: ['ő˙ő ', INK.red],
    }),
    player: { glyphs: ['ᗧ', 'ᑕ', '●'], color: INK.yellow, tail: { glyphs: ['⋈'], color: [INK.red, INK.pink], length: 1 } },
    trail: { glyphs: [' '], color: '' },
    ahead: tiles('·········●··········', { '·': ['·', [INK.peach, INK.peach, INK.white]], '●': ['● ', [INK.peach, INK.white]] }),
    // A ghost slips through the warp tunnel in the bottom wall.
    base: tiles('▀▀▀▀▀▀▀▀▀▀▀▘ g ▝▀▀▀▀▀▀▀▀▀▀▀▀▀', {
      '▀': ['▀', INK.mazeSalmon],
      '▘': ['▘', INK.mazeSalmon],
      '▝': ['▝', INK.mazeSalmon],
      g: ['ᗣ  ', INK.red],
    }),
    topCaption: { left: [[' 200', ' 400', ' 800', '1600'], INK.cyan], right: ['ő', INK.red] },
    caption: { left: ['ᗧᗧ', INK.yellow], right: ['©1981 MIDWAY', INK.gray] },
    bonus: { glyphs: ['ő', ' ', 'ő', 'ő'], color: INK.red },
    banner: { text: 'READY!', color: INK.yellow },
    chasers: {
      fiveHour: { glyphs: ['ᗣ', 'ᗩ'], color: INK.red },
      sevenDay: { glyphs: ['ᗩ', 'ᗣ'], color: INK.orange },
    },
    scared: { glyphs: ['ᗣ', 'ᗩ', 'ᗣ', 'ᗩ'], color: [INK.azure, INK.azure, INK.white, INK.white] },
  },
  {
    id: 'asteroids',
    stars: true,
    vary: (pick) => ({
      topCaption: { left: ['Δ'.repeat(pick([2, 3, 4, 5], 0)), INK.white] },
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
      glyphs: ['ᐅ', 'ᐅ', 'Δ', 'ᐅ', 'ᐅ', 'v'],
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
    topCaption: { left: ['ΔΔΔ', INK.white] },
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
    id: 'mario',
    // Deals a brother, a world and a level. Level 2 of each world is underground and level 4
    // is Bowser's castle, as in the original game.
    vary: (pick, game) => {
      const [name, ink, glyphs] = pick(
        [
          ['MARIO', INK.red, ['Ꮇ', 'ᗰ']],
          ['LUIGI', INK.lime, ['Ꮮ', 'ᒪ']],
        ],
        0,
      )
      const level = pick([1, 2, 3, 4], 2)
      const world = `${pick([1, 2, 3, 4, 5, 6, 7, 8], 1)}-${level}`
      const coins = String(pick(Array.from({ length: 100 }, (_, count) => count), 3)).padStart(2, '0')
      const coin = ['◎○|○', INK.yellow]
      const pipes = tiles('      [P]          [P]     ', {
        '[': ['▐', INK.lime],
        P: ['████ΨΨ', [INK.green, INK.green, INK.green, INK.green, INK.red, INK.red]],
        ']': ['▌', INK.green],
      })
      const bridge = tiles('╤═', { '╤': ['╤', INK.amber], '═': ['═', INK.amber] })
      const underground = {
        screen: PAPER.black,
        backdrop: tiles('▦', { '▦': ['▦', INK.azure, PAPER.navy] }),
        sky: tiles('        BBBBB     o o o o       ', { B: ['▦', INK.azure, PAPER.navy], o: coin }),
        trail: pipes,
        ahead: pipes,
        base: tiles('▚▞', { '▚': ['▚', INK.azure, PAPER.navy], '▞': ['▞', INK.azure, PAPER.navy] }),
        bonus: { glyphs: ['◎', '○', '|', '○'], color: INK.yellow },
        chasers: { ...game.chasers, fiveHour: { ...game.chasers.fiveHour, color: INK.azure } },
      }
      const castle = {
        screen: PAPER.night,
        banner: { ...game.banner, text: `THANK YOU ${name}!` },
        backdrop: tiles('▀', { '▀': ['▀', INK.gray, PAPER.stone] }),
        sky: tiles('    F       GGG       F     ', { F: ['─╲│╱', [INK.orange, INK.yellow]], G: ['▦', INK.slate, PAPER.stone] }),
        trail: bridge,
        ahead: bridge,
        base: tiles('≈', { '≈': ['≈~', [INK.orange, INK.red, INK.yellow], PAPER.maroon] }),
        bonus: { glyphs: ['ᚦ'], color: [INK.amber, INK.white] },
        chasers: { ...game.chasers, sevenDay: { glyphs: ['Ѫ', 'ѫ'], color: [INK.lime, INK.orange] } },
      }
      return {
        scoreboard: { ...game.scoreboard, left: `${name} {score}` },
        banner: { ...game.banner, text: `WORLD ${world}` },
        player: { ...game.player, glyphs, color: ink },
        topCaption: { left: [`◎×${coins}`, INK.yellow], right: [`WORLD ${world}`, INK.white] },
        caption: { right: [`${glyphs[0]}×${pick([1, 2, 3, 4, 5], 4)}`, INK.white] },
        ...{ 2: underground, 4: castle }[level],
      }
    },
    scoreboard: { left: 'MARIO {score}', right: 'TIME {time}', ink: INK.white },
    logo: [['SUPER MARIO BROS', INK.peach]],
    banner: { text: 'WORLD 1-1', color: INK.white },
    border: COLOR.red,
    screen: PAPER.sky,
    backdrop: tiles('     ▂▅█▅▂               ▗▅▅▖             ', {
      '▂': ['▂', INK.white],
      '▅': ['▅', INK.white],
      '█': ['█', INK.white],
      '▗': ['▗', INK.white],
      '▖': ['▖', INK.white],
    }),
    sky: tiles('        B?B?B     o o     ?    o     ', {
      B: ['▦', INK.black, PAPER.brick],
      '?': ['?', [INK.umber, INK.umber, INK.white], PAPER.sand],
      o: ['◎○|○', INK.yellow],
    }),
    player: { glyphs: ['Ꮇ', 'ᗰ'], color: INK.red },
    shot: { glyphs: ['o', '°'], color: [INK.orange, INK.red, INK.yellow] },
    trail: tiles('  13531    bBBb    [P]     1353531    bBb   ', {
      1: ['▁', INK.green],
      3: ['▃', INK.green],
      5: ['▅', INK.green],
      b: ['▂', INK.lime],
      B: ['▄', INK.lime],
      '[': ['▐', INK.lime],
      P: ['████ΨΨ', [INK.green, INK.green, INK.green, INK.green, INK.red, INK.red]],
      ']': ['▌', INK.green],
    }),
    ahead: tiles('  13531    bBBb    [P]    ▟CDC▙    bBb   ', {
      1: ['▁', INK.green],
      3: ['▃', INK.green],
      5: ['▅', INK.green],
      b: ['▂', INK.lime],
      B: ['▄', INK.lime],
      '[': ['▐', INK.lime],
      P: ['████ΨΨ', [INK.green, INK.green, INK.green, INK.green, INK.red, INK.red]],
      ']': ['▌', INK.green],
      '▟': ['▟', INK.brown],
      C: ['█', INK.brown],
      D: ['Π', INK.black, PAPER.brick],
      '▙': ['▙', INK.brown],
    }),
    base: tiles('▚▞', { '▚': ['▚', INK.umber, PAPER.brick], '▞': ['▞', INK.umber, PAPER.brick] }),
    topCaption: { left: ['◎×07', INK.yellow], right: ['WORLD 1-1', INK.white] },
    caption: { right: ['Ꮇ×3', INK.white] },
    bonus: { glyphs: ['ᚹ', 'ᚹ', 'ᚠ'], color: [INK.white, INK.lime] },
    chasers: {
      fiveHour: { glyphs: ['ᗣ', 'ᗢ'], color: INK.brown },
      sevenDay: { glyphs: ['Ѭ', 'ѭ'], color: INK.lime },
    },
    scared: { glyphs: ['ᴗ', '▂'], color: [INK.brown, INK.white] },
  },
  {
    id: 'mortal-kombat',
    stars: true,
    // Each fighter throws a special move, and the session picks the arena, the announcer's call
    // and the rounds each side has won. fightCard deals the fighters from slots 0 to 3.
    vary: (pick, game) => {
      const roster = [
        ['SCORPION', INK.yellow, { glyphs: ['ᐅ', '─'], color: INK.amber }],
        ['SUB-ZERO', INK.cyan, { glyphs: ['∗', '*'], color: [INK.cyan, INK.white] }],
        ['LIU KANG', INK.red, { glyphs: ['●', '◉'], color: [INK.orange, INK.yellow, INK.red] }],
        ['JOHNNY CAGE', INK.silver, { glyphs: ['●', '◦'], color: INK.lime }],
        ['SONYA', INK.lime, { glyphs: ['○', '◎'], color: INK.pink }],
        ['RAIDEN', INK.white, { glyphs: ['ʒ', 'ʃ'], color: [INK.white, INK.azure] }],
        ['KANO', INK.crimson, { glyphs: ['ᐳ', '›'], color: INK.silver }],
      ]
      const card = fightCard(roster, [INK.amber, INK.crimson])(pick, game)
      const [, , special] = pick(roster, 0)
      const courtyard = {
        backdrop: tiles('  ▁▄▀▀▀▄▁   o    ▁▄▀▀▀▄▁      o   ', {
          '▁': ['▁', INK.crimson],
          '▄': ['▄', INK.crimson],
          '▀': ['▀', INK.wine],
          o: ['●', [INK.amber, INK.orange]],
        }),
        sky: tiles(' ΩΩΩ ΩΩ  ΩΩΩΩ ΩΩΩ  ΩΩ ', { Ω: ['ΩΏ', [INK.amber, INK.orange]] }),
        trail: tiles('▒░▒░▂░▒░', { '▒': ['▒', INK.brown, PAPER.tan], '░': ['░', INK.brown, PAPER.tan], '▂': ['▂', INK.red, PAPER.tan] }),
        ahead: tiles('▒░', { '▒': ['▒', INK.brown, PAPER.tan], '░': ['░', INK.brown, PAPER.tan] }),
        base: tiles('▀', { '▀': ['▀', INK.umber, PAPER.maroon] }),
      }
      const lair = {
        stars: false,
        screen: PAPER.black,
        backdrop: tiles('VvV V vVV  v ', {
          V: ['V', INK.gray, PAPER.stone],
          v: ['v', INK.slate, PAPER.stone],
          ' ': [' ', '', PAPER.stone],
        }),
        sky: tiles('  Ö    ┊    Ψ    Ö   ┊   ', {
          Ö: ['Ö', INK.peach],
          '┊': ['┊', INK.slate],
          Ψ: ['Ψψ', [INK.orange, INK.yellow, INK.red]],
        }),
        trail: tiles('▃▃▄▃╍▃▂▃▄', { '▃': ['▃', INK.umber], '▄': ['▄', INK.brown], '╍': ['╍', INK.peach], '▂': ['▂', INK.red] }),
        ahead: tiles('▃▃▄▃╍▃▃▄', { '▃': ['▃', INK.umber], '▄': ['▄', INK.brown], '╍': ['╍', INK.peach] }),
        base: tiles('▓▒▓Ö▒▓▒', { '▓': ['▓', INK.umber], '▒': ['▒', INK.umber], Ö: ['Ö', INK.peach] }),
      }
      return {
        ...card,
        ...pick([{}, courtyard, lair], 4),
        banner: { ...card.banner, text: pick([card.banner.text, 'FINISH HIM!', 'FATALITY', 'FLAWLESS VICTORY', 'TEST YOUR MIGHT'], 5) },
        shot: special,
        caption: { left: ['◉'.repeat(pick([0, 1, 2], 6)), INK.amber], right: ['◉'.repeat(pick([0, 1, 2], 7)), INK.amber] },
      }
    },
    scoreboard: { left: 'SCORPION {score}', right: 'SUB-ZERO {hi}', ink: INK.yellow },
    logo: [['MORTAL KOMBAT', INK.amber]],
    banner: { text: 'FIGHT!', color: INK.red },
    border: COLOR.yellow,
    screen: PAPER.night,
    backdrop: tiles('   ·      ˙    ▂▃◐▃▂        ·     ˙   ', {
      '·': ['·', INK.slate],
      '˙': ['˙', INK.gray],
      '◐': ['●', INK.peach],
      '▂': ['▂', INK.slate],
      '▃': ['▃', INK.slate],
    }),
    sky: tiles('   Ψ           Ψ           ', { Ψ: ['Ψψ', [INK.orange, INK.yellow, INK.red]] }),
    player: { glyphs: ['ᕦ', 'ᕤ', 'ᕙ', 'ᕗ'], color: INK.yellow },
    shot: { glyphs: ['ᐅ', '─'], color: INK.amber },
    trail: tiles('╤═══▂═══╤═════', { '╤': ['╤', INK.silver, PAPER.stone], '═': ['═', INK.gray, PAPER.stone], '▂': ['▂', INK.red, PAPER.stone] }),
    ahead: tiles('╤═══════', { '╤': ['╤', INK.silver, PAPER.stone], '═': ['═', INK.gray, PAPER.stone] }),
    base: tiles('ΛΔΛΔΛᛉΔΛΔΛΔ', { Λ: ['Λ', INK.silver, PAPER.black], Δ: ['Δ', INK.slate, PAPER.black], ᛉ: ['ᛉ', INK.red, PAPER.black] }),
    topCaption: { left: [drain(10, 'left'), INK.lime], right: [drain(10, 'right').reverse(), INK.lime] },
    caption: { left: ['◉', INK.amber], right: ['◉', INK.amber] },
    bonus: { glyphs: ['ᛟ'], color: INK.red, background: PAPER.stone },
    chasers: {
      fiveHour: { glyphs: ['ᕤ', 'ᕦ', 'ᕗ', 'ᕙ'], color: INK.cyan },
      sevenDay: { glyphs: ['Ж', 'ж'], color: INK.amber },
    },
  },
  {
    id: 'mortal-kombat-2',
    // Each fighter throws a special move, and the session picks the arena, the announcer's call,
    // the boss and the rounds the hero has won. fightCard deals the fighters from slots 0 to 3.
    vary: (pick, game) => {
      const roster = [
        ['LIU KANG', INK.red, { glyphs: ['●', '◉'], color: [INK.orange, INK.yellow, INK.red] }],
        ['KUNG LAO', INK.silver, { glyphs: ['ᗜ', 'ᗝ'], color: [INK.silver, INK.white] }],
        ['KITANA', INK.azure, { glyphs: ['Ψ', 'ψ'], color: INK.azure }],
        ['MILEENA', INK.pink, { glyphs: ['ᚼ', 'ᛡ'], color: INK.pink }],
        ['JAX', INK.purple, { glyphs: ['◎', '○'], color: INK.purple }],
        ['BARAKA', INK.amber, { glyphs: ['ᐳ', 'ᐅ'], color: [INK.amber, INK.white] }],
        ['REPTILE', INK.lime, { glyphs: ['°', '∘'], color: INK.lime }],
        ['SCORPION', INK.yellow, { glyphs: ['ᐅ', '─'], color: INK.amber }],
        ['SUB-ZERO', INK.cyan, { glyphs: ['∗', '*'], color: [INK.cyan, INK.white] }],
        ['RAIDEN', INK.white, { glyphs: ['ʒ', 'ʃ'], color: [INK.white, INK.azure] }],
        ['SHANG TSUNG', INK.crimson, { glyphs: ['Ö', 'ö'], color: [INK.orange, INK.red] }],
      ]
      const card = fightCard(roster, [INK.silver, INK.amber])(pick, game)
      const [, , special] = pick(roster, 0)
      const forest = {
        backdrop: tiles('▓▒▓▓▒░▓▒▓ ▓▓▒▓░▒▓', { '▓': ['▓', INK.olive], '▒': ['▒', INK.green], '░': ['░', INK.olive] }),
        sky: tiles('  ▐F▌      ▐F▌         ▐F▌   ', { '▐': ['▐', INK.umber], F: ['ÖÖÖO', INK.amber, PAPER.bark], '▌': ['▌', INK.umber] }),
        trail: tiles('▁▂▁▁▃▁▂▂', { '▁': ['▁', INK.olive], '▂': ['▂', INK.olive], '▃': ['▃', INK.green] }),
        ahead: tiles('▁▂▁▁▃▁▂', { '▁': ['▁', INK.olive], '▂': ['▂', INK.olive], '▃': ['▃', INK.green] }),
        base: tiles('▀▄▀▀▄', { '▀': ['▀', INK.umber], '▄': ['▄', INK.brown] }),
      }
      const portalFloor = tiles('▀', { '▀': ['▀', INK.silver, PAPER.stone] })
      const tombFloor = tiles('▀▀▀▄', { '▀': ['▀', INK.gray, PAPER.stone], '▄': ['▄', INK.slate, PAPER.stone] })
      const portal = {
        screen: PAPER.mkPortal,
        backdrop: tiles('   SSSSS         SSSSS    ', { S: ['░▒▓▒', [INK.purple, INK.pink, INK.purple]] }),
        sky: tiles('   ▟█▙          ▟▙        ', { '▟': ['▟', INK.slate], '█': ['█', INK.slate], '▙': ['▙', INK.slate] }),
        trail: portalFloor,
        ahead: portalFloor,
        base: tiles('░▒░', { '░': ['░', INK.purple, PAPER.violet], '▒': ['▒', INK.purple, PAPER.violet] }),
      }
      const tomb = {
        stars: false,
        screen: PAPER.black,
        backdrop: tiles('V', { V: ['V', INK.silver, PAPER.stone] }),
        sky: tiles('   Ψ     ▐▌     Ψ      ▐▌  ', {
          Ψ: ['Ψψ', [INK.orange, INK.yellow, INK.red]],
          '▐': ['▐', INK.slate],
          '▌': ['▌', INK.slate],
        }),
        trail: tombFloor,
        ahead: tombFloor,
        base: tiles('▓▒', { '▓': ['▓', INK.slate], '▒': ['▒', INK.slate] }),
      }
      const boss = pick([['Ѫ', 'ѫ'], ['Ж', 'ж']], 7)
      return {
        ...card,
        ...pick([{}, forest, portal, tomb], 4),
        banner: { ...card.banner, text: pick([card.banner.text, 'FINISH HIM!', 'FATALITY', 'FRIENDSHIP', 'BABALITY', 'FLAWLESS VICTORY'], 5) },
        shot: special,
        caption: { ...game.caption, left: ['◉'.repeat(pick([0, 1, 2], 6)), INK.amber] },
        chasers: { ...card.chasers, sevenDay: { ...card.chasers.sevenDay, glyphs: boss } },
      }
    },
    scoreboard: { left: 'LIU KANG {score}', right: 'SHAO KAHN {hi}', ink: INK.yellow },
    logo: [['MORTAL KOMBAT ', INK.amber], ['II', INK.red]],
    banner: { text: 'FIGHT!', color: INK.red },
    border: COLOR.yellow,
    screen: PAPER.night,
    backdrop: tiles('▀▀▀┬▀▀▀▀▀▀▀┬▀▀▀▀▀▀▀▀▀▀┬▀▀▀▀', { '▀': ['▀', INK.slate], '┬': ['┬', INK.silver] }),
    sky: tiles('   ʆ   ┆   ʆ     ┆    ʆ    ', { ʆ: ['ʆʃ', INK.silver], '┆': ['┆', INK.slate] }),
    player: { glyphs: ['ᕦ', 'ᕤ', 'ᕙ', 'ᕗ'], color: INK.red },
    shot: { glyphs: ['●', '◉'], color: [INK.orange, INK.yellow, INK.red] },
    trail: tiles('▀▀▀▀▂▀▀ ▀▀▀▀', { '▀': ['▀', INK.slate, PAPER.acid], ' ': ['°∘o ', INK.lime, PAPER.acid], '▂': ['▂', INK.red, PAPER.acid] }),
    ahead: tiles('▀▀▀▀▀▀▀ ▀▀▀▀', { '▀': ['▀', INK.slate, PAPER.acid], ' ': ['°∘o ', INK.lime, PAPER.acid] }),
    base: tiles('≈≈≈o≈≈≈≈°≈≈ᛉ≈', {
      '≈': ['≈~', INK.lime, PAPER.acid],
      o: ['o°˚ ', INK.lime, PAPER.acid],
      '°': ['°˚ o', INK.lime, PAPER.acid],
      ᛉ: ['ᛉᛉ˳≈', INK.peach, PAPER.acid],
    }),
    topCaption: { left: [drain(10, 'left').reverse(), INK.lime], right: [drain(10, 'right'), INK.lime] },
    caption: { left: ['◉', INK.amber], right: [[...Array(6).fill('       '), 'TOASTY!', 'TOASTY!'], INK.amber] },
    bonus: { glyphs: ['ᛟ'], color: INK.amber, background: PAPER.acid },
    chasers: {
      fiveHour: { glyphs: ['ᕤ', 'ᕦ', 'ᕗ', 'ᕙ'], color: INK.pink },
      sevenDay: { glyphs: ['Ѫ', 'ѫ'], color: INK.silver },
    },
  },
  {
    id: 'mortal-kombat-3',
    // Wraps the fight card and adds a stage, the hero's special move, a boss, an announcer call
    // and win medallions. Sub-Zero freezes the chasers and Cyrax nets them.
    vary: (pick, game) => {
      const roster = [
        ['SUB-ZERO', INK.cyan, { glyphs: ['∗', '*'], color: [INK.cyan, INK.white] }, { glyphs: ['█', '▓'], color: INK.cyan }],
        ['SEKTOR', INK.red, { glyphs: ['ᐅ', '›'], color: [INK.red, INK.orange] }],
        ['CYRAX', INK.yellow, { glyphs: ['ж', 'Ж'], color: INK.lime }, { glyphs: ['Ж'], color: INK.lime }],
        ['SMOKE', INK.silver, { glyphs: ['ᐳ', '─'], color: INK.silver }],
        ['NIGHTWOLF', INK.amber, { glyphs: ['»', '›'], color: INK.lime }],
        ['SINDEL', INK.pink, { glyphs: [')', '}'], color: [INK.pink, INK.white] }],
        ['STRYKER', INK.azure, { glyphs: ['•', '°'], color: INK.olive }],
        ['SONYA', INK.lime, { glyphs: ['○', '◦'], color: [INK.pink, INK.lime] }],
        ['JAX', INK.purple, { glyphs: ['≈', '~'], color: INK.purple }],
        ['KANO', INK.crimson, { glyphs: ['ł', '─'], color: INK.silver }],
        ['SHEEVA', INK.orange, { glyphs: ['●', '◉'], color: [INK.orange, INK.yellow, INK.red] }],
      ]
      const card = fightCard(roster, [INK.amber, INK.silver])(pick, game)
      const [, , shot, scared] = pick(roster, 0)
      const motaro = { glyphs: ['Ѫ', 'ѫ'], color: INK.umber, tail: { glyphs: ['ʒ', 'ʃ'], color: INK.umber, length: 2 } }
      const road = tiles('▁▁▁▁╌▁▁▁▁▁◒▁▁▁', {
        '▁': ['▁', INK.gray, PAPER.asphalt],
        '╌': ['╌', INK.yellow, PAPER.asphalt],
        '◒': ['◒', INK.slate, PAPER.asphalt],
      })
      const street = {
        stars: true,
        backdrop: tiles('  ▄▆▆▄   █w█w█    ▇▇▇▇   ▅w▅  ◐   ', {
          '▄': ['▄', INK.slate],
          '▅': ['▅', INK.slate],
          '▆': ['▆', INK.slate],
          '▇': ['▇', INK.slate],
          '█': ['█', INK.slate],
          w: ['▪', [INK.amber, INK.amber, INK.black], PAPER.stone],
          '◐': ['●', INK.peach],
        }),
        skySpeed: 0.5,
        sky: tiles('▒▒▒BAR▒▒▒  ▒▒WW▒▒WW▒▒ f  ▒▒▒▒W▒▒ f ', {
          '▒': ['▒', INK.wine, PAPER.redbrick],
          B: ['B', [INK.pink, INK.pink, INK.pink, INK.plum], PAPER.maroon],
          A: ['A', [INK.pink, INK.pink, INK.plum, INK.pink], PAPER.maroon],
          R: ['R', [INK.pink, INK.plum, INK.pink, INK.pink], PAPER.maroon],
          W: ['▪', [INK.amber, INK.amber, INK.black], PAPER.redbrick],
          f: ['ʌΛʌ^', [INK.red, INK.orange, INK.yellow, INK.orange]],
        }),
        trail: road,
        ahead: road,
        base: tiles('▀▀▀▀▀▀▀▀╨▀▀▀▀▀▀', { '▀': ['▀', INK.gray], '╨': ['╨', INK.red] }),
      }
      const bridge = tiles('▀▀▀╨▀▀▀▀╨', { '▀': ['▀', INK.gray, PAPER.stone], '╨': ['╨', INK.slate, PAPER.stone] })
      const pit = {
        screen: PAPER.violet,
        backdrop: tiles('   ʌ   ◐     ╱╲      ʌ    ╱╲╱╲   ', {
          ʌ: ['ʌ', INK.black],
          '╱': ['╱', INK.black],
          '╲': ['╲', INK.black],
          '◐': ['●', INK.white],
        }),
        skySpeed: 1,
        sky: tiles('     ʌ           v        ', { ʌ: ['ʌv', INK.black], v: ['vʌ', INK.black] }),
        trail: bridge,
        ahead: bridge,
        base: tiles('ΛΛΔΛΛ', { Λ: ['Λ', INK.silver, PAPER.maroon], Δ: ['Δ', INK.red, PAPER.maroon] }),
      }
      return {
        ...card,
        ...pick([{}, street, pit], 4),
        shot,
        scared,
        banner: { ...card.banner, text: pick([card.banner.text, 'TOASTY!', 'FLAWLESS VICTORY', 'FATALITY', 'ANIMALITY', 'EXCELLENT'], 6) },
        caption: { ...game.caption, left: ['ᛟ'.repeat(pick([1, 2], 7)), INK.amber] },
        chasers: { ...card.chasers, sevenDay: pick([card.chasers.sevenDay, motaro], 5) },
      }
    },
    scoreboard: { left: 'SUB-ZERO {score}', right: 'SEKTOR {hi}', ink: INK.yellow },
    logo: [['MORTAL KOMBAT ', INK.azure], ['3', INK.amber]],
    banner: { text: 'FIGHT!', color: INK.red },
    border: COLOR.yellow,
    screen: PAPER.night,
    backdrop: tiles('══╤▬▬╤══════╤▬▬╤═══▐EXIT▌══╤▬▬╤═', {
      '═': ['═', INK.slate],
      '╤': ['╤', INK.slate],
      '▬': ['▬', [INK.white, INK.white, INK.white, INK.slate]],
      '▐': ['▐', INK.wine],
      '▌': ['▌', INK.wine],
      E: ['E', INK.red, PAPER.maroon],
      X: ['X', INK.red, PAPER.maroon],
      I: ['I', INK.red, PAPER.maroon],
      T: ['T', INK.red, PAPER.maroon],
    }),
    skySpeed: -2,
    sky: tiles('RTTWPWTTWWPTTWPWTH═RTTWPWTTWWPTTWPWTH                     ', {
      T: ['▀', INK.silver, PAPER.steel],
      W: [' ', '', PAPER.trainWindow],
      P: ['•', INK.black, PAPER.trainWindow],
      R: ['▐', INK.red, PAPER.steel],
      H: ['▌', [INK.yellow, INK.white], PAPER.steel],
      '═': ['═', INK.gray],
    }),
    player: { glyphs: ['ᕦ', 'ᕤ'], color: INK.cyan },
    shot: { glyphs: ['∗', '*'], color: [INK.cyan, INK.white] },
    trail: tiles('══•╪═══,═╪', {
      '═': ['═', INK.slate, PAPER.stone],
      '╪': ['╪', INK.umber, PAPER.stone],
      '•': ['•', INK.red, PAPER.stone],
      ',': [',', INK.red, PAPER.stone],
    }),
    ahead: tiles('═══╪', { '═': ['═', INK.slate, PAPER.stone], '╪': ['╪', INK.umber, PAPER.stone] }),
    base: tiles('▚', { '▚': ['▚', INK.yellow, PAPER.night] }),
    topCaption: { left: [drain(10, 'left'), INK.lime], right: [drain(10, 'right'), INK.lime] },
    caption: { left: ['ᛟ', INK.amber], right: [Array.from({ length: 100 }, (_, tick) => String(99 - tick).padStart(2, '0')), INK.white] },
    bonus: { glyphs: ['ᛟ'], color: [INK.amber, INK.yellow], background: PAPER.stone },
    chasers: {
      fiveHour: { glyphs: ['ᕤ', 'ᕦ'], color: INK.red },
      sevenDay: { glyphs: ['Ѭ', 'ѭ'], color: INK.amber },
    },
  },
  {
    id: 'rampage',
    // Deals the monsters, the city of the day, day or night, and the food.
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
      const cities = ['PEORIA', 'CHICAGO', 'DETROIT', 'TOLEDO', 'MILWAUKEE', 'DALLAS', 'NEW YORK', 'LAS VEGAS']
      const city = pick(cities, 2)
      const foods = [
        { glyphs: ['ᛉ', 'ᛦ'], color: INK.pink },
        { glyphs: ['ɞ'], color: INK.amber },
        { glyphs: ['Ů'], color: INK.white },
      ]
      return {
        scoreboard: { ...game.scoreboard, left: `${hero} {score}`, right: `${rival} {hi}` },
        player: { ...game.player, glyphs, color: ink },
        topCaption: { left: [drain(8, 'left'), ink], right: [drain(8, 'right').reverse(), rivalInk] },
        banner: { ...game.banner, text: `DAY ${cities.indexOf(city) + 1} ${city}` },
        ...pick([{}, { screen: PAPER.navy, stars: true }], 3),
        bonus: { ...game.bonus, ...pick(foods, 4) },
      }
    },
    scoreboard: { left: 'GEORGE {score}', right: 'LIZZIE {hi}', ink: INK.amber },
    logo: [['RAMPAGE', INK.red]],
    banner: { text: 'DAY 1 PEORIA', color: INK.yellow },
    border: COLOR.orange,
    screen: PAPER.dusk,
    backdrop: tiles('  txttt   ¡  Ѫ     RRPRRR    ', {
      t: ['▪', [INK.yellow, INK.black, INK.yellow, INK.yellow], PAPER.tan],
      x: ['ʌΛ', [INK.orange, INK.red, INK.yellow], PAPER.black],
      '¡': ['¡', [INK.red, INK.red, INK.slate, INK.slate]],
      Ѫ: ['Ѫ', INK.umber],
      R: ['▪', [INK.yellow, INK.yellow, INK.yellow, INK.black], PAPER.redbrick],
      P: ['▪▪ᛉᛦ', [INK.yellow, INK.yellow, INK.pink, INK.pink], PAPER.redbrick],
    }),
    backdropSpeed: 0.5,
    sky: tiles('  ttptt  CHOTELC   RXRRPR    ', {
      t: ['▪', [INK.yellow, INK.yellow, INK.yellow, INK.black], PAPER.tan],
      p: ['ᛉᛦ▪▪', [INK.pink, INK.pink, INK.yellow, INK.yellow], PAPER.tan],
      C: ['▪', [INK.yellow, INK.black, INK.yellow], PAPER.concrete],
      H: ['H', [INK.pink, INK.pink, INK.pink, INK.plum], PAPER.concrete],
      O: ['O', [INK.pink, INK.pink, INK.plum, INK.pink], PAPER.concrete],
      T: ['T', [INK.pink, INK.plum, INK.pink, INK.pink], PAPER.concrete],
      E: ['E', [INK.plum, INK.pink, INK.pink, INK.pink], PAPER.concrete],
      L: ['L', [INK.pink, INK.pink, INK.pink, INK.plum], PAPER.concrete],
      R: ['▪', [INK.yellow, INK.yellow, INK.black, INK.yellow], PAPER.redbrick],
      X: ['ʌΛ', [INK.orange, INK.red, INK.yellow], PAPER.black],
      P: ['▪ᛉᛦ▪', [INK.yellow, INK.pink, INK.pink, INK.yellow], PAPER.redbrick],
    }),
    player: { glyphs: ['Ꮆ', 'Ᏻ'], color: INK.amber },
    shot: { glyphs: ['▘', '▝', '▗', '▖'], color: INK.brown },
    trail: tiles('▂▄░▃▅▂▒▃', {
      '▂': ['▂', INK.gray],
      '▃': ['▃', INK.brown],
      '▄': ['▄', INK.gray],
      '▅': ['▅', INK.slate],
      '░': ['░▒ ', [INK.silver, INK.gray]],
      '▒': ['▒░ ', [INK.gray, INK.silver]],
    }),
    ahead: tiles('TTTTTT CCCCC RRRRRRR ', {
      T: ['▫', INK.umber, PAPER.tan],
      C: ['▫', INK.slate, PAPER.concrete],
      R: ['▫', INK.wine, PAPER.redbrick],
    }),
    base: tiles('──  ──  ▐l▌  ──  ──    ', {
      '─': ['─', INK.white, PAPER.asphalt],
      ' ': [' ', '', PAPER.asphalt],
      '▐': ['▐', INK.white, PAPER.asphalt],
      l: ['▀', [INK.red, INK.azure], PAPER.asphalt],
      '▌': ['▌', INK.white, PAPER.asphalt],
    }),
    bonus: { glyphs: ['ᛉ', 'ᛦ'], color: INK.pink },
    scared: { glyphs: ['ж', 'Ж'], color: [INK.yellow, INK.orange, INK.red] },
    chasers: {
      fiveHour: { glyphs: ['▟', '▙'], color: INK.olive },
      sevenDay: { glyphs: ['Ŧ', 'Ͳ'], color: INK.white },
    },
  },
  {
    id: 'double-dragon',
    stars: true,
    // Deals Billy or Jimmy, the mission, a gang member, a boss who carries Marian off, and the
    // weapon.
    vary: (pick, game) => {
      const [label, ink] = pick(
        [
          ['1P', INK.azure],
          ['2P', INK.red],
        ],
        0,
      )
      const marian = { glyphs: ['ᛉ', 'ᛦ'], color: INK.pink, length: 1 }
      const gang = [
        { glyphs: ['ᕤ', 'ᕦ'], color: INK.red },
        { glyphs: ['ᕤ', 'ᕦ'], color: INK.silver },
        { glyphs: ['ᕤ', 'ᕦ'], color: INK.purple, tail: { glyphs: ['~', 'ʃ'], color: INK.umber, length: 2 } },
        { glyphs: ['ᕤ', 'ᕦ'], color: INK.lime },
      ]
      const bosses = [
        { glyphs: ['Ѫ', 'ѫ'], color: INK.amber, tail: marian },
        { glyphs: ['Ѭ', 'ѭ'], color: INK.white, tail: marian },
      ]
      const [item, flight, weaponInk] = pick(
        [
          ['╱', ['─', '╲', '│', '╱'], INK.amber],
          ['ł', ['─', '-'], INK.silver],
          ['ʃ', ['ʃ', '~'], INK.umber],
          ['ɨ', ['ɨ', '*'], INK.red],
        ],
        5,
      )
      const conveyor = tiles('═══«', { '═': ['═', INK.gray, PAPER.steel], '«': ['«', INK.amber, PAPER.steel] })
      const path = tiles('▁▁ʬ▁▁▁▁ʷ▁▁', {
        '▁': ['▁', INK.umber, PAPER.bark],
        ʬ: ['ʬ', INK.lime, PAPER.bark],
        ʷ: ['ʷ', INK.green, PAPER.bark],
      })
      const missions = [
        {},
        {
          topCaption: { ...game.topCaption, left: ['MISSION 2', INK.white] },
          backdrop: tiles('  █░▒   ▐█▌    ▄▄▄▄▄    █▒░  ◐  ', {
            '█': ['█', INK.slate],
            '▐': ['▐', INK.slate],
            '▌': ['▌', INK.slate],
            '▄': ['▄', INK.slate],
            '░': ['░▒ ', [INK.gray, INK.slate]],
            '▒': ['▒ ░', [INK.slate, INK.gray]],
            '◐': ['●', INK.peach],
          }),
          sky: tiles('═╦══╬══W══工場══╦══╬═WW══╦═', {
            '═': ['═', INK.gray, PAPER.steel],
            '╦': ['╦', INK.gray, PAPER.steel],
            '╬': ['╬', INK.red, PAPER.steel],
            W: ['▪', [INK.amber, INK.amber, INK.red], PAPER.steel],
            工: ['工', INK.yellow, PAPER.maroon],
            場: ['場', INK.yellow, PAPER.maroon],
          }),
          trail: conveyor,
          ahead: conveyor,
          base: tiles('o─', { o: ['oO', INK.gray], '─': ['─', INK.slate] }),
        },
        {
          topCaption: { ...game.topCaption, left: ['MISSION 3', INK.white] },
          backdrop: tiles(' ▃▅▇▅▃ ▂▄▆▄▂  ◐   ▃▆█▆▃ ▂▅▂ ', {
            '▂': ['▂', INK.green],
            '▃': ['▃', INK.green],
            '▄': ['▄', INK.green],
            '▅': ['▅', INK.green],
            '▆': ['▆', INK.green],
            '▇': ['▇', INK.green],
            '█': ['█', INK.green],
            '◐': ['●', INK.peach],
          }),
          sky: tiles('▓▒▓║▓▒森林▓▒║▓▓▒▓▒║▓', {
            '▓': ['▓▒', [INK.green, INK.olive], PAPER.acid],
            '▒': ['▒▓', [INK.olive, INK.green], PAPER.acid],
            '║': ['║', INK.umber, PAPER.acid],
            森: ['森', INK.amber, PAPER.maroon],
            林: ['林', INK.amber, PAPER.maroon],
          }),
          trail: path,
          ahead: path,
          base: tiles('▀▀▀▀▀ʷ', { '▀': ['▀', INK.green], ʷ: ['ʷ', INK.lime] }),
        },
      ]
      return {
        scoreboard: { ...game.scoreboard, left: `${label} {score}`, ink },
        player: { ...game.player, color: ink },
        caption: { left: ['ᕦ'.repeat(pick([1, 2, 3], 1)), ink], right: [drain(6, 'right'), INK.yellow] },
        ...pick(missions, 3),
        bonus: { ...game.bonus, glyphs: [item], color: weaponInk },
        shot: { ...game.shot, glyphs: flight, color: weaponInk },
        chasers: { fiveHour: pick(gang, 2), sevenDay: pick(bosses, 4) },
      }
    },
    scoreboard: { left: '1P {score}', right: 'HI {hi}', ink: INK.azure },
    logo: [['DOUBLE DRAGON ', INK.yellow], ['雙截龍', INK.red]],
    border: COLOR.magenta,
    screen: PAPER.night,
    backdrop: tiles(' ▃▅▃  ▂▆w▆▂   ▄Ŧ▄   ◐    ▃▅w▅▃ ', {
      '▂': ['▂', INK.slate],
      '▃': ['▃', INK.slate],
      '▄': ['▄', INK.slate],
      '▅': ['▅', INK.slate],
      '▆': ['▆', INK.slate],
      '▇': ['▇', INK.slate],
      w: ['▪', [INK.amber, INK.amber, INK.black], PAPER.stone],
      Ŧ: ['Ŧ', [INK.gray, INK.gray, INK.red]],
      '◐': ['●', INK.peach],
    }),
    topCaption: {
      left: ['MISSION 1', INK.white],
      right: [Array.from({ length: 100 }, (_, tick) => `TIME ${String(99 - tick).padStart(2, '0')}`), INK.yellow],
    },
    sky: tiles('▤▤▤W▤▤雙截龍▤▤W▤▤╳╳╳╳╳▤▤ʓßʃ▤WW▤≡≡≡≡≡▤▤武▤▤', {
      '▤': ['▤', INK.wine, PAPER.maroon],
      W: ['▪', [INK.amber, INK.amber, INK.amber, INK.black], PAPER.maroon],
      '╳': ['╳', INK.silver],
      ʓ: ['ʓ', INK.lime, PAPER.maroon],
      ß: ['ß', INK.cyan, PAPER.maroon],
      ʃ: ['ʃ', INK.pink, PAPER.maroon],
      '≡': ['≡', INK.silver, PAPER.steel],
      雙: ['雙', [INK.red, INK.red, INK.red, INK.pink], PAPER.maroon],
      截: ['截', [INK.red, INK.red, INK.pink, INK.red], PAPER.maroon],
      龍: ['龍', [INK.red, INK.pink, INK.red, INK.red], PAPER.maroon],
      武: ['武', [INK.cyan, INK.cyan, INK.cyan, INK.teal], PAPER.maroon],
    }),
    player: { glyphs: ['ᕦ', 'ᕤ'], color: INK.azure },
    shot: { glyphs: ['─', '╲', '│', '╱'], color: INK.silver },
    trail: tiles('▁▁▁╱▁▁▁▆▁▁╲▁▁◒░▁▁▤▁', {
      '▁': ['▁', INK.gray, PAPER.asphalt],
      '╱': ['╱', INK.slate, PAPER.asphalt],
      '╲': ['╲', INK.slate, PAPER.asphalt],
      '▆': ['▆', INK.wine, PAPER.asphalt],
      '◒': ['◒', INK.slate, PAPER.asphalt],
      '░': ['░▒  ', [INK.silver, INK.gray], PAPER.asphalt],
      '▤': ['▤', INK.umber, PAPER.asphalt],
    }),
    ahead: tiles('▁▁▁╱▁▁▁▆▁▁╲▁▁◒░▁▁▤▁', {
      '▁': ['▁', INK.gray, PAPER.asphalt],
      '╱': ['╱', INK.slate, PAPER.asphalt],
      '╲': ['╲', INK.slate, PAPER.asphalt],
      '▆': ['▆', INK.wine, PAPER.asphalt],
      '◒': ['◒', INK.slate, PAPER.asphalt],
      '░': ['░▒  ', [INK.silver, INK.gray], PAPER.asphalt],
      '▤': ['▤', INK.umber, PAPER.asphalt],
    }),
    base: tiles('▀▀▀▀▀▀▀╷▀▀~~▀▀▀╷', { '▀': ['▀', INK.slate], '╷': ['╷', INK.gray], '~': ['~≈', [INK.azure, INK.teal]] }),
    caption: { left: ['ᕦᕦ', INK.azure] },
    bonus: { glyphs: ['╱'], color: INK.amber, background: PAPER.asphalt },
    chasers: {
      fiveHour: { glyphs: ['ᕤ', 'ᕦ'], color: INK.red },
      sevenDay: { glyphs: ['Ѫ', 'ѫ'], color: INK.amber, tail: { glyphs: ['ᛉ', 'ᛦ'], color: INK.pink, length: 1 } },
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
  },  {
    id: 'contra',
    // Deals Bill or Lance, a weapon, a stage and spare medals.
    vary: (pick, game) => {
      const [label, ink] = pick(
        [
          ['1P', INK.azure],
          ['2P', INK.red],
        ],
        0,
      )
      const [weapon, flight, weaponInk] = pick(
        [
          ['S', ['•', '∙'], INK.red],
          ['M', ['-', '–'], INK.white],
          ['L', ['━', '─'], INK.cyan],
          ['F', ['o', 'O'], INK.orange],
          ['R', ['•', '·'], INK.yellow],
        ],
        1,
      )
      const ledge = tiles('▀▀▀▔▔▀▀▀  ', { '▀': ['▀', INK.slate, PAPER.stone], '▔': ['▔', INK.gray, PAPER.stone] })
      const stages = [
        {},
        {
          topCaption: { ...game.topCaption, right: ['WATERFALL', INK.white] },
          backdrop: tiles(' ▟██▙  ║║║   ▟█▙   ║║║  ', {
            '▟': ['▟', INK.slate],
            '█': ['█', INK.slate],
            '▙': ['▙', INK.slate],
            '║': ['║│', [INK.azure, INK.white, INK.cyan]],
          }),
          sky: tiles('  ▐▓▌ ║║滝║║  ▐▓▌  ⊙  ║║  ', {
            '▐': ['▐', INK.slate],
            '▓': ['▓', INK.gray, PAPER.stone],
            '▌': ['▌', INK.slate],
            '║': ['║│', [INK.azure, INK.white, INK.cyan]],
            滝: ['滝', INK.cyan, PAPER.navy],
            '⊙': ['⊙', [INK.red, INK.orange], PAPER.stone],
          }),
          trail: ledge,
          ahead: ledge,
          base: tiles('≈~°', { '≈': ['≈~', [INK.white, INK.azure], PAPER.navy], '~': ['~≈', INK.azure, PAPER.navy], '°': ['°o ', INK.white, PAPER.navy] }),
        },
        {
          screen: PAPER.maroon,
          topCaption: { ...game.topCaption, right: ['ALIEN LAIR', INK.white] },
          backdrop: tiles('ʘ◠◡◠◡ʘ◠◡◠◡◠ʘ◡', { ʘ: ['ʘ◉', [INK.pink, INK.crimson]], '◠': ['◠', INK.crimson], '◡': ['◡', INK.wine] }),
          sky: tiles('  0 0   ▐心臓▌   0  0 0  ', {
            0: ['0O', [INK.peach, INK.pink]],
            '▐': ['▐', INK.crimson],
            '▌': ['▌', INK.crimson],
            心: ['心', [INK.red, INK.pink], PAPER.violet],
            臓: ['臓', [INK.red, INK.pink], PAPER.violet],
          }),
          trail: tiles('▄▂▄▄▂', { '▄': ['▄', INK.crimson], '▂': ['▂', INK.pink] }),
          ahead: tiles('▄▂▄▄▂', { '▄': ['▄', INK.crimson], '▂': ['▂', INK.pink] }),
          base: tiles('ᴗᴖ', { ᴗ: ['ᴗᴖ', INK.pink], ᴖ: ['ᴖᴗ', INK.crimson] }),
          chasers: { ...game.chasers, fiveHour: { glyphs: ['ᘛ', 'ᘚ'], color: [INK.peach, INK.pink] } },
        },
      ]
      return {
        scoreboard: { ...game.scoreboard, left: `${label} {score}`, ink },
        player: { ...game.player, color: ink },
        topCaption: { ...game.topCaption, left: ['Ѳ'.repeat(pick([1, 2, 3, 4], 2)), INK.yellow] },
        caption: { ...game.caption, right: [weapon, weaponInk] },
        banner: { ...game.banner, text: pick(['1UP', 'CONTINUE', 'GAME OVER'], 4) },
        shot: { ...game.shot, glyphs: flight, color: weaponInk },
        ...pick(stages, 3),
      }
    },
    scoreboard: { left: '1P {score}', right: 'HI {hi}', ink: INK.azure },
    logo: [['CONTRA ', INK.red], ['魂斗羅', INK.amber]],
    border: COLOR.orange,
    screen: PAPER.navy,
    backdrop: tiles(' ᛉ ▓▒▓ ᛘ  ▲▲  ᛉ ▒▓▒▓ ᛘ  ', {
      ᛉ: ['ᛉᛘ', INK.lime],
      ᛘ: ['ᛘᛉ', INK.green],
      '▓': ['▓▒', [INK.green, INK.olive]],
      '▒': ['▒▓', [INK.olive, INK.green]],
      '▲': ['▲', INK.slate],
    }),
    topCaption: { left: ['ѲѲѲ', INK.yellow], right: ['JUNGLE', INK.white] },
    sky: tiles('  ┃ ┃   ╔魂斗羅╗  ◘◎◘  ┃ ┃   ║║  ', {
      '┃': ['┃', INK.umber],
      '╔': ['╔', INK.gray, PAPER.steel],
      魂: ['魂', [INK.amber, INK.amber, INK.white], PAPER.steel],
      斗: ['斗', [INK.amber, INK.white, INK.amber], PAPER.steel],
      羅: ['羅', [INK.white, INK.amber, INK.amber], PAPER.steel],
      '╗': ['╗', INK.gray, PAPER.steel],
      '◘': ['◘', INK.silver, PAPER.steel],
      '◎': ['◎', [INK.red, INK.red, INK.yellow], PAPER.steel],
      '║': ['║', INK.gray],
    }),
    banner: { text: '1UP', color: INK.white },
    player: { glyphs: ['ᕗ', 'ᕕ'], color: INK.azure },
    shot: { glyphs: ['•', '∙'], color: INK.red },
    // Explosions destroy the bridge behind the player.
    trail: tiles('▔▔ʷ▔▔╤═ *░ ═╤ ░* ▔▔ʬ▔', {
      '▔': ['▔', INK.lime, PAPER.bark],
      ʷ: ['ʷ', INK.green, PAPER.bark],
      ʬ: ['ʬ', INK.lime, PAPER.bark],
      '╤': ['╤', INK.amber],
      '═': ['═', INK.amber],
      '*': ['*+· ', [INK.yellow, INK.orange, INK.red]],
      '░': ['░▒ ', [INK.slate, INK.gray]],
    }),
    ahead: tiles('▔▔ʷ▔▔╤═╤═╤═╤═╤▔▔ʬ▔', {
      '▔': ['▔', INK.lime, PAPER.bark],
      ʷ: ['ʷ', INK.green, PAPER.bark],
      ʬ: ['ʬ', INK.lime, PAPER.bark],
      '╤': ['╤', INK.amber],
      '═': ['═', INK.amber],
    }),
    // A scuba soldier surfaces in the river.
    base: tiles('≈≈≈≈ᴖ≈≈≈≈≈≈≈≈≈', { '≈': ['≈~', [INK.azure, INK.cyan], PAPER.navy], ᴖ: ['ᴖ◓≈≈', INK.slate, PAPER.navy] }),
    caption: { left: ['©1987 KONAMI', INK.white], right: ['S', INK.red] },
    // The falcon capsule flashes its weapon letter.
    bonus: { glyphs: ['ᛘ', 'S', 'ᛘ', 'S'], color: [INK.red, INK.white], background: PAPER.steel },
    chasers: {
      fiveHour: { glyphs: ['ᕕ', 'ᕗ'], color: INK.silver },
      sevenDay: { glyphs: ['Ѽ', 'ѽ'], color: [INK.crimson, INK.pink] },
    },
    // A hit soldier explodes.
    scared: { glyphs: ['*', '⁕', '·'], color: [INK.yellow, INK.orange, INK.red] },
  },
]
