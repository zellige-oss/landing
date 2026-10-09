import { Monitor, PanelsTopLeft, Smartphone } from "lucide-react";
import { useT } from "@/i18n";
import { ZelGlyph, pieces } from "@/components/Trio";

const devices = [["desktop", Monitor], ["mobile", Smartphone], ["web", PanelsTopLeft]] as const;

/** All three platforms connect to one shared set of tools. */
export function DeviceAccess() {
  const t = useT();
  return (
    <>
      <ul className="grid grid-cols-3 gap-2">
        {devices.map(([device, Icon], index) => (
          <li key={device} className="flex min-w-0 flex-col items-center gap-2">
            <Icon aria-hidden="true" strokeWidth={1.25} className="h-10 w-12 text-muted-foreground diagram:h-8 diagram:w-10 xl:h-10 xl:w-12" />
            <p className="text-center text-[11px] font-medium text-muted-foreground">{t.story.workings.devices.items[index]}</p>
          </li>
        ))}
      </ul>
      <svg aria-hidden="true" viewBox="0 0 240 24" preserveAspectRatio="none" className="mx-auto mt-2 h-6 w-2/3 overflow-visible text-muted-foreground/40">
        <path d="M0 0v8q0 4 4 4h232q4 0 4-4V0M120 0v24" fill="none" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      </svg>
      <ul className="mt-2 grid grid-cols-3 gap-2 diagram:grid-cols-1 xl:grid-cols-3">
        {pieces.map((piece) => (
          <li key={piece} className="flex min-w-0 flex-col items-center gap-1.5 text-center text-xs leading-tight diagram:flex-row diagram:gap-2 diagram:text-left xl:flex-col xl:gap-1.5 xl:text-center">
            <ZelGlyph layer={piece} className="size-8 diagram:size-6 xl:size-8" />
            <span>{t.layers[piece].use}</span>
          </li>
        ))}
      </ul>
    </>
  );
}
