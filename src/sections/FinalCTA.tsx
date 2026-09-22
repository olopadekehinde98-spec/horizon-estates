import { motion, useMotionValue, useTransform } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useRef } from 'react'
import { Img } from '../components/Img'
import { Magnetic } from '../components/Magnetic'
import { SplitLines } from '../components/SplitLines'
import { finale } from '../data/content'
import { useMotionOK } from '../hooks/useMediaQuery'
import { useSectionProgress } from '../hooks/useSectionProgress'
import { EASE, useUI } from '../lib/ui'

/** Section 10 — the closing shot: the house brightens, the line draws, the invitation rises. */
export function FinalCTA() {
  const { open } = useUI()
  const ref = useRef<HTMLElement>(null)
  const motionOK = useMotionOK()
  const scrollYProgress = useSectionProgress(ref, ['start end', 'end end'])
  const end = useMotionValue(1)
  const p = motionOK ? scrollYProgress : end

  const scale = useTransform(p, [0, 1], [1.18, 1.02])
  const dark = useTransform(p, [0.1, 0.9], [0.82, 0.28])
  const line = useTransform(p, [0.55, 0.9], [0, 1])

  return (
    <section ref={ref} className="relative isolate flex h-[110svh] min-h-[700px] items-center overflow-hidden bg-void" aria-label="Your next chapter starts here">
      <motion.div className="absolute inset-0 -z-20 will-change-transform" style={{ scale }}>
        <Img photo={finale.photo} widths={[828, 1280, 1600]} />
      </motion.div>
      <motion.div className="absolute inset-0 -z-10 bg-void" style={{ opacity: dark }} />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(7,7,6,0.7)_100%)]" />
      <div aria-hidden className="grain pointer-events-none absolute inset-0 -z-10" />

      <div className="frame flex flex-col items-center text-center">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: EASE }}
          className="label mb-8"
        >
          10 — Begin
        </motion.p>
        <SplitLines
          className="display text-[clamp(3.4rem,9vw,9.5rem)] text-ivory [text-shadow:0_6px_60px_rgba(0,0,0,0.45)]"
          stagger={0.16}
          lines={['Your Next Chapter', <span className="text-champagne italic">Starts Here.</span>]}
        />
        <motion.span style={{ scaleX: line }} className="mt-10 block h-px w-48 origin-center bg-champagne" />
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -10% 0px' }}
          transition={{ duration: 1.2, delay: 0.4, ease: EASE }}
          className="mt-8 font-serif text-[1.6rem] font-light text-ivory/85 italic"
        >
          Exceptional places are waiting.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -10% 0px' }}
          transition={{ duration: 1.2, delay: 0.6, ease: EASE }}
          className="mt-11"
        >
          <Magnetic>
            <button type="button" onClick={() => open({ kind: 'search' })} className="btn-gold group px-9 py-4">
              Begin Your Search
              <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" strokeWidth={1.6} />
            </button>
          </Magnetic>
        </motion.div>
      </div>
    </section>
  )
}
