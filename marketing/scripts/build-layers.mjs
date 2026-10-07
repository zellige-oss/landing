// Splits the standard emblem (brand/zellige-emblem.png) into its colour
// layers, so the landing can assemble the logo around Zel layer by layer:
//   centre  — the teal eight-point star in the middle (Zel's face sits on it)
//   crown   — the eight ivory kites around it
//   cobalt  — the four blue corner squares
//   points  — the four outer teal points (see scripts/fix-emblem.mjs)
// Every layer keeps the emblem's own pixels and full canvas, so stacked they
// rebuild the logo exactly. Each piece takes the whole gold rim around it, so it
// reads as a complete tile when the layers separate, and the thin gold crackle
// lines inside pieces are smoothed into the glaze.
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { distanceTo, fillHoles, grow } from './mask.mjs';
import { RIM, facing, rimColour, rimProfiles } from './rim.mjs';

const source = fileURLToPath(new URL('../../brand/zellige-emblem.png', import.meta.url));
const out = (name) => fileURLToPath(new URL(`../src/assets/layer-${name}.webp`, import.meta.url));
const SIZE = 960;

const { data, info } = await sharp(source).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H } = info;
const N = W * H;

function hsv(i) {
  const r = data[i], g = data[i + 1], b = data[i + 2];
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
  let h = 0;
  if (d) h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [(h * 60 + 360) % 360, max ? d / max : 0, max / 255];
}

// 0 none/transparent, 1 cobalt, 2 teal, 3 ivory, 9 gold (rims and crackle)
const kind = new Uint8Array(N);
for (let k = 0; k < N; k += 1) {
  const i = k * 4;
  if (data[i + 3] < 40) continue;
  const [h, s, v] = hsv(i);
  if (s < 0.3 && v > 0.6) kind[k] = 3;
  else if (h >= 200 && h <= 250 && s > 0.3) kind[k] = 1;
  else if (h >= 160 && h < 200 && s > 0.25) kind[k] = 2;
  else kind[k] = 9;
}

// Opening (erode then dilate, radius 5): thin pale crackle lines and rim highlights
// look "ivory" by colour, but only real pieces survive being shrunk and regrown.
for (const id of [1, 2, 3]) {
  const mask = kind.map((value) => (value === id ? 1 : 0));
  const eroded = grow(mask.map((value) => 1 - value), W, H, 5).map((value) => 1 - value);
  const opened = grow(eroded, W, H, 5);
  for (let k = 0; k < N; k += 1) if (kind[k] === id && !opened[k]) kind[k] = 9;
}

// Layer ids: 1 centre, 2 crown, 3 cobalt, 4 points.
const layer = new Uint8Array(N);
// The centre star: teal connected to the middle, bridging crackle lines (≤5 px).
{
  const seen = new Uint8Array(N);
  const stack = [(H >> 1) * W + (W >> 1)];
  while (stack.length) {
    const k = stack.pop();
    if (seen[k]) continue;
    seen[k] = 1;
    layer[k] = 1;
    const x = k % W, y = (k - x) / W;
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      for (let step = 1; step <= 5; step += 1) {
        const nx = x + dx * step, ny = y + dy * step;
        if (nx < 0 || ny < 0 || nx >= W || ny >= H) break;
        const n = ny * W + nx;
        if (kind[n] === 2) { if (!seen[n]) stack.push(n); break; }
        if (kind[n] !== 9) break;
      }
    }
  }
}
for (let k = 0; k < N; k += 1) {
  if (layer[k]) continue;
  if (kind[k] === 3) layer[k] = 2;
  else if (kind[k] === 1) layer[k] = 3;
  else if (kind[k] === 2) layer[k] = 4;
}

// Between two pieces runs one shared rim (glaze, dark line, gold, dark line, glaze),
// and rims differ in width, so no cut of the drawn rims makes clean pieces. Each
// layer keeps its pieces' glaze and paints them a new rim instead, with the emblem's
// own cross-section, all around: separated, every piece is a whole, even tile. The
// assembled emblem is shown from layer-whole.webp, so it keeps the drawn rims.
const STACK = [4, 3, 2, 1]; // bottom to top, as Companion.tsx stacks the layers
// Every piece but the centre star is convex, so its rim follows the convex hull of
// its glaze, simplified to straight sides: clean edges whatever the glaze's outline.
function hulls(glaze) {
  const filled = new Uint8Array(N);
  const seen = new Uint8Array(N);
  const polygons = [];
  for (let seed = 0; seed < N; seed += 1) {
    if (!glaze[seed] || seen[seed]) continue;
    // One piece: its leftmost and rightmost pixel on each row.
    const left = new Map(), right = new Map();
    const stack = [seed];
    seen[seed] = 1;
    while (stack.length) {
      const k = stack.pop();
      const x = k % W, y = (k - x) / W;
      if (!left.has(y) || x < left.get(y)) left.set(y, x);
      if (!right.has(y) || x > right.get(y)) right.set(y, x);
      for (const n of [k - 1, k + 1, k - W, k + W]) {
        if (n >= 0 && n < N && glaze[n] && !seen[n] && Math.abs((n % W) - x) <= 1) { seen[n] = 1; stack.push(n); }
      }
    }
    if (left.size < 20) continue; // stray specks of glaze colour
    // Andrew's monotone chain over those extremes, then fill the hull row by row.
    const points = [...left].map(([y, x]) => [x, y]).concat([...right].map(([y, x]) => [x, y])).sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
    const half = (list) => {
      const chain = [];
      for (const p of list) {
        while (chain.length >= 2 && cross(chain.at(-2), chain.at(-1), p) <= 0) chain.pop();
        chain.push(p);
      }
      return chain.slice(0, -1);
    };
    const hull = simplify(half(points).concat(half([...points].reverse())));
    polygons.push(hull);
    const ys = hull.map(([, y]) => y);
    for (let y = Math.ceil(Math.min(...ys)); y <= Math.max(...ys); y += 1) {
      let from = Infinity, to = -Infinity;
      for (let i = 0; i < hull.length; i += 1) {
        const [ax, ay] = hull[i], [bx, by] = hull[(i + 1) % hull.length];
        if ((y < ay && y < by) || (y > ay && y > by)) continue;
        const xs = ay === by ? [ax, bx] : [ax + ((y - ay) / (by - ay)) * (bx - ax)];
        for (const x of xs) { from = Math.min(from, x); to = Math.max(to, x); }
      }
      for (let x = Math.ceil(from); x <= Math.floor(to); x += 1) filled[y * W + x] = 1;
    }
  }
  return { filled, polygons };
}
// Reduces a hull to one vertex per real corner: drops vertices that barely turn
// (under 10°), then squares off the short sides that the glaze's rounded corners
// leave, by extending the sides on either side of them until they meet.
function simplify(polygon) {
  const result = [...polygon];
  const turn = (i) => {
    const [ax, ay] = result.at(i - 1), [px, py] = result[i], [bx, by] = result[(i + 1) % result.length];
    const a1 = Math.atan2(py - ay, px - ax), a2 = Math.atan2(by - py, bx - px);
    return Math.abs(Math.atan2(Math.sin(a2 - a1), Math.cos(a2 - a1)));
  };
  for (let i = 0; i < result.length && result.length > 3;) {
    if (turn(i) < (10 * Math.PI) / 180) result.splice(i, 1);
    else i += 1;
  }
  for (let changed = true; changed && result.length > 3;) {
    changed = false;
    for (let i = 0; i < result.length; i += 1) {
      const j = (i + 1) % result.length;
      const [ax, ay] = result[i], [bx, by] = result[j];
      if (Math.hypot(bx - ax, by - ay) >= 26) continue;
      // Lines through the sides before i and after j.
      const [px, py] = result.at(i - 1), [qx, qy] = result[(j + 1) % result.length];
      const d1 = [ax - px, ay - py], d2 = [qx - bx, qy - by];
      const det = d1[0] * d2[1] - d1[1] * d2[0];
      if (Math.abs(det) < 1e-9) continue;
      const t = ((bx - px) * d2[1] - (by - py) * d2[0]) / det;
      const corner = [px + d1[0] * t, py + d1[1] * t];
      if (Math.hypot(corner[0] - (ax + bx) / 2, corner[1] - (ay + by) / 2) > 25) continue;
      if (j > i) result.splice(i, 2, corner);
      else { result.splice(i, 1, corner); result.shift(); }
      changed = true;
      break;
    }
  }
  return result;
}
// Distance out from convex polygons with mitred corners: the largest distance past
// any side's line, so corners stay sharp, but never under the true distance / MITER,
// which blunts the ivory kites' acute tips instead of drawing long spikes.
const MITER = 1.6;
function mitred(polygons, euclidean) {
  const field = Float64Array.from(euclidean, (d) => d / MITER);
  for (const polygon of polygons) {
    const area = polygon.reduce((sum, [ax, ay], i) => { const [bx, by] = polygon[(i + 1) % polygon.length]; return sum + ax * by - bx * ay; }, 0);
    const sides = polygon.map(([ax, ay], i) => {
      const [bx, by] = polygon[(i + 1) % polygon.length];
      const length = Math.hypot(bx - ax, by - ay), sign = area > 0 ? 1 : -1;
      return [ax, ay, (sign * (by - ay)) / length, (sign * (ax - bx)) / length];
    });
    const xs = polygon.map(([x]) => x), ys = polygon.map(([, y]) => y);
    const reach = RIM * MITER + 2;
    for (let y = Math.max(0, Math.floor(Math.min(...ys) - reach)); y <= Math.min(H - 1, Math.max(...ys) + reach); y += 1) {
      for (let x = Math.max(0, Math.floor(Math.min(...xs) - reach)); x <= Math.min(W - 1, Math.max(...xs) + reach); x += 1) {
        const k = y * W + x;
        if (!euclidean[k] || euclidean[k] > reach) continue;
        let out = -Infinity;
        for (const [ax, ay, nx, ny] of sides) out = Math.max(out, (x - ax) * nx + (y - ay) * ny);
        field[k] = Math.max(field[k], Math.min(out, euclidean[k]));
      }
    }
  }
  return field;
}
const fields = {};
for (const id of STACK) {
  const glaze = layer.map((value) => (value === id ? 1 : 0));
  // Holes left by crackle nodes are filled, so no rim is drawn around them.
  const closed = fillHoles(grow(grow(glaze, W, H, 3).map((value) => 1 - value), W, H, 3).map((value) => 1 - value), W, H);
  if (id === 1) {
    fields[id] = distanceTo(closed, W, H);
    continue;
  }
  const { filled, polygons } = hulls(closed);
  fields[id] = mitred(polygons, distanceTo(filled, W, H));
}
// Crackle lines inside a piece belong to it.
for (let k = 0; k < N; k += 1) {
  if (kind[k] !== 9) continue;
  for (const id of STACK) if (!fields[id][k]) layer[k] = id;
}

// Crackle lines: thin gold runs with the same glaze on both sides. Paint them with
// the average of that glaze so the pieces read polished, not cracked.
const pixels = Buffer.from(data);
for (let k = 0; k < N; k += 1) {
  if (kind[k] !== 9 || !layer[k]) continue;
  const x = k % W, y = (k - x) / W;
  for (const [dx, dy] of [[1, 0], [0, 1], [1, 1], [1, -1]]) {
    let a = -1, b = -1;
    for (let step = 1; step <= 4 && (a < 0 || b < 0); step += 1) {
      const ax = x - dx * step, ay = y - dy * step, bx = x + dx * step, by = y + dy * step;
      if (a < 0 && ax >= 0 && ay >= 0 && ay < H && kind[ay * W + ax] !== 9) a = kind[ay * W + ax] && layer[ay * W + ax] === layer[k] ? ay * W + ax : -2;
      if (b < 0 && bx < W && by >= 0 && by < H && kind[by * W + bx] !== 9) b = kind[by * W + bx] && layer[by * W + bx] === layer[k] ? by * W + bx : -2;
    }
    if (a >= 0 && b >= 0) {
      for (let c = 0; c < 3; c += 1) pixels[k * 4 + c] = (data[a * 4 + c] + data[b * 4 + c]) >> 1;
      break;
    }
  }
}

const save = async (name, raw) => {
  const meta = await sharp(raw, { raw: { width: W, height: H, channels: 4 } })
    .resize(SIZE, SIZE)
    .webp({ quality: 88, alphaQuality: 92 })
    .toFile(out(name));
  console.log(`${name}: ${meta.size} bytes`);
};
await save('whole', pixels);

// Each layer: its pieces' glaze, then the new rim out to RIM px with an antialiased
// edge, shaded by the facing of the outward normal (the distance field's gradient).
const profiles = rimProfiles(data, W);
const names = { 1: 'centre', 2: 'crown', 3: 'cobalt', 4: 'points' };
for (const [id, name] of Object.entries(names)) {
  const d = fields[id];
  const cut = Buffer.alloc(N * 4);
  for (let k = 0; k < N; k += 1) {
    if (!d[k]) {
      cut.set(pixels.subarray(k * 4, k * 4 + 4), k * 4);
      continue;
    }
    if (d[k] >= RIM + 0.5) continue;
    const x = k % W, y = (k - x) / W;
    const nx = d[y * W + Math.min(W - 1, x + 2)] - d[y * W + Math.max(0, x - 2)];
    const ny = d[Math.min(H - 1, y + 2) * W + x] - d[Math.max(0, y - 2) * W + x];
    cut.set(rimColour(profiles, Math.max(0, RIM - d[k]), nx || ny ? facing(nx, ny) : { top: 1 }), k * 4);
    cut[k * 4 + 3] = Math.round(255 * Math.min(1, RIM + 0.5 - d[k]));
  }
  await save(name, cut);
}
