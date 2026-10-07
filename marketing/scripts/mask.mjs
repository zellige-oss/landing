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

// Felzenszwalb–Huttenlocher squared distance transform along one row or column.
function edt1d(get, set, n) {
  const f = new Float64Array(n), v = new Int32Array(n), z = new Float64Array(n + 1);
  for (let q = 0; q < n; q += 1) f[q] = get(q);
  let j = 0;
  v[0] = 0; z[0] = -Infinity; z[1] = Infinity;
  for (let q = 1; q < n; q += 1) {
    let s;
    do {
      const p = v[j];
      s = ((f[q] + q * q) - (f[p] + p * p)) / (2 * q - 2 * p);
    } while (s <= z[j] && --j >= 0);
    j += 1; v[j] = q; z[j] = s; z[j + 1] = Infinity;
  }
  j = 0;
  for (let q = 0; q < n; q += 1) {
    while (z[j + 1] < q) j += 1;
    set(q, (q - v[j]) ** 2 + f[v[j]]);
  }
}

// Euclidean distance from every pixel to the nearest pixel inside the mask.
export function distanceTo(mask, width, height) {
  const dist = new Float64Array(width * height);
  for (let k = 0; k < dist.length; k += 1) dist[k] = mask[k] ? 0 : 1e12;
  for (let x = 0; x < width; x += 1) edt1d((y) => dist[y * width + x], (y, d) => { dist[y * width + x] = d; }, height);
  for (let y = 0; y < height; y += 1) edt1d((x) => dist[y * width + x], (x, d) => { dist[y * width + x] = d; }, width);
  for (let k = 0; k < dist.length; k += 1) dist[k] = Math.sqrt(dist[k]);
  return dist;
}

// The mask with every hole filled: whatever the background around it can't reach.
export function fillHoles(mask, width, height) {
  const outside = new Uint8Array(width * height);
  const stack = [0];
  while (stack.length) {
    const k = stack.pop();
    if (outside[k] || mask[k]) continue;
    outside[k] = 1;
    const x = k % width, y = (k - x) / width;
    if (x > 0) stack.push(k - 1);
    if (x < width - 1) stack.push(k + 1);
    if (y > 0) stack.push(k - width);
    if (y < height - 1) stack.push(k + width);
  }
  return outside.map((value) => 1 - value);
}
