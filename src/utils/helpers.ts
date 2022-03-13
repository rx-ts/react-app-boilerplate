import { camelCase, isPlainObject, upperFirst } from 'lodash'
import { Observable } from 'rxjs'

import type { Arrayable } from 'types'

export const identify = <T>(
  _: T,
): _ is Exclude<
  T,
  '' | (T extends boolean ? false : boolean) | null | undefined
> => !!_

export const pascalCase = (val: string): string => upperFirst(camelCase(val))

export const isObjectType = <T extends object>(obj: unknown): obj is T =>
  isPlainObject(obj)

export const arrayify = <
  T,
  R = T extends Arrayable<infer S> ? NonNullable<S> : NonNullable<T>,
>(
  ...args: Array<R | R[]>
) =>
  args.reduce<R[]>((arr, curr) => {
    arr.push(...(Array.isArray(curr) ? curr : [curr]).filter(_ => _ != null))
    return arr
  }, [])

export const isPromiseLike = <T = unknown>(
  value: unknown,
): value is PromiseLike<T> =>
  !!value &&
  typeof value === 'object' &&
  'then' in value &&
  typeof (value as { then: unknown }).then === 'function'

export const isObservableLike = <T = unknown>(
  value: unknown,
): value is Observable<T> | PromiseLike<T> =>
  value instanceof Observable || isPromiseLike<T>(value)
