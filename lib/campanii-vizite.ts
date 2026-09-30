'use client'

/**
 * Ce ține minte browserul vizitatorului despre campaniile cu card lateral: dacă a fost pe
 * landing (primește cardul de revenire), dacă s-a înscris (nu mai primește nimic) și când
 * a închis cardul (nu-l mai vede câteva zile). Nimic din toate astea nu pleacă la server.
 */
export type CampanieCard = 'dance_with_me' | 'valea_lupului'

type Urma = { vizitat?: number; inscris?: boolean; amanat?: number }

const KEY = 'qd_campanii'
const AMANARE_ZILE = 4

function citesteTot(): Partial<Record<CampanieCard, Urma>> {
  try {
    return JSON.parse(window.localStorage.getItem(KEY) ?? '{}')
  } catch {
    return {}
  }
}

function scrie(c: CampanieCard, patch: Urma) {
  try {
    const tot = citesteTot()
    tot[c] = { ...tot[c], ...patch }
    window.localStorage.setItem(KEY, JSON.stringify(tot))
  } catch {
    /* fără memorie locală, cardul se comportă ca pentru un vizitator nou — acceptabil */
  }
}

export function citeste(c: CampanieCard): Urma {
  return citesteTot()[c] ?? {}
}

export function esteAmanat(u: Urma): boolean {
  return !!u.amanat && Date.now() - u.amanat < AMANARE_ZILE * 24 * 60 * 60 * 1000
}

export const marcheazaVizita = (c: CampanieCard) => scrie(c, { vizitat: Date.now() })
export const marcheazaInscriere = (c: CampanieCard) => scrie(c, { inscris: true })
export const amana = (c: CampanieCard) => scrie(c, { amanat: Date.now() })
