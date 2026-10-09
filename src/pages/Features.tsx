import type { ReactNode } from "react";
import { Construction, KeyRound, Workflow, type LucideIcon } from "lucide-react";
import { ProviderMark, openHarnesses, providers } from "@/components/providers";
import { useT } from "@/i18n";
import { Workings } from "@/components/Workings";
import { useDisclosure } from "@/hooks/use-disclosure";

/** One card, reachable by its `id` (#acceso, #harness). */
function Card({ id, icon: Icon, tag, title, body, children }: { id: string; icon: LucideIcon; tag: string; title: string; body: string; children: ReactNode }) {
  return (
    <li id={id} data-reveal className="panel panel-hover feature-card flex flex-col p-6 sm:p-7">
      <p className="flex items-center gap-3">
        <span aria-hidden="true" className="panel-badge size-10 shrink-0">
          <Icon strokeWidth={1.5} className="size-5" />
        </span>
        <span className="eyebrow">{tag}</span>
      </p>
      <h4 className="mt-4 text-xl font-semibold">{title}</h4>
      <p className="mt-2 text-[15px] leading-[1.65] text-muted-foreground">{body}</p>
      <div className="flex flex-1 flex-col pt-5 text-sm">{children}</div>
    </li>
  );
}

/** How it works: how the parts fit together (the diagram), then what you bring to it:
 *  a subscription or API key, and an open-source harness. */
export function Features() {
  const t = useT();
  const f = t.features;
  const w = t.story.workings;
  const status = useDisclosure();
  return (
    <section id="funciones" aria-labelledby="features-title" className="px-6 py-20 sm:px-[clamp(24px,4.5vw,80px)] sm:py-24 min-[1800px]:mx-auto min-[1800px]:max-w-[1800px]">
      <div data-reveal className="relative z-[1] flex flex-wrap items-center gap-x-5 gap-y-3">
        <h2 id="features-title" className="section-title">{w.title}</h2>
        <details {...status.props} className="relative">
          <summary className="flex w-max cursor-pointer list-none items-center gap-1.5 rounded-full border border-brass/60 bg-popover px-3 py-1.5 text-xs font-medium text-gold transition-colors hover:border-brass [&::-webkit-details-marker]:hidden">
            <Construction aria-hidden="true" strokeWidth={1.5} className="size-3.5" />{w.status.title}
          </summary>
          <p className="absolute top-full left-0 z-20 mt-3 w-[min(80vw,340px)] rounded-xl border border-border bg-popover p-4 text-sm leading-relaxed text-muted-foreground shadow-[0_12px_30px_-12px_rgb(var(--shadow-ink)/0.4)] sm:right-0 sm:left-auto">{w.status.body}</p>
        </details>
      </div>
      <p data-reveal className="mt-4 max-w-[64ch] text-[15px] leading-[1.7] text-muted-foreground sm:text-base">{w.body}</p>
      <Workings className="mt-10" />
      <h3 data-reveal className="mt-20 text-2xl font-semibold tracking-tight sm:text-3xl">{f.title}</h3>
      <ul className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card id="acceso" icon={KeyRound} {...f.access}>
          <ul aria-label={f.providers} className="grid flex-1 grid-cols-2 gap-2 sm:grid-cols-3">
            {providers.map(({ name, mark }) => (
              <li key={name} className="panel-tile feature-tile flex min-w-0 flex-col items-center justify-center gap-2 px-2 py-4 text-center leading-tight">
                <ProviderMark mark={mark} className="size-7" />
                <span className="whitespace-nowrap">{name}</span>
              </li>
            ))}
          </ul>
        </Card>
        <Card id="harness" icon={Workflow} {...f.harness}>
          <ul aria-label={f.harnesses} className="grid flex-1 grid-cols-2 gap-2 sm:grid-cols-4">
            {openHarnesses.map(({ name, label = name, note, mark }) => (
              <li key={name} className="panel-tile feature-tile flex min-h-28 min-w-0 flex-col items-center justify-center gap-3 px-2 py-4 text-center leading-tight">
                <ProviderMark mark={mark} className="size-8" />
                <span title={name} className="grid whitespace-nowrap">
                  {label}
                  {note && <span className="text-xs text-muted-foreground">{note}</span>}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-muted-foreground">{f.harness.more}</p>
        </Card>
      </ul>
      <p className="mt-4 text-xs text-muted-foreground/80">{f.trademarks}</p>
    </section>
  );
}
