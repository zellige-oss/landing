// Corrections of the standard emblem, re-applied from the untouched original:
// 1. Its top point was glazed cobalt while the other three points are teal, which
//    breaks the emblem's four-fold symmetry. Recolours that piece's glaze to match
//    the teal points (per-channel colour transfer, so its own shading and texture
//    are kept); gold rims are untouched.
// 2. The four cobalt corner squares had no gold rim on their outer sides, unlike
//    every other piece. Frames those sides with a rim copied from the emblem's own
//    rims (one cross-section per lighting direction, blended by the edge's facing).
// The original is kept at openspec/design/proposals/zellige-emblem-original.png.
import { copyFile, access } from 'node:fs/promises';
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { distanceTo, fillHoles, grow } from './mask.mjs';
import { RIM, rimColour, rimProfiles } from './rim.mjs';

const emblem = fileURLToPath(new URL('../public/brand/zellige-emblem.png', import.meta.url));
const original = fileURLToPath(new URL('../openspec/design/proposals/zellige-emblem-original.png', import.meta.url));
// Always start from the untouched original, so the script can be re-run safely.
await access(original).catch(() => copyFile(emblem, original));

const { data, info } = await sharp(original).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H } = info;
const N = W * H;
function hsv(k) {
  const i = k * 4, r = data[i], g = data[i + 1], b = data[i + 2];
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
  let h = 0;
  if (d) h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [(h * 60 + 360) % 360, max ? d / max : 0];
}
const cobalt = (k) => { const [h, s] = hsv(k); return data[k * 4 + 3] > 40 && h >= 200 && h <= 250 && s > 0.3; };
const teal = (k) => { const [h, s] = hsv(k); return data[k * 4 + 3] > 40 && h >= 160 && h < 200 && s > 0.25; };

// The top point: cobalt connected to its middle, bridging thin crackle lines.
const top = new Uint8Array(N);
const stack = [Math.round(H * 0.17) * W + (W >> 1)];
if (!cobalt(stack[0])) throw new Error('Seed is not on the cobalt top point');
while (stack.length) {
  const k = stack.pop();
  if (top[k]) continue;
  top[k] = 1;
  const x = k % W, y = (k - x) / W;
  for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
    for (let step = 1; step <= 5; step += 1) {
      const nx = x + dx * step, ny = y + dy * step;
      if (nx < 0 || ny < 0 || nx >= W || ny >= H) break;
      const n = ny * W + nx;
      if (cobalt(n)) { if (!top[n]) stack.push(n); break; }
    }
  }
}

// Reference glaze: the three teal points (teal outside the central star's disc).
const stats = (select) => {
  const sum = [0, 0, 0], sq = [0, 0, 0];
  let n = 0;
  for (let k = 0; k < N; k += 1) {
    if (!select(k)) continue;
    n += 1;
    for (let c = 0; c < 3; c += 1) { const v = data[k * 4 + c]; sum[c] += v; sq[c] += v * v; }
  }
  const mean = sum.map((s) => s / n);
  return { n, mean, std: sq.map((s, c) => Math.sqrt(s / n - mean[c] ** 2)) };
};
const from = stats((k) => top[k]);
const to = stats((k) => {
  const x = k % W, y = (k - x) / W;
  return teal(k) && Math.hypot(x - W / 2, y - H / 2) > W * 0.27;
});

const fixed = Buffer.from(data);
for (let k = 0; k < N; k += 1) {
  if (!top[k]) continue;
  for (let c = 0; c < 3; c += 1) {
    const v = (data[k * 4 + c] - from.mean[c]) / (from.std[c] || 1) * to.std[c] + to.mean[c];
    fixed[k * 4 + c] = Math.max(0, Math.min(255, Math.round(v)));
  }
}

// 2. Gold rims for the cobalt squares. Mask each square (cobalt connected to its
// middle, bridging crackle lines), then fill crackle notches and holes.
const fill = (seed, accept) => {
  const mask = new Uint8Array(N);
  const stack = [seed];
  if (!accept(seed)) throw new Error(`Seed ${seed % W},${Math.floor(seed / W)} is not on its piece`);
  while (stack.length) {
    const k = stack.pop();
    if (mask[k]) continue;
    mask[k] = 1;
    const x = k % W, y = (k - x) / W;
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      for (let step = 1; step <= 5; step += 1) {
        const nx = x + dx * step, ny = y + dy * step;
        if (nx < 0 || ny < 0 || nx >= W || ny >= H) break;
        const n = ny * W + nx;
        if (accept(n)) { if (!mask[n]) stack.push(n); break; }
      }
    }
  }
  return mask;
};
const squares = new Uint8Array(N);
for (const [fx, fy] of [[0.28, 0.31], [0.72, 0.31], [0.28, 0.72], [0.72, 0.72]]) {
  const square = fill(Math.round(H * fy) * W + Math.round(W * fx), cobalt);
  const closed = grow(grow(square, W, H, 4).map((v) => 1 - v), W, H, 4).map((v) => 1 - v);
  for (let k = 0; k < N; k += 1) if (closed[k] || square[k]) squares[k] = 1;
}
squares.set(fillHoles(squares, W, H));

// Euclidean distance to the transparent background (Felzenszwalb–Huttenlocher), so
// only the outer sides get a rim; the inner sides already meet their neighbours' rims.
const dist = distanceTo(data.filter((_, i) => i % 4 === 3).map((alpha) => (alpha < 40 ? 1 : 0)), W, H);

const profiles = rimProfiles(data, W);
// Steps from (x, y) to the background along (dx, dy), capped past the rim's width.
const run = (x, y, dx, dy) => {
  let s = 1;
  for (; s <= RIM + 1; s += 1) {
    const px = x + dx * s, py = y + dy * s;
    if (px < 0 || py < 0 || px >= W || py >= H || data[(py * W + px) * 4 + 3] < 40) break;
  }
  return s;
};
let rimmed = 0;
for (let k = 0; k < N; k += 1) {
  if (!squares[k] || data[k * 4 + 3] < 40) continue;
  const x = k % W, y = (k - x) / W;
  // Each square's outer sides face away from the centre. Measuring straight out to
  // those sides only keeps the rim from wrapping into the gaps to its neighbours.
  const sideX = x < W / 2 ? 'left' : 'right', sideY = y < H / 2 ? 'top' : 'bottom';
  const tx = run(x, y, sideX === 'left' ? -1 : 1, 0) - 1, ty = run(x, y, 0, sideY === 'top' ? -1 : 1) - 1;
  if (tx >= RIM && ty >= RIM) continue;
  let t, weights;
  if (tx < RIM && ty < RIM) {
    // Outer corner: follow its rounded outline, down the distance field's gradient.
    t = Math.min(RIM - 1, dist[k] - 1);
    const nx = -(dist[y * W + Math.min(W - 1, x + 2)] - dist[y * W + Math.max(0, x - 2)]);
    const ny = -(dist[Math.min(H - 1, y + 2) * W + x] - dist[Math.max(0, y - 2) * W + x]);
    weights = { [sideX]: Math.abs(nx) ** 2, [sideY]: Math.abs(ny) ** 2 };
    if (!nx && !ny) weights = { [sideY]: 1 };
  } else {
    t = Math.min(tx, ty);
    weights = { [tx < ty ? sideX : sideY]: 1 };
  }
  fixed.set(rimColour(profiles, Math.max(0, t), weights), k * 4);
  rimmed += 1;
}
console.log(`Gilded ${rimmed} px of rim on the four cobalt squares`);

await sharp(fixed, { raw: { width: W, height: H, channels: 4 } }).png().toFile(emblem);
console.log(`Recoloured ${from.n} px of the top point to the teal of ${to.n} px; wrote ${emblem}`);
