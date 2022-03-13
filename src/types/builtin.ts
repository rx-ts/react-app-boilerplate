import type { Nilable } from 'types'

export type URLSearchParamsInit =
  | ConstructorParameters<typeof URLSearchParams>[0]

export type URLSearchParamsOptions =
  | Record<string, Nilable<number | string>>
  | URLSearchParamsInit
  | object
