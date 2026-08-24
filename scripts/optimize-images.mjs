/**
 * Redimensionează și recomprimă sursele din public/.
 *
 * De ce manual și nu next/image: nicio componentă nu folosește next/image —
 * imaginile sunt <img> brute sau background-image în CSS, deci optimizatorul
 * Next nu e invocat niciodată. Până la o migrare, ăsta e singurul loc unde
 * imaginile chiar se micșorează.
 *
 * Rulare:  node scripts/optimize-images.mjs
 *
 * Idempotent prin manifestul de mai jos: reținem hash-ul fiecărui fișier pe care
 * l-am scris noi, iar la rulările următoare îl sărim. Fără asta, fiecare rulare
 * ar re-encoda un JPEG deja lossy și ar pierde din calitate la fiecare trecere
 * (generation loss) — degradare tăcută, fiindcă fișierul doar „scade puțin”.
 *
 * Originalele la rezoluție mare NU se păstrează aici — recuperarea se face din
 * istoricul git (`git checkout <commit> -- public/...`).
 */
import { createRequire } from 'node:module'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const require = createRequire(import.meta.url)
// sharp vine ca dependință opțională a lui Next, deci nu e la rădăcina node_modules.
const sharp = require(
  path.join(ROOT, 'node_modules/.pnpm/sharp@0.34.5/node_modules/sharp'),
)

// maxW/maxH = plafon (fit: inside, fără mărire). q = calitatea de re-encodare.
// Cardurile din PathsSection se afișează sub 450px CSS → 900px acoperă și retina.
// quasar-team e fundal full-bleed (posterul LCP de pe homepage) → 1920px.
// Calendarul se deschide în lightbox și conține TEXT → dimensiuni păstrate, q mai mare.
const JOBS = [
  { f: 'public/images/gimnastica-acrobatica.jpeg', maxW: 900,  maxH: 1600, q: 72 },
  { f: 'public/images/street-dance.webp',          maxW: 900,  maxH: 1600, q: 72 },
  { f: 'public/images/kpop.webp',                  maxW: 900,  maxH: 1600, q: 72 },
  { f: 'public/images/zumba.webp',                 maxW: 900,  maxH: 1600, q: 72 },
  { f: 'public/images/quasar-team.jpg',            maxW: 1920, maxH: 1920, q: 72 },
  { f: 'public/cursuri/gimnastica.jpg',            maxW: 921,  maxH: 1024, q: 72 },
  { f: 'public/cursuri/k-pop-dance.jpg',           maxW: 683,  maxH: 1024, q: 72 },
  { f: 'public/cursuri/studenti.jpg',              maxW: 1024, maxH: 1024, q: 72 },
  { f: 'public/cursuri/cursuri-tiny.jpg',          maxW: 768,  maxH: 768,  q: 72 },
  { f: 'public/back-to-dance-school-hero.jpg',     maxW: 1600, maxH: 1600, q: 72 },
  { f: 'public/2026-2027-calendar.jpeg',           maxW: 1280, maxH: 1280, q: 80 },
  { f: 'public/favicon-quasar.png',                maxW: 256,  maxH: 256,  q: 90 },
]

const MANIFEST = path.join(ROOT, 'scripts/.optimized-images.json')
const sha = (buf) => crypto.createHash('sha256').update(buf).digest('hex')

/** @type {Record<string, string>} path relativ → sha256 al ieșirii scrise de noi */
let manifest = {}
try {
  manifest = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'))
} catch {
  // prima rulare, sau manifest șters ca să se forțeze reprocesarea
}

let before = 0
let after = 0
let changed = 0
let skipped = 0

for (const job of JOBS) {
  const abs = path.join(ROOT, job.f)
  // Citim în memorie: scriem peste exact același fișier, deci nu putem stream-ui.
  const src = fs.readFileSync(abs)
  before += src.length / 1024

  if (manifest[job.f] === sha(src)) {
    after += src.length / 1024
    skipped++
    console.log(`  --  ${job.f} (neschimbat de la ultima optimizare)`)
    continue
  }

  const meta = await sharp(src).metadata()

  let pipe = sharp(src).resize({
    width: job.maxW,
    height: job.maxH,
    fit: 'inside',
    withoutEnlargement: true,
  })

  if (meta.format === 'webp') pipe = pipe.webp({ quality: job.q })
  else if (meta.format === 'png') pipe = pipe.png({ compressionLevel: 9 })
  else pipe = pipe.jpeg({ quality: job.q, mozjpeg: true, progressive: true })

  const out = await pipe.toBuffer()

  if (out.length < src.length) {
    fs.writeFileSync(abs, out)
    manifest[job.f] = sha(out)
    after += out.length / 1024
    changed++
    const pct = Math.round((1 - out.length / src.length) * 100)
    console.log(`-${String(pct).padStart(2)}%  ${job.f}`)
  } else {
    // Rezultatul n-ar fi mai mic: păstrăm originalul, dar îl marcăm ca procesat
    // ca să nu-l mai trecem prin encoder la rulările viitoare.
    manifest[job.f] = sha(src)
    after += src.length / 1024
    console.log(`  ok  ${job.f} (deja optimizat)`)
  }
}

fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + '\n')

console.log(
  `\n${changed} rescrise, ${skipped} sărite, din ${JOBS.length}: ` +
    `${Math.round(before)} KB → ${Math.round(after)} KB`,
)
