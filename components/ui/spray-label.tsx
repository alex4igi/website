'use client'

import { useRef, useEffect, useState } from 'react'

interface SprayLabelProps {
  children: React.ReactNode
  className?: string
  /** 'dark' = yellow bg + black text (default). 'light' = same — always yellow spray. */
  delay?: number
}

/**
 * SprayLabel — replaces the pill/chip label.
 * An organic SVG blob (spray-paint splat) animates in from left-to-right
 * once the element enters the viewport. The text sits on top.
 */
export default function SprayLabel({ children, className = '', delay = 0 }: SprayLabelProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') { setInView(true); return }
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect() } },
      { threshold: 0.6 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <span
      ref={ref}
      className={`relative inline-flex items-center ${className}`}
      style={{ fontFamily: 'var(--font-display)' }}
    >
      {/* SVG spray-paint blob — absolutely positioned behind the text */}
      <span
        aria-hidden="true"
        className="absolute inset-0 -mx-2 -my-1 overflow-visible pointer-events-none"
        style={{
          transform: inView ? 'scaleX(1)' : 'scaleX(0)',
          transformOrigin: 'left center',
          transition: `transform 0.55s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 200 46"
          preserveAspectRatio="none"
          className="w-full h-full"
          aria-hidden="true"
        >
          {/* Organic blob path — looks hand-sprayed/marker-brushed */}
          <path
            d="M6,10 C2,4 10,1 22,2 L60,0 C80,-1 100,1 120,0 L155,1 C170,0 185,2 196,6 C200,8 200,14 198,20 C196,26 200,32 196,38 C192,44 180,46 160,45 L120,46 C100,47 80,45 60,46 L20,45 C10,46 2,43 2,36 C0,30 4,22 6,10 Z"
            fill="#f8ef21"
          />
          {/* Spray splatter dots — scattered around the edges */}
          <circle cx="8"   cy="5"  r="2.5" fill="#f8ef21" opacity="0.7" />
          <circle cx="15"  cy="2"  r="1.5" fill="#f8ef21" opacity="0.5" />
          <circle cx="190" cy="8"  r="2"   fill="#f8ef21" opacity="0.6" />
          <circle cx="195" cy="15" r="1.5" fill="#f8ef21" opacity="0.45" />
          <circle cx="188" cy="41" r="2"   fill="#f8ef21" opacity="0.55" />
          <circle cx="3"   cy="32" r="1.5" fill="#f8ef21" opacity="0.4" />
          <circle cx="100" cy="47" r="1.5" fill="#f8ef21" opacity="0.35" />
        </svg>
      </span>

      {/* Text on top */}
      <span
        className="relative z-10 text-[#231f20] text-[0.68rem] font-black uppercase tracking-[0.16em] px-2 py-0.5 whitespace-nowrap"
      >
        {children}
      </span>
    </span>
  )
}
