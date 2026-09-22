import { useEffect, useRef, useState, type ImgHTMLAttributes } from 'react'
import type { Photo } from '../data/content'
import { img, lqip, srcSet } from '../lib/image'

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'> & {
  photo: Photo
  /** Widths offered in srcset. */
  widths?: number[]
  /** height/width ratio for cropping, optional. */
  ratio?: number
  priority?: boolean
  decorative?: boolean
  /** Skip the blurred preview (for tiny thumbnails). */
  noPreview?: boolean
}

/**
 * Responsive, lazy Unsplash image. A blurred ~3 KB preview paints first; the full
 * photograph fades in over it once decoded, so no section ever reads as an empty black box.
 */
export function Img({
  photo,
  widths = [640, 1024, 1440, 1920],
  ratio,
  priority,
  decorative,
  noPreview,
  sizes = '100vw',
  className = '',
  style,
  ...rest
}: Props) {
  const ref = useRef<HTMLImageElement>(null)
  const [loaded, setLoaded] = useState(false)
  const mid = widths[Math.min(2, widths.length - 1)]

  // Cached images can finish before React attaches onLoad.
  useEffect(() => {
    if (ref.current?.complete && ref.current.naturalWidth) setLoaded(true)
  }, [photo.id])

  const preview = noPreview ? undefined : `url("${lqip(photo.id, ratio)}")`

  return (
    <span className="relative block h-full w-full overflow-hidden" style={preview ? { backgroundImage: preview, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}>
      <img
        ref={ref}
        src={img(photo.id, mid, ratio ? Math.round(mid * ratio) : undefined)}
        srcSet={srcSet(photo.id, widths, ratio)}
        sizes={sizes}
        alt={decorative ? '' : photo.alt}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : undefined}
        decoding="async"
        draggable={false}
        onLoad={() => setLoaded(true)}
        className={`h-full w-full object-cover transition-opacity duration-[900ms] ease-out ${loaded || noPreview ? 'opacity-100' : 'opacity-0'} ${className}`}
        style={style}
        {...rest}
      />
    </span>
  )
}
