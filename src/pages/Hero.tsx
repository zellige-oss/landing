import { useCallback, useEffect, useRef, type RefObject } from "react";
import { useScrollProgress } from "@/hooks/use-scroll-progress";
import { ChevronDown, KeyRound, Plug, Workflow } from "lucide-react";
import { cn } from "@/lib/utils";
import { ease } from "@/lib/easing";
import { useT } from "@/i18n";
import { Companion } from "@/components/Companion";
import { Wordmark } from "@/components/Wordmark";
import { WhyZellige } from "@/components/WhyZellige";

const bringIcons = [Workflow, Plug, KeyRound];

/*
 * Centred and symmetric, like the emblem: wordmark, Zel, one line, one button.
 * The emblem's layers fly in from beyond the screen and lock around Zel (CSS), and
 * Zel says hello; scrolling away lets the layers drift apart toward the story
 * below, where they assemble again step by step and each one is explained.
 */

function Emblem({ reduced }: { reduced: boolean }) {
  const t = useT();
  return (
    <div className={cn("hero-zel tile relative mx-auto aspect-square w-[min(84vw,clamp(220px,38vh,440px))]", !reduced && "hero-intro")}>
      <Companion mood={reduced ? "hello" : "look"} follow lively={!reduced} motionDelay={1400} alt={t.zel.alt} shadow="hero" className="size-full" />
    </div>
  );
}

// Zel's trip to the header. As the hero scrolls away, the header's own Zel takes
// the place of the hero's and flies, shrinking, into the logo; scrolling back up
// flies it home. Geometry is measured on load and resize only, never while
// scrolling (that would force the page to lay out on every frame).
// Where the browser has scroll timelines, the trip is an animation on the page's
// scroll, which the browser runs alongside scrolling itself: driven from scroll
// events instead, it trails the finger on phones, a frame or more behind.
// The emblem's whole Zel inside its square image (scripts/build-brand.mjs trims it).
const ZEL_BOX = { x: 67 / 1254, y: 92 / 1254, w: 1119 / 1254, h: 1082 / 1254 };
/** The trip takes the first half of the hero's scroll. */
const TRIP = 0.5;
/** Keyframes along the trip: enough that its easing reads as a curve. */
const STEPS = 24;

type Trip = { from: DOMRect; to: DOMRect; zel: HTMLElement; mark: HTMLElement };
/** Where the header's Zel sits at `e` of the way (eased) with the page scrolled to `y`. */
function transformAt({ from, to }: Trip, e: number, y: number) {
  const x = from.x + (to.x - from.x) * e;
  const top = from.y - y + (to.y - (from.y - y)) * e;
  const width = from.width + (to.width - from.width) * e;
  return `translate(${(x - to.x).toFixed(1)}px, ${(top - to.y).toFixed(1)}px) scale(${(width / to.width).toFixed(4)})`;
}

function useZelTrip(section: RefObject<HTMLElement | null>, reduced: boolean) {
  const geometry = useRef<Trip | null>(null);
  const last = useRef(-1);
  const place = useCallback((progress: number) => {
    const g = geometry.current;
    if (!g) return;
    const e = ease(progress / TRIP);
    if (e === last.current) return;
    last.current = e;
    const { zel, mark } = g;
    // At home the hero's own, living Zel shows; once it leaves, the header's flies.
    zel.style.setProperty("opacity", e > 0 ? "0" : "1");
    mark.style.setProperty("opacity", e > 0 ? "1" : "0");
    if (e <= 0 || e >= 1) { mark.style.removeProperty("transform"); return; }
    mark.style.setProperty("transform", transformAt(g, e, scrollY));
  }, []);

  useEffect(() => {
    const hero = section.current;
    const zel = hero?.querySelector<HTMLElement>(".hero-zel");
    const mark = document.getElementById("header-zel");
    if (reduced || !hero || !zel || !mark) return;
    const timeline = "ScrollTimeline" in window ? new ScrollTimeline({ source: document.documentElement, axis: "block" }) : null;
    let animations: Animation[] = [];
    const measure = () => {
      for (const animation of animations) animation.cancel();
      animations = [];
      mark.style.removeProperty("transform");
      const tile = zel.getBoundingClientRect();
      // The hero's Zel in page coordinates; the header's in the viewport (it is fixed).
      const from = new DOMRect(tile.left + tile.width * ZEL_BOX.x, tile.top + scrollY + tile.height * ZEL_BOX.y, tile.width * ZEL_BOX.w, tile.height * ZEL_BOX.h);
      const trip = { from, to: mark.getBoundingClientRect(), zel, mark };
      last.current = -1;
      if (!timeline) {
        geometry.current = trip;
        return;
      }
      // The timeline runs over the page's whole scroll; the trip is its first stretch.
      const top = hero.getBoundingClientRect().top + scrollY;
      const range = Math.max(1, document.documentElement.scrollHeight - innerHeight);
      const at = (y: number) => Math.min(1, Math.max(0, y / range));
      const frames: Keyframe[] = Array.from({ length: STEPS + 1 }, (_, i) => {
        const y = top + (i / STEPS) * TRIP * hero.offsetHeight;
        return { offset: at(y), transform: i === STEPS ? "none" : transformAt(trip, ease(i / STEPS), y) };
      });
      frames.push({ offset: 1, transform: "none" });
      // As soon as the page moves, the header's Zel stands in for the hero's.
      const swap = (shown: boolean): Keyframe[] => [
        { offset: 0, opacity: shown ? 0 : 1 }, { offset: at(top + 1), opacity: shown ? 1 : 0 }, { offset: 1, opacity: shown ? 1 : 0 },
      ];
      animations = [
        mark.animate(frames, { timeline, fill: "both" }),
        mark.animate(swap(true), { timeline, fill: "both" }),
        zel.animate(swap(false), { timeline, fill: "both" }),
      ];
    };
    mark.style.setProperty("transition", "none");
    measure();
    addEventListener("resize", measure);
    addEventListener("load", measure);
    // The page's height sets where the trip falls on the timeline (the story below
    // gets shorter once it has played).
    const observer = timeline ? new ResizeObserver(() => measure()) : null;
    observer?.observe(document.documentElement);
    return () => {
      removeEventListener("resize", measure);
      removeEventListener("load", measure);
      observer?.disconnect();
      for (const animation of animations) animation.cancel();
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
      {/* The spark beside the wordmark opens where the name comes from. */}
      <div className="relative z-[3] motion-safe:animate-arrive">
        <h1 id="hero-title" className="leading-none">
          <Wordmark alt="zellige" className="mx-auto h-auto w-[min(62vw,clamp(200px,26vh,280px))] drop-shadow-[0_14px_20px_#0f3b6e26]" />
        </h1>
        <WhyZellige />
      </div>
      <div className="mt-3 mb-5 sm:mt-4 sm:mb-6">
        <Emblem reduced={reduced} />
      </div>
      <p className="hero-copy relative z-[2] max-w-[22ch] text-[clamp(26px,3.4vw,42px)] leading-[1.08] tracking-[-0.045em] text-balance">
        {t.hero.title.lead} <em className="text-accent">{t.hero.title.turn}</em>
      </p>
      {/* Bring your own: kept in English, as the jargon is. */}
      <p className="hero-copy relative z-[2] mt-6 flex flex-wrap items-center justify-center gap-2 text-[15px] sm:text-base">
        <span className="mr-1 font-semibold">{t.hero.bring.lead}</span>
        {t.hero.bring.items.map((item, index) => {
          const Icon = bringIcons[index];
          return (
            <span key={item} className="inline-flex items-center gap-1.5 rounded-full border border-brass/60 bg-popover/80 py-1 pr-3 pl-2 font-medium shadow-[0_8px_20px_-14px_rgb(20_43_53/0.5)]">
              <Icon aria-hidden="true" strokeWidth={1.75} className="size-4 text-gold" />{item}
            </span>
          );
        })}
      </p>
      {/* Next section: a quiet cue at the bottom edge. */}
      <a
        href="#piezas"
        aria-label={t.hero.next}
        title={t.hero.next}
        className="hero-copy absolute bottom-4 left-1/2 z-[2] grid size-10 [@media(max-height:700px)]:hidden -translate-x-1/2 place-items-center rounded-full border border-border bg-popover/80 text-muted-foreground transition-colors hover:border-brass hover:text-foreground sm:bottom-6"
      >
        <ChevronDown aria-hidden="true" className="size-5 motion-safe:animate-bounce" />
      </a>
    </section>
  );
}
