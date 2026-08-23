import type { Metadata } from "next";

import ThankYou from "./thank-you";

export const metadata: Metadata = {
  title: "Înscriere confirmată — Back to Dance School | Quasar Dance",
  description: "Ți-am primit înscrierea la Săptămâna Porților Deschise. Te sunăm în cel mult 24 de ore.",
  // Pagina de conversie nu trebuie să apară în Google: ar strica raportările și ar putea fi găsită direct.
  robots: { index: false, follow: false },
};

export default function Page() {
  return <ThankYou />;
}
