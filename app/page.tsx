'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getSupabaseClient } from '../lib/supabase'

export default function Home() {
  const router = useRouter()
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
        console.error('Erreur session:', err)
        setCheckingUser(false)
      }
    }

    checkUser()
  }, [router])

  if (checkingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-300">
        Chargement...
      </div>
    )
  }

  const features = [
    { icon: '🐛', title: 'Suivez vos bugs', description: 'Documentez et organisez tous vos bugs' },
    { icon: '💡', title: 'Solutions sauvegardées', description: 'Retrouvez instantanément vos solutions' },
    { icon: '🔍', title: 'Recherche rapide', description: 'Trouvez vos bugs en quelques secondes' }
  ]

  return (
    <div className="relative min-h-screen bg-gray-900 text-white overflow-hidden">
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500 mb-6">
          BugMemo
        </h1>

        <p className="text-lg text-gray-300 text-center max-w-xl mt-6 mb-10">
          Conserver et retrouver facilement les bugs rencontrés
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/login"
            className="px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold"
          >
            Se connecter
          </Link>

          <Link
            href="/register"
            className="px-8 py-4 rounded-xl border-2 border-blue-600 text-blue-400 hover:bg-blue-700 hover:text-white font-semibold"
          >
            Créer un compte
          </Link>
        </div>

        <div className="grid sm:grid-cols-3 gap-6 mt-12 w-full max-w-5xl">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gray-800/80 p-6 rounded-2xl text-center"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-300 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
