import { useCallback, useEffect, useRef, type RefObject } from "react";
import { useScrollProgress } from "@/hooks/use-scroll-progress";
import { ChevronDown, KeyRound, Plug, Workflow } from "lucide-react";
import { cn } from "@/lib/utils";
import { ease } from "@/lib/easing";
import { useT } from "@/i18n";
import { Companion } from "@/components/Companion";
import { zelFlight } from "@/components/brand";
import { Wordmark } from "@/components/Wordmark";
import { WhyZellige } from "@/components/WhyZellige";

const bringIcons = [Workflow, Plug, KeyRound];

/** Keeps hyphenated words on one line. Onest has no non-breaking hyphen (U+2011):
 *  the browser draws it from a fallback font, over the letter after it. */
function unbroken(text: string) {
  return text.split(/(\S+-\S+)/).map((part, index) => (index % 2 ? <span key={index} className="whitespace-nowrap">{part}</span> : part));
}

/*
 * Centred and symmetric, like the emblem: wordmark, Zel, one line, one button.
 * Zel appears, the emblem's layers fly in from beyond the screen and lock around
 * it (CSS), and Zel says hello; scrolling away lets the layers drift apart toward the story
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

// A separate, hero-sized image flies to the header, scaling down only. Enlarging
// the small header logo for takeoff loses detail, especially on high-DPI screens.
// At either end the original hero/header takes over; the header is never scaled.
// Geometry is measured on load and resize only, never while scrolling.
// Where the browser has scroll timelines with ranges, the trip is an animation on
// the page's scroll, which the browser runs alongside scrolling itself: driven from
// scroll events instead, it trails the finger on phones, a frame or more behind.
// The emblem's whole Zel inside its square image (scripts/build-brand.mjs trims it).
const ZEL_BOX = { x: 67 / 1254, y: 92 / 1254, w: 1119 / 1254, h: 1082 / 1254 };
/** The trip takes the first half of the hero's scroll. */
const TRIP = 0.5;
/** Keyframes along the trip: enough that its easing reads as a curve. */
const STEPS = 24;

type Trip = { from: DOMRect; to: DOMRect; zel: HTMLElement; mark: HTMLElement; flight: HTMLImageElement };
/** Where the flying Zel sits at `e` of the way (eased) with the page scrolled to `y`. */
function transformAt({ from, to }: Trip, e: number, y: number) {
  const x = from.x + (to.x - from.x) * e;
  const top = from.y - y + (to.y - (from.y - y)) * e;
  const width = from.width + (to.width - from.width) * e;
  return `translate(${x.toFixed(1)}px, ${top.toFixed(1)}px) scale(${(width / from.width).toFixed(6)})`;
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
    const { zel, mark, flight } = g;
    zel.style.setProperty("opacity", e > 0 ? "0" : "1");
    mark.style.setProperty("opacity", e >= 1 ? "1" : "0");
    flight.style.setProperty("opacity", e > 0 && e < 1 ? "1" : "0");
    if (e <= 0 || e >= 1) { flight.style.removeProperty("transform"); return; }
    flight.style.setProperty("transform", transformAt(g, e, scrollY));
  }, []);

  useEffect(() => {
    const hero = section.current;
    const zel = hero?.querySelector<HTMLElement>(".hero-zel");
    const mark = document.getElementById("header-zel");
    if (reduced || !hero || !zel || !mark) return;
    const ranged = "ScrollTimeline" in window && CSS.supports("animation-range", "0px 1px");
    const timeline = ranged ? new ScrollTimeline({ source: document.documentElement, axis: "block" }) : null;
    // Outside the header's backdrop-filter and the hero's clipped stacking context.
    const flight = document.createElement("img");
    flight.id = "zel-flight";
    flight.src = zelFlight;
    flight.alt = "";
    flight.draggable = false;
    flight.setAttribute("aria-hidden", "true");
    flight.className = "pointer-events-none fixed top-0 left-0 z-[11] max-w-none origin-top-left opacity-0";
    document.body.append(flight);
    let animations: Animation[] = [];
    const measure = () => {
      // Keep the original visible until the flight image can actually be drawn.
      if (!flight.complete || !flight.naturalWidth) return;
      for (const animation of animations) animation.cancel();
      animations = [];
      const tile = zel.getBoundingClientRect();
      // The hero's Zel in page coordinates; the header's in the viewport (it is fixed).
      const from = new DOMRect(tile.left + tile.width * ZEL_BOX.x, tile.top + scrollY + tile.height * ZEL_BOX.y, tile.width * ZEL_BOX.w, tile.height * ZEL_BOX.h);
      const trip = { from, to: mark.getBoundingClientRect(), zel, mark, flight };
      flight.style.setProperty("width", `${from.width}px`);
      flight.style.setProperty("height", `${from.width * trip.to.height / trip.to.width}px`);
      const top = hero.getBoundingClientRect().top + scrollY;
      const length = TRIP * hero.offsetHeight;
      last.current = -1;
      if (!timeline) {
        geometry.current = trip;
        place((scrollY - top) / hero.offsetHeight);
        return;
      }
      const frames: Keyframe[] = Array.from({ length: STEPS + 1 }, (_, i) => ({
        transform: transformAt(trip, ease(i / STEPS), top + (i / STEPS) * length),
      }));
      const range = { timeline, rangeStart: `${top}px`, rangeEnd: `${top + length}px` };
      const swap = { timeline, rangeStart: `${top}px`, rangeEnd: `${top + 1}px`, fill: "both" } as const;
      animations = [
        flight.animate(frames, { ...range, fill: "both" }),
        flight.animate([
          { opacity: 0, offset: 0 },
          { opacity: 1, offset: 1 / length },
          { opacity: 1, offset: 1 - 1 / length },
          { opacity: 0, offset: 1 },
        ], { ...range, fill: "both" }),
        mark.animate([{ opacity: 0 }, { opacity: 1 }], { ...swap, rangeStart: `${top + length - 1}px`, rangeEnd: `${top + length}px` }),
        zel.animate([{ opacity: 1 }, { opacity: 0 }], swap),
      ];
    };
    mark.style.setProperty("transition", "none");
    flight.addEventListener("load", measure);
    measure();
    addEventListener("resize", measure);
    addEventListener("load", measure);
    // The trip's stretch of scroll follows the hero's size.
    const observer = new ResizeObserver(measure);
    observer.observe(hero);
    return () => {
      removeEventListener("resize", measure);
      removeEventListener("load", measure);
      flight.removeEventListener("load", measure);
      observer.disconnect();
      for (const animation of animations) animation.cancel();
      flight.remove();
      geometry.current = null;
      for (const prop of ["transition", "opacity"]) mark.style.removeProperty(prop);
      zel.style.removeProperty("opacity");
    };
  }, [section, reduced, place]);
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
        {t.hero.title.lead} <em className="text-accent">{unbroken(t.hero.title.turn)}</em>
      </p>
      {/* Harness, subscription and API key: connect what the visitor already uses.
          Each one leads to the section that lists them. */}
      <p className="hero-copy relative z-[2] mt-6 flex flex-wrap items-center justify-center gap-2 text-[15px] sm:text-base">
        <span className="mr-1 font-semibold">{t.hero.bring.lead}</span>
        {t.hero.bring.items.map((item, index) => {
          const Icon = bringIcons[index];
          return (
            <a key={item} href="#funciones" className="inline-flex items-center gap-1.5 rounded-full border border-brass/60 bg-popover/80 py-1 pr-3 pl-2 font-medium shadow-[0_8px_20px_-14px_rgb(20_43_53/0.5)] transition-colors hover:border-brass hover:bg-popover">
              <Icon aria-hidden="true" strokeWidth={1.75} className="size-4 text-gold" />{item}
            </a>
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
