import { AUTHORIZATION, base64UrlDecode } from 'shared'
import type { AuthInfo, AuthTokenInfo } from 'types'
import { ACCESS_TOKEN_KEY, getStorage } from 'utils'

export const getAuthHeader = () => ({
  [AUTHORIZATION]: `Bearer ${getStorage(ACCESS_TOKEN_KEY)!}`,
})

export const getAuthInfoFromToken = (
  token = getStorage(ACCESS_TOKEN_KEY),
): AuthInfo | undefined => {
  if (!token) {
    return
  }

  let authTokenInfo: AuthTokenInfo

  try {
    authTokenInfo = JSON.parse(
      base64UrlDecode(token.split('.')[1]),
    ) as AuthTokenInfo
  } catch (err) {
    console.error('jwt decode failed:', err)
    return
  }

  return {
    tenant: authTokenInfo.tenant_id,
    user: {
      id: authTokenInfo.user_id,
      name: authTokenInfo.user_name,
    },
  }
}
