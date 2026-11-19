// Muskelkarte · Gliederpuppe
//
// Eine Animation besteht aus wenigen Schlüsselposen. Jede Pose sind Gelenkpunkte (x, y) in der
// Seitenansicht, y wächst nach unten, der Boden liegt bei y = 150:
//   0 Kopf, 1 Schulter, 2 Rumpfmitte, 3 Hüfte, 4 Knie, 5 Fuß, 6 Zehe, 7 Ellbogen, 8 Hand
//   optional: 9–11 zweites Bein (Knie, Fuß, Zehe), 12–13 zweiter Arm (Ellbogen, Hand),
//   14–15 seitlicher Abstand der Ellbogen und Hände vom Körper (sonst 19)
// 3D (optional, ab Wert 32): Querlage z der Punkte Kopf, Schulter, Rumpfmitte, Hüfte (positiv = Seite
//   des ersten Arms, sonst 0), Abstand nach außen von Knie, Fuß, Zehe des ersten und des zweiten Beins
//   (sonst 8, in Seitenlage 0), Drehung der Schultern und der Hüfte um die Längsachse in Grad (sonst 0).
//   Am einfachsten mit den Helfern in src/data/uebungen.js (seitlich, drehen, neigen …).
// Zwischen den Posen wird weich überblendet. Aus den Punkten entsteht in jedem Bild eine
// 3D-Figur aus Kapseln, die sich frei drehen lässt.
//
// Felder einer Animation: d Dauer in Sekunden, k Posen [[Zeit 0..1, Punkte]], a aktive Kette
// (leuchtet in der Akzentfarbe), lin lineare Überblendung, fl Seitenlage, as asymmetrisch
// (nur die erste Seite leuchtet), y Startwinkel der Kamera, p Requisiten.
//
// Requisiten (y wie bei den Posen, Boden bei 150):
//   ['box', x0, y0, z0, x1, y1, z1]   Quader (Wand, Stuhl, Stufe)
//   ['ball', x, y, z, r]              Kugel (Tennisball, Kissen)
//   ['rolle', x, y, z0, z1, r]        Rolle quer zum Körper (Faszienrolle)
//   ['rollex', x0, x1, y, r]          Rolle längs zum Körper
//   ['band', x, y, z, j]              Band vom Punkt zur Hand j (8 erste, 13 zweite Hand)
//   ['hantel', j]                     Kurzhantel oder Flasche in Hand j
//   ['seil', j1, j2]                  Handtuch oder Band zwischen zwei Punkten (5 Fuß, 8 Hand, 10 zweiter Fuß, 13 zweite Hand)
//   ['stab', abstand]                 Stab längs am Rücken (vom Kopf bis über die Hüfte)

const { abs, sqrt, max, min, cos, sin } = Math;

export function pose(an, clock) {
  const t = ((clock % an.d) + an.d) % an.d / an.d, k = an.k;
  let i = 0;
  while (i < k.length - 2 && t >= k[i + 1][0]) i++;
  const a = k[i], b = k[i + 1];
  let u = (t - a[0]) / ((b[0] - a[0]) || 1);
  u = max(0, min(1, u));
  if (!an.lin) u = u * u * (3 - 2 * u);
  const df = an.fl ? 0 : 19, lz = an.fl ? 0 : 8;
  const g = (p, j) => {
    if (p.length > j) return p[j];
    if (j >= 42) return 0; // Drehung
    if (j >= 36) return lz; // Beine nach außen
    if (j >= 32) return 0; // Querlage Rumpf und Kopf
    return j >= 28 ? df : p[j - 10];
  };
  const J = new Float32Array(44);
  for (let j = 0; j < 44; j++) { const x = g(a[1], j); J[j] = x + (g(b[1], j) - x) * u; }
  return J;
}

// th: Farben { skin, acc, boden, prop } als RGB 0..255
export function puppe(J, an, th) {
  const P = [], N = [], Cc = [], T = [];
  const SEG = 12, RG = [-90, -60, -30, 0, 0, 30, 60, 90];
  const kap = (a, b, ra, rb, wu, wv, c, rot) => {
    let dx = b[0] - a[0], dy = b[1] - a[1], dz = b[2] - a[2];
    const L = sqrt(dx * dx + dy * dy + dz * dz);
    if (L < 1e-6) { dx = 0; dy = 1; dz = 0; } else { dx /= L; dy /= L; dz /= L; }
    let ux, uy, uz;
    if (abs(dz) > 0.95) { ux = 1 - dx * dx; uy = -dy * dx; uz = -dz * dx; } else { ux = -dx * dz; uy = -dy * dz; uz = 1 - dz * dz; }
    const ul = sqrt(ux * ux + uy * uy + uz * uz) || 1;
    ux /= ul; uy /= ul; uz /= ul;
    let vx = dy * uz - dz * uy, vy = dz * ux - dx * uz, vz = dx * uy - dy * ux;
    if (rot) { // Querschnitt um die Längsachse drehen (Rumpf verdreht)
      const cr = cos(rot), sr = sin(rot);
      const nux = ux * cr + vx * sr, nuy = uy * cr + vy * sr, nuz = uz * cr + vz * sr;
      vx = -ux * sr + vx * cr; vy = -uy * sr + vy * cr; vz = -uz * sr + vz * cr;
      ux = nux; uy = nuy; uz = nuz;
    }
    const base = P.length / 3;
    for (let r = 0; r < 8; r++) {
      const ph = RG[r] * Math.PI / 180, e = r < 4 ? a : b, rad = r < 4 ? ra : rb, cr = cos(ph), sr = sin(ph);
      for (let s = 0; s < SEG; s++) {
        const th2 = s / SEG * Math.PI * 2, ct = cos(th2), st = sin(th2);
        P.push(e[0] + dx * rad * sr + (ux * ct * wu + vx * st * wv) * rad * cr, e[1] + dy * rad * sr + (uy * ct * wu + vy * st * wv) * rad * cr, e[2] + dz * rad * sr + (uz * ct * wu + vz * st * wv) * rad * cr);
        const nx = (ux * ct / wu + vx * st / wv) * cr + dx * sr, ny = (uy * ct / wu + vy * st / wv) * cr + dy * sr, nz = (uz * ct / wu + vz * st / wv) * cr + dz * sr;
        const nl = sqrt(nx * nx + ny * ny + nz * nz) || 1;
        N.push(nx / nl, ny / nl, nz / nl);
        Cc.push(c[0], c[1], c[2]);
      }
    }
    for (let r = 0; r < 7; r++) for (let s = 0; s < SEG; s++) {
      const i0 = base + r * SEG + s, i1 = base + r * SEG + (s + 1) % SEG, i2 = i0 + SEG, i3 = i1 + SEG;
      T.push(i0, i1, i2, i1, i3, i2);
    }
  };
  const fl4 = (p0, p1, p2, p3, nx, ny, nz, c) => {
    const base = P.length / 3;
    P.push(p0[0], p0[1], p0[2], p1[0], p1[1], p1[2], p2[0], p2[1], p2[2], p3[0], p3[1], p3[2]);
    for (let i = 0; i < 4; i++) { N.push(nx, ny, nz); Cc.push(c[0], c[1], c[2]); }
    T.push(base, base + 1, base + 2, base, base + 2, base + 3);
  };
  const box = (x0, y0, z0, x1, y1, z1, c) => {
    fl4([x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1], 0, 0, 1, c);
    fl4([x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0], 0, 0, -1, c);
    fl4([x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0], -1, 0, 0, c);
    fl4([x1, y0, z0], [x1, y0, z1], [x1, y1, z1], [x1, y1, z0], 1, 0, 0, c);
    fl4([x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1], 0, 1, 0, c);
    fl4([x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1], 0, -1, 0, c);
  };
  // Boden als flache Scheibe
  {
    const base = P.length / 3, R = 82, c = th.boden;
    P.push(120, -0.3, 0); N.push(0, 1, 0); Cc.push(c[0], c[1], c[2]);
    for (let s = 0; s < 32; s++) { const a = s / 32 * Math.PI * 2; P.push(120 + cos(a) * R, -0.3, sin(a) * R * 0.62); N.push(0, 1, 0); Cc.push(c[0], c[1], c[2]); }
    for (let s = 0; s < 32; s++) T.push(base, base + 1 + s, base + 1 + (s + 1) % 32);
  }
  // Requisiten: ['box', x0, y0, z0, x1, y1, z1] oder ['ball', x, y, z, r] (Seitenansicht-Koordinaten)
  (an.p || []).forEach((q) => {
    if (q[0] === 'box') box(q[1], 150 - q[5], q[3], q[4], 150 - q[2], q[6], th.prop);
    else if (q[0] === 'ball') kap([q[1], 150 - q[2], q[3]], [q[1], 150 - q[2], q[3]], q[4], q[4], 1, 1, th.prop);
    else if (q[0] === 'rolle') kap([q[1], 150 - q[2], q[3]], [q[1], 150 - q[2], q[4]], q[5], q[5], 1, 1, th.prop);
    else if (q[0] === 'rollex') kap([q[1], 150 - q[3], 0], [q[2], 150 - q[3], 0], q[4], q[4], 1, 1, th.prop);
  });
  const X = (j) => J[2 * j], Y = (j) => 150 - J[2 * j + 1];
  const fl = !!an.fl;
  const S = [X(1), Y(1), J[33]], Mi = [X(2), Y(2), J[34]], Hp = [X(3), Y(3), J[35]], Ko = [X(0), Y(0), J[32]];
  const dS = J[42] * Math.PI / 180, dH = J[43] * Math.PI / 180;
  let s1, s2, h1, h2;
  if (fl) {
    let dx = S[0] - Hp[0], dy = S[1] - Hp[1];
    const l = sqrt(dx * dx + dy * dy) || 1;
    dx /= l; dy /= l;
    const vx = dy, vy = -dx;
    s1 = [S[0] + vx * 14, S[1] + vy * 14, 0]; s2 = [S[0] - vx * 14, S[1] - vy * 14, 0];
    h1 = [Hp[0] + vx * 7, Hp[1] + vy * 7, 0]; h2 = [Hp[0] - vx * 7, Hp[1] - vy * 7, 0];
  } else {
    // Schulter- und Hüftlinie, um die senkrechte Achse gedreht
    s1 = [S[0] - 18 * sin(dS), S[1] - 1, S[2] + 18 * cos(dS)]; s2 = [S[0] + 18 * sin(dS), S[1] - 1, S[2] - 18 * cos(dS)];
    h1 = [Hp[0] - 8 * sin(dH), Hp[1], Hp[2] + 8 * cos(dH)]; h2 = [Hp[0] + 8 * sin(dH), Hp[1], Hp[2] - 8 * cos(dH)];
  }
  const e1 = [X(7), Y(7), J[28]], ha1 = [X(8), Y(8), J[29]], e2 = [X(12), Y(12), -J[30]], ha2 = [X(13), Y(13), -J[31]];
  const k1 = [X(4), Y(4), J[36]], f1 = [X(5), Y(5), J[37]], t1 = [X(6), Y(6), J[38]], k2 = [X(9), Y(9), -J[39]], f2 = [X(10), Y(10), -J[40]], t2 = [X(11), Y(11), -J[41]];
  const on = {};
  for (let i = 0; i + 1 < an.a.length; i++) { const p = an.a[i], q = an.a[i + 1]; on[min(p, q) + '-' + max(p, q)] = 1; }
  const sym = !an.as;
  const c = (key, alt) => ((on[key] || (sym && alt && on[alt])) ? th.acc : th.skin);
  kap(f2, t2, 3.2, 2.4, 1, 1, c('10-11', '5-6'));
  kap(k2, f2, 4.4, 3.2, 1, 1, c('9-10', '4-5'));
  kap(h2, k2, 6.2, 4.6, 1, 1, c('3-9', '3-4'));
  kap(s2, e2, 4.2, 3.6, 1, 1, c('1-12', '1-7'));
  kap(e2, ha2, 3.6, 2.8, 1, 1, c('12-13', '7-8'));
  kap(ha2, ha2, 3.4, 3.4, 1, 1, th.skin);
  kap(Mi, Hp, 8.6, 8.8, fl ? 0.7 : 1.3, fl ? 1.3 : 1, c('2-3'), fl ? 0 : -(dS + dH) / 2);
  kap(S, Mi, 9.5, 8.6, fl ? 0.7 : 1.55, fl ? 1.5 : 1, c('1-2'), fl ? 0 : -dS);
  kap(S, [S[0] + (Ko[0] - S[0]) * 0.6, S[1] + (Ko[1] - S[1]) * 0.6, 0], 4.8, 4.4, 1, 1, c('0-1'));
  kap(Ko, Ko, 8.6, 8.6, 0.95, 1, th.skin);
  kap(f1, t1, 3.2, 2.4, 1, 1, c('5-6'));
  kap(k1, f1, 4.4, 3.2, 1, 1, c('4-5'));
  kap(h1, k1, 6.2, 4.6, 1, 1, c('3-4'));
  kap(s1, e1, 4.2, 3.6, 1, 1, c('1-7'));
  kap(e1, ha1, 3.6, 2.8, 1, 1, c('7-8'));
  kap(ha1, ha1, 3.4, 3.4, 1, 1, th.skin);
  // Requisiten, die an einer Hand hängen
  const hand = (j) => (j === 13 ? ha2 : ha1);
  const punkt = (j) => ({ 5: f1, 8: ha1, 10: f2, 13: ha2, 4: k1, 9: k2 })[j] || ha1;
  (an.p || []).forEach((q) => {
    if (q[0] === 'seil') kap(punkt(q[1]), punkt(q[2]), 1.1, 1.1, 1, 1, th.prop);
    else if (q[0] === 'stab') {
      let dx = Hp[0] - Ko[0], dy = Hp[1] - Ko[1];
      const l = sqrt(dx * dx + dy * dy) || 1;
      dx /= l; dy /= l;
      const ox = dy * q[1], oy = -dx * q[1];
      kap([Ko[0] - dx * 6 + ox, Ko[1] - dy * 6 + oy, 0], [Hp[0] + dx * 12 + ox, Hp[1] + dy * 12 + oy, 0], 1.3, 1.3, 1, 1, th.prop);
    } else if (q[0] === 'band') kap([q[1], 150 - q[2], q[3]], hand(q[4]), 0.9, 0.9, 1, 1, th.prop);
    else if (q[0] === 'hantel') { const h = hand(q[1]); kap([h[0], h[1], h[2] - 6], [h[0], h[1], h[2] + 6], 2.6, 2.6, 1, 1, th.prop); }
  });
  const n = P.length / 3;
  return { mesh: { P: new Float32Array(P), N: new Float32Array(N), A: null, M: null, T: new Uint16Array(T), n }, col: new Uint8Array(Cc) };
}
