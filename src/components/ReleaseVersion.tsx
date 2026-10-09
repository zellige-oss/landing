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
      aria-label={`${release.version} — ${t.hero.releases}`}
      title={`${release.version} — ${t.hero.releases}`}
      className="absolute top-1/2 left-full ml-2 max-w-12 -translate-y-1/2 truncate font-mono text-[13px] text-gold tabular-nums underline-offset-4 hover:underline sm:ml-3 sm:max-w-24 sm:text-sm"
    >
      v{release.version}
    </a>
  );
}
