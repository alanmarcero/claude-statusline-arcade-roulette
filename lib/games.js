// The ids of the game modules in lib/games/, in the order pickGame deals them. The status line
// imports only the dealt game, so it never builds the pixel art of the other fifteen.
// Every glyph must render one column wide, except CJK scenery and titles, which WIDE covers.
// Emoji and most symbols in U+2600-U+27BF are two columns in some terminals, so they break
// the border alignment.
export const GAMES = [
  'pacman',
  'mario',
  'mario-2',
  'mario-3',
  'zelda',
  'punch-out',
  'mortal-kombat',
  'mortal-kombat-2',
  'mortal-kombat-3',
  'rampage',
  'double-dragon',
  'tmnt',
  'contra',
  'sonic',
  'sonic-2',
  'narc',
]
