import { useReducedMotion, useReveals } from "@/hooks/motion";
import { ceramic } from "@/components/brand";
import { Band } from "@/components/Band";
import { Footer } from "@/layout/Footer";
import { Header } from "@/layout/Header";
import { Contact } from "@/pages/Contact";
import { Features } from "@/pages/Features";
import { Hero } from "@/pages/Hero";
import { Story } from "@/pages/Story";
import { useT } from "@/i18n";
import { WhyZellige } from "@/components/WhyZellige";

export function App() {
  const t = useT();
  const reduced = useReducedMotion();
  useReveals(reduced);
  return (
    <>
      <a className="fixed top-2.5 left-2.5 z-20 -translate-y-[200%] bg-surface p-3.5 focus:translate-y-0" href="#contenido">{t.skip}</a>
      <svg className="absolute size-0 overflow-hidden" aria-hidden="true" focusable="false">
        <defs>
          <pattern id="ceramic" patternUnits="userSpaceOnUse" width="280" height="280">
            <image href={ceramic} width="280" height="280" />
          </pattern>
        </defs>
      </svg>
      <Header />
      <main id="contenido">
        <Hero reduced={reduced} />
        <Band />
        {/* Four pages: the brand, what Zellige is, what it brings together, and how to reach it. */}
        <Story reduced={reduced} />
        <Band />
        <Features />
        <Contact />
      </main>
      <Footer />
      <WhyZellige />
    </>
  );
}
