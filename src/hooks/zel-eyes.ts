import { useEffect, useRef, type RefObject } from "react";
import type { Mood } from "@/components/ZelFace";
import { AGENT_ERRANDS, eyeCue, eyeFrame, eyePath, mixEyes, type DrawnEye } from "@/components/zel-eye-shapes";
import { ramp } from "@/lib/easing";

/** How long the eyes take to turn from one mood's into the next's, in seconds. */
const TURN = .32;

/*
 * The eyes of the story's Zel. Each mood is a short act the pair plays in a loop
 * (zel-eye-shapes.ts): a smile that opens to look at you, a wink that comes and goes.
 * A change of mood turns the eyes from where they are into the new act, never swaps
 * them. They are drawn only when they change, and only while Zel is on screen: the
 * face is SVG, which repaints whenever anything in it moves. With reduced motion they
 * hold each mood's still pose. Each new `cue` makes them play the mood's own gesture
 * at once, as when the reader pokes Zel.
 */
export function useZelEyes(root: RefObject<HTMLDivElement | null>, mood: Mood, enabled: boolean, cue = 0) {
  // The eyes as last drawn, to turn from when the mood changes.
  const drawn = useRef<[DrawnEye, DrawnEye] | null>(null);
  const played = useRef(cue);
  useEffect(() => {
    const node = root.current;
    const still = eyeFrame(mood, 0);
    if (!enabled || !node || !still) return;
    const eyes = [0, 1].map((i) => ({
      glaze: node.querySelector<SVGPathElement>(`[data-zel-eye="${i}"]`),
      ivory: node.querySelector<SVGPathElement>(`[data-zel-eye-ivory="${i}"]`),
    }));
    const write = (pair: [DrawnEye, DrawnEye]) => {
      pair.forEach((eye, i) => {
        const d = eyePath(eye.points);
        eyes[i].glaze?.setAttribute("d", d);
        eyes[i].ivory?.setAttribute("d", d);
        eyes[i].ivory?.setAttribute("opacity", eye.flat.toFixed(3));
      });
      drawn.current = pair;
    };
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      write(still.draw());
      return;
    }
    const from = drawn.current;
    const story = !!node.closest(".tile-scroll");
    const agent = mood === "curious" && story;
    // The agent's body and errands are CSS animations, which the browser runs off the
    // main thread; its eyes read their clock, so they never drift apart. Entering the
    // part or poking it starts the loop in the middle of the stage, about to set off, and
    // every animation is set to the same time, so their offsets hold.
    const errands = agent ? node.closest(".story-arrival")?.querySelector<HTMLElement>("[data-agent-errands]") : null;
    let watch: Animation | undefined;
    const ring = () => {
      watch = node.getAnimations().find((animation) => "animationName" in animation && animation.animationName === "agent-body");
      if (!watch) return;
      for (const animation of [watch, ...(errands?.getAnimations({ subtree: true }) ?? [])]) animation.currentTime = AGENT_ERRANDS.lead * 1000;
    };
    // A new story part starts at its gesture, as a poke does, rather than waiting
    // through the idle portion of the loop (several seconds for harness and chat).
    const lead = story || cue !== played.current ? eyeCue(mood) : 0;
    played.current = cue;
    let frame = 0, visible = false, previous = 0, seconds = 0, lastKey = "";
    const tick = (now: number) => {
      if (previous) seconds += (now - previous) / 1000;
      previous = now;
      const turn = from ? ramp(seconds, 0, TURN) : 1;
      if (agent && !watch) ring();
      const clock = watch?.currentTime;
      const next = eyeFrame(mood, typeof clock === "number" ? clock / 1000 : seconds + lead);
      const key = `${turn.toFixed(3)}${next?.key}`;
      if (next && key !== lastKey) {
        lastKey = key;
        const pair = next.draw();
        write(from && turn < 1 ? [mixEyes(from[0], pair[0], turn), mixEyes(from[1], pair[1], turn)] : pair);
      }
      frame = requestAnimationFrame(tick);
    };
    const sync = () => {
      cancelAnimationFrame(frame);
      previous = 0;
      frame = visible && !document.hidden ? requestAnimationFrame(tick) : 0;
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
    observer.observe(node);
    document.addEventListener("visibilitychange", sync);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, [root, mood, enabled, cue]);
}
