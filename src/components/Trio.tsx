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

export function Trio({
  mood,
  show,
  className,
}: {
  mood: Mood;
  /** The one layer shown around Zel; without it, the whole tile. */
  show?: Piece;
  className?: string;
}) {
  const t = useT();
  return (
    <div className={cn("tile tile-scroll relative aspect-square", `show-${show ?? "all"}`, className)}>
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
    </div>
  );
}
