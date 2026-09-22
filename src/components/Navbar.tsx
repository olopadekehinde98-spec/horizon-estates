import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { Menu, Search, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { navLinks } from '../data/content'
import { EASE, EASE_MASK, useUI } from '../lib/ui'
import { Logo } from './Logo'

export function Navbar() {
  const { introDone, open } = useUI()
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [menu, setMenu] = useState(false)
  const [active, setActive] = useState('#home')

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setScrolled(y > 60)
    // Tuck the bar away while travelling down deep into the page; bring it back on any upward scroll.
    if (y > 900 && y > prev + 4) setHidden(true)
    else if (y < prev - 4 || y <= 900) setHidden(false)

    const probe = y + window.innerHeight * 0.45
    let best = -1
    let current = '#home'
    for (const l of navLinks) {
      const el = document.querySelector<HTMLElement>(l.href)
      if (el && el.offsetTop <= probe && el.offsetTop > best) {
        best = el.offsetTop
        current = l.href
      }
    }
    setActive(current)
  })

  useEffect(() => {
    if (!menu) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenu(false)
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [menu])

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={introDone ? { opacity: 1, y: hidden ? -110 : 0 } : { opacity: 0, y: -16 }}
        transition={{ duration: 0.9, ease: EASE }}
        className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4"
      >
        <nav
          aria-label="Main"
          className={`mx-auto flex max-w-[1440px] items-center justify-between px-4 transition-[background-color,backdrop-filter,padding,border-color] duration-700 ease-cine sm:px-6 lg:px-8 ${
            scrolled ? 'border border-white/[0.07] bg-void/70 py-2.5 backdrop-blur-xl' : 'border border-transparent py-4'
          }`}
        >
          <a href="#home" aria-label="Horizon Estates — home">
            <Logo />
          </a>

          <ul className="hidden items-center gap-10 lg:flex">
            {navLinks.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className={`group relative py-3 text-[12.5px] tracking-[0.08em] transition-colors duration-500 ${
                    active === l.href ? 'text-ivory' : 'text-ivory/60 hover:text-ivory'
                  }`}
                >
                  {l.label}
                  <span
                    className={`absolute inset-x-0 -bottom-0.5 h-px origin-left bg-champagne transition-transform duration-700 ease-cine ${
                      active === l.href ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`}
                  />
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-1.5 sm:gap-4">
            <button
              type="button"
              onClick={() => open({ kind: 'search' })}
              aria-label="Search estates"
              className="grid h-10 w-10 place-items-center text-ivory/80 transition-colors hover:text-champagne"
            >
              <Search className="h-[18px] w-[18px]" strokeWidth={1.4} />
            </button>
            <a href="#footer" className="hidden text-[12.5px] tracking-[0.08em] text-ivory/70 transition-colors hover:text-ivory xl:inline">
              Sign In
            </a>
            <button
              type="button"
              onClick={() => open({ kind: 'inquiry' })}
              className="hidden bg-champagne px-5 py-2.5 text-[11px] font-semibold tracking-[0.16em] text-ink uppercase transition-colors duration-500 hover:bg-champagne-light sm:inline-block"
            >
              Inquire Now
            </button>
            <button
              type="button"
              onClick={() => setMenu(true)}
              aria-label="Open menu"
              aria-expanded={menu}
              className="grid h-10 w-10 place-items-center text-ivory lg:hidden"
            >
              <Menu className="h-6 w-6" strokeWidth={1.2} />
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {menu && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-[80] flex flex-col bg-void lg:hidden"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.8, ease: EASE_MASK }}
          >
            <div className="flex items-center justify-between px-5 py-6 sm:px-8">
              <Logo />
              <button type="button" onClick={() => setMenu(false)} aria-label="Close menu" className="grid h-10 w-10 place-items-center" autoFocus>
                <X className="h-6 w-6" strokeWidth={1.2} />
              </button>
            </div>
            <ul className="flex flex-1 flex-col justify-center px-5 sm:px-8">
              {navLinks.map((l, i) => (
                <li key={l.href} className="overflow-hidden border-b border-white/[0.07]">
                  <motion.a
                    href={l.href}
                    onClick={() => setMenu(false)}
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    transition={{ delay: 0.35 + i * 0.06, duration: 0.8, ease: EASE }}
                    className="flex items-baseline justify-between py-4 font-serif text-[2.6rem] leading-none font-light"
                  >
                    {l.label}
                    <span className="font-sans text-[11px] tracking-[0.3em] text-champagne">0{i + 1}</span>
                  </motion.a>
                </li>
              ))}
            </ul>
            <div className="grid grid-cols-2 gap-3 px-5 pb-10 sm:px-8">
              <a href="#footer" onClick={() => setMenu(false)} className="btn-line justify-center">
                Sign In
              </a>
              <button
                type="button"
                onClick={() => {
                  setMenu(false)
                  open({ kind: 'inquiry' })
                }}
                className="btn-gold justify-center"
              >
                Inquire Now
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
