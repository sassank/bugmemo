'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { getSupabaseClient } from '../../../lib/supabase'
import { useRouter } from 'next/navigation'
import type { TablesInsert } from '../../../lib/database.types'

export default function CreateBugPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [errorLog, setErrorLog] = useState('')
  const [solution, setSolution] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
      // Récupérer l'utilisateur courant
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setError('Utilisateur non connecté')
        setLoading(false)
        return
      }

      const newBug: TablesInsert<'bugs'> = {
        title: title.trim(),
        error_log: errorLog.trim(),
        solution: solution.trim(),
        user_id: user.id, // obligatoire
      }

      const { error: insertError } = await supabase.from('bugs').insert([newBug])
      if (insertError) throw insertError

      router.push('/dashboard')
    } catch (err) {
      console.error('Erreur lors de la création:', err)
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
      setLoading(false)
    }
  }

  const handleCancel = () => {
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-white mb-4 flex items-center gap-2 transition"
          >
            ← Retour au dashboard
          </button>
          <h1 className="text-3xl font-bold">Loguer un nouveau bug</h1>
          <p className="text-gray-400 mt-2">Documentez un bug et sa solution pour référence future</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/80 border border-red-700 rounded-lg">
            <div className="flex items-start gap-3">
              <span className="text-red-400 text-xl">⚠️</span>
              <div>
                <h3 className="font-semibold text-red-300">Erreur</h3>
                <p className="text-red-200 text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-700 p-6 space-y-6"
        >
          {/* Title Field */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-200 mb-2">
              Titre du bug
            </label>
            <input
              id="title"
              type="text"
              placeholder="Ex: Erreur 404 sur la page de connexion"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength={200}
              className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
            <p className="text-xs text-gray-400 mt-1">{title.length}/200 caractères</p>
          </div>

          {/* Error Log Field */}
          <div>
            <label htmlFor="errorLog" className="block text-sm font-medium text-gray-200 mb-2">
              Logs / Description de l'erreur
            </label>
            <textarea
              id="errorLog"
              placeholder="Collez ici les logs d'erreur ou décrivez le problème rencontré..."
              value={errorLog}
              onChange={(e) => setErrorLog(e.target.value)}
              required
              rows={6}
              className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

          {/* Solution Field */}
          <div>
            <label htmlFor="solution" className="block text-sm font-medium text-gray-200 mb-2">
              Solution
            </label>
            <textarea
              id="solution"
              placeholder="Décrivez la solution qui a fonctionné pour résoudre ce bug..."
              value={solution}
              onChange={(e) => setSolution(e.target.value)}
              required
              rows={6}
              className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-700/40 disabled:bg-blue-400 disabled:cursor-not-allowed transition"
            >
              {loading ? 'Création...' : 'Créer le bug'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="px-6 py-3 border border-gray-600 rounded-lg font-medium text-gray-200 hover:bg-gray-700 focus:ring-4 focus:ring-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
