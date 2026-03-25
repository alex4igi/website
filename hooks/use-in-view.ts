'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Returns a [ref, inView] tuple.
 * Once the element enters the viewport the observer disconnects and
 * inView stays true (fire-once, no flicker on scroll-back).
 *
 * React 19 compat: useRef<T | null>(null) returns RefObject<T | null>
 * which is assignable as a JSX ref prop.
 */
export function useInView<T extends Element>(
  options: IntersectionObserverInit = { threshold: 0.12, rootMargin: '0px 0px -50px 0px' }
): [React.RefObject<T | null>, boolean] {
  const ref = useRef<T | null>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true)
        obs.disconnect()
      }
    }, options)
    obs.observe(el)
    return () => obs.disconnect()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return [ref, inView]
}
