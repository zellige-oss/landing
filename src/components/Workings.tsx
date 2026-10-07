import type { ReactNode } from "react";
import { Database, Globe, KeyRound, Lock, Monitor, Plug, Server, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";
import { useT } from "@/i18n";
import { ZelGlyph, pieces } from "@/components/Trio";

const box = "rounded-2xl border border-border bg-popover/80 p-4 shadow-[0_14px_34px_-26px_rgb(20_43_53/0.45)]";
/** A small square: an icon over its name. */
const tile = "flex flex-col items-center justify-center gap-1.5 rounded-xl border border-border bg-surface/70 px-2 py-3 text-center text-[13px] leading-tight";

/** A dashed link between two parts: down on phones, across from lg, with an optional label. */
function Link({ children }: { children?: ReactNode }) {
  return (
    <div aria-hidden="true" className="flex flex-col items-center justify-center gap-1.5 text-xs text-muted-foreground lg:gap-2 lg:px-3">
      <span className="block border-dashed border-brass/70 max-lg:h-6 max-lg:border-l-2 lg:w-full lg:min-w-10 lg:border-t-2" />
      {children}
      {children && <span className="block h-6 border-l-2 border-dashed border-brass/70 lg:hidden" />}
    </div>
  );
}

/** How Zellige is put together: your devices reach your server through Tailscale; it reaches the models. */
export function Workings({ className }: { className?: string }) {
  const t = useT();
  const w = t.story.workings;
  const deviceIcons = [Monitor, Smartphone, Globe];
  return (
    <div data-reveal className={cn("pb-20", className)}>
      <h3 className="text-2xl font-semibold tracking-tight sm:text-3xl">{w.title}</h3>
      <p className="mt-3 max-w-[64ch] text-[15px] leading-[1.7] text-muted-foreground sm:text-base">{w.body}</p>
      <div className="mt-8 flex flex-col items-stretch lg:grid lg:grid-cols-[minmax(0,0.75fr)_auto_minmax(0,1.25fr)_auto_minmax(0,0.75fr)] lg:items-center">
        <div className={box}>
          <p className="text-sm font-semibold">{w.devices.title}</p>
          <ul className="mt-3 grid grid-cols-3 gap-2">
            {w.devices.items.map((item, index) => {
              const Icon = deviceIcons[index];
              return <li key={item} className={tile}><Icon aria-hidden="true" strokeWidth={1.5} className="size-5 text-gold" />{item}</li>;
            })}
          </ul>
        </div>
        <Link>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-brass/50 bg-popover px-2.5 py-1 font-semibold text-foreground"><Lock strokeWidth={1.75} className="size-3.5 text-gold" />{w.tunnel.title}</span>
          <span>{w.tunnel.body}</span>
        </Link>
        <div className={cn(box, "border-brass/60")}>
          <p className="flex items-center gap-2 text-sm font-semibold"><Server aria-hidden="true" strokeWidth={1.5} className="size-4 text-gold" />{w.server.title}</p>
          <ul className="mt-3 grid grid-cols-3 gap-2">
            {pieces.map((piece) => (
              <li key={piece} className={tile}><ZelGlyph layer={piece} className="size-8" />{t.layers[piece].use}</li>
            ))}
          </ul>
          <p className="mt-2 flex items-center justify-center gap-2 rounded-xl border border-border bg-surface/70 px-3 py-2 text-[13px]"><Database aria-hidden="true" strokeWidth={1.5} className="size-4 text-gold" />{w.server.memory}</p>
        </div>
        <Link />
        <div className={box}>
          <p className="text-sm font-semibold">{w.models.title}</p>
          <ul className="mt-3 grid grid-cols-2 gap-2">
            {([[KeyRound, w.models.api], [Plug, w.models.oauth]] as const).map(([Icon, [name, note]]) => (
              <li key={name} className={tile}>
                <Icon aria-hidden="true" strokeWidth={1.5} className="size-5 text-gold" />
                <strong className="font-semibold">{name}</strong>
                <span className="text-xs text-muted-foreground">{note}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
