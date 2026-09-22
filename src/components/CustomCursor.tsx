import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useImmersive } from '../hooks/useMediaQuery'

type Mode = 'default' | 'link' | 'view' | 'explore'

/** Small ring that follows the pointer and expands into VIEW / EXPLORE over imagery. Desktop only. */
export function CustomCursor() {
  const immersive = useImmersive()
  const [mode, setMode] = useState<Mode>('default')
  const [visible, setVisible] = useState(false)
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.5 })
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.5 })

  useEffect(() => {
    if (!immersive) return
    const root = document.documentElement
    root.classList.add('has-custom-cursor')

    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      x.set(e.clientX)
      y.set(e.clientY)
      setVisible(true)
      const t = e.target as Element | null
      const tagged = t?.closest<HTMLElement>('[data-cursor]')
      if (tagged) setMode((tagged.dataset.cursor as Mode) || 'view')
      else if (t?.closest('a, button, input, textarea, select, [role="button"]')) setMode('link')
      else setMode('default')
    }
    const leave = () => setVisible(false)
    window.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerleave', leave)
    return () => {
      root.classList.remove('has-custom-cursor')
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerleave', leave)
    }
  }, [immersive, x, y])

  if (!immersive) return null

  const label = mode === 'view' ? 'View' : mode === 'explore' ? 'Explore' : ''
  const size = label ? 92 : mode === 'link' ? 44 : 14
  const ring = label ? 'rgba(200,169,106,0)' : mode === 'link' ? 'rgba(200,169,106,0.9)' : 'rgba(242,237,228,0.8)'

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[200] flex items-center justify-center rounded-full border"
        style={{ x: sx, y: sy, translateX: '-50%', translateY: '-50%' }}
        animate={{
          width: size,
          height: size,
          opacity: visible ? 1 : 0,
          backgroundColor: label ? 'rgba(200,169,106,0.94)' : 'rgba(200,169,106,0)',
          borderColor: ring,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      >
        <AnimatePresence>
          {label && (
            <motion.span
              key={label}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.25 }}
              className="text-[10px] font-semibold tracking-[0.3em] text-ink uppercase"
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
      {/* Precise centre dot, un-sprung so it never lags. */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[201] h-1 w-1 rounded-full bg-champagne"
        style={{ x, y, translateX: '-50%', translateY: '-50%' }}
        animate={{ opacity: visible && !label ? 1 : 0 }}
      />
    </>
  )
}
