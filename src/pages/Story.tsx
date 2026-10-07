import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useScrollProgress } from "@/hooks/use-scroll-progress";
import { cn } from "@/lib/utils";
import type { Mood } from "@/components/Companion";
import { Trio, ZelGlyph, type Piece } from "@/components/Trio";
import { Workings } from "@/components/Workings";
import { useT } from "@/i18n";

/** The stages of the story: one per layer, then the whole tile. */
const steps: { layer?: Piece; key: Piece | "tile"; mood: Mood }[] = [
  { layer: "crown", key: "crown", mood: "curious" },
  { layer: "cobalt", key: "cobalt", mood: "thinking" },
  { layer: "points", key: "points", mood: "excited" },
  { key: "tile", mood: "hello" },
];
const parts = steps.filter((step): step is { layer: Piece; key: Piece; mood: Mood } => !!step.layer);
const last = steps.length - 1;

/** Where each stage begins, as a share of the story's scroll. The whole tile comes
 *  last and briefly, so "Por dentro" follows soon after it. */
const STARTS = [0, 0.3, 0.6, 0.9];
const stepAt = (t: number) => Math.max(0, STARTS.filter((start) => t >= start).length - 1);

/*
 * Scroll story: Zel stays in the centre of the tile and each step shows one layer
 * around it, one way of using Zel, then the whole tile and how to reach it. The
 * title scrolls past first; then, while the story plays, the screen holds only the
 * tile, where you are (four dots, which jump to a step) and the current step, so
 * every scroll visibly changes something.
 */
export function Story({ reduced }: { reduced: boolean }) {
  const t = useT();
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number>();
  const [atStart, setAtStart] = useState(true);
  // The story plays once. After the reader has seen the whole tile and scrolled on
  // past it, it settles into a still summary (every step, the whole tile, every
  // label), so coming back up never replays it.
  const [settled, setSettled] = useState(false);
  // The layer under the mouse, on the tile or on its part in the text: the part
  // lights up, the rest step back and the tile lifts that layer.
  const [pointed, setPointed] = useState<Piece>();
  const seenEnd = useRef(false);
  // What the reader is looking at when the story settles (the next section) and
  // where it was on screen, to put it back exactly there afterwards.
  const anchor = useRef<{ element: Element; top: number } | null>(null);
  // With reduced motion the tile simply stays assembled and the steps read as a list.
  useScrollProgress(track, "through", (t) => {
    const step = stepAt(t);
    setActive(step);
    if (step === last) seenEnd.current = true;
    setAtStart(t < 0.06);
  }, !reduced && !settled);
  useEffect(() => {
    const node = section.current;
    if (reduced || settled || !node) return;
    const observer = new IntersectionObserver(([entry]) => {
      // Settle only once the whole section is above the screen, so the change in
      // height happens out of sight.
      if (entry.isIntersecting || entry.boundingClientRect.bottom > 0 || !seenEnd.current) return;
      const next = node.nextElementSibling;
      if (next) anchor.current = { element: next, top: next.getBoundingClientRect().top };
      // The browser's own scroll anchoring would also make up for the lost height;
      // with ours on top, the page jumped twice as far. Only ours runs.
      document.documentElement.style.setProperty("overflow-anchor", "none");
      setSettled(true);
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [reduced, settled]);
  // The section got shorter above the screen: scroll by however far the next section
  // moved, so what the reader is looking at stays exactly where it was.
  useLayoutEffect(() => {
    if (!settled) return;
    const held = anchor.current;
    anchor.current = null;
    if (held) {
      const moved = held.element.getBoundingClientRect().top - held.top;
      if (Math.abs(moved) > 0.5) scrollBy({ top: moved, behavior: "instant" });
    }
    const frame = requestAnimationFrame(() => document.documentElement.style.removeProperty("overflow-anchor"));
    return () => cancelAnimationFrame(frame);
  }, [settled]);
  // The story only runs with motion allowed, and only until it has settled; otherwise
  // (and before hydration) it is a plain list next to the whole tile.
  const live = !reduced && !settled;
  const stage = live ? active ?? 0 : null;
  const show = live && active !== undefined ? steps[active].layer : undefined;
  // The tile and its parts answer the mouse only when whole: at the end, or once settled.
  const whole = !live || stage === last;
  const lit = whole ? pointed : undefined;
  /** Scrolls to where a step has just begun. */
  function goTo(index: number) {
    const node = track.current;
    if (!node) return;
    const top = node.getBoundingClientRect().top + scrollY;
    const span = node.offsetHeight - innerHeight;
    scrollTo({ top: top + (index ? STARTS[index] + 0.02 : 0) * span, behavior: "smooth" });
  }

  const gutter = "px-6 sm:px-[clamp(24px,4.5vw,80px)] min-[1800px]:mx-auto min-[1800px]:max-w-[1800px]";
  return (
    <section ref={section} id="piezas" aria-labelledby="piezas-title" className="relative">
      <div ref={track} className={cn(live && "h-[300vh]")}>
        {/* The title stays with the story: on phones above the tile and the step, on
            wide screens above the steps, with the tile beside them. */}
        <div
          className={cn(
            gutter,
            "grid content-start gap-x-[6vw] gap-y-4 lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:items-center",
            // Below the fixed header, which is 68 px tall (76 px from sm). As tall as its
            // content, so the next part follows it as soon as the story ends.
            live ? "sticky top-[68px] pt-6 pb-4 sm:top-[76px]" : "pt-20 pb-10",
          )}
        >
          <h2 id="piezas-title" className="text-[clamp(32px,8vw,44px)] leading-[1.02] lg:col-start-1 lg:row-start-1 lg:self-end lg:text-[clamp(44px,4.2vw,68px)]">
            {t.story.title}
          </h2>
          <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1">
            <Trio
              mood={steps[stage ?? last].mood}
              show={show}
              lift={lit}
              onPick={(piece) => { if (live) goTo(steps.findIndex((step) => step.layer === piece)); }}
              onHover={setPointed}
              className="mx-auto w-[min(62vw,32svh,300px)] sm:w-[min(62vw,38svh,380px)] lg:w-[min(84%,460px,60svh)]"
            />
            {/* The end of the story, under the whole tile rather than among its parts. */}
            {whole && (
              <p className="story-end mx-auto mt-4 max-w-[40ch] text-center text-[15px] leading-[1.6] text-muted-foreground sm:text-base">
                <strong className="block text-lg font-semibold text-foreground sm:text-xl">{t.story.steps.tile.title}</strong>
                {t.story.steps.tile.body}
              </p>
            )}
          </div>
          <div className="lg:col-start-1 lg:row-start-2 lg:self-start">
            {live && (
              <ol aria-label={t.story.progress} className="mb-4 flex items-center gap-2 max-lg:justify-center">
                {steps.map((step, index) => (
                  <li key={step.key}>
                    <button
                      type="button"
                      onClick={() => goTo(index)}
                      aria-label={`${t.story.goTo} ${index + 1}: ${t.story.steps[step.key].title}`}
                      aria-current={stage === index ? "step" : undefined}
                      className={cn(
                        "block h-1.5 rounded-full transition-[width,background-color] duration-300",
                        stage === index ? "w-7 bg-brass" : "w-1.5 bg-foreground/25 hover:bg-foreground/45",
                      )}
                    />
                  </li>
                ))}
              </ol>
            )}
            <ol className="grid gap-1">
              {parts.map((step, index) => {
                const current = lit ? step.layer === lit : stage === index;
                const quiet = lit ? !current : live && !current && !whole;
                const copy = t.story.steps[step.key];
                return (
                  <li
                    key={step.key}
                    aria-current={stage === index ? "step" : undefined}
                    onClick={live && !current && !whole ? () => goTo(index) : undefined}
                    onPointerEnter={(event) => { if (event.pointerType === "mouse") setPointed(step.layer); }}
                    onPointerLeave={() => setPointed(undefined)}
                    className={cn(
                      "story-step rounded-2xl border border-transparent p-4 transition-[opacity,background-color,border-color] duration-300 sm:p-5",
                      quiet && "opacity-40",
                      live && !current && !whole && "cursor-pointer hover:opacity-80",
                      live && !current && "max-lg:hidden",
                      current && "border-brass/60 bg-popover/80 shadow-[0_14px_34px_-22px_rgb(20_43_53/0.45)]",
                    )}
                  >
                    <p className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-base sm:text-lg">
                      <ZelGlyph layer={step.layer} className="size-8" />
                      <strong className="font-semibold">{copy.title}</strong>
                    </p>
                    <p className="mt-2 max-w-[52ch] text-[15px] leading-[1.7] text-muted-foreground sm:text-base">{copy.body}</p>
                  </li>
                );
              })}
            </ol>
            {/* With a mouse, the whole tile and its parts point at each other. */}
            {whole && (
              <p aria-hidden="true" className="mt-4 hidden text-sm text-muted-foreground lg:pointer-fine:block">{t.story.hover}</p>
            )}
            {live && (
              <p aria-hidden="true" className={cn("mt-4 flex items-center gap-2 text-sm text-muted-foreground transition-opacity duration-500 max-lg:justify-center", !atStart && "opacity-0")}>
                <ChevronDown className="size-4 motion-safe:animate-bounce" /> {t.story.hint}
              </p>
            )}
          </div>
        </div>
      </div>
      <Workings className={gutter} />
    </section>
  );
}
