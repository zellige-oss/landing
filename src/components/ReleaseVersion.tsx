import { useEffect, useState } from "react";
import { useT } from "@/i18n";
import { fetchLatestRelease, initialRelease } from "@/lib/releases";

export function ReleaseVersion() {
  const t = useT();
  const [release, setRelease] = useState(initialRelease);
  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    void fetchLatestRelease(controller.signal).then((latest) => {
      if (!controller.signal.aborted) setRelease(latest);
    }).finally(() => clearTimeout(timeout));
    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, []);
  return (
    <a
      href={release.href}
      target="_blank"
      rel="noopener noreferrer"
      title={t.hero.releases}
      aria-label={`${t.hero.version} ${release.version} — ${t.hero.releases}`}
      className="rounded-sm font-mono text-xs leading-none text-muted-foreground tabular-nums underline decoration-dotted underline-offset-4 transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
    >
      v{release.version}
    </a>
  );
}
