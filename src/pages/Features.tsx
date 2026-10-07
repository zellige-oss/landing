import type { ReactNode } from "react";
import { KeyRound, Plug, SquareTerminal, Workflow, type LucideIcon } from "lucide-react";
import { ProviderMark, openHarnesses, providers } from "@/components/providers";
import { useT } from "@/i18n";

/** The commercial harnesses (OpenCode sits with the open-source ones). */
const harnesses = providers.filter(({ name }) => !["Antigravity", "OpenCode"].includes(name));

function Card({ icon: Icon, tag, title, body, children }: { icon: LucideIcon; tag: string; title: string; body: string; children?: ReactNode }) {
  return (
    <li data-reveal className="flex flex-col rounded-2xl border border-border bg-popover/70 p-6 shadow-[0_14px_34px_-26px_rgb(20_43_53/0.45)]">
      <p className="flex items-center gap-3 font-serif text-[34px] leading-none text-gold italic">
        <span aria-hidden="true" className="grid size-10 place-items-center rounded-xl border border-brass/50 bg-surface not-italic">
          <Icon strokeWidth={1.5} className="size-5" />
        </span>
        {tag}
      </p>
      <h3 className="mt-2 text-lg font-semibold">{title}</h3>
      <p className="mt-1.5 text-[15px] leading-[1.6] text-muted-foreground">{body}</p>
      {children && <div className="mt-auto pt-4 text-[13px]">{children}</div>}
    </li>
  );
}

/** Bring your own: API key, subscription (or not) and harness. */
export function Features() {
  const t = useT();
  const f = t.features;
  return (
    <section id="funciones" aria-labelledby="features-title" className="px-6 py-20 sm:px-[clamp(24px,4.5vw,80px)] sm:py-24 min-[1800px]:mx-auto min-[1800px]:max-w-[1800px]">
      <h2 id="features-title" data-reveal className="text-[clamp(38px,9vw,52px)] leading-[1.02] sm:text-[clamp(44px,4.6vw,76px)]">{f.title}</h2>
      <ul className="mt-8 grid gap-4 lg:grid-cols-3">
        <Card icon={KeyRound} {...f.key} />
        <Card icon={Plug} {...f.sub}>
          <ul aria-label={f.providers} className="grid gap-1.5">
            {providers.map(({ name, command, paths }) => (
              <li key={name} className="flex items-center gap-2">
                <ProviderMark paths={paths} className="size-3.5 shrink-0" />
                <span className="w-24 shrink-0">{name}</span>
                {command ? <code className="truncate font-mono text-muted-foreground">{command}</code> : <span className="text-muted-foreground">{f.sub.google}</span>}
              </li>
            ))}
          </ul>
        </Card>
        <Card icon={Workflow} {...f.harness}>
          <ul className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
            {harnesses.map(({ name, paths }) => (
              <li key={name} className="inline-flex items-center gap-1.5"><ProviderMark paths={paths} className="size-3.5" />{name}</li>
            ))}
          </ul>
          <p className="mt-3 text-[11px] tracking-wide text-muted-foreground uppercase">{f.harness.open}</p>
          <ul className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1.5">
            {openHarnesses.map(({ name, paths }) => (
              <li key={name} className="inline-flex items-center gap-1.5">
                {paths ? <ProviderMark paths={paths} className="size-3.5" /> : <SquareTerminal aria-hidden="true" strokeWidth={1.75} className="size-3.5" />}
                {name}
              </li>
            ))}
            <li className="text-muted-foreground">{f.harness.more}</li>
          </ul>
        </Card>
      </ul>
      <ul data-reveal className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[15px]">
        {f.points.map((point) => (
          <li key={point} className="flex items-center gap-2.5"><span aria-hidden="true" className="size-2 rotate-45 bg-brass" />{point}</li>
        ))}
      </ul>
      <p className="mt-4 text-xs text-muted-foreground/80">{f.trademarks}</p>
    </section>
  );
}
