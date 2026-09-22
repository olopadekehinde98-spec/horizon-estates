import { useScroll, useTransform, type MotionValue } from 'framer-motion'
import type { RefObject } from 'react'

type Offset = NonNullable<Parameters<typeof useScroll>[0]>['offset']

/**
 * Scroll progress for a section, as a plain JS-driven motion value.
 *
 * Framer can hand scroll-linked opacity/clip-path to the browser's native ScrollTimeline.
 * With multi-stop ranges and `end end` offsets that path produced values out of step with
 * the real scroll position, so every section reads progress through this identity transform,
 * which keeps all derived styles computed from the same number on the main thread.
 */
export function useSectionProgress(target: RefObject<HTMLElement | null>, offset: Offset): MotionValue<number> {
  const { scrollYProgress } = useScroll({ target, offset })
  return useTransform(scrollYProgress, (v) => v)
}
