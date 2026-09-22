import { motion } from 'framer-motion'
import { ArrowRight, Lock } from 'lucide-react'
import { useState } from 'react'
import { Img } from '../components/Img'
import { Magnetic } from '../components/Magnetic'
import { Reveal } from '../components/Reveal'
import { SplitLines } from '../components/SplitLines'
import { privateCollection } from '../data/content'
import { EASE, EASE_MASK, useUI } from '../lib/ui'

const offsets = ['lg:translate-y-0', 'lg:translate-y-[9vh]', 'lg:-translate-y-[4vh]']

/** Section 09 — three tall photographs that overlap like prints laid on a table. */
export function PrivateCollection() {
  const { open } = useUI()
  const [hover, setHover] = useState<number | null>(null)

  return (
    <section className="relative overflow-hidden bg-void py-28 lg:py-40" aria-label="The private collection">
      <div className="frame grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-end">
        <div>
          <p className="label mb-6 flex items-center gap-3">
            <Lock className="h-3 w-3" strokeWidth={1.6} /> 09 — By invitation
          </p>
          <SplitLines className="display text-[clamp(3rem,6.4vw,6.4rem)] text-ivory" lines={['The Private', <span className="text-champagne italic">Collection</span>]} />
        </div>
        <Reveal delay={0.15} className="lg:justify-self-end">
          <p className="max-w-[400px] text-[15px] leading-[1.8] text-ivory/65">
            Some estates are not listed publicly. Discover a private collection available exclusively through Horizon Estates.
          </p>
          <div className="mt-8">
            <Magnetic>
              <button type="button" onClick={() => open({ kind: 'inquiry', subject: 'Private Collection access' })} className="btn-line group">
                Request Private Access
                <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" strokeWidth={1.4} />
              </button>
            </Magnetic>
          </div>
        </Reveal>
      </div>

      <div
        className="no-scrollbar mt-20 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 sm:px-8 lg:mt-28 lg:justify-center lg:gap-0 lg:overflow-visible lg:px-14 lg:pb-[10vh]"
        onMouseLeave={() => setHover(null)}
      >
        {privateCollection.map((p, i) => {
          const on = hover === i
          const dim = hover !== null && !on
          return (
            <motion.button
              key={p.name}
              type="button"
              onMouseEnter={() => setHover(i)}
              onFocus={() => setHover(i)}
              onClick={() => open({ kind: 'inquiry', subject: `Private Collection — ${p.name}, ${p.place}` })}
              initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
              whileInView={{ clipPath: 'inset(0% 0% 0% 0%)' }}
              viewport={{ once: true, margin: '0px 0px -10% 0px' }}
              transition={{ duration: 1.5, delay: i * 0.2, ease: EASE_MASK }}
              data-cursor="explore"
              style={{ zIndex: on ? 10 : 3 - Math.abs(1 - i) }}
              className={`group relative aspect-[3/4.3] w-[74vw] max-w-[440px] shrink-0 snap-center overflow-hidden bg-charcoal text-left transition-[transform,filter,opacity] duration-[900ms] ease-cine sm:w-[46vw] lg:w-[30vw] ${offsets[i]} ${
                i > 0 ? 'lg:-ml-[5vw]' : ''
              } ${on ? 'lg:scale-[1.05]' : ''} ${dim ? 'lg:opacity-60 lg:brightness-75' : ''} lg:shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)]`}
              aria-label={`${p.name}, ${p.place} — request access`}
            >
              <Img photo={p.photo} sizes="(min-width: 1024px) 30vw, 74vw" widths={[480, 800, 1200]} className="transition-transform duration-[1600ms] ease-cine group-hover:scale-[1.06]" />
              <div className="absolute inset-0 bg-gradient-to-t from-void/90 via-void/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 lg:p-8">
                <motion.span
                  className="mb-5 block h-px origin-left bg-champagne"
                  initial={false}
                  animate={{ scaleX: on ? 1 : 0.18 }}
                  transition={{ duration: 0.8, ease: EASE }}
                  style={{ width: 96 }}
                />
                <p className="text-[10px] tracking-[0.3em] text-champagne uppercase">{p.style}</p>
                <p className={`mt-3 font-serif text-[2.1rem] leading-none text-ivory transition-all duration-700 lg:text-[2.4rem] ${on ? 'lg:translate-y-0 lg:opacity-100' : 'lg:translate-y-3 lg:opacity-0'}`}>
                  {p.name}
                </p>
                <p className={`mt-2 text-[11px] tracking-[0.24em] text-ivory/70 uppercase transition-all delay-75 duration-700 ${on ? 'lg:translate-y-0 lg:opacity-100' : 'lg:translate-y-3 lg:opacity-0'}`}>
                  {p.place}
                </p>
              </div>
            </motion.button>
          )
        })}
        <span className="w-1 shrink-0 lg:hidden" aria-hidden />
      </div>
    </section>
  )
}
