'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const navLinks = [
  { href: '#cursuri', label: 'Cursuri', num: '01' },
  { href: '#instructori', label: 'Instructori', num: '02' },
  { href: '#program', label: 'Program & Prețuri', num: '03' },
  { href: '#locatii', label: 'Locații', num: '04' },
  { href: '#contact', label: 'Contact', num: '05' },
]

export default function Navbar() {
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
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-white/80 hover:text-[#f8ef21] text-sm font-medium transition-colors duration-200"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="#quiz"
              className="text-sm font-semibold text-white/70 hover:text-[#f8ef21] transition-colors duration-200"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Găsește cursul tău
            </Link>
            <Link
              href="#inscriere"
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
        className="md:hidden fixed inset-0 z-[55] pointer-events-none"
        aria-hidden={!open}
      >
        {/* Dark backdrop */}
        <div
          className="absolute inset-0 bg-[#231f20] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            clipPath: open
              ? 'circle(200% at calc(100% - 36px) 36px)'
              : 'circle(0% at calc(100% - 36px) 36px)',
          }}
        />

        {/* Background photo — subtle, dark-tinted */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10 transition-opacity duration-700"
          style={{
            backgroundImage: "url('/images/quasar-team.jpg')",
            opacity: open ? 0.1 : 0,
          }}
        />

        {/* Nav content */}
        <div
          className="absolute inset-0 flex flex-col justify-between px-7 pt-28 pb-10 pointer-events-auto"
          style={{
            opacity: open ? 1 : 0,
            transition: 'opacity 0.3s ease 0.2s',
          }}
        >
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
                  className="group flex items-baseline gap-4 py-4 border-b border-white/10 hover:border-[#f8ef21]/40 transition-colors duration-200"
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
            <Link
              href="#quiz"
              className="block text-center border border-white/20 text-white text-sm font-bold py-3.5 rounded-full hover:border-[#f8ef21] hover:text-[#f8ef21] transition-colors duration-200"
              style={{ fontFamily: 'var(--font-display)' }}
              onClick={() => setOpen(false)}
            >
              Găsește cursul tău
            </Link>
            <Link
              href="#inscriere"
              className="block text-center bg-[#f8ef21] text-[#231f20] text-sm font-black py-3.5 rounded-full hover:bg-white transition-colors duration-200"
              style={{ fontFamily: 'var(--font-display)' }}
              onClick={() => setOpen(false)}
            >
              Înscrie-te acum
            </Link>
          </div>
        </div>
      </div>
      )}
    </>
  )
}
