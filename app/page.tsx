'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getSupabaseClient } from '../lib/supabase'

export default function Home() {
  const router = useRouter()
  const [checkingUser, setCheckingUser] = useState(true)
  const [isHovered, setIsHovered] = useState<string | null>(null)

  useEffect(() => {
    const checkUser = async () => {
      const supabase = getSupabaseClient()
      if (!supabase) {
        setCheckingUser(false)
        return
      }

      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) {
        console.error(error)
        setCheckingUser(false)
        return
      }

      if (user) {
        router.replace('/dashboard')
      } else {
        setCheckingUser(false)
      }
    }

    checkUser()
  }, [router])

  if (checkingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-300">
      </div>
    )
  }

  const features = [
    {
      icon: '🐛',
      title: 'Suivez vos bugs',
      description: 'Documentez et organisez tous vos bugs en un seul endroit'
    },
    {
      icon: '💡',
      title: 'Solutions sauvegardées',
      description: 'Retrouvez instantanément comment vous avez résolu un problème'
    },
    {
      icon: '🔍',
      title: 'Recherche rapide',
      description: 'Trouvez vos bugs et solutions en quelques secondes'
    }
  ]

  return (
    <div className="relative min-h-screen bg-gray-900 text-white overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6">
        <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-500 mb-6">
          BugMemo
        </h1>
        <p className="text-lg text-gray-300 text-center max-w-xl mt-8 mb-10">
          Conserver et retrouver facilement les bugs rencontrés
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/login"
            className="px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all shadow-lg"
            onMouseEnter={() => setIsHovered('login')}
            onMouseLeave={() => setIsHovered(null)}
          >
            Se connecter
          </Link>
          <Link
            href="/register"
            className="px-8 py-4 rounded-xl border-2 border-blue-600 hover:bg-blue-700 hover:text-white text-blue-400 font-semibold transition-all shadow-md"
            onMouseEnter={() => setIsHovered('register')}
            onMouseLeave={() => setIsHovered(null)}
          >
            Créer un compte
          </Link>
        </div>

        {/* Features */}
        <div className="grid sm:grid-cols-3 gap-6 mt-12 w-full max-w-5xl">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gray-800/80 backdrop-blur-sm p-6 rounded-2xl flex flex-col items-center text-center hover:bg-gray-700 transition-all"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-gray-300 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </main>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  )
}
