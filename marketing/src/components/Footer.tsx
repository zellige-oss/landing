import { ArrowUp, CodeXml, Mail } from "lucide-react";
import { zelMark } from "./brand";
import { Wordmark } from "./Wordmark";
import { useT } from "@/i18n";
import { site } from "@/site";

/** A quiet close: the logo, the tagline and the ways to reach the project, in one line. */
export function Footer() {
  const t = useT();
  const link = "inline-flex items-center gap-1.5 decoration-brass underline-offset-[6px] hover:text-foreground hover:underline";
  return (
    <footer className="px-6 pt-10 pb-8 sm:px-[clamp(24px,4.5vw,80px)] min-[1800px]:mx-auto min-[1800px]:max-w-[1800px]">
      <div className="flex flex-col gap-5 border-t border-border pt-6 text-[13px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <a href="#inicio" aria-label={t.footer.home} className="inline-flex items-center gap-1">
            <img src={zelMark} width="530" height="512" alt="" loading="lazy" className="h-6 w-auto" />
            <Wordmark lazy className="h-8 w-auto" />
          </a>
          <span>{t.footer.tagline}</span>
        </div>
        <nav aria-label={t.footer.nav} className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <a className={link} href={site.repository} target="_blank" rel="noopener noreferrer"><CodeXml aria-hidden="true" strokeWidth={1.5} className="size-4" /> GitHub</a>
          {site.email && <a className={link} href={`mailto:${site.email}`}><Mail aria-hidden="true" strokeWidth={1.5} className="size-4" /> {site.email}</a>}
          <a className={link} href="#inicio">{t.footer.top} <ArrowUp aria-hidden="true" strokeWidth={1.5} className="size-4" /></a>
        </nav>
      </div>
    </footer>
  );
}
