import { useCallback, useEffect, useRef, type RefObject } from "react";
import { useScrollProgress } from "@/hooks/use-scroll-progress";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { ease } from "@/lib/easing";
import { useT } from "@/i18n";
import { Companion } from "@/components/Companion";
import { Wordmark } from "@/components/Wordmark";

/*
 * Centred and symmetric, like the emblem: wordmark, Zel, one line, one button.
 * The emblem's layers fly in from beyond the screen and lock around Zel (CSS), and
 * Zel says hello; scrolling away lets the layers drift apart toward the story
 * below, where they assemble again step by step and each one is explained.
 */

function Emblem({ reduced }: { reduced: boolean }) {
  const t = useT();
  return (
    <div className={cn("hero-zel tile relative mx-auto aspect-square w-[min(78vw,clamp(200px,30vh,380px))]", !reduced && "hero-intro")}>
      <Companion mood={reduced ? "hello" : "look"} follow lively={!reduced} motionDelay={1400} alt={t.zel.alt} shadow="hero" className="size-full" />
    </div>
  );
}

// Zel's trip to the header. As the hero scrolls away, the header's own Zel takes
// the place of the hero's and flies, shrinking, into the logo; scrolling back up
// flies it home. Geometry is measured on load and resize only, never while
// scrolling (that would force the page to lay out on every frame).
// The emblem's whole Zel inside its square image (scripts/build-brand.mjs trims it).
const ZEL_BOX = { x: 67 / 1254, y: 92 / 1254, w: 1119 / 1254, h: 1082 / 1254 };
/** The trip takes the first half of the hero's scroll. */
const TRIP = 0.5;

function useZelTrip(section: RefObject<HTMLElement | null>, reduced: boolean) {
  const geometry = useRef<{ from: DOMRect; to: DOMRect; zel: HTMLElement; mark: HTMLElement } | null>(null);
  const last = useRef(-1);
  const place = useCallback((progress: number) => {
    const g = geometry.current;
    if (!g) return;
    const e = ease(progress / TRIP);
    if (e === last.current) return;
    last.current = e;
    const { from, to, zel, mark } = g;
    // At home the hero's own, living Zel shows; once it leaves, the header's flies.
    zel.style.setProperty("opacity", e > 0 ? "0" : "1");
    mark.style.setProperty("opacity", e > 0 ? "1" : "0");
    if (e <= 0 || e >= 1) { mark.style.removeProperty("transform"); return; }
    const x = from.x + (to.x - from.x) * e;
    const y = from.y - scrollY + (to.y - (from.y - scrollY)) * e;
    const width = from.width + (to.width - from.width) * e;
    mark.style.setProperty("transform", `translate(${(x - to.x).toFixed(1)}px, ${(y - to.y).toFixed(1)}px) scale(${(width / to.width).toFixed(4)})`);
  }, []);

  useEffect(() => {
    const zel = section.current?.querySelector<HTMLElement>(".hero-zel");
    const mark = document.getElementById("header-zel");
    if (reduced || !zel || !mark) return;
    const measure = () => {
      mark.style.removeProperty("transform");
      const tile = zel.getBoundingClientRect();
      // The hero's Zel in page coordinates; the header's in the viewport (it is fixed).
      const from = new DOMRect(tile.left + tile.width * ZEL_BOX.x, tile.top + scrollY + tile.height * ZEL_BOX.y, tile.width * ZEL_BOX.w, tile.height * ZEL_BOX.h);
      geometry.current = { from, to: mark.getBoundingClientRect(), zel, mark };
      last.current = -1;
    };
    mark.style.setProperty("transition", "none");
    measure();
    addEventListener("resize", measure);
    addEventListener("load", measure);
    return () => {
      removeEventListener("resize", measure);
      removeEventListener("load", measure);
      geometry.current = null;
      for (const prop of ["transition", "transform", "opacity"]) mark.style.removeProperty(prop);
      zel.style.removeProperty("opacity");
    };
  }, [section, reduced]);
  return place;
}

export function Hero({ reduced }: { reduced: boolean }) {
  const t = useT();
  const section = useRef<HTMLElement>(null);
  const trip = useZelTrip(section, reduced);
  useScrollProgress(section, "past", trip, !reduced);
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
      <div className="mt-3 mb-5 sm:mt-4 sm:mb-6">
        <Emblem reduced={reduced} />
      </div>
      <p className="hero-copy relative z-[2] max-w-[22ch] text-[clamp(26px,3.4vw,42px)] leading-[1.08] tracking-[-0.045em] text-balance">
        {t.hero.title.lead} <em className="text-accent">{t.hero.title.turn}</em>
      </p>
      {/* Where the name comes from, as a dictionary would put it: many pieces, one
          pattern, which the story below then fills with the ways of using AI. */}
      <div className="hero-copy relative z-[2] mt-6 max-w-[50ch] sm:mt-7">
        <span aria-hidden="true" className="mx-auto mb-4 block size-2 rotate-45 bg-brass" />
        <p className="flex flex-wrap items-baseline justify-center gap-x-2.5 text-sm sm:text-[15px]">
          <span className="font-semibold">zel·li·ge</span>
          <span className="text-muted-foreground">/zɛˈliːʒ/</span>
          <span lang="ar" dir="rtl" className="text-muted-foreground">الزليج</span>
        </p>
        <p className="mt-2 text-[15px] leading-[1.65] text-pretty text-muted-foreground sm:text-base">
          {t.hero.origin.from} <i>az-zellīj</i>, {t.hero.origin.meaning}. {t.hero.origin.body}
        </p>
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
