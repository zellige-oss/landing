import antigravity from "@/assets/marks/antigravity.svg";
import claudeCode from "@/assets/marks/claude-code.svg";
import codex from "@/assets/marks/codex.svg";
import deepseek from "@/assets/marks/deepseek.svg";
import { cn } from "@/lib/utils";

/*
 * The tools Zellige works with, in their official colours. Colour marks are files
 * (Lobe Icons, MIT, (c) LobeHub, github.com/lobehub/lobe-icons); the black-and-white
 * ones are drawn in the text colour so they hold in dark mode too. pi's mark is from
 * Simple Icons (CC0) and oh-my-pi's from its repository (MIT). Each mark belongs to
 * its owner.
 */
export type Mark = { src: string } | { paths: string[]; accent?: string[]; viewBox?: string };

const opencodeMark: Mark = { paths: ["M16 6H8v12h8V6zm4 16H4V2h16v20z"] };

/** The tools whose subscription Zellige can use, and how you sign in to each. */
export const providers: { name: string; command: string | null; mark: Mark }[] = [
  { name: "Claude Code", command: "claude auth login", mark: { src: claudeCode } },
  { name: "Codex CLI", command: "codex login", mark: { src: codex } },
  { name: "OpenCode", command: "opencode auth", mark: opencodeMark },
  { name: "Cursor", command: "@cursor/sdk", mark: { paths: ["M22.106 5.68L12.5.135a.998.998 0 00-.998 0L1.893 5.68a.84.84 0 00-.419.726v11.186c0 .3.16.577.42.727l9.607 5.547a.999.999 0 00.998 0l9.608-5.547a.84.84 0 00.42-.727V6.407a.84.84 0 00-.42-.726zm-.603 1.176L12.228 22.92c-.063.108-.228.064-.228-.061V12.34a.59.59 0 00-.295-.51l-9.11-5.26c-.107-.062-.063-.228.062-.228h18.55c.264 0 .428.286.296.514z"] } },
  { name: "Grok CLI", command: "grok login", mark: { paths: ["M9.27 15.29l7.978-5.897c.391-.29.95-.177 1.137.272.98 2.369.542 5.215-1.41 7.169-1.951 1.954-4.667 2.382-7.149 1.406l-2.711 1.257c3.889 2.661 8.611 2.003 11.562-.953 2.341-2.344 3.066-5.539 2.388-8.42l.006.007c-.983-4.232.242-5.924 2.75-9.383.06-.082.12-.164.179-.248l-3.301 3.305v-.01L9.267 15.292M7.623 16.723c-2.792-2.67-2.31-6.801.071-9.184 1.761-1.763 4.647-2.483 7.166-1.425l2.705-1.25a7.808 7.808 0 00-1.829-1A8.975 8.975 0 005.984 5.83c-2.533 2.536-3.33 6.436-1.962 9.764 1.022 2.487-.653 4.246-2.34 6.022-.599.63-1.199 1.259-1.682 1.925l7.62-6.815"] } },
  { name: "Antigravity", command: null, mark: { src: antigravity } },
];

/** Open-source harnesses, the ones BYOH is about. */
export const openHarnesses: { name: string; mark: Mark }[] = [
  { name: "pi", mark: { paths: ["M0 0v24h6v-6h6v-6H6V6h6v6h6V0Zm18 12v12h6V12Z"] } },
  { name: "OpenCode", mark: opencodeMark },
  {
    name: "oh-my-pi",
    mark: {
      viewBox: "0 0 120 90",
      paths: ["M12 8h96a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H12a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2Z", "M27 20h8a2 2 0 0 1 2 2v58a2 2 0 0 1-2 2h-8a2 2 0 0 1-2-2V22a2 2 0 0 1 2-2Z", "M77 20h8a2 2 0 0 1 2 2v35H75V22a2 2 0 0 1 2-2Z"],
      // Its plug, in its own orange.
      accent: ["M74 55h14a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H74a3 3 0 0 1-3-3V58a3 3 0 0 1 3-3Zm2 4v8h3v-8h-3Zm6 0v8h3v-8h-3Z"],
    },
  },
  { name: "DeepSeek Harness", mark: { src: deepseek } },
];

/** A tool's mark, sized by its class. */
export function ProviderMark({ mark, className }: { mark: Mark; className?: string }) {
  if ("src" in mark) return <img src={mark.src} alt="" width="24" height="24" className={cn("shrink-0", className)} />;
  return (
    <svg viewBox={mark.viewBox ?? "0 0 24 24"} fill="currentColor" fillRule="evenodd" aria-hidden="true" className={cn("shrink-0", className)}>
      {mark.paths.map((d) => <path key={d} d={d} />)}
      {mark.accent?.map((d) => <path key={d} d={d} fill="#f97316" />)}
    </svg>
  );
}
