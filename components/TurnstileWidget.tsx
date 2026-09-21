'use client'

// Widgetul Cloudflare Turnstile. Fără cheia publică nu randează nimic — așa se
// livrează adormit și se activează doar punând cele două chei în Vercel.
// Modul `interaction-only`: invizibil pentru aproape toți vizitatorii; apare o casetă
// doar când Cloudflare vrea o confirmare în plus.
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'

export const turnstileActivClient = Boolean(SITE_KEY)

type Turnstile = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string
  reset: (id: string) => void
  remove: (id: string) => void
}

declare global {
  interface Window {
    turnstile?: Turnstile
  }
}

let scriptPromise: Promise<void> | null = null
function incarcaScript(): Promise<void> {
  if (window.turnstile) return Promise.resolve()
  if (scriptPromise) return scriptPromise
  scriptPromise = new Promise<void>((resolve, reject) => {
    const s = document.createElement('script')
    s.src = SCRIPT_SRC
    s.async = true
    s.onload = () => resolve()
    s.onerror = () => {
      scriptPromise = null // permite o reîncercare la următoarea montare
      reject(new Error('turnstile script'))
    }
    document.head.appendChild(s)
  })
  return scriptPromise
}

export type TurnstileHandle = {
  /** Tokenul e de unică folosință: după ORICE trimitere, widgetul cere unul nou. */
  reset: () => void
}

type Props = {
  onToken: (token: string | null) => void
  /** Scriptul n-a putut fi încărcat sau widgetul a eșuat definitiv. */
  onError?: () => void
}

export const TurnstileWidget = forwardRef<TurnstileHandle, Props>(function TurnstileWidget(
  { onToken, onError },
  ref,
) {
  const el = useRef<HTMLDivElement>(null)
  const widgetId = useRef<string | null>(null)
  // Callback-urile prin ref: altfel orice re-randare a formularului ar reconstrui widgetul.
  const onTokenRef = useRef(onToken)
  const onErrorRef = useRef(onError)
  onTokenRef.current = onToken
  onErrorRef.current = onError

  useImperativeHandle(ref, () => ({
    reset: () => {
      onTokenRef.current(null)
      if (widgetId.current && window.turnstile) window.turnstile.reset(widgetId.current)
    },
  }))

  useEffect(() => {
    if (!SITE_KEY) return
    let demontat = false
    incarcaScript()
      .then(() => {
        if (demontat || !el.current || !window.turnstile) return
        widgetId.current = window.turnstile.render(el.current, {
          sitekey: SITE_KEY,
          appearance: 'interaction-only',
          language: 'ro',
          callback: (t: string) => onTokenRef.current(t),
          'expired-callback': () => onTokenRef.current(null),
          'error-callback': () => {
            onTokenRef.current(null)
            onErrorRef.current?.()
          },
        })
      })
      .catch(() => {
        if (!demontat) onErrorRef.current?.()
      })
    return () => {
      demontat = true
      if (widgetId.current && window.turnstile) window.turnstile.remove(widgetId.current)
      widgetId.current = null
    }
  }, [])

  if (!SITE_KEY) return null
  return <div ref={el} className="flex justify-center" />
})
