import { useEffect, useRef, useState } from "react";
import { Menu, Moon, Sun, X } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useT } from "@/i18n";
import { zelMark } from "@/components/brand";
import { Wordmark } from "@/components/Wordmark";
import { GitHubMark } from "@/components/GitHubMark";
import { site } from "@/site";

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
    const ids = ["piezas", "funciones", "contacto"];
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
  // On phones the links live in a menu: a <details>, so it opens without JavaScript
  // too. With it, choosing a link, pressing Escape or tapping outside closes it.
  const menu = useRef<HTMLDetailsElement>(null);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const close = () => { if (menu.current) menu.current.open = false; };
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") close(); };
    const onPointer = (event: PointerEvent) => { if (!menu.current?.contains(event.target as Node)) close(); };
    addEventListener("keydown", onKey);
    addEventListener("pointerdown", onPointer);
    return () => {
      removeEventListener("keydown", onKey);
      removeEventListener("pointerdown", onPointer);
    };
  }, [open]);
  const links = [
    ["#piezas", t.header.links.idea],
    ["#funciones", t.header.links.features],
    ["#contacto", t.header.links.contact],
  ];
  return (
    <header className={cn("fixed inset-x-0 top-0 z-10 flex items-center gap-4 px-[22px] py-3 transition-[background-color,border-color] duration-300 sm:gap-8 sm:px-[30px] sm:py-4", heroMark && !open ? "border-b border-transparent" : "border-b border-border/70 bg-background/85 backdrop-blur-md")}>
      {/* The logo: Zel beside the wordmark, as in public/brand/logo/zellige-logo-horizontal.png.
          On phones Zel is a little larger than the logo's proportion so its face reads. */}
      <a className={cn("inline-flex shrink-0 items-center gap-1 sm:gap-1.5", heroMark && "pointer-events-none")} href="#inicio" aria-label={t.header.home} tabIndex={heroMark ? -1 : undefined}>
        {/* With motion, Zel flies here from the hero as you scroll and the hero sets its
            transform and opacity (Hero.tsx); otherwise it fades in with the wordmark. */}
        <img id="header-zel" src={zelMark} width="530" height="512" alt="" className={cn("h-[26px] w-auto origin-top-left transition-opacity duration-300 sm:h-[31px]", heroMark && "opacity-0")} />
        <span className={cn("transition-[opacity,translate] duration-300", heroMark && "-translate-y-1 opacity-0")}><Wordmark className="h-5 w-auto sm:h-10" /></span>
      </a>
      <nav aria-label={t.header.nav} className="ml-auto flex gap-[30px] max-sm:hidden">
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
      <button
        type="button"
        aria-label={t.header.theme}
        title={t.header.themeTitle}
        className={cn(buttonVariants({ variant: "cta-secondary", size: "lg" }), "size-10 p-0 max-sm:ml-auto")}
        onClick={() => {
          const dark = document.documentElement.classList.toggle("dark");
          try { localStorage.setItem("zellige-theme", dark ? "dark" : "light"); } catch { /* private mode: keep it for this visit */ }
        }}
      >
        <Moon aria-hidden="true" className="dark:hidden" />
        <Sun aria-hidden="true" className="hidden dark:block" />
      </button>
      <details ref={menu} className="group sm:hidden" onToggle={(event) => setOpen(event.currentTarget.open)}>
        <summary
          aria-label={t.header.menu}
          className={cn(buttonVariants({ variant: "cta-secondary", size: "lg" }), "size-10 cursor-pointer list-none p-0 [&::-webkit-details-marker]:hidden")}
        >
          <Menu aria-hidden="true" className="group-open:hidden" />
          <X aria-hidden="true" className="hidden group-open:block" />
        </summary>
        <div className="absolute inset-x-0 top-full border-b border-border/70 bg-background px-[22px] pb-5 shadow-[0_18px_30px_-24px_rgb(20_43_53/0.5)]">
          <nav aria-label={t.header.nav}>
            <ul className="divide-y divide-border/70">
              {links.map(([href, label]) => (
                <li key={href}>
                  <a
                    href={href}
                    aria-current={current === href ? "location" : undefined}
                    onClick={() => { if (menu.current) menu.current.open = false; }}
                    className="flex items-center gap-3 py-4 text-lg text-foreground/80 aria-[current]:text-foreground"
                  >
                    <span aria-hidden="true" className={cn("size-1.5 rotate-45", current === href ? "bg-brass" : "bg-foreground/25")} />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <a
            href={site.repository}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t.header.repository}
            title={t.header.repository}
            className={cn(buttonVariants({ variant: "cta-secondary", size: "lg" }), "mt-3 size-12 p-0")}
          >
            <GitHubMark className="size-6" />
          </a>
        </div>
      </details>
    </header>
  );
}
