import type { ReactNode } from "react";
import { Database, KeyRound, RefreshCw, Server, Workflow, type LucideIcon } from "lucide-react";
import { ProviderMark, openHarnesses, providers } from "@/components/providers";
import { useT } from "@/i18n";

function Card({ icon: Icon, tag, title, body, children }: { icon: LucideIcon; tag: string; title: string; body: string; children: ReactNode }) {
  return (
    <li data-reveal className="flex flex-col rounded-2xl border border-border bg-popover/70 p-6 shadow-[0_14px_34px_-26px_rgb(20_43_53/0.45)] sm:p-7">
      <p className="flex items-center gap-3">
        <span aria-hidden="true" className="grid size-10 place-items-center rounded-xl border border-brass/50 bg-surface text-gold">
          <Icon strokeWidth={1.5} className="size-5" />
        </span>
        <span className="text-sm font-bold tracking-[0.12em] text-gold">{tag}</span>
      </p>
      <h3 className="mt-4 text-xl font-semibold">{title}</h3>
      <p className="mt-2 text-[15px] leading-[1.65] text-muted-foreground">{body}</p>
      <div className="mt-auto pt-5 text-sm">{children}</div>
    </li>
  );
}

const pointIcons = [Server, Database, RefreshCw];

/** Bring your own: subscription or API key, and an open-source harness. */
export function Features() {
  const t = useT();
  const f = t.features;
  return (
    <section id="funciones" aria-labelledby="features-title" className="px-6 py-20 sm:px-[clamp(24px,4.5vw,80px)] sm:py-24 min-[1800px]:mx-auto min-[1800px]:max-w-[1800px]">
      <h2 id="features-title" data-reveal className="text-[clamp(38px,9vw,52px)] leading-[1.02] sm:text-[clamp(44px,4.6vw,76px)]">{f.title}</h2>
      <ul className="mt-8 grid gap-4 lg:grid-cols-2">
        <Card icon={KeyRound} {...f.access}>
          <ul aria-label={f.providers} className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
            {providers.map(({ name, command, mark }) => (
              <li key={name} className="flex min-w-0 items-center gap-2">
                <ProviderMark mark={mark} className="size-4" />
                <span className="shrink-0">{name}</span>
                {command ? <code className="truncate font-mono text-[12px] text-muted-foreground">{command}</code> : <span className="text-muted-foreground">{f.access.google}</span>}
              </li>
            ))}
          </ul>
        </Card>
        <Card icon={Workflow} {...f.harness}>
          {/* The marks large, in one row, so the card shows what it is about at a glance. */}
          <ul aria-label={f.harnesses} className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {openHarnesses.map(({ name, mark }) => (
              <li key={name} className="flex flex-col items-center gap-2 rounded-xl border border-border bg-surface/70 px-2 py-4 text-center leading-tight">
                <ProviderMark mark={mark} className="size-7" />{name}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-muted-foreground">{f.harness.more}</p>
        </Card>
      </ul>
      {/* What every part shares, as one bar under the cards. */}
      <ul data-reveal className="mt-4 grid divide-y divide-border rounded-2xl border border-border bg-popover/70 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {f.points.map((point, index) => {
          const Icon = pointIcons[index];
          return (
            <li key={point} className="flex items-center gap-3 px-5 py-4 text-[15px] font-medium">
              <Icon aria-hidden="true" strokeWidth={1.5} className="size-5 shrink-0 text-gold" />{point}
            </li>
          );
        })}
      </ul>
      <p className="mt-4 text-xs text-muted-foreground/80">{f.trademarks}</p>
    </section>
  );
}
