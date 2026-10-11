import { ArrowLeftRight, Cloud, Cpu, KeyRound, Lock, Monitor, Server, Workflow, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useT } from "@/i18n";
import { DeviceAccess } from "@/components/DeviceAccess";
import { ProviderMark, harnesses, inferenceProviders, localModels, type Mark } from "@/components/providers";

function Heading({ icon: Icon, title, body, compact = false }: { icon: LucideIcon; title: string; body: string; compact?: boolean }) {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-4">
      <div className={cn("flex min-w-0 flex-1 items-center", compact ? "gap-2" : "gap-3")}>
        <span aria-hidden="true" className={cn("panel-badge shrink-0", compact ? "size-8" : "size-10")}><Icon strokeWidth={1.5} className={compact ? "size-4" : "size-5"} /></span>
        <div>
          <h3 className={cn("font-semibold", compact ? "text-sm" : "text-base")}>{title}</h3>
          <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{body}</p>
        </div>
      </div>
    </div>
  );
}

/** Both connections read across on desktop and down in the stacked layout. */
function Wire({ step, title, body, icon: Icon }: { step: 1 | 2; title: string; body: string; icon: LucideIcon }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-2 text-xs text-muted-foreground diagram:py-0">
      <span aria-hidden="true" className={`wire wire-${step} relative block h-6 border-l border-dashed border-brass diagram:h-0 diagram:w-full diagram:border-t diagram:border-l-0`} />
      <span className="inline-flex items-center gap-1 whitespace-nowrap font-medium text-foreground diagram:text-[11px]"><Icon aria-hidden="true" strokeWidth={1.5} className="size-3 text-gold" />{title}</span>
      <span className="text-center text-[11px] diagram:text-[11px]">{body}</span>
      <span aria-hidden="true" className={`wire wire-${step} wire-tail relative block h-6 border-l border-dashed border-brass diagram:hidden`} />
    </div>
  );
}

type Choice = { name: string; mark: Mark; label?: string; note?: string };

/** Named marks, visible without a disclosure and without another layer of cards. */
function Marks({ choices, label, className, tiles = false }: { choices: Choice[]; label: string; className?: string; tiles?: boolean }) {
  return (
    <ul aria-label={label} className={cn("flex flex-wrap gap-x-5 gap-y-3", className)}>
      {choices.map(({ name, label: shortName = name, note, mark }) => (
        <li key={name} className={cn("flex min-w-0 items-center gap-2 text-xs leading-tight", tiles && "panel-tile flex-col justify-center px-2 py-3 text-center")}>
          <ProviderMark mark={mark} className={tiles ? "size-7" : "size-5"} />
          <span>{shortName}{note && <span className="block text-[11px] text-muted-foreground">{note}</span>}</span>
        </li>
      ))}
    </ul>
  );
}

/** The server boundary separates local inference from credentials used to reach external models. */
export function Workings({ className }: { className?: string }) {
  const t = useT();
  const w = t.story.workings;

  return (
    <figure data-reveal aria-label={t.features.title} className={className}>
      <div className="workings mx-auto flex max-w-[680px] flex-col diagram:grid diagram:max-w-none diagram:grid-cols-[minmax(0,1fr)_80px_minmax(0,1.15fr)_80px_minmax(0,1fr)] diagram:items-stretch">
        <div className="panel node-devices flex min-w-0 flex-col p-5">
          <Heading icon={Monitor} title={w.devices.title} body={w.devices.body} />
          <div className="my-auto pt-6"><DeviceAccess /></div>
        </div>
        <Wire step={1} icon={Lock} title={w.tunnel.title} body={w.tunnel.body} />
        <div className="panel node-server min-w-0 p-5">
          <Heading icon={Server} title={w.server.title} body={w.server.memory} />
          <div id="harness" className="mt-5 scroll-mt-28 border-t border-border pt-4">
            <h4 className="flex items-center gap-2 text-sm font-semibold"><Workflow aria-hidden="true" strokeWidth={1.5} className="size-4 text-gold" />{w.server.harness}</h4>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{t.features.harness.body}</p>
          </div>
          <div className="model-routes mt-4 ml-2 grid gap-4 border-l border-brass/50 pl-4">
            <div className="node-local relative before:absolute before:top-2.5 before:-left-4 before:w-3 before:border-t before:border-brass/50">
              <h4 className="flex items-center gap-2 text-sm font-semibold"><Cpu aria-hidden="true" strokeWidth={1.5} className="size-4 shrink-0 text-part-points" />{w.local.title}</h4>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{w.local.body}</p>
            </div>
            <div id="acceso" className="relative scroll-mt-28 before:absolute before:top-2.5 before:-left-4 before:w-3 before:border-t before:border-brass/50">
              <h4 className="flex items-center gap-2 text-sm font-semibold"><KeyRound aria-hidden="true" strokeWidth={1.5} className="size-4 shrink-0 text-gold" />{w.credentials.title}</h4>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{w.credentials.methods}</p>
            </div>
          </div>
        </div>
        <Wire step={2} icon={ArrowLeftRight} title={w.calls.title} body={w.calls.body} />
        <div className="panel node-providers flex min-w-0 flex-col p-5">
          <Heading icon={Cloud} title={w.providers.title} body={w.providers.body} />
          <div className="my-auto pt-6">
            <Marks choices={inferenceProviders} label={w.providers.title} className="grid grid-cols-2 gap-2 sm:grid-cols-4 diagram:grid-cols-2" tiles />
          </div>
        </div>
      </div>
      <figcaption className="mx-auto mt-7 grid max-w-[680px] gap-5 border-t border-border/70 pt-5 diagram:max-w-none diagram:grid-cols-[1.6fr_1fr] diagram:gap-12">
        <div>
          <h4 className="mb-3 text-xs font-medium text-muted-foreground">{t.features.harnesses}</h4>
          <Marks choices={harnesses} label={t.features.harnesses} />
        </div>
        <div>
          <h4 className="mb-3 text-xs font-medium text-muted-foreground">{w.local.examples}</h4>
          <Marks choices={localModels} label={w.local.examples} />
        </div>
      </figcaption>
    </figure>
  );
}
