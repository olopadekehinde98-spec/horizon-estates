import { motion, useMotionValue, useTransform, type MotionValue } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useRef } from 'react'
import { Img } from '../components/Img'
import { Magnetic } from '../components/Magnetic'
import { SplitLines } from '../components/SplitLines'
import { arrival } from '../data/content'
import { useMotionOK } from '../hooks/useMediaQuery'
import { useSectionProgress } from '../hooks/useSectionProgress'
import { goTo } from '../lib/ui'

function Stat({ value, label, progress, i }: { value: string; label: string; progress: MotionValue<number>; i: number }) {
  const a = 0.26 + i * 0.07
  const opacity = useTransform(progress, [a, a + 0.1], [0, 1])
  const y = useTransform(progress, [a, a + 0.12], [26, 0])
  return (
    <motion.div style={{ opacity, y }} className="border-b border-ivory/10 py-6 last:border-0 lg:py-7">
      <p className="font-serif text-[2.6rem] leading-none font-light text-ivory lg:text-[3.1rem]">{value}</p>
      <p className="mt-2 text-[11px] tracking-[0.18em] text-mist uppercase">{label}</p>
    </motion.div>
  )
}

/** Section 01 — split editorial: copy / entrance photograph / figures. */
export function Arrival() {
  const ref = useRef<HTMLElement>(null)
  const motionOK = useMotionOK()
  const scrollYProgress = useSectionProgress(ref, ['start end', 'end start'])
  const done = useMotionValue(0.6)
  const p = motionOK ? scrollYProgress : done

  const scale = useTransform(p, [0.05, 0.6], [1.32, 1.02])
  const x = useTransform(p, [0, 1], ['4%', '-4%'])
  const clip = useTransform(p, [0.02, 0.32], ['inset(0% 0% 0% 100%)', 'inset(0% 0% 0% 0%)'])
  const textX = useTransform(p, [0.1, 0.38], [-70, 0])
  const textOpacity = useTransform(p, [0.1, 0.34], [0, 1])
  const line = useTransform(p, [0.24, 0.46], [0, 1])
  const coda = useTransform(p, [0.45, 0.55], [0, 1])

  return (
    <section id="arrival" ref={ref} className="relative overflow-hidden bg-ink" aria-label="A new standard of luxury">
      <div className="grid lg:min-h-[100vh] lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.75fr)_minmax(0,0.6fr)]">
        {/* Copy */}
        <motion.div style={{ x: textX, opacity: textOpacity }} className="relative z-10 order-2 flex flex-col justify-center px-5 py-16 sm:px-8 lg:order-1 lg:py-24 lg:pr-4 lg:pl-14">
          <p className="label mb-6">01 — The Arrival</p>
          <SplitLines
            className="display text-[clamp(2.6rem,4.1vw,4.4rem)] text-champagne uppercase"
            lineClassName="tracking-[0.02em]"
            lines={['A New', 'Standard', 'of Luxury']}
          />
          <motion.span style={{ scaleX: line }} className="mt-8 block h-px w-40 origin-left bg-champagne" />
          <p className="mt-8 max-w-[340px] text-[14.5px] leading-[1.8] text-ivory/70">
            Our estates are more than homes. They are private worlds, thoughtfully designed for the way exceptional people choose to live.
          </p>
          <div className="mt-10">
            <Magnetic>
              <button type="button" onClick={() => goTo('estates')} className="btn-gold group">
                Explore Estates
                <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" strokeWidth={1.6} />
              </button>
            </Magnetic>
          </div>
        </motion.div>

        {/* Entrance photograph — wipes open, zooms out and drifts sideways as you scroll. */}
        <motion.div style={{ clipPath: clip }} className="relative order-1 h-[72svh] overflow-hidden lg:order-2 lg:h-auto" data-cursor="view">
          <motion.div className="absolute -inset-x-[6%] inset-y-0 will-change-transform" style={{ scale, x }}>
            <Img photo={arrival.photo} sizes="(min-width: 1024px) 55vw, 100vw" />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-r from-ink/50 via-transparent to-ink/40" />
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/70 to-transparent lg:hidden" />
        </motion.div>

        {/* Figures */}
        <div className="order-3 flex flex-col justify-center border-ivory/10 px-5 pb-16 sm:px-8 lg:border-l lg:px-10 lg:py-24 xl:pr-24">
          <div className="grid grid-cols-3 gap-4 lg:block">
            {arrival.stats.map((s, i) => (
              <Stat key={s.label} {...s} progress={p} i={i} />
            ))}
          </div>
          <motion.p
            style={{ opacity: coda }}
            className="mt-8 font-serif text-[1.25rem] leading-snug text-champagne italic lg:mt-12"
          >
            More than properties.
            <br />A way of life.
          </motion.p>
        </div>
      </div>
    </section>
  )
}
