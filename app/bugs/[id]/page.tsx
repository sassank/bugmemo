'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { getSupabaseClient } from '../../../lib/supabase'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Listbox } from '@headlessui/react'
import { SiReact, SiNodedotjs, SiPython, SiNextdotjs, SiJavascript, SiTypescript, SiPhp, SiCplusplus, SiRuby, SiGo, SiRust, SiHtml5, SiCss3, SiTailwindcss, SiSass, SiAngular, SiDjango, SiFlask, SiSpring, SiLaravel, SiExpress, SiPostgresql, SiMysql, SiMongodb, SiFlutter, SiVuedotjs, SiJbl } from 'react-icons/si'

type Status = 'En cours' | 'Résolu'
type Bug = {
  id: string
  title: string
  error_log: string
  solution: string | null
  created_at: string | null
  tech: string
  status: Status
}

const techIcons: Record<string, React.ReactNode> = {
  React: <SiReact className="text-blue-400 w-5 h-5" />,
  'Next.js': <SiNextdotjs className="text-black w-5 h-5" />,
  'Node.js': <SiNodedotjs className="text-green-400 w-5 h-5" />,
  Python: <SiPython className="text-yellow-400 w-5 h-5" />,
  JavaScript: <SiJavascript className="text-yellow-300 w-5 h-5" />,
  TypeScript: <SiTypescript className="text-blue-500 w-5 h-5" />,
  PHP: <SiPhp className="text-purple-500 w-5 h-5" />,
  Java: <SiJbl className="text-purple-500 w-5 h-5" />,
  'C++': <SiCplusplus className="text-blue-600 w-5 h-5" />,
  Ruby: <SiRuby className="text-red-500 w-5 h-5" />,
  Go: <SiGo className="text-blue-500 w-5 h-5" />,
  Rust: <SiRust className="text-orange-700 w-5 h-5" />,
  Flutter: <SiFlutter className="text-blue-600 w-5 h-5" />,
  HTML: <SiHtml5 className="text-orange-500 w-5 h-5" />,
  CSS: <SiCss3 className="text-blue-500 w-5 h-5" />,
  Tailwind: <SiTailwindcss className="text-blue-400 w-5 h-5" />,
  Sass: <SiSass className="text-pink-500 w-5 h-5" />,
  Angular: <SiAngular className="text-red-600 w-5 h-5" />,
  Vue: <SiVuedotjs className="text-green-600 w-5 h-5" />,
  Django: <SiDjango className="text-green-800 w-5 h-5" />,
  Flask: <SiFlask className="text-black w-5 h-5" />,
  Spring: <SiSpring className="text-green-500 w-5 h-5" />,
  Laravel: <SiLaravel className="text-red-600 w-5 h-5" />,
  Express: <SiExpress className="text-gray-200 w-5 h-5" />,
  PostgreSQL: <SiPostgresql className="text-blue-700 w-5 h-5" />,
  MySQL: <SiMysql className="text-blue-500 w-5 h-5" />,
  MongoDB: <SiMongodb className="text-green-600 w-5 h-5" />,
  Other: <span className="w-5 h-5 flex items-center justify-center">🛠️</span>,
}

const statuses: Status[] = ['En cours', 'Résolu']

export default function BugDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [bug, setBug] = useState<Bug | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [title, setTitle] = useState('')
  const [errorLog, setErrorLog] = useState('')
  const [solution, setSolution] = useState('')
  const [tech, setTech] = useState('React')
  const [status, setStatus] = useState<Status>('En cours')

  useEffect(() => {
    fetchBug()
  }, [params.id])

  const fetchBug = async () => {
    setLoading(true)
    setError(null)

    const supabase = getSupabaseClient()
    if (!supabase) {
      setError('Erreur de connexion à la base de données')
      setLoading(false)
      return
    }

    if (!params.id || typeof params.id !== 'string') {
      setError('ID invalide')
      setLoading(false)
      return
    }

    try {
      const { data, error: fetchError } = await supabase
        .from('bugs')
        .select('*')
        .eq('id', params.id)
        .single()

      if (fetchError) throw fetchError
      setBug(data as Bug)
      // Initialiser les champs éditables
      setTitle((data as Bug).title)
      setErrorLog((data as Bug).error_log)
      setSolution((data as Bug).solution || '')
      setTech((data as Bug).tech)
      setStatus((data as Bug).status)
    } catch (err) {
      console.error('Erreur lors du chargement:', err)
      setError(err instanceof Error ? err.message : 'Erreur de chargement')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const handleSave = async () => {
    if (!bug) return
    setSaving(true)
    setError(null)
    const supabase = getSupabaseClient()
    if (!supabase) return

    try {
      const { error: updateError } = await supabase
        .from('bugs')
        .update({
          title,
          error_log: errorLog,
          solution,
          tech,
          status,
        })
        .eq('id', bug.id)

      if (updateError) throw updateError
      router.refresh()
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : 'Erreur lors de la sauvegarde')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400">Chargement...</div>
  if (error || !bug) return (
    <div className="min-h-screen bg-gray-900 p-8 text-center text-red-400">
      {error || 'Bug introuvable'}
      <Link href="/dashboard" className="block mt-4 text-blue-500">Retour</Link>
    </div>
  )

  const sortedTechs = Object.keys(techIcons).sort()

  return (
    <div className="min-h-screen bg-gray-900 text-white py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">

        <Link href="/dashboard" className="text-gray-400 hover:text-white mb-4 inline-flex items-center gap-2">← Retour au dashboard</Link>

        <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-700 overflow-hidden p-6 space-y-6">

          {/* Titre */}
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full text-2xl font-bold bg-gray-700 p-2 rounded-lg text-white"
          />

          {/* Meta */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-400">
            <span className="flex items-center gap-1">🐛 ID: {bug.id}</span>
            <span className="flex items-center gap-1">📅 {formatDate(bug.created_at)}</span>

            {/* Tech editable */}
            <Listbox value={tech} onChange={setTech}>
              <div className="relative">
                <Listbox.Button className="flex items-center gap-1 bg-gray-700 px-2 py-1 rounded-lg">
                  💻 {tech} {techIcons[tech]}
                </Listbox.Button>
                <Listbox.Options className="absolute mt-1 w-full bg-gray-700 rounded-lg max-h-60 overflow-auto z-10">
                  {sortedTechs.map(t => (
                    <Listbox.Option key={t} value={t} className="cursor-pointer px-4 py-2 flex justify-between items-center hover:bg-gray-600">
                      {t} {techIcons[t]}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </div>
            </Listbox>

            {/* Status editable */}
            <select
              value={status}
              onChange={e => setStatus(e.target.value as Status)}
              className="bg-gray-700 text-white px-2 py-1 rounded-lg"
            >
              {statuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Logs */}
          <div>
            <label className="block mb-1 font-semibold">Logs / Description</label>
            <textarea
              value={errorLog}
              onChange={e => setErrorLog(e.target.value)}
              rows={6}
              className="w-full bg-gray-700 p-2 rounded-lg text-white font-mono"
            />
          </div>

          {/* Solution */}
          <div>
            <label className="block mb-1 font-semibold">Solution</label>
            <textarea
              value={solution}
              onChange={e => setSolution(e.target.value)}
              rows={4}
              className="w-full bg-gray-700 p-2 rounded-lg text-white"
            />
          </div>

          {/* Buttons */}
          {error && <p className="text-red-400">{error}</p>}
          <div className="flex gap-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 bg-blue-600 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              {saving ? 'Sauvegarde...' : 'Enregistrer'}
            </button>
            <Link
              href="/dashboard"
              className="flex-1 text-center border border-gray-600 rounded-lg py-2 text-gray-200 hover:bg-gray-700 transition"
            >
              Annuler
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
