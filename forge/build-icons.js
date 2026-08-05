// Dependency-free PNG icon generator for Forge.
// Renders a squircle with an energy gradient + lightning bolt, supersampled for AA.
const fs = require("fs");
const zlib = require("zlib");
const path = require("path");

const OUT = path.join(__dirname, "icons");
fs.mkdirSync(OUT, { recursive: true });

// gradient stops (t 0..1)
const STOPS = [
  [0.0, [255, 94, 58]],   // #ff5e3a
  [0.5, [255, 45, 117]],  // #ff2d75
  [1.0, [124, 58, 237]],  // #7c3aed
];
function grad(t) {
  t = Math.max(0, Math.min(1, t));
  for (let i = 0; i < STOPS.length - 1; i++) {
    const [a, ca] = STOPS[i], [b, cb] = STOPS[i + 1];
    if (t >= a && t <= b) {
      const k = (t - a) / (b - a);
      return [0, 1, 2].map(j => Math.round(ca[j] + (cb[j] - ca[j]) * k));
    }
  }
  return STOPS[STOPS.length - 1][1];
}

// lightning bolt polygon in 0..1 space
const BOLT = [
  [0.575, 0.06], [0.265, 0.53], [0.465, 0.53],
  [0.40, 0.94], [0.735, 0.44], [0.525, 0.44], [0.60, 0.06],
];
function inPoly(px, py, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i][0], yi = poly[i][1], xj = poly[j][0], yj = poly[j][1];
    if (((yi > py) !== (yj > py)) && (px < ((xj - xi) * (py - yi)) / (yj - yi) + xi)) inside = !inside;
  }
  return inside;
}
// superellipse squircle: |x|^n + |y|^n <= 1
function inSquircle(nx, ny, n) {
  return Math.pow(Math.abs(nx), n) + Math.pow(Math.abs(ny), n) <= 1;
}

function renderRGBA(size, SS = 4) {
  const S = size * SS;
  const buf = Buffer.alloc(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let r = 0, g = 0, b = 0, a = 0;
      for (let sy = 0; sy < SS; sy++) {
        for (let sx = 0; sx < SS; sx++) {
          const fx = (x + (sx + 0.5) / SS) / size; // 0..1
          const fy = (y + (sy + 0.5) / SS) / size;
          const nx = fx * 2 - 1, ny = fy * 2 - 1;
          if (!inSquircle(nx, ny, 4)) continue; // outside icon -> transparent
          a += 255;
          // base gradient along diagonal
          let [cr, cg, cb] = grad((fx + fy) / 2);
          // top-left sheen
          const sheen = Math.max(0, 1 - Math.hypot(fx - 0.3, fy - 0.28) * 1.4) * 0.35;
          cr += (255 - cr) * sheen; cg += (255 - cg) * sheen; cb += (255 - cb) * sheen;
          // bolt (white with soft glow)
          if (inPoly(fx, fy, BOLT)) { cr = 255; cg = 255; cb = 255; }
          r += cr; g += cg; b += cb;
        }
      }
      const n = SS * SS;
      const i = (y * size + x) * 4;
      const alpha = a / n;
      buf[i] = Math.round(r / n);
      buf[i + 1] = Math.round(g / n);
      buf[i + 2] = Math.round(b / n);
      buf[i + 3] = Math.round(alpha);
    }
  }
  return buf;
}

function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
  }
  return ~c >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length, 0);
  const t = Buffer.from(type, "ascii");
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(Buffer.concat([t, data])), 0);
  return Buffer.concat([len, t, data, crc]);
}
function encodePNG(size, rgba) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  const raw = Buffer.alloc(size * (size * 4 + 1));
  for (let y = 0; y < size; y++) {
    raw[y * (size * 4 + 1)] = 0;
    rgba.copy(raw, y * (size * 4 + 1) + 1, y * size * 4, (y + 1) * size * 4);
  }
  const idat = zlib.deflateSync(raw, { level: 9 });
  return Buffer.concat([sig, chunk("IHDR", ihdr), chunk("IDAT", idat), chunk("IEND", Buffer.alloc(0))]);
}

[1024, 512, 192, 180].forEach(sz => {
  const png = encodePNG(sz, renderRGBA(sz, sz >= 512 ? 4 : 4));
  fs.writeFileSync(path.join(OUT, `icon-${sz}.png`), png);
  console.log("wrote icon-" + sz + ".png (" + png.length + " bytes)");
});

// maskable padded version (bolt within safe zone) reuse 512
fs.copyFileSync(path.join(OUT, "icon-512.png"), path.join(OUT, "maskable-512.png"));

// SVG favicon
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
<stop offset="0" stop-color="#ff5e3a"/><stop offset=".5" stop-color="#ff2d75"/><stop offset="1" stop-color="#7c3aed"/></linearGradient></defs>
<rect width="100" height="100" rx="24" fill="url(#g)"/>
<polygon points="57.5,6 26.5,53 46.5,53 40,94 73.5,44 52.5,44 60,6" fill="#fff"/></svg>`;
fs.writeFileSync(path.join(OUT, "favicon.svg"), svg);
console.log("wrote favicon.svg");
