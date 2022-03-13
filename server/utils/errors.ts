import type { ApiError, ApiErrorOptions } from 'shared'
import { REDIRECT, BAD_REQUEST } from 'shared'

export class ResponseError<
    R extends string = string,
    E extends object = object,
    T = unknown,
  >
  extends Error
  implements ApiError<R, E, T>
{
  declare code: number
  declare reason: R
  declare extra: E | undefined
  declare details: T[] | undefined

  constructor(optionsOrMsg: Partial<ApiErrorOptions<R, E, T>> | string) {
    const options =
      typeof optionsOrMsg === 'string'
        ? { message: optionsOrMsg }
        : optionsOrMsg
    super(options.message)
    this.code = options.code || BAD_REQUEST
    this.reason = options.reason || ('Bad Request' as R)
    this.extra = options.extra
    this.details = options.details
  }
}

export class RedirectError extends ResponseError {
  constructor(url: string) {
    super({
      message: url,
      code: REDIRECT,
    })
  }
}
