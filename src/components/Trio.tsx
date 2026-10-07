import { useState, type MouseEvent } from "react";
import { cn } from "@/lib/utils";
import { useT } from "@/i18n";
import { Companion, layers, type Layer, type Mood } from "./Companion";

/*
 * Zel is the standard emblem: Zel in the centre, and around it the colour layers,
 * each a way of using Zel:
 *   crown  (ivory kites, closest to Zel)  → chat
 *   cobalt (blue corner squares)          → the harness manager, for building software
 *   points (outer green points)           → the personal agent
 * The scroll story shows one layer around Zel at a time, then all of them. Motion is
 * CSS only; without JS or with reduced motion, the emblem is simply whole.
 */
export type Piece = Exclude<Layer, "centre">;
export const pieces: Piece[] = ["crown", "cobalt", "points"];

/** One layer of the emblem, small, to name it in labels and lists. */
export function LayerGlyph({ layer, className }: { layer: Piece; className?: string }) {
  const { src } = layers.find(({ name }) => name === layer)!;
  return <img src={src} alt="" width="960" height="960" className={cn("size-5 shrink-0", className)} draggable={false} />;
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
  className,
}: {
  mood: Mood;
  /** The one layer shown around Zel; without it, the whole tile. */
  show?: Piece;
  /** Called with the layer the reader clicks or taps. */
  onPick?: (piece: Piece) => void;
  /** Called with the layer under the mouse, or none, so the page can point at it. */
  onHover?: (piece: Piece | undefined) => void;
  className?: string;
}) {
  const t = useT();
  // Pointing at a visible layer lifts it, with Zel; the page lights up its step.
  const [hover, setHoverState] = useState<Piece>();
  const setHover = (piece: Piece | undefined) => {
    if (piece === hover) return;
    setHoverState(piece);
    onHover?.(piece);
  };
  const pieceAt = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const piece = layerAt(((event.clientX - rect.left) / rect.width) * 2 - 1, ((event.clientY - rect.top) / rect.height) * 2 - 1);
    return piece && (!show || show === piece) ? piece : undefined;
  };
  return (
    <div
      className={cn("tile tile-scroll relative aspect-square", `show-${show ?? "all"}`, hover && `lift-${hover}`, hover && onPick && "cursor-pointer", className)}
      onPointerMove={(event) => { if (event.pointerType === "mouse") setHover(pieceAt(event)); }}
      onPointerLeave={() => setHover(undefined)}
      onClick={(event) => { const piece = pieceAt(event); if (piece) onPick?.(piece); }}
    >
      <Companion mood={mood} follow alt={t.zel.alt} shadow="tile" className="size-full" />
    </div>
  );
}
