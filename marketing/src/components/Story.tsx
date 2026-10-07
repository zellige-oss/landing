import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useScrollProgress } from "@/hooks/use-scroll-progress";
import { cn } from "@/lib/utils";
import type { Mood } from "./Companion";
import { LayerGlyph, Trio, type Piece } from "./Trio";
import { useT } from "@/i18n";

const steps: { layer?: Piece; key: Piece | "tile"; mood: Mood }[] = [
  { layer: "crown", key: "crown", mood: "curious" },
  { layer: "cobalt", key: "cobalt", mood: "thinking" },
  { layer: "points", key: "points", mood: "excited" },
  { key: "tile", mood: "hello" },
];

const clamp = (value: number) => Math.min(1, Math.max(0, value));
// Each layer's progress goes only onto the elements that use it (the layer, its
// label, the assembled emblem), not the section: a variable on the section would
// restyle the whole section on every scroll event, which phones cannot keep up with.
const users = { "--p2": ".layer-cobalt, .label-cobalt, .zel-whole", "--p3": ".layer-points, .label-points, .zel-whole" };
// Most scroll events leave a layer's progress where it was (0 or 1); skip those.
const written = new WeakMap<HTMLElement, Partial<Record<keyof typeof users, string | null>>>();
function setProgress(section: HTMLElement, name: keyof typeof users, value: string | null) {
  const last = written.get(section) ?? {};
  if (last[name] === value) return;
  written.set(section, { ...last, [name]: value });
  for (const element of section.querySelectorAll<HTMLElement>(users[name])) {
    if (value === null) element.style.removeProperty(name);
    else element.style.setProperty(name, value);
  }
}
/** The step where Zel arrives: the whole tile, once every layer is in place. */
const FOUND = steps.findIndex((step) => step.key === "tile");
/** Each step takes a quarter of the story's scroll; a layer lands just before its step. */
const SHARE = 1 / steps.length;
const stepAt = (t: number) => Math.min(steps.length - 1, Math.floor(t / SHARE));

/*
 * Scroll story: each kind of AI use arrives as a layer of the emblem until the tile
 * is complete. The title and the dictionary entry scroll past first; then, while the
 * story plays, the screen holds only the tile, where you are (four dots, which jump
 * to a step) and the current step, so every scroll visibly changes something.
 */
export function Story({ reduced }: { reduced: boolean }) {
  const t = useT();
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number>();
  const [atStart, setAtStart] = useState(true);
  // The crown is the base; the blue and the points close in around an empty centre,
  // and only the last step drops Zel into it, wide-eyed for a moment from the landing.
  // Scrolling back empties the centre again, so the arrival replays.
  const [startled, setStartled] = useState(false);
  const wasFound = useRef(false);
  const calm = useRef<number>(undefined);
  // With reduced motion the tile simply stays assembled and the steps read as a list.
  useScrollProgress(track, "through", (t) => {
    const node = section.current;
    if (!node) return;
    setProgress(node, "--p2", clamp((t - (SHARE - 0.08)) / 0.08).toFixed(3));
    setProgress(node, "--p3", clamp((t - (2 * SHARE - 0.08)) / 0.08).toFixed(3));
    const step = stepAt(t);
    setActive(step);
    setAtStart(t < 0.06);
    const isFound = step >= FOUND;
    if (isFound !== wasFound.current) {
      wasFound.current = isFound;
      window.clearTimeout(calm.current);
      setStartled(isFound);
      if (isFound) calm.current = window.setTimeout(() => setStartled(false), 1300);
    }
  }, !reduced);
  useEffect(() => () => window.clearTimeout(calm.current), []);
  // The story only runs with motion allowed; otherwise (and before hydration) it is a plain list.
  const live = !reduced;
  const stage = live ? active ?? 0 : null;
  const focus = live && active !== undefined ? steps[active].layer : undefined;
  const found = !live || (stage ?? 0) >= FOUND;
  useEffect(() => {
    const node = section.current;
    if (!node) return;
    for (const name of ["--p2", "--p3"] as const) setProgress(node, name, live ? "0" : null);
  }, [live]);

  /** Scrolls to where a step has just begun (its layer already in place). */
  function goTo(index: number) {
    const node = track.current;
    if (!node) return;
    const top = node.getBoundingClientRect().top + scrollY;
    const span = node.offsetHeight - innerHeight;
    scrollTo({ top: top + (index ? index * SHARE + 0.02 : 0) * span, behavior: "smooth" });
  }

  const gutter = "px-6 sm:px-[clamp(24px,4.5vw,80px)] min-[1800px]:mx-auto min-[1800px]:max-w-[1800px]";
  return (
    <section ref={section} id="piezas" aria-labelledby="piezas-title" className="relative">
      <div className={cn(gutter, "pt-20 pb-4 lg:pb-8")}>
        <p className="eyebrow">{t.header.links.idea}</p>
        <h2 id="piezas-title" className="mt-4 text-[clamp(38px,9vw,52px)] leading-[1.02] sm:text-[clamp(44px,4.6vw,76px)]">
          {t.story.headline.lead}<br /><em className="text-accent">{t.story.headline.turn}</em>
        </h2>
        {/* A dictionary entry: where the name, and the metaphor, come from. */}
        <dl className="mt-6 max-w-[52ch] border-l-2 border-brass pl-4">
          <dt className="flex flex-wrap items-baseline gap-x-2.5 text-sm">
            <span className="font-semibold">zel·li·ge</span>
            <span className="text-muted-foreground">/zɛˈliːʒ/</span>
            <span lang="ar" dir="rtl" className="text-muted-foreground">الزليج</span>
          </dt>
          <dd className="mt-1 text-[15px] leading-relaxed text-muted-foreground">{t.story.definition}</dd>
        </dl>
      </div>
      <div ref={track} className={cn(live && "h-[300vh]")}>
        <div
          className={cn(
            gutter,
            "grid items-center gap-5 lg:grid-cols-[1fr_1fr] lg:gap-[6vw]",
            // Below the fixed header, which is 68 px tall (76 px from sm).
            live ? "sticky top-[68px] h-[calc(100svh-68px)] content-center py-4 sm:top-[76px] sm:h-[calc(100svh-76px)]" : "pt-6 pb-20",
          )}
        >
          <div>
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
              {steps.map((step, index) => {
                const current = stage === index;
                const copy = t.story.steps[step.key];
                return (
                  <li
                    key={step.key}
                    aria-current={current ? "step" : undefined}
                    onClick={live && !current ? () => goTo(index) : undefined}
                    className={cn(
                      "story-step rounded-2xl border border-transparent p-4 transition-[opacity,background-color,border-color] duration-500 sm:p-5",
                      live && !current && "cursor-pointer opacity-45 hover:opacity-80 max-lg:hidden",
                      current && "border-brass/60 bg-popover/80 shadow-[0_14px_34px_-22px_rgb(20_43_53/0.45)]",
                    )}
                  >
                    <p className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-base sm:text-lg">
                      {step.layer ? <LayerGlyph layer={step.layer} className="size-7" /> : <span aria-hidden="true" className="size-2.5 rotate-45 bg-brass" />}
                      <strong className="font-semibold">{copy.title}</strong>
                      {step.layer && <span className="rounded-full bg-surface px-2.5 py-0.5 text-[13px] text-muted-foreground">{t.layers[step.layer].use}</span>}
                    </p>
                    <p className="mt-2 max-w-[52ch] text-[15px] leading-[1.7] text-muted-foreground sm:text-base">{copy.body}</p>
                  </li>
                );
              })}
            </ol>
            {live && (
              <p aria-hidden="true" className={cn("mt-4 flex items-center gap-2 text-sm text-muted-foreground transition-opacity duration-500 max-lg:justify-center", !atStart && "opacity-0")}>
                <ChevronDown className="size-4 motion-safe:animate-bounce" /> {t.story.hint}
              </p>
            )}
          </div>
          <Trio
            mood={live && startled ? "surprised" : steps[stage ?? 3].mood}
            focus={focus}
            found={found}
            mode="scroll"
            className="mx-auto w-[min(66vw,34svh,300px)] max-lg:order-first sm:w-[min(66vw,40svh,380px)] lg:w-[min(84%,460px,62svh)]"
          />
        </div>
      </div>
    </section>
  );
}
