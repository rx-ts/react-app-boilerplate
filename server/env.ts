import fs from 'node:fs'

import { findUp, NODE_ENV } from '@pkgr/utils'
import dotenv from 'dotenv'
import { expand } from 'dotenv-expand'

/**
 * Based on @see https://github.com/vitejs/vite/blob/main/packages/vite/src/node/config.ts#L947-L1002
 */
export function loadEnv(mode = NODE_ENV, envDir = process.cwd()) {
  if (mode === 'local') {
    throw new Error(
      `"local" cannot be used as a mode name because it conflicts with ` +
        `the .local postfix for .env files.`,
    )
  }

  const env: Partial<Record<string, string>> = {}
  const envFiles = [
    /** mode local file */ `.env.${mode}.local`,
    /** mode file */ `.env.${mode}`,
    /** local file */ `.env.local`,
    /** default file */ `.env`,
  ]

  dotenv.config({
    debug: !!process.env.DEBUG,
  })

  for (const file of envFiles) {
    const path = findUp(envDir, file)
    if (path) {
      const parsed = dotenv.parse(fs.readFileSync(path))

      // let environment variables use each other
      expand({ parsed })

      Object.assign(env, parsed)
    }
  }

  return env
}

Object.assign(global, {
  __SERVER__: true,
})

loadEnv()
