import { Bot, CodeXml, Mail, MessagesSquare, Workflow } from "lucide-react";
import { emblem } from "./brand";
import { useT } from "@/i18n";
import type { FeatureIcon } from "@/i18n/messages";
import { LayerGlyph } from "./Trio";
import { site } from "@/site";

/** A breathing strip between sections: a narrow band of the ceramic mosaic set in brass. */
export function Band() {
  return (
    <div aria-hidden="true" className="px-6 py-14 sm:px-[clamp(24px,4.5vw,80px)] sm:py-20">
      <div className="ceramic mosaic-band h-10 sm:h-14" />
    </div>
  );
}

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
    </section>
  );
}

/** The last page: where the code lives and how to reach the people behind it. */
export function Contact() {
  const t = useT();
  const links = [
    { href: site.repository, label: t.contact.repo, detail: site.repository.replace("https://github.com/", ""), Icon: CodeXml },
    ...(site.email ? [{ href: `mailto:${site.email}`, label: t.contact.email, detail: site.email, Icon: Mail }] : []),
  ];
  return (
    <section id="contacto" aria-labelledby="contact-title" className="lattice relative mx-3 bg-night px-[26px] pt-[76px] pb-14 text-night-foreground sm:mx-[30px] sm:px-10 sm:pt-[120px] sm:pb-[104px] min-[1050px]:px-[clamp(24px,4.5vw,80px)]">
      <div aria-hidden="true" className="ceramic absolute inset-x-0 top-0 h-[34px] border-b border-brass bg-[length:136px_136px] bg-repeat-x" />
      <div data-reveal className="grid items-start sm:grid-cols-[1fr_2fr] sm:gap-x-[10%]">
        <img src={emblem} width="260" height="260" alt="" loading="lazy" decoding="async" className="mb-8 w-[82px] drop-shadow-[0_18px_30px_#0008] sm:row-span-4 sm:mb-0 sm:w-[min(100%,260px)] sm:self-center sm:justify-self-center" />
        <p className="eyebrow text-night-gold">{t.header.links.contact}</p>
        <h2 id="contact-title" className="mt-6 text-[49px] leading-[1.02] sm:text-[clamp(46px,5.5vw,84px)]">
          {t.contact.headline.lead}<br /><em className="text-night-gold">{t.contact.headline.turn}</em>
        </h2>
        <div>
          <p className="mt-6 max-w-[52ch] text-[15px] leading-[1.75] text-night-muted sm:text-base">{t.contact.body}</p>
          <ul className="mt-9 grid max-w-[560px] gap-3">
            {links.map(({ href, label, detail, Icon }) => (
              <li key={href}>
                <a
                  href={href}
                  {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="group flex items-center gap-4 rounded-2xl border border-white/15 px-5 py-4 transition-colors hover:border-night-gold focus-visible:border-night-gold"
                >
                  <Icon aria-hidden="true" strokeWidth={1.5} className="size-6 shrink-0 text-night-gold" />
                  <span className="min-w-0">
                    <span className="block font-semibold">{label}</span>
                    <span className="block truncate text-sm text-night-muted">{detail}</span>
                  </span>
                  <span aria-hidden="true" className="ml-auto text-night-gold transition-transform group-hover:translate-x-1">→</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
