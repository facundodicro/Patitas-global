/**
 * Capa de datos de Patitas.
 *
 * Si hay credenciales de Supabase (VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY),
 * opera contra la base real. Si no, funciona en MODO DEMO: los datos viven en
 * memoria + localStorage y todo el flujo se puede probar igual.
 */
import { supabase, isSupabaseConfigured } from './supabase'
import { seedReports, seedPets, seedOwnerProfiles, seedAds } from './demoData'
import { resizeImage, blobToDataURL } from './image'

export const DEMO_MODE = !isSupabaseConfigured

const LS_KEY = 'patitas_demo_v1'

function loadDemo() {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      return {
        reports: parsed.reports ?? seedReports,
        pets: parsed.pets ?? seedPets,
        profiles: parsed.profiles ?? seedOwnerProfiles,
        ads: parsed.ads ?? seedAds,
      }
    }
  } catch {
    /* localStorage no disponible: usar solo memoria */
  }
  return {
    reports: [...seedReports],
    pets: [...seedPets],
    profiles: { ...seedOwnerProfiles },
    ads: [...seedAds],
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

/** Elimina un reporte (solo el dueño o un admin, según las políticas RLS). */
export async function deleteReport(id) {
  if (!DEMO_MODE) {
    const { error } = await supabase.from('reports').delete().eq('id', id)
    if (error) throw error
    return
  }
  demo.reports = demo.reports.filter((x) => x.id !== id)
  saveDemo()
}

/* -------------------------------- MASCOTAS ------------------------------ */

/** Mascotas del dueño indicado. */
export async function listMyPets(ownerId) {
  if (!DEMO_MODE) {
    const { data, error } = await supabase
      .from('pets')
      .select('*')
      .eq('owner_id', ownerId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  }
  return demo.pets.filter((p) => p.owner_id === ownerId).sort(byCreatedDesc)
}

/** Una mascota por id (para la ficha pública). */
export async function getPet(id) {
  if (!DEMO_MODE) {
    const { data, error } = await supabase.from('pets').select('*').eq('id', id).single()
    if (error) throw error
    return data
  }
  return demo.pets.find((p) => p.id === id) ?? null
}

/** Mascota + datos públicos del dueño (para la ficha pública /m/:id). */
export async function getPetWithOwner(id) {
  const pet = await getPet(id)
  if (!pet) return null
  const owner = await getProfile(pet.owner_id)
  return { pet, owner }
}

export async function createPet(ownerId, data) {
  if (!DEMO_MODE) {
    const { data: row, error } = await supabase
      .from('pets')
      .insert({ ...data, owner_id: ownerId })
      .select()
      .single()
    if (error) throw error
    return row
  }
  const row = {
    id: uid('pet'),
    owner_id: ownerId,
    created_at: new Date().toISOString(),
    qr_destino: 'ficha',
    ...data,
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
  saveDemo()
}

/* -------------------------------- PERFILES ------------------------------ */

export async function getProfile(userId) {
  if (!DEMO_MODE) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle()
    if (error) throw error
    return data
  }
  return demo.profiles[userId] ?? null
}

export async function upsertProfile(userId, data) {
  if (!DEMO_MODE) {
    const { error } = await supabase
      .from('profiles')
      .upsert({ id: userId, ...data }, { onConflict: 'id' })
    if (error) throw error
    return
  }
  demo.profiles[userId] = { id: userId, ...demo.profiles[userId], ...data }
  saveDemo()
}

/* --------------------------------- FOTOS -------------------------------- */

/**
 * Sube la foto de una mascota y devuelve su URL.
 * En Supabase: bucket "pet-photos". En demo: dataURL redimensionada.
 */
export async function uploadPetPhoto(file) {
  const resized = await resizeImage(file, 900, 0.82)
  if (!DEMO_MODE) {
    const path = `${uid('photo')}.jpg`
    const { error } = await supabase.storage.from('pet-photos').upload(path, resized, {
      contentType: 'image/jpeg',
      upsert: false,
    })
    if (error) throw error
    const { data } = supabase.storage.from('pet-photos').getPublicUrl(path)
    return data.publicUrl
  }
  return blobToDataURL(resized)
}

/* ------------------------------- PUBLICIDAD ----------------------------- */

export async function listAds() {
  if (!DEMO_MODE) {
    const { data, error } = await supabase
      .from('ads')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  }
  return [...demo.ads].sort(byCreatedDesc)
}

export async function createAd(data) {
  if (!DEMO_MODE) {
    const { data: row, error } = await supabase.from('ads').insert(data).select().single()
    if (error) throw error
    return row
  }
  const row = { id: uid('ad'), created_at: new Date().toISOString(), ...data }
  demo.ads.unshift(row)
  saveDemo()
  return row
}

export async function deleteAd(id) {
  if (!DEMO_MODE) {
    const { error } = await supabase.from('ads').delete().eq('id', id)
    if (error) throw error
    return
  }
  demo.ads = demo.ads.filter((a) => a.id !== id)
  saveDemo()
}

/** Actualiza una publicidad. Devuelve el registro actualizado. */
export async function updateAd(id, data) {
  if (!DEMO_MODE) {
    const { data: row, error } = await supabase
      .from('ads')
      .update(data)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return row
  }
  const a = demo.ads.find((x) => x.id === id)
  if (a) {
    Object.assign(a, data)
    saveDemo()
  }
  return a
}
