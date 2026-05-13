import Link from 'next/link'
import LogoutButton from './_components/logout-button'

export const metadata = {
  title: 'Admin · Quasar Dance',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <header className="bg-[#231f20] text-white sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-5 md:px-8 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link
              href="/admin"
              className="text-[#f8ef21] font-extrabold text-lg"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Quasar Admin
            </Link>
            <nav className="flex items-center gap-1 text-sm">
              <Link
                href="/admin/preturi"
                className="px-3 py-1.5 rounded-full hover:bg-white/10 transition-colors"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Prețuri
              </Link>
              <Link
                href="/admin/calendar"
                className="px-3 py-1.5 rounded-full hover:bg-white/10 transition-colors"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Calendar
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="text-xs text-white/60 hover:text-white transition-colors"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Vezi site →
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-5 md:px-8 py-10">{children}</main>
    </div>
  )
}
