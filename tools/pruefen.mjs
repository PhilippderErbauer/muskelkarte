// Prüft Inhalte und 3D-Teile ohne Browser: node tools/pruefen.mjs
import { MODI, MUSKELN, REGIONEN } from '../src/data/muskeln.js';
import { UEBUNGEN, THEMEN, ROUTINEN } from '../src/data/uebungen.js';
import { KALENDER, adventStatus, zugang } from '../src/advent.js';
import { bauFigur, MID, REGELN, regionGLSL } from '../src/three/figur.js';
import { pose, puppe } from '../src/three/puppe.js';

const fehler = [];
const pruef = (ok, text) => { if (!ok) fehler.push(text); };
const modi = MODI.map((m) => m.id);

// Muskeln passen zum 3D-Modell
for (const id of Object.keys(MUSKELN)) pruef(MID.includes(id), `Muskel ${id} fehlt im 3D-Modell`);
for (const id of MID.slice(1)) pruef(MUSKELN[id], `3D-Teil ${id} hat keine Beschreibung`);
for (const [id, m] of Object.entries(MUSKELN)) if (m.g) pruef(MUSKELN[m.g], `Gegenspieler von ${id} unbekannt`);
for (const ids of Object.values(REGIONEN)) for (const id of ids) pruef(MUSKELN[id], `Region nennt unbekannten Muskel ${id}`);

// Übungen vollständig, Animationen lauffähig
const farben = { skin: [200, 200, 200], acc: [255, 0, 0], boden: [220, 220, 220], prop: [180, 180, 180] };
for (const [id, u] of Object.entries(UEBUNGEN)) {
  pruef(modi.includes(u.m), `${id}: Trainingsart ${u.m} unbekannt`);
  for (const m of u.h.concat(u.nb)) pruef(MUSKELN[m], `${id}: Muskel ${m} unbekannt`);
  pruef(u.st.length >= 3 && u.f.length >= 1 && u.le && u.sw, `${id}: Anleitung unvollständig`);
  pruef(u.lv >= 1 && u.lv <= 3 && u.min > 0, `${id}: Level oder Dauer fehlt`);
  for (const k of u.an.k) pruef([18, 24, 28, 32].includes(k[1].length), `${id}: Pose mit ${k[1].length} Werten`);
  for (let t = 0; t < u.an.d; t += 0.37) {
    const m = puppe(pose(u.an, t), u.an, farben).mesh;
    if (m.P.some((v) => !Number.isFinite(v))) { fehler.push(`${id}: ungültige Puppe bei t=${t}`); break; }
  }
}
for (const t of THEMEN) for (const id of t.ids) pruef(UEBUNGEN[id], `Thema ${t.n}: ${id} unbekannt`);
for (const r of ROUTINEN) for (const id of r.ids) pruef(UEBUNGEN[id], `Routine ${r.n}: ${id} unbekannt`);

// Adventskalender
for (const [jahr, kal] of Object.entries(KALENDER)) {
  pruef(kal.tueren.length === 24, `${jahr}: nicht 24 Türchen`);
  kal.tueren.forEach((t, i) => {
    pruef(t.tag === i + 1, `${jahr}: Türchen ${i + 1} falsch nummeriert`);
    pruef(t.titel && t.text && t.warum && t.bonus, `${jahr}/${t.tag}: Text fehlt`);
    pruef(!t.uebung || UEBUNGEN[t.uebung], `${jahr}/${t.tag}: Übung ${t.uebung} unbekannt`);
    pruef(t.ablauf && t.ablauf.length, `${jahr}/${t.tag}: kein Ablauf`);
    for (const it of t.ablauf || []) pruef(UEBUNGEN[it.id], `${jahr}/${t.tag}: Ablauf nennt ${it.id}`);
  });
  for (const x of kal.tests) pruef(kal.tueren[x.tag - 1].test, `${jahr}: Test-Tag ${x.tag} ohne Test`);
}

// Datumslogik
const st = (s) => { const [y, m, d] = s.split('-').map(Number); return adventStatus(new Date(y, m - 1, d, 12)); };
const erwartung = [['2026-11-17', 'aus'], ['2026-11-25', 'teaser'], ['2026-12-01', 'aktiv'], ['2026-12-24', 'aktiv'], ['2026-12-25', 'rueckblick'], ['2027-01-06', 'rueckblick'], ['2027-01-07', 'aus']];
for (const [d, p] of erwartung) pruef(st(d).phase === p, `${d}: Phase ${st(d).phase} statt ${p}`);
pruef(st('2026-12-07').heute === 7, 'Am 7.12. ist nicht Türchen 7 dran');
pruef(zugang(2026, st('2027-03-01'))?.modus === 'archiv', 'Archiv 2026 im März 2027 nicht erreichbar');
pruef(zugang(2026, st('2026-11-20')) === null, 'Kalender vor dem 1.12. erreichbar');

// 3D-Figur und Muskelflächen
{
  const t0 = Date.now();
  const mesh = bauFigur();
  pruef(mesh.n > 10000 && mesh.n < 65536, `Figur hat ${mesh.n} Punkte`);
  pruef(!Array.from(mesh.P).some((v) => !Number.isFinite(v)), 'Figur enthält ungültige Werte');
  const gefunden = new Set(mesh.M);
  for (let m = 1; m < MID.length; m++) pruef(gefunden.has(m), `Muskelfläche ${MID[m]} ist auf der Figur nicht zu sehen`);
  for (const id of MID.slice(1)) pruef(REGELN[id], `Keine Regel für ${id}`);
  pruef(regionGLSL().includes('vec2 region'), 'GLSL-Code der Muskelflächen fehlt');
  console.log(`Figur: ${mesh.n} Punkte, ${mesh.T.length / 3} Dreiecke, ${Date.now() - t0} ms`);
}
console.log(`Inhalte: ${Object.keys(MUSKELN).length} Muskelgruppen, ${Object.keys(UEBUNGEN).length} Übungen, ${THEMEN.length} Themen, ${ROUTINEN.length} Routinen, ${Object.keys(KALENDER).length} Adventskalender`);
if (fehler.length) { console.error('\nFEHLER:\n- ' + fehler.join('\n- ')); process.exit(1); }
console.log('Alles in Ordnung.');
