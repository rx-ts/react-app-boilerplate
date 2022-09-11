import {
  DEFAULT_LOCALE,
  Locale,
  TranslateContext,
  setLang,
} from '@react-enhanced/plugins'
import { useMemo, useState } from 'react'
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom'

import './styles/global.less'

// import './interceptors'

import { ConfigApp } from './ConfigApp'

import { core } from 'i18n/core'
import { Login, Main } from 'layouts'
import {
  AuthContext,
  ThemeContext,
  THEME_STORAGE,
  useAutoTheme,
  DEFAULT_THEME,
} from 'plugins'
import { plates } from 'styles'
import type { AuthInfo } from 'types'
import { ACCESS_TOKEN_KEY, removeStorage, setStorage } from 'utils'

export const App = () => {
  const [authInfo, setAuthInfo] = useState<AuthInfo | null>(null)
  const [locale, setLocale] = useState<Locale>(DEFAULT_LOCALE)
  const [theme, setTheme] = useAutoTheme(DEFAULT_THEME)

  return (
    <AuthContext.Provider
      value={useMemo(
        () => ({
          authInfo: authInfo!, // it can be `null` actually, but it can't be `null` in pages inside `Main`
          setAuthInfo(authInfo) {
            setAuthInfo(authInfo)
            if (!authInfo) {
              removeStorage(ACCESS_TOKEN_KEY)
            }
          },
        }),
        [authInfo],
      )}
    >
      <TranslateContext.Provider
        value={useMemo(
          () => ({
            defaultLocale: Locale.ZH,
            locale,
            setLocale(nextLocale: Locale | ((prevLocale: Locale) => Locale)) {
              if (typeof nextLocale === 'function') {
                nextLocale = nextLocale(locale)
              }

              setLocale(nextLocale)
              setLang(nextLocale)
            },
            allTranslations: [core],
            loose: true,
          }),
          [locale],
        )}
      >
        <ThemeContext.Provider
          value={useMemo(
            () => ({
              theme,
              plate: plates[theme],
              setTheme(theme) {
                setTheme(theme)
                if (theme) {
                  document.documentElement.dataset.theme = theme
                  setStorage(THEME_STORAGE, theme)
                } else {
                  delete document.documentElement.dataset.theme
                  removeStorage(THEME_STORAGE)
                }
              },
            }),
            [setTheme, theme],
          )}
        >
          <ConfigApp>
            <Router>
              <Routes>
                <Route
                  path="/"
                  element={
                    <Navigate
                      to="/home"
                      replace={true}
                    />
                  }
                />
                <Route
                  path="/login"
                  element={<Login />}
                />
                <Route
                  path="*"
                  element={<Main />}
                />
              </Routes>
            </Router>
          </ConfigApp>
        </ThemeContext.Provider>
      </TranslateContext.Provider>
    </AuthContext.Provider>
  )
}
