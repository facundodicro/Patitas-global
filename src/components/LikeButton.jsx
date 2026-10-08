import { useEffect, useState } from 'react'
import { Heart } from 'lucide-react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

/** Clave donde los visitantes anónimos guardan el id de su voto */
const LS_KEY = 'patitas_page_like'

/**
 * Botón "Me gusta" real de la página.
 * - El contador sale de la tabla page_likes (Supabase), no es un número fijo.
 * - Usuarios registrados: un voto por cuenta. Anónimos: un voto por navegador.
 * - Solo se muestra cuando Supabase está configurado.
 */
export default function LikeButton() {
  const { user } = useAuth()
  const [count, setCount] = useState(0)
  const [liked, setLiked] = useState(false)
  const [likeRowId, setLikeRowId] = useState(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!isSupabaseConfigured) return
    let mounted = true
    ;(async () => {
      const { count: total } = await supabase
        .from('page_likes')
        .select('*', { count: 'exact', head: true })
      if (!mounted) return
      setCount(total ?? 0)

      if (user) {
        const { data } = await supabase
          .from('page_likes')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle()
        if (mounted && data) {
          setLiked(true)
          setLikeRowId(data.id)
        }
      } else {
        try {
          const saved = JSON.parse(localStorage.getItem(LS_KEY) || 'null')
          if (mounted && saved?.id) {
            setLiked(true)
            setLikeRowId(saved.id)
          }
        } catch {
          /* noop */
        }
      }
    })()
    return () => {
      mounted = false
    }
  }, [user?.id])

  async function toggle() {
    if (busy || !isSupabaseConfigured) return
    setBusy(true)
    try {
      if (liked && likeRowId) {
        await supabase.from('page_likes').delete().eq('id', likeRowId)
        setLiked(false)
        setLikeRowId(null)
        setCount((c) => Math.max(0, c - 1))
        try {
          localStorage.removeItem(LS_KEY)
        } catch {
          /* noop */
        }
      } else {
        const { data, error } = await supabase
          .from('page_likes')
          .insert({ user_id: user?.id ?? null })
          .select('id')
          .single()
        if (error) throw error
        setLiked(true)
        setLikeRowId(data.id)
        setCount((c) => c + 1)
        if (!user) {
          try {
            localStorage.setItem(LS_KEY, JSON.stringify({ id: data.id }))
          } catch {
            /* noop */
          }
        }
      }
    } catch {
      /* silencioso: el botón nunca debe romper la página */
    } finally {
      setBusy(false)
    }
  }

  if (!isSupabaseConfigured) return null

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={busy}
      aria-pressed={liked}
      aria-label="Me gusta Patitas"
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-extrabold transition ${
        liked
          ? 'bg-white text-brand-dark shadow-pop'
          : 'bg-white/15 text-white hover:bg-white/25'
      }`}
    >
      <Heart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
      {count > 0 ? count : ''} Me gusta
    </button>
  )
}
