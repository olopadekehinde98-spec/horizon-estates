type Props = { className?: string; size?: 'sm' | 'lg' }

export function LogoMark({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden>
      <path d="M6 27V13.5a10 10 0 0 1 20 0V27" />
      <path d="M11 27V15a5 5 0 0 1 10 0v12" />
      <path d="M16 27V9.5" />
      <path d="M3.5 27h25" />
    </svg>
  )
}

export function Logo({ className = '', size = 'sm' }: Props) {
  const big = size === 'lg'
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <LogoMark className={`${big ? 'h-12 w-12' : 'h-8 w-8'} text-champagne`} />
      <span className="flex flex-col leading-none">
        <span className={`font-serif ${big ? 'text-[2rem]' : 'text-[1.28rem]'} font-medium tracking-[0.2em] text-ivory`}>HORIZON</span>
        <span className={`${big ? 'mt-1.5 text-[10px]' : 'mt-1 text-[9px]'} self-center font-sans tracking-[0.62em] text-mist`}>ESTATES</span>
      </span>
    </span>
  )
}
