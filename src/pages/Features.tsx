import { useT } from "@/i18n";
import { Workings } from "@/components/Workings";

/** Devices, harnesses and models belong to the same trip through your server. */
export function Features() {
  const t = useT();
  const w = t.story.workings;
  return (
    <section id="funciones" aria-labelledby="features-title" className="px-6 py-20 sm:px-[clamp(24px,4.5vw,80px)] sm:py-24 min-[1800px]:mx-auto min-[1800px]:max-w-[1800px]">
      <h2 id="features-title" data-reveal className="section-title">{w.title}</h2>
      <p data-reveal className="mt-4 max-w-[76ch] text-[15px] leading-[1.7] text-muted-foreground sm:text-base">{w.body}</p>
      <Workings className="mt-10" />
      <p className="mt-4 text-xs text-muted-foreground/80">{t.features.trademarks}</p>
    </section>
  );
}
