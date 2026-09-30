import type { Metadata } from "next";

import ValeaLupuluiLanding from "./landing";
import { LP_PATH, QAPP_CAMPAIGN, SITE_URL } from "./campaign";
import { getStarePreinscriere } from "@/lib/preinscrieri";

const title = "Quasar Dance vine în Valea Lupului — dans, gimnastică și K-pop pentru copii | Quasar Dance";
const description =
  "Din noiembrie, Quasar Dance deschide cursuri la Școala Verde din Valea Lupului, în parteneriat cu Școala „Profesor Mihai Dumitriu”: dans, gimnastică și K-pop pentru copii. Spune-ne ce vi s-ar potrivi.";

// Starea campaniei (nepornită / activă / închisă) o decide Alex din qapp; pagina o
// recitește cel mult o dată pe minut.
export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const stare = await getStarePreinscriere(QAPP_CAMPAIGN);
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}${LP_PATH}` },
    // În Google doar cât campania e deschisă.
    robots: stare === "activa" ? undefined : { index: false, follow: false },
    openGraph: {
      type: "website",
      locale: "ro_RO",
      siteName: "Quasar Dance",
      url: `${SITE_URL}${LP_PATH}`,
      title,
      description,
      images: [{ url: `${SITE_URL}/back-to-dance-school-hero.jpg`, alt: "Quasar Dance vine în Valea Lupului" }],
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function Page() {
  // CRM-ul indisponibil = tratăm ca nepornită: pagina nu promite un formular pe care nu-l primim.
  const stare = (await getStarePreinscriere(QAPP_CAMPAIGN)) ?? "nepornita";
  return <ValeaLupuluiLanding stare={stare} />;
}
