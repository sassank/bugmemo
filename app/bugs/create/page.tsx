'use client'

import { useState } from 'react'
import { getSupabaseClient } from '../../../lib/supabase'
import { useRouter } from 'next/navigation'
import type { TablesInsert } from '../../../lib/database.types'
import { Listbox } from '@headlessui/react'
import {
  SiReact, SiNodedotjs, SiPython, SiNextdotjs,
  SiJavascript, SiTypescript, SiPhp, SiCplusplus, SiRuby, SiGo, SiRust,
  SiHtml5, SiCss3, SiTailwindcss, SiSass, SiAngular, SiDjango, SiFlask,
  SiSpring, SiLaravel, SiExpress, SiPostgresql, SiMysql, SiMongodb,
  SiFlutter, SiVuedotjs, SiJbl
} from 'react-icons/si'

type Status = 'En cours' | 'Résolu'
type Tech =
  | 'React' | 'Next.js' | 'Node.js' | 'Python' | 'JavaScript' | 'TypeScript'
  | 'PHP' | 'Java' | 'C++' | 'C#' | 'Ruby' | 'Go' | 'Rust'
  | 'HTML' | 'CSS' | 'Tailwind' | 'Sass' | 'Angular' | 'Vue'
  | 'Django' | 'Flask' | 'Flutter' | 'Spring' | 'Laravel' | 'Express'
  | 'PostgreSQL' | 'MySQL' | 'MongoDB' | 'Other'

const techIcons: Record<Tech, React.ReactNode> = {
  React: <SiReact className="text-blue-400 w-5 h-5" />,
  'Next.js': <SiNextdotjs className="text-black w-5 h-5" />,
  'Node.js': <SiNodedotjs className="text-green-400 w-5 h-5" />,
  Python: <SiPython className="text-yellow-400 w-5 h-5" />,
  JavaScript: <SiJavascript className="text-yellow-300 w-5 h-5" />,
  TypeScript: <SiTypescript className="text-blue-500 w-5 h-5" />,
  PHP: <SiPhp className="text-purple-500 w-5 h-5" />,
  Java: <SiJbl className="text-purple-500 w-5 h-5" />,
  'C++': <SiCplusplus className="text-blue-600 w-5 h-5" />,
  'C#': <span className="text-purple-700 font-bold w-5 h-5 flex items-center justify-center">C</span>,
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

export default function CreateBugPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [errorLog, setErrorLog] = useState('')
  const [solution, setSolution] = useState('')
  const [tech, setTech] = useState<Tech>('React')
  const [status, setStatus] = useState<Status>('En cours')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Liste triée des technologies
  const sortedTechs = Object.keys(techIcons).sort() as Tech[]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = getSupabaseClient()
    if (!supabase) {
      setError('Erreur de connexion à la base de données')
      setLoading(false)
      return
    }

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Utilisateur non connecté')

      const newBug: TablesInsert<'bugs'> = {
        title: title.trim(),
        error_log: errorLog.trim(),
        solution: solution.trim(),
        user_id: user.id,
        tags: [tech],
        tech,     // nouveau champ tech
        status,   // nouveau champ status
      }

      const { error: insertError } = await supabase.from('bugs').insert([newBug])
      if (insertError) throw insertError

      router.push('/dashboard')
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
      setLoading(false)
    }
  }

  const handleCancel = () => router.push('/dashboard')

  return (
    <div className="min-h-screen bg-gray-900 text-white py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold">Loguer un nouveau bug</h1>

        {error && <div className="p-4 bg-red-900/80 border border-red-700 rounded-lg">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Titre */}
          <div className="bg-gray-800 rounded-xl p-4 flex items-center gap-4">
            <span className="text-xl">🐛</span>
            <input
              type="text"
              placeholder="Titre du bug"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="bg-gray-800 flex-1 text-white placeholder-gray-400 outline-none"
            />
          </div>

          {/* Tech / Langage */}
          <div className="bg-gray-800 rounded-xl p-4">
            <span className="text-xl mb-2 block">💻 Technologie</span>
            <Listbox value={tech} onChange={setTech}>
              <div className="relative">
                <Listbox.Button className="w-full bg-gray-800 text-white rounded-lg p-2 text-left flex justify-between items-center">
                  {tech} {techIcons[tech]}
                </Listbox.Button>
                <Listbox.Options className="absolute mt-1 w-full bg-gray-700 rounded-lg max-h-60 overflow-auto z-10">
                  {sortedTechs.map((t) => (
                    <Listbox.Option
                      key={t}
                      value={t}
                      className={({ active }) =>
                        `cursor-pointer select-none px-4 py-2 flex justify-between items-center ${
                          active ? 'bg-gray-600' : ''
                        }`
                      }
                    >
                      {t} {techIcons[t]}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </div>
            </Listbox>
          </div>

          {/* Logs */}
          <div className="bg-gray-800 rounded-xl p-4">
            <label className="block mb-1">Code d'erreur</label>
            <textarea
              value={errorLog}
              onChange={(e) => setErrorLog(e.target.value)}
              rows={4}
              className="w-full bg-gray-800 text-white placeholder-gray-400 rounded-lg p-2 outline-none font-mono"
            />
          </div>

          {/* Status */}
          <span className="text-xl">{status === 'En cours' ? '⏳' : '✅'}</span>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as Status)}
            className="bg-gray-800 text-white outline-none flex-1"
          >
            <option value="En cours">En cours</option>
            <option value="Résolu">Résolu</option>
          </select>

          {/* Solution */}
          <div className="bg-gray-800 rounded-xl p-4">
            <label className="block mb-1">Solution</label>
            <textarea
              value={solution}
              onChange={(e) => setSolution(e.target.value)}
              rows={4}
              className="w-full bg-gray-800 text-white placeholder-gray-400 rounded-lg p-2 outline-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-green-600 py-3 rounded-lg font-medium hover:bg-green-700 transition"
            >
              {loading ? 'Création...' : 'Créer le bug'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="px-6 py-3 border border-gray-600 rounded-lg text-gray-200 hover:bg-gray-700 transition"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
