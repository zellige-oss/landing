// The emblem's gold rim, so scripts can paint new rims that match the drawn ones.

export const RIM = 16;

// Rim cross-sections from the emblem's own rims, outer edge first, one per facing.
export function rimProfiles(data, width) {
  const section = (x, y, dx, dy) => Array.from({ length: RIM }, (_, i) => {
    const k = ((y + dy * i) * width + x + dx * i) * 4;
    return [data[k], data[k + 1], data[k + 2]];
  });
  return {
    left: section(454, 400, 1, 0), // the top point's left side
    right: section(797, 400, -1, 0), // the top point's right side
    top: section(330, 481, 0, 1), // the upper-left kite's top side
    bottom: section(330, 803, 0, -1), // the lower-left kite's bottom side
  };
}

// The rim's colour `t` px in from its outer edge, blending the facings by `weights`.
export function rimColour(profiles, t, weights) {
  const at = (profile, c) => {
    const i = Math.min(RIM - 1, Math.floor(t)), f = Math.min(1, t - i);
    return profile[i][c] * (1 - f) + profile[Math.min(RIM - 1, i + 1)][c] * f;
  };
  const total = Object.values(weights).reduce((a, b) => a + b, 0);
  return [0, 1, 2].map((c) => {
    let v = 0;
    for (const [side, w] of Object.entries(weights)) v += at(profiles[side], c) * w;
    return Math.round(v / total);
  });
}

// Facing weights for an outward normal (nx, ny): each side by its squared share.
export function facing(nx, ny) {
  return { left: Math.max(0, -nx) ** 2, right: Math.max(0, nx) ** 2, top: Math.max(0, -ny) ** 2, bottom: Math.max(0, ny) ** 2 };
}
