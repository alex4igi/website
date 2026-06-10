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
  heroVideoId?: string
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
    groups: { label: string; age: string; theme?: string; desc?: string }[]
  }
  // Progression levels (optional)
  levels?: { label: string; title: string; items: { num: string; title: string; desc: string }[] }
  // FAQ
  faqs: { q: string; a: string }[]
  // CTA
  ctaTitle: string
  ctaDesc: string
}

const brandStats = [
  { v: '600+', l: 'membri activi' },
  { v: '200+', l: 'trofee & premii' },
  { v: '40+', l: 'ani de experiență' },
]

/* ── Street Dance ───────────────────────────────────────────────────────── */

const streetDance: CourseConfig = {
  slug: 'street-dance',
  metaTitle: 'Cursuri Street Dance în Iași — Hip-Hop, Dancehall & Dans Urban | Quasar Dance',
  metaDescription:
    'Cursuri de streetdance în Iași pentru copii și adolescenți: Hip-Hop, Dancehall, House, Waacking, Pop & Lock, Vogueing și MTV Commercial, cu fundament tehnic din Jazz-Dance. Metodologie proprie, grupe de la 4 ani și ședință de probă la Quasar Dance.',
  keywords: [
    'cursuri street dance Iași',
    'street dance Iași',
    'hip hop Iași',
    'dancehall Iași',
    'dans urban Iași',
    'cursuri hip hop copii Iași',
    'mtv commercial Iași',
    'școală de dans Iași',
    'Quasar Dance',
  ],
  ogTitle: 'Cursuri Street Dance în Iași | Quasar Dance',
  ogDescription:
    'Hip-Hop, Dancehall, House, Waacking, Pop & Lock și MTV Commercial. Dansul urban autentic în Iași, pentru copii și adolescenți. Tradiție din 1981.',
  jsonLdName: 'Cursuri Street Dance — Quasar Dance Iași',
  jsonLdDescription:
    'Cursuri de streetdance în Iași: Hip-Hop, Dancehall, House, Waacking, Pop & Lock, Vogueing și MTV Commercial, cu fundament din Jazz-Dance, pentru copii și adolescenți.',
  sprayLabel: 'Street Dance',
  heroBadge: 'Din 1981 în Iași',
  heroBadgeIcon: 'flame',
  titleLine1: 'Cursuri de Street Dance',
  titleAccent: 'în Iași',
  heroDesc:
    'Descoperă magia dansului urban: Hip-Hop, Dancehall, House, Waacking, Pop & Lock și Vogueing, plus MTV Commercial pentru prezență scenică — totul pe un fundament tehnic solid din Jazz-Dance. Mai mult decât mișcare: copiii își descoperă personalitatea, leagă prietenii și învață să lucreze în echipă.',
  heroImage: '/cursuri/studenti.jpg',
  heroImageAlt: 'Grupă de street dance Quasar Dance din Iași într-o poză de echipă',
  heroVideoId: 'fDFX2OUwC4g',
  stats: brandStats,
  picker: {
    label: 'Ce stiluri învățăm',
    title: 'Un univers întreg',
    titleAccent: 'de stiluri urbane',
    intro:
      'La baza cursurilor stă o varietate plină de energie de stiluri de streetdance, toate clădite pe un fundament tehnic din Jazz-Dance — pentru o postură corectă și o bază puternică. Apasă ca să le descoperi.',
    items: [
      {
        id: 'hip-hop',
        name: 'Hip-Hop',
        kicker: 'fundamentul · ideal pentru începători',
        desc: 'Groove, bounce și atitudine. Stilul-fundament cu care începem mereu — accesibil, distractiv și plin de energie. De aici pornește orice street dancer.',
        tags: ['Groove', 'Bounce', 'Freestyle'],
      },
      {
        id: 'mtv-commercial',
        name: 'MTV Commercial',
        kicker: 'atitudine & prezență scenică',
        desc: 'Stilul din videoclipuri care îi ajută enorm pe copii să își dezvolte prezența scenică, atitudinea și încrederea în sine. Spectaculos și foarte motivant.',
        tags: ['Prezență', 'Atitudine', 'Încredere'],
      },
      {
        id: 'dancehall',
        name: 'Dancehall',
        kicker: 'Jamaica · atitudine & ritm',
        desc: 'Energia explozivă a străzilor din Jamaica. Un stil plin de atitudine, ritm și expresivitate, construit pe mișcări autentice care spun povești și transmit emoție prin fiecare pas.',
        tags: ['Atitudine', 'Ritm', 'Expresivitate'],
      },
      {
        id: 'house',
        name: 'House',
        kicker: 'club scene · footwork rapid',
        desc: 'Footwork rapid, jacking și fluiditate pe muzică house. Conexiune cu ritmul și multă libertate de mișcare.',
        tags: ['Footwork', 'Jacking', 'Fluiditate'],
      },
      {
        id: 'waacking',
        name: 'Waacking',
        kicker: 'disco anii ’70 · expresie',
        desc: 'Mișcări dramatice ale brațelor, poze și expresivitate maximă pe muzică disco & funk. Stil teatral, plin de personalitate.',
        tags: ['Brațe', 'Poze', 'Expresie'],
      },
      {
        id: 'pop-lock',
        name: 'Pop & Lock',
        kicker: 'funk · control & iluzii',
        desc: 'Popping și locking: contracții pe ritm, „lock"-uri energice, robotică și iluzii. Control total al corpului și multă atitudine funky.',
        tags: ['Hits', 'Locks', 'Control'],
      },
      {
        id: 'vogueing',
        name: 'Vogueing',
        kicker: 'ballroom · atitudine',
        desc: 'Linii dramatice, poze și prezență scenică inspirate din cultura ballroom. Expresie, încredere și caracter pe ritmuri energice.',
        tags: ['Poze', 'Linii', 'Prezență'],
      },
    ],
  },
  benefits: {
    label: 'De ce street dance',
    title: 'Mai mult decât pași de dans',
    items: [
      { icon: 'heart', title: 'Condiție fizică', desc: 'Coordonare, forță și postură corectă — beneficiile mișcării, fără să simtă că face sport.' },
      { icon: 'brain', title: 'Memorie & disciplină', desc: 'Coregrafiile antrenează memoria, concentrarea și disciplina, reducând în același timp stresul.' },
      { icon: 'users', title: 'Comunitate & prietenii', desc: 'O comunitate în care copilul se simte integrat și fericit. Prietenii de la dans devin prietenii pentru viață.' },
      { icon: 'music', title: 'Muzicalitate & cultură', desc: 'Înveți nu doar pașii, ci muzica și cultura din spate — îți construiești un „vocabular” propriu de mișcări.' },
    ],
  },
  ageGroups: {
    label: 'Grupele noastre',
    title: 'O abordare adaptată fiecărei vârste',
    desc:
      'Fiecare etapă de creștere este unică, așa că adaptăm metoda de predare pentru fiecare grupă de vârstă.',
    image: '/cursuri/cursuri-tiny.jpg',
    imageAlt: 'Copil și instructor Quasar Dance la cursul de street dance pentru cei mici din Iași',
    groups: [
      { label: 'Tiny', age: '4–6 ani', theme: 'Joacă & Coordonare', desc: 'Totul e o poveste! Prin joculețe muzicale și melodii vesele, cei mici învață ritmul, își coordonează corpul și se îndrăgostesc de mișcare.' },
      { label: 'Junior', age: '7–10 ani', theme: 'Echipă & Prezență scenică', desc: 'Energia crește! Vocabular vast de mișcări, lucru în echipă și prezență scenică. Învață să aibă curaj și să se susțină reciproc.' },
      { label: 'Varsity', age: '11–14 ani', theme: 'Personalitate & Curaj', desc: 'Încurajăm puternic dezvoltarea personalității. Introducem freestyle-ul (improvizația), pentru libertatea de a gândi independent și a-și găsi propriul stil.' },
      { label: 'Teens', age: '15–19 ani', theme: 'Vocabular, Improvizație & Comunitate', desc: 'Focus pe rafinarea tehnicii, improvizație și spirit de echipă, într-un mediu în care tinerii se simt acceptați și ascultați.' },
    ],
  },
  levels: {
    label: 'Cum decurge învățarea',
    title: 'Călătoria pașilor de dans',
    items: [
      { num: '01', title: 'ABC-ul dansului', desc: 'Ne împrietenim cu postura și învățăm mișcările de bază prin scurte coregrafii, pe muzică specifică — construim un „vocabular” de mișcări și înțelegem contextul.' },
      { num: '02', title: 'Diversitate & noutate', desc: 'Copiii se plictisesc repede, așa că aducem mereu ceva nou: informații proaspete și cele mai actuale melodii, pentru entuziasm la cote maxime.' },
      { num: '03', title: 'Momentul de strălucire', desc: 'Odată stăpânite bazele, compunem coregrafii spectaculoase cu care urcăm pe scenă, la spectacole și concursuri. Momentul lor să strălucească!' },
    ],
  },
  faqs: [
    { q: 'Trebuie să fi dansat înainte?', a: 'Deloc. Începem mereu cu o bază accesibilă și distractivă — Hip-Hop, MTV Commercial și Dancehall — și construim totul de la zero, pas cu pas.' },
    { q: 'Care sunt beneficiile dansului pentru copilul meu?', a: 'Pe lângă o condiție fizică excelentă, dansul îmbunătățește memoria și disciplina, reduce stresul și, cel mai important, oferă o comunitate în care copilul se simte integrat și fericit.' },
    { q: 'Cum trebuie să se îmbrace la cursuri?', a: 'Recomandăm haine lejere (trening, tricou, pantaloni confortabili) și o pereche de adidași curați, folosiți exclusiv în sala de dans, pentru a menține un mediu curat și sigur.' },
    { q: 'De la ce vârstă se poate începe?', a: 'De la 4 ani, în grupa Tiny. Avem grupe adaptate pentru fiecare etapă, până la adolescenți.' },
    { q: 'Poate veni la o ședință de probă?', a: 'Bineînțeles! Știm că la început poate exista puțină timiditate. Vă așteptăm cu drag la o primă ședință, ca să cunoașteți instructorii, colegii și energia din sala noastră.' },
  ],
  ctaTitle: 'Gata să faci primul pas?',
  ctaDesc:
    'Rezervă-ți locul la o ședință de probă de street dance în Iași. Te ajutăm să alegi grupa, nivelul și locația potrivită.',
}

/* ── KPOP Dance ─────────────────────────────────────────────────────────── */

const kpopDance: CourseConfig = {
  slug: 'kpop-dance',
  metaTitle: 'Cursuri KPOP Dance în Iași — Coregrafii K-Pop & Dance Cover | Quasar Dance',
  metaDescription:
    'Cursuri de K-Pop în Iași pentru copii și adolescenți: stil Dance Cover — coregrafiile consacrate ale trupelor preferate (BTS, BLACKPINK, Stray Kids, NewJeans), sincronizare perfectă și comunitate vibrantă la Quasar Dance. Ședință de probă disponibilă.',
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
  ogTitle: 'Cursuri K-Pop în Iași | Quasar Dance',
  ogDescription:
    'Stil Dance Cover: coregrafiile idolilor (BTS, BLACKPINK, Stray Kids, NewJeans), sincron de grup și energie maximă. Comunitatea K-Pop din Iași te așteaptă la Quasar Dance.',
  jsonLdName: 'Cursuri K-Pop Dance — Quasar Dance Iași',
  jsonLdDescription:
    'Cursuri de K-Pop în Iași, stil Dance Cover: coregrafiile consacrate ale trupelor K-Pop, sincronizare de grup și performance, pentru copii și adolescenți.',
  sprayLabel: 'KPOP Dance',
  heroBadge: 'Stil Dance Cover',
  heroBadgeIcon: 'sparkles',
  titleLine1: 'Cursuri de K-Pop',
  titleAccent: 'în Iași',
  heroDesc:
    'Pasiunea copilului tău prinde viață pe scenă! Cursuri de K-Pop axate pe Dance Cover — învățăm pas cu pas coregrafiile consacrate ale trupelor preferate (BTS, BLACKPINK, Stray Kids, NewJeans și mulți alții), cu sincronizare perfectă și energie de grup. Transformăm timpul din fața ecranelor într-o activitate sănătoasă și o experiență socială extraordinară.',
  heroImage: '/cursuri/k-pop-dance.jpg',
  heroImageAlt: 'Dansatoare KPOP Quasar Dance pe scenă, în spectacol, în Iași',
  heroVideoId: 'o8T_WL3xmfo',
  stats: brandStats,
  picker: {
    label: 'Ce învățăm',
    title: 'Dansăm exact',
    titleAccent: 'ca idolii noștri',
    intro:
      'Spre deosebire de alte stiluri unde coregrafia e creată de instructor, cursurile de K-Pop se concentrează pe Dance Cover. Apasă ca să vezi ce lucrăm la fiecare oră.',
    items: [
      { id: 'dance-cover', name: 'Dance Cover', kicker: 'coregrafiile idolilor', desc: 'Sub îndrumarea instructorilor, învățăm pas cu pas coregrafiile consacrate ale celor mai iubite trupe K-Pop — BTS, BLACKPINK, Stray Kids, NewJeans și mulți alții.', tags: ['BTS', 'BLACKPINK', 'NewJeans'] },
      { id: 'sincron', name: 'Sincron & formații', kicker: 'ca un singur corp', desc: 'Coregrafiile K-Pop sunt renumite pentru formațiile complexe și sincronizarea perfectă. Învățăm să lucrăm în echipă pentru ca dansul final să arate impecabil.', tags: ['Formație', 'Spacing', 'Timing'] },
      { id: 'comeback', name: 'Comeback-uri actuale', kicker: 'mereu la curent', desc: 'Cultura K-Pop e dinamică! De fiecare dată când o trupă lansează o piesă nouă (un „comeback”), o aducem direct în sala de dans.', tags: ['Piese noi', 'Trenduri', 'Fresh'] },
      { id: 'performance', name: 'Detalii & scenă', kicker: 'ca niște idoli', desc: 'Atenție la detalii, prezență scenică și expresie. Cursanții urcă pe scenă la spectacolele și concursurile Quasar și se simt ca niște adevărați idoli.', tags: ['Detaliu', 'Prezență', 'Carismă'] },
    ],
  },
  benefits: {
    label: 'De ce K-Pop',
    title: 'Mai mult decât o coregrafie',
    items: [
      { icon: 'brain', title: 'Memorie & coordonare', desc: 'Coregrafiile necesită concentrare și reținerea pașilor — antrenând memoria și coordonarea întregului corp.' },
      { icon: 'star', title: 'Înlătură timiditatea', desc: 'De la prima formație la scenă, fiecare apariție crește încrederea și ajută copilul să își depășească timiditatea.' },
      { icon: 'users', title: 'Prieteni & comunitate', desc: 'Copilul e înconjurat de prieteni de vârsta lui, cu un subiect comun de pasiune. Cursanții devin o adevărată comunitate.' },
      { icon: 'heart', title: 'Condiție fizică', desc: 'Transformăm timpul petrecut în fața ecranelor într-o activitate fizică sănătoasă și super distractivă.' },
    ],
  },
  ageGroups: {
    label: 'Grupe de vârstă',
    title: 'De la Junior la Students',
    desc: 'Cursurile de K-Pop la Quasar au grupe pentru copii, adolescenți și tineri — fiecare cu nivelul și energia potrivită.',
    image: '/images/kpop.webp',
    imageAlt: 'Grupă de cursanți K-Pop Quasar Dance în timpul unei coregrafii Dance Cover în Iași',
    groups: [
      { label: 'Junior', age: '7–10 ani' },
      { label: 'Varsity', age: '11–14 ani' },
      { label: 'Teens', age: '15–19 ani' },
      { label: 'Students', age: '20–25 ani' },
    ],
  },
  levels: {
    label: 'Pe parcursul anului',
    title: 'Din sala de dans, în comunitate',
    items: [
      { num: '01', title: 'K-Pop Random Dance', desc: 'De Ziua Internațională a Dansului organizăm evenimente în aer liber: dăm drumul la muzică, iar fanii sar în mijloc și dansează împreună toate coregrafiile pe care le știu. O explozie de energie și încredere!' },
      { num: '02', title: 'Spectacole Quasar', desc: 'Cursanții urcă pe scenă, își prezintă munca și se simt ca niște adevărați „idoli” în cadrul spectacolelor noastre.' },
      { num: '03', title: 'Concursuri', desc: 'Iubim să vedem cum pasiunea dă roade — oferim ocazia de a concura și de a duce coregrafiile învățate la nivelul următor.' },
    ],
  },
  faqs: [
    { q: 'Este potrivit dacă nu a mai dansat?', a: 'Absolut! Coregrafiile K-Pop sunt explicate de instructori cu multă răbdare, pas cu pas. Entuziasmul și dragostea pentru muzică sunt singurele cerințe.' },
    { q: 'De ce să aleg un curs de K-Pop?', a: 'Dincolo de distracție, K-Pop-ul îmbunătățește memoria, coordonarea și condiția fizică și ajută la înlăturarea timidității. În plus, copilul va fi înconjurat de prieteni de vârsta lui, cu un subiect comun de discuție.' },
    { q: 'Ce piese învățăm?', a: 'Coregrafiile celor mai iubite trupe K-Pop (BTS, BLACKPINK, Stray Kids, NewJeans și alții). De câte ori apare un „comeback”, îl aducem direct în sala de dans.' },
    { q: 'Ce port la oră?', a: 'Haine lejere în care te poți mișca și încălțăminte sport de interior. Comodul e cheia.' },
    { q: 'Pot veni la o ședință de probă?', a: 'Sigur! Contactează-ne și îți programăm o ședință de probă, ca să simți energia grupei.' },
  ],
  ctaTitle: 'Gata să dansezi ca un idol?',
  ctaDesc:
    'Pasiunea copilului tău merită o scenă adevărată. Rezervă-ți locul la cursurile de K-Pop din Iași — te ajutăm să alegi grupa potrivită.',
}

/* ── Gimnastică acrobatică ──────────────────────────────────────────────── */

const gimnastica: CourseConfig = {
  slug: 'gimnastica',
  metaTitle: 'Cursuri Gimnastică Acrobatică în Iași — Copii & Adolescenți | Quasar Dance',
  metaDescription:
    'Cursuri de gimnastică acrobatică în Iași pentru copii și adolescenți: forță, mobilitate, echilibru și elemente acrobatice (roata, salturi, trick-uri). Antrenori licențiați FEFS Iași, abordare 100% personalizată și siguranță maximă la Quasar Dance.',
  keywords: [
    'cursuri gimnastica Iași',
    'gimnastica acrobatica Iași',
    'gimnastica copii Iași',
    'acrobatie Iași',
    'cursuri acrobatica copii Iași',
    'școală de dans Iași',
    'Quasar Dance',
  ],
  ogTitle: 'Cursuri Gimnastică Acrobatică în Iași | Quasar Dance',
  ogDescription:
    'Forță, mobilitate, echilibru și trick-uri spectaculoase. Gimnastică acrobatică pentru copii și adolescenți în Iași, cu antrenori licențiați FEFS.',
  jsonLdName: 'Cursuri Gimnastică Acrobatică — Quasar Dance Iași',
  jsonLdDescription:
    'Cursuri de gimnastică acrobatică în Iași pentru copii și adolescenți: forță, mobilitate, echilibru și elemente acrobatice, cu antrenori licențiați FEFS și siguranță maximă.',
  sprayLabel: 'Gimnastică acrobatică',
  heroBadge: 'Forță & control corporal',
  heroBadgeIcon: 'dumbbell',
  titleLine1: 'Cursuri de Gimnastică acrobatică',
  titleAccent: 'în Iași',
  heroDesc:
    'Transformăm energia debordantă a copilului în agilitate, forță și încredere. Într-un mediu organizat, sigur și profesionist, construim control corporal, disciplină și abilități uimitoare de care va fi extrem de mândru — pas cu pas, în deplină siguranță.',
  heroImage: '/cursuri/gimnastica.jpg',
  heroImageAlt: 'Instructor Quasar Dance care ghidează un copil la un element de gimnastică acrobatică în Iași',
  heroVideoId: 'dsuhJptVr4w',
  stats: brandStats,
  picker: {
    label: 'Ce lucrăm',
    title: 'De la fundație',
    titleAccent: 'la trick-uri spectaculoase',
    intro:
      'Construim corpul pas cu pas: înainte de elementele spectaculoase, punem un accent uriaș pe baza fizică — secretul oricărui element acrobatic reușit. Apasă ca să vezi ce lucrăm.',
    items: [
      { id: 'forta', name: 'Forță & fundație', kicker: 'baza oricărui element', desc: 'Înainte de orice element acrobatic, construim forța de bază a corpului. O fundație solidă și sigură pe care se clădește tot restul.', tags: ['Core', 'Forță', 'Fundație'] },
      { id: 'mobilitate', name: 'Mobilitate & echilibru', kicker: 'podul, sfoara, stretching', desc: 'Lucrăm gradual mobilitatea articulară și echilibrul — podul, sfoara, deschiderile — pentru mișcări frumoase și sănătoase.', tags: ['Podul', 'Sfoara', 'Echilibru'] },
      { id: 'acrobatie', name: 'Elemente acrobatice', kicker: 'roata, salturi, trick-uri', desc: 'Roata, salturile și primele trick-uri spectaculoase — învățate progresiv, cu asistență fizică și echipamente de protecție.', tags: ['Roata', 'Salturi', 'Trick-uri'] },
      { id: 'coordonare', name: 'Coordonare & control', kicker: 'desprindere & aterizări', desc: 'Sărituri, desprinderi și aterizări sigure. Corpul învață să se miște precis și controlat, în deplină siguranță.', tags: ['Desprindere', 'Aterizări', 'Precizie'] },
    ],
  },
  benefits: {
    label: 'De ce gimnastică acrobatică',
    title: 'Mai mult decât acrobație',
    items: [
      { icon: 'dumbbell', title: 'Forță & control corporal', desc: 'Canalizăm energia debordantă în forță, mobilitate și control — abilități de care copilul va fi mândru.' },
      { icon: 'shield', title: 'Siguranța pe primul loc', desc: 'Totul se învață treptat, cu saltele, echipamente de protecție și supraveghere permanentă. Niciun element nu e forțat.' },
      { icon: 'star', title: 'Antrenori licențiați FEFS', desc: 'Cursuri susținute exclusiv de absolvenți ai Facultății de Educație Fizică și Sport din Iași, cu diplomă de licență.' },
      { icon: 'activity', title: 'Completare pentru dansatori', desc: 'Mobilitate, echilibru și trick-uri spectaculoase pe care le pot integra în coregrafiile de Streetdance sau K-Pop.' },
    ],
  },
  ageGroups: {
    label: 'Grupe de vârstă',
    title: 'De la Junior la Teens',
    desc: 'Gimnastica acrobatică începe de la 7 ani. Abordare 100% personalizată: progresul fiecărui copil se măsoară în funcție de capacitățile proprii, prin încurajare — nu prin presiune sau comparații.',
    image: '/images/gimnastica-acrobatica.jpeg',
    imageAlt: 'Copil la cursul de gimnastică acrobatică Quasar Dance executând un element, în Iași',
    groups: [
      { label: 'Junior', age: '7–10 ani' },
      { label: 'Varsity', age: '11–14 ani' },
      { label: 'Teens', age: '15–19 ani' },
    ],
  },
  levels: {
    label: 'Cum decurge o oră',
    title: 'Structura unui antrenament',
    items: [
      { num: '01', title: 'Încălzire & fundație', desc: 'Încălzire riguroasă și repetarea elementelor de bază. Toți mușchii sunt pregătiți pentru efort — o fundație solidă și sigură.' },
      { num: '02', title: 'Traseul dinamic', desc: 'Copiii nu așteaptă rândul! Un traseu interactiv cu „stații”, fiecare cu exerciții pentru forță, mobilitate, echilibru și coordonare.' },
      { num: '03', title: 'Atenție 1-la-1', desc: 'Super-puterea noastră: la stația instructorului, fiecare copil lucrează individual, fix la nivelul lui, asistat fizic la elementele noi.' },
      { num: '04', title: 'Forță & stretching', desc: 'Final cu un scurt program de forță adaptat vârstei și stretching, pentru relaxarea musculaturii și o dezvoltare armonioasă.' },
    ],
  },
  faqs: [
    { q: 'Este periculos pentru copilul meu?', a: 'Siguranța este prioritatea zero. Folosim saltele și echipamente specifice, iar copiii învață mai întâi cum să cadă corect și să se protejeze. Totul este strict supravegheat și asistat de profesioniști.' },
    { q: 'Cum trebuie să se îmbrace la curs?', a: 'Recomandăm haine mulate și elastice (colanți, bustieră/tricou mulat sau body de gimnastică) și părul prins. Antrenamentele se desfășoară desculț sau în șosete antiderapante, pentru o aderență perfectă.' },
    { q: 'Poate face gimnastică dacă merge și la cursuri de dans?', a: 'Absolut! Gimnastica acrobatică este o completare fenomenală pentru dansatori: mai multă mobilitate, echilibru și trick-uri spectaculoase pe care le pot introduce în coregrafiile de Streetdance sau K-Pop.' },
    { q: 'Copilul meu nu e flexibil. Poate începe?', a: 'Da. Mobilitatea se construiește la fiecare oră, gradual și fără forțare. Punem accent pe baza fizică — exact pentru asta vii la curs.' },
    { q: 'Cine susține cursurile?', a: 'Antrenori cu studii superioare — absolvenți ai FEFS Iași, cu diplomă de licență — care știu să comunice pe limba copiilor, să îi motiveze și să le clădească încrederea în propriile forțe.' },
  ],
  ctaTitle: 'Gata să-și canalizeze energia?',
  ctaDesc:
    'Rezervă-i un loc la cursurile de gimnastică acrobatică din Iași. Te ajutăm să alegi grupa potrivită vârstei.',
}

/* ── Zumba (Adulți) ─────────────────────────────────────────────────────── */

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
    'Petrecere de fitness de 60 de minute, cu ritmuri Latino și Africane. Arzi calorii dansând la Zumba, în Iași, la Quasar Dance.',
  jsonLdName: 'Cursuri Zumba — Quasar Dance Iași',
  jsonLdDescription:
    'Cursuri de Zumba în Iași pentru adulți: petrecere de fitness de 60 de minute cu ritmuri Latino și Africane, 100% pentru începători, fără presiune tehnică.',
  sprayLabel: 'Zumba',
  heroBadge: 'Latino & Afro · 60 min',
  heroBadgeIcon: 'flame',
  titleLine1: 'Cursuri de Zumba',
  titleAccent: 'în Iași',
  heroDesc:
    'Ora ta de energie, mișcare și deconectare! Am transformat antrenamentul de fitness într-o adevărată petrecere: 60 de minute de ritmuri Latino și Africane care te fac să uiți că faci efort. Pentru adulți, la orice nivel — fără experiență în dans.',
  heroImage: '/images/zumba.webp',
  heroImageAlt: 'Clasă de Zumba Quasar Dance în plină mișcare, pe ritmuri Latino, în Iași',
  heroVideoId: '4r8slr8w3d8',
  stats: brandStats,
  picker: {
    label: 'Ritmurile',
    title: 'Energie Latino & Afro',
    titleAccent: 'la fiecare oră',
    intro:
      'Zumba amestecă ritmuri Latino și Africane într-un workout care nu se simte ca o sală. Apasă ca să descoperi vibe-ul fiecărui ritm.',
    items: [
      { id: 'salsa', name: 'Salsa', kicker: 'ritm latino clasic', desc: 'Pașii vioi și șoldurile care nu stau locului. Ritmul care a făcut Zumba celebră — energic și antrenant.', tags: ['Șolduri', 'Vioi', 'Clasic'] },
      { id: 'reggaeton', name: 'Reggaeton', kicker: 'urban & energic', desc: 'Ritm urban, puternic și plin de atitudine. Partea cea mai „street" a orei de Zumba.', tags: ['Urban', 'Atitudine', 'Beat'] },
      { id: 'merengue', name: 'Merengue', kicker: 'rapid & vesel', desc: 'Ritm rapid, simplu și super vesel. Perfect ca să-ți crești pulsul și buna dispoziție.', tags: ['Rapid', 'Vesel', 'Cardio'] },
      { id: 'cumbia', name: 'Cumbia', kicker: 'groove latino', desc: 'Groove latino relaxat și prietenos, ușor de prins. Te leagănă și te face să zâmbești.', tags: ['Groove', 'Prietenos', 'Fun'] },
      { id: 'afro', name: 'Afro', kicker: 'ritmuri africane', desc: 'Ritmuri africane pline de energie și bună dispoziție, care aduc o vibrație aparte fiecărei ore de Zumba.', tags: ['Energie', 'Vibe', 'Cardio'] },
    ],
  },
  benefits: {
    label: 'De ce Zumba',
    title: 'Sport care nu pare sport',
    items: [
      { icon: 'flame', title: 'Arzi calorii', desc: 'O petrecere continuă de 60 de minute — un workout cardio complet, fără să simți că ești la sală.' },
      { icon: 'smile', title: '100% pentru începători', desc: 'Nu ai nevoie de experiență. Instructorul e mereu în fața ta, cu mișcări repetitive și ușor de memorat.' },
      { icon: 'sparkles', title: 'Metoda Cueing', desc: 'Ghidare vizuală, fără opriri pentru explicații tehnice — doar o trecere lină și naturală de la o mișcare la alta.' },
      { icon: 'users', title: 'Energie & deconectare', desc: 'Lași grijile la intrare. Arzi stresul și te umpli de energie pozitivă, cu zâmbetul pe buze.' },
    ],
  },
  faqs: [
    { q: 'Trebuie să știu să dansez?', a: 'Deloc. Zumba e 100% pentru începători. Instructorul e mereu în fața ta și folosește metoda Cueing (ghidare vizuală) — tu doar te lași purtată de muzică și urmezi mișcările.' },
    { q: 'Pentru ce vârstă și nivel de fitness este?', a: 'Pentru orice vârstă și orice nivel. La Zumba contează doar să te simți bine — mergi în ritmul tău și crești intensitatea când te simți pregătită.' },
    { q: 'Cine susține clasele?', a: 'Un instructor licențiat Zumba încă din 2020, cu zeci de evenimente și masterclass-uri organizate cu succes în toată zona Moldovei.' },
    { q: 'Ce port la oră?', a: 'Haine sport comode și încălțăminte de interior cu talpă bună. Adu apă și un prosop — vei transpira (în sens bun).' },
    { q: 'Pot veni la o oră de probă?', a: 'Sigur! Contactează-ne și îți programăm o ședință de probă ca să simți atmosfera.' },
  ],
  ctaTitle: 'Gata să dansezi pentru tine?',
  ctaDesc:
    'Lasă grijile la intrare și rezervă-ți locul la cursurile de Zumba din Iași. Vârsta sau condiția fizică nu contează — contează doar să te simți bine.',
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
