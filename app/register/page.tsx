'use client'

import { useState, useEffect } from 'react'
import { getSupabaseClient } from '../../lib/supabase'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error: registerError } = await supabase.auth.signUp({ email, password })
      setLoading(false)
      if (registerError) setError(registerError.message)
      else {
        alert('Compte créé ! Vérifiez votre email pour confirmer.')
        router.push('/login')
      }
    } catch (err) {
      console.error(err)
      setError('Erreur lors de l’inscription')
      setLoading(false)
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
      <form
        onSubmit={handleRegister}
        className="relative z-10 bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-700 p-8 w-80 flex flex-col gap-4"
      >
        <h2 className="text-2xl font-bold text-center mb-4">Créer un compte</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="p-2 rounded border border-gray-600 bg-gray-700 text-white placeholder-gray-400"
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="p-2 rounded border border-gray-600 bg-gray-700 text-white placeholder-gray-400"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold"
        >
          {loading ? 'Chargement...' : 'S’inscrire'}
        </button>
        <p className="text-sm text-gray-400 text-center mt-2">
          Déjà un compte ? <a href="/login" className="text-blue-400 hover:underline">Se connecter</a>
        </p>
      </form>
    </div>
  )
}
