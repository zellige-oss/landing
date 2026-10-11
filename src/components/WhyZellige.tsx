import { useT } from "@/i18n";

/** A visible definition under the mosaic: the name, its meaning, then the connection. */
export function WhyZellige() {
  const t = useT();
  return (
    <figcaption className="mx-auto w-full max-w-[34ch] text-center">
      <h3 className="flex items-center justify-center gap-3 text-sm font-medium text-gold">
        <span aria-hidden="true" className="h-px flex-1 bg-brass/40" />
        <span>{t.hero.why.title}</span>
        <span aria-hidden="true" className="h-px flex-1 bg-brass/40" />
      </h3>
      <p className="mt-4 flex flex-wrap items-baseline justify-center gap-x-2 gap-y-1">
        <span className="text-xs text-muted-foreground">{t.hero.why.from}</span>
        <span className="text-[30px] leading-tight font-medium tracking-[-0.04em] text-foreground">az-zellīj<span className="sr-only">,</span></span>
        <span className="basis-full text-xl font-medium text-gold">{t.hero.why.meaning}</span>
      </p>
      <p className="mx-auto mt-3 max-w-[31ch] text-sm leading-[1.7] text-muted-foreground">
        {t.hero.why.history}
      </p>
    </figcaption>
  );
}
