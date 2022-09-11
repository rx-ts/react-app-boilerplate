import fs from 'node:fs'

import type { FilterPattern } from '@rollup/pluginutils'
import { createFilter } from '@rollup/pluginutils'
import type { Config } from '@svgr/core'
import svgrCore from '@svgr/core'
import * as esbuild from 'esbuild'
import type { Plugin } from 'vite'

export interface VitePluginSvgrOptions extends Config {
  include?: FilterPattern
  exclude?: FilterPattern
  sourcemap?: boolean
}

export const svgr = ({
  include = /\.svg\?svgr($|&)/,
  exclude,
  sourcemap,
  ...svgrOptions
}: VitePluginSvgrOptions = {}): Plugin => {
  const filter = createFilter(include, exclude)
  return {
    name: 'svgr',
    async transform(code, id) {
      if (!filter(id)) {
        return
      }

      const [sourcefile, query] = id.split('?')
      const search = new URLSearchParams(query)
      search.delete('svgr')
      code = query ? code.replace(`?${query}`, '') : code

      const svgrResult = await svgrCore.transform(
        await fs.promises.readFile(sourcefile, 'utf8'),
        { ...svgrOptions, ...Object.fromEntries(search.entries()) },
      )

      const esbuildResult = await esbuild.transform(
        svgrResult.replace(
          'export default SvgComponent',
          `export { SvgComponent }\n${code}`,
        ),
        {
          loader: 'jsx',
          sourcefile,
          sourcemap,
        },
      )

      return {
        code: esbuildResult.code,
        map: esbuildResult.map || null,
      }
    },
  }
}
