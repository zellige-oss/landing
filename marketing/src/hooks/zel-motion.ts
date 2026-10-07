import { useEffect, type RefObject } from "react";

const clamp = (n: number) => Math.max(0, Math.min(1, n));
const ease = (n: number) => { const t = clamp(n); return t * t * (3 - 2 * t); };
const ramp = (t: number, a: number, b: number) => ease((t - a) / (b - a));
const bump = (t: number, a: number, m: number, b: number) => t < m ? ramp(t, a, m) : 1 - ramp(t, m, b);
const hold = (t: number, a: number, b: number, c: number, d: number) => ramp(t, a, b) * (1 - ramp(t, c, d));

function reaction(t: number) {
  return {
    anticipation: bump(t, 0, .2, .4),
    hop: bump(t, .22, .54, 1.06),
    happy: hold(t, .38, .56, 1.69, 2.1),
    spread: t > .26 && t < 1.66 ? Math.sin(Math.PI * (t - .26) / 1.4) : 0,
  };
}

// Waking up, over the first WAKE seconds, told in beats: asleep; the eyes crack open
// looking down while Zel stretches (tiles rise and part); a nod-off, eyes sagging shut
// as the body drops and the tiles hang in; a jolt awake, eyes wide, a hop and the
// tiles popping out; a head shake to shake off sleep; one blink, awake.
const WAKE = 2.7;
// [seconds, eye openness]; above 1 is wide open.
const eyelids: [number, number][] = [[0, .09], [.3, .09], [.8, .42], [1, .38], [1.35, .1], [1.52, .1], [1.64, 1.24], [1.85, 1], [2.36, 1], [2.43, .12], [2.53, 1]];
function wake(t: number) {
  let open = 1;
  for (let i = 1; i < eyelids.length; i += 1) {
    const [a, from] = eyelids[i - 1], [b, to] = eyelids[i];
    if (t < b) { open = from + (to - from) * ramp(t, a, b); break; }
  }
  const shaking = t > 1.85 && t < 2.45 ? Math.sin(2 * Math.PI * (t - 1.85) / .3) * (1 - (t - 1.85) / .6) : 0;
  return {
    open,
    drowsy: 1 - ramp(t, 1.5, 1.66),
    stretch: bump(t, .3, .8, 1.15),
    nod: bump(t, 1, 1.32, 1.56),
    jolt: bump(t, 1.54, 1.72, 2.02),
    shake: shaking,
  };
}

const pieces = [
  { name: "points", delay: .1, spread: .03 },
  { name: "cobalt", delay: .065, spread: .022 },
  { name: "crown", delay: .035, spread: .013 },
  { name: "centre", delay: 0, spread: 0 },
];

/** The approved motion study, with a quiet idle and a greeting on hover or tap.
 * Updates CSS variables directly: animation frames never re-render React.
 * Outer layer wrappers remain available to the intro and scroll animations.
 */
export function useZelMotion(root: RefObject<HTMLDivElement | null>, enabled: boolean, delay: number) {
  useEffect(() => {
    const node = root.current;
    if (!enabled || !node) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const parts = pieces.map(piece => ({
      ...piece,
      nodes: [...node.querySelectorAll<HTMLElement>(`[data-zel-motion="${piece.name}"]`)],
      tilt: 0,
    }));
    let frame = 0, previous = 0, elapsed = -delay / 1000;
    let visible = false, greeted = false, greetingAt = -Infinity;
    let pointerAt = -Infinity, pointerX = 0, pointerY = 0, gazeX = 0, gazeY = 0;

    function reset() {
      delete node!.dataset.zelAwake;
      for (const prop of ["--look-x", "--look-y", "--zel-happy", "--zel-eye-open"]) node!.style.removeProperty(prop);
      for (const part of parts) {
        part.tilt = 0;
        for (const element of part.nodes) {
          for (const prop of ["--zel-turn", "--zel-rise", "--zel-spread"]) element.style.removeProperty(prop);
        }
      }
      gazeX = 0;
      gazeY = 0;
    }

    function tick(now: number) {
      const dt = previous ? (now - previous) / 1000 : 0;
      previous = now;
      elapsed += dt;
      if (elapsed >= 0) {
        node!.dataset.zelAwake = "";
        // One welcome after waking; later greetings respond to the reader.
        if (!greeted && elapsed >= WAKE + .5) { greeted = true; greetingAt = elapsed; }
        const waking = wake(elapsed);
        const awake = elapsed >= WAKE;
        const phase = awake ? (elapsed - WAKE) % 14 : 0;
        const idleGaze = awake ? -hold(phase, 1.4, 1.7, 2.05, 2.4) + .8 * hold(phase, 2.25, 2.55, 2.85, 3.2) : 0;
        const attention = awake ? 1 - ramp(elapsed - pointerAt, 1.6, 2.4) : 0;
        const targetX = idleGaze * (1 - attention) + pointerX * attention;
        const targetY = pointerY * attention + .55 * waking.drowsy;
        const eyeEase = 1 - Math.exp(-dt / .07);
        gazeX += (targetX - gazeX) * eyeEase;
        gazeY += (targetY - gazeY) * eyeEase;
        const blink = awake ? Math.max(bump(phase, 3.28, 3.355, 3.48),
          bump(phase, 3.52, 3.59, 3.72), bump(phase, 8.02, 8.1, 8.25), bump(phase, 11.35, 11.43, 11.58)) : 0;
        const age = elapsed - greetingAt;
        node!.style.setProperty("--look-x", `${(gazeX * 22).toFixed(2)}px`);
        node!.style.setProperty("--look-y", `${(gazeY * 14 - Math.abs(gazeX) * 4).toFixed(2)}px`);
        node!.style.setProperty("--zel-eye-open", Math.max(.09, (awake ? 1 : waking.open) - blink).toFixed(3));
        node!.style.setProperty("--zel-happy", reaction(age).happy.toFixed(3));
        const breath = Math.sin(elapsed / 6.4 * Math.PI * 4);
        for (const part of parts) {
          const pose = reaction(age - part.delay);
          // Eyes lead, then the centre, then the outer pieces. Tiles stay rigid.
          part.tilt += (gazeX * 3.2 - part.tilt) * (1 - Math.exp(-dt / (.13 + part.delay)));
          const turn = part.tilt - pose.anticipation * 2.4 + pose.hop * 2;
          // While waking, each layer follows the centre a little later than when awake.
          const w = awake ? null : wake(elapsed - part.delay * 2.5);
          const wakeTurn = w ? 6 * w.shake - 4 * w.nod : 0;
          const wakeRise = w ? -10 * w.stretch + 14 * w.nod - 22 * w.jolt : 0;
          const wakeSpread = w ? 2 * w.stretch - 1.2 * w.nod + 2.6 * w.jolt : 0;
          const rise = (-1.7 * breath + 3.5 * pose.anticipation - 16 * pose.hop + wakeRise) / 470 * 100;
          for (const element of part.nodes) {
            element.style.setProperty("--zel-turn", `${(turn + wakeTurn).toFixed(3)}deg`);
            element.style.setProperty("--zel-rise", `${rise.toFixed(3)}%`);
            element.style.setProperty("--zel-spread", (1 + (pose.spread + wakeSpread) * part.spread).toFixed(4));
          }
        }
      }
      frame = requestAnimationFrame(tick);
    }

    function sync() {
      cancelAnimationFrame(frame);
      frame = 0;
      previous = 0;
      if (reduced.matches) reset();
      else if (visible && !document.hidden) frame = requestAnimationFrame(tick);
    }
    function look(event: PointerEvent) {
      if (!visible || reduced.matches || elapsed < 0 || event.pointerType === "touch") return;
      const rect = node!.getBoundingClientRect();
      pointerX = Math.max(-1, Math.min(1, (event.clientX - rect.left - rect.width / 2) / 300));
      pointerY = Math.max(-1, Math.min(1, (event.clientY - rect.top - rect.height / 2) / 300));
      pointerAt = elapsed;
    }
    function greet(event: PointerEvent) {
      if (event.type === "pointerenter" && event.pointerType === "touch") return;
      if (!visible || reduced.matches || elapsed < 0 || elapsed - greetingAt < 2.8) return;
      greeted = true;
      greetingAt = elapsed;
    }
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
    observer.observe(node);
    document.addEventListener("visibilitychange", sync);
    reduced.addEventListener("change", sync);
    window.addEventListener("pointermove", look, { passive: true });
    node.addEventListener("pointerenter", greet, { passive: true });
    node.addEventListener("pointerdown", greet, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      reduced.removeEventListener("change", sync);
      window.removeEventListener("pointermove", look);
      node.removeEventListener("pointerenter", greet);
      node.removeEventListener("pointerdown", greet);
      reset();
    };
  }, [root, enabled, delay]);
}
