import type { BuildEnv } from '../types'

export const isEnvEnabled = (env: BuildEnv) =>
  ['1', 'true'].includes(process.env[env]!)

export const parseUrl = (url: string, base?: URL | string | null) =>
  new URL(url, base ?? (__SERVER__ ? 'http://localhost' : location.origin))
