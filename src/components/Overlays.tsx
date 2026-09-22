import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Check, ChevronLeft, ChevronRight, Search, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { destinations, estates, film, interiorGallery, privateCollection } from '../data/content'
import { img } from '../lib/image'
import { EASE, EASE_MASK, goTo, useUI } from '../lib/ui'
import { Img } from './Img'

/** Body scroll lock + Escape-to-close + focus restore for any overlay. */
function useModal(onClose: () => void) {
  useEffect(() => {
    const prevFocus = document.activeElement as HTMLElement | null
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
      prevFocus?.focus?.({ preventScroll: true })
    }
  }, [onClose])
}

function CloseButton({ onClick, className = '' }: { onClick: () => void; className?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Close"
      autoFocus
      className={`grid h-12 w-12 place-items-center rounded-full border border-ivory/25 text-ivory transition-colors duration-500 hover:border-champagne hover:text-champagne ${className}`}
    >
      <X className="h-5 w-5" strokeWidth={1.3} />
    </button>
  )
}

/* ------------------------------------------------------------------ Search */

type Result = { title: string; meta: string; target: string }

function SearchOverlay({ onClose }: { onClose: () => void }) {
  useModal(onClose)
  const [q, setQ] = useState('')
  const all: Result[] = useMemo(
    () => [
      ...estates.map((e) => ({ title: `${e.name}`, meta: `${e.place}, ${e.country} · ${e.style}`, target: 'estates' })),
      ...destinations.map((d) => ({ title: d.city, meta: `${d.country} · ${d.estates} estates`, target: 'locations' })),
      ...privateCollection.map((p) => ({ title: p.name, meta: `${p.place} · Private collection`, target: 'locations' })),
    ],
    [],
  )
  const results = q.trim() ? all.filter((r) => `${r.title} ${r.meta}`.toLowerCase().includes(q.trim().toLowerCase())) : all.slice(0, 7)

  const pick = (r: Result) => {
    onClose()
    window.setTimeout(() => goTo(r.target), 350)
  }

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Search estates"
      className="fixed inset-0 z-[120] overflow-y-auto bg-void/95 backdrop-blur-xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="frame py-6">
        <div className="flex justify-end">
          <CloseButton onClick={onClose} />
        </div>
        <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.9, delay: 0.1, ease: EASE }} className="mx-auto mt-[8vh] max-w-[900px]">
          <p className="label mb-6">Search the collection</p>
          <form
            role="search"
            onSubmit={(e: FormEvent) => {
              e.preventDefault()
              if (results[0]) pick(results[0])
            }}
            className="flex items-center gap-5 border-b border-ivory/25 pb-4 focus-within:border-champagne"
          >
            <Search className="h-7 w-7 shrink-0 text-champagne" strokeWidth={1} />
            <label htmlFor="search-q" className="sr-only">
              Destination, estate or style
            </label>
            <input
              id="search-q"
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Destination, estate or style…"
              autoComplete="off"
              className="w-full bg-transparent font-serif text-[clamp(2rem,5vw,3.6rem)] font-light text-ivory placeholder:text-ivory/25 focus:outline-none"
            />
          </form>
          <ul className="mt-10 divide-y divide-ivory/10">
            {results.map((r, i) => (
              <motion.li key={r.title + r.meta} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.03 }}>
                <button type="button" onClick={() => pick(r)} className="group flex w-full items-center justify-between gap-6 py-5 text-left">
                  <span>
                    <span className="block font-serif text-[1.7rem] leading-tight text-ivory transition-colors group-hover:text-champagne">{r.title}</span>
                    <span className="mt-1 block text-[11px] tracking-[0.2em] text-mist uppercase">{r.meta}</span>
                  </span>
                  <ArrowRight className="h-5 w-5 -translate-x-2 text-champagne opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100" strokeWidth={1.3} />
                </button>
              </motion.li>
            ))}
            {!results.length && <li className="py-8 text-[14px] text-mist">No estates match “{q}”. Our advisors can search the unlisted collection for you.</li>}
          </ul>
        </motion.div>
      </div>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ Inquiry */

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[10.5px] tracking-[0.24em] text-mist uppercase">{label}</span>
      {children}
    </label>
  )
}

const input = 'w-full border-b border-ivory/20 bg-transparent pb-3 text-[15px] text-ivory placeholder:text-ivory/30 focus:border-champagne focus:outline-none'

function InquiryPanel({ subject, onClose }: { subject?: string; onClose: () => void }) {
  useModal(onClose)
  const [sent, setSent] = useState(false)

  return (
    <motion.div className="fixed inset-0 z-[120]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
      <button type="button" aria-label="Close inquiry" onClick={onClose} className="absolute inset-0 bg-void/70 backdrop-blur-sm" tabIndex={-1} />
      <motion.aside
        role="dialog"
        aria-modal="true"
        aria-label="Inquire"
        className="absolute inset-y-0 right-0 flex w-full max-w-[560px] flex-col overflow-y-auto bg-charcoal px-6 py-6 sm:px-12"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ duration: 0.9, ease: EASE_MASK }}
      >
        <div className="flex items-center justify-between">
          <p className="label">Private inquiry</p>
          <CloseButton onClick={onClose} />
        </div>
        <AnimatePresence mode="wait">
          {sent ? (
            <motion.div key="sent" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="my-auto py-16" role="status">
              <span className="grid h-14 w-14 place-items-center rounded-full border border-champagne text-champagne">
                <Check className="h-6 w-6" strokeWidth={1.3} />
              </span>
              <h2 className="display mt-8 text-[3.2rem]">Thank you.</h2>
              <p className="mt-5 max-w-[380px] text-[15px] leading-[1.8] text-ivory/70">
                A private client advisor will contact you within one business day. Every inquiry is handled in strict confidence.
              </p>
              <button type="button" onClick={onClose} className="btn-line mt-10">
                Continue exploring
              </button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              exit={{ opacity: 0 }}
              onSubmit={(e) => {
                e.preventDefault()
                setSent(true)
              }}
              className="mt-10 space-y-8 pb-6"
            >
              <div>
                <h2 className="display text-[clamp(2.6rem,6vw,3.6rem)]">Begin a conversation</h2>
                <p className="mt-4 text-[14px] leading-[1.7] text-ivory/60">Share a little about what you are looking for. Viewings are arranged privately, by appointment only.</p>
              </div>
              <div className="grid gap-8 sm:grid-cols-2">
                <Field label="Full name">
                  <input required name="name" autoComplete="name" className={input} placeholder="Your name" />
                </Field>
                <Field label="Email">
                  <input required type="email" name="email" autoComplete="email" className={input} placeholder="you@domain.com" />
                </Field>
              </div>
              <Field label="Interest">
                <input name="subject" defaultValue={subject ?? ''} className={input} placeholder="Estate, destination or experience" />
              </Field>
              <Field label="Budget">
                <select name="budget" defaultValue="" className={`${input} appearance-none`}>
                  <option value="" disabled className="bg-charcoal">
                    Select a range
                  </option>
                  {['$3M – $5M', '$5M – $10M', '$10M – $25M', '$25M +'].map((b) => (
                    <option key={b} className="bg-charcoal">
                      {b}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Message">
                <textarea name="message" rows={3} className={`${input} resize-none`} placeholder="Timing, requirements, questions…" />
              </Field>
              <button type="submit" className="btn-gold group w-full justify-center py-4">
                Send inquiry
                <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" strokeWidth={1.6} />
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.aside>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ Film */

const SHOT = 4200

/** "The film": a slow Ken Burns sequence through the collection. */
function FilmModal({ onClose }: { onClose: () => void }) {
  useModal(onClose)
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused) return
    const t = window.setTimeout(() => setI((v) => (v + 1) % film.length), SHOT)
    return () => window.clearTimeout(t)
  }, [i, paused])

  const shot = film[i]
  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Horizon Estates film"
      className="fixed inset-0 z-[120] bg-void"
      initial={{ clipPath: 'inset(50% 0% 50% 0%)' }}
      animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      exit={{ clipPath: 'inset(50% 0% 50% 0%)' }}
      transition={{ duration: 1, ease: EASE_MASK }}
      onClick={() => setPaused((p) => !p)}
    >
      <AnimatePresence initial={false}>
        <motion.div key={i} className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.4 }}>
          <motion.div
            className="h-full w-full"
            initial={{ scale: 1.16, x: i % 2 ? '-2%' : '2%' }}
            animate={{ scale: 1.02, x: '0%' }}
            transition={{ duration: SHOT / 1000 + 1.4, ease: 'linear' }}
          >
            <Img photo={shot.photo} widths={[1024, 1440, 1920]} />
          </motion.div>
        </motion.div>
      </AnimatePresence>
      {/* Letterbox */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[9vh] bg-void" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[9vh] bg-void" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void/70 via-transparent to-transparent" />

      <div className="absolute top-[calc(9vh+16px)] right-5 left-5 flex items-center justify-between sm:right-8 sm:left-8">
        <p className="label">Horizon Estates — The Film</p>
        <div onClick={(e) => e.stopPropagation()}>
          <CloseButton onClick={onClose} />
        </div>
      </div>
      <div className="absolute right-5 bottom-[calc(9vh+28px)] left-5 sm:right-8 sm:left-8">
        <div className="overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p key={i} initial={{ y: '110%' }} animate={{ y: 0 }} exit={{ y: '-110%' }} transition={{ duration: 0.9, ease: EASE }} className="display text-[clamp(2.4rem,6vw,5.6rem)]">
              {shot.caption}
            </motion.p>
          </AnimatePresence>
        </div>
        <div className="mt-6 flex gap-2">
          {film.map((_, k) => (
            <span key={k} className="relative h-px flex-1 overflow-hidden bg-ivory/20">
              {k < i && <span className="absolute inset-0 bg-champagne" />}
              {k === i && (
                <motion.span
                  key={`${i}-${paused}`}
                  className="absolute inset-y-0 left-0 bg-champagne"
                  initial={{ width: paused ? '50%' : '0%' }}
                  animate={{ width: paused ? '50%' : '100%' }}
                  transition={{ duration: paused ? 0 : SHOT / 1000, ease: 'linear' }}
                />
              )}
            </span>
          ))}
        </div>
        <p className="mt-3 text-[10.5px] tracking-[0.24em] text-ivory/45 uppercase">{paused ? 'Paused — click to resume' : 'Click to pause'}</p>
      </div>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ Gallery */

function GalleryLightbox({ start, onClose }: { start: number; onClose: () => void }) {
  useModal(onClose)
  const [[i, dir], set] = useState<[number, number]>([start, 1])
  const n = interiorGallery.length
  const step = (d: 1 | -1) => set(([c]) => [(c + d + n) % n, d])
  const touch = useRef<number | null>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') set(([c]) => [(c + 1) % n, 1])
      if (e.key === 'ArrowLeft') set(([c]) => [(c - 1 + n) % n, -1])
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [n])

  const photo = interiorGallery[i]
  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Interior gallery"
      className="fixed inset-0 z-[120] flex flex-col bg-void/97"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touch.current === null) return
        const dx = e.changedTouches[0].clientX - touch.current
        if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1)
        touch.current = null
      }}
    >
      <div className="frame flex items-center justify-between py-5">
        <p className="label">
          Interior gallery · {String(i + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}
        </p>
        <CloseButton onClick={onClose} />
      </div>
      <div className="relative flex min-h-0 flex-1 items-center justify-center px-5 sm:px-24" onClick={onClose}>
        <AnimatePresence initial={false} custom={dir} mode="popLayout">
          <motion.img
            key={photo.id}
            src={img(photo.id, 1800)}
            alt={photo.alt}
            custom={dir}
            onClick={(e) => e.stopPropagation()}
            className="max-h-full max-w-full object-contain"
            initial={{ opacity: 0, x: dir * 60, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: dir * -60, scale: 0.98 }}
            transition={{ duration: 0.7, ease: EASE }}
          />
        </AnimatePresence>
        <button type="button" onClick={(e) => (e.stopPropagation(), step(-1))} aria-label="Previous image" className="absolute left-6 hidden h-12 w-12 place-items-center rounded-full border border-ivory/20 hover:border-champagne hover:text-champagne sm:grid">
          <ChevronLeft className="h-5 w-5" strokeWidth={1.3} />
        </button>
        <button type="button" onClick={(e) => (e.stopPropagation(), step(1))} aria-label="Next image" className="absolute right-6 hidden h-12 w-12 place-items-center rounded-full border border-ivory/20 hover:border-champagne hover:text-champagne sm:grid">
          <ChevronRight className="h-5 w-5" strokeWidth={1.3} />
        </button>
      </div>
      <div className="no-scrollbar flex justify-start gap-2 overflow-x-auto px-5 py-5 sm:justify-center">
        {interiorGallery.map((p, k) => (
          <button
            key={p.id}
            type="button"
            onClick={() => set(([c]) => [k, k > c ? 1 : -1])}
            aria-label={`Show image ${k + 1}`}
            className={`h-14 w-20 shrink-0 overflow-hidden transition-opacity duration-500 ${k === i ? 'opacity-100 ring-1 ring-champagne' : 'opacity-40 hover:opacity-80'}`}
          >
            <Img photo={p} decorative sizes="80px" widths={[160]} noPreview />
          </button>
        ))}
      </div>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ Host */

export function Overlays() {
  const { overlay, close } = useUI()
  return (
    <AnimatePresence>
      {overlay?.kind === 'search' && <SearchOverlay key="search" onClose={close} />}
      {overlay?.kind === 'inquiry' && <InquiryPanel key="inquiry" subject={overlay.subject} onClose={close} />}
      {overlay?.kind === 'film' && <FilmModal key="film" onClose={close} />}
      {overlay?.kind === 'gallery' && <GalleryLightbox key="gallery" start={overlay.index} onClose={close} />}
    </AnimatePresence>
  )
}
