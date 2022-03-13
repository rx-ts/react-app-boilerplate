import { createContext } from 'react'

import type { IBreadcrumbContext } from './types'

export const BreadcrumbContext = createContext<IBreadcrumbContext>(null!)
