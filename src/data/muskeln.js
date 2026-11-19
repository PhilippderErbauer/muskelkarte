// Muskelkarte · Trainingsarten und Muskelgruppen
// Die Schlüssel der Muskelgruppen passen zu MID und REGELN in src/three/figur.js.
// g = Gegenspieler (wird im Muskel-Panel als „gehört mittrainiert“ angezeigt)

export const MODI = [
  { id: 'kraft', n: 'Kräftigen' },
  { id: 'dehn', n: 'Dehnen' },
  { id: 'mobil', n: 'Mobilität' },
  { id: 'reco', n: 'Recovery' }
];

export const MUSKELN = {
  nacken: { n: 'Nacken', f: 'Trapezius (oberer Teil), Schulterblattheber', w: 'Hält und bewegt den Kopf und zieht die Schultern nach oben, z. B. beim Schulterblick oder Tragen.', k: 'Der Kopf wiegt etwa 5 kg. Je weiter er nach vorn rutscht, desto mehr muss der Nacken halten.' },
  schultern: { n: 'Schultern', f: 'Deltamuskel (M. deltoideus)', w: 'Hebt den Arm nach vorn, zur Seite und nach hinten, bei jedem Griff über Schulterhöhe.', k: 'Die Schulter ist das beweglichste Gelenk des Körpers und wird fast nur von Muskeln geführt.' },
  brust: { n: 'Brust', f: 'Großer Brustmuskel (M. pectoralis major)', g: 'oruecken', w: 'Zieht den Arm vor den Körper, z. B. beim Drücken, Schieben und Umarmen.', k: 'Der Brustmuskel setzt am Oberarm an. Deshalb bewegt er den Arm und nicht den Brustkorb.' },
  bizeps: { n: 'Bizeps', f: 'M. biceps brachii', g: 'trizeps', w: 'Beugt den Ellbogen und dreht den Unterarm nach außen, z. B. beim Tragen und Schrauben.', k: 'Der Bizeps hat zwei Köpfe, daher das „Bi“ im Namen.' },
  trizeps: { n: 'Trizeps', f: 'M. triceps brachii', g: 'bizeps', w: 'Streckt den Ellbogen, z. B. beim Abstützen, Drücken und Aufstehen aus dem Sessel.', k: 'Der Trizeps macht rund zwei Drittel der Muskelmasse am Oberarm aus, nicht der Bizeps.' },
  unterarme: { n: 'Unterarme', f: 'Hand- und Fingerbeuger und -strecker', w: 'Bewegen Handgelenk und Finger und sorgen für Griffkraft.', k: 'Die Muskeln, die deine Finger kräftig beugen und strecken, sitzen im Unterarm. In den Fingern selbst liegen nur Sehnen.' },
  bauch: { n: 'Bauch', f: 'Gerader Bauchmuskel (M. rectus abdominis)', g: 'uruecken', w: 'Beugt den Rumpf und hält Becken und Brustkorb zusammen, z. B. beim Aufrichten aus dem Liegen.', k: 'Das „Sixpack“ ist ein einziges Muskelpaar, das durch Zwischensehnen unterteilt ist.' },
  seitbauch: { n: 'Seitlicher Bauch', f: 'Schräge Bauchmuskeln (Mm. obliqui)', w: 'Dreht und neigt den Rumpf, z. B. beim Werfen oder beim Schulterblick.', k: 'Die Fasern der äußeren schrägen Bauchmuskeln verlaufen so, als würdest du die Hände in die Hosentaschen stecken.' },
  oruecken: { n: 'Oberer Rücken', f: 'Trapezius, Rautenmuskeln, Latissimus', g: 'brust', w: 'Zieht die Schulterblätter zusammen und die Arme zum Körper, z. B. beim Ziehen und Rudern.', k: 'Der Latissimus ist der flächenmäßig größte Muskel des Körpers.' },
  uruecken: { n: 'Unterer Rücken', f: 'Rückenstrecker (M. erector spinae)', g: 'bauch', w: 'Richtet die Wirbelsäule auf und hält dich den ganzen Tag aufrecht.', k: 'Der Rückenstrecker ist kein einzelner Muskel, sondern ein Bündel von Strängen vom Becken bis zum Kopf.' },
  gesaess: { n: 'Gesäß', f: 'Großer Gesäßmuskel (M. gluteus maximus)', g: 'hueftbeuger', w: 'Streckt die Hüfte, z. B. beim Aufstehen, Treppensteigen und Sprinten.', k: 'Nach Volumen der größte Muskel des Körpers und nach langem Sitzen oft „eingeschlafen“.' },
  hueftbeuger: { n: 'Hüftbeuger', f: 'Lenden-Darmbeinmuskel (M. iliopsoas)', g: 'gesaess', w: 'Hebt das Bein und beugt die Hüfte, bei jedem Schritt und beim Treppensteigen.', k: 'Er verbindet die Lendenwirbelsäule direkt mit dem Oberschenkel. Viel Sitzen hält ihn dauerhaft verkürzt.' },
  quad: { n: 'Oberschenkel vorne', f: 'Quadrizeps (M. quadriceps femoris)', g: 'hams', w: 'Streckt das Knie, z. B. beim Treppensteigen, Aufstehen und Springen.', k: 'Besteht aus vier Köpfen, daher „Quadri“-zeps.' },
  hams: { n: 'Oberschenkel hinten', f: 'Ischiocrurale Muskulatur (Hamstrings)', g: 'quad', w: 'Beugt das Knie und streckt die Hüfte, z. B. beim Laufen und Bücken.', k: 'Die drei Muskeln entspringen am Sitzbein, also genau an dem Knochen, auf dem du sitzt.' },
  addu: { n: 'Adduktoren', f: 'Oberschenkel-Innenseite (Mm. adductores)', w: 'Ziehen das Bein zur Körpermitte und stabilisieren das Becken beim Gehen.', k: 'Zur Gruppe gehören fünf Muskeln an der Innenseite des Oberschenkels.' },
  waden: { n: 'Waden', f: 'Dreiköpfiger Wadenmuskel (M. triceps surae)', g: 'schienbein', w: 'Drückt den Fuß nach unten, beim Gehen, Laufen, Springen und auf Zehenspitzen.', k: 'Über die Achillessehne, die stärkste Sehne des Körpers, überträgt die Wade ihre Kraft auf die Ferse.' },
  schienbein: { n: 'Schienbein', f: 'Vorderer Schienbeinmuskel (M. tibialis anterior)', g: 'waden', w: 'Hebt die Fußspitze an, damit du bei jedem Schritt nicht hängen bleibst.', k: 'Er bremst den Fuß beim Aufsetzen sanft ab. Ungewohnt schnelles Gehen spürt man deshalb oft zuerst hier.' }
};

// Regionen für den Adventskalender und die Listenansicht
export const REGIONEN = {
  beine: ['gesaess', 'hueftbeuger', 'quad', 'hams', 'addu', 'waden', 'schienbein'],
  rumpf: ['bauch', 'seitbauch', 'oruecken', 'uruecken'],
  oberkoerper: ['nacken', 'schultern', 'brust', 'bizeps', 'trizeps', 'unterarme']
};
