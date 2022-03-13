import type { Plate, Theme } from 'styles'

export interface IThemeContext {
  theme: Theme
  plate: Plate
  setTheme(this: void, theme: Theme | null): void
}
