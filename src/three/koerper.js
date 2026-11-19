// Muskelkarte · Körper aus dem Anatomie-Modell
//
// src/data/koerper.bin enthält die Haut eines anatomischen Körpers und für jeden Hautpunkt den Abstand
// zur Grenze jeder Muskelfläche, gemessen auf der Haut (innen negativ). Erzeugt mit
// tools/koerper-umrechnen.mjs aus open-anatomy-3d / BodyParts3D: Jeder Hautpunkt gehört zur Muskelgruppe,
// die direkt darunter liegt; liegt kein Muskel nah genug darunter (Kopf, Hände, Knie …), ist er neutral.
// Pro Bildpunkt gewinnt die Gruppe mit dem kleinsten Wert, dadurch werden die Kanten scharf und rund.
//
// Dateiformat (Little Endian):
//   'MK3D', u32 Version, u32 Punkte n, u32 Dreiecke, f32 min[3], f32 Größe[3]
//   u16 Position[n*3] (auf den Quader skaliert), i8 Normale[n*3], u8 Abstand[n*18] (-DMAX..DMAX),
//   u16 Dreiecke[*3]; jeder Block beginnt auf einer durch 4 teilbaren Stelle.

export const NG = 18;           // 0 = neutral, 1–17 wie MID in figur.js
export const DMAX = 0.06;       // größter gespeicherter Abstand in Metern
export const FUGE = 0.0025;     // halbe Breite der Fuge zwischen zwei Flächen

const pad4 = (o) => (o + 3) & ~3;

export function schreibeKoerper({ P, N, D, T, n }) {
  const mn = [1e9, 1e9, 1e9], mx = [-1e9, -1e9, -1e9];
  for (let i = 0; i < n; i++) for (let k = 0; k < 3; k++) { mn[k] = Math.min(mn[k], P[3 * i + k]); mx[k] = Math.max(mx[k], P[3 * i + k]); }
  const gr = mx.map((v, k) => v - mn[k]);
  const nt = T.length / 3;
  const oP = 40, oN = pad4(oP + n * 6), oD = pad4(oN + n * 3), oT = pad4(oD + n * NG), ende = oT + nt * 6;
  const buf = new ArrayBuffer(ende), dv = new DataView(buf);
  [77, 75, 51, 68].forEach((b, i) => dv.setUint8(i, b));
  dv.setUint32(4, 1, true); dv.setUint32(8, n, true); dv.setUint32(12, nt, true);
  for (let k = 0; k < 3; k++) { dv.setFloat32(16 + 4 * k, mn[k], true); dv.setFloat32(28 + 4 * k, gr[k], true); }
  const qp = new Uint16Array(buf, oP, n * 3), qn = new Int8Array(buf, oN, n * 3), qd = new Uint8Array(buf, oD, n * NG), qt = new Uint16Array(buf, oT, nt * 3);
  for (let i = 0; i < n * 3; i++) { const k = i % 3; qp[i] = Math.round((P[i] - mn[k]) / gr[k] * 65535); qn[i] = Math.round(N[i] * 127); }
  for (let i = 0; i < n * NG; i++) qd[i] = Math.round(Math.max(0, Math.min(1, (D[i] + DMAX) / (2 * DMAX))) * 255);
  if (n > 65535) throw new Error('Zu viele Punkte für 16-Bit-Indizes');
  qt.set(T);
  return new Uint8Array(buf);
}

// Gewinnende Gruppe aus den 18 Werten: [id, s] mit s > 0 innerhalb der Fläche (Meter bis zur Fuge)
export function regionAus(d, o = 0) {
  let i1 = 0, d1 = 1e9, d2 = 1e9;
  for (let g = 0; g < NG; g++) {
    const v = d[o + g];
    if (v < d1) { d2 = d1; d1 = v; i1 = g; } else if (v < d2) d2 = v;
  }
  if (i1 === 0) return [0, -1];
  return [i1, (d2 - d1) * 0.5 - FUGE];
}

// Datei lesen → Netz wie bauFigur() es liefert, dazu D (Abstände je Punkt, Float32)
export function ladeKoerper(bytes) {
  const buf = bytes.buffer || bytes, b0 = bytes.byteOffset || 0;
  const dv = new DataView(buf, b0);
  if (String.fromCharCode(dv.getUint8(0), dv.getUint8(1), dv.getUint8(2), dv.getUint8(3)) !== 'MK3D') throw new Error('Keine Körperdatei');
  const n = dv.getUint32(8, true), nt = dv.getUint32(12, true);
  const mn = [0, 1, 2].map((k) => dv.getFloat32(16 + 4 * k, true)), gr = [0, 1, 2].map((k) => dv.getFloat32(28 + 4 * k, true));
  const oP = 40, oN = pad4(oP + n * 6), oD = pad4(oN + n * 3), oT = pad4(oD + n * NG);
  const qp = new Uint16Array(buf, b0 + oP, n * 3), qn = new Int8Array(buf, b0 + oN, n * 3), qd = new Uint8Array(buf, b0 + oD, n * NG);
  const P = new Float32Array(n * 3), N = new Float32Array(n * 3), D = new Float32Array(n * NG);
  for (let i = 0; i < n * 3; i++) { const k = i % 3; P[i] = mn[k] + qp[i] / 65535 * gr[k]; N[i] = qn[i] / 127; }
  for (let i = 0; i < n; i++) { const l = Math.hypot(N[3 * i], N[3 * i + 1], N[3 * i + 2]) || 1; N[3 * i] /= l; N[3 * i + 1] /= l; N[3 * i + 2] /= l; }
  for (let i = 0; i < n * NG; i++) D[i] = qd[i] / 255 * 2 * DMAX - DMAX;
  const T = new Uint16Array(nt * 3);
  T.set(new Uint16Array(buf, b0 + oT, nt * 3));
  // Muskel je Punkt (fürs Antippen), Kamera-Ziel je Gruppe (Höhe und Blickrichtung)
  const M = new Uint8Array(n), A = new Float32Array(n).fill(1);
  const cy = new Float32Array(NG), cnx = new Float32Array(NG), cnz = new Float32Array(NG), cn = new Float32Array(NG);
  for (let i = 0; i < n; i++) {
    const [m, s] = regionAus(D, i * NG);
    M[i] = s > 0 ? m : 0;
    if (M[i] && P[3 * i] > 0) { cy[m] += P[3 * i + 1]; cnx[m] += N[3 * i]; cnz[m] += N[3 * i + 2]; cn[m]++; }
  }
  const fy = [], fyaw = [];
  for (let m = 0; m < NG; m++) { fy.push(cn[m] ? cy[m] / cn[m] : 0.9); fyaw.push(cn[m] ? Math.atan2(-cnx[m] * 0.6, cnz[m]) : 0); }
  return { P, N, M, A, T, D, n, fy, fyaw, figur: true, modell: true };
}
