import type { FC, PropsWithChildren, ReactNode } from 'react'
import { useEffect, useState } from 'react'

import { BreadcrumbContext } from './context'
import { useBreadcrumb } from './hook'

export const BreadcrumbContextProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const [breadcrumb, setBreadcrumb] = useState<ReactNode>(null)
  return (
    <BreadcrumbContext.Provider value={{ breadcrumb, setBreadcrumb }}>
      {children}
    </BreadcrumbContext.Provider>
  )
}

export const BreadCrumb: FC<PropsWithChildren> = ({ children }) => {
  const { setBreadcrumb } = useBreadcrumb()
  useEffect(() => {
    setBreadcrumb(children)
    return () => setBreadcrumb(null)
  }, [children, setBreadcrumb])
  return null
}
