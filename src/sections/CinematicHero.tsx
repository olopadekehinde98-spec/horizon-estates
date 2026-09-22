import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from 'framer-motion'
import { ArrowRight, Play } from 'lucide-react'
import { useRef, type PointerEvent } from 'react'
import { Img } from '../components/Img'
import { Magnetic } from '../components/Magnetic'
import { SplitLines } from '../components/SplitLines'
import { hero } from '../data/content'
import { useImmersive, useMotionOK } from '../hooks/useMediaQuery'
import { useSectionProgress } from '../hooks/useSectionProgress'
import { EASE, goTo, useUI } from '../lib/ui'

/** Combine a scroll-driven offset with a mouse-driven offset (px). */
function useLayer(scroll: MotionValue<number>, range: [number, number], mouse: MotionValue<number>, depth: number) {
  const s = useTransform(scroll, [0, 1], range)
  return useTransform([s, mouse], ([a, b]: number[]) => a + b * depth)
}

export function CinematicHero() {
  const { introDone, open } = useUI()
  const ref = useRef<HTMLElement>(null)
  const immersive = useImmersive()
  const motionOK = useMotionOK()

  const scrollYProgress = useSectionProgress(ref, ['start start', 'end start'])
  const still = useMotionValue(0)
  const p = motionOK ? scrollYProgress : still

  // Mouse, normalised to -1..1, heavily damped.
  const mxRaw = useMotionValue(0)
  const myRaw = useMotionValue(0)
  const mx = useSpring(mxRaw, { stiffness: 40, damping: 18 })
  const my = useSpring(myRaw, { stiffness: 40, damping: 18 })

  // Depth stack — each plane travels at its own rate (scroll px range, mouse px amplitude).
  // Sky/photo moves slowest and opposite the cursor; foreground framing moves fastest.
  const vh = typeof window !== 'undefined' ? window.innerHeight : 900
  const photoY = useLayer(p, [0, vh * 0.32], my, -14)
  const photoX = useTransform(mx, (v) => v * -16)
  const glowY = useLayer(p, [0, vh * 0.18], my, -7)
  const glowX = useTransform(mx, (v) => v * -8)
  const fgY = useLayer(p, [0, -vh * 0.12], my, 10)
  const fgX = useTransform(mx, (v) => v * 12)
  const textY = useLayer(p, [0, -vh * 0.22], my, 4)
  const textX = useTransform(mx, (v) => v * 5)
  const textOpacity = useTransform(p, [0, 0.55], [1, 0])
  const shade = useTransform(p, [0, 1], [0, 0.65])

  const onMove = (e: PointerEvent<HTMLElement>) => {
    if (!immersive) return
    mxRaw.set((e.clientX / window.innerWidth) * 2 - 1)
    myRaw.set((e.clientY / window.innerHeight) * 2 - 1)
  }

  const play = introDone
  // Reduced motion: everything present at once — no staged delays.
  const at = (s: number) => ({ duration: motionOK ? 1.1 : 0.2, delay: play && motionOK ? s : 0, ease: EASE })

  return (
    <section
      id="home"
      ref={ref}
      onPointerMove={onMove}
      className="relative isolate flex h-[100svh] min-h-[640px] items-end overflow-hidden bg-void"
      aria-label="Horizon Estates — Live Beyond Ordinary"
    >
      {/* 1 — Photograph (sky, cliffs, villa). Oversized so mouse + scroll travel never exposes an edge. */}
      <motion.div className="absolute -inset-[4%] -z-30 will-change-transform" style={{ y: photoY, x: photoX }}>
        <motion.div
          className="h-full w-full"
          initial={{ scale: 1.08, opacity: 0 }}
          animate={play ? { scale: 1, opacity: 1 } : { scale: 1.08, opacity: 0 }}
          transition={{ duration: 2.8, ease: EASE, opacity: { duration: 1.8 } }}
        >
          <Img photo={hero.photo} priority widths={[828, 1280, 1600]} className="object-[50%_60%]" />
        </motion.div>
      </motion.div>

      {/* 2 — Atmosphere: warm sunset bloom sitting on the horizon line. */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20 will-change-transform"
        style={{ y: glowY, x: glowX }}
        initial={{ opacity: 0 }}
        animate={{ opacity: play ? 1 : 0 }}
        transition={{ duration: 3, delay: play ? 0.6 : 0 }}
      >
        <div className="absolute top-[30%] left-[58%] h-[46vh] w-[70vw] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,rgba(255,176,102,0.32),rgba(255,140,80,0.1)_55%,transparent)] mix-blend-screen" />
      </motion.div>

      {/* 3 — Foreground framing: deep shadow at the edges, travelling fastest. */}
      <motion.div aria-hidden className="pointer-events-none absolute -inset-[6%] -z-10 will-change-transform" style={{ y: fgY, x: fgX }}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_40%,transparent_35%,rgba(5,5,4,0.55)_75%,rgba(5,5,4,0.9)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-void via-void/60 to-transparent" />
        <div className="absolute inset-y-0 left-0 w-[60%] bg-gradient-to-r from-void/85 via-void/40 to-transparent max-md:w-full max-md:from-void/60" />
      </motion.div>
      <motion.div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-void" style={{ opacity: shade }} />
      <div aria-hidden className="grain pointer-events-none absolute inset-0 -z-10" />

      {/* 4 — Type. */}
      <motion.div className="frame relative w-full pb-28 will-change-transform md:pb-32" style={{ y: textY, x: textX, opacity: textOpacity }}>
        <div className="max-w-[620px]">
          <motion.p
            className="label mb-7 leading-[2]"
            initial={{ opacity: 0, y: 14 }}
            animate={play ? { opacity: 1, y: 0 } : {}}
            transition={at(0.55)}
          >
            Extraordinary places
            <br />
            for extraordinary people
          </motion.p>

          <SplitLines
            as="h1"
            play={play}
            delay={0.75}
            stagger={0.14}
            className="display text-[clamp(4.1rem,10.5vw,9.5rem)] text-ivory"
            lines={[
              'Live',
              <span className="text-champagne italic">Beyond</span>,
              'Ordinary',
            ]}
          />

          <motion.p
            className="mt-8 max-w-[440px] text-[15px] leading-[1.75] text-ivory/75"
            initial={{ opacity: 0, y: 22 }}
            animate={play ? { opacity: 1, y: 0 } : {}}
            transition={at(1.45)}
          >
            Discover a collection of the world’s most exceptional estates, where architecture, nature, and lifestyle come together in perfect harmony.
          </motion.p>

          <motion.div
            className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5"
            initial={{ opacity: 0, y: 18 }}
            animate={play ? { opacity: 1, y: 0 } : {}}
            transition={at(1.7)}
          >
            <Magnetic>
              <button type="button" onClick={() => goTo('arrival')} className="btn-gold group">
                Explore the Estate
                <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" strokeWidth={1.6} />
              </button>
            </Magnetic>
            <button type="button" onClick={() => open({ kind: 'film' })} className="group flex items-center gap-4 text-[12px] tracking-[0.16em] text-ivory uppercase">
              <span className="relative grid h-12 w-12 place-items-center rounded-full border border-champagne/70 transition-colors duration-500 group-hover:bg-champagne group-hover:text-ink">
                <Play className="ml-0.5 h-4 w-4 fill-current" strokeWidth={1} />
                <span className="absolute inset-0 animate-[pulse-ring_2.8s_ease-out_infinite] rounded-full border border-champagne/40" />
              </span>
              Watch the Film
            </button>
          </motion.div>
        </div>
      </motion.div>

      {/* 5 — Location slate + scroll cue, last to arrive. */}
      <motion.div
        className="frame absolute inset-x-0 bottom-0 flex items-end justify-between pb-7"
        initial={{ opacity: 0 }}
        animate={play ? { opacity: 1 } : {}}
        transition={{ duration: 1.4, delay: play && motionOK ? 2.3 : 0 }}
      >
        <div className="flex items-center gap-5 text-[10.5px] tracking-[0.22em] text-ivory/60 uppercase">
          <span className="text-champagne">Now showing</span>
          <span className="hidden h-px w-10 bg-ivory/30 sm:block" />
          <span className="text-ivory/85">{hero.estate}</span>
          <span className="hidden sm:inline">{hero.place}</span>
          <span className="hidden text-ivory/40 lg:inline">{hero.coords}</span>
        </div>
        <button type="button" onClick={() => goTo('arrival')} className="hidden items-center gap-4 text-[10.5px] tracking-[0.22em] text-ivory/60 uppercase md:flex">
          Scroll to explore
          <span className="relative h-10 w-px overflow-hidden bg-ivory/20">
            <span className="absolute inset-x-0 top-0 h-1/2 animate-[scroll-line_2.4s_ease-in-out_infinite] bg-champagne" />
          </span>
        </button>
      </motion.div>
    </section>
  )
}
