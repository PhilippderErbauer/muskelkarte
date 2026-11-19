// Muskelkarte · Bühnen
// KoerperBuehne: der drehbare 3D-Körper mit Antippen, Zoomen und Kamerafahrt zum Muskel.
// PuppenBuehne: die animierte Gliederpuppe einer Übung.
// koerperBild: ein statisches Bild des Körpers (für Fortschritt, Rückblick, Teilen).

import { bauFigur, MID } from './three/figur.js';
import { ladeKoerper } from './three/koerper.js';
import { FIGUR_STILE, schattiere } from './three/figurstil.js';
import { pose, puppe } from './three/puppe.js';
import { erstelleAnsicht, softAnsicht, zeichneSoft, erstelleFigurAnsicht, softFigur, zeichnePixel } from './three/render.js';

export { MID, FIGUR_STILE };

const c = (r, g, b) => [r / 255, g / 255, b / 255];
// Design C (Kobalt) in Hell und Dunkel.
// skin/acc/boden/prop: Gliederpuppe der Übungen (0..255). looks: Farben der Körper-Looks (0..1):
// basis = Haut, neutral = Muskelfläche ohne Hervorhebung, linie = Umriss/Linien, fuell = Füllung beim Look „Linien“.
export const FARBEN = {
  hell: { name: 'hell', skin: [196, 205, 221], acc: [33, 72, 255], rim: -0.1, spec: 0.18, boden: [218, 224, 234], prop: [200, 208, 222], akzent: c(33, 72, 255),
    looks: {
      skulptur: { basis: c(238, 241, 247), neutral: c(196, 208, 232), linie: c(80, 96, 130), fuell: c(240, 243, 248), rim: -0.08, spec: 0.14 },
      linien: { basis: c(236, 240, 246), neutral: c(84, 104, 152), linie: c(166, 177, 200), fuell: c(243, 246, 250), rim: 0, spec: 0 },
      flach: { basis: c(238, 242, 248), neutral: c(194, 206, 230), linie: c(52, 64, 96), fuell: c(240, 243, 248), rim: 0, spec: 0 }
    } },
  dunkel: { name: 'dunkel', skin: [70, 82, 108], acc: [61, 92, 255], rim: 0.24, spec: 0.14, boden: [26, 33, 52], prop: [52, 62, 86], akzent: c(77, 108, 255),
    looks: {
      skulptur: { basis: c(70, 80, 104), neutral: c(98, 114, 150), linie: c(150, 166, 205), fuell: c(24, 31, 50), rim: 0.22, spec: 0.12 },
      linien: { basis: c(30, 38, 58), neutral: c(150, 172, 225), linie: c(64, 78, 110), fuell: c(18, 24, 40), rim: 0, spec: 0 },
      flach: { basis: c(48, 58, 84), neutral: c(80, 96, 132), linie: c(160, 176, 214), fuell: c(24, 31, 50), rim: 0, spec: 0 }
    } }
};

// Der Körper kommt aus dem Anatomie-Modell (src/data/koerper.bin). Klappt das Laden nicht,
// entsteht wie bisher der selbst erzeugte Körper aus figur.js.
let FIGUR = null;
try {
  const r = await fetch(new URL('./data/koerper.bin', import.meta.url));
  if (!r.ok) throw new Error('HTTP ' + r.status);
  if (typeof DecompressionStream === 'undefined') throw new Error('Browser kann nicht entpacken');
  const roh = await new Response(r.body.pipeThrough(new DecompressionStream('gzip'))).arrayBuffer();
  FIGUR = ladeKoerper(new Uint8Array(roh));
} catch (e) { console.warn('Körpermodell nicht geladen, nutze den erzeugten Körper:', e); }
export const netz = () => FIGUR || (FIGUR = bauFigur());
export const netzFertig = () => !!FIGUR;

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const reduziert = () => window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];

// Farben für einen Look. intens: { muskelId: 0..1 } Anteil der Akzentfarbe; auswahl: voll in Akzentfarbe
export function figurFarben(th, look, intens, auswahl) {
  const L = th.looks[look] || th.looks.skulptur;
  const fl = [L.basis];
  for (let m = 1; m < MID.length; m++) {
    const id = MID[m];
    let col = L.neutral;
    const i = intens ? intens[id] : 0;
    if (i > 0) col = mix(L.neutral, th.akzent, Math.min(1, i + 0.12));
    if (auswahl === id) col = th.akzent;
    fl.push(col);
  }
  return Object.assign({ id: (FIGUR_STILE[look] || FIGUR_STILE.skulptur).id, fl }, L);
}
const istFlach = (look) => look === 'flach';

function ansichtFuer(canvas, figur) {
  const a = figur ? erstelleFigurAnsicht(canvas) : erstelleAnsicht(canvas);
  if (a) return { canvas, ansicht: a };
  const neu = document.createElement('canvas');
  neu.className = canvas.className;
  for (const n of ['role', 'aria-label', 'tabindex']) if (canvas.hasAttribute(n)) neu.setAttribute(n, canvas.getAttribute(n));
  canvas.replaceWith(neu);
  return { canvas: neu, ansicht: figur ? softFigur(neu) : softAnsicht(neu) };
}

export class KoerperBuehne {
  constructor(onPick) {
    this.onPick = onPick;
    this.onInteraktion = null;
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'buehne';
    this.canvas.tabIndex = 0;
    this.canvas.setAttribute('role', 'img');
    this.canvas.setAttribute('aria-label', '3D-Körper. Ziehen dreht ihn, zwei Finger oder das Mausrad zoomen, Tippen wählt einen Muskel. Mit den Pfeiltasten drehen, mit Plus und Minus zoomen.');
    this.bereit = false;
    this.aktiv = false;
    this.dirty = true;
    this.cam = { yaw: -0.5, pitch: 0.07, zoom: 1, ty: 0.9, tyaw: -0.5, tzoom: 1, tty: 0.9, uz: 1, folge: false, idle: true, pan: false, t: 0 };
    this.th = FARBEN.hell;
    this.intens = null;
    this.auswahl = null;
    this.stil = 'linien';
    this.key = '';
    this.zeiger = new Map();
    this.events(this.canvas);
  }

  init() {
    if (this.bereit) return;
    this.mesh = netz();
    this.col = new Uint8Array(this.mesh.n * 3); // nur fürs Antippen
    this.farben = figurFarben(this.th, this.stil, this.intens, this.auswahl);
    const r = ansichtFuer(this.canvas, true);
    if (r.canvas !== this.canvas) { this.canvas = r.canvas; this.events(this.canvas); }
    this.ansicht = r.ansicht;
    this.ansicht.laden(this.mesh);
    this.bereit = true;
    this.dirty = true;
    if (this.auswahl) { this.zielAuf(this.auswahl); this.cam.yaw = this.cam.tyaw; this.cam.folge = false; }
  }

  setze(th, intens, auswahl, stil) {
    const key = th.name + '|' + JSON.stringify(intens || {}) + '|' + (auswahl || '') + '|' + stil;
    this.th = th;
    this.intens = intens;
    if (stil && FIGUR_STILE[stil]) this.stil = stil;
    if (auswahl !== this.auswahl) { this.auswahl = auswahl; this.zielAuf(auswahl); }
    if (key !== this.key) {
      this.key = key;
      this.farben = figurFarben(th, this.stil, intens, auswahl);
      this.dirty = true;
    }
  }

  zielAuf(id) {
    const c = this.cam;
    c.pan = false;
    if (!id || !this.mesh) return;
    const mi = MID.indexOf(id);
    let ty = this.mesh.fyaw[mi];
    while (ty - c.yaw > Math.PI) ty -= 2 * Math.PI;
    while (ty - c.yaw < -Math.PI) ty += 2 * Math.PI;
    c.tyaw = ty; c.folge = true; c.idle = false;
  }

  umdrehen() {
    const c = this.cam;
    c.idle = false;
    c.tyaw = Math.round((c.yaw + Math.PI) / Math.PI) * Math.PI;
    c.folge = true;
  }

  zuruecksetzen() {
    const c = this.cam;
    c.idle = false;
    let ty = -0.5;
    while (ty - c.yaw > Math.PI) ty -= 2 * Math.PI;
    while (ty - c.yaw < -Math.PI) ty += 2 * Math.PI;
    c.tyaw = ty; c.folge = true; c.uz = 1; c.pan = false;
  }

  kamera(W, H) {
    const c = this.cam;
    const flach = istFlach(this.stil);
    return { yaw: c.yaw, pitch: flach ? 0 : c.pitch, tx: 0, ty: c.ty, tz: 0, cx: W / 2, cy: H / 2, s: Math.min(H / 1.9, W / 0.9) * c.zoom, F: flach ? 60 : 7 };
  }

  frame(dt) {
    if (!this.bereit || !this.aktiv) return;
    const cv = this.canvas, dpr = Math.min(this.ansicht.maxDpr, window.devicePixelRatio || 1);
    let W = Math.round(cv.clientWidth * dpr), H = Math.round(cv.clientHeight * dpr);
    if (!W || !H) return;
    if (this.ansicht.art === 'soft') { const f = Math.sqrt(500000 / (W * H)); if (f < 1) { W = Math.round(W * f); H = Math.round(H * f); } }
    if (cv.width !== W || cv.height !== H) { cv.width = W; cv.height = H; this.dirty = true; }
    const c = this.cam, e = Math.min(1, dt * 5);
    const mi = this.auswahl ? MID.indexOf(this.auswahl) : 0;
    const vorher = c.yaw + c.zoom * 7 + c.ty * 13;
    if (c.idle && !reduziert()) { c.t += dt; c.yaw = (istFlach(this.stil) ? 0 : -0.5) + Math.sin(c.t * 0.55) * 0.45; }
    else if (c.folge) { c.yaw += (c.tyaw - c.yaw) * e; if (Math.abs(c.tyaw - c.yaw) < 1e-3) { c.yaw = c.tyaw; c.folge = false; } }
    c.tzoom = (mi ? 1.75 : 1) * c.uz;
    c.zoom += (c.tzoom - c.zoom) * e;
    if (!c.pan) c.tty = mi ? clamp(this.mesh.fy[mi], 0.36, 1.46) : 0.9;
    const k = 1.25 * (1 - 1 / Math.max(1, c.tzoom));
    c.tty = clamp(c.tty, 0.9 - k, 0.9 + k);
    c.ty += (c.tty - c.ty) * e;
    if (Math.abs(vorher - (c.yaw + c.zoom * 7 + c.ty * 13)) > 1e-5) this.dirty = true;
    if (!this.dirty) return;
    this.dirty = false;
    this.ansicht.zeichne(this.kamera(W, H), this.farben);
  }

  pick(x, y) {
    if (!this.bereit) return null;
    const r = this.canvas.getBoundingClientRect();
    const W = Math.max(1, Math.round(r.width)), H = Math.max(1, Math.round(r.height));
    if (!this.pk || this.pk.W !== W || this.pk.H !== H) this.pk = { W, H, D: new Uint8ClampedArray(W * H * 4), ZB: new Float32Array(W * H), IB: new Uint8Array(W * H) };
    zeichneSoft(this.mesh, this.col, this.kamera(W, H), this.pk, { rim: 0, spec: 0 });
    const px = Math.floor(x - r.left), py = Math.floor(y - r.top);
    let best = 0, bd = 1e9;
    for (let dy = -10; dy <= 10; dy += 2) for (let dx = -10; dx <= 10; dx += 2) {
      const qx = px + dx, qy = py + dy;
      if (qx < 0 || qy < 0 || qx >= W || qy >= H) continue;
      const id = this.pk.IB[qy * W + qx];
      if (!id) continue;
      const d = dx * dx + dy * dy;
      if (d < bd) { bd = d; best = id; }
    }
    return best ? MID[best] : null;
  }

  abstandZeiger() {
    const p = [...this.zeiger.values()];
    return p.length < 2 ? 0 : Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y);
  }

  interaktion() {
    this.cam.idle = false;
    this.cam.folge = false;
    if (this.onInteraktion) this.onInteraktion();
  }

  events(cv) {
    cv.addEventListener('pointerdown', (e) => {
      try { cv.setPointerCapture(e.pointerId); } catch (er) { /* ohne Capture geht es auch */ }
      this.zeiger.set(e.pointerId, { x: e.clientX, y: e.clientY });
      this.interaktion();
      if (this.zeiger.size === 1) this.geste = { weg: 0, t: performance.now(), multi: false };
      else { if (this.geste) this.geste.multi = true; this.pinch = this.abstandZeiger(); }
    });
    cv.addEventListener('pointermove', (e) => {
      const z = this.zeiger.get(e.pointerId);
      if (!z) return;
      const dx = e.clientX - z.x, dy = e.clientY - z.y;
      z.x = e.clientX; z.y = e.clientY;
      if (this.zeiger.size >= 2) {
        const d = this.abstandZeiger();
        if (this.pinch && d) this.cam.uz = clamp(this.cam.uz * d / this.pinch, 0.8, 2.6);
        this.pinch = d;
        this.dirty = true;
        return;
      }
      if (this.geste) this.geste.weg += Math.abs(dx) + Math.abs(dy);
      this.cam.yaw += dx * 0.012;
      const s = Math.min(cv.clientHeight / 1.9, cv.clientWidth / 0.94) * this.cam.zoom;
      if (s > 0 && this.cam.tzoom > 1.02) { this.cam.tty += dy / s; this.cam.pan = true; }
      this.dirty = true;
    });
    const ende = (e) => {
      const war = this.zeiger.has(e.pointerId);
      this.zeiger.delete(e.pointerId);
      if (this.zeiger.size < 2) this.pinch = null;
      if (!war || this.zeiger.size) return;
      const g = this.geste;
      this.geste = null;
      if (e.type === 'pointerup' && g && !g.multi && g.weg < 8 && performance.now() - g.t < 600) {
        const id = this.pick(e.clientX, e.clientY);
        if (id && this.onPick) this.onPick(id);
      }
    };
    cv.addEventListener('pointerup', ende);
    cv.addEventListener('pointercancel', ende);
    cv.addEventListener('wheel', (e) => {
      e.preventDefault();
      this.interaktion();
      this.cam.uz = clamp(this.cam.uz * Math.exp(-e.deltaY * 0.0015), 0.8, 2.6);
      this.dirty = true;
    }, { passive: false });
    cv.addEventListener('keydown', (e) => {
      const c = this.cam;
      if (e.key === 'ArrowLeft') c.yaw -= 0.2;
      else if (e.key === 'ArrowRight') c.yaw += 0.2;
      else if (e.key === '+' || e.key === '=') c.uz = clamp(c.uz * 1.15, 0.8, 2.6);
      else if (e.key === '-') c.uz = clamp(c.uz / 1.15, 0.8, 2.6);
      else return;
      e.preventDefault();
      this.interaktion();
      this.dirty = true;
    });
  }
}

export class PuppenBuehne {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'puppe';
    this.canvas.setAttribute('role', 'img');
    this.canvas.setAttribute('aria-label', '3D-Animation der Übung. Ziehen dreht die Ansicht.');
    this.an = null;
    this.clock = 0;
    this.yaw = -0.42;
    this.aktiv = false;
    this.th = FARBEN.hell;
    this.warte = 0;
    this.events(this.canvas);
  }

  setze(an, th) {
    if (an !== this.an) { this.an = an; this.yaw = an && an.y != null ? an.y : -0.42; this.clock = 0; this.rahmen = an ? PuppenBuehne.rahmen(an) : null; }
    this.th = th;
  }

  // Bildausschnitt aus allen Posen der Bewegung: Mitte und Ausdehnung (Boden immer im Bild)
  static rahmen(an) {
    let x0 = 1e9, x1 = -1e9, y0 = 0, y1 = -1e9;
    for (const [, p] of an.k) {
      for (let j = 0; j < 14 && 2 * j + 1 < p.length; j++) {
        const x = p[2 * j], y = 150 - p[2 * j + 1];
        x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y);
      }
    }
    return { tx: (x0 + x1) / 2, ty: (y0 + y1) / 2 + 2, w: Math.max(130, (x1 - x0 + 40) * 1.12), h: Math.max(100, y1 - y0 + 46) };
  }

  events(cv) {
    cv.addEventListener('pointerdown', (e) => { this.drag = e.clientX; try { cv.setPointerCapture(e.pointerId); } catch (er) { /* egal */ } });
    cv.addEventListener('pointermove', (e) => { if (this.drag == null) return; this.yaw += (e.clientX - this.drag) * 0.012; this.drag = e.clientX; });
    const ende = () => { this.drag = null; };
    cv.addEventListener('pointerup', ende);
    cv.addEventListener('pointercancel', ende);
  }

  frame(dt, laeuft, tempo) {
    if (!this.aktiv || !this.an) return;
    if (!this.ansicht) {
      const r = ansichtFuer(this.canvas);
      if (r.canvas !== this.canvas) { this.canvas = r.canvas; this.events(this.canvas); }
      this.ansicht = r.ansicht;
    }
    if (laeuft) this.clock += dt * tempo;
    if (this.ansicht.art === 'soft') { this.warte += dt; if (this.warte < 0.04) return; this.warte = 0; }
    const cv = this.canvas, dpr = Math.min(this.ansicht.maxDpr, window.devicePixelRatio || 1);
    const W = Math.round(cv.clientWidth * dpr), H = Math.round(cv.clientHeight * dpr);
    if (!W || !H) return;
    if (cv.width !== W || cv.height !== H) { cv.width = W; cv.height = H; }
    const m = puppe(pose(this.an, this.clock), this.an, this.th);
    this.ansicht.laden(m.mesh, m.col, true);
    const r = this.rahmen;
    this.ansicht.zeichne({ yaw: this.yaw, pitch: 0.2, tx: r.tx, ty: r.ty, tz: 0, cx: W / 2, cy: H / 2, s: Math.min(W / r.w, H / r.h), F: 900 }, this.th, 1 / 260);
  }
}

const bildCache = new Map();
// Statisches Körperbild als Daten-URL. o: { w, h, yaw, stil }
export function koerperBild(th, intens, o) {
  const key = th.name + '|' + o.stil + '|' + JSON.stringify(intens || {}) + '|' + o.w + 'x' + o.h + '|' + (o.yaw ?? -0.5);
  if (bildCache.has(key)) return bildCache.get(key);
  const url = koerperCanvas(th, intens, o).toDataURL('image/png');
  if (bildCache.size > 40) bildCache.clear();
  bildCache.set(key, url);
  return url;
}

// Dasselbe als Canvas in doppelter Auflösung (zum Weiterzeichnen, z. B. für die Teilen-Karte)
export function koerperCanvas(th, intens, o) {
  const me = netz();
  const W = o.w * 2, H = o.h * 2;
  const out = { W, H, D: new Uint8ClampedArray(W * H * 4), ZB: new Float32Array(W * H), IB: null };
  const f = figurFarben(th, o.stil, intens, null), flach = istFlach(o.stil);
  const s = Math.min(H / 1.9, W / 0.9), px = 1 / s;
  const yaw = o.yaw ?? -0.5;
  zeichnePixel(me, { yaw: flach ? Math.round(yaw / Math.PI) * Math.PI : yaw, pitch: flach ? 0 : 0.07, tx: 0, ty: 0.9, tz: 0, cx: W / 2, cy: H / 2, s, F: flach ? 60 : 7 }, out,
    (x, y, z, nx, ny, nz, ao, d) => schattiere(f.id, x, y, z, nx, ny, nz, ao, f, px, d));
  const cv = document.createElement('canvas');
  cv.width = W; cv.height = H;
  cv.getContext('2d').putImageData(new ImageData(out.D, W, H), 0, 0);
  return cv;
}
