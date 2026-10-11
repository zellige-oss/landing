// SSR entry for scripts/build-brand.mjs: Zel's face for every mood as standalone
// SVG, from the same component the landing renders.
import type { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { moods, ZelFace, type Mood } from "../src/components/ZelFace";

const frame = (face: ReactNode) => renderToStaticMarkup(
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1254 1254" width="1254" height="1254">{face}</svg>,
);

export function faces(): Record<string, string> {
  return Object.fromEntries(moods.map((mood) => [mood, frame(<ZelFace mood={mood} />)]));
}

/** Zel's face with the eyes the story gives a mood, held in their still pose. */
export const storyFace = (mood: Mood) => frame(<ZelFace mood={mood} acting />);
