# Muskelkarte

Kostenlose Web-App für Kräftigen, Dehnen, Mobilität und Recovery. In der Mitte steht ein drehbarer 3D-Körper: Muskel antippen, passende Übung finden, mit animierter 3D-Gliederpuppe mitmachen. Im Dezember gibt es einen Adventskalender mit 24 Mini-Challenges.

Die ganze Idee steht in [KONZEPT.md](KONZEPT.md).

## Was drin ist

- **3D-Körper** mit 17 Muskelgruppen: drehen, zoomen (zwei Finger oder Mausrad), antippen. Die Kamera fährt zum gewählten Muskel.
- **25 Übungen** mit Anleitung, typischen Fehlern, leichter/schwerer, beteiligten Muskeln und 3D-Animation (Tempo 0,5×–1,5×, frei drehbar)
- **Ablauf-Modus** mit Timer, Stoppuhr, Sätzen, Pausen, Ton/Vibration; der Bildschirm bleibt an
- **Entdecken:** Suche, Filter, Themen („Nacken nach dem Bürotag“ …), Liste nach Region
- **Training:** 4 fertige Routinen und eigene Routinen (anlegen, sortieren, umbenennen)
- **Ich:** Serie, Wochenübersicht, Körper-Rückblick des Monats, Startwerte, Favoriten, Verlauf, Archiv, Export/Import
- **Adventskalender 2026:** 24 Türchen in 4 Wochenblöcken, Test-Tage mit Stoppuhr, Re-Test an Tag 24, Fortschritt am Körper, Erinnerungen als Kalenderdatei, Ergebnis als Bild teilen
- **Design C „Kobalt“** in Hell und Dunkel, „Automatisch“ folgt dem Gerät
- **3D-Körper im Look „Linien“:** Höhenlinien wie bei einem 3D-Scan, Muskelgruppen als kräftigere Linien
- **PWA:** installierbar, offline nutzbar, keine Konten, kein Tracking, keine fremden Server

## Lokal starten

```bash
python3 -m http.server 8642
```

Dann <http://localhost:8642> öffnen. Ein Build-Schritt ist nicht nötig, es gibt keine Abhängigkeiten.

Adventskalender ausprobieren, egal welches Datum gerade ist:

```text
http://localhost:8642/?advent-datum=2026-12-07
```

## Veröffentlichen über GitHub Pages

1. Auf GitHub ein **öffentliches** Repository anlegen, z. B. `muskelkarte`.
2. Diesen Ordner hochladen:
   ```bash
   git init -b main
   git add .
   git commit -m "Muskelkarte"
   git remote add origin https://github.com/BENUTZERNAME/muskelkarte.git
   git push -u origin main
   ```
3. Im Repository unter **Settings → Pages → Source** „GitHub Actions“ wählen.
4. Nach 1–2 Minuten läuft die App unter `https://BENUTZERNAME.github.io/muskelkarte/`.

Jede weitere Änderung, die nach `main` gepusht wird, prüft und veröffentlicht der Workflow in `.github/workflows/deploy.yml` automatisch. **Nach Änderungen an der App in `sw.js` die `VERSION` hochzählen**, damit installierte Apps die neue Fassung laden.

## Aufbau

```text
index.html               Einstieg
manifest.webmanifest     App-Name, Icons, Farben fürs Installieren
sw.js                    Offline-Speicher (Service Worker)
icons/                   App-Icons (erzeugt mit tools/icons.mjs)
src/
  app.js                 Seiten, Navigation, Ablauf-Modus, Einstellungen
  styles.css             Gestaltung (Design C, hell und dunkel)
  buehne.js              3D-Körper und Gliederpuppe auf dem Bildschirm
  store.js               Speicher im Browser, Export/Import
  advent.js              Datumslogik des Adventskalenders
  three/figur.js         3D-Körper (Querschnitte → Dreiecksnetz) und Muskelflächen als Regeln
  three/figurstil.js     Darstellung: Linien (aktiv), dazu Skulptur und Illustration
  three/puppe.js         Gliederpuppe aus Schlüsselposen
  three/render.js        Zeichnen mit WebGL, Ersatz ohne WebGL
  data/muskeln.js        Muskelgruppen
  data/uebungen.js       Übungen, Themen, Routinen
  data/advent-2026.js    Die 24 Türchen
tools/
  pruefen.mjs            Prüft Inhalte, Datumslogik und 3D-Netz
  icons.mjs              Erzeugt die Icons neu
```

## Inhalte erweitern

- **Körper anpassen:** Form und Lage der Muskelflächen stehen in `REGELN` in `src/three/figur.js` (Höhen in Metern), Linienabstand und Farben in `src/three/figurstil.js` und `FARBEN` in `src/buehne.js`. Der Look steht in `src/app.js` (`stil`); `skulptur` und `flach` sind als Alternativen weiterhin eingebaut.
- **Neue Übung:** Eintrag in `src/data/uebungen.js` ergänzen. Die Animation sind ein paar Schlüsselposen (Format oben in `src/three/puppe.js`).
- **Neuer Adventskalender:** `src/data/advent-2026.js` kopieren, z. B. als `advent-2027.js`, Inhalte ersetzen, in `src/advent.js` unter `KALENDER` eintragen und in `sw.js` ergänzen.
- Danach `node tools/pruefen.mjs` ausführen: Es meldet fehlende Texte, unbekannte Muskeln oder kaputte Posen.

## Hinweise

Die Inhalte ersetzen keine ärztliche oder physiotherapeutische Beratung. Die Texte sind Entwürfe und sollten fachlich gegengelesen werden. Körper, Puppe, Texte und Icons sind eigens für dieses Projekt entstanden. Es werden keine fremden Modelle, Schriften oder Bibliotheken verwendet.
