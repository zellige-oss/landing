import { CodeXml, Mail } from "lucide-react";
import { TileInProgress } from "@/components/TileInProgress";
import { WhyZellige } from "@/components/WhyZellige";
import { buttonVariants } from "@/components/ui/button";
import { useT } from "@/i18n";
import { cn } from "@/lib/utils";
import { site } from "@/site";

/** The last page: where the code lives and how to reach the people behind it. */
export function Contact() {
  const t = useT();
  const links = [
    { href: site.repository, label: t.contact.repo, detail: site.repository.replace("https://github.com/", ""), Icon: CodeXml },
    ...(site.email ? [{ href: `mailto:${site.email}`, label: t.contact.email, detail: site.email, Icon: Mail }] : []),
  ];
  return (
    <section id="contacto" aria-labelledby="contact-title" className="px-6 py-20 sm:px-[clamp(24px,4.5vw,80px)] sm:py-24 min-[1800px]:mx-auto min-[1800px]:max-w-[1800px]">
      <div data-reveal className="grid items-start gap-y-14 border-t border-border/70 pt-14 sm:pt-20 lg:grid-cols-[minmax(0,1.2fr)_minmax(240px,0.8fr)] lg:gap-x-[12%]">
        <div>
          <h2 id="contact-title" className="section-title text-white">
            {t.contact.headline.lead}<br /><em>{t.contact.headline.turn}</em>
          </h2>
          <p className="mt-6 max-w-[48ch] text-[15px] leading-[1.75] text-muted-foreground sm:text-base">{t.contact.body}</p>
          <ul className="mt-9 flex flex-wrap gap-3">
            {links.map(({ href, label, detail, Icon }) => (
              <li key={href}>
                <a
                  href={href}
                  title={detail}
                  {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className={cn(buttonVariants({ variant: "cta-secondary", size: "lg" }), "h-auto min-h-11 gap-2.5 px-5 py-3 text-sm whitespace-normal")}
                >
                  <Icon aria-hidden="true" strokeWidth={1.5} className="size-4" />
                  <span>{label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
        <figure className="flex w-full max-w-[360px] flex-col gap-6 justify-self-center lg:gap-7 lg:pt-8">
          <TileInProgress className="mx-auto w-[min(52vw,200px)] sm:w-[240px] lg:w-[min(80%,280px)]" />
          <WhyZellige />
        </figure>
      </div>
    </section>
  );
}
