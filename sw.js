// Muskelkarte · Service Worker
// Legt alle Dateien beim ersten Besuch im Speicher ab, damit die App offline läuft.
// Nach Änderungen an der App: VERSION hochzählen, dann bekommen alle die neue Fassung.

const VERSION = 'muskelkarte-2026-11-17-4';
const DATEIEN = [
  './',
  './index.html',
  './manifest.webmanifest',
  './src/styles.css',
  './src/app.js',
  './src/advent.js',
  './src/store.js',
  './src/buehne.js',
  './src/three/figur.js',
  './src/three/figurstil.js',
  './src/three/puppe.js',
  './src/three/render.js',
  './src/data/muskeln.js',
  './src/data/uebungen.js',
  './src/data/advent-2026.js',
  './icons/favicon-32.png',
  './icons/apple-touch-icon.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(DATEIEN)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});

// Erst aus dem Speicher antworten, im Hintergrund aktualisieren
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(caches.open(VERSION).then(async (cache) => {
    const treffer = await cache.match(req, { ignoreSearch: true }) || (req.mode === 'navigate' ? await cache.match('./index.html') : null);
    const netz = fetch(req).then((res) => { if (res && res.ok) cache.put(req, res.clone()); return res; }).catch(() => treffer);
    return treffer || netz;
  }));
});
