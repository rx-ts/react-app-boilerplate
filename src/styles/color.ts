import type {
  ShortThemeColor,
  ThemeColor,
  ThemeColorLevel,
  VarColor,
} from 'types'

export const varColor = (
  color: ThemeColor | `${ShortThemeColor}-${ThemeColorLevel}`,
  alpha?: number,
): VarColor => {
  if (alpha == null) {
    return `rgb(var(--color-${color}))`
  }
  return `rgba(var(--color-${color}),${alpha})`
}
