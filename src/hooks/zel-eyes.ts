import { useEffect, useRef, type RefObject } from "react";
import type { Mood } from "@/components/ZelFace";
import { agentAttention, eyeCue, eyeFrame, eyePath, mixEyes, type DrawnEye } from "@/components/zel-eye-shapes";
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
    const agent = mood === "curious" && !!node.closest(".tile-scroll");
    const note = agent ? node.closest(".story-arrival")?.querySelector<HTMLElement>("[data-agent-note]") : null;
    // A cue not yet played starts the act at its gesture; otherwise at the still pose.
    const lead = cue === played.current ? 0 : eyeCue(mood);
    played.current = cue;
    let frame = 0, visible = false, previous = 0, seconds = 0, lastKey = "", lastPose = "";
    const tick = (now: number) => {
      if (previous) seconds += (now - previous) / 1000;
      previous = now;
      const turn = from ? ramp(seconds, 0, TURN) : 1;
      const next = eyeFrame(mood, seconds + lead);
      if (agent) {
        const { notice, nod } = agentAttention(seconds + lead);
        const pose = `${notice.toFixed(3)}/${nod.toFixed(3)}`;
        if (pose !== lastPose) {
          lastPose = pose;
          // Move the face and crown together; moving just the ivory image opens
          // the seam. The other wrappers own arrival, separation and pointer lift.
          node.style.setProperty("transform", `perspective(700px) translate(${(2 * notice).toFixed(3)}%, ${(-2.5 * notice + 1.8 * nod).toFixed(3)}%) rotateY(${(-8 * notice).toFixed(3)}deg) rotateZ(${(5 * notice - 2.5 * nod).toFixed(3)}deg)`);
          note?.style.setProperty("translate", `0 ${(-4 * notice).toFixed(2)}px`);
          note?.style.setProperty("scale", (1 + .035 * notice).toFixed(3));
        }
      }
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
      if (agent) {
        node.style.removeProperty("transform");
        note?.style.removeProperty("translate");
        note?.style.removeProperty("scale");
      }
    };
  }, [root, mood, enabled, cue]);
}
