/** @type {import('next').NextConfig} */

// Linkurile scurte tipărite pe flyerele campaniei „Back to Dance School”.
// Rostul lor e strict practic: linkul complet cu UTM produce un cod QR de 49×49
// module (~20 mm minim pe hârtie), pe când cel scurt încape în 29×29 (~12 mm).
// Sufixele -s / -n separă flyerul fiecărei locații, păstrând o singură sursă în rapoarte.
const CAMPAIGN_LP = '/back-to-dance-school'
const btds = (medium) =>
  `${CAMPAIGN_LP}?utm_source=flyer&utm_medium=${medium}&utm_campaign=btds-2026`

// Content-Security-Policy (audit 2026-09-20). Lista de domenii vine din inventarul din
// 24 sept. 2026: cod + site live cu toate cookie-urile acceptate + containerul GTM (gol).
// Familia Google (Analytics/Ads) și Meta e permisă dinainte, ca un tag nou pus în GTM de
// agenție să nu fie blocat. ORICE altă platformă nouă (TikTok, Clarity…) trebuie adăugată
// aici, altfel browserul o blochează fără niciun mesaj vizibil — rapoartele ajung în
// tabela `csp_reports` prin /api/csp-report.
//
// `'unsafe-inline'` pe scripturi e asumat: alternativa (nonce) ar face dinamice toate
// paginile statice/ISR. Site-ul nu afișează conținut scris de vizitatori.
const GOOGLE_PIXELS = [
  'https://*.google-analytics.com',
  'https://*.analytics.google.com',
  'https://*.googletagmanager.com',
  'https://*.doubleclick.net',
  'https://www.google.com',
  'https://www.google.ro',
  'https://www.googleadservices.com',
  'https://pagead2.googlesyndication.com',
]
const CSP = {
  'default-src': ["'self'"],
  'script-src': [
    "'self'",
    "'unsafe-inline'",
    ...(process.env.NODE_ENV === 'development' ? ["'unsafe-eval'"] : []),
    'https://www.googletagmanager.com',
    'https://*.googletagmanager.com',
    'https://www.google-analytics.com',
    'https://www.googleadservices.com',
    'https://googleads.g.doubleclick.net',
    'https://connect.facebook.net',
    'https://challenges.cloudflare.com',
    'https://va.vercel-scripts.com',
  ],
  'connect-src': [
    "'self'",
    ...GOOGLE_PIXELS,
    'https://www.facebook.com',
    'https://connect.facebook.net',
    'https://challenges.cloudflare.com',
    'https://va.vercel-scripts.com',
  ],
  'img-src': [
    "'self'",
    'data:',
    'blob:',
    'https://hebbkx1anhila5yf.public.blob.vercel-storage.com',
    'https://images.unsplash.com',
    ...GOOGLE_PIXELS,
    'https://www.facebook.com',
  ],
  'frame-src': [
    'https://www.youtube.com',
    'https://www.youtube-nocookie.com',
    'https://www.google.com',
    'https://challenges.cloudflare.com',
    'https://www.googletagmanager.com',
    'https://td.doubleclick.net',
    'https://www.facebook.com',
  ],
  'style-src': ["'self'", "'unsafe-inline'"],
  'font-src': ["'self'", 'data:'],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'frame-ancestors': ["'none'"],
  'upgrade-insecure-requests': [],
  'report-uri': ['/api/csp-report'],
  'report-to': ['csp'],
}
const cspValue = Object.entries(CSP)
  .map(([directive, values]) => [directive, ...values].join(' '))
  .join('; ')

const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // `unoptimized` a fost scos, dar atenție: azi nu schimbă nimic, fiindcă nicio
  // componentă nu folosește next/image — toate imaginile sunt <img> brute sau
  // background-image în CSS, iar optimizatorul nu e invocat niciodată. Sursele din
  // public/ au fost redimensionate și recomprimate manual (scripts/optimize-images.mjs).
  // Dacă cineva introduce next/image cu surse externe (blob-ul v0), va trebui adăugat
  // și `images.remotePatterns`.
  // `permanent: false` (307) intenționat: sunt linkuri de campanie. Un 308 ar rămâne
  // în cache-ul browserelor la nesfârșit și n-am mai putea redirecta altundeva la anul.
  // Antete de securitate de bază (audit 2026-09-20). CSP-ul e în Report-Only până
  // confirmăm din `csp_reports` că nu blochează nimic legitim.
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Content-Security-Policy-Report-Only', value: cspValue },
          { key: 'Reporting-Endpoints', value: 'csp="/api/csp-report"' },
        ],
      },
    ]
  },
  async redirects() {
    return [
      { source: '/btds', destination: btds('qr'), permanent: false },
      { source: '/btds-s', destination: btds('qr-stefan'), permanent: false },
      { source: '/btds-n', destination: btds('qr-nicolina'), permanent: false },
    ]
  },
}

export default nextConfig
