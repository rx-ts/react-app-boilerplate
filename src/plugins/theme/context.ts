import { createContext } from 'react'

import type { IThemeContext } from './types'

export const ThemeContext = createContext<IThemeContext>(null!)
