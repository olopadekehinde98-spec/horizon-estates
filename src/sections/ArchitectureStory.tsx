import { AnimatePresence, motion, useInView } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { Img } from '../components/Img'
import { MaskImage } from '../components/MaskImage'
import { Reveal } from '../components/Reveal'
import { SplitLines } from '../components/SplitLines'
import { architecture } from '../data/content'
import { EASE, EASE_MASK } from '../lib/ui'

type Principle = (typeof architecture.principles)[number]

function PrincipleBlock({ p, onActive }: { p: Principle; onActive: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { margin: '-45% 0px -45% 0px' })
  useEffect(() => {
    if (inView) onActive()
  }, [inView, onActive])

  return (
    <div ref={ref} className="flex min-h-[82vh] flex-col justify-center">
      <motion.div
        initial={{ opacity: 0.15 }}
        animate={{ opacity: inView ? 1 : 0.25 }}
        transition={{ duration: 0.8 }}
        className="max-w-[420px]"
      >
        <p className="font-serif text-[1.1rem] text-champagne">{p.n}</p>
        <h3 className="display mt-4 text-[clamp(3.4rem,6vw,6rem)]">{p.title}</h3>
        <motion.span
          className="mt-6 block h-px w-24 origin-left bg-champagne"
          animate={{ scaleX: inView ? 1 : 0 }}
          transition={{ duration: 1, ease: EASE }}
        />
        <p className="mt-6 text-[15px] leading-[1.8] text-ivory/70">{p.text}</p>
      </motion.div>
    </div>
  )
}

/** Section 06 — editorial: a pinned photograph that changes as each principle takes the stage. */
export function ArchitectureStory() {
  const [active, setActive] = useState(0)
  const setters = useRef(architecture.principles.map((_, i) => () => setActive(i))).current

  return (
    <section id="architecture" className="relative bg-ink" aria-label="Architecture without compromise">
      {/* Opening spread */}
      <div className="frame grid gap-12 pt-28 pb-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] lg:items-end lg:gap-20 lg:pt-40 lg:pb-28">
        <div>
          <p className="label mb-6">06 — Architecture</p>
          <SplitLines className="display text-[clamp(3rem,6.2vw,6.4rem)] text-ivory" lines={['Architecture', <span className="text-champagne italic">Without Compromise</span>]} />
          <Reveal delay={0.2}>
            <p className="mt-8 max-w-[400px] text-[15px] leading-[1.8] text-ivory/70">
              Every estate is selected for its relationship between architecture, landscape, light, and everyday life.
            </p>
          </Reveal>
        </div>
        <MaskImage photo={architecture.lead} from="right" cursor="view" className="aspect-[16/10] w-full" sizes="(min-width: 1024px) 55vw, 100vw" />
      </div>

      {/* Pinned story (desktop) */}
      <div className="frame hidden gap-20 pb-24 lg:grid lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <div className="sticky top-0 flex h-screen items-center">
          <div className="relative h-[76vh] w-full overflow-hidden bg-charcoal" data-cursor="view">
            <AnimatePresence initial={false}>
              <motion.div
                key={active}
                className="absolute inset-0"
                initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
                animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
                exit={{ opacity: 0.4, transition: { duration: 1.2 } }}
                transition={{ duration: 1.3, ease: EASE_MASK }}
                style={{ zIndex: 2 }}
              >
                <motion.div className="h-full w-full" initial={{ scale: 1.2 }} animate={{ scale: 1 }} transition={{ duration: 2.2, ease: EASE }}>
                  <Img photo={architecture.principles[active].photo} sizes="50vw" widths={[800, 1200, 1600]} />
                </motion.div>
              </motion.div>
            </AnimatePresence>
            <div className="absolute top-6 left-6 z-10 flex gap-2">
              {architecture.principles.map((p, i) => (
                <span key={p.n} className={`h-px transition-all duration-700 ${i === active ? 'w-12 bg-champagne' : 'w-5 bg-ivory/40'}`} />
              ))}
            </div>
            <p className="absolute right-6 bottom-6 z-10 font-serif text-[5rem] leading-none font-light text-ivory/85">
              {architecture.principles[active].n}
            </p>
          </div>
        </div>
        <div>
          {architecture.principles.map((p, i) => (
            <PrincipleBlock key={p.n} p={p} onActive={setters[i]} />
          ))}
        </div>
      </div>

      {/* Stacked story (mobile / tablet) */}
      <div className="frame flex flex-col gap-16 pb-24 lg:hidden">
        {architecture.principles.map((p) => (
          <div key={p.n}>
            <MaskImage photo={p.photo} className="aspect-[4/5] w-full sm:aspect-[16/10]" sizes="100vw" widths={[480, 800, 1200]} />
            <p className="mt-6 font-serif text-[1rem] text-champagne">{p.n}</p>
            <h3 className="display mt-2 text-[3.2rem]">{p.title}</h3>
            <p className="mt-4 max-w-[480px] text-[14.5px] leading-[1.8] text-ivory/70">{p.text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
