import { useSyncExternalStore } from 'react'
import { useReducedMotion } from 'framer-motion'

/** Subscribe to a CSS media query. */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query)
      mql.addEventListener('change', onChange)
      return () => mql.removeEventListener('change', onChange)
    },
    () => window.matchMedia(query).matches,
    () => false,
  )
}

/** Desktop with a precise pointer and motion allowed — the "full cinema" tier. */
/**
 * Scroll-driven cinema: pinned sections, layered parallax, sequenced reveals.
 * These work under a thumb just as well as under a mouse, so touch gets them too.
 */
export function useCinematic(): boolean {
  const wide = useMediaQuery('(min-width: 768px)')
  const reduce = useReducedMotion()
  return wide && !reduce
}

/** Cursor-driven only: the custom cursor and magnetic hover need a real pointer. */
export function useImmersive(): boolean {
  const desktop = useMediaQuery('(min-width: 1024px) and (pointer: fine)')
  const reduce = useReducedMotion()
  return desktop && !reduce
}

/** Motion allowed at all (any device). Scroll-linked styles must check this manually. */
export function useMotionOK(): boolean {
  return !useReducedMotion()
}
