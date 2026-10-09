import { site } from "../site";

export const initialRelease = { version: "0.0.0", href: `${site.repository}/releases` };

/** Public releases only; no credentials are needed or shipped to the browser. */
export async function fetchLatestRelease(signal: AbortSignal) {
  try {
    const response = await fetch(`https://api.github.com/repos${new URL(site.repository).pathname}/releases/latest`, {
      headers: { Accept: "application/vnd.github+json" },
      signal,
    });
    if (!response.ok) return initialRelease;
    const release = await response.json();
    const tag = typeof release?.tag_name === "string" ? release.tag_name.trim() : "";
    if (!tag || release.draft || release.prerelease) return initialRelease;
    return { version: tag.replace(/^v(?=\d)/i, ""), href: `${site.repository}/releases/tag/${encodeURIComponent(tag)}` };
  } catch {
    // No release yet, offline or rate limited: the rest of the landing still works.
    return initialRelease;
  }
}
