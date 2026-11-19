// Muskelkarte · Körpermodell umrechnen
//
// Nimmt das Männer-Modell aus open-anatomy-3d (CC BY 4.0, Grundlage BodyParts3D © DBCLS, CC BY 4.0)
// und erzeugt daraus src/data/koerper.bin: die Haut als Körperoberfläche und für jeden Hautpunkt den
// Abstand zu jeder der 17 Muskelgruppen der App. Beim Zeichnen gewinnt pro Bildpunkt die nächste
// Gruppe, dadurch entstehen glatte, anatomisch richtige Flächen.
//
// Einmalig nötig (nicht Teil der App):
//   npm i --no-save @gltf-transform/core@4 @gltf-transform/extensions@4 meshoptimizer@0.22
//   curl -L -o anatomy-male.glb https://cdn.jsdelivr.net/npm/open-anatomy-3d@0.1.0/models/anatomy-male.glb
//   node tools/koerper-umrechnen.mjs anatomy-male.glb
//
// Die Zuordnung der Modellteile zu den Muskelgruppen steht in GRUPPEN (weiter unten).

import { writeFileSync } from 'node:fs';
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder } from 'meshoptimizer';
import { MID } from '../src/three/figur.js';
import { DMAX, schreibeKoerper } from '../src/three/koerper.js';

const NAH = 0.045; // so tief darf ein Muskel höchstens unter der Haut liegen, sonst bleibt die Haut neutral

const quelle = process.argv[2];
const ziel = process.argv[3] || new URL('../src/data/koerper.bin', import.meta.url);
if (!quelle) { console.error('Aufruf: node tools/koerper-umrechnen.mjs anatomy-male.glb'); process.exit(1); }

await MeshoptDecoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder });
const doc = await io.read(quelle);
const szene = doc.getRoot().getDefaultScene() || doc.getRoot().listScenes()[0];

// Alle Netze mit Weltkoordinaten einsammeln: name → { P (Float32), T (Uint32) }
const teile = new Map();
function lies(knoten) {
  const m = knoten.getMesh();
  if (m) {
    const w = knoten.getWorldMatrix(), P = [], T = [];
    for (const prim of m.listPrimitives()) {
      const pos = prim.getAttribute('POSITION'), idx = prim.getIndices(), o = P.length / 3, v = [0, 0, 0];
      for (let i = 0; i < pos.getCount(); i++) {
        pos.getElement(i, v);
        P.push(w[0] * v[0] + w[4] * v[1] + w[8] * v[2] + w[12], w[1] * v[0] + w[5] * v[1] + w[9] * v[2] + w[13], w[2] * v[0] + w[6] * v[1] + w[10] * v[2] + w[14]);
      }
      const k = idx ? idx.getCount() : pos.getCount();
      for (let i = 0; i < k; i++) T.push(o + (idx ? idx.getScalar(i) : i));
    }
    teile.set(knoten.getName(), { P: new Float32Array(P), T: new Uint32Array(T), sys: knoten.getParentNode()?.getName() });
  }
  for (const c of knoten.listChildren()) lies(c);
}
for (const k of szene.listChildren()) lies(k);

// ---------- Zuordnung ----------
// Jeder Punkt eines Modellteils wird einer Gruppe zugeordnet (Name aus MID oder 'neutral').
// 'neutral' sind Knochen, Hände, Füße usw.: Haut darüber bleibt ohne Muskelfläche.
// Wo das Modell mehrere App-Gruppen in einem Teil zusammenfasst, teilt eine Regel nach Lage.
const B = (name) => name.replace(/_[lr]$/, '');
const ohneSeite = (x) => Math.abs(x);
function armMitte(name) {
  // Mitte des Oberarms je Höhe (2-cm-Scheiben), um vorn (Bizeps) und hinten (Trizeps) zu trennen
  const t = teile.get(name), sum = new Map();
  for (let i = 0; i < t.P.length; i += 3) { const k = Math.round(t.P[i + 1] / 0.02); const s = sum.get(k) || [0, 0]; s[0] += t.P[i + 2]; s[1]++; sum.set(k, s); }
  return (y) => { const s = sum.get(Math.round(y / 0.02)); return s ? s[0] / s[1] : -0.035; };
}
const mitte = { upper_arm_muscles_l: armMitte('upper_arm_muscles_l'), upper_arm_muscles_r: armMitte('upper_arm_muscles_r') };

const GRUPPEN = {
  neck_muscles: () => 'nacken',
  trapezius: (x, y) => (y > 1.43 ? 'nacken' : 'oruecken'),
  back_muscles: (x, y) => (y > 1.45 ? 'nacken' : y > 1.16 ? 'oruecken' : 'uruecken'),
  deltoid: () => 'schultern',
  rotator_cuff: () => 'schultern',
  shoulder_muscles: (x, y, z) => (z < -0.035 ? 'oruecken' : 'neutral'), // Rautenmuskeln, großer Rundmuskel hinten; Sägemuskel vorn
  chest_muscles: () => 'brust',
  upper_arm_muscles: (x, y, z, name) => (z > mitte[name](y) ? 'bizeps' : 'trizeps'),
  forearm_muscles: (x, y) => (y > 0.95 ? 'unterarme' : 'neutral'), // Sehnen in der Hand nicht mitfärben
  abdominal_muscles: (x, y, z) => (ohneSeite(x) < 0.068 && z > 0.03 ? 'bauch' : 'seitbauch'),
  gluteal: (x, y, z) => (y > 0.80 && z < 0.01 ? 'gesaess' : null), // Tractus iliotibialis und Spanner vorn weglassen
  iliopsoas: (x, y, z) => (z > -0.01 ? 'hueftbeuger' : null), // nur von vorn sichtbar
  quadriceps: (x, y) => (y > 0.53 ? 'quad' : 'neutral'), // Sehne über der Kniescheibe neutral
  hamstrings: () => 'hams',
  adductors: () => 'addu',
  calf: (x, y) => (y > 0.10 ? 'waden' : 'neutral'), // Achillessehne an der Ferse neutral
  shin_muscles: (x, y) => (y > 0.10 ? 'schienbein' : 'neutral'), // Sehnen auf dem Fußrücken neutral
  hand_muscles: () => 'neutral',
  foot_muscles: () => 'neutral',
  intercostals: () => 'neutral'
};
// Knochen liegen meist tiefer als Muskeln; sie zählen nur, wo kein Muskel näher ist (z. B. Schienbeinkante, Knie, Kopf)
const KNOCHEN_ZUSCHLAG = 0.008;
// Tief liegende Gruppen etwas „anheben“, damit sie an der Haut sichtbar werden
const BONUS = { hueftbeuger: 0.026 };

const NG = 18; // 0 = neutral, 1–17 = MID
const gruppeNr = (g) => (g === 'neutral' ? 0 : MID.indexOf(g));

// Stichpunkte: alle Eckpunkte und Dreiecksmitten, mit Gruppe und Zuschlag
const SP = [], SG = [], SZ = [];
const anzahl = new Array(NG).fill(0);
for (const [name, t] of teile) {
  let regel = null, zuschlag = 0;
  if (t.sys === 'muscles') regel = GRUPPEN[B(name)];
  else if (t.sys === 'skeleton') { regel = () => 'neutral'; zuschlag = KNOCHEN_ZUSCHLAG; }
  if (!regel) continue;
  const add = (x, y, z) => {
    const g = regel(x, y, z, name);
    if (g == null) return;
    const nr = gruppeNr(g);
    if (nr < 0) throw new Error(`Unbekannte Gruppe ${g}`);
    SP.push(x, y, z); SG.push(nr); SZ.push(zuschlag - (BONUS[g] || 0)); anzahl[nr]++;
  };
  for (let i = 0; i < t.P.length; i += 3) add(t.P[i], t.P[i + 1], t.P[i + 2]);
  for (let i = 0; i < t.T.length; i += 3) {
    const a = t.T[i] * 3, b = t.T[i + 1] * 3, c = t.T[i + 2] * 3;
    add((t.P[a] + t.P[b] + t.P[c]) / 3, (t.P[a + 1] + t.P[b + 1] + t.P[c + 1]) / 3, (t.P[a + 2] + t.P[b + 2] + t.P[c + 2]) / 3);
  }
}
console.log('Stichpunkte je Gruppe:', Object.fromEntries(anzahl.map((n, i) => [i ? MID[i] : 'neutral', n])));

// ---------- Haut: Punkte verschweißen, Normalen berechnen ----------
const haut = teile.get('skin');
const schweiss = new Map(), P = [], remap = new Uint32Array(haut.P.length / 3);
for (let i = 0; i < remap.length; i++) {
  const x = haut.P[3 * i], y = haut.P[3 * i + 1], z = haut.P[3 * i + 2];
  const k = `${Math.round(x * 1e5)},${Math.round(y * 1e5)},${Math.round(z * 1e5)}`;
  let j = schweiss.get(k);
  if (j == null) { j = P.length / 3; schweiss.set(k, j); P.push(x, y, z); }
  remap[i] = j;
}
let T0 = [];
for (let i = 0; i < haut.T.length; i += 3) {
  const a = remap[haut.T[i]], b = remap[haut.T[i + 1]], c = remap[haut.T[i + 2]];
  if (a !== b && b !== c && a !== c) T0.push(a, b, c);
}
// Die Haut im Modell ist eine dünne Schale (außen und innen, ca. 3 mm Abstand). Nur die äußere Schicht
// behalten: Dreiecke, die aus mindestens einer von 96 Blickrichtungen sichtbar sind.
{
  const RES = 1400, sichtbar = new Uint8Array(T0.length / 3), zb = new Float32Array(RES * RES), tb = new Int32Array(RES * RES);
  const NR = 96;
  for (let r = 0; r < NR; r++) {
    const y = 1 - (2 * r + 1) / NR, rad = Math.sqrt(1 - y * y), phi = r * Math.PI * (3 - Math.sqrt(5));
    const d = [Math.cos(phi) * rad, y, Math.sin(phi) * rad];
    const u = Math.abs(d[1]) < 0.9 ? [d[2], 0, -d[0]] : [1, 0, 0];
    let l = Math.hypot(...u); u[0] /= l; u[1] /= l; u[2] /= l;
    const v = [d[1] * u[2] - d[2] * u[1], d[2] * u[0] - d[0] * u[2], d[0] * u[1] - d[1] * u[0]];
    zb.fill(-1e9); tb.fill(-1);
    const S = 0.92 / RES * 2, pr = (i) => { const x = P[3 * i], yy = P[3 * i + 1] - 0.86, z = P[3 * i + 2]; return [(x * u[0] + yy * u[1] + z * u[2]) / S + RES / 2, (x * v[0] + yy * v[1] + z * v[2]) / S + RES / 2, x * d[0] + yy * d[1] + z * d[2]]; };
    for (let t = 0; t < T0.length; t += 3) {
      const A = pr(T0[t]), B = pr(T0[t + 1]), C = pr(T0[t + 2]);
      const area = (B[0] - A[0]) * (C[1] - A[1]) - (C[0] - A[0]) * (B[1] - A[1]);
      if (Math.abs(area) < 1e-9) continue;
      const x0 = Math.max(0, Math.floor(Math.min(A[0], B[0], C[0]))), x1 = Math.min(RES - 1, Math.ceil(Math.max(A[0], B[0], C[0])));
      const y0 = Math.max(0, Math.floor(Math.min(A[1], B[1], C[1]))), y1 = Math.min(RES - 1, Math.ceil(Math.max(A[1], B[1], C[1])));
      for (let py = y0; py <= y1; py++) for (let px = x0; px <= x1; px++) {
        const fx = px + 0.5, fy = py + 0.5;
        const w0 = ((B[0] - fx) * (C[1] - fy) - (C[0] - fx) * (B[1] - fy)) / area, w1 = ((C[0] - fx) * (A[1] - fy) - (A[0] - fx) * (C[1] - fy)) / area, w2 = 1 - w0 - w1;
        if (w0 < 0 || w1 < 0 || w2 < 0) continue;
        const z = w0 * A[2] + w1 * B[2] + w2 * C[2], o = py * RES + px;
        if (z > zb[o]) { zb[o] = z; tb[o] = t / 3; }
      }
    }
    for (let o = 0; o < tb.length; o++) if (tb[o] >= 0) sichtbar[tb[o]] = 1;
  }
  const T1 = [];
  for (let t = 0; t < sichtbar.length; t++) if (sichtbar[t]) T1.push(T0[3 * t], T0[3 * t + 1], T0[3 * t + 2]);
  console.log(`Außenhaut: ${T1.length / 3} von ${T0.length / 3} Dreiecken`);
  T0 = T1;
}
// Unbenutzte Punkte entfernen
const neuNr = new Int32Array(P.length / 3).fill(-1), P2 = [], T = [];
for (const i of T0) { if (neuNr[i] < 0) { neuNr[i] = P2.length / 3; P2.push(P[3 * i], P[3 * i + 1], P[3 * i + 2]); } T.push(neuNr[i]); }
P.length = 0; for (const v of P2) P.push(v);
const n = P.length / 3;
const N = new Float32Array(n * 3);
for (let i = 0; i < T.length; i += 3) {
  const a = T[i] * 3, b = T[i + 1] * 3, c = T[i + 2] * 3;
  const ux = P[b] - P[a], uy = P[b + 1] - P[a + 1], uz = P[b + 2] - P[a + 2];
  const vx = P[c] - P[a], vy = P[c + 1] - P[a + 1], vz = P[c + 2] - P[a + 2];
  const nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx; // flächengewichtet
  for (const o of [a, b, c]) { N[o] += nx; N[o + 1] += ny; N[o + 2] += nz; }
}
for (let i = 0; i < n; i++) { const l = Math.hypot(N[3 * i], N[3 * i + 1], N[3 * i + 2]) || 1; N[3 * i] /= l; N[3 * i + 1] /= l; N[3 * i + 2] /= l; }
// Außen? Die Normalen sollen nach außen zeigen (Brust: z > 0)
let aussen = 0;
for (let i = 0; i < n; i++) aussen += P[3 * i] * N[3 * i] + P[3 * i + 2] * N[3 * i + 2];
if (aussen < 0) { for (let i = 0; i < N.length; i++) N[i] = -N[i]; for (let i = 0; i < T.length; i += 3) { const t = T[i + 1]; T[i + 1] = T[i + 2]; T[i + 2] = t; } }

// ---------- Abstände: Raster mit allen Stichpunkten ----------
const Z = 0.015, R = Math.ceil(DMAX / Z);
const raster = new Map();
const zk = (i, j, k) => (i + 512) * 1048576 + (j + 512) * 1024 + (k + 512);
for (let p = 0; p < SG.length; p++) {
  const key = zk(Math.floor(SP[3 * p] / Z), Math.floor(SP[3 * p + 1] / Z), Math.floor(SP[3 * p + 2] / Z));
  let l = raster.get(key); if (!l) raster.set(key, (l = [])); l.push(p);
}
const D = new Float32Array(n * NG);
const t0 = Date.now();
for (let v = 0; v < n; v++) {
  const x = P[3 * v], y = P[3 * v + 1], z = P[3 * v + 2];
  const best = new Float32Array(NG).fill(DMAX);
  const ci = Math.floor(x / Z), cj = Math.floor(y / Z), ck = Math.floor(z / Z);
  for (let i = -R; i <= R; i++) for (let j = -R; j <= R; j++) for (let k = -R; k <= R; k++) {
    const l = raster.get(zk(ci + i, cj + j, ck + k));
    if (!l) continue;
    for (const p of l) {
      const dx = SP[3 * p] - x, dy = SP[3 * p + 1] - y, dz = SP[3 * p + 2] - z;
      const d = Math.sqrt(dx * dx + dy * dy + dz * dz) + SZ[p], g = SG[p];
      if (d < best[g]) best[g] = d;
    }
  }
  for (let g = 0; g < NG; g++) D[v * NG + g] = Math.max(0, best[g]);
}
console.log(`Abstände für ${n} Hautpunkte in ${((Date.now() - t0) / 1000).toFixed(1)} s`);

// ---------- Flächen auf der Haut ----------
// Nachbarn je Punkt mit Kantenlänge
const nb = Array.from({ length: n }, () => new Map());
for (let i = 0; i < T.length; i += 3) for (let e = 0; e < 3; e++) {
  const a = T[i + e], b = T[i + (e + 1) % 3];
  const l = Math.hypot(P[3 * a] - P[3 * b], P[3 * a + 1] - P[3 * b + 1], P[3 * a + 2] - P[3 * b + 2]);
  nb[a].set(b, l); nb[b].set(a, l);
}
// Weichzeichnen je Feld (Mittel mit den Nachbarn), mehrmals
function glaette(F, mal) {
  for (let it = 0; it < mal; it++) {
    const neu = F.slice();
    for (let v = 0; v < n; v++) {
      let w = 1;
      for (const u of nb[v].keys()) { w++; for (let g = 0; g < NG; g++) neu[v * NG + g] += F[u * NG + g]; }
      for (let g = 0; g < NG; g++) neu[v * NG + g] /= w;
    }
    F.set(neu);
  }
}
// 1. Rohabstände beruhigen, dann bekommt jeder Hautpunkt die nächste Gruppe; liegt kein Muskel nah genug darunter: neutral.
glaette(D, 6);
const lab = new Uint8Array(n);
for (let v = 0; v < n; v++) {
  let g1 = 0, d1 = 1e9;
  for (let g = 0; g < NG; g++) if (D[v * NG + g] < d1) { d1 = D[v * NG + g]; g1 = g; }
  lab[v] = d1 <= NAH ? g1 : 0;
  const x = P[3 * v], y = P[3 * v + 1], z = P[3 * v + 2];
  if (y > 1.595) lab[v] = 0; // Kopf
  // Der breite Rückenmuskel (Latissimus) fehlt im Modell: die Haut darüber zum oberen bzw. unteren Rücken
  if (lab[v] === 0 && z < -0.02 && y > 0.98 && y < 1.42 && Math.abs(x) < 0.17) lab[v] = MID.indexOf(y > 1.16 ? 'oruecken' : 'uruecken');
}
// 2. Ausfransungen glätten: mehrmals die häufigste Gruppe in der Nachbarschaft übernehmen
for (let it = 0; it < 6; it++) {
  const neu = lab.slice();
  for (let v = 0; v < n; v++) {
    const z = new Map([[lab[v], 1.5]]);
    for (const u of nb[v].keys()) z.set(lab[u], (z.get(lab[u]) || 0) + 1);
    let bg = lab[v], bz = 0;
    for (const [g, k] of z) if (k > bz) { bz = k; bg = g; }
    neu[v] = bg;
  }
  lab.set(neu);
}
// 3. Kleine Inseln (unter 25 Punkten) der umgebenden Gruppe zuschlagen
{
  const komp = new Int32Array(n).fill(-1);
  for (let s = 0; s < n; s++) {
    if (komp[s] >= 0) continue;
    const liste = [s]; komp[s] = s;
    for (let q = 0; q < liste.length; q++) for (const u of nb[liste[q]].keys()) if (komp[u] < 0 && lab[u] === lab[s]) { komp[u] = s; liste.push(u); }
    if (liste.length < 25) {
      const z = new Map();
      for (const v of liste) for (const u of nb[v].keys()) if (lab[u] !== lab[s]) z.set(lab[u], (z.get(lab[u]) || 0) + 1);
      let bg = lab[s], bz = 0;
      for (const [g, k] of z) if (k > bz) { bz = k; bg = g; }
      for (const v of liste) lab[v] = bg;
    }
  }
}
// 4. Je Gruppe ein vorzeichenbehafteter Abstand auf der Haut zur Grenze (innen negativ), per Dijkstra
const SD = new Float32Array(n * NG);
for (let g = 0; g < NG; g++) {
  const dist = new Float32Array(n).fill(DMAX), fertig = new Uint8Array(n), heap = [];
  const push = (v, d) => { heap.push([d, v]); let i = heap.length - 1; while (i > 0) { const p = (i - 1) >> 1; if (heap[p][0] <= heap[i][0]) break; [heap[p], heap[i]] = [heap[i], heap[p]]; i = p; } };
  const pop = () => { const top = heap[0], last = heap.pop(); if (heap.length) { heap[0] = last; let i = 0; for (;;) { const l = 2 * i + 1, r = l + 1; let m = i; if (l < heap.length && heap[l][0] < heap[m][0]) m = l; if (r < heap.length && heap[r][0] < heap[m][0]) m = r; if (m === i) break; [heap[m], heap[i]] = [heap[i], heap[m]]; i = m; } } return top; };
  for (let v = 0; v < n; v++) for (const [u, l] of nb[v]) if ((lab[u] === g) !== (lab[v] === g) && l / 2 < dist[v]) { dist[v] = l / 2; }
  for (let v = 0; v < n; v++) if (dist[v] < DMAX) push(v, dist[v]);
  while (heap.length) {
    const [d, v] = pop();
    if (fertig[v] || d > dist[v]) continue;
    fertig[v] = 1;
    for (const [u, l] of nb[v]) if (d + l < dist[u]) { dist[u] = d + l; push(u, dist[u]); }
  }
  for (let v = 0; v < n; v++) SD[v * NG + g] = lab[v] === g ? -dist[v] : dist[v];
}
// 5. Weichzeichnen, damit die Grenzen rund statt treppig verlaufen
glaette(SD, 16);

const buf = schreibeKoerper({ P: new Float32Array(P), N, D: SD, T: new Uint32Array(T), n });
writeFileSync(ziel, buf);
console.log(`Geschrieben: ${ziel} (${(buf.byteLength / 1024).toFixed(0)} KB, ${n} Punkte, ${T.length / 3} Dreiecke)`);
