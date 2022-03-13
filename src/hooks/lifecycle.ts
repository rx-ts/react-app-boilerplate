import { useCallback, useEffect, useRef } from 'react'
import { Observable, Subscription } from 'rxjs'

export const useEnhancedEffect = (
  effect: () => unknown,
  deps: unknown[] = [],
) =>
  useEffect(() => {
    let result = effect()
    if (result instanceof Observable) {
      result = result.subscribe()
    }
    return () => {
      let count = 0
      while (typeof result === 'function') {
        if (++count > 3) {
          if (__DEV__) {
            throw new Error('Too many nested unsubscribes')
          } else {
            break
          }
        }
        result = result()
      }

      if (result instanceof Subscription) {
        result.unsubscribe()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intended
  }, deps)

export const useMounted = (effect: () => unknown) => useEnhancedEffect(effect)

export const useUnmounted = (effect: () => unknown, deps: unknown[] = []) =>
  useEnhancedEffect(() => effect, deps)

export type ObservableToSubscription<T> = T extends Observable<unknown>
  ? Subscription
  : T

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useEnhancedCallback = <T extends (...args: any[]) => any>(
  fn: T,
  deps: unknown[] = [],
) => {
  const ref = useRef<ObservableToSubscription<ReturnType<T>>>()

  const cb = useCallback((...args: Parameters<T>) => {
    let result = fn(...args) as unknown

    if (result instanceof Observable) {
      result = result.subscribe()
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return (ref.current = result as ObservableToSubscription<ReturnType<T>>)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intended
  }, deps)

  useUnmounted(() => ref.current)

  return cb
}
