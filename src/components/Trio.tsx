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

const labelPlacement: Record<Piece, string> = {
  crown: "-left-[2%] bottom-[2%] sm:-left-[10%] sm:bottom-[6%]",
  cobalt: "left-[0%] -top-[4%] sm:-left-[8%] sm:top-[2%]",
  points: "-right-[2%] top-[66%] sm:-right-[12%]",
};

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
  className,
}: {
  mood: Mood;
  /** The one layer shown around Zel; without it, the whole tile. */
  show?: Piece;
  /** Called with the layer the reader clicks or taps. */
  onPick?: (piece: Piece) => void;
  className?: string;
}) {
  const t = useT();
  // Pointing at a visible layer lifts it and explains it.
  const [hover, setHover] = useState<Piece>();
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
      {pieces.map((piece) => (
        <span
          key={piece}
          className={cn(
            `tile-label label-${piece} absolute flex items-center gap-2 rounded-full border border-border bg-popover/95 py-1.5 pr-3 pl-2 text-xs whitespace-nowrap text-foreground shadow-[0_10px_24px_-14px_rgb(20_43_53/0.45)] transition-[border-color,box-shadow] sm:text-[13px] ${labelPlacement[piece]}`,
            show === piece && "border-brass shadow-[0_0_0_3px_rgb(176_138_74/0.25)]",
          )}
        >
          <LayerGlyph layer={piece} className="size-4" />
          {t.layers[piece].use}
        </span>
      ))}
      {/* What the layer under the pointer is, over the bottom of the tile. */}
      {pieces.map((piece) => (
        <div
          key={piece}
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-x-[4%] bottom-[-6%] z-10 rounded-2xl border border-brass/60 bg-popover/95 p-4 text-left shadow-[0_18px_40px_-20px_rgb(20_43_53/0.5)] backdrop-blur-sm transition-[opacity,translate] duration-300",
            hover === piece ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
          )}
        >
          <p className="flex items-center gap-2 font-semibold"><LayerGlyph layer={piece} className="size-5" /> {t.story.steps[piece].title}</p>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{t.story.steps[piece].body}</p>
        </div>
      ))}
    </div>
  );
}
