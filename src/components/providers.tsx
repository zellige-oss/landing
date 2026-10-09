import antigravity from "@/assets/marks/antigravity.svg";
import claudeCode from "@/assets/marks/claude-code.svg";
import codex from "@/assets/marks/codex.svg";
import deepseek from "@/assets/marks/deepseek.svg";
import gemini from "@/assets/marks/gemini.svg";
import kimi from "@/assets/marks/kimi.svg";
import kimiLight from "@/assets/marks/kimi-light.svg";
import qwen from "@/assets/marks/qwen.svg";
import { cn } from "@/lib/utils";

/*
 * The tools Zellige works with, in their official colours. Colour marks are files
 * (Lobe Icons, MIT, (c) LobeHub, github.com/lobehub/lobe-icons); the black-and-white
 * ones are drawn in the text colour so they hold in dark mode too. pi's mark is from
 * Simple Icons (CC0) and oh-my-pi's from its repository (MIT). Each mark belongs to
 * its owner.
 */
export type Mark = { src: string; lightSrc?: string } | { paths: string[]; accent?: string[]; viewBox?: string };

const opencodeMark: Mark = { paths: ["M16 6H8v12h8V6zm4 16H4V2h16v20z"] };

/** The tools whose subscription Zellige can use. */
export const providers: { name: string; mark: Mark }[] = [
  { name: "Claude Code", mark: { src: claudeCode } },
  { name: "Codex", mark: { src: codex } },
  // Go's mark: anomalyco/opencode, packages/ui/src/assets/icons/provider/opencode-go.svg.
  { name: "OpenCode Go", mark: { paths: ["M19.4004 21H5V3H19.4004V6.59961H8.59961V17.4004H15.7998V13.7998H12.2002V10.2002H19.4004V21Z"] } },
  { name: "Cursor", mark: { paths: ["M22.106 5.68L12.5.135a.998.998 0 00-.998 0L1.893 5.68a.84.84 0 00-.419.726v11.186c0 .3.16.577.42.727l9.607 5.547a.999.999 0 00.998 0l9.608-5.547a.84.84 0 00.42-.727V6.407a.84.84 0 00-.42-.726zm-.603 1.176L12.228 22.92c-.063.108-.228.064-.228-.061V12.34a.59.59 0 00-.295-.51l-9.11-5.26c-.107-.062-.063-.228.062-.228h18.55c.264 0 .428.286.296.514z"] } },
  { name: "Grok", mark: { paths: ["M9.27 15.29l7.978-5.897c.391-.29.95-.177 1.137.272.98 2.369.542 5.215-1.41 7.169-1.951 1.954-4.667 2.382-7.149 1.406l-2.711 1.257c3.889 2.661 8.611 2.003 11.562-.953 2.341-2.344 3.066-5.539 2.388-8.42l.006.007c-.983-4.232.242-5.924 2.75-9.383.06-.082.12-.164.179-.248l-3.301 3.305v-.01L9.267 15.292M7.623 16.723c-2.792-2.67-2.31-6.801.071-9.184 1.761-1.763 4.647-2.483 7.166-1.425l2.705-1.25a7.808 7.808 0 00-1.829-1A8.975 8.975 0 005.984 5.83c-2.533 2.536-3.33 6.436-1.962 9.764 1.022 2.487-.653 4.246-2.34 6.022-.599.63-1.199 1.259-1.682 1.925l7.62-6.815"] } },
  { name: "Antigravity", mark: { src: antigravity } },
];

/** Open-source harnesses, the ones BYOH is about. */
export const openHarnesses: { name: string; label?: string; note?: string; mark: Mark }[] = [
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
  // Named on two lines, so it reads apart from DeepSeek the provider.
  { name: "DeepSeek Harness", label: "DeepSeek", note: "Harness", mark: { src: deepseek } },
];

/** The inference providers your server calls, with your keys or subscriptions (Workings.tsx). */
export const inferenceProviders: { name: string; mark: Mark; openModels?: boolean }[] = [
  { name: "Anthropic", mark: { paths: ["M13.827 3.52h3.603L24 20h-3.603l-6.57-16.48zm-7.258 0h3.767L16.906 20h-3.674l-1.343-3.461H5.017l-1.344 3.46H0L6.57 3.522zm4.132 9.959L8.453 7.687 6.205 13.48H10.7z"] } },
  { name: "OpenAI", mark: { paths: ["M9.205 8.658v-2.26c0-.19.072-.333.238-.428l4.543-2.616c.619-.357 1.356-.523 2.117-.523 2.854 0 4.662 2.212 4.662 4.566 0 .167 0 .357-.024.547l-4.71-2.759a.797.797 0 00-.856 0l-5.97 3.473zm10.609 8.8V12.06c0-.333-.143-.57-.429-.737l-5.97-3.473 1.95-1.118a.433.433 0 01.476 0l4.543 2.617c1.309.76 2.189 2.378 2.189 3.948 0 1.808-1.07 3.473-2.76 4.163zM7.802 12.703l-1.95-1.142c-.167-.095-.239-.238-.239-.428V5.899c0-2.545 1.95-4.472 4.591-4.472 1 0 1.927.333 2.712.928L8.23 5.067c-.285.166-.428.404-.428.737v6.898zM12 15.128l-2.795-1.57v-3.33L12 8.658l2.795 1.57v3.33L12 15.128zm1.796 7.23c-1 0-1.927-.332-2.712-.927l4.686-2.712c.285-.166.428-.404.428-.737v-6.898l1.974 1.142c.167.095.238.238.238.428v5.233c0 2.545-1.974 4.472-4.614 4.472zm-5.637-5.303l-4.544-2.617c-1.308-.761-2.188-2.378-2.188-3.948A4.482 4.482 0 014.21 6.327v5.423c0 .333.143.571.428.738l5.947 3.449-1.95 1.118a.432.432 0 01-.476 0zm-.262 3.9c-2.688 0-4.662-2.021-4.662-4.519 0-.19.024-.38.047-.57l4.686 2.71c.286.167.571.167.856 0l5.97-3.448v2.26c0 .19-.07.333-.237.428l-4.543 2.616c-.619.357-1.356.523-2.117.523zm5.899 2.83a5.947 5.947 0 005.827-4.756C22.287 18.339 24 15.84 24 13.296c0-1.665-.713-3.282-1.998-4.448.119-.5.19-.999.19-1.498 0-3.401-2.759-5.947-5.946-5.947-.642 0-1.26.095-1.88.31A5.962 5.962 0 0010.205 0a5.947 5.947 0 00-5.827 4.757C1.713 5.447 0 7.945 0 10.49c0 1.666.713 3.283 1.998 4.448-.119.5-.19 1-.19 1.499 0 3.401 2.759 5.946 5.946 5.946.642 0 1.26-.095 1.88-.309a5.96 5.96 0 004.162 1.713z"] } },
  { name: "Google", mark: { src: gemini } },
  { name: "DeepSeek", mark: { src: deepseek }, openModels: true },
  { name: "Qwen", mark: { src: qwen }, openModels: true },
  { name: "Kimi", mark: { src: kimi, lightSrc: kimiLight }, openModels: true },
];

/** A tool's mark, sized by its class. */
export function ProviderMark({ mark, className }: { mark: Mark; className?: string }) {
  if ("src" in mark) return (
    <>
      {mark.lightSrc && <img src={mark.lightSrc} alt="" width="24" height="24" className={cn("shrink-0 dark:hidden", className)} />}
      <img src={mark.src} alt="" width="24" height="24" className={cn("shrink-0", mark.lightSrc && "hidden dark:block", className)} />
    </>
  );
  return (
    <svg viewBox={mark.viewBox ?? "0 0 24 24"} fill="currentColor" fillRule="evenodd" aria-hidden="true" className={cn("shrink-0", className)}>
      {mark.paths.map((d) => <path key={d} d={d} />)}
      {mark.accent?.map((d) => <path key={d} d={d} fill="#f97316" />)}
    </svg>
  );
}
