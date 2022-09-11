import type { Nilable } from 'types'

export type URLSearchParamsInit =
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  ConstructorParameters<typeof URLSearchParams>[0]

export type URLSearchParamsOptions =
  | Record<string, Nilable<number | string>>
  | URLSearchParamsInit
  | object
