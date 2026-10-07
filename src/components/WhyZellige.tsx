import { useT } from "@/i18n";
import { useDisclosure } from "@/hooks/use-disclosure";

/*
 * A gold spark beside the hero's wordmark, like the sparks over its letters. It opens
 * where the name comes from, as a dictionary would put it, without taking room from
 * the hero. Place it inside a relative box around the wordmark.
 */
export function WhyZellige() {
  const t = useT();
  const { props } = useDisclosure();
  return (
    <details {...props} className="group">
      <summary
        aria-label={t.hero.why.title}
        title={t.hero.why.title}
        className="absolute top-[4%] -right-8 grid size-8 cursor-pointer list-none place-items-center rounded-full text-gold transition-transform hover:scale-110 sm:-right-8 sm:size-9 [&::-webkit-details-marker]:hidden"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" className="size-[18px] fill-current drop-shadow-[0_2px_4px_rgb(176_138_74/0.45)] motion-safe:animate-[twinkle_3.2s_ease-in-out_infinite] group-open:animate-none sm:size-5">
          <path d="M12 0c.6 7 5 11.4 12 12-7 .6-11.4 5-12 12-.6-7-5-11.4-12-12 7-.6 11.4-5 12-12Z" />
        </svg>
      </summary>
      <div className="absolute top-full left-1/2 z-20 mt-3 w-[min(88vw,360px)] -translate-x-1/2 rounded-2xl border border-border bg-popover p-5 text-left shadow-[0_18px_40px_-20px_rgb(20_43_53/0.5)]">
        <p className="font-serif text-[22px] leading-tight text-gold italic">{t.hero.why.title}</p>
        <p className="mt-3 flex flex-wrap items-baseline gap-x-2.5 text-sm">
          <span className="font-semibold">zel·li·ge</span>
          <span className="text-muted-foreground">/zɛˈliːʒ/</span>
          <span lang="ar" dir="rtl" className="text-muted-foreground">الزليج</span>
        </p>
        <p className="mt-2 text-[15px] leading-[1.65] text-muted-foreground">
          {t.hero.why.from} <i>az-zellīj</i>, {t.hero.why.meaning}. {t.hero.why.body}
        </p>
      </div>
    </details>
  );
}
