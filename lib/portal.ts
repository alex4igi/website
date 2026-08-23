// Portalul de membri „Contul meu” (membri.quasardance.ro) — aplicație separată, pe
// subdomeniu: membrii își văd situația plăților, achită online abonamentele și
// ședințele datorate (NETOPIA) și rezervă locuri la ședințele facultative (OPEN class).
//
// Legăm `/servicii`, nu rădăcina, din două motive:
//  1. E pagina publică de servicii și tarife, cu „Intră în cont” la final — cine vine
//     de pe site vede întâi ce plătește și abia apoi ecranul de autentificare. Un link
//     direct spre /login e un zid pentru oricine nu are încă cont.
//  2. E informarea comercială cerută de procesatorul de plăți, deci trebuie să fie
//     accesibilă dintr-un link stabil de pe site — de aceea apare și în rândul legal
//     din footer, nu doar în meniu.

export const MEMBER_PORTAL_URL = 'https://membri.quasardance.ro/servicii'

/** Eticheta din meniu — se adresează membrilor actuali, nu vizitatorilor noi. */
export const MEMBER_PORTAL_LABEL = 'Contul meu'

/** Eticheta din rândul legal — acolo contează informarea comercială, nu contul. */
export const MEMBER_PORTAL_LEGAL_LABEL = 'Servicii și prețuri'
