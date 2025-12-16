'use client'

import { useState } from 'react'
import { getSupabaseClient } from '../../lib/supabase'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // ✅ Récupération du client côté client
    const supabase = getSupabaseClient()
    if (!supabase) return

    const { data, error: loginError } = await supabase.auth.signInWithPassword({ email, password })

    setLoading(false)
    if (loginError) setError(loginError.message)
    else router.push('/dashboard')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <form onSubmit={handleLogin} className="flex flex-col gap-4 p-8 bg-white dark:bg-zinc-900 rounded shadow-md w-80">
        <h2 className="text-2xl font-bold text-center text-black dark:text-white">Connexion</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="p-2 border rounded"
        />
        {error && <p className="text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          {loading ? 'Chargement...' : 'Se connecter'}
        </button>
      </form>
    </div>
  )
}
