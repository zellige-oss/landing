import { Bot, MessagesSquare, Workflow } from "lucide-react";
import { ProviderLogos } from "@/components/ProviderLogos";
import { LayerGlyph } from "@/components/Trio";
import { useT } from "@/i18n";
import type { FeatureIcon } from "@/i18n/messages";

const icons: Record<FeatureIcon, typeof MessagesSquare> = { chat: MessagesSquare, harness: Workflow, agent: Bot };

/** What Zellige brings together: one pillar per layer of the tile, then what joins them. */
export function Features() {
  const t = useT();
  return (
    <section id="funciones" aria-labelledby="features-title" className="px-6 py-20 sm:px-[clamp(24px,4.5vw,80px)] sm:py-28 min-[1800px]:mx-auto min-[1800px]:max-w-[1800px]">
      <div data-reveal>
        <p className="eyebrow">{t.header.links.features}</p>
        <h2 id="features-title" className="mt-4 text-[clamp(38px,9vw,52px)] leading-[1.02] sm:text-[clamp(44px,4.6vw,76px)]">
          {t.features.headline.lead}<br /><em className="text-accent">{t.features.headline.turn}</em>
        </h2>
      </div>
      <ul className="mt-12 grid gap-4 sm:gap-5 lg:grid-cols-3">
        {t.features.pillars.map(([icon, layer, use, title, body]) => {
          const Icon = icons[icon];
          return (
            <li key={title} data-reveal className="flex flex-col rounded-2xl border border-border bg-popover/70 p-6 shadow-[0_14px_34px_-26px_rgb(20_43_53/0.45)] sm:p-8">
              <div className="flex items-center gap-3">
                <span aria-hidden="true" className="grid size-12 place-items-center rounded-xl border border-brass/50 bg-surface text-gold">
                  <Icon strokeWidth={1.5} className="size-6" />
                </span>
                {/* The layer of the tile this pillar is, as in the story above. */}
                <span className="inline-flex items-center gap-1.5 rounded-full bg-surface py-0.5 pr-2.5 pl-1.5 text-[13px] text-muted-foreground">
                  <LayerGlyph layer={layer} className="size-4" /> {use}
                </span>
              </div>
              <h3 className="mt-6 text-xl leading-snug font-semibold sm:text-2xl">{title}</h3>
              <p className="mt-3 text-[15px] leading-[1.7] text-muted-foreground sm:text-base">{body}</p>
            </li>
          );
        })}
      </ul>
      <div data-reveal className="mt-14 border-t border-border pt-10 sm:mt-20">
        <h3 className="font-serif text-[28px] text-gold italic sm:text-[32px]">{t.features.together.title}</h3>
        <ul className="mt-6 grid gap-6 sm:grid-cols-3 sm:gap-10">
          {t.features.together.items.map(([title, body]) => (
            <li key={title} className="flex gap-3.5">
              <span aria-hidden="true" className="mt-2 size-2.5 shrink-0 rotate-45 bg-brass" />
              <span>
                <strong className="block font-semibold">{title}</strong>
                <span className="mt-1.5 block text-[15px] leading-[1.7] text-muted-foreground">{body}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
      {/* Why Zellige is built around model APIs rather than subscriptions. */}
      <div data-reveal className="mt-14 grid gap-6 rounded-2xl border border-border bg-popover/70 p-6 shadow-[0_14px_34px_-26px_rgb(20_43_53/0.45)] sm:mt-20 sm:p-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-14">
        <h3 className="font-serif text-[28px] leading-tight text-gold italic sm:text-[32px]">{t.features.api.title}</h3>
        <div className="grid gap-4 text-[15px] leading-[1.75] text-muted-foreground sm:text-base">
          {t.features.api.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          <h4 className="mt-4 font-serif text-[22px] text-gold italic sm:text-[24px]">{t.features.api.sub.title}</h4>
          <p>{t.features.api.sub.body}</p>
          <ProviderLogos label={t.features.api.providers} google={t.features.api.sub.google} />
          <p className="text-xs text-muted-foreground/80">{t.features.api.trademarks}</p>
        </div>
      </div>
    </section>
  );
}
