import { get, head, template } from 'lodash'
import type { Context } from 'react'
import { useCallback, useContext } from 'react'

import { DEFAULT_LOCALE, DEFAULT_LOCALES, FALLBACK_LOCALE } from './constants'
import { TranslateContext } from './context'
import type { ITranslateContext, TranslateState } from './types'

import { useConstant } from 'hooks'
import { TEMPLATE_OPTIONS } from 'shared'
import type { Arrayable, KeyOf, Nilable } from 'types'
import { arrayify, isObjectType } from 'utils'

function _getLooseLocale(locale: string) {
  return head(locale.split(/[_-]/))
}

function _getValue<L extends string, T>(
  source: Partial<Record<L, T>> | null,
  locale: L,
  loose?: boolean,
  defaultLocale: L = locale,
): T | null | undefined {
  if (!source) {
    return
  }
  /**
   * workaround for @see https://github.com/typescript-eslint/typescript-eslint/issues/3755
   */
  let value = source[locale] as Nilable<Partial<Record<L, T>>[L]>
  if (value == null && loose) {
    const looseLocale = _getLooseLocale(locale) as L
    value =
      locale === looseLocale
        ? Object.entries<T>(
            // @ts-expect-error -- it sucks
            source,
          ).find(([key]) => locale === _getLooseLocale(key))?.[1]
        : source[looseLocale]
  }
  if (value == null && locale !== defaultLocale) {
    return _getValue(source, defaultLocale, loose)
  }
  return value
}

function _getWithFallback<L extends string>(
  key: Arrayable<number | string>,
  locale: L,
  translations: i18n.Translations,
  loose?: boolean,
  defaultLocale: L = locale,
): string | undefined {
  const value = get(
    _getValue(
      translations as Partial<Record<L, unknown>>,
      locale,
      loose,
      defaultLocale,
    ),
    key,
  ) as unknown
  if (value != null) {
    if (
      process.env.NODE_ENV === 'development' &&
      typeof value === 'object' &&
      typeof get(value, Symbol.toPrimitive) !== 'function'
    ) {
      console.warn(
        `The translation for locale: \`${locale}\` and key: \`${JSON.stringify(
          key,
        )}\` is an object, which could be unexpected`,
      )
    }
    return String(value)
  }
  if (locale !== defaultLocale) {
    return _getWithFallback(key, defaultLocale, translations, loose)
  }
}

function _getBase<L extends string>(
  key: Arrayable<number | string>,
  locale: L,
  translationsList?: i18n.Translations[],
  loose?: boolean,
  defaultLocale: L = locale,
) {
  if (!translationsList || translationsList.length === 0) {
    return
  }
  for (let i = translationsList.length; i > 0; i--) {
    const value = _getWithFallback(
      key,
      locale,
      translationsList[i - 1],
      loose,
      defaultLocale,
    )
    if (value != null) {
      return value
    }
  }
}

function _get<L extends string>(
  key: Arrayable<number | string>,
  locale: L,
  translationsList: i18n.Translations[],
  ignoreNonExist?: boolean,
  loose?: boolean,
  defaultLocale: L = locale,
) {
  const value = _getBase(key, locale, translationsList, loose, defaultLocale)
  if (value != null) {
    return value
  }
  if (process.env.NODE_ENV === 'development' && !ignoreNonExist) {
    console.warn(
      `No translation found for locale: \`${locale}\` and key: \`${String(
        key,
      )}\`, which could be unexpected`,
    )
  }
}

const NUM_OR_STR_TYPES = new Set(['number', 'string'])

const isNumOrStr = (value: unknown): value is number | string =>
  NUM_OR_STR_TYPES.has(typeof value)

const checkTranslations = <
  T extends i18n.Translations,
  L extends KeyOf<T>,
  N extends KeyOf<T[L]>,
>(
  allTranslations: i18n.Translations[],
  translations?: Arrayable<i18n.Translations> | N,
) => {
  if (!translations || isNumOrStr(translations)) {
    return
  }

  for (const item of arrayify(translations)) {
    if (
      isObjectType<i18n.Translations>(item) &&
      !allTranslations.includes(item)
    ) {
      allTranslations.push(item)
    }
  }
}

const getNamespaces = <
  T extends i18n.Translations,
  L extends KeyOf<T>,
  N extends KeyOf<T[L]>,
>(
  translations?: Arrayable<i18n.Translations> | N,
  namespaces?: N,
): N[] => {
  if (Array.isArray(namespaces)) {
    return namespaces
  }

  if (isNumOrStr(namespaces)) {
    return [namespaces]
  }

  if (isNumOrStr(translations)) {
    return [translations]
  }

  if (!Array.isArray(translations)) {
    return []
  }

  return translations.reduce<N[]>((acc, curr) => {
    if (isNumOrStr(curr)) {
      // array namespaces is actually supported, but lack of typings for performance reason
      acc.push(curr as unknown as N)
    }
    return acc
  }, [])
}

export function useTranslate<
  T extends i18n.Translations = i18n.I18n,
  L extends KeyOf<T> = KeyOf<T>,
>(): TranslateState<T, L>
export function useTranslate<
  T extends i18n.Translations = i18n.I18n,
  L extends KeyOf<T> = KeyOf<T>,
  N extends KeyOf<T[L]> = KeyOf<T[L]>,
>(namespaces: N): TranslateState<T, L, N>
export function useTranslate<
  T extends i18n.Translations = i18n.I18n,
  L extends KeyOf<T> = KeyOf<T>,
  N extends KeyOf<T[L]> = never,
>(
  translations: Arrayable<i18n.Translations>,
  namespaces?: N,
): TranslateState<T, L, N>
export function useTranslate<
  T extends i18n.Translations,
  L extends KeyOf<T>,
  N extends KeyOf<T[L]>,
>(translations?: Arrayable<i18n.Translations> | N, namespaces?: N) {
  const {
    defaultLocale = FALLBACK_LOCALE as L,
    locale = DEFAULT_LOCALE as L,
    setLocale,
    allTranslations,
    loose,
    locales = DEFAULT_LOCALES as L[],
  } = useContext(
    TranslateContext as unknown as Context<ITranslateContext<T, L>>,
  )

  checkTranslations(allTranslations, translations)

  const ns = useConstant(() => getNamespaces(translations, namespaces))

  const raw: TranslateState<T, L, N>['raw'] = useCallback(
    (key, ignoreNonExist) => {
      if (isObjectType<Partial<Record<L, string>>>(key)) {
        return _getValue(key, locale, loose, defaultLocale)
      }

      const keys = (Array.isArray(key) ? key : [key]) as Array<number | string>

      const [firstKey, ...restKeys] = keys

      return _get(
        /**
         * @notable
         * Array paths are actually supported,
         * but the ts performance is unacceptable,
         * so it is just disabled in ts typings.
         */
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        firstKey === null ? arrayify(restKeys) : arrayify(ns, keys),
        locale,
        allTranslations,
        ignoreNonExist,
        loose,
        defaultLocale,
      )
    },
    [allTranslations, defaultLocale, locale, loose, ns],
  )

  const t: TranslateState<T, L, N>['t'] = useCallback(
    (key, data, ignoreNonExistOrFallbackKey) => {
      const isFallbackKey =
        ignoreNonExistOrFallbackKey != null &&
        typeof ignoreNonExistOrFallbackKey !== 'boolean'
      const ignoreNonExist =
        isFallbackKey || (ignoreNonExistOrFallbackKey as boolean)

      let translation = raw(key, ignoreNonExist)

      if (translation == null && isFallbackKey) {
        translation = raw(ignoreNonExistOrFallbackKey)
      }

      /**
       * @notable
       * Thanks for ts static checker, we can mark it always `string` here,
       * but actually it could bu nullable at runtime.
       */
      if (translation == null) {
        return (isObjectType(key) ? null : key)!
      }

      const implicit = { $raw: raw, $t: t, $: data }

      return template(
        String(translation),
        TEMPLATE_OPTIONS,
      )(isObjectType(data) ? Object.assign(implicit, data) : implicit)
    },
    [raw],
  )

  return {
    defaultLocale,
    locale,
    setLocale,
    allTranslations,
    loose,
    locales,
    raw,
    t,
  }
}
