// Muskelkarte · Datumslogik des Adventskalenders
//
// bis 24. November      unsichtbar
// 25.–30. November      Hinweis auf der Startseite
// 1.–24. Dezember       Tab „Advent“, heutiges Türchen offen, spätere verschlossen
// 25. Dez. – 6. Januar  Rückblick, alle Türchen offen
// ab 7. Januar          im Archiv unter „Ich“
//
// Zum Testen: ?advent-datum=2026-12-07 an die Adresse hängen.

import { KALENDER_2026 } from './data/advent-2026.js';

export const KALENDER = { 2026: KALENDER_2026 };

export function testDatum() {
  try {
    const p = new URLSearchParams(location.search).get('advent-datum');
    if (p && /^\d{4}-\d{2}-\d{2}$/.test(p)) { const [y, m, d] = p.split('-').map(Number); return new Date(y, m - 1, d, 12); }
  } catch (e) { /* ohne Parameter */ }
  return null;
}

export function adventStatus(datum) {
  const test = testDatum();
  const d0 = datum || test || new Date();
  const y = d0.getFullYear(), m = d0.getMonth() + 1, d = d0.getDate();
  let phase = 'aus', jahr = null, heute = 0;
  if (m === 11 && d >= 25 && KALENDER[y]) { phase = 'teaser'; jahr = y; }
  else if (m === 12 && d <= 24 && KALENDER[y]) { phase = 'aktiv'; jahr = y; heute = d; }
  else if (m === 12 && d >= 25 && KALENDER[y]) { phase = 'rueckblick'; jahr = y; heute = 24; }
  else if (m === 1 && d <= 6 && KALENDER[y - 1]) { phase = 'rueckblick'; jahr = y - 1; heute = 24; }
  const archivJahre = Object.keys(KALENDER).map(Number).filter((j) => new Date(j + 1, 0, 7) <= d0).sort((a, b) => b - a);
  return { phase, jahr, heute, kalender: jahr ? KALENDER[jahr] : null, archivJahre, test: !!test && !datum };
}

// Darf dieser Kalender gerade geöffnet werden? Liefert { kal, jahr, heute, modus } oder null.
export function zugang(jahr, st) {
  const kal = KALENDER[jahr];
  if (!kal) return null;
  if (st.jahr === jahr && (st.phase === 'aktiv' || st.phase === 'rueckblick')) return { kal, jahr, heute: st.heute, modus: st.phase };
  if (st.archivJahre.includes(jahr)) return { kal, jahr, heute: 24, modus: 'archiv' };
  return null;
}

export const blockIndex = (kal, tag) => Math.max(0, kal.bloecke.findIndex((b) => tag >= b.von && tag <= b.bis));
