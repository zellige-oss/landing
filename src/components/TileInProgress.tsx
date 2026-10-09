import { useRef, useState } from "react";
import { useT } from "@/i18n";

/*
 * A mosaic panel being laid: sixteen squares cut from the brand's ceramic
 * (styles.css, .tile-build). Clicking the loose piece alternates between
 * bringing the loose corner in from outside and lifting it out again.
 * The piece starts outside and stays there until the button is activated.
 */
const PIECE = 16;
const CURVE = "C 189 -3 131 45 59 46";
const GUIDE = `M 186 -62 ${CURVE}`;
// The visible arrow is the middle of the same route followed by the tile's centre.
const ROUTE = `M 185 -130 C 185 -106 186 -84 186 -62 ${CURVE} L 50 50`;

export function TileInProgress({ className }: { className?: string }) {
  const t = useT();
  const [placed, setPlaced] = useState(false);
  const flight = useRef<HTMLSpanElement>(null);
  const piece = useRef<HTMLButtonElement>(null);
  const route = useRef<SVGPathElement>(null);

  function togglePiece() {
    const carrier = flight.current;
    const tile = piece.current;
    const path = route.current;
    if (!carrier || !tile || !path) return;
    // Read before cancelling so another click can reverse a flight mid-air.
    const fromX = getComputedStyle(carrier).translate;
    const fromY = getComputedStyle(tile).translate;
    const fromRotation = getComputedStyle(tile).rotate;
    for (const element of [carrier, tile]) {
      for (const animation of element.getAnimations()) animation.cancel();
    }
    setPlaced(!placed);
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const length = path.getTotalLength();
    const x = parseFloat(fromX) || 0;
    const y = parseFloat(fromY.split(" ")[1]) || 0;
    const rotation = parseFloat(fromRotation) || 0;
    // Resume at the nearest point if another click interrupts a flight.
    let start = 0, distance = Infinity;
    for (let i = 0; i <= 100; i += 1) {
      const point = path.getPointAtLength(length * i / 100);
      const candidate = Math.hypot(point.x - 50 - x, point.y - 50 - y);
      if (candidate < distance) { distance = candidate; start = i / 100; }
    }
    const origin = path.getPointAtLength(length * start);
    const end = placed ? 0 : 1;
    const travelEnd = placed ? 1 : 0.72;
    const horizontal: Keyframe[] = [];
    const vertical: Keyframe[] = [];
    for (let i = 0; i <= 48; i += 1) {
      const time = i / 48;
      // Accelerate towards the gap; ease out when lifting the piece away.
      const progress = placed ? 1 - (1 - time) ** 2 : time ** 2;
      const point = path.getPointAtLength(length * (start + (end - start) * progress));
      const offset = time * travelEnd;
      horizontal.push({ offset, translate: `${point.x - 50 + (x - origin.x + 50) * (1 - progress)}% 0` });
      vertical.push({ offset, translate: `0 ${point.y - 50 + (y - origin.y + 50) * (1 - progress)}%`, rotate: `${rotation + ((placed ? -12 : 3) - rotation) * progress}deg` });
    }
    if (!placed) {
      // A short, rigid ceramic bounce after following the arrow into the gap.
      horizontal.push({ offset: 1, translate: "0 0" });
      vertical[vertical.length - 1].easing = "cubic-bezier(.2,.65,.45,1)";
      vertical.push(
        { translate: "0 -10%", rotate: "-1.5deg", offset: 0.82, easing: "cubic-bezier(.55,0,.8,.35)" },
        { translate: "0 0", rotate: "0.5deg", offset: 0.92, easing: "ease-out" },
        { translate: "0 0", rotate: "0deg", offset: 1 },
      );
    }
    const duration = placed ? 560 : 720;
    carrier.animate(horizontal, { duration });
    tile.animate(vertical, { duration });
  }

  return (
    <div className={className}>
      <div
        data-placed={placed}
        className="tile-build w-full rounded-xl border border-brass/60 bg-black/30 p-1.5 shadow-[0_24px_40px_-20px_#000c]"
      >
        {Array.from({ length: 16 }, (_, index) => {
          const cell = index + 1;
          return (
            <span key={cell} aria-hidden={cell === PIECE ? undefined : true} className={cell === PIECE ? "tile-gap" : undefined}>
              {cell === PIECE && (
                <>
                  <svg className="tile-guide" viewBox="0 0 100 100" fill="none" aria-hidden="true">
                    <path ref={route} d={ROUTE} visibility="hidden" />
                    <path d={GUIDE} strokeDasharray="3 5" />
                    <path d="m 74 35 -15 11 18 11" />
                  </svg>
                  <span ref={flight} className="tile-flight">
                    <button
                      ref={piece}
                      type="button"
                      aria-label={placed ? t.contact.tile.remove : t.contact.tile.place}
                      onClick={togglePiece}
                      className="tile-piece cursor-pointer border-0 p-0"
                    />
                  </span>
                </>
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
}
