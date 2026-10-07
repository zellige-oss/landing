import { useEffect, useRef } from "react";
import { useScrollProgress } from "@/hooks/use-scroll-progress";
import { ArrowDown, ChevronDown, Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useT } from "@/i18n";
import { Companion } from "./Companion";
import { Wordmark } from "./Wordmark";

/*
 * Centred and symmetric, like the emblem: wordmark, Zel, one line, one button.
 * The emblem's layers fly in from beyond the screen and lock around Zel (CSS), and
 * Zel says hello; scrolling away lets the layers drift apart toward the story
 * below, where they assemble again step by step and each one is explained.
 */

function Emblem({ reduced }: { reduced: boolean }) {
  const t = useT();
  // The layers are explained in the story below, so the hero's Zel only says hello.
  return (
    <div className={cn("hero-zel tile relative mx-auto aspect-square w-[min(78vw,clamp(200px,30vh,380px))]", !reduced && "hero-intro")}>
      <Companion mood={reduced ? "hello" : "look"} follow lively={!reduced} motionDelay={1400} alt={t.zel.alt} shadow="hero" className="size-full" />
      <p className="hero-greeting absolute top-[2%] left-[60%] w-max max-w-[150px] rounded-2xl rounded-bl-sm border border-border bg-popover px-3 py-2 text-left text-[11px] leading-snug text-foreground shadow-[0_12px_30px_-14px_rgb(20_43_53/0.4)] sm:top-[6%] sm:left-[64%] sm:max-w-[220px] sm:px-3.5 sm:py-2.5 sm:text-sm">
        <strong className="font-semibold">{t.zel.hello}</strong>
        <br />
        {t.zel.helloLine}
      </p>
    </div>
  );
}

// How far the hero has scrolled away, written only onto what fades with it: Zel's
// layers get --out, and Zel's wrapper its opacity. As a variable on the section or
// the wrapper it would restyle all of the hero, or all of Zel, on every scroll
// event, which phones cannot keep up with.
const lastOut = new WeakMap<HTMLElement, string | null>();
function setOut(section: HTMLElement | null, value: string | null) {
  if (!section || lastOut.get(section) === value) return;
  lastOut.set(section, value);
  for (const element of section.querySelectorAll<HTMLElement>(".hero-zel :is(.layer-points, .layer-cobalt, .layer-crown, .zel-whole)")) {
    if (value === null) element.style.removeProperty("--out");
    else element.style.setProperty("--out", value);
  }
  const zel = section.querySelector<HTMLElement>(".hero-zel");
  if (value === null) zel?.style.removeProperty("opacity");
  else zel?.style.setProperty("opacity", Math.max(0, 1 - Number(value) * 1.6).toFixed(3));
}

export function Hero({ reduced }: { reduced: boolean }) {
  const t = useT();
  const section = useRef<HTMLElement>(null);
  useScrollProgress(section, "past", (progress) => setOut(section.current, Math.min(1, progress * 1.6).toFixed(3)), !reduced);
  useEffect(() => {
    if (reduced) setOut(section.current, null);
  }, [reduced]);
  return (
    <section
      ref={section}
      id="inicio"
      aria-labelledby="hero-title"
      className="hero relative isolate flex min-h-svh flex-col items-center justify-center overflow-hidden bg-background px-6 pt-20 pb-14 text-center sm:pt-16"
    >
      <h1 id="hero-title" className="leading-none motion-safe:animate-arrive">
        <Wordmark alt="zellige" className="mx-auto h-auto w-[min(62vw,clamp(200px,26vh,280px))] drop-shadow-[0_14px_20px_#0f3b6e26]" />
      </h1>
      {/* Where the name comes from, as a dictionary would put it. */}
      <p className="mt-3 text-[13px] text-muted-foreground motion-safe:animate-arrive sm:text-sm">
        <span className="font-semibold text-foreground">zel·li·ge</span> /zɛˈliːʒ/ · {t.hero.etymology.from} <i>{t.hero.etymology.source}</i>, {t.hero.etymology.meaning}
      </p>
      <div className="mt-3 mb-5 sm:mt-4 sm:mb-6">
        <Emblem reduced={reduced} />
      </div>
      <p className="hero-copy relative z-[2] max-w-[22ch] text-[clamp(26px,3.4vw,42px)] leading-[1.08] tracking-[-0.045em] text-balance">
        {t.hero.title.lead} <em className="text-accent">{t.hero.title.turn}</em>
      </p>
      <p className="hero-copy relative z-[2] mt-4 max-w-[54ch] text-[15px] leading-[1.65] text-muted-foreground sm:text-base">{t.hero.body}</p>
      <div className="hero-copy relative z-[2] mt-6 flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
        <a className={cn(buttonVariants({ variant: "cta", size: "cta" }))} href="#piezas">
          <Sparkles aria-hidden="true" /> {t.hero.primary}
        </a>
        <a className="inline-flex items-center gap-2 text-sm text-muted-foreground decoration-brass underline-offset-[6px] hover:text-foreground hover:underline" href="#funciones">
          {t.hero.secondary} <ArrowDown aria-hidden="true" className="size-4" />
        </a>
      </div>
      {/* Next section: a quiet cue at the bottom edge. */}
      <a
        href="#piezas"
        aria-label={t.hero.next}
        title={t.hero.next}
        className="hero-copy absolute bottom-4 left-1/2 z-[2] grid size-10 -translate-x-1/2 place-items-center rounded-full border border-border bg-popover/80 text-muted-foreground transition-colors hover:border-brass hover:text-foreground sm:bottom-6"
      >
        <ChevronDown aria-hidden="true" className="size-5 motion-safe:animate-bounce" />
      </a>
    </section>
  );
}
