import { CodeXml, Mail } from "lucide-react";
import { TileInProgress } from "@/components/TileInProgress";
import { useT } from "@/i18n";
import { site } from "@/site";

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
        <TileInProgress className="mb-8 w-[132px] sm:row-span-4 sm:mb-0 sm:w-[min(100%,280px)] sm:self-center sm:justify-self-center" />
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
