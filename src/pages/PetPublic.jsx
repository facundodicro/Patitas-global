import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Loader2, MessageCircle, Phone } from 'lucide-react'
import PetPhoto from '../components/PetPhoto'
import EmptyState from '../components/EmptyState'
import DonateButton from '../components/DonateButton'
import { getPetWithOwner } from '../lib/store'
import { waLink } from '../lib/qr'

export default function PetPublic() {
  const { id } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    getPetWithOwner(id)
      .then((result) => { if (mounted) setData(result) })
      .finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [id])

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-brand" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <EmptyState
          title="No encontramos esta ficha"
          text="El enlace puede estar desactualizado."
        />
      </div>
    )
  }

  const { pet, owner } = data
  const whatsappHref = owner?.telefono
    ? waLink(owner.telefono, `¡Hola! Encontré a ${pet.nombre}, escaneé su placa Patitas.`)
    : null

  return (
    <div className="mx-auto max-w-2xl animate-fade-up px-4 py-8">
      <div className="overflow-hidden rounded-3xl bg-white shadow-card">
        <PetPhoto src={pet.foto_url} alt={pet.nombre} className="h-72 w-full object-cover" />
        <div className="p-6">
          <h1 className="text-3xl font-extrabold text-stone-900">{pet.nombre}</h1>
          {(pet.especie || pet.edad) && (
            <p className="mt-1 text-stone-600">
              {[pet.especie, pet.edad].filter(Boolean).join(' · ')}
            </p>
          )}
          {pet.senas && (
            <div className="mt-5">
              <h2 className="font-extrabold text-stone-900">Señas particulares</h2>
              <p className="mt-1 whitespace-pre-line text-stone-700">{pet.senas}</p>
            </div>
          )}

          <div className="mt-6 rounded-2xl bg-brand-faint p-5">
            <h2 className="text-lg font-extrabold text-stone-900">¿La encontraste?</h2>
            {whatsappHref ? (
              <>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 flex items-center justify-center gap-2 rounded-full bg-status-encontrado px-6 py-3.5 text-lg font-extrabold text-white transition hover:brightness-110"
                >
                  <MessageCircle className="h-6 w-6" />
                  Avisar al dueño por WhatsApp
                </a>
                <a
                  href={`tel:${owner.telefono}`}
                  className="mt-3 flex items-center justify-center gap-2 rounded-full border-2 border-stone-300 px-6 py-2.5 font-extrabold text-stone-700 transition hover:border-stone-400"
                >
                  <Phone className="h-5 w-5" />
                  Llamar
                </a>
              </>
            ) : (
              <p className="mt-3 rounded-xl bg-stone-100 px-4 py-3 text-sm font-bold text-stone-600">
                El dueño aún no cargó su WhatsApp.
              </p>
            )}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-accent-soft/60 px-5 py-4">
            <p className="text-sm font-bold text-stone-700">
              ¿Te sirvió Patitas para este reencuentro?
            </p>
            <DonateButton label="Agradecer" />
          </div>
        </div>
      </div>
    </div>
  )
}
