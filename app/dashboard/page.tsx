'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { getSupabaseClient } from '../../lib/supabase'
import Link from 'next/link'

type Bug = {
  id: number
  title: string
  error_log: string
  solution: string
  created_at: string
}

export default function DashboardPage() {
  const [bugs, setBugs] = useState<Bug[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'recent' | 'oldest' | 'title'>('recent')

  useEffect(() => {
    fetchBugs()
  }, [])

  const fetchBugs = async () => {
    setLoading(true)
    setError(null)

    const supabase = getSupabaseClient()
    if (!supabase) {
      setError('Erreur de connexion à la base de données')
      setLoading(false)
      return
    }

    try {
      const { data, error: fetchError } = await (supabase
        .from('bugs') as any)
        .select('*')
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError
      setBugs(data || [])
    } catch (err) {
      console.error('Erreur lors du chargement:', err)
      setError(err instanceof Error ? err.message : 'Erreur de chargement')
    } finally {
      setLoading(false)
    }
  }

  const deleteBug = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce bug ?')) return

    const supabase = getSupabaseClient()
    if (!supabase) return

    try {
      const { error: deleteError } = await (supabase
        .from('bugs') as any)
        .delete()
        .eq('id', id)

      if (deleteError) throw deleteError
      setBugs(bugs.filter(bug => bug.id !== id))
    } catch (err) {
      console.error('Erreur lors de la suppression:', err)
      alert('Erreur lors de la suppression du bug')
    }
  }

  // Filtrage et tri
  const filteredAndSortedBugs = bugs
    .filter(bug =>
      bug.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bug.error_log.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bug.solution.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        case 'title':
          return a.title.localeCompare(b.title)
        default:
          return 0
      }
    })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800/90 backdrop-blur-sm shadow-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Bug Memo</h1>
            <p className="text-gray-100 mt-1">Conserver et retrouver facilement les bugs rencontrés</p>
          </div>
          <Link
            href="/bugs/create"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-700/40 transition shadow-sm"
          >
            <span className="text-xl">+</span>
            Nouveau bug
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg p-6 flex justify-between items-center border border-gray-700 shadow">
            <div>
              <p className="text-sm text-gray-400 font-medium">Total des bugs</p>
              <p className="text-3xl font-bold mt-1 text-white">{bugs.length}</p>
            </div>
            <div className="bg-blue-00 rounded-full p-3">
              <span className="text-2xl">🐛</span>
            </div>
          </div>

          <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg p-6 flex justify-between items-center border border-gray-700 shadow">
            <div>
              <p className="text-sm text-gray-400 font-medium">Résolus</p>
              <p className="text-3xl font-bold mt-1 text-green-400">{bugs.length}</p>
            </div>
            <div className="bg-green-600/30 rounded-full p-3">
              <span className="text-2xl">✅</span>
            </div>
          </div>

          <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg p-6 flex justify-between items-center border border-gray-700 shadow">
            <div>
              <p className="text-sm text-gray-400 font-medium">Cette semaine</p>
              <p className="text-3xl font-bold mt-1 text-purple-400">
                {bugs.filter(bug => {
                  const weekAgo = new Date()
                  weekAgo.setDate(weekAgo.getDate() - 7)
                  return new Date(bug.created_at) > weekAgo
                }).length}
              </p>
            </div>
            <div className="bg-purple-600/30 rounded-full p-3">
              <span className="text-2xl">📅</span>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg p-4 mb-6 border border-gray-700 shadow">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="🔍 Rechercher un bug..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            >
              <option value="recent">Plus récents</option>
              <option value="oldest">Plus anciens</option>
              <option value="title">Titre (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/80 border border-red-700 rounded-lg text-red-300">
            <p>{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <p className="text-gray-400 font-medium">Chargement des bugs...</p>
            </div>
          </div>
        ) : filteredAndSortedBugs.length === 0 ? (
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg p-12 text-center border border-gray-700 shadow">
            <div className="text-6xl mb-4">🐛</div>
            <h3 className="text-xl font-semibold mb-2">Aucun bug trouvé</h3>
            <p className="text-gray-400 mb-6">Commencez par créer votre premier bug pour le documenter</p>
            <Link
              href="/bugs/create"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              <span className="text-xl">+</span>
              Créer mon premier bug
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredAndSortedBugs.map((bug) => (
              <div
                key={bug.id}
                className="bg-gray-800/80 backdrop-blur-sm rounded-lg p-6 border border-gray-700 shadow hover:shadow-lg transition"
              >
                <div className="flex items-start justify-between gap-4">
                  <Link href={`/bugs/${bug.id}`} className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-white hover:text-blue-400 transition mb-2 line-clamp-2">
                      {bug.title}
                    </h3>
                    <p className="text-gray-300 text-sm line-clamp-2 mb-3">
                      {bug.error_log}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span className="flex items-center gap-1">📅 {formatDate(bug.created_at)}</span>
                      <span className="flex items-center gap-1">💡 Solution disponible</span>
                    </div>
                  </Link>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/bugs/${bug.id}`}
                      className="p-2 text-blue-400 hover:bg-blue-700/20 rounded-lg transition"
                      title="Voir les détails"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </Link>
                    <button
                      onClick={() => deleteBug(bug.id)}
                      className="p-2 text-red-500 hover:bg-red-700/20 rounded-lg transition"
                      title="Supprimer"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
