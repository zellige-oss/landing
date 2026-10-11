import { useEffect, useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useT } from "@/i18n";
import { Wordmark } from "@/components/Wordmark";
import { GitHubMark } from "@/components/GitHubMark";
import { site } from "@/site";

export function Header() {
  const t = useT();
  // Establish the header as soon as scrolling starts, independently of the
  // wordmark's trip. Only crossing this boundary needs a React update.
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    let previous = false;
    const update = () => {
      const next = window.scrollY > 8;
      if (next === previous) return;
      previous = next;
      setScrolled(next);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  // The wordmark appears once: the header's brand shows only after the hero's has scrolled away.
  const [heroMark, setHeroMark] = useState(true);
  useEffect(() => {
    const mark = document.getElementById("hero-title");
    if (!mark) return;
    const observer = new IntersectionObserver(([entry]) => setHeroMark(entry.isIntersecting));
    observer.observe(mark);
    return () => observer.disconnect();
  }, []);
  return (
    <header data-scrolled={scrolled} className="site-header fixed inset-x-0 top-0 z-10 flex items-center gap-2 border-b px-4 py-3 sm:gap-8 sm:px-[30px] sm:py-4">
      {/* The wordmark takes over from the hero. Zel belongs to the page's story. */}
      <a className={cn("inline-flex shrink-0 items-center", heroMark && "pointer-events-none")} href="#inicio" aria-label={t.header.home} tabIndex={heroMark ? -1 : undefined}>
        <span id="header-wordmark" className={cn("block transition-opacity duration-300", heroMark && "opacity-0")}><Wordmark className="h-10 w-auto sm:h-11" /></span>
      </a>
      {/* The code, one click away on every screen: the page's one call to action. */}
      <a
        href={site.repository}
        target="_blank"
        rel="noopener noreferrer"
        title={t.header.repository}
        aria-label={t.header.repository}
        className={cn(buttonVariants({ variant: "cta-secondary", size: "lg" }), "ml-auto h-10 shrink-0 gap-2 px-4 text-[13px]")}
      >
        <GitHubMark className="size-4" />
        <span>GitHub</span>
      </a>
    </header>
  );
}
