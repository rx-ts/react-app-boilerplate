import path from 'path'

import { tryRequirePkg } from '@pkgr/utils'
import type { RequestHandler } from 'express'
import type { Query } from 'express-serve-static-core'
import type { MatchFunction } from 'path-to-regexp'
import { match } from 'path-to-regexp'

import type { BaseMockOptions, MockFn, MockModule, MockOptions } from '../types'
import type { ResponseError } from '../utils'
import { catchPromise, getAllFiles } from '../utils'

import type { ApiMethod } from 'shared'
import { NOT_FOUND, BAD_REQUEST, NO_CONTENT, REDIRECT, parseUrl } from 'shared'

let allMockFiles: string[] | undefined

const mocksPath = path.resolve(__dirname, '../mocks')

const matchCache = new Map<string, MatchFunction>()
const mockModuleCache = new Map<string, MockModule>()

export interface MockFromFileOptions<Q = Query, T = unknown>
  extends BaseMockOptions<Q, T> {
  url: string
  method: ApiMethod
}

const setMockModuleCache = async () => {
  if (allMockFiles) {
    return
  }
  allMockFiles = await getAllFiles(mocksPath)
  for (const file of allMockFiles.reverse()) {
    if (!file.endsWith('.ts')) {
      continue
    }
    const pattern =
      '/' +
      file
        .replace(/(\/index)?\.ts/, '')
        /**
         * change `[name]` to `:name`, `\` to `/`
         * We're not using `:name` in filename due to Windows limitation
         */
        .replaceAll(/\[([^[\]]+)]/g, ':$1')
        .replaceAll('\\', '/')
    matchCache.set(pattern, match(pattern))
    mockModuleCache.set(pattern, tryRequirePkg(path.resolve(mocksPath, file))!)
  }
}

export const mockFromFile = async <
  P extends object = object,
  Q extends object = Query,
  T = unknown,
  R = unknown,
>({
  url,
  method,
  query,
  body,
}: MockFromFileOptions<Query, T>) => {
  await setMockModuleCache()

  url = parseUrl(url).pathname

  for (const [pattern, matchFn] of matchCache.entries()) {
    const matched = (matchFn as MatchFunction<P>)(url)

    if (!matched) {
      continue
    }

    const mockModule = mockModuleCache.get(pattern) as MockModule<P, Q, R>

    const mock = method in mockModule ? mockModule[method] : mockModule.default

    return typeof mock === 'function'
      ? await (mock as MockFn<MockOptions<P, Q, T>, R>)({
          params: matched.params,
          query: mockModule.parseQuery?.(query) || (query as Q),
          body,
        })
      : mock
  }
}

export const mock: RequestHandler = (req, res) =>
  catchPromise(
    (async <P extends object, Q extends object, T, R>() => {
      const method = req.method.toLowerCase() as ApiMethod

      let result: R | undefined

      try {
        result = await mockFromFile<P, Q, T, R>({
          url: req.url,
          method,
          query: req.query,
          // We can not fix it on our side
          // see also https://github.com/plantain-00/type-coverage/issues/101#issuecomment-1066116668
          // type-coverage:ignore-next-line
          body: req.body as T,
        })
      } catch (err) {
        const { code, message, ...rest } = err as ResponseError
        const status = code ? +code : BAD_REQUEST
        if (status === REDIRECT) {
          res.redirect(message)
          return
        }
        res.status(status).json({
          code,
          // `Error#message` is not enumerable
          message: message || undefined,
          ...rest,
        })
        return
      }

      if (result !== undefined) {
        if (result) {
          res.json(result)
        } else {
          res.sendStatus(NO_CONTENT)
        }
        return
      }

      res.sendStatus(NOT_FOUND)
    })(),
  )
