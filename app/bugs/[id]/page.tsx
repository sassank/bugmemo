'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { getSupabaseClient } from '../../../lib/supabase'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

type Bug = {
  id: number
  title: string
  error_log: string
  solution: string
  created_at: string
}

export default function BugDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [bug, setBug] = useState<Bug | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

    try {
      const { data, error: fetchError } = await (supabase
        .from('bugs') as any)
        .select('*')
        .eq('id', params.id)
        .single()

      if (fetchError) throw fetchError
      setBug(data)
    } catch (err) {
      console.error('Erreur lors du chargement:', err)
      setError(err instanceof Error ? err.message : 'Erreur de chargement')
    } finally {
      setLoading(false)
    }
  }

  const deleteBug = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce bug ?')) return

    const supabase = getSupabaseClient()
    if (!supabase) return

    try {
      const { error: deleteError } = await (supabase
        .from('bugs') as any)
        .delete()
        .eq('id', params.id)

      if (deleteError) throw deleteError
      router.push('/dashboard')
    } catch (err) {
      console.error('Erreur lors de la suppression:', err)
      alert('Erreur lors de la suppression du bug')
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-gray-600 font-medium">Chargement du bug...</p>
        </div>
      </div>
    )
  }

  if (error || !bug) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <span className="text-4xl mb-4 block">⚠️</span>
            <h2 className="text-xl font-semibold text-red-900 mb-2">Erreur</h2>
            <p className="text-red-700 mb-4">{error || 'Bug introuvable'}</p>
            <Link
              href="/dashboard"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Retour au dashboard
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="text-gray-600 hover:text-gray-900 mb-4 inline-flex items-center gap-2"
          >
            ← Retour au dashboard
          </Link>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Title Section */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-6 border-b border-gray-200">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 text-sm text-blue-700 mb-2">
                  <span>🐛</span>
                  <span>Bug #{bug.id}</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{bug.title}</h1>
                <p className="text-sm text-gray-600">
                  📅 Créé le {formatDate(bug.created_at)}
                </p>
              </div>
              <button
                onClick={deleteBug}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                title="Supprimer ce bug"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Error Log Section */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">❌</span>
                <h2 className="text-lg font-semibold text-gray-900">Logs / Description de l'erreur</h2>
              </div>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                <pre className="text-sm font-mono whitespace-pre-wrap">{bug.error_log}</pre>
              </div>
            </div>

            {/* Solution Section */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">✅</span>
                <h2 className="text-lg font-semibold text-gray-900">Solution</h2>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-gray-800 whitespace-pre-wrap">{bug.solution}</p>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex gap-3">
            <Link
              href="/dashboard"
              className="flex-1 text-center px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition"
            >
              Retour
            </Link>
            <button
              onClick={deleteBug}
              className="px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition"
            >
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}