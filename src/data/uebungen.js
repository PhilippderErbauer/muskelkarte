// Muskelkarte · Übungen, Themen und fertige Routinen
//
// Eine Übung:
//   n Name, m Trainingsart, h Hauptmuskeln, nb Nebenmuskeln, eq Equipment, lv Level (1–3),
//   min Dauer in Minuten, dos Dosierung ({ typ: 'zeit', sek, s } oder { typ: 'wdh', n, s }),
//   seiten true, wenn je Seite geübt wird, st Schritte, f typische Fehler, le leichter, sw schwerer,
//   an Animation (Format: siehe src/three/puppe.js)

import { MODI } from './muskeln.js';

// --- Posen-Bausteine (Seitenansicht, Boden bei y = 150) ---
const X = (b, o) => b.slice(0, 18).concat(o.l2 || b.slice(8, 14), o.a2 || b.slice(14, 18), o.lt || []);
const S = [120, 28, 120, 44, 120, 64, 120, 86, 119, 118, 118, 150, 132, 150, 121, 68, 123, 90];
const sitz = [101, 60, 100, 76, 100, 97, 100, 118, 134, 118, 134, 150, 148, 150, 106, 98, 122, 110];
const wandStand = [101, 28, 100, 44, 100, 65, 100, 86, 112, 118, 124, 150, 138, 150, 102, 68, 104, 90];
const hocke = [128, 63, 122, 78, 112, 96, 104, 116, 138, 122, 118, 150, 132, 150, 144, 84, 166, 82];
const liegt = [52, 140, 68, 142, 89, 143, 110, 142, 136, 120, 150, 150, 164, 150, 90, 147, 112, 148];
const bruecke = [52, 140, 68, 142, 90, 131, 112, 118, 145, 117, 150, 150, 164, 150, 90, 147, 112, 148];
const brettA = [182, 113, 166, 119, 145, 123, 124, 127, 92, 134, 60, 140, 58, 150, 166, 146, 188, 147];
const brettB = [182, 112, 166, 119, 145, 121.5, 124, 125, 92, 133, 60, 140, 58, 150, 166, 146, 188, 147];
const stuetzOben = [178, 100, 162, 107, 142, 114, 122, 121, 91, 131, 60, 140, 58, 150, 163, 128, 164, 150];
const stuetzUnten = [182, 130, 166, 134, 148, 136, 130, 137, 95, 139, 60, 141, 58, 150, 145, 139, 164, 150];
const zehen = [120, 21, 120, 37, 120, 57, 120, 79, 119, 111, 118, 143, 132, 150, 121, 61, 123, 83];
const bauchlage = [182, 140, 166, 143, 145, 144, 124, 145, 92, 146, 60, 146, 52, 148, 188, 145, 210, 146];
const superman = [180, 126, 165, 134, 145, 141, 124, 145, 92, 141, 60, 134, 52, 133, 187, 130, 208, 124];
const knieA = [120, 58, 119, 74, 118, 95, 118, 116, 150, 118, 150, 150, 164, 150, 128, 92, 122, 110, 104, 146, 72, 146, 60, 150];
const knieB = [127, 62, 126, 78, 126, 99, 126, 120, 156, 118, 150, 150, 164, 150, 135, 96, 130, 114, 104, 146, 72, 146, 60, 150];
const wadeA = [156, 39, 148, 53, 138, 72, 128, 92, 148, 120, 142, 150, 156, 150, 162, 60, 177, 52, 110, 121, 92, 150, 106, 150];
const wadeB = [159, 40, 151, 54, 141, 73, 132, 93, 151, 121, 142, 150, 156, 150, 164, 61, 177, 52, 113, 122, 92, 150, 106, 150];
const tuerA = X([120, 28, 120, 44, 120, 64, 120, 86, 119, 118, 118, 150, 132, 150, 98, 46, 98, 24], { a2: [121, 68, 123, 90] });
const tuerB = X([126, 29, 125, 45, 123, 65, 121, 86, 119, 118, 118, 150, 132, 150, 99, 46, 98, 24], { a2: [125, 69, 126, 91] });
const nick = [128, 32, 120, 44, 120, 64, 120, 86, 119, 118, 118, 150, 132, 150, 121, 68, 123, 90];
const vier = [180, 106, 164, 108, 136, 108, 108, 110, 108, 144, 74, 146, 62, 150, 164, 129, 164, 150];
const kuh = [181, 96, 164, 108, 136, 118, 108, 110, 108, 144, 74, 146, 62, 150, 164, 129, 164, 150];
const katze = [178, 122, 164, 108, 136, 94, 108, 110, 108, 144, 74, 146, 62, 150, 164, 129, 164, 150];
const arm = (ex, ey, hx, hy) => [120, 28, 120, 44, 120, 64, 120, 86, 119, 118, 118, 150, 132, 150, ex, ey, hx, hy];
const atemB = [52, 140, 68, 141, 89, 138, 110, 142, 136, 120, 150, 150, 164, 150, 90, 147, 112, 148];
const hochA = [64, 142, 80, 144, 110, 145, 138, 145, 143, 112, 146, 80, 134, 79, 100, 148, 120, 148];
const hochB = [64, 142, 80, 144, 110, 142, 138, 145, 143, 112, 146, 80, 134, 79, 100, 148, 120, 148];
const einA = X([120, 28, 120, 44, 120, 64, 120, 86, 119, 118, 118, 150, 132, 150, 120, 66, 121, 86], { l2: [144, 108, 142, 140, 154, 144], lt: [27, 34, 27, 34] });
const einB = X([123, 28, 122, 44, 121, 64, 120, 86, 119, 118, 118, 150, 132, 150, 122, 66, 122, 86], { l2: [145, 107, 143, 139, 155, 143], lt: [30, 40, 24, 30] });
const kaeferT = [68, 120, 68, 98];
const kaefer = [52, 140, 68, 142, 89, 143, 110, 142];
const kaeferN = X(kaefer.concat([112, 108, 144, 108, 146, 97], kaeferT), {});
const kaeferL = X(kaefer.concat([143, 136, 175, 134, 180, 123], kaeferT), { l2: [112, 108, 144, 108, 146, 97], a2: [46, 138, 24, 136] });
const kaeferR = X(kaefer.concat([112, 108, 144, 108, 146, 97], [46, 138, 24, 136]), { l2: [143, 136, 175, 134, 180, 123], a2: kaeferT });
const vogelN = X(vier, {});
const vogelL = X(vier.slice(0, 14).concat([186, 104, 208, 102]), { l2: [74, 111, 41, 112, 36, 123], a2: [164, 129, 164, 150] });
const vogelR = X(vier.slice(0, 8).concat([74, 111, 41, 112, 36, 123, 164, 129, 164, 150]), { l2: [108, 144, 74, 146, 62, 150], a2: [186, 104, 208, 102] });
const seitA = X([176.5, 104.8, 160.9, 108.3, 142, 118, 123.2, 127.6, 91, 138.6, 58, 146, 52, 150, 164, 146, 165, 147], { l2: [89.5, 131.8, 56.5, 139.2, 50, 143], a2: [158, 72, 159, 50], lt: [0, 22, 0, 0] });
const seitB = X([176.5, 103.8, 160.9, 107.3, 142, 114.5, 123.2, 122.6, 91, 135.5, 58, 146, 52, 150, 164, 146, 165, 147], { l2: [89.5, 128.6, 56.5, 139.2, 50, 143], a2: [158, 71, 159, 49], lt: [0, 22, 0, 0] });
const engelW = X([101, 28, 100, 44, 100, 65, 100, 86, 104, 118, 108, 150, 122, 150, 100, 46, 100, 26], { lt: [40, 40, 40, 40] });
const engelY = X([101, 28, 100, 44, 100, 65, 100, 86, 104, 118, 108, 150, 122, 150, 100, 24, 100, 4], { lt: [30, 38, 30, 38] });
const dipOben = [107, 46, 106, 62, 109, 83, 113, 106, 146, 118, 146, 150, 160, 150, 104, 86, 102, 108];
const dipUnten = [108, 66, 107, 82, 109.5, 103, 112, 124, 146, 118, 146, 150, 160, 150, 87, 96.5, 102, 108];
const baerA = [180, 108, 164, 108, 137, 107, 110, 108, 113, 141, 80, 143, 84, 150, 164, 129, 164, 150];
const baerB = [182, 108, 166, 108, 139, 107, 112, 108, 115, 141, 80, 143, 84, 150, 165, 129, 164, 150];
const rollA = X(S, { l2: [142, 110, 133, 141, 147, 141] });
const rollB = X(S, { l2: [143.5, 108.5, 143, 141, 157, 141] });
const kindA = [141, 140, 126, 132, 105, 127, 84, 124, 108, 146, 74, 146, 62, 150, 148, 144, 170, 147];
const kindB = [141, 140, 126, 130.5, 105, 124.5, 84, 124, 108, 146, 74, 146, 62, 150, 148, 144, 170, 147];
const beuge = [146, 134, 140, 119, 128, 102, 114, 86, 118, 118, 118, 150, 132, 150, 141, 138, 143, 150];
const wand = (x) => ['box', x, -8, -36, x + 3.5, 150, 36];

export const UEBUNGEN = {
  'wandsitzen': { n: 'Wandsitzen', m: 'kraft', h: ['quad'], nb: ['gesaess'], eq: 'Wand', lv: 1, min: 3, dos: { typ: 'zeit', sek: 30, s: 3 },
    st: ['Rücken flach an die Wand, Füße etwa zwei Fußlängen davor.', 'An der Wand heruntergleiten, bis Knie und Hüfte ungefähr im rechten Winkel sind.', 'Halten und ruhig weiteratmen. Die Knie bleiben über den Fersen.'],
    f: ['Hände nicht auf den Oberschenkeln abstützen.', 'Knie nicht nach innen fallen lassen.'], le: 'Höher sitzen, Kniewinkel größer als 90°.', sw: 'Ein Bein leicht anheben.',
    an: { d: 6, p: [wand(86.5)], a: [3, 4], k: [[0, wandStand], [0.25, sitz], [0.85, sitz], [1, wandStand]] } },
  'kniebeuge': { n: 'Langsame Kniebeuge', m: 'kraft', h: ['quad', 'gesaess'], nb: ['hams', 'uruecken'], eq: 'Ohne Geräte', lv: 1, min: 4, dos: { typ: 'wdh', n: 12, s: 3 },
    st: ['Füße etwas weiter als hüftbreit, Zehen leicht nach außen.', '3 Sekunden absenken, als würdest du dich auf einen Stuhl setzen.', '1 Sekunde unten halten, dann 3 Sekunden hochdrücken.'],
    f: ['Die Fersen bleiben am Boden.', 'Die Knie zeigen in Richtung der Zehen.'], le: 'Auf einen Stuhl setzen und wieder aufstehen.', sw: 'In der letzten Wiederholung 10 Sekunden unten halten.',
    an: { d: 7, a: [3, 4], k: [[0, S], [0.43, hocke], [0.57, hocke], [1, S]] } },
  'glute-bridge': { n: 'Glute Bridge', m: 'kraft', h: ['gesaess'], nb: ['hams', 'uruecken'], eq: 'Matte', lv: 1, min: 3, dos: { typ: 'wdh', n: 15, s: 3 },
    st: ['Rückenlage, Knie angewinkelt, Füße hüftbreit aufstellen.', 'Gesäß anspannen und Becken anheben, bis Knie, Hüfte und Schultern eine Linie bilden.', 'Kurz halten, dann langsam absenken.'],
    f: ['Nicht ins Hohlkreuz drücken.', 'Knie nicht nach innen fallen lassen.'], le: 'Kleinerer Bewegungsumfang.', sw: 'Einbeinig ausführen.',
    an: { d: 3.5, a: [2, 3, 4], k: [[0, liegt], [0.4, bruecke], [0.6, bruecke], [1, liegt]] } },
  'unterarmstuetz': { n: 'Unterarmstütz', m: 'kraft', h: ['bauch'], nb: ['seitbauch', 'schultern'], eq: 'Matte', lv: 1, min: 3, dos: { typ: 'zeit', sek: 30, s: 3 },
    st: ['Unterarme auf den Boden, Ellbogen unter den Schultern.', 'Beine strecken. Der Körper bildet eine Linie von Kopf bis Ferse.', 'Bauch und Gesäß anspannen, ruhig atmen.'],
    f: ['Hüfte nicht durchhängen lassen.', 'Gesäß nicht nach oben schieben.'], le: 'Knie ablegen.', sw: 'Abwechselnd ein Bein abheben.',
    an: { d: 4, a: [1, 2, 3], k: [[0, brettA], [0.5, brettB], [1, brettA]] } },
  'liegestuetz': { n: 'Liegestütz', m: 'kraft', h: ['brust', 'trizeps'], nb: ['schultern', 'bauch'], eq: 'Ohne Geräte', lv: 2, min: 4, dos: { typ: 'wdh', n: 8, s: 3 },
    st: ['Hände etwas weiter als schulterbreit, Körper in einer Linie.', 'Ellbogen beugen und die Brust Richtung Boden senken. Die Ellbogen zeigen schräg nach hinten.', 'Kraftvoll hochdrücken, der Rumpf bleibt fest.'],
    f: ['Kein Hohlkreuz, der Bauch bleibt angespannt.', 'Der Kopf bleibt in Verlängerung der Wirbelsäule.'], le: 'Hände an die Wand oder Knie ablegen.', sw: 'Füße erhöht ablegen.',
    an: { d: 3, a: [1, 7, 8], k: [[0, stuetzOben], [0.45, stuetzUnten], [0.55, stuetzUnten], [1, stuetzOben]] } },
  'wadenheben': { n: 'Wadenheben', m: 'kraft', h: ['waden'], nb: [], eq: 'Ohne Geräte', lv: 1, min: 3, dos: { typ: 'wdh', n: 15, s: 3 },
    st: ['Hüftbreit stehen, bei Bedarf an der Wand festhalten.', 'Langsam auf die Zehenspitzen heben, oben kurz halten.', 'Langsam absenken. Die Fersen berühren den Boden nur leicht.'],
    f: ['Nicht wippen, das Tempo bleibt ruhig.', 'Die Knöchel nicht nach außen kippen.'], le: 'Mit beiden Händen an der Wand abstützen.', sw: 'Einbeinig auf einer Stufe.',
    an: { d: 3, a: [4, 5], k: [[0, S], [0.4, zehen], [0.6, zehen], [1, S]] } },
  'superman': { n: 'Rückenstrecken in Bauchlage', m: 'kraft', h: ['uruecken'], nb: ['gesaess', 'oruecken'], eq: 'Matte', lv: 1, min: 3, dos: { typ: 'wdh', n: 10, s: 3 },
    st: ['Bauchlage, Arme nach vorn gestreckt, Blick zum Boden.', 'Arme, Brust und Beine wenige Zentimeter anheben.', 'Kurz halten, dann langsam ablegen.'],
    f: ['Den Nacken lang lassen und nicht nach vorn schauen.', 'Klein und kontrolliert bewegen, ohne Schwung.'], le: 'Nur die Arme heben.', sw: 'Oben 3 Sekunden halten.',
    an: { d: 3.5, a: [1, 2, 3], k: [[0, bauchlage], [0.4, superman], [0.6, superman], [1, bauchlage]] } },
  'einbeinstand': { n: 'Einbeinstand', m: 'kraft', h: ['schienbein', 'waden'], nb: ['gesaess'], eq: 'Ohne Geräte', lv: 1, min: 2, dos: { typ: 'zeit', sek: 30, s: 2 }, seiten: true,
    st: ['Aufrecht stehen und den Blick auf einen festen Punkt richten.', 'Ein Knie anheben, bis der Oberschenkel etwa waagerecht ist.', '30 Sekunden ruhig halten, dann das Bein wechseln.'],
    f: ['Die Hüfte bleibt gerade und kippt nicht zur Seite.', 'Das Standbein ist leicht gebeugt, nicht durchgedrückt.'], le: 'Mit einer Hand an der Wand abstützen.', sw: 'Die Augen schließen oder auf ein Kissen stellen.',
    an: { d: 4, as: 1, a: [4, 5, 6], k: [[0, einA], [0.5, einB], [1, einA]] } },
  'dead-bug': { n: 'Dead Bug', m: 'kraft', h: ['bauch'], nb: ['seitbauch', 'hueftbeuger'], eq: 'Matte', lv: 1, min: 3, dos: { typ: 'wdh', n: 10, s: 2 },
    st: ['Rückenlage: Arme senkrecht nach oben, Knie und Hüfte im rechten Winkel.', 'Einen Arm nach hinten und das gegenüberliegende Bein nach vorn absenken, ohne den Boden zu berühren.', 'Zurück zur Mitte und die Seite wechseln.'],
    f: ['Der untere Rücken bleibt am Boden.', 'Langsam bewegen und dabei ausatmen.'], le: 'Nur die Beine bewegen.', sw: 'Arme und Beine ganz strecken.',
    an: { d: 8, a: [1, 2, 3], k: [[0, kaeferN], [0.2, kaeferL], [0.3, kaeferL], [0.5, kaeferN], [0.7, kaeferR], [0.8, kaeferR], [1, kaeferN]] } },
  'bird-dog': { n: 'Bird Dog', m: 'kraft', h: ['uruecken'], nb: ['gesaess', 'schultern', 'bauch'], eq: 'Matte', lv: 1, min: 3, dos: { typ: 'wdh', n: 10, s: 2 },
    st: ['Vierfüßlerstand: Hände unter den Schultern, Knie unter der Hüfte.', 'Einen Arm nach vorn und das gegenüberliegende Bein nach hinten strecken.', 'Kurz halten, absetzen und die Seite wechseln.'],
    f: ['Das Becken bleibt waagerecht und dreht nicht auf.', 'Der Blick geht zum Boden, der Nacken bleibt lang.'], le: 'Nur den Arm oder nur das Bein heben.', sw: 'Ellbogen und Knie unter dem Bauch zusammenführen.',
    an: { d: 8, a: [1, 2, 3], k: [[0, vogelN], [0.2, vogelL], [0.35, vogelL], [0.5, vogelN], [0.7, vogelR], [0.85, vogelR], [1, vogelN]] } },
  'seitstuetz': { n: 'Seitstütz', m: 'kraft', h: ['seitbauch'], nb: ['schultern', 'gesaess'], eq: 'Matte', lv: 2, min: 2, dos: { typ: 'zeit', sek: 20, s: 2 }, seiten: true,
    st: ['Seitlage: Der Ellbogen liegt unter der Schulter, die Beine sind gestreckt.', 'Die Hüfte anheben, bis der Körper eine Linie bildet.', 'Halten, ruhig atmen, dann die Seite wechseln.'],
    f: ['Die Hüfte sinkt nicht ab.', 'Die Schulter bleibt weg vom Ohr.'], le: 'Die Knie ablegen.', sw: 'Das obere Bein anheben.',
    an: { d: 4, fl: 1, y: 0.3, a: [1, 2, 3], k: [[0, seitA], [0.5, seitB], [1, seitA]] } },
  'dips': { n: 'Trizeps-Dips am Stuhl', m: 'kraft', h: ['trizeps'], nb: ['schultern', 'brust'], eq: 'Stuhl', lv: 2, min: 3, dos: { typ: 'wdh', n: 8, s: 3 },
    st: ['Auf die Stuhlkante setzen und die Hände neben der Hüfte aufstützen.', 'Das Gesäß vor die Kante schieben und die Ellbogen nach hinten beugen.', 'Bis etwa 90° absenken und wieder hochdrücken.'],
    f: ['Der Rücken bleibt nah am Stuhl.', 'Die Schultern nicht zu den Ohren ziehen.'], le: 'Die Beine anwinkeln.', sw: 'Die Beine strecken.',
    an: { d: 3.5, p: [['box', 74, 111, -24, 104, 115, 24], ['box', 75, 115, -23, 78, 150, -20], ['box', 75, 115, 20, 78, 150, 23], ['box', 100, 115, -23, 103, 150, -20], ['box', 100, 115, 20, 103, 150, 23]], a: [1, 7, 8], k: [[0, dipOben], [0.45, dipUnten], [0.55, dipUnten], [1, dipOben]] } },
  'baerenstand': { n: 'Bärenstand', m: 'kraft', h: ['bauch', 'schultern'], nb: ['quad'], eq: 'Ohne Geräte', lv: 2, min: 2, dos: { typ: 'zeit', sek: 20, s: 3 },
    st: ['Vierfüßlerstand, die Zehen aufstellen.', 'Die Knie wenige Zentimeter vom Boden abheben.', 'Den Rücken flach halten und ruhig atmen.'],
    f: ['Die Knie schweben nur knapp über dem Boden.', 'Das Gesäß nicht nach oben schieben.'], le: 'Nur 10 Sekunden halten.', sw: 'Langsam vorwärts krabbeln.',
    an: { d: 4, a: [1, 2, 3], k: [[0, baerA], [0.5, baerB], [1, baerA]] } },
  'hueftbeuger-dehnung': { n: 'Hüftbeuger-Dehnung', m: 'dehn', h: ['hueftbeuger'], nb: ['quad'], eq: 'Matte', lv: 1, min: 3, dos: { typ: 'zeit', sek: 45, s: 2 }, seiten: true,
    st: ['Halber Kniestand: hinteres Knie am Boden, vorderer Fuß aufgestellt.', 'Becken aufrichten, Gesäß leicht anspannen und die Hüfte nach vorn schieben.', 'Die Dehnung vorn an der Hüfte des hinteren Beins halten, dann die Seite wechseln.'],
    f: ['Nicht ins Hohlkreuz fallen.', 'Das vordere Knie bleibt über dem Fuß.'], le: 'Kissen unters Knie legen und kürzer halten.', sw: 'Den Arm der Dehnseite nach oben strecken.',
    an: { d: 6, a: [3, 9], k: [[0, knieA], [0.35, knieB], [0.8, knieB], [1, knieA]] } },
  'wadendehnung': { n: 'Wadendehnung an der Wand', m: 'dehn', h: ['waden'], nb: [], eq: 'Wand', lv: 1, min: 2, dos: { typ: 'zeit', sek: 30, s: 2 }, seiten: true,
    st: ['Schrittstellung vor der Wand, die Hände stützen auf Schulterhöhe.', 'Das hintere Bein ist gestreckt, die Ferse bleibt fest am Boden.', 'Die Hüfte nach vorn schieben, bis es in der Wade zieht. Dann die Seite wechseln.'],
    f: ['Die hintere Ferse nicht abheben.', 'Beide Füße zeigen gerade nach vorn.'], le: 'Kleineren Schritt machen.', sw: 'Das hintere Knie leicht beugen. Das dehnt den tiefer liegenden Wadenmuskel.',
    an: { d: 6, p: [wand(180.5)], a: [9, 10], k: [[0, wadeA], [0.35, wadeB], [0.8, wadeB], [1, wadeA]] } },
  'brustdehnung': { n: 'Türrahmen-Brustdehnung', m: 'dehn', h: ['brust'], nb: ['schultern'], eq: 'Türrahmen', lv: 1, min: 2, dos: { typ: 'zeit', sek: 30, s: 2 }, seiten: true,
    st: ['Seitlich in den Türrahmen stellen und den Unterarm senkrecht an den Rahmen legen.', 'Der Ellbogen liegt etwa auf Schulterhöhe.', 'Einen kleinen Schritt nach vorn gehen und den Oberkörper leicht wegdrehen. Dann die Seite wechseln.'],
    f: ['Die Schulter nicht hochziehen.', 'Nicht ins Hohlkreuz ausweichen.'], le: 'Den Ellbogen etwas tiefer anlegen.', sw: 'Den Ellbogen höher anlegen und leicht vorlehnen.',
    an: { d: 6, as: 1, p: [['box', 90, -8, 13, 94, 150, 25]], a: [1, 7], k: [[0, tuerA], [0.35, tuerB], [0.8, tuerB], [1, tuerA]] } },
  'nacken-loesen': { n: 'Nacken lösen', m: 'dehn', h: ['nacken'], nb: [], eq: 'Ohne Geräte', lv: 1, min: 2, dos: { typ: 'zeit', sek: 20, s: 3 },
    st: ['Aufrecht stehen oder sitzen, die Schultern bleiben locker.', 'Das Kinn langsam Richtung Brust sinken lassen und halten.', 'Danach das Ohr erst zur rechten, dann zur linken Schulter neigen.'],
    f: ['Nicht am Kopf ziehen und nicht federn.', 'Die Schultern bleiben unten.'], le: 'Nur das Kinn zur Brust.', sw: 'Die Hand ganz leicht auf den Kopf legen, ohne zu ziehen.',
    an: { d: 6, a: [0, 1], k: [[0, S], [0.35, nick], [0.8, nick], [1, S]] } },
  'kindhaltung': { n: 'Kindhaltung', m: 'dehn', h: ['uruecken'], nb: ['oruecken', 'gesaess'], eq: 'Matte', lv: 1, min: 2, dos: { typ: 'zeit', sek: 60, s: 1 },
    st: ['Auf die Fersen setzen, die Knie etwa hüftbreit.', 'Den Oberkörper nach vorn auf die Oberschenkel sinken lassen.', 'Die Arme nach vorn ausstrecken, die Stirn ablegen und ruhig atmen.'],
    f: ['Das Gesäß bleibt Richtung Fersen.', 'In den unteren Rücken atmen.'], le: 'Ein Kissen zwischen Gesäß und Fersen legen.', sw: 'Die Arme weit nach vorn wandern lassen.',
    an: { d: 6, a: [1, 2, 3], k: [[0, kindA], [0.5, kindB], [1, kindA]] } },
  'vorbeuge': { n: 'Vorbeuge im Stehen', m: 'dehn', h: ['hams'], nb: ['waden', 'uruecken'], eq: 'Ohne Geräte', lv: 1, min: 2, dos: { typ: 'zeit', sek: 30, s: 2 },
    st: ['Hüftbreit stehen, die Knie minimal gebeugt.', 'Aus der Hüfte nach vorn beugen, der Rücken bleibt zunächst lang.', 'Kopf und Arme hängen lassen und die Dehnung an der Oberschenkelrückseite halten.'],
    f: ['Nicht federn.', 'Langsam Wirbel für Wirbel wieder aufrichten.'], le: 'Die Hände auf den Oberschenkeln abstützen.', sw: 'Die Beine weiter strecken.',
    an: { d: 7, a: [3, 4], k: [[0, S], [0.35, beuge], [0.8, beuge], [1, S]] } },
  'katze-kuh': { n: 'Katze-Kuh', m: 'mobil', h: ['uruecken', 'oruecken'], nb: ['bauch'], eq: 'Matte', lv: 1, min: 3, dos: { typ: 'wdh', n: 10, s: 2 },
    st: ['Vierfüßlerstand: Hände unter den Schultern, Knie unter der Hüfte.', 'Ausatmen: den Rücken rund machen, das Kinn zur Brust (Katze).', 'Einatmen: das Brustbein nach vorn schieben und den Rücken sanft durchhängen lassen (Kuh).'],
    f: ['Langsam im Atemrhythmus bewegen.', 'Im unteren Rücken nicht ins Extrem drücken.'], le: 'Kleinerer Bewegungsumfang.', sw: 'Je 4 Sekunden ein- und ausatmen.',
    an: { d: 6, a: [1, 2, 3], k: [[0, kuh], [0.5, katze], [1, kuh]] } },
  'schulterkreisen': { n: 'Schulterkreisen', m: 'mobil', h: ['schultern'], nb: ['oruecken', 'nacken'], eq: 'Ohne Geräte', lv: 1, min: 2, dos: { typ: 'wdh', n: 10, s: 2 },
    st: ['Aufrecht stehen, die Arme locker hängen lassen.', 'Die gestreckten Arme in großen Kreisen nach vorn, oben und hinten führen.', '10 Kreise, dann die Richtung wechseln.'],
    f: ['Der Rumpf bleibt ruhig, nur die Arme bewegen sich.', 'Die Kreise so groß machen, wie es schmerzfrei geht.'], le: 'Kleinere Kreise mit gebeugten Armen.', sw: 'Ein Handtuch mit beiden Händen breit greifen und gestreckt über den Kopf führen.',
    an: { d: 4, lin: true, a: [1, 7, 8], k: [[0, arm(120, 68, 120, 90)], [0.125, arm(137, 61, 152.5, 76.5)], [0.25, arm(144, 44, 166, 44)], [0.375, arm(137, 27, 152.5, 11.5)], [0.5, arm(120, 20, 120, -2)], [0.625, arm(103, 27, 87.5, 11.5)], [0.75, arm(96, 44, 74, 44)], [0.875, arm(103, 61, 87.5, 76.5)], [1, arm(120, 68, 120, 90)]] } },
  'wand-engel': { n: 'Wand-Engel', m: 'mobil', h: ['oruecken', 'schultern'], nb: ['nacken'], eq: 'Wand', lv: 1, min: 2, dos: { typ: 'wdh', n: 10, s: 2 },
    st: ['Mit dem Rücken an die Wand stellen, die Füße eine Fußlänge davor.', 'Die Arme im rechten Winkel an die Wand legen, wie ein „W“.', 'Die Arme an der Wand nach oben schieben und langsam zurückführen.'],
    f: ['Der untere Rücken bleibt nah an der Wand.', 'Die Schultern nicht hochziehen.'], le: 'Kleinerer Bewegungsradius.', sw: 'Langsamer bewegen, die Handrücken bleiben an der Wand.',
    an: { d: 5, y: -1.05, p: [wand(86.5)], a: [1, 7, 8], k: [[0, engelW], [0.45, engelY], [0.55, engelY], [1, engelW]] } },
  'box-atmung': { n: 'Box-Atmung 4-4-4-4', m: 'reco', h: ['bauch'], nb: [], eq: 'Ohne Geräte', lv: 1, min: 3, dos: { typ: 'zeit', sek: 180, s: 1 },
    st: ['Bequem hinlegen oder hinsetzen, eine Hand auf den Bauch legen.', '4 Sekunden einatmen, dann 4 Sekunden halten.', '4 Sekunden ausatmen, dann 4 Sekunden halten. Wiederholen.'],
    f: ['Die Schultern bleiben locker.', 'Bei Schwindel normal weiteratmen.'], le: 'Nur 2 Minuten.', sw: '5 Minuten.',
    an: { d: 16, a: [1, 2], k: [[0, liegt], [0.25, atemB], [0.5, atemB], [0.75, liegt], [1, liegt]] } },
  'beine-hoch': { n: 'Beine an die Wand', m: 'reco', h: ['waden', 'hams'], nb: [], eq: 'Wand', lv: 1, min: 3, dos: { typ: 'zeit', sek: 180, s: 1 },
    st: ['Seitlich an die Wand setzen und in die Rückenlage drehen.', 'Die Beine senkrecht an die Wand lehnen, das Gesäß liegt nah an der Wand.', 'Die Arme locker ablegen und ruhig atmen.'],
    f: ['Die Knie dürfen leicht gebeugt bleiben.', 'Bei Kribbeln in den Füßen kurz pausieren.'], le: 'Die Unterschenkel auf einen Stuhl legen.', sw: '5 Minuten liegen bleiben.',
    an: { d: 6, y: 0.5, p: [wand(151)], a: [4, 5], k: [[0, hochA], [0.5, hochB], [1, hochA]] } },
  'fussrolle': { n: 'Fußsohle ausrollen', m: 'reco', h: ['waden'], nb: ['schienbein'], eq: 'Tennisball', lv: 1, min: 2, dos: { typ: 'zeit', sek: 60, s: 2 }, seiten: true,
    st: ['Aufrecht stehen und einen Fuß auf den Ball stellen.', 'Mit leichtem Druck langsam von der Ferse bis zum Ballen rollen.', 'Nach einer Minute den Fuß wechseln.'],
    f: ['Der Druck ist angenehm, nicht schmerzhaft.', 'Bei Bedarf an der Wand festhalten.'], le: 'Im Sitzen rollen.', sw: 'An empfindlichen Stellen kurz verweilen.',
    an: { d: 3, as: 1, p: [['ball', 140, 146, -8, 4]], a: [10, 11], k: [[0, rollA], [0.5, rollB], [1, rollA]] } }
};

export const LEVEL = ['', 'Einsteiger', 'Fortgeschritten', 'Profi'];

export const THEMEN = [
  { n: 'Nacken nach dem Bürotag', ids: ['nacken-loesen', 'schulterkreisen', 'brustdehnung', 'wand-engel'] },
  { n: 'Vor dem Laufen', ids: ['kniebeuge', 'wadenheben', 'einbeinstand', 'katze-kuh'] },
  { n: 'Nach dem Laufen', ids: ['wadendehnung', 'hueftbeuger-dehnung', 'vorbeuge', 'beine-hoch'] },
  { n: 'Rücken stärken', ids: ['superman', 'bird-dog', 'unterarmstuetz', 'glute-bridge'] },
  { n: 'Besser schlafen', ids: ['box-atmung', 'kindhaltung', 'beine-hoch'] },
  { n: 'Ohne Geräte', ids: Object.keys(UEBUNGEN).filter((id) => UEBUNGEN[id].eq === 'Ohne Geräte') }
];

export const ROUTINEN = [
  { n: 'Morgen-Mobility', ids: ['katze-kuh', 'schulterkreisen', 'kniebeuge', 'hueftbeuger-dehnung'] },
  { n: 'Büro-Pause', ids: ['nacken-loesen', 'brustdehnung', 'wand-engel', 'wandsitzen'] },
  { n: 'Rumpf stark', ids: ['dead-bug', 'bird-dog', 'unterarmstuetz', 'seitstuetz'] },
  { n: 'Abend-Recovery', ids: ['wadendehnung', 'kindhaltung', 'beine-hoch', 'box-atmung'] }
];

// Übungen einer Trainingsart, die einen Muskel als Haupt- oder Nebenmuskel nutzen
export const liste = (mid, modus) => Object.keys(UEBUNGEN).filter((id) => UEBUNGEN[id].m === modus && (UEBUNGEN[id].h.includes(mid) || UEBUNGEN[id].nb.includes(mid)));
export const modusName = (id) => (MODI.find((m) => m.id === id) || {}).n || '';
