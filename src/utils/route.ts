import { pascalCase } from './helpers'

export const getPageFile = (page: string) =>
  page
    .split('/')
    .reduce<string[]>((acc, part) => {
      if (part.startsWith(':')) {
        return acc
      }
      acc.push(pascalCase(part))
      return acc
    }, [])
    .join('/')
