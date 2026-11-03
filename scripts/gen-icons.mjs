/**
 * Genera public/icons/icon-192.png e icon-512.png con Node puro (sin dependencias).
 *
 * Marca actual (nov 2026): pin de ubicación crema con un QR adentro sobre el
 * verde propio de Patitas (#14532D) — reemplaza a la huellita teal original.
 * La geometría es la MISMA que la del favicon.svg y el componente Logo.jsx
 * (coordenadas como fracciones del lienzo). Se dibuja con sobremuestreo x4
 * y se promedia, para que los bordes queden suaves.
 *
 * Uso: node scripts/gen-icons.mjs
 */
import { writeFileSync, mkdirSync } from 'node:fs'
import { deflateSync } from 'node:zlib'

const OUT = new URL('../public/icons/', import.meta.url)
mkdirSync(OUT, { recursive: true })

const GREEN = [20, 83, 45, 255] // #14532D
const CREAM = [248, 238, 219, 255] // #F8EEDB
const WHITE = [255, 255, 255, 255]
const BLACK = [10, 10, 10, 255]

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

// --- Geometría de la marca (fracciones 0..1 del lienzo) ---

function inRoundRect(x, y, x0, y0, x1, y1, rad) {
  const cx = Math.min(Math.max(x, x0 + rad), x1 - rad)
  const cy = Math.min(Math.max(y, y0 + rad), y1 - rad)
  return (x - cx) ** 2 + (y - cy) ** 2 <= rad * rad
}

function inCircle(x, y, cx, cy, r) {
  return (x - cx) ** 2 + (y - cy) ** 2 <= r * r
}

function inTriangle(x, y, ax, ay, bx, by, cx, cy) {
  const s1 = (x - bx) * (ay - by) - (ax - bx) * (y - by)
  const s2 = (x - cx) * (by - cy) - (bx - cx) * (y - cy)
  const s3 = (x - ax) * (cy - ay) - (cx - ax) * (y - ay)
  const neg = s1 < 0 || s2 < 0 || s3 < 0
  const pos = s1 > 0 || s2 > 0 || s3 > 0
  return !(neg && pos)
}

function inRect(x, y, x0, y0, x1, y1) {
  return x >= x0 && x <= x1 && y >= y0 && y <= y1
}

/** Color de la marca en el punto (x, y); null = transparente. */
function colorAt(x, y) {
  let c = null
  // fondo verde redondeado
  if (inRoundRect(x, y, 0.035, 0.035, 0.965, 0.965, 0.185)) c = GREEN
  // pin crema: círculo + triángulo tangente
  if (
    inCircle(x, y, 0.5, 0.3698, 0.2186) ||
    inTriangle(x, y, 0.3124, 0.482, 0.6876, 0.482, 0.5, 0.7961)
  ) {
    c = CREAM
  }
  // placa blanca del QR
  if (inRoundRect(x, y, 0.382, 0.2518, 0.6181, 0.4879, 0.0331)) c = WHITE
  // QR simplificado
  if (
    inRect(x, y, 0.4186, 0.2884, 0.493, 0.3628) || // sup. izq.
    inRect(x, y, 0.5071, 0.2884, 0.5815, 0.3628) || // sup. der.
    inRect(x, y, 0.4186, 0.3769, 0.493, 0.4513) || // inf. izq.
    inRect(x, y, 0.5107, 0.3805, 0.552, 0.4218) || // grupito der.
    inRect(x, y, 0.5603, 0.43, 0.5851, 0.4548)
  ) {
    c = BLACK
  }
  return c
}

function canvas(size) {
  const SS = 4
  const px = Buffer.alloc(size * size * 4)
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let r = 0, g = 0, b = 0, a = 0
      for (let sy = 0; sy < SS; sy++) {
        for (let sx = 0; sx < SS; sx++) {
          const fx = (x + (sx + 0.5) / SS) / size
          const fy = (y + (sy + 0.5) / SS) / size
          const c = colorAt(fx, fy)
          if (c) {
            r += c[0]; g += c[1]; b += c[2]; a += c[3]
          }
        }
      }
      const n = SS * SS
      const i = (y * size + x) * 4
      px[i] = Math.round(r / n)
      px[i + 1] = Math.round(g / n)
      px[i + 2] = Math.round(b / n)
      px[i + 3] = Math.round(a / n)
    }
  }
  return px
}

for (const size of [192, 512]) {
  const png = encodePNG(size, size, canvas(size))
  const path = new URL(`icon-${size}.png`, OUT)
  writeFileSync(path, png)
  console.log(`OK icon-${size}.png (${png.length} bytes)`)
}
