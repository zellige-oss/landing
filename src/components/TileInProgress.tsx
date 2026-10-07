/*
 * A mosaic panel still being laid: sixteen squares cut from the brand's ceramic
 * (styles.css, .tile-build), the bottom-right corner still open and one piece
 * hovering over its gap. Hovering the section, or focusing a link in it, sets the
 * piece into place: your piece.
 */
const GAPS = new Set([11, 12, 15, 16]);
const PIECE = 11;

export function TileInProgress({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={className}>
      <div className="tile-build rounded-xl border border-brass/60 bg-black/30 p-1.5 shadow-[0_24px_40px_-20px_#000c]">
        {Array.from({ length: 16 }, (_, index) => {
          const cell = index + 1;
          return (
            <span key={cell} className={GAPS.has(cell) ? "tile-gap" : undefined}>
              {cell === PIECE && <span className="tile-piece" />}
            </span>
          );
        })}
      </div>
    </div>
  );
}
