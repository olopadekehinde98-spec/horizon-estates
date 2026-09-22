import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { Img } from '../components/Img'
import { SplitLines } from '../components/SplitLines'
import { rooms } from '../data/content'
import { EASE, useUI } from '../lib/ui'

/** Interactive room viewer: one full-bleed photograph, a quiet index of rooms on the right. */
export function InteriorExperience() {
  const { open } = useUI()
  const [i, setI] = useState(0)
  const room = rooms[i]

  return (
    <section className="relative isolate h-[100svh] min-h-[680px] overflow-hidden bg-void" aria-label="Interior experience">
      {/* Crossfading photograph with a slow settle. */}
      <AnimatePresence initial={false}>
        <motion.div
          key={room.name}
          className="absolute inset-0 -z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.3, ease: EASE }}
          data-cursor="view"
          onClick={() => open({ kind: 'gallery', index: i })}
        >
          <motion.div className="h-full w-full" initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 7, ease: EASE }}>
            <Img photo={room.photo} widths={[828, 1280, 1600]} />
          </motion.div>
        </motion.div>
      </AnimatePresence>
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-void/85 via-void/30 to-void/55" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-void/80 to-transparent" />

      <div className="frame pointer-events-none relative flex h-full flex-col justify-end pb-14 lg:flex-row lg:items-end lg:justify-between lg:pb-20">
        {/* Copy */}
        <div className="pointer-events-auto max-w-[560px]">
          <p className="label mb-6">
            Interiors · {String(i + 1).padStart(2, '0')} / {String(rooms.length).padStart(2, '0')}
          </p>
          <SplitLines key={room.name} play as="h2" className="display text-[clamp(3rem,6.5vw,6.6rem)] text-ivory" lines={[room.name]} />
          <AnimatePresence mode="wait">
            <motion.p
              key={room.name}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="mt-6 max-w-[420px] text-[14.5px] leading-[1.8] text-ivory/75"
            >
              {room.description}
            </motion.p>
          </AnimatePresence>
          <button type="button" onClick={() => open({ kind: 'gallery', index: i })} className="btn-line group mt-9 hidden lg:inline-flex">
            View Interior Gallery
            <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" strokeWidth={1.4} />
          </button>
        </div>

        {/* Room index */}
        <nav aria-label="Rooms" className="pointer-events-auto mt-8 lg:mt-0 lg:mb-2">
          <ul
            className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 lg:mx-0 lg:flex-col lg:gap-1 lg:overflow-visible lg:border-l lg:border-ivory/15 lg:px-0 lg:pl-8"
            role="tablist"
            aria-orientation="vertical"
          >
            {rooms.map((r, idx) => {
              const on = idx === i
              return (
                <li key={r.name} className="shrink-0">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={on}
                    onClick={() => setI(idx)}
                    onKeyDown={(e) => {
                      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') setI((idx + 1) % rooms.length)
                      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') setI((idx - 1 + rooms.length) % rooms.length)
                    }}
                    className={`relative flex items-center gap-4 border px-4 py-2.5 text-[11.5px] tracking-[0.2em] whitespace-nowrap uppercase transition-colors duration-500 lg:w-[260px] lg:border-0 lg:px-0 lg:py-3 ${
                      on ? 'border-champagne text-ivory' : 'border-ivory/20 text-ivory/50 hover:text-ivory'
                    }`}
                  >
                    <span className="relative hidden h-2 w-2 lg:block">
                      <span className="absolute inset-0 rounded-full bg-ivory/30" />
                      {on && <motion.span layoutId="room-dot" className="absolute -inset-0.5 rounded-full bg-champagne" />}
                    </span>
                    {r.name}
                    {on && (
                      <motion.span layoutId="room-thumb" className="ml-auto hidden h-10 w-16 overflow-hidden lg:block" transition={{ type: 'spring', stiffness: 260, damping: 30 }}>
                        <AnimatePresence mode="popLayout" initial={false}>
                          <motion.span key={r.name} className="block h-full w-full" initial={{ opacity: 0, scale: 1.3 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
                            <Img photo={r.photo} decorative sizes="64px" widths={[160]} noPreview />
                          </motion.span>
                        </AnimatePresence>
                      </motion.span>
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </section>
  )
}
