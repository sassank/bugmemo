'use client'

import { useState, useEffect } from 'react'
import { getSupabaseClient } from '../../../lib/supabase'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [loadingGoogle, setLoadingGoogle] = useState(false)
  const [checkingUser, setCheckingUser] = useState(true)

  const supabase = getSupabaseClient()!

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) {
          console.error(error)
          setCheckingUser(false)
          return
        }
        if (session?.user) {
          router.replace('/dashboard')
        } else {
          setCheckingUser(false)
        }
      } catch (err) {
        console.error('Erreur lors de la vérification de la session:', err)
        setCheckingUser(false)
      }
    }

    checkUser()

    // Écoute des changements de session (connexion ailleurs)
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        router.replace('/dashboard')
      }
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (loginError) {
        setError(loginError.message)
        setLoading(false)
      } else {
        // La redirection sera gérée par onAuthStateChange
      }
    } catch (err) {
      console.error(err)
      setError('Erreur lors de la connexion')
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setLoadingGoogle(true)
    setError(null)

    try {
      const { error: googleError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      })

      if (googleError) {
        setError(googleError.message)
        setLoadingGoogle(false)
      }
      // Pas besoin de setLoading(false) ici car on sera redirigé
    } catch (err) {
      console.error('Erreur Google:', err)
      setError('Erreur lors de la connexion avec Google')
      setLoadingGoogle(false)
    }
  }

  if (checkingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-300">
        Chargement...
      </div>
    )
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="relative z-10 bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-700 p-8 w-96 flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-center mb-2">Connexion</h2>
        
        {/* Bouton Google */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loadingGoogle || loading}
          className="flex items-center justify-center gap-3 w-full px-4 py-3 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-gray-300"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          {loadingGoogle ? 'Connexion...' : 'Continuer avec Google'}
        </button>

        {/* Séparateur */}
        <div className="relative flex items-center my-2">
          <div className="flex-grow border-t border-gray-600"></div>
          <span className="flex-shrink mx-4 text-gray-400 text-sm">ou</span>
          <div className="flex-grow border-t border-gray-600"></div>
        </div>

        {/* Formulaire classique */}
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="p-3 rounded-lg border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
            disabled={loading || loadingGoogle}
            className="px-8 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        {/* Liens supplémentaires */}
        <div className="flex flex-col gap-2 text-sm text-center">
          <a href="/auth/forgot-password" className="text-blue-400 hover:underline">
            Mot de passe oublié ?
          </a>
          <p className="text-gray-400">
            Pas encore de compte ?{' '}
            <a href="/auth/register" className="text-blue-400 hover:underline">
              S'inscrire
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}