import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Check } from 'lucide-react'
import { useState, type FormEvent, type SVGProps } from 'react'
import { Logo } from './Logo'

const columns = [
  { title: 'Explore', links: [['Estates', '#estates'], ['Locations', '#locations'], ['Experiences', '#experiences'], ['Gallery', '#interiors']] },
  { title: 'Company', links: [['About', '#arrival'], ['Our Story', '#architecture'], ['Journal', '#footer'], ['Careers', '#footer']] },
  { title: 'Support', links: [['FAQs', '#footer'], ['Privacy', '#footer'], ['Terms', '#footer'], ['Contact', '#footer']] },
] as const

const icon = (p: SVGProps<SVGSVGElement>) => ({ width: 17, height: 17, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.4, 'aria-hidden': true, ...p })

const socials = [
  {
    label: 'Instagram',
    svg: (
      <svg {...icon({})}>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: 'Facebook',
    svg: (
      <svg {...icon({})}>
        <path d="M15 3h-2.5A3.5 3.5 0 0 0 9 6.5V10H6.5v3.5H9V21h3.5v-7.5H15l.5-3.5h-3V7a1 1 0 0 1 1-1H15z" />
      </svg>
    ),
  },
  {
    label: 'YouTube',
    svg: (
      <svg {...icon({})}>
        <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
        <path d="M10.5 9.5l4 2.5-4 2.5z" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    svg: (
      <svg {...icon({})}>
        <rect x="3" y="3" width="18" height="18" rx="2.5" />
        <path d="M8 10.5V17M8 7.5v.01M12 17v-3.8a2.2 2.2 0 0 1 4.4 0V17M12 10.5V17" />
      </svg>
    ),
  },
]

export function Footer() {
  const [email, setEmail] = useState('')
  const [joined, setJoined] = useState(false)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!/^\S+@\S+\.\S+$/.test(email)) return
    setJoined(true)
  }

  return (
    <footer id="footer" className="border-t border-ivory/[0.07] bg-void pt-20 pb-10 text-ivory/70">
      <div className="frame">
        <div className="grid gap-14 lg:grid-cols-[1.2fr_2fr_1.5fr] lg:gap-16">
          <div>
            <Logo size="lg" />
            <p className="mt-6 text-[13px] text-mist">Extraordinary Estates. Exceptional Lives.</p>
            <div className="mt-8 flex gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href="#footer"
                  aria-label={s.label}
                  className="grid h-10 w-10 place-items-center border border-ivory/10 text-ivory/70 transition-colors duration-500 hover:border-champagne hover:text-champagne"
                >
                  {s.svg}
                </a>
              ))}
            </div>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            {columns.map((c) => (
              <div key={c.title}>
                <h3 className="mb-6 text-[13px] font-medium text-ivory">{c.title}</h3>
                <ul className="space-y-1 text-[13.5px]">
                  {c.links.map(([label, href]) => (
                    <li key={label}>
                      <a href={href} className="inline-block py-2 transition-colors duration-500 hover:text-champagne">
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          <div>
            <h3 className="text-[13px] font-medium text-ivory">Join Our Private Collection</h3>
            <p className="mt-4 max-w-[320px] text-[13.5px] leading-[1.7]">Be the first to know about new estates and exclusive opportunities.</p>
            <AnimatePresence mode="wait">
              {joined ? (
                <motion.p key="done" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-6 flex items-center gap-3 text-[13.5px] text-champagne" role="status">
                  <Check className="h-4 w-4" strokeWidth={1.6} /> Thank you — you’re on the list.
                </motion.p>
              ) : (
                <motion.form key="form" exit={{ opacity: 0 }} onSubmit={submit} className="mt-6 flex border border-ivory/15 focus-within:border-champagne">
                  <label htmlFor="footer-email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="footer-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    className="min-w-0 flex-1 bg-transparent px-4 py-3.5 text-[13.5px] text-ivory placeholder:text-ivory/35 focus:outline-none"
                  />
                  <button type="submit" aria-label="Subscribe" className="grid w-14 place-items-center bg-champagne text-ink transition-colors hover:bg-champagne-light">
                    <ArrowRight className="h-4 w-4" strokeWidth={1.6} />
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-20 flex flex-col gap-4 border-t border-ivory/[0.07] pt-8 text-[12px] sm:flex-row sm:items-center sm:justify-between">
          <p className="text-ivory/45">© 2026 Horizon Estates. All rights reserved.</p>
          <p className="font-serif text-[15px] text-ivory/60 italic">Live Beyond Ordinary.</p>
        </div>
      </div>
    </footer>
  )
}
