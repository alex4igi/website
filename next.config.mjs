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
  images: {
    unoptimized: true,
  },
  // `permanent: false` (307) intenționat: sunt linkuri de campanie. Un 308 ar rămâne
  // în cache-ul browserelor la nesfârșit și n-am mai putea redirecta altundeva la anul.
  async redirects() {
    return [
      { source: '/btds', destination: btds('qr'), permanent: false },
      { source: '/btds-s', destination: btds('qr-stefan'), permanent: false },
      { source: '/btds-n', destination: btds('qr-nicolina'), permanent: false },
    ]
  },
}

export default nextConfig
