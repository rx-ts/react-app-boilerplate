import type { Numeric } from './basic'

export type ColorAlphabetic = 'a' | 'b' | 'c' | 'd' | 'e' | 'f'

export type ColorCharacter = ColorAlphabetic | Numeric

export type ThemeColor =
  | 'blue'
  | 'green'
  | 'neutral'
  | 'primary'
  | 'red'
  | 'yellow'

export type ShortThemeColor = 'b' | 'g' | 'n' | 'p' | 'r' | 'y'

export type ThemeColorLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10

export type VarColor =
  | `rgb(var(--color-${ThemeColor | `${ShortThemeColor}-${ThemeColorLevel}`}))`
  | `rgba(var(--color-${
      | ThemeColor
      | `${ShortThemeColor}-${ThemeColorLevel}`}),${number})`

export type Color =
  | VarColor
  | `#${ColorCharacter}${ColorCharacter}${ColorCharacter}`
  /**
   * ideally, the following should be used
   * @see https://github.com/microsoft/TypeScript/issues/44792
   */
  // | `#${ColorCharacter}${ColorCharacter}${ColorCharacter}${ColorCharacter}${ColorCharacter}${ColorCharacter}`
  | `#${string}`
  | `rgb(${number},${number},${number})`
  | `rgba(${number},${number},${number},${number})`

export type Unit = '%' | 'em' | 'px' | 'rem' | 'vh' | 'vmax' | 'vmin' | 'vw'

export type Size = number | `${number}${Unit}`
