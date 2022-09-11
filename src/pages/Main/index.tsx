import { interceptors, useMounted } from '@react-enhanced/hooks'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { NEVER } from 'rxjs'

import { Loading } from 'components'
import { Page } from 'pages'
import type { IAuthContext } from 'plugins'
import { useAuth } from 'plugins'
import { UNAUTHORIZED } from 'shared'
import type { SetOptional } from 'types'
import { getAuthInfoFromToken } from 'utils'

export default () => {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const { authInfo, setAuthInfo } = useAuth() as SetOptional<
    IAuthContext,
    'authInfo'
  >

  useMounted(() => {
    const login = () => {
      navigate(`/login?from=${pathname}`)
    }

    interceptors.response.use(null, (_, err) => {
      if (err.code === UNAUTHORIZED) {
        setAuthInfo(null)
        login()
        return NEVER
      }
      throw err
    })

    if (authInfo) {
      return
    }

    const tokenAuthInfo = getAuthInfoFromToken()
    if (tokenAuthInfo) {
      setAuthInfo(tokenAuthInfo)
      return
    }

    login()
  })

  return authInfo ? (
    <Routes>
      <Route
        path="home"
        element={<Page page="home" />}
      />
    </Routes>
  ) : (
    <Loading />
  )
}
