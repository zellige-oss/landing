import { ArrowDown, ArrowRight, KeyRound, MonitorSmartphone, Network, Server } from "lucide-react";
import { cn } from "@/lib/utils";
import { useT } from "@/i18n";

const icons = [MonitorSmartphone, Network, Server, KeyRound];

/** How a request travels: your devices, Tailscale, your server, the models. */
export function Workings({ className }: { className?: string }) {
  const t = useT();
  const { title, nodes } = t.story.workings;
  return (
    <div data-reveal className={cn("pb-20", className)}>
      <h3 className="font-serif text-[28px] text-gold italic sm:text-[32px]">{title}</h3>
      <ol className="mt-6 grid gap-3 lg:grid-cols-[repeat(4,minmax(0,1fr))] lg:gap-0">
        {nodes.map(([name, body], index) => {
          const Icon = icons[index];
          const last = index === nodes.length - 1;
          return (
            <li key={name} className="flex flex-col items-center gap-3 lg:flex-row lg:items-stretch">
              <div className="w-full flex-1 rounded-2xl border border-border bg-popover/70 p-5 shadow-[0_14px_34px_-26px_rgb(20_43_53/0.45)]">
                <span aria-hidden="true" className="grid size-10 place-items-center rounded-xl border border-brass/50 bg-surface text-gold">
                  <Icon strokeWidth={1.5} className="size-5" />
                </span>
                <p className="mt-4 font-semibold">{name}</p>
                <p className="mt-1.5 text-[15px] leading-[1.65] text-muted-foreground">{body}</p>
              </div>
              {!last && (
                <span aria-hidden="true" className="text-brass lg:self-center lg:px-2">
                  <ArrowDown className="size-5 lg:hidden" />
                  <ArrowRight className="hidden size-5 lg:block" />
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
