import type { Metadata } from 'next'
import Navbar from '@/components/sections/Navbar'
import Footer from '@/components/sections/Footer'
import SprayLabel from '@/components/ui/spray-label'

export const metadata: Metadata = {
  title: 'Politica cookies | Quasar Dance',
  description:
    'Află ce sunt cookie-urile, de ce le folosește Quasar Dance, ce categorii utilizăm și cât timp se păstrează.',
}

export default function PoliticaCookiesPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 bg-gradient-to-br from-[#231f20] via-[#2a2527] to-[#231f20] overflow-hidden">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f8ef21' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative max-w-4xl mx-auto px-5 md:px-8 text-center">
          <div className="mb-6 flex justify-center">
            <SprayLabel>Cookies</SprayLabel>
          </div>
          <h1
            className="text-white text-4xl md:text-6xl font-extrabold leading-tight text-balance"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Politica cookies
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-24 bg-white">
        <article className="max-w-3xl mx-auto px-5 md:px-8 legal-prose">
          <h2>1. Ce este un cookie?</h2>
          <p>
            Un cookie este un fișier de mici dimensiuni, ce conține litere și numere, descărcat pe
            computerul în momentul în care accesați anumite site-uri web. În general, cookie-urile
            permit unui site web să recunoască computerul unui utilizator.
          </p>
          <p>
            Cel mai important lucru de știut despre cookie-urile utilizate de către noi este că acestea
            fac site-ul nostru un pic mai ușor de utilizat, de exemplu, prin memorarea setărilor pe
            care le-ați făcut.
          </p>

          <h2>2. De ce folosim cookie-uri?</h2>
          <p>
            Folosim aceste cookie-uri și alte tehnologii similare pentru mai diverse scopuri, inclusiv:
          </p>
          <ul>
            <li>Să vă păstrăm autentificați</li>
            <li>Să memorăm opțiunile și preferințele alese pe site</li>
            <li>Să vă putem oferi servicii pentru care ați optat</li>
            <li>Să înțelegem mai bine cum utilizați site-ul</li>
            <li>
              Să monitorizăm și să analizăm performanțele, operațiunile și eficacitatea site-ului,
              pentru îmbunătățiri ulterioare
            </li>
            <li>Să înțelegem și să îmbunătățim impactul campaniilor noastre de marketing</li>
            <li>
              Pentru motive de securitate și protecție împotriva tentativelor de fraudă sau atacuri
              cibernetice
            </li>
          </ul>
          <p>Cookie-urile utilizate de către noi pot fi împărțite în 2 categorii:</p>
          <ul>
            <li>
              <strong>„First-party Cookies”</strong> – Cookie-uri implementate de către noi
            </li>
            <li>
              <strong>„Third-party Cookies”</strong> – Cookie-uri care sunt implementate sau utilizate
              de către companii terțe a căror servicii le utilizăm
            </li>
          </ul>
          <p>
            Este important să rețineți că noi nu putem accesa cookie-urile „Third-party” și că nici
            alți terți nu pot accesa cookie-urile implementate de către noi. Nu permitem terților să
            utilizeze cookie-urile pentru alte scopuri decât cele precizate în următoarea secțiune.
          </p>

          <h3>Durata</h3>
          <p>
            În funcție de scopul lor, cookie-urile se păstrează pe durate diferite. Există cookie-uri
            ce se păstrează pe durata unei sesiuni de navigare și cookie-uri care persistă:
          </p>
          <ul>
            <li>
              <strong>Cookie-uri care se păstrează pe durata unei sesiuni de navigare.</strong> Aceste
              cookie-uri sunt șterse automat în momentul în care închideți browserul (ex: Google
              Chrome, Microsoft Edge, Mozilla Firefox, Safari).
            </li>
            <li>
              <strong>Cookie-uri care persistă.</strong> Acestea se păstrează și după ce închideți
              browserul. Rezistă atât timp cât este afișat în cookie.
            </li>
          </ul>

          <h3>Categorii</h3>
          <p>Cookie-urile utilizate pe site-ul nostru se împart în 4 categorii:</p>
          <ul>
            <li>
              <strong>Cookie-uri esențiale</strong>, aferente utilizării de bază a site-ului, ce
              asigură securitatea și accesul în secțiuni private ale site-ului (ex: vă păstrează
              autentificați și permit acces în secțiunea „Contul meu”).
            </li>
            <li>
              <strong>Cookie-urile de analiză.</strong> Acestea ne permit să înțelegem cum utilizați
              site-ul (ex: ce pagini accesați, cât timp petreceți pe acestea) și cum l-am putea
              îmbunătăți sau cum am putea rezolva erori/probleme legate de performanță.
            </li>
            <li>
              <strong>Cookie-uri funcționale.</strong> Acestea sunt utilizate pentru a memora
              preferințele personale (ex: limba pe care ați ales-o să fie afișată) și a vă îmbunătăți
              experiența de utilizare.
            </li>
            <li>
              <strong>Cookie-uri de marketing.</strong> Acestea sunt utilizate pentru a colecta
              informații despre impactul campaniilor noastre de publicitate (ex: câți utilizatori
              înregistrați au accesat o reclamă; câți utilizatori neînregistrați au accesat o reclamă).
              Ex: Meta (Facebook) Pixel.
            </li>
          </ul>
        </article>
      </section>

      <Footer />
    </div>
  )
}
