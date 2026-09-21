'use client'

import { Suspense, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2, Lock } from 'lucide-react'
import { TurnstileWidget, turnstileActivClient, type TurnstileHandle } from '@/components/TurnstileWidget'

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<LoginShell />}>
      <LoginForm />
    </Suspense>
  )
}

function LoginShell({ children }: { children?: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#231f20] flex items-center justify-center px-5">
      <div className="w-full max-w-sm bg-white rounded-2xl p-8 flex flex-col gap-5 shadow-2xl">
        <div className="flex flex-col items-center gap-3 mb-2">
          <div className="w-14 h-14 rounded-full bg-[#f8ef21] flex items-center justify-center">
            <Lock size={22} className="text-[#231f20]" />
          </div>
          <h1
            className="text-[#231f20] text-2xl font-extrabold"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Admin Quasar
          </h1>
          <p className="text-[#6b6b6b] text-sm text-center">
            Editare program și prețuri
          </p>
        </div>
        {children}
      </div>
    </div>
  )
}

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') || '/admin'

  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const turnstileRef = useRef<TurnstileHandle>(null)
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const [turnstileEroare, setTurnstileEroare] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, turnstile_token: turnstileToken }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(
          data?.error === 'turnstile'
            ? 'Verificarea anti-robot a expirat. Încearcă din nou.'
            : data?.error === 'turnstile_indisponibil'
              ? 'Verificarea anti-robot nu răspunde acum. Încearcă peste un minut.'
              : 'Parolă incorectă.',
        )
        // Tokenul e de unică folosință: fără unul nou, a doua încercare ar fi respinsă.
        turnstileRef.current?.reset()
        setLoading(false)
        return
      }
      router.replace(next)
    } catch {
      setError('Eroare de rețea.')
      turnstileRef.current?.reset()
      setLoading(false)
    }
  }

  return (
    <LoginShell>
      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="password"
            className="text-xs font-bold text-[#231f20] uppercase tracking-wider"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Parolă
          </label>
          <input
            id="password"
            type="password"
            autoFocus
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-[#e5e5e5] rounded-xl px-4 py-3 text-sm text-[#231f20] focus:outline-none focus:border-[#231f20] focus:ring-1 focus:ring-[#231f20] transition-all"
          />
        </div>

        <TurnstileWidget
          ref={turnstileRef}
          onToken={setTurnstileToken}
          onError={() => setTurnstileEroare(true)}
        />
        {turnstileEroare && !turnstileToken && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            Nu am putut încărca verificarea anti-robot. Reîncarcă pagina.
          </div>
        )}

        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !password || (turnstileActivClient && !turnstileToken)}
          className="w-full bg-[#231f20] text-white font-bold text-sm py-3 rounded-xl hover:bg-[#3a3637] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : null}
          Intră
        </button>
      </form>
    </LoginShell>
  )
}
