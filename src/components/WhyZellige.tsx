import { useState } from "react";
import { useT } from "@/i18n";
import { useDisclosure } from "@/hooks/use-disclosure";
import { ChevronDown, ChevronRight, X } from "lucide-react";
import { emblem } from "@/components/brand";
import { cn } from "@/lib/utils";

/** The name's origin: a floating tile on desktop, an inline disclosure in the mobile menu. */
export function WhyZellige({ variant = "floating" }: { variant?: "floating" | "menu" }) {
  const t = useT();
  const { props } = useDisclosure();
  const [explained, setExplained] = useState(false);
  const floating = variant === "floating";
  return (
    <details
      {...props}
      data-explained={explained || undefined}
      onToggle={(event) => {
        props.onToggle(event);
        if (event.currentTarget.open) setExplained(true);
      }}
      className={cn("group/why", floating ? "why-floating fixed right-6 bottom-6 z-30 hidden nav:block" : "why-menu mt-2 rounded-xl border border-border bg-popover transition-colors hover:border-brass/60 open:border-brass/70")}
    >
      {/* In the phone menu it reads like the section links above it. */}
      <summary className={cn("flex min-h-12 cursor-pointer list-none items-center gap-3 transition-colors [&::-webkit-details-marker]:hidden", floating ? "rounded-2xl border border-brass/60 bg-popover py-2.5 pr-4 pl-2.5 text-gold shadow-[0_10px_30px_-12px_rgb(var(--shadow-ink)/0.5)] hover:border-brass" : "px-4 py-3.5 text-lg font-medium text-foreground/85 hover:text-foreground")}>
        <img src={emblem} alt="" width="128" height="128" className={cn("shrink-0", floating ? "size-10" : "size-7")} />
        <span className={cn("whitespace-nowrap", floating && "text-sm font-medium")}>{t.hero.why.title}</span>
        {floating ? (
          <>
            <ChevronDown aria-hidden="true" className="ml-auto size-4 rotate-180 group-open/why:hidden" />
            <X aria-hidden="true" className="ml-auto hidden size-4 group-open/why:block" />
          </>
        ) : (
          <ChevronRight aria-hidden="true" className="ml-auto size-5 text-gold transition-transform group-open/why:rotate-90" />
        )}
      </summary>
      <div className={cn("text-left", floating ? "absolute right-0 bottom-[calc(100%+12px)] max-h-[calc(100dvh-8rem)] w-[min(360px,calc(100vw-48px))] overflow-y-auto rounded-2xl border border-brass/50 bg-popover p-5 shadow-[0_18px_40px_-20px_rgb(var(--shadow-ink)/0.5)]" : "px-4 pb-4")}>
        {floating && <p className="text-lg font-semibold text-gold">{t.hero.why.title}</p>}
        <p className={cn("flex flex-wrap items-baseline gap-x-2.5 text-sm", floating && "mt-3")}>
          <span className="font-semibold">zel·li·ge</span>
          <span className="text-muted-foreground">/zɛˈliːʒ/</span>
          <span lang="ar" dir="rtl" className="text-muted-foreground">الزليج</span>
        </p>
        <div className="mt-2 grid gap-2 text-[15px] leading-[1.65] text-muted-foreground">
          <p>{t.hero.why.from} <span className="font-medium text-foreground">az-zellīj</span>, {t.hero.why.meaning}</p>
          <p>{t.hero.why.history}</p>
        </div>
      </div>
    </details>
  );
}
