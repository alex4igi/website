/** @type {import('next').NextConfig} */

// Linkurile scurte tipărite pe flyerele campaniei „Back to Dance School”.
// Rostul lor e strict practic: linkul complet cu UTM produce un cod QR de 49×49
// module (~20 mm minim pe hârtie), pe când cel scurt încape în 29×29 (~12 mm).
// Sufixele -s / -n separă flyerul fiecărei locații, păstrând o singură sursă în rapoarte.
const CAMPAIGN_LP = '/back-to-dance-school'
const btds = (medium) =>
  `${CAMPAIGN_LP}?utm_source=flyer&utm_medium=${medium}&utm_campaign=btds-2026`

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
  // Antete de securitate de bază (audit 2026-09-20). Fără CSP deocamdată: site-ul încarcă
  // GTM/GA/Meta Pixel/theMarketer și un CSP strict ar trebui calibrat pe fiecare.
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
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
