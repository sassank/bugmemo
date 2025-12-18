'use client'

import { useState } from 'react'
import { getSupabaseClient } from '../../../lib/supabase'
import { useRouter } from 'next/navigation'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const supabase = getSupabaseClient()!

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      setLoading(false)

      if (resetError) {
        setError(resetError.message)
      } else {
        setSuccess(true)
        setEmail('')
      }
    } catch (err) {
      console.error(err)
      setError('Erreur lors de l\'envoi de l\'email')
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="relative z-10 bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-700 p-8 w-96 flex flex-col gap-4">
        <div className="text-center mb-2">
          <h2 className="text-2xl font-bold">Mot de passe oublié ?</h2>
          <p className="text-sm text-gray-400 mt-2">
            Entrez votre email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
          </p>
        </div>

        {success ? (
          <div className="flex flex-col gap-4">
            <div className="bg-green-500/10 border border-green-500 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <p className="text-green-500 font-semibold">Email envoyé !</p>
                  <p className="text-green-400 text-sm mt-1">
                    Consultez votre boîte mail et cliquez sur le lien pour réinitialiser votre mot de passe.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => router.push('/auth/login')}
              className="px-8 py-3 rounded-lg bg-gray-700 hover:bg-gray-600 font-semibold transition-colors"
            >
              Retour à la connexion
            </button>
          </div>
        ) : (
          <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="votre-email@exemple.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
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
              {loading ? 'Envoi...' : 'Envoyer le lien'}
            </button>
          </form>
        )}

        <div className="text-center">
          <a href="/auth/login" className="text-sm text-blue-400 hover:underline">
            ← Retour à la connexion
          </a>
        </div>
      </div>
    </div>
  )
}