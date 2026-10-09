import { useEffect, useState } from "react";
import { Menu, Moon, Sun, X } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useT } from "@/i18n";
import { ZelMark } from "@/components/ZelMark";
import { Wordmark } from "@/components/Wordmark";
import { GitHubMark } from "@/components/GitHubMark";
import { site } from "@/site";
import { useDisclosure } from "@/hooks/use-disclosure";
import { WhyZellige } from "@/components/WhyZellige";

export function Header() {
  const t = useT();
  // The wordmark appears once: the header's brand shows only after the hero's has scrolled away.
  const [heroMark, setHeroMark] = useState(true);
  useEffect(() => {
    const mark = document.getElementById("hero-title");
    if (!mark) return;
    const observer = new IntersectionObserver(([entry]) => setHeroMark(entry.isIntersecting));
    observer.observe(mark);
    return () => observer.disconnect();
  }, []);
  // The section in view gets the mosaic strip under its link.
  const [current, setCurrent] = useState<string>();
  useEffect(() => {
    const ids = ["inicio", "piezas", "funciones", "contacto"];
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) setCurrent(`#${entry.target.id}`);
        else setCurrent((value) => (value === `#${entry.target.id}` ? undefined : value));
      }
    }, { rootMargin: "-45% 0px -50% 0px" });
    for (const id of ids) {
      const node = document.getElementById(id);
      if (node) observer.observe(node);
    }
    return () => observer.disconnect();
  }, []);
  // On narrow screens the links live in a menu that also opens without JavaScript.
  const { open, close, props: menu } = useDisclosure();
  // Home first, so the top of the page is one click away from anywhere.
  const links = [
    ["#inicio", t.header.links.home],
    ["#piezas", t.header.links.idea],
    ["#funciones", t.header.links.features],
    ["#contacto", t.header.links.contact],
  ];
  return (
    <header className={cn("fixed inset-x-0 top-0 z-10 flex items-center gap-4 px-[22px] py-3 transition-[background-color,border-color] duration-300 sm:gap-8 sm:px-[30px] sm:py-4", heroMark && !open ? "border-b border-transparent" : "border-b border-border/70 bg-background/85 backdrop-blur-md")}>
      {/* The logo: Zel beside the wordmark, as in public/brand/logo/zellige-logo-horizontal.png.
          On phones Zel is a little larger than the logo's proportion so its face reads. */}
      <a className={cn("inline-flex shrink-0 items-center gap-1 sm:gap-1.5", heroMark && "pointer-events-none")} href="#inicio" aria-label={t.header.home} tabIndex={heroMark ? -1 : undefined}>
        {/* The flight hands off to this unscaled logo on arrival (Hero.tsx).
            With reduced motion it fades in with the wordmark. */}
        <ZelMark id="header-zel" className={cn("zel-mark transition-opacity duration-300 [--zel:26px] sm:[--zel:31px]", heroMark && "opacity-0")} />
        <span className={cn("transition-[opacity,translate] duration-300", heroMark && "-translate-y-1 opacity-0")}><Wordmark className="h-5 w-auto sm:h-10" /></span>
      </a>
      <nav aria-label={t.header.nav} className="ml-auto flex gap-[30px] max-nav:hidden">
        {links.map(([href, label]) => (
          <a
            key={href}
            href={href}
            aria-current={current === href ? "location" : undefined}
            className="py-[15px] text-[13px] whitespace-nowrap text-foreground/70 decoration-brass decoration-1 underline-offset-[6px] transition-colors hover:text-foreground hover:underline aria-[current]:text-foreground aria-[current]:underline"
          >
            {label}
          </a>
        ))}
      </nav>
      {/* The code, one click away from the first screen. On narrow screens it is in the menu. */}
      <a
        href={site.repository}
        target="_blank"
        rel="noopener noreferrer"
        title={t.header.repository}
        className={cn(buttonVariants({ variant: "cta-secondary", size: "lg" }), "h-10 gap-2 px-4 text-[13px] max-nav:hidden")}
      >
        <GitHubMark className="size-4" />
        GitHub
      </a>
      <button
        type="button"
        aria-label={t.header.theme}
        title={t.header.themeTitle}
        className={cn(buttonVariants({ variant: "cta-secondary", size: "lg" }), "size-10 p-0 max-nav:ml-auto")}
        onClick={() => {
          const dark = document.documentElement.classList.toggle("dark");
          const bar = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
          if (bar) bar.content = (dark ? bar.dataset.dark : bar.dataset.light) ?? bar.content;
          try { localStorage.setItem("zellige-theme", dark ? "dark" : "light"); } catch { /* private mode: keep it for this visit */ }
        }}
      >
        <Moon aria-hidden="true" className="dark:hidden" />
        <Sun aria-hidden="true" className="hidden dark:block" />
      </button>
      <details {...menu} className="group nav:hidden">
        <summary
          aria-label={t.header.menu}
          className={cn(buttonVariants({ variant: "cta-secondary", size: "lg" }), "size-10 cursor-pointer list-none p-0 [&::-webkit-details-marker]:hidden")}
        >
          <Menu aria-hidden="true" className="group-open:hidden" />
          <X aria-hidden="true" className="hidden group-open:block" />
        </summary>
        <div className="absolute inset-x-0 top-full max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain border-b border-border/70 bg-background px-[22px] pb-5 shadow-[0_18px_30px_-24px_rgb(var(--shadow-ink)/0.5)]">
          <nav aria-label={t.header.nav}>
            {/* One button per section, the one in view outlined in brass. */}
            <ul className="grid gap-2 pt-3">
              {links.map(([href, label]) => (
                <li key={href}>
                  <a
                    href={href}
                    aria-current={current === href ? "location" : undefined}
                    onClick={close}
                    className="flex items-center gap-3 rounded-xl border border-border bg-popover px-4 py-3.5 text-lg font-medium text-foreground/85 transition-colors hover:border-brass/60 hover:text-foreground aria-[current]:border-brass/70 aria-[current]:text-foreground"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <WhyZellige variant="menu" />
          <a
            href={site.repository}
            target="_blank"
            rel="noopener noreferrer"
            title={t.header.repository}
            className={cn(buttonVariants({ variant: "cta-secondary", size: "lg" }), "mt-4 h-12 w-full gap-2.5 text-base")}
          >
            <GitHubMark className="size-5" />
            {t.header.code}
          </a>
        </div>
      </details>
    </header>
  );
}
