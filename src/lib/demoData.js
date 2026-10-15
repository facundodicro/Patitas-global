/** Datos de ejemplo para el modo demo (sin Supabase configurado). */

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
]

/**
 * Veterinaria de ejemplo. En modo demo, ingresar con el email vete@demo.com
 * muestra este consultorio ya cargado (ver getMyVeterinaria en store.js).
 */
export const seedVeterinarias = [
  {
    id: 'demo-vet-1',
    user_id: 'demo-user-vete@demo.com',
    nombre: 'Veterinaria Huellas',
    whatsapp: '5492262000000',
    direccion: 'Av. 58 1234, Necochea',
    logo_url: null,
    created_at: daysAgo(60),
  },
]

/** Pacientes de ejemplo de la veterinaria demo */
export const seedPets = [
  {
    id: 'demo-pet-coco',
    veterinaria_id: 'demo-vet-1',
    nombre: 'Coco',
    especie: 'Perro',
    edad: '3 años',
    senas: 'Pelo rizado marrón claro, collar verde con QR.',
    foto_url: null,
    dueno_nombre: 'Martina López',
    dueno_whatsapp: '5492262111111',
    created_at: daysAgo(30),
  },
  {
    id: 'demo-pet-michi',
    veterinaria_id: 'demo-vet-1',
    nombre: 'Michi',
    especie: 'Gato',
    edad: '1 año',
    senas: 'Atigrado gris, muy tranquilo.',
    foto_url: null,
    dueno_nombre: 'Diego Fernández',
    dueno_whatsapp: '5492262222222',
    created_at: daysAgo(20),
  },
]

/** Historial de atenciones de ejemplo */
export const seedAtenciones = [
  {
    id: 'demo-at-1',
    mascota_id: 'demo-pet-coco',
    veterinaria_id: 'demo-vet-1',
    fecha: daysAgo(30).slice(0, 10),
    tipo: 'vacuna',
    titulo: 'Vacuna antirrábica',
    detalle: 'Dosis anual. Sin reacciones adversas.',
    proxima_fecha: new Date(now + 335 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    notas: '',
    created_at: daysAgo(30),
  },
  {
    id: 'demo-at-2',
    mascota_id: 'demo-pet-coco',
    veterinaria_id: 'demo-vet-1',
    fecha: daysAgo(10).slice(0, 10),
    tipo: 'visita',
    titulo: 'Control general',
    detalle: 'Peso 12,4 kg. Buen estado general, mucosas rosadas.',
    proxima_fecha: null,
    notas: 'Volver en 6 meses para control.',
    created_at: daysAgo(10),
  },
  {
    id: 'demo-at-3',
    mascota_id: 'demo-pet-michi',
    veterinaria_id: 'demo-vet-1',
    fecha: daysAgo(5).slice(0, 10),
    tipo: 'tratamiento',
    titulo: 'Desparasitación interna',
    detalle: 'Comprimido antiparasitario. Repetir en 3 meses.',
    proxima_fecha: new Date(now + 85 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    notas: '',
    created_at: daysAgo(5),
  },
]
