import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useCallback, useState } from 'react'
import { Img } from '../components/Img'
import { Magnetic } from '../components/Magnetic'
import { SplitLines } from '../components/SplitLines'
import { featured } from '../data/content'
import { EASE, EASE_MASK, useUI } from '../lib/ui'

const N = featured.photos.length
const pad = (n: number) => String(n).padStart(2, '0')

/** Section 05 — one estate given the whole stage. Info stays anchored while the photographs change. */
export function FeaturedEstate() {
  const { open } = useUI()
  const [[i, dir], set] = useState<[number, 1 | -1]>([0, 1])
  const go = useCallback((d: 1 | -1) => set(([cur]) => [(cur + d + N) % N, d]), [])
  const jump = (to: number) => set(([cur]) => [to, to > cur ? 1 : -1])

  return (
    <section className="relative isolate overflow-hidden bg-void" aria-label={`Featured estate — ${featured.name}`}>
      {/* Ambient backdrop: a blurred echo of the current photograph. */}
      <AnimatePresence initial={false}>
        <motion.div
          key={i}
          className="absolute inset-0 -z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.32 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4 }}
        >
          <Img photo={featured.photos[i]} decorative sizes="30vw" widths={[480]} className="scale-125 blur-3xl" />
        </motion.div>
      </AnimatePresence>
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-void/40 to-void" />

      <div className="grid min-h-[100svh] lg:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)]">
        {/* Stage */}
        <div className="relative min-h-[62svh] overflow-hidden bg-charcoal lg:min-h-0" data-cursor="view">
          <AnimatePresence initial={false} custom={dir}>
            <motion.div
              key={i}
              custom={dir}
              className="absolute inset-0"
              variants={{
                enter: (d: number) => ({ clipPath: d > 0 ? 'inset(0% 0% 0% 100%)' : 'inset(0% 100% 0% 0%)', zIndex: 2 }),
                center: { clipPath: 'inset(0% 0% 0% 0%)', x: '0%', zIndex: 2 },
                exit: (d: number) => ({ x: d > 0 ? '-22%' : '22%', zIndex: 1, transition: { duration: 1.3, ease: EASE_MASK } }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 1.3, ease: EASE_MASK }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.12}
              onDragEnd={(_, info) => {
                if (info.offset.x < -60) go(1)
                else if (info.offset.x > 60) go(-1)
              }}
            >
              <motion.div className="h-full w-full" initial={{ scale: 1.18 }} animate={{ scale: 1 }} transition={{ duration: 2.2, ease: EASE }}>
                <Img photo={featured.photos[i]} sizes="(min-width: 1024px) 62vw, 100vw" widths={[828, 1280, 1800]} />
              </motion.div>
            </motion.div>
          </AnimatePresence>
          <div className="pointer-events-none absolute inset-0 z-[3] bg-gradient-to-t from-void/60 via-transparent to-transparent" />
          <div className="pointer-events-none absolute bottom-6 left-6 z-[4] overflow-hidden sm:bottom-8 sm:left-8">
            <AnimatePresence mode="wait">
              <motion.p
                key={i}
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '-100%' }}
                transition={{ duration: 0.6, ease: EASE }}
                className="text-[11px] tracking-[0.3em] text-ivory/80 uppercase"
              >
                {featured.captions[i]}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        {/* Anchored information */}
        <div className="flex flex-col justify-center px-5 py-14 sm:px-8 lg:px-14 lg:py-24 xl:pr-24">
          <p className="label mb-6">05 — Featured Estate</p>
          <SplitLines className="display text-[clamp(2.8rem,4.6vw,4.6rem)] text-ivory" lines={['The Horizon', 'Residence']} />
          <p className="mt-5 text-[12px] tracking-[0.26em] text-mist uppercase">{featured.place}</p>

          <p className="mt-8 font-serif text-[2.1rem] font-light text-champagne">{featured.price}</p>

          <dl className="mt-7 grid grid-cols-3 border-y border-ivory/10">
            {featured.specs.map((s) => (
              <div key={s.label} className="border-r border-ivory/10 py-5 last:border-0 [&:not(:first-child)]:pl-5">
                <dt className="sr-only">{s.label}</dt>
                <dd>
                  <span className="block font-serif text-[1.9rem] leading-none text-ivory">{s.value}</span>
                  <span className="mt-2 block text-[10.5px] tracking-[0.2em] text-mist uppercase">{s.label}</span>
                </dd>
              </div>
            ))}
          </dl>

          <p className="mt-7 max-w-[400px] text-[14.5px] leading-[1.8] text-ivory/70">{featured.description}</p>

          <div className="mt-10 flex flex-wrap items-center justify-between gap-6">
            <Magnetic>
              <button type="button" onClick={() => open({ kind: 'inquiry', subject: `Private viewing — ${featured.name}` })} className="btn-gold group">
                View Estate
                <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" strokeWidth={1.6} />
              </button>
            </Magnetic>

            <div className="flex items-center gap-5">
              <span className="font-serif text-[1.2rem] text-ivory tabular-nums">
                <span className="inline-block w-6 overflow-hidden align-bottom">
                  <AnimatePresence mode="popLayout" initial={false} custom={dir}>
                    <motion.span
                      key={i}
                      custom={dir}
                      className="inline-block"
                      initial={{ y: dir > 0 ? '100%' : '-100%' }}
                      animate={{ y: 0 }}
                      exit={{ y: dir > 0 ? '-100%' : '100%' }}
                      transition={{ duration: 0.5, ease: EASE }}
                    >
                      {pad(i + 1)}
                    </motion.span>
                  </AnimatePresence>
                </span>
                <span className="text-ivory/35"> / {pad(N)}</span>
              </span>
              <div className="flex gap-2">
                <button type="button" onClick={() => go(-1)} aria-label="Previous photograph" className="grid h-12 w-12 place-items-center rounded-full border border-ivory/20 transition-colors duration-500 hover:border-champagne hover:text-champagne">
                  <ArrowLeft className="h-4 w-4" strokeWidth={1.4} />
                </button>
                <button type="button" onClick={() => go(1)} aria-label="Next photograph" className="grid h-12 w-12 place-items-center rounded-full border border-ivory/20 transition-colors duration-500 hover:border-champagne hover:text-champagne">
                  <ArrowRight className="h-4 w-4" strokeWidth={1.4} />
                </button>
              </div>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-4 gap-2">
            {featured.photos.map((ph, idx) => (
              <button
                key={ph.id}
                type="button"
                onClick={() => jump(idx)}
                aria-label={`Show ${featured.captions[idx]}`}
                className={`relative aspect-[4/3] overflow-hidden transition-opacity duration-500 ${idx === i ? 'opacity-100' : 'opacity-40 hover:opacity-80'}`}
              >
                <Img photo={ph} decorative sizes="100px" widths={[200]} noPreview />
                {idx === i && <motion.span layoutId="featured-thumb" className="absolute inset-x-0 bottom-0 h-0.5 bg-champagne" />}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
