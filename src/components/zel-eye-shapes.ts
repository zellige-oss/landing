/*
 * Zel's eye geometry, shared by the face (ZelFace.tsx) and the hero's motion
 * (hooks/zel-motion.ts). Coordinates are the face's: eyes at x 521 / 723, y 622.
 */
import { bump, clamp, hold } from "@/lib/easing";
import type { Mood } from "./ZelFace";

export const EYE_L = 521;
export const EYE_R = 723;
export const EYE_Y = 622;
/** The open eye's half-width and half-height. */
export const EYE_RX = 30;
export const EYE_RY = 40;
/** The happy ∩: a quadratic from (x - 44, y + 22) through (x, y - 44), stroked 24 wide. */
export const HAPPY_HALF_WIDTH = 44;
export const HAPPY_END = 22;
export const HAPPY_PEAK = 44;
export const HAPPY_STROKE = 24;

type Point = [number, number];
// Both outlines run the same way with the same number of points (over the top, round
// the right end, under, round the left end), so one can turn into the other.
const SIDE = 40;
const END = 10;

function eyeOutline(x: number, rx = EYE_RX, ry = EYE_RY): Point[] {
  const gap = .3, points: Point[] = [];
  const run = (a: number, b: number, n: number) => {
    for (let i = 0; i < n; i += 1) {
      const angle = a + (b - a) * i / n;
      points.push([x + rx * Math.cos(angle), EYE_Y + ry * Math.sin(angle)]);
    }
  };
  run(Math.PI + gap, 2 * Math.PI - gap, SIDE);
  run(2 * Math.PI - gap, 2 * Math.PI + gap, END);
  run(2 * Math.PI + gap, 3 * Math.PI - gap, SIDE);
  run(3 * Math.PI - gap, 3 * Math.PI + gap, END);
  return points;
}

/** A barely sloping upper lid: mildly unimpressed, with plenty of the eye still open. */
function dryOutline(x: number): Point[] {
  const inward = x < (EYE_L + EYE_R) / 2 ? 1 : -1;
  return eyeOutline(x).map(([px, py]) => [px, Math.max(py, EYE_Y - 12 + inward * (px - x) * 8 / (2 * EYE_RX))]);
}

/** A four-point spark, like the ones over the wordmark, on the eye's own points so a bead can turn into it. */
function sparkOutline(x: number): Point[] {
  const tip = 46, waist = .36 * tip * Math.SQRT1_2;
  // Along the straight edge from a tip to the next waist, at angle `a` from the tip.
  const reach = (a: number) => (tip * waist) / (Math.cos(a) * waist - Math.sin(a) * (waist - tip));
  return eyeOutline(x).map(([px, py]) => {
    const angle = Math.atan2((py - EYE_Y) / EYE_RY, (px - x) / EYE_RX);
    const fold = Math.abs(((angle % (Math.PI / 2)) + Math.PI / 2) % (Math.PI / 2));
    const r = reach(Math.min(fold, Math.PI / 2 - fold));
    return [x + r * Math.cos(angle), EYE_Y + r * Math.sin(angle)];
  });
}

/** The outline of a curve from p0 to p2, bent towards c and drawn `width` wide, round caps included. */
function strokeOutline(p0: Point, c: Point, p2: Point, width: number): Point[] {
  const w = width / 2;
  const at = (t: number): Point => [
    (1 - t) ** 2 * p0[0] + 2 * t * (1 - t) * c[0] + t * t * p2[0],
    (1 - t) ** 2 * p0[1] + 2 * t * (1 - t) * c[1] + t * t * p2[1],
  ];
  const tangent = (t: number): Point => {
    const v: Point = [2 * (1 - t) * (c[0] - p0[0]) + 2 * t * (p2[0] - c[0]), 2 * (1 - t) * (c[1] - p0[1]) + 2 * t * (p2[1] - c[1])];
    const length = Math.hypot(v[0], v[1]);
    return [v[0] / length, v[1] / length];
  };
  const normal = (t: number): Point => { const [tx, ty] = tangent(t); return [ty, -tx]; };
  const points: Point[] = [];
  // A half circle round an end, from the side `from` points to, bulging towards `out`.
  const cap = (centre: Point, from: Point, out: Point) => {
    const start = Math.atan2(from[1], from[0]);
    const turn = Math.sin(Math.atan2(out[1], out[0]) - start) > 0 ? 1 : -1;
    for (let i = 0; i < END; i += 1) {
      const angle = start + turn * Math.PI * i / END;
      points.push([centre[0] + w * Math.cos(angle), centre[1] + w * Math.sin(angle)]);
    }
  };
  for (let i = 0; i < SIDE; i += 1) {
    const t = i / SIDE, p = at(t), n = normal(t);
    points.push([p[0] + w * n[0], p[1] + w * n[1]]);
  }
  cap(p2, normal(1), tangent(1));
  for (let i = 0; i < SIDE; i += 1) {
    const t = 1 - i / SIDE, p = at(t), n = normal(t);
    points.push([p[0] - w * n[0], p[1] - w * n[1]]);
  }
  const n0 = normal(0), t0 = tangent(0);
  cap(p0, [-n0[0], -n0[1]], [-t0[0], -t0[1]]);
  return points;
}

/** The outline of the stroked ∩. */
const happyOutline = (x: number) =>
  strokeOutline([x - HAPPY_HALF_WIDTH, EYE_Y + HAPPY_END], [x, EYE_Y - HAPPY_PEAK], [x + HAPPY_HALF_WIDTH, EYE_Y + HAPPY_END], HAPPY_STROKE);

const outlines = new Map<number, { eye: Point[]; happy: Point[] }>();
function shapesFor(x: number) {
  let shapes = outlines.get(x);
  if (!shapes) outlines.set(x, shapes = { eye: eyeOutline(x), happy: happyOutline(x) });
  return shapes;
}

/** The greeting lasts this long, in seconds; outside it the eyes are the plain open eyes. */
export const GREETING_EYES = 2;

/*
 * The eyes during a greeting, t seconds in: they open a little wider as Zel notices
 * you, then turn into the happy ∩ (glaze giving way to flat ivory), which stretches
 * up and settles; at the end they turn back. At 0 and at GREETING_EYES the shape is
 * exactly the open eye, so it can stand in for it without a seam.
 */
export function greetingEye(x: number, t: number) {
  const { eye, happy } = shapesFor(x);
  const wide = 1 + .1 * hold(t, 0, .14, .2, .3);
  const happiness = hold(t, .22, .38, 1.72, GREETING_EYES);
  const stretch = 1 + .2 * bump(t, .34, .44, .62);
  const base = EYE_Y + HAPPY_END;
  const d = eye.map(([ex, ey], i) => {
    const wx = x + (ex - x) * wide, wy = EYE_Y + (ey - EYE_Y) * wide;
    const px = wx + (happy[i][0] - wx) * happiness, py = wy + (happy[i][1] - wy) * happiness;
    return `${i ? "L" : "M"}${px.toFixed(1)} ${(base + (py - base) * stretch).toFixed(1)}`;
  }).join("") + "Z";
  return { d, ivory: happiness };
}

/*
 * The eyes of the story's Zel (hooks/zel-eyes.ts). Every shape an eye takes there is
 * an outline with the same number of points in the same order, so any one turns into
 * any other: the eyes are one pair that acts, not drawings swapped for one another.
 */
export type EyeShape = "open" | "happy" | "calm" | "narrow" | "shut" | "wink" | "dry" | "spark";
// `flat` is how far the shape is a line of flat ivory rather than a glazed bead.
const SHAPES: Record<EyeShape, { flat: number; outline: (x: number) => Point[] }> = {
  open: { flat: 0, outline: (x) => eyeOutline(x) },
  dry: { flat: 0, outline: dryOutline },
  // ∩, a smile.
  happy: { flat: 1, outline: happyOutline },
  // ∪, closed and at ease.
  calm: { flat: 1, outline: (x) => strokeOutline([x - 42, EYE_Y - 8], [x, EYE_Y + 44], [x + 42, EYE_Y - 8], HAPPY_STROKE) },
  // A level bar: an eye narrowed in thought.
  narrow: { flat: 1, outline: (x) => strokeOutline([x - 40, EYE_Y + 4], [x - 1, EYE_Y + 4], [x + 38, EYE_Y + 4], 22) },
  // A blink: the lid's line, a little below the eye's middle.
  shut: { flat: 1, outline: (x) => strokeOutline([x - 30, EYE_Y + 9], [x, EYE_Y + 15], [x + 30, EYE_Y + 9], 11) },
  // A wink: the same lid as a blink, pressed a little harder, its outer end drawn up by the cheek.
  wink: {
    flat: 1,
    outline: (x) => {
      const inward = x < (EYE_L + EYE_R) / 2 ? 1 : -1;
      return strokeOutline([x - 31, EYE_Y + 9 - 3 * inward], [x, EYE_Y + 17], [x + 31, EYE_Y + 9 + 3 * inward], 13);
    },
  },
  spark: { flat: 0, outline: sparkOutline },
};
const shapeOutlines = new Map<string, Point[]>();
function shapeOutline(x: number, shape: EyeShape) {
  const key = `${shape}${x}`;
  let outline = shapeOutlines.get(key);
  if (!outline) shapeOutlines.set(key, outline = SHAPES[shape].outline(x));
  return outline;
}

/** One eye at a moment: part of the way from one shape to another, a little off its place. */
type Eye = { from: EyeShape; to: EyeShape; mix: number; dx?: number; dy?: number };
const blink = (t: number, at: number) => bump(t, at, at + .09, at + .22);

/** "I'll take care of it": read the reminder, acknowledge it twice, then spring
 *  back into place. Eyes, body and note share one clock, including off-screen pauses. */
export function agentAttention(seconds: number) {
  const t = seconds % 6.8;
  return {
    notice: hold(t, .08, .32, .5, .85),
    scan: hold(t, .32, .42, .5, .6),
    nod: bump(t, .6, .8, 1.02) + .7 * bump(t, 1.02, 1.22, 1.44),
    hop: bump(t, 1.44, 1.66, 2.1),
  };
}

/*
 * What the eyes do in each mood, t seconds into a loop `period` long. At 0 they hold
 * the mood's still pose, the one its image shows (scripts/build-brand.mjs), so the
 * page reads the same before the eyes start to act. `cue` is where the mood's own
 * gesture begins: the look and the smile, the narrowing to focus, the wink.
 */
const ACTS: Partial<Record<Mood, { period: number; cue?: number; eyes: (t: number) => [Eye, Eye] }>> = {
  look: {
    period: 5,
    eyes: (t) => {
      const eye: Eye = { from: "open", to: "shut", mix: blink(t, 3.1) };
      return [eye, eye];
    },
  },
  // The ivory character smiles; now and then it opens its eyes to look at you, and smiles again.
  hello: {
    period: 6.4,
    cue: 3.4,
    eyes: (t) => {
      const eye: Eye = { from: "happy", to: "open", mix: hold(t, 3.4, 3.62, 4.7, 4.95), dy: -6 * bump(t, 4.9, 5.02, 5.3) };
      return [eye, eye];
    },
  },
  // Read the note and give an emphatic "got it", keeping the curious eyes open.
  curious: {
    period: 6.8,
    cue: .12,
    eyes: (t) => {
      const { notice, scan, nod, hop } = agentAttention(t);
      const eye: Eye = { from: "open", to: "shut", mix: blink(t, 4.6), dx: 18 * notice - 7 * scan, dy: -14 * notice + 9 * nod - 5 * hop };
      return [eye, { ...eye, dy: -7 - 10 * notice + 7 * nod - 5 * hop }];
    },
  },
  // A mildly annoyed, dry look and a sideways glance. Finishing the build still
  // earns a small spark; the low lid's slight slope avoids an angry scowl.
  determined: {
    period: 7.6,
    cue: 4.9,
    eyes: (t) => {
      const proud = hold(t, 5.3, 5.48, 6.3, 6.6);
      const eye: Eye = proud > 0
        ? { from: "dry", to: "spark", mix: proud, dy: -5 * bump(t, 5.42, 5.56, 5.85) }
        : { from: "dry", to: "shut", mix: blink(t, 3.4), dx: 7 * hold(t, 1.2, 1.5, 2.6, 2.9) };
      return [eye, eye];
    },
  },
  // Working something out: one eye narrowed, the other raised. It glances over,
  // blinks, and at times narrows both to focus.
  thinking: {
    period: 7.2,
    cue: 4.6,
    eyes: (t) => {
      const focus = hold(t, 4.6, 4.85, 5.9, 6.15);
      const glance = 7 * hold(t, 1.2, 1.5, 2.6, 2.9);
      const raised = 1 - focus;
      const right: Eye = focus > 0
        ? { from: "open", to: "narrow", mix: focus, dx: 14 * raised + glance, dy: -22 * raised }
        : { from: "open", to: "shut", mix: blink(t, 3.4), dx: 14 + glance, dy: -22 };
      return [{ from: "narrow", to: "narrow", mix: 0, dx: glance }, right];
    },
  },
  // The green character pays attention: eyes open, blinking like anyone's. Now and then it winks,
  // as quick as a real one: one lid drops and comes back while the other eye lifts a
  // touch. The cue leads the wink by the time the eyes take to turn (hooks/zel-eyes.ts).
  wink: {
    period: 6,
    cue: 3.28,
    eyes: (t) => {
      const shut = blink(t, 1.6);
      const wink = hold(t, 3.6, 3.69, 3.97, 4.1);
      return [
        wink > 0 ? { from: "open", to: "wink", mix: wink } : { from: "open", to: "shut", mix: shut },
        { from: "open", to: "shut", mix: shut, dy: -5 * wink },
      ];
    },
  },
  content: {
    period: 5,
    eyes: () => {
      const eye: Eye = { from: "calm", to: "calm", mix: 0 };
      return [eye, eye];
    },
  },
};

/** An eye as drawn: its outline, and how far it is flat ivory rather than glaze. */
export type DrawnEye = { points: Point[]; flat: number };
function drawEye(x: number, { from, to, mix, dx = 0, dy = 0 }: Eye): DrawnEye {
  const a = shapeOutline(x, from), b = shapeOutline(x, to), k = clamp(mix);
  return {
    points: a.map(([ax, ay], i) => [ax + (b[i][0] - ax) * k + dx, ay + (b[i][1] - ay) * k + dy]),
    flat: SHAPES[from].flat + (SHAPES[to].flat - SHAPES[from].flat) * k,
  };
}
const eyeKey = ({ from, to, mix, dx = 0, dy = 0 }: Eye) => `${from}${to}${clamp(mix).toFixed(3)}/${dx.toFixed(1)}/${dy.toFixed(1)}`;

/** Where in a mood's act its signature gesture begins (`cue` above), to play it on demand. */
export const eyeCue = (mood: Mood) => ACTS[mood]?.cue ?? 0;
/** Whether the story's eyes act in this mood; in the others they are the still drawing. */
export const hasEyeAct = (mood: Mood) => mood in ACTS;
/**
 * The eyes of a mood `seconds` into its act: a key that changes only when they do, so
 * a still stretch costs nothing to draw, and the pair itself.
 */
export function eyeFrame(mood: Mood, seconds: number) {
  const act = ACTS[mood];
  if (!act) return undefined;
  const [left, right] = act.eyes(seconds % act.period);
  return { key: eyeKey(left) + eyeKey(right), draw: (): [DrawnEye, DrawnEye] => [drawEye(EYE_L, left), drawEye(EYE_R, right)] };
}
/** An eye part of the way from one drawn eye to another. */
export const mixEyes = (a: DrawnEye, b: DrawnEye, k: number): DrawnEye => ({
  points: a.points.map(([ax, ay], i) => [ax + (b.points[i][0] - ax) * k, ay + (b.points[i][1] - ay) * k]),
  flat: a.flat + (b.flat - a.flat) * k,
});
export const eyePath = (points: Point[]) => points.map(([px, py], i) => `${i ? "L" : "M"}${px.toFixed(1)} ${py.toFixed(1)}`).join("") + "Z";
