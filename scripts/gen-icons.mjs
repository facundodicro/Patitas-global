/**
 * Genera public/icons/icon-192.png e icon-512.png con Node puro (sin dependencias):
 * fondo teal redondeado + huella blanca dibujada con círculos y elipses.
 *
 * Uso: node scripts/gen-icons.mjs
 */
import { writeFileSync, mkdirSync } from 'node:fs'
import { deflateSync } from 'node:zlib'

const OUT = new URL('../public/icons/', import.meta.url)
mkdirSync(OUT, { recursive: true })

const TEAL = [15, 118, 110, 255]
const WHITE = [255, 255, 255, 255]

function crc32(buf) {
  let table = crc32.table
  if (!table) {
    table = crc32.table = new Int32Array(256)
    for (let n = 0; n < 256; n++) {
      let c = n
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
      table[n] = c
    }
  }
  let crc = 0xffffffff
  for (let i = 0; i < buf.length; i++) crc = table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8)
  return (crc ^ 0xffffffff) >>> 0
}

function chunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(body))
  return Buffer.concat([len, body, crc])
}

function encodePNG(width, height, rgba) {
  const raw = Buffer.alloc((width * 4 + 1) * height)
  for (let y = 0; y < height; y++) {
    raw[y * (width * 4 + 1)] = 0 // filtro None
    rgba.copy(raw, y * (width * 4 + 1) + 1, y * width * 4, (y + 1) * width * 4)
  }
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8 // bit depth
  ihdr[9] = 6 // color type RGBA
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
  return Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', deflateSync(raw)), chunk('IEND', Buffer.alloc(0))])
}

/** Lienzo RGBA con primitivas de dibujo. */
function canvas(size) {
  const px = Buffer.alloc(size * size * 4)
  const set = (x, y, c) => {
    if (x < 0 || y < 0 || x >= size || y >= size) return
    const i = (y * size + x) * 4
    px[i] = c[0]; px[i + 1] = c[1]; px[i + 2] = c[2]; px[i + 3] = c[3]
  }
  // fondo teal con esquinas redondeadas
  const r = size * 0.22
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const cx = Math.min(Math.max(x, r), size - r)
      const cy = Math.min(Math.max(y, r), size - r)
      if ((x - cx) ** 2 + (y - cy) ** 2 <= r * r) set(x, y, TEAL)
    }
  }
  const ellipse = (ex, ey, rx, ry, rot, color) => {
    const cos = Math.cos(rot), sin = Math.sin(rot)
    const x0 = Math.floor(ex - rx - ry), x1 = Math.ceil(ex + rx + ry)
    const y0 = Math.floor(ey - rx - ry), y1 = Math.ceil(ey + rx + ry)
    for (let y = y0; y <= y1; y++) {
      for (let x = x0; x <= x1; x++) {
        const dx = x - ex, dy = y - ey
        const lx = dx * cos + dy * sin
        const ly = -dx * sin + dy * cos
        if ((lx / rx) ** 2 + (ly / ry) ** 2 <= 1) set(x, y, color)
      }
    }
  }
  // huella blanca (coordenadas relativas al viewBox 48x48 del favicon)
  const s = size / 48
  const P = (v) => v * s
  // almohadilla: elipse ancha
  ellipse(P(24), P(29), P(8.6), P(6.2), 0, WHITE)
  // dedos
  ellipse(P(13.5), P(20.5), P(3.1), P(4), -0.31, WHITE)
  ellipse(P(20), P(14.5), P(3.1), P(4), -0.1, WHITE)
  ellipse(P(28), P(14.5), P(3.1), P(4), 0.1, WHITE)
  ellipse(P(34.5), P(20.5), P(3.1), P(4), 0.31, WHITE)
  return px
}

for (const size of [192, 512]) {
  const png = encodePNG(size, size, canvas(size))
  const path = new URL(`icon-${size}.png`, OUT)
  writeFileSync(path, png)
  console.log(`OK icon-${size}.png (${png.length} bytes)`)
}
