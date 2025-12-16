'use client'

import { useEffect, useState } from 'react'
import { getSupabaseClient } from '../../lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { BiArrowToRight } from 'react-icons/bi'

type Bug = {
  id: string
  title: string
  error_log: string
  solution: string | null
  created_at: string | null
  status?: string | null
  tech?: string | null
  tags?: string[] | null
  user_id?: string | null
}

export default function DashboardPage() {
  const router = useRouter()
  const [bugs, setBugs] = useState<Bug[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'recent' | 'oldest' | 'title'>('recent')
  const [userEmail, setUserEmail] = useState<string | null>(null)

  const supabase = getSupabaseClient()!

  // Initialisation
  useEffect(() => {
    const init = async () => {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error || !session?.user) {
        router.push('/')
        return
      }
      setUserEmail(session.user.email ?? null)
      fetchBugs()
    }
    init()

    // Écoute les changements de session (déconnexion / connexion)
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        router.push('/')
      }
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  // Déconnexion
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
    } finally {
      router.push('/')
    }
  }

  // Récupération des bugs
  const fetchBugs = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error: fetchError } = await supabase
        .from('bugs')
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

  const filteredAndSortedBugs = bugs
    .filter(bug =>
      bug.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bug.error_log.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (bug.solution?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.created_at ?? '').getTime() - new Date(a.created_at ?? '').getTime()
        case 'oldest':
          return new Date(a.created_at ?? '').getTime() - new Date(b.created_at ?? '').getTime()
        case 'title':
          return a.title.localeCompare(b.title)
        default:
          return 0
      }
    })

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-'
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Bug Memo</h1>
            <p className="text-gray-100 mt-1 text-sm">Conserver et retrouver facilement les bugs rencontrés</p>
          </div>
          <div className="flex items-center gap-6">
            {userEmail && <span className="text-gray-200 font-medium">{userEmail}</span>}
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 bg-red-700 px-4 py-2 rounded-lg hover:bg-red-700 transition">
              <BiArrowToRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Dashboard */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Recherche et tri */}
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
              className="px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            >
              <option value="recent">Plus récents</option>
              <option value="oldest">Plus anciens</option>
              <option value="title">Titre (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <p className="text-gray-400">Chargement des bugs...</p>
          </div>
        ) : filteredAndSortedBugs.length === 0 ? (
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg p-12 text-center border border-gray-700 shadow">
            <div className="text-6xl mb-4">🐛</div>
            <h3 className="text-xl font-semibold mb-2">Aucun bug trouvé</h3>
            <p className="text-gray-400 mb-6">Commencez par créer votre premier bug</p>
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
            {filteredAndSortedBugs.map((bug) => {
              const isResolved = bug.status?.toLowerCase() === 'résolu'
              return (
                <div key={bug.id} className="bg-gray-800/80 backdrop-blur-sm rounded-lg p-6 border border-gray-700 shadow hover:shadow-lg transition">
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
                        <span className="flex items-center gap-1">
                          <span
                            className={`w-2 h-2 rounded-full inline-block ${isResolved ? 'bg-green-400' : 'bg-orange-400'}`}
                          ></span>
                          {bug.status ?? 'En attente'}
                        </span>
                      </div>
                    </Link>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/bugs/${bug.id}`}
                        className="px-8 py-2 bg-blue-800 text-white rounded-3xl hover:bg-blue-700 transition font-medium text-sm"
                      >
                        Voir
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
