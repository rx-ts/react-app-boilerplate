import { useContext, useState, useEffect, useCallback } from 'react'

import { ThemeContext } from './context'

import { useConstant } from 'hooks'
import type { Theme } from 'styles'

export const useTheme = () => useContext(ThemeContext)

export const useAutoTheme = (storedTheme?: Theme | null) => {
  const [theme, setTheme] = useState(storedTheme)

  const mql = useConstant(() =>
    window.matchMedia('(prefers-color-scheme:dark)'),
  )

  const [preferDark, setPreferDark] = useState(mql.matches)

  const onMqlChange = useCallback(
    ({ matches }: MediaQueryListEvent) => setPreferDark(matches),
    [],
  )

  useEffect(() => {
    if (!theme) {
      mql.addEventListener('change', onMqlChange)
    }

    return () => mql.removeEventListener('change', onMqlChange)
  }, [mql, onMqlChange, theme])

  return [theme || (preferDark ? 'dark' : 'light'), setTheme] as const
}
