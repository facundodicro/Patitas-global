/** Datos de ejemplo para el modo demo (sin Supabase configurado). */

/** Centro y zoom por defecto del mapa: vista mundial */
export const DEFAULT_MAP_CENTER = [20, 0]
export const DEFAULT_MAP_ZOOM = 3

const now = Date.now()
const daysAgo = (n) => new Date(now - n * 24 * 60 * 60 * 1000).toISOString()

export const seedReports = [
  {
    id: 'demo-report-milo',
    tipo: 'perdida',
    nombre: 'Milo',
    especie: 'Perro',
    raza: 'Labrador',
    senas: 'Pelo dorado, collar azul. Muy sociable, responde a su nombre.',
    recompensa: 'Se ofrece recompensa',
    zona: 'Palermo, Buenos Aires',
    fecha: daysAgo(2).slice(0, 10),
    telefono: '5491100000001',
    foto_url: null,
    estado: 'perdida',
    lat: -34.6037,
    lng: -58.3816,
    created_at: daysAgo(2),
  },
  {
    id: 'demo-report-luna',
    tipo: 'perdida',
    nombre: 'Luna',
    especie: 'Gato',
    raza: 'Siamés',
    senas: 'Ojos celestes, mancha blanca en el pecho. Asustadiza.',
    recompensa: null,
    zona: 'Condesa, CDMX',
    fecha: daysAgo(1).slice(0, 10),
    telefono: '5215500000002',
    foto_url: null,
    estado: 'perdida',
    lat: 19.4326,
    lng: -99.1332,
    created_at: daysAgo(1),
  },
  {
    id: 'demo-report-rocky',
    tipo: 'perdida',
    nombre: 'Rocky',
    especie: 'Perro',
    raza: 'Bulldog',
    senas: 'Contextura robusta, mancha marrón sobre el ojo derecho.',
    recompensa: null,
    zona: 'Retiro, Madrid',
    fecha: daysAgo(4).slice(0, 10),
    telefono: '346000000003',
    foto_url: null,
    estado: 'perdida',
    lat: 40.4168,
    lng: -3.7038,
    created_at: daysAgo(4),
  },
  {
    id: 'demo-report-toby',
    tipo: 'encontrada',
    nombre: 'Toby',
    especie: 'Perro',
    raza: 'Beagle',
    senas: 'Encontrado cerca del parque, sin collar. Bien cuidado.',
    recompensa: null,
    zona: 'Chapinero, Bogotá',
    fecha: daysAgo(1).slice(0, 10),
    telefono: '573000000004',
    foto_url: null,
    estado: 'encontrada',
    lat: 4.711,
    lng: -74.0721,
    created_at: daysAgo(1),
  },
  {
    id: 'demo-report-simba',
    tipo: 'encontrada',
    nombre: 'Simba',
    especie: 'Gato',
    raza: 'Naranja común',
    senas: 'Gato naranja de pelo corto, apareció en un patio del centro.',
    recompensa: null,
    zona: 'Providencia, Santiago',
    fecha: daysAgo(3).slice(0, 10),
    telefono: '569000000005',
    foto_url: null,
    estado: 'encontrada',
    lat: -33.4489,
    lng: -70.6693,
    created_at: daysAgo(3),
  },
  {
    id: 'demo-report-bella',
    tipo: 'perdida',
    nombre: 'Bella',
    especie: 'Perro',
    raza: 'Caniche',
    senas: 'Caniche blanca chiquita. Ya fue reunida con su familia.',
    recompensa: null,
    zona: 'Miraflores, Lima',
    fecha: daysAgo(9).slice(0, 10),
    telefono: '519000000006',
    foto_url: null,
    estado: 'en_casa',
    lat: -12.0464,
    lng: -77.0428,
    created_at: daysAgo(9),
  },
]

/** Mascotas de ejemplo para la ficha pública en modo demo */
export const seedPets = [
  {
    id: 'demo-pet-coco',
    owner_id: 'demo-owner',
    nombre: 'Coco',
    especie: 'Perro',
    edad: '3 años',
    senas: 'Pelo rizado marrón claro, collar verde con placa.',
    foto_url: null,
    qr_destino: 'ficha',
    created_at: daysAgo(30),
  },
]

export const seedOwnerProfiles = {
  'demo-owner': {
    id: 'demo-owner',
    nombre: 'Dueño de ejemplo',
    telefono: '5491100000000',
    email: 'ejemplo@patitas.app',
    zona: 'Palermo, Buenos Aires',
  },
}

export const seedAds = []
