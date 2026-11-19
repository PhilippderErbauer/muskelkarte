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
    an: { d: 6, a: [4, 5], k: [[0, fersA], [0.35, fersB], [0.8, fersB], [1, fersA]] } }
};

export const LEVEL = ['', 'Einsteiger', 'Fortgeschritten', 'Profi'];

export const THEMEN = [
  { n: 'Nacken nach dem Bürotag', ids: ['nacken-loesen', 'schulterkreisen', 'brustdehnung', 'wand-engel'] },
  { n: 'Vor dem Laufen', ids: ['kniebeuge', 'wadenheben', 'einbeinstand', 'katze-kuh'] },
  { n: 'Nach dem Laufen', ids: ['wadendehnung', 'hueftbeuger-dehnung', 'vorbeuge', 'beine-hoch'] },
  { n: 'Rücken stärken', ids: ['superman', 'bird-dog', 'unterarmstuetz', 'glute-bridge'] },
  { n: 'Besser schlafen', ids: ['box-atmung', 'kindhaltung', 'beine-hoch'] },
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
