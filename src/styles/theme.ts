import { upperFirst } from 'lodash'

import * as plates from './plates'

const THEME_LEVEL = 11

export type Theme = 'dark' | 'light'

export type Plate = typeof plates.dark | typeof plates.light

export const themeVars = Object.entries(plates).reduce(
  (acc, [theme, plates]) =>
    Object.assign(
      acc,
      Object.entries(plates).reduce((acc, [group, plates]) => {
        if (theme !== 'default' && group !== 'default') {
          const prefix = group.charAt(0)
          Object.assign(
            acc,
            Array.from({ length: THEME_LEVEL + 1 }).reduce((acc, _, index) => {
              const key = upperFirst(
                index ? `${prefix}${index - 1}` : group,
              ) as keyof typeof plates
              const value = plates[key]
              Object.assign(acc as object, {
                [`theme-${theme}-${(key as string).toLowerCase()}`]: value,
              })
              return acc
            }, {}),
          )
        }
        return acc
      }, {}),
    ),
  {},
)
