import { createContext, useContext } from 'react'

export type Overlay =
  | { kind: 'search' }
  | { kind: 'inquiry'; subject?: string }
  | { kind: 'film' }
  | { kind: 'gallery'; index: number }
  | null

export type UI = {
  overlay: Overlay
  open: (o: Exclude<Overlay, null>) => void
  close: () => void
  introDone: boolean
}

export const UIContext = createContext<UI | null>(null)

export function useUI(): UI {
  const ctx = useContext(UIContext)
  if (!ctx) throw new Error('useUI must be used inside UIContext')
  return ctx
}

export const EASE = [0.22, 1, 0.36, 1] as const
export const EASE_MASK = [0.76, 0, 0.24, 1] as const

/** Smoothly scroll to a section id. */
export function goTo(id: string) {
  document.getElementById(id.replace('#', ''))?.scrollIntoView({ behavior: 'smooth' })
}
