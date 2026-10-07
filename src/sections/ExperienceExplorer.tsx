import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion'
import { ArrowRight, X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState, type PointerEvent } from 'react'
import { Img } from '../components/Img'
import { Magnetic } from '../components/Magnetic'
import { SplitLines } from '../components/SplitLines'
import { experiences } from '../data/content'
import { useCinematic } from '../hooks/useMediaQuery'
import { EASE, EASE_MASK, useUI } from '../lib/ui'

type Experience = (typeof experiences)[number]

function Detail({ exp, onClose }: { exp: Experience; onClose: () => void }) {
  const { open } = useUI()
  const closeRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={exp.title}
      className="fixed inset-0 z-[90] bg-void"
      initial={{ clipPath: 'inset(50% 0% 50% 0%)' }}
      animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      exit={{ clipPath: 'inset(50% 0% 50% 0%)' }}
      transition={{ duration: 1, ease: EASE_MASK }}
    >
      <motion.div className="absolute inset-0" initial={{ scale: 1.2 }} animate={{ scale: 1 }} transition={{ duration: 2.4, ease: EASE }}>
        <Img photo={exp.photo} widths={[828, 1280, 1600]} />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-void via-void/50 to-void/20" />
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute top-6 right-6 z-10 grid h-12 w-12 place-items-center rounded-full border border-ivory/30 transition-colors hover:border-champagne hover:text-champagne"
      >
        <X className="h-5 w-5" strokeWidth={1.3} />
      </button>
      <div className="frame absolute inset-x-0 bottom-0 pb-16">
        <p className="label mb-5">Experience {exp.n}</p>
        <SplitLines play delay={0.5} as="h2" className="display text-[clamp(3.4rem,9vw,9rem)]" lines={[exp.title]} />
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 1, ease: EASE }} className="mt-6 max-w-[520px] text-[16px] leading-[1.8] text-ivory/80">
          {exp.text} Tell us what you have in mind, and your dedicated estate manager will take care of the rest.
        </motion.p>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1, duration: 0.8 }}>
          <button
            type="button"
            onClick={() => {
              onClose()
              open({ kind: 'inquiry', subject: `Experience — ${exp.title}` })
            }}
            className="btn-gold group mt-9"
          >
            Arrange this experience
            <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" strokeWidth={1.6} />
          </button>
        </motion.div>
      </div>
    </motion.div>
  )
}

/** Section 07 — the list drives the whole frame: hover an experience and the world behind it changes. */
export function ExperienceExplorer() {
  const [active, setActive] = useState(0)
  const [detail, setDetail] = useState<number | null>(null)
  const closeDetail = useCallback(() => setDetail(null), [])
  const immersive = useCinematic()
  const mx = useSpring(useMotionValue(0), { stiffness: 50, damping: 20 })
  const my = useSpring(useMotionValue(0), { stiffness: 50, damping: 20 })

  const onMove = (e: PointerEvent) => {
    if (!immersive) return
    mx.set(((e.clientX / window.innerWidth) * 2 - 1) * -14)
    my.set(((e.clientY / window.innerHeight) * 2 - 1) * -10)
  }

  return (
    <section id="experiences" onPointerMove={onMove} className="relative isolate min-h-[100svh] overflow-hidden bg-void" aria-label="Exclusive experiences">
      <motion.div className="absolute -inset-6 -z-20" style={{ x: mx, y: my }}>
        <AnimatePresence initial={false}>
          <motion.div
            key={active}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, ease: EASE }}
          >
            <Img photo={experiences[active].photo} widths={[828, 1280, 1600]} />
          </motion.div>
        </AnimatePresence>
      </motion.div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-void/90 via-void/45 to-void/75" />
      <div aria-hidden className="grain pointer-events-none absolute inset-0 -z-10" />

      <div className="frame flex min-h-[100svh] flex-col justify-center gap-14 py-28 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-[560px]">
          <p className="label mb-6">07 — Exclusive Experiences</p>
          <SplitLines className="display text-[clamp(3.2rem,7vw,7rem)] text-ivory" lines={['A Life Without', <span className="text-champagne italic">Limits</span>]} />
          <p className="mt-8 max-w-[420px] text-[15px] leading-[1.8] text-ivory/75">
            From private yacht charters to personal chefs, bespoke travel, and discreet concierge services, every detail can be arranged around you.
          </p>
          <div className="mt-10">
            <Magnetic>
              <button type="button" onClick={() => setDetail(active)} className="btn-gold group">
                Discover Experiences
                <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" strokeWidth={1.6} />
              </button>
            </Magnetic>
          </div>
        </div>

        <ul className="w-full max-w-[440px] border-t border-ivory/15">
          {experiences.map((e, i) => {
            const on = i === active
            return (
              <li key={e.n} className="border-b border-ivory/15">
                <button
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => (on ? setDetail(i) : setActive(i))}
                  aria-expanded={on}
                  className="group w-full py-6 text-left"
                >
                  <span className="flex items-baseline gap-5">
                    <motion.span
                      className="font-serif leading-none tabular-nums"
                      animate={{ fontSize: on ? '2.6rem' : '1rem', color: on ? '#c8a96a' : 'rgba(242,237,228,0.45)' }}
                      transition={{ duration: 0.6, ease: EASE }}
                    >
                      {e.n}
                    </motion.span>
                    <span className={`font-serif text-[1.7rem] leading-none transition-colors duration-500 ${on ? 'text-champagne' : 'text-ivory/80 group-hover:text-ivory'}`}>
                      {e.title}
                    </span>
                    <ArrowRight className={`ml-auto h-4 w-4 shrink-0 transition-all duration-500 ${on ? 'translate-x-0 text-champagne opacity-100' : '-translate-x-2 opacity-0'}`} strokeWidth={1.4} />
                  </span>
                  <AnimatePresence initial={false}>
                    {on && (
                      <motion.span
                        className="block overflow-hidden"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.6, ease: EASE }}
                      >
                        <span className="block pt-4 text-[14px] leading-[1.75] text-ivory/70">{e.text}</span>
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              </li>
            )
          })}
        </ul>
      </div>

      <AnimatePresence>{detail !== null && <Detail exp={experiences[detail]} onClose={closeDetail} />}</AnimatePresence>
    </section>
  )
}
