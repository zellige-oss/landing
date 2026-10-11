import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react";
import { Check } from "lucide-react";
import { useScrollProgress } from "@/hooks/use-scroll-progress";
import { cn } from "@/lib/utils";
import type { Mood } from "@/components/Companion";
import { Trio, ZelGlyph, type Piece } from "@/components/Trio";
import { useT } from "@/i18n";

/** The stages of the story: one per part of Zel, then the whole tile. Each part is a
 *  character, with the face its glyph also wears (scripts/build-brand.mjs), each
 *  one with its own gesture: the personal agent notices things, the harness manager
 *  checks its work, and chat looks on and winks. All arrive with open eyes. */
const steps: { layer?: Piece; key: Piece | "tile"; mood: Mood }[] = [
  { layer: "crown", key: "crown", mood: "curious" },
  { layer: "cobalt", key: "cobalt", mood: "determined" },
  { layer: "points", key: "points", mood: "wink" },
  { key: "tile", mood: "look" },
];
const parts = steps.filter((step): step is { layer: Piece; key: Piece; mood: Mood } => !!step.layer);
/** The agent's nod follows its gaze in useZelEyes. The harness manager spins once
 *  like a tool, and chat winks and bows. */
const REACTIONS: Record<Exclude<Piece, "crown">, { duration: number; frames: Keyframe[] }> = {
  cobalt: {
    duration: 780,
    frames: [
      { rotate: "0deg", scale: "1", offset: 0 },
      { rotate: "-18deg", scale: "0.96", offset: 0.16 },
      { rotate: "372deg", scale: "1.03", offset: 0.78 },
      { rotate: "360deg", scale: "1", offset: 1 },
    ],
  },
  points: {
    duration: 860,
    frames: [
      { rotate: "0deg", translate: "0 0", offset: 0 },
      { rotate: "14deg", translate: "3% 3%", offset: 0.3 },
      { rotate: "14deg", translate: "3% 3%", offset: 0.55 },
      { rotate: "-3deg", translate: "0 -1%", offset: 0.82 },
      { rotate: "0deg", translate: "0 0", offset: 1 },
    ],
  },
};
/** What the harness manager has just run, a new one each time it is poked. */
const COMMANDS = ["build", "test", "lint", "deploy"];
const last = steps.length - 1;

/** Where each stage begins, as a share of the story's scroll: the three layers, then the whole tile. */
const STARTS = [0.16, 0.4, 0.62, 0.84];
// Before the first part, Zel arrives whole. Scrolling back retraces the story.
const stepAt = (t: number) => STARTS.filter((start) => t >= start).length - 1;

/** Zel drops back into the page, as one whole character, when its stage enters. */
function useStoryArrival(arrival: RefObject<HTMLDivElement | null>, reduced: boolean) {
  useEffect(() => {
    const node = arrival.current;
    const stage = node?.parentElement;
    if (reduced || !node || !stage) return;
    // Restored scroll positions and anchor links can land after the entrance.
    if (stage.getBoundingClientRect().bottom <= 0) return;
    node.setAttribute("data-arrival", "waiting");
    const settle = (event: AnimationEvent) => {
      if (event.target === node && ["story-arrive", "story-arrive-compact"].includes(event.animationName)) node.setAttribute("data-arrival", "settled");
    };
    node.addEventListener("animationend", settle);
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || entry.intersectionRatio < 0.35) return;
      node.setAttribute("data-arrival", "arrived");
      observer.disconnect();
    }, { threshold: 0.35, rootMargin: "0px 0px -8% 0px" });
    observer.observe(stage);
    return () => {
      observer.disconnect();
      node.removeEventListener("animationend", settle);
      node.removeAttribute("data-arrival");
    };
  }, [arrival, reduced]);
}

/** What a part does, beside it while it has the stage: chat is typing, the harness
 *  manager has just built something, the agent keeps a note for you. */
function PartProp({ part, turn }: { part: Piece; turn: number }) {
  const t = useT();
  // Each one sits by its part: the crown is small and central, the points reach the edge.
  const place = "pointer-events-none absolute z-[2] flex items-center motion-safe:animate-[prop-in_0.45s_cubic-bezier(0.2,1.4,0.4,1)_both]";
  if (part === "points") return (
    <div aria-hidden="true" className={cn(place, "top-[26%] right-[10%] gap-1 rounded-[18px] rounded-bl-md bg-foreground px-2.5 py-2 sm:gap-1.5 sm:px-3 sm:py-2.5")}>
      {[0, 1, 2].map((dot) => <i key={dot} className={cn("size-1.5 rounded-full bg-background/70 motion-safe:animate-[typing_1.2s_ease-in-out_infinite] sm:size-2", dot === 1 && "[animation-delay:0.15s]", dot === 2 && "[animation-delay:0.3s]")} />)}
    </div>
  );
  if (part === "cobalt") return (
    <div aria-hidden="true" className={cn(place, "top-[1%] right-[-4%] gap-3 rounded-lg border border-border bg-background px-3.5 py-2.5 font-mono text-sm text-muted-foreground")}>
      $ {COMMANDS[turn % COMMANDS.length]} <Check strokeWidth={3} className="size-4 text-ok" />
    </div>
  );
  return (
    <div aria-hidden="true" data-agent-note className={cn(place, "top-[10%] right-[-3%] gap-2.5 rounded-xl border border-brass/60 bg-popover px-3.5 py-2 text-xs leading-tight")}>
      <i className="size-2 rounded-full bg-gold" />
      <span><strong className="block font-semibold">{t.story.reminder.when}</strong><span className="text-muted-foreground">{t.story.reminder.what}</span></span>
    </div>
  );
}

/**
 * Holds a sticky panel in the middle of the screen below the fixed header. Centring
 * it inside a screen-tall panel would leave that room under it once it scrolls on,
 * a gap before what follows; a panel as tall as its content, stuck at the right
 * height, leaves none. Taller than the room, it sticks right under the header.
 */
function useCentredSticky(panel: RefObject<HTMLElement | null>, active: boolean) {
  useLayoutEffect(() => {
    const node = panel.current;
    if (!active || !node) return;
    const place = () => {
      const header = document.querySelector("header")?.offsetHeight ?? 0;
      const room = innerHeight - header - node.offsetHeight;
      node.style.setProperty("top", `${header + Math.max(0, room / 2)}px`);
    };
    place();
    const observer = new ResizeObserver(place);
    observer.observe(node);
    addEventListener("resize", place);
    return () => {
      observer.disconnect();
      removeEventListener("resize", place);
      node.style.removeProperty("top");
    };
  }, [panel, active]);
}

/*
 * Scroll story: Zel stays in the centre of the tile and each step shows one layer
 * around it, one way of using Zel, then the whole tile and how to reach it. The
 * title stays with it. Zel arrives whole, then each part takes the stage before
 * they reunite. The four progress buttons also jump directly to each step.
 */
export function Story({ reduced }: { reduced: boolean }) {
  const t = useT();
  const track = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(-1);
  // The layer under the mouse, on the tile or on its part in the text: the part
  // lights up, the rest step back and the tile lifts that layer.
  const [pointed, setPointed] = useState<Piece>();
  // The layer picked with a click or a tap once the tile is whole, which stays lifted.
  const [picked, setPicked] = useState<Piece>();
  // Poking a part makes it answer: it reacts in its own way and says its next line.
  const [said, setSaid] = useState<Record<Piece, number>>({ crown: 0, cobalt: 0, points: 0 });
  const [pokes, setPokes] = useState(0);
  const actor = useRef<HTMLDivElement>(null);
  const arrival = useRef<HTMLDivElement>(null);
  useStoryArrival(arrival, reduced);
  // Keep the scroll track stable, including on a return visit. This makes the
  // discovery repeatable and lets browser history and anchor links keep their place.
  const live = !reduced;
  const anchored = useRef(false);
  useLayoutEffect(() => {
    // Hydration expands the static list into its scroll track. A direct section
    // link must land after that layout (and the local font) is ready. Reloads and
    // history navigation keep the browser's own restored scroll position.
    if (anchored.current || (reduced && !matchMedia("(prefers-reduced-motion: reduce)").matches)) return;
    const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    const hash = location.hash;
    if (!hash || navigation?.type !== "navigate") return;
    let cancelled = false;
    const land = () => {
      if (cancelled || location.hash !== hash) return;
      document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "instant", block: "start" });
      anchored.current = true;
    };
    const frame = requestAnimationFrame(land);
    void document.fonts.ready.then(land);
    return () => { cancelled = true; cancelAnimationFrame(frame); };
  }, [reduced]);
  useScrollProgress(track, "through", (progress) => {
    setActive(stepAt(progress));
    // The part that was under the pointer can move away while scrolling.
    setPointed(undefined);
  }, live);
  useCentredSticky(panel, live);
  const stage = live ? active : null;
  const show = stage !== null && stage >= 0 ? steps[stage].layer : undefined;
  const whole = !show;
  const complete = !live || stage === last;
  const lit = whole ? pointed ?? picked : undefined;
  // The part that has the stage: shown alone by the story, or lit in the whole tile.
  const starring = show ?? lit;
  function poke(piece: Piece) {
    setSaid((lines) => ({ ...lines, [piece]: lines[piece] + 1 }));
    setPokes((count) => count + 1);
    if (!reduced && piece !== "crown") {
      const { frames, duration } = REACTIONS[piece];
      actor.current?.animate(frames, { duration, easing: "cubic-bezier(0.3, 0, 0.3, 1)" });
    }
  }
  // In the whole tile a poke also picks the part, which stays lifted until the reader
  // taps elsewhere.
  const pick = (piece: Piece) => { setPicked(piece); poke(piece); };
  // A tap or click anywhere but on a part (its row or the tile) lets the picked one go.
  useEffect(() => {
    if (!picked) return;
    const release = (event: PointerEvent) => {
      if (!(event.target instanceof Element) || !event.target.closest(".story-step, #piezas .tile")) setPicked(undefined);
    };
    addEventListener("pointerdown", release);
    return () => removeEventListener("pointerdown", release);
  }, [picked]);
  /** Scrolls to where a step has just begun. */
  function goTo(index: number) {
    const node = track.current;
    if (!node) return;
    const top = node.getBoundingClientRect().top + scrollY;
    const span = node.offsetHeight - innerHeight;
    scrollTo({ top: top + (STARTS[index] + 0.02) * span, behavior: "smooth" });
  }

  const gutter = "px-6 sm:px-[clamp(24px,4.5vw,80px)] min-[1800px]:mx-auto min-[1800px]:max-w-[1800px]";
  return (
    <section id="piezas" aria-labelledby="piezas-title" className="relative">
      <div ref={track} className={cn(live && "h-[320svh]")}>
        {/* As tall as the story, held in the middle of the screen under the fixed
            header (useCentredSticky), so "Por dentro" comes straight after it. Until
            that is measured, it sits right under the header: 68 px, 76 px from sm. */}
        <div
          ref={panel}
          className={cn("relative", live ? "sticky top-[68px] pt-6 pb-4 sm:top-[76px]" : "pt-20 pb-4")}
        >
          {/* The title stays with the story: on phones above the tile and the step, on
              wide screens above the steps, with the tile beside them. */}
          <div
            className={cn(
              gutter,
              "grid content-start gap-x-[6vw] gap-y-4 lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:items-center",
            )}
          >
            <div className="lg:col-start-1 lg:row-start-1 lg:self-end">
              <h2 id="piezas-title" className="section-title">
                {t.story.title}
              </h2>
              <p className={cn("mt-4 max-w-[52ch] text-[15px] leading-[1.7] text-muted-foreground sm:text-base", live && active >= 0 && "[@media(max-height:740px)]:max-lg:hidden")}>
                <strong className="font-medium text-foreground">{t.story.intro.lead}</strong>{" "}
                {t.story.intro.body}
              </p>
            </div>
            <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1">
              {/* The stage: it glows in the colour of the part on it, with what that part does beside it. */}
              <div data-part={starring} className="story-stage relative mx-auto w-[min(58vw,28svh,300px)] sm:w-[min(62vw,38svh,380px)] lg:w-[min(84%,460px,60svh)]">
                {/* The actor: what reacts to a poke. Alone on the stage, the part answers a
                    click anywhere on it; in the whole tile, Trio tells which part was meant. */}
                <div ref={arrival} className="story-arrival">
                  <div ref={actor} onClick={show ? () => poke(show) : undefined} className={cn("[transform-origin:49.86%_51.21%]", show && "cursor-pointer")}>
                    <Trio
                      mood={parts.find((step) => step.layer === starring)?.mood ?? steps[stage === null || stage < 0 ? last : stage].mood}
                      show={show}
                      lift={lit}
                      cue={pokes}
                      onPick={(piece) => { if (whole) pick(piece); else goTo(steps.findIndex((step) => step.layer === piece)); }}
                      onHover={setPointed}
                      className="w-full"
                    />
                  </div>
                  {starring && <PartProp key={`${starring}${pokes}`} part={starring} turn={said[starring]} />}
                </div>
                <span aria-hidden="true" className="story-ground" />
              </div>
              {/* The end of the story, under the whole tile rather than among its parts. */}
              {complete && (
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
                        className="group flex h-9 min-w-9 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass"
                      >
                        <span aria-hidden="true" className={cn("h-1.5 rounded-full transition-[width,background-color] duration-300", stage === index ? "w-7 bg-brass" : "w-1.5 bg-foreground/25 group-hover:bg-foreground/45")} />
                      </button>
                    </li>
                  ))}
                </ol>
              )}
              <ol className="grid gap-1">
                {parts.map((step, index) => {
                  const current = lit ? step.layer === lit : stage === index;
                  const quiet = lit ? !current : live && active >= 0 && !current && !complete;
                  const copy = t.story.steps[step.key];
                  return (
                    <li
                      key={step.key}
                      aria-current={stage === index ? "step" : undefined}
                      data-part={step.layer}
                      onClick={() => { if (complete) pick(step.layer); else if (current) poke(step.layer); else goTo(index); }}
                      onPointerEnter={(event) => { if (event.pointerType === "mouse") setPointed(step.layer); }}
                      onPointerLeave={() => setPointed(undefined)}
                      className={cn(
                        "story-step rounded-2xl border border-transparent p-4 transition-[opacity,background-color,border-color] duration-300 sm:p-5",
                        quiet && "opacity-40",
                        "cursor-pointer",
                        live && !current && !whole && "hover:opacity-80",
                        // On phones the active part has the stage to itself. When the
                        // tile is whole, all three names return and can be selected.
                        // When assembled, they stay names until one is picked; with reduced
                        // motion there is no sticky story, and every part reads in full.
                        !reduced && !current && "max-lg:py-1",
                        live && !whole && !current && "max-lg:hidden",
                        current && "story-step-current shadow-[0_14px_34px_-22px_rgb(var(--shadow-ink)/0.45)]",
                      )}
                    >
                      <p className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-base sm:text-lg">
                        <ZelGlyph layer={step.layer} className={cn("size-9", !reduced && !current && "max-lg:size-8")} />
                        <strong className="font-semibold">{copy.title}</strong>
                      </p>
                      {/* The part's own line, in its colour. */}
                      <p
                        key={said[step.layer]}
                        className={cn("story-voice mt-1.5 text-[15px] font-medium sm:text-base", said[step.layer] > 0 && "motion-safe:animate-[voice-in_0.35s_cubic-bezier(0.2,1.4,0.4,1)]", !reduced && !current && "max-lg:hidden")}
                      >
                        {copy.voices[said[step.layer] % copy.voices.length]}
                      </p>
                      {/* While the story plays, only the current part reads in full, so the
                          panel fits the screen; the others keep their name and their line. */}
                      <p className={cn("mt-1.5 max-w-[52ch] text-[15px] leading-[1.7] text-muted-foreground sm:text-base", live && !current ? "hidden" : !reduced && !current && "max-lg:hidden")}>{copy.body}</p>
                    </li>
                  );
                })}
              </ol>
              {/* Room under the parts, a little more than a line of text, so the whole
                  tile's summary does not end flush against them. */}
              {complete && <div aria-hidden="true" className="hidden h-14 lg:block" />}

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
