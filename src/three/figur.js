// Muskelkarte · Figur (zweiter Ansatz)
//
// 1. Ein glatter, realistisch proportionierter Körper: der Rumpf entsteht aus fließenden
//    Querschnitten (Ellipsen, deren Breite und Tiefe sich mit der Höhe ändern), Arme und Beine
//    aus Röhren mit Radiusverlauf (Wade, Oberschenkel). Keine Muskelwülste.
// 2. Die Muskelgruppen sind keine Formen, sondern klar begrenzte Flächen auf der Haut. Sie sind
//    als Regeln beschrieben (z. B. Brust: Höhe 1,235–1,40 m, vorn, nicht am Arm) und werden
//    beim Zeichnen pro Bildpunkt ausgewertet: saubere, abgerundete Kanten statt Flecken.
//
// Maße in Metern, y nach oben, z nach vorn, 1,75 m groß. Beschrieben ist die rechte Hälfte.

const { abs, sqrt, max, min, atan2, PI } = Math;

export const MID = ['', 'nacken', 'schultern', 'brust', 'bizeps', 'trizeps', 'unterarme', 'bauch', 'seitbauch', 'oruecken', 'uruecken', 'gesaess', 'hueftbeuger', 'quad', 'hams', 'addu', 'waden', 'schienbein'];

// ---------- Form ----------
// Rumpf-Querschnitte: [Höhe, halbe Breite, halbe Tiefe, Mitte vorn/hinten]
const RUMPF = [
  [0.78, 0.130, 0.090, -0.005],
  [0.86, 0.160, 0.104, -0.010],
  [0.95, 0.157, 0.100, -0.006],
  [1.04, 0.134, 0.092, 0.004],
  [1.12, 0.139, 0.097, 0.008],
  [1.22, 0.153, 0.107, 0.012],
  [1.30, 0.163, 0.111, 0.012],
  [1.37, 0.168, 0.101, 0.002],
  [1.43, 0.150, 0.077, -0.010],
  [1.47, 0.092, 0.062, -0.012]
];
function rumpfBei(y) {
  const k = RUMPF;
  if (y <= k[0][0]) return k[0];
  if (y >= k[k.length - 1][0]) return k[k.length - 1];
  let i = 0;
  while (y > k[i + 1][0]) i++;
  // weiche Überblendung mit den Nachbarn (Catmull-Rom)
  const p0 = k[max(0, i - 1)], p1 = k[i], p2 = k[i + 1], p3 = k[min(k.length - 1, i + 2)];
  const t = (y - p1[0]) / (p2[0] - p1[0]), t2 = t * t, t3 = t2 * t;
  const cr = (j) => 0.5 * ((2 * p1[j]) + (-p0[j] + p2[j]) * t + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * t2 + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * t3);
  return [y, cr(1), cr(2), cr(3)];
}
export { rumpfBei };

// Röhre von a nach b mit Radiusverlauf r[[t, Radius]] und optionaler Verschiebung der Mitte nach hinten (oz)
const R = (ax, ay, az, bx, by, bz, r, oz) => { const dx = bx - ax, dy = by - ay, dz = bz - az; return { t: 1, ax, ay, az, dx, dy, dz, l2: dx * dx + dy * dy + dz * dz, r, oz: oz || null }; };
const E = (cx, cy, cz, rx, ry, rz) => ({ t: 0, cx, cy, cz, rx, ry, rz });
const interp = (keys, t) => { if (t <= keys[0][0]) return keys[0][1]; for (let i = 0; i < keys.length - 1; i++) { const a = keys[i], b = keys[i + 1]; if (t <= b[0]) { let u = (t - a[0]) / (b[0] - a[0]); u = u * u * (3 - 2 * u); return a[1] + (b[1] - a[1]) * u; } } return keys[keys.length - 1][1]; };

const TEILE = [
  // Beine
  R(0.092, 0.88, 0.0, 0.098, 0.47, 0.006, [[0, 0.088], [0.25, 0.082], [0.7, 0.062], [1, 0.050]]),
  R(0.098, 0.47, 0.006, 0.100, 0.075, -0.004, [[0, 0.049], [0.22, 0.056], [0.45, 0.050], [0.8, 0.033], [1, 0.030]], [[0, 0], [0.25, -0.012], [0.6, -0.004], [1, 0]]),
  E(0.100, 0.034, 0.045, 0.040, 0.032, 0.112),
  // Gesäß
  E(0.074, 0.905, -0.052, 0.074, 0.085, 0.062),
  // Arme
  E(0.186, 1.414, -0.006, 0.058, 0.056, 0.056),
  R(0.19, 1.414, -0.006, 0.255, 1.13, -0.010, [[0, 0.049], [0.3, 0.044], [1, 0.035]]),
  R(0.255, 1.13, -0.010, 0.295, 0.885, 0.010, [[0, 0.035], [0.25, 0.038], [1, 0.025]]),
  E(0.307, 0.815, 0.014, 0.021, 0.068, 0.040),
  // Hals, Nacken, Kopf
  R(0.0, 1.43, -0.016, 0.0, 1.565, -0.006, [[0, 0.064], [0.6, 0.052], [1, 0.052]]),
  E(0.085, 1.452, -0.028, 0.092, 0.034, 0.050),
  E(0.0, 1.665, -0.006, 0.077, 0.093, 0.094),
  E(0.0, 1.608, 0.024, 0.057, 0.068, 0.067)
];
const K = 0.028; // Weichheit der Übergänge

function abstand(p, x, y, z) {
  if (p.t === 0) {
    const ax = (x - p.cx) / p.rx, ay = (y - p.cy) / p.ry, az = (z - p.cz) / p.rz;
    const k0 = sqrt(ax * ax + ay * ay + az * az);
    const bx = ax / p.rx, by = ay / p.ry, bz = az / p.rz;
    const k1 = sqrt(bx * bx + by * by + bz * bz);
    return k1 > 1e-9 ? k0 * (k0 - 1) / k1 : -min(p.rx, p.ry, p.rz);
  }
  let t = ((x - p.ax) * p.dx + (y - p.ay) * p.dy + (z - p.az) * p.dz) / p.l2;
  t = max(0, min(1, t));
  const oz = p.oz ? interp(p.oz, t) : 0;
  const qx = x - (p.ax + p.dx * t), qy = y - (p.ay + p.dy * t), qz = z - (p.az + p.dz * t + oz);
  return sqrt(qx * qx + qy * qy + qz * qz) - interp(p.r, t);
}
function rumpf(x, y, z) {
  const [, a, b, c] = rumpfBei(y);
  const ex = x / a, ez = (z - c) / b;
  const e = sqrt(ex * ex + ez * ez);
  let d = (e - 1) * min(a, b);
  d = max(d, RUMPF[0][0] - y, y - RUMPF[RUMPF.length - 1][0]);
  return d;
}
export function sdf(x, y, z) {
  x = abs(x);
  let d = rumpf(x, y, z);
  for (let i = 0; i < TEILE.length; i++) {
    const di = abstand(TEILE[i], x, y, z);
    const hh = max(K - abs(d - di), 0) / K;
    d = min(d, di) - hh * hh * K * 0.25;
  }
  return d;
}

// ---------- Muskelflächen ----------
// Bezugsgrößen eines Punktes (rechte Hälfte): X, Y, Z wie oben; Zr = vor/hinter der Rumpfmitte;
// u, v, ang = Lage um die Beinachse (ang in Grad: 90 vorn, 0 außen, ±180 innen, -90 hinten);
// t, d = Lage am Arm (t: 0 Schulter bis 1 Handgelenk, d: Abstand zur Armachse, außen positiv)
const ARM = { sx: 0.19, sy: 1.414, wx: 0.295, wy: 0.885 };
ARM.dx = ARM.wx - ARM.sx; ARM.dy = ARM.wy - ARM.sy; ARM.L = sqrt(ARM.dx * ARM.dx + ARM.dy * ARM.dy);
export function rahmen(x, y, z) {
  const X = abs(x);
  const t = ((X - ARM.sx) * ARM.dx + (y - ARM.sy) * ARM.dy) / (ARM.L * ARM.L);
  const d = ((X - ARM.sx) * -ARM.dy + (y - ARM.sy) * ARM.dx) / ARM.L;
  const bx = y > 0.47 ? 0.098 + (0.092 - 0.098) * min(1, (y - 0.47) / 0.41) : 0.099;
  const u = X - bx, v = z;
  const ang = atan2(v, u) * 180 / PI;
  const c = rumpfBei(y)[3];
  return { X, Y: y, Z: z, Zr: z - c, u, v, ang, aang: abs(ang), rb: sqrt(u * u + v * v), t, d };
}
// Maßstab je Größe, damit alle Grenzen in Metern auf der Haut gemessen werden
const MASS = { X: 1, Y: 1, Z: 1, Zr: 1, u: 1, v: 1, ang: 0.0012, aang: 0.0012, rb: 1, t: ARM.L, d: 1 };
const RUND = 0.022; // Eckenradius der Flächen

// Jede Muskelgruppe: eine oder mehrere Boxen aus Bereichen [min, max]
export const REGELN = {
  nacken: [{ Y: [1.425, 1.585], Z: [-0.3, -0.006], X: [0, 0.15], d: [-1, -0.03] }],
  schultern: [{ t: [-0.25, 0.16], d: [-0.012, 0.12] }],
  brust: [{ Y: [1.235, 1.40], X: [0.014, 0.152], Zr: [0.02, 0.3], d: [-1, -0.05] }],
  bizeps: [{ t: [0.2, 0.5], Z: [0.004, 0.2], d: [-0.09, 0.09] }],
  trizeps: [{ t: [0.2, 0.5], Z: [-0.2, -0.010], d: [-0.09, 0.09] }],
  unterarme: [{ t: [0.555, 0.93], d: [-0.09, 0.09] }],
  bauch: [{ Y: [0.955, 1.212], X: [0, 0.060], Zr: [0.02, 0.3] }],
  seitbauch: [{ Y: [0.985, 1.215], X: [0.076, 0.3], Zr: [-0.035, 0.3], d: [-1, -0.05] }],
  oruecken: [{ Y: [1.17, 1.405], X: [0, 0.172], Zr: [-0.3, -0.022], d: [-1, -0.05] }],
  uruecken: [{ Y: [0.975, 1.145], X: [0, 0.074], Zr: [-0.3, -0.022] }],
  gesaess: [{ Y: [0.79, 0.95], X: [0.012, 0.21], Zr: [-0.3, -0.024] }],
  hueftbeuger: [{ Y: [0.872, 0.948], X: [0.045, 0.138], Zr: [0.02, 0.3] }],
  quad: [{ Y: [0.535, 0.848], ang: [-38, 146], rb: [0, 0.115] }],
  hams: [{ Y: [0.535, 0.772], ang: [-146, -50], rb: [0, 0.115] }],
  addu: [{ Y: [0.585, 0.80], aang: [158, 182], rb: [0, 0.115] }],
  waden: [{ Y: [0.15, 0.425], ang: [-162, -22], rb: [0, 0.09] }],
  schienbein: [{ Y: [0.13, 0.425], ang: [42, 122], rb: [0, 0.09] }]
};

// Liefert [Index in MID, s]: s > 0 innerhalb der Fläche (Abstand zur Kante in Metern)
export function region(x, y, z) {
  const f = rahmen(x, y, z);
  let best = -1, id = 0;
  for (let m = 1; m < MID.length; m++) {
    for (const box of REGELN[MID[m]]) {
      let L = 0, M = -1e9;
      for (const k in box) {
        const g = f[k], [lo, hi] = box[k], s = MASS[k];
        const q1 = RUND - (g - lo) * s, q2 = RUND - (hi - g) * s;
        const a1 = max(q1, 0), a2 = max(q2, 0);
        L += a1 * a1 + a2 * a2; M = max(M, q1, q2);
      }
      const sb = -(sqrt(L) + min(M, 0) - RUND);
      if (sb > best) { best = sb; id = m; }
    }
  }
  return [id, best];
}

// Dieselbe Rechnung als GLSL-Code für den Grafikchip (wird aus REGELN erzeugt)
const zahl = (v) => { const s = String(Math.round(v * 1e6) / 1e6); return s.includes('.') || s.includes('e') ? s : s + '.0'; };
export function regionGLSL() {
  const k = RUMPF;
  let s = 'float rumpfC(float y){\n';
  for (let i = 0; i < k.length - 1; i++) s += `  if (y < ${zahl(k[i + 1][0])}) return mix(${zahl(k[i][3])}, ${zahl(k[i + 1][3])}, clamp((y - ${zahl(k[i][0])}) / ${zahl(k[i + 1][0] - k[i][0])}, 0.0, 1.0));\n`;
  s += `  return ${zahl(k[k.length - 1][3])};\n}\n`;
  s += `vec2 region(vec3 p){
  float X = abs(p.x), Y = p.y, Z = p.z;
  float t = ((X - ${zahl(ARM.sx)}) * ${zahl(ARM.dx)} + (Y - ${zahl(ARM.sy)}) * ${zahl(ARM.dy)}) / ${zahl(ARM.L * ARM.L)};
  float d = ((X - ${zahl(ARM.sx)}) * ${zahl(-ARM.dy)} + (Y - ${zahl(ARM.sy)}) * ${zahl(ARM.dx)}) / ${zahl(ARM.L)};
  float bx = Y > 0.47 ? 0.098 + (-0.006) * min(1.0, (Y - 0.47) / 0.41) : 0.099;
  float u = X - bx, v = Z;
  float ang = degrees(atan(v, u)), aang = abs(ang), rb = sqrt(u * u + v * v);
  float Zr = Z - rumpfC(Y);
  float best = -1.0, id = 0.0, q, a, L, M, sb;
`;
  for (let m = 1; m < MID.length; m++) {
    for (const box of REGELN[MID[m]]) {
      s += '  L = 0.0; M = -1e9;\n';
      for (const key in box) {
        const [lo, hi] = box[key], sc = MASS[key];
        s += `  q = ${zahl(RUND)} - (${key} - ${zahl(lo)}) * ${zahl(sc)}; a = max(q, 0.0); L += a * a; M = max(M, q);\n`;
        s += `  q = ${zahl(RUND)} - (${zahl(hi)} - ${key}) * ${zahl(sc)}; a = max(q, 0.0); L += a * a; M = max(M, q);\n`;
      }
      s += `  sb = -(sqrt(L) + min(M, 0.0) - ${zahl(RUND)}); if (sb > best) { best = sb; id = ${zahl(m)}; }\n`;
    }
  }
  s += '  return vec2(id, best);\n}\n';
  return s;
}

// ---------- Netz ----------
export function bauFigur(h = 0.0095) {
  const x0 = -0.36, y0 = -0.01, z0 = -0.16;
  const nx = Math.ceil(0.72 / h), ny = Math.ceil(1.79 / h), nz = Math.ceil(0.34 / h);
  const NX = nx + 1, NY = ny + 1, NZ = nz + 1, NXY = NX * NY;
  const g = new Float32Array(NX * NY * NZ);
  for (let k = 0, o = 0; k < NZ; k++) for (let j = 0; j < NY; j++) for (let i = 0; i < NX; i++, o++) g[o] = sdf(x0 + i * h, y0 + j * h, z0 + k * h);
  const cv = new Int32Array(nx * ny * nz).fill(-1);
  const P = [];
  const co = [0, 1, NX, NX + 1, NXY, NXY + 1, NXY + NX, NXY + NX + 1];
  const ed = [0, 1, 2, 3, 4, 5, 6, 7, 0, 2, 1, 3, 4, 6, 5, 7, 0, 4, 1, 5, 2, 6, 3, 7];
  const v = new Float32Array(8);
  for (let k = 0; k < nz; k++) for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
    const b = i + NX * j + NXY * k;
    let mask = 0;
    for (let c = 0; c < 8; c++) { v[c] = g[b + co[c]]; if (v[c] < 0) mask |= 1 << c; }
    if (mask === 0 || mask === 255) continue;
    let sx = 0, sy = 0, sz = 0, n = 0;
    for (let e = 0; e < 24; e += 2) {
      const a = ed[e], c = ed[e + 1];
      if ((v[a] < 0) === (v[c] < 0)) continue;
      const tt = v[a] / (v[a] - v[c]);
      const ax = a & 1, ay = (a >> 1) & 1, az = (a >> 2) & 1;
      sx += ax + tt * ((c & 1) - ax); sy += ay + tt * (((c >> 1) & 1) - ay); sz += az + tt * (((c >> 2) & 1) - az); n++;
    }
    cv[i + nx * (j + ny * k)] = P.length / 3;
    P.push(x0 + (i + sx / n) * h, y0 + (j + sy / n) * h, z0 + (k + sz / n) * h);
  }
  const T = [];
  const cid = (i, j, k) => cv[i + nx * (j + ny * k)];
  const quad = (a, b, c, d, flip) => { if (a < 0 || b < 0 || c < 0 || d < 0) return; if (flip) T.push(a, c, b, a, d, c); else T.push(a, b, c, a, c, d); };
  for (let k = 1; k < nz; k++) for (let j = 1; j < ny; j++) for (let i = 1; i < nx; i++) {
    const b = i + NX * j + NXY * k, s0 = g[b] < 0;
    if (s0 !== (g[b + 1] < 0)) quad(cid(i, j - 1, k - 1), cid(i, j, k - 1), cid(i, j, k), cid(i, j - 1, k), !s0);
    if (s0 !== (g[b + NX] < 0)) quad(cid(i - 1, j, k - 1), cid(i - 1, j, k), cid(i, j, k), cid(i, j, k - 1), !s0);
    if (s0 !== (g[b + NXY] < 0)) quad(cid(i - 1, j - 1, k), cid(i, j - 1, k), cid(i, j, k), cid(i - 1, j, k), !s0);
  }
  const n = P.length / 3;
  const Pf = new Float32Array(P), N = new Float32Array(n * 3), M = new Uint8Array(n), A = new Float32Array(n);
  const e = 0.003, cy = new Float32Array(18), cnx = new Float32Array(18), cnz = new Float32Array(18), cn = new Float32Array(18);
  for (let i = 0; i < n; i++) {
    let x = Pf[3 * i], y = Pf[3 * i + 1], z = Pf[3 * i + 2];
    let gx = sdf(x + e, y, z) - sdf(x - e, y, z), gy = sdf(x, y + e, z) - sdf(x, y - e, z), gz = sdf(x, y, z + e) - sdf(x, y, z - e);
    const l = sqrt(gx * gx + gy * gy + gz * gz) || 1;
    gx /= l; gy /= l; gz /= l;
    const d0 = sdf(x, y, z);
    x -= gx * d0; y -= gy * d0; z -= gz * d0;
    Pf[3 * i] = x; Pf[3 * i + 1] = y; Pf[3 * i + 2] = z;
    N[3 * i] = gx; N[3 * i + 1] = gy; N[3 * i + 2] = gz;
    const [m, s] = region(x, y, z);
    M[i] = s > 0 ? m : 0;
    let occ = 0;
    occ += max(0, 0.02 - sdf(x + gx * 0.02, y + gy * 0.02, z + gz * 0.02)) / 0.02;
    occ += max(0, 0.05 - sdf(x + gx * 0.05, y + gy * 0.05, z + gz * 0.05)) / 0.05;
    A[i] = 1 - min(0.4, occ * 0.22);
    if (M[i] && x > 0) { cy[M[i]] += y; cnx[M[i]] += gx; cnz[M[i]] += gz; cn[M[i]]++; }
  }
  const fy = [], fyaw = [];
  for (let m = 0; m < 18; m++) { fy.push(cn[m] ? cy[m] / cn[m] : 0.9); fyaw.push(cn[m] ? Math.atan2(-cnx[m] * 0.6, cnz[m]) : 0); }
  return { P: Pf, N, M, A, T: new Uint32Array(T), n, fy, fyaw, figur: true };
}
