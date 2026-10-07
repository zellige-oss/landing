/*
 * A mosaic panel being laid: sixteen squares cut from the brand's ceramic
 * (styles.css, .tile-build). As the section comes into view the pieces slot in one
 * by one; the last, the corner, hovers over its place until you hover the section
 * or focus a link in it: your piece.
 */
const PIECE = 16;

export function TileInProgress({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={className}>
      <div className="tile-build rounded-xl border border-brass/60 bg-black/30 p-1.5 shadow-[0_24px_40px_-20px_#000c]">
        {Array.from({ length: 16 }, (_, index) => {
          const cell = index + 1;
          return (
            <span key={cell} className={cell === PIECE ? "tile-gap" : undefined}>
              {cell === PIECE && <span className="tile-piece" />}
            </span>
          );
        })}
      </div>
    </div>
  );
}
