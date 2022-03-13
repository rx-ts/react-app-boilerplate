import { useEffect, useRef } from 'react'

export function useInterval(cb: () => void, delay?: number | null) {
  const cbRef = useRef<() => void>()

  // Remember the latest callback.
  useEffect(() => {
    cbRef.current = cb
  }, [cb])

  // Set up the interval.
  useEffect(() => {
    function tick() {
      cbRef.current!()
    }

    if (delay !== null) {
      const id = setInterval(tick, delay)
      return () => clearInterval(id)
    }
  }, [delay])
}
