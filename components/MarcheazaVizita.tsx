'use client'

import { useEffect } from 'react'
import { marcheazaVizita, type CampanieCard } from '@/lib/campanii-vizite'

/** Pus pe landing-ul unei campanii: de aici încolo, pe restul site-ului omul vede cardul de revenire. */
export default function MarcheazaVizita({ campanie }: { campanie: CampanieCard }) {
  useEffect(() => marcheazaVizita(campanie), [campanie])
  return null
}
