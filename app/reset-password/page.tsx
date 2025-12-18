'use client'

import { useState, useEffect } from 'react'
import { getSupabaseClient } from '../../lib/supabase'
import { useRouter } from 'next/navigation'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [validSession, setValidSession] = useState(false)
  const [checking, setChecking] = useState(true)

  const supabase = getSupabaseClient()!

  useEffect(() => {
    // Vérifier si l'utilisateur a une session valide (vient du lien email)
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error || !session) {
          setError('Lien invalide ou expiré. Veuillez demander un nouveau lien.')
          setValidSession(false)
        } else {
          setValidSession(true)
        }
      } catch (err) {
        console.error(err)
        setError('Erreur lors de la vérification de la session')
        setValidSession(false)
      } finally {
        setChecking(false)
      }
    }

    checkSession()
  }, [])

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Validation
    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères')
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      setLoading(false)
      return
    }

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      })

      setLoading(false)

      if (updateError) {
        setError(updateError.message)
      } else {
        setSuccess(true)
        // Redirection après 2 secondes
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)
      }
    } catch (err) {
      console.error(err)
      setError('Erreur lors de la réinitialisation du mot de passe')
      setLoading(false)
    }
  }

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-300">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Vérification...</p>
        </div>
      </div>
    )
  }

  if (!validSession) {
    return (
      <div className="relative min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="relative z-10 bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-700 p-8 w-96 flex flex-col gap-4">
          <div className="text-center mb-2">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold">Lien invalide</h2>
            <p className="text-sm text-gray-400 mt-2">{error}</p>
          </div>

          <button
            onClick={() => router.push('/forgot-password')}
            className="px-8 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 font-semibold transition-colors"
          >
            Demander un nouveau lien
          </button>

          <a href="/login" className="text-sm text-center text-blue-400 hover:underline">
            Retour à la connexion
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="relative z-10 bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-700 p-8 w-96 flex flex-col gap-4">
        {success ? (
          <div className="flex flex-col gap-4 text-center">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
              <svg
                className="w-8 h-8 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold">Mot de passe modifié !</h2>
              <p className="text-sm text-gray-400 mt-2">
                Votre mot de passe a été réinitialisé avec succès.
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Redirection en cours...
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="text-center mb-2">
              <h2 className="text-2xl font-bold">Nouveau mot de passe</h2>
              <p className="text-sm text-gray-400 mt-2">
                Choisissez un nouveau mot de passe pour votre compte.
              </p>
            </div>

            <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
              <div>
                <input
                  type="password"
                  placeholder="Nouveau mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full p-3 rounded-lg border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1 ml-1">
                  Minimum 6 caractères
                </p>
              </div>

              <input
                type="password"
                placeholder="Confirmer le mot de passe"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="p-3 rounded-lg border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              {error && (
                <div className="bg-red-500/10 border border-red-500 rounded-lg p-3">
                  <p className="text-red-500 text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Modification...' : 'Réinitialiser le mot de passe'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}