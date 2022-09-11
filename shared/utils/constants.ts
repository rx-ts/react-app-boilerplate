import type { TemplateOptions } from 'lodash'

export enum ApiMethod {
  GET = 'get',
  POST = 'post',
  PATCH = 'patch',
  PUT = 'put',
  DELETE = 'delete',
}

export const TEMPLATE_OPTIONS: TemplateOptions = Object.freeze({
  // eslint-disable-next-line regexp/match-any
  interpolate: /{{([\S\s]+?)}}/g,
})
