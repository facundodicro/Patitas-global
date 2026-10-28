/**
 * Capa de datos de Patitas (versión veterinarias).
 *
 * Si hay credenciales de Supabase (VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY),
 * opera contra la base real. Si no, funciona en MODO DEMO: los datos viven en
 * memoria + localStorage y todo el flujo se puede probar igual.
 *
 * Modelo: cada veterinaria (ligada a un usuario de Supabase Auth) tiene sus
 * pacientes (pets.veterinaria_id) y su historial de atenciones.
 */
import { supabase, isSupabaseConfigured } from './supabase'
import { seedReports, seedPets, seedVeterinarias, seedAtenciones } from './demoData'
import { resizeImage, blobToDataURL } from './image'

export const DEMO_MODE = !isSupabaseConfigured

const LS_KEY = 'patitas_demo_v2'

function loadDemo() {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      return {
        reports: parsed.reports ?? seedReports,
        pets: parsed.pets ?? seedPets,
        veterinarias: parsed.veterinarias ?? seedVeterinarias,
        atenciones: parsed.atenciones ?? seedAtenciones,
      }
    }
  } catch {
    /* localStorage no disponible: usar solo memoria */
  }
  return {
    reports: [...seedReports],
    pets: [...seedPets],
    veterinarias: [...seedVeterinarias],
    atenciones: [...seedAtenciones],
  }
}

let demo = loadDemo()

function saveDemo() {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(demo))
  } catch {
    /* cuota llena o no disponible: se sigue en memoria */
  }
}

const uid = (prefix) =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`

const byCreatedDesc = (a, b) => new Date(b.created_at) - new Date(a.created_at)

/* ------------------------------ REPORTES ------------------------------ */

/** Lista todos los reportes (perdidas/encontradas), más recientes primero. */
export async function listReports() {
  if (!DEMO_MODE) {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  }
  return [...demo.reports].sort(byCreatedDesc)
}

/** Crea un reporte comunitario. `data` puede incluir lat/lng opcionales. */
export async function createReport(data) {
  if (!DEMO_MODE) {
    const { data: row, error } = await supabase
      .from('reports')
      .insert({ ...data, estado: data.estado || 'perdida' })
      .select()
      .single()
    if (error) throw error
    return row
  }
  const row = {
    id: uid('report'),
    estado: 'perdida',
    created_at: new Date().toISOString(),
    ...data,
  }
  demo.reports.unshift(row)
  saveDemo()
  return row
}

/** Cambia el estado de un reporte: 'perdida' | 'encontrada' | 'en_casa'. */
export async function updateReportEstado(id, estado) {
  if (!DEMO_MODE) {
    const { error } = await supabase.from('reports').update({ estado }).eq('id', id)
    if (error) throw error
    return
  }
  const r = demo.reports.find((x) => x.id === id)
  if (r) {
    r.estado = estado
    saveDemo()
  }
}

/** Actualiza los campos de un reporte. Devuelve el registro actualizado. */
export async function updateReport(id, data) {
  if (!DEMO_MODE) {
    const { data: row, error } = await supabase
      .from('reports')
      .update(data)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return row
  }
  const r = demo.reports.find((x) => x.id === id)
  if (r) {
    Object.assign(r, data)
    saveDemo()
  }
  return r
}

/** Elimina un reporte (según las políticas RLS). */
export async function deleteReport(id) {
  if (!DEMO_MODE) {
    const { error } = await supabase.from('reports').delete().eq('id', id)
    if (error) throw error
    return
  }
  demo.reports = demo.reports.filter((x) => x.id !== id)
  saveDemo()
}

/* ---------------------------- VETERINARIAS ------------------------------ */

/** La veterinaria del usuario logueado (una por cuenta). */
export async function getMyVeterinaria(userId) {
  if (!DEMO_MODE) {
    const { data, error } = await supabase
      .from('veterinarias')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()
    if (error) throw error
    return data
  }
  return demo.veterinarias.find((v) => v.user_id === userId) ?? null
}

/** Una veterinaria por id (para la ficha pública). */
export async function getVeterinaria(id) {
  if (!DEMO_MODE) {
    const { data, error } = await supabase
      .from('veterinarias')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  }
  return demo.veterinarias.find((v) => v.id === id) ?? null
}

/** Registra la veterinaria del usuario. */
export async function createVeterinaria(userId, { nombre, whatsapp, direccion, logo_url }) {
  if (!DEMO_MODE) {
    const { data: row, error } = await supabase
      .from('veterinarias')
      .insert({ user_id: userId, nombre, whatsapp, direccion, logo_url })
      .select()
      .single()
    if (error) throw error
    return row
  }
  const row = {
    id: uid('vet'),
    user_id: userId,
    nombre,
    whatsapp,
    direccion: direccion || null,
    logo_url: logo_url || null,
    created_at: new Date().toISOString(),
  }
  demo.veterinarias.push(row)
  saveDemo()
  return row
}

/** Actualiza los datos de la veterinaria. */
export async function updateVeterinaria(id, data) {
  if (!DEMO_MODE) {
    const { data: row, error } = await supabase
      .from('veterinarias')
      .update(data)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return row
  }
  const v = demo.veterinarias.find((x) => x.id === id)
  if (v) {
    Object.assign(v, data)
    saveDemo()
  }
  return v
}

/* -------------------------------- MASCOTAS ------------------------------ */

/** Pacientes de la veterinaria indicada. */
export async function listVetPets(veterinariaId) {
  if (!DEMO_MODE) {
    const { data, error } = await supabase
      .from('pets')
      .select('*')
      .eq('veterinaria_id', veterinariaId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  }
  return demo.pets
    .filter((p) => p.veterinaria_id === veterinariaId)
    .sort(byCreatedDesc)
}

/** Una mascota por id. */
export async function getPet(id) {
  if (!DEMO_MODE) {
    const { data, error } = await supabase.from('pets').select('*').eq('id', id).single()
    if (error) throw error
    return data
  }
  return demo.pets.find((p) => p.id === id) ?? null
}

/** Mascota + su veterinaria (para la ficha /m/:id). */
export async function getPetWithVeterinaria(id) {
  const pet = await getPet(id)
  if (!pet) return null
  const veterinaria = pet.veterinaria_id ? await getVeterinaria(pet.veterinaria_id) : null
  return { pet, veterinaria }
}

/** Mascota pública (sin datos del dueño) para el QR. */
export async function getPublicPet(id) {
  if (!DEMO_MODE) {
    const { data } = await supabase.from('pets_public').select('*').eq('id', id).maybeSingle()
    if (data) return data
    // Respaldo: si la vista no trae la fila (p. ej. una mascota de dueño
    // que la vista todavía no incluye), se lee la tabla base pidiendo
    // SOLO columnas seguras: jamás datos del dueño.
    const { data: base, error } = await supabase
      .from('pets')
      .select('id, nombre, especie, edad, senas, foto_url, veterinaria_id, created_at')
      .eq('id', id)
      .maybeSingle()
    if (error) throw error
    return base
  }
  const p = demo.pets.find((x) => x.id === id) ?? null
  if (!p) return null
  const { dueno_nombre, dueno_whatsapp, dueno_user_id, consentimiento_contacto, origen, owner_id, qr_destino, ...pub } = p
  return pub
}

/** Mascota pública + su veterinaria (para la vista pública de /m/:id). */
export async function getPublicPetWithVeterinaria(id) {
  const pet = await getPublicPet(id)
  if (!pet) return null
  const veterinaria = pet.veterinaria_id ? await getVeterinaria(pet.veterinaria_id) : null
  return { pet, veterinaria }
}

/**
 * Contacto público del dueño de una mascota registrada por él mismo.
 * Devuelve { nombre, whatsapp } SOLO si la mascota es de origen 'dueno'
 * y el dueño aceptó mostrar su WhatsApp (vista pets_contacto_dueno).
 * Ante cualquier error (p. ej. la migración aún no se corrió) devuelve
 * null: la ficha pública sigue funcionando sin el botón de contacto.
 */
export async function getPublicOwnerContact(petId) {
  if (!DEMO_MODE) {
    try {
      const { data, error } = await supabase
        .from('pets_contacto_dueno')
        .select('nombre, whatsapp')
        .eq('pet_id', petId)
        .maybeSingle()
      if (error) return null
      return data
    } catch {
      return null
    }
  }
  const p = demo.pets.find((x) => x.id === petId) ?? null
  if (p && p.origen === 'dueno' && p.consentimiento_contacto && p.dueno_whatsapp) {
    return { nombre: p.dueno_nombre, whatsapp: p.dueno_whatsapp }
  }
  return null
}

/** Mascotas registradas por el propio dueño (panel "Mis mascotas"). */
export async function listMyPets(userId) {
  if (!DEMO_MODE) {
    const { data, error } = await supabase
      .from('pets')
      .select('*')
      .eq('dueno_user_id', userId)
      .eq('origen', 'dueno')
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  }
  return demo.pets
    .filter((p) => p.dueno_user_id === userId && p.origen === 'dueno')
    .sort(byCreatedDesc)
}

/**
 * Registra la mascota de un dueño (sin veterinaria).
 * Requiere consentimiento explícito: el llamador debe pasar
 * consentimiento=true; ese OK es lo que habilita el contacto público.
 */
export async function createOwnerPet(
  userId,
  { nombre, especie, raza, senas, foto_url, dueno_nombre, dueno_whatsapp, consentimiento },
) {
  if (!consentimiento) {
    throw new Error('Necesitamos tu OK para mostrar tu WhatsApp en la ficha pública.')
  }
  if (!DEMO_MODE) {
    const { data: row, error } = await supabase
      .from('pets')
      .insert({
        veterinaria_id: null,
        origen: 'dueno',
        dueno_user_id: userId,
        consentimiento_contacto: true,
        nombre,
        especie,
        raza: raza || null,
        senas: senas || null,
        foto_url: foto_url || null,
        dueno_nombre,
        dueno_whatsapp,
      })
      .select()
      .single()
    if (error) throw error
    return row
  }
  const row = {
    id: uid('pet'),
    veterinaria_id: null,
    origen: 'dueno',
    dueno_user_id: userId,
    consentimiento_contacto: true,
    nombre,
    especie,
    raza: raza || null,
    edad: null,
    senas: senas || null,
    foto_url: foto_url || null,
    dueno_nombre,
    dueno_whatsapp,
    created_at: new Date().toISOString(),
  }
  demo.pets.unshift(row)
  saveDemo()
  return row
}

/** Registra un paciente de la veterinaria. */
export async function createPet(
  veterinariaId,
  { nombre, especie, edad, senas, foto_url, dueno_nombre, dueno_whatsapp },
) {
  if (!DEMO_MODE) {
    const { data: row, error } = await supabase
      .from('pets')
      .insert({
        veterinaria_id: veterinariaId,
        nombre,
        especie,
        edad,
        senas,
        foto_url,
        dueno_nombre,
        dueno_whatsapp,
      })
      .select()
      .single()
    if (error) throw error
    return row
  }
  const row = {
    id: uid('pet'),
    veterinaria_id: veterinariaId,
    nombre,
    especie,
    edad: edad || null,
    senas: senas || null,
    foto_url: foto_url || null,
    dueno_nombre: dueno_nombre || null,
    dueno_whatsapp: dueno_whatsapp || null,
    created_at: new Date().toISOString(),
  }
  demo.pets.unshift(row)
  saveDemo()
  return row
}

export async function updatePet(id, data) {
  if (!DEMO_MODE) {
    const { error } = await supabase.from('pets').update(data).eq('id', id)
    if (error) throw error
    return
  }
  const p = demo.pets.find((x) => x.id === id)
  if (p) {
    Object.assign(p, data)
    saveDemo()
  }
}

export async function deletePet(id) {
  if (!DEMO_MODE) {
    const { error } = await supabase.from('pets').delete().eq('id', id)
    if (error) throw error
    return
  }
  demo.pets = demo.pets.filter((p) => p.id !== id)
  demo.atenciones = demo.atenciones.filter((a) => a.mascota_id !== id)
  saveDemo()
}

/* ------------------------------ ATENCIONES ------------------------------ */

const byFechaDesc = (a, b) => new Date(b.fecha) - new Date(a.fecha)

/** Historial de atenciones de una mascota, más recientes primero. */
export async function listAtenciones(mascotaId) {
  if (!DEMO_MODE) {
    const { data, error } = await supabase
      .from('atenciones')
      .select('*')
      .eq('mascota_id', mascotaId)
      .order('fecha', { ascending: false })
    if (error) throw error
    return data
  }
  return demo.atenciones.filter((a) => a.mascota_id === mascotaId).sort(byFechaDesc)
}

/** Registra una atención (vacuna, tratamiento, visita, cirugía u otro). */
export async function createAtencion({
  mascota_id,
  veterinaria_id,
  fecha,
  tipo,
  titulo,
  detalle,
  proxima_fecha,
  notas,
}) {
  if (!DEMO_MODE) {
    const { data: row, error } = await supabase
      .from('atenciones')
      .insert({
        mascota_id,
        veterinaria_id,
        fecha,
        tipo,
        titulo,
        detalle,
        proxima_fecha: proxima_fecha || null,
        notas: notas || null,
      })
      .select()
      .single()
    if (error) throw error
    return row
  }
  const row = {
    id: uid('at'),
    mascota_id,
    veterinaria_id,
    fecha,
    tipo,
    titulo,
    detalle: detalle || null,
    proxima_fecha: proxima_fecha || null,
    notas: notas || null,
    created_at: new Date().toISOString(),
  }
  demo.atenciones.unshift(row)
  saveDemo()
  return row
}

/** Elimina una atención del historial. */
export async function deleteAtencion(id) {
  if (!DEMO_MODE) {
    const { error } = await supabase.from('atenciones').delete().eq('id', id)
    if (error) throw error
    return
  }
  demo.atenciones = demo.atenciones.filter((a) => a.id !== id)
  saveDemo()
}

/* --------------------------------- FOTOS -------------------------------- */

/**
 * Sube una foto (mascota o logo de veterinaria) y devuelve su URL.
 * En Supabase: bucket "pet-photos". En demo: dataURL redimensionada.
 */
export async function uploadPetPhoto(file) {
  const resized = await resizeImage(file, 900, 0.82)
  if (!DEMO_MODE) {
    const path = `${uid('photo')}.webp`
    const { error } = await supabase.storage.from('pet-photos').upload(path, resized, {
      contentType: 'image/webp',
      upsert: false,
    })
    if (error) throw error
    const { data } = supabase.storage.from('pet-photos').getPublicUrl(path)
    return data.publicUrl
  }
  return blobToDataURL(resized)
}
