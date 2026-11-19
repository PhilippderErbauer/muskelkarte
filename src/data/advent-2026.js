// Muskelkarte · Adventskalender 2026
//
// Ein Türchen:
//   titel, text (die Challenge), uebung (Bibliotheksübung für Animation und Anleitung),
//   ziel (Zielmuskel), warum, leichter, schwerer, bonus (erscheint nach dem Abhaken),
//   test ({ n, einheit, kurz } an den Test-Tagen), kombi (mehrere Übungen nacheinander),
//   ablauf: was „Challenge starten“ abspielt. Je Eintrag:
//     id Übung, saetze, n Wiederholungen ODER sek Sekunden, auf = Stoppuhr (zählt hoch),
//     max = so viele wie möglich, key = wo das Ergebnis gespeichert wird, pause = Pause danach
//
// Für ein neues Jahr: Datei kopieren, Inhalte ersetzen und in src/advent.js eintragen.

const t = (tag, titel, text, uebung, ziel, warum, leichter, schwerer, bonus, ablauf, extra) => Object.assign({ tag, titel, text, uebung, ziel, warum, leichter, schwerer, bonus, ablauf, test: null, kombi: false }, extra || {});
const zirkel = [{ id: 'kniebeuge', saetze: 1, n: 10, pause: 10 }, { id: 'liegestuetz', saetze: 1, n: 5, pause: 10 }, { id: 'unterarmstuetz', saetze: 1, sek: 20, pause: 30 }];

export const KALENDER_2026 = {
  jahr: 2026,
  bloecke: [
    { von: 1, bis: 6, n: 'Beine & Gesäß', kurz: 'Beine', region: 'beine' },
    { von: 7, bis: 12, n: 'Rumpf & Rücken', kurz: 'Rumpf', region: 'rumpf' },
    { von: 13, bis: 18, n: 'Oberkörper', kurz: 'Oberkörper', region: 'oberkoerper' },
    { von: 19, bis: 24, n: 'Ganzkörper & Finale', kurz: 'Finale', region: 'alle' }
  ],
  tueren: [
    t(1, 'Wie lange hältst du durch?', 'Wandsitzen, so lange wie möglich. Die Stoppuhr läuft mit und speichert deinen Startwert.', 'wandsitzen', 'Quadrizeps', 'Der Quadrizeps hat vier Köpfe und streckt das Knie, bei jedem Schritt und jeder Treppenstufe.', 'Höher sitzen, Kniewinkel größer als 90°.', 'Ein Bein leicht anheben.', 'Beim Halten arbeitet der Muskel isometrisch: Er spannt an, ohne sich zu bewegen. Zittern ist dabei völlig normal.',
      [{ id: 'wandsitzen', saetze: 1, auf: true, key: '1' }], { test: { n: 'Wandsitzen', einheit: 'Sekunden', kurz: 'Sek.' } }),
    t(2, 'Zeitlupe', '15 langsame Kniebeugen: 3 Sekunden runter, 1 halten, 3 hoch.', 'kniebeuge', 'Quadrizeps, Gesäß', 'Langsames Absenken, die exzentrische Phase, baut besonders wirksam Kraft und Kontrolle auf.', 'Auf einen Stuhl setzen und aufstehen.', 'Am Ende 10 Sekunden unten halten.', 'Muskelkater entsteht vor allem durch die bremsende Phase, also beim Absenken und nicht beim Hochkommen.',
      [{ id: 'kniebeuge', saetze: 1, n: 15 }]),
    t(3, 'Blindflug', '30 Sekunden Einbeinstand mit geschlossenen Augen, je Seite.', 'einbeinstand', 'Fuß- und Unterschenkelmuskeln', 'Gleichgewicht kommt nicht nur aus dem Ohr: Sensoren in Gelenken und Muskeln melden ständig deine Position.', 'Augen offen lassen.', 'Auf einem Kissen stehen.', 'Im Fuß stecken 26 Knochen und rund 33 Gelenke.',
      [{ id: 'einbeinstand', saetze: 2, sek: 30, pauseSatz: 5 }]),
    t(4, 'Weck den Riesen', 'Glute Bridge: 20 Wiederholungen, danach 20 Sekunden oben halten.', 'glute-bridge', 'Großer Gesäßmuskel', 'Der große Gesäßmuskel ist nach Volumen der größte Muskel des Körpers und beim langen Sitzen oft „eingeschlafen“.', '10 Wiederholungen.', 'Einbeinig ausführen.', 'Zum Gesäß gehören drei Muskeln. Der mittlere hält dein Becken bei jedem Schritt waagerecht.',
      [{ id: 'glute-bridge', saetze: 1, n: 20, pause: 0 }, { id: 'glute-bridge', saetze: 1, sek: 20, hinweis: 'Becken oben halten, Gesäß fest anspannen' }]),
    t(5, 'Gegen das Sitzen', 'Hüftbeuger-Dehnung im Kniestand, 2 × 45 Sekunden je Seite.', 'hueftbeuger-dehnung', 'Iliopsoas', 'Der Hüftbeuger verbindet Wirbelsäule und Oberschenkel. Viel Sitzen hält ihn dauerhaft verkürzt.', 'Kissen unters Knie, kürzer halten.', 'Arm der Dehnseite nach oben strecken.', 'Der Psoas ist der einzige Muskel, der die Wirbelsäule direkt mit dem Bein verbindet.',
      [{ id: 'hueftbeuger-dehnung', saetze: 4, sek: 45, pauseSatz: 5 }]),
    t(6, 'Auf Zehenspitzen', '25 langsame Wadenheben, danach die Wadendehnung an der Wand.', 'wadenheben', 'Wadenmuskulatur', 'Die Achillessehne ist die stärkste Sehne des Körpers. Mit diesem Türchen ist die erste Woche geschafft.', 'An der Wand festhalten.', 'Einbeinig auf einer Stufe.', 'Die Waden arbeiten als Muskelpumpe: Bei jedem Schritt drücken sie Blut aus den Beinvenen zurück Richtung Herz.',
      [{ id: 'wadenheben', saetze: 1, n: 25 }, { id: 'wadendehnung', saetze: 2, sek: 30, pauseSatz: 5 }]),
    t(7, 'Das Brett', 'Unterarmstütz, so lange wie möglich. Die Stoppuhr läuft mit und speichert deinen Startwert.', 'unterarmstuetz', 'Tiefe Bauchmuskeln', 'Der quere Bauchmuskel wirkt wie ein natürlicher Gürtel und stabilisiert die Wirbelsäule.', 'Auf den Knien.', 'Ein Bein abheben.', 'Der quere Bauchmuskel spannt sich schon an, kurz bevor du einen Arm oder ein Bein bewegst.',
      [{ id: 'unterarmstuetz', saetze: 1, auf: true, key: '7' }], { test: { n: 'Unterarmstütz', einheit: 'Sekunden', kurz: 'Sek.' } }),
    t(8, 'Käfer auf dem Rücken', 'Dead Bug: 2 × 10, ganz langsam.', 'dead-bug', 'Tiefe Bauchmuskeln', 'Bei dieser Übung bleibt der untere Rücken am Boden. So trainierst du Stabilität ohne Belastung.', 'Nur die Beine bewegen.', 'Mit gestreckten Beinen.', 'Die Bauchmuskeln liegen in mehreren Schichten übereinander, mit Fasern in verschiedene Richtungen, ähnlich wie Sperrholz.',
      [{ id: 'dead-bug', saetze: 2, n: 10 }]),
    t(9, 'Über Kreuz', 'Bird Dog: 1 Minute im Wechsel.', 'bird-dog', 'Rückenstrecker', 'Gegengleiche Bewegungen trainieren die Zusammenarbeit beider Körperhälften.', 'Nur Arm oder nur Bein heben.', 'Ellbogen und Knie unter dem Bauch zusammenführen.', 'Beim Gehen schwingt der rechte Arm mit dem linken Bein. Genau dieses Kreuzmuster trainierst du hier.',
      [{ id: 'bird-dog', saetze: 1, sek: 60 }]),
    t(10, 'Seitenlage', 'Seitstütz: 2 × 20 Sekunden je Seite.', 'seitstuetz', 'Schräge Bauchmuskeln', 'Die schrägen Bauchmuskeln drehen und neigen den Rumpf, zum Beispiel beim Werfen oder beim Schulterblick.', 'Auf den Knien.', 'Oberes Bein anheben.', 'Die Fasern der äußeren schrägen Bauchmuskeln verlaufen so, als würdest du die Hände in die Hosentaschen stecken.',
      [{ id: 'seitstuetz', saetze: 4, sek: 20, pauseSatz: 10 }]),
    t(11, 'Abheben', 'Rückenstrecken in Bauchlage: 3 × 10.', 'superman', 'Rückenstrecker', 'Der Rückenstrecker hält uns den ganzen Tag aufrecht, meist ohne dass wir es merken.', 'Nur die Arme heben.', 'Oben 3 Sekunden halten.', 'Der Rückenstrecker ist ein ganzes Bündel von Muskelsträngen vom Becken bis zum Kopf.',
      [{ id: 'superman', saetze: 3, n: 10 }]),
    t(12, 'Durchatmen', 'Katze-Kuh und Kindhaltung, zusammen 3 Minuten.', 'katze-kuh', 'Wirbelsäule', 'Bewegung hält die Bandscheiben versorgt. Mit diesem Türchen ist die zweite Woche geschafft.', 'Kürzer üben.', 'Im Atemrhythmus: 4 Sekunden ein, 4 Sekunden aus.', 'Bandscheiben haben keine eigenen Blutgefäße. Sie werden durch Be- und Entlastung versorgt, ähnlich wie ein Schwamm.',
      [{ id: 'katze-kuh', saetze: 1, sek: 90, pause: 5 }, { id: 'kindhaltung', saetze: 1, sek: 90 }]),
    t(13, 'Wie viele schaffst du?', 'So viele Liegestütze wie möglich. Zähl mit: Das ist dein Startwert.', 'liegestuetz', 'Brust, Trizeps', 'Liegestütze trainieren Brust, Schultern, Arme und Rumpf gleichzeitig.', 'An der Wand oder auf den Knien.', 'Füße erhöht ablegen.', 'Bei einem Liegestütz stemmst du rund zwei Drittel deines Körpergewichts.',
      [{ id: 'liegestuetz', saetze: 1, max: true, key: '13' }], { test: { n: 'Liegestütze', einheit: 'Wiederholungen', kurz: 'Wdh.' } }),
    t(14, 'Große Kreise', 'Schulterkreisen, 2 × 10. Wer mag, greift dabei ein Handtuch.', 'schulterkreisen', 'Rotatorenmanschette', 'Die Schulter ist das beweglichste Gelenk des Körpers und braucht deshalb besonders viel Muskelführung.', 'Kleinere Kreise.', 'Langsamer, mit Pause oben.', 'Die Gelenkpfanne der Schulter ist viel kleiner als der Oberarmkopf, etwa wie ein Golfball auf dem Tee.',
      [{ id: 'schulterkreisen', saetze: 2, n: 10 }]),
    t(15, 'Tür auf', 'Türrahmen-Brustdehnung, 2 × 30 Sekunden je Seite.', 'brustdehnung', 'Großer Brustmuskel', 'Viel Handy- und Laptopzeit zieht die Schultern nach vorn. Diese Dehnung wirkt dagegen.', 'Arm tiefer anlegen.', 'Arm höher anlegen und leicht vorlehnen.', 'Der große Brustmuskel setzt am Oberarm an. Deshalb bewegt er den Arm und nicht die Brust.',
      [{ id: 'brustdehnung', saetze: 4, sek: 30, pauseSatz: 5 }]),
    t(16, 'Engel an der Wand', 'Wand-Engel: 2 × 10.', 'wand-engel', 'Unterer Trapezmuskel', 'Der untere Trapezmuskel zieht die Schulterblätter nach unten und sorgt für eine aufrechte Haltung.', 'Kleinerer Bewegungsradius.', 'Langsamer, der Rücken bleibt komplett an der Wand.', 'Das Schulterblatt ist nur über das Schlüsselbein knöchern mit dem Rumpf verbunden. Sonst halten es allein Muskeln.',
      [{ id: 'wand-engel', saetze: 2, n: 10 }]),
    t(17, 'Stuhlkraft', 'Trizeps-Dips am Stuhl: 3 × 8.', 'dips', 'Trizeps', 'Der Trizeps macht rund zwei Drittel der Muskelmasse am Oberarm aus, nicht der Bizeps.', 'Beine angewinkelt.', 'Beine gestreckt.', 'Trizeps heißt „dreiköpfig“: drei Muskelköpfe, eine gemeinsame Sehne am Ellbogen.',
      [{ id: 'dips', saetze: 3, n: 8 }]),
    t(18, 'Kopf frei', 'Nacken mobilisieren und dehnen, 3 Minuten.', 'nacken-loesen', 'Trapezius, Schulterblattheber', 'Der Kopf wiegt etwa 5 kg. Je weiter er nach vorn rutscht, desto mehr muss der Nacken halten. Mit diesem Türchen ist die dritte Woche geschafft.', 'Nur den Kopf neigen.', 'Mit ganz leichtem Zug der Hand.', 'Beim Blick aufs Handy wirkt rechnerisch ein Vielfaches des Kopfgewichts auf die Halswirbelsäule.',
      [{ id: 'nacken-loesen', saetze: 3, sek: 60, pauseSatz: 5 }]),
    t(19, 'Generalprobe', 'Ganzkörper-Zirkel, 3 Runden: 10 Kniebeugen, 5 Liegestütze, 20 Sekunden Stütz.', 'kniebeuge', 'Ganzkörper', 'Der Zirkel kombiniert alles aus den letzten Wochen.', '2 Runden.', '4 Runden.', 'Muskeln werden nicht während des Trainings stärker, sondern in der Erholung danach.',
      zirkel.concat(zirkel, zirkel), { kombi: true }),
    t(20, 'Vier mal vier', 'Box-Atmung 4-4-4-4, 3 Minuten.', 'box-atmung', 'Zwerchfell', 'Das Zwerchfell ist unser wichtigster Atemmuskel. Ruhiges Atmen senkt nachweislich die Anspannung.', '2 Minuten.', '5 Minuten.', 'Du atmest rund 20.000 Mal am Tag, meistens ganz ohne darüber nachzudenken.',
      [{ id: 'box-atmung', saetze: 1, sek: 180 }]),
    t(21, 'Rollkur', 'Fußsohle mit einem Tennisball ausrollen, je Fuß eine Minute. Wer eine Rolle hat, nimmt die Oberschenkel dazu.', 'fussrolle', 'Fuß, Oberschenkel', 'Sanfter Druck fördert die Durchblutung und fühlt sich nach Belastung einfach gut an.', 'Nur die Fußsohle.', 'Waden und Gesäß dazunehmen.', 'Faszien sind Bindegewebshüllen, die jeden Muskel umgeben und mit seinen Nachbarn verbinden.',
      [{ id: 'fussrolle', saetze: 2, sek: 60, pauseSatz: 5 }]),
    t(22, 'Bärenstark', 'Bärenstand: 3 × 20 Sekunden. Die Knie schweben knapp über dem Boden.', 'baerenstand', 'Ganzkörper, Koordination', 'Der Bärenstand trainiert Schultern, Rumpf und Beine gleichzeitig und fordert die Koordination.', '10 Sekunden halten.', 'Langsam vorwärts krabbeln.', 'Krabbeln ist die erste Fortbewegung, bei der Arme und Beine über Kreuz zusammenarbeiten.',
      [{ id: 'baerenstand', saetze: 3, sek: 20 }]),
    t(23, 'Feiertagsroutine', '5 Minuten Dehnen für den ganzen Körper: Nacken, Brust, Hüfte, Beine, Rücken.', 'nacken-loesen', 'Ganzkörper', 'Perfekt nach langem Sitzen am Festtagstisch.', '3 Minuten.', '10 Minuten.', 'Wer regelmäßig dehnt, wird beweglicher, vor allem weil das Nervensystem mehr Bewegung zulässt.',
      ['nacken-loesen', 'brustdehnung', 'hueftbeuger-dehnung', 'vorbeuge', 'kindhaltung'].map((id) => ({ id, saetze: 1, sek: 60, pause: 5 })), { kombi: true }),
    t(24, 'Das Finale', 'Der Re-Test: Wandsitzen, Unterarmstütz und Liegestütze, genau wie an Tag 1, 7 und 13.', 'wandsitzen', 'Ganzkörper', 'Heute siehst du, was 24 Tage gebracht haben. Vergleiche deine Ergebnisse mit den Startwerten.', '', '', 'In 24 Tagen hast du jede große Muskelgruppe deines Körpers trainiert. Frohe Weihnachten!',
      [{ id: 'wandsitzen', saetze: 1, auf: true, key: 'r1', pause: 60 }, { id: 'unterarmstuetz', saetze: 1, auf: true, key: 'r7', pause: 60 }, { id: 'liegestuetz', saetze: 1, max: true, key: 'r13' }], { kombi: true })
  ],
  // Die drei Tests, die an Tag 24 wiederholt werden
  tests: [{ tag: 1, retest: 'r1' }, { tag: 7, retest: 'r7' }, { tag: 13, retest: 'r13' }]
};
