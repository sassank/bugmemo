'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { getSupabaseClient } from '../../../lib/supabase'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { SiReact, SiNodedotjs, SiPython, SiNextdotjs, SiJavascript, SiTypescript, SiPhp, SiCplusplus, SiRuby, SiGo, SiRust, SiHtml5, SiCss3, SiTailwindcss, SiSass, SiAngular, SiDjango, SiFlask, SiSpring, SiLaravel, SiExpress, SiPostgresql, SiMysql, SiMongodb, SiFlutter, SiVuedotjs, SiJbl } from 'react-icons/si'
import { BiArrowBack, BiCopy, BiCheck } from 'react-icons/bi'

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
  'Next.js': <SiNextdotjs className="text-white w-5 h-5" />,
  'Node.js': <SiNodedotjs className="text-green-400 w-5 h-5" />,
  Python: <SiPython className="text-yellow-400 w-5 h-5" />,
  JavaScript: <SiJavascript className="text-yellow-300 w-5 h-5" />,
  TypeScript: <SiTypescript className="text-blue-500 w-5 h-5" />,
  PHP: <SiPhp className="text-purple-500 w-5 h-5" />,
  Java: <SiJbl className="text-orange-500 w-5 h-5" />,
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
  Flask: <SiFlask className="text-white w-5 h-5" />,
  Spring: <SiSpring className="text-green-500 w-5 h-5" />,
  Laravel: <SiLaravel className="text-red-600 w-5 h-5" />,
  Express: <SiExpress className="text-gray-200 w-5 h-5" />,
  PostgreSQL: <SiPostgresql className="text-blue-700 w-5 h-5" />,
  MySQL: <SiMysql className="text-blue-500 w-5 h-5" />,
  MongoDB: <SiMongodb className="text-green-600 w-5 h-5" />,
  Other: <span className="w-5 h-5 flex items-center justify-center">🛠️</span>,
}

export default function BugDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [bug, setBug] = useState<Bug | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copiedError, setCopiedError] = useState(false)
  const [copiedSolution, setCopiedSolution] = useState(false)

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

  const copyToClipboard = async (text: string, type: 'error' | 'solution') => {
    try {
      await navigator.clipboard.writeText(text)
      if (type === 'error') {
        setCopiedError(true)
        setTimeout(() => setCopiedError(false), 2000)
      } else {
        setCopiedSolution(true)
        setTimeout(() => setCopiedSolution(false), 2000)
      }
    } catch (err) {
      console.error('Erreur lors de la copie:', err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4 mx-auto"></div>
          <p className="text-gray-400">Chargement du bug...</p>
        </div>
      </div>
    )
  }

  if (error || !bug) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-8">
        <div className="bg-gradient-to-br from-gray-800 to-gray-800/50 rounded-xl p-8 text-center border border-gray-700/50 shadow-xl max-w-md">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-xl font-semibold text-red-400 mb-4">{error || 'Bug introuvable'}</h2>
          <Link 
            href="/dashboard" 
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg transition"
          >
            <BiArrowBack />
            Retour au dashboard
          </Link>
        </div>
      </div>
    )
  }

  const isResolved = bug.status?.toLowerCase() === 'résolu'

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* En-tête avec bouton retour */}
        <div className="flex items-center justify-between">
          <Link 
            href="/dashboard" 
            className="flex items-center gap-2 text-gray-400 hover:text-white transition group"
          >
            <BiArrowBack className="group-hover:-translate-x-1 transition-transform" />
            <span>Retour au dashboard</span>
          </Link>
        </div>

        {/* Carte principale */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 overflow-hidden">
          
          {/* En-tête du bug */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-700/50 p-6 sm:p-8 border-b border-gray-700/50">
            <div className="flex items-start gap-4 mb-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-white flex-1">{bug.title}</h1>
            </div>
            
            {/* Métadonnées */}
            <div className="flex flex-wrap gap-3 sm:gap-4 text-sm">
              <span className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${isResolved ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'}`}>
                <span className={`w-2 h-2 rounded-full ${isResolved ? 'bg-green-400' : 'bg-orange-400'}`}></span>
                {bug.status}
              </span>
              
              <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/20 text-blue-400">
                {techIcons[bug.tech] || techIcons.Other}
                {bug.tech}
              </span>
              
              <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-700/50 text-gray-400">
                📅 {formatDate(bug.created_at)}
              </span>
            </div>
          </div>

          {/* Contenu */}
          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Section Erreur */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <span className="text-2xl">⚠️</span>
                  Code d'erreur
                </h2>
                <button
                  onClick={() => copyToClipboard(bug.error_log, 'error')}
                  className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition text-sm"
                  title="Copier l'erreur"
                >
                  {copiedError ? (
                    <>
                      <BiCheck className="w-4 h-4" />
                      <span className="hidden sm:inline">Copié !</span>
                    </>
                  ) : (
                    <>
                      <BiCopy className="w-4 h-4" />
                      <span className="hidden sm:inline">Copier</span>
                    </>
                  )}
                </button>
              </div>
              
              <div className="bg-gradient-to-br from-red-500/5 to-red-500/10 border-l-4 border-red-500 rounded-lg p-4 sm:p-6">
                <pre className="text-red-100 text-sm sm:text-base font-mono whitespace-pre-wrap break-words overflow-x-auto">
                  {bug.error_log}
                </pre>
              </div>
            </div>

            {/* Section Solution */}
            {bug.solution ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <span className="text-2xl">✅</span>
                    Solution trouvée
                  </h2>
                  <button
                    onClick={() => copyToClipboard(bug.solution!, 'solution')}
                    className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-lg transition text-sm"
                    title="Copier la solution"
                  >
                    {copiedSolution ? (
                      <>
                        <BiCheck className="w-4 h-4" />
                        <span className="hidden sm:inline">Copié !</span>
                      </>
                    ) : (
                      <>
                        <BiCopy className="w-4 h-4" />
                        <span className="hidden sm:inline">Copier</span>
                      </>
                    )}
                  </button>
                </div>
                
                <div className="bg-gradient-to-br from-green-500/5 to-green-500/10 border-l-4 border-green-500 rounded-lg p-4 sm:p-6">
                  <pre className="text-green-100 text-sm sm:text-base whitespace-pre-wrap break-words">
                    {bug.solution}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-400">
                  <span className="text-2xl">🔍</span>
                  Solution
                </h2>
                <div className="bg-gray-700/30 border border-dashed border-gray-600 rounded-lg p-6 text-center">
                  <p className="text-gray-400 italic">Aucune solution enregistrée pour le moment</p>
                </div>
              </div>
            )}

            {/* ID du bug (pour référence) */}
            <div className="pt-4 border-t border-gray-700/50">
              <p className="text-xs text-gray-500">
                <span className="font-mono">ID: {bug.id}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}