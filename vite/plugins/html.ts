import type { Options as MinifyOptions } from 'html-minifier-terser'
import { minify as htmlMinify } from 'html-minifier-terser'
import type { TemplateOptions } from 'lodash'
import { template } from 'lodash'
import type { Plugin } from 'vite'

export interface VitePluginHtmlOptions<T extends object = object> {
  templateOptions?: TemplateOptions
  data?: T
  minify?: boolean
  minifyOptions?: MinifyOptions
}

export const DEFAULT_MINIFY_OPTIONS = {
  collapseWhitespace: true,
  html5: true,
  removeComments: true,
  removeOptionalTags: true,
  removeRedundantAttributes: true,
  removeScriptTypeAttributes: true,
  removeStyleLinkTypeAttributes: true,
  removeTagWhitespace: true,
  trimCustomFragments: true,
  useShortDoctype: true,
}

export const html = <T extends object>({
  templateOptions,
  data,
  minify,
  minifyOptions = DEFAULT_MINIFY_OPTIONS,
}: VitePluginHtmlOptions<T>): Plugin => ({
  name: 'html',
  transformIndexHtml(html: string) {
    const output = template(html, templateOptions)(data)
    return minify ? htmlMinify(output, minifyOptions) : output
  },
})
