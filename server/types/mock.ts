import type { Query } from 'express-serve-static-core'

export interface BaseMockOptions<Q = Query, T = unknown> {
  query: Q
  body?: T
}

export interface MockOptions<P extends object = object, Q = Query, T = unknown>
  extends BaseMockOptions<Q, T> {
  params?: P
}

export type MockFn<
  T extends MockOptions<object, unknown> = MockOptions,
  R = unknown,
> = (options: T) => Promise<R> | R

export type Mock<
  T extends MockOptions<object, unknown> = MockOptions,
  R = unknown,
> = MockFn<T, R> | R

export interface MockModule<
  P extends object = object,
  Q = unknown,
  R = unknown,
  T extends MockOptions<P, Q> = MockOptions<P, Q>,
> {
  default?: Mock<T, R>
  get?: Mock<T, R>
  post?: Mock<T, R>
  patch?: Mock<T, R>
  put?: Mock<T, R>
  delete?: Mock<T, R>
  parseQuery?: (query: Query) => Q
}
