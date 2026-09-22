import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { EASE } from '../lib/ui'

type Props = {
  lines: ReactNode[]
  className?: string
  lineClassName?: string
  /** Seconds before the first line. */
  delay?: number
  stagger?: number
  /** When provided, animation is controlled by this flag instead of viewport entry. */
  play?: boolean
  as?: 'h1' | 'h2' | 'h3' | 'p'
}

/** Reveals each line from behind its own mask — no bounce, just a clean editorial rise. */
export function SplitLines({ lines, className = '', lineClassName = '', delay = 0, stagger = 0.12, play, as = 'h2' }: Props) {
  const Tag = motion[as]
  const controlled = play !== undefined
  return (
    <Tag
      className={className}
      initial="hidden"
      {...(controlled ? { animate: play ? 'show' : 'hidden' } : { whileInView: 'show', viewport: { once: true, margin: '0px 0px -12% 0px' } })}
      transition={{ staggerChildren: stagger, delayChildren: delay }}
    >
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.14em] -mb-[0.14em]">
          <motion.span
            className={`block will-change-transform ${lineClassName}`}
            variants={{
              hidden: { y: '108%' },
              show: { y: '0%', transition: { duration: 1.15, ease: EASE } },
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}
