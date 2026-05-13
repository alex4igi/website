'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Award, Calendar, Users } from 'lucide-react'
import SprayLabel from '@/components/ui/spray-label'
import Navbar from '@/components/sections/Navbar'
import Footer from '@/components/sections/Footer'

// Mock instructor data (same as main page - in production would come from CMS/DB)
const instructorsData = [
  {
    slug: 'alexandru-miron',
    name: 'Alexandru Miron',
    role: 'Fondator & Head Instructor',
    specialization: 'Street Dance · Hip-Hop · Breaking',
    bio: 'Co-fondator Quasar Dance în 1981. Peste 40 de ani dedicați dansului urban. A format sute de dansatori profesioniști și a adus primele stiluri street în România. Viziunea sa a transformat o pasiune locală într-o instituție națională.',
    longBio: 'Alexandru Miron nu e doar fondatorul Quasar — e pionierul dansului urban în România. În 1981, când termenul "street dance" era necunoscut aici, Alexandru a deschis prima sală dedicată stilurilor urbane din Iași. Peste 4 decenii, a rămas fidel pasiunii inițiale, formând generații întregi de dansatori.\n\nFilosofia sa e simplă: dansul e mai mult decât tehnica. E cultură, e identitate, e comunitate. Fiecare curs pe care îl predă reflectă această convingere — elevii nu învață doar pași, ci înțeleg contextul, istoria și spiritul fiecărui stil.\n\nAstăzi, Alexandru coordonează echipa de instructori Quasar, asigurându-se că fiecare program menține standardul de excelență care a definit școala timp de 43 de ani.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80',
    years: '40+ ani în dans',
    courses: [
      { name: 'Street Dance · Junior', level: 'Începător', schedule: 'Luni & Miercuri 17:00-18:00' },
      { name: 'Street Dance · Adults', level: 'Intermediar / Avansat', schedule: 'Marți & Joi 19:00-20:30' },
      { name: 'Street Dance · Teens', level: 'Avansat', schedule: 'Sâmbătă 11:00-13:00' },
    ],
    achievements: ['Fondator Quasar Dance', 'Pioneer Street Dance în România', 'Coregraf 100+ spectacole', 'Mentor peste 500 instructori'],
    testimonials: [
      { author: 'Andrei S., fost elev', text: 'Alexandru nu m-a învățat doar să dansez. M-a învățat să simt muzica, să respect cultura și să fiu parte dintr-o comunitate.' },
      { author: 'Maria P., părinte', text: 'Fiul meu dansează la Quasar de 5 ani. Alexandru e mai mult decât un instructor — e un model și un mentor.' },
    ],
    style: 'Energie autentică, old-school roots cu adaptări moderne. Accent pe fundamente, musicalitate și storytelling prin mișcare.',
  },
  {
    slug: 'ioana-popescu',
    name: 'Ioana Popescu',
    role: 'Instructor Principal',
    specialization: 'Gimnastică Artistică · Acrobație',
    bio: 'Fostă gimnastă de performanță, acum instructor de top la Quasar. Metodologia ei îmbină rigoarea sportivă cu bucuria mișcării. Specializată în pregătire tehnică pentru copii 4-12 ani.',
    longBio: 'Ioana Popescu a fost gimnastă în lotul național până la 18 ani. Când și-a încheiat cariera sportivă, pasiunea pentru mișcare nu s-a stins — s-a transformat. A descoperit că predarea gimnasticii poate fi la fel de împlinitoare ca performanța.\n\nLa Quasar, Ioana a dezvoltat un program unic de gimnastică artistică pentru copii care combină disciplina sportului de performanță cu mediul prietenos al unei școli de dans. Rezultatele sunt vizibile: elevii ei excelează tehnic, dar iubesc ceea ce fac.\n\nMetodologia ei se bazează pe progresie clară, încurajare constantă și atenție la fiecare detaliu. Părinții apreciază comunicarea deschisă și dedicarea cu care Ioana tratează fiecare copil.',
    image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=600&q=80',
    years: '12+ ani în Quasar',
    courses: [
      { name: 'Gimnastică artistică · Tiny', level: 'Începător', schedule: 'Marți & Joi 16:00-17:00' },
      { name: 'Gimnastică artistică · Teens', level: 'Avansat', schedule: 'Luni, Miercuri, Vineri 17:30-19:00' },
      { name: 'Gimnastică artistică · Varsity', level: 'Intermediar', schedule: 'Sâmbătă 10:00-11:30' },
    ],
    achievements: ['Fostă gimnastă lotul național', 'Certificare FPTR', '500+ elevi formați', 'Specialist pregătire copii 4-12 ani'],
    testimonials: [
      { author: 'Ana M., părinte', text: 'Ioana are un dar special cu copiii. Fiica mea a învățat mai mult decât gimnastică — a câștigat încredere în sine.' },
      { author: 'Cristian D., părinte', text: 'Progresul e vizibil de la o lună la alta. Ioana e exigentă dar caldă — exact ce își dorește orice părinte.' },
    ],
    style: 'Rigoare tehnică + abordare caldă. Progresie clară, feedback constructiv, accent pe siguranță și bucurie.',
  },
  {
    slug: 'cristina-nedelcu',
    name: 'Cristina Nedelcu',
    role: 'Instructor K-POP & Commercial',
    specialization: 'K-POP · Commercial Dance · Choreography',
    bio: 'Specialistă în K-POP și commercial dance. Coregrafiile ei sunt imediat recunoscute în comunitatea Quasar. A studiat în Seul și aduce influențe directe din industria coreeană.',
    longBio: 'Cristina a descoperit K-POP-ul în liceu și s-a îndrăgostit imediat. Nu doar de muzică — de energia, precizia și sincronizarea perfectă a dansatorilor coreeni. A început să practice singură, apoi a făcut training intensiv la 1MILLION Dance Studio în Seul.\n\nCând s-a întors în România, a adus cu ea mai mult decât pași — a adus mentalitatea, work ethic-ul și pasiunea care definesc industria coreeană. La Quasar, cursurile ei de K-POP sunt cele mai solicitate. Coregrafiile sunt sharp, energice și mereu actuale.\n\nCristina nu doar predă — creează comunitate. Elevii ei formează crew-uri, participă la competiții și au devenit recunoscuți în scena românească de K-POP.',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&q=80',
    years: '8+ ani în Quasar',
    courses: [
      { name: 'KPOP Dance · Teens', level: 'Începător / Intermediar', schedule: 'Miercuri & Vineri 18:00-19:30' },
      { name: 'KPOP Dance · Students', level: 'Intermediar / Avansat', schedule: 'Marți & Joi 20:00-21:30' },
      { name: 'KPOP Dance · Varsity', level: 'Începător', schedule: 'Sâmbătă 14:00-15:30' },
    ],
    achievements: ['Training în Seul (1MILLION Dance)', 'Coregraf oficial Quasar', 'Viral TikTok 2M+ views', 'Organizator K-POP Dance Camp'],
    testimonials: [
      { author: 'Diana T., elevă K-POP', text: 'Cristina e exact tipul de instructor pe care mi l-am dorit. Exigentă, precisă, dar și super fun. Cursurile ei sunt magice.' },
      { author: 'Alex B., elev Commercial', text: 'Am învățat mai mult în 6 luni cu Cristina decât în 2 ani pe cont propriu. Ea știe să transmită tehnica și energia.' },
    ],
    style: 'Sharp, energic, precis. Coregrafii moderne, accent pe sincronizare și musicalitate. Training intensiv, rezultate rapide.',
  },
  {
    slug: 'andrei-stan',
    name: 'Andrei Stan',
    role: 'Instructor Hip-Hop',
    specialization: 'Hip-Hop · House · Locking',
    bio: 'Crescut în Quasar de la 8 ani, acum instructor de Hip-Hop și House. Stilul lui e o fuziune între old-school și contemporary urban. Mentor pentru generația tânără.',
    longBio: 'Andrei Stan e produsul perfect al sistemului Quasar. A început ca elev la 8 ani, fără nicio experiență. A trecut prin toate nivelurile, a participat la competiții, a câștigat campionate naționale și, în final, a devenit instructor.\n\nAstăzi, Andrei predă exact aceleași cursuri în care el a crescut — și aduce o perspectivă unică. Știe cum se simte un începător, știe care sunt blocajele, știe ce funcționează. Elevii simt că vorbește limba lor.\n\nStilul său combină fundamentele old-school (foundation, groove, musicalitate) cu influențe contemporary urban. Fiecare curs e balansat: tehnic, dar și distractiv. Serios, dar și relaxat. Exact ce își dorește un elev tânăr.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80',
    years: '15+ ani în Quasar (6 ca instructor)',
    courses: [
      { name: 'Street Dance · Junior', level: 'Începător', schedule: 'Luni & Miercuri 16:30-17:30' },
      { name: 'Street Dance · Varsity', level: 'Intermediar', schedule: 'Marți & Joi 18:30-20:00' },
      { name: 'Street Dance · Students', level: 'Intermediar / Avansat', schedule: 'Sâmbătă 16:00-17:30' },
    ],
    achievements: ['Campion național Street Dance', 'Battle organizer', 'Quasar Alumni → Instructor', 'Mentor peste 100 elevi'],
    testimonials: [
      { author: 'Radu M., elev Hip-Hop', text: 'Andrei vorbește limbajul nostru. Nu e genul de instructor distant — e ca un frate mai mare.' },
      { author: 'Ioana C., elevă House', text: 'M-a ajutat să înțeleg groove-ul, nu doar pașii. Acum simt muzica complet diferit.' },
    ],
    style: 'Relaxat dar exigent. Fundamente old-school + vibe contemporary. Accent pe groove, musicalitate și exprimare personală.',
  },
  {
    slug: 'maria-ionescu',
    name: 'Maria Ionescu',
    role: 'Instructor Contemporary',
    specialization: 'Contemporary · Modern Jazz · Improvisation',
    bio: 'Background în balet clasic și modern jazz, acum specializată în contemporary. Predă tehnici de improvizație și expresie corporală. Stilul ei e fluid, emoțional, profund.',
    longBio: 'Maria Ionescu a început cu balet clasic la 6 ani. A studiat la Royal Academy of Dance, apoi s-a specializat în modern jazz și contemporary. Când a ajuns la Quasar, a adus o perspectivă unică — dans ca formă de artă, nu doar ca exercițiu fizic.\n\nCursurile ei de contemporary nu sunt pentru toată lumea. Cer vulnerabilitate, disponibilitate de a explora emoții și o dorință de a merge dincolo de tehnica pură. Dar pentru cei care rezonează cu stilul ei, experiența e transformatoare.\n\nMaria predă mai mult decât coregrafii — predă conștiință corporală, improvizație și capacitatea de a spune povești prin mișcare. Elevii ei dezvoltă o relație profundă cu dansul.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80',
    years: '10+ ani în Quasar',
    courses: [
      { name: 'Street Dance · Teens', level: 'Intermediar', schedule: 'Miercuri & Vineri 17:00-18:30' },
      { name: 'Zumba · Adults', level: 'Toate dificultățile', schedule: 'Marți 19:00-20:30' },
      { name: 'Street Dance · Adults', level: 'Avansat', schedule: 'Duminică 11:00-13:00' },
    ],
    achievements: ['Diplomă Royal Academy of Dance', 'Coregraf spectacole teatru', 'Guest teacher EU workshops', 'Specialist improvizație & exprimare corporală'],
    testimonials: [
      { author: 'Elena V., elevă Contemporary', text: 'Maria m-a învățat să dansez cu inima, nu doar cu corpul. E o experiență profund emoțională.' },
      { author: 'Mihai D., elev Improvisation', text: 'Cursurile ei sunt diferite de tot ce am făcut. Te provoacă să te descoperi prin dans.' },
    ],
    style: 'Fluid, emoțional, introspectiv. Accent pe conștiință corporală, improvizație și storytelling. Dans ca artă, nu performanță.',
  },
]

export default function InstructorPage() {
  const params = useParams()
  const slug = params?.slug as string
  const instructor = instructorsData.find(i => i.slug === slug)

  if (!instructor) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Navbar />
        <div className="text-center px-5">
          <h1 className="text-3xl font-bold mb-4">Instructor negăsit</h1>
          <Link href="/despre-noi" className="text-[#f8ef21] hover:underline">
            Înapoi la echipă
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Header */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 bg-[#231f20]">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <Link
            href="/despre-noi"
            className="inline-flex items-center gap-2 text-white/60 hover:text-[#f8ef21] text-sm font-medium mb-8 transition-colors"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            <ArrowLeft size={16} /> Înapoi la echipă
          </Link>

          <div className="grid md:grid-cols-5 gap-12 items-start">
            {/* Photo */}
            <div className="md:col-span-2">
              <div className="relative rounded-2xl overflow-hidden aspect-[3/4] bg-[#3a3637]">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url('${instructor.image}')` }}
                />
                <div className="absolute bottom-4 left-4">
                  <span
                    className="text-xs font-bold bg-[#f8ef21] text-[#231f20] px-3 py-1.5 rounded-full"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {instructor.years}
                  </span>
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="md:col-span-3">
              <h1
                className="text-white text-4xl md:text-5xl font-black leading-tight mb-3"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {instructor.name}
              </h1>
              <div
                className="text-[#f8ef21] text-sm font-bold uppercase tracking-wider bg-[#3a3637] rounded-full px-4 py-2 inline-block mb-6"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {instructor.role}
              </div>
              <p className="text-white/80 text-lg leading-relaxed mb-8">{instructor.bio}</p>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center gap-2 text-[#f8ef21] text-sm font-bold mb-2">
                    <Award size={18} />
                    <span style={{ fontFamily: 'var(--font-display)' }}>Specializări</span>
                  </div>
                  <p className="text-white/70 text-sm">{instructor.specialization}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-[#f8ef21] text-sm font-bold mb-2">
                    <Calendar size={18} />
                    <span style={{ fontFamily: 'var(--font-display)' }}>Experiență</span>
                  </div>
                  <p className="text-white/70 text-sm">{instructor.years}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bio extins */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-4xl mx-auto px-5 md:px-8">
          <div className="mb-6"><SprayLabel>Povestea lui {instructor.name.split(' ')[0]}</SprayLabel></div>
          <div className="prose prose-lg max-w-none">
            {instructor.longBio.split('\n\n').map((para, i) => (
              <p key={i} className="text-[#6b6b6b] text-base leading-relaxed mb-6">
                {para}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Stil de predare */}
      <section className="py-20 md:py-28 bg-[#f5f5f5]">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="mb-8"><SprayLabel>Stil de predare</SprayLabel></div>
          <div className="bg-[#231f20] p-8 md:p-12 rounded-2xl">
            <p className="text-white/90 text-lg leading-relaxed">{instructor.style}</p>
          </div>
        </div>
      </section>

      {/* Cursuri predate */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="mb-8"><SprayLabel>Cursuri predate</SprayLabel></div>
          <div className="grid md:grid-cols-3 gap-6">
            {instructor.courses.map((course) => (
              <div key={course.name} className="border border-[#e5e5e5] rounded-2xl p-6">
                <h3
                  className="text-[#231f20] text-xl font-bold mb-2"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {course.name}
                </h3>
                <div className="flex items-center gap-2 text-[#f8ef21] text-xs font-bold mb-3 bg-[#231f20] rounded-full px-3 py-1 self-start">
                  {course.level}
                </div>
                <p className="text-[#6b6b6b] text-sm">{course.schedule}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Realizări */}
      <section className="py-20 md:py-28 bg-[#f5f5f5]">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="mb-8"><SprayLabel>Realizări & recunoașteri</SprayLabel></div>
          <div className="grid md:grid-cols-2 gap-4">
            {instructor.achievements.map((ach, i) => (
              <div key={i} className="flex items-start gap-3 bg-white p-6 rounded-xl border border-[#e5e5e5]">
                <span className="text-[#f8ef21] text-xl font-bold mt-0.5">✓</span>
                <span className="text-[#231f20] text-base font-medium">{ach}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimoniale */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="mb-8"><SprayLabel>Ce spun elevii</SprayLabel></div>
          <div className="grid md:grid-cols-2 gap-8">
            {instructor.testimonials.map((test, i) => (
              <div key={i} className="bg-[#f5f5f5] p-8 rounded-2xl">
                <p className="text-[#231f20] text-base leading-relaxed mb-4 italic">
                  "{test.text}"
                </p>
                <p
                  className="text-[#6b6b6b] text-sm font-semibold"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  — {test.author}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 bg-[#231f20]">
        <div className="max-w-4xl mx-auto px-5 md:px-8 text-center">
          <h2
            className="text-white text-3xl md:text-4xl font-black leading-tight mb-6"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Vrei să înveți cu {instructor.name.split(' ')[0]}?
          </h2>
          <p className="text-white/70 text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
            Înscrie-te la unul dintre cursurile predate sau contactează-ne pentru detalii.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/#program"
              className="btn-yellow inline-flex items-center justify-center text-[#231f20] font-black text-base px-8 py-3.5 w-full sm:w-auto"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Vezi program complet
            </Link>
            <Link
              href="/#inscriere"
              className="inline-flex items-center justify-center border-2 border-white/30 text-white font-bold text-base px-8 py-3.5 rounded-full hover:border-[#f8ef21] hover:text-[#f8ef21] transition-all duration-300 w-full sm:w-auto"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Înscrie-te acum
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
