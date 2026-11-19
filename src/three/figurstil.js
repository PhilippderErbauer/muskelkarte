// Muskelkarte · Darstellung der Figur
// Drei Looks aus demselben Körper. Jede Farbe wird pro Bildpunkt aus der Muskelfläche berechnet.
//   0 Skulptur:     weich beleuchtet, Muskelgruppen als abgerundete Flächen
//   1 Linien:       Höhenlinien wie bei einem 3D-Scan, Muskelgruppen als farbige Linien
//   2 Illustration: flache Farben ohne Licht, klare Umrisslinie, wie eine Zeichnung
// Die JavaScript-Fassung (für Vorschaubilder und Geräte ohne WebGL) und die GLSL-Fassung
// (für den Grafikchip) rechnen dasselbe.

import { region, regionGLSL } from './figur.js';

export const FIGUR_STILE = {
  skulptur: { n: 'Skulptur', id: 0 },
  linien: { n: 'Linien', id: 1 },
  flach: { n: 'Illustration', id: 2 }
};

const LINIEN_JE_METER = 52;
const L1 = [-0.48, 0.58, 0.66], L2 = [0.82, 0.16, 0.55], HV = [-0.27, 0.33, 0.9];
const sstep = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const mixc = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];

// f: { basis, fl: [18 Farben], linie, fuell, rim, spec } (0..1); px: Meter pro Bildpunkt
export function schattiere(stil, x, y, z, nx, ny, nz, ao, f, px) {
  const [id, s] = region(x, y, z);
  const al = id ? sstep(-px, px, s) : 0;
  const rc = f.fl[id] || f.basis;
  const d1 = Math.max(0, nx * L1[0] + ny * L1[1] + nz * L1[2]), d2 = Math.max(0, nx * L2[0] + ny * L2[1] + nz * L2[2]);
  const fr = 1 - Math.max(0, nz);
  if (stil === 1) {
    let c = mixc(f.fuell, rc, al * 0.16);
    const I = 0.93 + 0.07 * d1;
    c = [c[0] * I, c[1] * I, c[2] * I];
    const dichte = f.dichte || LINIEN_JE_METER; // für kleine Bilder (Icons) weniger Linien
    const ph = y * dichte, dl = Math.abs(ph - Math.floor(ph) - 0.5);
    const fw = dichte * px / Math.max(0.3, Math.sqrt(Math.max(0, 1 - ny * ny)));
    const breite = al > 0.5 ? 1.9 : 1.0;
    const lin = 1 - sstep(0.5 * fw * breite, 1.5 * fw * breite, dl);
    const lc = mixc(f.linie, rc, al);
    c = mixc(c, lc, lin);
    const rim = sstep(0.62, 0.9, fr);
    return mixc(c, f.linie, rim * 0.9);
  }
  if (stil === 2) {
    const c = mixc(f.basis, rc, al);
    const I = 0.95 + 0.05 * d1;
    const rim = sstep(0.8, 0.9, fr);
    return mixc([c[0] * I, c[1] * I, c[2] * I], f.linie, rim);
  }
  const c = mixc(f.basis, rc, al);
  const I = (0.52 + 0.12 * ny + 0.48 * d1 + 0.12 * d2) * ao;
  let h = Math.max(0, nx * HV[0] + ny * HV[1] + nz * HV[2]); h = Math.pow(h, 24);
  const add = fr * fr * fr * f.rim + h * f.spec;
  return [c[0] * I + add, c[1] * I + add, c[2] * I + add];
}

export const FIGUR_VS = `
attribute vec3 aP; attribute vec3 aN; attribute float aA;
uniform vec3 uT; uniform vec4 uR; uniform vec4 uK; uniform vec2 uO;
varying vec3 vP; varying vec3 vN; varying float vA;
void main() {
  vec3 p = aP - uT;
  float x1 = p.x * uR.x + p.z * uR.y; float z1 = -p.x * uR.y + p.z * uR.x;
  float y2 = p.y * uR.z - z1 * uR.w; float z2 = p.y * uR.w + z1 * uR.z;
  float f = uK.z / (uK.z - z2);
  gl_Position = vec4(x1 * uK.x * f + uO.x, y2 * uK.y * f + uO.y, -z2 * uK.w, 1.0);
  float nx = aN.x * uR.x + aN.z * uR.y; float nz1 = -aN.x * uR.y + aN.z * uR.x;
  vN = vec3(nx, aN.y * uR.z - nz1 * uR.w, aN.y * uR.w + nz1 * uR.z);
  vP = aP; vA = aA;
}`;

export function figurFS(derivate) {
  return `${derivate ? '#extension GL_OES_standard_derivatives : enable\n' : ''}
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
varying vec3 vP; varying vec3 vN; varying float vA;
uniform vec3 uFl[18]; uniform vec3 uBasis; uniform vec3 uLinie; uniform vec3 uFuell;
uniform vec2 uL; uniform float uStil; uniform float uPx;
${regionGLSL()}
void main() {
  vec3 n = normalize(vN);
  vec2 r = region(vP);
  float id = r.x, s = r.y;
  float w = ${derivate ? 'max(fwidth(s), uPx * 0.5)' : 'uPx'};
  float al = id > 0.5 ? smoothstep(-w, w, s) : 0.0;
  vec3 rc = uBasis;
  for (int i = 1; i < 18; i++) { if (abs(float(i) - id) < 0.5) rc = uFl[i]; }
  float d1 = max(0.0, dot(n, vec3(-0.48, 0.58, 0.66)));
  float d2 = max(0.0, dot(n, vec3(0.82, 0.16, 0.55)));
  float fr = 1.0 - max(0.0, n.z);
  vec3 c;
  if (uStil > 1.5) {
    c = mix(uBasis, rc, al) * (0.95 + 0.05 * d1);
    c = mix(c, uLinie, smoothstep(0.8, 0.9, fr));
  } else if (uStil > 0.5) {
    c = mix(uFuell, rc, al * 0.16) * (0.93 + 0.07 * d1);
    float ph = vP.y * ${LINIEN_JE_METER}.0;
    float dl = abs(fract(ph) - 0.5);
    float fw = ${derivate ? 'max(fwidth(ph), 0.0001)' : `${LINIEN_JE_METER}.0 * uPx / max(0.3, sqrt(max(0.0, 1.0 - n.y * n.y)))`};
    float br = al > 0.5 ? 1.9 : 1.0;
    float lin = 1.0 - smoothstep(0.5 * fw * br, 1.5 * fw * br, dl);
    c = mix(c, mix(uLinie, rc, al), lin);
    c = mix(c, uLinie, smoothstep(0.62, 0.9, fr) * 0.9);
  } else {
    float I = (0.52 + 0.12 * n.y + 0.48 * d1 + 0.12 * d2) * vA;
    float h = pow(max(0.0, dot(n, vec3(-0.27, 0.33, 0.9))), 24.0);
    c = mix(uBasis, rc, al) * I + vec3(fr * fr * fr * uL.x + h * uL.y);
  }
  gl_FragColor = vec4(clamp(c, 0.0, 1.0), 1.0);
}`;
}
