import type { Metadata } from "next";

import ThankYou from "./thank-you";

export const metadata: Metadata = {
  title: "Preînscriere primită — Quasar Dance în Valea Lupului",
  description: "Am primit preînscrierea pentru Valea Lupului. Te contactăm când programul este confirmat.",
  // Pagina de conversie nu trebuie să apară în Google.
  robots: { index: false, follow: false },
};

export default function Page() {
  return <ThankYou />;
}
