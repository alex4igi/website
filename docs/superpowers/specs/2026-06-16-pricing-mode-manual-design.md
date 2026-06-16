# Selector tip preț (lunar / ședință) + text complet manual

Data: 2026-06-16

## Context

Clientul administrează prețurile din `/admin → Prețuri`. Vara apar prețuri
**per ședință** (Open, KPOP, Zumba…), iar restul rămân lunare. Toamna revine la
layout-ul actual. Clientul vrea să **scrie manual toate textele** — fără calcul
automat al prețului per ședință.

Pe card trebuie afișat: titlu, subtitlu, preț principal (lunar sau ședință) și un
subtitlu de preț (ex: „≈ preț per ședință"), toate scrise manual.

## Decizii (aprobate)

1. **Tip preț per plan** — fiecare plan are propriul comutator `lunar | sedinta`
   (permite mix vara). NU toggle global.
2. **Totul manual, fără calcul** — eliminăm `priceStandard ÷ sessionsPerYear` și
   fallback-ul `÷10`. Subtitlul de preț devine text liber.
3. **Păstrăm câmpurile actuale** + adăugăm tip preț & notă manuală. Fără card
   simplificat separat. Acoperă atât vara cât și toamna.

## Model de date (`lib/db/types.ts`)

În `pricingPlanSchema`:

- `priceMode: z.enum(['lunar', 'sedinta']).default('lunar')` — NOU. Unitatea
  afișată lângă prețul principal.
- `priceNote: z.string().default('')` — NOU. Subtitlul de preț, text liber.
- `priceMonthly` — rămâne câmpul pentru **prețul principal** (numărul mare).
  Semnificația depinde de `priceMode`. Fără rename → fără migrare de chei JSON.
- `priceStandard`, `sessionsPerYear` — devin `.optional()`. Nu mai conduc nimic
  vizual; rămân pentru datele anuale pe care clientul le detaliază în descriere.
- `priceEarlyBird`, `durationMinutes`, restul — neschimbate.

Migrare: câmpurile noi au `.default()`, deci la prima salvare din admin rândul
existent capătă valorile. Componentele publice tolerează lipsa lor (fallback
`'lunar'` / `''`).

## Afișaj public (`components/sections/PricingSection.tsx`)

- Elimin `monthlyPrice()` și `pricePerSession()` — gata cu orice calcul.
- Headline: `{priceMonthly} lei` + unitate din `priceMode` → `/ lună` sau
  `/ ședință`.
- Sub preț: `priceNote` afișat ca atare; dacă e gol, nu se afișează nimic.
- Eyebrow `ageGroup · level`: dacă `level` e gol, afișez doar `ageGroup`.
- Ajustez textul fix din header care promite „afișate lunar".

## Admin editor (`app/admin/(protected)/preturi/pricing-editor.tsx`)

- Select „Tip preț": Lunar / Per ședință.
- Reetichetez câmpul prețului principal → „Preț principal (lei)", hint dinamic
  „/ lună" sau „/ ședință".
- Înlocuiesc hint-ul calculat cu input text „Subtitlu preț (manual)" legat de
  `priceNote`, placeholder `≈ 45 lei / ședință`.
- `priceStandard` / `sessionsPerYear` rămân în editor ca opționale (fără calcul).
- `newPlan()` setează `priceMode: 'lunar'`, `priceNote: ''`.

## Metadata SEO (`app/program-si-preturi/page.tsx`)

- `generateMetadata` nu mai face fallback `priceStandard / 10`; folosește doar
  `priceMonthly > 0`.

## Defaults (`lib/db/defaults.ts`)

- Adaug explicit `priceMode: 'lunar'`, `priceNote: ''` la cele 5 planuri seed.

## API (`app/api/admin/pricing/route.ts`)

- Neschimbat — zod validează automat câmpurile noi.

## Testare

- Validare zod pe payload cu și fără câmpurile noi (migrare).
- Render card pentru un plan `lunar` și unul `sedinta` (unitate corectă; notă
  manuală afișată / ascunsă când e goală).
- Editor salvează corect ambele moduri.

## Out of scope (YAGNI)

Card simplificat separat, toggle global, sugestie de calcul în admin, rename de
coloane DB.
