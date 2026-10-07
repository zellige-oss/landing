/*
 * A mosaic panel being laid: sixteen squares cut from the brand's ceramic
 * (styles.css, .tile-build). It arrives whole with its section, and a moment later
 * the last piece, the corner, settles into its place: your piece.
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
