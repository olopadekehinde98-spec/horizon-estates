import { AnimatePresence, motion } from 'framer-motion'
import { EASE, EASE_MASK } from '../lib/ui'

/** The opening title card: dark screen → logo draws → curtain lifts. */
export function Intro({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="intro"
          data-intro className="fixed inset-0 z-[150] flex items-center justify-center bg-void"
          exit={{ clipPath: 'inset(0% 0% 100% 0%)', pointerEvents: 'none' }}
          initial={{ clipPath: 'inset(0% 0% 0% 0%)' }}
          transition={{ duration: 1.25, ease: EASE_MASK }}
          aria-hidden
        >
          <motion.div
            className="flex flex-col items-center"
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
              <svg viewBox="0 0 32 32" className="h-16 w-16 text-champagne" fill="none" stroke="currentColor" strokeWidth="0.9">
                {['M6 27V13.5a10 10 0 0 1 20 0V27', 'M11 27V15a5 5 0 0 1 10 0v12', 'M16 27V9.5', 'M3.5 27h25'].map((d, i) => (
                  <motion.path
                    key={d}
                    d={d}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.3, delay: 0.1 + i * 0.12, ease: EASE }}
                  />
                ))}
              </svg>
            </motion.div>
            <div className="mt-6 overflow-hidden">
              <motion.p
                initial={{ y: '110%' }}
                animate={{ y: 0 }}
                transition={{ duration: 1.1, delay: 0.5, ease: EASE }}
                className="font-serif text-[2.1rem] font-light tracking-[0.34em] text-ivory"
              >
                HORIZON
              </motion.p>
            </div>
            <motion.p
              initial={{ opacity: 0, letterSpacing: '0.3em' }}
              animate={{ opacity: 1, letterSpacing: '0.7em' }}
              transition={{ duration: 1.6, delay: 0.8, ease: EASE }}
              className="mt-2 text-[10px] text-mist"
            >
              ESTATES
            </motion.p>
            <motion.span
              className="mt-8 block h-px w-24 origin-left bg-champagne/70"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.8, delay: 0.6, ease: EASE }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
