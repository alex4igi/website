'use client'

import { useRef } from 'react'
import { X } from 'lucide-react'

type Props = { termen: string; lei: number; className?: string; eticheta?: string }

// Regulamentul campaniei stă ascuns: invitatul vine pentru ora gratuită, nu pentru
// condițiile creditului familiei care l-a invitat.
export default function RegulamentRecomandari({ termen, lei, className, eticheta = 'Regulamentul campaniei' }: Props) {
  const ref = useRef<HTMLDialogElement>(null)

  const puncte: { t: string; d: string }[] = [
    { t: 'Ora gratuită', d: 'Prima oră de curs e gratuită, cu programare confirmată de recepție.' },
    { t: 'Cine poate fi invitat', d: 'Oricine nu e înscris la Quasar în sezonul acesta, inclusiv foștii cursanți care revin. Poți alege orice grupă, nu neapărat pe cea a colegului care te-a invitat.' },
    { t: 'Prima lună', d: 'Dacă te înscrii, prima lună se plătește întreagă, chiar dacă începi la mijlocul lunii; diferența se scade din luna următoare. Exemplu: începi pe 15 octombrie, plătești 280 lei în octombrie și 98 lei în noiembrie.' },
    { t: 'Pentru familia care te-a invitat', d: `După ce te înscrii și achiți integral prima lună, familia colegului care te-a invitat primește ${lei} lei credit Quasar, pe care îl poate folosi la abonament, OPEN class, ședințe, workshopuri și concursuri (nu la merch, bilete la spectacol sau închirieri). Creditul nu se transformă în bani.` },
    { t: 'Cine te-a invitat', d: 'Spune-ne numele colegului când ceri ora gratuită (în formular, la telefon sau la recepție). Recepția confirmă invitația înainte de ora gratuită; în cazurile neclare decide managerul locației.' },
    { t: 'Termen', d: `Ora gratuită, înscrierea și plata primei luni trebuie făcute până pe ${termen}, înainte de vacanța de toamnă.` },
  ]

  return (
    <>
      <button
        type="button"
        onClick={() => ref.current?.showModal()}
        className={className ?? 'underline underline-offset-4 font-semibold'}
      >
        {eticheta}
      </button>
      <dialog
        ref={ref}
        onClick={(e) => {
          if (e.target === ref.current) ref.current?.close()
        }}
        className="m-auto w-[min(640px,calc(100vw-32px))] max-h-[85vh] rounded-3xl p-0 backdrop:bg-black/60"
      >
        <div className="p-6 md:p-8">
          <div className="flex items-start justify-between gap-4 mb-5">
            <h2 className="text-[#231f20] text-2xl font-extrabold" style={{ fontFamily: 'var(--font-display)' }}>
              Regulamentul campaniei de recomandări
            </h2>
            <button
              type="button"
              aria-label="Închide"
              onClick={() => ref.current?.close()}
              className="w-9 h-9 rounded-full bg-[#f2f2f0] flex items-center justify-center flex-shrink-0"
            >
              <X size={18} />
            </button>
          </div>
          <dl className="flex flex-col gap-4">
            {puncte.map((p) => (
              <div key={p.t}>
                <dt className="text-[#231f20] font-bold text-sm" style={{ fontFamily: 'var(--font-display)' }}>
                  {p.t}
                </dt>
                <dd className="text-[#231f20]/75 text-sm leading-relaxed mt-1">{p.d}</dd>
              </div>
            ))}
          </dl>
          <p className="text-xs text-[#6b6b6b] mt-6">
            Întrebări: Ștefan cel Mare 0730 534 172 · Nicolina și Quasar for Kids 0770 227 580.
          </p>
        </div>
      </dialog>
    </>
  )
}
