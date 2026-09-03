# Infrastructură și operare

Ultima actualizare: 2026-08-23

Documentul descrie unde rulează site-ul, de unde vine fiecare piesă și ce nu
trebuie atins fără atenție. Pentru contextul istoric — cum a ajuns totul aici —
vezi ultima secțiune.

---

## Rulare locală

```bash
./node_modules/.bin/next dev
```

**Nu folosi `pnpm dev`.** Shim-ul corepack încearcă să descarce pnpm la fiecare
rulare și eșuează la verificarea semnăturii. Instalarea inițială merge cu
`npx --yes pnpm@latest install`.

Site-ul pornește pe `http://localhost:3000`.

`/cursuri` returnează 404 — și local, și în producție. Nu e o eroare: există doar
subpaginile (`/cursuri/zumba`, `/cursuri/gimnastica` etc.), nu și o pagină-index.

---

## Variabile de mediu

`.env.local` nu e în repo (vezi `.gitignore`). Se obține din Vercel:

```bash
npx vercel env pull .env.local --environment=production
```

**Fără `--environment=production` primești un fișier gol.** Toate cele 12
variabile sunt setate pe `production` și `preview`; pe `development` nu există
niciuna.

### Ce se poate și ce nu se poate recupera

Vercel are trei tipuri de variabile. Cele marcate **`sensitive`** sunt
write-only prin design — nici proprietarul contului nu le poate citi înapoi.
La descărcare apar literal ca `[SENSITIVE]`.

| Variabilă | Tip | Recuperabilă |
|---|---|---|
| `DATABASE_URL` | encrypted | da |
| `DATABASE_URL_UNPOOLED` | encrypted | da |
| `NEXT_PUBLIC_GA_ID` | encrypted | da |
| `ADMIN_PASSWORD` | sensitive | nu |
| `ADMIN_AUTH_SECRET` | sensitive | nu |
| `THEMARKETER_REST_KEY` | sensitive | nu |
| `THEMARKETER_CUSTOMER_ID` | sensitive | nu |
| `EMAIL_FROM` | sensitive | nu |
| `EMAIL_REPLY_TO` | sensitive | nu |
| `CONTACT_INBOX` | sensitive | nu |
| `DATABASE_PGPASSWORD`, `DATABASE_POSTGRES_*` | sensitive | nu |
| `META_CAPI_ACCESS_TOKEN` | sensitive | nu |
| `META_CAPI_TEST_EVENT_CODE` | plain, temporar | da |
| `NEXT_PUBLIC_GOOGLE_ADS_CONVERSION` | plain | da |

Variabilele `DATABASE_*` cu prefix sunt generate de integrarea Neon și conțin
aceleași credențiale ca `DATABASE_URL`, în alte formate. Dacă ai nevoie de o
valoare `sensitive` pe care n-o știi, singura soluție e să o înlocuiești.

Modificările de variabile **cer o republicare** ca să aibă efect — Vercel le
injectează la build.

---

## ⚠️ Baza de date locală este cea de producție

`DATABASE_URL` din `.env.local` indică baza **live**. Site-ul local citește date
reale, ceea ce e util pentru dezvoltare. Dar:

- `npm run db:seed` **suprascrie orarul și prețurile de pe site**
- `npm run db:push` modifică schema în producție
- `/admin` pornit local scrie direct în producție

Pentru experimente, creează un branch în Neon (e instant) și pune-i connection
string-ul în `.env.local`.

### Structura

Neon PostgreSQL 17. Trei tabele, fiecare cu **un singur rând** care conține un
obiect JSON:

| Tabel | Conținut |
|---|---|
| `pricing` | planuri de preț, an școlar, taxă de rezervare |
| `calendar` | module, vacanțe, evenimente, date de început/sfârșit |
| `schedule` | orarul pe locații |

Datele reale **diferă** de valorile implicite din `lib/db/defaults.ts`. Nu face
seed din cod peste producție — ai suprascrie modificări făcute din `/admin`.

Un export al datelor curente e păstrat în afara repo-ului, în
`~/Documents/quasar-backup/`.

---

## Publicare

| | |
|---|---|
| Găzduire | Vercel, echipa `quasar-dance-s-projects` |
| Proiect | `quasar-dance` |
| Repo sursă | `alex4igi/website` |
| Branch de producție | `main` |
| Framework | Next.js, Node 24 |

Orice push în `main` publică automat. Push-urile pe alte branch-uri produc
previzualizări, protejate prin autentificare Vercel — de aceea răspund cu 302
dacă le accesezi neautentificat. Nu e o eroare de build.

Portalul de membri (`membri.quasardance.ro`) e o aplicație separată, în proiectul
`qapp-membri` din aceeași echipă. Nu are legătură cu acest repo în afara linkului
din `lib/portal.ts`.

---

## DNS

Domeniul e înregistrat la **ROTLD**. Nameserverele indică spre Vercel:

```
ns1.vercel-dns.com
ns2.vercel-dns.com
```

Înregistrările se administrează în Vercel → Domains → `quasardance.ro`.

### ⚠️ „Upload Zone File" șterge tot

Butonul înlocuiește **întreaga** zonă — orice înregistrare care nu se află în
fișierul încărcat dispare, inclusiv cele create automat pentru site și pentru
portalul de membri. Modifică înregistrările individual, sau prin CLI:

```bash
npx vercel dns ls quasardance.ro
npx vercel dns add quasardance.ro <nume> <tip> <valoare> [prioritate]
npx vercel dns rm <rec_id> --yes
```

Nu există comandă de modificare — se șterge și se adaugă la loc. Pentru SPF, fă-o
în ordinea *șterge apoi adaugă*: două înregistrări SPF simultan sunt invalide
(`permerror`), pe când lipsa temporară e doar neutră.

### Ce conține zona

| Grup | Rol |
|---|---|
| 5 × MX Google | email primit pe `@quasardance.ro` — **critic** |
| TXT SPF, `_dmarc` | autorizare și raportare expeditori |
| `nwl` — MX + TXT | subdomeniu de bounce theMarketer (prin Amazon SES) |
| 6 × CNAME `*._domainkey` | chei DKIM Amazon SES — validarea domeniului în theMarketer |
| TXT `x._domainkey` | cheie DKIM separată, RSA |
| CNAME `mktr` | tracking theMarketer (`api7.mktr2.com`) |
| 4 × A: `ftp`, `mail`, `pop`, `smtp` | resturi de la o găzduire veche |
| CAA × 3, ALIAS apex, wildcard | create automat de Vercel |

Cele patru înregistrări `A` legacy indică spre un server partajat scos din uz.
Porturile de mail sunt închise acolo, iar emailul merge la Google prin MX. Sunt
inofensive; păstrate pentru a migra identic. Se pot șterge oricând.

Zona veche de la Cloudflare a fost lăsată intenționat pe loc, moartă. Nu costă
nimic și e plasa de siguranță. Un export al ei e păstrat în afara repo-ului.

---

## Email

### Primit

Google Workspace, prin cele 5 înregistrări MX. Nu atinge MX-urile fără să
verifici de două ori — o greșeală acolo oprește tot ce vine pe `office@`.

### Trimis din aplicație

`lib/email.ts` folosește API-ul tranzacțional theMarketer — **același cont ca
qapp v2**, care îl apelează identic din `supabase/functions/_shared/messaging.ts`.
Singurul apelant de aici e `app/api/inscriere/route.ts` — confirmările de înscriere.

```
POST https://t.themarketer.com/api/v1/transactional/send-email?k={REST_KEY}&u={CUSTOMER_ID}
  body: { to, subject, from, body, reply_to }
  succes: { result: 'success', message_id }
```

Două capcane: **HTTP 200 nu înseamnă trimis** — eșecul vine în câmpul `result`,
deci se verifică acolo, nu doar codul de status. Și apelul e pe drumul critic al
formularului, de aceea are timeout de 8s.

> **Emailul acesta e singura confirmare pe care o primește cel înscris.** CRM-ul
> are auto-reply-ul dezactivat intenționat (`intake-website-lead`) tocmai ca să nu
> dubleze mesajul. Dacă pică, lead-ul tot ajunge în CRM — dar omul nu află nimic.
> De aceea răspunsul de la `/api/inscriere` conține `emailSent`, iar eșecul se
> loghează cu prefixul `[inscriere] EMAIL EȘUAT`.

Până în august 2026 trimiterea mergea prin Resend, pe cheia și domeniul
furnizorului (`noreply@websitefactory.ro`). A fost înlocuită complet.

### SPF

Valoarea curentă e la aproximativ **8 din cele 10 căutări DNS** permise de RFC.
Nu mai adăuga niciun `include:` fără să scoți întâi directivele `+a` și `+mx`,
care autorizează adrese ce nu trimit email. Depășirea limitei invalidează
complet SPF-ul.

---

## Măsurare

- Google Analytics 4: `G-XJ1LVQKJS0` (din variabila `NEXT_PUBLIC_GA_ID`)
- Google Tag Manager: `GTM-NCPGG3N7` (în cod)
- Meta Pixel: `318398430675684` (în cod, `components/MetaPixel.tsx`)

Toate se încarcă prin Consent Mode — vezi `lib/consent.ts`.

### Evenimente

Toate evenimentele de marketing pleacă din `lib/track.ts`, simultan în dataLayer
(GTM), GA4 și Meta Pixel — echivalentul PixelYourSite de pe vechiul WordPress.

| Eveniment | Când | dataLayer / GA4 | Meta |
|---|---|---|---|
| Lead | formular trimis (homepage, LP) | `lead` / `generate_lead` | `Lead` |
| Contact | click pe `tel:`, `mailto:`, `wa.me` (oriunde) | `contact_click` | `Contact` |
| PageView | fiecare pagină, inclusiv navigare internă | automat (GA4 Enhanced Measurement) | automat (`fbevents.js` urmărește `pushState`) |
| Promo | pop-up / linkuri campanie | `btds_promo_*` | — |

`Contact` e automat (`components/SiteTracking.tsx`); `Lead` se cheamă explicit din
formulare. **Nu adăuga PageView manual la navigare** — Meta îl trimite singur și s-ar
dubla (verificat pe producție, 3 sept 2026).

Atenție la consimțământ: `fbevents.js` golește coada stub-ului doar cât timp
consimțământul nu e revocat. Din 3 sept 2026 `MetaPixel.tsx` citește consimțământul
salvat sincron și nu mai revocă pentru cine a acceptat deja, iar `applyConsent()`
repetă `grant`-ul după ce se încarcă biblioteca. Înainte, vizitatorii care reveneau
cu consimțământ salvat nu trimiteau nimic la Meta.

### Google Ads

Conversia de lead se trimite când e setată `NEXT_PUBLIC_GOOGLE_ADS_CONVERSION`, în
formatul `AW-XXXXXXXXX/AbC-D_efG` (Ads › Goals › Conversions › acțiunea de lead ›
Tag setup › Use Google tag: conversion ID + conversion label). Din ea se derivă și
contul `AW-…` pe care `ConsentMode.tsx` îl configurează în gtag. Goală = Ads nu
primește nimic; GA4 și Meta merg oricum. Cere republicare (variabilă `NEXT_PUBLIC_`).

### Meta Conversions API

`app/api/inscriere/route.ts` trimite `Lead` și de pe server (`lib/meta-capi.ts`),
ca să nu pierdem lead-urile blocate de adblockere/iOS în browser. Se activează
setând `META_CAPI_ACCESS_TOKEN` (Events Manager › Data sources › pixelul › Settings
› Conversions API › Generate access token). Fără token, codul e inert.

- Datele personale pleacă hash-uite SHA-256; IP și user-agent în clar (așa cere Meta).
- Se trimite **doar** dacă persoana a acceptat cookie-urile de marketing
  (`marketing_consent` în corpul cererii, calculat din `lib/consent.ts`).
- Browserul și serverul folosesc același `event_id`, deci Meta numără o singură dată.
- Pentru verificare: `META_CAPI_TEST_EVENT_CODE` cu codul din Events Manager › Test
  events; evenimentele apar acolo live. **Se șterge după**, altfel nu intră în rapoarte.
- Un eșec CAPI nu afectează formularul: lead-ul e deja în CRM. Apare ca
  `metaSent: false` în răspuns și `[inscriere] META CAPI EȘUAT` în logul Vercel.

---

## Redirect-uri

Sunt în cod, în `next.config.mjs`, nu în DNS sau la vreun CDN:

| De la | Către |
|---|---|
| `/btds` | landing page campanie, cu UTM de QR |
| `/btds-s` | idem, flyer Ștefan |
| `/btds-n` | idem, flyer Nicolina |

Sunt `307` (temporare) intenționat — un `308` ar rămâne în cache-ul browserelor
la nesfârșit.

---

## Istoric: preluarea din 23 august 2026

Site-ul a fost construit de un furnizor extern. Pe 23 august 2026 infrastructura
a trecut integral sub conturile proprii.

Ce s-a dovedit la verificare: găzduirea Vercel, baza de date și portalul de plăți
erau **deja** pe conturile noastre. Furnizorul controla efectiv două lucruri —
sursa din care se publica site-ul și DNS-ul.

Ce s-a schimbat:

1. Codul a fost copiat integral, cu tot istoricul, într-un repo propriu.
2. Proiectul Vercel a fost deconectat de la repo-ul furnizorului și conectat la
   al nostru. Din acel moment ei nu mai pot publica nimic.
3. Zona DNS a fost exportată din Cloudflare, reconstruită în Vercel și verificată
   înregistrare cu înregistrare înainte de comutare.
4. Nameserverele au fost mutate la ROTLD. Cloudflare a ieșit complet din traseu.
5. SPF-ul a fost reparat — nu autoriza Google, deși emailul pleacă prin Google
   Workspace, deci mesajele riscau să ajungă în spam. DMARC-ul avea `pct=0`,
   adică era inert, și a fost activat pe modul de raportare.

Zona Cloudflare fusese configurată pentru o găzduire mai veche, nu pentru site-ul
actual — de aici înregistrările `mail`/`smtp`/`pop`/`ftp` rămase. Nu conținea
nicio regulă, niciun Worker și nu cacha nimic.

### Rămas de făcut

- Revizuirea accesului la echipa Vercel — mai există un membru din partea
  furnizorului
- Opțional: curățarea directivelor `+a` și `+mx` din SPF

Rezolvate de atunci:

- ~~Înlocuirea cheii de trimitere a emailurilor~~ → mutat pe theMarketer, cont propriu
- ~~Clarificarea cine administrează infrastructura de newsletter (`nwl` + `mktr`)~~ →
  sunt înregistrările de validare ale contului nostru theMarketer, cel folosit și de
  qapp v2. Nu erau ale furnizorului.
