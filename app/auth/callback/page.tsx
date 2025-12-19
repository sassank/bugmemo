'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseClient } from '../../../lib/supabase'

export default function AuthCallbackPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  const supabase = getSupabaseClient()!

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        if (sessionError) {
          console.error(sessionError)
          setError('Impossible de récupérer la session.')
          return
        }

        if (session?.user) {
          router.replace('/dashboard')
        } else {
          setError('Aucun utilisateur connecté.')
        }
      } catch (err) {
        console.error(err)
        setError('Erreur lors de la connexion.')
      }
    }

    checkSession()
  }, [router, supabase])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      {!error ? (
        <p>Connexion en cours...</p>
      ) : (
        <p className="text-red-500">{error}</p>
      )}
    </div>
  )
}
