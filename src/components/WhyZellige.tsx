import { useT } from "@/i18n";
import { useDisclosure } from "@/hooks/use-disclosure";

/*
 * "Why Zellige?" with a gold spark, beside the hero's wordmark like the sparks over its
 * letters (below it on phones). It opens where the name comes from, as a dictionary
 * would put it, without taking room from the hero. Place it inside a relative box
 * around the wordmark.
 */
export function WhyZellige() {
  const t = useT();
  const { props } = useDisclosure();
  return (
    <details {...props} className="group">
      {/* Below the wordmark on phones; beside it, like its sparks, from sm. */}
      <summary className="group/why relative mx-auto mt-2 flex w-max cursor-pointer list-none items-center gap-1.5 rounded-full px-2 py-1 text-gold sm:absolute sm:top-[6%] sm:left-full sm:mt-0 sm:ml-1 [&::-webkit-details-marker]:hidden">
        <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4 shrink-0 fill-current drop-shadow-[0_2px_4px_rgb(176_138_74/0.45)] motion-safe:animate-[twinkle_3.2s_ease-in-out_infinite] group-open:animate-none sm:size-[18px]">
          <path d="M12 0c.6 7 5 11.4 12 12-7 .6-11.4 5-12 12-.6-7-5-11.4-12-12 7-.6 11.4-5 12-12Z" />
        </svg>
        <span className="text-[14px] font-medium whitespace-nowrap underline decoration-brass/60 decoration-dotted underline-offset-4 group-hover/why:decoration-solid sm:text-[15px]">{t.hero.why.title}</span>
      </summary>
      {/* Never over Zel: in the free space right of the wordmark on wide screens, and in
          the flow below the link on smaller ones. */}
      <div className="mx-auto mt-3 w-[min(88vw,360px)] rounded-2xl border border-border bg-popover p-5 text-left shadow-[0_18px_40px_-20px_rgb(20_43_53/0.5)] lg:absolute lg:top-0 lg:left-[calc(100%+11rem)] lg:z-20 lg:mt-0 lg:w-[320px]">
        <p className="text-lg font-semibold text-gold">{t.hero.why.title}</p>
        <p className="mt-3 flex flex-wrap items-baseline gap-x-2.5 text-sm">
          <span className="font-semibold">zel·li·ge</span>
          <span className="text-muted-foreground">/zɛˈliːʒ/</span>
          <span lang="ar" dir="rtl" className="text-muted-foreground">الزليج</span>
        </p>
        <div className="mt-2 grid gap-2 text-[15px] leading-[1.65] text-muted-foreground">
          <p>{t.hero.why.from} <span className="font-medium text-foreground">az-zellīj</span>, {t.hero.why.meaning}</p>
          <p>{t.hero.why.history}</p>
          <p><strong className="font-semibold text-foreground">{t.hero.why.fact.label}</strong> {t.hero.why.fact.body}</p>
        </div>
      </div>
    </details>
  );
}
