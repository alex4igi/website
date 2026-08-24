'use client'

/**
 * Fereastra în care restul site-ului își trimite vizitatorii către landing page-ul
 * campaniei „Back to Dance School": pop-up-ul, linkul din meniu și banda de pe homepage
 * pornesc și se opresc toate de aici.
 *
 * Datele sunt ancorate explicit în fusul orar al României (+03:00 vara), nu în ora
 * locală a vizitatorului: altfel un telefon setat pe alt fus ar vedea promo-ul cu o zi
 * mai devreme sau mai târziu decât am hotărât.
 *
 * Verificarea NU poate sta pe server: paginile publice se prerandează (vezi
 * `export const revalidate` din app/page.tsx), deci o comparație de date făcută la
 * randare ar rămâne înghețată la momentul build-ului. De aceea totul trece prin
 * `useCampaignPromo()`, care decide pe client, după montare.
 */

import { CAMPAIGN_ID, LP_PATH } from '@/app/back-to-dance-school/campaign'
import { useEffect, useState } from 'react'

/** Prima zi în care apare promo-ul, 00:00 ora României. */
export const PROMO_START = '2026-08-31T00:00:00+03:00'
/** Ultima clipă în care mai apare. Campania (orele demonstrative) ține 7–11 septembrie. */
export const PROMO_END = '2026-09-09T23:59:59+03:00'

/** Câte zile stă ascuns pop-up-ul după ce cineva îl închide, până reapare. */
export const PROMO_SNOOZE_DAYS = 3

/** Cheia sub care ținem minte că vizitatorul a închis (sau a urmat) pop-up-ul. */
export const PROMO_DISMISS_KEY = 'qd_btds_promo'

/** Textele promo-ului, într-un singur loc — pop-up, meniu și bandă spun același lucru. */
export const PROMO_COPY = {
  eyebrow: '7 – 11 septembrie 2026',
  navLabel: 'Porți deschise',
  /** Varianta scurtă a datelor, pentru coloanele înguste din footer. */
  dateShort: '7 – 11 sept.',
  title: 'Back to Dance School',
  lead: 'O săptămână de cursuri demonstrative gratuite, la Ștefan cel Mare și Nicolina. Copilul intră în sală, dansează o oră cu instructorii noștri — și abia apoi hotărâți dacă rămâne.',
  short: 'O săptămână de cursuri demonstrative gratuite, la Ștefan cel Mare și Nicolina.',
  cta: 'Vezi programul și rezervă',
  dismiss: 'Nu acum',
} as const

/** Sloturile din care poate porni un click, ca să le putem separa în rapoarte. */
export type PromoSlot = 'popup' | 'meniu' | 'homepage' | 'footer'

/**
 * Linkul către LP, cu UTM-uri după slot. LP-ul le citește în `resolveUtm()` și le duce
 * mai departe în QApp, deci în board-ul de lead-uri se vede din ce element a venit omul.
 */
export function promoHref(slot: PromoSlot): string {
  const params = new URLSearchParams({
    utm_source: 'site',
    utm_medium: slot,
    utm_campaign: CAMPAIGN_ID,
  })
  return `${LP_PATH}?${params.toString()}`
}

/** `true` doar între PROMO_START și PROMO_END. */
export function isPromoActive(now: Date = new Date()): boolean {
  const t = now.getTime()
  return t >= Date.parse(PROMO_START) && t <= Date.parse(PROMO_END)
}

/**
 * Întoarce `false` la server și la primul randare pe client, apoi valoarea reală.
 * Așa markup-ul prerandat coincide cu prima hidratare — altfel React ar semnala
 * o nepotrivire la fiecare vizită din fereastra campaniei.
 */
export function useCampaignPromo(): boolean {
  const [active, setActive] = useState(false)
  useEffect(() => setActive(isPromoActive()), [])
  return active
}

/** Un eveniment în dataLayer, pentru GA4/Ads prin GTM. Tăcut dacă GTM nu s-a încărcat. */
export function trackPromo(event: string, slot: PromoSlot) {
  const w = window as Window & { dataLayer?: unknown[] }
  w.dataLayer?.push({ event, campaign_id: CAMPAIGN_ID, promo_slot: slot })
}
