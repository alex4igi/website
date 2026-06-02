import type { Metadata } from 'next'

// Data-driven config for the /cursuri/[course] pages. All fields are plain
// serializable data (icons are string keys mapped to components in CoursePage),
// so a Server Component can pass a config straight to the client renderer.

export type CourseIcon =
  | 'heart'
  | 'brain'
  | 'users'
  | 'music'
  | 'dumbbell'
  | 'shield'
  | 'smile'
  | 'activity'
  | 'flame'
  | 'target'
  | 'sparkles'
  | 'trophy'
  | 'star'

export interface PickerItem {
  id: string
  name: string
  kicker: string
  desc: string
  tags: string[]
}

export interface CourseBenefit {
  icon: CourseIcon
  title: string
  desc: string
}

export interface CourseConfig {
  slug: string
  // SEO
  metaTitle: string
  metaDescription: string
  keywords: string[]
  ogTitle: string
  ogDescription: string
  jsonLdName: string
  jsonLdDescription: string
  // Hero
  sprayLabel: string
  heroBadge: string
  heroBadgeIcon: CourseIcon
  titleLine1: string
  titleAccent: string
  heroDesc: string
  heroImage?: string
  heroImageAlt?: string
  stats: { v: string; l: string }[]
  // Interactive picker (styles / elements / rhythms)
  picker?: {
    label: string
    title: string
    titleAccent: string
    intro: string
    items: PickerItem[]
  }
  // Benefits
  benefits: { label: string; title: string; items: CourseBenefit[] }
  // Age groups (optional)
  ageGroups?: {
    label: string
    title: string
    desc: string
    image?: string
    imageAlt?: string
    groups: { label: string; age: string }[]
  }
  // Progression levels (optional)
  levels?: { label: string; title: string; items: { num: string; title: string; desc: string }[] }
  // FAQ
  faqs: { q: string; a: string }[]
  // CTA
  ctaTitle: string
  ctaDesc: string
}

const standardLevels = {
  label: 'Drumul tău',
  title: 'De la prima oră la scenă',
  items: [
    { num: '01', title: 'Începător', desc: 'Fundamente: groove, ritm, coordonare. Grupă prietenoasă, fără presiune.' },
    { num: '02', title: 'Intermediar', desc: 'Primele coregrafii complexe, stil personal și apariții pe scenă.' },
    { num: '03', title: 'Avansat', desc: 'Tehnică, freestyle și specializare pe stilul tău preferat.' },
    { num: '04', title: 'Performanță', desc: 'Concursuri, spectacole Quasar și flashmob-uri. Din sală pe orice scenă.' },
  ],
}

const brandStats = [
  { v: '600+', l: 'membri activi' },
  { v: '200+', l: 'trofee & premii' },
  { v: '40+', l: 'ani de experiență' },
]

/* ── Street Dance ───────────────────────────────────────────────────────── */

const streetDance: CourseConfig = {
  slug: 'street-dance',
  metaTitle: 'Cursuri Street Dance în Iași — Hip-Hop, Breaking & Dans Urban | Quasar Dance',
  metaDescription:
    'Cursuri de street dance în Iași pentru copii, adolescenți și adulți: Hip-Hop, Breaking, Popping, Locking, House și Waacking. Școală cu tradiție din 1981, instructori formați în sistem Quasar, grupe de la 4 ani. Ședință de probă disponibilă.',
  keywords: [
    'cursuri street dance Iași',
    'street dance Iași',
    'hip hop Iași',
    'breaking Iași',
    'dans urban Iași',
    'cursuri hip hop copii Iași',
    'școală de dans Iași',
    'Quasar Dance',
  ],
  ogTitle: 'Cursuri Street Dance în Iași | Quasar Dance',
  ogDescription:
    'Hip-Hop, Breaking, Popping, Locking și mai mult. Dansul urban autentic în Iași, pentru toate vârstele. Tradiție din 1981.',
  jsonLdName: 'Cursuri Street Dance — Quasar Dance Iași',
  jsonLdDescription:
    'Cursuri de street dance în Iași: Hip-Hop, Breaking, Popping, Locking, House și Waacking, pentru copii, adolescenți și adulți, de la nivel începător la performanță.',
  sprayLabel: 'Street Dance',
  heroBadge: 'Din 1981 în Iași',
  heroBadgeIcon: 'flame',
  titleLine1: 'Cursuri de Street Dance',
  titleAccent: 'în Iași',
  heroDesc:
    'Hip-Hop, Breaking, Popping, Locking și mai mult. Dansul urban autentic, predat de instructori formați în sistem Quasar — pentru copii, adolescenți și adulți. Am adus street dance-ul în România și încă scriem povestea.',
  heroImage: '/cursuri/studenti.jpg',
  heroImageAlt: 'Grupă de street dance Quasar Dance din Iași într-o poză de echipă',
  stats: brandStats,
  picker: {
    label: 'Stilurile',
    title: 'Un univers întreg',
    titleAccent: 'de stiluri urbane',
    intro:
      'Street dance nu e un singur dans — e o familie de stiluri, fiecare cu propria poveste și energie. Apasă ca să le descoperi.',
    items: [
      {
        id: 'hip-hop',
        name: 'Hip-Hop',
        kicker: 'New York, anii ’70',
        desc: 'Stilul-fundament al dansului urban: groove, bounce și rock. Dansul social care a pornit din cartierele din Bronx și a cucerit lumea. De aici începe orice street dancer.',
        tags: ['Groove', 'Bounce', 'Freestyle'],
      },
      {
        id: 'breaking',
        name: 'Breaking',
        kicker: 'New York · sport olimpic',
        desc: 'B-boying & b-girling: toprock, footwork, freezes și power moves. Cel mai spectaculos stil urban, devenit disciplină olimpică la Paris 2024.',
        tags: ['Toprock', 'Footwork', 'Power moves'],
      },
      {
        id: 'popping',
        name: 'Popping',
        kicker: 'California, anii ’70',
        desc: 'Contracții rapide ale mușchilor („pops" / „hits") pe ritm de funk. Iluzii, robotică și control total al corpului — popularizat de Electric Boogaloos.',
        tags: ['Hits', 'Robot', 'Waves'],
      },
      {
        id: 'locking',
        name: 'Locking',
        kicker: 'Los Angeles · Don Campbell',
        desc: 'Stil funky, vesel și energic, creat de Don Campbell. Mișcări rapide ale brațelor, „lock"-uri și multă atitudine. Dansul care te face să zâmbești.',
        tags: ['Locks', 'Points', 'Funk'],
      },
      {
        id: 'house',
        name: 'House',
        kicker: 'Chicago / New York · club scene',
        desc: 'Footwork rapid, jacking și lofting pe muzică house. Fluiditate, energie și conexiune cu ritmul — dansul cluburilor underground.',
        tags: ['Footwork', 'Jacking', 'Lofting'],
      },
      {
        id: 'waacking',
        name: 'Waacking',
        kicker: 'Los Angeles · disco anii ’70',
        desc: 'Mișcări dramatice ale brațelor, poze și expresivitate maximă pe muzică disco & funk. Stil teatral, plin de personalitate și încredere.',
        tags: ['Arms', 'Poses', 'Expresie'],
      },
    ],
  },
  benefits: {
    label: 'De ce street dance',
    title: 'Mai mult decât pași de dans',
    items: [
      { icon: 'heart', title: 'Condiție fizică', desc: 'Coordonare, forță, rezistență și o postură mai bună — fără să simți că faci sport.' },
      { icon: 'brain', title: 'Încredere & disciplină', desc: 'Fiecare coregrafie învățată construiește curaj real și răbdare pe scenă și în viață.' },
      { icon: 'users', title: 'Comunitate', desc: 'Prietenii de la dans devin prietenii pentru viață. Quasar e o familie, nu doar o sală.' },
      { icon: 'music', title: 'Muzicalitate & stil', desc: 'Înveți să simți ritmul și să-ți construiești propriul stil prin freestyle și coregrafie.' },
    ],
  },
  ageGroups: {
    label: 'Pentru toate vârstele',
    title: 'De la 4 la 99 de ani',
    desc:
      'Street dance la Quasar are o grupă potrivită pentru fiecare etapă — de la primii pași până la nivel de performanță.',
    image: '/cursuri/cursuri-tiny.jpg',
    imageAlt: 'Copil și instructor Quasar Dance la cursul de street dance pentru cei mici din Iași',
    groups: [
      { label: 'Tiny', age: '4–7 ani' },
      { label: 'Junior', age: '7–10 ani' },
      { label: 'Varsity', age: '11–15 ani' },
      { label: 'Teens', age: '15–18 ani' },
      { label: 'Students', age: '19–25 ani' },
      { label: 'Adults', age: '25+ ani' },
    ],
  },
  levels: standardLevels,
  faqs: [
    { q: 'De la ce vârstă se poate începe street dance?', a: 'De la 4 ani, în grupa Tiny. Avem grupe pentru fiecare vârstă, până la adulți (25+ ani) — niciodată nu e prea târziu să începi.' },
    { q: 'Trebuie să am experiență înainte?', a: 'Deloc. Majoritatea cursanților încep de la zero, în grupele de începători. Te învățăm tot, pas cu pas, într-un mediu relaxat.' },
    { q: 'Ce trebuie să port la primul curs?', a: 'Haine lejere în care te poți mișca și încălțăminte sport curată, de interior. Apă și energie bună — restul îți arătăm noi.' },
    { q: 'În ce locații din Iași se țin cursurile de street dance?', a: 'La locațiile Quasar din Iași — Ștefan cel Mare și Nicolina. Vezi orarul complet pentru zile, ore și grupe.' },
    { q: 'Pot să vin la o oră de probă?', a: 'Da! Contactează-ne și îți programăm o ședință de probă, ca să simți atmosfera Quasar înainte de înscriere.' },
  ],
  ctaTitle: 'Gata să intri în ritm?',
  ctaDesc:
    'Rezervă-ți locul la cursurile de street dance din Iași. Te ajutăm să alegi grupa, nivelul și locația potrivită.',
}

/* ── KPOP Dance ─────────────────────────────────────────────────────────── */

const kpopDance: CourseConfig = {
  slug: 'kpop-dance',
  metaTitle: 'Cursuri KPOP Dance în Iași — Coregrafii K-Pop & Dance Cover | Quasar Dance',
  metaDescription:
    'Cursuri de KPOP dance în Iași pentru copii, adolescenți și tineri: coregrafii K-pop actuale, sincron de grup, dance break și performance. Comunitate vibrantă la Quasar Dance, grupe de la 7 la 25 de ani. Ședință de probă disponibilă.',
  keywords: [
    'cursuri kpop Iași',
    'kpop dance Iași',
    'dance cover Iași',
    'coregrafii kpop Iași',
    'cursuri dans adolescenți Iași',
    'k-pop Iași',
    'școală de dans Iași',
    'Quasar Dance',
  ],
  ogTitle: 'Cursuri KPOP Dance în Iași | Quasar Dance',
  ogDescription:
    'Coregrafii K-pop actuale, sincron de grup și energie maximă. Comunitatea KPOP din Iași te așteaptă la Quasar Dance.',
  jsonLdName: 'Cursuri KPOP Dance — Quasar Dance Iași',
  jsonLdDescription:
    'Cursuri de KPOP dance în Iași: coregrafii K-pop actuale, sincron de grup, dance break și performance, pentru copii, adolescenți și tineri, de la nivel începător la performanță.',
  sprayLabel: 'KPOP Dance',
  heroBadge: 'Comunitate vibrantă',
  heroBadgeIcon: 'sparkles',
  titleLine1: 'Cursuri de KPOP Dance',
  titleAccent: 'în Iași',
  heroDesc:
    'Coregrafii K-pop actuale, energie maximă și sincron de grup ca în videoclipuri. Înveți piese cap-coadă și dance break-uri exact ca idolii tăi, într-o comunitate vibrantă — de la Junior la Students.',
  heroImage: '/cursuri/k-pop-dance.jpg',
  heroImageAlt: 'Dansatoare KPOP Quasar Dance pe scenă, în spectacol, în Iași',
  stats: brandStats,
  picker: {
    label: 'Ce înveți',
    title: 'Coregrafie, sincron',
    titleAccent: 'și energie de scenă',
    intro:
      'KPOP dance înseamnă mai mult decât pași — e formație, expresie și energie de grup. Apasă ca să vezi ce lucrăm la fiecare oră.',
    items: [
      { id: 'coregrafie', name: 'Coregrafie completă', kicker: 'pe piese K-pop actuale', desc: 'Înveți o piesă cap-coadă, secțiune cu secțiune, exact ca în videoclipul original. De la primii 8 timpi până la coregrafia completă.', tags: ['Memorare', 'Detaliu', 'Stil'] },
      { id: 'sincron', name: 'Sincron de grup', kicker: 'formație & spacing', desc: 'Secretul KPOP-ului: să te miști ca un singur corp. Lucrăm formații, schimbări de poziție și sincronizare perfectă.', tags: ['Formație', 'Spacing', 'Timing'] },
      { id: 'dance-break', name: 'Dance break', kicker: 'secțiunile intense', desc: 'Părțile cele mai spectaculoase ale pieselor — energie maximă, atitudine și impact. Momentul în care explodezi pe scenă.', tags: ['Energie', 'Impact', 'Atitudine'] },
      { id: 'performance', name: 'Expresie & performance', kicker: 'facial & prezență', desc: 'Nu dansezi doar cu corpul. Lucrăm expresia facială, prezența scenică și conexiunea cu publicul — ca un idol adevărat.', tags: ['Facial', 'Prezență', 'Carismă'] },
    ],
  },
  benefits: {
    label: 'De ce KPOP',
    title: 'Mai mult decât o coregrafie',
    items: [
      { icon: 'brain', title: 'Memorare & coordonare', desc: 'Învățarea coregrafiilor antrenează memoria, atenția la detaliu și coordonarea întregului corp.' },
      { icon: 'star', title: 'Încredere pe scenă', desc: 'De la prima formație până la spectacol — fiecare apariție construiește curaj și prezență.' },
      { icon: 'users', title: 'Comunitate K-pop', desc: 'Întâlnești oameni cu aceeași pasiune. Grupa devine repede a doua ta familie.' },
      { icon: 'heart', title: 'Condiție fizică', desc: 'Coregrafiile intense sunt un workout complet — distractiv și fără să simți că faci sport.' },
    ],
  },
  ageGroups: {
    label: 'Grupe de vârstă',
    title: 'De la Junior la Students',
    desc: 'KPOP dance la Quasar are grupe pentru copii, adolescenți și tineri — fiecare cu nivelul și energia potrivită.',
    groups: [
      { label: 'Junior', age: '7–10 ani' },
      { label: 'Varsity', age: '11–15 ani' },
      { label: 'Teens', age: '15–18 ani' },
      { label: 'Students', age: '19–25 ani' },
    ],
  },
  levels: standardLevels,
  faqs: [
    { q: 'Trebuie să știu deja coregrafii K-pop?', a: 'Nu. Începem de la zero, descompunem fiecare mișcare și o reluăm până iese. Vino cu entuziasm, restul construim împreună.' },
    { q: 'Pentru ce vârste este KPOP dance?', a: 'Avem grupe de la 7 ani (Junior) până la 25 de ani (Students). Fiecare grupă lucrează piese potrivite vârstei și nivelului.' },
    { q: 'Ce piese învățăm?', a: 'Coregrafii K-pop actuale și populare, alese împreună cu grupa. Lucrăm spre apariții la spectacolele Quasar și dance cover-uri.' },
    { q: 'Ce port la oră?', a: 'Haine lejere în care te poți mișca și încălțăminte sport de interior. Comodul e cheia.' },
    { q: 'Pot veni la o oră de probă?', a: 'Sigur! Contactează-ne și îți programăm o ședință de probă ca să simți energia grupei.' },
  ],
  ctaTitle: 'Gata să dansezi ca un idol?',
  ctaDesc:
    'Rezervă-ți locul la cursurile de KPOP dance din Iași. Te ajutăm să alegi grupa și nivelul potrivit.',
}

/* ── Gimnastică artistică ───────────────────────────────────────────────── */

const gimnastica: CourseConfig = {
  slug: 'gimnastica',
  metaTitle: 'Cursuri Gimnastică Artistică în Iași — Copii & Adolescenți | Quasar Dance',
  metaDescription:
    'Cursuri de gimnastică artistică în Iași pentru copii și adolescenți: forță, flexibilitate, echilibru și elemente acrobatice (roata, podul, stând în mâini, sfoara). Metodologie profesionistă și cadru sigur la Quasar Dance, grupe de la 4 ani.',
  keywords: [
    'cursuri gimnastica Iași',
    'gimnastica artistica Iași',
    'gimnastica copii Iași',
    'gimnastica acrobatica Iași',
    'cursuri acrobatie Iași',
    'școală de dans Iași',
    'Quasar Dance',
  ],
  ogTitle: 'Cursuri Gimnastică Artistică în Iași | Quasar Dance',
  ogDescription:
    'Forță, flexibilitate, echilibru și curaj. Gimnastică artistică pentru copii și adolescenți în Iași, cu metodologie profesionistă.',
  jsonLdName: 'Cursuri Gimnastică Artistică — Quasar Dance Iași',
  jsonLdDescription:
    'Cursuri de gimnastică artistică în Iași pentru copii și adolescenți: forță, flexibilitate, echilibru și elemente acrobatice, într-un cadru sigur și cu metodologie profesionistă.',
  sprayLabel: 'Gimnastică',
  heroBadge: 'Forță & mobilitate',
  heroBadgeIcon: 'dumbbell',
  titleLine1: 'Cursuri de Gimnastică artistică',
  titleAccent: 'în Iași',
  heroDesc:
    'Forță, flexibilitate, echilibru și curaj. Program structurat, cu metodologie profesionistă și cadru sigur, unde copilul își testează limitele — de la primii pași până la elemente acrobatice spectaculoase.',
  heroImage: '/cursuri/gimnastica.jpg',
  heroImageAlt: 'Instructor Quasar Dance care ghidează un copil la un element de gimnastică în Iași',
  stats: brandStats,
  picker: {
    label: 'Ce înveți',
    title: 'De la primul pod',
    titleAccent: 'la elemente acrobatice',
    intro:
      'Gimnastica construiește corpul pas cu pas — mobilitate, forță și control. Apasă ca să vezi ce lucrăm la fiecare nivel.',
    items: [
      { id: 'flexibilitate', name: 'Flexibilitate & mobilitate', kicker: 'podul, sfoara, deschideri', desc: 'Lucrăm gradual și sigur mobilitatea articulară: podul, sfoara, deschiderile. Baza pentru orice element frumos și sănătos.', tags: ['Podul', 'Sfoara', 'Stretching'] },
      { id: 'forta', name: 'Forță & echilibru', kicker: 'stând în mâini, planșe', desc: 'Forța de bază a corpului și echilibrul: stând în mâini, planșe, susțineri. Controlul care face diferența.', tags: ['Stând în mâini', 'Core', 'Echilibru'] },
      { id: 'acrobatie', name: 'Elemente acrobatice', kicker: 'roata, rondat, rulări', desc: 'Roata, rondatul, rulările și primele elemente acrobatice — învățate progresiv, cu siguranță și încredere.', tags: ['Roata', 'Rondat', 'Rulări'] },
      { id: 'coordonare', name: 'Coordonare & control', kicker: 'sărituri & aterizări', desc: 'Sărituri, aterizări sigure și coordonare fină. Corpul învață să se miște precis și controlat.', tags: ['Sărituri', 'Aterizări', 'Precizie'] },
    ],
  },
  benefits: {
    label: 'De ce gimnastică',
    title: 'O bază pentru orice',
    items: [
      { icon: 'activity', title: 'Postură & sănătate', desc: 'Spate drept, articulații mobile și un corp puternic — beneficii care rămân pe viață.' },
      { icon: 'shield', title: 'Disciplină & curaj', desc: 'Fiecare element nou cere răbdare și curaj. Copilul învață să-și depășească fricile, pas cu pas.' },
      { icon: 'dumbbell', title: 'Bază pentru orice sport', desc: 'Forța, mobilitatea și coordonarea din gimnastică ajută la dans, sport și mișcare în general.' },
      { icon: 'target', title: 'Coordonare & control', desc: 'Conștientizarea corpului în spațiu se dezvoltă puternic — util în orice activitate.' },
    ],
  },
  ageGroups: {
    label: 'Grupe de vârstă',
    title: 'De la Tiny la Teens',
    desc: 'Gimnastica artistică la Quasar are grupe pentru fiecare etapă de dezvoltare, de la cei mici la adolescenți.',
    groups: [
      { label: 'Tiny', age: '4–7 ani' },
      { label: 'Junior', age: '7–10 ani' },
      { label: 'Varsity', age: '11–15 ani' },
      { label: 'Teens', age: '15–18 ani' },
    ],
  },
  levels: {
    label: 'Drumul tău',
    title: 'Progres sigur, pas cu pas',
    items: [
      { num: '01', title: 'Începător', desc: 'Mobilitate de bază, forță și primele elemente — într-un cadru sigur și prietenos.' },
      { num: '02', title: 'Intermediar', desc: 'Podul, sfoara, stând în mâini și roata se consolidează. Crește încrederea.' },
      { num: '03', title: 'Avansat', desc: 'Elemente acrobatice combinate și control fin al corpului.' },
      { num: '04', title: 'Performanță', desc: 'Demonstrații și apariții la spectacolele Quasar. Corpul devine instrument.' },
    ],
  },
  faqs: [
    { q: 'De la ce vârstă se poate începe gimnastica?', a: 'De la 4 ani, în grupa Tiny. Lucrăm potrivit vârstei, prin joc și exerciții sigure, până la adolescenți.' },
    { q: 'Copilul meu nu e flexibil. Poate începe?', a: 'Absolut. Flexibilitatea se construiește la fiecare oră, gradual și fără forțare. Exact pentru asta vii la curs.' },
    { q: 'Este sigur? Cum preveniți accidentările?', a: 'Da. Lucrăm progresiv, cu saltele și asistență, iar instructorii sunt formați să predea fiecare element în siguranță.' },
    { q: 'Ce trebuie să poarte copilul?', a: 'Haine lejere și elastice (colanți, tricou) în care se poate mișca liber. Lucrăm desculți sau cu șosete antiderapante.' },
    { q: 'Pot veni la o oră de probă?', a: 'Da! Contactează-ne și programăm o ședință de probă, ca să vedeți atmosfera și abordarea noastră.' },
  ],
  ctaTitle: 'Gata să-și testeze limitele?',
  ctaDesc:
    'Rezervă-i un loc la cursurile de gimnastică artistică din Iași. Te ajutăm să alegi grupa potrivită vârstei.',
}

/* ── Zumba (Adults) ─────────────────────────────────────────────────────── */

const zumba: CourseConfig = {
  slug: 'zumba',
  metaTitle: 'Cursuri Zumba în Iași — Fitness Dance cu Ritmuri Latino | Quasar Dance',
  metaDescription:
    'Cursuri de Zumba în Iași pentru adulți: workout cu ritmuri latino (salsa, reggaeton, merengue, cumbia), distractiv și intens, fără presiune tehnică. Arzi calorii dansând la Quasar Dance, la orice nivel de fitness.',
  keywords: [
    'cursuri zumba Iași',
    'zumba Iași',
    'fitness dance Iași',
    'dans fitness adulți Iași',
    'workout latino Iași',
    'școală de dans Iași',
    'Quasar Dance',
  ],
  ogTitle: 'Cursuri Zumba în Iași | Quasar Dance',
  ogDescription:
    'Workout cu ritmuri latino, distractiv și intens. Arzi calorii dansând la Zumba, în Iași, la Quasar Dance.',
  jsonLdName: 'Cursuri Zumba — Quasar Dance Iași',
  jsonLdDescription:
    'Cursuri de Zumba în Iași pentru adulți: workout cu ritmuri latino (salsa, reggaeton, merengue, cumbia), distractiv și intens, fără presiune tehnică.',
  sprayLabel: 'Zumba',
  heroBadge: 'Workout cu ritmuri latino',
  heroBadgeIcon: 'flame',
  titleLine1: 'Cursuri de Zumba',
  titleAccent: 'în Iași',
  heroDesc:
    'Workout cu ritmuri latino, distractiv și intens. Arzi calorii dansând pe salsa, reggaeton și merengue — fără presiune tehnică, doar energie pură și voie bună. Pentru adulți, la orice nivel de fitness.',
  stats: brandStats,
  picker: {
    label: 'Ritmurile',
    title: 'Energie latino',
    titleAccent: 'la fiecare oră',
    intro:
      'Zumba amestecă ritmuri latino într-un workout care nu se simte ca o sală. Apasă ca să descoperi vibe-ul fiecărui ritm.',
    items: [
      { id: 'salsa', name: 'Salsa', kicker: 'ritm latino clasic', desc: 'Pașii vioi și șoldurile care nu stau locului. Ritmul care a făcut Zumba celebră — energic și antrenant.', tags: ['Șolduri', 'Vioi', 'Clasic'] },
      { id: 'reggaeton', name: 'Reggaeton', kicker: 'urban & energic', desc: 'Ritm urban, puternic și plin de atitudine. Partea cea mai „street" a orei de Zumba.', tags: ['Urban', 'Atitudine', 'Beat'] },
      { id: 'merengue', name: 'Merengue', kicker: 'rapid & vesel', desc: 'Ritm rapid, simplu și super vesel. Perfect ca să-ți crești pulsul și buna dispoziție.', tags: ['Rapid', 'Vesel', 'Cardio'] },
      { id: 'cumbia', name: 'Cumbia', kicker: 'groove latino', desc: 'Groove latino relaxat și prietenos, ușor de prins. Te leagănă și te face să zâmbești.', tags: ['Groove', 'Prietenos', 'Fun'] },
    ],
  },
  benefits: {
    label: 'De ce Zumba',
    title: 'Sport care nu pare sport',
    items: [
      { icon: 'flame', title: 'Arzi calorii', desc: 'Un workout cardio complet de aproape o oră — fără să simți că ești la sală.' },
      { icon: 'smile', title: 'Fără presiune', desc: 'Nu există pași greșiți. Vii, te miști, te distrezi. Atât. Restul vine de la sine.' },
      { icon: 'heart', title: 'Inimă sănătoasă', desc: 'Mișcarea ritmică susține sănătatea cardiovasculară și îți încarcă bateriile.' },
      { icon: 'users', title: 'Energie & voie bună', desc: 'O comunitate caldă de adulți care vin pentru mișcare, muzică și o stare de bine.' },
    ],
  },
  faqs: [
    { q: 'Trebuie să știu să dansez?', a: 'Deloc. Zumba e despre distracție, nu despre tehnică. Urmărești instructorul și te lași purtat de muzică — totul vine natural.' },
    { q: 'Pentru ce nivel de fitness este?', a: 'Pentru orice nivel. Mergi în ritmul tău, crești intensitatea când te simți pregătit. Fiecare oră e adaptabilă.' },
    { q: 'Ce port la oră?', a: 'Haine sport comode și încălțăminte de interior cu talpă bună. Adu apă și un prosop — vei transpira (în sens bun).' },
    { q: 'Pot veni la o oră de probă?', a: 'Sigur! Contactează-ne și îți programăm o ședință de probă ca să simți energia.' },
  ],
  ctaTitle: 'Gata să dansezi pentru tine?',
  ctaDesc:
    'Rezervă-ți locul la cursurile de Zumba din Iași. Vino să te miști, să arzi calorii și să-ți încarci bateriile.',
}

export const courses: Record<string, CourseConfig> = {
  'street-dance': streetDance,
  'kpop-dance': kpopDance,
  gimnastica,
  zumba,
}

export function courseMetadata(slug: string): Metadata {
  const c = courses[slug]
  return {
    title: c.metaTitle,
    description: c.metaDescription,
    keywords: c.keywords,
    alternates: { canonical: `/cursuri/${c.slug}` },
    openGraph: {
      title: c.ogTitle,
      description: c.ogDescription,
      url: `https://quasardance.ro/cursuri/${c.slug}`,
      siteName: 'Quasar Dance',
      locale: 'ro_RO',
      type: 'website',
    },
  }
}

export function courseJsonLd(slug: string) {
  const c = courses[slug]
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: c.jsonLdName,
    description: c.jsonLdDescription,
    inLanguage: 'ro',
    provider: {
      '@type': 'Organization',
      name: 'Quasar Dance',
      url: 'https://quasardance.ro',
      sameAs: 'https://quasardance.ro',
    },
    areaServed: { '@type': 'City', name: 'Iași' },
    audience: { '@type': 'EducationalAudience', educationalRole: 'student' },
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'onsite',
      location: {
        '@type': 'Place',
        name: 'Quasar Dance',
        address: { '@type': 'PostalAddress', addressLocality: 'Iași', addressCountry: 'RO' },
      },
    },
  }
}
