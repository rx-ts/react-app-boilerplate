import { createContext } from 'react'

import type { IAuthContext } from './types'

export const AuthContext = createContext<IAuthContext>(null!)
