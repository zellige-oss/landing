// Easing helpers for Zel's motion: t is time, the other arguments are the beats.
export const clamp = (n: number) => Math.max(0, Math.min(1, n));
export const ease = (n: number) => { const t = clamp(n); return t * t * (3 - 2 * t); };
/** Eases from 0 at a to 1 at b. */
export const ramp = (t: number, a: number, b: number) => ease((t - a) / (b - a));
/** Rises from a to its peak at m, back down by b. */
export const bump = (t: number, a: number, m: number, b: number) => t < m ? ramp(t, a, m) : 1 - ramp(t, m, b);
/** Rises from a to b, holds, falls from c to d. */
export const hold = (t: number, a: number, b: number, c: number, d: number) => ramp(t, a, b) * (1 - ramp(t, c, d));
