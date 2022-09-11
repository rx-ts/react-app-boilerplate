import { Locale } from '@react-enhanced/plugins'

export const TOGGLE_LOCALE_MAPPER = {
  [Locale.EN]: Locale.ZH,
  [Locale.ZH]: Locale.EN,
} as const

export const ACCESS_TOKEN_KEY = '__ACCESS_TOKEN__'
