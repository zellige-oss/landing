/** A quiet pause between sections: a brass hairline that fades out at both ends, with
 *  three small tiles in its middle, one in the colour of each part of Zel. */
export function Band() {
  return (
    <div aria-hidden="true" className="flex items-center justify-center gap-4 px-6 py-12 sm:py-16">
      <span className="h-px w-[min(26vw,180px)] bg-gradient-to-r from-transparent to-brass/60" />
      <span className="flex gap-2.5">
        {["bg-part-crown", "bg-part-cobalt", "bg-part-points"].map((tile) => (
          <span key={tile} className={`size-[7px] rotate-45 rounded-[1px] ${tile}`} />
        ))}
      </span>
      <span className="h-px w-[min(26vw,180px)] bg-gradient-to-l from-transparent to-brass/60" />
    </div>
  );
}
