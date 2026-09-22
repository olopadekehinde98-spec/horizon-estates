import { motion, useMotionValue, useTransform } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useRef } from 'react'
import { Img } from '../components/Img'
import { enterHome } from '../data/content'
import { useMediaQuery, useMotionOK } from '../hooks/useMediaQuery'
import { useSectionProgress } from '../hooks/useSectionProgress'
import { useUI } from '../lib/ui'

/** Section 03 — the entrance frame grows until it swallows the viewport, then dissolves into the interior. */
export function EnterHome() {
  const { open } = useUI()
  const ref = useRef<HTMLElement>(null)
  const motionOK = useMotionOK()
  const wide = useMediaQuery('(min-width: 768px)')
  const scrollYProgress = useSectionProgress(ref, ['start start', 'end end'])
  const settled = useMotionValue(1)
  const p = motionOK ? scrollYProgress : settled

  const clip = useTransform(p, [0, 0.46], [wide ? 'inset(16% 31% 16% 31% round 2px)' : 'inset(22% 9% 22% 9% round 2px)', 'inset(0% 0% 0% 0% round 0px)'])
  const entranceScale = useTransform(p, [0, 0.5], [1.3, 1])
  const stepOpacity = useTransform(p, [0, 0.08, 0.26, 0.38], [0.4, 1, 1, 0])
  const stepScale = useTransform(p, [0, 0.38], wide ? [0.92, 1.18] : [0.94, 1.06])
  const stepTracking = useTransform(p, [0, 0.38], wide ? ['0.02em', '0.16em'] : ['0em', '0.05em'])
  const interiorOpacity = useTransform(p, [0.46, 0.64], [0, 1])
  const interiorScale = useTransform(p, [0.46, 1], [1.16, 1])
  const copyOpacity = useTransform(p, [0.66, 0.8], [0, 1])
  const copyY = useTransform(p, [0.66, 0.84], [50, 0])
  const pointer = useTransform(copyOpacity, (v) => (v > 0.5 ? 'auto' : 'none'))
  const hint = useTransform(p, [0, 0.1], [1, 0])

  return (
    <section id="interiors" ref={ref} className="relative h-[240vh] bg-void max-md:h-[200vh]" aria-label="Step inside">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <motion.div className="absolute inset-0 will-change-[clip-path]" style={{ clipPath: clip }} data-cursor="view">
          <motion.div className="absolute inset-0" style={{ scale: entranceScale }}>
            <Img photo={enterHome.entrance} widths={[828, 1280, 1600]} />
          </motion.div>
          <motion.div className="absolute inset-0" style={{ opacity: interiorOpacity }}>
            <motion.div className="absolute inset-0" style={{ scale: interiorScale }}>
              <Img photo={enterHome.interior} widths={[828, 1280, 1600]} />
            </motion.div>
          </motion.div>
          <motion.div className="absolute inset-0 bg-gradient-to-r from-void/85 via-void/35 to-transparent" style={{ opacity: copyOpacity }} />
        </motion.div>

        {/* "Step Inside" — sits over the frame and widens as you approach the door. */}
        <motion.div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center" style={{ opacity: stepOpacity }}>
          <p className="label mb-6">03 — Enter the home</p>
          <motion.h2
            className="display px-4 text-[clamp(3rem,11vw,11rem)] whitespace-nowrap text-ivory [text-shadow:0_4px_60px_rgba(0,0,0,0.5)]"
            style={{ scale: stepScale, letterSpacing: stepTracking }}
          >
            Step <span className="text-champagne italic">Inside</span>
          </motion.h2>
        </motion.div>

        <motion.p style={{ opacity: hint }} className="absolute inset-x-0 bottom-8 text-center text-[10.5px] tracking-[0.3em] text-ivory/50 uppercase">
          Keep scrolling to enter
        </motion.p>

        {/* Arrival inside. */}
        <motion.div style={{ opacity: copyOpacity, y: copyY, pointerEvents: pointer }} className="frame absolute inset-x-0 bottom-0 pb-16 md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:pb-0">
          <p className="label mb-6">Interiors</p>
          <h3 className="display text-[clamp(3rem,6.4vw,6.4rem)] text-ivory">
            Spaces
            <br />
            That Inspire
          </h3>
          <p className="mt-7 max-w-[400px] text-[14.5px] leading-[1.8] text-ivory/75">
            Step inside and experience refined interiors, timeless design, and uninterrupted connection to the world outside.
          </p>
          <button type="button" onClick={() => open({ kind: 'gallery', index: 0 })} className="btn-gold group mt-9">
            View Interior Gallery
            <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" strokeWidth={1.6} />
          </button>
        </motion.div>
      </div>
    </section>
  )
}
