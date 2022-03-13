/**
 * @packageDocumentation
 * @module translate
 */

import { head } from 'lodash'

import { LOCALE_STORAGE } from './constants'

import { getStorage, setStorage } from 'utils'

declare global {
  interface NavigatorLanguage {
    browserLanguage?: string
    userLanguage?: string
  }
}

export const getBrowserLang = () =>
  head(navigator.languages) ||
  navigator.language ||
  navigator.browserLanguage ||
  navigator.userLanguage

export function getLang<T extends string = string>(LOCALES: T[]): T
export function getLang(LOCALES?: []): undefined
export function getLang<T extends string = string>(
  LOCALES?: T[],
): T | undefined {
  const lang = (getStorage(LOCALE_STORAGE) || getBrowserLang()) as T
  return !LOCALES || LOCALES.length === 0 || LOCALES.includes(lang)
    ? lang
    : LOCALES[0]
}

export const setLang = (lang: string) => setStorage(LOCALE_STORAGE, lang)
