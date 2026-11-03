/**
 * Genera public/icons/icon-192.png e icon-512.png con Node puro (sin dependencias).
 * Corre como parte del build (package.json: "build": "node scripts/gen-icons.mjs
 * && vite build"), así que estos iconos son la salida de ESTE archivo.
 *
 * Marca actual (nov 2026): lupa grande de costado en crema piedra (#D3C9B0)
 * sobre el color de la app (teal #0F766E), con disco blanco y la palabra
 * «QR» en negro adentro de la lente. Los contornos de las letras son los
 * reales de Noto Sans Bold, volcados como polígonos (regla even-odd) —
 * la misma geometría que los paths de Logo.jsx y favicon.svg.
 * Se dibuja con sobremuestreo x4 y se promedia, para bordes suaves.
 *
 * Uso: node scripts/gen-icons.mjs
 */
import { writeFileSync, mkdirSync } from 'node:fs'
import { deflateSync } from 'node:zlib'

const OUT = new URL('../public/icons/', import.meta.url)
mkdirSync(OUT, { recursive: true })

const TEAL = [15, 118, 110, 255] // #0F766E — el color de la app
const PIEDRA = [211, 201, 176, 255] // #D3C9B0 — crema piedra
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

const QR_POLYS = [
  [[0.4307,0.4218],[0.4306,0.4271],[0.4303,0.4323],[0.4298,0.4374],[0.4291,0.4423],[0.4283,0.4471],[0.4272,0.4517],[0.4259,0.4562],[0.4245,0.4606],[0.4228,0.4647],[0.4209,0.4688],[0.4189,0.4726],[0.4166,0.4763],[0.4141,0.4797],[0.4114,0.4830],[0.4085,0.4860],[0.4054,0.4888],[0.4021,0.4914],[0.3985,0.4938],[0.3948,0.4959],[0.3908,0.4979],[0.4298,0.5414],[0.3858,0.5414],[0.3561,0.5052],[0.3536,0.5052],[0.3485,0.5051],[0.3435,0.5047],[0.3387,0.5042],[0.3341,0.5035],[0.3296,0.5026],[0.3254,0.5014],[0.3213,0.5001],[0.3174,0.4985],[0.3137,0.4967],[0.3102,0.4947],[0.3069,0.4926],[0.3037,0.4902],[0.3008,0.4877],[0.2980,0.4851],[0.2953,0.4822],[0.2929,0.4792],[0.2906,0.4760],[0.2885,0.4727],[0.2866,0.4692],[0.2848,0.4655],[0.2833,0.4617],[0.2819,0.4577],[0.2806,0.4536],[0.2796,0.4494],[0.2786,0.4451],[0.2779,0.4406],[0.2773,0.4361],[0.2769,0.4313],[0.2767,0.4265],[0.2766,0.4215],[0.2767,0.4166],[0.2769,0.4117],[0.2773,0.4070],[0.2779,0.4025],[0.2786,0.3980],[0.2796,0.3937],[0.2806,0.3895],[0.2819,0.3855],[0.2833,0.3816],[0.2848,0.3778],[0.2866,0.3742],[0.2885,0.3707],[0.2906,0.3674],[0.2929,0.3642],[0.2953,0.3613],[0.2980,0.3585],[0.3008,0.3558],[0.3037,0.3533],[0.3069,0.3510],[0.3102,0.3489],[0.3137,0.3469],[0.3175,0.3452],[0.3213,0.3436],[0.3254,0.3423],[0.3297,0.3412],[0.3342,0.3402],[0.3388,0.3395],[0.3436,0.3390],[0.3487,0.3387],[0.3539,0.3386],[0.3590,0.3387],[0.3640,0.3390],[0.3688,0.3395],[0.3734,0.3402],[0.3778,0.3412],[0.3821,0.3423],[0.3861,0.3436],[0.3900,0.3452],[0.3937,0.3469],[0.3971,0.3489],[0.4005,0.3510],[0.4036,0.3533],[0.4066,0.3558],[0.4094,0.3585],[0.4120,0.3613],[0.4144,0.3643],[0.4167,0.3674],[0.4188,0.3708],[0.4207,0.3742],[0.4224,0.3779],[0.4240,0.3817],[0.4254,0.3856],[0.4266,0.3897],[0.4277,0.3939],[0.4286,0.3982],[0.4294,0.4027],[0.4299,0.4072],[0.4304,0.4119],[0.4306,0.4168],[0.4307,0.4218]],
  [[0.3126,0.4218],[0.3127,0.4267],[0.3130,0.4315],[0.3135,0.4360],[0.3142,0.4403],[0.3150,0.4444],[0.3161,0.4483],[0.3174,0.4520],[0.3188,0.4555],[0.3205,0.4587],[0.3224,0.4618],[0.3244,0.4645],[0.3267,0.4670],[0.3293,0.4692],[0.3320,0.4711],[0.3350,0.4727],[0.3383,0.4740],[0.3418,0.4751],[0.3455,0.4758],[0.3494,0.4762],[0.3536,0.4764],[0.3579,0.4762],[0.3619,0.4758],[0.3657,0.4751],[0.3692,0.4740],[0.3725,0.4727],[0.3755,0.4711],[0.3783,0.4692],[0.3808,0.4670],[0.3831,0.4645],[0.3851,0.4618],[0.3869,0.4587],[0.3886,0.4555],[0.3900,0.4520],[0.3912,0.4483],[0.3923,0.4444],[0.3931,0.4403],[0.3938,0.4360],[0.3943,0.4315],[0.3946,0.4267],[0.3947,0.4218],[0.3946,0.4167],[0.3943,0.4120],[0.3938,0.4074],[0.3931,0.4030],[0.3923,0.3989],[0.3912,0.3950],[0.3900,0.3913],[0.3886,0.3879],[0.3869,0.3847],[0.3851,0.3816],[0.3831,0.3789],[0.3808,0.3764],[0.3783,0.3742],[0.3756,0.3724],[0.3726,0.3708],[0.3693,0.3695],[0.3658,0.3684],[0.3621,0.3677],[0.3581,0.3673],[0.3539,0.3671],[0.3496,0.3673],[0.3456,0.3677],[0.3419,0.3684],[0.3384,0.3695],[0.3351,0.3708],[0.3321,0.3724],[0.3293,0.3742],[0.3267,0.3764],[0.3244,0.3789],[0.3224,0.3816],[0.3205,0.3847],[0.3188,0.3879],[0.3174,0.3913],[0.3161,0.3950],[0.3150,0.3989],[0.3142,0.4030],[0.3135,0.4074],[0.3130,0.4120],[0.3127,0.4167],[0.3126,0.4218]],
  [[0.5114,0.3411],[0.5178,0.3412],[0.5239,0.3415],[0.5297,0.3421],[0.5351,0.3430],[0.5401,0.3441],[0.5448,0.3454],[0.5492,0.3470],[0.5532,0.3488],[0.5569,0.3508],[0.5602,0.3531],[0.5632,0.3556],[0.5659,0.3584],[0.5683,0.3614],[0.5703,0.3647],[0.5720,0.3682],[0.5735,0.3720],[0.5746,0.3760],[0.5753,0.3803],[0.5758,0.3848],[0.5760,0.3896],[0.5759,0.3918],[0.5758,0.3939],[0.5756,0.3960],[0.5753,0.3980],[0.5749,0.4000],[0.5745,0.4019],[0.5739,0.4037],[0.5733,0.4055],[0.5726,0.4073],[0.5718,0.4089],[0.5709,0.4106],[0.5700,0.4122],[0.5690,0.4137],[0.5680,0.4152],[0.5669,0.4166],[0.5658,0.4180],[0.5646,0.4193],[0.5633,0.4206],[0.5620,0.4218],[0.5607,0.4230],[0.5593,0.4241],[0.5579,0.4252],[0.5564,0.4263],[0.5550,0.4273],[0.5535,0.4282],[0.5520,0.4292],[0.5505,0.4300],[0.5490,0.4309],[0.5474,0.4317],[0.5458,0.4324],[0.5934,0.5029],[0.5554,0.5029],[0.5168,0.4408],[0.4985,0.4408],[0.4985,0.5029],[0.4642,0.5029],[0.4642,0.3411]],
  [[0.5089,0.3692],[0.4985,0.3692],[0.4985,0.4129],[0.5096,0.4129],[0.5129,0.4129],[0.5160,0.4127],[0.5189,0.4124],[0.5216,0.4120],[0.5242,0.4115],[0.5265,0.4109],[0.5286,0.4101],[0.5306,0.4093],[0.5324,0.4083],[0.5339,0.4072],[0.5353,0.4061],[0.5366,0.4048],[0.5377,0.4034],[0.5386,0.4018],[0.5395,0.4002],[0.5401,0.3985],[0.5406,0.3967],[0.5410,0.3947],[0.5412,0.3926],[0.5413,0.3905],[0.5412,0.3882],[0.5410,0.3861],[0.5406,0.3841],[0.5400,0.3823],[0.5393,0.3806],[0.5385,0.3790],[0.5375,0.3776],[0.5363,0.3763],[0.5350,0.3751],[0.5335,0.3740],[0.5318,0.3731],[0.5300,0.3723],[0.5280,0.3716],[0.5258,0.3709],[0.5234,0.3704],[0.5209,0.3700],[0.5181,0.3696],[0.5152,0.3694],[0.5122,0.3692],[0.5089,0.3692]],
]

function inRoundRect(x, y, x0, y0, x1, y1, rad) {
  const cx = Math.min(Math.max(x, x0 + rad), x1 - rad)
  const cy = Math.min(Math.max(y, y0 + rad), y1 - rad)
  return (x - cx) ** 2 + (y - cy) ** 2 <= rad * rad
}

function inCircle(x, y, cx, cy, r) {
  return (x - cx) ** 2 + (y - cy) ** 2 <= r * r
}

function nearSegment(x, y, ax, ay, bx, by, rad) {
  const dx = bx - ax
  const dy = by - ay
  const t = Math.min(1, Math.max(0, ((x - ax) * dx + (y - ay) * dy) / (dx * dx + dy * dy)))
  const px = ax + t * dx
  const py = ay + t * dy
  return (x - px) ** 2 + (y - py) ** 2 <= rad * rad
}

/** Punto dentro de los contornos de «QR» (regla even-odd entre contornos). */
function inPolys(x, y) {
  let inside = false
  for (const poly of QR_POLYS) {
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const xi = poly[i][0]
      const yi = poly[i][1]
      const xj = poly[j][0]
      const yj = poly[j][1]
      if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside
    }
  }
  return inside
}

/** Color de la marca en el punto (x, y); null = transparente. */
function colorAt(x, y) {
  let c = null
  // fondo: el color de la app, redondeado
  if (inRoundRect(x, y, 0.035, 0.035, 0.965, 0.965, 0.205)) c = TEAL
  // lupa grande: mango a 45° con extremos redondos + aro de la lente
  if (nearSegment(x, y, 0.6295, 0.6345, 0.7603, 0.7653, 0.05)) c = PIEDRA
  if (inCircle(x, y, 0.435, 0.44, 0.31)) c = PIEDRA
  // disco blanco de la lente
  if (inCircle(x, y, 0.435, 0.44, 0.225)) c = WHITE
  // la palabra «QR» en negro (solo se evalúa cerca de las letras)
  if (x > 0.25 && x < 0.62 && y > 0.30 && y < 0.58 && inPolys(x, y)) c = BLACK
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
