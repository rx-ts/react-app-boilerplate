import fs from 'fs'
import path from 'path'

import { __DEV__ } from '@pkgr/utils'
import replace from '@rollup/plugin-replace'
import strip from '@rollup/plugin-strip'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig } from 'vite'
import { AntdResolve, createStyleImportPlugin } from 'vite-plugin-style-import'

import { html, svgr } from './vite'

import { isEnvEnabled, TEMPLATE_OPTIONS } from 'shared'
import { ANT_PREFIX, themeVars } from 'styles'

export default defineConfig(({ command }) => ({
  resolve: {
    alias: fs
      .readdirSync(path.resolve(process.cwd(), 'src'), {
        withFileTypes: true,
      })
      .reduce<Record<string, string>>(
        (acc, dir) => {
          if (dir.isDirectory()) {
            Object.assign(acc, {
              [dir.name]: `/src/${dir.name}/`,
            })
          }
          return acc
        },
        {
          dayjs: 'dayjs/esm',
          moment: 'dayjs/esm',
          assets: '/assets',
          shared: '/shared',
          mixins: 'src/styles/_mixins.less',
          variables: 'src/styles/_variables.less',
          // `moduleReplacement` is only available on build
          ...(command === 'build' && {
            './wdyr': 'src/wdyr.prod.ts', // bundled by `vite` rather than `rollup`
            classnames: 'clsx',
            lodash: 'lodash-es',
          }),
        },
      ),
  },
  plugins: [
    createStyleImportPlugin({
      resolves: [AntdResolve()],
    }),
    html({
      templateOptions: TEMPLATE_OPTIONS,
      minify: command === 'build',
    }),
    react(),
    replace({
      preventAssignment: true,
      values: {
        __DEV__: JSON.stringify(__DEV__),
        __SERVER__: JSON.stringify(false),
        ASYNC_VALIDATOR_NO_WARNING: JSON.stringify(true),
        'process.env.MOCK': JSON.stringify(isEnvEnabled('MOCK')),
      },
    }),
    svgr(),
  ],
  build: {
    rollupOptions: {
      plugins: [strip(), isEnvEnabled('ANALYZE') && visualizer()].filter(
        Boolean,
      ),
    },
  },
  css: {
    modules: {
      localsConvention: 'camelCaseOnly',
    },
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        modifyVars: {
          'ant-prefix': ANT_PREFIX,
          ...themeVars,
        },
      },
    },
  },
  server: {
    open: true,
  },
}))
