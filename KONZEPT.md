# Konzept: Interaktive Trainings-App mit 3D-Körper (inkl. Adventskalender)

> **Arbeitstitel:** *Muskelkarte* (Name noch offen)
> **Stand:** 17. November 2026 · Version 1.0 (App gebaut und lauffähig, siehe [Kapitel 16](#16-umsetzung-version-10)). Kapitel 1–15 beschreiben den Weg dorthin.
> **Zweck dieses Dokuments:** Die komplette Idee festhalten, damit man sie Schritt für Schritt weiter ausarbeiten und umsetzen kann.

---

## Inhaltsverzeichnis

1. [Die Idee in einem Satz](#1-die-idee-in-einem-satz)
2. [Vision und Ziele](#2-vision-und-ziele)
3. [Zielgruppe und typische Situationen](#3-zielgruppe-und-typische-situationen)
4. [Kernfunktionen der App](#4-kernfunktionen-der-app)
5. [Der Adventskalender](#5-der-adventskalender)
6. [Aufbau, Navigation und Seiten](#6-aufbau-navigation-und-seiten)
7. [Inhalte und Datenmodell](#7-inhalte-und-datenmodell)
8. [Technik](#8-technik)
9. [Hosting und Deployment über GitHub](#9-hosting-und-deployment-über-github)
10. [Design-Richtungen](#10-design-richtungen)
11. [Fahrplan (Roadmap)](#11-fahrplan-roadmap)
12. [Offene Entscheidungen](#12-offene-entscheidungen)
13. [Risiken und wichtige Hinweise](#13-risiken-und-wichtige-hinweise)
14. [Wer macht was](#14-wer-macht-was)
15. [Ausbau nach dem Piloten (Version 0.2)](#15-ausbau-nach-dem-piloten-version-02)
16. [Umsetzung (Version 1.0)](#16-umsetzung-version-10)

---

## 1. Die Idee in einem Satz

Eine kostenlose **Web-App für Sport, Dehnen, Mobilität und Recovery**. In ihrer Mitte steht ein **drehbarer 3D-Körper**: Man tippt einen Muskel an und sieht sofort, mit welchen Übungen man ihn **kräftigt, dehnt, mobilisiert oder regeneriert**. Jede Übung wird mit einer **einfachen Animation** gezeigt. Die App läuft auf **iPhone, iPad, Android und Laptop**, wird über **GitHub kostenlos gehostet** und lässt sich per Link mit anderen teilen. In der Adventszeit verwandelt sie sich in einen **Adventskalender mit täglichen Mini-Challenges**.

---

## 2. Vision und Ziele

### Vision
Trainieren soll sich anfühlen wie das Erkunden einer Landkarte: Man sieht den eigenen Körper, versteht, was wo sitzt und wofür es da ist, und findet in Sekunden die passende Übung, ohne Vorwissen und ohne Fitnessstudio.

### Ziele
| # | Ziel | Woran man merkt, dass es erreicht ist |
|---|---|---|
| 1 | **Schnell zur passenden Übung** | Mit maximal 2–3 Tipps vom Start zur Übung |
| 2 | **Verstehen statt nur nachmachen** | Zu jedem Muskel und jeder Übung gibt es kurz erklärt das *Warum* |
| 3 | **Für alle Ebenen** | Jede Übung hat eine leichtere und eine schwerere Variante |
| 4 | **Überall nutzbar** | Funktioniert auf Handy, Tablet und Laptop, kann auf den Home-Bildschirm gelegt werden |
| 5 | **Kostenlos** | Keine laufenden Kosten für Hosting, Software oder Abos |
| 6 | **Teilbar** | Ein einziger Link reicht, um die App weiterzugeben |
| 7 | **Spaß und Motivation** | Serien, Fortschritt, saisonale Aktionen wie der Adventskalender |

### Was die App *nicht* ist (zumindest am Anfang)
- Keine medizinische Beratung oder Physiotherapie-Ersatz
- Kein soziales Netzwerk
- Keine native App im App Store (bewusst, wegen Kosten und Aufwand)
- Kein Tracker für Ernährung, Kalorien oder Wearables

---

## 3. Zielgruppe und typische Situationen

**Zielgruppe:** Freundeskreis, Familie, Kolleg:innen, also Menschen, die sich mehr bewegen, Verspannungen loswerden oder gezielt trainieren wollen. Kein Profi-Wissen nötig.

**Typische Situationen:**

| Situation | Was die Person denkt | Weg durch die App |
|---|---|---|
| Nach einem langen Bürotag | „Mein Nacken ist total verspannt.“ | Suche oder *Entdecken* → „Nacken nach dem Bürotag“ → Übung → *Jetzt machen* |
| Neugier | „Was kann ich eigentlich für meine Waden tun?“ | *Körper* → Wade antippen → Tab *Dehnen* oder *Kräftigen* → Übung |
| Wenig Zeit | „Ich hab 15 Minuten.“ | *Training* → fertige Routine wählen → Start |
| Vor dem Sport | „Ich geh gleich laufen.“ | *Entdecken* → „Vor dem Laufen“ → Routine |
| Nach dem Sport | „Morgen hab ich sicher Muskelkater.“ | *Körper* → Modus *Recovery* → beanspruchte Muskeln antippen |
| Dezember | „Was ist heute im Türchen?“ | Banner oder Tab *Advent* → Türchen öffnen → Challenge |

---

## 4. Kernfunktionen der App

### 4.1 Der 3D-Körper (Herzstück)
- Ein Körpermodell in der Bildschirmmitte
- **Drehen** mit einem Finger bzw. der Maus, **Zoomen** mit zwei Fingern bzw. dem Mausrad
- Knopf für **vorne / hinten** und einer für **Ansicht zurücksetzen**
- **Muskeln sind einzeln anklickbar.** Sie heben sich beim Antippen farbig hervor.
- **Zwei Detailstufen:**
  - **Stufe 1, Muskelgruppen** (Start): z. B. Brust, Schultern, Bizeps, Trizeps, Unterarme, Bauch, seitliche Bauchmuskeln, oberer Rücken, unterer Rücken, Nacken, Gesäß, Hüftbeuger, Oberschenkel vorne, Oberschenkel hinten, Adduktoren, Waden, Schienbein; insgesamt etwa 15–20 Gruppen
  - **Stufe 2, Einzelmuskeln** (beim Reinzoomen oder über „Genauer ansehen“): z. B. Oberschenkel vorne → Rectus femoris, Vastus lateralis, Vastus medialis, Vastus intermedius
- **Modus-Färbung:** Wählt man oben einen Modus (*Kräftigen, Dehnen, Mobilität, Recovery*), färbt sich der Körper wie eine Heatmap. Wo es viele Übungen gibt, ist die Farbe kräftiger.

### 4.2 Die vier Trainingsarten
| Modus | Bedeutung | Beispiele |
|---|---|---|
| 💪 **Kräftigen** | Muskel stärker und belastbarer machen | Kniebeuge, Liegestütz, Glute Bridge |
| 🧘 **Dehnen** | Muskel verlängern, Spannung lösen | Hüftbeuger-Dehnung, Türrahmen-Brustdehnung |
| 🔄 **Mobilität** | Gelenke aktiv durch den Bewegungsumfang führen | Katze-Kuh, Schulterkreisen, Hüftkreisen |
| 🌿 **Recovery** | Regeneration, Entspannung, Durchblutung | Faszienrolle, Atemübungen, lockeres Ausschütteln |

### 4.3 Übungen
Jede Übung hat:
- Name (deutsch, eventuell zusätzlich der englische Begriff)
- **Animation** (siehe 4.4)
- Kurze **Schritt-für-Schritt-Anleitung** (3–5 Schritte)
- **Typische Fehler** („Achte auf …“)
- **Varianten:** leichter und schwerer
- **Dosierung:** Wiederholungen × Sätze oder Haltedauer
- **Beteiligte Muskeln:** Hauptmuskeln und Nebenmuskeln, die man am Mini-Körper anklicken kann
- **Equipment:** keins, Matte, Handtuch, Stuhl, Widerstandsband, Kurzhanteln, Faszienrolle, Klimmzugstange …
- **Level:** Einsteiger, Fortgeschritten, Profi
- **Dauer** ungefähr in Minuten

### 4.4 Animationen
- **Stil:** schlichte, einheitliche **Gliederpuppe** (Mannequin), neutral, ohne Gesicht und Geschlecht
- Endlosschleife mit Tempo-Regler (0,5× / 1× / 1,5×) und Pause
- Die **beanspruchten Muskeln** leuchten an der Figur leicht mit.
- Kamerawinkel umschaltbar, z. B. von der Seite oder von vorne
- **Technik:** Jede Übung besteht aus wenigen **Schlüsselposen** (Gelenkwinkel), zwischen denen weich übergeblendet wird. Dadurch sind Animationen reine **Daten**: Neue Übungen brauchen kein Animationsprogramm, und Claude kann die Posen direkt schreiben.

### 4.5 Suche und Entdecken
- **Freitextsuche** über Muskeln, Übungen und Ziele („Nacken“, „Hüftbeuger“, „Rücken stärken“)
- **Filter:** Modus, Equipment, Dauer, Level, Körperregion
- **Themen-Kacheln:** „Nacken nach dem Bürotag“, „Vor dem Laufen“, „Nach dem Laufen“, „Besser schlafen“, „Rücken stärken“, „Ohne Geräte“, „5 Minuten Pause“

### 4.6 Routinen (Training)
- **Fertige Routinen:** z. B. „10 Min Morgen-Mobility“, „20 Min Beine ohne Geräte“, „Abend-Dehnen“
- **Eigene Routinen:** Bei jeder Übung gibt es „+ Zu Routine hinzufügen“, die Reihenfolge ändert man per Ziehen, Pausen und Sätze sind einstellbar.
- **Ablauf-Modus:** Vollbild, Timer bzw. Zähler, automatischer Wechsel zur nächsten Übung, Pausen-Countdown, optional Ton oder Vibration

### 4.7 Persönlicher Bereich (Ich)
- **Favoriten** (Herz-Symbol)
- **Verlauf:** Was wurde wann gemacht?
- **Serie / Streak:** Tage am Stück mit Aktivität
- **Körper-Rückblick:** Der Körper wird nach Trainingshäufigkeit des Monats eingefärbt, und man sieht sofort, was zu kurz kommt.
- **Einstellungen:** „Welches Equipment hast du?“ (setzt die Filter automatisch), Sprache, hell/dunkel, Ton an/aus
- **Daten exportieren / importieren** (Datei), damit der Fortschritt auf ein anderes Gerät umziehen kann

---

## 5. Der Adventskalender

### 5.1 Grundidee
In der Adventszeit bekommt die App einen **zusätzlichen Modus**, den Adventskalender. **Keine eigene App**, sondern ein saisonaler Teil der Haupt-App:

- **1. bis 24. Dezember:** Im Tab *Advent* liegen **24 Türchen**, auf der Startseite erscheint ein Banner („🎄 Türchen 7 wartet auf dich!“).
- **Hinter jedem Türchen** steckt eine **Mini-Challenge** mit Erklärung zum Körper.
- **Die Challenges bauen aufeinander auf.** **Jede Woche steht eine Körperregion im Fokus.**
- **Nach Weihnachten** bleiben alle Inhalte erhalten: Jede Challenge ist ganz normal als Übung in der Bibliothek beim passenden Muskel zu finden. Der Kalender wandert ins **Archiv** („Adventskalender 2026“).
- **Jedes Jahr neu:** Für das nächste Jahr wird einfach ein neuer Kalender-Inhalt hinterlegt. Die Bibliothek wächst dadurch jedes Jahr weiter.

### 5.2 Wann ist der Kalender sichtbar?
| Zeitraum | Verhalten |
|---|---|
| bis 30. November | Unsichtbar (optional ab ca. 25.11. ein Teaser: „Bald geht’s los!“) |
| 1.–24. Dezember | Tab *Advent* sichtbar, heutiges Türchen leuchtet, zukünftige sind verschlossen |
| 25. Dezember – 6. Januar | Kalender bleibt sichtbar als **Rückblick**, alle Türchen offen, Ergebnis vom Re-Test sichtbar |
| ab 7. Januar | Kalender ins Archiv unter *Ich → Archiv*, Inhalte weiter in der Bibliothek |

- Gesteuert über das **Datum des Geräts**. Wer schummeln will, kann das. Das ist bewusst egal, weil es kein Wettbewerb ist.
- Zum Testen gibt es einen versteckten Parameter, z. B. `?advent-datum=2026-12-07`, um einen beliebigen Tag zu simulieren.
- **Verpasste Türchen** kann man jederzeit nachholen (kein Frust).

### 5.3 Aufbau eines Türchens
Jedes Türchen nutzt dieselbe Ansicht wie eine normale Übung, ergänzt um:

1. **🎯 Die Challenge:** kurz, in 1–5 Minuten machbar, mit Animation
2. **🧠 Das Warum:** 2–3 Sätze Körperwissen: Welcher Muskel arbeitet? Wofür braucht man ihn im Alltag? Dazu ein überraschender Fakt. Der Muskel leuchtet dabei am 3D-Körper auf.
3. **⬇️⬆️ Leichter / Schwerer:** zwei Varianten, damit es für alle passt
4. **📝 Startwert eintragen:** an den Test-Tagen (z. B. „Wie lange hast du geschafft?“)
5. **✅ Abhaken:** Stern im Kalender, Serie wächst
6. **🎁 Bonus-Fakt:** erscheint nach dem Abhaken als kleine Belohnung

### 5.4 Der Bogen über 24 Tage

**Prinzip des Aufeinander-Aufbauens:**
- Innerhalb einer Woche werden die Challenges schrittweise anspruchsvoller.
- Spätere Tage greifen frühere Übungen wieder auf („Erinnerst du dich an Tag 3?“).
- **Drei Test-Tage** (Tag 1, 7, 13) halten einen Startwert fest, **Tag 24** wiederholt diese Tests und zeigt den Fortschritt.
- **Wochenabschluss:** Am letzten Tag eines Blocks wird die Region am Körper eingefärbt bzw. „freigeschaltet“. An Heiligabend ist der ganze Körper bunt.

#### Block 1 · Tag 1–6 · Beine und Gesäß 🦵
| Tag | Challenge | Leichter | Schwerer | Zielmuskel | Das Warum / Fakt |
|---|---|---|---|---|---|
| 1 | **Wandsitzen** so lange wie möglich → **Startwert** | Höher sitzen (Knie > 90°) | Ein Bein leicht anheben | Quadrizeps | Der Quadrizeps hat vier Köpfe und streckt das Knie, also bei jedem Schritt und jeder Treppenstufe. |
| 2 | 15 **langsame Kniebeugen** (3 Sek. runter, 1 halten, 3 hoch) | Auf Stuhl setzen und aufstehen | Am Ende 10 Sek. unten halten | Quadrizeps, Gesäß | Langsames Absenken (exzentrisch) baut besonders effektiv Kraft und Kontrolle auf. |
| 3 | **30 Sek. Einbeinstand** mit geschlossenen Augen, je Seite | Augen offen | Auf einem Kissen stehen | Fuß- und Unterschenkelmuskeln | Gleichgewicht kommt nicht nur aus dem Ohr: Sensoren in Gelenken und Muskeln melden ständig die Position. |
| 4 | **Glute Bridge:** 20 Wiederholungen + 20 Sek. oben halten | 10 Wiederholungen | Einbeinig | Großer Gesäßmuskel | Der große Gesäßmuskel gilt als größter Muskel des Körpers und ist beim langen Sitzen oft „eingeschlafen“. |
| 5 | **Hüftbeuger-Dehnung** im Kniestand, 2 × 45 Sek. je Seite | Mit Kissen unter dem Knie, kürzer halten | Arm der Dehnseite nach oben strecken | Iliopsoas | Der Hüftbeuger verbindet Wirbelsäule und Oberschenkel. Viel Sitzen hält ihn dauerhaft verkürzt. |
| 6 | 25 langsame **Wadenheben** + Wadendehnung an der Wand | An der Wand festhalten | Einbeinig auf einer Stufe | Wadenmuskulatur | Die Achillessehne ist die stärkste Sehne des Körpers. **Wochenabschluss: Beine leuchten!** |

#### Block 2 · Tag 7–12 · Rumpf und Rücken 🧱
| Tag | Challenge | Leichter | Schwerer | Zielmuskel | Das Warum / Fakt |
|---|---|---|---|---|---|
| 7 | **Unterarmstütz** so lange wie möglich → **Startwert** | Auf den Knien | Ein Bein abheben | Tiefe Bauchmuskeln | Der quere Bauchmuskel wirkt wie ein natürlicher Gürtel und stabilisiert die Wirbelsäule. |
| 8 | **Dead Bug:** 2 × 10 ganz langsam | Nur Beine bewegen | Mit gestreckten Beinen | Tiefe Bauchmuskeln | Bei dieser Übung bleibt der untere Rücken am Boden, so trainiert man Stabilität ohne Belastung. |
| 9 | **Bird Dog:** 1 Minute im Wechsel | Nur Arm oder nur Bein | Ellbogen und Knie unter dem Bauch zusammenführen | Rückenstrecker | Gegengleiche Bewegungen trainieren die Zusammenarbeit beider Körperhälften. |
| 10 | **Seitstütz:** 2 × 20 Sek. je Seite | Auf den Knien | Oberes Bein anheben | Schräge Bauchmuskeln | Die schrägen Bauchmuskeln drehen und neigen den Rumpf, zum Beispiel beim Werfen oder Schulterblick. |
| 11 | **Rückenstrecken** in Bauchlage („Superman“): 3 × 10 | Nur Arme heben | 3 Sek. oben halten | Rückenstrecker | Der Rückenstrecker hält uns den ganzen Tag aufrecht, meist ohne dass wir es merken. |
| 12 | **Katze-Kuh + Kindhaltung:** 3 Minuten | Kürzer | Mit Atemrhythmus 4 Sek. ein / 4 Sek. aus | Wirbelsäule (Mobilität) | Die Wirbelsäule hat 33–34 Wirbel, Bewegung hält die Bandscheiben versorgt. **Wochenabschluss: Rumpf leuchtet!** |

#### Block 3 · Tag 13–18 · Oberkörper 💪
| Tag | Challenge | Leichter | Schwerer | Zielmuskel | Das Warum / Fakt |
|---|---|---|---|---|---|
| 13 | So viele **Liegestütze** wie möglich → **Startwert** | An der Wand oder auf den Knien | Füße erhöht | Brust, Trizeps | Liegestütze trainieren Brust, Schultern, Arme **und** Rumpf gleichzeitig. |
| 14 | **Schulterkreisen mit Handtuch**, 2 × 10 | Hände weiter auseinander | Langsamer, mit Pause oben | Rotatorenmanschette | Die Schulter ist das beweglichste Gelenk des Körpers und braucht deshalb besonders viel Muskelführung. |
| 15 | **Türrahmen-Brustdehnung**, 2 × 30 Sek. je Seite | Arm tiefer | Arm höher, leicht vorlehnen | Großer Brustmuskel | Viel Handy- und Laptopzeit zieht die Schultern nach vorn, und diese Dehnung wirkt dagegen. |
| 16 | **Wand-Engel:** 2 × 10 | Kleinerer Bewegungsradius | Langsamer, Rücken komplett an der Wand | Unterer Trapezmuskel | Der untere Trapezmuskel zieht die Schulterblätter nach unten und sorgt für eine aufrechte Haltung. |
| 17 | **Trizeps-Dips am Stuhl:** 3 × 8 | Beine angewinkelt | Beine gestreckt | Trizeps | Der Trizeps macht etwa zwei Drittel des Oberarmumfangs aus, nicht der Bizeps. |
| 18 | **Nacken-Mobilisation & -Dehnung:** 3 Minuten | Nur Kopfneigen | Mit leichtem Zug der Hand | Trapezius, Schulterblattheber | Der Kopf wiegt etwa 5 kg, und je weiter er nach vorn rutscht, desto mehr muss der Nacken halten. **Wochenabschluss: Oberkörper leuchtet!** |

#### Block 4 · Tag 19–24 · Ganzkörper, Recovery und Finale 🎄
| Tag | Challenge | Leichter | Schwerer | Zielmuskel | Das Warum / Fakt |
|---|---|---|---|---|---|
| 19 | **Ganzkörper-Zirkel:** 3 Runden je 10 Kniebeugen, 5 Liegestütze, 20 Sek. Stütz | 2 Runden | 4 Runden | Ganzkörper | Kombiniert alles aus den letzten Wochen, quasi die Generalprobe. |
| 20 | **Box-Atmung** 4-4-4-4, 3 Minuten | 2 Minuten | 5 Minuten | Zwerchfell | Das Zwerchfell ist unser wichtigster Atemmuskel. Ruhiges Atmen senkt nachweislich die Anspannung. |
| 21 | **Faszien-Recovery** mit Rolle oder Tennisball (Fußsohle, Oberschenkel) | Nur Fußsohle | Waden und Gesäß dazu | Fuß, Oberschenkel | Sanfter Druck fördert die Durchblutung und fühlt sich nach Belastung einfach gut an. |
| 22 | **Bärenstand:** 3 × 20 Sek. (Knie schweben knapp über dem Boden) | 10 Sek. | Langsam vorwärts krabbeln (Bear Crawl) | Ganzkörper, Koordination | Trainiert Schultern, Rumpf und Beine gleichzeitig und fordert die Koordination. |
| 23 | **5-Minuten-Dehnroutine** für die Feiertage | 3 Minuten | 10 Minuten | Ganzkörper | Perfekt nach langem Sitzen am Festtagstisch. |
| 24 | 🎁 **Finale, der Re-Test:** Wandsitzen, Unterarmstütz und Liegestütze wie an Tag 1, 7 und 13 | – | – | Ganzkörper | Vorher-Nachher-Vergleich der Startwerte, der ganze Körper leuchtet, Schnee-Animation und „Frohe Weihnachten!“ |

> Die Inhalte sind ein **erster Entwurf** und sollen noch überarbeitet, ergänzt und fachlich geprüft werden.

### 5.5 Extras für die Weihnachtsstimmung
- Festliches Farbschema im Dezember (dezentes Rot/Grün/Gold, leichte Schnee-Animation im Hintergrund, abschaltbar)
- Türchen-Öffnen-Animation (Tür klappt auf)
- Abzeichen für Wochenabschlüsse und für „Alle 24 geschafft“
- Ergebnis-Karte nach Tag 24 als Bild zum Teilen („Ich habe 24/24 Challenges geschafft, Wandsitzen +40 Sek.!“)
- **Später:** gemeinsamer Kalender mit Freunden (wer hat heute schon?), siehe [Fahrplan Phase 4](#phase-4--gemeinsam-optional)

---

## 6. Aufbau, Navigation und Seiten

### 6.1 Grundprinzipien
1. **Der Körper ist das Herzstück** und von überall mit einem Tipp erreichbar.
2. **2–3 Tipps bis zur Übung**, keine tiefen Menüs.
3. **Eine Übung sieht überall gleich aus** (Körper, Suche, Routine, Adventskalender).
4. **Mobile first:** fürs Handy entworfen, auf größeren Bildschirmen erweitert.
5. **Einfach und ruhig:** wenig Text, klare Symbole, große Tippflächen (mind. 44 × 44 px).
6. **Barrierearm:** gute Kontraste, Schrift skalierbar, Animationen pausierbar, alles auch ohne 3D bedienbar (Listenansicht).

### 6.2 Navigation
Unten fest eine Leiste mit 4 Bereichen, im Dezember mit einem fünften:

```
┌────────────────────────────────────────────────────────┐
│  🧍 Körper   🔍 Entdecken   ▶️ Training   👤 Ich   🎄 Advent │
└────────────────────────────────────────────────────────┘
```

Auf dem Laptop wandert die Navigation als schmale Leiste an den linken Rand.

### 6.3 Seitenübersicht

```
App
├── 🧍 Körper (Start)
│   └── Muskel-Panel
│       └── Übungsdetail
│           └── Übung läuft (Vollbild)
├── 🔍 Entdecken
│   ├── Themen-Kachel → Übungsliste / Routine
│   └── Suche + Filter → Ergebnisliste → Übungsdetail
├── ▶️ Training
│   ├── Fertige Routinen → Routine-Detail → Ablauf (Vollbild)
│   └── Eigene Routinen → Bearbeiten
├── 👤 Ich
│   ├── Favoriten
│   ├── Verlauf & Serie
│   ├── Körper-Rückblick
│   ├── Archiv (vergangene Adventskalender)
│   └── Einstellungen
└── 🎄 Advent (nur Dezember)
    └── Türchen → (Übungsdetail + Warum + Startwert)
```

### 6.4 Die Seiten im Detail

#### Seite 1: Körper (Startseite)
```
┌──────────────────────────────┐
│ 🔍 Muskel oder Übung suchen…  │
│ [Kräftigen][Dehnen][Mobil.][Recovery] │
│ ┌──────────────────────────┐ │
│ │ 🎄 Türchen 7 wartet!    →│ │  ← nur im Dezember
│ └──────────────────────────┘ │
│                              │
│            🧍                │
│        (3D-Körper)           │
│                              │
│   [↺ Zurücksetzen] [⇆ Hinten] │
├──────────────────────────────┤
│ 🧍   🔍   ▶️   👤   🎄         │
└──────────────────────────────┘
```
- Ohne gewählten Modus sind alle Muskeln neutral, mit Modus erscheint die Heatmap-Färbung.
- Beim ersten Start gibt es einen kurzen Hinweis: „Dreh mich! Tipp einen Muskel an.“

#### Seite 2: Muskel-Panel
- Fährt von unten **halb** hoch, der Körper bleibt sichtbar und rückt nach oben. Hochwischen öffnet es ganz.
- Inhalt:
  - **Name:** „Oberschenkel vorne“ · *Quadrizeps*
  - **Wofür?** „Streckt das Knie, z. B. beim Treppensteigen, Aufstehen, Springen.“
  - **Tabs:** Kräftigen · Dehnen · Mobilität · Recovery (mit Anzahl)
  - **Übungskarten:** Mini-Animation, Name, ⏱ Dauer, 🧰 Equipment, ●●○ Level, ♡
  - Bei Gruppen: **„Genauer ansehen“** zoomt auf die Einzelmuskeln.

#### Seite 3: Übungsdetail
```
┌──────────────────────────────┐
│ ←                         ♡  │
│ ┌──────────────────────────┐ │
│ │      (Animation)         │ │
│ │  ▶︎  0,5× 1× 1,5×  🎥    │ │
│ └──────────────────────────┘ │
│ Glute Bridge                 │
│ ⏱ 3 Min · 🧰 Matte · ●○○     │
│                              │
│ So geht’s                    │
│ 1. Rückenlage, Füße auf …    │
│ 2. Becken anheben …          │
│                              │
│ Achte auf                    │
│ ⚠ Nicht ins Hohlkreuz …      │
│                              │
│ Leichter | Schwerer          │
│ Beteiligte Muskeln (Mini-🧍)  │
│ [+ Zu Routine]               │
├──────────────────────────────┤
│      [   ▶  Jetzt machen   ] │
└──────────────────────────────┘
```

#### Seite 4: Übung läuft (Vollbild)
- Große Animation, großer Timer bzw. Zähler, „Satz 2 von 3“
- Pause-Countdown zwischen Sätzen, Knöpfe: ⏸ Pause · ⏭ Weiter · ✕ Beenden
- Bildschirm bleibt an (Wake Lock), optional Ton oder Vibration bei Wechsel
- Am Ende: „Geschafft ✓“ und kurze Zusammenfassung, Eintrag in den Verlauf

#### Seite 5: Entdecken
- Suchfeld oben, darunter **Themen-Kacheln** im Raster
- **Filter** als ausklappbares Panel: Modus, Equipment, Dauer, Level, Region
- **Nach Region stöbern:** Listenansicht als Alternative zum 3D-Körper (wichtig für Barrierefreiheit und schwächere Geräte)

#### Seite 6: Training
- **Fertige Routinen** als Karten (Titel, Dauer, Anzahl Übungen, Regionen-Symbol)
- **Meine Routinen** mit „+ Neue Routine“
- **Routine-Detail:** Liste der Übungen, Gesamtdauer, Start-Knopf
- **Routine bearbeiten:** Übungen hinzufügen, entfernen, per Ziehen sortieren, Sätze, Wiederholungen und Pausen festlegen

#### Seite 7: Ich
- Serie (🔥 5 Tage), Wochenübersicht (Mo–So mit Punkten)
- **Körper-Rückblick:** eingefärbter Mini-Körper des Monats
- Favoriten, Verlauf, Archiv, Einstellungen
- Daten exportieren / importieren

#### Seite 8: Advent
```
┌──────────────────────────────┐
│ 🎄 Adventskalender 2026       │
│ Woche 2: Rumpf & Rücken      │
│ ┌──┐┌──┐┌──┐┌──┐┌──┐┌──┐     │
│ │⭐││⭐││⭐││⭐││⭐││⭐│     │
│ └──┘└──┘└──┘└──┘└──┘└──┘     │
│ ┌──┐┌──┐┌──┐┌──┐┌──┐┌──┐     │
│ │✨7││🔒8││🔒9││🔒10││🔒11││🔒12│ │
│ └──┘└──┘└──┘└──┘└──┘└──┘     │
│ …                            │
│ Fortschritt: 6/24 · 🔥 6     │
└──────────────────────────────┘
```
- Türchen als Raster (auf dem Handy 4 × 6, auf dem Laptop 6 × 4), optional in zufälliger Anordnung wie ein echter Kalender
- Oben: aktuelle Wochen-Region mit Mini-Körper

### 6.5 Größere Bildschirme (iPad, Laptop)
```
┌────┬─────────────────────┬──────────────────┐
│ 🧍 │                     │ Oberschenkel     │
│ 🔍 │                     │ vorne            │
│ ▶️ │      3D-Körper       │ [Kräft.][Dehnen] │
│ 👤 │                     │ ▢ Übung 1        │
│ 🎄 │                     │ ▢ Übung 2        │
│    │                     │ ▢ Übung 3        │
└────┴─────────────────────┴──────────────────┘
```
- Links die Navigation, in der Mitte der Körper, rechts dauerhaft das Panel
- Man tippt Muskeln an und sieht rechts sofort die Inhalte, ohne dass sich etwas schließt.
- iPad im Hochformat: wie Handy, aber mit größerem Panel

---

## 7. Inhalte und Datenmodell

Alle Inhalte liegen als **einfache Datendateien (JSON)** im Projekt. Neue Übungen oder Türchen hinzuzufügen heißt, einen Eintrag zu ergänzen. Keine Datenbank nötig.

### 7.1 Muskel
```json
{
  "id": "quadrizeps",
  "name": "Oberschenkel vorne",
  "fachbegriff": "Musculus quadriceps femoris",
  "region": "beine",
  "ebene": "gruppe",
  "untermuskeln": ["rectus-femoris", "vastus-lateralis", "vastus-medialis", "vastus-intermedius"],
  "wofuer": "Streckt das Knie, z. B. beim Treppensteigen, Aufstehen und Springen.",
  "fakt": "Besteht aus vier Köpfen, daher 'Quadri'-zeps.",
  "modellTeile": ["quad_L", "quad_R"]
}
```

### 7.2 Übung
```json
{
  "id": "glute-bridge",
  "name": "Glute Bridge",
  "modus": ["kraeftigen"],
  "hauptmuskeln": ["gesaess-gross"],
  "nebenmuskeln": ["oberschenkel-hinten", "rueckenstrecker"],
  "equipment": ["matte"],
  "level": 1,
  "dauerMin": 3,
  "dosierung": { "saetze": 3, "wiederholungen": 15 },
  "schritte": [
    "Rückenlage, Knie angewinkelt, Füße hüftbreit aufstellen.",
    "Gesäß anspannen und Becken anheben, bis Knie, Hüfte und Schultern eine Linie bilden.",
    "Kurz halten, dann langsam absenken."
  ],
  "fehler": ["Nicht ins Hohlkreuz drücken.", "Knie nicht nach innen fallen lassen."],
  "leichter": "Kleinerer Bewegungsumfang.",
  "schwerer": "Einbeinig ausführen.",
  "animation": "glute-bridge"
}
```

### 7.3 Animation (Schlüsselposen)
```json
{
  "id": "glute-bridge",
  "dauerSek": 3,
  "kamera": "seite",
  "posen": [
    { "t": 0.0, "basis": "rueckenlage", "gelenke": { "huefte": 60, "knie": 90 } },
    { "t": 0.5, "basis": "rueckenlage", "gelenke": { "huefte": 0, "knie": 90, "becken_hoehe": 0.25 } },
    { "t": 1.0, "basis": "rueckenlage", "gelenke": { "huefte": 60, "knie": 90 } }
  ]
}
```

### 7.4 Routine
```json
{
  "id": "morgen-mobility-10",
  "name": "10 Min Morgen-Mobility",
  "uebungen": [
    { "id": "katze-kuh", "dauerSek": 60 },
    { "id": "hueftkreisen", "dauerSek": 60 },
    { "id": "schulterkreisen-handtuch", "wiederholungen": 10 }
  ],
  "pauseSek": 15
}
```

### 7.5 Adventskalender
```json
{
  "jahr": 2026,
  "bloecke": [
    { "von": 1, "bis": 6, "titel": "Beine & Gesäß", "region": "beine" }
  ],
  "tueren": [
    {
      "tag": 1,
      "uebung": "wandsitzen",
      "titel": "Wie lange hältst du durch?",
      "warum": "Der Quadrizeps hat vier Köpfe und streckt das Knie …",
      "bonusFakt": "…",
      "startwert": { "typ": "zeit", "einheit": "sek", "retestTag": 24 }
    }
  ]
}
```

### 7.6 Woher kommen die Inhalte?
- **Selbst geschrieben** (mit Claude): Beschreibungen, Erklärungen, Fakten, Animationen
- **Als Inspiration und Abgleich** freie Übungsdatenbanken, z. B. *wger* (Open Source) oder *free-exercise-db*, **Lizenzen beachten** und Quellen nennen
- **Fachliche Prüfung:** Texte gegenlesen lassen, idealerweise von jemandem mit Sport- oder Physio-Hintergrund

### 7.7 Umfang am Anfang
| Was | Start (Prototyp) | Erste richtige Version |
|---|---|---|
| Muskelgruppen | 15–20 | 15–20 + erste Einzelmuskeln |
| Übungen | 30–40 | 80–120 |
| Routinen | 3 | 10 |
| Adventstürchen | 24 | 24 |

---

## 8. Technik

### 8.1 Grundsatzentscheidung: Web-App (PWA)
Die App wird als **Progressive Web App (PWA)** gebaut, eine Webseite, die sich wie eine App verhält:

- ✅ Läuft auf **allen Geräten** mit Browser (iPhone, iPad, Android, Mac, Windows)
- ✅ Kann über „Zum Home-Bildschirm hinzufügen“ **wie eine App installiert** werden (eigenes Icon, Vollbild)
- ✅ Funktioniert nach dem ersten Laden **auch offline**
- ✅ **Kein App Store**, keine Gebühren, Updates sind sofort für alle da
- ✅ **Ein Link** zum Teilen
- ❌ Kein Eintrag im App Store (bewusst in Kauf genommen)

### 8.2 Technologie-Stack (Vorschlag)
| Bereich | Werkzeug | Warum |
|---|---|---|
| Grundgerüst | **Vite** + **React** + **TypeScript** | Modern, schnell, weit verbreitet, gut wartbar |
| 3D | **Three.js** über **React Three Fiber** + **drei** | Standard für 3D im Browser, läuft auch auf Handys |
| PWA | **vite-plugin-pwa** | Offline-Fähigkeit und Installierbarkeit mit wenig Aufwand |
| Styling | CSS-Variablen / CSS Modules (oder Tailwind) | Einfache Themes inkl. Dunkelmodus und Weihnachts-Theme |
| Navigation | React Router (Hash-Routing) | Funktioniert problemlos auf GitHub Pages |
| Speicherung | **localStorage / IndexedDB** im Browser | Favoriten, Verlauf, Serie, Kalender-Fortschritt ohne Server |
| Hosting | **GitHub Pages** | Kostenlos, automatisch bei jeder Änderung |
| Automatisierung | **GitHub Actions** | Baut und veröffentlicht die App automatisch |

Alle Werkzeuge sind **kostenlos und Open Source**.

### 8.3 Das 3D-Modell
Der anspruchsvollste Teil, weil **jeder Muskel ein eigenes, anklickbares Objekt** sein muss.

| Option | Beschreibung | Vorteile | Nachteile |
|---|---|---|---|
| **A) Stilisierter Körper** | Eigener, schlichter Körper (Low-Poly), Muskelgruppen als getrennte Teile | Modern, leicht, schnell auf Handys, volle Kontrolle | Weniger anatomisch exakt |
| **B) Freies Anatomie-Modell** | z. B. *Z-Anatomy* oder *BodyParts3D* (CC BY-SA) | Sehr detailliert, echte Anatomie | Muss stark verkleinert werden, Lizenz verlangt Namensnennung und gleiche Lizenz für Ableitungen |
| **C) 2D-Körper (Vorstufe)** | Vorder- und Rückansicht als anklickbare Grafik | In kurzer Zeit gebaut, ideal zum Testen | Kein echtes 3D |

**Empfehlung:**
1. **Prototyp mit C**, um Bedienung und Seiten zu testen
2. **Erste Version mit A**: stilisierter 3D-Körper mit Muskelgruppen
3. **Später B prüfen**, für die Einzelmuskel-Ebene beim Reinzoomen

**Technische Anforderungen ans Modell:**
- Format **glTF/GLB** (Standard fürs Web), komprimiert (Draco/Meshopt)
- Zielgröße unter **5 MB**, damit es auf dem Handy schnell lädt
- Jedes Muskel-Objekt hat einen eindeutigen Namen, der mit `modellTeile` im Datenmodell übereinstimmt
- Links und rechts getrennt, aber gemeinsam auswählbar

> Hinweis: In `Projekte/Anatomie/` gibt es bereits andere Anatomie-Projekte (z. B. *Motor*, *Herz*). Prüfen, ob sich dort Modelle oder Erfahrungen wiederverwenden lassen.

### 8.4 Das Animationssystem
- Eine **Gliederpuppe** (einfaches Skelett mit ca. 15 Gelenken), in Three.js gebaut oder als schlichtes Modell
- Animationen sind **Schlüsselposen in JSON** (siehe 7.3) und werden zur Laufzeit weich ineinander übergeblendet (Interpolation mit Easing).
- Vorteil: winzige Dateien, einheitlicher Look, neue Übungen ohne Animationssoftware
- Fallback für schwache Geräte: 2D-Strichfigur mit denselben Posen-Daten
- Optional später: fertige Animationen aus freien Quellen (z. B. Mixamo) für komplexe Bewegungen

### 8.5 Speicherung und Datenschutz
- **Alle persönlichen Daten bleiben auf dem Gerät** (Favoriten, Verlauf, Startwerte, Kalender-Fortschritt).
- Kein Login, keine Accounts, kein Tracking, keine Cookies von Drittanbietern
- Umzug auf ein anderes Gerät über **Export/Import einer Datei**
- Später optional: Sync über einen kostenlosen Dienst (siehe Phase 4)

### 8.6 Projektstruktur (Vorschlag)
```
Sport/
├── KONZEPT.md                 ← dieses Dokument
├── README.md                  ← Kurzbeschreibung + Link zur App
├── index.html
├── package.json
├── vite.config.ts
├── public/
│   ├── icons/                 ← App-Icons für Home-Bildschirm
│   └── models/
│       ├── koerper.glb        ← 3D-Körper
│       └── puppe.glb          ← Gliederpuppe für Animationen
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── pages/                 ← Koerper, Entdecken, Training, Ich, Advent
│   ├── components/            ← UebungsKarte, MuskelPanel, Player, …
│   ├── three/                 ← 3D-Szene, Körper, Puppe, Animation
│   ├── data/
│   │   ├── muskeln.json
│   │   ├── uebungen.json
│   │   ├── animationen.json
│   │   ├── routinen.json
│   │   └── advent/
│   │       └── 2026.json
│   ├── lib/                   ← Speicherung, Suche, Datumslogik
│   └── styles/
└── .github/
    └── workflows/
        └── deploy.yml         ← automatisches Veröffentlichen
```

### 8.7 Leistung (Performance)
- Ziel: **unter 3 Sekunden** bis zur Bedienbarkeit auf einem durchschnittlichen Handy
- 3D-Modell komprimieren, Animationen erst bei Bedarf laden
- Bei schwachen Geräten automatisch die 2D-Ansicht anbieten

---

## 9. Hosting und Deployment über GitHub

### 9.1 Warum GitHub Pages?
- **Kostenlos** für öffentliche Projekte
- Die App liegt auf **GitHubs Servern**, du brauchst keinen eigenen Server.
- **HTTPS** inklusive (nötig für PWA-Funktionen)
- **Automatisch:** Jede Änderung am Code wird per GitHub Actions gebaut und veröffentlicht.
- Feste Adresse: `https://<benutzername>.github.io/<projektname>/`
- Optional später eine eigene Domain (die würde allerdings etwas kosten, ist aber nicht nötig)

### 9.2 Einmalige Einrichtung
1. **GitHub-Account anlegen** (kostenlos) → macht Philipp selbst
2. **Neues Repository** anlegen, z. B. `muskelkarte` (öffentlich)
3. Projekt lokal mit Git verbinden und hochladen
4. Im Repository unter **Settings → Pages → Source: GitHub Actions** auswählen
5. Workflow-Datei `.github/workflows/deploy.yml` anlegen (baut die App mit Vite und veröffentlicht sie)
6. In `vite.config.ts` den Pfad setzen: `base: '/muskelkarte/'`
7. Nach dem ersten Durchlauf ist die App unter der Adresse erreichbar.

### 9.3 Der Ablauf danach
```
Änderung am Code / an Inhalten
        ↓
git push nach GitHub
        ↓
GitHub Actions baut die App automatisch (ca. 1–2 Minuten)
        ↓
Neue Version ist online, alle Nutzer bekommen sie beim nächsten Öffnen
```

### 9.4 Teilen und Installieren
- **Teilen:** einfach den Link schicken (WhatsApp, Mail, QR-Code)
- **iPhone/iPad:** Link in Safari öffnen → Teilen-Symbol → „Zum Home-Bildschirm“
- **Android:** Link in Chrome öffnen → Menü → „App installieren“
- **Laptop:** Link im Browser öffnen, optional in Chrome/Edge „Installieren“

### 9.5 Alternativen (falls GitHub Pages mal nicht passt)
- **Netlify** oder **Cloudflare Pages**: ebenfalls kostenlos, sehr ähnlicher Ablauf
- **Claude Artifact**: für schnelle Prototypen zum Teilen ohne GitHub

---

## 10. Design-Richtungen

Vor der Umsetzung werden **2–3 Richtungen** visuell entworfen, eine davon wird ausgewählt:

| Richtung | Stimmung | Farben | Körper-Stil |
|---|---|---|---|
| **Klar & Klinisch** | Wie ein modernes Anatomie-Lehrbuch | Weiß, Hellgrau, Akzent Blau | Halbtransparent, Muskeln in Rot-/Rosatönen |
| **Sportlich & Energetisch** | Wie eine Fitness-App | Dunkler Hintergrund, Neon-Akzente (Grün/Orange) | Glatter, stilisierter Körper mit leuchtenden Muskeln |
| **Ruhig & Freundlich** | Wie eine Yoga-/Wellness-App | Warme Erdtöne, Pastell | Weich, rund, illustrativ |

**Für alle Richtungen gilt:**
- Hell- und Dunkelmodus
- Festliches Dezember-Theme, das sich über das gewählte Design legt
- Einheitliche Symbole für Modus, Equipment und Level
- Lesbare Schrift, große Tippflächen

---

## 11. Fahrplan (Roadmap)

### Phase 0 · Vorbereitung
- [ ] Konzept lesen, ergänzen, Entscheidungen treffen (siehe [Kapitel 12](#12-offene-entscheidungen))
- [ ] GitHub-Account anlegen
- [ ] Namen für die App finden
- [ ] 2–3 Design-Richtungen entwerfen lassen und eine auswählen

### Phase 1 · Klickbarer Prototyp
*Ziel: Bedienung und Seitenaufbau testen, noch ohne echtes 3D.*
- [ ] 2D-Körper vorne/hinten mit ca. 15 anklickbaren Muskelgruppen
- [ ] Muskel-Panel mit Tabs und Übungskarten
- [ ] Übungsdetail mit einfacher Strichfigur-Animation
- [ ] 10–15 Beispiel-Übungen
- [ ] Navigation mit allen Bereichen (teilweise noch leer)
- [ ] Auf Handy, iPad und Laptop testen, Feedback sammeln

### Phase 2 · Erste echte Version (MVP)
*Ziel: Die App ist nutzbar und online.*
- [ ] Projekt mit Vite + React + TypeScript aufsetzen
- [ ] GitHub-Repository und automatisches Deployment auf GitHub Pages
- [ ] PWA: installierbar und offline nutzbar
- [ ] Stilisierter **3D-Körper** mit Muskelgruppen, Drehen, Zoomen, Antippen
- [ ] Modus-Färbung (Heatmap)
- [ ] **Gliederpuppe** mit Schlüsselposen-Animationen
- [ ] 30–40 Übungen mit Texten, Varianten und Animationen
- [ ] Suche und Filter
- [ ] Favoriten und Verlauf (lokal gespeichert)
- [ ] Übung-läuft-Modus mit Timer

### Phase 3 · Adventskalender
*Ziel: Pünktlich zum 1. Dezember fertig.*
- [ ] Datumslogik (sichtbar, gesperrt, offen, Rückblick, Archiv) inkl. Test-Parameter
- [ ] Kalender-Seite mit 24 Türchen und Öffnen-Animation
- [ ] Alle 24 Türchen-Inhalte final schreiben und prüfen
- [ ] Startwerte und Re-Test an Tag 24 mit Vorher-Nachher-Vergleich
- [ ] Wochenabschluss (Region leuchtet), Abzeichen, Serie
- [ ] Weihnachts-Theme und Schnee-Animation (abschaltbar)
- [ ] Teilbare Ergebnis-Karte
- [ ] Startseiten-Banner im Dezember

### Phase 4 · Ausbau
- [ ] Routinen: fertige und eigene, mit Ablauf-Modus
- [ ] Entdecken-Seite mit Themen-Kacheln
- [ ] Körper-Rückblick im Bereich *Ich*
- [ ] Mehr Übungen (Ziel 80–120)
- [ ] Einzelmuskel-Ebene beim Reinzoomen (ggf. mit Anatomie-Modell)
- [ ] Daten-Export/-Import

### Phase 5 · Gemeinsam (optional)
- [ ] Freiwillige Accounts über einen kostenlosen Dienst (z. B. Supabase oder Firebase Free Tier)
- [ ] Fortschritt geräteübergreifend synchronisieren
- [ ] Gemeinsamer Adventskalender mit Freunden („Wer hat heute schon?“)
- [ ] Routinen per Link teilen

### Zeitliche Einordnung
Heute ist der **16. November 2026**, der Adventskalender müsste am **1. Dezember** starten.
- **Variante „Advent 2026“:** Phase 1 wird übersprungen oder stark verkürzt, und es entsteht zuerst eine **schlanke Version**: Adventskalender + einfache Körperansicht + die 24 Übungen. Die restliche App wächst danach weiter. Sportlich, aber machbar.
- **Variante „In Ruhe“:** Die App wird Schritt für Schritt gebaut, der Adventskalender startet zum **Advent 2027**, dann mit voll ausgebauter App.

---

## 12. Offene Entscheidungen

| # | Frage | Optionen | Entscheidung |
|---|---|---|---|
| 1 | Name der App | *Muskelkarte*, *BodyMap*, *Bewegt*, … | *Muskelkarte* (umbenennbar) |
| 2 | Adventskalender schon 2026? | Ja (schlanke Version) / Nein (2027) | Ja, sogar mit voller App |
| 3 | Design-Richtung | Klinisch / Sportlich / Ruhig | Design C „Kobalt“ (17.11.), hell und dunkel |
| 4 | 3D-Modell für Version 1 | Stilisiert / Anatomisch | Stilisiert, selbst erzeugt, Look „Linien“ (Kapitel 16.5) |
| 5 | Sprache | Nur Deutsch / Deutsch + Englisch | Nur Deutsch |
| 6 | Wer prüft die Inhalte fachlich? | Selbst / Bekannte mit Sport-/Physio-Hintergrund | offen |
| 7 | Accounts und Sync | Nie / Später (Phase 5) | Empfehlung: später |
| 8 | Repository öffentlich oder privat? | Öffentlich (GitHub Pages kostenlos) / Privat (Pages kostenpflichtig) | Empfehlung: öffentlich |

---

## 13. Risiken und wichtige Hinweise

### Gesundheit
- In der App steht gut sichtbar ein **Hinweis**: Die Inhalte ersetzen keine ärztliche oder physiotherapeutische Beratung. Bei Schmerzen, Verletzungen oder Vorerkrankungen vorher ärztlich abklären.
- Bei jeder Übung gibt es **„Bei Schmerzen abbrechen“**.
- Leichtere Varianten werden immer angeboten.
- Inhalte möglichst **fachlich gegenlesen** lassen.

### Lizenzen und Urheberrecht
- 3D-Modelle, Übungsdaten, Schriften und Icons nur aus **freien Quellen mit passender Lizenz**
- Quellen und Lizenzen in einer **„Über die App“-Seite** und im README nennen
- Bei CC-BY-SA-Material: Namensnennung und Weitergabe unter gleicher Lizenz beachten

### Technik
- **3D auf älteren Handys:** Modell klein halten, 2D-Fallback anbieten
- **iOS-Besonderheiten bei PWAs:** Installation nur über Safari, eingeschränkte Push-Benachrichtigungen; für Erinnerungen an Türchen ggf. eine Kalender-Datei (.ics) zum Abonnieren anbieten
- **Lokale Speicherung:** Daten können beim Löschen der Browserdaten verloren gehen, deshalb Export/Import anbieten

### Datenschutz
- Keine persönlichen Daten auf Servern, kein Tracking
- Falls später Accounts kommen: Datenschutzerklärung nötig

### Zeit
- Der 3D-Teil und die Animationen sind der größte Aufwand. Mit einem stilisierten Modell und Schlüsselposen bleibt das gut beherrschbar.

---

## 14. Wer macht was

| Aufgabe | Philipp | Claude |
|---|---|---|
| Idee, Richtung, Entscheidungen | ✅ | berät |
| GitHub-Account anlegen | ✅ | – |
| Design-Entwürfe | wählt aus, gibt Feedback | ✅ erstellt |
| Code (App, 3D, Animationen, PWA) | – | ✅ |
| Deployment einrichten (GitHub Actions) | bestätigt, verbindet Account | ✅ |
| Übungs- und Türchen-Texte | prüft, ergänzt, eigene Ideen | ✅ Entwürfe |
| Animations-Posen | Feedback | ✅ |
| Testen auf eigenen Geräten | ✅ | testet im Browser mit |
| Teilen mit Freunden | ✅ | – |

**Connectors oder kostenpflichtige Werkzeuge sind nicht nötig.** Alles lässt sich mit kostenlosen Mitteln umsetzen.

---

## 15. Ausbau nach dem Piloten (Version 0.2)

### 15.1 Der Pilot in Claude Design
**Link:** https://claude.ai/artifact/CcHFvwRjhZV7nEd4DwwEQ7 (privat, über das Teilen-Menü freigebbar)

| Artboard | Inhalt |
|---|---|
| **Vorschlag A · Studio** | Hell, schwarze Schrift (Archivo), Akzent Signalorange |
| **Vorschlag B · Nacht** | Fast schwarz, helle Schrift (Manrope), Akzent Volt-Gelbgrün |
| **Vorschlag C · Kobalt** | Kühles Hellgrau, Marineblau (Outfit), Akzent Kobaltblau, rundere Ecken |
| **Pilot · Handy (klickbar, 3D)** | Kompletter Weg: drehbarer 3D-Körper (17 Regionen) → Muskel-Panel → Übung mit 3D-Gliederpuppe → Ablauf mit Timer oder Stoppuhr. Dazu Entdecken, Training, Ich und der Adventskalender mit allen 24 Türchen. |
| **Advent · Finale an Tag 24** | Ergebnis-Karte: 3D-Körper in den Farben der Wochen, Vorher-Nachher der drei Tests (Beispielwerte) |
| **Laptop** | Navigation links, zwei Körperansichten nebeneinander, Panel dauerhaft rechts |

**Zwei Regler (Tweaks) am Pilot:**
- **designRichtung:** schaltet den klickbaren Piloten live zwischen *Studio*, *Nacht* und *Kobalt* um. Alle drei sind sportlich, clean und minimalistisch: eine einzige Akzentfarbe, viel Fläche, keine Zierelemente. Die erste Runde (*Atlas*, *Energie*, *Ruhe*) ist verworfen.
- **adventTag:** simuliert den Dezembertag (0 = außerhalb der Adventszeit, 1–24), entspricht dem Test-Parameter aus 5.2.

**Inhalt des Piloten:** 17 Muskelgruppen mit „Wofür?“ und Fakt, 25 Übungen mit Anleitung, Fehlern, Varianten und 3D-Animation, 6 Themen, 4 Routinen, 24 Türchen mit Bonus-Fakt (alle mit Animation). Alle Texte sind Entwürfe und noch nicht fachlich geprüft.

### 15.2 Neue Ideen, die im Piloten schon stecken
1. **Gegenspieler:** Im Muskel-Panel steht der Gegenspieler („Brust ↔ oberer Rücken“, „Hüftbeuger ↔ Gesäß“). Ein Tipp springt dorthin und dreht den Körper bei Bedarf um. Das stärkt Ziel 2 (*Verstehen statt nur nachmachen*) und beugt einseitigem Training vor. Datenmodell: neues Feld `gegenspieler` am Muskel.
2. **„Wusstest du?“ an jedem Muskel:** das vorhandene Feld `fakt` wird im Panel sichtbar, nicht nur im Advent.
3. **Challenge abschließen hakt das Türchen ab:** Wer die Challenge im Ablauf-Modus beendet, landet auf „Türchen abhaken“. Manuelles Abhaken bleibt möglich (für Türchen ohne Animation).
4. **Heatmap in vier Stufen:** 0, 1, 2 oder mindestens 3 Übungen je Region und Trainingsart. Einfach zu lesen und unabhängig von der späteren Übungszahl.
5. **Listenansicht ist Teil von *Entdecken*:** „Nach Region“ ersetzt eine eigene Listen-Seite. Der Knopf „Liste“ am Körper führt dorthin (Barrierefreiheit, schwache Geräte).
6. **Laptop zeigt beide Seiten:** Vorder- und Rückseite gleichzeitig, das Umschalten entfällt.
7. **Advent ohne eigenes Farbschema:** Seit der minimalistischen Richtung nutzt der Kalender dieselben Farben wie die App. Erledigte Türchen sind dunkel gefüllt, das heutige trägt die Akzentfarbe. Ein festliches Schema (Abschnitt 5.5) bleibt als spätere Option.
8. **Stoppuhr an Test-Tagen:** An Tag 1 und 7 zählt der Ablauf hoch statt herunter und trägt den Startwert automatisch ein. An Tag 24 laufen die drei Tests nacheinander, das Türchen zeigt Start, heute und Differenz.
9. **Kombi-Türchen:** Tag 19 (Zirkel), 23 (Dehnroutine) und 24 (Re-Test) starten eine Abfolge mehrerer Übungen.
10. **Eine Akzentfarbe statt vier Modusfarben:** Die Trainingsart wird über die Beschriftung unterschieden. Die Heatmap am Körper nutzt Abstufungen der Akzentfarbe, der gewählte Muskel die volle Farbe.
11. **Kamera folgt der Auswahl:** Tippt man einen Muskel an, dreht sich der Körper dorthin und zoomt heran. Der Gegenspieler liegt oft auf der anderen Seite, der Körper dreht sich dann von selbst um.

### 15.3 Animationsformat, wie im Piloten umgesetzt
Abweichend von 7.3 arbeitet der Pilot mit **Gelenkpunkten statt Gelenkwinkeln** (2D, Seitenansicht). Das ist für den Prototyp und den 2D-Fallback einfacher zu schreiben und zu prüfen:

```json
{
  "dauerSek": 6,
  "wandX": 96,
  "aktiv": ["huefte", "knie"],
  "posen": [
    { "t": 0.0,  "punkte": { "kopf": [101, 28], "schulter": [100, 44], "huefte": [100, 86], "knie": [112, 118], "fuss": [124, 150] } },
    { "t": 0.25, "punkte": { "kopf": [101, 60], "schulter": [100, 76], "huefte": [100, 118], "knie": [134, 118], "fuss": [134, 150] } }
  ]
}
```

- **12 Punkte:** Kopf, Schulter, Rumpfmitte, Hüfte, Knie, Fuß, Zehe, Ellbogen, Hand, dazu optional das zweite Bein (Knie, Fuß, Zehe).
- **`aktiv`:** die Kette, die in der Farbe der Trainingsart leuchtet (ersetzt vorerst das Mitleuchten einzelner Muskeln aus 4.4).
- **`wandX`:** einzige Requisite bisher, eine senkrechte Linie für Wand oder Türrahmen. Später denkbar: Stuhl, Stufe, Rolle.
- Zwischen den Posen wird weich überblendet, bei Kreisbewegungen linear.
- Für die 3D-Gliederpuppe (Phase 2) lassen sich die Punkte in Winkel umrechnen, oder das Format aus 7.3 kommt zusätzlich.

### 15.4 Advent 2026: Kalender-Fakten
Der 1. Dezember 2026 ist ein Dienstag. Daraus ergibt sich:

| Tag | Wochentag | Besonderheit |
|---|---|---|
| 6 | Sonntag | Nikolaus und 2. Advent, zugleich Wochenabschluss „Beine leuchten“ |
| 13 | Sonntag | 3. Advent, Test-Tag Liegestütze |
| 20 | Sonntag | 4. Advent, Box-Atmung (ruhiger Tag passt gut) |
| 24 | Donnerstag | Finale |

Idee: An den Adventssonntagen im Kalender eine Kerze mehr anzünden (1 bis 4), als zweites, ruhiges Fortschrittszeichen neben den Sternen.

### 15.5 Empfehlungen zu den offenen Entscheidungen
| # | Frage | Empfehlung | Begründung |
|---|---|---|---|
| 2 | Advent schon 2026? | **Ja, als schlanke Version** | Der Pilot deckt genau diesen Umfang ab: Kalender, 2D-Körper, Übungsansicht, Ablauf. 3D, Routinen-Editor und Einzelmuskeln kommen danach. |
| 3 | Design-Richtung | **Am Pilot mit dem Regler entscheiden** | *Atlas* passt am besten zum Namen und zur Landkarten-Idee, *Energie* wirkt am stärksten nach Fitness-App. |
| 4 | 3D-Modell | 2D für Advent 2026, stilisiertes 3D ab Januar | Die 2D-Regionen des Piloten lassen sich als Fallback weiterverwenden. |
| 1 | Name | *Muskelkarte* behalten, bis ein besserer auftaucht | Der Name trägt die Landkarten-Idee. |

**Was bei „Advent 2026“ wegfällt bzw. später kommt:** 3D-Körper, eigene Routinen, Einzelmuskel-Ebene, Export/Import, teilbare Ergebnis-Karte als Bild (bis 24.12. nachlieferbar), Schnee-Animation.

**Möglicher Zeitplan:**
- bis 20.11.: Pilot ansehen, Richtung wählen, Feedback zu Bedienung und Texten
- 21.–27.11.: Umsetzung als PWA (Vite, React), Deployment auf GitHub Pages, Teaser ab 25.11.
- 28.–30.11.: Test auf iPhone, iPad, Laptop, Texte der ersten Woche fachlich gegenlesen
- 1.12.: Start. Die Türchen-Texte der Wochen 2 bis 4 können noch im Dezember nachgeschärft werden.

### 15.6 Offene Punkte aus dem Piloten
- **Zwerchfell** (Tag 20) ist auf der Körperkarte keine eigene Region. Im Piloten ist die Box-Atmung dem Bauch zugeordnet.
- **Körper-Rückblick** im Bereich *Ich* ist im Piloten noch nicht enthalten.
- **Zoomen** geht im Piloten per Mausrad und automatisch bei der Auswahl. Die Zwei-Finger-Geste fehlt noch.
- **Tag 14** nutzt im Piloten freies Schulterkreisen, das Handtuch ist als schwerere Variante genannt.
- **Geprüft ist:** Der Programmcode läuft lokal fehlerfrei, Körper und alle 25 Figuren wurden als Bilder gerendert und angesehen. **Nicht geprüft ist** das Zusammenspiel im Browser (Drehen per Finger, Antippen, Ablauf). Auffälligkeiten bitte notieren.

### 15.7 Der 3D-Körper und die 3D-Gliederpuppe (Version 0.3)

**Wie der Körper entsteht:** ohne 3D-Datei und ohne Bibliothek, nur aus Zahlen im Code.
1. Der Körper ist aus rund 40 einfachen Formen beschrieben (Ellipsoide und Rundkegel), je eine oder mehrere pro Muskelgruppe plus Grundkörper. Definiert ist nur die rechte Hälfte, die linke entsteht durch Spiegelung.
2. Die Formen werden weich miteinander verschmolzen (Distanzfeld), daraus entsteht beim Start einmalig ein Dreiecksnetz (rund 16.000 Punkte, etwa eine Viertelsekunde).
3. Jeder Punkt weiß, zu welcher Muskelgruppe er gehört. An den Grenzen wird die Farbe weich überblendet.
4. Gezeichnet wird mit einem eigenen kleinen Renderer (Tiefenpuffer, Licht von links oben, Kantenlicht, leichte Verschattung in den Furchen). Ein Bild braucht lokal rund 10–15 Millisekunden.
5. Antippen liest die Muskelgruppe direkt aus dem gezeichneten Bild ab, pixelgenau.

**Vorteile:** keine Lizenzfragen, wenige Kilobyte statt eines 5-MB-Modells, einheitlicher Stil, Formen lassen sich per Zahl nachschärfen. **Grenzen:** stilisiert statt anatomisch exakt, Einzelmuskeln (Stufe 2) bräuchten deutlich mehr Formen oder doch ein Anatomie-Modell (Option B in 8.3).

**Für die echte App** (Phase 2) gibt es zwei Wege: denselben Ansatz behalten und nur das Zeichnen an Three.js übergeben (schneller, Schatten, Zwei-Finger-Zoom geschenkt), oder das Netz einmal als GLB exportieren und klassisch laden. Empfehlung: Netz behalten, Zeichnen an Three.js.

**Gliederpuppe:** Die Posen aus 15.3 bleiben 2D-Daten in der Seitenansicht. Daraus baut der Pilot in jedem Bild eine 3D-Figur aus Kapseln, die sich mit dem Finger drehen lässt (Kamerawinkel aus 4.4). Neu im Format:
- **zweites Bein, zweiter Arm** für gegengleiche Übungen (Dead Bug, Bird Dog, Einbeinstand)
- **seitlicher Abstand der Arme** für Bewegungen zur Seite (Wand-Engel)
- **`flach`** für Übungen in der Seitenlage (Seitstütz)
- **Requisiten** als Quader oder Kugel: Wand, Türpfosten, Stuhl, Ball
- **Startwinkel** der Kamera je Übung

### 15.8 Was noch von Philipp gebraucht wird
| Was | Wofür | Dringend? |
|---|---|---|
| Einen der drei Vorschläge wählen (oder sagen, was fehlt) | Danach wird nur noch eine Richtung gepflegt | Ja |
| Entscheidung Advent 2026 ja/nein | Bestimmt, ob jetzt die schlanke App gebaut wird | Ja, wegen 1. Dezember |
| Rückmeldung zum Körper: Proportionen, zu muskulös, zu abstrakt? | Formen lassen sich schnell anpassen | Bald |
| GitHub-Benutzername bzw. Account | Erst für die Veröffentlichung nötig | Erst zur Umsetzung |
| Jemand mit Sport- oder Physio-Hintergrund zum Gegenlesen | Übungs- und Türchen-Texte | Vor dem Start |

---

---

## 16. Umsetzung (Version 1.0)

Die App ist gebaut und liegt in diesem Ordner. Wie man sie startet und veröffentlicht, steht in der [README](README.md).

### 16.1 Technik: bewusst einfacher als in Kapitel 8 geplant
| Geplant (8.2) | Umgesetzt | Warum |
|---|---|---|
| Vite + React + TypeScript | Reines JavaScript als ES-Module, kein Build-Schritt | Läuft direkt auf GitHub Pages, keine Abhängigkeiten, die veralten können, jede Datei lesbar |
| Three.js / React Three Fiber | Eigener kleiner WebGL-Renderer (rund 150 Zeilen) plus Software-Ersatz | Der Körper wird ohnehin selbst erzeugt (15.7), dafür reicht ein schlanker Renderer |
| glTF-Modell | Körper aus Formen, Netz entsteht beim Start | Keine Lizenzfragen, wenige Kilobyte |
| vite-plugin-pwa | Eigener Service Worker (`sw.js`) | 30 Zeilen, volle Kontrolle |
| Google Fonts o. Ä. | Nur Systemschriften | Offline, schnell, keine Datenübertragung an Dritte |

Falls die App später deutlich wächst (viele Seiten, mehrere Entwickler), lässt sich der Umstieg auf Vite/React schrittweise machen. Die Daten- und 3D-Module können unverändert mit.

### 16.2 Was die Version 1.0 kann
- **Körper:** drehbarer 3D-Körper, 17 Muskelgruppen, Antippen, Zwei-Finger- und Mausrad-Zoom, Verschieben im Zoom, Kamerafahrt zum Muskel, Heatmap je Trainingsart, Gegenspieler, Listenansicht
- **Übungen:** 25 Übungen mit 3D-Gliederpuppe, Tempo, frei drehbar, Anleitung, Fehler, Varianten, beteiligte Muskeln, Favoriten
- **Ablauf:** Timer, Stoppuhr, „so viele wie möglich“, Sätze, Seitenwechsel, Pausen mit Countdown, Ton und Vibration, Bildschirm bleibt an, Verlauf
- **Entdecken:** Suche (auch nach Fachbegriffen), Filter nach Trainingsart, 6 Themen, alle Übungen nach Art
- **Training:** 4 fertige und beliebig viele eigene Routinen
- **Ich:** Serie, Woche, Körper-Rückblick des Monats (vorn und hinten), Startwerte, Archiv, Favoriten, Verlauf, Erscheinungsbild, Ton, Export/Import, „Über die App“
- **Advent 2026:** Datumslogik aus 5.2 inklusive Teaser, Rückblick und Archiv, 24 Türchen mit eigenem Ablauf, Test-Tage, Re-Test mit Differenz, Fortschritt am Körper, Kalenderdatei mit täglicher Erinnerung um 18 Uhr, Ergebnis-Karte als Bild
- **Geräte:** Handy, Tablet, Laptop (eigenes Layout ab 900 px), installierbar, offline

### 16.3 Geprüft
- `node tools/pruefen.mjs`: alle Inhalte, Posen, Datumsphasen und das 3D-Netz (läuft auch automatisch vor jeder Veröffentlichung)
- Im Browser durchgeklickt: Körper antippen, Panel, Übung, Ablauf mit Timer und Stoppuhr, Türchen mit Startwert und Abhaken, Kalender, Re-Test an Tag 24, Ergebnis-Karte, Routinen mit Pausen, eigene Routinen, Suche, Ich-Seite, Teaser- und Archiv-Datum, Laptop-Layout, dunkles Erscheinungsbild, Wechsel des Körper-Stils, Export/Import
- **Nicht geprüft:** echte Touch-Gesten auf iPhone/Android, Installation als App, Offline-Modus (braucht HTTPS, also erst nach dem Veröffentlichen), Teilen-Dialog des Handys

### 16.4 Bewusst weggelassen
- Schnee-Animation und festliches Farbschema (passt nicht zum minimalistischen Stil)
- Einzelmuskel-Ebene beim Reinzoomen (bräuchte ein Anatomie-Modell, siehe 8.3 Option B)
- Konten und Synchronisation (Phase 5, optional)
- Ziehen zum Sortieren: eigene Routinen werden mit Pfeilen sortiert, das geht auch ohne Feinmotorik

### 16.5 Design C und neue Körper-Darstellungen (17. November)
- **Design C „Kobalt“** ist jetzt das einzige Design: kühles Hellgrau, Marineblau, Akzent Kobaltblau, runde Formen. Dazu eine dunkle Variante. Einstellung: Automatisch, Hell, Dunkel. Studio und Nacht sind entfallen.
- **Der modellierte Körper** (ausgeprägte Schultern, Muskelwülste) wirkte zu wild. Das Modell erzeugt jetzt mehrere Stile aus denselben Formen. Bei den glatten Stilen dienen die Muskelformen nur noch zum Einfärben:

| Stil | Aussehen | Stärke |
|---|---|---|
| **Tonflächen** (Standard) | Glatter Körper, jede Muskelgruppe in einer von drei Blaustufen, feine Grenzen | Partien auf einen Blick unterscheidbar |
| **Konturen** | Heller glatter Körper, Partien mit feinen Linien umrandet | Sehr ruhig, technisch |
| **Dezent** | Einfarbig, Muskeln nur leicht angedeutet | Am natürlichsten |
| **Gliederpuppe** | Klare Segmente wie bei einer Holz-Gliederpuppe, Tonflächen | Am grafischsten |

  Die Vorschläge liegen im Claude-Design-Canvas, in der App lassen sie sich unter *Ich → Darstellung des Körpers* umschalten. Nach der Entscheidung wird der gewählte Stil Standard, die Auswahl kann dann verschwinden. Verworfen: „Facetten“ (Low-Poly), wirkte unruhig.

**Zweiter Ansatz (17. November, abends):** Auch diese vier Varianten wirkten noch seltsam: Eierkopf, Knubbelknie, Röhrenglieder und fleckige Farbgrenzen. Deshalb ist der Körper jetzt komplett neu gebaut (`src/three/figur.js`):
- **Form:** realistisch proportioniert (1,75 m), der Rumpf entsteht aus fließenden Querschnitten, Arme und Beine aus Röhren mit Radiusverlauf, Arme leicht abgespreizt. Keine Muskelwülste.
- **Muskelflächen:** als Regeln beschrieben (Höhe, vorn/hinten, Lage um Bein oder Arm) und pro Bildpunkt auf dem Grafikchip ausgewertet. Ergebnis: saubere, abgerundete Flächen mit klaren Kanten und schmalen Abständen dazwischen.
- **Drei Looks** aus demselben Körper: *Skulptur* (weich beleuchtet), *Linien* (Höhenlinien wie ein 3D-Scan), *Illustration* (flach mit Umrisslinie). Vorschläge im Canvas. Die Varianten der ersten Runde sind entfernt.
- **Entscheidung:** *Linien* ist der feste Look der App (auch die App-Icons). Skulptur und Illustration bleiben im Code als Alternativen, sind in der App aber nicht mehr wählbar.

### 16.6 Was noch zu tun ist (nur Philipp kann das)
1. **GitHub-Account** anlegen bzw. nennen, dann das Repository erstellen und hochladen (README, Abschnitt „Veröffentlichen“). Claude kann das übernehmen, sobald der Account in der Kommandozeile angemeldet ist.
2. **Auf dem eigenen Handy testen:** Drehen, Antippen, Ablauf, „Zum Home-Bildschirm“.
3. **Texte gegenlesen lassen**, idealerweise von jemandem mit Sport- oder Physio-Hintergrund.
4. **Link teilen**, spätestens zum 1. Dezember.

### 16.7 Anatomischer Körper (19. November)
- **Quelle:** das Männer-Modell aus [open-anatomy-3d](https://github.com/MervinR07/open-anatomy-3d) (Modelle CC BY 4.0, Code MIT), selbst aus BodyParts3D (© DBCLS, CC BY 4.0) entstanden. CC BY 4.0 erlaubt kommerzielle Nutzung und Änderungen, verlangt aber Namensnennung (steht in *Über die App* und im README). Anders als CC BY-SA muss die App dadurch nicht offengelegt werden.
- **Umsetzung (Weg „einmal umrechnen“):** `tools/koerper-umrechnen.mjs` nimmt nur die äußere Haut (das Modell hat eine doppelte Hautschale) und misst für jeden Hautpunkt, welche Muskelgruppe direkt darunter liegt. Daraus entstehen glatte Flächen mit schmalen Fugen. Große Dreiecke werden geteilt (Kanten höchstens 13 mm), die Grenzen entstehen aus weichgezeichneten Zugehörigkeiten und verlaufen dadurch rund mit gleichmäßigen Fugen. Ergebnis: `src/data/koerper.bin`, gzip-gepackt rund 1 MB, rund 43.000 Punkte. Renderer, Antippen und der Look *Linien* bleiben, es kommt keine Bibliothek dazu.
- **Zuordnung der Modellteile:** Wo das Modell Muskeln zusammenfasst, teilt eine Regel nach Lage: Oberarm vorn = Bizeps, hinten = Trizeps; Bauchwand Mitte = Bauch, Seite = seitlicher Bauch; Rücken nach Höhe in Nacken, oberen und unteren Rücken. Der **Latissimus fehlt im Modell**, die Haut darüber wird dem Rücken zugeschlagen. Kopf, Hände, Füße, Kniescheibe und Sehnen bleiben neutral.
- **Bonus fürs Konzept:** Das Modell kennt auch Zwerchfell, Rotatorenmanschette, Beckenboden, Hand- und Fußmuskeln. Das ist eine gute Grundlage für die Einzelmuskel-Ebene (4.1, Stufe 2).
- **Offen:** Die App-Icons zeigen weiter den alten Körper (`tools/icons.mjs`). Ein Frauen-Modell gibt es in open-anatomy-3d ebenfalls, ist aber nicht eingebaut.

*Nächster Schritt: GitHub-Repository anlegen und die App veröffentlichen.*
