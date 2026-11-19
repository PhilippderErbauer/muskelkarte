// Muskelkarte · Übungen, Themen und fertige Routinen
//
// Eine Übung:
//   n Name, m Trainingsart, h Hauptmuskeln, nb Nebenmuskeln, eq Equipment, lv Level (1–3),
//   min Dauer in Minuten, dos Dosierung ({ typ: 'zeit', sek, s } oder { typ: 'wdh', n, s }),
//   seiten true, wenn je Seite geübt wird, st Schritte, f typische Fehler, le leichter, sw schwerer,
//   an Animation (Format: siehe src/three/puppe.js)

import { MODI } from './muskeln.js';

// --- Posen-Bausteine (Seitenansicht, Boden bei y = 150) ---
const X = (b, o) => b.slice(0, 18).concat(o.l2 || b.slice(8, 14), o.a2 || b.slice(14, 18), o.lt || []);
const S = [120, 28, 120, 44, 120, 64, 120, 86, 119, 118, 118, 150, 132, 150, 121, 68, 123, 90];
const sitz = [101, 60, 100, 76, 100, 97, 100, 118, 134, 118, 134, 150, 148, 150, 106, 98, 122, 110];
const wandStand = [101, 28, 100, 44, 100, 65, 100, 86, 112, 118, 124, 150, 138, 150, 102, 68, 104, 90];
const hocke = [128, 63, 122, 78, 112, 96, 104, 116, 138, 122, 118, 150, 132, 150, 144, 84, 166, 82];
const liegt = [52, 140, 68, 142, 89, 143, 110, 142, 136, 120, 150, 150, 164, 150, 90, 147, 112, 148];
const bruecke = [52, 140, 68, 142, 90, 131, 112, 118, 145, 117, 150, 150, 164, 150, 90, 147, 112, 148];
const brettA = [182, 113, 166, 119, 145, 123, 124, 127, 92, 134, 60, 140, 58, 150, 166, 146, 188, 147];
const brettB = [182, 112, 166, 119, 145, 121.5, 124, 125, 92, 133, 60, 140, 58, 150, 166, 146, 188, 147];
const stuetzOben = [178, 100, 162, 107, 142, 114, 122, 121, 91, 131, 60, 140, 58, 150, 163, 128, 164, 150];
const stuetzUnten = [182, 130, 166, 134, 148, 136, 130, 137, 95, 139, 60, 141, 58, 150, 145, 139, 164, 150];
const zehen = [120, 21, 120, 37, 120, 57, 120, 79, 119, 111, 118, 143, 132, 150, 121, 61, 123, 83];
const bauchlage = [182, 140, 166, 143, 145, 144, 124, 145, 92, 146, 60, 146, 52, 148, 188, 145, 210, 146];
const superman = [180, 126, 165, 134, 145, 141, 124, 145, 92, 141, 60, 134, 52, 133, 187, 130, 208, 124];
const knieA = [120, 58, 119, 74, 118, 95, 118, 116, 150, 118, 150, 150, 164, 150, 128, 92, 122, 110, 104, 146, 72, 146, 60, 150];
const knieB = [127, 62, 126, 78, 126, 99, 126, 120, 156, 118, 150, 150, 164, 150, 135, 96, 130, 114, 104, 146, 72, 146, 60, 150];
const wadeA = [156, 39, 148, 53, 138, 72, 128, 92, 148, 120, 142, 150, 156, 150, 162, 60, 177, 52, 110, 121, 92, 150, 106, 150];
const wadeB = [159, 40, 151, 54, 141, 73, 132, 93, 151, 121, 142, 150, 156, 150, 164, 61, 177, 52, 113, 122, 92, 150, 106, 150];
const tuerA = X([120, 28, 120, 44, 120, 64, 120, 86, 119, 118, 118, 150, 132, 150, 98, 46, 98, 24], { a2: [121, 68, 123, 90] });
const tuerB = X([126, 29, 125, 45, 123, 65, 121, 86, 119, 118, 118, 150, 132, 150, 99, 46, 98, 24], { a2: [125, 69, 126, 91] });
const nick = [128, 32, 120, 44, 120, 64, 120, 86, 119, 118, 118, 150, 132, 150, 121, 68, 123, 90];
const vier = [180, 106, 164, 108, 136, 108, 108, 110, 108, 144, 74, 146, 62, 150, 164, 129, 164, 150];
const kuh = [181, 96, 164, 108, 136, 118, 108, 110, 108, 144, 74, 146, 62, 150, 164, 129, 164, 150];
const katze = [178, 122, 164, 108, 136, 94, 108, 110, 108, 144, 74, 146, 62, 150, 164, 129, 164, 150];
const arm = (ex, ey, hx, hy) => [120, 28, 120, 44, 120, 64, 120, 86, 119, 118, 118, 150, 132, 150, ex, ey, hx, hy];
const atemB = [52, 140, 68, 141, 89, 138, 110, 142, 136, 120, 150, 150, 164, 150, 90, 147, 112, 148];
const hochA = [64, 142, 80, 144, 110, 145, 138, 145, 143, 112, 146, 80, 134, 79, 100, 148, 120, 148];
const hochB = [64, 142, 80, 144, 110, 142, 138, 145, 143, 112, 146, 80, 134, 79, 100, 148, 120, 148];
const einA = X([120, 28, 120, 44, 120, 64, 120, 86, 119, 118, 118, 150, 132, 150, 120, 66, 121, 86], { l2: [144, 108, 142, 140, 154, 144], lt: [27, 34, 27, 34] });
const einB = X([123, 28, 122, 44, 121, 64, 120, 86, 119, 118, 118, 150, 132, 150, 122, 66, 122, 86], { l2: [145, 107, 143, 139, 155, 143], lt: [30, 40, 24, 30] });
const kaeferT = [68, 120, 68, 98];
const kaefer = [52, 140, 68, 142, 89, 143, 110, 142];
const kaeferN = X(kaefer.concat([112, 108, 144, 108, 146, 97], kaeferT), {});
const kaeferL = X(kaefer.concat([143, 136, 175, 134, 180, 123], kaeferT), { l2: [112, 108, 144, 108, 146, 97], a2: [46, 138, 24, 136] });
const kaeferR = X(kaefer.concat([112, 108, 144, 108, 146, 97], [46, 138, 24, 136]), { l2: [143, 136, 175, 134, 180, 123], a2: kaeferT });
const vogelN = X(vier, {});
const vogelL = X(vier.slice(0, 14).concat([186, 104, 208, 102]), { l2: [74, 111, 41, 112, 36, 123], a2: [164, 129, 164, 150] });
const vogelR = X(vier.slice(0, 8).concat([74, 111, 41, 112, 36, 123, 164, 129, 164, 150]), { l2: [108, 144, 74, 146, 62, 150], a2: [186, 104, 208, 102] });
const seitA = X([176.5, 104.8, 160.9, 108.3, 142, 118, 123.2, 127.6, 91, 138.6, 58, 146, 52, 150, 164, 146, 165, 147], { l2: [89.5, 131.8, 56.5, 139.2, 50, 143], a2: [158, 72, 159, 50], lt: [0, 22, 0, 0] });
const seitB = X([176.5, 103.8, 160.9, 107.3, 142, 114.5, 123.2, 122.6, 91, 135.5, 58, 146, 52, 150, 164, 146, 165, 147], { l2: [89.5, 128.6, 56.5, 139.2, 50, 143], a2: [158, 71, 159, 49], lt: [0, 22, 0, 0] });
const engelW = X([101, 28, 100, 44, 100, 65, 100, 86, 104, 118, 108, 150, 122, 150, 100, 46, 100, 26], { lt: [40, 40, 40, 40] });
const engelY = X([101, 28, 100, 44, 100, 65, 100, 86, 104, 118, 108, 150, 122, 150, 100, 24, 100, 4], { lt: [30, 38, 30, 38] });
const dipOben = [107, 46, 106, 62, 109, 83, 113, 106, 146, 118, 146, 150, 160, 150, 104, 86, 102, 108];
const dipUnten = [108, 66, 107, 82, 109.5, 103, 112, 124, 146, 118, 146, 150, 160, 150, 87, 96.5, 102, 108];
const baerA = [180, 108, 164, 108, 137, 107, 110, 108, 113, 141, 80, 143, 84, 150, 164, 129, 164, 150];
const baerB = [182, 108, 166, 108, 139, 107, 112, 108, 115, 141, 80, 143, 84, 150, 165, 129, 164, 150];
const rollA = X(S, { l2: [142, 110, 133, 141, 147, 141] });
const rollB = X(S, { l2: [143.5, 108.5, 143, 141, 157, 141] });
const kindA = [141, 140, 126, 132, 105, 127, 84, 124, 108, 146, 74, 146, 62, 150, 148, 144, 170, 147];
const kindB = [141, 140, 126, 130.5, 105, 124.5, 84, 124, 108, 146, 74, 146, 62, 150, 148, 144, 170, 147];
const beuge = [146, 134, 140, 119, 128, 102, 114, 86, 118, 118, 118, 150, 132, 150, 141, 138, 143, 150];
const wand = (x) => ['box', x, -8, -36, x + 3.5, 150, 36];

// --- Posen aus Winkeln und Zielpunkten ---
// Winkel in Grad wie auf dem Papier: 0 = nach vorn (Blickrichtung), 90 = nach oben, -90 = nach unten.
// Ein Ziel { ziel: [x, y] } setzt Hand oder Fuß genau auf diesen Punkt (Ellbogen bzw. Knie werden berechnet,
// knick = 1 beugt nach vorn, -1 nach hinten). So bleiben alle Glieder gleich lang.
const LG = { hals: 16, ro: 20, ru: 22, os: 32, us: 32, fu: 14, oa: 24, ua: 22 };
const GRAD = Math.PI / 180;
const weiter = (p, w, l) => [p[0] + Math.cos(w * GRAD) * l, p[1] - Math.sin(w * GRAD) * l];
const richtung = (a, b) => Math.atan2(a[1] - b[1], b[0] - a[0]) / GRAD;
function zweiGlieder(a, ziel, l1, l2, knick) {
  const d = Math.max(1e-3, Math.min(Math.hypot(ziel[0] - a[0], ziel[1] - a[1]), l1 + l2 - 0.01)), w = richtung(a, ziel);
  const off = Math.acos(Math.max(-1, Math.min(1, (l1 * l1 + d * d - l2 * l2) / (2 * l1 * d)))) / GRAD;
  const g = weiter(a, w + knick * off, l1);
  return [g, weiter(g, richtung(g, ziel), l2)];
}
// o: h Hüfte [x, y]; r Rumpfwinkel (Hüfte → Schulter); rk Krümmung (positiv = Rücken rund); k Kopfwinkel;
//    b1, b2 Beine: [Oberschenkel, Unterschenkel, Fuß] oder { ziel, fuss, knick };
//    a1, a2 Arme: [Oberarm, Unterarm] oder { ziel, knick }; lt seitlicher Abstand [Ellbogen1, Hand1, Ellbogen2, Hand2]
function pz(o) {
  const r = o.r ?? 90, rk = o.rk || 0, h = o.h;
  const mi = weiter(h, r - rk, LG.ru), sc = weiter(mi, r + rk, LG.ro), ko = weiter(sc, o.k ?? r + rk, LG.hals);
  const bein = (b) => {
    if (Array.isArray(b)) { const kn = weiter(h, b[0], LG.os), fu = weiter(kn, b[1], LG.us); return [kn, fu, weiter(fu, b[2] ?? 0, LG.fu)]; }
    const [kn, fu] = zweiGlieder(h, b.ziel, LG.os, LG.us, b.knick ?? 1);
    return [kn, fu, weiter(fu, b.fuss ?? 0, LG.fu)];
  };
  const armf = (a) => {
    if (Array.isArray(a)) { const e = weiter(sc, a[0], LG.oa); return [e, weiter(e, a[1], LG.ua)]; }
    return zweiGlieder(sc, a.ziel, LG.oa, LG.ua, a.knick ?? -1);
  };
  const B = [-90, -90, 0], A = [-88, -85];
  let p = [ko, sc, mi, h, ...bein(o.b1 || B), ...armf(o.a1 || A)];
  if (o.b2 || o.a2 || o.lt) p.push(...bein(o.b2 || o.b1 || B));
  if (o.a2 || o.lt) p.push(...armf(o.a2 || o.a1 || A));
  p = p.flat();
  if (o.lt) p.push(...o.lt);
  return p.map((v) => Math.round(v * 10) / 10);
}
// --- 3D: Posen mit Bewegung zur Seite und Drehung ---
// voll(p) erweitert eine Pose auf alle 44 Werte (Format siehe src/three/puppe.js). Danach drehen die Helfer
// einzelne Glieder um Schulter, Hüfte oder die Längsachse; dabei bleiben alle Glieder gleich lang.
// Punkte: 0 Kopf, 1 Schulter, 2 Rumpfmitte, 3 Hüfte, 4–6 erstes Bein, 7–8 erster Arm, 9–11 zweites Bein, 12–13 zweiter Arm.
const ZI = { 0: 32, 1: 33, 2: 34, 3: 35, 4: 36, 5: 37, 6: 38, 7: 28, 8: 29, 9: 39, 10: 40, 11: 41, 12: 30, 13: 31 };
const ZM = { 9: -1, 10: -1, 11: -1, 12: -1, 13: -1 }; // zweite Seite wird als Abstand nach außen gespeichert
function voll(p, fl = false) {
  const df = fl ? 0 : 19, lz = fl ? 0 : 8, q = [];
  for (let j = 0; j < 44; j++) q.push(p.length > j ? p[j] : j >= 42 ? 0 : j >= 36 ? lz : j >= 32 ? 0 : j >= 28 ? df : q[j - 10]);
  return q;
}
const holen = (q, j) => [q[2 * j], q[2 * j + 1], q[ZI[j]] * (ZM[j] || 1)];
function setzen(q, j, v) { q[2 * j] = v[0]; q[2 * j + 1] = v[1]; q[ZI[j]] = v[2] * (ZM[j] || 1); return q; }
const runde = (q) => q.map((v) => Math.round(v * 10) / 10);
// Punkte js um eine Achse durch m drehen. achse 'x': Querebene (positiv kippt nach oben Zeigendes zur Seite des
// ersten Arms), 'y': um die Senkrechte (wie die Schulterdrehung), 'z': Seitenansicht (wie die Winkel in pz)
function kippen(q, js, m, achse, grad) {
  const c = Math.cos(grad * GRAD), s = Math.sin(grad * GRAD);
  for (const j of js) {
    const [x, y, z] = holen(q, j), dx = x - m[0], dy = y - m[1], dz = z - m[2];
    let v;
    if (achse === 'x') v = [x, m[1] + dy * c + dz * s, m[2] - dy * s + dz * c];
    else if (achse === 'y') v = [m[0] + dx * c - dz * s, y, m[2] + dx * s + dz * c];
    else v = [m[0] + dx * c + dy * s, m[1] - dx * s + dy * c, z];
    setzen(q, j, v);
  }
  return q;
}
const GLIED = { a1: [[7, 8], 1, 'arm'], a2: [[12, 13], -1, 'arm'], b1: [[4, 5, 6], 1, 'bein'], b2: [[9, 10, 11], -1, 'bein'] };
// Arm oder Bein seitlich abspreizen (Grad, positiv = nach außen), gedreht um Schulter bzw. Hüfte
function seitlich(q, g, grad) {
  const [js, seite, art] = GLIED[g], fl = q[28] === 0 && q[36] === 0;
  const m = art === 'arm' ? [q[2], q[3] - 1, q[33] + seite * (fl ? 0 : 18)] : [q[6], q[7], q[35] + seite * (fl ? 0 : 8)];
  return kippen(q, js, m, 'x', seite > 0 ? -grad : grad);
}
// Oberkörper um die Längsachse drehen (positiv = Schulter des ersten Arms nach hinten); die Arme drehen mit
function drehen(q, grad, huefte = 0) {
  kippen(q, [7, 8, 12, 13], [q[2], q[3], q[33]], 'y', grad);
  q[42] += grad; q[43] += huefte;
  return q;
}
// Oberkörper zur Seite neigen (positiv = zur Seite des ersten Arms), gedreht um die Hüfte
const neigen = (q, grad) => kippen(q, [0, 1, 2, 7, 8, 12, 13], holen(q, 3), 'x', grad);
const kopfNeigen = (q, grad) => kippen(q, [0], holen(q, 1), 'x', grad);
const stuhl = (x, sitz = 116) => [['box', x, sitz, -22, x + 30, sitz + 4, 22], ['box', x + 1, sitz + 4, -21, x + 4, 150, -18], ['box', x + 1, sitz + 4, 18, x + 4, 150, 21], ['box', x + 26, sitz + 4, -21, x + 29, 150, -18], ['box', x + 26, sitz + 4, 18, x + 29, 150, 21]];

// Punkte einer fertigen Pose gezielt versetzen: mit(p, { 2: [x, y] })
const mit = (p, o) => { const q = p.slice(); for (const j in o) { q[2 * j] = o[j][0]; q[2 * j + 1] = o[j][1]; } return q; };
const ARME_LIEGEN = [-14, -3];
const rueckenlage = (o = {}) => pz(Object.assign({ h: [110, 142], r: 180, b1: { ziel: [150, 150] }, a1: ARME_LIEGEN }, o));
const sitzen = (o = {}) => pz(Object.assign({ h: [100, 118], b1: [0, -90, 0], a1: [-75, -37] }, o));
const liegeBasis = rueckenlage();
// Welle 1
const kinnA = rueckenlage(), kinnB = rueckenlage({ k: 172 });
const kopfN = sitzen(), kopfV = sitzen({ k: 76 }), kopfZ = sitzen({ k: 97 });
const ballA = pz({ h: [100, 86], r: 92, b1: { ziel: [124, 150] } }), ballB = pz({ h: [100, 93], r: 92, b1: { ziel: [124, 150] } });
const pendel = (w) => pz({ h: [112, 88], r: 15, k: 0, b1: { ziel: [126, 150] }, b2: { ziel: [94, 150] }, a1: [w, w], a2: { ziel: [166, 112] }, lt: [19, 19, 19, 19] });
const rolleArme = (p) => mit(p, { 7: [p[2] + 1, 145], 8: [p[2] + 2, 147], 12: [p[2] + 1, 145], 13: [p[2] + 2, 147] });
const rolleA = rolleArme(pz({ h: [110, 126], r: 180, b1: { ziel: [150, 150] }, a1: ARME_LIEGEN, lt: [32, 52, 32, 52] }));
const rolleB = mit(rolleA, { 1: [rolleA[2], rolleA[3] - 2], 2: [rolleA[4], rolleA[5] - 4] });
const curlA = pz({ h: [120, 86], a1: [-91, -86], lt: [19, 19, 19, 19] }), curlB = pz({ h: [120, 86], a1: [-94, 72], lt: [19, 19, 19, 19] });
const trizA = pz({ h: [120, 86], a1: [100, -95], a2: { ziel: [118, 19], knick: 1 }, lt: [12, 5, 24, 10] });
const trizB = pz({ h: [120, 86], a1: [107, -92], a2: { ziel: [114, 18], knick: 1 }, lt: [12, 5, 24, 10] });
const wristA = sitzen({ r: 50, k: 40, a1: [-100, -14], lt: [19, 19, 19, 19] }), wristB = sitzen({ r: 50, k: 40, a1: [-100, 16], lt: [19, 19, 19, 19] });
const uaA = pz({ h: [120, 86], a1: [0, 0], a2: { ziel: [164, 47] }, lt: [19, 14, 19, 12] }), uaB = pz({ h: [120, 86], a1: [0, 2], a2: { ziel: [160, 49] }, lt: [19, 14, 19, 12] });
const uarA = sitzen({ r: 84, a1: [-42.4, 0] }), uarB = sitzen({ r: 68, a1: [-33.7, 0] });
const kobraA = pz({ h: [124, 145], r: 3, k: 3, b1: [180, 180, 195], a1: { ziel: [150, 148] } });
const kobraB = pz({ h: [124, 145], r: 28, rk: -8, k: 45, b1: [180, 180, 195], a1: { ziel: [150, 148] } });
const kippA = mit(liegeBasis, { 2: [liegeBasis[4], liegeBasis[5] + 1.5] }), kippB = mit(liegeBasis, { 2: [liegeBasis[4], liegeBasis[5] - 4] });
const ruderA = pz({ h: [112, 88], r: 95, b1: { ziel: [122, 150] }, a1: { ziel: [151, 62] }, lt: [19, 17, 19, 17] });
const ruderB = pz({ h: [112, 88], r: 97, b1: { ziel: [122, 150] }, a1: { ziel: [116, 67] }, lt: [22, 17, 22, 17] });
const rundA = pz({ h: [120, 86], a1: [-2, -2], lt: [19, 4, 19, 4] }), rundB = pz({ h: [116, 86], rk: -14, k: 50, a1: [-6, -6], lt: [19, 4, 19, 4] });
const obrRolle = (x) => pz({ h: [x, 118], r: 188, k: 168, b1: { ziel: [150, 150] }, a1: [60, 225], lt: [8, -12, 8, -12] });
const stufeA = pz({ h: [108, 142], r: 180, b1: [90, 0, 70], a1: ARME_LIEGEN }), stufeB = mit(stufeA, { 2: [stufeA[4], stufeA[5] - 3] });
const gesBall = (dx, dy) => pz({ h: [110 + dx, 133 + dy], r: 135, b1: { ziel: [150, 150] }, a1: { ziel: [84, 148] } });
const marschN = pz({ h: [120, 86], b2: [-90, -90, 0], a1: [-88, -85], a2: [-88, -85] });
const marschL = pz({ h: [120, 86], b1: [0, -90, 0], b2: [-90, -90, 0], a1: [-112, -100], a2: [-62, -35] });
const marschR = pz({ h: [120, 86], b1: [-90, -90, 0], b2: [0, -90, 0], a1: [-62, -35], a2: [-112, -100] });
const schwung = (w) => pz({ h: [120, 86], b1: [w, w, w + 90], b2: [-90, -90, 0], a2: [-60, -30], lt: [19, 19, 30, 44] });
const quadSt = (h, w) => { const kn = weiter(h, w, LG.os), fu = weiter(kn, 100, LG.us); return pz({ h, b1: [w, 100, 170], b2: { ziel: [120, 150] }, a1: { ziel: [fu[0], fu[1] + 2] }, a2: { ziel: [153, 46] }, lt: [19, 8, 19, 19] }); };
const quadRolle = (x) => pz({ h: [x, 128], r: 8, k: 12, b1: [186, 186, 250], a1: [-90, 0] });
const kreuzA = pz({ h: [120, 86], b2: [-100, -100, -10], a1: [-90, -88], lt: [19, 19, 19, 19] });
const kreuzB = pz({ h: [112, 88], r: 8, k: 6, b1: { ziel: [120, 150] }, b2: [184, 184, -86], a1: [-90, -90], lt: [19, 19, 19, 19] });
const raupe = [
  pz({ h: [100, 86] }),
  pz({ h: [96, 88], r: -50, k: -70, b1: { ziel: [100, 150] }, a1: { ziel: [130, 147] } }),
  pz({ h: [98, 84], r: -35, k: -45, b1: { ziel: [102, 147], fuss: -40 }, a1: { ziel: [150, 147] } }),
  pz({ h: [162, 116.8], r: 22.6, k: 22, b1: { ziel: [104, 141], fuss: -100, knick: -1 }, a1: { ziel: [200, 147] } })
];
const kissenA = liegeBasis, kissenB = mit(liegeBasis, { 4: [liegeBasis[8], liegeBasis[9] - 0.8] });
const fersA = pz({ h: [100, 128], r: 95, b1: { ziel: [96, 147], fuss: 180 }, a1: [-70, -20] });
const fersB = pz({ h: [101, 124], r: 118, k: 108, b1: { ziel: [96, 147], fuss: 180 }, a1: { ziel: [78, 148] } });

// Welle 2
const kinnBrust = sitzen({ k: 50 });
const pikeA = pz({ h: [87.8, 87.8], r: -42.7, k: -60, b1: { ziel: [68, 148], knick: -1 }, a1: { ziel: [152, 147] } });
const pikeB = pz({ h: [94, 88], r: -58, k: -78, b1: { ziel: [68, 148], knick: -1 }, a1: { ziel: [152, 147] } });
const wandLS = (w) => pz({ h: weiter([110, 150], w, 64), r: w, b1: [w + 180, w + 180, 0], a1: { ziel: [188, 50] }, lt: [22, 17, 22, 17] });
const knieLS = (w, lt) => { const kn = [100, 146], h = weiter(kn, w, 32); return pz({ h, r: w, b1: [w + 180, 160, 120], a1: { ziel: [158.7, 147] }, lt }); };
const ballHand = sitzen({ a1: [-75, 5], lt: [19, 19, 19, 19] });
const crunchA = rueckenlage({ a1: [-14, -3] }), crunchB = rueckenlage({ r: 165, rk: -15, k: 140, a1: [-12, -8] });
const seitDip = mit(seitA, { 2: [140, 123], 3: [123, 136] });
const seitLage = (b2, b1 = [180, 180, 200]) => pz({ h: [120, 140], r: 0, k: 4, b1, b2, a1: [4, 0], a2: [195, 190], lt: [0, 0, 10, 14] });
const tischRudern = (w) => pz({ h: weiter([40, 150], w, 64), r: w, k: w + 8, b1: [w + 180, w + 180, w + 90], a1: { ziel: [150, 96], knick: 1 }, lt: [22, 17, 22, 17] });
const stabA = pz({ h: [120, 86], a1: { ziel: [111, 82] } });
const stabB = pz({ h: [108, 88], r: 12, k: 12, b1: { ziel: [120, 150] }, a1: { ziel: [102, 82] } });
const kieBrustB = rueckenlage({ b1: [125, -25, 65], a1: { ziel: [96, 113], knick: 1 } });
const brueckeEin = (h, b2) => pz({ h, r: richtung(h, [70, 141]), k: 190, b1: { ziel: [150, 150] }, b2, a1: { ziel: [112, 148], knick: 1 } });
const gbA = rueckenlage({ b2: [35, 35, 125] }), gbB = brueckeEin([110, 120], [29, 29, 119]);
const ausfallR = pz({ h: [112, 112], b1: { ziel: [130, 150] }, b2: { ziel: [72, 148], fuss: -20 } });
const ausfallV = pz({ h: [124, 112], b1: { ziel: [148, 150] }, b2: { ziel: [100, 148], fuss: -20 } });
const ausfallS = pz({ h: [112, 86], b1: { ziel: [112, 150] } }), ausfallS2 = pz({ h: [100, 86], b1: { ziel: [100, 150] } });
const beinLiegA = rueckenlage({ b1: [-2, -2, 88], b2: { ziel: [150, 150] } }), beinLiegB = rueckenlage({ b1: [38, 38, 128], b2: { ziel: [150, 150] } });
const stepA = pz({ h: [110, 86] }), stepB = pz({ h: [120, 88], b1: { ziel: [142, 128] }, b2: { ziel: [110, 150] } }), stepC = pz({ h: [140, 64], b1: { ziel: [142, 128] }, b2: { ziel: [138, 128] } });
const curlTuchA = brueckeEin([112, 120], { ziel: [148, 150] }), curlTuchB = brueckeEin([116, 128], { ziel: [174, 150] });
const tuchBein = (w) => { const h = [110, 142], kn = weiter(h, w, LG.os), fu = weiter(kn, w, LG.us), sc = weiter(h, 180, 42); return rueckenlage({ b1: [w, w, w + 90], b2: [-2, -2, 88], a1: { ziel: [sc[0] + (fu[0] - sc[0]) * 0.42, sc[1] + (fu[1] - sc[1]) * 0.42], knick: 1 }, lt: [19, 12, 19, 12] }); };
const wadeKnie = (h) => pz({ h, r: 72, b1: { ziel: [142, 150] }, b2: { ziel: [98, 150] }, a1: { ziel: [176, 56] } });
const zehenWand = (fw) => pz({ h: [100, 86], r: 93, b1: { ziel: [126, 150], fuss: fw } });

// Welle 3 (3D)
const plus = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const verschieben = (q, d, js = [0, 1, 2, 3, 7, 8, 12, 13]) => { for (const j of js) setzen(q, j, plus(holen(q, j), d)); return q; };
const spiegelArm = (q) => { setzen(q, 12, [q[14], q[15], -q[28]]); setzen(q, 13, [q[16], q[17], -q[29]]); return q; };
// Nacken: Hand seitlich am Kopf
const nackenHand = (kn) => { const q = voll(sitzen()), S = holen(q, 1), K = holen(q, 0); setzen(q, 7, plus(S, [2, -10, 38])); setzen(q, 8, [K[0], K[1] + 1, 15]); return runde(kopfNeigen(q, kn)); };
// Seitheben
const seitheb = (w) => { const q = voll(pz({ h: [120, 86], a1: [-90, -90], a2: [-90, -90] })); seitlich(q, 'a1', w); seitlich(q, 'a2', w); return runde(q); };
// Arm quer vor der Brust
const armQuer = (z) => { const q = voll(pz({ h: [120, 86] })), S = holen(q, 1); setzen(q, 7, plus(S, [16, 3, 2 - z])); setzen(q, 8, plus(S, [12, 3, -20 - z])); setzen(q, 12, plus(S, [8, 20, -16])); setzen(q, 13, plus(S, [18, 6, -z])); return runde(q); };
// Buch öffnen (Seitenlage): unterer Arm vorn am Boden, oberer Arm öffnet über oben nach hinten
const seitBasis = () => { const q = voll(pz({ h: [120, 132], r: 0, k: 0 }), true); setzen(q, 0, [178, 136, 0]); setzen(q, 1, [162, 130, 0]); setzen(q, 2, [141, 131, 0]);
  setzen(q, 4, [120, 140, 32]); setzen(q, 5, [88, 141, 32]); setzen(q, 6, [86, 147, 44]); setzen(q, 9, [120, 132, 32]); setzen(q, 10, [88, 133, 32]); setzen(q, 11, [86, 139, 44]);
  setzen(q, 7, [162, 145, 24]); setzen(q, 8, [162, 146, 46]); return q; };
const buch = (w) => { const q = seitBasis(); setzen(q, 12, [162, 128, 22]); setzen(q, 13, [162, 136, 42]); kippen(q, [12, 13], [162, 116, 0], 'x', w); return runde(q); };
// Bizeps-Dehnung: Arm hinten seitlich an der Wand
const bizepsWand = (d) => { const q = voll(pz({ h: [120, 86] })); drehen(q, d); const S = holen(q, 1); setzen(q, 7, plus(S, [-6, -1, 41])); setzen(q, 8, plus(S, [-11, -1, 62])); return runde(q); };
// Handgelenke kreisen
const handKreis = (dy, dz) => { const q = voll(pz({ h: [120, 86], a1: [-90, 0], a2: [-90, 0] })); setzen(q, 8, plus(holen(q, 8), [0, dy, dz])); setzen(q, 13, plus(holen(q, 13), [0, dy, -dz])); return runde(q); };
// Russian Twist
const twist = (d) => { const q = voll(pz({ h: [110, 136], r: 125, k: 115, b1: { ziel: [148, 150] }, a1: [-30, 20], lt: [20, 6, 20, 6] })); return runde(drehen(q, d)); };
// Seitneigung im Stehen
const neigung = (w) => runde(neigen(voll(pz({ h: [120, 86], a1: [92, 92], a2: [-90, -90] })), w));
// Rumpf drehen im Sitzen, Arme vor der Brust gekreuzt
const sitzDreh = (d) => { const q = voll(sitzen()), S = holen(q, 1); setzen(q, 7, plus(S, [14, 12, 10])); setzen(q, 8, plus(S, [6, 2, -12])); setzen(q, 12, plus(S, [14, 14, -10])); setzen(q, 13, plus(S, [6, 4, 12])); return runde(drehen(q, d)); };
// Y-T-W in Bauchlage
const ytw = (art, hoch) => { const q = voll(pz({ h: [124, 145], r: hoch ? 8 : 3, k: hoch ? 8 : 3, b1: [180, 180, 195] })), S = holen(q, 1), u = hoch ? -5 : 0;
  const A = { Y: [[20, -4 + u, 30], [38, -6 + u, 42]], T: [[1, -3 + u, 42], [2, -5 + u, 64]], W: [[-10, -3 + u, 38], [8, -5 + u, 50]] }[art];
  setzen(q, 7, plus(S, A[0])); setzen(q, 8, plus(S, A[1])); spiegelArm(q); return runde(q); };
// Seitliche Rumpfdehnung am Türrahmen
const latDehn = (w) => { const q = voll(pz({ h: [120, 86], a1: [94, 94], a2: [-60, -20] })); kippen(q, [7, 8], [q[2], q[3] - 1, 18], 'x', w * 1.4); neigen(q, w); setzen(q, 3, plus(holen(q, 3), [0, 0, -w * 0.3])); return runde(q); };
// Scheibenwischer
const wischer = (w) => { const q = voll(liegeBasis), S = holen(q, 1); setzen(q, 7, [S[0] + 1, 145, 34]); setzen(q, 8, [S[0] + 2, 147, 54]); spiegelArm(q); kippen(q, [4, 5, 6, 9, 10, 11], [110, 142, 0], 'x', w); return runde(q); };
// Clamshell (Seitenlage, Knie gebeugt)
const muschel = (auf) => { const q = seitBasis(); setzen(q, 4, [97, 141, 23]); setzen(q, 5, [75, 142, 2]); setzen(q, 6, [70, 147, 12]); setzen(q, 9, [97, 133 - auf, 23 - auf * 0.2]); setzen(q, 10, [75, 134, 2]); setzen(q, 11, [70, 139, 12]);
  setzen(q, 12, [150, 120, 4]); setzen(q, 13, [128, 124, 4]); return runde(q); };
// Figur 4 (Rückenlage, Knöchel auf dem Knie)
const figur4 = (zug) => { const q = voll(liegeBasis), K2 = holen(q, 9); setzen(q, 4, [126, 124, 30]); setzen(q, 5, [K2[0], K2[1] - 6, 2]); setzen(q, 6, [K2[0] + 3, K2[1] - 10, -10]); kippen(q, [4, 5, 6, 9, 10, 11], [110, 142, 0], 'z', zug); return runde(q); };
// Hüftkreisen im Vierfüßlerstand
const hueftKreis = (beuge, ab, hoch) => { const q = voll(X(vier, {})), H = holen(q, 3); kippen(q, [4, 5, 6], [H[0], H[1], 8], 'z', beuge); seitlich(q, 'b1', ab); if (hoch) verschieben(q, [0, -hoch, 0], [4, 5, 6]); return runde(q); };
// Schmetterling
const schmetterling = (r, ky, kz) => { const q = voll(pz({ h: [110, 138], r, k: r - 5, a1: { ziel: [136, 143] }, lt: [16, 5, 16, 5] }));
  setzen(q, 4, [130, ky, kz]); setzen(q, 5, [138, 147, 4]); setzen(q, 6, [144, 146, 10]); setzen(q, 9, [130, ky, -kz]); setzen(q, 10, [138, 147, -4]); setzen(q, 11, [144, 146, -10]); return runde(q); };
// Seitlicher Ausfallschritt
const seitAusfall = (tief) => { const q = voll(pz({ h: [120, 91], r: tief ? 80 : 90, a1: [-60, -10], a2: [-60, -10], lt: [19, 8, 19, 8] }));
  if (!tief) { setzen(q, 4, [121, 120.5, 21]); setzen(q, 5, [122, 150, 34]); setzen(q, 6, [136, 150, 36]); setzen(q, 9, [121, 120.5, -21]); setzen(q, 10, [122, 150, -34]); setzen(q, 11, [136, 150, -36]); return runde(q); }
  verschieben(q, [-2, 13, 14]); setzen(q, 4, [142, 127, 28]); setzen(q, 5, [124, 150, 34]); setzen(q, 6, [138, 150, 36]); setzen(q, 9, [120, 127, -14]); setzen(q, 10, [122, 150, -34]); setzen(q, 11, [136, 150, -36]); return runde(q); };
// Fußkreisen im Sitzen
const fussKreis = (dy, dz) => { const q = voll(sitzen({ b1: [2, -25, 75] })); setzen(q, 6, plus(holen(q, 6), [0, dy, dz])); return runde(q); };

const KREIS_HAND = [[0, handKreis(-3.5, 0)], [0.25, handKreis(0, 3.5)], [0.5, handKreis(3.5, 0)], [0.75, handKreis(0, -3.5)], [1, handKreis(-3.5, 0)]];
const KREIS_FUSS = [[0, fussKreis(-6, 0)], [0.25, fussKreis(0, 8)], [0.5, fussKreis(6, 0)], [0.75, fussKreis(0, -8)], [1, fussKreis(-6, 0)]];

export const UEBUNGEN = {
  'wandsitzen': { n: 'Wandsitzen', m: 'kraft', h: ['quad'], nb: ['gesaess'], eq: 'Wand', lv: 1, min: 3, dos: { typ: 'zeit', sek: 30, s: 3 },
    st: ['Rücken flach an die Wand, Füße etwa zwei Fußlängen davor.', 'An der Wand heruntergleiten, bis Knie und Hüfte ungefähr im rechten Winkel sind.', 'Halten und ruhig weiteratmen. Die Knie bleiben über den Fersen.'],
    f: ['Hände nicht auf den Oberschenkeln abstützen.', 'Knie nicht nach innen fallen lassen.'], le: 'Höher sitzen, Kniewinkel größer als 90°.', sw: 'Ein Bein leicht anheben.',
    an: { d: 6, p: [wand(86.5)], a: [3, 4], k: [[0, wandStand], [0.25, sitz], [0.85, sitz], [1, wandStand]] } },
  'kniebeuge': { n: 'Langsame Kniebeuge', m: 'kraft', h: ['quad', 'gesaess'], nb: ['hams', 'uruecken'], eq: 'Ohne Geräte', lv: 1, min: 4, dos: { typ: 'wdh', n: 12, s: 3 },
    st: ['Füße etwas weiter als hüftbreit, Zehen leicht nach außen.', '3 Sekunden absenken, als würdest du dich auf einen Stuhl setzen.', '1 Sekunde unten halten, dann 3 Sekunden hochdrücken.'],
    f: ['Die Fersen bleiben am Boden.', 'Die Knie zeigen in Richtung der Zehen.'], le: 'Auf einen Stuhl setzen und wieder aufstehen.', sw: 'In der letzten Wiederholung 10 Sekunden unten halten.',
    an: { d: 7, a: [3, 4], k: [[0, S], [0.43, hocke], [0.57, hocke], [1, S]] } },
  'glute-bridge': { n: 'Glute Bridge', m: 'kraft', h: ['gesaess'], nb: ['hams', 'uruecken'], eq: 'Matte', lv: 1, min: 3, dos: { typ: 'wdh', n: 15, s: 3 },
    st: ['Rückenlage, Knie angewinkelt, Füße hüftbreit aufstellen.', 'Gesäß anspannen und Becken anheben, bis Knie, Hüfte und Schultern eine Linie bilden.', 'Kurz halten, dann langsam absenken.'],
    f: ['Nicht ins Hohlkreuz drücken.', 'Knie nicht nach innen fallen lassen.'], le: 'Kleinerer Bewegungsumfang.', sw: 'Einbeinig ausführen.',
    an: { d: 3.5, a: [2, 3, 4], k: [[0, liegt], [0.4, bruecke], [0.6, bruecke], [1, liegt]] } },
  'unterarmstuetz': { n: 'Unterarmstütz', m: 'kraft', h: ['bauch'], nb: ['seitbauch', 'schultern'], eq: 'Matte', lv: 1, min: 3, dos: { typ: 'zeit', sek: 30, s: 3 },
    st: ['Unterarme auf den Boden, Ellbogen unter den Schultern.', 'Beine strecken. Der Körper bildet eine Linie von Kopf bis Ferse.', 'Bauch und Gesäß anspannen, ruhig atmen.'],
    f: ['Hüfte nicht durchhängen lassen.', 'Gesäß nicht nach oben schieben.'], le: 'Knie ablegen.', sw: 'Abwechselnd ein Bein abheben.',
    an: { d: 4, a: [1, 2, 3], k: [[0, brettA], [0.5, brettB], [1, brettA]] } },
  'liegestuetz': { n: 'Liegestütz', m: 'kraft', h: ['brust', 'trizeps'], nb: ['schultern', 'bauch'], eq: 'Ohne Geräte', lv: 2, min: 4, dos: { typ: 'wdh', n: 8, s: 3 },
    st: ['Hände etwas weiter als schulterbreit, Körper in einer Linie.', 'Ellbogen beugen und die Brust Richtung Boden senken. Die Ellbogen zeigen schräg nach hinten.', 'Kraftvoll hochdrücken, der Rumpf bleibt fest.'],
    f: ['Kein Hohlkreuz, der Bauch bleibt angespannt.', 'Der Kopf bleibt in Verlängerung der Wirbelsäule.'], le: 'Hände an die Wand oder Knie ablegen.', sw: 'Füße erhöht ablegen.',
    an: { d: 3, a: [1, 7, 8], k: [[0, stuetzOben], [0.45, stuetzUnten], [0.55, stuetzUnten], [1, stuetzOben]] } },
  'wadenheben': { n: 'Wadenheben', m: 'kraft', h: ['waden'], nb: [], eq: 'Ohne Geräte', lv: 1, min: 3, dos: { typ: 'wdh', n: 15, s: 3 },
    st: ['Hüftbreit stehen, bei Bedarf an der Wand festhalten.', 'Langsam auf die Zehenspitzen heben, oben kurz halten.', 'Langsam absenken. Die Fersen berühren den Boden nur leicht.'],
    f: ['Nicht wippen, das Tempo bleibt ruhig.', 'Die Knöchel nicht nach außen kippen.'], le: 'Mit beiden Händen an der Wand abstützen.', sw: 'Einbeinig auf einer Stufe.',
    an: { d: 3, a: [4, 5], k: [[0, S], [0.4, zehen], [0.6, zehen], [1, S]] } },
  'superman': { n: 'Rückenstrecken in Bauchlage', m: 'kraft', h: ['uruecken'], nb: ['gesaess', 'oruecken'], eq: 'Matte', lv: 1, min: 3, dos: { typ: 'wdh', n: 10, s: 3 },
    st: ['Bauchlage, Arme nach vorn gestreckt, Blick zum Boden.', 'Arme, Brust und Beine wenige Zentimeter anheben.', 'Kurz halten, dann langsam ablegen.'],
    f: ['Den Nacken lang lassen und nicht nach vorn schauen.', 'Klein und kontrolliert bewegen, ohne Schwung.'], le: 'Nur die Arme heben.', sw: 'Oben 3 Sekunden halten.',
    an: { d: 3.5, a: [1, 2, 3], k: [[0, bauchlage], [0.4, superman], [0.6, superman], [1, bauchlage]] } },
  'einbeinstand': { n: 'Einbeinstand', m: 'kraft', h: ['schienbein', 'waden'], nb: ['gesaess'], eq: 'Ohne Geräte', lv: 1, min: 2, dos: { typ: 'zeit', sek: 30, s: 2 }, seiten: true,
    st: ['Aufrecht stehen und den Blick auf einen festen Punkt richten.', 'Ein Knie anheben, bis der Oberschenkel etwa waagerecht ist.', '30 Sekunden ruhig halten, dann das Bein wechseln.'],
    f: ['Die Hüfte bleibt gerade und kippt nicht zur Seite.', 'Das Standbein ist leicht gebeugt, nicht durchgedrückt.'], le: 'Mit einer Hand an der Wand abstützen.', sw: 'Die Augen schließen oder auf ein Kissen stellen.',
    an: { d: 4, as: 1, a: [4, 5, 6], k: [[0, einA], [0.5, einB], [1, einA]] } },
  'dead-bug': { n: 'Dead Bug', m: 'kraft', h: ['bauch'], nb: ['seitbauch', 'hueftbeuger'], eq: 'Matte', lv: 1, min: 3, dos: { typ: 'wdh', n: 10, s: 2 },
    st: ['Rückenlage: Arme senkrecht nach oben, Knie und Hüfte im rechten Winkel.', 'Einen Arm nach hinten und das gegenüberliegende Bein nach vorn absenken, ohne den Boden zu berühren.', 'Zurück zur Mitte und die Seite wechseln.'],
    f: ['Der untere Rücken bleibt am Boden.', 'Langsam bewegen und dabei ausatmen.'], le: 'Nur die Beine bewegen.', sw: 'Arme und Beine ganz strecken.',
    an: { d: 8, a: [1, 2, 3], k: [[0, kaeferN], [0.2, kaeferL], [0.3, kaeferL], [0.5, kaeferN], [0.7, kaeferR], [0.8, kaeferR], [1, kaeferN]] } },
  'bird-dog': { n: 'Bird Dog', m: 'kraft', h: ['uruecken'], nb: ['gesaess', 'schultern', 'bauch'], eq: 'Matte', lv: 1, min: 3, dos: { typ: 'wdh', n: 10, s: 2 },
    st: ['Vierfüßlerstand: Hände unter den Schultern, Knie unter der Hüfte.', 'Einen Arm nach vorn und das gegenüberliegende Bein nach hinten strecken.', 'Kurz halten, absetzen und die Seite wechseln.'],
    f: ['Das Becken bleibt waagerecht und dreht nicht auf.', 'Der Blick geht zum Boden, der Nacken bleibt lang.'], le: 'Nur den Arm oder nur das Bein heben.', sw: 'Ellbogen und Knie unter dem Bauch zusammenführen.',
    an: { d: 8, a: [1, 2, 3], k: [[0, vogelN], [0.2, vogelL], [0.35, vogelL], [0.5, vogelN], [0.7, vogelR], [0.85, vogelR], [1, vogelN]] } },
  'seitstuetz': { n: 'Seitstütz', m: 'kraft', h: ['seitbauch'], nb: ['schultern', 'gesaess'], eq: 'Matte', lv: 2, min: 2, dos: { typ: 'zeit', sek: 20, s: 2 }, seiten: true,
    st: ['Seitlage: Der Ellbogen liegt unter der Schulter, die Beine sind gestreckt.', 'Die Hüfte anheben, bis der Körper eine Linie bildet.', 'Halten, ruhig atmen, dann die Seite wechseln.'],
    f: ['Die Hüfte sinkt nicht ab.', 'Die Schulter bleibt weg vom Ohr.'], le: 'Die Knie ablegen.', sw: 'Das obere Bein anheben.',
    an: { d: 4, fl: 1, y: 0.3, a: [1, 2, 3], k: [[0, seitA], [0.5, seitB], [1, seitA]] } },
  'dips': { n: 'Trizeps-Dips am Stuhl', m: 'kraft', h: ['trizeps'], nb: ['schultern', 'brust'], eq: 'Stuhl', lv: 2, min: 3, dos: { typ: 'wdh', n: 8, s: 3 },
    st: ['Auf die Stuhlkante setzen und die Hände neben der Hüfte aufstützen.', 'Das Gesäß vor die Kante schieben und die Ellbogen nach hinten beugen.', 'Bis etwa 90° absenken und wieder hochdrücken.'],
    f: ['Der Rücken bleibt nah am Stuhl.', 'Die Schultern nicht zu den Ohren ziehen.'], le: 'Die Beine anwinkeln.', sw: 'Die Beine strecken.',
    an: { d: 3.5, p: [['box', 74, 111, -24, 104, 115, 24], ['box', 75, 115, -23, 78, 150, -20], ['box', 75, 115, 20, 78, 150, 23], ['box', 100, 115, -23, 103, 150, -20], ['box', 100, 115, 20, 103, 150, 23]], a: [1, 7, 8], k: [[0, dipOben], [0.45, dipUnten], [0.55, dipUnten], [1, dipOben]] } },
  'baerenstand': { n: 'Bärenstand', m: 'kraft', h: ['bauch', 'schultern'], nb: ['quad'], eq: 'Ohne Geräte', lv: 2, min: 2, dos: { typ: 'zeit', sek: 20, s: 3 },
    st: ['Vierfüßlerstand, die Zehen aufstellen.', 'Die Knie wenige Zentimeter vom Boden abheben.', 'Den Rücken flach halten und ruhig atmen.'],
    f: ['Die Knie schweben nur knapp über dem Boden.', 'Das Gesäß nicht nach oben schieben.'], le: 'Nur 10 Sekunden halten.', sw: 'Langsam vorwärts krabbeln.',
    an: { d: 4, a: [1, 2, 3], k: [[0, baerA], [0.5, baerB], [1, baerA]] } },
  'hueftbeuger-dehnung': { n: 'Hüftbeuger-Dehnung', m: 'dehn', h: ['hueftbeuger'], nb: ['quad'], eq: 'Matte', lv: 1, min: 3, dos: { typ: 'zeit', sek: 45, s: 2 }, seiten: true,
    st: ['Halber Kniestand: hinteres Knie am Boden, vorderer Fuß aufgestellt.', 'Becken aufrichten, Gesäß leicht anspannen und die Hüfte nach vorn schieben.', 'Die Dehnung vorn an der Hüfte des hinteren Beins halten, dann die Seite wechseln.'],
    f: ['Nicht ins Hohlkreuz fallen.', 'Das vordere Knie bleibt über dem Fuß.'], le: 'Kissen unters Knie legen und kürzer halten.', sw: 'Den Arm der Dehnseite nach oben strecken.',
    an: { d: 6, a: [3, 9], k: [[0, knieA], [0.35, knieB], [0.8, knieB], [1, knieA]] } },
  'wadendehnung': { n: 'Wadendehnung an der Wand', m: 'dehn', h: ['waden'], nb: [], eq: 'Wand', lv: 1, min: 2, dos: { typ: 'zeit', sek: 30, s: 2 }, seiten: true,
    st: ['Schrittstellung vor der Wand, die Hände stützen auf Schulterhöhe.', 'Das hintere Bein ist gestreckt, die Ferse bleibt fest am Boden.', 'Die Hüfte nach vorn schieben, bis es in der Wade zieht. Dann die Seite wechseln.'],
    f: ['Die hintere Ferse nicht abheben.', 'Beide Füße zeigen gerade nach vorn.'], le: 'Kleineren Schritt machen.', sw: 'Das hintere Knie leicht beugen. Das dehnt den tiefer liegenden Wadenmuskel.',
    an: { d: 6, p: [wand(180.5)], a: [9, 10], k: [[0, wadeA], [0.35, wadeB], [0.8, wadeB], [1, wadeA]] } },
  'brustdehnung': { n: 'Türrahmen-Brustdehnung', m: 'dehn', h: ['brust'], nb: ['schultern'], eq: 'Türrahmen', lv: 1, min: 2, dos: { typ: 'zeit', sek: 30, s: 2 }, seiten: true,
    st: ['Seitlich in den Türrahmen stellen und den Unterarm senkrecht an den Rahmen legen.', 'Der Ellbogen liegt etwa auf Schulterhöhe.', 'Einen kleinen Schritt nach vorn gehen und den Oberkörper leicht wegdrehen. Dann die Seite wechseln.'],
    f: ['Die Schulter nicht hochziehen.', 'Nicht ins Hohlkreuz ausweichen.'], le: 'Den Ellbogen etwas tiefer anlegen.', sw: 'Den Ellbogen höher anlegen und leicht vorlehnen.',
    an: { d: 6, as: 1, p: [['box', 90, -8, 13, 94, 150, 25]], a: [1, 7], k: [[0, tuerA], [0.35, tuerB], [0.8, tuerB], [1, tuerA]] } },
  'nacken-loesen': { n: 'Nacken lösen', m: 'dehn', h: ['nacken'], nb: [], eq: 'Ohne Geräte', lv: 1, min: 2, dos: { typ: 'zeit', sek: 20, s: 3 },
    st: ['Aufrecht stehen oder sitzen, die Schultern bleiben locker.', 'Das Kinn langsam Richtung Brust sinken lassen und halten.', 'Danach das Ohr erst zur rechten, dann zur linken Schulter neigen.'],
    f: ['Nicht am Kopf ziehen und nicht federn.', 'Die Schultern bleiben unten.'], le: 'Nur das Kinn zur Brust.', sw: 'Die Hand ganz leicht auf den Kopf legen, ohne zu ziehen.',
    an: { d: 6, a: [0, 1], k: [[0, S], [0.35, nick], [0.8, nick], [1, S]] } },
  'kindhaltung': { n: 'Kindhaltung', m: 'dehn', h: ['uruecken'], nb: ['oruecken', 'gesaess'], eq: 'Matte', lv: 1, min: 2, dos: { typ: 'zeit', sek: 60, s: 1 },
    st: ['Auf die Fersen setzen, die Knie etwa hüftbreit.', 'Den Oberkörper nach vorn auf die Oberschenkel sinken lassen.', 'Die Arme nach vorn ausstrecken, die Stirn ablegen und ruhig atmen.'],
    f: ['Das Gesäß bleibt Richtung Fersen.', 'In den unteren Rücken atmen.'], le: 'Ein Kissen zwischen Gesäß und Fersen legen.', sw: 'Die Arme weit nach vorn wandern lassen.',
    an: { d: 6, a: [1, 2, 3], k: [[0, kindA], [0.5, kindB], [1, kindA]] } },
  'vorbeuge': { n: 'Vorbeuge im Stehen', m: 'dehn', h: ['hams'], nb: ['waden', 'uruecken'], eq: 'Ohne Geräte', lv: 1, min: 2, dos: { typ: 'zeit', sek: 30, s: 2 },
    st: ['Hüftbreit stehen, die Knie minimal gebeugt.', 'Aus der Hüfte nach vorn beugen, der Rücken bleibt zunächst lang.', 'Kopf und Arme hängen lassen und die Dehnung an der Oberschenkelrückseite halten.'],
    f: ['Nicht federn.', 'Langsam Wirbel für Wirbel wieder aufrichten.'], le: 'Die Hände auf den Oberschenkeln abstützen.', sw: 'Die Beine weiter strecken.',
    an: { d: 7, a: [3, 4], k: [[0, S], [0.35, beuge], [0.8, beuge], [1, S]] } },
  'katze-kuh': { n: 'Katze-Kuh', m: 'mobil', h: ['uruecken', 'oruecken'], nb: ['bauch'], eq: 'Matte', lv: 1, min: 3, dos: { typ: 'wdh', n: 10, s: 2 },
    st: ['Vierfüßlerstand: Hände unter den Schultern, Knie unter der Hüfte.', 'Ausatmen: den Rücken rund machen, das Kinn zur Brust (Katze).', 'Einatmen: das Brustbein nach vorn schieben und den Rücken sanft durchhängen lassen (Kuh).'],
    f: ['Langsam im Atemrhythmus bewegen.', 'Im unteren Rücken nicht ins Extrem drücken.'], le: 'Kleinerer Bewegungsumfang.', sw: 'Je 4 Sekunden ein- und ausatmen.',
    an: { d: 6, a: [1, 2, 3], k: [[0, kuh], [0.5, katze], [1, kuh]] } },
  'schulterkreisen': { n: 'Schulterkreisen', m: 'mobil', h: ['schultern'], nb: ['oruecken', 'nacken'], eq: 'Ohne Geräte', lv: 1, min: 2, dos: { typ: 'wdh', n: 10, s: 2 },
    st: ['Aufrecht stehen, die Arme locker hängen lassen.', 'Die gestreckten Arme in großen Kreisen nach vorn, oben und hinten führen.', '10 Kreise, dann die Richtung wechseln.'],
    f: ['Der Rumpf bleibt ruhig, nur die Arme bewegen sich.', 'Die Kreise so groß machen, wie es schmerzfrei geht.'], le: 'Kleinere Kreise mit gebeugten Armen.', sw: 'Ein Handtuch mit beiden Händen breit greifen und gestreckt über den Kopf führen.',
    an: { d: 4, lin: true, a: [1, 7, 8], k: [[0, arm(120, 68, 120, 90)], [0.125, arm(137, 61, 152.5, 76.5)], [0.25, arm(144, 44, 166, 44)], [0.375, arm(137, 27, 152.5, 11.5)], [0.5, arm(120, 20, 120, -2)], [0.625, arm(103, 27, 87.5, 11.5)], [0.75, arm(96, 44, 74, 44)], [0.875, arm(103, 61, 87.5, 76.5)], [1, arm(120, 68, 120, 90)]] } },
  'wand-engel': { n: 'Wand-Engel', m: 'mobil', h: ['oruecken', 'schultern'], nb: ['nacken'], eq: 'Wand', lv: 1, min: 2, dos: { typ: 'wdh', n: 10, s: 2 },
    st: ['Mit dem Rücken an die Wand stellen, die Füße eine Fußlänge davor.', 'Die Arme im rechten Winkel an die Wand legen, wie ein „W“.', 'Die Arme an der Wand nach oben schieben und langsam zurückführen.'],
    f: ['Der untere Rücken bleibt nah an der Wand.', 'Die Schultern nicht hochziehen.'], le: 'Kleinerer Bewegungsradius.', sw: 'Langsamer bewegen, die Handrücken bleiben an der Wand.',
    an: { d: 5, y: -1.05, p: [wand(86.5)], a: [1, 7, 8], k: [[0, engelW], [0.45, engelY], [0.55, engelY], [1, engelW]] } },
  'box-atmung': { n: 'Box-Atmung 4-4-4-4', m: 'reco', h: ['bauch'], nb: [], eq: 'Ohne Geräte', lv: 1, min: 3, dos: { typ: 'zeit', sek: 180, s: 1 },
    st: ['Bequem hinlegen oder hinsetzen, eine Hand auf den Bauch legen.', '4 Sekunden einatmen, dann 4 Sekunden halten.', '4 Sekunden ausatmen, dann 4 Sekunden halten. Wiederholen.'],
    f: ['Die Schultern bleiben locker.', 'Bei Schwindel normal weiteratmen.'], le: 'Nur 2 Minuten.', sw: '5 Minuten.',
    an: { d: 16, a: [1, 2], k: [[0, liegt], [0.25, atemB], [0.5, atemB], [0.75, liegt], [1, liegt]] } },
  'beine-hoch': { n: 'Beine an die Wand', m: 'reco', h: ['waden', 'hams'], nb: [], eq: 'Wand', lv: 1, min: 3, dos: { typ: 'zeit', sek: 180, s: 1 },
    st: ['Seitlich an die Wand setzen und in die Rückenlage drehen.', 'Die Beine senkrecht an die Wand lehnen, das Gesäß liegt nah an der Wand.', 'Die Arme locker ablegen und ruhig atmen.'],
    f: ['Die Knie dürfen leicht gebeugt bleiben.', 'Bei Kribbeln in den Füßen kurz pausieren.'], le: 'Die Unterschenkel auf einen Stuhl legen.', sw: '5 Minuten liegen bleiben.',
    an: { d: 6, y: 0.5, p: [wand(151)], a: [4, 5], k: [[0, hochA], [0.5, hochB], [1, hochA]] } },
  'fussrolle': { n: 'Fußsohle ausrollen', m: 'reco', h: ['waden'], nb: ['schienbein'], eq: 'Tennisball', lv: 1, min: 2, dos: { typ: 'zeit', sek: 60, s: 2 }, seiten: true,
    st: ['Aufrecht stehen und einen Fuß auf den Ball stellen.', 'Mit leichtem Druck langsam von der Ferse bis zum Ballen rollen.', 'Nach einer Minute den Fuß wechseln.'],
    f: ['Der Druck ist angenehm, nicht schmerzhaft.', 'Bei Bedarf an der Wand festhalten.'], le: 'Im Sitzen rollen.', sw: 'An empfindlichen Stellen kurz verweilen.',
    an: { d: 3, as: 1, p: [['ball', 140, 146, -8, 4]], a: [10, 11], k: [[0, rollA], [0.5, rollB], [1, rollA]] } },
  // ---------- Welle 1 (Vorlage: free-exercise-db, gemeinfrei; Texte neu geschrieben) ----------
  'kinn-einziehen': { n: 'Kinn einziehen im Liegen', m: 'kraft', h: ['nacken'], nb: [], eq: 'Matte', lv: 1, min: 2, dos: { typ: 'wdh', n: 10, s: 2 },
    st: ['Rückenlage, die Knie aufgestellt, der Hinterkopf liegt auf dem Boden.', 'Das Kinn sanft Richtung Brust ziehen, als würdest du ein Doppelkinn machen. Der Hinterkopf gleitet dabei leicht über den Boden.', '5 Sekunden halten, dann lösen.'],
    f: ['Den Kopf nicht vom Boden abheben.', 'Nur sanft ziehen, die Kiefermuskeln bleiben locker.'], le: 'Nur 2 Sekunden halten.', sw: 'Im Sitzen ohne Unterlage ausführen.',
    an: { d: 5, a: [0, 1], k: [[0, kinnA], [0.3, kinnB], [0.8, kinnB], [1, kinnA]] } },
  'kopf-schieben': { n: 'Kopf vor und zurück schieben', m: 'mobil', h: ['nacken'], nb: ['oruecken'], eq: 'Stuhl', lv: 1, min: 2, dos: { typ: 'wdh', n: 10, s: 2 },
    st: ['Aufrecht auf einen Stuhl setzen, der Blick geht geradeaus.', 'Den Kopf langsam waagerecht nach vorn schieben, als wolltest du etwas ansehen.', 'Dann den Kopf nach hinten schieben, bis ein Doppelkinn entsteht. Ruhig hin und her bewegen.'],
    f: ['Den Kopf nicht nicken oder kippen, er gleitet waagerecht.', 'Die Schultern bleiben ruhig.'], le: 'Kleinerer Weg.', sw: 'Hinten jeweils 3 Sekunden halten.',
    an: { d: 5, p: stuhl(82, 126), a: [0, 1], k: [[0, kopfN], [0.25, kopfV], [0.5, kopfN], [0.75, kopfZ], [1, kopfN]] } },
  'nacken-ball': { n: 'Nacken mit dem Ball an der Wand lockern', m: 'reco', h: ['nacken'], nb: ['oruecken'], eq: 'Tennisball, Wand', lv: 1, min: 2, dos: { typ: 'zeit', sek: 60, s: 2 },
    st: ['Mit dem Rücken zur Wand stellen und den Ball zwischen Wand und Nacken klemmen, seitlich neben der Wirbelsäule.', 'Durch leichtes Beugen und Strecken der Knie den Ball langsam über die Nackenmuskeln rollen.', 'An verspannten Stellen kurz verweilen, dann die Seite wechseln.'],
    f: ['Nicht direkt auf der Wirbelsäule rollen.', 'Der Druck ist angenehm, nicht schmerzhaft.'], le: 'Weniger gegen die Wand lehnen.', sw: 'Den Kopf dabei langsam zur Seite drehen.',
    an: { d: 4, p: [wand(84), ['ball', 92, 41, 6, 4.5]], a: [0, 1], k: [[0, ballA], [0.5, ballB], [1, ballA]] } },
  'arm-pendeln': { n: 'Arm pendeln lassen', m: 'reco', h: ['schultern'], nb: [], eq: 'Stuhl', lv: 1, min: 2, dos: { typ: 'zeit', sek: 45, s: 2 }, seiten: true,
    st: ['Mit einer Hand auf einer Stuhlfläche abstützen und den Oberkörper nach vorn neigen.', 'Den anderen Arm ganz locker hängen lassen.', 'Durch sanftes Wiegen des Körpers den Arm vor und zurück pendeln lassen, dann die Seite wechseln.'],
    f: ['Den Arm nicht aktiv schwingen, die Bewegung kommt aus dem Körper.', 'Der Rücken bleibt lang.'], le: 'Kleinere Pendelbewegung.', sw: 'Zusätzlich kleine Kreise pendeln.',
    an: { d: 3, as: 1, p: stuhl(150, 116), a: [1, 7, 8], k: [[0, pendel(-90)], [0.25, pendel(-70)], [0.5, pendel(-90)], [0.75, pendel(-110)], [1, pendel(-90)]] } },
  'rolle-atmen': { n: 'Auf der Rolle liegen und atmen', m: 'reco', h: ['brust'], nb: ['oruecken'], eq: 'Faszienrolle', lv: 1, min: 3, dos: { typ: 'zeit', sek: 120, s: 1 },
    st: ['Die Rolle längs auf die Matte legen und sich so darauflegen, dass Kopf und Wirbelsäule darauf ruhen.', 'Die Füße aufstellen und die Arme seitlich mit den Handflächen nach oben ablegen.', 'Ruhig in den Brustkorb atmen und die Schultern zum Boden sinken lassen.'],
    f: ['Der Kopf liegt auf der Rolle, der Nacken entspannt.', 'Bei Kribbeln in den Händen die Arme tiefer legen.'], le: 'Ein gerolltes Handtuch statt der Rolle nehmen.', sw: 'Die Arme langsam über den Kopf führen und zurück.',
    an: { d: 8, y: -0.6, p: [['rollex', 50, 116, 142.5, 7.5]], a: [1, 2], k: [[0, rolleA], [0.4, rolleB], [0.6, rolleB], [1, rolleA]] } },
  'bizeps-curl': { n: 'Bizeps-Curl mit Band oder Flaschen', m: 'kraft', h: ['bizeps'], nb: ['unterarme'], eq: 'Kurzhanteln', lv: 1, min: 3, dos: { typ: 'wdh', n: 12, s: 3 },
    st: ['Aufrecht stehen, in jeder Hand eine Kurzhantel oder eine gefüllte Wasserflasche, die Handflächen zeigen nach vorn.', 'Die Ellbogen bleiben am Körper. Die Unterarme langsam nach oben beugen.', 'Oben kurz halten, dann langsam wieder absenken.'],
    f: ['Nicht mit dem Oberkörper Schwung holen.', 'Die Ellbogen wandern nicht nach vorn.'], le: 'Leichtere Flaschen oder ein Band, auf dem du stehst.', sw: '3 Sekunden absenken.',
    an: { d: 3.5, p: [['hantel', 8], ['hantel', 13]], a: [7, 8], k: [[0, curlA], [0.4, curlB], [0.55, curlB], [1, curlA]] } },
  'trizeps-dehnung': { n: 'Trizeps-Dehnung über dem Kopf', m: 'dehn', h: ['trizeps'], nb: ['schultern'], eq: 'Ohne Geräte', lv: 1, min: 2, dos: { typ: 'zeit', sek: 30, s: 2 }, seiten: true,
    st: ['Aufrecht stehen und einen Arm nach oben strecken.', 'Den Ellbogen beugen, sodass die Hand hinter den Nacken sinkt.', 'Mit der anderen Hand den Ellbogen sanft nach hinten drücken und halten, dann die Seite wechseln.'],
    f: ['Den Kopf nicht nach vorn drücken.', 'Nicht ins Hohlkreuz ausweichen.'], le: 'Ohne Druck der anderen Hand.', sw: 'Den Oberkörper leicht zur Seite neigen.',
    an: { d: 6, as: 1, y: -1, a: [1, 7, 8], k: [[0, trizA], [0.35, trizB], [0.8, trizB], [1, trizA]] } },
  'handgelenk-curls': { n: 'Handgelenk-Curls mit Flasche', m: 'kraft', h: ['unterarme'], nb: [], eq: 'Kurzhanteln', lv: 1, min: 3, dos: { typ: 'wdh', n: 15, s: 2 },
    st: ['Auf einen Stuhl setzen, die Unterarme auf den Oberschenkeln, die Handgelenke ragen über die Knie.', 'In jeder Hand eine Flasche oder Kurzhantel, die Handflächen zeigen nach oben.', 'Die Handgelenke langsam nach oben beugen und wieder absenken. Danach mit den Handflächen nach unten.'],
    f: ['Nur die Handgelenke bewegen, die Unterarme bleiben liegen.', 'Langsam absenken.'], le: 'Leichtere Flaschen.', sw: 'Oben 2 Sekunden halten.',
    an: { d: 3, p: stuhl(82, 126).concat([['hantel', 8], ['hantel', 13]]), a: [7, 8], k: [[0, wristA], [0.45, wristB], [0.55, wristB], [1, wristA]] } },
  'unterarm-dehnen': { n: 'Unterarm dehnen', m: 'dehn', h: ['unterarme'], nb: [], eq: 'Ohne Geräte', lv: 1, min: 2, dos: { typ: 'zeit', sek: 20, s: 2 }, seiten: true,
    st: ['Einen Arm gestreckt nach vorn heben, die Handfläche zeigt nach vorn, die Finger nach oben.', 'Mit der anderen Hand die Finger sanft zum Körper ziehen und halten.', 'Danach die Hand nach unten abknicken und den Handrücken sanft heranziehen. Dann die Seite wechseln.'],
    f: ['Nur sanft ziehen.', 'Der Ellbogen bleibt gestreckt, die Schulter unten.'], le: 'Den Ellbogen leicht beugen.', sw: 'Länger halten.',
    an: { d: 6, as: 1, a: [7, 8], k: [[0, uaA], [0.35, uaB], [0.8, uaB], [1, uaA]] } },
  'unterarm-ausrollen': { n: 'Unterarm mit dem Ball ausrollen', m: 'reco', h: ['unterarme'], nb: [], eq: 'Tennisball, Tisch', lv: 1, min: 2, dos: { typ: 'zeit', sek: 60, s: 2 }, seiten: true,
    st: ['An einen Tisch setzen und einen Unterarm mit der Innenseite auf einen Ball legen.', 'Mit leichtem Druck den Unterarm langsam vom Handgelenk bis kurz vor den Ellbogen rollen.', 'Danach die Außenseite des Unterarms rollen, dann die Seite wechseln.'],
    f: ['Die Ellenbeuge selbst aussparen.', 'Der Druck ist angenehm, nicht schmerzhaft.'], le: 'Weniger Druck.', sw: 'Mit der anderen Hand leicht auf den Unterarm drücken.',
    an: { d: 4, as: 1, p: stuhl(82, 126).concat([['box', 118, 104, -30, 180, 108, 30], ['box', 120, 108, 26, 123, 150, 29], ['box', 175, 108, 26, 178, 150, 29], ['box', 120, 108, -29, 123, 150, -26], ['box', 175, 108, -29, 178, 150, -26], ['ball', 140, 100, 19, 4]]), a: [7, 8], k: [[0, uarA], [0.5, uarB], [1, uarA]] } },
  'kobra': { n: 'Kobra', m: 'dehn', h: ['bauch'], nb: ['uruecken'], eq: 'Matte', lv: 1, min: 2, dos: { typ: 'zeit', sek: 20, s: 3 },
    st: ['Bauchlage, die Hände neben der Brust aufsetzen, die Ellbogen am Körper.', 'Den Oberkörper langsam aufrichten, das Becken bleibt am Boden.', 'Nur so weit hochkommen, wie es im unteren Rücken angenehm ist. Halten und ruhig atmen.'],
    f: ['Die Schultern nicht zu den Ohren ziehen.', 'Das Becken bleibt liegen.'], le: 'Auf den Unterarmen bleiben (Sphinx).', sw: 'Die Arme fast strecken.',
    an: { d: 6, a: [1, 2, 3], k: [[0, kobraA], [0.35, kobraB], [0.8, kobraB], [1, kobraA]] } },
  'becken-kippen': { n: 'Becken kippen in Rückenlage', m: 'mobil', h: ['bauch'], nb: ['uruecken'], eq: 'Matte', lv: 1, min: 2, dos: { typ: 'wdh', n: 12, s: 2 },
    st: ['Rückenlage, die Knie aufgestellt, die Arme neben dem Körper.', 'Ausatmen und den unteren Rücken sanft auf den Boden drücken, das Becken kippt nach hinten.', 'Einatmen und ein kleines Hohlkreuz machen. Langsam im Atemrhythmus wechseln.'],
    f: ['Das Gesäß bleibt am Boden.', 'Klein und ruhig bewegen.'], le: 'Nur den Rücken an den Boden drücken.', sw: 'Mit gestreckten Beinen.',
    an: { d: 5, a: [2, 3], k: [[0, kippA], [0.5, kippB], [1, kippA]] } },
  'rudern-band': { n: 'Rudern mit dem Band', m: 'kraft', h: ['oruecken'], nb: ['bizeps', 'schultern'], eq: 'Widerstandsband', lv: 1, min: 3, dos: { typ: 'wdh', n: 12, s: 3 },
    st: ['Das Band in Brusthöhe an einer Türklinke befestigen, beide Enden greifen und einen Schritt zurückgehen.', 'Leicht in die Knie gehen, der Oberkörper ist aufrecht.', 'Die Ellbogen eng am Körper nach hinten ziehen und die Schulterblätter zusammenführen. Langsam zurück.'],
    f: ['Die Schultern nicht hochziehen.', 'Nicht mit dem Oberkörper nach hinten lehnen.'], le: 'Näher an die Tür stellen.', sw: 'Weiter weg stellen oder ein stärkeres Band.',
    an: { d: 3.5, y: -0.9, p: [['box', 178, -8, -14, 181, 150, 14], ['band', 178, 72, 0, 8], ['band', 178, 72, 0, 13]], a: [1, 7, 8], k: [[0, ruderA], [0.4, ruderB], [0.55, ruderB], [1, ruderA]] } },
  'ruecken-rund': { n: 'Rücken rund schieben', m: 'dehn', h: ['oruecken'], nb: ['nacken'], eq: 'Ohne Geräte', lv: 1, min: 2, dos: { typ: 'zeit', sek: 20, s: 3 },
    st: ['Aufrecht stehen, die Finger vor der Brust verschränken.', 'Die Arme nach vorn strecken, den oberen Rücken rund machen und den Kopf sinken lassen.', 'Die Schulterblätter auseinanderziehen, halten und ruhig in den Rücken atmen.'],
    f: ['Die Hüfte bleibt über den Füßen.', 'Nicht die Luft anhalten.'], le: 'Im Sitzen ausführen.', sw: 'Die Hände nach links und rechts wandern lassen.',
    an: { d: 6, a: [1, 2], k: [[0, rundA], [0.35, rundB], [0.8, rundB], [1, rundA]] } },
  'oberer-ruecken-rollen': { n: 'Oberen Rücken ausrollen', m: 'reco', h: ['oruecken'], nb: [], eq: 'Faszienrolle', lv: 1, min: 2, dos: { typ: 'zeit', sek: 60, s: 2 },
    st: ['Die Rolle quer unter den oberen Rücken legen, die Füße aufstellen, die Arme vor der Brust kreuzen.', 'Das Becken anheben und dich mit den Beinen langsam vor und zurück schieben.', 'Von den Schulterblättern bis zur Mitte des Rückens rollen. An festen Stellen kurz verweilen.'],
    f: ['Nicht über den unteren Rücken rollen.', 'Den Kopf mit dem Kinn leicht zur Brust halten.'], le: 'Das Becken am Boden lassen.', sw: 'Leicht zur Seite drehen und eine Seite einzeln rollen.',
    an: { d: 5, p: [['rolle', 70, 142.5, -30, 30, 7.5]], a: [1, 2], k: [[0, obrRolle(100)], [0.5, obrRolle(111)], [1, obrRolle(100)]] } },
  'stufenlagerung': { n: 'Stufenlagerung', m: 'reco', h: ['uruecken'], nb: ['hueftbeuger'], eq: 'Stuhl', lv: 1, min: 3, dos: { typ: 'zeit', sek: 180, s: 1 },
    st: ['Rückenlage vor einem Stuhl.', 'Die Unterschenkel auf die Sitzfläche legen, Hüfte und Knie sind etwa im rechten Winkel.', 'Die Arme locker ablegen, ruhig in den Bauch atmen und den Rücken schwer werden lassen.'],
    f: ['Die Unterschenkel liegen ganz auf.', 'Kein Kissen unter den Kopf, wenn der Nacken entspannt ist.'], le: 'Nur 1 Minute.', sw: 'Dabei die Box-Atmung üben.',
    an: { d: 8, p: stuhl(128, 116), a: [2, 3], k: [[0, stufeA], [0.4, stufeB], [0.6, stufeB], [1, stufeA]] } },
  'gesaess-ball': { n: 'Gesäß mit dem Ball lockern', m: 'reco', h: ['gesaess'], nb: [], eq: 'Tennisball', lv: 1, min: 2, dos: { typ: 'zeit', sek: 60, s: 2 }, seiten: true,
    st: ['Auf den Boden setzen und einen Ball unter eine Gesäßhälfte legen.', 'Die Hände hinter dem Körper abstützen und das Gewicht auf den Ball verlagern.', 'In kleinen Kreisen langsam über den Muskel rollen. An festen Stellen kurz verweilen, dann die Seite wechseln.'],
    f: ['Nicht auf dem Steißbein oder dem Sitzknochen rollen.', 'Bei ausstrahlendem Schmerz abbrechen.'], le: 'Auf einer weichen Unterlage.', sw: 'Den Fuß der Seite aufs andere Knie legen.',
    an: { d: 4, as: 1, p: [['ball', 110, 146, 8, 4]], a: [2, 3], k: [[0, gesBall(0, 0)], [0.25, gesBall(3, -0.5)], [0.5, gesBall(0, -1)], [0.75, gesBall(-3, -0.5)], [1, gesBall(0, 0)]] } },
  'knieheben': { n: 'Knieheben im Stand', m: 'kraft', h: ['hueftbeuger'], nb: ['bauch'], eq: 'Ohne Geräte', lv: 1, min: 2, dos: { typ: 'wdh', n: 12, s: 2 },
    st: ['Aufrecht stehen, die Arme locker.', 'Langsam ein Knie bis auf Hüfthöhe heben, der gegenüberliegende Arm schwingt mit.', 'Kurz halten, absetzen und das andere Bein heben, wie langsames Marschieren.'],
    f: ['Den Oberkörper nicht nach hinten lehnen.', 'Das Standbein bleibt stabil.'], le: 'Das Knie nur halb so hoch heben.', sw: 'Oben 3 Sekunden halten.',
    an: { d: 4, a: [3, 4], k: [[0, marschN], [0.2, marschL], [0.3, marschL], [0.5, marschN], [0.7, marschR], [0.8, marschR], [1, marschN]] } },
  'bein-schwingen': { n: 'Bein vor und zurück schwingen', m: 'mobil', h: ['hueftbeuger'], nb: ['hams', 'gesaess'], eq: 'Ohne Geräte', lv: 1, min: 2, dos: { typ: 'wdh', n: 12, s: 2 }, seiten: true,
    st: ['Seitlich neben eine Wand oder Stuhllehne stellen und mit einer Hand festhalten.', 'Das äußere Bein locker vor und zurück schwingen.', 'Den Schwung langsam größer werden lassen, dann die Seite wechseln.'],
    f: ['Der Oberkörper bleibt aufrecht.', 'Nicht ins Hohlkreuz schwingen.'], le: 'Kleinere Bewegung.', sw: 'Danach seitlich vor dem Körper schwingen.',
    an: { d: 2.4, as: 1, a: [3, 4], k: [[0, schwung(-90)], [0.25, schwung(-48)], [0.5, schwung(-90)], [0.75, schwung(-122)], [1, schwung(-90)]] } },
  'quad-dehnung': { n: 'Oberschenkel-Dehnung im Stehen', m: 'dehn', h: ['quad'], nb: ['hueftbeuger'], eq: 'Wand', lv: 1, min: 2, dos: { typ: 'zeit', sek: 30, s: 2 }, seiten: true,
    st: ['Mit einer Hand an der Wand abstützen.', 'Ein Knie beugen und den Fuß mit der Hand fassen, die Ferse Richtung Gesäß ziehen.', 'Die Knie bleiben nebeneinander, das Becken leicht nach vorn schieben. Halten, dann die Seite wechseln.'],
    f: ['Nicht ins Hohlkreuz fallen.', 'Das Knie zeigt nach unten, nicht zur Seite.'], le: 'Ein Handtuch um den Fuß legen und daran ziehen.', sw: 'Das Gesäß fester anspannen.',
    an: { d: 6, as: 1, y: 2.4, p: [wand(156)], a: [3, 4], k: [[0, quadSt([120, 86], -92)], [0.35, quadSt([122, 86], -101)], [0.8, quadSt([122, 86], -101)], [1, quadSt([120, 86], -92)]] } },
  'quad-rollen': { n: 'Oberschenkel vorne ausrollen', m: 'reco', h: ['quad'], nb: [], eq: 'Faszienrolle', lv: 1, min: 2, dos: { typ: 'zeit', sek: 60, s: 2 },
    st: ['Unterarmstütz, die Rolle liegt quer unter den Oberschenkeln.', 'Mit den Armen langsam vor und zurück schieben und von der Hüfte bis kurz über das Knie rollen.', 'An festen Stellen kurz verweilen, ruhig atmen.'],
    f: ['Bauch und Gesäß leicht anspannen, kein Hohlkreuz.', 'Nicht über die Kniescheibe rollen.'], le: 'Ein Bein am Boden lassen.', sw: 'Ein Bein über das andere legen.',
    an: { d: 5, p: [['rolle', 100, 142.5, -30, 30, 7.5]], a: [3, 4], k: [[0, quadRolle(108)], [0.5, quadRolle(132)], [1, quadRolle(108)]] } },
  'kreuzheben-einbeinig': { n: 'Kreuzheben auf einem Bein', m: 'kraft', h: ['hams'], nb: ['gesaess', 'uruecken'], eq: 'Ohne Geräte', lv: 2, min: 3, dos: { typ: 'wdh', n: 8, s: 2 }, seiten: true,
    st: ['Auf einem Bein stehen, das Knie ist leicht gebeugt.', 'Den Oberkörper mit geradem Rücken nach vorn neigen und das freie Bein gestreckt nach hinten heben.', 'Bis etwa waagerecht gehen, dann langsam aufrichten. Danach die Seite wechseln.'],
    f: ['Der Rücken bleibt gerade, nicht rund.', 'Das Becken dreht nicht auf.'], le: 'Die Fußspitze des freien Beins am Boden lassen oder an der Wand festhalten.', sw: 'Eine Flasche in die Hände nehmen.',
    an: { d: 5, as: 1, a: [2, 3, 4], k: [[0, kreuzA], [0.4, kreuzB], [0.55, kreuzB], [1, kreuzA]] } },
  'raupe': { n: 'Raupe (Inchworm)', m: 'mobil', h: ['hams'], nb: ['schultern', 'bauch'], eq: 'Ohne Geräte', lv: 2, min: 3, dos: { typ: 'wdh', n: 6, s: 2 },
    st: ['Aufrecht stehen, dann mit möglichst gestreckten Beinen nach vorn beugen und die Hände vor den Füßen aufsetzen.', 'Mit den Händen Schritt für Schritt nach vorn laufen, bis du im hohen Liegestütz bist.', 'Kurz halten, dann mit den Händen zurücklaufen und langsam aufrichten.'],
    f: ['Die Hüfte im Liegestütz nicht durchhängen lassen.', 'Die Knie dürfen leicht gebeugt sein.'], le: 'Die Knie stärker beugen.', sw: 'Im Liegestütz einen Liegestütz einbauen.',
    an: { d: 9, a: [2, 3, 4], k: [[0, raupe[0]], [0.16, raupe[1]], [0.3, raupe[2]], [0.45, raupe[3]], [0.6, raupe[3]], [0.74, raupe[2]], [0.86, raupe[1]], [1, raupe[0]]] } },
  'kissen-druecken': { n: 'Kissen zwischen den Knien drücken', m: 'kraft', h: ['addu'], nb: ['bauch'], eq: 'Kissen', lv: 1, min: 2, dos: { typ: 'zeit', sek: 10, s: 5 },
    st: ['Rückenlage, die Knie aufgestellt, ein Kissen oder ein zusammengerolltes Handtuch zwischen den Knien.', 'Die Knie fest gegen das Kissen drücken.', '10 Sekunden halten, dann lösen. Ruhig weiteratmen.'],
    f: ['Nicht die Luft anhalten.', 'Der untere Rücken bleibt ruhig am Boden.'], le: 'Nur mit halber Kraft drücken.', sw: 'Dabei das Becken zur Glute Bridge anheben.',
    an: { d: 5, p: [['ball', liegeBasis[8], liegeBasis[9], 0, 4.6]], a: [3, 4], k: [[0, kissenA], [0.3, kissenB], [0.8, kissenB], [1, kissenA]] } },
  'schienbein-dehnung': { n: 'Schienbein-Dehnung im Fersensitz', m: 'dehn', h: ['schienbein'], nb: ['quad'], eq: 'Matte', lv: 1, min: 2, dos: { typ: 'zeit', sek: 30, s: 2 },
    st: ['Auf die Fersen setzen, die Fußrücken liegen flach auf der Matte.', 'Die Hände hinter dem Körper aufsetzen.', 'Langsam nach hinten lehnen, bis es vorn am Schienbein und am Fußrücken zieht. Halten.'],
    f: ['Nicht federn.', 'Bei Knieschmerzen ein Kissen zwischen Gesäß und Fersen legen.'], le: 'Aufrecht sitzen bleiben.', sw: 'Die Knie leicht vom Boden abheben.',
    an: { d: 6, a: [4, 5], k: [[0, fersA], [0.35, fersB], [0.8, fersB], [1, fersA]] } },
  // ---------- Welle 2 (Vorlage: free-exercise-db, gemeinfrei; Texte neu geschrieben) ----------
  'kinn-zur-brust': { n: 'Kinn zur Brust', m: 'dehn', h: ['nacken'], nb: ['oruecken'], eq: 'Stuhl', lv: 1, min: 2, dos: { typ: 'zeit', sek: 30, s: 2 },
    st: ['Aufrecht auf einen Stuhl setzen, die Schultern locker.', 'Das Kinn langsam zur Brust sinken lassen, bis es im Nacken zieht.', 'Halten, ruhig atmen und langsam wieder aufrichten.'],
    f: ['Nicht federn.', 'Den Rücken nicht rund machen, nur der Kopf sinkt.'], le: 'Nur halb so weit sinken lassen.', sw: 'Die Hände locker auf den Hinterkopf legen, ohne zu ziehen.',
    an: { d: 6, p: stuhl(82, 126), a: [0, 1], k: [[0, kopfN], [0.35, kinnBrust], [0.8, kinnBrust], [1, kopfN]] } },
  'pike-liegestuetz': { n: 'Pike-Liegestütz', m: 'kraft', h: ['schultern'], nb: ['trizeps', 'oruecken'], eq: 'Ohne Geräte', lv: 2, min: 3, dos: { typ: 'wdh', n: 8, s: 3 },
    st: ['Aus dem Liegestütz das Gesäß hoch schieben, bis der Körper ein umgedrehtes V bildet.', 'Die Ellbogen beugen und den Kopf zwischen den Händen Richtung Boden senken.', 'Kraftvoll zurückdrücken, das Gesäß bleibt oben.'],
    f: ['Die Ellbogen zeigen schräg nach hinten, nicht zur Seite.', 'Den Kopf nicht auf den Boden fallen lassen.'], le: 'Die Hände auf eine Stufe oder einen Stuhl stellen.', sw: 'Die Füße erhöht auf eine Stufe stellen.',
    an: { d: 3.5, a: [1, 7, 8], k: [[0, pikeA], [0.45, pikeB], [0.55, pikeB], [1, pikeA]] } },
  'wand-liegestuetz': { n: 'Liegestütz an der Wand', m: 'kraft', h: ['brust'], nb: ['trizeps', 'schultern'], eq: 'Wand', lv: 1, min: 3, dos: { typ: 'wdh', n: 12, s: 3 },
    st: ['Etwa einen großen Schritt vor einer Wand stehen und die Hände auf Schulterhöhe an die Wand legen.', 'Den Körper gerade halten und die Brust zur Wand senken.', 'Kraftvoll zurückdrücken.'],
    f: ['Die Hüfte nicht nach hinten schieben.', 'Die Fersen dürfen sich heben, der Körper bleibt eine Linie.'], le: 'Näher an die Wand stellen.', sw: 'Weiter weg stellen oder die Hände auf einen Tisch stützen.',
    an: { d: 3, y: -0.3, p: [wand(190)], a: [1, 7, 8], k: [[0, wandLS(72)], [0.45, wandLS(64)], [0.55, wandLS(64)], [1, wandLS(72)]] } },
  'knie-liegestuetz': { n: 'Knie-Liegestütz', m: 'kraft', h: ['brust'], nb: ['trizeps', 'bauch'], eq: 'Matte', lv: 1, min: 3, dos: { typ: 'wdh', n: 10, s: 3 },
    st: ['Hände etwas weiter als schulterbreit aufsetzen, die Knie liegen auf der Matte.', 'Der Körper bildet eine Linie von den Knien bis zum Kopf.', 'Die Brust zum Boden senken und wieder hochdrücken.'],
    f: ['Die Hüfte nicht nach oben schieben.', 'Der Bauch bleibt angespannt.'], le: 'Nur halb so tief gehen.', sw: 'Der klassische Liegestütz auf den Füßen.',
    an: { d: 3, a: [1, 7, 8], k: [[0, knieLS(37.5, [22, 24, 22, 24])], [0.45, knieLS(18, [22, 24, 22, 24])], [0.55, knieLS(18, [22, 24, 22, 24])], [1, knieLS(37.5, [22, 24, 22, 24])]] } },
  'handtuch-curl': { n: 'Handtuch-Curl', m: 'kraft', h: ['bizeps'], nb: ['unterarme'], eq: 'Handtuch', lv: 1, min: 3, dos: { typ: 'wdh', n: 10, s: 3 },
    st: ['Aufrecht stehen und mit einem Fuß auf die Mitte eines Handtuchs treten.', 'Die Enden mit beiden Händen fassen, die Ellbogen am Körper.', 'Gegen den Widerstand des Fußes langsam hochziehen, oben 2 Sekunden halten und langsam absenken.'],
    f: ['Nicht mit dem Rücken ziehen.', 'Der Fuß gibt nur so viel nach, dass es anstrengend bleibt.'], le: 'Mit dem Fuß weniger dagegenhalten.', sw: 'Oben 5 Sekunden halten.',
    an: { d: 4, p: [['seil', 5, 8], ['seil', 5, 13]], a: [7, 8], k: [[0, curlA], [0.45, curlB], [0.6, curlB], [1, curlA]] } },
  'enge-liegestuetze': { n: 'Enge Liegestütze auf den Knien', m: 'kraft', h: ['trizeps'], nb: ['brust', 'schultern'], eq: 'Matte', lv: 2, min: 3, dos: { typ: 'wdh', n: 8, s: 3 },
    st: ['Knie-Liegestütz, die Hände liegen eng unter der Brust.', 'Die Ellbogen eng am Körper nach hinten beugen und die Brust senken.', 'Kraftvoll hochdrücken.'],
    f: ['Die Ellbogen gehen nicht zur Seite.', 'Der Körper bleibt eine Linie.'], le: 'An der Wand ausführen.', sw: 'Auf den Füßen statt auf den Knien.',
    an: { d: 3, a: [1, 7, 8], k: [[0, knieLS(37.5, [16, 7, 16, 7])], [0.45, knieLS(18, [16, 7, 16, 7])], [0.55, knieLS(18, [16, 7, 16, 7])], [1, knieLS(37.5, [16, 7, 16, 7])]] } },
  'ball-druecken': { n: 'Ball kräftig drücken', m: 'kraft', h: ['unterarme'], nb: [], eq: 'Tennisball', lv: 1, min: 2, dos: { typ: 'zeit', sek: 5, s: 10 }, seiten: true,
    st: ['Bequem sitzen und einen Tennisball in eine Hand nehmen.', 'Den Ball 5 Sekunden so fest drücken, wie es angenehm geht.', 'Lösen, kurz lockern und wiederholen, dann die Hand wechseln.'],
    f: ['Das Handgelenk bleibt gerade.', 'Nicht die Luft anhalten.'], le: 'Einen weichen Schaumstoffball nehmen.', sw: 'Länger halten oder einzelne Finger drücken.',
    an: { d: 3, as: 1, p: stuhl(82, 126).concat([['ball', ballHand[16], ballHand[17], 19, 3.8]]), a: [7, 8], k: [[0, ballHand], [0.5, ballHand], [1, ballHand]] } },
  'crunch': { n: 'Crunch', m: 'kraft', h: ['bauch'], nb: [], eq: 'Matte', lv: 1, min: 3, dos: { typ: 'wdh', n: 12, s: 3 },
    st: ['Rückenlage, die Knie aufgestellt, die Arme zeigen nach vorn Richtung Knie.', 'Ausatmen und Kopf und Schultern langsam vom Boden lösen.', 'Kurz halten und langsam wieder ablegen.'],
    f: ['Nicht am Kopf ziehen und nicht mit Schwung hochkommen.', 'Der untere Rücken bleibt am Boden.'], le: 'Nur den Kopf und die Schulterspitzen anheben.', sw: 'Die Arme vor der Brust kreuzen und oben 2 Sekunden halten.',
    an: { d: 3, a: [1, 2], k: [[0, crunchA], [0.4, crunchB], [0.55, crunchB], [1, crunchA]] } },
  'seitstuetz-dips': { n: 'Seitstütz mit Hüftsenken', m: 'kraft', h: ['seitbauch'], nb: ['gesaess', 'schultern'], eq: 'Matte', lv: 2, min: 3, dos: { typ: 'wdh', n: 10, s: 2 }, seiten: true,
    st: ['Seitstütz: Der Ellbogen liegt unter der Schulter, der Körper bildet eine Linie.', 'Die Hüfte langsam ein Stück Richtung Boden senken.', 'Wieder bis in die Linie hochdrücken. Danach die Seite wechseln.'],
    f: ['Die Hüfte bewegt sich nur auf und ab, nicht nach hinten.', 'Die Schulter bleibt weg vom Ohr.'], le: 'Die Knie ablegen.', sw: 'Oben 2 Sekunden halten.',
    an: { d: 3, fl: 1, y: 0.3, a: [1, 2, 3], k: [[0, seitA], [0.45, seitDip], [0.55, seitDip], [1, seitA]] } },
  'tisch-rudern': { n: 'Rudern unter dem Tisch', m: 'kraft', h: ['oruecken'], nb: ['bizeps', 'schultern'], eq: 'Stabiler Tisch', lv: 2, min: 3, dos: { typ: 'wdh', n: 8, s: 3 },
    st: ['Unter einen stabilen Tisch legen und die Tischkante schulterbreit greifen.', 'Den Körper von den Fersen bis zum Kopf gerade halten.', 'Die Brust zur Tischkante ziehen, die Schulterblätter zusammenführen, und langsam absenken.'],
    f: ['Vorher prüfen, dass der Tisch nicht kippen kann.', 'Die Hüfte nicht hängen lassen.'], le: 'Die Knie anwinkeln.', sw: 'Oben 2 Sekunden halten.',
    an: { d: 3.5, y: -0.25, p: [['box', 130, 90, -26, 205, 94, 26], ['box', 132, 94, 24, 135, 150, 27], ['box', 200, 94, 24, 203, 150, 27], ['box', 132, 94, -27, 135, 150, -24], ['box', 200, 94, -27, 203, 150, -24]], a: [1, 7, 8], k: [[0, tischRudern(4.2)], [0.45, tischRudern(17)], [0.55, tischRudern(17)], [1, tischRudern(4.2)]] } },
  'hueftbeuge-stab': { n: 'Hüftbeuge mit Stab', m: 'kraft', h: ['uruecken'], nb: ['hams', 'gesaess'], eq: 'Besenstiel', lv: 1, min: 3, dos: { typ: 'wdh', n: 10, s: 2 },
    st: ['Einen Besenstiel längs an den Rücken halten: Er berührt Hinterkopf, Brustwirbelsäule und Kreuzbein.', 'Die Knie leicht beugen und den Oberkörper aus der Hüfte nach vorn neigen. Der Stab bleibt an allen drei Punkten.', 'Bis kurz vor waagerecht gehen und mit Spannung im Gesäß wieder aufrichten.'],
    f: ['Der Rücken bleibt gerade, der Stab verliert nicht den Kontakt.', 'Das Gesäß schiebt nach hinten.'], le: 'Nur halb so weit nach vorn.', sw: 'Ohne Stab und mit Flaschen in den Händen.',
    an: { d: 4, p: [['stab', 10]], a: [2, 3, 4], k: [[0, stabA], [0.45, stabB], [0.55, stabB], [1, stabA]] } },
  'knie-zur-brust': { n: 'Knie zur Brust', m: 'dehn', h: ['uruecken'], nb: ['gesaess'], eq: 'Matte', lv: 1, min: 2, dos: { typ: 'zeit', sek: 30, s: 2 },
    st: ['Rückenlage, die Knie aufgestellt.', 'Beide Knie zur Brust ziehen und mit den Händen unter den Knien halten.', 'Den unteren Rücken lang werden lassen und ruhig atmen. Leichtes Hin- und Herwiegen ist erlaubt.'],
    f: ['Den Kopf am Boden lassen.', 'Nicht an den Kniescheiben ziehen, sondern unter den Knien fassen.'], le: 'Nur ein Knie heranziehen.', sw: 'Die Stirn Richtung Knie heben.',
    an: { d: 6, a: [2, 3], k: [[0, liegeBasis], [0.35, kieBrustB], [0.8, kieBrustB], [1, liegeBasis]] } },
  'glute-bridge-einbeinig': { n: 'Einbeinige Glute Bridge', m: 'kraft', h: ['gesaess'], nb: ['hams', 'uruecken'], eq: 'Matte', lv: 2, min: 3, dos: { typ: 'wdh', n: 10, s: 2 }, seiten: true,
    st: ['Rückenlage, ein Fuß aufgestellt, das andere Bein gestreckt in die Luft.', 'Über die Ferse des Standbeins das Becken anheben, bis Schulter, Hüfte und Knie eine Linie bilden.', 'Kurz halten, langsam absenken. Danach die Seite wechseln.'],
    f: ['Das Becken kippt nicht zur Seite.', 'Nicht ins Hohlkreuz drücken.'], le: 'Die normale Glute Bridge mit beiden Füßen.', sw: 'Oben 3 Sekunden halten.',
    an: { d: 3.5, as: 1, a: [2, 3, 4], k: [[0, gbA], [0.4, gbB], [0.6, gbB], [1, gbA]] } },
  'ausfallschritt-rueckwaerts': { n: 'Ausfallschritt rückwärts', m: 'kraft', h: ['gesaess'], nb: ['quad', 'hams'], eq: 'Ohne Geräte', lv: 2, min: 3, dos: { typ: 'wdh', n: 10, s: 2 }, seiten: true,
    st: ['Hüftbreit stehen, die Hände an der Hüfte.', 'Einen großen Schritt nach hinten machen und das hintere Knie Richtung Boden senken.', 'Über die Ferse des vorderen Beins zurück in den Stand drücken. Danach die Seite wechseln.'],
    f: ['Das vordere Knie bleibt über dem Fuß.', 'Der Oberkörper bleibt aufrecht.'], le: 'Weniger tief gehen und an der Wand festhalten.', sw: 'Flaschen in die Hände nehmen.',
    an: { d: 4, a: [3, 4], k: [[0, ausfallS], [0.4, ausfallR], [0.55, ausfallR], [1, ausfallS]] } },
  'bein-seitlich-heben': { n: 'Bein seitlich heben in Seitenlage', m: 'kraft', h: ['gesaess'], nb: ['seitbauch'], eq: 'Matte', lv: 1, min: 3, dos: { typ: 'wdh', n: 15, s: 2 }, seiten: true,
    st: ['Seitlage, der Kopf ruht auf dem unteren Arm, die Beine liegen gestreckt übereinander.', 'Das obere Bein gestreckt nach oben heben, die Fußspitze zeigt nach vorn.', 'Langsam absenken, ohne es ganz abzulegen. Danach die Seite wechseln.'],
    f: ['Das Becken nicht nach hinten kippen lassen.', 'Nur so hoch heben, wie es ohne Ausweichen geht.'], le: 'Das untere Knie beugen.', sw: 'Ein Widerstandsband um die Oberschenkel legen.',
    an: { d: 3, fl: 1, y: 0.3, as: 1, a: [3, 9], k: [[0, seitLage([179, 179, 269])], [0.45, seitLage([148, 148, 238])], [0.55, seitLage([148, 148, 238])], [1, seitLage([179, 179, 269])]] } },
  'bein-heben-liegend': { n: 'Gestrecktes Bein heben in Rückenlage', m: 'kraft', h: ['hueftbeuger'], nb: ['quad', 'bauch'], eq: 'Matte', lv: 1, min: 3, dos: { typ: 'wdh', n: 12, s: 2 }, seiten: true,
    st: ['Rückenlage, ein Bein aufgestellt, das andere liegt gestreckt.', 'Das gestreckte Bein langsam bis auf Höhe des anderen Knies heben.', 'Kurz halten und langsam ablegen. Danach die Seite wechseln.'],
    f: ['Das Knie bleibt gestreckt.', 'Der untere Rücken bleibt am Boden.'], le: 'Weniger hoch heben.', sw: 'Oben 3 Sekunden halten.',
    an: { d: 3.5, as: 1, a: [3, 4], k: [[0, beinLiegA], [0.4, beinLiegB], [0.55, beinLiegB], [1, beinLiegA]] } },
  'ausfallschritt': { n: 'Ausfallschritt vorwärts', m: 'kraft', h: ['quad'], nb: ['gesaess', 'hams'], eq: 'Ohne Geräte', lv: 2, min: 3, dos: { typ: 'wdh', n: 10, s: 2 }, seiten: true,
    st: ['Hüftbreit stehen, die Hände an der Hüfte.', 'Einen großen Schritt nach vorn machen und beide Knie beugen, bis das hintere Knie knapp über dem Boden ist.', 'Kraftvoll zurück in den Stand drücken. Danach die Seite wechseln.'],
    f: ['Das vordere Knie schiebt nicht weit über die Zehen.', 'Der Oberkörper bleibt aufrecht.'], le: 'Den Schritt kleiner machen.', sw: 'Abwechselnd vorwärts durch den Raum gehen.',
    an: { d: 4, a: [3, 4], k: [[0, ausfallS2], [0.4, ausfallV], [0.55, ausfallV], [1, ausfallS2]] } },
  'step-up': { n: 'Aufsteigen auf eine Stufe', m: 'kraft', h: ['quad'], nb: ['gesaess'], eq: 'Stufe', lv: 1, min: 3, dos: { typ: 'wdh', n: 10, s: 2 }, seiten: true,
    st: ['Vor eine stabile Stufe oder die unterste Treppenstufe stellen.', 'Einen Fuß ganz auf die Stufe setzen und über dieses Bein hochdrücken, bis du oben stehst.', 'Langsam mit demselben Bein wieder absteigen. Danach die Seite wechseln.'],
    f: ['Nicht mit dem unteren Bein abstoßen.', 'Das Knie zeigt in Richtung der Zehen.'], le: 'Eine niedrigere Stufe nehmen und am Geländer festhalten.', sw: 'Eine höhere Stufe oder Flaschen in den Händen.',
    an: { d: 4.5, as: 1, p: [['box', 130, 128, -24, 176, 150, 24]], a: [3, 4], k: [[0, stepA], [0.3, stepB], [0.5, stepC], [0.7, stepB], [1, stepA]] } },
  'beincurl-handtuch': { n: 'Beincurl auf dem Handtuch', m: 'kraft', h: ['hams'], nb: ['gesaess'], eq: 'Handtuch', lv: 2, min: 3, dos: { typ: 'wdh', n: 8, s: 2 },
    st: ['Rückenlage auf glattem Boden, die Fersen auf einem Handtuch, das Becken angehoben.', 'Die Fersen langsam nach vorn schieben, bis die Beine fast gestreckt sind. Das Becken bleibt oben.', 'Die Fersen wieder heranziehen.'],
    f: ['Das Becken nicht absacken lassen.', 'Langsam und kontrolliert bewegen.'], le: 'Nur heranziehen, zum Ausstrecken das Becken ablegen.', sw: 'Einbeinig ausführen.',
    an: { d: 4, a: [3, 4], k: [[0, curlTuchA], [0.45, curlTuchB], [0.55, curlTuchB], [1, curlTuchA]] } },
  'beinrueckseite-handtuch': { n: 'Beinrückseite dehnen mit Handtuch', m: 'dehn', h: ['hams'], nb: ['waden'], eq: 'Handtuch', lv: 1, min: 2, dos: { typ: 'zeit', sek: 30, s: 2 }, seiten: true,
    st: ['Rückenlage, ein Handtuch um die Fußsohle legen.', 'Das Bein gestreckt nach oben führen und mit dem Handtuch sanft heranziehen.', 'Halten, bis es an der Oberschenkelrückseite zieht. Danach die Seite wechseln.'],
    f: ['Das andere Bein bleibt am Boden.', 'Das Becken bleibt liegen.'], le: 'Das Knie leicht beugen.', sw: 'Die Fußspitze zu dir ziehen.',
    an: { d: 6, as: 1, p: [['seil', 5, 8], ['seil', 5, 13]], a: [3, 4], k: [[0, tuchBein(58)], [0.35, tuchBein(72)], [0.8, tuchBein(72)], [1, tuchBein(58)]] } },
  'adduktoren-seitlage': { n: 'Unteres Bein heben in Seitenlage', m: 'kraft', h: ['addu'], nb: [], eq: 'Matte', lv: 1, min: 3, dos: { typ: 'wdh', n: 15, s: 2 }, seiten: true,
    st: ['Seitlage, der Kopf ruht auf dem unteren Arm.', 'Das obere Bein beugen und den Fuß vor dem unteren Knie aufstellen.', 'Das untere Bein gestreckt ein Stück anheben und langsam absenken. Danach die Seite wechseln.'],
    f: ['Das Becken bleibt senkrecht.', 'Klein und kontrolliert bewegen.'], le: 'Weniger hoch heben.', sw: 'Oben 2 Sekunden halten.',
    an: { d: 3, fl: 1, y: 0.3, as: 1, a: [3, 4], k: [[0, seitLage({ ziel: [86, 146], knick: -1 })], [0.45, seitLage({ ziel: [86, 146], knick: -1 }, [168, 168, 258])], [0.55, seitLage({ ziel: [86, 146], knick: -1 }, [168, 168, 258])], [1, seitLage({ ziel: [86, 146], knick: -1 })]] } },
  'wadendehnung-knie': { n: 'Wadendehnung mit gebeugtem Knie', m: 'dehn', h: ['waden'], nb: [], eq: 'Wand', lv: 1, min: 2, dos: { typ: 'zeit', sek: 30, s: 2 }, seiten: true,
    st: ['Schrittstellung vor der Wand, die Hände stützen sich ab.', 'Das hintere Knie beugen, die Ferse bleibt am Boden.', 'Das Gewicht nach unten und vorn verlagern, bis es tief unten in der Wade zieht. Dann die Seite wechseln.'],
    f: ['Die hintere Ferse nicht abheben.', 'Beide Füße zeigen gerade nach vorn.'], le: 'Kleinerer Schritt.', sw: 'Länger halten und tiefer gehen.',
    an: { d: 6, p: [wand(180.5)], a: [9, 10], k: [[0, wadeKnie([126, 90])], [0.35, wadeKnie([124, 98])], [0.8, wadeKnie([124, 98])], [1, wadeKnie([126, 90])]] } },
  'fussspitzen-heben': { n: 'Fußspitzen heben an der Wand', m: 'kraft', h: ['schienbein'], nb: [], eq: 'Wand', lv: 1, min: 2, dos: { typ: 'wdh', n: 15, s: 3 },
    st: ['Mit dem Rücken an die Wand lehnen, die Fersen etwa eine Fußlänge davor.', 'Die Fußspitzen so weit wie möglich anheben, die Fersen bleiben am Boden.', 'Langsam absenken, ohne ganz abzulegen.'],
    f: ['Nicht mit dem Oberkörper schaukeln.', 'Langsam bewegen.'], le: 'Näher an der Wand stehen.', sw: 'Einbeinig ausführen.',
    an: { d: 2.5, p: [wand(84)], a: [4, 5], k: [[0, zehenWand(0)], [0.45, zehenWand(38)], [0.55, zehenWand(38)], [1, zehenWand(0)]] } },
  // ---------- Welle 3: Bewegungen zur Seite und Drehungen (Vorlage: free-exercise-db; Texte neu) ----------
  'nacken-seitlich-halten': { n: 'Nacken halten gegen die Hand', m: 'kraft', h: ['nacken'], nb: ['schultern'], eq: 'Stuhl', lv: 1, min: 2, dos: { typ: 'zeit', sek: 8, s: 4 }, seiten: true,
    st: ['Aufrecht sitzen und eine Hand seitlich an den Kopf legen, über dem Ohr.', 'Den Kopf sanft gegen die Hand drücken, die Hand hält dagegen. Der Kopf bewegt sich dabei nicht.', '8 Sekunden halten, lösen und die Seite wechseln. Danach auch Stirn und Hinterkopf.'],
    f: ['Nur mit wenig Kraft drücken.', 'Nicht die Luft anhalten.'], le: 'Kürzer halten.', sw: 'Etwas fester drücken, weiterhin ohne Bewegung.',
    an: { d: 5, y: -1.1, as: 1, p: stuhl(82, 126), a: [0, 1], k: [[0, nackenHand(0)], [0.3, nackenHand(4)], [0.8, nackenHand(4)], [1, nackenHand(0)]] } },
  'seitheben': { n: 'Seitheben mit Band oder Flaschen', m: 'kraft', h: ['schultern'], nb: ['nacken'], eq: 'Kurzhanteln', lv: 1, min: 3, dos: { typ: 'wdh', n: 12, s: 3 },
    st: ['Aufrecht stehen, in jeder Hand eine Flasche oder Kurzhantel, die Arme hängen seitlich.', 'Die Arme mit leicht gebeugten Ellbogen seitlich bis auf Schulterhöhe heben.', 'Kurz halten und langsam absenken.'],
    f: ['Die Schultern nicht zu den Ohren ziehen.', 'Nicht über Schulterhöhe heben und nicht mit Schwung arbeiten.'], le: 'Leichtere Flaschen oder nur bis zur halben Höhe.', sw: '3 Sekunden absenken.',
    an: { d: 3.5, y: -1.3, p: [['hantel', 8], ['hantel', 13]], a: [1, 7, 8], k: [[0, seitheb(4)], [0.4, seitheb(84)], [0.55, seitheb(84)], [1, seitheb(4)]] } },
  'arm-quer': { n: 'Arm quer vor der Brust', m: 'dehn', h: ['schultern'], nb: ['oruecken'], eq: 'Ohne Geräte', lv: 1, min: 2, dos: { typ: 'zeit', sek: 30, s: 2 }, seiten: true,
    st: ['Aufrecht stehen und einen Arm gestreckt auf Schulterhöhe vor die Brust führen.', 'Mit der anderen Hand den Arm oberhalb des Ellbogens sanft heranziehen.', 'Halten, bis es hinten an der Schulter zieht, dann die Seite wechseln.'],
    f: ['Die Schulter bleibt unten.', 'Den Oberkörper nicht mitdrehen.'], le: 'Weniger heranziehen.', sw: 'Den Arm etwas tiefer oder höher führen, um andere Stellen zu dehnen.',
    an: { d: 6, y: -1.1, as: 1, a: [1, 7, 8], k: [[0, armQuer(0)], [0.35, armQuer(4)], [0.8, armQuer(4)], [1, armQuer(0)]] } },
  'buch-oeffnen': { n: 'Brustkorb aufdrehen in Seitenlage', m: 'mobil', h: ['brust'], nb: ['oruecken'], eq: 'Matte', lv: 1, min: 3, dos: { typ: 'wdh', n: 8, s: 2 }, seiten: true,
    st: ['Seitlage, Hüfte und Knie im rechten Winkel gebeugt, beide Arme liegen gestreckt vor dir.', 'Den oberen Arm in einem Bogen über oben nach hinten öffnen, der Blick folgt der Hand.', 'Die Knie bleiben aufeinander. Kurz halten und langsam zurück. Danach die Seite wechseln.'],
    f: ['Die Knie nicht auseinandergleiten lassen.', 'Nur so weit öffnen, wie es angenehm ist.'], le: 'Ein Kissen unter den Kopf legen und kleiner öffnen.', sw: 'Hinten 3 Sekunden halten und tief einatmen.',
    an: { d: 6, fl: 1, y: 2.5, as: 1, a: [1, 12, 13], k: [[0, buch(0)], [0.4, buch(-150)], [0.6, buch(-150)], [1, buch(0)]] } },
  'bizeps-wand': { n: 'Bizeps-Dehnung an der Wand', m: 'dehn', h: ['bizeps'], nb: ['brust', 'schultern'], eq: 'Wand', lv: 1, min: 2, dos: { typ: 'zeit', sek: 30, s: 2 }, seiten: true,
    st: ['Seitlich neben eine Wand stellen und die Handfläche hinter dir auf Schulterhöhe an die Wand legen, der Arm ist gestreckt.', 'Den Oberkörper langsam von der Wand wegdrehen.', 'Halten, bis es vorn am Oberarm zieht, dann die Seite wechseln.'],
    f: ['Den Ellbogen nicht durchdrücken.', 'Langsam drehen, nicht ruckartig.'], le: 'Die Hand tiefer an die Wand legen.', sw: 'Weiter wegdrehen.',
    an: { d: 6, y: 2.7, as: 1, p: [['box', 60, -8, 66, 160, 150, 69]], a: [1, 7, 8], k: [[0, bizepsWand(0)], [0.35, bizepsWand(-22)], [0.8, bizepsWand(-22)], [1, bizepsWand(0)]] } },
  'handgelenke-kreisen': { n: 'Handgelenke kreisen', m: 'mobil', h: ['unterarme'], nb: [], eq: 'Ohne Geräte', lv: 1, min: 2, dos: { typ: 'wdh', n: 10, s: 2 },
    st: ['Aufrecht stehen, die Ellbogen am Körper, die Unterarme zeigen nach vorn.', 'Die Hände locker zu Fäusten schließen und die Handgelenke langsam kreisen lassen.', '10 Kreise, dann die Richtung wechseln.'],
    f: ['Die Unterarme bleiben ruhig, nur die Handgelenke bewegen sich.', 'Die Kreise so groß, wie es schmerzfrei geht.'], le: 'Kleinere Kreise.', sw: 'Mit geöffneten Händen und gespreizten Fingern.',
    an: { d: 2.4, lin: true, y: -0.9, a: [7, 8], k: KREIS_HAND } },
  'russian-twist': { n: 'Russian Twist', m: 'kraft', h: ['seitbauch'], nb: ['bauch'], eq: 'Matte', lv: 2, min: 3, dos: { typ: 'wdh', n: 16, s: 2 },
    st: ['Auf den Boden setzen, die Knie gebeugt, die Fersen am Boden.', 'Mit geradem Rücken leicht nach hinten lehnen und die Hände vor der Brust zusammenführen.', 'Den Oberkörper abwechselnd nach rechts und links drehen, die Hände folgen.'],
    f: ['Der Rücken bleibt lang, nicht rund.', 'Aus dem Rumpf drehen, nicht nur die Arme schwingen.'], le: 'Weniger weit zurücklehnen.', sw: 'Die Füße vom Boden abheben oder eine Flasche halten.',
    an: { d: 3, y: -0.9, a: [1, 2], k: [[0, twist(0)], [0.25, twist(38)], [0.5, twist(0)], [0.75, twist(-38)], [1, twist(0)]] } },
  'seitneigung': { n: 'Seitneigung im Stehen', m: 'dehn', h: ['seitbauch'], nb: ['oruecken'], eq: 'Ohne Geräte', lv: 1, min: 2, dos: { typ: 'zeit', sek: 20, s: 2 }, seiten: true,
    st: ['Hüftbreit stehen und einen Arm gestreckt nach oben führen.', 'Den Oberkörper langsam zur anderen Seite neigen, als würdest du über einen Ball greifen.', 'Halten, bis es in der Flanke zieht, langsam aufrichten und die Seite wechseln.'],
    f: ['Nicht nach vorn oder hinten kippen, nur zur Seite.', 'Die Hüfte bleibt über den Füßen.'], le: 'Die Hand auf den Kopf statt gestreckt.', sw: 'Beide Arme über den Kopf.',
    an: { d: 6, y: -1.3, as: 1, a: [1, 2, 3], k: [[0, neigung(0)], [0.35, neigung(-20)], [0.8, neigung(-20)], [1, neigung(0)]] } },
  'rumpf-drehen': { n: 'Rumpf drehen im Sitzen', m: 'mobil', h: ['seitbauch'], nb: ['oruecken'], eq: 'Stuhl', lv: 1, min: 2, dos: { typ: 'wdh', n: 10, s: 2 },
    st: ['Aufrecht auf einen Stuhl setzen, die Füße fest am Boden, die Arme vor der Brust gekreuzt.', 'Den Oberkörper langsam zu einer Seite drehen, das Becken bleibt gerade.', 'Zurück zur Mitte und zur anderen Seite drehen.'],
    f: ['Die Knie bleiben nebeneinander.', 'Aufrecht bleiben, nicht zusammensinken.'], le: 'Kleinerer Bewegungsumfang.', sw: 'Am Ende jeweils 3 Sekunden halten.',
    an: { d: 5, y: -0.9, p: stuhl(82, 126), a: [1, 2], k: [[0, sitzDreh(0)], [0.25, sitzDreh(40)], [0.5, sitzDreh(0)], [0.75, sitzDreh(-40)], [1, sitzDreh(0)]] } },
  'ytw': { n: 'Y-T-W in Bauchlage', m: 'kraft', h: ['oruecken'], nb: ['schultern', 'uruecken'], eq: 'Matte', lv: 1, min: 3, dos: { typ: 'wdh', n: 6, s: 2 },
    st: ['Bauchlage, die Stirn auf einem kleinen Handtuch.', 'Die Arme nacheinander in die Form Y (schräg nach vorn), T (zur Seite) und W (Ellbogen gebeugt) bringen und jeweils wenige Zentimeter anheben.', 'Die Schulterblätter dabei nach hinten unten ziehen, jede Position kurz halten.'],
    f: ['Den Kopf nicht in den Nacken legen.', 'Nur so hoch heben, wie es ohne Hohlkreuz geht.'], le: 'Nur Y und T.', sw: 'Jede Position 3 Sekunden halten.',
    an: { d: 9, y: 2.6, a: [1, 7, 8], k: [[0, ytw('Y', 0)], [0.1, ytw('Y', 1)], [0.25, ytw('Y', 1)], [0.38, ytw('T', 1)], [0.53, ytw('T', 1)], [0.66, ytw('W', 1)], [0.81, ytw('W', 1)], [0.92, ytw('W', 0)], [1, ytw('Y', 0)]] } },
  'lat-dehnung': { n: 'Seitliche Rumpfdehnung am Türrahmen', m: 'dehn', h: ['oruecken'], nb: ['seitbauch'], eq: 'Türrahmen', lv: 1, min: 2, dos: { typ: 'zeit', sek: 30, s: 2 }, seiten: true,
    st: ['Seitlich neben einen Türrahmen stellen.', 'Den äußeren Arm über den Kopf führen und den Rahmen fassen, die andere Hand greift auf Hüfthöhe.', 'Die Hüfte vom Rahmen wegschieben, bis es seitlich am Rücken zieht. Halten, dann die Seite wechseln.'],
    f: ['Nicht nach vorn beugen.', 'Ruhig in die gedehnte Seite atmen.'], le: 'Ohne Rahmen, die Hand nur nach oben strecken.', sw: 'Einen Schritt weiter weg stellen.',
    an: { d: 6, y: -1.3, as: 1, p: [['box', 117, -8, -48, 123, 150, -44]], a: [1, 7, 8], k: [[0, latDehn(0)], [0.35, latDehn(-16)], [0.8, latDehn(-16)], [1, latDehn(0)]] } },
  'scheibenwischer': { n: 'Knie zur Seite fallen lassen', m: 'mobil', h: ['uruecken'], nb: ['seitbauch', 'gesaess'], eq: 'Matte', lv: 1, min: 2, dos: { typ: 'wdh', n: 10, s: 2 },
    st: ['Rückenlage, die Knie aufgestellt, die Arme seitlich ausgestreckt.', 'Beide Knie langsam zu einer Seite sinken lassen, die Schultern bleiben am Boden.', 'Zurück zur Mitte und zur anderen Seite.'],
    f: ['Die Schultern heben nicht ab.', 'Langsam und ohne Schwung.'], le: 'Nur halb so weit sinken lassen.', sw: 'Die Füße vom Boden abheben.',
    an: { d: 6, y: -0.9, a: [2, 3], k: [[0, wischer(0)], [0.25, wischer(42)], [0.5, wischer(0)], [0.75, wischer(-42)], [1, wischer(0)]] } },
  'clamshell': { n: 'Clamshell (Muschel)', m: 'kraft', h: ['gesaess'], nb: [], eq: 'Matte', lv: 1, min: 3, dos: { typ: 'wdh', n: 15, s: 2 }, seiten: true,
    st: ['Seitlage, die Knie leicht gebeugt, die Füße aufeinander.', 'Die Füße bleiben zusammen, das obere Knie öffnet sich wie eine Muschel.', 'Kurz halten und langsam schließen. Danach die Seite wechseln.'],
    f: ['Das Becken nicht nach hinten kippen lassen.', 'Langsam bewegen.'], le: 'Kleinerer Bewegungsumfang.', sw: 'Ein Widerstandsband um die Knie legen.',
    an: { d: 3, fl: 1, y: -0.6, as: 1, a: [3, 9], k: [[0, muschel(0)], [0.4, muschel(16)], [0.55, muschel(16)], [1, muschel(0)]] } },
  'figur-4': { n: 'Gesäß-Dehnung in Rückenlage (Figur 4)', m: 'dehn', h: ['gesaess'], nb: [], eq: 'Matte', lv: 1, min: 2, dos: { typ: 'zeit', sek: 30, s: 2 }, seiten: true,
    st: ['Rückenlage, beide Knie aufgestellt.', 'Einen Knöchel auf das andere Knie legen, das Knie zeigt nach außen.', 'Das untere Bein vom Boden heben und sanft zur Brust ziehen, bis es im Gesäß zieht. Dann die Seite wechseln.'],
    f: ['Den Kopf am Boden lassen.', 'Den Fuß des oberen Beins anziehen, das schützt das Knie.'], le: 'Den Fuß des unteren Beins am Boden lassen.', sw: 'Das untere Bein weiter heranziehen.',
    an: { d: 6, y: -0.8, as: 1, a: [3, 4], k: [[0, figur4(0)], [0.35, figur4(28)], [0.8, figur4(28)], [1, figur4(0)]] } },
  'hueftkreisen': { n: 'Hüftkreisen im Vierfüßlerstand', m: 'mobil', h: ['gesaess'], nb: ['hueftbeuger'], eq: 'Matte', lv: 1, min: 2, dos: { typ: 'wdh', n: 8, s: 2 }, seiten: true,
    st: ['Vierfüßlerstand: Hände unter den Schultern, Knie unter der Hüfte.', 'Ein Knie leicht anheben und mit ihm große Kreise beschreiben: nach vorn, zur Seite, nach hinten.', '8 Kreise, dann die Richtung und die Seite wechseln.'],
    f: ['Der Rücken bleibt ruhig und gerade.', 'Die Bewegung kommt aus der Hüfte.'], le: 'Kleinere Kreise.', sw: 'Langsamer und größer kreisen.',
    an: { d: 4, lin: true, y: -0.6, as: 1, a: [3, 4], k: [[0, hueftKreis(0, 0, 3)], [0.25, hueftKreis(-28, 8, 4)], [0.5, hueftKreis(0, 50, 0)], [0.75, hueftKreis(18, 14, 8)], [1, hueftKreis(0, 0, 3)]] } },
  'schmetterling': { n: 'Schmetterling', m: 'dehn', h: ['addu'], nb: [], eq: 'Matte', lv: 1, min: 2, dos: { typ: 'zeit', sek: 30, s: 2 },
    st: ['Aufrecht sitzen, die Fußsohlen zusammenlegen, die Knie fallen nach außen.', 'Die Füße mit den Händen umfassen.', 'Mit geradem Rücken leicht nach vorn neigen und die Knie sinken lassen. Halten.'],
    f: ['Nicht auf die Knie drücken.', 'Der Rücken bleibt lang.'], le: 'Die Füße weiter vom Körper weg.', sw: 'Die Fersen näher heranziehen.',
    an: { d: 6, y: -1.2, a: [3, 4], k: [[0, schmetterling(95, 128, 30)], [0.35, schmetterling(78, 133, 33)], [0.8, schmetterling(78, 133, 33)], [1, schmetterling(95, 128, 30)]] } },
  'seitlicher-ausfallschritt': { n: 'Seitlicher Ausfallschritt', m: 'mobil', h: ['addu'], nb: ['quad', 'gesaess'], eq: 'Ohne Geräte', lv: 1, min: 3, dos: { typ: 'wdh', n: 8, s: 2 },
    st: ['Breit stehen, die Füße zeigen leicht nach außen.', 'Das Gewicht zu einer Seite verlagern und dieses Knie beugen, das andere Bein bleibt gestreckt.', 'Kurz halten, bis es innen am gestreckten Bein zieht, dann zur anderen Seite wechseln.'],
    f: ['Das gebeugte Knie zeigt in Richtung der Zehen.', 'Die Fersen bleiben am Boden.'], le: 'Weniger tief gehen.', sw: 'Tiefer gehen und unten 3 Sekunden halten.',
    an: { d: 4, y: -1.35, as: 1, a: [9, 10], k: [[0, seitAusfall(0)], [0.4, seitAusfall(1)], [0.6, seitAusfall(1)], [1, seitAusfall(0)]] } },
  'fusskreisen': { n: 'Fußkreisen', m: 'mobil', h: ['waden'], nb: ['schienbein'], eq: 'Stuhl', lv: 1, min: 2, dos: { typ: 'wdh', n: 10, s: 2 }, seiten: true,
    st: ['Auf einen Stuhl setzen und ein Bein gestreckt nach vorn heben.', 'Mit der Fußspitze langsam große Kreise malen.', '10 Kreise, dann die Richtung und das Bein wechseln.'],
    f: ['Das Bein bleibt ruhig, nur der Fuß bewegt sich.', 'Langsam und so groß wie möglich.'], le: 'Die Ferse auf dem Boden lassen.', sw: 'Mit der Fußspitze das Alphabet schreiben.',
    an: { d: 3, lin: true, y: -0.7, as: 1, p: stuhl(82, 126), a: [5, 6], k: KREIS_FUSS } }
};

export const LEVEL = ['', 'Einsteiger', 'Fortgeschritten', 'Profi'];

// Geräte für den Filter „Meine Geräte“. Die Angabe eq einer Übung wird an „, “ getrennt und hierüber zugeordnet.
export const GERAETE = [
  { id: 'matte', n: 'Matte' }, { id: 'wand', n: 'Freie Wand' }, { id: 'stuhl', n: 'Stuhl' }, { id: 'tuer', n: 'Türrahmen' },
  { id: 'tisch', n: 'Stabiler Tisch' }, { id: 'stufe', n: 'Stufe oder Treppe' }, { id: 'handtuch', n: 'Handtuch' }, { id: 'kissen', n: 'Kissen' },
  { id: 'stab', n: 'Besenstiel' }, { id: 'ball', n: 'Tennisball' }, { id: 'hanteln', n: 'Kurzhanteln oder Wasserflaschen' },
  { id: 'band', n: 'Widerstandsband' }, { id: 'rolle', n: 'Faszienrolle' }
];
const EQ_ID = { 'Matte': 'matte', 'Wand': 'wand', 'Stuhl': 'stuhl', 'Türrahmen': 'tuer', 'Tisch': 'tisch', 'Stabiler Tisch': 'tisch', 'Stufe': 'stufe', 'Handtuch': 'handtuch', 'Kissen': 'kissen', 'Besenstiel': 'stab', 'Tennisball': 'ball', 'Kurzhanteln': 'hanteln', 'Widerstandsband': 'band', 'Faszienrolle': 'rolle' };
export const geraeteVon = (u) => (u.eq === 'Ohne Geräte' ? [] : u.eq.split(', ').map((n) => EQ_ID[n]));

export const THEMEN = [
  { n: 'Nacken nach dem Bürotag', ids: ['nacken-loesen', 'schulterkreisen', 'brustdehnung', 'wand-engel'] },
  { n: 'Vor dem Laufen', ids: ['kniebeuge', 'wadenheben', 'einbeinstand', 'katze-kuh'] },
  { n: 'Nach dem Laufen', ids: ['wadendehnung', 'hueftbeuger-dehnung', 'vorbeuge', 'beine-hoch'] },
  { n: 'Rücken stärken', ids: ['superman', 'bird-dog', 'unterarmstuetz', 'glute-bridge'] },
  { n: 'Besser schlafen', ids: ['box-atmung', 'kindhaltung', 'beine-hoch'] },
  { n: 'Starke Beine ohne Geräte', ids: ['kniebeuge', 'ausfallschritt', 'ausfallschritt-rueckwaerts', 'kreuzheben-einbeinig', 'glute-bridge-einbeinig', 'wadenheben'] },
  { n: 'Schreibtisch: Nacken und Schultern', ids: ['kinn-zur-brust', 'kopf-schieben', 'ruecken-rund', 'arm-pendeln', 'wand-engel'] },
  { n: 'Ausrollen mit Rolle und Ball', ids: ['nacken-ball', 'oberer-ruecken-rollen', 'gesaess-ball', 'quad-rollen', 'unterarm-ausrollen', 'fussrolle'] },
  { n: 'Ohne Geräte', ids: Object.keys(UEBUNGEN).filter((id) => UEBUNGEN[id].eq === 'Ohne Geräte') }
];

export const ROUTINEN = [
  { n: 'Morgen-Mobility', ids: ['katze-kuh', 'schulterkreisen', 'kniebeuge', 'hueftbeuger-dehnung'] },
  { n: 'Büro-Pause', ids: ['nacken-loesen', 'brustdehnung', 'wand-engel', 'wandsitzen'] },
  { n: 'Rumpf stark', ids: ['dead-bug', 'bird-dog', 'unterarmstuetz', 'seitstuetz'] },
  { n: 'Abend-Recovery', ids: ['wadendehnung', 'kindhaltung', 'beine-hoch', 'box-atmung'] }
];

// Übungen einer Trainingsart, die einen Muskel als Haupt- oder Nebenmuskel nutzen
export const liste = (mid, modus) => Object.keys(UEBUNGEN).filter((id) => UEBUNGEN[id].m === modus && (UEBUNGEN[id].h.includes(mid) || UEBUNGEN[id].nb.includes(mid)));
export const modusName = (id) => (MODI.find((m) => m.id === id) || {}).n || '';
