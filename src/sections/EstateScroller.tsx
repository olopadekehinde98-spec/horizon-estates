import { motion, useMotionValueEvent, useTransform, type MotionValue } from 'framer-motion'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { useLayoutEffect, useRef, useState } from 'react'
import { Img } from '../components/Img'
import { SplitLines } from '../components/SplitLines'
import { estates, type Estate } from '../data/content'
import { useCinematic } from '../hooks/useMediaQuery'
import { useSectionProgress } from '../hooks/useSectionProgress'
import { useUI } from '../lib/ui'

const N = estates.length

function Header() {
  return (
    <div className="frame flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="label mb-5">02 — Discover</p>
        <SplitLines className="display text-[clamp(2.8rem,5.6vw,5.4rem)] text-ivory" lines={['Iconic Estates', 'Around the World']} />
      </div>
      <div className="max-w-[330px] md:pb-2">
        <p className="text-[14px] leading-[1.8] text-ivory/65">
          From breathtaking coastlines to serene countryside retreats, explore extraordinary estates in the world’s most desirable destinations.
        </p>
        <a href="#locations" className="group mt-3 inline-flex items-center gap-3 py-3 text-[11.5px] tracking-[0.18em] text-champagne uppercase">
          View all estates
          <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" strokeWidth={1.5} />
        </a>
      </div>
    </div>
  )
}

function Panel({ estate, i, progress, onOpen }: { estate: Estate; i: number; progress: MotionValue<number>; onOpen: () => void }) {
  // Distance of this panel from the "focus" position; drives scale + dimming for a continuous, snap-free feel.
  const d = useTransform(progress, (v) => Math.min(Math.abs(v * (N - 1) - i), 1))
  const scale = useTransform(d, [0, 1], [1, 0.84])
  const dim = useTransform(d, [0, 1], [0, 0.55])
  const info = useTransform(d, [0, 0.45], [1, 0])
  const infoY = useTransform(d, [0, 0.45], [0, 24])
  const imgX = useTransform(progress, [0, 1], [`${6 + i * 2}%`, `${-6 - (N - i) * 2}%`])

  return (
    <motion.button
      type="button"
      onClick={onOpen}
      style={{ scale }}
      data-cursor="explore"
      className="relative h-full w-[min(62vw,1040px)] shrink-0 origin-center overflow-hidden bg-charcoal text-left will-change-transform"
      aria-label={`${estate.name}, ${estate.place} — arrange a private viewing`}
    >
      <motion.div className="absolute -inset-x-[14%] inset-y-0 will-change-transform" style={{ x: imgX }}>
        <Img photo={estate.photo} sizes="62vw" widths={[960, 1400, 2000]} />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-void/90 via-void/20 to-transparent" />
      <motion.div className="absolute inset-0 bg-void" style={{ opacity: dim }} />

      <motion.div style={{ opacity: info, y: infoY }} className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-8 p-8 xl:p-10">
        <div>
          <p className="mb-3 text-[10.5px] tracking-[0.32em] text-champagne uppercase">
            0{i + 1} · {estate.style}
          </p>
          <h3 className="font-serif text-[clamp(3rem,5vw,5.4rem)] leading-[0.9] font-light text-ivory">{estate.place}</h3>
          <p className="mt-3 text-[11px] tracking-[0.3em] text-ivory/60 uppercase">{estate.country}</p>
          <p className="mt-5 max-w-[400px] text-[14px] leading-[1.7] text-ivory/75">
            <span className="text-ivory">{estate.name}.</span> {estate.description}
          </p>
        </div>
        <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full border border-champagne/70 text-champagne">
          <ArrowUpRight className="h-6 w-6" strokeWidth={1.2} />
        </span>
      </motion.div>
    </motion.button>
  )
}

/** Desktop: the section pins and vertical scroll drives the estates sideways. */
function StickyScroller() {
  const { open } = useUI()
  const target = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const [distance, setDistance] = useState(0)
  const [index, setIndex] = useState(0)

  const scrollYProgress = useSectionProgress(target, ['start start', 'end end'])
  // Leave a short dwell at each end so the first and last estates settle before/after the travel.
  const travel = useTransform(scrollYProgress, [0.06, 0.94], [0, 1], { clamp: true })
  const x = useTransform(travel, (v) => -v * distance)
  const bar = useTransform(travel, [0, 1], [1 / N, 1])

  useMotionValueEvent(travel, 'change', (v) => setIndex(Math.round(v * (N - 1))))

  useLayoutEffect(() => {
    const measure = () => {
      const el = track.current
      if (!el) return
      // Travel until the last panel is centred in the viewport.
      const last = el.lastElementChild as HTMLElement
      const lastCenter = last.offsetLeft + last.offsetWidth / 2
      const firstCenter = (el.firstElementChild as HTMLElement).offsetLeft + (el.firstElementChild as HTMLElement).offsetWidth / 2
      setDistance(lastCenter - firstCenter)
    }
    measure()
    const ro = new ResizeObserver(measure)
    if (track.current) ro.observe(track.current)
    return () => ro.disconnect()
  }, [])

  return (
    <section id="estates" ref={target} style={{ height: `${100 + (N - 1) * 70}vh` }} className="relative bg-void" aria-label="Iconic estates around the world">
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden pt-24 pb-10">
        <Header />
        <div className="relative mt-10 min-h-0 flex-1">
          <motion.div
            ref={track}
            style={{ x, paddingLeft: 'calc(50vw - min(31vw, 520px))', paddingRight: 'calc(50vw - min(31vw, 520px))' }}
            className="flex h-full items-center gap-[2.5vw] will-change-transform"
          >
            {estates.map((e, i) => (
              <Panel key={e.place} estate={e} i={i} progress={travel} onOpen={() => open({ kind: 'inquiry', subject: `Private viewing — ${e.name}, ${e.place}` })} />
            ))}
          </motion.div>
        </div>
        <div className="frame mt-6 flex items-center gap-6">
          <span className="font-serif text-[1.35rem] text-ivory tabular-nums">0{index + 1}</span>
          <span className="relative h-px w-40 bg-ivory/15">
            <motion.span style={{ scaleX: bar }} className="absolute inset-0 origin-left bg-champagne" />
          </span>
          <span className="font-serif text-[1.35rem] text-ivory/40 tabular-nums">0{N}</span>
          <span className="ml-auto flex gap-8 text-[10.5px] tracking-[0.28em] uppercase">
            {estates.map((e, i) => (
              <span key={e.place} className={`transition-colors duration-500 ${i === index ? 'text-champagne' : 'text-ivory/35'}`}>
                {e.place}
              </span>
            ))}
          </span>
        </div>
      </div>
    </section>
  )
}

/** Touch / small screens / reduced motion: a native swipe gallery. */
function SwipeGallery() {
  const { open } = useUI()
  const [index, setIndex] = useState(0)
  return (
    <section id="estates" className="relative bg-void py-20" aria-label="Iconic estates around the world">
      <Header />
      <div
        className="no-scrollbar mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-5 sm:px-8"
        onScroll={(e) => {
          const el = e.currentTarget
          const w = (el.firstElementChild as HTMLElement).offsetWidth + 16
          setIndex(Math.min(N - 1, Math.round(el.scrollLeft / w)))
        }}
      >
        {estates.map((e, i) => (
          <button
            key={e.place}
            type="button"
            onClick={() => open({ kind: 'inquiry', subject: `Private viewing — ${e.name}, ${e.place}` })}
            className="relative aspect-[4/5] w-[84vw] max-w-[560px] shrink-0 snap-center overflow-hidden bg-charcoal text-left sm:aspect-[5/4]"
          >
            <Img photo={e.photo} sizes="84vw" widths={[480, 800, 1200]} />
            <div className="absolute inset-0 bg-gradient-to-t from-void/90 via-void/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6">
              <p className="mb-2 text-[10px] tracking-[0.3em] text-champagne uppercase">
                0{i + 1} · {e.style}
              </p>
              <h3 className="font-serif text-[2.8rem] leading-none font-light">{e.place}</h3>
              <p className="mt-2 text-[10.5px] tracking-[0.28em] text-ivory/60 uppercase">{e.country}</p>
              <p className="mt-3 text-[13px] leading-relaxed text-ivory/75">{e.description}</p>
            </div>
          </button>
        ))}
        <span className="w-1 shrink-0" aria-hidden />
      </div>
      <div className="frame mt-6 flex items-center gap-2" aria-hidden>
        {estates.map((e, i) => (
          <span key={e.place} className={`h-px transition-all duration-500 ${i === index ? 'w-10 bg-champagne' : 'w-4 bg-ivory/25'}`} />
        ))}
        <span className="ml-auto text-[10.5px] tracking-[0.28em] text-ivory/50 uppercase">Swipe</span>
      </div>
    </section>
  )
}

export function EstateScroller() {
  const immersive = useCinematic()
  return immersive ? <StickyScroller /> : <SwipeGallery />
}
