// no idea how to fix it without dynamic import syntax
/* eslint-disable @typescript-eslint/consistent-type-imports */

declare namespace api {
  export type Error = import('shared').ApiError
}

declare namespace i18n {
  export interface Translations {
    en: import('./plugins').Translation
    zh: import('./plugins').Translation
  }

  export type I18n = import('./i18n').I18n
}

declare const __DEV__: boolean
declare const __SERVER__: boolean
