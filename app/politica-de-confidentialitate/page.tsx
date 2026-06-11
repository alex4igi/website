import type { Metadata } from 'next'
import Navbar from '@/components/sections/Navbar'
import Footer from '@/components/sections/Footer'
import SprayLabel from '@/components/ui/spray-label'

export const metadata: Metadata = {
  title: 'Politica de confidențialitate | Quasar Dance',
  description:
    'Află cum Quasar Dance SRL colectează, folosește și protejează datele tale cu caracter personal, în conformitate cu GDPR.',
}

const LAST_REVISED = '20.08.2024'

export default function PoliticaConfidentialitatePage() {
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
            <SprayLabel>Confidențialitate</SprayLabel>
          </div>
          <h1
            className="text-white text-4xl md:text-6xl font-extrabold leading-tight text-balance mb-5"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Politica de confidențialitate
          </h1>
          <p className="text-white/60 text-sm md:text-base">
            Ultima revizuire: {LAST_REVISED}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-24 bg-white">
        <article className="max-w-3xl mx-auto px-5 md:px-8 legal-prose">
          <p>
            Quasar Dance SRL tratează cu seriozitate confidențialitatea datelor vizitatorilor săi.
            În acest scop, această Politică de confidențialitate („Politica de confidențialitate”,
            „GDPR”) descrie modul în care („Quasar Dance SRL”, „noi”, „al nostru” sau „noi”),
            colectăm, folosim și distribuim informațiile dumneavoastră personale, precum și o
            explicație a drepturilor dumneavoastră asupra datelor pe care le puteți avea în acele
            „Informații personale”. Această politică de confidențialitate se aplică tuturor
            utilizatorilor noștri, inclusiv vizitatorilor neînregistrați, utilizatorilor înregistrați
            și alți utilizatori (în mod colectiv, „Utilizatori”, „dumneavoastră” sau „voi”) și tuturor
            serviciilor Quasar Dance SRL, inclusiv site-ul nostru (inclusiv oricare dintre subdomeniile
            lui) și sau servicii conexe (în mod colectiv, „serviciile”). Această politică de
            confidențialitate nu are scopul de a anula termenii oricărui contract pe care îl aveți cu
            noi și nici alte drepturi pe care le puteți avea în temeiul altor legi aplicabile privind
            confidențialitatea datelor.
          </p>
          <p>
            Înainte de a accesa sau utiliza serviciile noastre, vă rugăm să citiți această politică și
            să vă asigurați că înțelegeți pe deplin practicile noastre în legătură cu informațiile
            dumneavoastră personale. Dacă citiți și înțelegeți pe deplin această Politică de
            confidențialitate și nu sunteți de acord cu practicile noastre, trebuie să părăsiți și să
            întrerupeți imediat orice utilizare a oricăruia dintre serviciile noastre. Dacă aveți
            întrebări sau nelămuriri cu privire la această politică, vă rugăm să ne contactați la{' '}
            <a href="mailto:office@quasardance.ro">office@quasardance.ro</a>.
          </p>

          <h2>Colectarea și utilizarea informațiilor</h2>
          <p>
            Colectăm mai multe tipuri diferite de informații în diverse scopuri pentru a vă oferi și
            îmbunătăți serviciile noastre.
          </p>

          <h3>Tipuri de date colectate</h3>

          <h4>Date personale</h4>
          <p>
            În timpul utilizării serviciilor noastre, este posibil să vă cerem să ne furnizați anumite
            informații de identificare personală care pot fi folosite pentru a vă contacta sau a vă
            identifica („Date cu caracter personal”). Informațiile de identificare personală pot
            include, dar nu se limitează la:
          </p>
          <ul>
            <li>Adresa de e-mail</li>
            <li>Nume și prenume</li>
            <li>Număr de telefon</li>
            <li>Adresa, județ, cod poștal, oraș ș.a.</li>
            <li>Cookie-uri și date de utilizare</li>
          </ul>

          <h4>Date de utilizare</h4>
          <p>
            Printre altele, putem colecta informații despre cum sunt accesate și utilizate serviciile
            noastre („Date de utilizare”). Aceste date de utilizare pot include informații precum
            adresa de protocol de Internet a computerului dumneavoastră (n.r. adresa IP), tipul
            browserului, versiunea browserului, paginile serviciilor noastre pe care le vizitați, ora
            și data vizitei dumneavoastră, timpul petrecut pe acele pagini, ID-ul unic de identificare
            al dispozitivului dumneavoastră și alte date de diagnosticare.
          </p>

          <h4>Date de urmărire și cookie-uri</h4>
          <p>
            Folosim cookie-uri și tehnologii de urmărire similare pentru a urmări activitatea din
            serviciile noastre și pentru a păstra anumite informații.
          </p>
          <p>
            Cookie-urile sunt fișiere cu o cantitate mică de date care pot include un identificator
            unic anonim. Cookie-urile sunt trimise browserului dumneavoastră de pe un site web și
            stocate pe dispozitivul dumneavoastră având scopuri diverse (ex: posibilitatea de a rămâne
            autentificat pe un site fără a reintroduce parola de fiecare dată, reținerea preferințelor
            personale, setări alese de dumneavoastră ș.a.). Tehnologiile de urmărire utilizate sunt, de
            asemenea, identificatoarele unice universale („beacons”), etichete și scripturi pentru a
            colecta și urmări informații și pentru a îmbunătăți și analiza serviciile noastre.
          </p>
          <p>
            Puteți solicita browserului dumneavoastră să refuze toate cookie-urile sau să indice când
            este trimis un cookie. Cu toate acestea, dacă nu acceptați cookie-uri, este posibil să nu
            puteți utiliza unele părți ale serviciilor noastre.
          </p>

          <h2>Utilizarea datelor</h2>
          <p>Quasar Dance SRL utilizează datele colectate în diverse scopuri:</p>
          <ul>
            <li>Pentru a furniza și întreține serviciile</li>
            <li>Pentru a vă anunța cu privire la modificările aduse serviciilor noastre</li>
            <li>
              Pentru a vă permite să participați la funcțiile interactive ale serviciilor noastre
              atunci când alegeți să faceți acest lucru
            </li>
            <li>Pentru a oferi asistență clienților</li>
            <li>
              Pentru a furniza analize sau informații valoroase, astfel încât să putem îmbunătăți
              serviciile
            </li>
            <li>Pentru a monitoriza utilizarea serviciilor</li>
            <li>Pentru a detecta, preveni și aborda probleme tehnice</li>
          </ul>

          <h2>Transferul de date</h2>
          <p>
            Informațiile dumneavoastră, inclusiv Datele cu caracter personal, pot fi transferate și
            menținute pe computere situate în afara țării sau a altei jurisdicții guvernamentale în
            care legile privind protecția datelor pot diferi de cele din jurisdicția dumneavoastră.
          </p>
          <p>
            Dacă vă aflați în afara Uniunii Europene și alegeți să ne furnizați informații, vă rugăm să
            rețineți că transferăm datele, inclusiv datele cu caracter personal, către Uniunea
            Europeană și le procesăm acolo.
          </p>
          <p>
            Consimțământul dumneavoastră cu privire la această Politică de confidențialitate, urmat de
            transmiterea de către dumneavoastră a unor astfel de informații, reprezintă acordul
            dumneavoastră cu privire la acest transfer.
          </p>
          <p>
            Quasar Dance SRL va lua toate măsurile rezonabile necesare pentru a se asigura că datele
            dumneavoastră sunt stocate și utilizate în siguranță și în conformitate cu această Politică
            de confidențialitate și niciun transfer al datelor dumneavoastră cu caracter personal nu va
            avea loc către o organizație sau o țară decât dacă există verificări adecvate, inclusiv
            asupra securității datelor dumneavoastră și alte informații personale.
          </p>

          <h2>Dezvăluirea datelor</h2>
          <p>
            Quasar Dance SRL poate dezvălui datele dumneavoastră cu caracter personal cu bună-credință
            că o astfel de acțiune este necesară:
          </p>
          <ul>
            <li>Pentru a respecta o obligație legală</li>
            <li>Pentru a proteja și a apăra drepturile sau proprietatea Quasar Dance SRL</li>
            <li>Pentru a preveni sau a investiga posibile abateri în legătură cu serviciile</li>
            <li>Pentru a proteja siguranța personală a utilizatorilor serviciilor sau a publicului</li>
            <li>Pentru a se proteja împotriva răspunderii legale</li>
          </ul>

          <h2>Securitatea datelor</h2>
          <p>
            Securitatea datelor dumneavoastră este importantă pentru noi, dar rețineți că nicio metodă
            de transmitere prin Internet sau nicio metodă de stocare electronică nu este 100% sigură.
            Deși ne străduim să folosim cele mai bune mijloace de securitate din punct de vedere
            comercial pentru a vă proteja datele personale, nu putem garanta securitatea lor absolută.
          </p>

          <h2>Furnizorii de servicii</h2>
          <p>
            Putem angaja companii și persoane terțe pentru a ne facilita serviciile („Furnizorii de
            servicii”, „terți”, „parteneri”), pentru a furniza serviciile în numele nostru, pentru a
            presta servicii sau atribuții legate de servicii sau pentru a ne ajuta să analizăm modul în
            care sunt utilizate serviciile noastre.
          </p>
          <p>
            Acești terți au acces la datele dumneavoastră cu caracter personal numai pentru a îndeplini
            aceste sarcini în numele nostru și sunt obligați să nu le dezvăluie sau să le folosească în
            niciun alt scop.
          </p>

          <h3>Analytics</h3>
          <p>
            Putem folosi furnizori de servicii terți pentru a monitoriza și analiza utilizarea
            serviciilor noastre.
          </p>

          <h4>Google Analytics</h4>
          <p>
            Google Analytics este un serviciu de analiză web oferit de Google care urmărește și
            raportează traficul site-ului web. Google folosește datele colectate pentru a urmări și
            monitoriza utilizarea serviciilor noastre. Aceste date sunt partajate cu alte servicii
            Google. Google poate folosi datele colectate pentru a contextualiza și a personaliza
            reclamele propriei rețele de publicitate.
          </p>
          <p>
            Puteți renunța la a vă pune activitatea pe serviciile la dispoziția Google Analytics
            instalând extensia Google Analytics opt-out browser add-on. Suplimentul împiedică
            javascript-ul Google Analytics (ga.js, analytics.js și dc.js) să partajeze informații cu
            Google Analytics despre activitatea utilizatorilor.
          </p>
          <p>
            Pentru mai multe informații despre practicile de confidențialitate ale Google, vă rugăm să
            vizitați pagina web privind confidențialitatea și condițiile Google:{' '}
            <a
              href="https://policies.google.com/privacy?hl=ro"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://policies.google.com/privacy?hl=ro
            </a>
          </p>

          <h2>Link-uri către alte site-uri web</h2>
          <p>
            Serviciile noastre pot conține link-uri către alte site-uri care nu sunt operate de noi.
            Dacă intrați pe un link al unei terțe părți, veți fi direcționat către site-ul terțului
            respectiv. Vă sfătuim insistent să citiți Politica de confidențialitate a fiecărui site pe
            care îl vizitați.
          </p>
          <p>
            Nu avem control asupra altor site-uri și nu ne asumăm nicio responsabilitate pentru
            conținutul, politicile de confidențialitate sau practicile oricăror site-uri sau servicii
            terțe.
          </p>

          <h2>Politica de confidențialitate pentru copii</h2>
          <p>Serviciile noastre nu se adresează nimănui cu vârsta sub 18 ani („Copii”).</p>
          <p>
            Nu colectăm cu bună știință informații de identificare personală de la nimeni cu vârsta mai
            mică de 18 ani. Dacă sunteți părinte sau tutore și știți că copiii dumneavoastră ne-au
            furnizat date cu caracter personal, vă rugăm să ne contactați. Dacă aflăm că am colectat
            date cu caracter personal de la copii fără verificarea consimțământului părinților, luăm
            măsuri pentru a elimina acele informații de pe serverele noastre.
          </p>

          <h2>Modificări ale acestei politici de confidențialitate</h2>
          <p>
            Putem actualiza Politica noastră de confidențialitate din când în când. Vă vom anunța cu
            privire la orice modificare prin publicarea noii Politici de confidențialitate pe această
            pagină.
          </p>
          <p>
            Opțional, vă vom anunța prin e-mail și/sau alte căi de comunicare cu privire la serviciile
            noastre, înainte ca modificarea să devină efectivă și, obligatoriu, vom actualiza „data
            intrării în vigoare” din partea de sus a acestei Politici de confidențialitate.
          </p>
          <p>
            Sunteți sfătuit să verificați periodic această Politică de confidențialitate pentru orice
            modificări. Modificările aduse acestei Politici de confidențialitate sunt efective atunci
            când sunt postate pe această pagină.
          </p>

          <h2>Contact</h2>
          <p>
            Dacă aveți întrebări despre această politică de confidențialitate, vă rugăm să ne
            contactați:
          </p>
          <ul>
            <li>
              Prin e-mail: <a href="mailto:office@quasardance.ro">office@quasardance.ro</a>
            </li>
            <li>
              La numărul de telefon: <a href="tel:+40730534172">0730 534 172</a>
            </li>
          </ul>
          <p>Aprobat de directorul executiv al Quasar Dance SRL la {LAST_REVISED}.</p>
        </article>
      </section>

      <Footer />
    </div>
  )
}
