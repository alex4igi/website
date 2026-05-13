import type { CalendarData, PricingData } from './types'

// Initial seed reflecting Anexa 1 (Oferta educațională sept 2026 – iunie 2027).
// Early-bird = "Valoare semnare contract până la 01 IUNIE 2026".
// Standard = "Valoare (lei) - după 01 IUNIE 2026".

export const defaultPricingData: PricingData = {
  academicYearLabel: 'sept 2026 – iunie 2027',
  earlyBirdDeadline: '2026-06-01',
  reservationFee: 50,
  plans: [
    {
      id: 'tiny-junior-35',
      name: 'Tiny / Junior Dancer · Acrobatic 35',
      description: '4–7 ani; 55 min; 35 ședințe (1 ședință/săptămână)',
      ageGroup: 'Tiny / Junior',
      level: 'Începător',
      sessionsPerYear: 35,
      durationMinutes: 55,
      priceEarlyBird: 1700,
      priceStandard: 1800,
      displayOrder: 1,
    },
    {
      id: 'tiny-70',
      name: 'Tiny Dancer 70',
      description: '4–7 ani; 55 min; 70 ședințe (2 ședințe/săptămână)',
      ageGroup: 'Tiny',
      level: 'Începător',
      sessionsPerYear: 70,
      durationMinutes: 55,
      priceEarlyBird: 2600,
      priceStandard: 2700,
      displayOrder: 2,
    },
    {
      id: 'junior-acrobatic-70',
      name: 'Junior Dancer · Acrobatic 70',
      description: '7–10 ani; 55 min; 70 ședințe (2 ședințe/săptămână)',
      ageGroup: 'Junior',
      level: 'Începător & Intermediar',
      sessionsPerYear: 70,
      durationMinutes: 55,
      priceEarlyBird: 2600,
      priceStandard: 2700,
      displayOrder: 3,
    },
    {
      id: 'varsity-acrobatic-teen',
      name: 'Varsity Dance · Acrobatic & Teen Dance',
      description: '11–15 ani, 15+ ani; 55 min; 70 ședințe (2 ședințe/săptămână)',
      ageGroup: 'Varsity / Teens',
      level: 'Începător & Intermediar',
      sessionsPerYear: 70,
      durationMinutes: 55,
      priceEarlyBird: 2600,
      priceStandard: 2700,
      displayOrder: 4,
    },
    {
      id: 'varsity-avansat',
      name: 'Varsity Dance Avansat',
      description: '11–15 ani; 55 min; 70 ședințe (2 ședințe/săptămână)',
      ageGroup: 'Varsity',
      level: 'Avansat',
      sessionsPerYear: 70,
      durationMinutes: 55,
      priceEarlyBird: 2600,
      priceStandard: 2700,
      displayOrder: 5,
    },
  ],
}

// Calendar 2026–2027 conform planning-ului oficial Quasar Dance.
// 5 module · cursuri 1h sau 2h/săptămână · evenimente: spectacole dec & iun + QDance Fest aprilie.

export const defaultCalendarData: CalendarData = {
  yearLabel: '2026 – 2027',
  startDate: '2026-09-12',
  endDate: '2027-06-20',
  modules: [
    {
      id: 'mod-1',
      number: 1,
      label: 'Modulul 1',
      startDate: '2026-09-12',
      endDate: '2026-10-25',
      weeks: 6,
    },
    {
      id: 'mod-2',
      number: 2,
      label: 'Modulul 2',
      startDate: '2026-11-02',
      endDate: '2026-12-20',
      weeks: 7,
    },
    {
      id: 'mod-3',
      number: 3,
      label: 'Modulul 3',
      startDate: '2027-01-04',
      endDate: '2027-02-21',
      weeks: 7,
    },
    {
      id: 'mod-4',
      number: 4,
      label: 'Modulul 4',
      startDate: '2027-03-01',
      endDate: '2027-04-25',
      weeks: 8,
    },
    {
      id: 'mod-5',
      number: 5,
      label: 'Modulul 5',
      startDate: '2027-05-03',
      endDate: '2027-06-20',
      weeks: 7,
    },
  ],
  vacations: [
    {
      id: 'vac-toamna',
      label: 'Vacanță toamnă',
      startDate: '2026-10-26',
      endDate: '2026-11-01',
    },
    {
      id: 'vac-iarna',
      label: 'Vacanță iarnă',
      startDate: '2026-12-21',
      endDate: '2027-01-03',
    },
    {
      id: 'vac-primavara',
      label: 'Vacanță primăvară',
      startDate: '2027-02-22',
      endDate: '2027-02-28',
    },
    {
      id: 'vac-paste',
      label: 'Vacanță Paște',
      startDate: '2027-04-26',
      endDate: '2027-05-02',
    },
  ],
  events: [
    {
      id: 'spectacol-dec',
      date: '2026-12-18',
      type: 'spectacol',
      title: 'Spectacol Quasar — Decembrie',
      description: 'Spectacolul anual de iarnă.',
    },
    {
      id: 'qdance-fest',
      date: '2027-04-17',
      type: 'concurs',
      title: 'QDance Fest',
      description: 'Concurs național organizat de Quasar Dance.',
    },
    {
      id: 'spectacol-iun',
      date: '2027-06-19',
      type: 'spectacol',
      title: 'Spectacol Quasar — Iunie',
      description: 'Spectacolul de final de an școlar.',
    },
  ],
}
