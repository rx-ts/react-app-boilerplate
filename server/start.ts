import './env'

import { NODE_ENV, openBrowser, __DEV__ } from '@pkgr/utils'
import { json, urlencoded } from 'body-parser'
import compression from 'compression'
import history from 'connect-history-api-fallback'
import consola from 'consola'
import express from 'express'
import { fsStorage } from 'node-fs-storage'
import { createServer, resolveConfig } from 'vite'

import { PROXY_PATHS, proxy, mock } from './middlewares'
import { catchPromise } from './utils'

const { HOST, PORT, PROXY_ADDRESS } = process.env

const LOCALHOST = 'localhost'
const ALL_LOCALHOST = '0.0.0.0'
const DEFAULT_HOST = HOST || ALL_LOCALHOST
const DEFAULT_PORT = +(PORT || 3 * 1000)

const main = async () => {
  const app = express()

  if (!__DEV__) {
    app.use(compression())
  }

  if (PROXY_ADDRESS) {
    for (const proxyPath of PROXY_PATHS) {
      app.use(`/${proxyPath}`, proxy())
    }
  }

  app
    /**
     * body parser must be used after proxies
     *
     * @see https://github.com/chimurai/http-proxy-middleware/issues/472#issuecomment-918749411
     */
    .use(urlencoded({ extended: false, limit: '50mb' }))
    .use(json({ limit: '50mb' }))
    .use('/mock', mock)

  const viteConfig = await resolveConfig(
    {},
    __DEV__ ? 'serve' : 'build',
    NODE_ENV,
  )

  if (__DEV__) {
    const viteServer = await createServer({
      server: {
        middlewareMode: true,
      },
    })
    app
      // .use(validate)
      .use(viteServer.middlewares)
  } else {
    app.use(history()).use(express.static(viteConfig.build.outDir))
  }

  const { open, host, port = DEFAULT_PORT } = viteConfig.server

  const serverHost = (typeof host !== 'boolean' && host) || DEFAULT_HOST

  app.listen(port, serverHost, () => {
    const url = `http://${
      serverHost === ALL_LOCALHOST ? LOCALHOST : serverHost
    }:${port}`
    consola.ready(`Running at ${url}`)
    if (open && !fsStorage.getItem('reloading')) {
      openBrowser(url)
    }
  })
}

catchPromise(main())

process.once('SIGHUP', () => fsStorage.setItem('reloading', '1'))

process.once('SIGINT', () => {
  fsStorage.removeItem('reloading')
  process.kill(process.pid)
})
