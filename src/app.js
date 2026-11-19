// Muskelkarte · App
// Seiten, Navigation (Hash-Routing, funktioniert auf GitHub Pages), Ablauf-Modus und Einstellungen.

import { MODI, MUSKELN, REGIONEN } from './data/muskeln.js';
import { UEBUNGEN as U, THEMEN, ROUTINEN, LEVEL, liste, modusName } from './data/uebungen.js';
import { KALENDER, adventStatus, zugang, blockIndex } from './advent.js';
import { store, isoTag } from './store.js';
import { FARBEN, KoerperBuehne, PuppenBuehne, koerperBild, koerperCanvas, netz, netzFertig } from './buehne.js';

// ---------- Hilfen ----------
const $ = (s) => document.querySelector(s);
const esc = (t) => String(t ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmtZeit = (s) => { s = Math.max(0, s); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
const fmtSek = (sek) => (sek >= 120 ? (sek / 60).toLocaleString('de-DE') + ' Min' : sek + ' Sek.');
const MONATE = ['Jan.', 'Feb.', 'März', 'Apr.', 'Mai', 'Juni', 'Juli', 'Aug.', 'Sep.', 'Okt.', 'Nov.', 'Dez.'];
const datumKurz = (iso) => { const [, m, d] = iso.split('-').map(Number); return d + '. ' + MONATE[m - 1]; };
const wk = (jahr, k) => jahr + ':' + k;
const istDone = (jahr, tag) => !!store.d.done[wk(jahr, tag)];

const P = {
  koerper: 'M12 2.5a2.2 2.2 0 1 0 0 4.4a2.2 2.2 0 1 0 0-4.4zM6 10.5c2-1 4-1.5 6-1.5s4 .5 6 1.5M12 9v6M12 15l-3 6.5M12 15l3 6.5',
  suche: 'M10.5 4a6.5 6.5 0 1 0 0 13a6.5 6.5 0 0 0 0-13zM15.5 15.5L20 20',
  training: 'M12 3a9 9 0 1 0 0 18a9 9 0 0 0 0-18zM10 8.5v7l6-3.5z',
  ich: 'M12 4a4 4 0 1 0 0 8a4 4 0 0 0 0-8zM4.5 20c1-4 4-5.5 7.5-5.5s6.5 1.5 7.5 5.5',
  stern: 'M12 3l2.6 5.6l6 .7l-4.5 4.1l1.2 6l-5.3-3l-5.3 3l1.2-6L3.4 9.3l6-.7z',
  x: 'M6 6l12 12M18 6L6 18',
  zurueck: 'M15 5l-7 7 7 7',
  weiter: 'M9 5l7 7-7 7',
  hoch: 'M6 15l6-6 6 6',
  runter: 'M6 9l6 6 6-6',
  dreh: 'M4 12a8 8 0 0 1 14-5.3L20 9M20 4v5h-5M20 12a8 8 0 0 1-14 5.3L4 15M4 20v-5h5',
  reset: 'M12 8v4l2.5 2.5M3.5 12a8.5 8.5 0 1 0 2.5-6L3.5 8.5M3.5 3.5v5h5',
  liste: 'M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01',
  herz: 'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z',
  haken: 'M5 12.5l4.5 4.5L19 7.5',
  schloss: 'M7 11V8a5 5 0 0 1 10 0v3M6 11h12v9H6z',
  play: 'M8 5v14l11-7z',
  pause: 'M8 5v14M16 5v14',
  kalender: 'M7 3v3M17 3v3M4 8h16M5 5h14v15H5z',
  teilen: 'M12 3v12M7 8l5-5 5 5M5 14v6h14v-6',
  download: 'M12 4v11M7 10l5 5 5-5M5 20h14',
  upload: 'M12 15V4M7 9l5-5 5 5M5 20h14',
  muell: 'M5 7h14M10 7V4h4v3M7 7l1 13h8l1-13',
  plus: 'M12 5v14M5 12h14'
};
const svg = (d, w = 22) => `<svg width="${w}" height="${w}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${d}"/></svg>`;
const voll = (d, w = 16) => `<svg width="${w}" height="${w}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="${d}"/></svg>`;
const herz = (an) => `<svg width="22" height="22" viewBox="0 0 24 24" fill="${an ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true"><path d="${P.herz}"/></svg>`;

// ---------- Zustand ----------
const S = { modus: null, muskel: null, ptab: 'kraft', q: '', fModus: '', lauf: null, pause: false, tempo: 1, letzterTab: 'koerper', routineWahl: null };
let route = { name: 'koerper', a: null, b: null };
let intern = false;

const mq = window.matchMedia ? matchMedia('(prefers-color-scheme: dark)') : { matches: false };
const themaName = () => { const t = store.d.einst.thema; return t === 'auto' ? (mq.matches ? 'dunkel' : 'hell') : (FARBEN[t] ? t : 'hell'); };
// Der Körper wird im Look „Linien“ gezeichnet (Höhenlinien wie bei einem 3D-Scan)
const stil = () => 'linien';
const th = () => FARBEN[themaName()];
function wendeThemaAn() {
  document.documentElement.dataset.theme = themaName();
  const bg = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim();
  const m = document.querySelector('meta[name="theme-color"]');
  if (m && bg) m.setAttribute('content', bg);
}

const KB = new KoerperBuehne((id) => waehle(id));
const PB = new PuppenBuehne();

function heatmap(modus) {
  if (!modus) return null;
  const n = {}; let mx = 1;
  for (const id of Object.keys(MUSKELN)) { n[id] = liste(id, modus).length; mx = Math.max(mx, n[id]); }
  const o = {};
  for (const id in n) o[id] = n[id] ? 0.14 + 0.5 * n[id] / mx : 0;
  return o;
}
const aktualisiereKoerper = () => KB.setze(th(), heatmap(S.modus), S.muskel, stil());
const ersteModus = (m) => (MODI.find((md) => liste(m, md.id).length) || MODI[0]).id;

// ---------- Navigation ----------
function parse() {
  const h = (location.hash || '').replace(/^#\/?/, '');
  const p = h.split('/').map((x) => { try { return decodeURIComponent(x); } catch (e) { return x; } });
  return { name: p[0] || 'koerper', a: p[1] || null, b: p[2] || null };
}
function geh(hash, ersetzen) {
  intern = true;
  if (ersetzen) { history.replaceState(null, '', hash); onRoute(); }
  else if (location.hash === hash) onRoute();
  else location.hash = hash;
}
function zurueck(fallback) {
  if (intern && history.length > 1) history.back();
  else geh(fallback || '#/koerper', true);
}
function waehle(id) {
  if (!store.d.willkommen) store.set((d) => { d.willkommen = true; });
  geh('#/koerper/' + id, route.name === 'koerper' && !!route.a);
}

window.addEventListener('hashchange', () => { intern = true; onRoute(); });

function onRoute() {
  const alt = route;
  route = parse();
  if (route.name !== 'lauf' && S.lauf) laufStopp();
  if (route.name === 'lauf' && !S.lauf) { geh('#/koerper', true); return; }
  if (route.name === 'koerper') {
    const m = route.a && MUSKELN[route.a] ? route.a : null;
    if (m !== S.muskel) { S.muskel = m; if (m) S.ptab = S.modus || ersteModus(m); }
  }
  if (route.name !== 'uebung') S.routineWahl = null;
  const tab = { koerper: 'koerper', entdecken: 'entdecken', thema: 'entdecken', training: 'training', routine: 'training', ich: 'ich', ueber: 'ich', advent: 'advent', tuer: 'advent' }[route.name];
  if (tab) S.letzterTab = tab;
  render();
  if (!(alt.name === route.name && alt.a === route.a && alt.b === route.b) && !(alt.name === 'koerper' && route.name === 'koerper')) $('#view').scrollTop = 0;
}

// ---------- Statische Körperbilder ----------
const BILDER = new Map();
let bildNr = 0;
function kbImg(spec, alt, cls) {
  const id = String(++bildNr);
  BILDER.set(id, spec);
  return `<img class="kb ${cls || ''}" data-kb="${id}" alt="${esc(alt)}" width="${spec.w}" height="${spec.h}">`;
}
function ladeBilder() {
  const imgs = [...document.querySelectorAll('img[data-kb]:not([src])')];
  if (!imgs.length) return;
  if (!netzFertig()) { setTimeout(() => { netz(); ladeBilder(); }, 60); return; }
  for (const img of imgs) { const s = BILDER.get(img.dataset.kb); if (s) img.src = koerperBild(th(), s.intens, Object.assign({ stil: stil() }, s)); }
}

// ---------- Bausteine ----------
const zeile = (id) => {
  const u = U[id];
  return `<a class="zeile" href="#/uebung/${id}"><span class="zeile-min"><b>${u.min}</b><span>Min</span></span><span class="zeile-txt"><b>${esc(u.n)}</b><span>${modusName(u.m)} · ${esc(u.eq)} · ${LEVEL[u.lv]}</span></span>${svg(P.weiter, 18)}</a>`;
};
const dosText = (u) => {
  const d = u.dos, je = u.seiten ? ' je Seite' : '';
  if (d.typ === 'zeit') return d.sek >= 120 ? (d.s > 1 ? d.s + ' × ' : '') + fmtSek(d.sek) : d.s + ' × ' + d.sek + ' Sek.' + je;
  return d.s + ' × ' + d.n + ' Wdh.' + je;
};
const itemText = (it) => {
  const u = U[it.id], s = it.saetze || 1, vor = s > 1 ? s + ' × ' : '';
  if (it.auf) return 'so lange wie möglich';
  if (it.max) return 'so viele wie möglich';
  if (it.sek) return vor + fmtSek(it.sek);
  if (it.n) return vor + it.n + ' Wdh.';
  return dosText(u);
};
const sekGeschaetzt = (ids) => ids.reduce((a, id) => { const u = U[id]; if (!u) return a; const t = u.dos.typ === 'zeit' ? Math.min(u.dos.sek, 60) : u.dos.n * 4; return a + t * (u.seiten ? 2 : 1) + 15; }, 0);
const minuten = (ids) => Math.max(1, Math.round(sekGeschaetzt(ids) / 60));

const topbar = (eyebrow, rechts) => `<div class="topbar"><button class="ibtn ghost" data-a="zurueck" aria-label="Zurück">${svg(P.zurueck)}</button><p class="eyebrow">${eyebrow}</p>${rechts || '<span class="ibtn-platz"></span>'}</div>`;

const animKarte = (info) => `<div class="anim"><div class="slot anim-slot" data-slot="puppe"></div>
  <div class="anim-leiste"><button class="ibtn" data-a="anim-pause" aria-label="${S.pause ? 'Animation abspielen' : 'Animation anhalten'}">${S.pause ? voll(P.play, 18) : svg(P.pause, 18)}</button>
  <span class="klein muted grow">${esc(info)}</span>
  <div class="seg seg-klein" role="group" aria-label="Tempo">${[[0.5, '0,5×'], [1, '1×'], [1.5, '1,5×']].map(([v, l]) => `<button data-a="tempo" data-v="${v}" aria-pressed="${S.tempo === v}">${l}</button>`).join('')}</div></div></div>`;

const schritte = (u) => `<section class="block"><h2>So geht’s</h2><ol class="schritte">${u.st.map((t) => `<li>${esc(t)}</li>`).join('')}</ol></section>
  <section class="block"><h2>Achte auf</h2><ul class="achtung">${u.f.map((t) => `<li>${esc(t)}</li>`).join('')}</ul></section>`;

const varianten = (le, sw) => `<div class="raster2"><div class="karte"><p class="klein fett muted">Leichter</p><p class="klein">${esc(le)}</p></div><div class="karte"><p class="klein fett muted">Schwerer</p><p class="klein">${esc(sw)}</p></div></div>`;

const muskelChips = (u) => `<section class="block"><h2>Beteiligte Muskeln</h2><div class="chips">${u.h.map((id) => `<a class="chip voll" href="#/koerper/${id}">${esc(MUSKELN[id].n)}</a>`).join('')}${u.nb.map((id) => `<a class="chip" href="#/koerper/${id}">${esc(MUSKELN[id].n)}</a>`).join('')}</div><p class="klein muted">Gefüllt: Hauptmuskel · umrandet: arbeitet mit</p></section>`;

const sicherheit = '<p class="klein muted mitte">Bei Schmerzen abbrechen. Die leichtere Variante ist immer in Ordnung.</p>';
const playKnopf = (attr, text) => `<div class="fuss"><button class="btn-prim breit" ${attr}>${voll(P.play)}<span>${text}</span></button></div>`;

// ---------- Seite: Körper ----------
function banner(st) {
  if (S.muskel) return '';
  if (st.phase === 'aktiv') {
    const t = st.heute, bi = blockIndex(st.kalender, t), done = istDone(st.jahr, t);
    return `<a class="banner" href="#/tuer/${st.jahr}/${t}"><span class="banner-txt"><b>${done ? `Türchen ${t} ist erledigt` : `Türchen ${t} wartet auf dich`}</b><span>Woche ${bi + 1} · ${esc(st.kalender.bloecke[bi].n)}</span></span><span class="banner-zahl" aria-hidden="true">${t}</span></a>`;
  }
  if (st.phase === 'teaser') return '<div class="banner"><span class="banner-txt"><b>Ab 1. Dezember: Adventskalender</b><span>24 Mini-Challenges, jeden Tag ein Türchen</span></span><span class="banner-zahl" aria-hidden="true">24</span></div>';
  if (st.phase === 'rueckblick') return `<a class="banner" href="#/advent"><span class="banner-txt"><b>Adventskalender: Rückblick</b><span>Alle Türchen sind offen</span></span>${svg(P.weiter, 18)}</a>`;
  return '';
}

function panel() {
  const id = S.muskel, m = MUSKELN[id];
  const tabs = MODI.map((md) => `<button data-a="ptab" data-v="${md.id}" aria-pressed="${S.ptab === md.id}">${md.n} ${liste(id, md.id).length}</button>`).join('');
  const ids = liste(id, S.ptab);
  const gegen = m.g ? `<a class="gegen" href="#/koerper/${m.g}"><span><span class="klein muted">Gegenspieler – gehört mittrainiert</span><b>${esc(MUSKELN[m.g].n)}</b></span>${svg(P.weiter, 18)}</a>` : '';
  return `<section class="panel" aria-label="${esc(m.n)}">
    <div class="panel-kopf"><div><h2>${esc(m.n)}</h2><p class="klein muted">${esc(m.f)}</p></div><button class="ibtn ghost" data-a="schliessen" aria-label="Schließen">${svg(P.x)}</button></div>
    <p>${esc(m.w)}</p>
    <div class="seg seg-tabs" role="group" aria-label="Trainingsart">${tabs}</div>
    <div class="liste">${ids.length ? ids.map(zeile).join('') : '<p class="muted klein">Für diese Trainingsart gibt es hier noch keine Übung.</p>'}</div>
    ${gegen}
    <p class="fakt"><b>Wusstest du?</b> ${esc(m.k)}</p>
  </section>`;
}

function panelLeer() {
  return `<section class="panel-leer" aria-label="Muskel wählen"><p class="eyebrow">Tipp einen Muskel an</p><h2>Was willst du heute tun?</h2>
    <p class="muted">Wähl oben eine Trainingsart: Der Körper zeigt dann, wo es Übungen gibt. Oder spring direkt zu einer Region.</p>
    <div class="chips">${Object.keys(MUSKELN).map((id) => `<a class="chip" href="#/koerper/${id}">${esc(MUSKELN[id].n)}</a>`).join('')}</div></section>`;
}

function vKoerper(st) {
  const zeileTxt = S.modus ? `Je kräftiger die Farbe, desto mehr Übungen · ${modusName(S.modus)}` : 'Ziehen dreht den Körper · Tippen wählt einen Muskel';
  const willkommen = !store.d.willkommen && !S.muskel ? `<div class="willkommen" role="note"><p><b>Dreh mich!</b> Zieh mit dem Finger, um den Körper zu drehen, und tipp einen Muskel an.</p>
    <p class="klein muted">Die Übungen ersetzen keine ärztliche oder physiotherapeutische Beratung. Bei Schmerzen abbrechen.</p><button class="btn-prim kompakt" data-a="willkommen">Verstanden</button></div>` : '';
  return `<div class="koerper">
    <header class="kopf"><h1>Muskelkarte</h1><a class="ibtn" href="#/entdecken" aria-label="Suchen">${svg(P.suche, 20)}</a></header>
    <div class="seg seg-modi" role="group" aria-label="Trainingsart">${MODI.map((md) => `<button data-a="modus" data-v="${md.id}" aria-pressed="${S.modus === md.id}">${md.n}</button>`).join('')}</div>
    ${banner(st)}
    <div class="buehne-wrap">
      <p class="hinweis-zeile">${zeileTxt}</p>
      <div class="slot" data-slot="koerper"><p class="laedt" id="laedt">Körper wird aufgebaut …</p></div>
      <div class="buehne-knoepfe"><button class="pill" data-a="umdrehen">${svg(P.dreh, 16)}<span>Umdrehen</span></button><button class="pill" data-a="reset" aria-label="Ansicht zurücksetzen">${svg(P.reset, 16)}</button><a class="pill" href="#/entdecken">${svg(P.liste, 16)}<span>Liste</span></a></div>
      ${willkommen}
    </div>
    ${S.muskel ? panel() : panelLeer()}
  </div>`;
}

// ---------- Seite: Übung ----------
function vUebung() {
  const id = route.a, u = U[id];
  if (!u) { geh('#/entdecken', true); return null; }
  const fav = !!store.d.fav[id];
  const wahl = S.routineWahl === id ? `<div class="karte wahl"><p class="klein muted">Zu welcher Routine?</p>${store.d.routinen.map((r) => `<button class="wahl-knopf" data-a="zu-routine" data-v="${r.id}|${id}">${esc(r.n)}<span class="muted"> · ${r.ids.length}</span></button>`).join('')}<button class="wahl-knopf" data-a="neue-routine" data-v="${id}">${svg(P.plus, 18)}<span>Neue Routine</span></button></div>` : '';
  return `<div class="detail">
    ${topbar(modusName(u.m), `<button class="ibtn ghost${fav ? ' an' : ''}" data-a="fav" data-v="${id}" aria-label="${fav ? 'Aus den Favoriten entfernen' : 'Zu den Favoriten'}" aria-pressed="${fav}">${herz(fav)}</button>`)}
    <div class="seite detail-inhalt">
      <div><h1>${esc(u.n)}</h1><p class="muted meta">${u.min} Min · ${esc(u.eq)} · ${LEVEL[u.lv]}</p></div>
      ${animKarte(dosText(u))}
      ${schritte(u)}
      ${varianten(u.le, u.sw)}
      ${muskelChips(u)}
      ${wahl}
      <button class="btn-sek" data-a="routine-wahl" data-v="${id}" aria-expanded="${S.routineWahl === id}">${svg(P.plus, 18)}<span>Zu Routine hinzufügen</span></button>
      ${sicherheit}
    </div>
    ${playKnopf(`data-a="start-uebung" data-v="${id}"`, 'Jetzt machen')}
  </div>`;
}

// ---------- Seite: Entdecken ----------
const suchtext = (id) => { const u = U[id]; return (u.n + ' ' + modusName(u.m) + ' ' + u.eq + ' ' + u.h.concat(u.nb).map((m) => MUSKELN[m].n + ' ' + MUSKELN[m].f).join(' ')).toLowerCase(); };
function trefferHTML() {
  const q = S.q.trim().toLowerCase();
  if (q) {
    let ids = Object.keys(U).filter((id) => suchtext(id).includes(q));
    const filter = `<div class="chips" role="group" aria-label="Nach Trainingsart filtern">${[['', 'Alle']].concat(MODI.map((m) => [m.id, m.n])).map(([v, l]) => `<button class="chip${S.fModus === v ? ' voll' : ''}" data-a="fmodus" data-v="${v}" aria-pressed="${S.fModus === v}">${l}</button>`).join('')}</div>`;
    if (S.fModus) ids = ids.filter((id) => U[id].m === S.fModus);
    return filter + (ids.length ? `<div class="liste">${ids.map(zeile).join('')}</div>` : '<p class="muted">Nichts gefunden. Probier einen Muskel wie „Wade“ oder eine Trainingsart wie „Dehnen“.</p>');
  }
  return `<section class="block"><h2>Für den Moment</h2><div class="raster2">${THEMEN.map((t, i) => `<a class="kachel" href="#/thema/${i}"><b>${esc(t.n)}</b><span class="klein muted">${t.ids.length} Übungen</span></a>`).join('')}</div></section>
    <section class="block"><h2>Nach Region</h2><div class="chips">${Object.keys(MUSKELN).map((id) => `<a class="chip" href="#/koerper/${id}">${esc(MUSKELN[id].n)}</a>`).join('')}</div></section>
    <section class="block"><h2>Alle Übungen</h2>${MODI.map((m) => { const ids = Object.keys(U).filter((id) => U[id].m === m.id); return `<h3 class="unterkopf">${m.n} <span class="muted">${ids.length}</span></h3><div class="liste">${ids.map(zeile).join('')}</div>`; }).join('')}</section>`;
}
function vEntdecken() {
  return `<div class="seite"><h1>Entdecken</h1>
    <div><label class="label" for="suche">Muskel, Übung oder Gerät suchen</label><input id="suche" class="feld" type="search" data-i="q" value="${esc(S.q)}" placeholder="z. B. Nacken, Wand, Dehnen" autocomplete="off" enterkeyhint="search"></div>
    <div id="treffer" class="treffer">${trefferHTML()}</div></div>`;
}
function vThema() {
  const t = THEMEN[Number(route.a)];
  if (!t) { geh('#/entdecken', true); return null; }
  return `<div class="detail">${topbar('Thema')}
    <div class="seite detail-inhalt"><div><h1>${esc(t.n)}</h1><p class="muted meta">${t.ids.length} Übungen · ca. ${minuten(t.ids)} Min</p></div><div class="liste">${t.ids.map(zeile).join('')}</div></div>
    ${playKnopf(`data-a="start-thema" data-v="${route.a}"`, 'Alle nacheinander')}</div>`;
}

// ---------- Seite: Training ----------
function routineKarte(n, ids, startAttr, editHref) {
  const ok = ids.filter((id) => U[id]);
  return `<div class="karte routine"><div class="routine-kopf"><div><h3>${esc(n)}</h3><p class="klein muted">ca. ${minuten(ok)} Min · ${ok.length} ${ok.length === 1 ? 'Übung' : 'Übungen'}</p></div>${ok.length ? `<button class="rund" ${startAttr} aria-label="${esc(n)} starten">${voll(P.play)}</button>` : ''}</div>
    ${ok.length ? `<p class="klein routine-teile">${ok.map((id) => `<a href="#/uebung/${id}">${esc(U[id].n)}</a>`).join(' · ')}</p>` : '<p class="klein muted">Noch keine Übungen.</p>'}
    ${editHref ? `<a class="link klein" href="${editHref}">Bearbeiten</a>` : ''}</div>`;
}
function vTraining() {
  const eigene = store.d.routinen;
  return `<div class="seite"><h1>Training</h1>
    <section class="block"><h2>Fertige Routinen</h2>${ROUTINEN.map((r, i) => routineKarte(r.n, r.ids, `data-a="start-routine" data-v="${i}"`)).join('')}</section>
    <section class="block"><div class="block-kopf"><h2>Meine Routinen</h2><button class="btn-klein" data-a="neue-routine">${svg(P.plus, 16)}<span>Neu</span></button></div>
    ${eigene.length ? eigene.map((r) => routineKarte(r.n, r.ids, `data-a="start-eigene" data-v="${r.id}"`, `#/routine/${r.id}`)).join('') : '<p class="muted">Stell dir eigene Abläufe zusammen: Öffne eine Übung und tipp auf „Zu Routine hinzufügen“.</p>'}</section></div>`;
}
function vRoutine() {
  const r = store.d.routinen.find((x) => x.id === route.a);
  if (!r) { geh('#/training', true); return null; }
  const ids = r.ids;
  return `<div class="detail">${topbar('Eigene Routine', `<button class="ibtn ghost" data-a="routine-loeschen" data-v="${r.id}" aria-label="Routine löschen">${svg(P.muell)}</button>`)}
    <div class="seite detail-inhalt">
      <div><label class="label" for="rname">Name</label><input id="rname" class="feld" data-i="rname" data-k="${r.id}" value="${esc(r.n)}" maxlength="60"></div>
      ${ids.length ? `<ol class="r-liste">${ids.map((id, i) => `<li><span class="r-nr">${i + 1}</span><span class="r-name"><b>${esc(U[id] ? U[id].n : id)}</b><span class="klein muted">${U[id] ? esc(dosText(U[id])) : 'unbekannt'}</span></span>
        <button class="ibtn ghost" data-a="r-schieb" data-v="${r.id}|${i}|-1" aria-label="Nach oben" ${i === 0 ? 'disabled' : ''}>${svg(P.hoch, 20)}</button>
        <button class="ibtn ghost" data-a="r-schieb" data-v="${r.id}|${i}|1" aria-label="Nach unten" ${i === ids.length - 1 ? 'disabled' : ''}>${svg(P.runter, 20)}</button>
        <button class="ibtn ghost" data-a="r-weg" data-v="${r.id}|${i}" aria-label="Entfernen">${svg(P.x, 20)}</button></li>`).join('')}</ol>` : '<p class="muted">Noch leer. Öffne eine Übung und tipp auf „Zu Routine hinzufügen“.</p>'}
      <a class="btn-sek" href="#/entdecken">${svg(P.suche, 18)}<span>Übungen suchen</span></a>
    </div>
    ${ids.length ? playKnopf(`data-a="start-eigene" data-v="${r.id}"`, 'Starten') : ''}</div>`;
}

// ---------- Seite: Advent ----------
function fortschrittIntens(kal, jahr) {
  const o = {};
  kal.bloecke.forEach((b) => {
    let n = 0;
    for (let t = b.von; t <= b.bis; t++) if (istDone(jahr, t)) n++;
    if (!n) return;
    const ids = b.region === 'alle' ? Object.keys(MUSKELN) : REGIONEN[b.region];
    const i = n === b.bis - b.von + 1 ? 1 : 0.12 + 0.4 * n / (b.bis - b.von + 1);
    ids.forEach((id) => { o[id] = Math.max(o[id] || 0, i); });
  });
  return o;
}
function adventSerie(jahr, heute) {
  let n = 0, t = istDone(jahr, heute) ? heute : heute - 1;
  while (t >= 1 && istDone(jahr, t)) { n++; t--; }
  return n;
}
function tuerKachel(z, t) {
  const zu = z.modus === 'aktiv' && t.tag > z.heute, done = istDone(z.jahr, t.tag), heute = z.modus === 'aktiv' && t.tag === z.heute && !done;
  if (zu) return `<span class="tuer" data-s="zu" role="img" aria-label="Türchen ${t.tag}, noch verschlossen"><b>${t.tag}</b>${svg(P.schloss, 13)}</span>`;
  const s = done ? 'done' : heute ? 'heute' : 'offen';
  const zusatz = done ? svg(P.haken, 14) : heute ? '<small>Heute</small>' : (z.modus === 'aktiv' ? '<small>Nachholen</small>' : '');
  return `<a class="tuer" data-s="${s}" href="#/tuer/${z.jahr}/${t.tag}" aria-label="Türchen ${t.tag}${done ? ', erledigt' : heute ? ', heute' : ''}"><b>${t.tag}</b>${zusatz}</a>`;
}
function vAdvent(st) {
  const jahr = route.a ? Number(route.a) : st.jahr;
  const z = jahr ? zugang(jahr, st) : null;
  if (!z) { geh('#/koerper', true); return null; }
  const kal = z.kal, bi = blockIndex(kal, Math.max(1, z.heute));
  const fertig = kal.tueren.filter((t) => istDone(jahr, t.tag)).length;
  const kopf = z.modus === 'aktiv' ? `Woche ${bi + 1} · ${esc(kal.bloecke[bi].n)}` : z.modus === 'rueckblick' ? 'Rückblick · alle Türchen offen' : 'Archiv';
  const serie = z.modus === 'aktiv' ? adventSerie(jahr, z.heute) : 0;
  const bloecke = kal.bloecke.map((b) => {
    let n = 0; const anz = b.bis - b.von + 1;
    for (let t = b.von; t <= b.bis; t++) if (istDone(jahr, t)) n++;
    return `<div class="block-fort"><div class="balken"><i style="width:${Math.round(n / anz * 100)}%"></i></div><span class="klein muted">${esc(b.kurz)} ${n}/${anz}${n === anz ? ' ✓' : ''}</span></div>`;
  }).join('');
  const teilen = z.modus !== 'aktiv' || istDone(jahr, 24);
  return `<div class="seite">
    <div class="advent-kopf"><div><p class="eyebrow">${kopf}</p><h1>Advent ${jahr}</h1><p class="muted">${fertig} von 24 geschafft${serie ? ` · Serie: ${serie} ${serie === 1 ? 'Tag' : 'Tage'}` : ''}</p></div>
      ${kbImg({ intens: fortschrittIntens(kal, jahr), w: 84, h: 156, yaw: -0.5 }, 'Fortschritt: Jede abgeschlossene Woche färbt ihre Körperregion ein.', 'advent-koerper')}</div>
    <div class="bloecke">${bloecke}</div>
    <div class="tueren">${kal.tueren.map((t) => tuerKachel(z, t)).join('')}</div>
    <div class="aktionen">${z.modus === 'aktiv' ? `<button class="btn-sek" data-a="ics" data-v="${jahr}">${svg(P.kalender, 18)}<span>Tägliche Erinnerung (Kalender)</span></button>` : ''}
      ${teilen ? `<button class="btn-sek" data-a="teilen" data-v="${jahr}">${svg(P.teilen, 18)}<span>Ergebnis als Bild teilen</span></button>` : ''}</div>
    <p class="klein muted">Verpasste Türchen kannst du jederzeit nachholen. Alle Übungen bleiben nach Weihnachten in der Bibliothek.</p>
  </div>`;
}
function testKarte(jahr, t) {
  const k = wk(jahr, t.tag);
  return `<div class="karte"><label class="label-gross" for="wert-${t.tag}">${esc(t.test.n)}: dein Startwert in ${esc(t.test.einheit)}</label>
    <input id="wert-${t.tag}" class="feld feld-gross" type="number" inputmode="numeric" min="0" data-i="wert" data-k="${k}" value="${esc(store.d.werte[k] || '')}" placeholder="0">
    <p class="klein muted">${t.test.einheit === 'Sekunden' ? 'Die Stoppuhr trägt den Wert automatisch ein. Du kannst ihn hier ändern.' : 'An Tag 24 trittst du gegen diesen Wert an.'}</p></div>`;
}
function retestKarte(kal, jahr) {
  return `<div class="karte"><h2>Dein Re-Test</h2>${kal.tests.map((x) => {
    const t = kal.tueren[x.tag - 1], a = store.d.werte[wk(jahr, x.tag)], b = store.d.werte[wk(jahr, x.retest)];
    const df = a && b ? Number(b) - Number(a) : null;
    return `<div class="retest"><label for="re-${x.tag}"><b>${esc(t.test.n)}</b><span class="klein muted">${a ? 'Start: ' + esc(a) + ' ' + t.test.kurz : 'Kein Startwert eingetragen'}</span></label>
      <input id="re-${x.tag}" class="feld feld-mittel" type="number" inputmode="numeric" min="0" data-i="wert" data-k="${wk(jahr, x.retest)}" value="${esc(b || '')}" placeholder="0">
      <span class="diff">${df == null || isNaN(df) ? '' : (df >= 0 ? '+' : '') + df}</span></div>`;
  }).join('')}</div>`;
}
function vTuer(st) {
  const jahr = Number(route.a), tag = Number(route.b), z = zugang(jahr, st);
  if (!z || !(tag >= 1 && tag <= 24)) { geh('#/koerper', true); return null; }
  if (z.modus === 'aktiv' && tag > z.heute) { geh('#/advent', true); return null; }
  const kal = z.kal, t = kal.tueren[tag - 1], u = t.uebung ? U[t.uebung] : null, b = kal.bloecke[blockIndex(kal, tag)];
  const done = istDone(jahr, tag);
  const ablauf = t.ablauf.length > 1 ? `<section class="block"><h2>Ablauf</h2><ol class="ablauf">${t.ablauf.map((it) => `<li><b>${esc(U[it.id].n)}</b><span class="muted"> · ${esc(itemText(it))}</span></li>`).join('')}</ol></section>` : '';
  return `<div class="detail">${topbar(`Türchen ${tag} · ${esc(b.n)}`)}
    <div class="seite detail-inhalt">
      <div><h1>${esc(t.titel)}</h1><p class="lead">${esc(t.text)}</p></div>
      ${u ? animKarte(t.ablauf.length === 1 ? itemText(t.ablauf[0]) : u.n) : ''}
      <section class="karte"><h2>Das Warum</h2><p>${esc(t.warum)}</p><p class="klein muted">Zielmuskel: ${esc(t.ziel)}</p></section>
      ${ablauf}
      ${u && !t.kombi ? schritte(u) : ''}
      ${t.leichter ? varianten(t.leichter, t.schwerer) : ''}
      ${t.test ? testKarte(jahr, t) : ''}
      ${tag === 24 ? retestKarte(kal, jahr) : ''}
      <button class="btn-sek breit${done ? ' an' : ''}" data-a="abhaken" data-v="${jahr}/${tag}" aria-pressed="${done}">${svg(P.haken, 20)}<span>${done ? 'Abgehakt' : 'Türchen abhaken'}</span></button>
      ${done ? `<section class="bonus"><p class="eyebrow">Bonus-Fakt</p><p>${esc(t.bonus)}</p></section>` : ''}
      ${sicherheit}
    </div>
    ${playKnopf(`data-a="start-tuer" data-v="${jahr}/${tag}"`, 'Challenge starten')}</div>`;
}

// ---------- Seite: Ich ----------
function serie() {
  const tage = new Set(store.d.verlauf.map((v) => v.d));
  const d = new Date();
  if (!tage.has(isoTag(d))) d.setDate(d.getDate() - 1);
  let n = 0;
  while (tage.has(isoTag(d))) { n++; d.setDate(d.getDate() - 1); }
  return n;
}
function wocheHTML() {
  const tage = new Set(store.d.verlauf.map((v) => v.d));
  const heute = new Date(), mo = new Date(heute);
  mo.setDate(heute.getDate() - (heute.getDay() + 6) % 7);
  return ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map((n, i) => {
    const d = new Date(mo); d.setDate(mo.getDate() + i);
    const iso = isoTag(d);
    return `<div class="wtag${tage.has(iso) ? ' an' : ''}${iso === isoTag(heute) ? ' heute' : ''}"><span>${n}</span><b>${d.getDate()}</b></div>`;
  }).join('');
}
function monat() {
  const pre = isoTag().slice(0, 7), c = {};
  store.d.verlauf.filter((v) => v.d.startsWith(pre)).forEach((v) => { const u = U[v.id]; if (!u) return; u.h.forEach((m) => { c[m] = (c[m] || 0) + 1; }); u.nb.forEach((m) => { c[m] = (c[m] || 0) + 0.5; }); });
  const mx = Math.max(0, ...Object.values(c));
  const o = {};
  for (const k in c) o[k] = 0.14 + 0.7 * c[k] / mx;
  return { o, c, mx };
}
function vIch(st) {
  const d = store.d, n = serie(), mo = monat();
  const sortiert = Object.keys(mo.c).sort((a, b) => mo.c[b] - mo.c[a]);
  const fehlt = Object.keys(MUSKELN).filter((id) => !mo.c[id]);
  const rueck = mo.mx ? `<p class="klein">Am häufigsten: <b>${esc(MUSKELN[sortiert[0]].n)}</b>${fehlt.length ? `. Zu kurz gekommen: ${fehlt.slice(0, 3).map((id) => esc(MUSKELN[id].n)).join(', ')}${fehlt.length > 3 ? ' …' : ''}` : '. Alle Regionen waren dran!'}</p>` : '<p class="klein muted">In diesem Monat noch keine Übung. Nach dem ersten Training färbt sich der Körper hier ein.</p>';
  const jahre = [...new Set([st.jahr, ...st.archivJahre].filter(Boolean))];
  const startwerte = jahre.map((j) => {
    const kal = KALENDER[j]; if (!kal) return '';
    const zeilen = kal.tests.map((x) => { const t = kal.tueren[x.tag - 1], a = d.werte[wk(j, x.tag)], b = d.werte[wk(j, x.retest)]; return `<div class="wert-zeile"><span>${esc(t.test.n)} <span class="muted">· Tag ${x.tag}</span></span><b>${a ? esc(a) + (b ? ' → ' + esc(b) : '') + ' ' + t.test.kurz : 'noch offen'}</b></div>`; }).join('');
    return `<div class="karte"><h2>Startwerte Advent ${j}</h2>${zeilen}</div>`;
  }).join('');
  const favs = Object.keys(d.fav).filter((id) => d.fav[id] && U[id]);
  const verlauf = d.verlauf.slice(-8).reverse().filter((v) => U[v.id]);
  const thema = d.einst.thema;
  return `<div class="seite"><h1>Ich</h1>
    <div class="karte"><div class="serie"><b>${n}</b><span class="muted">${n === 1 ? 'Tag' : 'Tage'} in Folge aktiv</span></div><div class="woche">${wocheHTML()}</div></div>
    <div class="karte"><h2>Dein ${['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'][new Date().getMonth()]}</h2><div class="rueckblick">${kbImg({ intens: mo.o, w: 92, h: 170, yaw: -0.5 }, 'Körper von vorn, eingefärbt nach Training in diesem Monat')}${kbImg({ intens: mo.o, w: 92, h: 170, yaw: Math.PI - 0.5 }, 'Körper von hinten, eingefärbt nach Training in diesem Monat')}</div>${rueck}</div>
    ${startwerte}
    ${st.archivJahre.length ? `<div class="karte"><h2>Archiv</h2>${st.archivJahre.map((j) => `<a class="gegen" href="#/advent/${j}"><span><b>Adventskalender ${j}</b><span class="klein muted">Alle 24 Türchen</span></span>${svg(P.weiter, 18)}</a>`).join('')}</div>` : ''}
    <div class="karte"><h2>Favoriten</h2>${favs.length ? `<div class="liste">${favs.map(zeile).join('')}</div>` : '<p class="klein muted">Noch keine. Tipp bei einer Übung auf das Herz.</p>'}</div>
    <div class="karte"><h2>Verlauf</h2>${verlauf.length ? verlauf.map((v) => `<div class="wert-zeile"><a href="#/uebung/${v.id}">${esc(U[v.id].n)}</a><span class="muted">${datumKurz(v.d)}</span></div>`).join('') : '<p class="klein muted">Hier erscheint, was du gemacht hast.</p>'}</div>
    <div class="karte"><h2>Einstellungen</h2>
      <p class="label">Erscheinungsbild</p>
      <div class="seg" role="group" aria-label="Erscheinungsbild">${[['auto', 'Automatisch'], ['hell', 'Hell'], ['dunkel', 'Dunkel']].map(([v, l]) => `<button data-a="thema" data-v="${v}" aria-pressed="${thema === v}">${l}</button>`).join('')}</div>
      <button class="schalter" role="switch" aria-checked="${d.einst.ton}" data-a="ton"><span>Ton und Vibration im Ablauf</span><i aria-hidden="true"></i></button>
    </div>
    <div class="karte"><h2>Deine Daten</h2><p class="klein muted">Alles bleibt auf diesem Gerät. Mit einer Datei ziehst du auf ein anderes Gerät um.</p>
      <div class="aktionen"><button class="btn-sek" data-a="export">${svg(P.download, 18)}<span>Exportieren</span></button><button class="btn-sek" data-a="import">${svg(P.upload, 18)}<span>Importieren</span></button></div>
      <input type="file" id="import-datei" accept="application/json,.json" hidden></div>
    <a class="gegen" href="#/ueber"><span><b>Über die App</b><span class="klein muted">Hinweise, Datenschutz, Installieren</span></span>${svg(P.weiter, 18)}</a>
  </div>`;
}
function vUeber() {
  return `<div class="detail">${topbar('Über die App')}<div class="seite detail-inhalt text">
    <h1>Muskelkarte</h1>
    <p>Eine kostenlose Web-App für Kräftigen, Dehnen, Mobilität und Recovery. Tipp einen Muskel am 3D-Körper an und finde passende Übungen. Im Dezember gibt es einen Adventskalender mit 24 Mini-Challenges.</p>
    <section class="karte"><h2>Gesundheit</h2><p>Die Inhalte ersetzen keine ärztliche oder physiotherapeutische Beratung. Bei Schmerzen, Verletzungen oder Vorerkrankungen bitte vorher ärztlich abklären. Bei Schmerzen während einer Übung abbrechen. Die leichtere Variante ist immer in Ordnung.</p></section>
    <section class="karte"><h2>Datenschutz</h2><p>Kein Konto, kein Tracking, keine Cookies, keine Schriften oder Skripte von fremden Servern. Favoriten, Verlauf und Fortschritt liegen nur im Speicher dieses Browsers. Beim Löschen der Browserdaten gehen sie verloren, deshalb gibt es unter „Ich“ den Export.</p></section>
    <section class="karte"><h2>Installieren</h2><p><b>iPhone und iPad:</b> In Safari öffnen, Teilen-Symbol, „Zum Home-Bildschirm“.</p><p><b>Android:</b> In Chrome öffnen, Menü, „App installieren“.</p><p><b>Laptop:</b> In Chrome oder Edge über das Installieren-Symbol in der Adressleiste.</p><p class="klein muted">Nach dem ersten Öffnen funktioniert die App auch offline.</p></section>
    <section class="karte"><h2>Quellen</h2><p>3D-Körper, Gliederpuppe, Texte und Animationen sind eigens für diese App entstanden. Es werden keine fremden Modelle, Bilder oder Schriften verwendet. Die Texte sind Entwürfe und noch nicht fachlich geprüft.</p></section>
  </div></div>`;
}

// ---------- Ablauf (Vollbild) ----------
function startRest(it) {
  if (it.auf) return 0;
  if (it.max) return null;
  if (it.sek) return it.sek;
  if (it.n) return null;
  const d = U[it.id].dos;
  return d.typ === 'zeit' ? d.sek : null;
}
function laufStart(queue, quelle) {
  audioVorbereiten();
  S.lauf = { queue, i: 0, satz: 1, phase: 'uebung', rest: startRest(queue[0]), quelle, gespeichert: [], letzteSek: null };
  S.pause = false;
  PB.clock = 0;
  wakeLock(true);
  geh('#/lauf');
}
function laufStopp() { S.lauf = null; S.pause = false; wakeLock(false); }
const queueListe = (ids) => ids.filter((id) => U[id]).map((id) => { const u = U[id]; return { id, saetze: u.seiten ? 2 : 1, sek: u.dos.typ === 'zeit' ? Math.min(u.dos.sek, 60) : undefined, n: u.dos.typ === 'wdh' ? u.dos.n : undefined, pauseSatz: 5 }; });

function laufWeiter() {
  const L = S.lauf;
  if (!L || L.phase === 'fertig') return;
  if (L.phase === 'pause') { L.phase = 'uebung'; L.rest = startRest(L.queue[L.i]); L.letzteSek = null; PB.clock = 0; S.pause = false; signal(); render(); return; }
  const it = L.queue[L.i];
  // Stoppuhr: Ergebnis speichern (unter 1 Sekunde war es vermutlich ein Versehen)
  if (it.auf && it.key && (L.rest || 0) >= 1) { const w = String(Math.round(L.rest)); store.set((d) => { d.werte[it.key] = w; }); L.gespeichert.push({ id: it.id, wert: w }); }
  let itemFertig = false;
  if (L.satz < (it.saetze || 1)) L.satz++;
  else {
    itemFertig = true;
    store.set((d) => { d.verlauf.push({ d: isoTag(), ts: Date.now(), id: it.id }); if (d.verlauf.length > 1000) d.verlauf.splice(0, d.verlauf.length - 1000); });
    if (L.i < L.queue.length - 1) { L.i++; L.satz = 1; } else L.phase = 'fertig';
  }
  if (L.phase === 'fertig') laufFertig();
  else {
    const p = itemFertig ? (it.pause ?? 15) : (it.pauseSatz ?? 20);
    if (p > 0) { L.phase = 'pause'; L.rest = p; } else L.rest = startRest(L.queue[L.i]);
  }
  L.letzteSek = null;
  PB.clock = 0;
  S.pause = false;
  signal();
  render();
}
function laufFertig() {
  const L = S.lauf;
  if (L.quelle.typ === 'tuer') store.set((d) => { d.done[wk(L.quelle.jahr, L.quelle.tag)] = true; });
  wakeLock(false);
}
function grossText(L) {
  const it = L.queue[L.i];
  if (L.phase === 'pause') return fmtZeit(Math.ceil(L.rest));
  if (it.max) return 'Max';
  if (L.rest != null) return fmtZeit(it.auf ? Math.floor(L.rest) : Math.ceil(L.rest));
  return String(it.n || U[it.id].dos.n || '');
}
function laufTick(dt) {
  const L = S.lauf;
  if (!L || L.phase === 'fertig' || S.pause || L.rest == null || route.name !== 'lauf') return;
  const it = L.queue[L.i], hoch = L.phase === 'uebung' && it.auf;
  L.rest += hoch ? dt : -dt;
  if (!hoch && L.rest <= 0) { L.rest = 0; laufWeiter(); return; }
  const el = document.getElementById('lf-gross');
  if (el) { const txt = grossText(L); if (el.textContent !== txt) el.textContent = txt; }
  if (!hoch) { const s = Math.ceil(L.rest); if (s !== L.letzteSek) { L.letzteSek = s; if (s <= 3 && s > 0) piep(660, 0.06); } }
}
function vLauf() {
  const L = S.lauf;
  if (L.phase === 'fertig') {
    const tuer = L.quelle.typ === 'tuer' ? KALENDER[L.quelle.jahr].tueren[L.quelle.tag - 1] : null;
    const maxItems = L.queue.filter((it) => it.max && it.key);
    const anzahl = new Set(L.queue.map((it) => it.id)).size;
    return `<div class="lauf lauf-ende">
      <span class="erfolg">${svg(P.haken, 48)}</span>
      <h1>Geschafft</h1>
      <p class="muted">${anzahl > 1 ? L.queue.length + ' Abschnitte, ' + anzahl + ' Übungen' : esc(U[L.queue[0].id].n)}</p>
      ${L.gespeichert.map((g) => `<p class="klein">${esc(U[g.id].n)}: <b>${esc(g.wert)} Sek.</b> gespeichert</p>`).join('')}
      ${maxItems.map((it) => `<div class="karte breit"><label class="label-gross" for="max-${esc(it.key)}">${esc(U[it.id].n)}: Wie viele hast du geschafft?</label><input id="max-${esc(it.key)}" class="feld feld-gross" type="number" inputmode="numeric" min="0" data-i="wert" data-k="${esc(it.key)}" value="${esc(store.d.werte[it.key] || '')}" placeholder="0"></div>`).join('')}
      ${tuer ? `<p class="fett">Türchen ${L.quelle.tag} ist abgehakt.</p><section class="bonus breit"><p class="eyebrow">Bonus-Fakt</p><p>${esc(tuer.bonus)}</p></section>` : ''}
      <button class="btn-prim breit" data-a="lauf-ende">Fertig</button>
    </div>`;
  }
  const it = L.queue[L.i], u = U[it.id], pause = L.phase === 'pause';
  const kopf = L.queue.length > 1 ? `Abschnitt ${L.i + 1} von ${L.queue.length}` : modusName(u.m);
  const saetze = it.saetze || 1;
  const satzTxt = it.auf ? 'Stoppuhr' : it.max ? 'So viele wie möglich' : saetze > 1 ? (u.seiten ? `Durchgang ${L.satz} von ${saetze} · Seite wechseln` : `Satz ${L.satz} von ${saetze}`) : itemText(it);
  const hinweis = pause ? 'Durchatmen. Gleich geht es weiter.' : it.hinweis || (it.auf ? 'Halte so lange du kannst. Tipp auf „Stopp“, wenn Schluss ist.' : it.max ? 'Zähl mit. Dein Ergebnis trägst du danach ein.' : L.rest != null ? 'Halten und ruhig weiteratmen' : 'Wiederholungen. Tipp auf „Weiter“, wenn du fertig bist.');
  return `<div class="lauf">
    <div class="lauf-kopf"><button class="ibtn ghost" data-a="lauf-ende" aria-label="Beenden">${svg(P.x)}</button><p class="eyebrow">${pause ? 'Pause' : kopf}</p><span class="ibtn-platz"></span></div>
    <h1>${pause ? 'Gleich: ' : ''}${esc(u.n)}</h1>
    <p class="muted">${esc(satzTxt)}</p>
    <div class="slot lauf-slot" data-slot="puppe"></div>
    <p class="lauf-gross" id="lf-gross" aria-live="off">${grossText(L)}</p>
    <p class="muted mitte klein">${esc(hinweis)}</p>
    <div class="lauf-knoepfe"><button class="btn-sek" data-a="lauf-pause">${S.pause ? 'Fortsetzen' : 'Pause'}</button><button class="btn-prim" data-a="lauf-weiter">${pause ? 'Pause überspringen' : it.auf ? 'Stopp' : 'Weiter'}</button></div>
  </div>`;
}

// Ton, Vibration, Bildschirm anlassen
let AC = null;
function audioVorbereiten() {
  if (!store.d.einst.ton) return;
  try { AC = AC || new (window.AudioContext || window.webkitAudioContext)(); if (AC.state === 'suspended') AC.resume(); } catch (e) { AC = null; }
}
function piep(f, dauer) {
  if (!store.d.einst.ton || !AC) return;
  try {
    const o = AC.createOscillator(), g = AC.createGain(), t = AC.currentTime;
    o.frequency.value = f;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.25, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dauer);
    o.connect(g).connect(AC.destination);
    o.start(t); o.stop(t + dauer + 0.02);
  } catch (e) { /* ohne Ton */ }
}
function signal() { piep(880, 0.15); if (store.d.einst.ton && navigator.vibrate) navigator.vibrate(150); }
let WL = null;
async function wakeLock(an) {
  try {
    if (an) { if (!WL && navigator.wakeLock) { WL = await navigator.wakeLock.request('screen'); WL.addEventListener('release', () => { WL = null; }); } }
    else if (WL) { await WL.release(); WL = null; }
  } catch (e) { WL = null; }
}
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && S.lauf && S.lauf.phase !== 'fertig') wakeLock(true); });

// ---------- Teilen, Kalender, Dateien ----------
function speichereDatei(blob, name) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
}
function ics(jahr) {
  const kal = KALENDER[jahr], url = location.origin + location.pathname, z = (n) => String(n).padStart(2, '0');
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '');
  const e = (s) => s.replace(/[\\,;]/g, (c) => '\\' + c);
  let s = 'BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Muskelkarte//Advent//DE\r\nCALSCALE:GREGORIAN\r\n';
  for (let d = 1; d <= 24; d++) {
    s += `BEGIN:VEVENT\r\nUID:muskelkarte-${jahr}-${d}\r\nDTSTAMP:${stamp}\r\nDTSTART:${jahr}12${z(d)}T180000\r\nDTEND:${jahr}12${z(d)}T181500\r\nSUMMARY:${e('Muskelkarte: Türchen ' + d)}\r\nDESCRIPTION:${e(kal.tueren[d - 1].titel)}\\n${e(url)}\r\nURL:${url}\r\nBEGIN:VALARM\r\nACTION:DISPLAY\r\nDESCRIPTION:${e('Türchen ' + d + ' wartet')}\r\nTRIGGER:PT0M\r\nEND:VALARM\r\nEND:VEVENT\r\n`;
  }
  s += 'END:VCALENDAR\r\n';
  speichereDatei(new Blob([s], { type: 'text/calendar' }), `muskelkarte-advent-${jahr}.ics`);
  toast('Kalenderdatei gespeichert. Öffne sie, um die Termine zu übernehmen.');
}
async function teilen(jahr) {
  const kal = KALENDER[jahr], W = 1080, H = 1350;
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
  const g = cv.getContext('2d'), css = getComputedStyle(document.documentElement), farbe = (n) => css.getPropertyValue(n).trim();
  const font = (w, px) => `${w} ${px}px ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`;
  const fertig = kal.tueren.filter((t) => istDone(jahr, t.tag)).length;
  g.fillStyle = farbe('--bg'); g.fillRect(0, 0, W, H);
  g.drawImage(koerperCanvas(th(), fortschrittIntens(kal, jahr), { w: 300, h: 560, yaw: -0.5, stil: stil() }), 40, 330, 450, 840);
  g.fillStyle = farbe('--acc-ink'); g.font = font(700, 34); g.fillText('ADVENT ' + jahr, 80, 150);
  g.fillStyle = farbe('--ink'); g.font = font(800, 104); g.fillText(fertig + ' von 24', 80, 260);
  g.fillStyle = farbe('--muted'); g.font = font(500, 40); g.fillText('Challenges geschafft', 80, 320);
  let y = 520;
  kal.tests.forEach((x) => {
    const t = kal.tueren[x.tag - 1], a = store.d.werte[wk(jahr, x.tag)], b = store.d.werte[wk(jahr, x.retest)];
    g.fillStyle = farbe('--muted'); g.font = font(600, 34); g.fillText(t.test.n, 540, y);
    g.fillStyle = farbe('--ink'); g.font = font(800, 60);
    const df = a && b ? Number(b) - Number(a) : null;
    g.fillText(df != null && !isNaN(df) ? (df >= 0 ? '+' : '') + df + ' ' + t.test.kurz : (a ? a + ' ' + t.test.kurz : '–'), 540, y + 70);
    y += 190;
  });
  g.fillStyle = farbe('--ink'); g.font = font(800, 40); g.fillText('Muskelkarte', 80, H - 80);
  const blob = await new Promise((r) => cv.toBlob(r, 'image/png'));
  if (!blob) return;
  const name = `muskelkarte-advent-${jahr}.png`;
  const file = new File([blob], name, { type: 'image/png' });
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try { await navigator.share({ files: [file], title: 'Muskelkarte', text: `Ich habe ${fertig} von 24 Advents-Challenges geschafft!` }); return; } catch (e) { if (e && e.name === 'AbortError') return; }
  }
  speichereDatei(blob, name);
  toast('Bild gespeichert.');
}
let toastZeit = 0;
function toast(text) {
  const el = $('#toast');
  el.textContent = text;
  el.classList.add('zeigen');
  clearTimeout(toastZeit);
  toastZeit = setTimeout(() => el.classList.remove('zeigen'), 2800);
}

// ---------- Aktionen ----------
const neueRoutine = () => { const r = { id: 'r' + Date.now().toString(36), n: 'Meine Routine ' + (store.d.routinen.length + 1), ids: [] }; store.set((d) => { d.routinen.push(r); }); return r; };
const A = {
  zurueck: () => zurueck(),
  modus: (v) => { S.modus = S.modus === v ? null : v; if (S.modus) S.ptab = S.modus; render(); },
  ptab: (v) => { S.ptab = v; render(); },
  schliessen: () => geh('#/koerper', true),
  umdrehen: () => KB.umdrehen(),
  reset: () => KB.zuruecksetzen(),
  willkommen: () => { store.set((d) => { d.willkommen = true; }); render(); },
  fav: (v) => { store.set((d) => { d.fav[v] = !d.fav[v]; if (!d.fav[v]) delete d.fav[v]; }); render(); },
  'anim-pause': () => { S.pause = !S.pause; render(); },
  tempo: (v) => { S.tempo = Number(v); render(); },
  fmodus: (v) => { S.fModus = v; $('#treffer').innerHTML = trefferHTML(); },
  'routine-wahl': (v) => { S.routineWahl = S.routineWahl === v ? null : v; render(); },
  'zu-routine': (v) => { const [rid, id] = v.split('|'); let name = ''; store.set((d) => { const r = d.routinen.find((x) => x.id === rid); if (r) { r.ids.push(id); name = r.n; } }); S.routineWahl = null; render(); toast(`Zu „${name}“ hinzugefügt`); },
  'neue-routine': (v) => { const r = neueRoutine(); if (v && U[v]) { store.set((d) => { d.routinen.find((x) => x.id === r.id).ids.push(v); }); S.routineWahl = null; toast(`„${r.n}“ angelegt`); render(); } else geh('#/routine/' + r.id); },
  'r-schieb': (v) => { const [rid, i, dir] = v.split('|'); store.set((d) => { const r = d.routinen.find((x) => x.id === rid); const a = Number(i), b = a + Number(dir); if (r && b >= 0 && b < r.ids.length) [r.ids[a], r.ids[b]] = [r.ids[b], r.ids[a]]; }); render(); },
  'r-weg': (v) => { const [rid, i] = v.split('|'); store.set((d) => { const r = d.routinen.find((x) => x.id === rid); if (r) r.ids.splice(Number(i), 1); }); render(); },
  'routine-loeschen': (v) => { const r = store.d.routinen.find((x) => x.id === v); if (r && confirm(`„${r.n}“ löschen?`)) { store.set((d) => { d.routinen = d.routinen.filter((x) => x.id !== v); }); geh('#/training', true); } },
  'start-uebung': (v) => { const u = U[v]; laufStart([{ id: v, saetze: u.dos.s }], { typ: 'uebung' }); },
  'start-routine': (v) => laufStart(queueListe(ROUTINEN[Number(v)].ids), { typ: 'routine' }),
  'start-thema': (v) => laufStart(queueListe(THEMEN[Number(v)].ids), { typ: 'thema' }),
  'start-eigene': (v) => { const r = store.d.routinen.find((x) => x.id === v); const q = r ? queueListe(r.ids) : []; if (q.length) laufStart(q, { typ: 'eigene' }); },
  'start-tuer': (v) => { const [j, t] = v.split('/').map(Number); const tuer = KALENDER[j].tueren[t - 1]; laufStart(tuer.ablauf.map((it) => Object.assign({}, it, { key: it.key ? wk(j, it.key) : undefined })), { typ: 'tuer', jahr: j, tag: t }); },
  abhaken: (v) => { const [j, t] = v.split('/'); store.set((d) => { const k = wk(j, t); d.done[k] = !d.done[k]; if (!d.done[k]) delete d.done[k]; }); render(); },
  'lauf-weiter': () => laufWeiter(),
  'lauf-pause': () => { S.pause = !S.pause; render(); },
  'lauf-ende': () => { laufStopp(); zurueck(); },
  thema: (v) => { store.set((d) => { d.einst.thema = v; }); wendeThemaAn(); render(); },
  ton: () => { store.set((d) => { d.einst.ton = !d.einst.ton; }); render(); },
  export: () => { speichereDatei(new Blob([store.exportText()], { type: 'application/json' }), `muskelkarte-daten-${isoTag()}.json`); toast('Datei gespeichert.'); },
  import: () => { const el = $('#import-datei'); if (el) el.click(); },
  ics: (v) => ics(Number(v)),
  teilen: (v) => { teilen(Number(v)); }
};

document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-a]');
  if (!el || el.disabled) return;
  const f = A[el.dataset.a];
  if (!f) return;
  e.preventDefault();
  f(el.dataset.v, el);
});
document.addEventListener('input', (e) => {
  const el = e.target;
  if (el.dataset.i === 'q') { S.q = el.value; $('#treffer').innerHTML = trefferHTML(); }
  else if (el.dataset.i === 'wert') { const v = el.value.trim(); store.set((d) => { if (v) d.werte[el.dataset.k] = v; else delete d.werte[el.dataset.k]; }); }
  else if (el.dataset.i === 'rname') { store.set((d) => { const r = d.routinen.find((x) => x.id === el.dataset.k); if (r) r.n = el.value.slice(0, 60) || 'Meine Routine'; }); }
});
document.addEventListener('change', async (e) => {
  const el = e.target;
  if (el.dataset.i === 'wert' && route.name === 'tuer') render();
  if (el.id === 'import-datei' && el.files && el.files[0]) {
    try { store.importText(await el.files[0].text()); wendeThemaAn(); render(); toast('Daten importiert.'); }
    catch (er) { toast(er && er.message ? er.message : 'Import fehlgeschlagen.'); }
  }
});
mq.addEventListener && mq.addEventListener('change', () => { wendeThemaAn(); render(); });

// ---------- Rendern ----------
function renderNav(st) {
  const nav = $('#nav');
  if (route.name === 'lauf') { nav.hidden = true; return; }
  nav.hidden = false;
  const items = [['koerper', 'Körper', P.koerper], ['entdecken', 'Entdecken', P.suche], ['training', 'Training', P.training], ['ich', 'Ich', P.ich]];
  if (st.phase === 'aktiv' || st.phase === 'rueckblick') items.push(['advent', 'Advent', P.stern]);
  nav.innerHTML = items.map(([id, l, d]) => `<a href="#/${id}"${S.letzterTab === id ? ' aria-current="page"' : ''}>${svg(d)}<span>${l}</span></a>`).join('');
}
function puppeAn() {
  if (route.name === 'uebung') return U[route.a] ? U[route.a].an : null;
  if (route.name === 'tuer') { const kal = KALENDER[Number(route.a)], t = kal && kal.tueren[Number(route.b) - 1]; return t && t.uebung ? U[t.uebung].an : null; }
  if (route.name === 'lauf' && S.lauf && S.lauf.phase !== 'fertig') return U[S.lauf.queue[S.lauf.i].id].an;
  return null;
}
function mount() {
  const sk = document.querySelector('[data-slot="koerper"]');
  KB.aktiv = !!sk;
  if (sk) {
    sk.appendChild(KB.canvas);
    KB.dirty = true;
    if (KB.bereit) { $('#laedt')?.remove(); aktualisiereKoerper(); }
    else setTimeout(() => { KB.init(); aktualisiereKoerper(); $('#laedt')?.remove(); if (!KB.canvas.isConnected) document.querySelector('[data-slot="koerper"]')?.appendChild(KB.canvas); ladeBilder(); }, 30);
  }
  const sp = document.querySelector('[data-slot="puppe"]');
  PB.aktiv = !!sp;
  if (sp) { sp.appendChild(PB.canvas); PB.setze(puppeAn(), th()); }
  ladeBilder();
}
function render() {
  const st = adventStatus();
  BILDER.clear();
  let html, fest = false;
  switch (route.name) {
    case 'entdecken': html = vEntdecken(); break;
    case 'thema': html = vThema(); break;
    case 'training': html = vTraining(); break;
    case 'routine': html = vRoutine(); break;
    case 'ich': html = vIch(st); break;
    case 'ueber': html = vUeber(); break;
    case 'advent': html = vAdvent(st); break;
    case 'tuer': html = vTuer(st); break;
    case 'uebung': html = vUebung(); break;
    case 'lauf': html = vLauf(); fest = true; break;
    default: html = vKoerper(st); fest = true;
  }
  if (html == null) return;
  const v = $('#view');
  v.className = fest ? 'fest' : '';
  v.innerHTML = html;
  renderNav(st);
  mount();
}

// ---------- Start ----------
let tLast = performance.now();
function loop(t) {
  // Der Timer läuft nach echter Zeit (auch wenn der Browser die Bildrate drosselt),
  // die Animationen machen höchstens 0,1 s pro Bild, damit nach Pausen nichts springt.
  const echt = Math.min(30, Math.max(0, (t - tLast) / 1000));
  const dt = Math.min(0.1, echt);
  tLast = t;
  try { KB.frame(dt); PB.frame(dt, !S.pause, S.tempo); laufTick(echt); } catch (e) { console.error(e); }
  requestAnimationFrame(loop);
}
wendeThemaAn();
onRoute();
requestAnimationFrame(loop);

if ('serviceWorker' in navigator && location.protocol === 'https:') {
  window.addEventListener('load', () => { navigator.serviceWorker.register('./sw.js').catch(() => { /* ohne Offline-Modus */ }); });
}
