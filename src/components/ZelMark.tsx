import { cn } from "@/lib/utils";
import { layers } from "./Companion";
import { ZelFace } from "./ZelFace";

/*
 * Zel as the logo: the same layers the hero's Zel is made of, looking ahead, so the
 * header's logo and the Zel that flies up to it (Hero.tsx) are the hero's Zel itself.
 * Each layer turns as far as the hero's greetings have turned it (.zel-turn-* in
 * styles.css, set by zel-motion.ts), so the logo always matches it. The box is the
 * emblem's square; .zel-mark-* in styles.css size it by Zel's own height.
 */
export function ZelMark({ id, className }: { id?: string; className?: string }) {
  return (
    <span id={id} aria-hidden="true" className={cn("relative block aspect-square shrink-0", className)}>
      {layers.map(({ name, src }) => (
        <img key={name} src={src} width="960" height="960" alt="" draggable={false} className={`zel-turn zel-turn-${name} absolute inset-0 size-full`} />
      ))}
      <svg viewBox="0 0 1254 1254" className="absolute inset-0 size-full">
        <ZelFace mood="look" />
      </svg>
    </span>
  );
}
