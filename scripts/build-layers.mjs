// Splits the standard emblem (public/brand/zellige-emblem.png) into its colour
// layers, so the landing can assemble the logo around Zel layer by layer:
//   centre  — the teal eight-point star in the middle (Zel's face sits on it)
//   crown   — the eight ivory kites around it
//   cobalt  — the four blue corner squares
//   points  — the four outer teal points (see scripts/fix-emblem.mjs)
// and, for the story, joined versions of those split into four (layer-*-joined).
// Every layer keeps the emblem's own pixels and full canvas, so stacked they
// rebuild the logo exactly. Each piece takes the whole gold rim around it, so it
// reads as a complete tile when the layers separate, and the thin gold crackle
// lines inside pieces are smoothed into the glaze.
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { distanceTo, fillHoles, flood, grow } from './mask.mjs';
import { RIM, facing, rimColour, rimProfiles } from './rim.mjs';

const source = fileURLToPath(new URL('../public/brand/zellige-emblem.png', import.meta.url));
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
  const star = flood((H >> 1) * W + (W >> 1), (n) => kind[n] === 2, W, H, (n) => kind[n] === 9);
  for (let k = 0; k < N; k += 1) if (star[k]) layer[k] = 1;
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
    fillPolygon(hull, filled);
  }
  return { filled, polygons };
}
// Fills a convex polygon into `mask`, row by row.
function fillPolygon(polygon, mask) {
  const ys = polygon.map(([, y]) => y);
  for (let y = Math.ceil(Math.min(...ys)); y <= Math.max(...ys); y += 1) {
    let from = Infinity, to = -Infinity;
    for (let i = 0; i < polygon.length; i += 1) {
      const [ax, ay] = polygon[i], [bx, by] = polygon[(i + 1) % polygon.length];
      if ((y < ay && y < by) || (y > ay && y > by)) continue;
      const xs = ay === by ? [ax, bx] : [ax + ((y - ay) / (by - ay)) * (bx - ax)];
      for (const x of xs) { from = Math.min(from, x); to = Math.max(to, x); }
    }
    for (let x = Math.ceil(from); x <= Math.floor(to); x += 1) mask[y * W + x] = 1;
  }
  return mask;
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
const outlines = {};
for (const id of STACK) {
  const glaze = layer.map((value) => (value === id ? 1 : 0));
  // Holes left by crackle nodes are filled, so no rim is drawn around them.
  const closed = fillHoles(grow(grow(glaze, W, H, 3).map((value) => 1 - value), W, H, 3).map((value) => 1 - value), W, H);
  if (id === 1) {
    fields[id] = distanceTo(closed, W, H);
    continue;
  }
  const { filled, polygons } = hulls(closed);
  outlines[id] = polygons;
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
async function render(name, d, glaze = pixels) {
  const cut = Buffer.alloc(N * 4);
  for (let k = 0; k < N; k += 1) {
    if (!d[k]) {
      cut.set(glaze.subarray(k * 4, k * 4 + 4), k * 4);
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
const names = { 1: 'centre', 2: 'crown', 3: 'cobalt', 4: 'points' };
for (const [id, name] of Object.entries(names)) await render(name, fields[id]);

// Joined layers, for the story, where each layer shows on its own around Zel
// (Trio.tsx): there the blue and the green each read as one piece rather than four.
// Stacked, the crown over the blue and the blue over the green, they still show only
// the emblem's own pieces; the assembled tile keeps the layers above all the same.
const box = (points) => {
  const xs = points.map(([x]) => x), ys = points.map(([, y]) => y);
  return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)];
};
const centroid = (polygon) => polygon.reduce(([sx, sy], [x, y]) => [sx + x / polygon.length, sy + y / polygon.length], [0, 0]);
const dot = ([ax, ay], [bx, by]) => ax * bx + ay * by;
// Where the lines through a–b and c–d cross.
const meet = ([ax, ay], [bx, by], [cx, cy], [dx, dy]) => {
  const d1 = [bx - ax, by - ay], d2 = [dx - cx, dy - cy];
  const t = ((cx - ax) * d2[1] - (cy - ay) * d2[0]) / (d1[0] * d2[1] - d1[1] * d2[0]);
  return [ax + d1[0] * t, ay + d1[1] * t];
};
// The side a–b moved `distance` px away from the point `inside`.
const shift = ([ax, ay], [bx, by], inside, distance) => {
  const length = Math.hypot(bx - ax, by - ay);
  let [nx, ny] = [(by - ay) / length, (ax - bx) / length];
  if ((inside[0] - ax) * nx + (inside[1] - ay) * ny > 0) [nx, ny] = [-nx, -ny];
  return [[ax + nx * distance, ay + ny * distance], [bx + nx * distance, by + ny * distance]];
};
// Each point's tip (the corner nearest the emblem's centre) and the corners either side.
const middle = centroid(outlines[4].flat());
const points = outlines[4].map((polygon) => {
  const tip = polygon.reduce((best, p, i) => (Math.hypot(p[0] - middle[0], p[1] - middle[1]) < Math.hypot(polygon[best][0] - middle[0], polygon[best][1] - middle[1]) ? i : best), 0);
  const [dx, dy] = centroid(polygon).map((v, i) => v - middle[i]);
  const side = Math.abs(dy) > Math.abs(dx) ? (dy < 0 ? 'top' : 'bottom') : (dx < 0 ? 'left' : 'right');
  return { polygon, side, tip: polygon[tip], beside: [polygon.at(tip - 1), polygon[(tip + 1) % polygon.length]] };
});

// A joined piece from convex parts: the union of their masks, and a rim that is the
// nearest part's, each with mitred corners.
function union(parts) {
  const tile = new Uint8Array(N);
  let field;
  for (const part of parts) {
    const mask = fillPolygon(part, new Uint8Array(N));
    const d = mitred([part], distanceTo(mask, W, H));
    for (let k = 0; k < N; k += 1) if (mask[k]) tile[k] = 1;
    field = field ? field.map((v, k) => Math.min(v, d[k])) : d;
  }
  return { tile, field };
}

// A joined piece's glaze: the first piece's glaze, smoothed of crackle and stretched
// over the whole tile, so it keeps that piece's facets, with the fine grain and
// crackle of the nearest piece on top at their own scale, mirrored to fill the tile.
// `axes` are the unit vectors the pieces are squared to; each piece's glaze is the
// largest box on them inside it, clear of its rim.
const raw = { raw: { width: W, height: H, channels: 4 } };
const smooth = await sharp(pixels, raw).median(11).raw().toBuffer();
const blurred = await sharp(pixels, raw).blur(1.5).raw().toBuffer();
function stretched(tile, outline, pieces, axes) {
  const INSET = 6, GRAIN = 14; // px clear of a rim; the grain's largest step, per channel
  const frame = (polygon) => {
    const centre = centroid(polygon);
    const half = axes.map((axis) => {
      const reach = polygon.map((p) => dot([p[0] - centre[0], p[1] - centre[1]], axis));
      return (Math.max(...reach) - Math.min(...reach)) / 2;
    });
    return { centre, half };
  };
  const inside = (polygon, p) => polygon.every((a, i) => {
    const [s, t] = shift(a, polygon[(i + 1) % polygon.length], centroid(polygon), 0);
    const length = Math.hypot(t[0] - s[0], t[1] - s[1]);
    const toward = dot([centroid(polygon)[0] - s[0], centroid(polygon)[1] - s[1]], [s[1] - t[1], t[0] - s[0]]) > 0 ? 1 : -1;
    return (toward * dot([p[0] - s[0], p[1] - s[1]], [s[1] - t[1], t[0] - s[0]])) / length >= INSET;
  });
  const glazes = pieces.map((polygon) => {
    const { centre, half } = frame(polygon);
    // Shrink the box until its corners are clear of the piece's rim.
    let scale = 1;
    const corner = (u, v) => [0, 1].map((c) => centre[c] + axes[0][c] * u * half[0] * scale + axes[1][c] * v * half[1] * scale);
    while ([[-1, -1], [1, -1], [1, 1], [-1, 1]].some(([u, v]) => !inside(polygon, corner(u, v)))) scale *= 0.98;
    return { centre, half: half.map((h) => h * scale) };
  });
  const whole = frame(outline);
  const at = (buffer, [x, y], c) => {
    const ux = Math.floor(x), vy = Math.floor(y), fx = x - ux, fy = y - vy;
    const get = (px, py) => buffer[(py * W + px) * 4 + c];
    return (get(ux, vy) * (1 - fx) + get(ux + 1, vy) * fx) * (1 - fy) + (get(ux, vy + 1) * (1 - fx) + get(ux + 1, vy + 1) * fx) * fy;
  };
  // `t` mirrored back and forth into -half..half.
  const mirror = (t, half) => {
    const p = (((t + half) % (4 * half)) + 4 * half) % (4 * half);
    return (p < 2 * half ? p : 4 * half - p) - half;
  };
  const place = ({ centre, half }, [u, v]) => [0, 1].map((c) => centre[c] + axes[0][c] * u * half[0] + axes[1][c] * v * half[1]);
  const glaze = Buffer.alloc(N * 4);
  for (let k = 0; k < N; k += 1) {
    if (!tile[k]) continue;
    const p = [k % W, Math.floor(k / W)];
    const local = (frameOf) => axes.map((axis, i) => dot([p[0] - frameOf.centre[0], p[1] - frameOf.centre[1]], axis) / frameOf.half[i]);
    const base = place(glazes[0], local(whole));
    const near = glazes.reduce((a, b) => (Math.hypot(p[0] - a.centre[0], p[1] - a.centre[1]) < Math.hypot(p[0] - b.centre[0], p[1] - b.centre[1]) ? a : b));
    const offset = axes.map((axis) => dot([p[0] - near.centre[0], p[1] - near.centre[1]], axis));
    const grain = [0, 1].map((c) => near.centre[c] + axes[0][c] * mirror(offset[0], near.half[0]) + axes[1][c] * mirror(offset[1], near.half[1]));
    for (let c = 0; c < 3; c += 1) {
      const fine = Math.max(-GRAIN, Math.min(GRAIN, at(pixels, grain, c) - at(blurred, grain, c)));
      glaze[k * 4 + c] = Math.max(0, Math.min(255, Math.round(at(smooth, base, c) + fine)));
    }
    glaze[k * 4 + 3] = 255;
  }
  return glaze;
}

// The cobalt piece: one tile out to the four squares' outer corners, notched where
// each green point comes in, two rims clear of it as in the emblem: an X around Zel,
// whose arms are the four squares. It is built from four convex quarters, each from
// its corner along the tile's sides to the notches, in to their apexes and the centre.
{
  const [x0, y0, x1, y1] = box(outlines[3].flat());
  const edges = { top: [[x0, y0], [x1, y0]], bottom: [[x0, y1], [x1, y1]], left: [[x0, y0], [x0, y1]], right: [[x1, y0], [x1, y1]] };
  const notches = {};
  for (const { polygon, side, tip, beside } of points) {
    const sides = beside.map((p) => shift(tip, p, centroid(polygon), 2 * RIM));
    notches[side] = { apex: meet(...sides[0], ...sides[1]), ends: sides.map((line) => meet(...line, ...edges[side])) };
  }
  const centre = [(notches.top.apex[0] + notches.bottom.apex[0]) / 2, (notches.left.apex[1] + notches.right.apex[1]) / 2];
  const near = (ends, corner) => ends.reduce((a, b) => (Math.hypot(a[0] - corner[0], a[1] - corner[1]) < Math.hypot(b[0] - corner[0], b[1] - corner[1]) ? a : b));
  const quarters = [[x0, y0, 'top', 'left'], [x1, y0, 'top', 'right'], [x1, y1, 'bottom', 'right'], [x0, y1, 'bottom', 'left']].map(([x, y, across, down]) => [
    [x, y], near(notches[across].ends, [x, y]), notches[across].apex, centre, notches[down].apex, near(notches[down].ends, [x, y]),
  ]);
  const { tile, field } = union(quarters);
  // The upper-left square's glaze first: it lends the tile its facets.
  const squares = [...outlines[3]].sort((a, b) => centroid(a)[0] + centroid(a)[1] - centroid(b)[0] - centroid(b)[1]);
  const glaze = stretched(tile, [[x0, y0], [x1, y0], [x1, y1], [x0, y1]], squares, [[1, 0], [0, 1]]);
  await render('cobalt-joined', field, glaze);
}

// The green piece: the four points and everything between them and Zel, each point
// joined to the next from the corner beside its tip, as a diamond around Zel whose
// corners are the four points. Its parts: the points, a quarter between each two
// points (the two corners and the two tips), and the square between the four tips.
{
  const order = [...points].sort((a, b) => Math.atan2(a.tip[1] - middle[1], a.tip[0] - middle[0]) - Math.atan2(b.tip[1] - middle[1], b.tip[0] - middle[0]));
  const quarters = order.map((a, i) => {
    const b = order[(i + 1) % order.length];
    const closest = (corners, to) => corners.reduce((s, t) => (Math.hypot(s[0] - to[0], s[1] - to[1]) < Math.hypot(t[0] - to[0], t[1] - to[1]) ? s : t));
    return [a.tip, closest(a.beside, b.tip), closest(b.beside, a.tip), b.tip];
  });
  const { tile, field } = union([...order.map(({ polygon }) => polygon), ...quarters, order.map(({ tip }) => tip)]);
  // The top point's glaze first, squared to the points' diagonal sides.
  const top = order.find(({ side }) => side === 'top');
  const pieces = [top, ...order.filter((point) => point !== top)].map(({ polygon }) => polygon);
  const outline = order.map(({ polygon }) => polygon.reduce((far, p) => (Math.hypot(p[0] - middle[0], p[1] - middle[1]) > Math.hypot(far[0] - middle[0], far[1] - middle[1]) ? p : far)));
  const glaze = stretched(tile, outline, pieces, [[Math.SQRT1_2, Math.SQRT1_2], [Math.SQRT1_2, -Math.SQRT1_2]]);
  await render('points-joined', field, glaze);
}
