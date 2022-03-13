import { createProxyMiddleware } from 'http-proxy-middleware'

import { proxyAgent } from 'server'

export const proxy = () =>
  createProxyMiddleware({
    target: process.env.PROXY_ADDRESS,
    changeOrigin: true,
    agent: proxyAgent,
    logLevel: 'error',
    secure: false,
  })

export const PROXY_PATHS = ['api']
