// Pixel-mask helpers shared by the emblem scripts. A mask is a Uint8Array of
// width × height entries, 1 inside and 0 outside.

// Dilates the mask by `radius` px (4-connected). Eroding is growing the inverse.
export function grow(mask, width, height, radius) {
  const reach = Uint8Array.from(mask);
  let frontier = [];
  for (let k = 0; k < reach.length; k += 1) if (mask[k]) frontier.push(k);
  for (let step = 0; step < radius; step += 1) {
    const next = [];
    for (const k of frontier) {
      const x = k % width, y = (k - x) / width;
      for (const [nx, ny] of [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]]) {
        if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
        const n = ny * width + nx;
        if (!reach[n]) { reach[n] = 1; next.push(n); }
      }
    }
    frontier = next;
  }
  return reach;
}
