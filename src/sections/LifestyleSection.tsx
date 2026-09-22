import { motion, useMotionValue, useTransform } from 'framer-motion'
import { useRef, useState } from 'react'
import { Img } from '../components/Img'
import { SplitLines } from '../components/SplitLines'
import { lifestyle } from '../data/content'
import { useMotionOK } from '../hooks/useMediaQuery'
import { useSectionProgress } from '../hooks/useSectionProgress'
import { EASE } from '../lib/ui'

/** Section 04 — layered parallax: slow background, quicker type, features arriving one by one. */
export function LifestyleSection() {
  const ref = useRef<HTMLElement>(null)
  const motionOK = useMotionOK()
  const scrollYProgress = useSectionProgress(ref, ['start end', 'end start'])
  const mid = useMotionValue(0.5)
  const p = motionOK ? scrollYProgress : mid
  const [hover, setHover] = useState<number | null>(null)

  const bgY = useTransform(p, [0, 1], ['-9%', '9%'])
  const bgScale = useTransform(p, [0, 0.6], [1.16, 1.02])
  const textY = useTransform(p, [0, 1], [110, -110])
  const quoteY = useTransform(p, [0, 1], [180, -160])

  return (
    <section id="lifestyle" ref={ref} className="relative isolate overflow-hidden bg-void" aria-label="The lifestyle">
      <motion.div className="absolute inset-x-0 -top-[12%] -bottom-[12%] -z-20 will-change-transform" style={{ y: bgY, scale: bgScale }}>
        <Img photo={lifestyle.background} widths={[828, 1280, 1600]} />
      </motion.div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-void/90 via-void/40 to-void/25" />
      <div className="absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-void to-transparent" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-2/3 bg-gradient-to-t from-void via-void/60 to-transparent" />
      <div aria-hidden className="grain pointer-events-none absolute inset-0 -z-10" />

      <div className="frame relative flex min-h-[125vh] flex-col justify-between pt-36 pb-20 max-md:min-h-0 max-md:gap-16 max-md:pt-28">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between">
          <motion.div style={{ y: textY }} className="will-change-transform">
            <p className="label mb-6">04 — The Lifestyle</p>
            <SplitLines className="display text-[clamp(3.4rem,8vw,8rem)] text-ivory" lines={['More', <span className="italic">Than a Home</span>]} />
            <p className="mt-8 max-w-[380px] text-[15px] leading-[1.8] text-ivory/75">
              Private pools. Ocean views. Lush landscapes. A lifestyle designed around what matters most.
            </p>
          </motion.div>

          <motion.blockquote style={{ y: quoteY }} className="max-w-[420px] will-change-transform lg:mt-24 lg:text-right">
            <p className="font-serif text-[clamp(1.8rem,3vw,2.8rem)] leading-[1.15] font-light text-ivory italic">
              “Luxury is not a place,
              <br />
              it’s a feeling.”
            </p>
            <span className="mt-6 inline-block h-px w-20 bg-champagne" />
          </motion.blockquote>
        </div>

        {/* Features — each tile arrives in turn; the hovered one widens. */}
        <ul className="grid grid-cols-2 gap-3 md:flex md:h-[240px] md:gap-4" onMouseLeave={() => setHover(null)}>
          {lifestyle.features.map((f, i) => (
            <motion.li
              key={f.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px 0px -8% 0px' }}
              transition={{ duration: 1, delay: i * 0.18, ease: EASE }}
              onMouseEnter={() => setHover(i)}
              className="group relative aspect-[4/5] overflow-hidden bg-charcoal transition-[flex-grow] duration-700 ease-cine md:aspect-auto md:h-full md:flex-1"
              style={{ flexGrow: hover === i ? 1.9 : 1 }}
              data-cursor="view"
            >
              <Img photo={f.photo} sizes="(min-width: 768px) 30vw, 48vw" widths={[400, 700, 1000]} className="transition-transform duration-[1400ms] ease-cine group-hover:scale-[1.08]" />
              <div className="absolute inset-0 bg-gradient-to-t from-void/85 via-void/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-3.5 sm:p-4 md:p-5">
                <p className="min-w-0 text-[10px] leading-snug tracking-[0.18em] text-ivory uppercase sm:text-[11px] sm:tracking-[0.22em]">{f.name}</p>
                <span className="shrink-0 text-[10px] text-champagne tabular-nums">0{i + 1}</span>
              </div>
              <span className="absolute inset-x-5 bottom-0 h-px origin-left scale-x-0 bg-champagne transition-transform duration-700 ease-cine group-hover:scale-x-100" />
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  )
}
