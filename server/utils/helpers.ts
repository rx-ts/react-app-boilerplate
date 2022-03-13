import fs from 'fs'
import path from 'path'

import consola from 'consola'

export async function getAllFiles(dir: string, base = dir): Promise<string[]> {
  const direntList = await fs.promises.readdir(dir, { withFileTypes: true })
  const files = await Promise.all(
    direntList.map(dirent => {
      const res = path.resolve(dir, dirent.name)
      return dirent.isDirectory()
        ? getAllFiles(res, base)
        : [path.relative(base, res)]
    }),
  )
  return files.flat()
}

export const catchPromise = <T>(
  promise: Promise<T>,
  handler?: (err: unknown) => Promise<void> | void,
) => {
  promise.catch((err: unknown) => {
    if (handler) {
      return handler(err)
    }

    consola.error(err)
  })
}
