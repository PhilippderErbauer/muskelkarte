// Muskelkarte · Speicher
// Alle persönlichen Daten bleiben im Browser dieses Geräts (localStorage).
// Umzug auf ein anderes Gerät über Export und Import einer Datei.

const KEY = 'muskelkarte.v1';

const neu = () => ({
  v: 1,
  done: {},        // "2026:7": true
  werte: {},       // "2026:1": "45", "2026:r1": "80"
  fav: {},         // Übungs-ID: true
  verlauf: [],     // { d: "2026-12-07", ts, id }
  routinen: [],    // { id, n, ids: [] }
  einst: { thema: 'auto', ton: true },
  willkommen: false
});

const obj = (x) => (x && typeof x === 'object' && !Array.isArray(x) ? x : {});

function pruefe(o) {
  const n = neu();
  if (!o || typeof o !== 'object') return n;
  for (const k of ['done', 'werte', 'fav']) n[k] = obj(o[k]);
  if (Array.isArray(o.verlauf)) n.verlauf = o.verlauf.filter((v) => v && typeof v.d === 'string' && typeof v.id === 'string').slice(-1000);
  if (Array.isArray(o.routinen)) n.routinen = o.routinen.filter((r) => r && typeof r.id === 'string' && Array.isArray(r.ids)).map((r) => ({ id: r.id, n: String(r.n || 'Meine Routine').slice(0, 60), ids: r.ids.filter((x) => typeof x === 'string') }));
  const e = obj(o.einst);
  if (['auto', 'hell', 'dunkel'].includes(e.thema)) n.einst.thema = e.thema;
  if (typeof e.ton === 'boolean') n.einst.ton = e.ton;
  n.willkommen = !!o.willkommen;
  return n;
}

function laden() {
  try { const t = localStorage.getItem(KEY); if (t) return pruefe(JSON.parse(t)); } catch (e) { /* privater Modus o. Ä. */ }
  return neu();
}

let daten = laden();

function speichern() {
  try { localStorage.setItem(KEY, JSON.stringify(daten)); return true; } catch (e) { return false; }
}

export const store = {
  get d() { return daten; },
  set(fn) { fn(daten); speichern(); },
  exportText() { return JSON.stringify(Object.assign({ app: 'muskelkarte', exportiert: new Date().toISOString() }, daten), null, 2); },
  importText(text) {
    const o = JSON.parse(text);
    if (!o || o.app !== 'muskelkarte') throw new Error('Das ist keine Muskelkarte-Datei.');
    daten = pruefe(o);
    speichern();
  }
};

const zwei = (n) => String(n).padStart(2, '0');
export const isoTag = (d = new Date()) => `${d.getFullYear()}-${zwei(d.getMonth() + 1)}-${zwei(d.getDate())}`;
