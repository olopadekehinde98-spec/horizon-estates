const BASE = 'https://images.unsplash.com/photo-'
const QUALITY = 50

/** Build an optimised Unsplash CDN URL for a given photo id and width. */
export function img(id: string, width: number, height?: number): string {
  const size = height ? `&h=${height}` : ''
  return `${BASE}${id}?auto=format&fit=crop&w=${width}${size}&q=${QUALITY}`
}

/** Responsive srcset across the given widths (keeps aspect via optional ratio). */
export function srcSet(id: string, widths: number[], ratio?: number): string {
  return widths.map((w) => `${img(id, w, ratio ? Math.round(w * ratio) : undefined)} ${w}w`).join(', ')
}

/** ~3 KB blurred preview shown while the full photograph streams in. */
export function lqip(id: string, ratio?: number): string {
  const h = ratio ? `&h=${Math.round(48 * ratio)}` : ''
  return `${BASE}${id}?auto=format&fit=crop&w=48${h}&q=30&blur=60`
}
