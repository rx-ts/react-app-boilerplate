import { useContext } from 'react'

import { BreadcrumbContext } from './context'

export const useBreadcrumb = () => useContext(BreadcrumbContext)
