import { motion } from 'framer-motion'
import type { Photo } from '../data/content'
import { EASE, EASE_MASK } from '../lib/ui'
import { Img } from './Img'

type Props = {
  photo: Photo
  className?: string
  sizes?: string
  widths?: number[]
  delay?: number
  /** Direction the dark mask retreats toward. */
  from?: 'bottom' | 'left' | 'right'
  cursor?: 'view' | 'explore'
}

const start = {
  bottom: 'inset(100% 0% 0% 0%)',
  left: 'inset(0% 100% 0% 0%)',
  right: 'inset(0% 0% 0% 100%)',
}

/** Editorial image reveal: a mask slides away while the photo settles from a slight zoom. */
export function MaskImage({ photo, className = '', sizes, widths, delay = 0, from = 'bottom', cursor }: Props) {
  return (
    <motion.div
      className={`relative overflow-hidden bg-charcoal ${className}`}
      initial={{ clipPath: start[from] }}
      whileInView={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 1.4, delay, ease: EASE_MASK }}
      data-cursor={cursor}
    >
      <motion.div
        className="h-full w-full"
        initial={{ scale: 1.18 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, margin: '0px 0px -10% 0px' }}
        transition={{ duration: 2, delay, ease: EASE }}
      >
        <Img photo={photo} sizes={sizes} widths={widths} />
      </motion.div>
    </motion.div>
  )
}
