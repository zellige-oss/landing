import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useZelMotion } from "@/hooks/zel-motion";
import layerCentre from "@/assets/layer-centre.webp";
import layerCobaltJoined from "@/assets/layer-cobalt-joined.webp";
import layerCrown from "@/assets/layer-crown.webp";
import layerPointsJoined from "@/assets/layer-points-joined.webp";
import layerWhole from "@/assets/layer-whole.webp";

import { ZelFace, type Mood } from "./ZelFace";

export type { Mood };

/*
 * Zel is the standard emblem itself, with an obsidian face on its centre star.
 * The body is the emblem's four colour layers (scripts/build-layers.mjs), stacked
 * so they can also be shown one by one; each is a whole tile with its own rim, and
 * the assembled emblem, with its drawn rims, covers them while they rest in place
 * (.zel-whole in styles.css). The face is SVG, so Zel can change
 * expression, blink and look around (ZelFace.tsx); each mood also moves the tiles
 * in its own way (.zel-mood-* in styles.css), so Zel speaks with its body too.
 * Positions are set from JS through the CSS object model, never inline style
 * attributes in the markup, to stay within the landing's CSP.
 */
// Each Zel blinks on its own rhythm: a golden-ratio sequence spreads the gaps
// between blinks evenly without Math.random (which code scanners flag as insecure).
let blinkSeed = 0;
const nextBlinkPhase = () => (blinkSeed = (blinkSeed + 0.6180339887) % 1);

export type Layer = "centre" | "crown" | "cobalt" | "points";
/** Each layer as one piece: where the emblem splits a layer into four, its joined
 *  piece, so whatever moves, the blue and the green move as the mini Zel they are. */
export const layers: { name: Layer; src: string }[] = [
  { name: "points", src: layerPointsJoined },
  { name: "cobalt", src: layerCobaltJoined },
  { name: "crown", src: layerCrown },
  { name: "centre", src: layerCentre },
];
export function Companion({
  mood,
  className,
  alt = "",
  follow = false,
  lively = false,
  motionDelay = 0,
  restingOverlay = true,
  shadow,
}: {
  mood: Mood;
  className?: string;
  alt?: string;
  /** Let the open eyes follow the pointer. */
  follow?: boolean;
  /** Play the expressive motion study once the surrounding assembly has landed. */
  lively?: boolean;
  motionDelay?: number;
  /** Cover resting layers with the single-rim artwork; the hero uses its layers throughout. */
  restingOverlay?: boolean;
  /** A soft shadow under Zel, sized for where it sits (.zel-shadow-* in styles.css). */
  shadow?: "hero" | "tile";
}) {
  const root = useRef<HTMLDivElement>(null);
  useZelMotion(root, lively, motionDelay);
  useEffect(() => {
    const node = root.current;
    if (lively || !follow || !node || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // At most once a frame, only while Zel is on screen, and never for touch: a
    // finger is scrolling, and measuring Zel on every touch move forces the page to
    // lay out again each time, which makes scrolling stutter on phones.
    let visible = false, frame = 0, x = 0, y = 0;
    function aim() {
      frame = 0;
      const rect = node!.getBoundingClientRect();
      const dx = x - (rect.left + rect.width / 2);
      const dy = y - (rect.top + rect.height * 0.5);
      const length = Math.hypot(dx, dy) || 1;
      const reach = Math.min(1, length / 400);
      // Onto the eyes themselves, not as variables on Zel: that would restyle all of it.
      const offset = `${((dx / length) * reach * 70).toFixed(1)}px ${((dy / length) * reach * 50).toFixed(1)}px`;
      for (const eyes of node!.querySelectorAll<SVGGElement>(".companion-look")) eyes.style.setProperty("translate", offset);
    }
    function look(event: PointerEvent) {
      if (!visible || event.pointerType === "touch") return;
      x = event.clientX;
      y = event.clientY;
      if (!frame) frame = requestAnimationFrame(aim);
    }
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
    observer.observe(node);
    addEventListener("pointermove", look, { passive: true });
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      removeEventListener("pointermove", look);
    };
  }, [follow, lively]);
  // Blinks: a short animation switched on for each blink, every few seconds, only
  // while Zel is on screen. An endless CSS animation on the SVG lids would make the
  // browser restyle and repaint the face on every frame, blinking or not.
  useEffect(() => {
    const node = root.current;
    if (lively || !node || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let visible = false, timer = 0, open = 0;
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
    observer.observe(node);
    const blink = () => {
      if (visible && !document.hidden) {
        node.classList.add("zel-blinking");
        open = window.setTimeout(() => node.classList.remove("zel-blinking"), 320);
      }
      timer = window.setTimeout(blink, 4000 + nextBlinkPhase() * 2500);
    };
    timer = window.setTimeout(blink, 1500 + nextBlinkPhase() * 2500);
    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
      window.clearTimeout(open);
      node.classList.remove("zel-blinking");
    };
  }, [lively]);
  return (
    <div ref={root} className={cn("relative", `zel-mood-${mood}`, lively && "zel-lively", className)} role={alt ? "img" : undefined} aria-label={alt || undefined} aria-hidden={alt ? undefined : true}>
      {/* The shadow is a still, blurred silhouette under Zel, painted once. A CSS
          drop-shadow on Zel would re-blur everything inside it on every animation
          frame, which phones cannot keep up with. */}
      {shadow && <img src={layerWhole} width="960" height="960" alt="" draggable={false} className={`zel-shadow zel-shadow-${shadow} absolute inset-0 size-full`} />}
      {/* Square box holding the stacked emblem layers. */}
      <div className="relative aspect-square w-full">
        {layers.map(({ name, src }) => (
          <div key={name} className={`zel-layer layer-${name} absolute inset-0 size-full`}>
            <div className="zel-piece relative size-full" data-zel-motion={name}>
              <img src={src} width="960" height="960" alt="" draggable={false} className="size-full" />
            </div>
          </div>
        ))}
        {restingOverlay && <img src={layerWhole} width="960" height="960" alt="" draggable={false} className="zel-whole absolute inset-0 size-full" />}
      </div>
      <div className="zel-face-layer absolute inset-0 size-full" aria-hidden="true">
        <div className="zel-piece size-full" data-zel-motion="centre">
          <svg viewBox="0 0 1254 1254" className="size-full">
            <ZelFace mood={mood} lively={lively} />
          </svg>
        </div>
      </div>
    </div>
  );
}
