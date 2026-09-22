import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion'
import { memo, useEffect, useLayoutEffect, useRef, useState, type ReactElement } from 'react'
import { Img } from '../components/Img'
import { SplitLines } from '../components/SplitLines'
import { destinations } from '../data/content'
import { MAP_LAT_TOP, MAP_LON_LEFT, MAP_ROWS, MAP_STEP } from '../data/worldDots'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { EASE, EASE_MASK } from '../lib/ui'

const CELL = 10
const MW = MAP_ROWS[0].length * CELL
const MH = MAP_ROWS.length * CELL
const DWELL = 6500

const project = (lat: number, lon: number) => ({
  x: ((lon - MAP_LON_LEFT) / MAP_STEP) * CELL,
  y: ((MAP_LAT_TOP - lat) / MAP_STEP) * CELL,
})

const coords = (lat: number, lon: number) =>
  `${Math.abs(lat).toFixed(2)}° ${lat >= 0 ? 'N' : 'S'} · ${Math.abs(lon).toFixed(2)}° ${lon >= 0 ? 'E' : 'W'}`

/** Static land dots — rendered once. */
const Dots = memo(function Dots() {
  const circles: ReactElement[] = []
  MAP_ROWS.forEach((row, r) => {
    for (let c = 0; c < row.length; c++) {
      if (row[c] === '1') circles.push(<circle key={`${r}-${c}`} cx={c * CELL + CELL / 2} cy={r * CELL + CELL / 2} r={2.1} />)
    }
  })
  return <g fill="rgba(242,237,228,0.24)">{circles}</g>
})

/** Section 08 — the camera travels the globe from one destination to the next. */
export function DestinationExplorer() {
  const section = useRef<HTMLElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const [[i, prev], setIdx] = useState<[number, number]>([0, 0])
  const [auto, setAuto] = useState(true)
  const [size, setSize] = useState({ w: 1200, h: 800 })
  const desktop = useMediaQuery('(min-width: 1024px)')
  const reduce = useReducedMotion()
  const inView = useInView(section, { amount: 0.4 })
  const d = destinations[i]

  const go = (to: number) => setIdx(([cur]) => [to, cur])

  useLayoutEffect(() => {
    const el = stage.current
    if (!el) return
    const measure = () => setSize({ w: el.clientWidth, h: el.clientHeight })
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Gentle autoplay while in view, until the visitor takes the controls.
  useEffect(() => {
    if (!auto || !inView || reduce) return
    const t = window.setTimeout(() => setIdx(([cur]) => [(cur + 1) % destinations.length, cur]), DWELL)
    return () => window.clearTimeout(t)
  }, [auto, inView, reduce, i])

  // Camera: fit the map to the stage width, zoom in, and place the active city at the focal point.
  const base = size.w / MW
  const zoom = desktop ? 1.55 : 3.4
  const s = base * zoom
  const focus = { x: size.w * (desktop ? 0.64 : 0.5), y: size.h * (desktop ? 0.44 : 0.5) }
  const pt = project(d.lat, d.lon)
  const from = project(destinations[prev].lat, destinations[prev].lon)
  const arcTop = Math.min(from.y, pt.y) - Math.max(60, Math.abs(pt.x - from.x) * 0.28)
  const arc = `M ${from.x} ${from.y} Q ${(from.x + pt.x) / 2} ${arcTop} ${pt.x} ${pt.y}`

  return (
    <section id="locations" ref={section} className="relative isolate overflow-hidden bg-void lg:h-[100svh] lg:min-h-[760px]" aria-label="Destinations">
      {/* Faint echo of the destination's photograph */}
      <AnimatePresence initial={false}>
        <motion.div key={i} className="absolute inset-0 -z-30" initial={{ opacity: 0 }} animate={{ opacity: 0.2 }} exit={{ opacity: 0 }} transition={{ duration: 1.6 }}>
          <Img photo={d.photo} decorative sizes="40vw" widths={[640]} className="scale-110 blur-2xl" />
        </motion.div>
      </AnimatePresence>

      {/* Map stage */}
      <div ref={stage} className="relative h-[52svh] overflow-hidden lg:absolute lg:inset-0 lg:-z-20 lg:h-auto" aria-hidden>
        <motion.div
          className="absolute top-0 left-0"
          style={{ width: MW, height: MH, originX: 0, originY: 0 }}
          animate={{ x: focus.x - pt.x * s, y: focus.y - pt.y * s, scale: s }}
          transition={{ duration: 2.2, ease: EASE_MASK }}
        >
          <svg viewBox={`0 0 ${MW} ${MH}`} width={MW} height={MH} className="overflow-visible">
            <Dots />
            {/* Travel arc from the previous destination */}
            {prev !== i && (
              <motion.path
                key={`arc-${prev}-${i}`}
                d={arc}
                fill="none"
                stroke="#c8a96a"
                strokeWidth={1.4}
                vectorEffect="non-scaling-stroke"
                strokeDasharray="1 0"
                initial={{ pathLength: 0, opacity: 0.9 }}
                animate={{ pathLength: 1, opacity: [0.9, 0.9, 0.25] }}
                transition={{ duration: 2.4, ease: EASE, opacity: { duration: 4, times: [0, 0.6, 1] } }}
              />
            )}
            {destinations.map((dest, k) => {
              const q = project(dest.lat, dest.lon)
              const on = k === i
              return (
                // Counter-scale so markers and labels keep a constant on-screen size.
                <g key={dest.city} transform={`translate(${q.x} ${q.y}) scale(${1 / s})`}>
                  {on && (
                    <circle r={16} fill="none" stroke="#c8a96a" strokeWidth={1} vectorEffect="non-scaling-stroke" style={{ transformBox: 'fill-box', transformOrigin: 'center', animation: 'pulse-ring 2.4s ease-out infinite' }} />
                  )}
                  <circle r={on ? 5 : 3.5} fill={on ? '#c8a96a' : 'rgba(200,169,106,0.55)'} />
                  <text x={11} y={4} fontSize={on ? 12 : 10} fill={on ? '#f2ede4' : 'rgba(242,237,228,0.45)'} fontFamily="Manrope, sans-serif" letterSpacing={1.6} fontWeight={on ? 600 : 400}>
                    {dest.city.toUpperCase()}
                  </text>
                </g>
              )
            })}
          </svg>
        </motion.div>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_64%_44%,transparent_30%,rgba(7,7,6,0.85)_85%)]" />
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 -z-10 hidden w-[46%] bg-gradient-to-r from-void via-void/80 to-transparent lg:block" />

      {/* Controls + copy */}
      <div className="frame relative flex flex-col gap-10 pt-10 pb-20 lg:h-full lg:flex-row lg:items-stretch lg:justify-between lg:pt-32 lg:pb-16">
        <div className="flex flex-col lg:w-[360px]">
          <p className="label mb-6">08 — Destinations</p>
          <SplitLines className="display text-[clamp(2.8rem,4.6vw,4.6rem)] text-ivory" lines={['Travel the', <span className="italic">Collection</span>]} />

          <ol className="no-scrollbar -mx-5 mt-10 flex gap-2 overflow-x-auto px-5 lg:mx-0 lg:mt-auto lg:flex-col lg:gap-0 lg:overflow-visible lg:px-0" aria-label="Destinations">
            {destinations.map((dest, k) => {
              const on = k === i
              return (
                <li key={dest.city} className="shrink-0 lg:border-b lg:border-ivory/10">
                  <button
                    type="button"
                    onClick={() => {
                      setAuto(false)
                      go(k)
                    }}
                    aria-current={on ? 'true' : undefined}
                    className={`relative flex w-full items-center gap-4 border px-4 py-2.5 text-left text-[12px] tracking-[0.2em] uppercase transition-colors duration-500 lg:border-0 lg:px-0 lg:py-3.5 ${
                      on ? 'border-champagne text-ivory' : 'border-ivory/15 text-ivory/45 hover:text-ivory'
                    }`}
                  >
                    <span className={`hidden w-6 text-[10px] tabular-nums lg:inline ${on ? 'text-champagne' : ''}`}>0{k + 1}</span>
                    {dest.city}
                    <span className="ml-auto hidden text-[10px] text-ivory/35 lg:inline">{dest.estates} estates</span>
                    {on && auto && inView && !reduce && (
                      <motion.span
                        key={`bar-${i}`}
                        className="absolute bottom-0 left-0 hidden h-px bg-champagne lg:block"
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{ duration: DWELL / 1000, ease: 'linear' }}
                      />
                    )}
                    {on && (!auto || reduce) && <motion.span layoutId="dest-line" className="absolute bottom-0 left-0 hidden h-px w-full bg-champagne lg:block" />}
                  </button>
                </li>
              )
            })}
          </ol>
        </div>

        <div className="flex flex-col gap-8 sm:flex-row sm:items-end lg:self-end">
          <div className="max-w-[380px] sm:text-right">
            <p className="text-[10.5px] tracking-[0.3em] text-champagne uppercase">{coords(d.lat, d.lon)}</p>
            <SplitLines key={d.city} play as="h3" className="display mt-3 text-[clamp(3.2rem,6vw,6rem)] text-ivory" lines={[d.city]} />
            <AnimatePresence mode="wait">
              <motion.div key={d.city} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.7, delay: 0.2, ease: EASE }}>
                <p className="mt-3 text-[11px] tracking-[0.3em] text-ivory/60 uppercase">{d.country}</p>
                <p className="mt-4 text-[14px] leading-[1.7] text-ivory/70">{d.note}</p>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="relative aspect-[4/5] w-full shrink-0 overflow-hidden bg-charcoal sm:w-[240px] xl:w-[280px]" data-cursor="view">
            <AnimatePresence initial={false}>
              <motion.div
                key={d.city}
                className="absolute inset-0"
                initial={{ clipPath: 'inset(100% 0% 0% 0%)', zIndex: 1 }}
                animate={{ clipPath: 'inset(0% 0% 0% 0%)', zIndex: 1 }}
                exit={{ zIndex: 0, transition: { duration: 1.2 } }}
                transition={{ duration: 1.2, ease: EASE_MASK }}
              >
                <motion.div className="h-full w-full" initial={{ scale: 1.25 }} animate={{ scale: 1 }} transition={{ duration: 2, ease: EASE }}>
                  <Img photo={d.photo} sizes="(min-width: 640px) 280px, 100vw" widths={[400, 700]} />
                </motion.div>
              </motion.div>
            </AnimatePresence>
            <p className="absolute right-4 bottom-4 left-4 z-10 flex items-center justify-between text-[10px] tracking-[0.25em] text-ivory uppercase">
              <span>{d.estates} estates</span>
              <span className="text-champagne">
                {String(i + 1).padStart(2, '0')} / {String(destinations.length).padStart(2, '0')}
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
