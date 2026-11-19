// Erzeugt die App-Icons: node tools/icons.mjs
// Die Figur im Look „Linien“: helle Höhenlinien auf Kobaltblau, Muskelgruppen weiß.
import { mkdirSync } from 'node:fs';
import { bauFigur } from '../src/three/figur.js';
import { schattiere } from '../src/three/figurstil.js';
import { zeichnePixel } from '../src/three/render.js';
import { schreibePNG, verkleinern } from './png.mjs';

const mesh = bauFigur();
const BG = [33, 72, 255];
const c = (r, g, b) => [r / 255, g / 255, b / 255];
const weiss = c(255, 255, 255);

// dichte: Linien je Meter Körperhöhe; kleine Icons brauchen weniger, dafür deutlichere Linien
function icon(datei, groesse, anteil, dichte) {
  const f = 4, W = groesse * f, H = groesse * f;
  const out = { W, H, D: new Uint8ClampedArray(W * H * 4), ZB: new Float32Array(W * H), IB: null };
  const s = H * anteil / 1.78;
  const farben = { id: 1, dichte, basis: c(52, 90, 255), fuell: c(44, 82, 255), linie: c(170, 190, 255), rim: 0, spec: 0, fl: [c(52, 90, 255)].concat(Array(17).fill(weiss)) };
  const px = 1 / s * Math.max(1, 30 / dichte);
  zeichnePixel(mesh, { yaw: -0.45, pitch: 0.05, tx: 0, ty: 0.875, tz: 0, cx: W / 2, cy: H / 2, s, F: 7 }, out,
    (x, y, z, nx, ny, nz, ao) => schattiere(1, x, y, z, nx, ny, nz, ao, farben, px));
  const k = verkleinern(out.D, W, H, f, BG);
  schreibePNG(datei, k.W, k.H, k.D);
  console.log('geschrieben:', datei);
}

mkdirSync(new URL('../icons/', import.meta.url), { recursive: true });
const p = (n) => new URL('../icons/' + n, import.meta.url).pathname;
icon(p('icon-512.png'), 512, 0.86, 36);
icon(p('icon-192.png'), 192, 0.86, 24);
icon(p('apple-touch-icon.png'), 180, 0.82, 24);
icon(p('icon-maskable-512.png'), 512, 0.66, 32);
icon(p('favicon-32.png'), 32, 0.92, 9);
