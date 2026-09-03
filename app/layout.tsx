import type { Metadata } from 'next'
import { Sora, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import WhatsAppButton from '@/components/WhatsAppButton'
import ConsentMode from '@/components/ConsentMode'
import GoogleTagManager, { GTMNoScript } from '@/components/GoogleTagManager'
import MetaPixel from '@/components/MetaPixel'
import CookieConsent from '@/components/CookieConsent'
import CampaignPopup from '@/components/CampaignPopup'
import SiteTracking from '@/components/SiteTracking'
import './globals.css'

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['400', '600', '700', '800'],
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['400', '500', '600'],
})

export const metadata: Metadata = {
  icons: {
    icon: '/favicon-quasar.png',
    apple: '/favicon-quasar.png',
  },
  title: 'Quasar Dance | Școală de Dans în Iași din 1981',
  description:
    'Quasar Dance — cea mai longevivă comunitate de dans din Iași. Cursuri de street dance, gimnastică, KPOP pentru copii, studenți și adulți. 600+ membri activi, 200+ trofee, 3 locații.',
  keywords: [
    'scoala de dans Iasi',
    'cursuri dans copii Iasi',
    'street dance Iasi',
    'gimnastica Iasi',
    'KPOP dans Iasi',
    'Quasar Dance',
    'dans Iasi',
  ],
  openGraph: {
    title: 'Quasar Dance | Școală de Dans în Iași',
    description:
      'Mai mult decât cursuri de dans. O experiență completă: spectacole, concursuri, flashmob-uri și progres real.',
    url: 'https://quasardance.ro',
    siteName: 'Quasar Dance',
    locale: 'ro_RO',
    type: 'website',
  },
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ro" className={`${sora.variable} ${inter.variable}`}>
      <head>
        <ConsentMode />
        <GoogleTagManager />
        <MetaPixel />
      </head>
      <body className="antialiased">
        <GTMNoScript />
        {children}
        <WhatsAppButton />
        <CookieConsent />
        {/* Se deschide singur doar în fereastra din lib/campaign-promo.ts. */}
        <CampaignPopup />
        {/* Click pe telefon/WhatsApp/email, oriunde în site. */}
        <SiteTracking />
        <Analytics />
        {/* Core Web Vitals măsurate la vizitatorii reali (RUM), nu în laborator. */}
        <SpeedInsights />
      </body>
    </html>
  )
}
