'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { href: '#cursuri', label: 'Cursuri' },
  { href: '#instructori', label: 'Instructori' },
  { href: '#program', label: 'Program & Prețuri' },
  { href: '#locatii', label: 'Locații' },
  { href: '#contact', label: 'Contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#231f20]/95 backdrop-blur-md shadow-xl py-3'
          : 'bg-transparent py-4'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-5 md:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
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

        {/* Mobile burger */}
        <button
          className="md:hidden text-white p-2 -mr-2"
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Închide meniu' : 'Deschide meniu'}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile drawer */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          open ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        } bg-[#231f20]/97 backdrop-blur-md`}
      >
        <ul className="flex flex-col px-5 py-4 gap-1">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="block py-3 text-white/80 hover:text-[#f8ef21] text-base font-medium border-b border-white/10 transition-colors"
                style={{ fontFamily: 'var(--font-display)' }}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li className="pt-4 flex flex-col gap-3">
            <Link
              href="#quiz"
              className="block text-center border border-white/20 text-white text-sm font-semibold py-3 rounded-full hover:border-[#f8ef21] hover:text-[#f8ef21] transition-colors"
              style={{ fontFamily: 'var(--font-display)' }}
              onClick={() => setOpen(false)}
            >
              Găsește cursul tău
            </Link>
            <Link
              href="#inscriere"
              className="block text-center bg-[#f8ef21] text-[#231f20] text-sm font-bold py-3 rounded-full hover:bg-white transition-colors"
              style={{ fontFamily: 'var(--font-display)' }}
              onClick={() => setOpen(false)}
            >
              Înscrie-te
            </Link>
          </li>
        </ul>
      </div>
    </header>
  )
}
