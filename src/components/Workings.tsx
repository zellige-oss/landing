import type { ReactNode } from "react";
import { ArrowLeftRight, Cpu, Database, KeyRound, Lock, Monitor, Plug, Server, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useT } from "@/i18n";
import { DeviceAccess } from "@/components/DeviceAccess";
import { ProviderMark, inferenceProviders } from "@/components/providers";

/** A small square: a mark over its name. */
const tile = "panel-tile workings-tile flex flex-col items-center justify-center gap-1.5 px-2 py-3 text-center text-[13px] leading-tight";

/** One part of the trip: the same card for all three. */
function Node({ part, icon: Icon, title, body, children }: { part: "devices" | "server" | "providers"; icon: LucideIcon; title: string; body?: string; children: ReactNode }) {
  return (
    <div className={cn("panel panel-hover workings-node relative min-w-0 p-4 sm:p-5 diagram:p-3 xl:p-5", `node-${part}`)}>
      <div className="flex min-h-16 items-center gap-3">
        <span aria-hidden="true" className="panel-badge size-10 shrink-0"><Icon strokeWidth={1.5} className="size-5" /></span>
        <span className="min-w-0">
          <span className="block text-[15px] font-semibold">{title}</span>
          {body && <span className="block text-xs text-muted-foreground">{body}</span>}
        </span>
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

/** The way between two parts: a dashed line, down on phones and across from 900 px, with
 *  its label. A gold dot runs out along it and a teal one comes back (.wire in styles.css). */
function Wire({ step, title, body, icon: Icon }: { step: 1 | 2; title: string; body: string; icon: LucideIcon }) {
  return (
    <div aria-hidden="true" className="flex flex-col items-center justify-center gap-2 py-1 text-xs text-muted-foreground diagram:w-24 diagram:px-1 diagram:py-0 diagram:text-[11px] xl:w-auto xl:px-2 xl:text-xs">
      <span className={`wire wire-${step} relative block border-dashed border-brass max-diagram:h-8 max-diagram:border-l-2 diagram:w-full diagram:min-w-16 diagram:border-t-2`} />
      <span className="inline-flex items-center gap-1.5 rounded-full border border-brass/60 bg-popover px-3 py-1 font-semibold whitespace-nowrap text-foreground shadow-[0_8px_18px_-12px_rgb(var(--shadow-ink)/0.5)] diagram:px-2 xl:px-3"><Icon strokeWidth={1.75} className="size-3.5 text-gold" />{title}</span>
      <span className="text-center xl:whitespace-nowrap">{body}</span>
      <span className={`wire wire-${step} wire-tail relative block h-8 border-l-2 border-dashed border-brass diagram:hidden`} />
    </div>
  );
}

/** How Zellige is put together: you use it from your devices, which reach your server
 *  through Tailscale; your server holds your keys and subscriptions and calls the
 *  inference providers with them, and the answer comes back the same way. */
export function Workings({ className }: { className?: string }) {
  const t = useT();
  const w = t.story.workings;
  const providerGroups = [inferenceProviders.filter((provider) => provider.openModels), inferenceProviders.filter((provider) => !provider.openModels)];
  return (
    <div data-reveal className={className}>
      <div className="workings flex flex-col items-stretch diagram:grid diagram:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)]">
        <Node part="devices" icon={Monitor} title={w.devices.title} body={w.devices.body}>
          <DeviceAccess />
        </Node>
        <Wire step={1} icon={Lock} title={w.tunnel.title} body={w.tunnel.body} />
        <Node part="server" icon={Server} title={w.server.title} body={w.server.body}>
          <ul className="grid grid-cols-2 gap-2">
            {([[KeyRound, w.server.api], [Plug, w.server.oauth]] as const).map(([Icon, [name, note]]) => (
              <li key={name} className={tile}>
                <Icon aria-hidden="true" strokeWidth={1.5} className="size-5 text-gold" />
                <strong className="font-semibold">{name}</strong>
                <span className="text-xs text-muted-foreground">{note}</span>
              </li>
            ))}
          </ul>
          <p className="panel-tile mt-2 flex items-center justify-center gap-2 px-3 py-2 text-[13px]"><Database aria-hidden="true" strokeWidth={1.5} className="size-4 text-gold" />{w.server.memory}</p>
        </Node>
        <Wire step={2} icon={ArrowLeftRight} title={w.calls.title} body={w.calls.body} />
        <Node part="providers" icon={Cpu} title={w.providers.title} body={w.providers.body}>
          {providerGroups.map((group, index) => (
            <div key={group[0].name}>
              {index > 0 && <div aria-hidden="true" className="mx-auto my-3 h-px w-12 bg-brass/60" />}
              <ul className="grid grid-cols-3 gap-2">
                {group.map(({ name, mark }) => (
                  <li key={name} className={cn(tile, "min-w-0 diagram:px-1 diagram:text-[11px] xl:px-2 xl:text-[13px]")}><ProviderMark mark={mark} className="size-6" />{name}</li>
                ))}
              </ul>
            </div>
          ))}
        </Node>
      </div>
    </div>
  );
}
