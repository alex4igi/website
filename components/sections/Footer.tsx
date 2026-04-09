import Link from 'next/link'
import { MapPin, Phone, Mail, Instagram, Facebook, Youtube } from 'lucide-react'

const navCols = [
  {
    title: 'Cursuri',
    links: [
      { label: 'Street Dance Kids', href: '#' },
      { label: 'Street Dance Studenți', href: '#' },
      { label: 'Gimnastică', href: '#' },
      { label: 'KPOP Dance', href: '#' },
      { label: 'Dans Adulți', href: '#' },
    ],
  },
  {
    title: 'Companie',
    links: [
      { label: 'Despre noi', href: '#despre' },
      { label: 'Echipa', href: '#despre' },
      { label: 'Program & Prețuri', href: '#program' },
      { label: 'Locații', href: '#locatii' },
      { label: 'Contact', href: '#inscriere' },
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
  { label: 'Instagram', href: 'https://instagram.com', icon: Instagram },
  { label: 'Facebook', href: 'https://facebook.com', icon: Facebook },
  { label: 'YouTube', href: 'https://youtube.com', icon: Youtube },
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
              Cea mai longevivă comunitate de dans din Iași. Depuis 1981, formăm dansatori,
              construim cariere și conectăm generații prin mișcare.
            </p>

            {/* Contact */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2.5 text-white/55 text-sm">
                <MapPin size={14} className="flex-shrink-0" />
                <span>Strada Lăpușneanu 14, Iași</span>
              </div>
              <div className="flex items-center gap-2.5 text-white/55 text-sm">
                <Phone size={14} className="flex-shrink-0" />
                <a href="tel:+40232000000" className="hover:text-[#f8ef21] transition-colors">
                  +40 232 000 000
                </a>
              </div>
              <div className="flex items-center gap-2.5 text-white/55 text-sm">
                <Mail size={14} className="flex-shrink-0" />
                <a href="mailto:contact@quasardance.ro" className="hover:text-[#f8ef21] transition-colors">
                  contact@quasardance.ro
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
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/30 text-xs">
            © {new Date().getFullYear()} Quasar Dance. Toate drepturile rezervate.
          </p>
          <div className="flex items-center gap-5">
            {['Politică de confidențialitate', 'Termeni & condiții', 'GDPR'].map((item) => (
              <a
                key={item}
                href="#"
                className="text-white/30 hover:text-white/60 text-xs transition-colors"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
