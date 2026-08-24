'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronDown, Sparkles, UserRound } from 'lucide-react'
import { MEMBER_PORTAL_URL, MEMBER_PORTAL_LABEL } from '@/lib/portal'
import { PROMO_COPY, promoHref, trackPromo, useCampaignPromo } from '@/lib/campaign-promo'

type NavChild = { href: string; label: string }
type NavLink = { href: string; label: string; num: string; children?: NavChild[] }

const courseLinks: NavChild[] = [
  { href: '/cursuri/street-dance', label: 'Street Dance' },
  { href: '/cursuri/kpop-dance', label: 'KPOP Dance' },
  { href: '/cursuri/gimnastica', label: 'Gimnastică acrobatică' },
  { href: '/cursuri/zumba', label: 'Zumba (Adulți)' },
]

const navLinks: NavLink[] = [
  { href: '/#cursuri', label: 'Cursuri', num: '01', children: courseLinks },
  { href: '/despre-noi', label: 'Despre noi', num: '02' },
  { href: '/program-si-preturi', label: 'Prețuri & Calendar', num: '03' },
  { href: '/orar', label: 'Orar', num: '04' },
  { href: '/contact', label: 'Contact', num: '05' },
]

export default function Navbar() {
  // Linkul campaniei apare doar în fereastra din lib/campaign-promo.ts; în rest meniul
  // rămâne exact cum e, fără link mort către o campanie încheiată.
  const promo = useCampaignPromo()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const onScroll = () => setScrolled(window.scrollY > 48)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-[#231f20]/95 backdrop-blur-md shadow-xl py-3'
            : 'bg-transparent py-4'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-5 md:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 relative z-[60]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-q-a-l-1-1-5mBGGYfcxPgI3jR7NJvjH9WHuLVG7l.png"
              alt="Quasar Dance"
              width={160}
              height={52}
              className="h-10 w-auto object-contain"
              fetchPriority="high"
            />
          </Link>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-8">
            {navLinks.map((link) =>
              link.children ? (
                <li key={link.label} className="relative group">
                  <Link
                    href={link.href}
                    className="inline-flex items-center gap-1 text-white/80 hover:text-[#f8ef21] text-sm font-medium transition-colors duration-200 group-focus-within:text-[#f8ef21]"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {link.label}
                    <ChevronDown
                      size={14}
                      className="transition-transform duration-200 group-hover:rotate-180"
                    />
                  </Link>
                  {/* Dropdown */}
                  <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 opacity-0 invisible translate-y-1 transition-all duration-200 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:visible group-focus-within:translate-y-0">
                    <div className="bg-[#231f20] rounded-2xl p-2 min-w-[220px] shadow-2xl border border-white/10">
                      {link.children.map((c) => (
                        <Link
                          key={c.href + c.label}
                          href={c.href}
                          className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-white/80 hover:text-[#f8ef21] hover:bg-white/5 transition-colors duration-200"
                          style={{ fontFamily: 'var(--font-display)' }}
                        >
                          {c.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </li>
              ) : (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/80 hover:text-[#f8ef21] text-sm font-medium transition-colors duration-200"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {link.label}
                  </Link>
                </li>
              ),
            )}
          </ul>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            {promo && (
              <>
                <Link
                  href={promoHref('meniu')}
                  onClick={() => trackPromo('btds_promo_click', 'meniu')}
                  className="hidden lg:inline-flex items-center gap-1.5 rounded-full border border-[#f8ef21]/40 bg-[#f8ef21]/10 px-3.5 py-1.5 text-sm font-bold text-[#f8ef21] transition-colors hover:bg-[#f8ef21] hover:text-[#231f20]"
                  style={{ fontFamily: 'var(--font-display)' }}
                  title={`${PROMO_COPY.title} · ${PROMO_COPY.eyebrow}`}
                >
                  <Sparkles size={14} aria-hidden="true" />
                  {PROMO_COPY.navLabel}
                </Link>
                <span className="hidden lg:inline h-4 w-px bg-white/15" aria-hidden="true" />
              </>
            )}
            {/* Portalul de membri: alt public decât restul meniului (membri actuali, nu
                vizitatori noi), de aceea stă discret, lângă CTA, nu între linkurile 01–05.
                Sub `lg` rămâne doar iconița — la 768px bara e deja plină. */}
            <a
              href={MEMBER_PORTAL_URL}
              className="flex items-center gap-1.5 text-sm font-semibold text-white/60 hover:text-[#f8ef21] transition-colors duration-200"
              style={{ fontFamily: 'var(--font-display)' }}
              title={MEMBER_PORTAL_LABEL}
            >
              <UserRound size={16} aria-hidden="true" />
              <span className="hidden lg:inline">{MEMBER_PORTAL_LABEL}</span>
              <span className="lg:hidden sr-only">{MEMBER_PORTAL_LABEL}</span>
            </a>
            {/* Separator: dincolo de el sunt CTA-urile pentru vizitatori noi. Fără el,
                „Contul meu” și „Găsește cursul tău” se citesc ca o pereche. */}
            <span className="h-4 w-px bg-white/15" aria-hidden="true" />
            <Link
              href="/quiz"
              className="text-sm font-semibold text-white/70 hover:text-[#f8ef21] transition-colors duration-200"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Găsește cursul tău
            </Link>
            <Link
              href="/#inscriere"
              className="bg-[#f8ef21] text-[#231f20] text-sm font-bold px-5 py-2 rounded-full hover:bg-white transition-colors duration-200"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Înscrie-te
            </Link>
          </div>

          {/* Animated hamburger button */}
          <button
            className="md:hidden relative z-[60] flex flex-col justify-center items-center w-10 h-10 gap-0 -mr-1"
            onClick={() => setOpen(!open)}
            aria-label={open ? 'Închide meniu' : 'Deschide meniu'}
            aria-expanded={open}
          >
            <span
              className="block h-[2px] bg-[#f8ef21] rounded-full origin-center transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{
                width: open ? '24px' : '24px',
                transform: open ? 'translateY(7px) rotate(45deg)' : 'translateY(-5px)',
              }}
            />
            <span
              className="block h-[2px] bg-white rounded-full transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{
                width: open ? '0px' : '18px',
                marginLeft: open ? '0' : '-3px',
                opacity: open ? 0 : 1,
              }}
            />
            <span
              className="block h-[2px] bg-[#f8ef21] rounded-full origin-center transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{
                width: open ? '24px' : '14px',
                marginLeft: open ? '0' : '-5px',
                transform: open ? 'translateY(-5px) rotate(-45deg)' : 'translateY(5px)',
              }}
            />
          </button>
        </nav>
      </header>

      {/* Full-screen mobile overlay — only rendered client-side to avoid
          triggering router actions before Next.js initialisation */}
      {mounted && (
      <div
        className="fixed inset-0 z-[55]"
        style={{ pointerEvents: open ? 'auto' : 'none' }}
        aria-hidden={!open}
      >
        {/* Dark backdrop — expands via clip-path circle from hamburger corner */}
        <div
          className="absolute inset-0 bg-[#231f20]"
          style={{
            clipPath: open
              ? 'circle(200% at calc(100% - 44px) 44px)'
              : 'circle(0% at calc(100% - 44px) 44px)',
            transition: 'clip-path 0.55s cubic-bezier(0.22,1,0.36,1)',
          }}
        />

        {/* Background photo — subtle tint */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/images/quasar-team.jpg')",
            opacity: open ? 0.08 : 0,
            transition: 'opacity 0.5s ease 0.2s',
          }}
        />

        {/* Nav content */}
        <div
          className="absolute inset-0 flex flex-col justify-between px-7 pt-28 pb-10"
          style={{
            opacity: open ? 1 : 0,
            transition: 'opacity 0.3s ease 0.2s',
          }}
        >
          {/* Close button */}
          <button
            className="absolute top-6 right-6 z-[60] w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-[#f8ef21] transition-all duration-200 group"
            onClick={() => setOpen(false)}
            aria-label="Închide meniu"
            style={{
              opacity: open ? 1 : 0,
              transform: open ? 'scale(1)' : 'scale(0.8)',
              transition: 'opacity 0.3s ease 0.3s, transform 0.3s ease 0.3s',
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              className="text-white group-hover:text-[#231f20] transition-colors duration-200"
            >
              <path
                d="M15 5L5 15M5 5L15 15"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Nav items */}
          <ul className="flex flex-col gap-1">
            {navLinks.map((link, i) => (
              <li
                key={link.href}
                style={{
                  transform: open ? 'translateX(0)' : 'translateX(-32px)',
                  opacity: open ? 1 : 0,
                  transition: `transform 0.5s cubic-bezier(0.22,1,0.36,1) ${120 + i * 70}ms, opacity 0.4s ease ${120 + i * 70}ms`,
                }}
              >
                <Link
                  href={link.href}
                  className={`group flex items-baseline gap-4 py-4 hover:border-[#f8ef21]/40 transition-colors duration-200 ${link.children ? '' : 'border-b border-white/10'}`}
                  style={{ fontFamily: 'var(--font-display)' }}
                  onClick={() => setOpen(false)}
                >
                  <span className="text-[#f8ef21]/40 text-xs font-bold tabular-nums group-hover:text-[#f8ef21] transition-colors duration-200">
                    {link.num}
                  </span>
                  <span className="text-white text-3xl font-black leading-none group-hover:text-[#f8ef21] transition-colors duration-200">
                    {link.label}
                  </span>
                </Link>

                {/* Sub-links (Cursuri) */}
                {link.children && (
                  <div className="flex flex-col pl-9 pb-3 border-b border-white/10">
                    {link.children.map((c) => (
                      <Link
                        key={c.href + c.label}
                        href={c.href}
                        onClick={() => setOpen(false)}
                        className="text-white/55 hover:text-[#f8ef21] text-base font-semibold py-1.5 transition-colors duration-200"
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        {c.label}
                      </Link>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>

          {/* Bottom CTAs */}
          <div
            className="flex flex-col gap-3"
            style={{
              transform: open ? 'translateY(0)' : 'translateY(24px)',
              opacity: open ? 1 : 0,
              transition: `transform 0.5s cubic-bezier(0.22,1,0.36,1) 480ms, opacity 0.4s ease 480ms`,
            }}
          >
            {promo && (
              <Link
                href={promoHref('meniu')}
                className="flex items-center justify-center gap-2 text-center border border-[#f8ef21]/40 bg-[#f8ef21]/10 text-[#f8ef21] text-sm font-bold py-3.5 rounded-full hover:bg-[#f8ef21] hover:text-[#231f20] transition-colors duration-200"
                style={{ fontFamily: 'var(--font-display)' }}
                onClick={() => {
                  trackPromo('btds_promo_click', 'meniu')
                  setOpen(false)
                }}
              >
                <Sparkles size={15} aria-hidden="true" />
                {PROMO_COPY.navLabel} · {PROMO_COPY.eyebrow}
              </Link>
            )}
            <Link
              href="/quiz"
              className="block text-center border border-white/20 text-white text-sm font-bold py-3.5 rounded-full hover:border-[#f8ef21] hover:text-[#f8ef21] transition-colors duration-200"
              style={{ fontFamily: 'var(--font-display)' }}
              onClick={() => setOpen(false)}
            >
              Găsește cursul tău
            </Link>
            <Link
              href="/#inscriere"
              className="block text-center bg-[#f8ef21] text-[#231f20] text-sm font-black py-3.5 rounded-full hover:bg-white transition-colors duration-200"
              style={{ fontFamily: 'var(--font-display)' }}
              onClick={() => setOpen(false)}
            >
              Înscrie-te acum
            </Link>
            {/* Cel mai discret element din meniu: cine caută plata abonamentului îl
                găsește, dar nu concurează cu CTA-ul de înscriere. */}
            <a
              href={MEMBER_PORTAL_URL}
              className="flex items-center justify-center gap-2 text-white/45 hover:text-[#f8ef21] text-sm font-semibold py-1 transition-colors duration-200"
              style={{ fontFamily: 'var(--font-display)' }}
              onClick={() => setOpen(false)}
            >
              <UserRound size={15} aria-hidden="true" />
              {MEMBER_PORTAL_LABEL}
            </a>
          </div>
        </div>
      </div>
      )}
    </>
  )
}
