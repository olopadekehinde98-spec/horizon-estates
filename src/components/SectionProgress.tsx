import { motion, useMotionValueEvent, useScroll, useSpring } from 'framer-motion'
import { useState } from 'react'
import { chapters } from '../data/content'
import { useUI } from '../lib/ui'

/** Desktop: vertical chapter index. Mobile: a hairline progress bar. */
export function SectionProgress() {
  const { introDone } = useUI()
  const { scrollY, scrollYProgress } = useScroll()
  const bar = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })
  const [active, setActive] = useState(0)
  const [atFooter, setAtFooter] = useState(false)

  useMotionValueEvent(scrollY, 'change', (y) => {
    const probe = y + window.innerHeight * 0.5
    let idx = 0
    chapters.forEach((c, i) => {
      const el = document.getElementById(c.id)
      if (el && el.offsetTop <= probe) idx = i
    })
    setActive(idx)
    const footer = document.getElementById('footer')
    setAtFooter(!!footer && y + window.innerHeight > footer.offsetTop + 120)
  })

  return (
    <>
      <motion.nav
        aria-label="Chapters"
        className="fixed top-1/2 right-5 z-40 hidden -translate-y-1/2 xl:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: introDone && !atFooter ? 1 : 0 }}
        transition={{ duration: 0.8 }}
      >
        <ol className="flex flex-col gap-4">
          {chapters.map((c, i) => {
            const on = i === active
            return (
              <li key={c.id}>
                <a href={`#${c.id}`} className="group flex items-center justify-end gap-3" aria-current={on ? 'true' : undefined}>
                  <span
                    className={`text-[10px] tracking-[0.2em] uppercase transition-all duration-500 [text-shadow:0_1px_8px_rgba(0,0,0,0.6)] ${
                      'translate-x-2 text-ivory opacity-0 group-hover:translate-x-0 group-hover:opacity-100'
                    }`}
                  >
                    {c.label}
                  </span>
                  <span className={`w-5 text-right text-[10px] tabular-nums transition-colors duration-500 ${on ? 'text-champagne' : 'text-ivory/45'}`}>
                    0{i + 1}
                  </span>
                  <span className="relative h-px w-8 bg-ivory/25">
                    {on && (
                      <motion.span
                        layoutId="chapter-active"
                        className="absolute inset-0 bg-champagne"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                  </span>
                </a>
              </li>
            )
          })}
        </ol>
      </motion.nav>

      <motion.div aria-hidden className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-champagne xl:hidden" style={{ scaleX: bar }} />
    </>
  )
}
