import { createContext } from 'react'

import type { ITranslateContext } from './types'

export const TranslateContext = createContext<ITranslateContext>(null!)
