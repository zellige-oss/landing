import type { ReactNode } from "react";
import { Database, Globe, KeyRound, Lock, Monitor, Plug, Server, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";
import { useT } from "@/i18n";
import { zelMark } from "@/components/brand";
import { LayerGlyph, pieces } from "@/components/Trio";

const box = "rounded-2xl border border-border bg-popover/80 shadow-[0_14px_34px_-26px_rgb(20_43_53/0.45)]";
const chip = "flex items-center gap-2.5 rounded-xl border border-border bg-surface/70 px-3 py-2 text-sm";

/** A dashed link between two parts: down on phones, across from lg, with an optional label. */
function Link({ children, className }: { children?: ReactNode; className?: string }) {
  return (
    <div aria-hidden="true" className={cn("flex flex-col items-center justify-center gap-1.5 text-xs text-muted-foreground lg:gap-2 lg:px-3", className)}>
      <span className="block border-dashed border-brass/70 max-lg:h-6 max-lg:border-l-2 lg:w-full lg:min-w-12 lg:border-t-2" />
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
      <h3 className="font-serif text-[28px] text-gold italic sm:text-[32px]">{w.title}</h3>
      <div className="mt-6 flex flex-col items-stretch lg:grid lg:grid-cols-[minmax(0,0.8fr)_auto_minmax(0,1.3fr)_auto_minmax(0,0.9fr)] lg:items-center">
        {/* Your devices */}
        <div className={cn(box, "p-4")}>
          <p className="text-sm font-semibold">{w.devices.title}</p>
          <ul className="mt-3 grid gap-2">
            {w.devices.items.map((item, index) => {
              const Icon = deviceIcons[index];
              return <li key={item} className={chip}><Icon aria-hidden="true" strokeWidth={1.5} className="size-4 text-gold" />{item}</li>;
            })}
          </ul>
        </div>
        <Link>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-brass/50 bg-popover px-2.5 py-1 font-semibold text-foreground"><Lock strokeWidth={1.75} className="size-3.5 text-gold" />{w.tunnel.title}</span>
          <span>{w.tunnel.body}</span>
        </Link>
        {/* Your server, running Zellige */}
        <div className={cn(box, "border-brass/60 p-5")}>
          <p className="flex items-center gap-2 text-sm font-semibold"><Server aria-hidden="true" strokeWidth={1.5} className="size-4 text-gold" />{w.server.title}</p>
          <div className="mt-4 flex items-center gap-4 rounded-xl bg-surface/60 p-3">
            <img src={zelMark} width="530" height="512" alt="" className="h-14 w-auto shrink-0" />
            <ul className="grid flex-1 gap-1.5">
              {pieces.map((piece) => (
                <li key={piece} className="flex items-center gap-2 text-sm"><LayerGlyph layer={piece} className="size-4" />{t.layers[piece].use}</li>
              ))}
            </ul>
          </div>
          <p className={cn(chip, "mt-3 justify-center")}><Database aria-hidden="true" strokeWidth={1.5} className="size-4 text-gold" />{w.server.memory}</p>
        </div>
        <Link />
        {/* The models: by API, or with a subscription */}
        <div className={cn(box, "p-4")}>
          <p className="text-sm font-semibold">{w.models.title}</p>
          <ul className="mt-3 grid gap-2">
            {([[KeyRound, w.models.api], [Plug, w.models.oauth]] as const).map(([Icon, [name, note]]) => (
              <li key={name} className={chip}>
                <Icon aria-hidden="true" strokeWidth={1.5} className="size-4 shrink-0 text-gold" />
                <span><strong className="block font-semibold">{name}</strong><span className="text-muted-foreground">{note}</span></span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
