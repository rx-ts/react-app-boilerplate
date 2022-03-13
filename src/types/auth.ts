export interface AuthTokenInfo {
  tenant_id: string
  user_id: string
  user_name: string
}

export interface AuthUser {
  id: string
  name: string
}

export interface AuthInfo {
  tenant: string
  user: AuthUser
}
