'use client'

import { OPEN_SETTINGS_EVENT } from '@/lib/consent'

// Redeschide dialogul de preferințe cookie (retragere/modificare consimțământ — cerut de GDPR).
export default function CookieSettingsLink({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_SETTINGS_EVENT))}
      className={className}
    >
      Setări cookies
    </button>
  )
}
