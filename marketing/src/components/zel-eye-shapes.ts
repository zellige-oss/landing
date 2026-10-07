/*
 * Zel's eye geometry, shared by the face (ZelFace.tsx) and the hero's motion
 * (hooks/zel-motion.ts). Coordinates are the face's: eyes at x 521 / 723, y 622.
 */
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

const clamp = (n: number) => Math.max(0, Math.min(1, n));
const ease = (n: number) => { const t = clamp(n); return t * t * (3 - 2 * t); };
const ramp = (t: number, a: number, b: number) => ease((t - a) / (b - a));
const bump = (t: number, a: number, m: number, b: number) => t < m ? ramp(t, a, m) : 1 - ramp(t, m, b);
const hold = (t: number, a: number, b: number, c: number, d: number) => ramp(t, a, b) * (1 - ramp(t, c, d));

type Point = [number, number];
// Both outlines run the same way with the same number of points (over the top, round
// the right end, under, round the left end), so one can turn into the other.
const SIDE = 40;
const END = 10;

function eyeOutline(x: number): Point[] {
  const gap = .3, points: Point[] = [];
  const run = (a: number, b: number, n: number) => {
    for (let i = 0; i < n; i += 1) {
      const angle = a + (b - a) * i / n;
      points.push([x + EYE_RX * Math.cos(angle), EYE_Y + EYE_RY * Math.sin(angle)]);
    }
  };
  run(Math.PI + gap, 2 * Math.PI - gap, SIDE);
  run(2 * Math.PI - gap, 2 * Math.PI + gap, END);
  run(2 * Math.PI + gap, 3 * Math.PI - gap, SIDE);
  run(3 * Math.PI - gap, 3 * Math.PI + gap, END);
  return points;
}

/** The outline of the stroked ∩, round caps included. */
function happyOutline(x: number): Point[] {
  const p0: Point = [x - HAPPY_HALF_WIDTH, EYE_Y + HAPPY_END];
  const c: Point = [x, EYE_Y - HAPPY_PEAK];
  const p2: Point = [x + HAPPY_HALF_WIDTH, EYE_Y + HAPPY_END];
  const w = HAPPY_STROKE / 2;
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
