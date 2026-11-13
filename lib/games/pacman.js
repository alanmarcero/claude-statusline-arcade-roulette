import { COLOR, OPAQUE, ink, paper, sprite, tiles } from '../art.js'

const MAZE = ink(20)
const DOOR = ink(218)
const PELLET = ink(217)
const YELLOW = ink(226)
const WHITE = ink(231)
const CYAN = ink(51)
const SCARED = ink(27)
const BLACK = ink(16)
const GHOSTS = { red: ink(196), pink: ink(218), cyan: ink(51), orange: ink(215) }

// Eaten ghosts return to the middle slots, C and D.
const house = (inks) =>
  sprite(['╔═━━═╗\n║ACDB║', '╔═━━═╗\n║acdb║'], {
    '╔': ['╔', MAZE],
    '═': ['═', MAZE],
    '━': ['━', DOOR],
    '╗': ['╗', MAZE],
    '║': ['║', MAZE],
    ...Object.fromEntries(['A', 'B', 'C', 'D'].map((key, slot) => [key, inks[slot] ? ['ᗣ', inks[slot]] : [OPAQUE]])),
    ...Object.fromEntries(['a', 'b', 'c', 'd'].map((key, slot) => [key, inks[slot] ? ['ᗩ', inks[slot]] : [OPAQUE]])),
  })

export default {
  id: 'pacman',
  loop: 48,
  // Deals the chasing ghosts, the fruit, the spare lives and the banner.
  vary: (pick, game) => {
    const [first, second, ...waiting] = [
      [GHOSTS.red, GHOSTS.pink, GHOSTS.cyan, GHOSTS.orange],
      [GHOSTS.pink, GHOSTS.cyan, GHOSTS.red, GHOSTS.orange],
      [GHOSTS.cyan, GHOSTS.orange, GHOSTS.red, GHOSTS.pink],
      [GHOSTS.orange, GHOSTS.red, GHOSTS.pink, GHOSTS.cyan],
    ][pick([0, 1, 2, 3], 0)]
    const fruits = [
      ['δ', ink(196), '100'],
      ['ő', ink(161), '300'],
      ['ȯ', ink(208), '500'],
      ['ǒ', ink(196), '700'],
      ['ɵ', ink(46), '1000'],
      ['ψ', ink(226), '2000'],
      ['Ѧ', ink(226), '3000'],
      ['ł', ink(51), '5000'],
    ]
    const level = pick([0, 1, 2, 3, 4, 5, 6, 7], 1)
    const [fruit, fruitInk, fruitScore] = fruits[level]
    const served = fruits.slice(Math.max(level - 2, 0), level + 1).map(([glyph]) => glyph)
    const lives = pick([1, 2, 3], 4)
    // GAME OVER means no spare lives.
    const [banner, spare] = pick(
      [
        [[[[0, 'READY!'], [4, '']], YELLOW], lives],
        [[[[0, 'PLAYER ONE'], [2, 'READY!'], [4, '']], [[0, CYAN], [2, YELLOW]]], lives],
        [[[[0, 'READY!'], [4, ''], [44, 'GAME  OVER']], [[0, YELLOW], [44, GHOSTS.red]]], 0],
      ],
      2,
    )
    return {
      banner,
      caption: { left: ['ᗧ'.repeat(spare), YELLOW], right: [served.join(''), fruitInk] },
      sprites: {
        ...game.sprites,
        first: { ...game.sprites.first, color: first },
        second: { ...game.sprites.second, color: second },
        fruit: { glyphs: [fruit], color: fruitInk },
        fruitScore: { glyphs: [fruitScore], color: DOOR },
        house: house(waiting),
        houseOne: house([...waiting, first]),
        houseTwo: house([...waiting, first, second]),
        houseLast: house([...waiting, undefined, second]),
      },
    }
  },
  scoreboard: { left: '1UP {score}', right: 'HIGH SCORE {hi}', blink: true },
  logo: [['PAC-MAN', YELLOW]],
  border: COLOR.blue,
  screen: paper(16),
  speeds: [0, 0, 0, 0],
  backdrop: tiles('═══════╦══════════════╦══════', { '═': ['═', MAZE], '╦': ['╦', MAZE] }),
  sky: tiles('       ║              ║      ', { '║': ['╹', MAZE] }),
  ahead: tiles('· ', { '·': ['·', PELLET] }),
  trail: tiles(' ', {}),
  base: tiles('════════════╩═════════', { '═': ['═', MAZE], '╩': ['╩', MAZE] }),
  banner: [[[0, 'READY!'], [4, '']], YELLOW],
  caption: { left: ['ᗧᗧ', YELLOW], right: ['δ', ink(196)] },
  icons: { fiveHour: 'first', sevenDay: 'second' },
  sprites: {
    pac: { glyphs: ['ᗧ', '●'], color: YELLOW },
    pacLeft: { glyphs: ['ᗤ', '●'], color: YELLOW },
    pacStill: { glyphs: ['●'], color: YELLOW },
    dying: { glyphs: ['ᗧ', 'ᗢ', '◡', '‿', '·', '*'], color: YELLOW },
    first: { glyphs: ['ᗣ', 'ᗩ'], color: GHOSTS.red },
    second: { glyphs: ['ᗣ', 'ᗩ'], color: GHOSTS.pink },
    scared: { glyphs: ['ᗣ', 'ᗩ'], color: SCARED },
    flashing: { glyphs: ['ᗣ', 'ᗩ'], color: [SCARED, WHITE] },
    eyes: { glyphs: ['¨'], color: WHITE },
    power: { glyphs: ['●'], color: [PELLET, BLACK] },
    fruit: { glyphs: ['δ'], color: ink(196) },
    points200: { glyphs: ['200'], color: CYAN },
    points400: { glyphs: ['400'], color: CYAN },
    fruitScore: { glyphs: ['100'], color: DOOR },
    house: house([GHOSTS.cyan, GHOSTS.orange]),
    houseOne: house([GHOSTS.cyan, GHOSTS.orange, GHOSTS.red]),
    houseTwo: house([GHOSTS.cyan, GHOSTS.orange, GHOSTS.red, GHOSTS.pink]),
    houseLast: house([GHOSTS.cyan, GHOSTS.orange, undefined, GHOSTS.pink]),
    houseEmpty: house([]),
  },
  // After READY!, Pac-Man eats the power pellet and both chasing ghosts. Their eyes return to the house.
  // He eats the fruit. A ghost from the house catches him, and the ghosts vanish.
  cast: {
    house: [
      [0, 'house', 5, 0, 'sky'],
      [24, 'houseOne', 5, 0, 'sky'],
      [29, 'houseTwo', 5, 0, 'sky'],
      [34, 'houseLast', 5, 0, 'sky'],
      [38, 'houseEmpty', 5, 0, 'sky'],
    ],
    power: [[0, 'power', 1], [14]],
    fruit: [[24, 'fruit', 3], [29]],
    first: [
      [0, 'first', -14],
      [4, 'first', -14, 1],
      [14, 'scared', -4, -0.5],
      [17],
      [34, 'first', 7, 0, 'backdrop'],
      [35, 'first', 11, 0, 'sky'],
      [36, 'first', 11],
      [38],
    ],
    second: [[0, 'second', -18], [4, 'second', -18, 1], [14, 'scared', -8, -0.5], [18, 'flashing', null, -0.5], [20]],
    eyesFirst: [[18, 'eyes', -5, 3, 'sky'], [22, 'eyes', 7, 0, 'backdrop'], [23, 'eyes', 7, 0, 'sky'], [24]],
    eyesSecond: [[21, 'eyes', -11, 3, 'sky'], [27, 'eyes', 8, 0, 'backdrop'], [28, 'eyes', 8, 0, 'sky'], [29]],
    points: [
      [17, 'points200', -6, 0, 'sky'],
      [19, 'points200', -6, 0, 'backdrop'],
      [20, 'points400', -12, 0, 'sky'],
      [22, 'points400', -12, 0, 'backdrop'],
      [23],
      [29, 'fruitScore', 1, 0, 'sky'],
      [31, 'fruitScore', 1, 0, 'backdrop'],
      [32],
    ],
    // The catch stays within 12 cells of the anchor to fit the narrowest field.
    player: [
      [0, 'pacStill', -9],
      [4, 'pac', -9, 1],
      [14, 'pacLeft', 1, -2],
      [20, 'pacStill', -11],
      [21, 'pac', -11, 2],
      [27, 'pac', 1, 1],
      [37, 'pacStill', 10],
      [38, 'dying', 10],
      [44],
    ],
  },
}
