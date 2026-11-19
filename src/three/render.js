// Muskelkarte · Zeichnen
//
// Zwei Wege mit derselben Kamera und demselben Licht:
// - WebGL (schnell, Standard auf allen aktuellen Geräten)
// - Software-Rasterizer (Ersatz ohne WebGL, für statische Bilder und fürs Antippen von Muskeln)
//
// Kamera: { yaw, pitch, tx, ty, tz, cx, cy, s, F }
//   yaw/pitch Drehung, t* Blickpunkt, cx/cy Bildmitte in Pixeln, s Pixel pro Einheit, F Perspektive

import { figurVS, figurFS, schattiere } from './figurstil.js';

const { cos, sin, max, min } = Math;
const L1 = [-0.48, 0.58, 0.66], L2 = [0.82, 0.16, 0.55], HV = [-0.27, 0.33, 0.9];

// out: { W, H, D (RGBA), ZB (Tiefe), IB (Muskel-ID, optional) }
// th: { rim, spec }
export function zeichneSoft(mesh, col, cam, out, th) {
  const P = mesh.P, N = mesh.N, A = mesh.A, T = mesh.T, n = mesh.n, W = out.W, H = out.H, D = out.D, ZB = out.ZB, IB = out.IB, ID = mesh.M;
  if (!mesh.S || mesh.S.length < n * 7) mesh.S = new Float32Array(n * 7);
  const S = mesh.S;
  D.fill(0); ZB.fill(-1e9); if (IB) IB.fill(0);
  const cyw = cos(cam.yaw), syw = sin(cam.yaw), cp = cos(cam.pitch), sp = sin(cam.pitch), F = cam.F, sc = cam.s;
  for (let i = 0; i < n; i++) {
    const x = P[3 * i] - cam.tx, y = P[3 * i + 1] - cam.ty, z = P[3 * i + 2] - cam.tz;
    const x1 = x * cyw + z * syw, z1 = -x * syw + z * cyw;
    const y2 = y * cp - z1 * sp, z2 = y * sp + z1 * cp;
    const f = F / (F - z2), o = i * 7;
    S[o] = cam.cx + x1 * sc * f; S[o + 1] = cam.cy - y2 * sc * f; S[o + 2] = z2;
    const nx0 = N[3 * i], ny0 = N[3 * i + 1], nz0 = N[3 * i + 2];
    const nx = nx0 * cyw + nz0 * syw, nz1 = -nx0 * syw + nz0 * cyw;
    const ny = ny0 * cp - nz1 * sp, nz = ny0 * sp + nz1 * cp;
    const d1 = max(0, nx * L1[0] + ny * L1[1] + nz * L1[2]), d2 = max(0, nx * L2[0] + ny * L2[1] + nz * L2[2]);
    const I = (0.5 + 0.12 * ny + 0.5 * d1 + 0.14 * d2) * (A ? A[i] : 1);
    const fr = 1 - max(0, nz);
    let hh = max(0, nx * HV[0] + ny * HV[1] + nz * HV[2]); hh *= hh; hh *= hh; hh *= hh; hh = hh * hh * hh;
    const add = 255 * (fr * fr * fr * th.rim + hh * th.spec);
    S[o + 3] = col[3 * i] * I + add; S[o + 4] = col[3 * i + 1] * I + add; S[o + 5] = col[3 * i + 2] * I + add; S[o + 6] = nz;
  }
  for (let t = 0; t < T.length; t += 3) {
    const a = T[t] * 7, b = T[t + 1] * 7, c = T[t + 2] * 7;
    if (S[a + 6] < -0.12 && S[b + 6] < -0.12 && S[c + 6] < -0.12) continue;
    const x0 = S[a], y0 = S[a + 1], x1 = S[b], y1 = S[b + 1], x2 = S[c], y2 = S[c + 1];
    const area = (x1 - x0) * (y2 - y0) - (x2 - x0) * (y1 - y0);
    if (area > -1e-5 && area < 1e-5) continue;
    const ia = 1 / area;
    let mnx = Math.floor(min(x0, x1, x2)), mxx = Math.ceil(max(x0, x1, x2)), mny = Math.floor(min(y0, y1, y2)), mxy = Math.ceil(max(y0, y1, y2));
    if (mnx < 0) mnx = 0; if (mny < 0) mny = 0; if (mxx > W - 1) mxx = W - 1; if (mxy > H - 1) mxy = H - 1;
    const z0 = S[a + 2], z1 = S[b + 2], z2 = S[c + 2], id = ID ? ID[T[t]] : 0;
    for (let py = mny; py <= mxy; py++) {
      const fy = py + 0.5;
      let o = py * W + mnx;
      for (let px = mnx; px <= mxx; px++, o++) {
        const fx = px + 0.5;
        const w0 = ((x1 - fx) * (y2 - fy) - (x2 - fx) * (y1 - fy)) * ia;
        if (w0 < 0) continue;
        const w1 = ((x2 - fx) * (y0 - fy) - (x0 - fx) * (y2 - fy)) * ia;
        if (w1 < 0) continue;
        const w2 = 1 - w0 - w1;
        if (w2 < 0) continue;
        const z = w0 * z0 + w1 * z1 + w2 * z2;
        if (z <= ZB[o]) continue;
        ZB[o] = z;
        if (IB) IB[o] = id;
        const q = o * 4;
        D[q] = w0 * S[a + 3] + w1 * S[b + 3] + w2 * S[c + 3];
        D[q + 1] = w0 * S[a + 4] + w1 * S[b + 4] + w2 * S[c + 4];
        D[q + 2] = w0 * S[a + 5] + w1 * S[b + 5] + w2 * S[c + 5];
        D[q + 3] = 255;
      }
    }
  }
}

// Pixelgenau: Position und Normale werden je Bildpunkt interpoliert, shade(...) liefert die Farbe 0..1.
// Für die Figur (Muskelflächen pro Bildpunkt) ohne WebGL und für Vorschaubilder.
// Hat das Netz Abstände je Punkt (mesh.D, 18 Werte), werden sie mit interpoliert und als 8. Wert übergeben.
export function zeichnePixel(mesh, cam, out, shade) {
  const P = mesh.P, N = mesh.N, A = mesh.A, T = mesh.T, n = mesh.n, W = out.W, H = out.H, D = out.D, ZB = out.ZB, IB = out.IB, ID = mesh.M;
  const MD = mesh.D, NG = MD ? 18 : 0;
  const K = 10 + NG;
  if (!mesh.S2 || mesh.S2.length < n * K) mesh.S2 = new Float32Array(n * K);
  const S = mesh.S2;
  D.fill(0); ZB.fill(-1e9); if (IB) IB.fill(0);
  const cyw = cos(cam.yaw), syw = sin(cam.yaw), cp = cos(cam.pitch), sp = sin(cam.pitch), F = cam.F, sc = cam.s;
  for (let i = 0; i < n; i++) {
    const x = P[3 * i] - cam.tx, y = P[3 * i + 1] - cam.ty, z = P[3 * i + 2] - cam.tz;
    const x1 = x * cyw + z * syw, z1 = -x * syw + z * cyw;
    const y2 = y * cp - z1 * sp, z2 = y * sp + z1 * cp;
    const f = F / (F - z2), o = i * K;
    S[o] = cam.cx + x1 * sc * f; S[o + 1] = cam.cy - y2 * sc * f; S[o + 2] = z2;
    const nx0 = N[3 * i], ny0 = N[3 * i + 1], nz0 = N[3 * i + 2];
    const nx = nx0 * cyw + nz0 * syw, nz1 = -nx0 * syw + nz0 * cyw;
    S[o + 3] = nx; S[o + 4] = ny0 * cp - nz1 * sp; S[o + 5] = ny0 * sp + nz1 * cp;
    S[o + 6] = P[3 * i]; S[o + 7] = P[3 * i + 1]; S[o + 8] = P[3 * i + 2]; S[o + 9] = A ? A[i] : 1;
    for (let g = 0; g < NG; g++) S[o + 10 + g] = MD[i * NG + g];
  }
  const v = new Float32Array(K), dist = NG ? v.subarray(10) : undefined;
  for (let t = 0; t < T.length; t += 3) {
    const a = T[t] * K, b = T[t + 1] * K, c = T[t + 2] * K;
    if (S[a + 5] < -0.15 && S[b + 5] < -0.15 && S[c + 5] < -0.15) continue;
    const x0 = S[a], y0 = S[a + 1], x1 = S[b], y1 = S[b + 1], x2 = S[c], y2 = S[c + 1];
    const area = (x1 - x0) * (y2 - y0) - (x2 - x0) * (y1 - y0);
    if (area > -1e-5 && area < 1e-5) continue;
    const ia = 1 / area;
    let mnx = Math.floor(min(x0, x1, x2)), mxx = Math.ceil(max(x0, x1, x2)), mny = Math.floor(min(y0, y1, y2)), mxy = Math.ceil(max(y0, y1, y2));
    if (mnx < 0) mnx = 0; if (mny < 0) mny = 0; if (mxx > W - 1) mxx = W - 1; if (mxy > H - 1) mxy = H - 1;
    const id = ID ? ID[T[t]] : 0;
    for (let py = mny; py <= mxy; py++) {
      const fy = py + 0.5;
      let o = py * W + mnx;
      for (let px = mnx; px <= mxx; px++, o++) {
        const fx = px + 0.5;
        const w0 = ((x1 - fx) * (y2 - fy) - (x2 - fx) * (y1 - fy)) * ia;
        if (w0 < 0) continue;
        const w1 = ((x2 - fx) * (y0 - fy) - (x0 - fx) * (y2 - fy)) * ia;
        if (w1 < 0) continue;
        const w2 = 1 - w0 - w1;
        if (w2 < 0) continue;
        const z = w0 * S[a + 2] + w1 * S[b + 2] + w2 * S[c + 2];
        if (z <= ZB[o]) continue;
        ZB[o] = z;
        if (IB) IB[o] = id;
        for (let k = 3; k < K; k++) v[k] = w0 * S[a + k] + w1 * S[b + k] + w2 * S[c + k];
        const nl = Math.hypot(v[3], v[4], v[5]) || 1;
        const col = shade(v[6], v[7], v[8], v[3] / nl, v[4] / nl, v[5] / nl, v[9], dist);
        const q = o * 4;
        D[q] = col[0] * 255; D[q + 1] = col[1] * 255; D[q + 2] = col[2] * 255; D[q + 3] = 255;
      }
    }
  }
}

const VS = `
attribute vec3 aP; attribute vec3 aN; attribute vec3 aC; attribute float aA;
uniform vec3 uT; uniform vec4 uR; uniform vec4 uK; uniform vec2 uO;
varying vec3 vN; varying vec3 vC; varying float vA;
void main() {
  vec3 p = aP - uT;
  float x1 = p.x * uR.x + p.z * uR.y; float z1 = -p.x * uR.y + p.z * uR.x;
  float y2 = p.y * uR.z - z1 * uR.w; float z2 = p.y * uR.w + z1 * uR.z;
  float f = uK.z / (uK.z - z2);
  gl_Position = vec4(x1 * uK.x * f + uO.x, y2 * uK.y * f + uO.y, -z2 * uK.w, 1.0);
  float nx = aN.x * uR.x + aN.z * uR.y; float nz1 = -aN.x * uR.y + aN.z * uR.x;
  vN = vec3(nx, aN.y * uR.z - nz1 * uR.w, aN.y * uR.w + nz1 * uR.z);
  vC = aC; vA = aA;
}`;
const FS = `
precision mediump float;
varying vec3 vN; varying vec3 vC; varying float vA;
uniform vec2 uL;
void main() {
  vec3 n = normalize(vN);
  float d1 = max(0.0, dot(n, vec3(-0.48, 0.58, 0.66)));
  float d2 = max(0.0, dot(n, vec3(0.82, 0.16, 0.55)));
  float I = (0.5 + 0.12 * n.y + 0.5 * d1 + 0.14 * d2) * vA;
  float fr = 1.0 - max(0.0, n.z);
  float h = pow(max(0.0, dot(n, vec3(-0.27, 0.33, 0.9))), 24.0);
  gl_FragColor = vec4(clamp(vC * I + vec3(fr * fr * fr * uL.x + h * uL.y), 0.0, 1.0), 1.0);
}`;

function glAnsicht(canvas, gl) {
  const sh = (typ, src) => {
    const s = gl.createShader(typ);
    gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) || 'Shader-Fehler');
    return s;
  };
  const prog = gl.createProgram();
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS));
  gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog) || 'Link-Fehler');
  const at = (n) => gl.getAttribLocation(prog, n), un = (n) => gl.getUniformLocation(prog, n);
  const loc = { aP: at('aP'), aN: at('aN'), aC: at('aC'), aA: at('aA'), uT: un('uT'), uR: un('uR'), uK: un('uK'), uO: un('uO'), uL: un('uL') };
  const uint = gl.getExtension('OES_element_index_uint');
  const buf = { p: gl.createBuffer(), n: gl.createBuffer(), c: gl.createBuffer(), a: gl.createBuffer(), i: gl.createBuffer() };
  let anzahl = 0, idxTyp = gl.UNSIGNED_SHORT, einsen = new Float32Array(0);
  const put = (b, data, usage) => { gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, data, usage); };
  function laden(mesh, col, dyn) {
    const usage = dyn ? gl.DYNAMIC_DRAW : gl.STATIC_DRAW;
    put(buf.p, mesh.P, usage); put(buf.n, mesh.N, usage); put(buf.c, col, usage);
    let A = mesh.A;
    if (!A) { if (einsen.length < mesh.n) einsen = new Float32Array(mesh.n).fill(1); A = einsen.subarray(0, mesh.n); }
    put(buf.a, A, usage);
    const gross = mesh.n > 65535;
    if (gross && !uint) throw new Error('Netz zu groß für dieses Gerät');
    const idx = gross ? (mesh.T instanceof Uint32Array ? mesh.T : new Uint32Array(mesh.T)) : (mesh.T instanceof Uint16Array ? mesh.T : new Uint16Array(mesh.T));
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buf.i);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, idx, usage);
    idxTyp = gross ? gl.UNSIGNED_INT : gl.UNSIGNED_SHORT;
    anzahl = idx.length;
  }
  function farben(col) { gl.bindBuffer(gl.ARRAY_BUFFER, buf.c); gl.bufferSubData(gl.ARRAY_BUFFER, 0, col); }
  function zeichne(cam, th, zs) {
    const W = canvas.width, H = canvas.height;
    gl.viewport(0, 0, W, H);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    if (!anzahl) return;
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LESS);
    gl.useProgram(prog);
    const bind = (b, l, n, typ, norm) => { gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.enableVertexAttribArray(l); gl.vertexAttribPointer(l, n, typ, norm, 0, 0); };
    bind(buf.p, loc.aP, 3, gl.FLOAT, false);
    bind(buf.n, loc.aN, 3, gl.FLOAT, false);
    bind(buf.c, loc.aC, 3, gl.UNSIGNED_BYTE, true);
    bind(buf.a, loc.aA, 1, gl.FLOAT, false);
    gl.uniform3f(loc.uT, cam.tx, cam.ty, cam.tz);
    gl.uniform4f(loc.uR, cos(cam.yaw), sin(cam.yaw), cos(cam.pitch), sin(cam.pitch));
    gl.uniform4f(loc.uK, cam.s * 2 / W, cam.s * 2 / H, cam.F, zs);
    gl.uniform2f(loc.uO, (cam.cx - W / 2) * 2 / W, -(cam.cy - H / 2) * 2 / H);
    gl.uniform2f(loc.uL, th.rim, th.spec);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buf.i);
    gl.drawElements(gl.TRIANGLES, anzahl, idxTyp, 0);
  }
  return { art: 'gl', maxDpr: 2, laden, farben, zeichne };
}

export function softAnsicht(canvas) {
  const ctx = canvas.getContext('2d');
  let mesh = null, col = null, out = null;
  return {
    art: 'soft',
    maxDpr: 1,
    laden(m, c) { mesh = m; col = c; },
    farben(c) { col = c; },
    zeichne(cam, th) {
      if (!mesh || !ctx) return;
      const W = canvas.width, H = canvas.height;
      if (!out || out.W !== W || out.H !== H) {
        const img = ctx.createImageData(W, H);
        out = { W, H, img, D: img.data, ZB: new Float32Array(W * H), IB: null };
      }
      zeichneSoft(mesh, col, cam, out, th);
      ctx.putImageData(out.img, 0, 0);
    }
  };
}

// ---------- Figur mit Muskelflächen pro Bildpunkt ----------
// f: { id (Look 0–2), basis, fl[18], linie, fuell, rim, spec } mit Farben 0..1
// Netze mit Abständen je Punkt (mesh.D, Anatomie-Modell) bekommen eigene Shader.
function glFigur(canvas, gl) {
  const deriv = !!gl.getExtension('OES_standard_derivatives');
  const sh = (typ, src) => {
    const s = gl.createShader(typ);
    gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) || 'Shader-Fehler');
    return s;
  };
  const programme = {};
  function programm(modell) {
    if (programme[modell]) return programme[modell];
    const prog = gl.createProgram();
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, figurVS(modell)));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, figurFS(deriv, modell)));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog) || 'Link-Fehler');
    const at = (n) => gl.getAttribLocation(prog, n), un = (n) => gl.getUniformLocation(prog, n);
    const loc = { prog };
    for (const n of ['aP', 'aN', 'aA', 'aD0', 'aD1', 'aD2', 'aD3', 'aE']) loc[n] = at(n);
    for (const n of ['uT', 'uR', 'uK', 'uO', 'uFl', 'uBasis', 'uLinie', 'uFuell', 'uL', 'uStil', 'uPx']) loc[n] = un(n);
    return (programme[modell] = loc);
  }
  // Prüft beim Start, dass beide Shader auf diesem Gerät laufen (sonst greift der Software-Ersatz)
  let loc = programm(false);
  programm(true);
  const buf = { p: gl.createBuffer(), n: gl.createBuffer(), a: gl.createBuffer(), i: gl.createBuffer(), d: gl.createBuffer() };
  let anzahl = 0, idxTyp = gl.UNSIGNED_SHORT, modell = false;
  const uint = gl.getExtension('OES_element_index_uint');
  const fl = new Float32Array(54);
  function laden(mesh) {
    const put = (b, d) => { gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, d, gl.STATIC_DRAW); };
    put(buf.p, mesh.P); put(buf.n, mesh.N); put(buf.a, mesh.A);
    modell = !!mesh.D;
    loc = programm(modell);
    if (modell) put(buf.d, mesh.D);
    const gross = mesh.n > 65535;
    if (gross && !uint) throw new Error('Netz zu groß für dieses Gerät');
    const idx = gross ? mesh.T : new Uint16Array(mesh.T);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buf.i);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, idx, gl.STATIC_DRAW);
    idxTyp = gross ? gl.UNSIGNED_INT : gl.UNSIGNED_SHORT;
    anzahl = idx.length;
  }
  function zeichne(cam, f) {
    const W = canvas.width, H = canvas.height;
    gl.viewport(0, 0, W, H);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    if (!anzahl) return;
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LESS);
    gl.useProgram(loc.prog);
    const bind = (b, l, n, stride = 0, off = 0) => { if (l < 0) return; gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.enableVertexAttribArray(l); gl.vertexAttribPointer(l, n, gl.FLOAT, false, stride, off); };
    bind(buf.p, loc.aP, 3); bind(buf.n, loc.aN, 3); bind(buf.a, loc.aA, 1);
    // 18 Abstände je Punkt hintereinander: vier vec4 und ein vec2
    if (modell) { bind(buf.d, loc.aD0, 4, 72, 0); bind(buf.d, loc.aD1, 4, 72, 16); bind(buf.d, loc.aD2, 4, 72, 32); bind(buf.d, loc.aD3, 4, 72, 48); bind(buf.d, loc.aE, 2, 72, 64); }
    gl.uniform3f(loc.uT, cam.tx, cam.ty, cam.tz);
    gl.uniform4f(loc.uR, cos(cam.yaw), sin(cam.yaw), cos(cam.pitch), sin(cam.pitch));
    gl.uniform4f(loc.uK, cam.s * 2 / W, cam.s * 2 / H, cam.F, 0.5);
    gl.uniform2f(loc.uO, (cam.cx - W / 2) * 2 / W, -(cam.cy - H / 2) * 2 / H);
    for (let i = 0; i < 18; i++) { const c = f.fl[i] || f.basis; fl[3 * i] = c[0]; fl[3 * i + 1] = c[1]; fl[3 * i + 2] = c[2]; }
    gl.uniform3fv(loc.uFl, fl);
    gl.uniform3f(loc.uBasis, f.basis[0], f.basis[1], f.basis[2]);
    gl.uniform3f(loc.uLinie, f.linie[0], f.linie[1], f.linie[2]);
    gl.uniform3f(loc.uFuell, f.fuell[0], f.fuell[1], f.fuell[2]);
    gl.uniform2f(loc.uL, f.rim, f.spec);
    gl.uniform1f(loc.uStil, f.id);
    gl.uniform1f(loc.uPx, 1 / cam.s);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buf.i);
    gl.drawElements(gl.TRIANGLES, anzahl, idxTyp, 0);
  }
  return { art: 'gl', maxDpr: 2, laden, zeichne };
}

export function softFigur(canvas) {
  const ctx = canvas.getContext('2d');
  let mesh = null, out = null;
  return {
    art: 'soft',
    maxDpr: 1,
    laden(m) { mesh = m; },
    zeichne(cam, f) {
      if (!mesh || !ctx) return;
      const W = canvas.width, H = canvas.height;
      if (!out || out.W !== W || out.H !== H) { const img = ctx.createImageData(W, H); out = { W, H, img, D: img.data, ZB: new Float32Array(W * H), IB: null }; }
      const px = 1 / cam.s;
      zeichnePixel(mesh, cam, out, (x, y, z, nx, ny, nz, ao, d) => schattiere(f.id, x, y, z, nx, ny, nz, ao, f, px, d));
      ctx.putImageData(out.img, 0, 0);
    }
  };
}

export function erstelleFigurAnsicht(canvas) {
  let gl = null;
  try { gl = canvas.getContext('webgl', { antialias: true, alpha: true, premultipliedAlpha: false }) || canvas.getContext('experimental-webgl'); } catch (e) { gl = null; }
  if (gl) {
    try { return glFigur(canvas, gl); } catch (e) { console.warn('WebGL nicht nutzbar, nutze Ersatz:', e); }
    return null;
  }
  return softFigur(canvas);
}

export function erstelleAnsicht(canvas) {
  let gl = null;
  try {
    gl = canvas.getContext('webgl', { antialias: true, alpha: true, premultipliedAlpha: false }) || canvas.getContext('experimental-webgl');
  } catch (e) { gl = null; }
  if (gl) {
    try { return glAnsicht(canvas, gl); } catch (e) { console.warn('WebGL nicht nutzbar, nutze Ersatz:', e); }
    // Ein Canvas mit WebGL-Kontext kann keinen 2D-Kontext mehr bekommen: neues Element nötig
    return null;
  }
  return softAnsicht(canvas);
}
