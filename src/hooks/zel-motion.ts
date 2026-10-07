import { useEffect, type RefObject } from "react";
import { GREETING_EYES, greetingEye } from "@/components/zel-eye-shapes";
import { clamp, ramp, bump, hold } from "@/lib/easing";

// The greeting, t seconds after it starts. The eyes' part (widen, then turn into the
// happy ∩ and back) is drawn by greetingEye in zel-eye-shapes.ts.
// Overshoots to about 1.1 before settling at 1.
const backOut = (n: number) => { const t = clamp(n) - 1; return 1 + t * t * (2.7 * t + 1.7); };

function reaction(t: number) {
  return {
    anticipation: bump(t, 0, .2, .4),
    hop: bump(t, .22, .54, 1.06),
    // How much of the spin is still to come: all of it as the greeting starts (the
    // layer jumps back by its symmetry angle, which looks identical), none after.
    unspun: t < 0 ? 0 : 1 - backOut((t - .16) / .55),
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

// spin: Zel's signature, in the greeting each layer turns by its own symmetry (the
// crown is eight-fold, the blue and the points four-fold) and clicks back into
// place, alternating directions like a combination lock; the face stays upright.
const pieces = [
  { name: "points", delay: .1, spread: .03, spin: 90 },
  { name: "cobalt", delay: .065, spread: .022, spin: -90 },
  { name: "crown", delay: .035, spread: .013, spin: 45 },
  { name: "centre", delay: 0, spread: 0, spin: 0 },
];

/** The approved motion study, with a quiet idle and a greeting on hover or tap.
 * Animation frames never re-render React. Each value is written straight onto the
 * element that uses it (a piece, a lid, a pair of eyes), never as a variable on an
 * ancestor: that would make the browser restyle the whole of Zel every frame, which
 * phones cannot keep up with. Outer layer wrappers remain available to the intro
 * and scroll animations.
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
    const looks = [...node.querySelectorAll<SVGGElement>(".companion-look")];
    // Each lid's travel comes from its eye size class (.lid-40, ...) in styles.css.
    const lids = [...node.querySelectorAll<SVGGElement>(".companion-lid, .companion-lid-lower")].map((lid) => {
      const upper = lid.classList.contains("companion-lid");
      const travel = parseFloat(getComputedStyle(lid).getPropertyValue(upper ? "--lid-travel" : "--lid-rise")) || 0;
      return { lid, travel: upper ? travel : -travel };
    });
    const attentiveEyes = node.querySelector<SVGGElement>(".zel-attentive-eyes");
    const drawnEyes = node.querySelector<SVGGElement>(".zel-greeting-eyes");
    const greetingEyes = [...node.querySelectorAll<SVGPathElement>("[data-zel-greeting-eye]")].map((eye) => ({
      x: Number(eye.dataset.zelGreetingEye),
      eye,
      ivory: node.querySelector<SVGPathElement>(`[data-zel-greeting-ivory="${eye.dataset.zelGreetingEye}"]`),
    }));
    let frame = 0, previous = 0, elapsed = -delay / 1000;
    let visible = false, greeted = false, greetingAt = -Infinity;
    let pointerAt = -Infinity, pointerX = 0, pointerY = 0, gazeX = 0, gazeY = 0;
    let drawing: boolean | undefined;
    // The face is SVG, which repaints whenever anything in it moves: write the gaze
    // and the lids only when they change (still eyes then cost nothing).
    let lastLook = "", lastShut = "";

    function showDrawnEyes(on: boolean) {
      if (on === drawing) return;
      drawing = on;
      attentiveEyes?.style.setProperty("opacity", on ? "0" : "1");
      drawnEyes?.style.setProperty("opacity", on ? "1" : "0");
    }

    function reset() {
      delete node!.dataset.zelAwake;
      for (const look of looks) look.style.removeProperty("translate");
      for (const { lid } of lids) lid.style.removeProperty("translate");
      attentiveEyes?.style.removeProperty("opacity");
      drawnEyes?.style.removeProperty("opacity");
      drawing = undefined;
      lastLook = lastShut = "";
      for (const part of parts) {
        part.tilt = 0;
        for (const element of part.nodes) element.style.removeProperty("transform");
      }
      gazeX = 0;
      gazeY = 0;
    }

    function tick(now: number) {
      const dt = previous ? (now - previous) / 1000 : 0;
      previous = now;
      elapsed += dt;
      if (elapsed >= 0) {
        if (!("zelAwake" in node!.dataset)) node!.dataset.zelAwake = "";
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
        const look = `${(gazeX * 22).toFixed(2)}px ${(gazeY * 14 - Math.abs(gazeX) * 4).toFixed(2)}px`;
        if (look !== lastLook) {
          lastLook = look;
          for (const element of looks) element.style.setProperty("translate", look);
        }
        // Lids: 0.09 open is shut; they meet at the crease.
        const open = Math.max(.09, (awake ? 1 : waking.open) - blink);
        const shut = clamp((1 - open) / .91).toFixed(3);
        if (shut !== lastShut) {
          lastShut = shut;
          for (const { lid, travel } of lids) lid.style.setProperty("translate", `0 ${(Number(shut) * travel).toFixed(2)}px`);
        }
        // During a greeting the drawn eyes stand in for the open ones; they start and
        // end as exactly the open eye, so the swap has no seam.
        const greeting = age >= 0 && age < GREETING_EYES;
        showDrawnEyes(greeting);
        if (greeting) {
          for (const { x, eye, ivory } of greetingEyes) {
            const shape = greetingEye(x, age);
            eye.setAttribute("d", shape.d);
            ivory?.setAttribute("d", shape.d);
            ivory?.setAttribute("opacity", shape.ivory.toFixed(3));
          }
        }
        const breath = Math.sin(elapsed / 6.4 * Math.PI * 4);
        for (const part of parts) {
          const pose = reaction(age - part.delay);
          // Eyes lead, then the centre, then the outer pieces. Tiles stay rigid.
          part.tilt += (gazeX * 3.2 - part.tilt) * (1 - Math.exp(-dt / (.13 + part.delay)));
          const turn = part.tilt - pose.anticipation * 2.4 + pose.hop * 2 - part.spin * pose.unspun;
          // While waking, each layer follows the centre a little later than when awake.
          const w = awake ? null : wake(elapsed - part.delay * 2.5);
          const wakeTurn = w ? 6 * w.shake - 4 * w.nod : 0;
          const wakeRise = w ? -10 * w.stretch + 14 * w.nod - 22 * w.jolt : 0;
          const wakeSpread = w ? 2 * w.stretch - 1.2 * w.nod + 2.6 * w.jolt : 0;
          const rise = (-1.7 * breath + 3.5 * pose.anticipation - 16 * pose.hop + wakeRise) / 470 * 100;
          const transform = `translateY(${rise.toFixed(3)}%) rotate(${(turn + wakeTurn).toFixed(3)}deg) scale(${(1 + (pose.spread + wakeSpread) * part.spread).toFixed(4)})`;
          for (const element of part.nodes) element.style.setProperty("transform", transform);
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
