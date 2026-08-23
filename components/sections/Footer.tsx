import Link from 'next/link'
import { MapPin, Phone, Mail, Instagram, Facebook } from 'lucide-react'
import CookieSettingsLink from '@/components/CookieSettingsLink'
import { MEMBER_PORTAL_URL, MEMBER_PORTAL_LEGAL_LABEL } from '@/lib/portal'

// TikTok nu există în lucide-react — icon custom cu aceeași interfață (size).
function TiktokIcon({ size = 15 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M16.5 3c.36 2.5 1.86 4 4.5 4.2v2.9c-1.53.15-2.86-.35-4.4-1.28v5.62c0 5.7-6.22 7.5-8.72 3.42-1.6-2.62-.62-7.22 4.52-7.4v3.06c-.39.06-.81.16-1.2.29-1.17.4-1.83 1.14-1.65 2.45.35 2.5 4.94 3.24 4.56-1.65V3h2.39z" />
    </svg>
  )
}

const navCols = [
  {
    title: 'Cursuri',
    links: [
      { label: 'Street Dance', href: '/cursuri/street-dance' },
      { label: 'KPOP Dance', href: '/cursuri/kpop-dance' },
      { label: 'Gimnastică acrobatică', href: '/cursuri/gimnastica' },
      { label: 'Zumba (Adulți)', href: '/cursuri/zumba' },
    ],
  },
  {
    title: 'Companie',
    links: [
      { label: 'Despre noi', href: '/despre-noi' },
      { label: 'Echipa noastră', href: '/despre-noi#echipa' },
      { label: 'Program', href: '/program-si-preturi#program' },
      { label: 'Prețuri', href: '/program-si-preturi#preturi' },
      { label: 'Locații', href: '/#locatii' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Comunitate',
    links: [
      { label: 'Spectacole Quasar', href: '#' },
      { label: 'Concursuri', href: '#' },
      { label: 'Flashmob-uri', href: '#' },
      { label: 'Camp de vară', href: '#' },
      { label: 'Quiz curs', href: '/quiz' },
    ],
  },
]

const socials = [
  { label: 'Instagram', href: 'https://www.instagram.com/quasar_dance/', icon: Instagram },
  { label: 'Facebook', href: 'https://www.facebook.com/quasardanceIasi', icon: Facebook },
  { label: 'Facebook Quasar for Kids', href: 'https://www.facebook.com/quasarforkids', icon: Facebook },
  { label: 'TikTok', href: 'https://www.tiktok.com/@quasar.dance', icon: TiktokIcon },
]

export default function Footer() {
  return (
    <footer className="bg-[#1a1718] text-white">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand column */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <Link href="/" className="inline-block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-q-a-l-1-1-5mBGGYfcxPgI3jR7NJvjH9WHuLVG7l.png"
                alt="Quasar Dance"
                width={160}
                height={52}
                className="h-10 w-auto object-contain"
              />
            </Link>
            <p className="text-white/55 text-sm leading-relaxed max-w-xs">
              Cea mai longevivă comunitate de dans din Iași. Din 1981, formăm dansatori,
              construim cariere și conectăm generații prin mișcare.
            </p>

            {/* Contact */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2.5 text-white/55 text-sm">
                <MapPin size={14} className="flex-shrink-0" />
                <span>Ștefan cel Mare &amp; Nicolina, Iași</span>
              </div>
              <div className="flex items-center gap-2.5 text-white/55 text-sm">
                <Phone size={14} className="flex-shrink-0" />
                <a href="tel:+40730534172" className="hover:text-[#f8ef21] transition-colors">
                  0730 534 172
                </a>
              </div>
              <div className="flex items-center gap-2.5 text-white/55 text-sm">
                <Mail size={14} className="flex-shrink-0" />
                <a href="mailto:office@quasardance.ro" className="hover:text-[#f8ef21] transition-colors">
                  office@quasardance.ro
                </a>
              </div>
            </div>

            {/* Socials */}
            <div className="flex items-center gap-3">
              {socials.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-white/50 hover:border-[#f8ef21] hover:text-[#f8ef21] transition-all duration-200"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          {navCols.map((col) => (
            <div key={col.title} className="flex flex-col gap-4">
              <h4
                className="text-white text-xs font-bold uppercase tracking-widest"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {col.title}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-white/50 hover:text-white text-sm transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/8">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-5 flex flex-col gap-3">
          {/* Legal / company data */}
          <p className="text-white/30 text-[11px] leading-relaxed text-center sm:text-left">
            QUASAR DANCE STUDIO S.R.L. · CUI RO49361270 · Reg. Com. J22/15/2024 · Sediul social: Str. Vasile Lupu 96, Bl. G2, Et. 7, Ap. 20, Iași 700360
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex flex-col items-center sm:items-start gap-1">
              <p className="text-white/30 text-xs">
                © {new Date().getFullYear()} Quasar Dance. Toate drepturile rezervate.
              </p>
              <p className="text-white/30 text-xs">
                Made with 💛 by{' '}
                <a
                  href="https://websitefactory.ro"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/50 hover:text-[#f8ef21] transition-colors font-semibold"
                >
                  Website Factory
                </a>
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
              {[
                // Informarea comercială cerută de procesatorul de plăți al portalului
                // de membri. Stă în rândul legal, unde o caută și utilizatorii, și el.
                { label: MEMBER_PORTAL_LEGAL_LABEL, href: MEMBER_PORTAL_URL },
                { label: 'Politică de confidențialitate', href: '/politica-de-confidentialitate' },
                { label: 'Politică cookies', href: '/politica-cookies' },
                { label: 'Termeni & condiții', href: '#' },
                { label: 'GDPR', href: '/politica-de-confidentialitate' },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-white/30 hover:text-white/60 text-xs transition-colors"
                >
                  {item.label}
                </a>
              ))}
              <CookieSettingsLink className="text-white/30 hover:text-white/60 text-xs transition-colors" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
