'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LogoutButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function onClick() {
    setLoading(true)
    await fetch('/api/admin/logout', { method: 'POST' })
    router.replace('/admin/login')
  }

  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="text-xs font-bold bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full transition-colors disabled:opacity-50"
      style={{ fontFamily: 'var(--font-display)' }}
    >
      {loading ? 'Iese...' : 'Iese'}
    </button>
  )
}
