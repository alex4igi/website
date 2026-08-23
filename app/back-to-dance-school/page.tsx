import type { Metadata } from "next";

import BackToDanceSchoolLanding from "./landing";
import { LP_PATH, SITE_URL } from "./campaign";

const title = "Back to Dance School — o săptămână de cursuri de dans gratuite | Quasar Dance Iași";
const description =
  "7–11 septembrie 2026: Săptămâna Porților Deschise la Quasar Dance. Ore demonstrative gratuite pentru copii de la 4 la 19 ani, la Ștefan cel Mare și Nicolina. Înscrie-te în 1 minut.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${SITE_URL}${LP_PATH}` },
  openGraph: {
    type: "website",
    locale: "ro_RO",
    siteName: "Quasar Dance",
    url: `${SITE_URL}${LP_PATH}`,
    title,
    description,
    // TODO Website Factory: înlocuiți cu vizualul campaniei (1200×630) în /public.
    images: [{ url: `${SITE_URL}/og-back-to-dance-school.jpg`, width: 1200, height: 630, alt: "Back to Dance School — Quasar Dance Iași" }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function Page() {
  return <BackToDanceSchoolLanding />;
}
