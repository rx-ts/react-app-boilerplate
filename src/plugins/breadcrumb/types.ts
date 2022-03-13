import type { ReactNode } from 'react'

export interface IBreadcrumbContext {
  breadcrumb: ReactNode
  setBreadcrumb: (breadcrumb: ReactNode) => void
}
