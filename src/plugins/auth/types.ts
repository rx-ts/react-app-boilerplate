import type { AuthInfo } from 'types'

export interface IAuthContext {
  authInfo: AuthInfo
  setAuthInfo(this: void, authInfo: AuthInfo | null): void
}
