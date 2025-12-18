'use client'

import { useEffect, useState } from 'react'
import { getSupabaseClient } from '../../lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { BiArrowToRight, BiSearch, BiPlus } from 'react-icons/bi'
import { SiReact, SiNodedotjs, SiPython, SiNextdotjs, SiJavascript, SiTypescript, SiPhp, SiCplusplus, SiRuby, SiGo, SiRust, SiHtml5, SiCss3, SiTailwindcss, SiSass, SiAngular, SiDjango, SiFlask, SiSpring, SiLaravel, SiExpress, SiPostgresql, SiMysql, SiMongodb, SiFlutter, SiVuedotjs, SiJbl } from 'react-icons/si'

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
  const [filterTech, setFilterTech] = useState<string>('all')
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

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

    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        router.push('/')
      }
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
    } finally {
      router.push('/')
    }
  }

  const confirmLogout = () => {
    setShowLogoutConfirm(true)
  }

  const cancelLogout = () => {
    setShowLogoutConfirm(false)
  }

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
    .filter(bug => filterTech === 'all' || bug.tech === filterTech)
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

  // Extraire toutes les technos uniques
  const allTechnos = Array.from(new Set(bugs.map(bug => bug.tech).filter(Boolean))) as string[]

  const techIcons: Record<string, React.ReactNode> = {
    React: <SiReact className="text-blue-400 w-4 h-4" />,
    'Next.js': <SiNextdotjs className="text-white w-4 h-4" />,
    'Node.js': <SiNodedotjs className="text-green-400 w-4 h-4" />,
    Python: <SiPython className="text-yellow-400 w-4 h-4" />,
    JavaScript: <SiJavascript className="text-yellow-300 w-4 h-4" />,
    TypeScript: <SiTypescript className="text-blue-500 w-4 h-4" />,
    PHP: <SiPhp className="text-purple-500 w-4 h-4" />,
    Java: <SiJbl className="text-orange-500 w-4 h-4" />,
    'C++': <SiCplusplus className="text-blue-600 w-4 h-4" />,
    Ruby: <SiRuby className="text-red-500 w-4 h-4" />,
    Go: <SiGo className="text-blue-500 w-4 h-4" />,
    Rust: <SiRust className="text-orange-700 w-4 h-4" />,
    Flutter: <SiFlutter className="text-blue-600 w-4 h-4" />,
    HTML: <SiHtml5 className="text-orange-500 w-4 h-4" />,
    CSS: <SiCss3 className="text-blue-500 w-4 h-4" />,
    Tailwind: <SiTailwindcss className="text-blue-400 w-4 h-4" />,
    Sass: <SiSass className="text-pink-500 w-4 h-4" />,
    Angular: <SiAngular className="text-red-600 w-4 h-4" />,
    Vue: <SiVuedotjs className="text-green-600 w-4 h-4" />,
    Django: <SiDjango className="text-green-800 w-4 h-4" />,
    Flask: <SiFlask className="text-white w-4 h-4" />,
    Spring: <SiSpring className="text-green-500 w-4 h-4" />,
    Laravel: <SiLaravel className="text-red-600 w-4 h-4" />,
    Express: <SiExpress className="text-gray-200 w-4 h-4" />,
    PostgreSQL: <SiPostgresql className="text-blue-700 w-4 h-4" />,
    MySQL: <SiMysql className="text-blue-500 w-4 h-4" />,
    MongoDB: <SiMongodb className="text-green-600 w-4 h-4" />,
    Other: <span className="w-4 h-4 flex items-center justify-center text-xs">🛠️</span>,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-md border-b border-gray-700/50 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo et titre */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-2xl shadow-lg">
                🐛
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Bug Memo
                </h1>
                <p className="text-xs text-gray-400 hidden md:block">
                  Gérez vos bugs efficacement
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
              {userEmail && (
                <span className="hidden md:block text-sm text-gray-300 bg-gray-800 px-3 py-1.5 rounded-full border border-gray-700">
                  {userEmail}
                </span>
              )}
              <Link
                href="/bugs/create"
                className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl transition-all shadow-lg hover:shadow-green-500/20 font-medium text-sm sm:text-base"
              >
                <BiPlus className="w-5 h-5" />
                <span className="hidden sm:inline">Nouveau bug</span>
              </Link>
              <button
                onClick={confirmLogout}
                className="bg-gray-800 hover:bg-red-600/20 border border-gray-700 hover:border-red-600 p-2 sm:p-2.5 rounded-lg transition-all"
                title="Se déconnecter"
              >
                <BiArrowToRight className="w-5 h-5 text-gray-300" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Stats bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-gradient-to-br from-gray-800 to-gray-800/50 backdrop-blur-sm rounded-xl p-4 sm:p-5 border border-gray-700/50 shadow-lg">
            <p className="text-xs sm:text-sm text-gray-400 mb-1">Total bugs</p>
            <p className="text-2xl sm:text-3xl font-bold text-white">{bugs.length}</p>
          </div>
          <div className="bg-gradient-to-br from-gray-800 to-gray-800/50 backdrop-blur-sm rounded-xl p-4 sm:p-5 border border-gray-700/50 shadow-lg">
            <p className="text-xs sm:text-sm text-gray-400 mb-1">Résolus</p>
            <p className="text-2xl sm:text-3xl font-bold text-green-400">
              {bugs.filter(b => b.status?.toLowerCase() === 'résolu').length}
            </p>
          </div>
          <div className="bg-gradient-to-br from-gray-800 to-gray-800/50 backdrop-blur-sm rounded-xl p-4 sm:p-5 border border-gray-700/50 shadow-lg col-span-2 sm:col-span-1">
            <p className="text-xs sm:text-sm text-gray-400 mb-1">En cours</p>
            <p className="text-2xl sm:text-3xl font-bold text-orange-400">
              {bugs.filter(b => b.status?.toLowerCase() !== 'résolu').length}
            </p>
          </div>
        </div>

        {/* Barre de recherche et filtres */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-800/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 mb-6 border border-gray-700/50 shadow-xl">
          <div className="flex flex-col gap-3 sm:gap-4">
            {/* Ligne 1 : Recherche */}
            <div className="relative flex-1">
              <BiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher un bug, une erreur, une solution..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-500 border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
              />
            </div>
            
            {/* Ligne 2 : Filtres */}
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="flex-1 px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer text-sm sm:text-base"
              >
                <option value="recent" className="bg-gray-800">📅 Plus récents</option>
                <option value="oldest" className="bg-gray-800">⏰ Plus anciens</option>
                <option value="title" className="bg-gray-800">🔤 Titre (A-Z)</option>
              </select>
              
              <select
                value={filterTech}
                onChange={(e) => setFilterTech(e.target.value)}
                className="flex-1 px-4 py-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all cursor-pointer text-sm sm:text-base"
              >
                <option value="all" className="bg-gray-800">Toutes les technos</option>
                {allTechnos.sort().map(tech => (
                  <option key={tech} value={tech} className="bg-gray-800">
                    {tech}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Filtres actifs */}
          {(searchTerm || filterTech !== 'all') && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <p className="text-sm text-gray-400">
                {filteredAndSortedBugs.length} résultat(s)
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs hover:bg-blue-500/30 transition"
                >
                  <span>🔍 "{searchTerm}"</span>
                  <span className="ml-1">×</span>
                </button>
              )}
              {filterTech !== 'all' && (
                <button
                  onClick={() => setFilterTech('all')}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 bg-purple-500/20 text-purple-400 rounded-full text-xs hover:bg-purple-500/30 transition"
                >
                  {techIcons[filterTech] || techIcons.Other}
                  <span>{filterTech}</span>
                  <span className="ml-1">×</span>
                </button>
              )}
              <button
                onClick={() => {
                  setSearchTerm('')
                  setFilterTech('all')
                }}
                className="text-xs text-gray-500 hover:text-gray-300 underline transition"
              >
                Réinitialiser
              </button>
            </div>
          )}
        </div>

        {/* Liste des bugs */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 sm:py-20">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-400">Chargement des bugs...</p>
          </div>
        ) : filteredAndSortedBugs.length === 0 ? (
          <div className="bg-gradient-to-br from-gray-800 to-gray-800/50 backdrop-blur-sm rounded-xl p-8 sm:p-12 text-center border border-gray-700/50 shadow-xl">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-5xl">🐛</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold mb-2 text-white">
              {searchTerm ? 'Aucun résultat' : 'Aucun bug enregistré'}
            </h3>
            <p className="text-gray-400 mb-6 text-sm sm:text-base">
              {searchTerm 
                ? 'Essayez avec d\'autres mots-clés' 
                : 'Commencez par créer votre premier bug'}
            </p>
            {!searchTerm && (
              <Link
                href="/bugs/create"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-lg hover:shadow-blue-500/20"
              >
                <BiPlus className="w-5 h-5" />
                Créer mon premier bug
              </Link>
            )}
          </div>
        ) : (
          <div className="grid gap-3 sm:gap-4">
            {filteredAndSortedBugs.map((bug) => {
              const isResolved = bug.status?.toLowerCase() === 'résolu'
              return (
                <div 
                  key={bug.id} 
                  className="group bg-gradient-to-br from-gray-800 to-gray-800/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-gray-700/50 shadow-lg hover:shadow-xl hover:border-gray-600 transition-all duration-300"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <Link href={`/bugs/${bug.id}`} className="flex-1 min-w-0 space-y-3">
                      {/* Titre */}
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${isResolved ? 'bg-green-400 shadow-lg shadow-green-400/50' : 'bg-orange-400 shadow-lg shadow-orange-400/50'}`}></div>
                        <h3 className="text-base sm:text-lg font-semibold text-white group-hover:text-blue-400 transition line-clamp-2">
                          {bug.title}
                        </h3>
                      </div>

                      {/* Log d'erreur */}
                      <p className="text-gray-300 text-sm line-clamp-2 pl-5 bg-gray-900/30 rounded-lg p-3 border border-gray-700/30">
                        {bug.error_log}
                      </p>

                      {/* Métadonnées */}
                      <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs pl-5">
                        <span className="flex items-center gap-1.5 text-gray-400">
                          <span>📅</span>
                          <span className="hidden sm:inline">{formatDate(bug.created_at)}</span>
                          <span className="sm:hidden">{new Date(bug.created_at ?? '').toLocaleDateString('fr-FR')}</span>
                        </span>
                        <span className={`flex items-center gap-1.5 px-2 py-1 rounded-full ${isResolved ? 'bg-green-500/10 text-green-400' : 'bg-orange-500/10 text-orange-400'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isResolved ? 'bg-green-400' : 'bg-orange-400'}`}></span>
                          {bug.status ?? 'En attente'}
                        </span>
                        {bug.tech && (
                          <span className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-blue-500/10 text-blue-400">
                            {techIcons[bug.tech] || techIcons.Other}
                            {bug.tech}
                          </span>
                        )}
                      </div>
                    </Link>

                    {/* Bouton d'action */}
                    <Link
                      href={`/bugs/${bug.id}`}
                      className="flex-shrink-0 px-5 sm:px-8 py-2 sm:py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-full transition-all font-medium text-sm shadow-lg hover:shadow-blue-500/20 text-center"
                    >
                      Voir détails
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      {/* Modal de confirmation de déconnexion */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-800 to-gray-800/50 rounded-2xl p-6 sm:p-8 max-w-md w-full border border-gray-700/50 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <BiArrowToRight className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                Confirmer la déconnexion
              </h3>
              <p className="text-gray-400 text-sm sm:text-base">
                Êtes-vous sûr de vouloir vous déconnecter ?
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={cancelLogout}
                className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all font-medium"
              >
                Annuler
              </button>
              <button
                onClick={handleSignOut}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg transition-all font-medium shadow-lg hover:shadow-red-500/20"
              >
                Se déconnecter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}