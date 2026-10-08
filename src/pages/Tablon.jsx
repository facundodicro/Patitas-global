import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import BoardSection from '../components/BoardSection'
import ReportModal from '../components/ReportModal'
import { listReports } from '../lib/store'

export default function Tablon() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [reportModalOpen, setReportModalOpen] = useState(false)

  useEffect(() => {
    let mounted = true
    listReports()
      .then((reps) => { if (mounted) setReports(reps) })
      .finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [])

  return (
    <div className="mx-auto max-w-6xl animate-fade-up px-4 py-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-stone-900">Tablón de mascotas</h1>
          <p className="mt-2 text-stone-600">Perdidas y encontradas en tu zona.</p>
        </div>
        <button
          type="button"
          onClick={() => setReportModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 font-extrabold text-white transition hover:bg-accent-dark"
        >
          <Plus className="h-5 w-5" />
          Reportar mascota
        </button>
      </div>

      <div className="mt-8">
        <BoardSection reports={reports} loading={loading} onLocate={() => {}} />
      </div>

      <ReportModal
        open={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        onCreated={(r) => setReports((prev) => [r, ...prev])}
      />
    </div>
  )
}
