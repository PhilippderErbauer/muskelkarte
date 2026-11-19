// Kleiner PNG-Schreiber ohne Abhängigkeiten (für Icons und Testbilder)
import { writeFileSync } from 'node:fs';
import { deflateSync } from 'node:zlib';

const CRC = new Int32Array(256);
for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; CRC[n] = c; }
const crc = (b) => { let c = -1; for (let i = 0; i < b.length; i++) c = CRC[(c ^ b[i]) & 255] ^ (c >>> 8); return (c ^ -1) >>> 0; };
const chunk = (typ, d) => {
  const l = Buffer.alloc(4); l.writeUInt32BE(d.length);
  const td = Buffer.concat([Buffer.from(typ), d]);
  const c = Buffer.alloc(4); c.writeUInt32BE(crc(td));
  return Buffer.concat([l, td, c]);
};

export function schreibePNG(datei, W, H, D) {
  const raw = Buffer.alloc((W * 4 + 1) * H);
  for (let y = 0; y < H; y++) { raw[y * (W * 4 + 1)] = 0; Buffer.from(D.buffer, D.byteOffset + y * W * 4, W * 4).copy(raw, y * (W * 4 + 1) + 1); }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(W, 0); ihdr.writeUInt32BE(H, 4); ihdr[8] = 8; ihdr[9] = 6;
  writeFileSync(datei, Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', deflateSync(raw, { level: 9 })), chunk('IEND', Buffer.alloc(0))]));
}

// Verkleinert ein Bild um den Faktor f (Mittelwert, glättet Kanten) und legt es auf eine Hintergrundfarbe
export function verkleinern(D, W, H, f, bg) {
  const w = Math.floor(W / f), h = Math.floor(H / f), o = new Uint8ClampedArray(w * h * 4);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    let r = 0, g = 0, b = 0, a = 0;
    for (let dy = 0; dy < f; dy++) for (let dx = 0; dx < f; dx++) {
      const q = ((y * f + dy) * W + x * f + dx) * 4, al = D[q + 3];
      r += D[q] * al; g += D[q + 1] * al; b += D[q + 2] * al; a += al;
    }
    const q = (y * w + x) * 4, t = a / (255 * f * f);
    if (bg) { o[q] = (a ? r / a : 0) * t + bg[0] * (1 - t); o[q + 1] = (a ? g / a : 0) * t + bg[1] * (1 - t); o[q + 2] = (a ? b / a : 0) * t + bg[2] * (1 - t); o[q + 3] = 255; }
    else { o[q] = a ? r / a : 0; o[q + 1] = a ? g / a : 0; o[q + 2] = a ? b / a : 0; o[q + 3] = t * 255; }
  }
  return { D: o, W: w, H: h };
}
