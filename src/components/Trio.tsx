import { useState, type MouseEvent } from "react";
import { cn } from "@/lib/utils";
import { useT } from "@/i18n";
import { Companion, type Layer, type Mood } from "./Companion";
import glyphCrown from "@/assets/glyph-crown.webp";
import glyphCobalt from "@/assets/glyph-cobalt.webp";
import glyphPoints from "@/assets/glyph-points.webp";

/*
 * Zel is the standard emblem: Zel in the centre, and around it the colour layers,
 * each a way of using Zel:
 *   crown  (ivory kites, closest to Zel)  → chat
 *   cobalt (blue corner squares)          → the harness manager, for building software
 *   points (outer green points)           → the personal agent
 * The scroll story shows one layer around Zel at a time, then all of them. A layer
 * the emblem splits into four shows on its own as one joined piece, and splits into
 * the emblem's pieces once the tile is whole. Motion is
 * CSS only; without JS or with reduced motion, the emblem is simply whole.
 */
export type Piece = Exclude<Layer, "centre">;
export const pieces: Piece[] = ["crown", "cobalt", "points"];

const glyphs: Record<Piece, string> = { crown: glyphCrown, cobalt: glyphCobalt, points: glyphPoints };

/** One layer with Zel at its centre: one way of using Zel (scripts/build-brand.mjs). */
export function ZelGlyph({ layer, className }: { layer: Piece; className?: string }) {
  return <img src={glyphs[layer]} alt="" width="128" height="128" className={cn("size-5 shrink-0", className)} draggable={false} />;
}

/** The layer under a point of the tile, in -1..1 from its centre; none on Zel or outside. */
function layerAt(x: number, y: number): Piece | undefined {
  const r = Math.hypot(x, y);
  if (r < 0.26 || r > 0.98) return undefined;
  // The diagonals: kites near the centre, corner squares beyond.
  if (Math.abs(x) > 0.2 && Math.abs(y) > 0.2 && Math.abs(Math.abs(x) - Math.abs(y)) < 0.28) return r < 0.4 ? "crown" : "cobalt";
  return r < 0.46 ? "crown" : "points";
}

export function Trio({
  mood,
  show,
  onPick,
  onHover,
  lift,
  className,
}: {
  mood: Mood;
  /** The one layer shown around Zel; without it, the whole tile. */
  show?: Piece;
  /** Called with the layer the reader clicks or taps. */
  onPick?: (piece: Piece) => void;
  /** Called with the layer under the mouse, or none, so the page can point at it. */
  onHover?: (piece: Piece | undefined) => void;
  /** A layer to lift from outside, such as the step the reader points at. */
  lift?: Piece;
  className?: string;
}) {
  const t = useT();
  // Pointing at a layer of the whole tile lifts it, with Zel; the page lights up its step.
  const [hover, setHoverState] = useState<Piece>();
  const setHover = (piece: Piece | undefined) => {
    if (piece === hover) return;
    setHoverState(piece);
    onHover?.(piece);
  };
  const pieceAt = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const piece = layerAt(((event.clientX - rect.left) / rect.width) * 2 - 1, ((event.clientY - rect.top) / rect.height) * 2 - 1);
    // Only the whole tile answers: while the story shows one layer, nothing does.
    return show ? undefined : piece;
  };
  // A layer stays lifted only while the whole tile shows (scrolling back can hide it).
  const lifted = show ? undefined : hover ?? lift;
  return (
    <div
      className={cn("tile tile-scroll relative aspect-square", `show-${show ?? "all"}`, lifted && `lift-${lifted}`, lifted && onPick && "cursor-pointer", className)}
      onPointerMove={(event) => { if (event.pointerType === "mouse") setHover(pieceAt(event)); }}
      onPointerLeave={() => setHover(undefined)}
      onClick={(event) => { const piece = pieceAt(event); if (piece) onPick?.(piece); }}
    >
      <Companion mood={mood} follow joined alt={t.zel.alt} shadow="tile" className="size-full" />
    </div>
  );
}
